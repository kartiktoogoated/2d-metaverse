/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

const Arena = () => {
  const canvasRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [users, setUsers] = useState(new Map());
  const [params, setParams] = useState({ token: "", spaceId: "" });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || "";
    const spaceId = urlParams.get("spaceId") || "";

    if (!token || !spaceId) {
      console.error("Missing token or spaceId in URL parameters.");
      return;
    }

    setParams({ token, spaceId });

    wsRef.current = new WebSocket(`ws://localhost:3001?token=${token}&spaceId=${spaceId}`);

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
      wsRef.current?.send(
        JSON.stringify({
          type: "join",
          payload: { spaceId, token },
        })
      );
    };

    wsRef.current.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("Received WebSocket message:", message);
      await handleWebSocketMessage(message);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const handleWebSocketMessage = async (message: any) => {
    switch (message.type) {
      case "space-joined":
        console.log("Joined space:", message.payload);
        setCurrentUser({
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          userId: message.payload.userId,
        });

        setUsers((prev) => {
          const userMap = new Map(prev);
          message.payload.users.forEach((user: any) => {
            userMap.set(user.userId, user);
          });
          return userMap;
        });
        break;

      case "webrtc-offer":
        console.log("Received WebRTC Offer");
        await handleOffer(message);
        break;

      case "webrtc-answer":
        console.log("Received WebRTC Answer");
        await handleAnswer(message);
        break;

      case "webrtc-ice-candidate":
        console.log("Received ICE Candidate");
        await handleIceCandidate(message);
        break;

      default:
        console.error("Unknown message type:", message.type);
    }
  };

  const ensurePeerConnection = async () => {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerConnectionRef.current.onicecandidate = (event: any) => {
        if (event.candidate && wsRef.current) {
          wsRef.current.send(
            JSON.stringify({
              type: "webrtc-ice-candidate",
              from: currentUser.userId,
              to: Array.from(users.keys())[0], // Send to first available user
              candidate: event.candidate,
            })
          );
        }
      };

      peerConnectionRef.current.ontrack = (event: any) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => peerConnectionRef.current?.addTrack(track, stream));
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    }
  };

  const startCall = async () => {
    await ensurePeerConnection();

    if (peerConnectionRef.current) {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      wsRef.current?.send(
        JSON.stringify({
          type: "webrtc-offer",
          from: currentUser.userId,
          to: Array.from(users.keys())[0], // Send to first available user
          offer,
        })
      );
    }
  };

  const handleOffer = async (message: any) => {
    await ensurePeerConnection();

    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      wsRef.current?.send(
        JSON.stringify({
          type: "webrtc-answer",
          from: currentUser.userId,
          to: message.from,
          answer,
        })
      );
    }
  };

  const handleAnswer = async (message: any) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.answer));
    }
  };

  const handleIceCandidate = async (message: any) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Arena</h1>
      <canvas ref={canvasRef} width={1000} height={1000} className="bg-white outline-none" />
      <div className="mt-4 flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline className="w-48 h-32 bg-black" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-48 h-32 bg-black" />
      </div>
      <button
        onClick={startCall}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
      >
        Start Call
      </button>
      <p className="mt-2 text-sm text-gray-500">Use arrow keys to move your avatar</p>
    </div>
  );
};

export default Arena;
