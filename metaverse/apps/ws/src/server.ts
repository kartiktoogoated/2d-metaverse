import { WebSocketServer, WebSocket } from 'ws';
import crypto from "crypto";

const wss = new WebSocketServer({ port: 3001 });
const peers = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
  const userId = crypto.randomUUID();
  peers.set(userId, ws);
  console.log(`User connected: ${userId}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`🔄 Received WebSocket Message from ${userId}:`, data);

      // Check if message type is a valid WebRTC signaling message
      if (data.type === "offer" || data.type === "answer" || data.type === "ice-candidate") {
        if (data.to && peers.has(data.to)) {
          // Don't relay to self
          if (userId === data.to) {
            console.warn(`❌ Ignoring self-signaling attempt for ${userId}`);
            return;
          }

          console.log(`📡 Relaying ${data.type} from ${userId} to ${data.to}`);
          // Send the message to the target peer
          peers.get(data.to)?.send(JSON.stringify({ from: userId, ...data }));
        } else {
          console.warn(`⚠️ Peer not found: ${data.to}`);
        }
      } else {
        console.warn(`⚠️ Invalid message type: ${data.type}`);
      }
    } catch (error) {
      console.error("❌ Error processing WebSocket message:", error);
      // Optionally, you can send an error response to the client
      ws.send(JSON.stringify({ error: "Invalid message format" }));
    }
  });

  ws.on('close', () => {
    peers.delete(userId);
    console.log(`User disconnected: ${userId}`);
  });
});

console.log("WebSocket server running on ws://localhost:3001");
