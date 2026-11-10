"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await login(email, password);
      const role = result.user.role;
      if (role === "STUDENT") {
        router.push(result.onboardingDone ? "/student/world" : "/onboarding");
      } else {
        const map: Record<string, string> = {
          TEACHER: "/teacher/dashboard",
          PARENT: "/parent/dashboard",
          ADMIN: "/",
        };
        router.push(map[role] ?? "/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="mb-8 text-2xl font-extrabold text-lumora">
        Lumora
      </Link>

      <Card className="w-full">
        <h1 className="mb-6 text-xl font-extrabold text-midnight">Masuk ke akunmu</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-midnight" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alya@lumora.dev"
              className="w-full rounded-2xl border-2 border-lavender bg-white px-4 py-2.5 text-midnight outline-none transition focus:border-lumora"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-midnight" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border-2 border-lavender bg-white px-4 py-2.5 text-midnight outline-none transition focus:border-lumora"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-sun-soft px-4 py-2 text-sm font-semibold text-midnight">
              {error}
            </p>
          )}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Masuk…" : "Masuk"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-midnight/50">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-lumora hover:underline">
            Daftar
          </Link>
        </p>

        {/* Dev shortcut */}
        <details className="mt-6">
          <summary className="cursor-pointer text-xs text-midnight/30 hover:text-midnight/50">
            Dev accounts
          </summary>
          <div className="mt-2 space-y-1 text-xs text-midnight/50">
            <p>🎓 alya@lumora.dev / lumora2026</p>
            <p>👩‍🏫 teacher@lumora.dev / lumora2026</p>
            <p>👨‍👩‍👧 parent@lumora.dev / lumora2026</p>
          </div>
        </details>
      </Card>
    </main>
  );
}
