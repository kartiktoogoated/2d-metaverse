// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";

// const socket = io("ws://localhost:3001");

// const VideoCall = ({ userId, spaceId }: { userId: string; spaceId: string }) => {
//   const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
//   const localVideoRef = useRef<HTMLVideoElement | null>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

//   useEffect(() => {
//     socket.on("webrtc-initiate", ({ targetId }) => {
//       startCall(targetId);
//     });

//     socket.on("webrtc-offer", async ({ targetId, offer }) => {
//       if (!peerConnection) return;

//       await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);

//       socket.emit("webrtc-answer", { targetId, answer });
//     });

//     socket.on("webrtc-answer", async ({ answer }) => {
//       if (peerConnection) {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//       }
//     });

//     socket.on("webrtc-ice-candidate", async ({ candidate }) => {
//       if (peerConnection) {
//         await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//       }
//     });

//     return () => {
//       socket.off("webrtc-initiate");
//       socket.off("webrtc-offer");
//       socket.off("webrtc-answer");
//       socket.off("webrtc-ice-candidate");
//     };
//   }, [peerConnection]);

//   const startCall = async (targetId: string) => {
//     const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

//     setPeerConnection(peer);

//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     stream.getTracks().forEach((track) => peer.addTrack(track, stream));

//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = stream;
//     }

//     peer.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     peer.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("webrtc-ice-candidate", { targetId, candidate: event.candidate });
//       }
//     };

//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);
//     socket.emit("webrtc-offer", { targetId, offer });
//   };

//   return (
//     <div>
//       <h2>Video Call</h2>
//       <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "300px", border: "2px solid black" }} />
//       <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "300px", border: "2px solid red" }} />
//     </div>
//   );
// };

// export default VideoCall;
