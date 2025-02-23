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
                const parsedData = JSON.parse(data.toString());
                console.log("Received WebSocket message:", parsedData);

                switch (parsedData.type) {
                    case "join":
                        await this.handleJoin(parsedData);
                        break;

                    case "move":
                        await this.handleMove(parsedData);
                        break;

                    case "webrtc-offer":
                    case "webrtc-answer":
                    case "webrtc-ice-candidate":
                        await this.handleWebRTC(parsedData);
                        break;

                    default:
                        console.warn("Unknown message type:", parsedData.type);
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
        const { spaceId, token } = parsedData.payload;

        if (!token || !spaceId) {
            console.error("❌ Missing token or spaceId in WebSocket connection.");
            this.ws.close();
            return;
        }

        try {
            const decoded = jwt.verify(token, JWT_PASSWORD) as JwtPayload;
            this.userId = decoded.userId;
            if (!this.userId) throw new Error("Invalid userId in token");
        } catch (error) {
            console.error("❌ Token verification failed:", error);
            this.ws.close();
            return;
        }

        const space = await client.space.findFirst({ where: { id: spaceId } });
        if (!space) {
            console.error(`❌ Space not found: ${spaceId}`);
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
                userId: this.userId,
                users: RoomManager.getInstance().rooms.get(spaceId)
                    ?.filter((u) => u.id !== this.id)
                    ?.map((u) => ({
                        userId: u.userId,
                        x: u.x,
                        y: u.y,
                    })) ?? [],
            },
        });

        setTimeout(() => {
            RoomManager.getInstance().broadcast({
                type: "user-joined",
                payload: {
                    userId: this.userId,
                    x: this.x,
                    y: this.y,
                },
            }, this, this.spaceId!);

            console.log(`✅ User ${this.userId} joined space ${spaceId}`);
        }, 100);
    }

    async handleMove(parsedData: any) {
        if (!this.spaceId || !this.userId) {
            console.error("❌ Move request received before user was fully initialized.");
            return;
        }

        const { x: moveX, y: moveY } = parsedData.payload;

        if (typeof moveX !== "number" || typeof moveY !== "number") {
            console.error("❌ Invalid move coordinates:", moveX, moveY);
            return;
        }

        const space = await client.space.findFirst({ where: { id: this.spaceId } });
        if (!space) {
            console.error(`❌ Space not found: ${this.spaceId}`);
            this.ws.close();
            return;
        }

        const xDisplacement = Math.abs(this.x - moveX);
        const yDisplacement = Math.abs(this.y - moveY);

        if ((xDisplacement === 1 && yDisplacement === 0) || (xDisplacement === 0 && yDisplacement === 1)) {
            if (moveX < 0 || moveY < 0 || moveX >= space.width || moveY >= space.height) {
                console.warn("⚠️ Movement out of bounds");
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
                    userId: this.userId,
                    x: this.x,
                    y: this.y,
                },
            }, this, this.spaceId!);

            console.log(`✅ User ${this.userId} moved to (${this.x}, ${this.y})`);
        } else {
            console.log("❌ Invalid move request:", { moveX, moveY });
            this.send({
                type: "movement-rejected",
                payload: { x: this.x, y: this.y },
            });
        }
    }

    async handleWebRTC(parsedData: any) {
        const { type, from, to, offer, answer, candidate } = parsedData;

        if (!to || !this.spaceId || !this.userId) {
            console.error("❌ WebRTC message missing required fields:", parsedData);
            return;
        }

        const recipient = RoomManager.getInstance()
            .rooms.get(this.spaceId)
            ?.find((user) => user.userId === to);

        if (!recipient) {
            console.warn(`⚠️ WebRTC recipient ${to} not found in space ${this.spaceId}`);
            return;
        }

        recipient.send({
            type,
            from,
            to,
            offer,
            answer,
            candidate,
        });

        console.log(`🔄 WebRTC ${type} forwarded from ${from} to ${to}`);
    }

    destroy() {
        if (this.spaceId && this.userId) {
            RoomManager.getInstance().broadcast({
                type: "user-left",
                payload: { userId: this.userId },
            }, this, this.spaceId!);

            RoomManager.getInstance().removeUser(this, this.spaceId!);
            console.log(`❌ User ${this.userId} left space ${this.spaceId}`);
        }
    }

    send(payload: OutgoingMessage) {
        try {
            this.ws.send(JSON.stringify(payload));
        } catch (error) {
            console.error("❌ Failed to send message:", error);
        }
    }
}
