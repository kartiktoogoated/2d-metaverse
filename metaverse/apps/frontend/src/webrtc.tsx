// import { useEffect, useState, useRef } from "react";
// import { io, Socket } from "socket.io-client";

// const socket: Socket = io("ws://localhost:4000"); // WebSocket signaling server

// interface WebRTCProps {
//   spaceId: string;
//   userId: string;
// }

// const WebRTCComponent: React.FC<WebRTCProps> = ({ spaceId, userId }) => {
//   const [peers, setPeers] = useState<{ [key: string]: MediaStream }>({});
//   const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
//   const localVideoRef = useRef<HTMLVideoElement | null>(null);
//   const localStream = useRef<MediaStream | null>(null);
//   const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});

//   useEffect(() => {
//     const initWebRTC = async () => {
//       try {
//         localStream.current = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });

//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = localStream.current;
//         }

//         socket.emit("join-room", { spaceId, userId });

//         socket.on("user-joined", async ({ userId: remoteUserId }) => {
//           createPeerConnection(remoteUserId);
//         });

//         socket.on("signal", async ({ sender, signal }) => {
//           if (signal.type === "offer") {
//             await handleOffer(sender, signal);
//           } else if (signal.type === "answer") {
//             await handleAnswer(sender, signal);
//           } else if (signal.candidate) {
//             handleICECandidate(sender, signal);
//           }
//         });

//         socket.on("user-left", ({ userId: remoteUserId }) => {
//           if (peerConnections.current[remoteUserId]) {
//             peerConnections.current[remoteUserId].close();
//             delete peerConnections.current[remoteUserId];
//           }
//           setPeers((prev) => {
//             const newPeers = { ...prev };
//             delete newPeers[remoteUserId];
//             return newPeers;
//           });
//         });
//       } catch (error) {
//         console.error("Error initializing WebRTC:", error);
//       }
//     };

//     initWebRTC();

//     return () => {
//       socket.emit("leave-room", { spaceId, userId });
//       Object.values(peerConnections.current).forEach((pc) => pc.close());
//     };
//   }, [spaceId, userId]);

//   const createPeerConnection = (remoteUserId: string) => {
//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     peerConnections.current[remoteUserId] = peer;

//     localStream.current?.getTracks().forEach((track) => {
//       peer.addTrack(track, localStream.current!);
//     });

//     peer.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("signal", {
//           receiver: remoteUserId,
//           sender: userId,
//           signal: event.candidate,
//         });
//       }
//     };

//     peer.ontrack = (event) => {
//       setPeers((prev) => ({
//         ...prev,
//         [remoteUserId]: event.streams[0],
//       }));
//     };

//     peer.createOffer().then((offer) => {
//       peer.setLocalDescription(offer);
//       socket.emit("signal", {
//         receiver: remoteUserId,
//         sender: userId,
//         signal: offer,
//       });
//     });
//   };

//   const handleOffer = async (sender: string, offer: RTCSessionDescriptionInit) => {
//     const peer = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     peerConnections.current[sender] = peer;

//     localStream.current?.getTracks().forEach((track) => {
//       peer.addTrack(track, localStream.current!);
//     });

//     peer.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("signal", {
//           receiver: sender,
//           sender: userId,
//           signal: event.candidate,
//         });
//       }
//     };

//     peer.ontrack = (event) => {
//       setPeers((prev) => ({
//         ...prev,
//         [sender]: event.streams[0],
//       }));
//     };

//     await peer.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);

//     socket.emit("signal", {
//       receiver: sender,
//       sender: userId,
//       signal: answer,
//     });
//   };

//   const handleAnswer = async (sender: string, answer: RTCSessionDescriptionInit) => {
//     const peer = peerConnections.current[sender];
//     if (peer) {
//       await peer.setRemoteDescription(new RTCSessionDescription(answer));
//     }
//   };

//   const handleICECandidate = (sender: string, candidate: RTCIceCandidateInit) => {
//     const peer = peerConnections.current[sender];
//     if (peer) {
//       peer.addIceCandidate(new RTCIceCandidate(candidate));
//     }
//   };

//   return (
//     <div>
//       <h2>Video Chat in Space {spaceId}</h2>
//       <video ref={localVideoRef} autoPlay muted />
//       {Object.entries(peers).map(([id, stream]) => (
//         <video
//           key={id}
//           ref={(ref) => (videoRefs.current[id] = ref)}
//           srcObject={stream}
//           autoPlay
//         />
//       ))}
//     </div>
//   );
// };

// export default WebRTCComponent;
