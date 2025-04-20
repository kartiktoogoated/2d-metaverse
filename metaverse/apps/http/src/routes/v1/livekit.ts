import express, { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { AccessToken, RoomServiceClient, WebhookReceiver } from 'livekit-server-sdk';
import bodyParser from 'body-parser';
import { randomUUID } from 'crypto';
import { info, warn, error } from '../../utils/logger';

dotenv.config();

export const livekitRouter = Router();
livekitRouter.use(express.json());

const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_HOST } = process.env;
if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
  throw new Error('LiveKit API credentials are missing');
}

const roomService = new RoomServiceClient(
  LIVEKIT_HOST || 'https://metaverse-2d-0ex8lqub.livekit.cloud',
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET
);

const webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

// Generate or return a LiveKit token for a given space and identity
livekitRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const spaceId = req.query.spaceId as string;
  if (!spaceId) {
    warn('Token request missing spaceId');
    res.status(400).json({ error: 'spaceId is required' });
    return;
  }

  const identity = (req.query.identity as string) || `user-${randomUUID()}`;

  try {
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity,
      ttl: 3600,
    });
    at.addGrant({ roomJoin: true, room: spaceId, canPublish: true, canSubscribe: true });
    const token = await at.toJwt();
    info(`Token generated for space=${spaceId} identity=${identity}`);
    res.json({ token, identity });
  } catch (err: any) {
    error(`Error generating token: ${err.message}`);
    res.status(500).json({ error: 'Error generating token' });
  }
});

// Create a new LiveKit room
livekitRouter.post('/createRoom', async (req: Request, res: Response): Promise<void> => {
  const { name, emptyTimeout = 600, maxParticipants = 20 } = req.body;
  if (!name) {
    warn('CreateRoom request missing name');
    res.status(400).json({ error: 'name is required' });
    return;
  }

  try {
    const room = await roomService.createRoom({ name, emptyTimeout, maxParticipants });
    info(`Room created: ${name}`);
    res.json({ room });
  } catch (err: any) {
    error(`Error creating room ${name}: ${err.message}`);
    res.status(500).json({ error: 'Error creating room' });
  }
});

// List all active rooms
livekitRouter.get('/listRooms', async (_req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await roomService.listRooms();
    info(`Listed ${rooms.length} rooms`);
    res.json({ rooms });
  } catch (err: any) {
    error(`Error listing rooms: ${err.message}`);
    res.status(500).json({ error: 'Error listing rooms' });
  }
});

// Delete a room
livekitRouter.delete('/deleteRoom', async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  if (!name) {
    warn('DeleteRoom request missing name');
    res.status(400).json({ error: 'name is required' });
    return;
  }

  try {
    await roomService.deleteRoom(name);
    info(`Room deleted: ${name}`);
    res.json({ message: 'Room deleted' });
  } catch (err: any) {
    error(`Error deleting room ${name}: ${err.message}`);
    res.status(500).json({ error: 'Error deleting room' });
  }
});

// Handle LiveKit webhooks
const rawParser = bodyParser.raw({ type: 'application/webhook+json' });
livekitRouter.post('/webhook', rawParser, async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.get('Authorization') || '';
    const event = await webhookReceiver.receive(req.body, authHeader);
    info(`Received webhook event: ${event.event}`);
    res.sendStatus(200);
  } catch (err: any) {
    error(`Error processing webhook: ${err.message}`);
    res.status(400).json({ error: 'Invalid webhook' });
  }
});
