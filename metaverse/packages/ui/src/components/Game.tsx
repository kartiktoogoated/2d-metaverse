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

const TILE_SIZE = 50;       // Each grid cell is 50×50 pixels
const CANVAS_WIDTH = 800;   // Arena width
const CANVAS_HEIGHT = 600;  // Arena height

function clampTileX(x: number) {
  // Clamp tile X so it doesn’t go off the 800px arena
  // The max tile index is (canvasWidth / tileSize) - 1
  const maxTileX = (CANVAS_WIDTH / TILE_SIZE) - 1;
  return Math.min(Math.max(x, 0), maxTileX);
}

function clampTileY(y: number) {
  // Same for Y
  const maxTileY = (CANVAS_HEIGHT / TILE_SIZE) - 1;
  return Math.min(Math.max(y, 0), maxTileY);
}

const Game = () => {
  // Refs for canvas and WebSocket
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Refs for video elements (LiveKit will attach tracks)
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Game state
  // currentUser: holds tile coords (x, y) and userId
  const [currentUser, setCurrentUser] = useState<any>(null);
  // pixelPos: actual pixel position, used for smooth tween
  const [pixelPos, setPixelPos] = useState({ x: 0, y: 0 });
  // For storing other users in the space
  const [users, setUsers] = useState(new Map());
  const [params, setParams] = useState({ spaceId: '' });
  const [isConnected, setIsConnected] = useState(false);

  // Movement states
  const [isMoving, setIsMoving] = useState(false);
  const [isTweening, setIsTweening] = useState(false); // True while animating
  const [direction, setDirection] = useState<"left" | "right">("right");

  // LiveKit state
  const [videoRoom, setVideoRoom] = useState<Room | null>(null);
  const [livekitToken, setLivekitToken] = useState('');

  // Helper to send a message via WebSocket
  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not open. Message not sent:", message);
    }
  };

  // ---------------------------
  //  WebSocket Setup
  // ---------------------------
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

  // ---------------------------
  //  Fetch LiveKit Token
  // ---------------------------
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

  // ---------------------------
  //  LiveKit Integration
  // ---------------------------
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

  // ---------------------------
  //  Handle WebSocket Messages
  // ---------------------------
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

        // Set initial pixel position from tile coords
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
        // Snap to server-approved tile
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

  // ---------------------------
  //  Draw Arena Grid
  // ---------------------------
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

  // ---------------------------
  //  Movement (Discrete Steps)
  // ---------------------------
  // Each arrow key press = move 1 tile with a short tween
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentUser || !isConnected) return;

      // If already tweening, ignore further key presses
      if (isTweening) return;

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
          return; // ignore other keys
      }

      // We are about to move, so set isMoving to true
      setIsMoving(true);

      // Calculate new tile coords, clamped to arena
      const newTileX = clampTileX(currentUser.x + dx);
      const newTileY = clampTileY(currentUser.y + dy);

      // If we didn't actually change tile, do nothing
      if (newTileX === currentUser.x && newTileY === currentUser.y) {
        setIsMoving(false);
        return;
      }

      // Tween from current pixelPos to new tile’s pixel coords
      tweenToTile(newTileX, newTileY);
    };

    const handleKeyUp = () => {
      // If user lifts key, set isMoving to false (if not tweening)
      if (!isTweening) {
        setIsMoving(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentUser, isConnected, isTweening]);

  /** Tween from the current pixelPos to the specified tile’s pixel coords over 200ms. */
  const tweenToTile = (targetTileX: number, targetTileY: number) => {
    setIsTweening(true);

    const startX = pixelPos.x;
    const startY = pixelPos.y;
    const endX = targetTileX * TILE_SIZE;
    const endY = targetTileY * TILE_SIZE;

    const duration = 200; // 200ms
    let startTime: number | null = null;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(1, elapsed / duration);

      // Linear interpolation
      const newX = startX + (endX - startX) * t;
      const newY = startY + (endY - startY) * t;
      setPixelPos({ x: newX, y: newY });

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // Tween complete
        setIsTweening(false);
        setIsMoving(false);

        // Update tile coords
        setCurrentUser((prev: any) => ({
          ...prev,
          x: targetTileX,
          y: targetTileY,
        }));

        // Send movement message to server
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

  return (
    <div className="p-4" tabIndex={0}>
      <h1 className="text-2xl font-bold mb-4">Arena with Video Chat</h1>
      <p className="text-sm text-gray-600">Space ID: {params.spaceId}</p>
      <p className="text-sm text-gray-600">
        Connected Users: {users.size + (currentUser ? 1 : 0)}
      </p>

      <div
        style={{ position: "relative", width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
        className="border rounded-lg overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
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
          {/* Current user’s avatar */}
          {currentUser && (
            <Avatar
              x={pixelPos.x}
              y={pixelPos.y}
              isMoving={isMoving}
              direction={direction}
            />
          )}

          {/* Other users’ avatars (use their tile coords × 50) */}
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
        Use arrow keys to move your avatar (one tile at a time)
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
