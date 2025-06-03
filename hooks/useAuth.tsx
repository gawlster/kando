import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
    isAuthenticated: boolean;
    refreshAuth: () => void;
} | null>(null);

export function AuthProvider({ children }: { children?: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = () => {
        const match = document.cookie.match(/(^| )auth=([^;]+)/);
        setIsAuthenticated(!!match);
    };

    useEffect(() => {
        checkAuth();
        window.addEventListener("authChanged", checkAuth);
        return () => window.removeEventListener("authChanged", checkAuth);
    }, []);

    return (
        <>
            <AuthContext.Provider value={{ isAuthenticated, refreshAuth: checkAuth }}>
                {children}
            </AuthContext.Provider>
        </>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
