import { create } from 'zustand';
import { Avatar, Message, Position, GameState, CallConnection } from "../types";

interface GameStore extends GameState {
  moveAvatar: (id: string, position: Position) => void;
  addMessage: (message: Message) => void;
  setCurrentUser: (avatar: Avatar) => void;
  setActiveCall: (call: CallConnection | null) => void;
  addCallParticipant: (id: string) => void;
  removeCallParticipant: (id: string) => void;
  setAvatarInCall: (id: string, inCall: boolean) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  avatars: new Map(),
  messages: [],
  currentUser: null,
  activeCall: null,
  callParticipants: new Set(),
  moveAvatar: (id, position) =>
    set((state) => {
      const avatars = new Map(state.avatars);
      const avatar = avatars.get(id);
      if (avatar) {
        avatars.set(id, { ...avatar, position });
      }
      return { avatars };
    }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setCurrentUser: (avatar) =>
    set(() => ({
      currentUser: avatar,
    })),
  setActiveCall: (call) =>
    set(() => ({
      activeCall: call,
    })),
  addCallParticipant: (id) =>
    set((state) => ({
      callParticipants: new Set([...state.callParticipants, id]),
    })),
  removeCallParticipant: (id) =>
    set((state) => {
      const participants = new Set(state.callParticipants);
      participants.delete(id);
      return { callParticipants: participants };
    }),
  setAvatarInCall: (id, inCall) =>
    set((state) => {
      const avatars = new Map(state.avatars);
      const avatar = avatars.get(id);
      if (avatar) {
        avatars.set(id, { ...avatar, inCall });
      }
      return { avatars };
    }),
}));