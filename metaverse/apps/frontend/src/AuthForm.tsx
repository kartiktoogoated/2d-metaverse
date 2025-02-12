/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
    username: string;
    password: string;
    confirmPassword?: string;
}

function AuthForm() {
    const [isSignIn, setIsSignIn] = useState<boolean>(true);
    const [eyeOn, setEyeOn] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
        confirmPassword: "",
    });

    // ✅ Handle input change
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle form submission
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error on new request

        try {
            if (!isSignIn) {
                // ✅ Sign Up Request
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }

                const response = await axios.post("http://localhost:3000/api/v1/signup", {
                    username: formData.username,
                    password: formData.password,
                    type: "user", // Adjust based on your form logic
                });

                console.log("Signup Successful:", response.data);
                alert("Signup successful! Please sign in.");
                setIsSignIn(true); // Switch to Sign In mode
            } else {
                // ✅ Sign In Request
                const response = await axios.post("http://localhost:3000/api/v1/signin", {
                    username: formData.username,
                    password: formData.password,
                });

                console.log("Signin Successful:", response.data);
                localStorage.setItem("token", response.data.token); // Store token
                alert("Signin successful! Redirecting...");
                // Navigate to another page or update the UI accordingly
            }
        } catch (error: any) {
            console.error("Auth Error:", error);
            setError(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="h-screen w-full flex justify-center items-center">
            <div className="bg-white text-[#111828] rounded-3xl flex flex-col items-center p-[3%] gap-5">
                <div className="text-center">
                    <h2 className="font-bold text-[30px]">Welcome to Metaverse</h2>
                    <h3 className="text-gray-800 text-[20px]">
                        {isSignIn ? "Sign in to continue" : "Create an account"}
                    </h3>
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <form
                    className="flex flex-col gap-2 w-full text-[#111828] font-bold p-[2%]"
                    onSubmit={onSubmit}
                >
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
                            <EyeOff
                                size={20}
                                className="absolute right-3 top-[50%] -translate-y-[50%] cursor-pointer"
                                onClick={() => setEyeOn(!eyeOn)}
                            />
                        ) : (
                            <Eye
                                size={20}
                                className="absolute right-3 top-[50%] -translate-y-[50%] cursor-pointer"
                                onClick={() => setEyeOn(!eyeOn)}
                            />
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

                    <button
                        type="submit"
                        className="bg-[#111828] mt-2 text-white rounded-lg p-3 hover:bg-sky-950 flex justify-center gap-2"
                    >
                        <LogIn />
                        {isSignIn ? "Sign In" : "Sign Up"}
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
    );
}

export default AuthForm;
