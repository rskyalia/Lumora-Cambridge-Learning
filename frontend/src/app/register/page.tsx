"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const ROLE_REDIRECT: Record<string, string> = {
  STUDENT: "/onboarding",
  TEACHER: "/teacher/dashboard",
  PARENT: "/parent/dashboard",
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER" | "PARENT">("STUDENT");
  const [stage, setStage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register({ name, email, password, role, stage: role === "STUDENT" ? stage : undefined });
      router.push(ROLE_REDIRECT[role] ?? "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal");
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
        <h1 className="mb-6 text-xl font-extrabold text-midnight">Buat akun baru</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role picker */}
          <div>
            <p className="mb-2 text-sm font-semibold text-midnight">Saya adalah…</p>
            <div className="flex gap-2">
              {(["STUDENT", "TEACHER", "PARENT"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className="focus:outline-none"
                >
                  <Badge tone={role === r ? "purple" : "navy"}>
                    {r === "STUDENT" ? "Siswa" : r === "TEACHER" ? "Guru" : "Orang tua"}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-midnight" htmlFor="name">
              Nama
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              className="w-full rounded-2xl border-2 border-lavender bg-white px-4 py-2.5 text-midnight outline-none transition focus:border-lumora"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-midnight" htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              className="w-full rounded-2xl border-2 border-lavender bg-white px-4 py-2.5 text-midnight outline-none transition focus:border-lumora"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-midnight" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 karakter"
              className="w-full rounded-2xl border-2 border-lavender bg-white px-4 py-2.5 text-midnight outline-none transition focus:border-lumora"
            />
          </div>

          {/* Stage picker — only for students */}
          {role === "STUDENT" && (
            <div>
              <p className="mb-2 text-sm font-semibold text-midnight">Kelas / Stage</p>
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStage(s)}
                    className={`h-10 w-10 rounded-full font-extrabold transition-colors ${
                      stage === s ? "bg-lumora text-white" : "bg-lavender text-midnight"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-xl bg-sun-soft px-4 py-2 text-sm font-semibold text-midnight">
              {error}
            </p>
          )}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Mendaftar…" : "Daftar"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-midnight/50">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-lumora hover:underline">
            Masuk
          </Link>
        </p>
      </Card>
    </main>
  );
}
