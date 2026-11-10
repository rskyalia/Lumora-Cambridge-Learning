"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DonutRing } from "@/components/ui/DonutRing";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { getTeacherDashboard, getMyClasses, type TeacherDashboardData } from "@/lib/api";

import {
  RiTeamLine, RiTargetLine, RiAlertLine, RiCheckboxCircleLine,
  RiLightbulbFlashLine, RiLogoutBoxLine, RiFlashlightFill,
  RiArrowRightLine, RiRefreshLine, RiSearchLine, RiFilterLine,
  RiBookOpenLine, RiGlobalLine,
  RiAtomLine, RiCalculatorLine, RiSchoolLine, RiBrainLine,
  RiUserStarLine, RiStarSmileLine,
} from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

// ── Design tokens ──────────────────────────────────────────────
const subjectColor: Record<string, string> = {
  English: "#6C5CE7", Mathematics: "#2EC4B6",
  Science: "#FFC857", "Global Perspectives": "#2E2E55",
};
const subjectBar: Record<string, string> = {
  English: "bg-lumora", Mathematics: "bg-mint",
  Science: "bg-sun", "Global Perspectives": "bg-midnight-soft",
};
const subjectIcon: Record<string, React.ElementType> = {
  English: RiBookOpenLine, Mathematics: RiCalculatorLine,
  Science: RiAtomLine, "Global Perspectives": RiGlobalLine,
};
const subjectGrad: Record<string, string> = {
  English: "from-lumora to-lumora-light",
  Mathematics: "from-mint to-[#1aada0]",
  Science: "from-sun to-[#e6a800]",
  "Global Perspectives": "from-midnight to-midnight-soft",
};

// ── Component ──────────────────────────────────────────────────
function TeacherDashboardContent() {
  const { user, logout } = useAuth();
  const [data, setData]       = useState<TeacherDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [search, setSearch]   = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Practice" | "On track">("all");
  const rootRef  = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const { classes } = await getMyClasses();
        if (!classes.length) { setError("Tidak ada kelas terhubung."); return; }
        setData(await getTeacherDashboard(classes[0].id));
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
      // header
      gsap.fromTo(headerRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.3)" });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(".teacher-title",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" })
        .fromTo(".kpi-tile",
          { y: 30, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.5)", stagger: 0.08 }, "-=0.1")
        .fromTo(".mastery-chart",
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, "-=0.1")
        .fromTo(".insight-panel",
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, "-=0.5");

      gsap.fromTo(".learner-row",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.05,
          scrollTrigger: { trigger: ".learner-table", start: "top 85%" } });

      // mastery bar width animation
      document.querySelectorAll(".mastery-bar-fill").forEach(el => {
        const w = (el as HTMLElement).dataset.width ?? "0";
        gsap.fromTo(el,
          { width: "0%" },
          { width: `${w}%`, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [data]);

  const filteredLearners = useMemo(() => {
    if (!data) return [];
    return data.learnerOverview.filter(l => {
      const ms = l.name.toLowerCase().includes(search.toLowerCase()) ||
                 l.focusSkill.toLowerCase().includes(search.toLowerCase());
      return ms && (filterStatus === "all" || l.status === filterStatus);
    });
  }, [data, search, filterStatus]);

  if (isLoading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
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

  const needSupportPct = data.activeLearners > 0
    ? Math.round((data.needSupport / data.activeLearners) * 100) : 0;

  return (
    <div ref={rootRef} className="min-h-screen bg-gradient-to-b from-lavender/30 to-white">

      {/* ── Sticky header ── */}
      <header ref={headerRef} className="sticky top-0 z-30 border-b border-lavender/60 bg-white/95 backdrop-blur-md shadow-[0_2px_12px_-2px_rgba(108,92,231,0.1)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-lumora to-lumora-light text-white shadow-[0_4px_10px_rgba(108,92,231,0.3)] transition-transform group-hover:scale-105">
                <RiFlashlightFill size={14} />
              </div>
              <span className="text-base font-extrabold text-midnight group-hover:text-lumora transition-colors">Lumora</span>
            </Link>
            <span className="text-midnight/20">/</span>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-lumora/10">
                <RiUserStarLine size={15} className="text-lumora" />
              </div>
              <span className="font-bold text-midnight">Class {data.className}</span>
              <span className="flex items-center gap-1 rounded-full bg-midnight/5 px-2.5 py-0.5 text-xs font-bold text-midnight/50">
                <RiTeamLine size={11} /> {data.activeLearners}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-midnight/55 sm:block">{user?.name}</span>
            <button onClick={logout} title="Keluar"
              className="flex items-center gap-1.5 rounded-xl border-2 border-lavender p-1.5 text-midnight/50 transition-all hover:border-lumora hover:text-lumora">
              <RiLogoutBoxLine size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">

        {/* ── Title ── */}
        <div className="teacher-title">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-midnight">
            <RiSchoolLine size={26} className="text-lumora" />
            Class Overview
          </h1>
          <p className="mt-1 text-sm text-midnight/45">
            {data.classMastery.length} subjects · Last updated just now
          </p>
        </div>

        {/* ── KPI tiles ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="kpi-tile">
            <KpiCard IconComponent={RiTeamLine}        value={data.activeLearners}   label="Active learners" accentClass="bg-lumora/10"   iconColor="text-lumora" />
          </div>
          <div className="kpi-tile">
            <KpiCard IconComponent={RiTargetLine}      value={`${data.avgMasteryPct}%`} label="Avg. mastery"   accentClass="bg-mint-soft"   iconColor="text-mint" />
          </div>
          <div className="kpi-tile">
            <KpiCard IconComponent={RiAlertLine}       value={data.needSupport}      label="Need support"    accentClass="bg-sun-soft"    iconColor="text-[#b88000]"
              sublabel={`${needSupportPct}% of class`} />
          </div>
          <div className="kpi-tile">
            <KpiCard IconComponent={RiCheckboxCircleLine} value={`${data.completionPct}%`} label="Completion"  accentClass="bg-midnight/5"  iconColor="text-midnight" />
          </div>
        </div>

        {/* ── Middle grid ── */}
        <div className="grid gap-6 lg:grid-cols-5">

          {/* Mastery chart */}
          <div className="mastery-chart lg:col-span-3 rounded-3xl bg-white p-6 shadow-[0_4px_16px_-4px_rgba(27,27,58,0.08)]">
            <SectionHeader title="Class mastery by subject" subtitle="Average skill mastery per subject area" />
            <div className="mt-6 space-y-5">
              {data.classMastery.map((d) => {
                const SubIcon = subjectIcon[d.subject] ?? RiStarSmileLine;
                const statusBg  = d.masteryPct >= 80 ? "bg-mint-soft text-mint" :
                                  d.masteryPct >= 60 ? "bg-lumora/10 text-lumora" :
                                                       "bg-sun-soft text-[#b88000]";
                const statusLbl = d.masteryPct >= 80 ? "Strong" : d.masteryPct >= 60 ? "Good" : "Needs work";
                return (
                  <div key={d.subject}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SubIcon size={15} style={{ color: subjectColor[d.subject] ?? "#6C5CE7" }} />
                        <span className="text-sm font-semibold text-midnight">{d.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-midnight">{d.masteryPct}%</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusBg}`}>{statusLbl}</span>
                      </div>
                    </div>
                    {/* Animated bar */}
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-lavender">
                      <div
                        className={`mastery-bar-fill h-full rounded-full ${subjectBar[d.subject] ?? "bg-lumora"}`}
                        data-width={d.masteryPct}
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Donut row */}
            <div className="mt-6 flex flex-wrap justify-around gap-4 border-t border-lavender pt-5">
              {data.classMastery.map((d) => {
                const SubIcon = subjectIcon[d.subject] ?? RiStarSmileLine;
                return (
                  <div key={d.subject} className="flex flex-col items-center gap-1.5">
                    <DonutRing percent={d.masteryPct} size={68} stroke={7} color={subjectColor[d.subject] ?? "#6C5CE7"} />
                    <div className="flex items-center gap-1">
                      <SubIcon size={11} style={{ color: subjectColor[d.subject] ?? "#6C5CE7" }} />
                      <span className="text-xs font-semibold text-midnight/55">{d.subject}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI insights */}
          <div className="insight-panel flex flex-col gap-4 lg:col-span-2">
            <SectionHeader title="AI Insights" subtitle="Evidence-led action items" />

            {data.aiInsights.length > 0 ? data.aiInsights.map((ins, i) => (
              <div key={i} className="rounded-3xl border border-lumora/20 bg-gradient-to-br from-lavender/60 to-white p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-lumora/10">
                    <RiBrainLine size={18} className="text-lumora" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-lumora/10 px-2.5 py-0.5 text-xs font-bold text-lumora">
                        <RiStarSmileLine size={10} /> AI insight
                      </span>
                      <span className="text-xs text-midnight/35">{ins.subject} · {ins.skill}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-midnight">{ins.summary}</p>
                    <div className="mt-3 flex items-start gap-2 rounded-2xl bg-white p-3">
                      <RiLightbulbFlashLine size={15} className="mt-0.5 shrink-0 text-lumora" />
                      <p className="text-xs font-semibold leading-relaxed text-lumora">{ins.suggestedAction}</p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex-1 rounded-3xl bg-lavender/30 py-10 text-center">
                <RiBrainLine size={32} className="mx-auto mb-2 text-midnight/20" />
                <p className="text-sm text-midnight/40">Belum ada insight tersedia.</p>
              </div>
            )}

            {/* Support alert */}
            {data.needSupport > 0 && (
              <div className="rounded-3xl border border-sun/40 bg-gradient-to-br from-sun-soft to-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-sun-soft">
                    <RiAlertLine size={18} className="text-[#b88000]" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-midnight">
                      {data.needSupport} learner{data.needSupport > 1 ? "s" : ""} below threshold
                    </p>
                    <p className="mt-1 text-xs text-midnight/55">
                      Mastery below 55% — consider additional reinforcement.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Learner table ── */}
        <div className="learner-table rounded-3xl bg-white p-6 shadow-[0_4px_16px_-4px_rgba(27,27,58,0.08)]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <SectionHeader
              title="Learner overview"
              subtitle={`${filteredLearners.length} of ${data.learnerOverview.length} learners`}
            />
            <div className="flex flex-wrap items-center gap-2">
              {/* Filter pills */}
              {(["all", "On track", "Practice"] as const).map((f) => (
                <button key={f} onClick={() => setFilterStatus(f)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                    filterStatus === f ? "bg-lumora text-white shadow-[0_2px_8px_rgba(108,92,231,0.3)]"
                    : "bg-lavender text-midnight/55 hover:text-lumora"
                  }`}>
                  {f === "all" ? <><RiFilterLine size={11} /> All</> :
                   f === "On track" ? <><RiCheckboxCircleLine size={11} /> On track</> :
                   <><RiAlertLine size={11} /> Practice</>}
                </button>
              ))}
              {/* Search */}
              <div className="relative">
                <RiSearchLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-midnight/35" />
                <input type="search" placeholder="Search learner…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="rounded-2xl border-2 border-lavender bg-white py-1.5 pl-8 pr-3 text-xs font-semibold text-midnight outline-none focus:border-lumora w-36 transition-colors" />
              </div>
            </div>
          </div>

          {/* Table header */}
          <div className="mb-2 grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-2 text-[10px] font-extrabold uppercase tracking-widest text-midnight/25">
            <span>Learner</span>
            <span className="text-right">Mastery</span>
            <span className="hidden text-right sm:block">Top skill</span>
            <span className="text-right">Status</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-lavender/50">
            {filteredLearners.length === 0 ? (
              <div className="py-10 text-center">
                <RiSearchLine size={28} className="mx-auto mb-2 text-midnight/20" />
                <p className="text-sm text-midnight/35">No learners match your filter.</p>
              </div>
            ) : filteredLearners.map((learner) => (
              <Link key={learner.studentId} href={`/teacher/student/${learner.studentId}`}
                className="learner-row grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 rounded-2xl px-2 py-3 transition-colors hover:bg-lavender/40">
                {/* Avatar + name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lumora/20 to-lumora-light/20 text-sm font-extrabold text-lumora">
                    {learner.name[0]}
                  </div>
                  <p className="truncate font-bold text-midnight">{learner.name}</p>
                </div>
                {/* Mini bar */}
                <div className="flex w-24 items-center gap-2">
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-lavender">
                    <div className={`h-full rounded-full ${
                      learner.masteryPct >= 80 ? "bg-mint" :
                      learner.masteryPct >= 55 ? "bg-lumora" : "bg-sun"
                    }`} style={{ width: `${learner.masteryPct}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs font-extrabold text-midnight">{learner.masteryPct}%</span>
                </div>
                {/* Skill */}
                <span className="hidden truncate text-right text-xs text-midnight/45 sm:block max-w-[110px]">
                  {learner.focusSkill}
                </span>
                {/* Badge + arrow */}
                <div className="flex items-center gap-1.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    learner.status === "On track" ? "bg-mint-soft text-mint" : "bg-sun-soft text-[#b88000]"
                  }`}>
                    {learner.status === "On track"
                      ? <span className="flex items-center gap-1"><RiCheckboxCircleLine size={11} /> On track</span>
                      : <span className="flex items-center gap-1"><RiAlertLine size={11} /> Practice</span>}
                  </span>
                  <RiArrowRightLine size={13} className="text-midnight/20" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-lavender/30">
      <div className="h-14 border-b border-lavender bg-white" />
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-lavender" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 animate-pulse rounded-3xl bg-white shadow-soft" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="h-72 animate-pulse rounded-3xl bg-white shadow-soft lg:col-span-3" />
          <div className="h-72 animate-pulse rounded-3xl bg-white shadow-soft lg:col-span-2" />
        </div>
        <div className="h-64 animate-pulse rounded-3xl bg-white shadow-soft" />
      </main>
    </div>
  );
}

export default function TeacherDashboardPage() {
  return <AuthGuard allowedRoles={["TEACHER","ADMIN"]}><TeacherDashboardContent /></AuthGuard>;
}
