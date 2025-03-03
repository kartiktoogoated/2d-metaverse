/* eslint-disable @typescript-eslint/no-explicit-any */
const WS_URL = "ws://localhost:3001";
let socket: WebSocket | null = null;
let onMessageCallback: ((message: any) => void) | null = null;
const messageQueue: any[] = []; // Store messages if WS is not ready
let isReconnecting = false;

/**
 * Initializes a WebSocket connection and handles reconnections.
 */
const connectWebSocket = () => {
  if (socket) {
    socket.close(); // Close any existing socket before creating a new one
  }

  console.log("📡 Establishing WebSocket connection...");
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("✅ WebSocket connected.");
    isReconnecting = false;

    // Send any queued messages
    while (messageQueue.length > 0) {
      const message = messageQueue.shift();
      sendMessage(message);
    }
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (onMessageCallback) onMessageCallback(message);
  };

  socket.onclose = (event) => {
    console.warn("❌ WebSocket disconnected. Reason:", event.reason);
    if (!isReconnecting) {
      isReconnecting = true;
      setTimeout(connectWebSocket, 2000); // Reconnect after 2 seconds
    }
  };

  socket.onerror = (error) => {
    console.error("⚠️ WebSocket error:", error);
    // Optionally, attempt reconnection if needed on error
  };
};

/**
 * Sets the callback function for receiving messages.
 * @param callback Function to handle incoming messages.
 */
export const setOnMessage = (callback: (message: any) => void) => {
  onMessageCallback = callback;
};

/**
 * Sends a message through WebSocket or queues it if not ready.
 * @param message The message to send.
 */
export const sendMessage = (message: any) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn("⚠️ WebSocket not open. Queuing message:", message);
    messageQueue.push(message); // Queue the message if WebSocket isn't open
  }
};

// Start WebSocket connection on load
connectWebSocket();
