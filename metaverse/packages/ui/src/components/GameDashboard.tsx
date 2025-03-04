import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Sparkles,
  Plus,
  Trash2,
  X
} from 'lucide-react';

interface PlayerStats {
  rank: number;
  name: string;
  score: number;
  isOnline: boolean;
}


const GameDashboard: React.FC = () => {
  const navigate = useNavigate(); // ✅ Ensure navigator is defined
  
  // ✅ Ensure state includes necessary properties
  const [spaces, setSpaces] = useState<{ id: string; name: string; thumbnail: string; players: number; difficulty: string; }[]>([]);
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const [newSpace, setNewSpace] = useState({
    name: "",
    description: "",
    dimensions: "10x10",
    mapId: "",
    difficulty: "Medium",
  });

  useEffect(() => {
    const storedSpaces = sessionStorage.getItem("spaces");
    if (storedSpaces) {
      setSpaces(JSON.parse(storedSpaces));
    } else {
      fetchSpaces();
    }
  }, []);
  

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

  const fetchSpaces = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        return;
      }

      const response = await fetch("http://18.215.159.145:3002/api/v1/space/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch spaces");

      const data = await response.json();
      setSpaces(data.spaces || []);
    } catch (error) {
      console.error("❌ Error fetching spaces:", error);
    }
  };

  // ✅ Handle space creation
  const handleCreateSpace = async () => {
    if (!newSpace.name.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        return;
      }

      const response = await fetch("http://18.215.159.145:3002/api/v1/space", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(newSpace),
      });

      if (!response.ok) throw new Error("Failed to create space");

      const data = await response.json();

      // ✅ Update spaces state
      setSpaces((prevSpaces) => [
        ...prevSpaces,
        {
          id: data.spaceId,
          name: newSpace.name,
          thumbnail: data.thumbnail || "https://plus.unsplash.com/premium_photo-1669839137069-4166d6ea11f4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          players: 0,
          difficulty: newSpace.difficulty,
        },
      ]);

      // ✅ Reset & close modal
      setShowCreateSpace(false);
      setNewSpace({ name: "", description: "", dimensions: "10x10", mapId: "", difficulty: "Medium" });

    } catch (error) {
      console.error("❌ Error creating space:", error);
    }
  };
  

  const handleDeleteSpace = async (id: string) => {
    try {
      const token = localStorage.getItem("token"); // Ensure token is included
      if (!token) {
        console.error("❌ No token found");
        return;
      }
  
      const response = await fetch(`http://18.215.159.145:3002/api/v1/space/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Ensure Authorization header is sent
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete space");
      }
  
      setSpaces((prevSpaces) => prevSpaces.filter((space) => space.id !== id)); // ✅ Update UI
      console.log("✅ Space deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting space:", error);
    }
  };
  
  

  const handleOpenSpace = (spaceId: string) => {
    if (!spaceId) {
      console.error("❌ Space ID is missing");
      return;
    }
    navigate(`/game/space/${spaceId}`);
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

          {/* space */}
<div className="col-span-6">
  <div className="bg-cyan-950/30 rounded-2xl p-6 border border-cyan-500/20">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl text-cyan-300">Your space</h2>
      <button
        onClick={() => setShowCreateSpace(true)}
        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
      >
        <Plus size={20} />
        <span>Create Space</span>
      </button>
    </div>

    {spaces.length === 0 ? (
      <div className="text-center py-12">
        <Map className="w-16 h-16 mx-auto text-cyan-500/50 mb-4" />
        <h3 className="text-xl text-cyan-300 mb-2">No space Yet</h3>
        <p className="text-cyan-400 mb-6">Create your first space to get started</p>
        <button
          onClick={() => setShowCreateSpace(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Create Your First Space</span>
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-4">
        {spaces.map((space) => (
          <div
            key={space.id}
            className="group cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-cyan-500/50 transition-all duration-300"
          ><div 
          key={space.id}
          className="group cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-cyan-500/50 transition-all duration-300 relative"
          onClick={() => handleOpenSpace(space.id)}
        >
          {/* Space Image */}
          <img
            src={space.thumbnail || 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?q=80&w=1959&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
            alt={space.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        
          {/* Overlay to prevent unwanted click blocking */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        
          {/* ✅ Clickable Delete Button (Independent from Parent Click) */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents the space click event
              handleDeleteSpace(space.id);
            }}
            className="absolute top-3 right-3 bg-red-600 p-2 rounded-full hover:bg-red-700 transition shadow-md z-10"
          >
            <Trash2 className="text-white" size={18} />
          </button>
        
          {/* Enter Button (Ensures Click Works) */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors z-10">
              Enter Space
            </button>
          
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg text-cyan-300 mb-1">{space.name}</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-400">
                    <Users className="w-4 h-4 inline mr-1" />
                    {space.players || 0}
                  </span>
                  <span className="text-cyan-400">{space.difficulty || 'Medium'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
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

      {/* Create Space Modal */}
{showCreateSpace && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
    <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 rounded-xl border border-cyan-500/30 w-full max-w-lg p-6">
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl text-cyan-300">Create New Space</h3>
        <button
          onClick={() => setShowCreateSpace(false)}
          className="text-cyan-500 hover:text-cyan-300 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Modal Content */}
      <div className="space-y-4">
        {/* Space Name */}
        <div>
          <label className="block text-cyan-400 mb-2">Space Name</label>
          <input
            type="text"
            value={newSpace.name}
            onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
            className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
            placeholder="Enter space name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-cyan-400 mb-2">Description</label>
          <textarea
            value={newSpace.description}
            onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
            className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 h-32"
            placeholder="Enter a short description"
            required
          />
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-cyan-400 mb-2">Dimensions (Width x Height)</label>
          <input
            type="text"
            value={newSpace.dimensions}
            onChange={(e) => setNewSpace({ ...newSpace, dimensions: e.target.value })}
            className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
            placeholder="e.g., 10x10"
            required
          />
        </div>

        {/* Map ID (Optional) */}
        <div>
          <label className="block text-cyan-400 mb-2">Map ID (Optional)</label>
          <input
            type="text"
            value={newSpace.mapId || ""}
            onChange={(e) => setNewSpace({ ...newSpace, mapId: e.target.value })}
            className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
            placeholder="Enter map ID if available"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-cyan-400 mb-2">Difficulty Level</label>
          <select
            value={newSpace.difficulty}
            onChange={(e) => setNewSpace({ ...newSpace, difficulty: e.target.value })}
            className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setShowCreateSpace(false)}
            className="flex-1 px-4 py-3 border border-cyan-700/50 text-cyan-400 rounded-lg hover:bg-cyan-950/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateSpace}
            className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
          >
            Create Space
          </button>
        </div>
      </div>
    </div>
  </div>
)}
</div>
  );
};

export default GameDashboard;