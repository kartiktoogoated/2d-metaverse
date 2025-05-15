import { WebSocketServer, WebSocket } from 'ws';
import { User } from './User';
import { Logger } from './logger';

/**
 * Entry point for the WebSocket server.
 */
const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws: WebSocket) {
  Logger.info('User connected');
  let user: User | null = null;
  try {
    user = new User(ws);
  } catch (err) {
    Logger.error('Failed to create user on connection:', err);
    ws.close();
    return;
  }
  ws.on('error', (err) => {
    Logger.error('WebSocket error:', err);
    user?.destroy();
  });
  ws.on('close', () => {
    user?.destroy();
  });
});

wss.on('error', (err) => {
  Logger.error('WebSocketServer error:', err);
});