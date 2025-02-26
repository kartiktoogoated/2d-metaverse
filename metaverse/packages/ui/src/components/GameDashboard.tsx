import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Radial Orb Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-600/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 to-transparent rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse-glow"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-teal-600/20 to-transparent rounded-full animate-pulse-glow"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute -bottom-1/4 right-0 w-[700px] h-[700px] bg-gradient-to-br from-emerald-600/20 to-transparent rounded-full animate-pulse-glow"
          style={{ animationDelay: '3s' }}
        />
      </div>

      {/* Grid Pattern Background (custom class - define in Tailwind config or extra CSS) */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      {/* Navbar */}
      <nav className="absolute top-0 w-full z-30 p-4 flex justify-between items-center">
        <div className="text-white text-2xl font-bold tracking-wider">Metaverse 2D</div>
        <button
          onClick={() => navigate("/auth")}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white rounded hover:from-cyan-500 hover:via-blue-500 hover:to-teal-500 transition-all duration-300"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-10 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-r-lg shadow-xl m-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-wider">Dashboard</h2>
          </div>
          <nav className="flex flex-col space-y-4">
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 text-white transition-colors">
              Overview
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 text-white transition-colors">
              Maps
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 text-white transition-colors">
              Players
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 text-white transition-colors">
              Inventory
            </a>
            <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 text-white transition-colors">
              Settings
            </a>
          </nav>
        </aside>

        {/* Main Dashboard Panel */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Map Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">World Map</h3>
              <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">[Map Placeholder]</span>
              </div>
            </div>

            {/* User Info Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">User Info</h3>
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src="/path-to-avatar.png"
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full border-2 border-cyan-500"
                />
                <div>
                  <p className="text-white text-xl font-semibold">YourUsername</p>
                  <p className="text-gray-400">Level 10 Wizard</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-white">
                  HP: <span className="font-bold">80/100</span>
                </p>
                <p className="text-white">
                  MP: <span className="font-bold">45/50</span>
                </p>
                <p className="text-white">
                  EXP: <span className="font-bold">1200/2000</span>
                </p>
              </div>
            </div>

            {/* Game Stats Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">Game Stats</h3>
              <ul className="space-y-3 text-white">
                <li className="flex justify-between">
                  <span>Kills:</span> <span className="font-bold">23</span>
                </li>
                <li className="flex justify-between">
                  <span>Deaths:</span> <span className="font-bold">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Quests:</span> <span className="font-bold">12</span>
                </li>
                <li className="flex justify-between">
                  <span>Gold:</span> <span className="font-bold">1,245</span>
                </li>
              </ul>
            </div>

            {/* Online Players Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">Online Players</h3>
              <ul className="space-y-2 text-white">
                <li className="border-b border-gray-700 pb-2">Player1</li>
                <li className="border-b border-gray-700 pb-2">Player2</li>
                <li className="border-b border-gray-700 pb-2">Player3</li>
                <li className="border-b border-gray-700 pb-2">Player4</li>
              </ul>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg shadow-2xl col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">Recent Activity</h3>
              <ul className="space-y-2 text-gray-300 text-lg">
                <li className="border-b border-gray-700 pb-2">[10:23] Player2 joined the world</li>
                <li className="border-b border-gray-700 pb-2">[10:45] You completed the "Goblin's Cave" quest</li>
                <li className="border-b border-gray-700 pb-2">[11:02] Player3 found a rare item</li>
                <li className="border-b border-gray-700 pb-2">[11:15] Player1 left the party</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
