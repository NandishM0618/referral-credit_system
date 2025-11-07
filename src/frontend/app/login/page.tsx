'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/apiService";
import { useUserStore } from "../store/userStore";
import { motion, AnimatePresence } from 'framer-motion'

export default function page() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const router = useRouter();
    const { token, setUser, setToken } = useUserStore();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const form = { email, password }
        try {
            const res = await API.post("/auth/login", form);
            setUser(res.data.user);
            setToken(res.data.token);
            router.push("/dashboard");
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) router.replace("/dashboard");
    }, [token, router])

    return (
        <>
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-blue-900">

                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-black to-black opacity-80" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 0.5, y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 left-20 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 0.5, y: [0, 20, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative bg-gray-900/60 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 text-white z-10"
                >
                    <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Welcome Back 👋
                    </h2>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block mb-1 text-gray-300 font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-1 text-gray-300 font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="accent-blue-500" />
                                Remember me
                            </label>
                            <a href="#" className="text-blue-400 hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 cursor-pointer py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-red-400 text-center mt-2 font-medium"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </form>

                    <p className="mt-6 text-sm text-center text-gray-400">
                        Don’t have an account?{" "}
                        <a href="/register" className="text-blue-400 hover:underline font-medium">
                            Sign Up
                        </a>
                    </p>
                </motion.div>
            </div>
        </>
    );
}