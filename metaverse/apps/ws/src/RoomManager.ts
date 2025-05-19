import type { User } from "./User";
import { OutgoingMessage } from "./types";
import { Logger } from "./logger";

/**
 * Manages rooms and user membership for the metaverse.
 * Singleton pattern.
 */
export class RoomManager {
    /**
     * Map of room IDs to arrays of users.
     */
    private rooms: Map<string, User[]> = new Map();
    private static instance: RoomManager;

    private constructor() {
        this.rooms = new Map();
    }

    /**
     * Get the singleton instance of RoomManager.
     */
    public static getInstance(): RoomManager {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }

    /**
     * Ensure a room exists in memory.
     * @param spaceId The room ID.
     */
    public ensureRoom(spaceId: string): void {
        if (!this.rooms.has(spaceId)) {
            this.rooms.set(spaceId, []);
            Logger.info(`Room created for space: ${spaceId}`);
        }
    }

    /**
     * Add a user to a room.
     * @param spaceId The room ID.
     * @param user The user to add.
     */
    public addUser(spaceId: string, user: User): void {
        this.ensureRoom(spaceId);
        this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user]);
    }

    /**
     * Remove a user from a room.
     * @param user The user to remove.
     * @param spaceId The room ID.
     */
    public removeUser(user: User, spaceId: string): void {
        if (!this.rooms.has(spaceId)) {
            Logger.warn(`Attempted to remove user from non-existent room: ${spaceId}`);
            return;
        }
        this.rooms.set(
            spaceId,
            (this.rooms.get(spaceId)?.filter((u) => u.id !== user.id) ?? [])
        );
    }

    /**
     * Broadcast a message to all users in a room except the sender.
     * @param message The message to broadcast.
     * @param user The sender.
     * @param roomId The room ID.
     */
    public broadcast(message: OutgoingMessage, user: User, roomId: string): void {
        if (!this.rooms.has(roomId)) {
            Logger.warn(`Attempted to broadcast to non-existent room: ${roomId}`);
            return;
        }
        this.rooms.get(roomId)?.forEach((u) => {
            if (u.id !== user.id) {
                try {
                    u.send(message);
                } catch (err) {
                    Logger.error(`Failed to send message to user ${u.id}:`, err);
                }
            }
        });
    }

    /**
     * Get the users in a room (read-only).
     */
    public getRooms(): ReadonlyMap<string, User[]> {
        return this.rooms;
    }
}
