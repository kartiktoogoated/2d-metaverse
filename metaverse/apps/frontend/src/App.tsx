import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm"; 
import Features from "@repo/ui/components/Features.js";
import Footer from "@repo/ui/components/Footer.js";
import TechSpecs from "@repo/ui/components/TechSpecs.js";
import Navbar from "@repo/ui/components/Navbar.js"; //
import GameDashboard from "@repo/ui/components/GameDashboard";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Navbar /> 

      {/* Radial Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] radial-blur bg-cyan-600/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] radial-blur bg-blue-600/20 rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] radial-blur bg-teal-600/20 rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-1/4 right-0 w-[700px] h-[700px] radial-blur bg-emerald-600/20 rounded-full animate-pulse-glow" style={{ animationDelay: '3s' }} />
      </div>

      {/* Grid Pattern Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5" />

      {/* Main Sections */}
      <div className="relative min-h-screen pt-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-9xl text-glitch text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 mb-6 font-bold hover:scale-105 transition-transform duration-500">
              METAVERSE 2D
            </h1>
            <p className="text-2xl md:text-3xl text-cyan-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light typing-animation">
              &gt; INITIALIZING VIRTUAL WORLD_<br />
              &gt; CONNECTING PLAYERS_<br />
              &gt; LOADING EXPERIENCE_
            </p>

            {/*  Navigate to /GameDashboard when clicked */}
            <button
              onClick={() => navigate("/auth")}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white text-2xl pixel-corners hover:from-cyan-500 hover:via-blue-500 hover:to-teal-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 relative group"
            >
              <span className="relative z-10">ACCESS_PORTAL</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded"></div>
            </button>
          </div>

          {/* Avatar Preview */}
          <div className="mt-32 grid grid-cols-3 md:grid-cols-6 gap-8 max-w-4xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-110"
              >
                <div
                  className={`animate-float`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=player${i}&backgroundColor=transparent`}
                    alt={`Avatar ${i + 1}`}
                    className="w-20 h-20 mx-auto filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Features />
      <TechSpecs />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthForm />} /> {/* ✅ Auth Form Page */}
        <Route path="/GameDashboard" element={<GameDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
