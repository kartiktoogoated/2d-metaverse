import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import client from "@repo/db/client";

function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export class User {
  // We'll use 'id' internally, but 'userId' is what we send to the client.
  public id: string;
  public userId!: string;  // <--- definite assignment (!)
  private spaceId!: string; // <--- definite assignment (!)
  
  private x: number;
  private y: number;
  private ws: WebSocket;
  private username: string;
  private lastActivity: number;
  private idleCheckInterval: NodeJS.Timeout | null = null;

  constructor(ws: WebSocket) {
    this.id = getRandomString(10);
    this.x = 0;
    this.y = 0;
    this.ws = ws;
    this.username = `Player_${this.id}`; // Set a default username (or fetch from DB)
    this.initHandlers();
    this.lastActivity = Date.now();
    this.startIdleCheck();
  }
  
  initHandlers() {
    this.ws.on("message", async (data) => {
      // Update last activity timestamp for every incoming message
      this.lastActivity = Date.now();

      const parsedData = JSON.parse(data.toString());
      console.log("WS Received:", parsedData);

      switch (parsedData.type) {
        case "join": {
          console.log("join received");
          const spaceId = parsedData.payload.spaceId;

          // For now, just assume user is authenticated
          // We'll use 'id' as the userId
          this.userId = this.id;

          // Check if space exists in DB
          const space = await client.space.findFirst({ where: { id: spaceId } });
          if (!space) {
            this.ws.close();
            return;
          }

          // Add this user to the room
          this.spaceId = spaceId;
          RoomManager.getInstance().addUser(spaceId, this);

          // Random spawn
          this.x = Math.floor(Math.random() * space.width);
          this.y = Math.floor(Math.random() * space.height);

          // Send "space-joined" back to the new user
          this.send({
            type: "space-joined",
            payload: {
              spawn: { x: this.x, y: this.y },
              userId: this.userId, // send them their userId
              username: this.username, // send the username to the client
              // existing users in this space
              users:
                RoomManager.getInstance().rooms.get(spaceId)
                  ?.filter((u) => u.id !== this.id) // exclude self
                  ?.map((u) => ({
                    userId: u.userId,
                    username: u.username, // send username for other users
                    x: u.x,
                    y: u.y,
                  })) ?? [],
            },
          });

          // Broadcast "user-joined" to everyone else
          RoomManager.getInstance().broadcast(
            {
              type: "user-joined",
              payload: {
                userId: this.userId,
                username: this.username, // Send the username
                x: this.x,
                y: this.y,
              },
            },
            this,
            this.spaceId
          );
          break;
        }

        case "move": {
          const moveX = parsedData.payload.x;
          const moveY = parsedData.payload.y;

          // simple check: only allow 1-tile moves
          const xDisplacement = Math.abs(this.x - moveX);
          const yDisplacement = Math.abs(this.y - moveY);

          if (
            (xDisplacement === 1 && yDisplacement === 0) ||
            (xDisplacement === 0 && yDisplacement === 1)
          ) {
            this.x = moveX;
            this.y = moveY;

            // Broadcast movement with userId
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
            // invalid move => reject
            this.send({
              type: "movement-rejected",
              payload: {
                x: this.x,
                y: this.y,
              },
            });
          }
          break;
        }

        // more cases...
      }
    });

    // Ensure that on WebSocket close, we clean up the user
    this.ws.on("close", () => {
      this.destroy();
    });
  }

  private startIdleCheck() {
    this.idleCheckInterval = setInterval(() => {
      const now = Date.now();
      const minutesIdle = (now - this.lastActivity) / (1000 * 60);

      // Retrieve current room users from RoomManager
      const room = RoomManager.getInstance().rooms.get(this.spaceId);
      const userCount = room ? room.length : 0;

      if (minutesIdle >= 5 && userCount <= 1) {
        console.log(`User ${this.userId} is idle for ${minutesIdle.toFixed(2)} minutes and alone. Kicking...`);
        this.send({
          type: "idle-kick",
          payload: {
            reason: "You were idle for more than 5 minutes and no one else was in the room.",
          },
        });
        this.ws.close(); // This will trigger the "close" event and cleanup via destroy()
      }
    }, 60 * 1000); // Check every minute
  }

  destroy() {
    // Clear the idle check interval if it exists
    if (this.idleCheckInterval) {
      clearInterval(this.idleCheckInterval);
    }
    // Broadcast that the user has left
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
    // Remove the user from the room
    RoomManager.getInstance().removeUser(this, this.spaceId);
  }

  send(payload: OutgoingMessage) {
    this.ws.send(JSON.stringify(payload));
  }

  // Optional getters for x and y positions
  get xPos() { return this.x; }
  get yPos() { return this.y; }
}
