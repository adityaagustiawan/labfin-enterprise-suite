"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type UserType = "company" | "free" | null;

interface UserProfile {
  email: string;
  name?: string;
  picture?: string;
  type: UserType;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, name?: string, picture?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For the Public Demo version, we auto-login a demo user immediately
    const demoUser: UserProfile = {
      email: "demo@finlab.ai",
      name: "Demo User",
      picture: "https://logo.clearbit.com/apple.com",
      type: "company"
    };
    setUser(demoUser);
    setIsLoading(false);
  }, []);

  const login = (email: string, name?: string, picture?: string) => {
    // Basic logic: if email has a common business domain (or just not gmail/yahoo/outlook for demo)
    // For this demo, let's say if it contains a dot in the domain part that isn't a common free one
    const freeDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
    const domain = email.split("@")[1]?.toLowerCase();
    // For Demo Version, everyone is treated as company to unlock all features
    const type: UserType = "company";

    const profile: UserProfile = { email, name, picture, type };
    setUser(profile);
    localStorage.setItem("lablens_auth", JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lablens_auth");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
