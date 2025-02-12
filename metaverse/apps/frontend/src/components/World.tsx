// import React, { useEffect, useRef } from 'react';
// import { Avatar } from './Avatar';
// import { useGameStore } from '../store/gameStore';
// import SimplePeer from 'simple-peer';

// // Polyfill for process.nextTick
// if (!window.process) {
//   window.process = { env: {}, nextTick: (fn: Function) => setTimeout(fn, 0) };
// }

// export const World: React.FC = () => {
//   const worldRef = useRef<HTMLDivElement>(null);
//   const { avatars, currentUser, moveAvatar, setActiveCall, addCallParticipant, setAvatarInCall } = useGameStore();

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!worldRef.current || !currentUser) return;

//       const rect = worldRef.current.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       moveAvatar(currentUser.id, { x, y });

//       // Check if user is in a call zone
//       const callZones = document.querySelectorAll('.call-zone');
//       let inCallZone = false;

//       callZones.forEach((zone) => {
//         const zoneRect = zone.getBoundingClientRect();
//         if (
//           x >= zoneRect.left &&
//           x <= zoneRect.right &&
//           y >= zoneRect.top &&
//           y <= zoneRect.bottom
//         ) {
//           inCallZone = true;
//         }
//       });

//       if (inCallZone && !currentUser.inCall) {
//         initializeCall();
//       }
//     };

//     const world = worldRef.current;
//     if (world) {
//       world.addEventListener('mousemove', handleMouseMove);
//     }

//     return () => {
//       if (world) {
//         world.removeEventListener('mousemove', handleMouseMove);
//       }
//     };
//   }, [currentUser, moveAvatar]);

//   const initializeCall = async () => {
//     try {
//       // First try with both video and audio
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             width: { ideal: 640 },
//             height: { ideal: 480 },
//             facingMode: "user"
//           },
//           audio: true
//         });
//         setupPeerConnection(stream);
//       } catch (err) {
//         console.warn('Failed to get video, trying audio only:', err);
//         // Fallback to audio only
//         const audioStream = await navigator.mediaDevices.getUserMedia({
//           video: false,
//           audio: true
//         });
//         setupPeerConnection(audioStream);
//       }
//     } catch (err) {
//       console.error('Failed to access any media devices:', err);
//       // Notify user about the error
//       alert('Could not access camera or microphone. Please check your permissions and try again.');
//     }
//   };

//   const setupPeerConnection = (stream: MediaStream) => {
//     if (!currentUser) return;

//     const peer = new SimplePeer({
//       initiator: true,
//       trickle: false,
//       stream,
//       config: {
//         iceServers: [
//           { urls: 'stun:stun.l.google.com:19302' },
//           { urls: 'stun:global.stun.twilio.com:3478' }
//         ]
//       }
//     });

//     setActiveCall({ peerId: currentUser.id, stream });
//     addCallParticipant(currentUser.id);
//     setAvatarInCall(currentUser.id, true);

//     // Handle peer events
//     peer.on('error', (err) => {
//       console.error('Peer connection error:', err);
//       alert('Connection error. Please try again.');
//     });

//     peer.on('close', () => {
//       stream.getTracks().forEach(track => track.stop());
//       if (currentUser) {
//         setAvatarInCall(currentUser.id, false);
//         setActiveCall(null);
//       }
//     });
//   };

//   return (
//     <div
//       ref={worldRef}
//       className="relative w-full h-screen bg-gradient-to-br from-purple-950 to-indigo-950 overflow-hidden"
//     >
//       {/* Grid Pattern */}
//       <div className="absolute inset-0 bg-grid-pattern opacity-10" />

//       {/* Call Zones */}
//       <div className="call-zone absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm animate-pulse" />
//       <div className="call-zone absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-sm animate-pulse" />

//       {/* Ambient Particles */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent animate-pulse" />

//       {/* Avatars */}
//       {Array.from(avatars.values()).map((avatar) => (
//         <Avatar
//           key={avatar.id}
//           avatar={avatar}
//           isCurrentUser={avatar.id === currentUser?.id}
//         />
//       ))}
//     </div>
//   );
// };