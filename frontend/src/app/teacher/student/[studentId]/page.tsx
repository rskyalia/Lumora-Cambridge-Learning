"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DonutRing } from "@/components/ui/DonutRing";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { getTeacherStudentDetail, type TeacherStudentDetailData } from "@/lib/api";
import {
  RiTargetLine, RiCheckboxCircleLine, RiLogoutBoxLine, RiArrowRightLine,
  RiBarChart2Line, RiCalendarLine, RiMedalLine, RiAwardLine, RiGlobalLine,
  RiFlashlightFill, RiFireLine,
} from "react-icons/ri";
import { TbBolt, TbFlame } from "react-icons/tb";

// ── Design tokens ──────────────────────────────────────────────
const subjectMeta: Record<string, { color: string; barBg: string; bg: string; emoji: string }> = {
  English:              { color: "#6C5CE7", barBg: "bg-lumora",        bg: "bg-lumora/10",   emoji: "📖" },
  Mathematics:          { color: "#2EC4B6", barBg: "bg-mint",          bg: "bg-mint-soft",   emoji: "🏔️" },
  Science:              { color: "#FFC857", barBg: "bg-sun",           bg: "bg-sun-soft",    emoji: "🌱" },
  "Global Perspectives":{ color: "#2E2E55", barBg: "bg-midnight-soft", bg: "bg-midnight/5",  emoji: "🌍" },
};

const statusConfig = (s: string) =>
  s === "Advance"    ? { tone: "mint" as const,   icon: "🚀" } :
  s === "Practice"   ? { tone: "sun"  as const,   icon: "⚠️" } :
                       { tone: "purple" as const, icon: "✅" };

function computeTrend(history: { score: number }[]): number {
  if (history.length < 2) return 0;
  return history[history.length - 1].score - history[history.length - 2].score;
}

// ── Types ──────────────────────────────────────────────────────
type Tab = "overview" | "skills" | "sessions";

// ── Main content ───────────────────────────────────────────────
function StudentDetailContent() {
  const params   = useParams();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const studentId = params.studentId as string;

  const [data,      setData]      = useState<TeacherStudentDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [tab,       setTab]       = useState<Tab>("overview");

  useEffect(() => {
    if (!studentId) return;
    getTeacherStudentDetail(studentId)
      .then(setData)
      .catch(e => setError(e instanceof Error ? e.message : "Gagal memuat data siswa"))
      .finally(() => setIsLoading(false));
  }, [studentId]);

  /* ── Loading ── */
  if (isLoading) return <DetailSkeleton />;

  /* ── Error ── */
  if (error || !data) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Card className="border-2 border-sun/40 bg-sun-soft text-center">
          <p className="font-semibold text-midnight">{error ?? "Data tidak ditemukan."}</p>
          <Button className="mt-4" onClick={() => router.back()}>Kembali</Button>
        </Card>
      </main>
    );
  }

  /* ── Derived ── */
  const bySubject: Record<string, typeof data.masteryBySkill> = {};
  for (const sk of data.masteryBySkill) {
    bySubject[sk.subject] = bySubject[sk.subject] ?? [];
    bySubject[sk.subject].push(sk);
  }
  const completedSessions = data.recentSessions.filter(s => s.completed).length;
  const avgAccuracy = data.recentSessions.filter(s => s.accuracy !== null).length
    ? Math.round(
        data.recentSessions.filter(s => s.accuracy !== null)
          .reduce((sum, s) => sum + s.accuracy!, 0) /
        data.recentSessions.filter(s => s.accuracy !== null).length
      )
    : null;

  /* ── Layout ── */
  return (
    <div className="min-h-screen bg-lavender/30">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-30 border-b border-lavender/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/teacher/dashboard" className="text-sm font-bold text-lumora shrink-0">
              ← Dashboard
            </Link>
            <span className="text-midnight/20">/</span>
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lumora/10 text-xs font-extrabold text-lumora">
                {data.name[0]}
              </div>
              <span className="truncate font-bold text-midnight">{data.name}</span>
              <Badge tone="navy">Stage {data.stage}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden text-sm font-semibold text-midnight/60 sm:block">{user?.name}</span>
            <button onClick={logout} className="rounded-pill bg-lavender px-3 py-1.5 text-xs font-bold text-midnight/50 hover:text-lumora transition-colors">
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">

        {/* ── Hero profile banner ── */}
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-midnight to-midnight-soft p-6 text-white shadow-soft">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-lumora/10" />
          <div className="pointer-events-none absolute -bottom-6 right-24 h-28 w-28 rounded-full bg-mint/10" />

          <div className="relative flex items-start gap-5">
            {/* Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl font-extrabold">
              {data.name[0]}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-extrabold">{data.name}</h1>
              <p className="text-sm text-white/60">Cambridge Primary · Stage {data.stage}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-pill bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                  ⚡ {data.xp} XP
                </span>
                <span className="rounded-pill bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                  🔥 {data.streak} day streak
                </span>
                <span className="rounded-pill bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                  🏅 {data.achievements.length} achievements
                </span>
              </div>
            </div>

            {/* Overall ring */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <DonutRing
                percent={data.overallMasteryPct}
                size={80}
                stroke={8}
                color="#9B8CF2"
                trackColor="rgba(255,255,255,0.12)"
              />
              <span className="text-xs text-white/40">Overall</span>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard IconComponent={RiTargetLine}         label="Overall mastery"  value={`${data.overallMasteryPct}%`} accentClass="bg-lumora/10"  iconColor="text-lumora" />
          <KpiCard IconComponent={TbBolt}               label="XP earned"        value={data.xp}                      accentClass="bg-sun-soft"   iconColor="text-[#b88000]" />
          <KpiCard IconComponent={TbFlame}              label="Day streak"       value={data.streak}                  accentClass="bg-mint-soft"  iconColor="text-mint" />
          <KpiCard IconComponent={RiCheckboxCircleLine} label="Sessions done"    value={completedSessions}            accentClass="bg-midnight/5" iconColor="text-midnight"
            sublabel={avgAccuracy !== null ? `${avgAccuracy}% avg accuracy` : undefined}
          />
        </div>

        {/* ── Tab bar ── */}
        <div className="flex gap-1 rounded-2xl bg-lavender p-1">
          {([
            { key: "overview" as Tab, label: "Overview",  icon: "📊" },
            { key: "skills"   as Tab, label: "Skills",    icon: "🧠" },
            { key: "sessions" as Tab, label: "Sessions",  icon: "📅" },
          ] as const).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition-all ${
                tab === key
                  ? "bg-white text-lumora shadow-soft"
                  : "text-midnight/60 hover:text-lumora"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ──────────────────────────────────────────────────────
            Tab: OVERVIEW
        ────────────────────────────────────────────────────── */}
        {tab === "overview" && (
          <div className="space-y-5">

            {/* Subject mastery summary row */}
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(bySubject).map(([subject, skills]) => {
                const avg = Math.round(skills.reduce((s, sk) => s + sk.currentMasteryPct, 0) / skills.length);
                const meta = subjectMeta[subject] ?? { color: "#6C5CE7", bg: "bg-lumora/10", emoji: "✨" };
                return (
                  <div key={subject} className="flex items-center gap-3 rounded-card bg-white p-4 shadow-soft">
                    <DonutRing percent={avg} size={56} stroke={6} color={meta.color} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span>{meta.emoji}</span>
                        <p className="truncate text-sm font-extrabold text-midnight">{subject}</p>
                      </div>
                      <p className="text-xs text-midnight/40">{skills.length} skill{skills.length !== 1 ? "s" : ""}</p>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-lavender">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${avg}%`, backgroundColor: meta.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Skills needing attention */}
            {data.masteryBySkill.filter(sk => sk.status === "Practice").length > 0 && (
              <Card>
                <SectionHeader
                  title="Needs attention"
                  subtitle="Skills below 55% mastery — consider assigning reinforcement"
                />
                <div className="mt-4 divide-y divide-lavender/60">
                  {data.masteryBySkill
                    .filter(sk => sk.status === "Practice")
                    .map(sk => {
                      const meta = subjectMeta[sk.subject];
                      return (
                        <div key={sk.skillId} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-base ${meta?.bg ?? "bg-lavender"}`}>
                              {meta?.emoji ?? "✨"}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-midnight text-sm">{sk.skillName}</p>
                              <p className="text-xs text-midnight/40">{sk.strand}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm font-extrabold text-midnight">{sk.currentMasteryPct}%</span>
                            <Badge tone="sun">⚠️ Practice</Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>
            )}

            {/* Achievements */}
            {data.achievements.length > 0 && (
              <Card>
                <SectionHeader title="Achievements" subtitle={`${data.achievements.length} earned`} />
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.achievements.map((a) => (
                    <div
                      key={a.id}
                      className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold ${
                        a.type === "STREAK" ? "bg-mint-soft text-midnight" :
                        a.type === "XP"     ? "bg-sun-soft text-midnight" :
                                              "bg-lavender text-lumora"
                      }`}
                    >
                      <span>{a.type === "STREAK" ? "🔥" : a.type === "XP" ? "⚡" : "🏅"}</span>
                      {a.label}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ──────────────────────────────────────────────────────
            Tab: SKILLS
        ────────────────────────────────────────────────────── */}
        {tab === "skills" && (
          <div className="space-y-5">
            {Object.entries(bySubject).map(([subject, skills]) => {
              const meta = subjectMeta[subject] ?? { color: "#6C5CE7", barBg: "bg-lumora", bg: "bg-lumora/10", emoji: "✨" };
              return (
                <Card key={subject}>
                  {/* Subject header */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xl ${meta.bg}`}>
                      {meta.emoji}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-midnight">{subject}</h3>
                      <p className="text-xs text-midnight/40">{skills.length} skill{skills.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  <div className="divide-y divide-lavender/50">
                    {skills.map((sk) => {
                      const trend = computeTrend(sk.history);
                      const { tone, icon } = statusConfig(sk.status);
                      return (
                        <div key={sk.skillId} className="py-4 first:pt-0">
                          {/* Skill header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-midnight">{sk.skillName}</span>
                                <Badge tone={tone}>{icon} {sk.status}</Badge>
                                <TrendBadge value={trend} size="xs" />
                              </div>
                              <p className="mt-0.5 text-xs text-midnight/40">{sk.strand}</p>
                            </div>
                            <span className="shrink-0 text-lg font-extrabold text-midnight">
                              {sk.currentMasteryPct}%
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-lavender">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${meta.barBg}`}
                              style={{ width: `${sk.currentMasteryPct}%` }}
                            />
                          </div>

                          {/* Sparkline */}
                          {sk.history.length > 1 && (
                            <div className="mt-2.5">
                              <p className="mb-1 text-xs text-midnight/25">
                                History · {sk.history.length} updates
                              </p>
                              <MiniSparkline data={sk.history} color={meta.color} barBg={meta.barBg} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}

            {data.masteryBySkill.length === 0 && (
              <Card className="py-10 text-center">
                <p className="text-3xl mb-3">📊</p>
                <p className="text-sm text-midnight/50">No skill data yet. Student hasn't completed any sessions.</p>
              </Card>
            )}
          </div>
        )}

        {/* ──────────────────────────────────────────────────────
            Tab: SESSIONS
        ────────────────────────────────────────────────────── */}
        {tab === "sessions" && (
          <div className="space-y-4">
            {/* Summary row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-card bg-white p-4 text-center shadow-soft">
                <p className="text-2xl font-extrabold text-midnight">{data.recentSessions.length}</p>
                <p className="text-xs font-semibold text-midnight/50 mt-1">Total sessions</p>
              </div>
              <div className="rounded-card bg-white p-4 text-center shadow-soft">
                <p className="text-2xl font-extrabold text-midnight">{completedSessions}</p>
                <p className="text-xs font-semibold text-midnight/50 mt-1">Completed</p>
              </div>
              <div className="rounded-card bg-white p-4 text-center shadow-soft">
                <p className="text-2xl font-extrabold text-midnight">
                  {avgAccuracy !== null ? `${avgAccuracy}%` : "—"}
                </p>
                <p className="text-xs font-semibold text-midnight/50 mt-1">Avg accuracy</p>
              </div>
            </div>

            {/* Session log */}
            <Card>
              <SectionHeader title="Session activity" subtitle="Most recent 10 sessions" />
              {data.recentSessions.length === 0 ? (
                <div className="mt-6 py-8 text-center">
                  <p className="text-3xl mb-3">📅</p>
                  <p className="text-sm text-midnight/50">No sessions recorded yet.</p>
                </div>
              ) : (
                <div className="mt-4 divide-y divide-lavender/50">
                  {data.recentSessions.map((s) => {
                    const meta = subjectMeta[s.subject];
                    return (
                      <div key={s.sessionId} className="flex items-center gap-4 py-4">
                        {/* Subject icon */}
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base ${meta?.bg ?? "bg-lavender"}`}>
                          {meta?.emoji ?? "📝"}
                        </div>

                        {/* Activity info */}
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold text-midnight text-sm">{s.activityTitle}</p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-midnight/40">
                            <span>{s.subject}</span>
                            <span>·</span>
                            <span>
                              {new Date(s.startedAt).toLocaleDateString("id-ID", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                            </span>
                            {s.durationMins !== null && (
                              <>
                                <span>·</span>
                                <span>{s.durationMins} min</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="flex shrink-0 items-center gap-3">
                          {s.accuracy !== null && (
                            <div className="text-right">
                              <p className={`text-sm font-extrabold ${
                                s.accuracy >= 80 ? "text-mint" :
                                s.accuracy >= 55 ? "text-lumora" : "text-sun"
                              }`}>
                                {s.accuracy}%
                              </p>
                              <p className="text-xs text-midnight/30">{s.totalAttempts} attempts</p>
                            </div>
                          )}
                          <Badge tone={s.completed ? "mint" : "navy"}>
                            {s.completed ? "✓ Done" : "In progress"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

      </main>
    </div>
  );
}

// ── Sparkline with SVG line overlay ──────────────────────────
function MiniSparkline({
  data,
  color,
  barBg,
}: {
  data: { score: number; timestamp: string }[];
  color: string;
  barBg: string;
}) {
  const recent = data.slice(-10);
  const max = Math.max(...recent.map(d => d.score), 1);
  const H = 28;

  const points = recent.map((p, i) => {
    const x = recent.length < 2 ? 50 : (i / (recent.length - 1)) * 100;
    const y = H - (p.score / max) * H * 0.85 - H * 0.075;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative h-7">
      <div className="absolute inset-0 flex items-end gap-px">
        {recent.map((p, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t opacity-15 ${barBg}`}
            style={{ height: `${(p.score / max) * 100}%`, minHeight: "2px" }}
          />
        ))}
      </div>
      <svg viewBox={`0 0 100 ${H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {recent.length >= 2 && (
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-lavender/30">
      <div className="h-14 bg-white border-b border-lavender" />
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        <div className="h-40 animate-pulse rounded-card bg-midnight/20" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 animate-pulse rounded-card bg-white shadow-soft" />)}
        </div>
        <div className="h-12 animate-pulse rounded-2xl bg-lavender" />
        <div className="h-64 animate-pulse rounded-card bg-white shadow-soft" />
      </main>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────
export default function StudentDetailPage() {
  return (
    <AuthGuard allowedRoles={["TEACHER", "ADMIN"]}>
      <StudentDetailContent />
    </AuthGuard>
  );
}
