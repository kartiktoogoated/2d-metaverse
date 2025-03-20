import express, { Router } from 'express';
import dotenv from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

dotenv.config();

export const livekitRouter = Router();

livekitRouter.use(express.json()); // Required for JSON payloads

const createToken = async (): Promise<string> => {
  // Fixed room and participant as per the sample
  const roomName = 'quickstart-room';
  const participantName = 'quickstart-username';

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity: participantName,
      ttl: '10m', // As in the sample (if you need a number, change this to 600)
    }
  );
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
};

livekitRouter.get('/getToken', async (req, res) => {
  try {
    const token = await createToken();
    res.send(token);
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send("Error generating token");
  }
});
