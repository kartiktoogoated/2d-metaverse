import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "./useWebsocketHook";  // Assuming you have a custom WebSocket hook

const WebRTC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [peerId, setPeerId] = useState<string>("");
  const { sendMessage, setOnMessage, isConnected } = useWebSocket();
  const iceCandidateBuffer = useRef<RTCIceCandidateInit[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const createPeerConnection = () => {
      if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== "closed") {
        console.warn("⚠️ Reusing existing RTCPeerConnection...");
        return peerConnectionRef.current;
      }

      console.log("🛠 Creating new RTCPeerConnection...");
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerConnectionRef.current = peerConnection;

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && peerId) {
          console.log(`📨 Sending ICE Candidate to peer: ${peerId}`);
          sendMessage({ type: "ice-candidate", candidate: event.candidate, to: peerId });
        }
      };

      peerConnection.ontrack = (event) => {
        console.log("📡 Receiving remote track...");

        if (!remoteVideoRef.current) {
          console.warn("⚠️ remoteVideoRef is null, cannot assign remote stream.");
          return;
        }

        let remoteStream = remoteVideoRef.current.srcObject as MediaStream;
        if (!remoteStream) {
          remoteStream = new MediaStream();
          remoteVideoRef.current.srcObject = remoteStream;
          console.log("🎥 Created new MediaStream for remote video.");
        }

        // Avoid adding duplicate tracks
        event.streams[0]?.getTracks().forEach((track) => {
          const existingTrack = remoteStream.getTracks().find((t) => t.kind === track.kind);

          if (!existingTrack) {
            console.log("🎥 Adding track to remote stream:", track.kind);
            remoteStream.addTrack(track);
          } else {
            console.warn(`⚠️ Duplicate track detected for kind: ${track.kind}, skipping.`);
          }
        });

        console.log("✅ Remote stream updated.");
      };

      return peerConnection;
    };

    setOnMessage(async (message) => {
      console.log("📩 Received WebRTC message:", message);

      if (message.from && !myId) {
        setMyId(message.from);
        console.log("🔗 Registered my ID:", message.from);
      }

      if (message.type === "offer" && message.from !== myId) {
        console.log(`📩 Received Offer from: ${message.from}`);
        setPeerId(message.from);

        let peerConnection = peerConnectionRef.current;

        if (!peerConnection || peerConnection.signalingState === "closed") {
          console.warn("⚠️ PeerConnection is closed or not initialized, creating a new one...");
          peerConnectionRef.current = createPeerConnection();
          peerConnection = peerConnectionRef.current;
        }

        if (!peerConnection) {
          console.error("❌ PeerConnection is unexpectedly null after creation.");
          return;
        }

        try {
          // Check if we already have media stream to avoid requesting camera multiple times
          if (!mediaStreamRef.current) {
            console.log("🎥 Requesting access to camera and microphone...");
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            mediaStreamRef.current = stream;

            if (localVideoRef.current && !localVideoRef.current.srcObject) {
              localVideoRef.current.srcObject = stream;
            }

            console.log("➕ Adding local tracks to peer connection...");
            stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
          }

          console.log("🔗 Setting remote description...");
          await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));

          console.log("📝 Creating answer...");
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          console.log(`📨 Sending answer to peer: ${message.from}`);
          sendMessage({ type: "answer", answer, to: message.from });
        } catch (error) {
          console.error("❌ Error handling offer:", error);
        }
      }

      if (message.type === "answer" && message.from !== myId) {
        console.log(`📩 Received Answer from: ${message.from}`);
        setPeerId(message.from);

        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.answer));
        }
      }

      if (message.type === "ice-candidate" && message.from !== myId) {
        console.log(`📩 Received ICE Candidate from: ${message.from}`);

        if (peerConnectionRef.current?.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));
        } else {
          console.warn("⚠️ Remote description not set yet, buffering ICE candidate.");
          iceCandidateBuffer.current.push(message.candidate);
        }
      }
    });

    return () => {
      if (peerConnectionRef.current) {
        if (peerConnectionRef.current.signalingState !== "closed" && peerConnectionRef.current.signalingState !== "stable") {
          console.log("🔄 Cleaning up peer connection...");
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        } else {
          console.log("⚠️ Skipping cleanup, PeerConnection is in a stable state.");
        }
      }
    };
  }, [myId, isConnected, setOnMessage, peerId, sendMessage]);

  const startCall = async () => {
    if (!peerId || peerId === myId) {
      alert("Enter a valid Peer ID before starting a call!");
      return;
    }

    console.log(`📡 Starting call with Peer ID: ${peerId}`);

    if (peerConnectionRef.current) {
      console.warn("⚠️ Closing existing RTCPeerConnection before creating a new one...");
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    console.log("🛠 Creating new RTCPeerConnection...");
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const peerConnection = peerConnectionRef.current;

    console.log("🎥 Requesting access to camera and microphone...");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    if (localVideoRef.current && !localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject = stream;
    }

    console.log("➕ Adding local tracks to peer connection...");
    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

    // 🔄 Remove old tracks before adding new ones
    peerConnection.getSenders().forEach((sender) => peerConnection.removeTrack(sender));

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    console.log("➕ Adding local tracks to peer connection...");

    if (!peerConnection || peerConnection.signalingState === "closed") {
      console.warn("⚠️ Cannot add track. PeerConnection is closed.");
      return;
    }

    stream.getTracks().forEach((track) => {
      console.log("🎥 Adding track:", track.kind);
      peerConnection.addTrack(track, stream);
    });

    if (peerConnection.signalingState !== "stable") {
      console.warn("⚠️ Peer connection not stable. Aborting offer creation...");
      return;
    }

    console.log("📝 Creating WebRTC offer...");
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log(`📨 Sending offer to peer: ${peerId}`);
    sendMessage({ type: "offer", offer, to: peerId });
  };

  return (
    <div>
      <h1>WebRTC Video Call</h1>
      <p>Your ID: <strong>{myId || "Loading..."}</strong></p>
      <input
        type="text"
        placeholder="Enter the other user's Peer ID"
        value={peerId}
        onChange={(e) => setPeerId(e.target.value)}
      />
      <button onClick={startCall} disabled={!isConnected}>
        {isConnected ? "Start Call" : "Connecting..."}
      </button>
      <div>
        <h3>Local Video</h3>
        <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "300px" }} />
        <h3>Remote Video</h3>
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "300px" }} />
      </div>
    </div>
  );
};

export default WebRTC;
