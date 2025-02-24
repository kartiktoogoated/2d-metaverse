import type { User } from "./User";
import { OutgoingMessage } from "./types";

export class RoomManager {
    rooms: Map<string, User[]> = new Map();
    static instance: RoomManager;

    private constructor() {
        this.rooms = new Map();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }

    public addUser(spaceId: string, user: User) {
        if (!this.rooms.has(spaceId)) {
            this.rooms.set(spaceId, [user]);
        } else {
            this.rooms.get(spaceId)?.push(user);
        }
        console.log(`✅ User ${user.id} added to room ${spaceId}`);
    }

    public removeUser(user: User, spaceId: string) {
        if (!this.rooms.has(spaceId)) return;
        this.rooms.set(spaceId, this.rooms.get(spaceId)?.filter(u => u.id !== user.id) ?? []);
        console.log(`❌ User ${user.id} removed from room ${spaceId}`);
    }

    public broadcast(message: OutgoingMessage, sender: User, spaceId: string) {
        if (!this.rooms.has(spaceId)) return;
        this.rooms.get(spaceId)?.forEach((user) => {
            if (user.id !== sender.id) {
                user.send(message);
            }
        });
    }

    public relayWebRTC(message: any, sender: User) {
        if (!sender.spaceId) return;
        
        const usersInRoom = this.rooms.get(sender.spaceId);
        if (!usersInRoom) return;
    
        const targetUser = usersInRoom.find(u => u.id === message.payload.targetId);
        if (targetUser) {
            console.log(`📡 Relaying WebRTC message from ${sender.id} to ${targetUser.id}`);
            targetUser.send(message);
        }
    }
    
}
