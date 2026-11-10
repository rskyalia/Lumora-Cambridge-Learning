"use client";

// Thin client wrapper so the root layout can stay a server component.
// Imported lazily so the landing page doesn't pull in the full auth bundle.
import { AuthProvider } from "@/context/AuthContext";

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
