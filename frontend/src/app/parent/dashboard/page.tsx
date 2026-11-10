"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/Card";
import { DonutRing } from "@/components/ui/DonutRing";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { getParentDashboard, getMyChildren, type ParentDashboardData } from "@/lib/api";

import {
  RiTimeLine, RiBookOpenLine, RiFireLine, RiLogoutBoxLine,
  RiFlashlightFill, RiArrowRightLine, RiRefreshLine,
  RiLightbulbFlashLine, RiBarChart2Line, RiCalendarLine, RiGlobalLine,
  RiAtomLine, RiCalculatorLine, RiGroupLine, RiStarSmileLine,
} from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

// ── Design tokens ──────────────────────────────────────────────
const subjectMeta: Record<string, {
  Icon: React.ElementType; color: string;
  grad: string; bg: string;
}> = {
  English:              { Icon: RiBookOpenLine, color: "#6C5CE7", grad: "from-lumora to-lumora-light", bg: "bg-lumora/10" },
  Mathematics:          { Icon: RiCalculatorLine,     color: "#2EC4B6", grad: "from-mint to-[#1aada0]",     bg: "bg-mint-soft" },
  Science:              { Icon: RiAtomLine,             color: "#FFC857", grad: "from-sun to-[#e6a800]",      bg: "bg-sun-soft"  },
  "Global Perspectives":{ Icon: RiGlobalLine,       color: "#2E2E55", grad: "from-midnight to-midnight-soft", bg: "bg-midnight/5" },
};
const dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// ── Component ──────────────────────────────────────────────────
function ParentDashboardContent() {
  const { user, logout } = useAuth();
  const [data, setData]       = useState<ParentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const rootRef   = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const { children } = await getMyChildren();
        if (!children.length) { setError("Tidak ada data anak terhubung."); return; }
        setData(await getParentDashboard(children[0].id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal memuat dashboard");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // GSAP
  useEffect(() => {
    if (!data || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.3)" });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(".parent-hero",
        { scale: 0.95, opacity: 0, y: -20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.65, ease: "back.out(1.4)" })
        .fromTo(".stat-pill",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.08 }, "-=0.2")
        .fromTo(".subject-tile",
          { y: 30, opacity: 0, scale: 0.9, rotate: -1 },
          { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.45, ease: "back.out(1.5)", stagger: 0.1 }, "-=0.1")
        .fromTo(".weekly-chart",
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.1")
        .fromTo(".insight-card",
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.5")
        .fromTo(".momentum-card",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out",
            scrollTrigger: { trigger: ".momentum-card", start: "top 88%" } });

      // Subject donut rings pulse
      gsap.to(".subject-donut", {
        scale: 1.06, duration: 2.5, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.3,
      });

      // Bar chart bars animate from zero
      document.querySelectorAll(".week-bar").forEach(el => {
        const h = (el as HTMLElement).dataset.height ?? "0";
        gsap.fromTo(el,
          { height: "0%" },
          { height: `${h}%`, duration: 0.6, ease: "power2.out",
            delay: Number((el as HTMLElement).dataset.delay ?? 0),
            scrollTrigger: { trigger: ".weekly-chart", start: "top 88%", once: true } });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [data]);

  if (isLoading) return <ParentSkeleton />;

  if (error || !data) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-3xl border-2 border-sun/40 bg-sun-soft p-8 text-center">
          <RiRefreshLine size={36} className="mx-auto mb-3 text-sun" />
          <p className="font-semibold text-midnight">{error ?? "Data tidak ditemukan."}</p>
          <button onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-lumora px-5 py-2.5 text-sm font-bold text-white">
            <RiRefreshLine size={14} /> Coba lagi
          </button>
        </div>
      </main>
    );
  }

  const weekMax = Math.max(...(data.weeklyData ?? [1]), 1);
  const today   = (new Date().getDay() + 6) % 7; // 0=Mon

  return (
    <div ref={rootRef} className="min-h-screen bg-gradient-to-b from-lavender/30 to-white">

      {/* ── Header ── */}
      <header ref={headerRef} className="sticky top-0 z-30 border-b border-lavender/60 bg-white/95 backdrop-blur-md shadow-[0_2px_12px_-2px_rgba(108,92,231,0.1)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-lumora to-lumora-light text-white shadow-[0_4px_10px_rgba(108,92,231,0.3)] transition-transform group-hover:scale-105">
              <RiFlashlightFill size={14} />
            </div>
            <span className="text-base font-extrabold text-midnight group-hover:text-lumora transition-colors">Lumora</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-mint-soft">
              <RiGroupLine size={15} className="text-mint" />
            </div>
            <span className="text-sm font-bold text-midnight">Parent view</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold text-midnight/45 sm:block">{user?.name}</span>
            <button onClick={logout} title="Keluar"
              className="flex items-center rounded-xl border-2 border-lavender p-1.5 text-midnight/50 transition-all hover:border-lumora hover:text-lumora">
              <RiLogoutBoxLine size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-6 py-8">

        {/* ── Hero profile ── */}
        <div className="parent-hero relative overflow-hidden rounded-3xl bg-gradient-to-br from-midnight via-midnight-soft to-[#1e1b4b] p-6 text-white shadow-[0_8px_28px_-6px_rgba(27,27,58,0.4)]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-lumora/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-6 left-10 h-32 w-32 rounded-full bg-mint/10 blur-xl" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/35">
                <RiGroupLine size={11} /> Parent dashboard
              </p>
              <h1 className="mt-1.5 truncate text-2xl font-extrabold">{data.name}</h1>
              <p className="text-sm text-white/50">Cambridge Primary · Stage {data.stage}</p>

              {/* Stat pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="stat-pill flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/75">
                  <RiTimeLine size={12} /> {data.learningTime}
                </span>
                <span className="stat-pill flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/75">
                  <RiBookOpenLine size={12} /> {data.completedActivities} activities
                </span>
                <span className="stat-pill flex items-center gap-1.5 rounded-full bg-orange-400/20 px-3 py-1 text-xs font-bold text-orange-300">
                  <RiFireLine size={12} /> {data.streak} day streak
                </span>
              </div>
            </div>

            {/* Overall ring */}
            <div className="flex shrink-0 flex-col items-center gap-1">
              <div className="subject-donut">
                <DonutRing percent={data.overallProgress} size={78} stroke={8}
                  color="#9B8CF2" trackColor="rgba(255,255,255,0.1)" />
              </div>
              <span className="text-xs text-white/30">Overall</span>
            </div>
          </div>
        </div>

        {/* ── Subject tiles ── */}
        <div>
          <p className="mb-3 flex items-center gap-2 font-extrabold text-midnight">
            <RiBarChart2Line size={18} className="text-lumora" />
            Progress by subject
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {data.subjectProgress.map((s) => {
              const meta = subjectMeta[s.subject] ?? {
                Icon: RiStarSmileLine, color: "#6C5CE7",
                grad: "from-lumora to-lumora-light", bg: "bg-lumora/10",
              };
              const SubIcon = meta.Icon;
              return (
                <div key={s.subject}
                  className="subject-tile flex items-center gap-3 rounded-3xl bg-white p-4 shadow-[0_4px_16px_-4px_rgba(27,27,58,0.1)] transition-all hover:-translate-y-1">
                  <div className="subject-donut shrink-0">
                    <DonutRing percent={s.masteryPct} size={54} stroke={6} color={meta.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br ${meta.grad} text-white`}>
                        <SubIcon size={14} />
                      </div>
                      <p className="truncate text-sm font-extrabold text-midnight">{s.subject}</p>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-midnight/40">{s.label}</p>
                    {/* bar */}
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-lavender">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${s.masteryPct}%`, backgroundColor: meta.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Weekly chart + AI insight ── */}
        <div className="grid gap-5 sm:grid-cols-2">

          {/* Weekly bar chart */}
          <div className="weekly-chart rounded-3xl bg-white p-5 shadow-[0_4px_16px_-4px_rgba(27,27,58,0.08)]">
            <p className="mb-4 flex items-center gap-2 font-extrabold text-midnight">
              <RiCalendarLine size={17} className="text-lumora" />
              This week's activity
            </p>
            <div className="flex h-28 items-end gap-2">
              {(data.weeklyData ?? Array(7).fill(0)).map((v, i) => {
                const heightPct = weekMax > 0 ? Math.max((v / weekMax) * 100, v > 0 ? 6 : 0) : 0;
                const isToday = i === today;
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                    {v > 0 && <span className="text-[10px] font-bold text-midnight/40">{v}</span>}
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className={`week-bar w-full rounded-t-xl transition-all ${
                          isToday ? "bg-gradient-to-t from-lumora to-lumora-light shadow-[0_2px_8px_rgba(108,92,231,0.4)]"
                                  : "bg-lavender"
                        }`}
                        data-height={heightPct}
                        data-delay={(i * 0.08).toFixed(2)}
                        style={{ height: "0%" }}
                        title={`${v} session${v !== 1 ? "s" : ""}`}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${isToday ? "text-lumora" : "text-midnight/30"}`}>
                      {dayLabels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI insight */}
          {data.aiInsight ? (
            <div className="insight-card flex flex-col gap-3 rounded-3xl bg-gradient-to-br from-lavender/70 to-white p-5 shadow-[0_4px_16px_-4px_rgba(27,27,58,0.08)]">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-lumora/10">
                  <RiLightbulbFlashLine size={18} className="text-lumora" />
                </div>
                <span className="flex items-center gap-1 rounded-full bg-lumora/10 px-2.5 py-1 text-xs font-bold text-lumora">
                  <RiStarSmileLine size={10} /> AI insight
                </span>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-midnight">{data.aiInsight}</p>
              <p className="flex items-center gap-1.5 text-xs text-midnight/35">
                <RiCalendarLine size={11} /> Updated daily
              </p>
            </div>
          ) : (
            <div className="insight-card flex items-center justify-center rounded-3xl bg-lavender/40 py-10 text-center">
              <div>
                <RiStarSmileLine size={28} className="mx-auto mb-2 text-lumora/30" />
                <p className="text-sm text-midnight/35">Insight will appear after more sessions.</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Learning momentum ── */}
        <div className="momentum-card rounded-3xl bg-white p-6 shadow-[0_4px_16px_-4px_rgba(27,27,58,0.08)]">
          <p className="mb-4 flex items-center gap-2 font-extrabold text-midnight">
            <RiFireLine size={18} className="text-orange-500" />
            Learning momentum
          </p>
          <div className="flex items-center gap-5">
            {/* Streak bubble */}
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-gradient-to-br from-orange-100 to-sun-soft px-5 py-4">
              <RiFireLine size={28} className="text-orange-500" />
              <span className="text-2xl font-extrabold text-midnight">{data.streak}</span>
              <span className="text-xs font-semibold text-midnight/45">day streak</span>
            </div>

            {/* Dots */}
            <div className="flex-1">
              <p className="mb-2.5 text-xs font-semibold text-midnight/40">Activity last 7 days</p>
              <div className="flex gap-2">
                {(data.weeklyData ?? Array(7).fill(0)).map((v, i) => (
                  <div key={i} title={`${dayLabels[i]}: ${v} session(s)`}
                    className={`h-8 flex-1 rounded-xl transition-colors ${
                      v > 0 ? "bg-gradient-to-b from-mint to-[#1aada0] shadow-[0_2px_6px_rgba(46,196,182,0.3)]"
                            : "bg-lavender"
                    }`} />
                ))}
              </div>
              <div className="mt-1.5 flex gap-2">
                {dayLabels.map(d => (
                  <span key={d} className="flex-1 text-center text-[10px] font-bold text-midnight/25">{d[0]}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

function ParentSkeleton() {
  return (
    <div className="min-h-screen bg-lavender/30">
      <div className="h-14 border-b border-lavender bg-white" />
      <main className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <div className="h-44 animate-pulse rounded-3xl bg-midnight/15" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-24 animate-pulse rounded-3xl bg-white shadow-soft" />)}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="h-40 animate-pulse rounded-3xl bg-white shadow-soft" />
          <div className="h-40 animate-pulse rounded-3xl bg-white shadow-soft" />
        </div>
        <div className="h-28 animate-pulse rounded-3xl bg-white shadow-soft" />
      </main>
    </div>
  );
}

export default function ParentDashboardPage() {
  return <AuthGuard allowedRoles={["PARENT","ADMIN"]}><ParentDashboardContent /></AuthGuard>;
}
