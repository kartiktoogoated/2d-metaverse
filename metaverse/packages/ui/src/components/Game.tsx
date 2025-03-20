/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import {
  Room,
  RoomEvent,
  RemoteTrack,
  Track,
  VideoPresets,
} from 'livekit-client';

// Use Vite environment variables (ensure they are prefixed with VITE_)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!;
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL!;

const Game = () => {
  // Refs for canvas and WebSocket
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Refs for video elements (LiveKit will attach tracks)
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Game state
  const [currentUser, setCurrentUser] = useState<any>({});
  const [users, setUsers] = useState(new Map());
  const [params, setParams] = useState({ spaceId: '' });
  const [isConnected, setIsConnected] = useState(false);

  // LiveKit state
  const [videoRoom, setVideoRoom] = useState<Room | null>(null);
  const [livekitToken, setLivekitToken] = useState('');

  // Helper: send message via WebSocket
  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not open. Message not sent:", message);
    }
  };

  // --- Game Signaling & WebSocket Setup ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spaceId = urlParams.get('spaceId') || '';
    setParams({ spaceId });

    if (!spaceId) {
      alert("Missing spaceId in query parameters!");
      return;
    }

    // Connect to your game WebSocket server
    const ws = new WebSocket('ws://18.215.159.145:3001');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Game WebSocket connection opened.");
      setIsConnected(true);
      sendMessage({
        type: 'join',
        payload: { spaceId },
      });
    };

    ws.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    ws.onerror = (error) => console.error("Game WebSocket error:", error);
    ws.onclose = () => {
      console.log("Game WebSocket connection closed.");
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  // --- Fetch LiveKit Token from Backend ---
  useEffect(() => {
    async function fetchToken() {
      if (!params.spaceId) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/livekit-token?spaceId=${params.spaceId}`,
          { credentials: 'include' }
        );
        const data = await res.json();
        if (data.token) {
          setLivekitToken(data.token);
        } else {
          console.error("No token returned from backend");
        }
      } catch (error) {
        console.error("Error fetching LiveKit token:", error);
      }
    }
    fetchToken();
  }, [params.spaceId]);

  // --- LiveKit Video Chat Integration ---
  useEffect(() => {
    async function joinVideoRoom() {
      if (!livekitToken) return;

      // Create a new LiveKit Room instance with your options.
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: { resolution: VideoPresets.h720.resolution },
      });

      // Prepare the connection using your LIVEKIT_URL and token.
      room.prepareConnection(LIVEKIT_URL, livekitToken);

      // Set up LiveKit event listeners.
      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
        if ((track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) && remoteVideoRef.current) {
          const element = track.attach();
          remoteVideoRef.current.srcObject = (element as HTMLVideoElement).srcObject;
        }
      });
      room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
        track.detach();
      });
      room.on(RoomEvent.Disconnected, () => {
        console.log("Video chat disconnected");
      });

      try {
        await room.connect(LIVEKIT_URL, livekitToken);
        console.log("Connected to video room:", room.name);
        setVideoRoom(room);

        // Publish local camera and mic tracks.
        await room.localParticipant.enableCameraAndMicrophone();
        const cameraPub = room.localParticipant.getTrackPublication(Track.Source.Camera);
        if (cameraPub && cameraPub.track && localVideoRef.current) {
          const element = cameraPub.track.attach();
          localVideoRef.current.srcObject = (element as HTMLVideoElement).srcObject;
        }
      } catch (error) {
        console.error("Error joining video room:", error);
      }
    }
    joinVideoRoom();

    return () => {
      if (videoRoom) {
        videoRoom.disconnect();
      }
    };
  }, [livekitToken]);

  // --- Game WebSocket Message Handling ---
  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'space-joined': {
        setCurrentUser({
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          userId: message.payload.userId,
          username: message.payload.username,
        });
        const userMap = new Map();
        message.payload.users.forEach((user: any) => {
          if (!user.userId || user.userId === "undefined") return;
          if (user.userId !== message.payload.userId) {
            userMap.set(user.userId, user);
          }
        });
        setUsers(userMap);
        break;
      }
      case 'user-joined': {
        if (message.payload.userId === currentUser.userId) {
          console.log("Ignoring 'user-joined' for the current user.");
          return;
        }
        if (!message.payload.userId || message.payload.userId === "undefined") {
          console.log("Skipping 'user-joined' with invalid userId:", message.payload);
          return;
        }
        alert(`${message.payload.username || "A user"} joined the space!`);
        setUsers(prev => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, message.payload);
          return newUsers;
        });
        break;
      }
      case 'movement': {
        if (!message.payload.userId || message.payload.userId === "undefined") {
          console.log("Skipping 'movement' with invalid userId:", message.payload);
          return;
        }
        setUsers(prev => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, message.payload);
          return newUsers;
        });
        break;
      }
      case 'movement-rejected': {
        setCurrentUser((prev: any) => ({ ...prev, x: message.payload.x, y: message.payload.y }));
        break;
      }
      case 'user-left': {
        alert(`${message.payload.username || "A user"} left the space!`);
        setUsers(prev => {
          const newUsers = new Map(prev);
          newUsers.delete(message.payload.userId);
          return newUsers;
        });
        break;
      }
      default:
        console.warn("Unknown message type:", message);
    }
  };

  // --- Canvas Drawing for the Arena ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#eee';
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw current user
    if (currentUser && currentUser.x !== undefined) {
      ctx.beginPath();
      ctx.fillStyle = '#FF6B6B';
      ctx.arc(currentUser.x * 50, currentUser.y * 50, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      const myName = currentUser.username || "You";
      ctx.fillText(myName, currentUser.x * 50, currentUser.y * 50 + 40);
    }

    // Draw other users
    users.forEach((user) => {
      if (user.x === undefined) return;
      ctx.beginPath();
      ctx.fillStyle = '#4ECDC4';
      ctx.arc(user.x * 50, user.y * 50, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      const userLabel = user.username || `User ${user.userId}`;
      ctx.fillText(userLabel, user.x * 50, user.y * 50 + 40);
    });
  }, [currentUser, users]);

  // --- Movement Handler (using arrow keys) ---
  const handleMove = (newX: number, newY: number) => {
    if (!currentUser || !isConnected) return;
    sendMessage({
      type: 'move',
      payload: { x: newX, y: newY, userId: currentUser.userId },
    });
  };

  const handleKeyDown = (e: any) => {
    if (!currentUser || !isConnected) return;
    const { x, y } = currentUser;
    switch (e.key) {
      case 'ArrowUp': handleMove(x, y - 1); break;
      case 'ArrowDown': handleMove(x, y + 1); break;
      case 'ArrowLeft': handleMove(x - 1, y); break;
      case 'ArrowRight': handleMove(x + 1, y); break;
      default: break;
    }
  };

  return (
    <div className="p-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1 className="text-2xl font-bold mb-4">Arena with Video Chat</h1>
      <p className="text-sm text-gray-600">Space ID: {params.spaceId}</p>
      <p className="text-sm text-gray-600">
        Connected Users: {users.size + (currentUser ? 1 : 0)}
      </p>
      <div className="border rounded-lg overflow-hidden">
        <canvas ref={canvasRef} width={800} height={600} className="bg-white" />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Use arrow keys to move your avatar
      </p>
      <div className="mt-4 flex gap-4">
        <div>
          <h2 className="text-lg font-semibold">Local Video</h2>
          <video ref={localVideoRef} autoPlay muted style={{ width: '200px', border: '1px solid #ccc' }} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Remote Video</h2>
          <video ref={remoteVideoRef} autoPlay style={{ width: '200px', border: '1px solid #ccc' }} />
        </div>
      </div>
    </div>
  );
};

export default Game;
