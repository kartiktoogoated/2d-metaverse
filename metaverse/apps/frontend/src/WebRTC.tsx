import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createRoom = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://18.215.159.145:3002/room'); // Calls WebSocket server
      const data = await response.json();
      navigate(`/room/${data.roomId}`); // Redirects user to the new room
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">WebRTC Video Chat</h1>
      <button
        onClick={createRoom}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Creating Room...' : 'Start a Call'}
      </button>
    </div>
  );
}
