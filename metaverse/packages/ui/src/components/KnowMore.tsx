/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Users,
  Video,
  MessageSquare,
  Code,
  Database,
  Server,
  Globe,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  ChevronRight,
  ExternalLink,
  Zap,
  Shield,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";

const KnowMore: React.FC = () => {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current[index] = el;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-cyan-950 text-cyan-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-cyan-900/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-xl font-bold text-cyan-300">
                Metaverse 2D
              </span>
            </Link>
            <nav>
              <ul className="flex gap-8">
                <li>
                  <Link
                    to="/"
                    className="text-cyan-400 hover:text-cyan-100 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/knowmore"
                    className="text-cyan-300 hover:text-cyan-100 transition-colors"
                  >
                    Learn More
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-cyan-400 hover:text-cyan-100 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div
        ref={(el) => addToRefs(el, 0)}
        className="py-24 relative opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse-glow"></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-glow"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
              Discover Metaverse 2D
            </h1>
            <p className="text-2xl text-cyan-300 mb-8">
              A next-generation platform for virtual collaboration and social
              interaction
            </p>
            <div className="flex justify-center">
              <a
                href="#overview"
                className="flex items-center gap-2 px-6 py-3 bg-cyan-900/30 rounded-full text-cyan-300 hover:bg-cyan-800/40 transition-all"
              >
                <span>Explore</span>
                <ChevronDown className="animate-bounce" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div
        id="overview"
        ref={(el) => addToRefs(el, 1)}
        className="py-24 relative opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-cyan-300 mb-6">
                Project Overview
              </h2>
              <p className="text-lg text-cyan-400 mb-6">
                Metaverse 2D is a revolutionary platform that brings the concept
                of a metaverse to life in a 2D environment, making it accessible
                across all devices without the need for specialized hardware.
              </p>
              <p className="text-lg text-cyan-400 mb-6">
                Our platform enables real-time interaction between users in a
                shared virtual space, complete with video communication, instant
                messaging, and customizable environments.
              </p>
              <p className="text-lg text-cyan-400">
                Whether you're looking to host virtual meetings, educational
                sessions, social gatherings, or gaming events, Metaverse 2D
                provides the perfect digital space for meaningful connections.
              </p>
            </div>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-cyan-950/50 to-purple-950/50 rounded-2xl border border-cyan-500/30 p-1 shadow-2xl shadow-cyan-500/10 overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1602620502036-e52519d58d92?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Metaverse Overview"
                  className="rounded-xl w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300">Live Environment</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-300">Active Users: 1,247</span>
                    <span className="text-cyan-300">Worlds: 24</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-cyan-950/80 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30 shadow-lg">
                <div className="flex items-center gap-3">
                  <Users className="text-cyan-400" />
                  <div>
                    <div className="text-cyan-300 font-medium">1000+</div>
                    <div className="text-xs text-cyan-400">Active Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div
        ref={(el) => addToRefs(el, 2)}
        className="py-24 bg-gradient-to-b from-cyan-950/30 to-black/30 relative opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-cyan-300 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-cyan-400 max-w-3xl mx-auto">
              Our platform offers a comprehensive set of features designed to
              create an immersive and interactive experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-400/40 transition-all group hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-all">
                <Users className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                Real-time Interaction
              </h3>
              <p className="text-cyan-400 mb-4">
                See other users moving in real-time as they navigate through the
                virtual space, creating a truly immersive experience.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Smooth avatar movements</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">
                    Proximity-based interactions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Real-time user presence</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-400/40 transition-all group hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-all">
                <Video className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                Video Communication
              </h3>
              <p className="text-cyan-400 mb-4">
                Connect face-to-face with other users through seamless
                WebRTC-powered video calls when you enter communication zones.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">HD video quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Spatial audio support</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Low-latency connections</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-400/40 transition-all group hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-all">
                <MessageSquare className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                Instant Messaging
              </h3>
              <p className="text-cyan-400 mb-4">
                Chat with individuals or groups through our real-time messaging
                system, keeping communication flowing seamlessly.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Private & group chats</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Rich text formatting</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Message history</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-400/40 transition-all group hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-all">
                <Globe className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                Multiple Worlds
              </h3>
              <p className="text-cyan-400 mb-4">
                Explore different themed environments, each with unique
                interactive elements and visual aesthetics.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Customizable spaces</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Themed environments</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Interactive objects</span>
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-400/40 transition-all group hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-all">
                <Shield className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                Privacy & Security
              </h3>
              <p className="text-cyan-400 mb-4">
                End-to-end encryption and robust privacy controls ensure your
                data and communications remain secure.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">End-to-end encryption</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">
                    Customizable privacy settings
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Moderation tools</span>
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-400/40 transition-all group hover:translate-y-[-5px] duration-300">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-all">
                <Layers className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                Extensible Platform
              </h3>
              <p className="text-cyan-400 mb-4">
                Build custom applications and integrations on top of our
                platform using our comprehensive API.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Developer API</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">Custom plugins</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <ChevronRight size={16} className="text-cyan-500" />
                  </div>
                  <span className="text-cyan-300">
                    Third-party integrations
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div
        ref={(el) => addToRefs(el, 3)}
        className="py-24 relative opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-cyan-300 mb-4">
                Technology Stack
              </h2>
              <p className="text-xl text-cyan-400">
                Built with cutting-edge technologies to deliver a seamless,
                high-performance experience
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-2xl border border-cyan-500/20 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold text-cyan-300 mb-6">
                    Frontend
                  </h3>
                  <ul className="space-y-6">
                    <li className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-8 h-8 text-cyan-400"
                        >
                          <path
                            fill="currentColor"
                            d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-cyan-300">
                          React
                        </h4>
                        <p className="text-cyan-400">
                          Component-based UI library
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-8 h-8 text-cyan-400"
                        >
                          <path
                            fill="currentColor"
                            d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-cyan-300">
                          Tailwind CSS
                        </h4>
                        <p className="text-cyan-400">
                          Utility-first CSS framework
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <Video className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-cyan-300">
                          WebRTC
                        </h4>
                        <p className="text-cyan-400">
                          Real-time video communication
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-cyan-300 mb-6">
                    Backend
                  </h3>
                  <ul className="space-y-6">
                    <li className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <Server className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-cyan-300">
                          Express
                        </h4>
                        <p className="text-cyan-400">Node.js web framework</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-8 h-8 text-cyan-400"
                        >
                          <path
                            fill="currentColor"
                            d="M12 1.5c-1.638 0-3.219.168-4.662.506a.75.75 0 0 0-.6.864l1.875 11.25a.75.75 0 0 0 .865.6a14.976 14.976 0 0 1 5.045 0a.75.75 0 0 0 .865-.6l1.875-11.25a.75.75 0 0 0-.6-.864A23.39 23.39 0 0 0 12 1.5zm-.53 16.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-cyan-300">
                          WebSockets
                        </h4>
                        <p className="text-cyan-400">Real-time data transfer</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <Database className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-cyan-300">
                          MongoDB
                        </h4>
                        <p className="text-cyan-400">NoSQL database</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-cyan-700/30">
                <h3 className="text-2xl font-semibold text-cyan-300 mb-6">
                  Development & Infrastructure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Code className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-cyan-300">
                        TurboRepo
                      </h4>
                      <p className="text-cyan-400">Monorepo management</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-cyan-300">
                        TypeScript
                      </h4>
                      <p className="text-cyan-400">Type-safe JavaScript</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div
        ref={(el) => addToRefs(el, 4)}
        className="py-24 bg-gradient-to-b from-black/30 to-cyan-950/30 relative opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-cyan-300 mb-4">Use Cases</h2>
            <p className="text-xl text-cyan-400 max-w-3xl mx-auto">
              Metaverse 2D is versatile and can be used for a variety of
              applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Use Case 1 */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-xl border border-cyan-500/20 overflow-hidden group">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
                  alt="Virtual Meetings"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                  Virtual Meetings
                </h3>
                <p className="text-cyan-400 mb-4">
                  Host engaging team meetings, conferences, and workshops in a
                  dynamic virtual environment.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Learn more</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Use Case 2 */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-xl border border-cyan-500/20 overflow-hidden group">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                  alt="Education"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                  Education & Training
                </h3>
                <p className="text-cyan-400 mb-4">
                  Create interactive learning environments for students or
                  conduct corporate training sessions.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Learn more</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Use Case 3 */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-xl border border-cyan-500/20 overflow-hidden group">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=800&q=80"
                  alt="Social Events"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                  Social Events{" "}
                </h3>
                <p className="text-cyan-400 mb-4">
                  Host virtual parties, meetups, and social gatherings where
                  people can interact in a casual setting.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Learn more</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Section */}
      <div
        ref={(el) => addToRefs(el, 5)}
        className="py-24 relative opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-cyan-300 mb-4">
                  About the Creator
                </h2>
                <h3 className="text-2xl font-semibold text-purple-400 mb-6">
                  Kartik Tomar
                </h3>
                <p className="text-cyan-400 mb-6">
                  Full-stack developer with a passion for creating immersive
                  digital experiences. Specializing in real-time applications,
                  WebRTC, and interactive web technologies.
                </p>
                <p className="text-cyan-400 mb-8">
                  The Metaverse 2D project was created to demonstrate how modern
                  web technologies can be used to build engaging virtual spaces
                  that bring people together in new ways.
                </p>

                <div className="flex gap-4">
                  <a
                    href="https://github.com/kartiktoogoated"
                    className="w-10 h-10 bg-cyan-900/30 rounded-full flex items-center justify-center hover:bg-cyan-800/50 transition-colors"
                  >
                    <Github className="w-5 h-5 text-cyan-400" />
                  </a>
                  <a
                    href="https://x.com/kartikkkxdd"
                    className="w-10 h-10 bg-cyan-900/30 rounded-full flex items-center justify-center hover:bg-cyan-800/50 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-cyan-400" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/kartik-tomar-0621a6219/"
                    className="w-10 h-10 bg-cyan-900/30 rounded-full flex items-center justify-center hover:bg-cyan-800/50 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-cyan-400" />
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="relative bg-gradient-to-br from-cyan-950/50 to-purple-950/50 rounded-2xl border border-cyan-500/30 p-1 shadow-2xl shadow-cyan-500/10">
                  <img
                    src="https://images.unsplash.com/photo-1610894372363-21183fa31111?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Developer Portrait"
                    className="rounded-xl w-full h-auto"
                  />
                </div>

                {/* Stats */}
                <div className="absolute -bottom-6 -left-6 bg-cyan-950/80 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30 shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-300">2+</p>
                      <p className="text-sm text-cyan-400">Years Experience</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-300">20+</p>
                      <p className="text-sm text-cyan-400">Projects</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        ref={(el) => addToRefs(el, 6)}
        className="py-24 bg-gradient-to-b from-cyan-950/30 to-black/30 relative opacity-0 translate-y-10 transition-all duration-1000 ease-out"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full filter blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-cyan-300 mb-6">
              Ready to Enter the Metaverse?
            </h2>
            <p className="text-xl text-cyan-400 mb-10">
              Join thousands of users already exploring our virtual worlds and
              making connections.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:from-cyan-400 hover:to-purple-400 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/docs"
                className="px-8 py-4 bg-transparent border border-cyan-500 rounded-lg text-cyan-400 font-medium hover:bg-cyan-900/20 transition-all"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-cyan-900/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
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
              </div>
              <p className="text-cyan-400 mb-4">
                A next-generation platform for virtual collaboration and social
                interaction.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/kartiktoogoated"
                  className="text-cyan-500 hover:text-cyan-300 transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://x.com/kartikkkxdd"
                  className="text-cyan-500 hover:text-cyan-300 transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/kartik-tomar-0621a6219/"
                  className="text-cyan-500 hover:text-cyan-300 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-cyan-300 mb-4">
                Platform
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Use Cases
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div style={{ position: "relative", zIndex: 10 }}>
              <h4 className="text-lg font-semibold text-cyan-300 mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/docs"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Documentation
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-cyan-300 mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-cyan-900/30 text-center">
            <p className="text-cyan-500">
              © 2025 Metaverse 2D by Kartik Tomar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default KnowMore;
