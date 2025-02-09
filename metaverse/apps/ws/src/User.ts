import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import client from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

function getRandomString(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export class User {
    public id: string;
    public userId?: string;
    private spaceId?: string;
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
            try {
                console.log("Received data:", data);
                const parsedData = JSON.parse(data.toString());
                console.log("Parsed data:", parsedData);

                switch (parsedData.type) {
                    case "join":
                        await this.handleJoin(parsedData);
                        break;

                    case "move":
                        await this.handleMove(parsedData);
                        break;

                    default:
                        console.error("Unknown message type:", parsedData.type);
                }
            } catch (error) {
                console.error("Error handling message:", error);
            }
        });

        this.ws.on("close", () => {
            this.destroy();
        });
    }

    async handleJoin(parsedData: any) {
        const spaceId = parsedData.payload.spaceId;
        const token = parsedData.payload.token;

        try {
            const userId = (jwt.verify(token, JWT_PASSWORD) as JwtPayload).userId;
            if (!userId) throw new Error("Invalid userId in token");

            this.userId = userId;
        } catch (error) {
            console.error("Token verification failed:", error);
            this.ws.close();
            return;
        }

        const space = await client.space.findFirst({ where: { id: spaceId } });
        if (!space) {
            console.error(`Space not found: ${spaceId}`);
            this.ws.close();
            return;
        }

        this.spaceId = spaceId;
        this.x = Math.floor(Math.random() * space.width);
        this.y = Math.floor(Math.random() * space.height);

        RoomManager.getInstance().addUser(spaceId, this);

        this.send({
            type: "space-joined",
            payload: {
                spawn: { x: this.x, y: this.y },
                users: RoomManager.getInstance().rooms.get(spaceId)
                    ?.filter((u) => u.id !== this.id)
                    ?.map((u) => ({
                        userId: u.userId,
                        x: u.x,
                        y: u.y,
                    })) ?? [],
            },
        });

        RoomManager.getInstance().broadcast({
            type: "user-joined",
            payload: {
                userId: this.userId,
                x: this.x,
                y: this.y,
            },
        }, this, this.spaceId!);

        console.log(`User ${this.userId} joined space ${spaceId}`);
    }

    async handleMove(parsedData: any) {
        const moveX = parsedData.payload.x;
        const moveY = parsedData.payload.y;

        const space = await client.space.findFirst({ where: { id: this.spaceId } });
        if (!space) {
            console.error(`Space not found: ${this.spaceId}`);
            this.ws.close();
            return;
        }

        const xDisplacement = Math.abs(this.x - moveX);
        const yDisplacement = Math.abs(this.y - moveY);

        if ((xDisplacement === 1 && yDisplacement === 0) || (xDisplacement === 0 && yDisplacement === 1)) {
            if (moveX < 0 || moveY < 0 || moveX >= space.width || moveY >= space.height) {
                console.warn("Movement out of bounds");
                this.send({
                    type: "movement-rejected",
                    payload: { x: this.x, y: this.y },
                });
                return;
            }

            this.x = moveX;
            this.y = moveY;

            RoomManager.getInstance().broadcast({
                type: "movement",
                payload: {
                    userId: this.userId, // Ensure userId is included
                    x: this.x,
                    y: this.y,
                },
            }, this, this.spaceId!);

            console.log(`User ${this.userId} moved to (${this.x}, ${this.y})`);
        } else {
            console.log("Invalid move request:", { moveX, moveY });
            this.send({
                type: "movement-rejected",
                payload: { x: this.x, y: this.y },
            });
        }
    }

    destroy() {
        RoomManager.getInstance().broadcast({
            type: "user-left",
            payload: { userId: this.userId },
        }, this, this.spaceId!);
        RoomManager.getInstance().removeUser(this, this.spaceId!);

        console.log(`User ${this.userId} left space ${this.spaceId}`);
    }

    send(payload: OutgoingMessage) {
        try {
            this.ws.send(JSON.stringify(payload));
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }
}
