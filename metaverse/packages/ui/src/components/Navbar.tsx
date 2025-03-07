import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-40 bg-black/50 backdrop-blur-sm border-b border-cyan-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 group">
          <Sparkles className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <span className="text-cyan-200 text-xl group-hover:text-cyan-100 transition-colors">
            METAVERSE_2D
          </span>
        </div>

        <div className="flex space-x-4">
          {/* ✅ Redirect to /dashboard when clicked */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white rounded-full hover:from-green-500 hover:via-teal-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 font-medium tracking-wide"
          >
            GAME
          </button>

          {/* ✅ Redirect to /knowmore when clicked */}
          <button
            onClick={() => navigate("/knowmore")}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white rounded-full hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 font-medium tracking-wide"
          >
            KNOW MORE
          </button>
        </div>
      </div>
    </nav>
  );
}
