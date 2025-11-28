import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
    UID: number;
    email: string;
    role: string;
    lastOnline?: string; // Optional based on your needs
    isSubsExp?: number; // receive 0 or 1
    hasClockedIn?: number; // receive 0 or 1
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    user: null,
    login: () => {},
    logout: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    // Initialize state from localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });

    const [user, setUser] = useState<User | null>(() => {
        try {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
        console.error("Failed to parse user data:", error);
        return null;
        }
    });

    // Universal login handler
    const login = (userData: User) => {
        setIsLoggedIn(true);
        setUser(userData);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // Complete logout handler
    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        // Add API call to backend logout endpoint if needed
    };

    // Optional: Auto-login from localStorage on app load
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
        try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Failed to parse user data:", error);
            logout();
        }
        }
  }, []);

  return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);