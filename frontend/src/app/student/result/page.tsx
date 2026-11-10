"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Card } from "@/components/ui/Card";
import { DonutRing } from "@/components/ui/DonutRing";
import { useAuth } from "@/context/AuthContext";
import { getLearningWorld } from "@/lib/api";
import {
  RiTrophyLine, RiMedalLine, RiRocketLine, RiRefreshLine,
  RiArrowRightLine, RiTimeLine, RiRepeatLine,
  RiTargetLine, RiBarChart2Line, RiStarSmileLine,
  RiEmotionHappyLine, RiHeartLine, RiFlashlightFill,
  RiStarLine,
} from "react-icons/ri";

interface ResultState {
  skillName: string; score: string;
  accuracyPct: number; attemptsAvg: number; responseTimeSec: number;
  masteryBefore: number; masteryAfter: number;
  adaptiveSignal: string; nextActivityTitle: string; nextActivityId: string | null;
}

const modeConfig: Record<string, { bg: string; textColor: string; Icon: React.ElementType; label: string; desc: string }> = {
  PRACTICE:  { bg: "from-lumora to-lumora-light", textColor: "text-white", Icon: RiBarChart2Line, label: "Practice",     desc: "Keep building your skills" },
  REINFORCE: { bg: "from-sun to-[#e6a800]",       textColor: "text-midnight",Icon: RiRepeatLine,  label: "Reinforce",   desc: "A little more practice will help!" },
  ADVANCE:   { bg: "from-mint to-[#1aada0]",      textColor: "text-white", Icon: RiRocketLine,   label: "Level Up!",   desc: "You are ready for the next level!" },
};

function getScoreColor(pct: number) {
  if (pct >= 80) return "#2EC4B6";
  if (pct >= 55) return "#6C5CE7";
  return "#FFC857";
}

function getScoreInfo(pct: number) {
  if (pct >= 80) return { label: "Excellent!", Icon: RiStarSmileLine, bg: "from-mint to-[#1aada0]" };
  if (pct >= 55) return { label: "Good work!",  Icon: RiEmotionHappyLine, bg: "from-lumora to-lumora-light" };
  return              { label: "Keep going!",  Icon: RiHeartLine,         bg: "from-sun to-[#e6a800]" };
}

export default function ResultPage() {
  const { profile } = useAuth();
  const [result,    setResult]    = useState<ResultState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("lumora_last_result");
    if (stored) {
      try { setResult(JSON.parse(stored)); setIsLoading(false); return; } catch {}
    }
    const studentId = profile?.id as string | undefined;
    if (!studentId) { setIsLoading(false); return; }
    getLearningWorld(studentId)
      .then(world => {
        const m = world.todaysMission;
        setResult({ skillName: m?.subject ?? "—", score: "—", accuracyPct: 0, attemptsAvg: 1,
          responseTimeSec: 0, masteryBefore: 0, masteryAfter: 0,
          adaptiveSignal: m?.mode ?? "PRACTICE", nextActivityTitle: m?.title ?? "—",
          nextActivityId: m?.activityId ?? null });
      })
      .catch(() => setResult(null))
      .finally(() => setIsLoading(false));
  }, [profile?.id]);

  // GSAP celebration
  useEffect(() => {
    if (!result || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(".result-hero",
        { scale: 0.88, opacity: 0, y: -20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.65, ease: "back.out(1.5)" })
        .fromTo(".score-ring",
          { scale: 0, opacity: 0, rotate: -30 },
          { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" }, "-=0.2")
        .fromTo(".evidence-tile",
          { y: 20, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)", stagger: 0.08 }, "-=0.1")
        .fromTo(".mastery-panel",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.1")
        .fromTo(".next-card",
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }, "-=0.1");

      // Donut ring gentle pulse
      gsap.to(".result-donut", {
        scale: 1.05, duration: 2, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 0.8,
      });

      // Confetti stars if excellent
      if (result.accuracyPct >= 80) {
        gsap.fromTo(".confetti-star",
          { y: -20, opacity: 0, scale: 0, rotate: -20 },
          { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.5,
            ease: "back.out(2)", stagger: 0.1, delay: 0.7 });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [result]);

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-44 animate-pulse rounded-3xl bg-lavender" />
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => <div key={i} className="h-24 animate-pulse rounded-3xl bg-lavender" />)}
        </div>
        <div className="h-28 animate-pulse rounded-3xl bg-lavender" />
        <div className="h-28 animate-pulse rounded-3xl bg-lavender" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-3xl bg-white py-12 text-center shadow-[0_4px_16px_-4px_rgba(27,27,58,0.08)]">
        <RiBarChart2Line size={40} className="mx-auto mb-3 text-lumora/40" />
        <p className="font-extrabold text-midnight">No results yet.</p>
        <p className="mt-1 text-sm text-midnight/40">Finish a practice session first.</p>
        <Link href="/student/learn">
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-lumora px-5 py-2.5 text-sm font-bold text-white">
            Go to lessons <RiArrowRightLine size={13} />
          </button>
        </Link>
      </div>
    );
  }

  const hasScore  = result.score !== "—";
  const scoreNum  = hasScore ? parseInt(result.score.split("/")[0], 10) : 0;
  const totalNum  = hasScore ? parseInt(result.score.split("/")[1], 10) : 0;
  const info      = getScoreInfo(result.accuracyPct);
  const ScoreIcon = info.Icon;
  const masteryDelta = result.masteryAfter - result.masteryBefore;

  const modeKey = (["ADVANCE","REINFORCE","PRACTICE"] as const)
    .find(m => result.adaptiveSignal.toUpperCase().includes(m)) ?? "PRACTICE";
  const next = modeConfig[modeKey];
  const NextIcon = next.Icon;

  return (
    <div ref={rootRef} className="space-y-5">

      {/* ── Celebration hero ── */}
      <div className={`result-hero relative overflow-hidden rounded-3xl bg-gradient-to-br ${info.bg} p-6 text-white shadow-[0_8px_28px_-6px_rgba(27,27,58,0.3)]`}>
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/8" />
        <div className="pointer-events-none absolute -bottom-6 left-12 h-28 w-28 rounded-full bg-white/6" />

        {/* Confetti stars */}
        {result.accuracyPct >= 80 && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`confetti-star absolute`}
                style={{ top: `${15 + i * 12}%`, left: `${5 + i * 14}%` }}>
                <RiStarLine size={16} className="text-white/60" />
              </div>
            ))}
          </div>
        )}

        <div className="relative text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-extrabold">
            <ScoreIcon size={16} /> {info.label}
          </div>

          {hasScore && (
            <div className="mt-4 flex items-center justify-center gap-5">
              <div className="score-ring result-donut">
                <DonutRing
                  percent={result.accuracyPct}
                  size={96}
                  stroke={9}
                  color="rgba(255,255,255,0.9)"
                  trackColor="rgba(255,255,255,0.2)"
                  label={`${scoreNum}/${totalNum}`}
                />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wide text-white/50">Score</p>
                <p className="text-4xl font-extrabold">{result.score}</p>
                <p className="text-sm text-white/70">{result.accuracyPct}% accuracy</p>
              </div>
            </div>
          )}
          <p className="mt-3 text-sm font-semibold text-white/60">{result.skillName}</p>
        </div>
      </div>

      {/* ── Evidence tiles ── */}
      {hasScore && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { Icon: RiTargetLine,   value: `${result.accuracyPct}%`, label: "Accuracy",     color: "text-lumora", bg: "bg-lumora/10" },
            { Icon: RiRepeatLine,   value: result.attemptsAvg,       label: "Avg attempts",  color: "text-mint",   bg: "bg-mint-soft" },
            { Icon: RiFlashlightFill,         value: `${result.responseTimeSec}s`, label: "Avg response", color: "text-[#b88000]", bg: "bg-sun-soft" },
          ].map(({ Icon, value, label, color, bg }) => (
            <div key={label} className={`evidence-tile rounded-3xl ${bg} p-4 text-center`}>
              <Icon size={22} className={`mx-auto mb-1.5 ${color}`} />
              <p className="text-lg font-extrabold text-midnight">{value}</p>
              <p className="text-xs text-midnight/45">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Mastery delta ── */}
      {result.masteryAfter > 0 && (
        <div className="mastery-panel rounded-3xl bg-white p-5 shadow-[0_4px_16px_-4px_rgba(27,27,58,0.08)]">
          <p className="mb-4 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-midnight/30">
            <RiBarChart2Line size={13} className="text-lumora" /> {result.skillName} · Mastery update
          </p>
          <div className="flex items-center gap-3">
            <div className="result-donut flex flex-col items-center gap-1">
              <DonutRing percent={result.masteryBefore} size={68} stroke={7} color="#EDEAFF" trackColor="#EDEAFF" />
              <span className="text-xs text-midnight/35">Before</span>
            </div>

            <div className="flex flex-1 flex-col items-center gap-1">
              <div className="flex items-center gap-2 w-full">
                <div className="h-0.5 flex-1 bg-lavender" />
                <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${
                  masteryDelta > 0 ? "bg-mint-soft text-mint" :
                  masteryDelta < 0 ? "bg-sun-soft text-midnight" : "bg-lavender text-midnight/35"
                }`}>
                  {masteryDelta > 0 ? `+${masteryDelta}%` : masteryDelta < 0 ? `${masteryDelta}%` : "—"}
                </span>
                <div className="h-0.5 flex-1 bg-lavender" />
              </div>
              <span className="text-xs text-midnight/25">change</span>
            </div>

            <div className="result-donut flex flex-col items-center gap-1">
              <DonutRing percent={result.masteryAfter} size={68} stroke={7} color={getScoreColor(result.masteryAfter)} />
              <span className="text-xs text-midnight/35">After</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Next step card ── */}
      <div className={`next-card relative overflow-hidden rounded-3xl bg-gradient-to-br ${next.bg} p-6 shadow-[0_6px_20px_-4px_rgba(27,27,58,0.2)]`}>
        <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/8" />
        <div className={`flex items-start gap-4 relative ${next.textColor}`}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <NextIcon size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-widest opacity-55 mb-1">
              Adaptive recommendation
            </p>
            <p className="font-extrabold text-lg leading-snug">{next.desc}</p>
            {result.nextActivityTitle !== "—" && (
              <p className="mt-1 text-sm opacity-60">
                Next: <span className="font-bold">{result.nextActivityTitle}</span>
              </p>
            )}
          </div>
        </div>

        <div className={`mt-5 flex flex-wrap gap-3 ${next.textColor}`}>
          <Link href={result.nextActivityId ? `/student/practice?activityId=${result.nextActivityId}` : "/student/learn"}>
            <button className="inline-flex items-center gap-2 rounded-full border-2 border-current bg-white/15 px-5 py-2.5 text-sm font-extrabold transition-all hover:bg-white/25">
              Continue learning <RiArrowRightLine size={14} />
            </button>
          </Link>
          <Link href="/student/progress">
            <button className="inline-flex items-center gap-2 rounded-full border-2 border-current px-5 py-2.5 text-sm font-bold opacity-60 transition-all hover:opacity-90">
              View progress <RiBarChart2Line size={14} />
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
