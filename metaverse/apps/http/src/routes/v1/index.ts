import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import client from "@repo/db/client";
import { JWT_PASSWORD } from "../../config";
import { hash, compare } from "../../scrypt";
import { SignupSchema, SigninSchema } from "../../types";
import { corsMiddleware } from "../../middleware/cors";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { livekitRouter } from "./livekit";
import { chatbotRouter } from "../../chatbot";
import { info, warn, error } from "../../utils/logger";

export const router = Router();

router.use(corsMiddleware);
router.use(express.json());

router.post(
  "/signup",
  async (req: Request, res: Response): Promise<void> => {
    const parsed = SignupSchema.safeParse(req.body);
    if (!parsed.success) {
      warn(`Signup validation failed: ${JSON.stringify(parsed.error.flatten())}`);
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    try {
      const hashed = await hash(parsed.data.password);
      const user = await client.user.create({
        data: {
          username: parsed.data.username,
          password: hashed,
          role: "User",
        },
      });
      info(`New user created: id=${user.id} username=${parsed.data.username}`);
      res.json({ userId: user.id });
    } catch (err: any) {
      error(`Signup error for username=${parsed.data.username}: ${err.message}`);
      res.status(400).json({ message: "User already exists" });
    }
  }
);

// 🔐 Signin
router.post(
  "/signin",
  async (req: Request, res: Response): Promise<void> => {
    const parsed = SigninSchema.safeParse(req.body);
    if (!parsed.success) {
      warn(`Signin validation failed: ${JSON.stringify(parsed.error.flatten())}`);
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    try {
      const user = await client.user.findUnique({
        where: { username: parsed.data.username },
      });
      if (!user) {
        warn(`Signin attempt for non‑existent user: ${parsed.data.username}`);
        res.status(404).json({ message: "User not found" });
        return;
      }

      const isValid = await compare(parsed.data.password, user.password);
      if (!isValid) {
        warn(`Invalid password for user: ${parsed.data.username}`);
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_PASSWORD,
        { expiresIn: "2h" }
      );
      info(`User signed in: id=${user.id} username=${parsed.data.username}`);
      res.json({ token });
    } catch (err: any) {
      error(`Signin error: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get(
  "/elements",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const elements = await client.element.findMany();
      res.json({ elements });
    } catch (err: any) {
      error(`Fetch elements error: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get(
  "/avatars",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const avatars = await client.avatar.findMany();
      res.json({ avatars });
    } catch (err: any) {
      error(`Fetch avatars error: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.use("/livekit", livekitRouter);
router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
router.use("/chatbots", chatbotRouter);
