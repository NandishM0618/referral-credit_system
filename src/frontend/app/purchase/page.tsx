"use client";

import { useState } from "react";
import { useUserStore } from "../store/userStore";
import API from "@/services/apiService";
import { CheckCircle, CreditCard } from "lucide-react";
import SideBar from "../components/Sidebar";

type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
};

const products: Product[] = [
    { id: 1, name: "Premium Plan", price: 49, description: "Full access to all features." },
    { id: 2, name: "Pro Plan", price: 29, description: "Most premium features." },
    { id: 3, name: "Starter Plan", price: 9, description: "Basic access for starters." },
];

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

            alert("Purchase successful!");
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Purchase failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <SideBar />
            <div className="flex-1 min-h-screen bg-gray-50 p-6">
                {/* Products List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                                <p className="text-gray-500 mb-4">{product.description}</p>
                                <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                            </div>
                            <button
                                disabled={loading}
                                onClick={() => handlePurchase(product)}
                                className="mt-4 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CreditCard className="w-5 h-5" /> Buy Now
                            </button>
                        </div>
                    ))}
                </div>

                {/* Purchase Confirmation */}
                {purchasedProduct && (
                    <div className="ml-6 p-6 bg-green-50 rounded-xl shadow-md flex flex-col gap-4 min-w-[300px]">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                        <h2 className="text-xl font-semibold text-green-700">Purchase Successful!</h2>
                        <p>
                            <span className="font-medium">User:</span> {user?.name ?? "Guest"}
                        </p>
                        <p>
                            <span className="font-medium">Email:</span> {user?.email ?? "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Product:</span> {purchasedProduct.name}
                        </p>
                        <p>
                            <span className="font-medium">Amount Paid:</span> ${purchasedProduct.price}
                        </p>
                        <p>
                            <span className="font-medium">Credits Earned:</span> {userCredits}
                        </p>
                        {referrerCredits !== null && (
                            <p>
                                <span className="font-medium">Referrer Credits:</span> {referrerCredits}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
