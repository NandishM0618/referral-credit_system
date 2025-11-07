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
                    className="p-2 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-50"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <div className="hidden lg:flex h-screen w-64 bg-white text-gray-700 shadow-sm flex-col justify-between">

                <div className="p-6 text-2xl font-bold flex items-center gap-3">
                    <User className="w-6 h-6 text-gray-700" />
                    <span>{user?.name ?? "Guest"}</span>
                </div>

                <div className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.name}
                                whileHover={{ scale: 1.03, x: 4 }}
                                onClick={() => router.push(item.path)}
                                className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 transition-all"
                            >
                                <Icon className="w-5 h-5 text-gray-600" />
                                <span className="text-[15px] font-medium">{item.name}</span>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition-all"
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
                            animate={{ opacity: 0.4 }}
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
                            className="fixed top-0 left-0 h-full w-64 bg-white text-gray-700 shadow-lg z-50 flex flex-col justify-between"
                        >
                            <div className="p-6 text-2xl font-bold flex items-center gap-3 border-b">
                                <User className="w-6 h-6 text-gray-700" />
                                <span>{user?.name ?? "Guest"}</span>
                            </div>

                            <div className="flex-1 p-4 space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.name}
                                            onClick={() => {
                                                router.push(item.path);
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 transition-all"
                                        >
                                            <Icon className="w-5 h-5 text-gray-600" />
                                            <span className="text-[15px] font-medium">{item.name}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t">
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition-all"
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
