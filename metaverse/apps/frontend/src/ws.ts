// import { io } from 'socket.io-client';
// import Peer from 'peerjs';

// const socket = io('/');
// const videoGrid = document.getElementById('video-grid') as HTMLDivElement;
// const myPeer = new Peer(undefined, {
//   host: '/',
//   port: '3001',
// });

// const myVideo = document.createElement('video');
// myVideo.muted = true;
// const peers: Record<string, Peer.MediaConnection> = {};

// navigator.mediaDevices
//   .getUserMedia({
//     video: true,
//     audio: true,
//   })
//   .then((stream) => {
//     addVideoStream(myVideo, stream);

//     myPeer.on('call', (call) => {
//       call.answer(stream);
//       const video = document.createElement('video');
//       call.on('stream', (userVideoStream) => {
//         addVideoStream(video, userVideoStream);
//       });
//     });

//     socket.on('user-connected', (userId: string) => {
//       connectToNewUser(userId, stream);
//     });
//   });

// socket.on('user-disconnected', (userId: string) => {
//   if (peers[userId]) peers[userId].close();
// });

// myPeer.on('open', (id) => {
//   socket.emit('join-room', ROOM_ID, id);
// });

// function connectToNewUser(userId: string, stream: MediaStream) {
//   const call = myPeer.call(userId, stream);
//   const video = document.createElement('video');
//   call.on('stream', (userVideoStream) => {
//     addVideoStream(video, userVideoStream);
//   });
//   call.on('close', () => {
//     video.remove();
//   });

//   peers[userId] = call;
// }

// function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
//   video.srcObject = stream;
//   video.addEventListener('loadedmetadata', () => {
//     video.play();
//   });
//   videoGrid.append(video);
// }
