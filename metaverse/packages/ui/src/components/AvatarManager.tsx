/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface Avatar {
  id: string;
  image_url: string;
  name: string;
}

// Use Vite's environment variable (make sure your .env has VITE_API_BASE_URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AvatarManager: React.FC = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [showAddAvatar, setShowAddAvatar] = useState(false);
  const [newAvatar, setNewAvatar] = useState({
    name: '',
    image_url: ''
  });

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/avatars`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Error fetching avatars');
      }
      const data = await response.json();
      const avatarsTransformed = data.avatars.map((x: any) => ({
        id: x.id,
        image_url: x.imageUrl,
        name: x.name
      }));
      setAvatars(avatarsTransformed);
    } catch (error) {
      console.error('Error fetching avatars:', error);
    }
  };

  const handleAddAvatar = async () => {
    try {
      if (!newAvatar.name || !newAvatar.image_url) return;

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. Make sure you are logged in as an admin.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/admin/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newAvatar.name,
          imageUrl: newAvatar.image_url,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error adding avatar: ${errorText}`);
      }

      setShowAddAvatar(false);
      setNewAvatar({ name: '', image_url: '' });
      fetchAvatars();
    } catch (error) {
      console.error('Error adding avatar:', error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-xl border border-cyan-500/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-cyan-300">Your Avatars</h2>
        <button
          onClick={() => setShowAddAvatar(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Add Avatar</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {avatars.map((avatar) => (
          <motion.div
            key={avatar.id}
            className="group relative bg-cyan-900/20 rounded-lg p-4 hover:bg-cyan-900/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={avatar.image_url}
              alt={avatar.name}
              className="w-full aspect-square rounded-lg object-cover mb-2"
            />
            <p className="text-center text-cyan-300 truncate">{avatar.name}</p>
          </motion.div>
        ))}
      </div>

      {showAddAvatar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <motion.div
            className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 rounded-xl border border-cyan-500/30 w-full max-w-lg p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-cyan-300">Add New Avatar</h3>
              <button
                onClick={() => setShowAddAvatar(false)}
                className="text-cyan-500 hover:text-cyan-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-cyan-400 mb-2">Avatar Name</label>
                <input
                  type="text"
                  value={newAvatar.name}
                  onChange={(e) => setNewAvatar({ ...newAvatar, name: e.target.value })}
                  className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                  placeholder="Enter avatar name"
                />
              </div>
              <div>
                <label className="block text-cyan-400 mb-2">Image URL</label>
                <input
                  type="text"
                  value={newAvatar.image_url}
                  onChange={(e) => setNewAvatar({ ...newAvatar, image_url: e.target.value })}
                  className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAddAvatar(false)}
                  className="flex-1 px-4 py-3 border border-cyan-700/50 text-cyan-400 rounded-lg hover:bg-cyan-950/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAvatar}
                  className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                >
                  Create Avatar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AvatarManager;
