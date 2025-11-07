"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import SideBar from "../components/Sidebar";
import Referral from "../components/Referral";
import socket from "../lib/socket";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
    const [notification, setNotification] = useState<string | null>(null);

    const { user } = useUserStore();

    useEffect(() => {
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
    }, [user]);

    return (
        <div className="flex">
            <SideBar />
            <Referral />
            <AnimatePresence>
                {notification && (
                    <motion.div
                        key="notification"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg p-6 text-center w-[350px]"
                        >
                            <h2 className="text-xl font-semibold text-green-600 mb-2">
                                🎉 New Notification
                            </h2>
                            <p className="text-gray-700 mb-4">{notification}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
