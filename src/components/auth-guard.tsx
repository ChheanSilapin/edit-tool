"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/use-auth-store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.replace("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated && typeof window !== "undefined" && !localStorage.getItem("access_token")) {
        return null;
    }

    return <>{children}</>;
}
