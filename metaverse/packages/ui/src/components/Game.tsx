/* eslint-disable @typescript-eslint/no-unused-vars */
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
import Avatar from './Avatar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!;
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL!;

const TILE_SIZE = 50; // Grid cell size in pixels

const Game = () => {
  // Refs for canvas and WebSocket
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  // Refs for video elements (LiveKit will attach tracks)
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Game state
  // currentUser holds grid state (x and y in cells)
  const [currentUser, setCurrentUser] = useState<any>(null);
  // pixelPos holds the continuous pixel coordinates for smooth movement
  const [pixelPos, setPixelPos] = useState({ x: 0, y: 0 });
  const [users, setUsers] = useState(new Map());
  const [params, setParams] = useState({ spaceId: '' });
  const [isConnected, setIsConnected] = useState(false);

  // Keys state to drive continuous movement
  const [keysPressed, setKeysPressed] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

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

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: { resolution: VideoPresets.h720.resolution },
      });

      room.prepareConnection(LIVEKIT_URL, livekitToken);

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
        const user = {
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          userId: message.payload.userId,
          username: message.payload.username,
        };
        setCurrentUser(user);
        // Set initial pixel position based on grid cell
        setPixelPos({ x: user.x * TILE_SIZE, y: user.y * TILE_SIZE });
        const userMap = new Map();
        message.payload.users.forEach((u: any) => {
          if (!u.userId || u.userId === "undefined") return;
          if (u.userId !== message.payload.userId) {
            userMap.set(u.userId, u);
          }
        });
        setUsers(userMap);
        break;
      }
      case 'user-joined': {
        if (message.payload.userId === currentUser?.userId) return;
        if (!message.payload.userId || message.payload.userId === "undefined") return;
        alert(`${message.payload.username || "A user"} joined the space!`);
        setUsers(prev => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, message.payload);
          return newUsers;
        });
        break;
      }
      case 'movement': {
        if (!message.payload.userId || message.payload.userId === "undefined") return;
        setUsers(prev => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, message.payload);
          return newUsers;
        });
        break;
      }
      case 'movement-rejected': {
        // On rejection, snap the current user to the valid grid cell.
        setCurrentUser((prev: any) => ({ ...prev, x: message.payload.x, y: message.payload.y }));
        setPixelPos({ x: message.payload.x * TILE_SIZE, y: message.payload.y * TILE_SIZE });
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
    ctx.strokeStyle = '#eee';
    for (let i = 0; i < canvas.width; i += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
  }, [currentUser, users]);

  // --- Key Event Listeners for Continuous Movement ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentUser || !isConnected) return;
      setKeysPressed(prev => ({
        ...prev,
        up: e.key === 'ArrowUp' ? true : prev.up,
        down: e.key === 'ArrowDown' ? true : prev.down,
        left: e.key === 'ArrowLeft' ? true : prev.left,
        right: e.key === 'ArrowRight' ? true : prev.right,
      }));
      if (e.key === 'ArrowLeft') setDirection("left");
      if (e.key === 'ArrowRight') setDirection("right");
      setIsMoving(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => ({
        ...prev,
        up: e.key === 'ArrowUp' ? false : prev.up,
        down: e.key === 'ArrowDown' ? false : prev.down,
        left: e.key === 'ArrowLeft' ? false : prev.left,
        right: e.key === 'ArrowRight' ? false : prev.right,
      }));
      // If no keys are pressed, stop moving.
      setIsMoving(_prev => {
        const anyKey = Object.values({
          ...keysPressed,
          [e.key === 'ArrowUp' ? 'up' : '']: e.key === 'ArrowUp' ? false : keysPressed.up,
          [e.key === 'ArrowDown' ? 'down' : '']: e.key === 'ArrowDown' ? false : keysPressed.down,
          [e.key === 'ArrowLeft' ? 'left' : '']: e.key === 'ArrowLeft' ? false : keysPressed.left,
          [e.key === 'ArrowRight' ? 'right' : '']: e.key === 'ArrowRight' ? false : keysPressed.right,
        }).some(val => val);
        return anyKey;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentUser, isConnected, keysPressed]);

  // --- Game Loop for Continuous Movement ---
  useEffect(() => {
    if (!currentUser) return;
    let lastTime = performance.now();
    const speed = 150; // pixels per second; adjust as needed

    const update = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setPixelPos(prev => {
        let newX = prev.x;
        let newY = prev.y;
        if (keysPressed.left) newX -= speed * delta;
        if (keysPressed.right) newX += speed * delta;
        if (keysPressed.up) newY -= speed * delta;
        if (keysPressed.down) newY += speed * delta;

        // Calculate new grid cell based on pixel position
        const gridX = Math.floor(newX / TILE_SIZE);
        const gridY = Math.floor(newY / TILE_SIZE);
        if (gridX !== currentUser.x || gridY !== currentUser.y) {
          setCurrentUser((prevUser: any) => ({ ...prevUser, x: gridX, y: gridY }));
          sendMessage({
            type: 'move',
            payload: { x: gridX, y: gridY, userId: currentUser.userId },
          });
        }
        return { x: newX, y: newY };
      });
      requestAnimationFrame(update);
    };
    const animFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrame);
  }, [keysPressed, currentUser]);

  return (
    <div className="p-4" tabIndex={0}>
      <h1 className="text-2xl font-bold mb-4">Arena with Video Chat</h1>
      <p className="text-sm text-gray-600">Space ID: {params.spaceId}</p>
      <p className="text-sm text-gray-600">
        Connected Users: {users.size + (currentUser ? 1 : 0)}
      </p>

      <div
        style={{ position: "relative", width: "800px", height: "600px" }}
        className="border rounded-lg overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="bg-white"
        />

        {/* Overlay Avatars */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {/* Current user's avatar uses pixelPos (already in pixels) */}
          {currentUser && (
            <Avatar
              x={pixelPos.x}
              y={pixelPos.y}
              isMoving={isMoving}
              direction={direction}
            />
          )}

          {/* Other users remain grid based */}
          {Array.from(users.values()).map((user: any) => (
            <Avatar
              key={user.userId}
              x={user.x * TILE_SIZE}
              y={user.y * TILE_SIZE}
              isMoving={false}
              direction="right"
            />
          ))}
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Use arrow keys to move your avatar
      </p>

      <div className="mt-4 flex gap-4">
        <div>
          <h2 className="text-lg font-semibold">Local Video</h2>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            style={{ width: '200px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Remote Video</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            style={{ width: '200px', border: '1px solid #ccc' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
