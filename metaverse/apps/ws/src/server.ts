import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { v4 as uuidV4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get('/room', (_, res) => {
  res.json({ roomId: uuidV4() });
});

const rooms: Record<string, string[]> = {}; // Store users in rooms

io.on('connection', (socket) => {
  console.log("✅ WebSocket: New user connected");

  socket.on('join-room', (roomId: string, userId: string) => {
    console.log(`📌 User ${userId} joined room ${roomId}`);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(userId);

    socket.join(roomId);

    // Broadcast to existing users that a new user joined
    socket.to(roomId).emit('user-connected', userId);

    // Send back existing users in the room
    rooms[roomId].forEach(existingUserId => {
      if (existingUserId !== userId) {
        socket.emit('user-connected', existingUserId);
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ User ${userId} disconnected`);
      rooms[roomId] = rooms[roomId].filter(id => id !== userId);
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

server.listen(3000, () => console.log('✅ WebSocket Server running on port 3000'));
