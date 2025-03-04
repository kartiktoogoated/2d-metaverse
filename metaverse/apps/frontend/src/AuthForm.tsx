/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router for navigation

function VideoCard() {
    const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);
    const [eyeOn, setEyeOn] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle form submission (Sign Up or Sign In)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    
        const endpoint = isSignIn ? "/api/v1/signin" : "/api/v1/signup";
        const apiUrl = `http://localhost:3002${endpoint}`;
    
        if (!isSignIn && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }
    
        try {
            const payload = isSignIn
                ? { username: formData.username, password: formData.password } // ✅ Ensure correct format
                : { username: formData.username, password: formData.password, confirmPassword: formData.confirmPassword };
    
            console.log("Sending request to API:", payload); // ✅ Debug log
    
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include", // ✅ Include credentials if needed
            });
    
            const data = await response.json();
            console.log("API Response:", data); // ✅ Debugging API response
    
            if (!response.ok) {
                throw new Error(data.message || "Authentication failed");
            }
    
            if (isSignIn) {
                localStorage.setItem("token", data.token); // ✅ Store JWT token
                alert("Login successful!");
                navigate("/game"); // ✅ Redirect after login
            } else {
                alert("Signup successful! Please log in.");
                setIsSignIn(true);
            }
        } catch (err: any) {
            console.error("Error:", err.message); // ✅ Log exact error
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <div className="h-screen w-full flex justify-center items-center">
                <div className="bg-white text-[#111828] rounded-3xl flex flex-col items-center p-[3%] gap-5">

                    <div className="text-center">
                        <h2 className="font-bold text-[30px]">Welcome to Metaverse</h2>
                        <h3 className="text-gray-800 text-[20px]">
                            {isSignIn ? "Sign in to continue" : "Create an account"}
                        </h3>
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <form className="flex flex-col gap-2 w-full text-[#111828] font-bold p-[2%]" onSubmit={handleSubmit}>
                        <label htmlFor="username">Username</label>
                        <input
                            className="border-2 border-gray-200 rounded-lg h-[40px] text-black font-normal px-3"
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="current-username"
                            required
                        />

                        <label htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                className="border-2 w-full border-gray-200 rounded-lg h-[40px] text-black font-normal px-3"
                                type={eyeOn ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />
                            {eyeOn ? (
                                <EyeOff size={20} className="absolute right-3 top-[50%] -translate-y-[50%]" onClick={() => setEyeOn(!eyeOn)} />
                            ) : (
                                <Eye size={20} className="absolute right-3 top-[50%] -translate-y-[50%]" onClick={() => setEyeOn(!eyeOn)} />
                            )}
                        </div>

                        {!isSignIn && (
                            <>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    className="border-2 border-gray-200 rounded-lg h-[40px] text-black font-normal px-3"
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />
                            </>
                        )}

                        <button type="submit" className="bg-[#111828] mt-2 text-white rounded-lg p-3 hover:bg-sky-950 flex justify-center gap-2" disabled={loading}>
                            <LogIn />
                            {loading ? "Processing..." : isSignIn ? "Sign In" : "Sign Up"}
                        </button>
                    </form>

                    <div className="flex gap-4">
                        <p className="text-[#111828]">
                            {isSignIn ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <button
                            className="hover:underline hover:cursor-pointer"
                            onClick={() => setIsSignIn(!isSignIn)}
                        >
                            {isSignIn ? "Sign Up" : "Sign In"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VideoCard;
