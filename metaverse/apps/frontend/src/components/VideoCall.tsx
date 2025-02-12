import React, { useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const VideoCall: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { activeCall, setActiveCall, removeCallParticipant, currentUser } = useGameStore();
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);

  useEffect(() => {
    if (activeCall?.stream && videoRef.current) {
      videoRef.current.srcObject = activeCall.stream;
    }
  }, [activeCall?.stream]);

  const handleEndCall = () => {
    if (currentUser) {
      removeCallParticipant(currentUser.id);
      setActiveCall(null);
    }
  };

  if (!activeCall) return null;

  return (
    <div className="fixed bottom-4 left-4 w-72 bg-purple-900/90 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="p-2">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg mb-2"
          style={{ display: isVideoOff ? 'none' : 'block' }}
        />
        {isVideoOff && (
          <div className="w-full h-40 bg-purple-800 rounded-lg flex items-center justify-center">
            <VideoOff className="text-purple-300" size={40} />
          </div>
        )}
        <div className="flex justify-center gap-4 p-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            {isMuted ? (
              <MicOff className="text-red-400" size={20} />
            ) : (
              <Mic className="text-purple-300" size={20} />
            )}
          </button>
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className="p-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            {isVideoOff ? (
              <VideoOff className="text-red-400" size={20} />
            ) : (
              <Video className="text-purple-300" size={20} />
            )}
          </button>
          <button
            onClick={handleEndCall}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="text-white" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};