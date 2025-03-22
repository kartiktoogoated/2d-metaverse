import { Router } from "express";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";
import { AddElementSchema, CreateElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types";
// Import RoomServiceClient for LiveKit room management
import { RoomServiceClient } from "livekit-server-sdk";

const LIVEKIT_HOST = process.env.LIVEKIT_HOST || 'https://metaverse-2d-0ex8lqub.livekit.cloud';
const roomService = new RoomServiceClient(
  LIVEKIT_HOST,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
  console.log("endpoint hit for creating space");
  const parsedData = CreateSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log(JSON.stringify(parsedData));
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  let space;
  // If no mapId is provided, create a space with custom dimensions
  if (!parsedData.data.mapId) {
    space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: parseInt(parsedData.data.dimensions.split("x")[0]),
        height: parseInt(parsedData.data.dimensions.split("x")[1]),
        creatorId: req.userId!
      }
    });
    try {
      // Create a LiveKit room with the space id as its name.
      await roomService.createRoom({
        name: space.id,
        emptyTimeout: 600, // Room will close after 10 minutes of inactivity
        maxParticipants: 10
      });
    } catch (error) {
      console.error("Error creating LiveKit room for space:", error);
      // Optionally handle the error
    }
    res.json({ spaceId: space.id });
    return;
  }
  
  // If a mapId is provided, load the map and create the space accordingly.
  const map = await client.map.findFirst({
    where: { id: parsedData.data.mapId },
    select: { mapElements: true, width: true, height: true }
  });
  console.log("after map lookup");
  if (!map) {
    res.status(400).json({ message: "Map not found" });
    return;
  }
  console.log("map.mapElements.length:", map.mapElements.length);
  space = await client.$transaction(async () => {
    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creatorId: req.userId!,
      }
    });
    await client.spaceElements.createMany({
      data: map.mapElements.map((e: { elementId: any; x: any; y: any; }) => ({
        spaceId: space.id,
        elementId: e.elementId,
        x: e.x!,
        y: e.y!
      }))
    });
    return space;
  });
  console.log("space created");
  try {
    // Create a corresponding LiveKit room using the space id as its room name.
    await roomService.createRoom({
      name: space.id,
      emptyTimeout: 600,
      maxParticipants: 10
    });
  } catch (error) {
    console.error("Error creating LiveKit room for space:", error);
  }
  res.json({ spaceId: space.id });
});

spaceRouter.delete("/element", userMiddleware, async (req, res) => {
  console.log("Deleting space element");
  const parsedData = DeleteElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }
  const spaceElement = await client.spaceElements.findFirst({
    where: { id: parsedData.data.id },
    include: { space: true }
  });
  console.log(spaceElement?.space);
  if (!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  await client.spaceElements.delete({ where: { id: parsedData.data.id } });
  res.json({ message: "Element deleted" });
});

spaceRouter.delete("/:spaceId", userMiddleware, async(req, res) => {
  console.log("Deleting space:", req.params.spaceId);
  const space = await client.space.findUnique({
    where: { id: req.params.spaceId },
    select: { creatorId: true }
  });
  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }
  if (space.creatorId !== req.userId) {
    console.log("Unauthorized deletion attempt");
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  await client.space.delete({ where: { id: req.params.spaceId } });
  res.json({ message: "Space deleted" });
});

spaceRouter.get("/all", userMiddleware, async (req, res) => {
  const spaces = await client.space.findMany({
    where: { creatorId: req.userId! }
  });
  res.json({
    spaces: spaces.map((s: { id: any; name: any; thumbnail: any; width: any; height: any; }) => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail,
      dimensions: `${s.width}x${s.height}`,
    }))
  });
});

spaceRouter.post("/element", userMiddleware, async (req, res) => {
  const parsedData = AddElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }
  const space = await client.space.findUnique({
    where: { id: req.body.spaceId, creatorId: req.userId! },
    select: { width: true, height: true }
  });
  if (req.body.x < 0 || req.body.y < 0 || req.body.x > space?.width! || req.body.y > space?.height!) {
    res.status(400).json({ message: "Point is outside of the boundary" });
    return;
  }
  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }
  await client.spaceElements.create({
    data: {
      spaceId: req.body.spaceId,
      elementId: req.body.elementId,
      x: req.body.x,
      y: req.body.y
    }
  });
  res.json({ message: "Element added" });
});

spaceRouter.get("/:spaceId", async (req, res) => {
  const space = await client.space.findUnique({
    where: { id: req.params.spaceId },
    include: { elements: { include: { element: true } } }
  });
  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }
  res.json({
    dimensions: `${space.width}x${space.height}`,
    elements: space.elements.map((e: { id: any; element: { id: any; imageUrl: any; width: any; height: any; static: any; }; x: any; y: any; }) => ({
      id: e.id,
      element: {
        id: e.element.id,
        imageUrl: e.element.imageUrl,
        width: e.element.width,
        height: e.element.height,
        static: e.element.static
      },
      x: e.x,
      y: e.y
    }))
  });
});
