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

  constructor(ws: WebSocket) {
    this.id = getRandomString(10);
    this.x = 0;
    this.y = 0;
    this.ws = ws;
    this.initHandlers();
  }

  initHandlers() {
    this.ws.on("message", async (data) => {
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
              // existing users in this space
              users:
                RoomManager.getInstance().rooms.get(spaceId)
                  ?.filter((u) => u.id !== this.id) // exclude self
                  ?.map((u) => ({
                    userId: u.userId,
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
  }

  destroy() {
    // broadcast user-left
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
    // remove from the room
    RoomManager.getInstance().removeUser(this, this.spaceId);
  }

  send(payload: OutgoingMessage) {
    this.ws.send(JSON.stringify(payload));
  }

  // optional: getters if you need them
  get xPos() { return this.x; }
  get yPos() { return this.y; }
}
