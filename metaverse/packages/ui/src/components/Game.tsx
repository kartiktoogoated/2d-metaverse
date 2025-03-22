/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Room,
  RoomEvent,
  RemoteTrack,
  Track,
  VideoPresets,
} from 'livekit-client';
import { ArrowLeft, Users, Wifi, WifiOff, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!;
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL!;

const TILE_SIZE = 50;
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1200;

const MAP_FEATURES = [
  { type: 'forest', x: 200, y: 150, width: 300, height: 200 },
  { type: 'lake', x: 800, y: 400, width: 250, height: 250 },
  { type: 'mountains', x: 400, y: 600, width: 400, height: 300 },
  { type: 'desert', x: 1000, y: 200, width: 350, height: 400 },
];

function clampTileX(x: number) {
  const maxTileX = CANVAS_WIDTH / TILE_SIZE - 1;
  return Math.min(Math.max(x, 0), maxTileX);
}

function clampTileY(y: number) {
  const maxTileY = CANVAS_HEIGHT / TILE_SIZE - 1;
  return Math.min(Math.max(y, 0), maxTileY);
}

// Helper: clamp any number between min and max
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

const Game = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pixelPos, setPixelPos] = useState({ x: 0, y: 0 });
  const [users, setUsers] = useState(new Map());
  const [params, setParams] = useState({ spaceId: '' });
  const [isConnected, setIsConnected] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isTweening, setIsTweening] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [videoRoom, setVideoRoom] = useState<Room | null>(null);
  const [livekitToken, setLivekitToken] = useState('');
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications((prev) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== message));
    }, 3000);
  };

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  // Set up websocket connection and join space
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spaceId = urlParams.get('spaceId') || '';
    setParams({ spaceId });

    if (!spaceId) {
      alert("Missing spaceId!");
      navigate('/game');
      return;
    }

    const ws = new WebSocket('ws://18.215.159.145:3001');
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      addNotification("Connected to space");
      sendMessage({ type: 'join', payload: { spaceId } });
    };

    ws.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    ws.onclose = () => {
      setIsConnected(false);
      addNotification("Disconnected from space");
    };

    return () => ws.close();
  }, []);

  // Fetch LiveKit token from backend
  useEffect(() => {
    async function fetchToken() {
      if (!params.spaceId) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/livekit-token?spaceId=${params.spaceId}`,
          { credentials: 'include' }
        );
        const data = await res.json();
        if (data.token) setLivekitToken(data.token);
      } catch (error) {
        console.error("Error fetching LiveKit token:", error);
      }
    }
    fetchToken();
  }, [params.spaceId]);

  // Join the LiveKit video room
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
        if (
          (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) &&
          remoteVideoRef.current
        ) {
          const element = track.attach();
          remoteVideoRef.current.srcObject = (element as HTMLVideoElement).srcObject;
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => track.detach());
      room.on(RoomEvent.Disconnected, () => addNotification("Video chat disconnected"));

      try {
        await room.connect(LIVEKIT_URL, livekitToken);
        setVideoRoom(room);
        addNotification("Connected to video room");

        await room.localParticipant.enableCameraAndMicrophone();
        const cameraPub = room.localParticipant.getTrackPublication(Track.Source.Camera);
        if (cameraPub?.track && localVideoRef.current) {
          const element = cameraPub.track.attach();
          localVideoRef.current.srcObject = (element as HTMLVideoElement).srcObject;
        }
      } catch (error) {
        console.error("Error joining video room:", error);
      }
    }
    joinVideoRoom();

    return () => {
      if (videoRoom) videoRoom.disconnect();
    };
  }, [livekitToken]);

  // Handle messages from the WebSocket server
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
        setPixelPos({ x: user.x * TILE_SIZE, y: user.y * TILE_SIZE });

        const userMap = new Map();
        message.payload.users.forEach((u: any) => {
          if (!u.userId || u.userId === "undefined") return;
          if (u.userId !== message.payload.userId) {
            userMap.set(u.userId, u);
          }
        });
        setUsers(userMap);
        addNotification("Joined space successfully");
        break;
      }
      case 'user-joined': {
        if (message.payload.userId === currentUser?.userId) return;
        if (!message.payload.userId || message.payload.userId === "undefined") return;
        addNotification(`${message.payload.username || "A user"} joined the space`);
        setUsers((prev) => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, message.payload);
          return newUsers;
        });
        break;
      }
      case 'movement': {
        if (!message.payload.userId || message.payload.userId === "undefined") return;
        setUsers((prev) => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, message.payload);
          return newUsers;
        });
        break;
      }
      case 'movement-rejected': {
        setCurrentUser((prev: any) => ({
          ...prev,
          x: message.payload.x,
          y: message.payload.y,
        }));
        setPixelPos({ x: message.payload.x * TILE_SIZE, y: message.payload.y * TILE_SIZE });
        addNotification("Movement rejected");
        break;
      }
      case 'user-left': {
        addNotification(`${message.payload.username || "A user"} left the space`);
        setUsers((prev) => {
          const newUsers = new Map(prev);
          newUsers.delete(message.payload.userId);
          return newUsers;
        });
        break;
      }
    }
  };

  // Draw map features on the canvas
  const drawMapFeature = (ctx: CanvasRenderingContext2D, feature: typeof MAP_FEATURES[0]) => {
    ctx.save();

    switch (feature.type) {
      case 'forest':
        ctx.fillStyle = '#2d5a27';
        ctx.strokeStyle = '#1a4314';
        break;
      case 'lake':
        ctx.fillStyle = '#2196f3';
        ctx.strokeStyle = '#1976d2';
        break;
      case 'mountains':
        ctx.fillStyle = '#78909c';
        ctx.strokeStyle = '#546e7a';
        break;
      case 'desert':
        ctx.fillStyle = '#ffd54f';
        ctx.strokeStyle = '#ffc107';
        break;
    }

    ctx.beginPath();
    ctx.roundRect(feature.x, feature.y, feature.width, feature.height, 20);
    ctx.fill();
    ctx.stroke();

    // Add texture patterns
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < feature.width; i += 20) {
      for (let j = 0; j < feature.height; j += 20) {
        if (feature.type === 'forest') {
          ctx.beginPath();
          ctx.arc(feature.x + i, feature.y + j, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (feature.type === 'lake') {
          ctx.beginPath();
          ctx.moveTo(feature.x + i, feature.y + j);
          ctx.lineTo(feature.x + i + 10, feature.y + j + 10);
          ctx.stroke();
        } else if (feature.type === 'mountains') {
          ctx.beginPath();
          ctx.moveTo(feature.x + i, feature.y + j + 10);
          ctx.lineTo(feature.x + i + 5, feature.y + j);
          ctx.lineTo(feature.x + i + 10, feature.y + j + 10);
          ctx.fill();
        } else if (feature.type === 'desert') {
          ctx.beginPath();
          ctx.arc(feature.x + i, feature.y + j, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  };

  // Draw the canvas background, grid, and features
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#a5d6a7'; // Light green base
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;

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

    // Draw map features
    MAP_FEATURES.forEach((feature) => drawMapFeature(ctx, feature));
  }, [currentUser, users]);

  // Handle keyboard input to move the player avatar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentUser || !isConnected || isTweening) return;

      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case 'ArrowUp':
          dy = -1;
          break;
        case 'ArrowDown':
          dy = 1;
          break;
        case 'ArrowLeft':
          dx = -1;
          setDirection("left");
          break;
        case 'ArrowRight':
          dx = 1;
          setDirection("right");
          break;
        default:
          return;
      }

      setIsMoving(true);
      const newTileX = clampTileX(currentUser.x + dx);
      const newTileY = clampTileY(currentUser.y + dy);

      if (newTileX === currentUser.x && newTileY === currentUser.y) {
        setIsMoving(false);
        return;
      }

      tweenToTile(newTileX, newTileY);
    };

    const handleKeyUp = () => {
      if (!isTweening) setIsMoving(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentUser, isConnected, isTweening]);

  // Tween animation for moving the player avatar
  const tweenToTile = (targetTileX: number, targetTileY: number) => {
    setIsTweening(true);

    const startX = pixelPos.x;
    const startY = pixelPos.y;
    const endX = targetTileX * TILE_SIZE;
    const endY = targetTileY * TILE_SIZE;
    const duration = 200;
    let startTime: number | null = null;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(1, elapsed / duration);

      const newX = startX + (endX - startX) * t;
      const newY = startY + (endY - startY) * t;
      setPixelPos({ x: newX, y: newY });

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsTweening(false);
        setIsMoving(false);
        setCurrentUser((prev: any) => ({
          ...prev,
          x: targetTileX,
          y: targetTileY,
        }));

        if (currentUser) {
          sendMessage({
            type: 'move',
            payload: {
              x: targetTileX,
              y: targetTileY,
              userId: currentUser.userId,
            },
          });
        }
      }
    }

    requestAnimationFrame(animate);
  };

  // Calculate camera offset so the current user is near center
  const [viewportWidth, viewportHeight] = [window.innerWidth, window.innerHeight];
  const halfW = viewportWidth / 2;
  const halfH = viewportHeight / 2;

  let cameraX = pixelPos.x - halfW;
  let cameraY = pixelPos.y - halfH;

  // Clamp so we never scroll beyond the game area
  cameraX = clamp(cameraX, 0, CANVAS_WIDTH - viewportWidth);
  cameraY = clamp(cameraY, 0, CANVAS_HEIGHT - viewportHeight);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Map container with camera transform */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          style={{
            position: 'absolute',
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            transform: `translate(-${cameraX}px, -${cameraY}px)`,
          }}
        >
          <div
            style={{
              position: "relative",
              width: `${CANVAS_WIDTH}px`,
              height: `${CANVAS_HEIGHT}px`,
            }}
            className="bg-gradient-to-br from-emerald-900/20 to-cyan-900/20"
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="absolute inset-0"
            />
            {/* Avatars Layer */}
            <div className="absolute inset-0">
              {currentUser && (
                <Avatar
                  x={pixelPos.x}
                  y={pixelPos.y}
                  isMoving={isMoving}
                  direction={direction}
                />
              )}
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
        </div>
      </div>

      {/* UI Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top Bar */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black to-transparent pointer-events-auto"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-950/50 backdrop-blur-sm text-cyan-300 rounded-lg hover:bg-cyan-900/50 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                scale: isConnected ? [1, 1.2, 1] : 1,
                transition: { repeat: Infinity, duration: 2 },
              }}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-950/50 backdrop-blur-sm rounded-lg"
            >
              {isConnected ? (
                <Wifi className="text-green-400" size={20} />
              ) : (
                <WifiOff className="text-red-400" size={20} />
              )}
              <span className="text-cyan-300">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </motion.div>

            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-950/50 backdrop-blur-sm rounded-lg">
              <Users className="text-cyan-400" size={20} />
              <span className="text-cyan-300">
                {users.size + (currentUser ? 1 : 0)} Players
              </span>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <div className="absolute top-20 right-4 space-y-2">
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="px-4 py-2 bg-cyan-950/50 backdrop-blur-sm rounded-lg text-cyan-300 pointer-events-auto"
              >
                {notification}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Video Chat */}
        <div className="absolute bottom-4 right-4 space-y-2 pointer-events-auto">
          <div className="bg-cyan-950/50 backdrop-blur-sm p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Video size={20} />
              Video Chat
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-32 h-24 rounded bg-black/50"
              />
              <video
                ref={remoteVideoRef}
                autoPlay
                className="w-32 h-24 rounded bg-black/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
