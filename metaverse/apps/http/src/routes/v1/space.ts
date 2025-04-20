// src/routes/space.ts
import { Router, Request, Response } from "express";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";
import {
  AddElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "../../types";
import { RoomServiceClient } from "livekit-server-sdk";
import { info, warn, error } from "../../utils/logger";

const LIVEKIT_HOST =
  process.env.LIVEKIT_HOST!
const roomService = new RoomServiceClient(
  LIVEKIT_HOST,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export const spaceRouter = Router();
spaceRouter.use(userMiddleware);

// Create space
spaceRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateSpaceSchema.safeParse(req.body);
  if (!parsed.success) {
    warn(`CreateSpace validation failed: ${JSON.stringify(parsed.error.flatten())}`);
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  try {
    let space;
    const { name, dimensions, mapId } = parsed.data;

    if (!mapId) {
      const [w, h] = dimensions.split("x").map(Number);
      space = await client.space.create({
        data: { name, width: w, height: h, creatorId: req.userId! },
      });
    } else {
      const map = await client.map.findUnique({
        where: { id: mapId },
        select: { mapElements: true, width: true, height: true },
      });
      if (!map) {
        warn(`Map not found: id=${mapId}`);
        res.status(400).json({ message: "Map not found" });
        return;
      }

      space = await client.$transaction(async () => {
        const s = await client.space.create({
          data: {
            name,
            width: map.width,
            height: map.height,
            creatorId: req.userId!,
          },
        });
        await client.spaceElements.createMany({
          data: map.mapElements.map((e) => ({
            spaceId: s.id,
            elementId: e.elementId,
            x: e.x!,
            y: e.y!,
          })),
        });
        return s;
      });
    }

    // create LiveKit room
    try {
      await roomService.createRoom({
        name: space.id,
        emptyTimeout: 600,
        maxParticipants: 10,
      });
    } catch (err: any) {
      error(`LiveKit room creation failed for space=${space.id}: ${err.message}`);
    }

    info(`Space created: id=${space.id}, name=${parsed.data.name}`);
    res.json({ spaceId: space.id });
  } catch (err: any) {
    error(`Error in space creation: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a single space element
spaceRouter.delete("/element", async (req: Request, res: Response): Promise<void> => {
  const parsed = DeleteElementSchema.safeParse(req.body);
  if (!parsed.success) {
    warn(`DeleteElement validation failed: ${JSON.stringify(parsed.error.flatten())}`);
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  try {
    const { id } = parsed.data;
    const spaceElement = await client.spaceElements.findFirst({
      where: { id },
      include: { space: true },
    });

    if (!spaceElement || spaceElement.space.creatorId !== req.userId) {
      warn(`Unauthorized element delete attempt: element=${id}, user=${req.userId}`);
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await client.spaceElements.delete({ where: { id } });
    info(`Space element deleted: id=${id}`);
    res.json({ message: "Element deleted" });
  } catch (err: any) {
    error(`Error deleting space element: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete an entire space
spaceRouter.delete("/:spaceId", async (req: Request, res: Response): Promise<void> => {
  const { spaceId } = req.params;

  try {
    const space = await client.space.findUnique({
      where: { id: spaceId },
      select: { creatorId: true },
    });

    if (!space) {
      warn(`Space not found: id=${spaceId}`);
      res.status(400).json({ message: "Space not found" });
      return;
    }

    if (space.creatorId !== req.userId) {
      warn(`Unauthorized space delete attempt: space=${spaceId}, user=${req.userId}`);
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await client.space.delete({ where: { id: spaceId } });
    info(`Space deleted: id=${spaceId}`);
    res.json({ message: "Space deleted" });
  } catch (err: any) {
    error(`Error deleting space ${spaceId}: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

// List all spaces for the user
spaceRouter.get("/all", async (req: Request, res: Response): Promise<void> => {
  try {
    const spaces = await client.space.findMany({
      where: { creatorId: req.userId! },
    });
    info(`Fetched ${spaces.length} spaces for user=${req.userId}`);
    res.json({
      spaces: spaces.map((s) => ({
        id: s.id,
        name: s.name,
        thumbnail: s.thumbnail,
        dimensions: `${s.width}x${s.height}`,
      })),
    });
  } catch (err: any) {
    error(`Error fetching spaces: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add an element to a space
spaceRouter.post("/element", async (req: Request, res: Response): Promise<void> => {
  const parsed = AddElementSchema.safeParse(req.body);
  if (!parsed.success) {
    warn(`AddElement validation failed: ${JSON.stringify(parsed.error.flatten())}`);
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  try {
    const { spaceId, elementId, x, y } = parsed.data;
    const space = await client.space.findUnique({
      where: { id: spaceId, creatorId: req.userId! },
      select: { width: true, height: true },
    });

    if (!space) {
      warn(`Space not found or unauthorized: id=${spaceId}, user=${req.userId}`);
      res.status(400).json({ message: "Space not found" });
      return;
    }

    if (x < 0 || y < 0 || x > space.width || y > space.height) {
      warn(`Element out of bounds: space=${spaceId}, x=${x}, y=${y}`);
      res.status(400).json({ message: "Point is outside of the boundary" });
      return;
    }

    await client.spaceElements.create({
      data: { spaceId, elementId, x, y },
    });
    info(`Element added to space: space=${spaceId}, element=${elementId}`);
    res.json({ message: "Element added" });
  } catch (err: any) {
    error(`Error adding element to space: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single space and its elements
spaceRouter.get("/:spaceId", async (req: Request, res: Response): Promise<void> => {
  const { spaceId } = req.params;

  try {
    const space = await client.space.findUnique({
      where: { id: spaceId },
      include: { elements: { include: { element: true } } },
    });

    if (!space) {
      warn(`Space not found: id=${spaceId}`);
      res.status(400).json({ message: "Space not found" });
      return;
    }

    info(`Fetched space details: id=${spaceId}`);
    res.json({
      dimensions: `${space.width}x${space.height}`,
      elements: space.elements.map((e) => ({
        id: e.id,
        element: {
          id: e.element.id,
          imageUrl: e.element.imageUrl,
          width: e.element.width,
          height: e.element.height,
          static: e.element.static,
        },
        x: e.x,
        y: e.y,
      })),
    });
  } catch (err: any) {
    error(`Error fetching space ${spaceId}: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});
