import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';

interface Element {
  id: string;
  width: number;
  height: number;
  image_url: string;
}

// Use Vite's environment variable (make sure your .env has VITE_API_BASE_URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ElementManager: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [showAddElement, setShowAddElement] = useState(false);
  const [newElement, setNewElement] = useState({
    width: 100,
    height: 100,
    image_url: ''
  });

  useEffect(() => {
    fetchElements();
  }, []);

  const fetchElements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/elements`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Error fetching elements');
      }
      const data = await response.json();
      // If the API returns an object with an "elements" property, use it; otherwise, use data directly.
      const elementsData = data.elements ? data.elements : data;
      setElements(elementsData);
    } catch (error) {
      console.error('Error fetching elements:', error);
    }
  };

  const handleAddElement = async () => {
    try {
      if (!newElement.image_url) return;

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. Make sure you are logged in as an admin.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/admin/element`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(newElement)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error adding element: ${errorText}`);
      }

      setShowAddElement(false);
      setNewElement({ width: 100, height: 100, image_url: '' });
      fetchElements();
    } catch (error) {
      console.error('Error adding element:', error);
    }
  };

  const handleDeleteElement = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. Make sure you are logged in as an admin.');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/element/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error deleting element: ${errorText}`);
      }
      fetchElements();
    } catch (error) {
      console.error('Error deleting element:', error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-xl border border-cyan-500/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-cyan-300">Space Elements</h2>
        <button
          onClick={() => setShowAddElement(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Add Element</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {elements.map((element) => (
          <motion.div
            key={element.id}
            className="group relative bg-cyan-900/20 rounded-lg p-4 hover:bg-cyan-900/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={element.image_url}
              alt={`Element ${element.id}`}
              className="w-full aspect-square rounded-lg object-cover mb-2"
            />
            <div className="text-center text-cyan-300 text-sm">
              <p>{element.width}x{element.height}</p>
            </div>
            <button
              onClick={() => handleDeleteElement(element.id)}
              className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="text-white" size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      {showAddElement && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <motion.div
            className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 rounded-xl border border-cyan-500/30 w-full max-w-lg p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl text-cyan-300">Add New Element</h3>
              <button
                onClick={() => setShowAddElement(false)}
                className="text-cyan-500 hover:text-cyan-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-400 mb-2">Width (px)</label>
                  <input
                    type="number"
                    value={newElement.width}
                    onChange={(e) => setNewElement({ ...newElement, width: parseInt(e.target.value) })}
                    className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-cyan-400 mb-2">Height (px)</label>
                  <input
                    type="number"
                    value={newElement.height}
                    onChange={(e) => setNewElement({ ...newElement, height: parseInt(e.target.value) })}
                    className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-cyan-400 mb-2">Image URL</label>
                <input
                  type="text"
                  value={newElement.image_url}
                  onChange={(e) => setNewElement({ ...newElement, image_url: e.target.value })}
                  className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAddElement(false)}
                  className="flex-1 px-4 py-3 border border-cyan-700/50 text-cyan-400 rounded-lg hover:bg-cyan-950/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddElement}
                  className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                >
                  Create Element
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ElementManager;
