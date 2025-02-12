import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const { messages, addMessage, currentUser } = useGameStore();

  const handleSend = () => {
    if (!message.trim() || !currentUser) return;

    addMessage({
      id: Date.now().toString(),
      sender: currentUser.username,
      content: message,
      timestamp: Date.now(),
    });
    setMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-80">
      <div className="bg-purple-900/90 rounded-lg shadow-lg backdrop-blur-sm">
        <div
          className="p-3 bg-purple-800 text-purple-100 rounded-t-lg cursor-pointer flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <MessageSquare size={20} />
            <span>Chat</span>
          </div>
        </div>
        {isOpen && (
          <>
            <div className="h-64 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 ${
                    msg.sender === currentUser?.username
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  <span className="text-xs text-purple-300">{msg.sender}</span>
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === currentUser?.username
                        ? 'bg-purple-700 text-purple-100'
                        : 'bg-purple-800/50 text-purple-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-purple-700/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 px-3 py-2 bg-purple-800/50 text-purple-100 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-purple-600 text-purple-100 rounded-lg hover:bg-purple-500 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};