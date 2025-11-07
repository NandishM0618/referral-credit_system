"use client";

import {
    Bell,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Menu,
    User,
    X,
} from "lucide-react";
import { useUserStore } from "../store/userStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function SideBar() {
    const { user, logout } = useUserStore();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Purchase", icon: CreditCard, path: "/purchase" },
        { name: "Notifications", icon: Bell, path: "/notifications" },
    ];

    return (
        <>
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-md shadow-lg cursor-pointer hover:opacity-90 transition"
                >
                    {isOpen ? (
                        <X className="w-5 h-5 text-white" />
                    ) : (
                        <Menu className="w-5 h-5 text-white" />
                    )}
                </button>
            </div>

            <div className="hidden lg:flex h-screen w-64 bg-[#0b0c1a]/90 backdrop-blur-xl text-gray-200 border-r border-blue-400/10 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex-col justify-between">

                <div className="p-6 text-2xl font-bold flex items-center gap-3 text-blue-300">
                    <User className="w-6 h-6 text-blue-400" />
                    <span>{user?.name ?? "Guest"}</span>
                </div>

                <div className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.name}
                                whileHover={{
                                    scale: 1.05,
                                    x: 5,
                                    boxShadow: "0px 0px 10px rgba(59,130,246,0.4)",
                                }}
                                onClick={() => router.push(item.path)}
                                className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer bg-white/5 hover:bg-blue-500/10 transition-all"
                            >
                                <Icon className="w-5 h-5 text-blue-300" />
                                <span className="text-[15px] font-medium">{item.name}</span>
                            </motion.div>
                        );
                    })}
                </div>
                <div className="p-4 border-t border-blue-400/20">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black z-40 lg:hidden"
                        />

                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-64 bg-[#0b0c1a]/95 text-gray-200 border-r border-blue-400/10 shadow-lg backdrop-blur-xl z-50 flex flex-col justify-between"
                        >
                            <div className="p-6 text-2xl font-bold flex items-center gap-3 border-b border-blue-400/10 text-blue-300">
                                <User className="w-6 h-6 text-blue-400" />
                                <span>{user?.name ?? "Guest"}</span>
                            </div>

                            <div className="flex-1 p-4 space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={item.name}
                                            whileHover={{
                                                scale: 1.05,
                                                x: 6,
                                                boxShadow: "0px 0px 10px rgba(59,130,246,0.3)",
                                            }}
                                            onClick={() => {
                                                router.push(item.path);
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer bg-white/5 hover:bg-blue-500/10 transition-all"
                                        >
                                            <Icon className="w-5 h-5 text-blue-300" />
                                            <span className="text-[15px] font-medium">{item.name}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-blue-400/20">
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>

    );
}
