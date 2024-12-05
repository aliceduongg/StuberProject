"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function withAuth(Component: React.ComponentType<any>) {
    return function ProtectedRoute(props: any) {
        const router = useRouter();
        const [authorized, setAuthorized] = useState(false);

        useEffect(() => {
            const checkAuth = () => {
                const user = localStorage.getItem("user");
                const token = localStorage.getItem("token");

                if (!user || !token) {
                    router.push("/login");
                } else {
                    setAuthorized(true);
                }
            };

            checkAuth();
        }, [router]);

        return authorized ? <Component {...props} /> : null;
    };
}
