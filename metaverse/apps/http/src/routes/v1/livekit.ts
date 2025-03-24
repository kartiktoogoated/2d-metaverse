import express, { Router, Request, Response, RequestHandler } from 'express';
import dotenv from 'dotenv';
import { AccessToken, RoomServiceClient, WebhookReceiver } from 'livekit-server-sdk';
import bodyParser from 'body-parser';
import { randomUUID } from 'crypto';

dotenv.config();

export const livekitRouter = Router();

// Use express.json() for JSON body parsing
livekitRouter.use(express.json());

/**
 * Creates a LiveKit token using the provided spaceId (as the room name)
 * and identity. When a client uses this token, LiveKit will automatically
 * create (or join) a room with that name.
 */
const createToken = async (spaceId: string, identity: string): Promise<string> => {
  const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    throw new Error('LiveKit API key or secret not found in environment');
  }

  // Build a token with the specified identity, valid for 1 hour (3600 seconds)
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    ttl: 3600,
  });

  // Grant roomJoin plus publish and subscribe privileges using spaceId as the room name
  at.addGrant({
    roomJoin: true,
    room: spaceId,
    canPublish: true,
    canSubscribe: true,
    // Uncomment below if you need data channel support:
    // canPublishData: true,
  });

  return await at.toJwt();
};

/**
 * GET /api/v1/livekit-token?spaceId=someSpaceId&identity=someUsername
 * Returns JSON: { "token": "<JWT>", "identity": "<generated-identity>" }
 *
 * If no identity is provided, a unique one is generated using crypto.randomUUID()
 */
livekitRouter.get(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const spaceId = req.query.spaceId as string;
      if (!spaceId) {
        res.status(400).json({ error: 'spaceId is required' });
        return;
      }
      // Use provided identity or generate a unique one
      const identity = (req.query.identity as string) || `user-${randomUUID()}`;
      const token = await createToken(spaceId, identity);
      res.json({ token, identity });
    } catch (error) {
      console.error('Error generating token:', error);
      res.status(500).json({ error: 'Error generating token' });
    }
  }
);

/**
 * --- Room Management Endpoints ---
 * These endpoints let you create, list, and delete rooms using the RoomServiceClient.
 */
const LIVEKIT_HOST = process.env.LIVEKIT_HOST || 'https://metaverse-2d-0ex8lqub.livekit.cloud';
const roomService = new RoomServiceClient(
  LIVEKIT_HOST,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

/**
 * POST /api/v1/livekit-token/createRoom
 * Creates a room with the provided options.
 */
livekitRouter.post(
  '/createRoom',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, emptyTimeout, maxParticipants } = req.body;
      const opts = {
        name,
        emptyTimeout: emptyTimeout || 600,
        maxParticipants: maxParticipants || 20,
      };
      const room = await roomService.createRoom(opts);
      res.json({ room });
    } catch (error) {
      console.error('Error creating room:', error);
      res.status(500).json({ error: 'Error creating room' });
    }
  }
);

/**
 * GET /api/v1/livekit-token/listRooms
 * Lists all active rooms.
 */
livekitRouter.get(
  '/listRooms',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const rooms = await roomService.listRooms();
      res.json({ rooms });
    } catch (error) {
      console.error('Error listing rooms:', error);
      res.status(500).json({ error: 'Error listing rooms' });
    }
  }
);

/**
 * DELETE /api/v1/livekit-token/deleteRoom
 * Deletes a room by name.
 */
livekitRouter.delete(
  '/deleteRoom',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      await roomService.deleteRoom(name);
      res.json({ message: 'Room deleted' });
    } catch (error) {
      console.error('Error deleting room:', error);
      res.status(500).json({ error: 'Error deleting room' });
    }
  }
);

/**
 * --- Webhook Endpoint ---
 * LiveKit sends webhook events to your server with Content-Type "application/webhook+json".
 * We use express.raw() via bodyParser.raw() to capture the raw payload.
 */
const rawParser = bodyParser.raw({ type: 'application/webhook+json' });
const webhookReceiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

livekitRouter.post(
  '/webhook',
  rawParser,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.get('Authorization') || '';
      const event = await webhookReceiver.receive(req.body, authHeader);
      console.log('Received LiveKit webhook event:', event);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(400).json({ error: 'Invalid webhook' });
    }
  }
);
