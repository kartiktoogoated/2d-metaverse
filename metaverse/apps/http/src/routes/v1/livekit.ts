import express, { Router } from 'express';
import dotenv from 'dotenv';
import { AccessToken, Room, RoomServiceClient } from 'livekit-server-sdk';
import { userMiddleware } from '../../middleware/user'; // Using your authentication middleware

dotenv.config();
export const livekitRouter = Router();

// LiveKit Configuration
const LIVEKIT_HOST = process.env.LIVEKIT_HOST || 'wss://metaverse-2d-0ex8lqub.livekit.cloud';
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
  throw new Error("LiveKit API credentials are missing in environment variables.");
}

// LiveKit Room Service
const roomService = new RoomServiceClient(LIVEKIT_HOST, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);


livekitRouter.use(express.json()); // Required for JSON payloads

/**
 * Generate a LiveKit token for a user to join a room
 */
livekitRouter.get('/getToken', userMiddleware, async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { spaceId } = req.query;
      const userId = (req as any).userId; // Assuming `userMiddleware` sets `req.userId`
  
      if (!spaceId) {
        res.status(400).json({ message: "Missing spaceId parameter" });
        return;
      }
  
      const at = new AccessToken(LIVEKIT_API_KEY!, LIVEKIT_API_SECRET!, {
        identity: userId,
        ttl: '10m',
      });
  
      at.addGrant({ roomJoin: true, room: spaceId as string });
  
      const token = at.toJwt();
  
      res.json({ token }); // ✅ Correct way to send response
    } catch (error) {
      console.error("Error generating LiveKit token:", error);
      res.status(500).json({ message: "Error generating token" });
    }
  });
  
      
/**
 * Create a new LiveKit Room
 */
livekitRouter.post('/create-room', userMiddleware, async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { roomName, maxParticipants = 20 } = req.body;
  
      if (!roomName) {
        res.status(400).json({ message: "Room name is required" });
        return;
      }
  
      const room: Room = await roomService.createRoom({
        name: roomName,
        emptyTimeout: 10 * 60, // 10 minutes
        maxParticipants,
      });
  
      res.json({ message: "Room created", room }); // ✅ Just send response, don't return it
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ message: "Error creating room" });
    }
  });  

/**
 * List all LiveKit Rooms
 */
livekitRouter.get('/list-rooms', async (_req: express.Request, res: express.Response) => {
  try {
    const rooms: Room[] = await roomService.listRooms();
    res.json({ rooms });
  } catch (error) {
    console.error("Error listing rooms:", error);
    res.status(500).json({ message: "Error listing rooms" });
  }
});

/**
 * Delete a LiveKit Room
 */
livekitRouter.delete('/delete-room', userMiddleware, async (req: express.Request, res: express.Response) => {
  const { roomName } = req.body;

  if (!roomName) {
     res.status(400).json({ message: "Room name is required" });
  }

  try {
    await roomService.deleteRoom(roomName);
     res.json({ message: `Room '${roomName}' deleted successfully.` });
  } catch (error) {
    console.error("Error deleting room:", error);
     res.status(500).json({ message: "Error deleting room" });
  }
});
