/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogIn, Eye, EyeOff, Sun, Moon, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!;

function AuthForm() {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [eyeOn, setEyeOn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isSignIn ? "/api/v1/signin" : "/api/v1/signup";
    const apiUrl = `${API_BASE_URL}${endpoint}`;

    if (!isSignIn && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const payload = isSignIn
        ? { username: formData.username, password: formData.password }
        : {
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (isSignIn) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setIsSignIn(true);
      }
    } catch (err: any) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`min-h-screen w-full flex justify-center items-center transition-all duration-500 ${
        isDarkMode 
          ? "bg-[#0a1a1f] text-[#4fd1c5]" 
          : "bg-white text-[#2c7a7b]"
      }`}
      style={{
        backgroundImage: isDarkMode 
          ? "radial-gradient(circle at 50% 50%, rgba(79, 209, 197, 0.03) 0%, transparent 50%)"
          : "radial-gradient(circle at 50% 50%, rgba(44, 122, 123, 0.05) 0%, transparent 50%)"
      }}
    >
      {/* Dark/Light Mode Toggle Icon */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
          isDarkMode 
            ? "bg-[#1a2e35] text-[#4fd1c5]" 
            : "bg-[#e6fffa] text-[#2c7a7b] shadow-lg"
        }`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div 
        className={`w-full max-w-md mx-4 rounded-xl overflow-hidden transition-all duration-500 transform ${
          isDarkMode 
            ? "bg-[#1a2e35] shadow-xl" 
            : "bg-white shadow-2xl"
        }`}
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-8 animate-fadeIn">
            <div className={`p-3 rounded-full mb-4 transition-all duration-500 ${
              isDarkMode ? "bg-[#243942]" : "bg-[#e6fffa]"
            }`}>
              <Gamepad2 
                size={28} 
                className={`transition-all duration-500 ${
                  isDarkMode ? "text-[#4fd1c5]" : "text-[#2c7a7b]"
                }`} 
              />
            </div>
            <h2 className="text-3xl font-semibold mb-2 tracking-wide animate-slideDown">
              Metaverse 2D
            </h2>
            <div className="space-y-1 text-center">
              <p className={`text-sm transition-all duration-500 ${
                isDarkMode ? "text-[#4fd1c5]/70" : "text-[#2c7a7b]/70"
              }`}>
                Welcome to the digital realm
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-slideUp">
              <label htmlFor="username" className={`block text-sm font-medium mb-2 transition-all duration-500 ${
                isDarkMode ? "text-[#4fd1c5]/90" : "text-[#2c7a7b]/90"
              }`}>
                Username
              </label>
              <input
                className={`w-full px-4 py-2.5 rounded-lg outline-none transition-all duration-300 ${
                  isDarkMode 
                    ? "bg-[#243942] text-[#4fd1c5] placeholder-[#4fd1c5]/30 focus:ring-2 focus:ring-[#4fd1c5]/20" 
                    : "bg-[#e6fffa] text-[#2c7a7b] placeholder-[#2c7a7b]/30 focus:ring-2 focus:ring-[#2c7a7b]/20"
                }`}
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
                placeholder="Enter username"
              />
            </div>

            <div className="animate-slideUp" style={{ animationDelay: "100ms" }}>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 transition-all duration-500 ${
                isDarkMode ? "text-[#4fd1c5]/90" : "text-[#2c7a7b]/90"
              }`}>
                Password
              </label>
              <div className="relative">
                <input
                  className={`w-full px-4 py-2.5 rounded-lg outline-none transition-all duration-300 ${
                    isDarkMode 
                      ? "bg-[#243942] text-[#4fd1c5] placeholder-[#4fd1c5]/30 focus:ring-2 focus:ring-[#4fd1c5]/20" 
                      : "bg-[#e6fffa] text-[#2c7a7b] placeholder-[#2c7a7b]/30 focus:ring-2 focus:ring-[#2c7a7b]/20"
                  }`}
                  type={eyeOn ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setEyeOn(!eyeOn)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                    isDarkMode 
                      ? "text-[#4fd1c5]/50" 
                      : "text-[#2c7a7b]/50"
                  }`}
                >
                  {eyeOn ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isSignIn && (
              <div className="animate-slideUp" style={{ animationDelay: "200ms" }}>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 transition-all duration-500 ${
                  isDarkMode ? "text-[#4fd1c5]/90" : "text-[#2c7a7b]/90"
                }`}>
                  Confirm Password
                </label>
                <input
                  className={`w-full px-4 py-2.5 rounded-lg outline-none transition-all duration-300 ${
                    isDarkMode 
                      ? "bg-[#243942] text-[#4fd1c5] placeholder-[#4fd1c5]/30 focus:ring-2 focus:ring-[#4fd1c5]/20" 
                      : "bg-[#e6fffa] text-[#2c7a7b] placeholder-[#2c7a7b]/30 focus:ring-2 focus:ring-[#2c7a7b]/20"
                  }`}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  placeholder="Confirm password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 animate-slideUp ${
                isDarkMode
                  ? "bg-[#4fd1c5] text-[#0a1a1f]"
                  : "bg-[#2c7a7b] text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ animationDelay: "300ms" }}
            >
              <LogIn size={18} />
              {loading ? "Processing..." : isSignIn ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center animate-fadeIn" style={{ animationDelay: "400ms" }}>
            <p className={`text-sm transition-all duration-500 ${
              isDarkMode ? "text-[#4fd1c5]/70" : "text-[#2c7a7b]/70"
            }`}>
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className={`ml-2 font-medium transition-colors ${
                  isDarkMode 
                    ? "text-[#4fd1c5]" 
                    : "text-[#2c7a7b]"
                }`}
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
