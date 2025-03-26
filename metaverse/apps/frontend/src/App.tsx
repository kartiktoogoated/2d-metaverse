import {
  Suspense,
  lazy,
  useMemo
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Direct imports for smaller or critical components
import AuthForm from "@repo/ui/components/AuthForm";
import ScrambleOnHover from "./ScrambleOnHover";
import PrivateRoute from "./PrivateRoute";
import Navbar from "@repo/ui/components/Navbar.js"; // or wherever your Navbar is stored

// 1. Lazy-load heavier components so they don't bloat the main bundle
const Features = lazy(() => import("@repo/ui/components/Features.js"));
const TechSpecs = lazy(() => import("@repo/ui/components/TechSpecs.js"));
const Footer = lazy(() => import("@repo/ui/components/Footer.js"));

// 2. Lazy-load your route-based components as well
const KnowMore = lazy(() => import("@repo/ui/components/KnowMore"));
const Docs = lazy(() => import("@repo/ui/components/Docs"));
const ElementManager = lazy(() => import("@repo/ui/components/ElementManager"));
const Blog = lazy(() => import("@repo/ui/components/Blog"));
const GameDashboard = lazy(() => import("@repo/ui/components/GameDashboard"));
const Game = lazy(() => import("@repo/ui/components/Game"));

// Your HomePage is the landing/hero page
function HomePage() {
  const navigate = useNavigate();

  // 3. Animate the background grid with framer-motion
  const scrollData = useScroll();
  const yRange = useTransform(scrollData.scrollYProgress, [0, 1], [0, -20]);
  // Use a spring for smoother movement
  const y = useSpring(yRange, { stiffness: 50, damping: 20 });

  // 4. Memoize random particle positions so they don't change every render
  const particles = useMemo(() => {
    return Array.from({ length: 10 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      xOffset: Math.random() * 20 - 10,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-black text-cyan-100">
      <Navbar />

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 211, 238, 0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            y,
          }}
        />

        {/* Animated Radial Gradients */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-500/20 rounded-full"
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, p.xOffset, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}
        </div>

        {/* Animated Cyber Lines */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
              style={{
                top: `${20 + i * 15}%`,
                left: 0,
                right: 0,
              }}
              animate={{
                scaleX: [0, 1, 0],
                x: ["-100%", "100%", "100%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen pt-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-6xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 font-extrabold"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              METAVERSE 2D
            </motion.h1>

            <motion.div
              className="mt-8 space-y-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.3 },
                },
              }}
            >
              {[
                "BOOTING UP DIGITAL REALM_",
                "SYNCHRONIZING PLAYERS_",
                "ENTERING VIRTUAL WORLD_",
              ].map((line, i) => (
                <motion.p
                  key={i}
                  className="text-2xl md:text-3xl text-cyan-300 font-light"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <ScrambleOnHover text={line} speed={50} />
                </motion.p>
              ))}
            </motion.div>

            <motion.button
              onClick={() => navigate("/auth")}
              className="mt-12 px-8 py-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white text-2xl rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 relative group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">ENTER PORTAL</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                initial={{ x: "100%" }}
                whileHover={{ x: "-100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </motion.div>

          {/* Avatar Preview */}
          <motion.div
            className="mt-32 grid grid-cols-3 md:grid-cols-6 gap-8 max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="group cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=player${i}&backgroundColor=transparent`}
                    alt={`Avatar ${i + 1}`}
                    className="w-20 h-20 mx-auto filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-300"
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Lazy-load heavier sections after the hero */}
      <Suspense fallback={<div className="text-cyan-200 p-8">Loading Features...</div>}>
        <Features />
      </Suspense>

      <Suspense fallback={<div className="text-cyan-200 p-8">Loading TechSpecs...</div>}>
        <TechSpecs />
      </Suspense>

      <Suspense fallback={<div className="text-cyan-200 p-8">Loading Footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

// The main App component sets up routing and code-split routes
function App() {
  return (
    <Router>
      <Suspense fallback={<div className="text-cyan-200 p-8">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/knowmore" element={<KnowMore />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/create" element={<ElementManager />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/blog" element={<Blog />} />
            <Route path="/dashboard" element={<GameDashboard />} />
            <Route path="/game" element={<Game />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
