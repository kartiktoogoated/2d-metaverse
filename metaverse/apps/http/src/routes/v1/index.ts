import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { chatbotRouter } from "../../chatbot";
import { SigninSchema, SignupSchema } from "../../types";
import { hash, compare } from "../../scrypt";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config";
import { corsMiddleware } from "../../middleware/cors";
import { Request, Response, Router } from "express";

// NEW: Import LiveKit's AccessToken generator
import { AccessToken } from "livekit-server-sdk";

export const router = Router();

router.use(corsMiddleware);

router.post("/signup", corsMiddleware, async (req, res) => {
  console.log("inside signup");
  const parsedData = SignupSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log("parsed data incorrect");
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  const hashedPassword = await hash(parsedData.data.password);

  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type === "admin" ? "Admin" : "User",
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    console.log("error thrown");
    console.log(e);
    res.status(400).json({ message: "User already exists" });
  }
});

router.post("/signin", corsMiddleware, async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(403).json({ message: "Validation failed" });
    return;
  }

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });

    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }
    const isValid = await compare(parsedData.data.password, user.password);

    if (!isValid) {
      res.status(403).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_PASSWORD
    );

    res.json({
      token,
    });
  } catch (e) {
    res.status(400).json({ message: "Internal server error" });
  }
});

router.get("/elements", async (req, res) => {
  const elements = await client.element.findMany();

  res.json({
    elements: elements.map((e: { id: any; imageUrl: any; width: any; height: any; static: any; }) => ({
      id: e.id,
      imageUrl: e.imageUrl,
      width: e.width,
      height: e.height,
      static: e.static,
    })),
  });
});

router.get("/avatars", async (req, res) => {
  const avatars = await client.avatar.findMany();
  res.json({
    avatars: avatars.map((x: { id: any; imageUrl: any; name: any; }) => ({
      id: x.id,
      imageUrl: x.imageUrl,
      name: x.name,
    })),
  });
});

// NEW: LiveKit token generation endpoint.
// This endpoint expects a query parameter "spaceId" and the JWT in the Authorization header
router.get("/livekit-token", async (req: Request, res: Response): Promise<void> => {
  const { spaceId } = req.query;
  if (!spaceId) {
    res.status(400).json({ message: "Missing spaceId" });
    return;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_PASSWORD) as { userId: string };
    const userId = decoded.userId;
    if (!userId) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    // Get LiveKit configuration from environment variables.
    const livekitApiKey = process.env.LIVEKIT_API_KEY;
    const livekitApiSecret = process.env.LIVEKIT_API_SECRET;
    if (!livekitApiKey || !livekitApiSecret) {
      res.status(500).json({ message: "LiveKit configuration missing" });
      return;
    }

    // Generate a LiveKit access token.
    const at = new AccessToken(livekitApiKey, livekitApiSecret, {
      identity: userId,
    });
    at.addGrant({ room: spaceId as string });
    const livekitToken = at.toJwt();

    res.json({ token: livekitToken });
  } catch (e) {
    console.error("Error generating LiveKit token:", e);
    res.status(401).json({ message: "Invalid token" });
  }
});


router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
router.use("/chatbots", chatbotRouter);
