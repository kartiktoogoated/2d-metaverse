import { Router, Request, Response } from "express";
import { adminMiddleware } from "../../middleware/admin";
import {
  CreateElementSchema,
  UpdateElementSchema,
  CreateAvatarSchema,
  CreateMapSchema,
} from "../../types";
import client from "@repo/db/client";
import { info, warn, error } from "../../utils/logger";

export const adminRouter = Router();
adminRouter.use(adminMiddleware);

// Create element
adminRouter.post(
  "/element",
  async (req: Request, res: Response): Promise<void> => {
    const parsed = CreateElementSchema.safeParse(req.body);
    if (!parsed.success) {
      warn(
        `Element creation validation failed: ${JSON.stringify(
          parsed.error.flatten()
        )}`
      );
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    try {
      const element = await client.element.create({
        data: {
          width: parsed.data.width,
          height: parsed.data.height,
          static: parsed.data.static,
          imageUrl: parsed.data.imageUrl,
        },
      });
      info(
        `Element created: id=${element.id} imageUrl=${parsed.data.imageUrl}`
      );
      res.json({ id: element.id });
    } catch (err: any) {
      error(`Error creating element: ${err.message || err}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Update element
adminRouter.put(
  "/element/:elementId",
  async (
    req: Request<{ elementId: string }>,
    res: Response
  ): Promise<void> => {
    const parsed = UpdateElementSchema.safeParse(req.body);
    if (!parsed.success) {
      warn(
        `Element update validation failed for id=${req.params.elementId}: ${JSON.stringify(
          parsed.error.flatten()
        )}`
      );
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    try {
      const updated = await client.element.update({
        where: { id: req.params.elementId },
        data: { imageUrl: parsed.data.imageUrl },
      });
      info(
        `Element updated: id=${updated.id} newImageUrl=${parsed.data.imageUrl}`
      );
      res.json({ message: "Element updated", id: updated.id });
    } catch (err: any) {
      error(`Error updating element ${req.params.elementId}: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Create avatar
adminRouter.post(
  "/avatar",
  async (req: Request, res: Response): Promise<void> => {
    const parsed = CreateAvatarSchema.safeParse(req.body);
    if (!parsed.success) {
      warn(
        `Avatar creation validation failed: ${JSON.stringify(
          parsed.error.flatten()
        )}`
      );
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    try {
      const avatar = await client.avatar.create({
        data: {
          name: parsed.data.name,
          imageUrl: parsed.data.imageUrl,
        },
      });
      info(`Avatar created: id=${avatar.id} name=${parsed.data.name}`);
      res.json({ avatarId: avatar.id });
    } catch (err: any) {
      error(`Error creating avatar: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Create map
adminRouter.post(
  "/map",
  async (req: Request, res: Response): Promise<void> => {
    const parsed = CreateMapSchema.safeParse(req.body);
    if (!parsed.success) {
      warn(
        `Map creation validation failed: ${JSON.stringify(
          parsed.error.flatten()
        )}`
      );
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    try {
      const map = await client.map.create({
        data: {
          name: parsed.data.name,
          width: parseInt(parsed.data.dimensions.split("x")[0], 10),
          height: parseInt(parsed.data.dimensions.split("x")[1], 10),
          thumbnail: parsed.data.thumbnail,
          mapElements: {
            create: parsed.data.defaultElements.map((e) => ({
              elementId: e.elementId,
              x: e.x,
              y: e.y,
            })),
          },
        },
      });
      info(`Map created: id=${map.id} name=${parsed.data.name}`);
      res.json({ id: map.id });
    } catch (err: any) {
      error(`Error creating map: ${err.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Promote a user to Admin
adminRouter.post(
  "/promote/:userId",
  async (
    req: Request<{ userId: string }>,
    res: Response
  ): Promise<void> => {
    try {
      await client.user.update({
        where: { id: req.params.userId },
        data: { role: "Admin" },
      });
      info(`User promoted to Admin: id=${req.params.userId}`);
      res.json({ message: "User promoted to Admin" });
    } catch (err: any) {
      error(`Promotion error for user=${req.params.userId}: ${err.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
