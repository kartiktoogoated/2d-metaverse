import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm"; 
import Features from "@repo/ui/components/Features.js";
import Footer from "@repo/ui/components/Footer.js";
import TechSpecs from "@repo/ui/components/TechSpecs.js";
import Navbar from "@repo/ui/components/Navbar.js"; // ✅ Ensure Navbar is included
import GameDashboard from "@repo/ui/components/GameDashboard"
import KnowMore from "@repo/ui/components/KnowMore"
import Docs from "@repo/ui/components/Docs"
import Game from "@repo/ui/components/Game"

function HomePage() {
  const navigate = useNavigate(); // ✅ Use React Router navigation

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-cyan-950 text-cyan-100 overflow-hidden">
      <Navbar /> {/* ✅ Ensure Navbar is placed at the top */}

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      {/* Main Sections */}
      <div className="relative min-h-screen pt-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 font-extrabold hover:scale-105 transition-transform duration-500">
              METAVERSE 2D
            </h1>
            <p className="text-2xl md:text-3xl text-cyan-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              &gt; BOOTING UP DIGITAL REALM_<br />
              &gt; SYNCHRONIZING PLAYERS_<br />
              &gt; ENTERING VIRTUAL WORLD_
            </p>

            {/* ✅ Navigate to /auth when clicked */}
            <button
              onClick={() => navigate("/auth")}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white text-2xl rounded-lg hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 relative group"
            >
              <span className="relative z-10">ENTER PORTAL</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded"></div>
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
        <Route path="/" element={<HomePage/>} /> 
        <Route path="/auth" element={<AuthForm />} /> {/* ✅ Auth Form Page */}
        <Route path="/game" element={<GameDashboard />} /> {/* ✅ Game Dashboard Page */}
        <Route path="/knowmore" element={<KnowMore />} /> {/* ✅ KnowMore Page */}
        <Route path="/docs" element={<Docs />} /> {/* ✅ Docs Page */}
        <Route path="/game/space/:spaceId" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
