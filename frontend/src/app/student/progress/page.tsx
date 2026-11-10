"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DonutRing } from "@/components/ui/DonutRing";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { useAuth } from "@/context/AuthContext";
import { getStudentProgress, type StudentProgressData } from "@/lib/api";
import {
  RiBarChart2Line, RiArrowDownSLine, RiRefreshLine,
  RiCheckboxCircleLine, RiGlobalLine,
  RiBookOpenLine, RiAtomLine, RiCalculatorLine, RiStarSmileLine,
} from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

const subjectMeta: Record<string, {
  Icon: React.ElementType; color: string; barColor: string;
  bg: string; gradFrom: string; gradTo: string;
}> = {
  English:             { Icon: RiBookOpenLine, color: "#6C5CE7", barColor: "bg-lumora",        bg: "bg-lumora/10",   gradFrom: "from-lumora",  gradTo: "to-lumora-light" },
  Mathematics:         { Icon: RiCalculatorLine,     color: "#2EC4B6", barColor: "bg-mint",          bg: "bg-mint-soft",   gradFrom: "from-mint",    gradTo: "to-[#1aada0]"   },
  Science:             { Icon: RiAtomLine,             color: "#FFC857", barColor: "bg-sun",           bg: "bg-sun-soft",    gradFrom: "from-sun",     gradTo: "to-[#e6a800]"   },
  "Global Perspectives":{ Icon: RiGlobalLine,      color: "#2E2E55", barColor: "bg-midnight-soft", bg: "bg-midnight/5",  gradFrom: "from-midnight",gradTo: "to-midnight-soft"},
};

const statusConfig = (pct: number) =>
  pct < 55 ? { tone: "sun"    as const, label: "Needs practice", Icon: RiStarSmileLine } :
  pct >= 80 ? { tone: "mint"  as const, label: "Strong!",         Icon: RiCheckboxCircleLine } :
              { tone: "purple"as const, label: "Progressing",     Icon: RiBarChart2Line };

function computeTrend(h: { score: number }[]) {
  if (h.length < 2) return 0;
  return h[h.length - 1].score - h[h.length - 2].score;
}

export default function ProgressPage() {
  const { profile } = useAuth();
  const [data, setData]       = useState<StudentProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [open, setOpen]       = useState<Set<string>>(new Set(["English","Mathematics","Science"]));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = profile?.id as string | undefined;
    if (!id) { setIsLoading(false); return; }
    getStudentProgress(id)
      .then(setData)
      .catch(e => setError(e instanceof Error ? e.message : "Gagal memuat progress"))
      .finally(() => setIsLoading(false));
  }, [profile?.id]);

  useEffect(() => {
    if (!data || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".progress-hero",
        { y: -25, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.3)" });
      gsap.fromTo(".subject-section",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.1,
          scrollTrigger: { trigger: ".subject-section", start: "top 87%" } });
    }, rootRef);
    return () => ctx.revert();
  }, [data]);

  const toggleSection = (subject: string, el: HTMLElement | null) => {
    setOpen(prev => {
      const next = new Set(prev);
      const opening = !next.has(subject);
      if (opening) {
        next.add(subject);
        // animate open
        const content = el?.querySelector(".section-content") as HTMLElement | null;
        if (content) {
          gsap.fromTo(content,
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" });
        }
      } else {
        next.delete(subject);
        const content = el?.querySelector(".section-content") as HTMLElement | null;
        if (content) {
          gsap.to(content, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in",
            onComplete: () => setOpen(p => { const n2 = new Set(p); n2.delete(subject); return n2; }) });
          return prev; // don't change state yet, wait for animation
        }
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-40 animate-pulse rounded-3xl bg-midnight/15" />
        {[1,2,3].map(i => (
          <div key={i} className="overflow-hidden rounded-3xl bg-white shadow-soft">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 animate-pulse rounded-2xl bg-lavender" />
                <div className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-lavender" />
                  <div className="h-3 w-16 animate-pulse rounded bg-lavender" />
                </div>
              </div>
              <div className="h-11 w-11 animate-pulse rounded-full bg-lavender" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-sun/40 bg-sun-soft py-10 text-center">
        <RiRefreshLine size={32} className="mx-auto mb-2 text-sun" />
        <p className="font-semibold text-midnight">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>Coba lagi</Button>
      </Card>
    );
  }

  if (!data || data.skills.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-midnight">
          <RiBarChart2Line size={24} className="text-lumora" /> My Progress
        </h1>
        <div className="rounded-3xl bg-white py-12 text-center shadow-soft">
          <RiStarSmileLine size={40} className="mx-auto mb-3 text-lumora/40" />
          <p className="font-extrabold text-midnight">No progress yet.</p>
          <p className="mt-1 text-sm text-midnight/40">Complete a practice session to see your growth here!</p>
        </div>
      </div>
    );
  }

  const bySubject: Record<string, typeof data.skills> = {};
  for (const sk of data.skills) {
    bySubject[sk.subject] = bySubject[sk.subject] ?? [];
    bySubject[sk.subject].push(sk);
  }
  const overall = Math.round(data.skills.reduce((s, sk) => s + sk.currentMasteryPct, 0) / data.skills.length);

  return (
    <div ref={rootRef} className="space-y-5">

      {/* ── Summary header ── */}
      <div className="progress-hero relative overflow-hidden rounded-3xl bg-gradient-to-br from-midnight via-midnight-soft to-[#1e1b4b] p-6 text-white shadow-[0_8px_28px_-8px_rgba(27,27,58,0.4)]">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-lumora/12 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/35">
              <RiBarChart2Line size={11} /> Skill mastery overview
            </p>
            <h1 className="mt-1.5 text-2xl font-extrabold">My Progress</h1>
            <p className="mt-1 text-sm text-white/50">
              {data.skills.length} skill{data.skills.length !== 1 ? "s" : ""} · {Object.keys(bySubject).length} subjects
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(bySubject).map(([subj, skills]) => {
                const avg = Math.round(skills.reduce((s, sk) => s + sk.currentMasteryPct, 0) / skills.length);
                const meta = subjectMeta[subj];
                const SubIcon = meta?.Icon ?? RiStarSmileLine;
                return (
                  <span key={subj} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
                    <SubIcon size={11} /> {subj}: {avg}%
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1">
            <DonutRing percent={overall} size={76} stroke={8} color="#9B8CF2" trackColor="rgba(255,255,255,0.1)" />
            <span className="text-xs text-white/30">Overall</span>
          </div>
        </div>
      </div>

      {/* ── Subject sections ── */}
      {Object.entries(bySubject).map(([subject, skills]) => {
        const meta = subjectMeta[subject] ?? {
          Icon: RiStarSmileLine, color: "#6C5CE7", barColor: "bg-lumora",
          bg: "bg-lumora/10", gradFrom: "from-lumora", gradTo: "to-lumora-light",
        };
        const SubIcon = meta.Icon;
        const avg  = Math.round(skills.reduce((s, sk) => s + sk.currentMasteryPct, 0) / skills.length);
        const isOpen = open.has(subject);
        let sectionRef: HTMLDivElement | null = null;

        return (
          <div key={subject} className="subject-section overflow-hidden rounded-3xl bg-white shadow-[0_4px_16px_-4px_rgba(27,27,58,0.08)]"
            ref={el => { sectionRef = el; }}>

            {/* Header */}
            <button
              className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-lavender/20"
              onClick={() => toggleSection(subject, sectionRef)}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradFrom} ${meta.gradTo} text-white shadow-[0_3px_8px_rgba(0,0,0,0.12)]`}>
                  <SubIcon size={22} />
                </div>
                <div>
                  <p className="font-extrabold text-midnight">{subject}</p>
                  <p className="text-xs text-midnight/40">{skills.length} skill{skills.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <DonutRing percent={avg} size={42} stroke={4} color={meta.color} />
                <RiArrowDownSLine size={20} className={`text-midnight/35 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            {/* Skills list */}
            {isOpen && (
              <div className="section-content divide-y divide-lavender/50 border-t border-lavender/60">
                {skills.map((skill) => {
                  const trend  = computeTrend(skill.history);
                  const status = statusConfig(skill.currentMasteryPct);
                  const StatusIcon = status.Icon;

                  return (
                    <div key={skill.skillId} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-extrabold text-midnight">{skill.skillName}</p>
                            <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              status.tone === "mint" ? "bg-mint-soft text-mint" :
                              status.tone === "sun"  ? "bg-sun-soft text-midnight" :
                                                       "bg-lumora/10 text-lumora"
                            }`}>
                              <StatusIcon size={11} /> {status.label}
                            </span>
                            <TrendBadge value={trend} size="xs" />
                          </div>
                          <p className="mt-0.5 text-xs text-midnight/35">{skill.strandName}</p>
                        </div>
                        <span className="shrink-0 text-lg font-extrabold text-midnight">
                          {skill.currentMasteryPct}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-lavender">
                        <div className={`h-full rounded-full transition-all duration-700 ${meta.barColor}`}
                          style={{ width: `${skill.currentMasteryPct}%` }} />
                      </div>

                      {/* Sparkline */}
                      {skill.history.length > 1 && (
                        <div className="mt-3">
                          <p className="mb-1.5 text-xs text-midnight/25">
                            History · {skill.history.length} updates
                          </p>
                          <Sparkline data={skill.history} color={meta.color} barClass={meta.barColor} />
                        </div>
                      )}

                      <p className="mt-2 text-xs text-midnight/20">
                        Updated {new Date(skill.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Sparkline({ data, color, barClass }: { data: { score: number; timestamp: string }[]; color: string; barClass: string }) {
  const recent = data.slice(-14);
  const max = Math.max(...recent.map(d => d.score), 1);
  const H = 40;
  const points = recent.map((p, i) => {
    const x = recent.length < 2 ? 50 : (i / (recent.length - 1)) * 100;
    const y = H - (p.score / max) * H * 0.85 - H * 0.075;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative h-10">
      <div className="absolute inset-0 flex items-end gap-px">
        {recent.map((p, i) => (
          <div key={i} className={`flex-1 rounded-t opacity-20 ${barClass}`}
            style={{ height: `${(p.score / max) * 100}%`, minHeight: "2px" }} />
        ))}
      </div>
      <svg viewBox={`0 0 100 ${H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
