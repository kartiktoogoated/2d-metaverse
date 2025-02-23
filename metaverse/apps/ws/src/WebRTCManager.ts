import { WebSocket } from "ws";

interface WebRTCMessage {
    type: string;
    from: string;
    to: string;
    spaceId: string;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
}

export class WebRTCManager {
    private users: Map<string, { ws: WebSocket; spaceId: string }>;

    constructor() {
        this.users = new Map();
    }

    registerUser(userId: string, ws: WebSocket, spaceId: string) {
        console.log(`✅ Registering user: ${userId} in space: ${spaceId}`);
        this.users.set(userId, { ws, spaceId });
    }

    handleMessage(data: WebRTCMessage) {
        if (!data.from || !data.to || !data.spaceId) {
            console.error("❌ Invalid WebRTC message:", data);
            return;
        }

        const recipient = this.users.get(data.to);

        if (!recipient) {
            console.error(`❌ User ${data.to} not found in space ${data.spaceId}.`);
            return;
        }

        if (recipient.ws.readyState !== WebSocket.OPEN) {
            console.warn(`⚠️ User ${data.to} is not online. Removing from WebRTC manager.`);
            this.users.delete(data.to);
            return;
        }

        if (recipient.spaceId !== data.spaceId) {
            console.warn(`⚠️ User ${data.to} is in a different space (${recipient.spaceId}), not forwarding.`);
            return;
        }

        console.log(`📡 Forwarding ${data.type} from ${data.from} to ${data.to} in space ${data.spaceId}`);
        recipient.ws.send(JSON.stringify(data));
    }

    removeUser(userId: string) {
        if (this.users.has(userId)) {
            this.users.delete(userId);
            console.log(`🗑️ User ${userId} removed from WebRTC manager.`);
        } else {
            console.warn(`⚠️ Attempted to remove non-existent user: ${userId}`);
        }
    }

    getConnectedUsers(spaceId: string): string[] {
        return Array.from(this.users.entries())
            .filter(([_, user]) => user.spaceId === spaceId)
            .map(([userId]) => userId);
    }
}
