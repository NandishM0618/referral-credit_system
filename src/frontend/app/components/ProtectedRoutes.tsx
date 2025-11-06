"use client";

import { useUserStore } from "@/app/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const token = useUserStore((state) => state.token);

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token, router]);

    return <>{children}</>;
}
