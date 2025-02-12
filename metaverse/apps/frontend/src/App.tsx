import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Game from "./components/Game";
import { Globe2, Users, MessageSquare, Sparkles, Gamepad2, Cpu, Boxes } from "lucide-react";

function MetaverseLanding() {
  const navigate = useNavigate(); // Hook to navigate between routes

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl text-glitch text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-6">
              METAVERSE 2D
            </h1>
            <p className="text-2xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              &gt; INITIALIZING VIRTUAL WORLD_<br />
              &gt; CONNECTING PLAYERS_<br />
              &gt; LOADING EXPERIENCE_
            </p>
            <button
              onClick={() => navigate("/game")} // Navigate to /game
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-2xl pixel-corners hover:from-purple-500 hover:to-indigo-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              START_GAME.exe
            </button>
          </div>

          {/* Avatar Preview */}
          <div className="mt-24 grid grid-cols-3 md:grid-cols-6 gap-8 max-w-4xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                <img
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=player${i}&backgroundColor=transparent`}
                  alt={`Avatar ${i + 1}`}
                  className="w-20 h-20 mx-auto filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 bg-purple-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl text-center text-purple-300 mb-16">&gt; SYSTEM_FEATURES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Feature icon={<Users className="w-8 h-8 text-purple-400" />} title="MULTIPLAYER" description="Connect with friends and meet new players in our virtual spaces." />
            <Feature icon={<MessageSquare className="w-8 h-8 text-purple-400" />} title="REAL-TIME CHAT" description="Communicate seamlessly through our integrated chat system." />
            <Feature icon={<Globe2 className="w-8 h-8 text-purple-400" />} title="VIRTUAL SPACES" description="Explore unique environments and create memorable experiences." />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <Stat icon={<Gamepad2 className="w-12 h-12 mx-auto mb-4 text-purple-400" />} value="1000+" label="Active Players" />
            <Stat icon={<Cpu className="w-12 h-12 mx-auto mb-4 text-purple-400" />} value="50ms" label="Average Latency" />
            <Stat icon={<Boxes className="w-12 h-12 mx-auto mb-4 text-purple-400" />} value="10+" label="Virtual Rooms" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-purple-950/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-purple-200 text-xl">METAVERSE_2D</span>
          </div>
          <p className="text-purple-400 text-xl">© 2025 ALL_RIGHTS_RESERVED</p>
        </div>
      </footer>
    </div>
  );
}

// Reusable Feature Component
function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-6 pixel-corners bg-purple-900/20 backdrop-blur-sm border border-purple-700/20">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-600/20 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-2xl text-purple-200 mb-4">{title}</h3>
      <p className="text-purple-300 text-xl">{description}</p>
    </div>
  );
}

// Reusable Stat Component
function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      {icon}
      <div className="text-4xl text-purple-200 mb-2">{value}</div>
      <div className="text-xl text-purple-400">{label}</div>
    </div>
  );
}

// Main App Component with Routes
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MetaverseLanding />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
