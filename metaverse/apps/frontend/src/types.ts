export interface Position {
    x: number;
    y: number;
  }
  
  export interface Avatar {
    id: string;
    position: Position;
    username: string;
    inCall?: boolean;
  }
  
  export interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: number;
  }
  
  export interface CallConnection {
    peerId: string;
    stream: MediaStream;
  }
  
  export interface GameState {
    avatars: Map<string, Avatar>;
    messages: Message[];
    currentUser: Avatar | null;
    activeCall: CallConnection | null;
    callParticipants: Set<string>;
  }