/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Arena = () => {
  const { spaceId } = useParams<{ spaceId: string }>(); // ✅ Get spaceId from URL
  const navigate = useNavigate();
  const canvasRef = useRef<any>(null);
  const wsRef = useRef<any>(null);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [users, setUsers] = useState(new Map());

  useEffect(() => {
    if (!spaceId) {
      alert("No space ID found!");
      navigate("/game");
      return;
    }

    // Initialize WebSocket connection
    wsRef.current = new WebSocket('ws://18.215.159.145:3001'); // ✅ Replace with your WS_URL

    wsRef.current.onopen = () => {
      // Join the space once connected
      wsRef.current.send(JSON.stringify({
        type: 'join',
        payload: { spaceId }
      }));
    };

    wsRef.current.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [spaceId, navigate]);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'space-joined':
        { setCurrentUser({
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          userId: message.payload.userId
        });

        // Initialize other users from the payload
        const userMap = new Map();
        message.payload.users.forEach((user: any) => {
          userMap.set(user.userId, user);
        });
        setUsers(userMap);
        break; }

      case 'user-joined':
        setUsers(prev => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, {
            x: message.payload.x,
            y: message.payload.y,
            userId: message.payload.userId
          });
          return newUsers;
        });
        break;

      case 'movement':
        setUsers(prev => {
          const newUsers = new Map(prev);
          const user = newUsers.get(message.payload.userId);
          if (user) {
            user.x = message.payload.x;
            user.y = message.payload.y;
            newUsers.set(message.payload.userId, user);
          }
          return newUsers;
        });
        break;

      case 'movement-rejected':
        setCurrentUser((prev: any) => ({
          ...prev,
          x: message.payload.x,
          y: message.payload.y
        }));
        break;

      case 'user-left':
        setUsers(prev => {
          const newUsers = new Map(prev);
          newUsers.delete(message.payload.userId);
          return newUsers;
        });
        break;
    }
  };

  // Handle user movement
  const handleMove = (newX: any, newY: any) => {
    if (!currentUser) return;

    wsRef.current.send(JSON.stringify({
      type: 'move',
      payload: {
        x: newX,
        y: newY,
        userId: currentUser.userId
      }
    }));
  };

  // Draw the arena
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
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
    if (currentUser?.x !== undefined) {
      ctx.beginPath();
      ctx.fillStyle = '#FF6B6B';
      ctx.arc(currentUser.x * 50, currentUser.y * 50, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('You', currentUser.x * 50, currentUser.y * 50 + 40);
    }

    // Draw other users
    users.forEach(user => {
      if (user.x !== undefined) {
        ctx.beginPath();
        ctx.fillStyle = '#4ECDC4';
        ctx.arc(user.x * 50, user.y * 50, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`User ${user.userId}`, user.x * 50, user.y * 50 + 40);
      }
    });
  }, [currentUser, users]);

  const handleKeyDown = (e: any) => {
    if (!currentUser) return;

    const { x, y } = currentUser;
    switch (e.key) {
      case 'ArrowUp':
        handleMove(x, y - 1);
        break;
      case 'ArrowDown':
        handleMove(x, y + 1);
        break;
      case 'ArrowLeft':
        handleMove(x - 1, y);
        break;
      case 'ArrowRight':
        handleMove(x + 1, y);
        break;
    }
  };

  return (
    <div className="relative p-4" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/game')}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-cyan-300 rounded-lg hover:bg-black/70 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Worlds</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Arena</h1>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Space ID: {spaceId}</p>
        <p className="text-sm text-gray-600">Connected Users: {users.size + (currentUser ? 1 : 0)}</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={2000}
          height={2000}
          className="bg-white"
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">Use arrow keys to move your avatar</p>
    </div>
  );
};

export default Arena;
