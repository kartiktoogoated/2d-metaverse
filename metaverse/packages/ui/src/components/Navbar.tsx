import { Sparkles } from "lucide-react";

export default function AuthForm() {

  return (
    <nav className="fixed top-0 w-full z-40 bg-black/50 backdrop-blur-sm border-b border-cyan-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 group">
          <Sparkles className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <span className="text-cyan-200 text-xl group-hover:text-cyan-100 transition-colors">
            METAVERSE_2D
          </span>
        </div>

        {/* ✅ Redirect to /auth when clicked */}
        {/* <button
          onClick={() => navigate("/auth")}
          className="px-6 py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white rounded-full hover:from-cyan-500 hover:via-blue-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 font-medium tracking-wide"
        >
          ACCESS_PORTAL
        </button> */}
      </div>
    </nav>
  );
}
