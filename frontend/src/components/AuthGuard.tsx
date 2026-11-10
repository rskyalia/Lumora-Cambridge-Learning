"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

/**
 * AuthGuard — protects pages by role.
 * - Redirects to /login if not authenticated.
 * - Redirects to / if authenticated but wrong role.
 * Shows nothing while auth state is loading (prevents flash).
 */
export function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lumora border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
