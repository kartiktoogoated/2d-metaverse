import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content:
        "The Metaverse Project is an ambitious full-stack initiative aimed at creating an interactive 2D metaverse experience. The project follows modern software development best practices, including monorepo architecture, test-driven development (TDD), containerization (Docker & Kubernetes), and GitOps-driven CI/CD.This project is structured with a WebSocket-based real-time API, a robust backend, and a scalable infrastructure to support a dynamic, persistent virtual world.",
    },
    {
      id: "architecture",
      title: "Project Architecture",
      content:
        "The Metaverse 2D architecture consists of a modular backend, a scalable WebSocket layer for real-time interactions, and an optimized frontend for high-performance rendering.",
    },
    {
      id: "api-design",
      title: "API & WebSocket Schema",
      content:
        "Our API is designed for high concurrency and low latency. The WebSocket layer ensures smooth multiplayer experiences. [WebSocket Schema](https://www.notion.so/Websocket-Schema-18ddfba6e0e0819795e1efa1588387d9?pvs=21) [API Documentation](https://www.notion.so/Designing-the-API-18ddfba6e0e081ffa2bcf44a46b85ba8?pvs=21) [Database Schema](https://www.notion.so/DB-Schema-18ddfba6e0e08175824ef4111ecd74c5?pvs=21)",
    },
    {
      id: "tdd",
      title: "Test-Driven Development",
      content:
        "TDD ensures code reliability and maintainability. We prioritize writing tests before implementation for a bug-free system.",
    },
    {
      id: "monorepo",
      title: "Monorepo Strategy",
      content:
        "Metaverse 2D uses a monorepo approach for efficient package management, shared utilities, and version control consistency.",
    },
    {
      id: "backend",
      title: "Backend Development",
      content:
        "Our backend is built using TypeScript and Node.js with a focus on event-driven architecture, microservices, and scalability.",
    },
    {
      id: "websocket",
      title: "WebSocket Layer",
      content:
        "The WebSocket implementation supports bidirectional communication, ensuring a lag-free real-time experience for users.",
    },
    {
      id: "docker",
      title: "Containerization with Docker",
      content:
        "Dockerization enables portability and environment consistency, simplifying deployments and local development.",
    },
    {
      id: "github",
      title: "GitHub & CI/CD",
      content:
        "Metaverse 2D follows GitOps principles with automated CI/CD pipelines, ensuring reliable deployments and fast iterations.",
    },
    {
      id: "kubernetes",
      title: "Kubernetes Deployment",
      content:
        "We deploy our services on Kubernetes, utilizing cert-manager, nginx-ingress, and ArgoCD for GitOps-based automation.",
    },
    {
      id: "cicd",
      title: "CI/CD Pipelines",
      content:
        "Our CI/CD pipelines manage automated testing, container builds, and seamless production deployments.",
    },
    {
      id: "frontend",
      title: "Frontend Development",
      content:
        "The frontend is optimized for performance and user experience, leveraging Next.js and Tailwind CSS.",
    },
    {
      id: "video-architecture",
      title: "Video Streaming Integration",
      content:
        "Video streaming is integrated using WebRTC and adaptive bitrate streaming for high-quality delivery.",
    },
    {
      id: "database",
      title: "Database & Caching Strategy",
      content:
        "We use PostgreSQL for structured data and Redis for real-time caching, balancing performance and reliability.",
    },
    {
      id: "golang-migration",
      title: "Golang Migration Plans",
      content:
        "Evaluating Golang for specific backend services to optimize performance in high-throughput scenarios.",
    },
  ];

  return (
    <div className="bg-black text-cyan-300 min-h-screen flex flex-col items-center px-6 py-10 pt-20">
    {/* Navbar */}
    <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-md border-b border-cyan-900/30 py-4 px-6 flex justify-between items-center z-40">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-6 h-6 text-cyan-400" />
        <span className="text-xl font-semibold">METAVERSE_2D DOCS</span>
      </div>
      <div className="mr-10"> {/* Moves the button slightly to the left */}
        <Link
          to="/"
          className="px-4 py-2 bg-cyan-600 rounded-md text-white hover:bg-cyan-500 transition"
        >
          HOME
        </Link>
      </div>
    </nav>
  

      {/* Sidebar */}
      <div className="w-full max-w-6xl flex mt-20">
        <aside className="w-1/4 bg-black/50 border-r border-cyan-900/30 p-4 space-y-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`block w-full text-left px-4 py-2 rounded-md transition ${
                activeSection === section.id
                  ? "bg-cyan-600 text-white"
                  : "hover:bg-cyan-900/50"
              }`}
            >
              {section.title}
            </button>
          ))}
        </aside>

        {/* Content Section */}
        <main className="w-3/4 p-6 text-lg bg-black/40 border-l border-cyan-900/30 rounded-md">
          {sections.map(
            (section) =>
              section.id === activeSection && (
                <div key={section.id}>
                  <h1 className="text-2xl font-bold text-cyan-400 mb-4">
                    {section.title}
                  </h1>
                  <p>{section.content}</p>
                </div>
              )
          )}
        </main>
      </div>
    </div>
  );
}

