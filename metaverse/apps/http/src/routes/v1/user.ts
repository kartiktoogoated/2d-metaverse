// src/routes/user.ts
import { Router, Request, Response } from "express";
import { UpdateMetadataSchema } from "../../types";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";
import { info, warn, error } from "../../utils/logger";

export const userRouter = Router();

userRouter.post(
  "/metadata",
  userMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const parsed = UpdateMetadataSchema.safeParse(req.body);
    if (!parsed.success) {
      warn(
        `Metadata update validation failed for user=${req.userId}: ${JSON.stringify(
          parsed.error.flatten()
        )}`
      );
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    try {
      await client.user.update({
        where: { id: req.userId },
        data: { avatarId: parsed.data.avatarId },
      });
      info(`User metadata updated: user=${req.userId} avatar=${parsed.data.avatarId}`);
      res.json({ message: "Metadata updated" });
    } catch (err: any) {
      error(`Error updating metadata for user=${req.userId}: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Bulk-fetch avatar metadata for a list of user IDs
userRouter.get(
  "/metadata/bulk",
  async (req: Request, res: Response): Promise<void> => {
    const raw = (req.query.ids ?? "[]") as string;
    // Expecting format: "[id1,id2,...]"
    const userIds = raw
      .slice(1, raw.length - 1)
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    info(`Bulk metadata request for users=${userIds.join(",")}`);

    try {
      const records = await client.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, avatar: { select: { imageUrl: true } } },
      });

      const avatars = records.map((r) => ({
        userId: r.id,
        avatarId: r.avatar?.imageUrl ?? null,
      }));

      info(`Bulk metadata fetched: found ${avatars.length} records`);
      res.json({ avatars });
    } catch (err: any) {
      error(`Error fetching bulk metadata: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
