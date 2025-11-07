import API from "@/services/apiService";
import { CheckCircle, Files, Share2, Star, Users, Verified } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Referral() {
    const [referralLink, setReferralLink] = useState<string>("");
    const [data, setData] = useState<any>(null)
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

    const handleReferralLink = () => {
        if (!referralLink) return alert("No referral link available!");
        navigator.clipboard.writeText(referralLink);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    useEffect(() => {
        getReferralLink();
        getStats()
    }, []);

    return (
        <div className="relative flex-1 min-h-screen p-5">
            <div className="grid grid-cols-1 mx-auto lg:grid-cols-2 gap-8">
                {/* Left Column - Referral Info */}
                <div className=" p-3">
                    <h2 className="text-2xl font-semibold mb-1">Referrals</h2>
                    <p className="text-[16px] font-light text-gray-500 mb-4">Share your referrals code to your friends</p>
                    <div className="flex items-center gap-4 mb-12">
                        <input
                            type="text"
                            value={referralLink || "Loading your referral link..."}
                            readOnly
                            className="flex-1 p-3 rounded-sm bg-gray-100 text-gray-400 focus:outline-none"
                        />
                        <button
                            onClick={handleReferralLink}
                            disabled={!referralLink}
                            className="px-4 py-2 bg-gray-500 flex gap-2 cursor-pointer hover:bg-black hover:text-white text-white rounded-md  transition"
                        >
                            <Files /> Copy Link
                        </button>
                    </div>

                    <AnimatePresence>
                        {showCopied && (
                            <motion.div
                                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="fixed bottom-6 flex items-center bg-black text-white text-sm px-5 py-3 rounded-md shadow-lg"
                            >
                                ✅ Referral link copied to clipboard!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative my-10 text-center">
                        <span className="bg-gray-50 px-3 text-gray-400 text-sm">or</span>
                        <hr className="absolute left-0 top-1/2 w-full border-gray-200 -z-10" />
                    </div>

                    <div className="">
                        <h2 className="text-lg font-semibold mb-6">invite your friends</h2>
                        <div className="flex items-center gap-4 mb-12">
                            <input
                                type="text"
                                value={referralLink || "Loading your referral link..."}
                                readOnly
                                className="flex-1 p-3 rounded-md bg-gray-100 text-gray-600 focus:outline-none border border-gray-200"
                            />
                            <button
                                onClick={handleReferralLink}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-white rounded-md transition"
                            >
                                <Share2 size={18} /> Share
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">

                        <div className="bg-white border border-gray-100 rounded-md shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-center items-start">
                            <div className="flex mx-auto items-center gap-1 mb-2">
                                <div className="p-2 rounded-xl">
                                    <Star size={34} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700">Total Credits</h3>
                            </div>
                            <p className="text-5xl font-bold text-center mx-auto text-gray-800 leading-tight">{data?.totalCredits}</p>
                            <p className="text-sm text-center mx-auto text-gray-400 mt-2">Earned through referrals</p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-md shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-center items-start">
                            <div className="flex items-center mx-auto gap-1 mb-2">
                                <div className="p-2 rounded-xl">
                                    <Users size={34} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700">Referred Users</h3>
                            </div>
                            <p className="text-5xl font-bold text-center mx-auto text-gray-800 leading-tight">{data?.referredUsers}</p>
                            <p className="text-sm text-center mx-auto text-gray-400 mt-2">People you’ve invited</p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-md shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-center items-start md:col-span-2">
                            <div className="flex mx-auto items-center gap-1 mb-2">
                                <div className="p-2 rounded-xl">
                                    <CheckCircle size={34} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700">Converted Users</h3>
                            </div>
                            <p className="text-5xl font-bold mx-auto text-gray-800 leading-tight">{data?.convertedUsers}</p>
                            <p className="text-sm mx-auto text-gray-400 mt-2">Users who completed signup</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - User List + Details */}
                <div className="space-y-8">
                    <div className="bg-white p-3">
                        <h3 className="text-lg font-semibold mb-4">Referred Users</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 ">ID</th>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Join Date</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-gray-50 cursor-pointer">
                                        <td className="p-3">1</td>
                                        <td className="p-3">Jane Doe</td>
                                        <td className="p-3">jane@example.com</td>
                                        <td className="p-3">2025-10-02</td>
                                        <td className="p-3 text-green-600 font-medium">Converted</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 cursor-pointer">
                                        <td className="p-3">2</td>
                                        <td className="p-3">John Smith</td>
                                        <td className="p-3">john@example.com</td>
                                        <td className="p-3">2025-10-06</td>
                                        <td className="p-3 text-yellow-600 font-medium">Pending</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="relative my-10 text-center p-1">
                        <hr className="absolute left-0 top-1/2 w-full border-gray-200 z-10" />
                    </div>

                    <div className="bg-white p-3">
                        <h3 className="text-[16px] font-semibold text-gray-800 mb-6 pb-3">
                            Referred User Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-5">
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500">Name</h2>
                                    <p className="text-lg font-semibold text-gray-800">John Doe</p>
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500">ID</h2>
                                    <p className="text-lg font-semibold text-gray-800">345321</p>
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500">Email</h2>
                                    <p className="text-lg font-semibold text-gray-800">john@mail.com</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-5">
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500">Account Status</h2>
                                    <p className="text-lg flex gap-2 font-semibold text-green-600">
                                        Successfully Verified <Verified />
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-sm font-medium text-gray-500 mb-2">
                                        send message
                                    </h2>
                                    <textarea
                                        placeholder="Add notes about this user..."
                                        className="w-full min-h-[180px] border border-gray-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
