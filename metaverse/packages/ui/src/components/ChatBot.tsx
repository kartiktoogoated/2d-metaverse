import React, { useState } from "react";
import { X } from "lucide-react";

interface ChatMessage {
  sender: "bot" | "user";
  text: string;
}

interface ChatbotProps {
  show: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ show, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "Hello Commander, how can I assist you today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!show) return null;

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const inputValue = userInput.trim();
    // Append user's message to chat
    setMessages((prev) => [...prev, { sender: "user", text: inputValue }]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://98.82.0.57:3002/api/v1/chatbot/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: inputValue,
            chatbot_name: "metaverse",
            username: "kartiktoogoated",
            conversation_id: null,
          }),
        }
      );
      // Suppose you do something like:
      const data = await response.json();

      // Then:
      const botReply = data.output || "No response received.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: unable to fetch response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 rounded-xl border border-cyan-500/30 w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl text-cyan-300">AI Assistant</h3>
          <button
            onClick={onClose}
            className="text-cyan-500 hover:text-cyan-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {/* Chat Messages */}
        <div className="flex flex-col space-y-2 max-h-80 overflow-y-auto mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.sender === "user"
                    ? "bg-cyan-700 text-white"
                    : "bg-cyan-900/50 text-cyan-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg max-w-xs bg-cyan-900/50 text-cyan-100">
                Loading...
              </div>
            </div>
          )}
        </div>
        {/* Input and Send Button */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-black/50 border border-cyan-700/50 text-cyan-100 px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
