import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Peer from 'peerjs';

export default function Room() {
  const { roomId } = useParams();
  const videoGridRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<any>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const peers: Record<string, Peer.MediaConnection> = {};

  useEffect(() => {
    if (!roomId) return;

    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    const newPeer = new Peer({
      host: 'localhost',
      port: 3001,
      path: '/peerjs',
    });

    setPeer(newPeer);

    // Get User Media (Camera & Mic)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((userStream) => {
      setStream(userStream);

      // Add Own Video to Grid (only once)
      if (!document.getElementById('my-video')) {
        const myVideo = createVideoElement(true, "my-video");
        addVideoStream(myVideo, userStream);
      }

      newPeer.on('open', (id) => {
        console.log("✅ PeerJS connected, ID:", id);
        newSocket.emit('join-room', roomId, id);
      });

      // Connect to all users in the room
      newSocket.on('user-connected', (userId: string) => {
        console.log(`📌 User connected: ${userId}`);
        setTimeout(() => connectToNewUser(userId, userStream, newPeer), 1000);
      });

      // Answer Incoming Calls
      newPeer.on('call', (call) => {
        console.log("📞 Incoming call...");
        call.answer(userStream);
        const video = createVideoElement();
        call.on('stream', (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });

      // Handle Disconnection
      newSocket.on('user-disconnected', (userId: string) => {
        console.log(`❌ User disconnected: ${userId}`);
        if (peers[userId]) peers[userId].close();
      });
    });

    return () => {
      newSocket.disconnect();
      newPeer.disconnect();
    };
  }, [roomId]);

  function connectToNewUser(userId: string, stream: MediaStream, peer: Peer) {
    console.log(`📞 Calling ${userId}...`);
    if (!peers[userId]) {
      const call = peer.call(userId, stream);
      const video = createVideoElement();
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
      peers[userId] = call;
    }
  }

  function createVideoElement(muted: boolean = false, id: string = ""): HTMLVideoElement {
    const video = document.createElement('video');
    video.muted = muted;
    if (id) video.id = id;
    return video;
  }

  function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
    if (!video.srcObject) {
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
      videoGridRef.current?.append(video);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold">Room: {roomId}</h1>
      <div ref={videoGridRef} className="grid grid-cols-3 gap-2 mt-4"></div>
    </div>
  );
}
