import { Sparkles } from "lucide-react";
import { useState } from "react";

export default function AuthForm() {
  const [showAuthForm, setShowAuthForm] = useState(false);

  return (
    <>
      {showAuthForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-black/90 p-8 rounded-lg border border-cyan-500/30 w-full max-w-md animate-slide-up relative">
            <h2 className="text-3xl text-cyan-300 mb-6 text-center text-glow">ACCESS_PORTAL</h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="EMAIL"
                className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all transform hover:scale-[1.02]"
              />
              <input
                type="password"
                placeholder="PASSWORD"
                className="w-full bg-black/50 border border-cyan-700/50 text-cyan-100 px-4 py-3 rounded focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all transform hover:scale-[1.02]"
              />
              <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded hover:from-cyan-500 hover:to-blue-500 transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25">
                LOGIN
              </button>
              <div className="text-center text-cyan-400">or</div>
              <button className="w-full bg-black border border-cyan-700/50 text-cyan-100 py-3 rounded hover:bg-cyan-950/30 transition-all transform hover:scale-[1.02] hover:border-cyan-500/50">
                REGISTER
              </button>
            </div>
            <button
              onClick={() => setShowAuthForm(false)}
              className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transform hover:rotate-90 transition-all duration-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <nav className="fixed top-0 w-full z-40 bg-black/50 backdrop-blur-sm border-b border-cyan-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <Sparkles className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="text-cyan-200 text-xl group-hover:text-cyan-100 transition-colors">METAVERSE_2D</span>
          </div>
          <button
            onClick={() => setShowAuthForm(true)}
            className="px-6 py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white rounded-full hover:from-cyan-500 hover:via-blue-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 font-medium tracking-wide"
          >
            ACCESS_PORTAL
          </button>
        </div>
      </nav>
    </>
  );
}
