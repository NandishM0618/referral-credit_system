'use client'
import API from "@/services/apiService";
import { CheckCircle, Files, Share2, Star, Users, Verified } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { motion, AnimatePresence } from "framer-motion";

type ReferredUser = {
    id: number;
    name: string;
    email: string;
    joinDate: string;
    status: string;
};

export default function Referral() {
    const [referralLink, setReferralLink] = useState<string>("");
    const [data, setData] = useState<any>(null)
    const [users, setUsers] = useState<ReferredUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedUser, setSelectedUser] = useState<ReferredUser | null>(null);
    const [showCopied, setShowCopied] = useState(false);
    const { token } = useUserStore();

    async function getReferralLink() {
        try {
            const res = await API.get<{ referralLink: string }>("/referral/link", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setReferralLink(res.data.referralLink || "");
        } catch (error) {
            console.error("Failed to fetch referral link:", error);
        }
    }

    async function getStats() {
        try {
            const res = await API.get("/referral/dashboard", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(res.data)
        } catch (error) {
            console.error("Dashboard fetch failed:", error);
        }
    }

    async function getReferredUsers() {
        try {
            const res = await API.get("/referral/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data.users || []);
        } catch (error) {
            console.error("Failed to fetch referred users:", error);
        } finally {
            setLoading(false);
        }
    }


    const handleReferralLink = () => {
        if (!referralLink) return alert("No referral link available!");
        navigator.clipboard.writeText(referralLink);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    useEffect(() => {
        getReferralLink();
        getStats();
        getReferredUsers();
    }, []);

    return (
        <div className="relative flex-1 min-h-screen p-8 bg-gradient-to-b from-[#0b0c1a] via-[#141832] to-[#1b1f3b] text-white">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(80,80,200,0.2),transparent_70%)]"></div>

            <div className="absolute inset-0 bg-gradient-to-br from-[#060b23] via-[#0b0c2a] to-[#111] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            </div>

            <div className="grid grid-cols-1 mx-auto lg:grid-cols-2 gap-10 relative z-10">

                <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/10 hover:shadow-blue-500/20 transition-all">
                    <h2 className="text-3xl font-bold mb-1 text-blue-300">Referrals</h2>
                    <p className="text-[16px] font-light text-gray-300 mb-6">
                        Share your referral code and earn cosmic rewards
                    </p>

                    <div className="flex items-center gap-4 mb-12">
                        <input
                            type="text"
                            value={referralLink || "Generating your link..."}
                            readOnly
                            className="flex-1 p-3 rounded-md bg-[#1b1f3b] text-gray-200 border border-blue-400/30 focus:outline-none"
                        />
                        <button
                            onClick={handleReferralLink}
                            disabled={!referralLink}
                            className="px-4 py-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-500 flex gap-2 items-center text-white font-semibold rounded-md hover:shadow-lg hover:scale-105 transition"
                        >
                            <Files size={18} /> Copy
                        </button>
                    </div>

                    <AnimatePresence>
                        {showCopied && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="fixed bottom-6 flex items-center bg-blue-600 text-white text-sm px-6 py-3 rounded-lg shadow-lg"
                            >
                                🌟 Referral link copied to clipboard!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative my-10 text-center">
                        <span className="bg-transparent px-3 text-gray-400 text-sm">or</span>
                        <hr className="absolute left-0 top-1/2 w-full border-gray-600/30 -z-10" />
                    </div>

                    <h2 className="text-lg font-semibold mb-6 text-blue-200">
                        Invite your friends
                    </h2>
                    <div className="flex items-center gap-4 mb-12">
                        <input
                            type="text"
                            value={referralLink || ""}
                            readOnly
                            className="flex-1 p-3 rounded-md bg-[#1b1f3b] text-gray-200 border border-blue-400/30 focus:outline-none"
                        />
                        <button
                            onClick={handleReferralLink}
                            className="px-4 py-2 cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center gap-2 text-white rounded-md font-semibold hover:shadow-lg hover:scale-105 transition"
                        >
                            <Share2 size={18} /> Share
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
                        {[
                            {
                                title: "Total Credits",
                                icon: <Star size={34} />,
                                value: data?.totalCredits,
                                desc: "Earned through referrals",
                            },
                            {
                                title: "Referred Users",
                                icon: <Users size={34} />,
                                value: data?.referredUsers,
                                desc: "People you’ve invited",
                            },
                            {
                                title: "Converted Users",
                                icon: <CheckCircle size={34} />,
                                value: data?.convertedUsers,
                                desc: "Users who completed signup",
                            },
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.03, boxShadow: "0px 0px 20px rgba(59,130,246,0.4)" }}
                                className={`${i === 2 ? "md:col-span-2" : ""
                                    } bg-white/10 border border-blue-400/20 rounded-xl p-5 flex flex-col justify-center items-start backdrop-blur-md`}
                            >
                                <div className="flex mx-auto items-center gap-2 mb-2 text-blue-300">
                                    {card.icon}
                                    <h3 className="text-lg font-semibold">{card.title}</h3>
                                </div>
                                <p className="text-5xl font-bold text-center mx-auto text-white leading-tight">
                                    {card.value}
                                </p>
                                <p className="text-sm text-center mx-auto text-gray-400 mt-2">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 hover:shadow-blue-500/20 transition-all">
                        <h3 className="text-lg font-semibold mb-4 text-blue-200">Referred Users</h3>

                        <div className="overflow-x-auto">
                            {loading ? (
                                <p className="text-gray-400 text-sm p-4">Loading referred users...</p>
                            ) : users.length === 0 ? (
                                <p className="text-gray-400 text-sm p-4">No referred users found.</p>
                            ) : (
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="bg-blue-900/20 text-blue-200">
                                            <th className="p-3">ID</th>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Join Date</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr
                                                onClick={() => setSelectedUser(user)}
                                                key={user.id}
                                                className="hover:bg-blue-900/10 cursor-pointer transition"
                                            >
                                                <td className="p-3 text-gray-200">
                                                    {user.id.toString().substring(10, 20)}
                                                </td>
                                                <td className="p-3 text-gray-100">{user.name}</td>
                                                <td className="p-3 text-gray-400">{user.email}</td>
                                                <td className="p-3 text-gray-400">{user.joinDate}</td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize
                        ${user.status === "converted"
                                                                ? "bg-green-500/20 text-green-300 border border-green-400/30"
                                                                : user.status === "pending"
                                                                    ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                                                                    : "bg-gray-500/20 text-gray-300 border border-gray-400/30"
                                                            }`}
                                                    >
                                                        {user.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <div className="relative my-10 text-center">
                        <hr className="border-gray-600/30" />
                    </div>

                    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10 hover:shadow-blue-500/20 transition-all">
                        <h3 className="text-lg font-semibold text-blue-200 mb-4">
                            Referred User Information
                        </h3>

                        {selectedUser ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-sm font-medium text-gray-400">Name</h2>
                                        <p className="text-lg font-semibold text-white">{selectedUser.name}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-medium text-gray-400">ID</h2>
                                        <p className="text-lg font-semibold text-white">{selectedUser.id}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-medium text-gray-400">Email</h2>
                                        <p className="text-lg font-semibold text-white">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <h2 className="text-sm font-medium text-gray-400">Account Status</h2>
                                        <p
                                            className={`text-lg flex items-center gap-2 font-semibold ${selectedUser.status === "converted"
                                                ? "text-green-400"
                                                : "text-yellow-300"
                                                }`}
                                        >
                                            {selectedUser.status === "converted"
                                                ? "Successfully Verified"
                                                : selectedUser.status}
                                            {selectedUser.status === "converted" && <Verified />}
                                        </p>
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-medium text-gray-400 mb-2">
                                            Send Message
                                        </h2>
                                        <textarea
                                            placeholder="Add notes about this user..."
                                            className="w-full min-h-[160px] bg-[#1b1f3b] border border-blue-400/30 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400">Click on a user to view details.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}
