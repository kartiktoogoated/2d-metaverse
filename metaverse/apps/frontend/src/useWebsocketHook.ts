/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:3001";

export const useWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const establishConnection = () => {
      socketRef.current = new WebSocket(WS_URL);

      socketRef.current.onopen = () => {
        setIsConnected(true);
      };

      socketRef.current.onclose = () => {
        setIsConnected(false);
        setTimeout(establishConnection, 3000); // Reconnect after 3 seconds
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    establishConnection();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  const setOnMessage = (callback: (message: any) => void) => {
    if (socketRef.current) {
      socketRef.current.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          callback(parsedData);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    }
  };

  return { sendMessage, setOnMessage, isConnected };
};
