/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { 
  Map, 
  Users, 
  Settings, 
  LogOut, 
  User, 
  Trophy, 
  Gamepad2, 
  MessageSquare, 
  Crown,
  Zap,
  Star,
  Sparkles
} from 'lucide-react';

interface PlayerStats {
  rank: number;
  name: string;
  score: number;
  isOnline: boolean;
}
const GameDashboard: React.FC = () => {
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);

  const worlds = [
    {
      id: '1',
      name: 'Neo Tokyo',
      image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1000&q=80',
      players: 128,
      difficulty: 'Medium'
    },
    {
      id: '2',
      name: 'Crystal Valley',
      image: 'https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106?auto=format&fit=crop&w=1000&q=80',
      players: 95,
      difficulty: 'Hard'
    },
    {
      id: '3',
      name: 'Digital Oasis',
      image: 'https://images.unsplash.com/photo-1510906594845-bc082582c8cc?auto=format&fit=crop&w=1000&q=80',
      players: 156,
      difficulty: 'Easy'
    }
  ];

  const leaderboard: PlayerStats[] = [
    { rank: 1, name: "CyberNinja", score: 15000, isOnline: true },
    { rank: 2, name: "PixelMaster", score: 14500, isOnline: false },
    { rank: 3, name: "QuantumKnight", score: 14200, isOnline: true },
    { rank: 4, name: "ByteWarrior", score: 13800, isOnline: true },
    { rank: 5, name: "DataPhantom", score: 13500, isOnline: false }
  ];

  const playerStats = {
    level: 42,
    xp: 8750,
    nextLevel: 10000,
    achievements: 24,
    playtime: '127h',
    worlds: 8
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-20 bg-cyan-950/30 border-r border-cyan-500/20 flex flex-col items-center py-8 space-y-8">
        <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group hover:bg-cyan-500/30 transition-all cursor-pointer">
          <Sparkles className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
        </div>
        <div className="flex-1 flex flex-col space-y-4">
          <button className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group hover:bg-cyan-500/30 transition-all">
            <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
          </button>
          <button className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group hover:bg-cyan-500/30 transition-all">
            <Trophy className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
          </button>
          <button className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group hover:bg-cyan-500/30 transition-all">
            <Users className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
          </button>
          <button className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group hover:bg-cyan-500/30 transition-all">
            <MessageSquare className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
          </button>
        </div>
        <div className="space-y-4">
          <button className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group hover:bg-cyan-500/30 transition-all">
            <Settings className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
          </button>
          <button className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center group hover:bg-red-500/30 transition-all">
            <LogOut className="w-6 h-6 text-red-400 group-hover:text-red-300" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-20 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-cyan-300 mb-2">Welcome back, Commander</h1>
            <p className="text-cyan-400">Your next mission awaits in the digital realm</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-cyan-300">Level {playerStats.level}</p>
              <div className="w-48 h-2 bg-cyan-950 rounded-full mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: `${(playerStats.xp / playerStats.nextLevel) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <User className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-12 gap-8">
          {/* Player Stats */}
          <div className="col-span-3 space-y-6">
            <div className="bg-cyan-950/30 rounded-2xl p-6 border border-cyan-500/20">
              <h2 className="text-xl text-cyan-300 mb-6">Player Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">Level</span>
                  <span className="text-cyan-300">{playerStats.level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">Achievements</span>
                  <span className="text-cyan-300">{playerStats.achievements}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">Playtime</span>
                  <span className="text-cyan-300">{playerStats.playtime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">Worlds Explored</span>
                  <span className="text-cyan-300">{playerStats.worlds}</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-cyan-950/30 rounded-2xl p-6 border border-cyan-500/20">
              <h2 className="text-xl text-cyan-300 mb-6">Recent Achievements</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-cyan-900/20 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-cyan-300">World Master</p>
                    <p className="text-sm text-cyan-400">Complete all challenges</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-cyan-900/20 rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-cyan-300">Speed Demon</p>
                    <p className="text-sm text-cyan-400">Finish under 2 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Worlds */}
          <div className="col-span-6">
            <div className="bg-cyan-950/30 rounded-2xl p-6 border border-cyan-500/20">
              <h2 className="text-xl text-cyan-300 mb-6">Available Worlds</h2>
              <div className="grid grid-cols-2 gap-4">
                {worlds.map((world) => (
                  <div
                    key={world.id}
                    className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedWorld === world.id
                        ? 'border-cyan-400'
                        : 'border-transparent hover:border-cyan-500/50'
                    }`}
                    onClick={() => setSelectedWorld(world.id)}
                  >
                    <div className="relative h-48">
                      <img
                        src={world.image}
                        alt={world.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg text-cyan-300 mb-1">{world.name}</h3>
                        <div className="flex justify-between text-sm">
                          <span className="text-cyan-400">
                            <Users className="w-4 h-4 inline mr-1" />
                            {world.players}
                          </span>
                          <span className="text-cyan-400">{world.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="col-span-3">
            <div className="bg-cyan-950/30 rounded-2xl p-6 border border-cyan-500/20">
              <h2 className="text-xl text-cyan-300 mb-6">Top Players</h2>
              <div className="space-y-4">
                {leaderboard.map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center gap-4 p-3 bg-cyan-900/20 rounded-lg"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      player.rank === 1 ? 'bg-yellow-500/20' :
                      player.rank === 2 ? 'bg-gray-400/20' :
                      player.rank === 3 ? 'bg-amber-700/20' : 'bg-cyan-800/20'
                    }`}>
                      {player.rank === 1 && <Crown className="w-4 h-4 text-yellow-400" />}
                      {player.rank > 1 && <span className="text-cyan-300">#{player.rank}</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-300">{player.name}</span>
                        <span className={`w-2 h-2 rounded-full ${player.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                      </div>
                      <p className="text-sm text-cyan-400">{player.score.toLocaleString()} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;