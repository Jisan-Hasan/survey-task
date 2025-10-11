"use client";

import { getRequest } from "@/lib/requests";
import { AnyType } from "@/lib/types";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<{
    user: AnyType | null;
    getProfile: () => Promise<void>;
}>({
    user: null,
    getProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AnyType | null>(null);

    const getProfile = async () => {
        const response = await getRequest("profile");

        if (response?.code === "success" && response?.data) {
            setUser(response.data); // Updates `user` state
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                getProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }

    return context;
}
