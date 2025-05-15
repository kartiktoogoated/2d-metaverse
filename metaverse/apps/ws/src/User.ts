import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import client from "@repo/db/client";
import { Logger } from "./logger";

function getRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Represents a connected user in the metaverse.
 */
export class User {
  public readonly id: string;
  public userId!: string;
  private spaceId!: string;

  private x: number;
  private y: number;
  private ws: WebSocket;
  public username: string;
  private lastActivity: number;
  private idleCheckInterval: NodeJS.Timeout | null = null;
  private destroyed = false;

  /**
   * Create a new User instance.
   * @param ws The WebSocket connection for this user.
   */
  constructor(ws: WebSocket) {
    this.id = getRandomString(10);
    this.x = 0;
    this.y = 0;
    this.ws = ws;
    this.username = `Player_${this.id}`;
    this.initHandlers();
    this.lastActivity = Date.now();
    this.startIdleCheck();
  }

  /**
   * Initialize WebSocket event handlers for this user.
   */
  private initHandlers(): void {
    this.ws.on("message", async (data) => {
      this.lastActivity = Date.now();
      let parsedData: any;
      try {
        parsedData = JSON.parse(data.toString());
      } catch (err) {
        Logger.warn("Received invalid JSON from user", this.id, err);
        this.send({
          type: "error",
          payload: { message: "Invalid message format." },
        });
        return;
      }
      Logger.info("WS Received:", parsedData);
      if (!parsedData.type || !parsedData.payload) {
        this.send({
          type: "error",
          payload: { message: "Malformed message." },
        });
        return;
      }
      switch (parsedData.type) {
        case "join": {
          Logger.info("join received");
          const spaceId = parsedData.payload.spaceId;
          if (typeof spaceId !== "string" || !spaceId) {
            this.send({
              type: "error",
              payload: { message: "Invalid spaceId." },
            });
            return;
          }
          this.userId = this.id;
          try {
            const space = await client.space.findFirst({ where: { id: spaceId } });
            if (!space) {
              Logger.warn(`Space not found: ${spaceId}`);
              this.ws.close();
              return;
            }
            this.spaceId = spaceId;
            RoomManager.getInstance().addUser(spaceId, this);
            this.x = Math.floor(Math.random() * space.width);
            this.y = Math.floor(Math.random() * space.height);
            this.send({
              type: "space-joined",
              payload: {
                spawn: { x: this.x, y: this.y },
                userId: this.userId,
                username: this.username,
                users:
                  Array.from(RoomManager.getInstance().getRooms().get(spaceId) ?? [])
                    .filter((u) => u.id !== this.id)
                    .map((u) => ({
                      userId: u.userId,
                      username: u.username,
                      x: u.x,
                      y: u.y,
                    })),
              },
            });
            RoomManager.getInstance().broadcast(
              {
                type: "user-joined",
                payload: {
                  userId: this.userId,
                  username: this.username,
                  x: this.x,
                  y: this.y,
                },
              },
              this,
              this.spaceId
            );
          } catch (err) {
            Logger.error("Error during join:", err);
            this.send({
              type: "error",
              payload: { message: "Failed to join space." },
            });
          }
          break;
        }
        case "move": {
          const moveX = parsedData.payload.x;
          const moveY = parsedData.payload.y;
          if (
            typeof moveX !== "number" ||
            typeof moveY !== "number" ||
            !Number.isFinite(moveX) ||
            !Number.isFinite(moveY)
          ) {
            this.send({
              type: "movement-rejected",
              payload: {
                x: this.x,
                y: this.y,
                reason: "Invalid coordinates."
              },
            });
            return;
          }
          const xDisplacement = Math.abs(this.x - moveX);
          const yDisplacement = Math.abs(this.y - moveY);
          if (
            (xDisplacement === 1 && yDisplacement === 0) ||
            (xDisplacement === 0 && yDisplacement === 1)
          ) {
            this.x = moveX;
            this.y = moveY;
            RoomManager.getInstance().broadcast(
              {
                type: "movement",
                payload: {
                  x: this.x,
                  y: this.y,
                  userId: this.userId,
                },
              },
              this,
              this.spaceId
            );
          } else {
            this.send({
              type: "movement-rejected",
              payload: {
                x: this.x,
                y: this.y,
                reason: "Invalid move."
              },
            });
          }
          break;
        }
        // more cases...
        default: {
          this.send({
            type: "error",
            payload: { message: "Unknown message type." },
          });
        }
      }
    });
    this.ws.on("close", () => {
      this.destroy();
    });
    this.ws.on("error", (err) => {
      Logger.error("WebSocket error for user", this.id, err);
      this.destroy();
    });
  }

  /**
   * Start periodic idle check for this user.
   */
  private startIdleCheck(): void {
    this.idleCheckInterval = setInterval(() => {
      const now = Date.now();
      const minutesIdle = (now - this.lastActivity) / (1000 * 60);
      const room = RoomManager.getInstance().getRooms().get(this.spaceId);
      const userCount = room ? room.length : 0;
      if (minutesIdle >= 5 && userCount <= 1) {
        Logger.info(`User ${this.userId} is idle for ${minutesIdle.toFixed(2)} minutes and alone. Kicking...`);
        this.send({
          type: "idle-kick",
          payload: {
            reason: "You were idle for more than 5 minutes and no one else was in the room.",
          },
        });
        this.ws.close();
      }
    }, 60 * 1000);
  }

  /**
   * Clean up resources and remove user from room.
   */
  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.idleCheckInterval) {
      clearInterval(this.idleCheckInterval);
      this.idleCheckInterval = null;
    }
    try {
      RoomManager.getInstance().broadcast(
        {
          type: "user-left",
          payload: {
            userId: this.userId,
          },
        },
        this,
        this.spaceId
      );
      RoomManager.getInstance().removeUser(this, this.spaceId);
    } catch (err) {
      Logger.error("Error during user destroy:", err);
    }
  }

  /**
   * Send a message to this user.
   * @param payload The message to send.
   */
  public send(payload: OutgoingMessage): void {
    try {
      this.ws.send(JSON.stringify(payload));
    } catch (err) {
      Logger.error("Failed to send message to user", this.id, err);
    }
  }

  /**
   * Get the user's X position.
   */
  public get xPos(): number { return this.x; }
  /**
   * Get the user's Y position.
   */
  public get yPos(): number { return this.y; }
}
