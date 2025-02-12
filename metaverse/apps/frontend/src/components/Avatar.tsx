import React from 'react';
import { UserCircle, Video } from 'lucide-react';
import { Avatar as AvatarType } from '../types';

interface AvatarProps {
  avatar: AvatarType;
  isCurrentUser?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ avatar, isCurrentUser }) => {
  return (
    <div
      className={`absolute transition-all duration-200 ease-in-out`}
      style={{
        transform: `translate(${avatar.position.x}px, ${avatar.position.y}px)`,
      }}
    >
      <div className="relative">
        <UserCircle
          size={40}
          className={`${
            isCurrentUser ? 'text-purple-400' : 'text-purple-600'
          } ${avatar.inCall ? 'ring-2 ring-green-400 rounded-full' : ''}`}
        />
        {avatar.inCall && (
          <Video
            size={16}
            className="absolute -top-1 -right-1 text-green-400"
          />
        )}
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium text-purple-200 whitespace-nowrap">
          {avatar.username}
        </span>
      </div>
    </div>
  );
};