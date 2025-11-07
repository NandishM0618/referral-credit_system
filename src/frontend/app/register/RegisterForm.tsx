"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "../store/userStore";
import API from "@/services/apiService";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const referralCode = searchParams.get("r");
    const { setUser, setToken } = useUserStore();

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = { name, email, password, referralCodeUsed: referralCode };
            const res = await API.post("/auth/register", data);

            setUser(res.data.user);
            setToken(res.data.token);
            setSuccess(true);

            setTimeout(() => {
                router.replace("/login");
            }, 2500);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Account creation failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-blue-900">

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black opacity-80" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 0.5, y: [0, -20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-20 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 0.5, y: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 bg-gray-900/70 backdrop-blur-lg border border-gray-700/50 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white"
            >
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Create Your Account ✨
                </h2>

                <form className="space-y-5" onSubmit={handleSignup}>
                    <div>
                        <label htmlFor="name" className="block mb-1 text-gray-300 font-medium">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-1 text-gray-300 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                            required
                            className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-2 cursor-pointer rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
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
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-400 hover:underline font-medium">
                        Login
                    </a>
                </p>
            </motion.div>

            <AnimatePresence>
                {success && (
                    <motion.div
                        key="success-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-900 text-white rounded-2xl shadow-lg p-8 text-center w-[350px] border border-gray-700/50"
                        >
                            <h2 className="text-2xl font-semibold text-green-400 mb-3">
                                🚀 Account Created!
                            </h2>
                            <p className="text-gray-300 mb-4">
                                Welcome aboard, <span className="font-medium">{name}</span>!
                                Redirecting to login...
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
