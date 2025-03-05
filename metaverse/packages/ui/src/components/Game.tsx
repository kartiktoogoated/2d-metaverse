/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Wifi, WifiOff, Gamepad } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Game = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [users, setUsers] = useState(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [showControls] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Particle system
  const particles: any[] = [];
  const particleCount = 50;

  useEffect(() => {
    if (!spaceId) {
      alert("No space ID found!");
      navigate("/gamedashboard");
      return;
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
      });
    }

    // Animate particles
    const animateParticles = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 211, 238, 0.2)";
        ctx.fill();
      });

      // Draw grid
      ctx.strokeStyle = "rgba(34, 211, 238, 0.1)";
      ctx.lineWidth = 1;

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

      // Draw users
      if (currentUser?.x !== undefined) {
        // Draw glow effect
        const gradient = ctx.createRadialGradient(
          currentUser.x * 50,
          currentUser.y * 50,
          0,
          currentUser.x * 50,
          currentUser.y * 50,
          30
        );
        gradient.addColorStop(0, "rgba(255, 107, 107, 0.3)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentUser.x * 50, currentUser.y * 50, 30, 0, Math.PI * 2);
        ctx.fill();

        // Draw user
        ctx.beginPath();
        ctx.fillStyle = "#FF6B6B";
        ctx.arc(currentUser.x * 50, currentUser.y * 50, 20, 0, Math.PI * 2);
        ctx.fill();

        // Draw username
        ctx.fillStyle = "#fff";
        ctx.font = "16px 'VT323', monospace";
        ctx.textAlign = "center";
        ctx.fillText("YOU", currentUser.x * 50, currentUser.y * 50 + 40);
      }

      // Draw other users
      users.forEach((user) => {
        if (user.x !== undefined) {
          // Draw glow effect
          const gradient = ctx.createRadialGradient(
            user.x * 50,
            user.y * 50,
            0,
            user.x * 50,
            user.y * 50,
            30
          );
          gradient.addColorStop(0, "rgba(78, 205, 196, 0.3)");
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(user.x * 50, user.y * 50, 30, 0, Math.PI * 2);
          ctx.fill();

          // Draw user
          ctx.beginPath();
          ctx.fillStyle = "#4ECDC4";
          ctx.arc(user.x * 50, user.y * 50, 20, 0, Math.PI * 2);
          ctx.fill();

          // Draw username
          ctx.fillStyle = "#fff";
          ctx.font = "16px 'VT323', monospace";
          ctx.textAlign = "center";
          ctx.fillText(`Player ${user.userId}`, user.x * 50, user.y * 50 + 40);
        }
      });

      requestAnimationFrame(animateParticles);
    };

    animateParticles();

    // Initialize WebSocket connection
    wsRef.current = new WebSocket("ws://18.215.159.145:3001");

    wsRef.current.onopen = () => {
      setIsConnected(true);
      addNotification("Connected to space");
      wsRef.current?.send(
        JSON.stringify({
          type: "join",
          payload: { spaceId },
        })
      );
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      addNotification("Disconnected from space");
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [spaceId, navigate]);

  const addNotification = (message: string) => {
    setNotifications((prev) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== message));
    }, 3000);
  };

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case "space-joined": {
        setCurrentUser({
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          userId: message.payload.userId,
        });
        addNotification("You joined the space");

        const userMap = new Map();
        message.payload.users.forEach((user: any) => {
          userMap.set(user.userId, user);
        });
        setUsers(userMap);
        break;
      }

      case "user-joined":
        setUsers((prev) => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, {
            x: message.payload.x,
            y: message.payload.y,
            userId: message.payload.userId,
          });
          addNotification(`Player ${message.payload.userId} joined`);
          return newUsers;
        });
        break;

      case "movement":
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
        break;

      case "movement-rejected":
        setCurrentUser((prev: any) => ({
          ...prev,
          x: message.payload.x,
          y: message.payload.y,
        }));
        addNotification("Movement rejected");
        break;

      case "user-left":
        setUsers((prev) => {
          const newUsers = new Map(prev);
          newUsers.delete(message.payload.userId);
          addNotification(`Player ${message.payload.userId} left`);
          return newUsers;
        });
        break;
    }
  };

  const handleMove = (newX: number, newY: number) => {
    if (!currentUser || !wsRef.current) return;

    wsRef.current.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: newX,
          y: newY,
          userId: currentUser.userId,
        },
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!currentUser) return;

    const { x, y } = currentUser;
    switch (e.key) {
      case "ArrowUp":
        handleMove(x, y - 1);
        break;
      case "ArrowDown":
        handleMove(x, y + 1);
        break;
      case "ArrowLeft":
        handleMove(x - 1, y);
        break;
      case "ArrowRight":
        handleMove(x + 1, y);
        break;
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0"
      />

      {/* UI Overlay */}
      <div className="relative z-10">
        {/* Top Bar */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black to-transparent"
        >
          <button
            onClick={() => navigate("/gamedashboard")}
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

        {/* Game Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 p-4 bg-cyan-950/50 backdrop-blur-sm rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Gamepad className="text-cyan-400" size={24} />
                <span className="text-cyan-300">Use arrow keys to move</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <div className="absolute top-20 right-4 space-y-2">
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="px-4 py-2 bg-cyan-950/50 backdrop-blur-sm rounded-lg text-cyan-300"
              >
                {notification}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Game;

export { Game }