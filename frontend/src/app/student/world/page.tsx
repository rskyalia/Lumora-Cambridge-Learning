"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/Card";
import { DonutRing } from "@/components/ui/DonutRing";
import { useAuth } from "@/context/AuthContext";
import { getLearningWorld, type LearningWorldData } from "@/lib/api";
import {
  RiBookOpenLine, RiGlobalLine, RiRocketLine, RiFlashlightFill,
  RiMedalLine, RiTrophyLine, RiArrowRightLine, RiRefreshLine,
  RiMapLine, RiTimeLine, RiCompassDiscoverLine,
  RiAtomLine, RiCalculatorLine, RiFireLine, RiStarLine, RiStarSmileLine,
} from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

// ── Icon/meta maps ─────────────────────────────────────────────
const subjectMeta: Record<string, {
  Icon: React.ElementType; color: string;
  bg: string; gradFrom: string; gradTo: string;
  label: string; statusColor: (pct: number) => string;
}> = {
  English: {
    Icon: RiBookOpenLine, color: "#6C5CE7",
    bg: "from-lumora/15 via-lavender to-lavender/40",
    gradFrom: "from-lumora", gradTo: "to-lumora-light",
    label: "English Island",
    statusColor: (p) => p >= 80 ? "text-mint" : p >= 55 ? "text-lumora" : "text-sun",
  },
  Mathematics: {
    Icon: RiCalculatorLine, color: "#2EC4B6",
    bg: "from-mint/15 via-mint-soft to-mint-soft/40",
    gradFrom: "from-mint", gradTo: "to-[#1aada0]",
    label: "Math Mountain",
    statusColor: (p) => p >= 80 ? "text-mint" : p >= 55 ? "text-[#1aada0]" : "text-sun",
  },
  Science: {
    Icon: RiAtomLine, color: "#FFC857",
    bg: "from-sun/20 via-sun-soft to-sun-soft/40",
    gradFrom: "from-sun", gradTo: "to-[#e6a800]",
    label: "Science Garden",
    statusColor: (p) => p >= 80 ? "text-mint" : p >= 55 ? "text-[#b88000]" : "text-sun",
  },
  "Global Perspectives": {
    Icon: RiGlobalLine, color: "#2E2E55",
    bg: "from-midnight/10 via-lavender to-lavender/50",
    gradFrom: "from-midnight", gradTo: "to-midnight-soft",
    label: "World View",
    statusColor: () => "text-midnight",
  },
};

const achStyle = (type: string) => ({
  bg:   type === "STREAK" ? "from-orange-100 to-sun-soft" : type === "XP" ? "from-lumora/10 to-lavender" : "from-mint-soft to-mint/10",
  Icon: type === "STREAK" ? RiFireLine : type === "XP" ? RiFlashlightFill : RiStarLine,
  color: type === "STREAK" ? "text-orange-500" : type === "XP" ? "text-lumora" : "text-mint",
  ring:  type === "STREAK" ? "ring-orange-200" : type === "XP" ? "ring-lumora/20" : "ring-mint/20",
});

const XP_PER_LEVEL = 250;

// ── Page ───────────────────────────────────────────────────────
export default function WorldPage() {
  const { profile } = useAuth();
  const [world, setWorld] = useState<LearningWorldData | null>(null);
  const [error, setError]   = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const xpFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const studentId = profile?.id as string | undefined;
    if (!studentId) { setIsLoading(false); return; }
    getLearningWorld(studentId)
      .then(setWorld)
      .catch(e => setError(e instanceof Error ? e.message : "Gagal memuat data"))
      .finally(() => setIsLoading(false));
  }, [profile?.id]);

  useEffect(() => {
    if (!world || !rootRef.current) return;
    const xpPct = Math.round(((world.xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100);

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(".world-hero",
        { y: -28, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: "back.out(1.3)" });

      // XP bar fill
      if (xpFillRef.current) {
        gsap.fromTo(xpFillRef.current,
          { width: "0%" },
          { width: `${xpPct}%`, duration: 1.4, ease: "power2.out", delay: 0.6 });
      }

      // Subject cards bounce in
      gsap.fromTo(".subject-card",
        { y: 40, opacity: 0, scale: 0.88, rotate: -2 },
        { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.55,
          ease: "back.out(1.5)", stagger: 0.12,
          scrollTrigger: { trigger: ".subject-grid", start: "top 86%" } });

      // Mission card
      gsap.fromTo(".mission-card",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".mission-card", start: "top 88%" } });

      // Achievements
      gsap.fromTo(".ach-item",
        { scale: 0, opacity: 0, rotate: -10 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.38,
          ease: "back.out(2)", stagger: 0.07,
          scrollTrigger: { trigger: ".ach-shelf", start: "top 88%" } });

      // Donut rings gentle pulse
      gsap.to(".world-donut", { scale: 1.06, duration: 2.5, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.3 });
    }, rootRef);

    return () => ctx.revert();
  }, [world]);

  if (isLoading) return <WorldSkeleton />;

  if (error || !world) {
    return (
      <Card className="border-2 border-sun/40 bg-sun-soft py-10 text-center">
        <RiRefreshLine size={36} className="mx-auto mb-3 text-sun" />
        <p className="font-semibold text-midnight">Tidak dapat memuat learning world.</p>
        <p className="mt-1 text-sm text-midnight/60">{error}</p>
        <button onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-lumora px-5 py-2.5 text-sm font-bold text-white">
          <RiRefreshLine size={14} /> Coba lagi
        </button>
      </Card>
    );
  }

  const level    = Math.floor(world.xp / XP_PER_LEVEL) + 1;
  const xpInLevel = world.xp % XP_PER_LEVEL;
  const overall  = world.world.length
    ? Math.round(world.world.reduce((s, w) => s + w.masteryPct, 0) / world.world.length) : 0;

  return (
    <div ref={rootRef} className="space-y-6">

      {/* ── Hero ── */}
      <div className="world-hero relative overflow-hidden rounded-3xl bg-gradient-to-br from-midnight via-midnight-soft to-[#1e1b4b] p-6 text-white shadow-[0_8px_32px_-8px_rgba(27,27,58,0.45)]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-lumora/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-6 left-10 h-32 w-32 rounded-full bg-mint/12 blur-xl" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/35">
              <RiMapLine size={11} /> Cambridge Primary · Stage {world.stage}
            </p>
            <h1 className="mt-1.5 text-2xl font-extrabold">
              {world.name}<span className="text-lumora-light">'s World</span>
            </h1>

            {/* XP bar */}
            <div className="mt-4 w-52">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-extrabold text-white/70">
                  <RiStarSmileLine size={11} /> Level {level}
                </span>
                <span className="text-white/35">{xpInLevel} / {XP_PER_LEVEL} XP</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <div ref={xpFillRef}
                  className="h-full rounded-full bg-gradient-to-r from-lumora-light to-mint shadow-[0_0_8px_rgba(46,196,182,0.5)]"
                  style={{ width: "0%" }} />
              </div>
            </div>

            {/* Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-sun/20 px-3 py-1 text-xs font-bold text-sun">
                <RiFlashlightFill size={12} /> {world.xp} XP
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-orange-400/20 px-3 py-1 text-xs font-bold text-orange-300">
                <RiFireLine size={12} /> {world.streak} day streak
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/60">
                <RiMedalLine size={12} /> {world.achievements.length} achievements
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className="world-donut">
              <DonutRing percent={overall} size={78} stroke={8} color="#9B8CF2" trackColor="rgba(255,255,255,0.1)" />
            </div>
            <span className="text-xs text-white/30">Overall</span>
          </div>
        </div>
      </div>

      {/* ── Subject cards ── */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 font-extrabold text-midnight">
          <RiCompassDiscoverLine size={18} className="text-lumora" />
          Your worlds
        </h2>
        <div className="subject-grid grid gap-4 sm:grid-cols-3">
          {world.world.map((w) => {
            const meta = subjectMeta[w.subject] ?? {
              Icon: RiStarSmileLine, color: "#6C5CE7",
              bg: "from-lavender to-white", gradFrom: "from-lumora", gradTo: "to-lumora-light",
              label: w.subject, statusColor: () => "text-lumora",
            };
            const SubIcon = meta.Icon;
            const statusPhrases = [
              { min: 80, label: "Excellent! 🌟", color: meta.statusColor(80) },
              { min: 55, label: "Growing fast!", color: meta.statusColor(55) },
              { min: 0,  label: "Keep going!",   color: meta.statusColor(0)  },
            ];
            const status = statusPhrases.find(s => w.masteryPct >= s.min)!;

            return (
              <div key={w.subject}
                className={`subject-card relative overflow-hidden rounded-3xl bg-gradient-to-br ${meta.bg} p-5 shadow-[0_4px_16px_-4px_rgba(27,27,58,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_-4px_rgba(27,27,58,0.2)]`}
              >
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradFrom} ${meta.gradTo} text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]`}>
                  <SubIcon size={24} />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-midnight">{meta.label}</h3>
                    <p className="text-xs text-midnight/40">{w.subject}</p>
                  </div>
                  <div className="world-donut shrink-0">
                    <DonutRing percent={w.masteryPct} size={50} stroke={5} color={meta.color} />
                  </div>
                </div>
                <p className={`mt-2 text-xs font-bold ${status.color}`}>{status.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mission ── */}
      {world.todaysMission ? (
        <div className="mission-card relative overflow-hidden rounded-3xl bg-gradient-to-br from-lumora to-lumora-light p-6 text-white shadow-[0_8px_24px_-4px_rgba(108,92,231,0.45)]">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/8" />

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/55">
                <RiTimeLine size={11} /> Today's mission
              </p>
              <h2 className="mt-1.5 text-xl font-extrabold">{world.todaysMission.title}</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                  <RiBookOpenLine size={11} /> {world.todaysMission.subject}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                  <RiTimeLine size={11} /> {world.todaysMission.estimatedMins} min
                </span>
              </div>
              <Link href={`/student/practice?activityId=${world.todaysMission.activityId}`}>
                <button className="group mt-4 inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-5 py-2.5 text-sm font-extrabold text-white transition-all hover:border-white hover:bg-white/20">
                  Start now
                  <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <RiRocketLine size={28} />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-lavender bg-white py-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-lavender">
            <RiMapLine size={28} className="text-lumora" />
          </div>
          <p className="font-extrabold text-midnight">No mission yet</p>
          <p className="mt-1 text-sm text-midnight/45">Complete a practice session first!</p>
          <Link href="/student/learn">
            <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-lumora px-5 py-2.5 text-sm font-bold text-white">
              Browse lessons <RiArrowRightLine size={13} />
            </button>
          </Link>
        </div>
      )}

      {/* ── Achievements ── */}
      <div className="ach-shelf rounded-3xl bg-white p-6 shadow-[0_4px_16px_-4px_rgba(27,27,58,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-extrabold text-midnight">
            <RiTrophyLine size={18} className="text-sun" /> Achievements
          </h2>
          <span className="flex items-center gap-1 rounded-full bg-midnight/5 px-3 py-1 text-xs font-bold text-midnight/45">
            <RiMedalLine size={11} /> {world.achievements.length} earned
          </span>
        </div>
        {world.achievements.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {world.achievements.map((a) => {
              const s = achStyle(a.type);
              const AIcon = s.Icon;
              return (
                <div key={a.id}
                  className={`ach-item flex items-center gap-2 rounded-2xl bg-gradient-to-r ${s.bg} px-3.5 py-2.5 text-sm font-semibold ring-1 ${s.ring}`}>
                  <AIcon size={16} className={s.color} />
                  <span className="text-midnight">{a.label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-lavender/40 py-8 text-center">
            <RiStarSmileLine size={32} className="mx-auto mb-2 text-lumora/40" />
            <p className="text-sm font-semibold text-midnight/40">Keep learning to earn your first achievement!</p>
          </div>
        )}
      </div>

    </div>
  );
}

function WorldSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-52 animate-pulse rounded-3xl bg-midnight/15" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1,2,3].map(i => <div key={i} className="h-36 animate-pulse rounded-3xl bg-lavender" />)}
      </div>
      <div className="h-36 animate-pulse rounded-3xl bg-lavender" />
      <div className="h-24 animate-pulse rounded-3xl bg-lavender" />
    </div>
  );
}
