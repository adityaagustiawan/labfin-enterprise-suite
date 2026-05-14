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

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
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
