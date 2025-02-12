/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';

const Arena = () => {
  const canvasRef = useRef<any>(null);
  const wsRef = useRef<any>(null);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [users, setUsers] = useState(new Map());
  const [params, setParams] = useState({ token: '', spaceId: '' });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') || '';
    const spaceId = urlParams.get('spaceId') || '';
    setParams({ token, spaceId });

    wsRef.current = new WebSocket('ws://localhost:3001');

    wsRef.current.onopen = () => {
      console.log('WebSocket connection established');
      wsRef.current.send(
        JSON.stringify({
          type: 'join',
          payload: {
            spaceId,
            token,
          },
        })
      );
    };

    wsRef.current.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      console.log('Received WebSocket message:', message);
      handleWebSocketMessage(message);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'space-joined':
        console.log('Joined space:', message.payload);
        setCurrentUser({
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          userId: message.payload.userId,
        });

        const userMap = new Map();
        message.payload.users.forEach((user: any) => {
          userMap.set(user.userId, user);
        });
        setUsers(userMap);
        break;

      case 'user-joined':
        console.log('User joined:', message.payload);
        setUsers((prev) => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, {
            x: message.payload.x,
            y: message.payload.y,
            userId: message.payload.userId,
          });
          return newUsers;
        });
        break;

      case 'movement':
        console.log('Movement received:', message.payload);
        setUsers((prev) => {
          const newUsers = new Map(prev);
          const user = newUsers.get(message.payload.userId);
          if (user) {
            user.x = message.payload.x;
            user.y = message.payload.y;
            newUsers.set(message.payload.userId, user);
          }
          return newUsers;
        });

        if (message.payload.userId === currentUser.userId) {
          setCurrentUser((prev: any) => ({
            ...prev,
            x: message.payload.x,
            y: message.payload.y,
          }));
        }
        break;

      case 'movement-rejected':
        console.warn('Movement rejected. Resetting position:', message.payload);
        setCurrentUser((prev: any) => ({
          ...prev,
          x: message.payload.x,
          y: message.payload.y,
        }));
        break;

      case 'user-left':
        console.log('User left:', message.payload);
        setUsers((prev) => {
          const newUsers = new Map(prev);
          newUsers.delete(message.payload.userId);
          return newUsers;
        });
        break;

      default:
        console.error('Unknown message type:', message.type);
    }
  };

  const handleMove = (newX: any, newY: any) => {
    if (!currentUser) return;

    setCurrentUser((prev: any) => ({
      ...prev,
      x: newX,
      y: newY,
    }));

    wsRef.current.send(
      JSON.stringify({
        type: 'move',
        payload: {
          x: newX,
          y: newY,
          userId: currentUser.userId,
        },
      })
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    users.forEach((user) => {
      if (user.x === undefined || user.y === undefined) return;

      ctx.beginPath();
      ctx.fillStyle = '#4ECDC4';
      ctx.arc(user.x * 50, user.y * 50, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`User ${user.userId}`, user.x * 50, user.y * 50 + 40);
    });

    if (currentUser && currentUser.x !== undefined && currentUser.y !== undefined) {
      ctx.beginPath();
      ctx.fillStyle = '#FF6B6B';
      ctx.arc(currentUser.x * 50, currentUser.y * 50, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('You', currentUser.x * 50, currentUser.y * 50 + 40);
    }
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
      default:
        break;
    }
  };

  return (
    <div
      className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Arena</h1>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-full max-w-lg">
        <p className="text-sm text-gray-600"><strong>Token:</strong> {params.token}</p>
        <p className="text-sm text-gray-600"><strong>Space ID:</strong> {params.spaceId}</p>
        <p className="text-sm text-gray-600"><strong>Connected Users:</strong> {users.size + (currentUser ? 1 : 0)}</p>
      </div>
      <div className="border-2 border-gray-400 rounded-lg overflow-hidden shadow-lg">
        <canvas
          ref={canvasRef}
          width={1000}
          height={1000}
          className="bg-white outline-none"
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">Use arrow keys to move your avatar</p>
    </div>
  );
};

export default Arena;
