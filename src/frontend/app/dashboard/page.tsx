"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import SideBar from "../components/Sidebar";
import Referral from "../components/Referral";
import socket from "../lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [notification, setNotification] = useState<string | null>(null);

    const { user, token } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }
        if (!user?.id) return;

        const handleConnect = () => {
            console.log("Socket connected:", socket.id);
            socket.emit("register", user.id);
            console.log("Sent register event for user:", user.id);
        };

        socket.on("connect", handleConnect);

        socket.on("referrer-notification", (data) => {
            setNotification(data.message);

            setTimeout(() => {
                window.location.reload();
            }, 3000);
        });

        return () => {
            socket.off("connect", handleConnect);
            socket.off("referrer-notification");
        };
    }, [user, token, router]);

    return (
        <div className="flex relative min-h-screen overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-br from-[#05071c] via-[#0b0d25] to-[#111827]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            </div>

            <SideBar />
            <Referral />

            <AnimatePresence>
                {notification && (
                    <motion.div
                        key="notification"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-900 border border-blue-400/30 rounded-2xl shadow-[0_0_25px_rgba(99,102,241,0.4)] p-8 text-center w-[360px] text-gray-100"
                        >
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full px-6 py-2 text-sm font-semibold text-white shadow-md">
                                New Notification ✨
                            </div>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold mb-2 text-indigo-300">
                                    🎉 Exciting Update!
                                </h2>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    {notification}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setNotification(null)}
                                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    );
}
