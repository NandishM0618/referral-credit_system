"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { useRouter } from "next/navigation";
import API from "@/services/apiService";
import SideBar from "../components/Sidebar";
import Referral from "../components/Referral";

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { token, logout } = useUserStore();

    useEffect(() => {
        if (!token) {
            router.replace("/login");
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await API.get("/referral/dashboard", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(res.data);
            } catch (error: any) {
                console.error("Dashboard fetch failed:", error);
                if (error.response?.status === 401) {
                    logout();
                    router.replace("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token, router, logout]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex">
            <SideBar />
            <Referral />
        </div>
    );
}
