"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthUser, AuthProfile, loadSession, saveSession, clearSession } from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  profile: AuthProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: AuthUser; onboardingDone: boolean }>;
  register: (payload: {
    email: string;
    password: string;
    name: string;
    role: "STUDENT" | "TEACHER" | "PARENT";
    stage?: number;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setToken(session.token);
      setUser(session.user);
      setProfile(session.profile);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Login gagal");
    }
    const data = await res.json();
    saveSession(data);
    setToken(data.token);
    setUser(data.user);
    setProfile(data.profile);
    return { user: data.user as AuthUser, onboardingDone: data.onboardingDone as boolean };
  }, []);

  const register = useCallback(
    async (payload: {
      email: string;
      password: string;
      name: string;
      role: "STUDENT" | "TEACHER" | "PARENT";
      stage?: number;
    }) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Registrasi gagal");
      }
      const data = await res.json();
      saveSession(data);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile);
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
