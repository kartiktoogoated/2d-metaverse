import express, { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

dotenv.config();

export const livekitRouter = Router();

// For JSON payloads (body parsing)
livekitRouter.use(express.json());

/**
 * Creates a LiveKit token with the provided spaceId (used as the room name) and identity.
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

  // Grant roomJoin plus publishing & subscribing privileges using spaceId as the room name
  at.addGrant({
    roomJoin: true,
    room: spaceId,
    canPublish: true,
    canSubscribe: true,
    // canPublishData: true, // Enable if you need data channels
  });

  return await at.toJwt();
};

/**
 * GET route:
 *   /getToken?spaceId=someSpaceId&identity=someUsername
 * returns JSON: { "token": "<JWT>" }
 */
livekitRouter.get('/getToken', async (req: Request, res: Response) => {
  try {
    const spaceId = req.query.spaceId as string;
    if (!spaceId) {
      res.status(400).json({ error: 'spaceId is required' });
      return;
    }
    const identity = (req.query.identity as string) || 'quickstart-username';

    const token = await createToken(spaceId, identity);
    // Return JSON so that the frontend can do await res.json()
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Error generating token' });
  }
});
