"use client";

import { useState } from "react";
import { useUserStore } from "../store/userStore";
import API from "@/services/apiService";
import { CheckCircle } from "lucide-react";
import SideBar from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
};


export default function Purchase() {
    const { user, token } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [purchasedProduct, setPurchasedProduct] = useState<Product | null>(null);
    const [userCredits, setUserCredits] = useState<number | null>(null);
    const [referrerCredits, setReferrerCredits] = useState<number | null>(null);

    const handlePurchase = async (product: Product) => {
        if (!token) return alert("User not logged in!");

        setLoading(true);
        try {
            const res = await API.post(
                "/purchase",
                { amount: product.price, productId: product.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPurchasedProduct(product);
            setUserCredits(res.data.userCredits);
            setReferrerCredits(res.data.referrerCredits ?? null);
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Purchase failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen relative overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-br from-[#060b23] via-[#0b0c2a] to-[#111] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            </div>

            <SideBar />

            <div className="flex-1 relative min-h-screen text-white p-6 z-10">
                <h1 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
                    Choose Your Plan
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="flex flex-col justify-between bg-white/10 backdrop-blur-lg border border-gray-700/40 rounded-2xl p-8 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 hover:-translate-y-2">
                        <div>
                            <h2 className="text-2xl font-bold text-center text-blue-300 mb-2">Basic</h2>
                            <p className="text-gray-400 text-center mb-6">Ideal for beginners</p>

                            <div className="mb-6 text-center">
                                <h3 className="text-3xl font-semibold text-white">
                                    $11.45<span className="text-lg font-normal text-gray-400">/month</span>
                                </h3>
                                <p className="text-sm text-gray-500">billed annually</p>
                            </div>

                            <button
                                disabled={loading}
                                onClick={() =>
                                    handlePurchase({ id: 1, name: "Basic", price: 11.45, description: "Ideal for beginners" })
                                }
                                className="w-1/2 mx-auto block mt-4 mb-20 py-3 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Purchase Now
                            </button>

                            <ul className="space-y-2 text-gray-300 text-center">
                                <li>All basic features</li>
                                <li>10 pages</li>
                                <li>Free domain for 1 year*</li>
                                <li>2 GB disk space</li>
                                <li>2 GB bandwidth</li>
                                <li>Powered by WebSelf</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between bg-gradient-to-br from-indigo-900/60 via-indigo-700/50 to-blue-800/60 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-8 shadow-lg hover:shadow-[0_0_25px_rgba(96,165,250,0.5)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                        <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                            Most Popular
                        </span>

                        <div>
                            <h2 className="text-2xl font-bold text-center text-blue-200 mb-2">Pro</h2>
                            <p className="text-gray-400 text-center mb-6">Bring your site further</p>

                            <div className="mb-6 text-center">
                                <h3 className="text-3xl font-semibold text-white">
                                    $17.95<span className="text-lg font-normal text-gray-400">/month</span>
                                </h3>
                                <p className="text-sm text-gray-500">billed annually</p>
                            </div>

                            <button
                                disabled={loading}
                                onClick={() =>
                                    handlePurchase({ id: 2, name: "Pro", price: 17.95, description: "Bring your site further" })
                                }
                                className="w-1/2 mx-auto block mt-4 mb-20 py-3 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Purchase Now
                            </button>

                            <ul className="space-y-2 text-gray-300 text-center">
                                <li>All basic features</li>
                                <li>50 pages</li>
                                <li>Free domain for 1 year*</li>
                                <li>10 GB disk space</li>
                                <li>10 GB bandwidth</li>
                                <li>2 email addresses*</li>
                                <li>No WebSelf ads</li>
                                <li>Premium support</li>
                                <li>Multilingual</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between bg-gradient-to-br from-green-900/50 via-green-700/40 to-emerald-800/50 backdrop-blur-lg border border-green-400/30 rounded-2xl p-8 shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-2">
                        <div>
                            <h2 className="text-2xl font-bold text-center text-emerald-300 mb-2">E-Commerce</h2>
                            <p className="text-gray-400 text-center mb-6">The whole package</p>

                            <div className="mb-6 text-center">
                                <h3 className="text-3xl font-semibold text-white">
                                    $24.45<span className="text-lg font-normal text-gray-400">/month</span>
                                </h3>
                                <p className="text-sm text-gray-500">billed annually</p>
                            </div>

                            <button
                                disabled={loading}
                                onClick={() =>
                                    handlePurchase({ id: 3, name: "E-commerce", price: 24.45, description: "The whole package" })
                                }
                                className="w-1/2 mx-auto block mt-4 mb-20 py-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-green-400 text-white font-semibold hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Purchase Now
                            </button>

                            <ul className="space-y-2 text-gray-300 text-center">
                                <li>All basic features</li>
                                <li>100 pages</li>
                                <li>Free domain for 1 year*</li>
                                <li>20 GB disk space</li>
                                <li>20 GB bandwidth</li>
                                <li>5 email addresses*</li>
                                <li>No WebSelf ads</li>
                                <li>E-Shop included</li>
                                <li>Premium support</li>
                                <li>Multilingual</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {purchasedProduct && (
                        <motion.div
                            key="purchase-modal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-900 border border-blue-400/30 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center text-gray-200"
                            >
                                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
                                <h2 className="text-2xl font-semibold text-green-400 mb-2">Purchase Successful!</h2>
                                <p className="text-gray-300 mb-4">
                                    Thank you for your purchase,{" "}
                                    <span className="font-medium text-blue-300">{user?.name ?? "Guest"}</span>!
                                </p>

                                <div className="text-left space-y-2 bg-white/10 rounded-lg p-4 border border-blue-400/20 mb-6 text-gray-100">
                                    <p><span className="font-medium text-blue-300">Email:</span> {user?.email ?? "N/A"}</p>
                                    <p><span className="font-medium text-blue-300">Product:</span> {purchasedProduct.name}</p>
                                    <p><span className="font-medium text-blue-300">Amount Paid:</span> ${purchasedProduct.price}</p>
                                    <p><span className="font-medium text-blue-300">Credits Earned:</span> {userCredits}</p>
                                    {referrerCredits !== null && (
                                        <p><span className="font-medium text-blue-300">Referrer Credits:</span> {referrerCredits}</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => setPurchasedProduct(null)}
                                    className="px-6 py-2 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-105 transition"
                                >
                                    Close
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

    );
}
