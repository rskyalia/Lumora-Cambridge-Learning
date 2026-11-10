"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  getLearningWorld, listActivities,
  type LearningWorldData, type ActivityListItem,
} from "@/lib/api";
import {
  RiBookOpenLine, RiPencilLine, RiArrowRightLine, RiTimeLine,
  RiFlashlightFill, RiRefreshLine, RiStarLine, RiRocketLine,
  RiGlobalLine, RiCompassDiscoverLine,
  RiAtomLine, RiCalculatorLine, RiQuillPenLine, RiStarSmileLine,
} from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

const subjectIcon: Record<string, React.ElementType> = {
  English: RiBookOpenLine,
  Mathematics: RiCalculatorLine,
  Science: RiAtomLine,
  "Global Perspectives": RiGlobalLine,
};

const subjectGrad: Record<string, string> = {
  English: "from-lumora to-lumora-light",
  Mathematics: "from-mint to-[#1aada0]",
  Science: "from-sun to-[#e6a800]",
  "Global Perspectives": "from-midnight to-midnight-soft",
};

const diffLabel = (d: number) =>
  d <= 1 ? { l: "Intro",        bg: "bg-mint-soft text-mint" } :
  d <= 2 ? { l: "Practice",     bg: "bg-lumora/10 text-lumora" } :
  d <= 3 ? { l: "Intermediate", bg: "bg-sun-soft text-midnight" } :
           { l: "Challenge",    bg: "bg-orange-100 text-orange-600" };

export default function LearnPage() {
  const { profile } = useAuth();
  const [world, setWorld]             = useState<LearningWorldData | null>(null);
  const [lessons, setLessons]         = useState<ActivityListItem[]>([]);
  const [practice, setPractice]       = useState<ActivityListItem[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const studentId = profile?.id as string | undefined;
    const stage = (profile as { stage?: number } | null)?.stage ?? 3;
    if (!studentId) { setIsLoading(false); return; }

    Promise.all([
      getLearningWorld(studentId),
      listActivities({ stage, type: "LESSON" }),
      listActivities({ stage, type: "PRACTICE" }),
    ])
      .then(([w, ls, ps]) => { setWorld(w); setLessons(ls); setPractice(ps); })
      .catch(e => setError(e instanceof Error ? e.message : "Gagal memuat pelajaran"))
      .finally(() => setIsLoading(false));
  }, [profile?.id]);

  useEffect(() => {
    if (isLoading || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".learn-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });

      gsap.fromTo(".mission-banner",
        { scale: 0.95, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: "back.out(1.3)", delay: 0.1 });

      gsap.fromTo(".activity-card",
        { y: 35, opacity: 0, scale: 0.93, rotate: 1 },
        { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.5,
          ease: "back.out(1.4)", stagger: 0.09,
          scrollTrigger: { trigger: ".activity-grid", start: "top 86%" } });
    }, rootRef);
    return () => ctx.revert();
  }, [isLoading, lessons, practice]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-40 animate-pulse rounded-xl bg-lavender" />
        <div className="h-24 animate-pulse rounded-3xl bg-lavender" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1,2,3,4].map(i => <div key={i} className="h-40 animate-pulse rounded-3xl bg-lavender" />)}
        </div>
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

  const mission = world?.todaysMission;
  const storyCtx = lessons[0]?.storyContext ?? practice[0]?.storyContext ?? "Let's Save Water!";

  return (
    <div ref={rootRef} className="space-y-8">

      {/* ── Header ── */}
      <div className="learn-header">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-midnight">
          <RiBookOpenLine size={24} className="text-lumora" />
          Today's lessons
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-midnight/55">
          <RiStarSmileLine size={13} className="text-lumora" />
          Part of your "<span className="font-semibold text-lumora">{storyCtx}</span>" theme
        </p>
      </div>

      {/* ── Mission banner ── */}
      {mission && (
        <div className="mission-banner relative overflow-hidden rounded-3xl bg-gradient-to-r from-lumora/90 to-lumora-light p-5 text-white shadow-[0_6px_20px_-4px_rgba(108,92,231,0.4)]">
          <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/8" />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/55">
                <RiFlashlightFill size={11} /> Recommended for you
              </p>
              <p className="mt-1 truncate text-base font-extrabold">{mission.title}</p>
              <p className="text-xs text-white/60">
                {mission.subject} · {mission.estimatedMins} min · {mission.mode}
              </p>
            </div>
            <Link href={`/student/practice?activityId=${mission.activityId}`} className="shrink-0">
              <button className="group flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-lumora transition-all hover:shadow-md">
                Start
                <RiArrowRightLine size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Lessons ── */}
      {lessons.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-extrabold text-midnight">
            <RiBookOpenLine size={17} className="text-lumora" /> Lessons
          </h2>
          <div className="activity-grid grid gap-4 sm:grid-cols-2">
            {lessons.map((lesson) => {
              const subj = lesson.skill.learningObjective.strand.subject.name;
              const SubIcon = subjectIcon[subj] ?? RiStarSmileLine;
              const grad = subjectGrad[subj] ?? "from-lumora to-lumora-light";
              return (
                <div key={lesson.id}
                  className="activity-card flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_4px_16px_-4px_rgba(27,27,58,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_-4px_rgba(27,27,58,0.18)]">
                  {/* Coloured top strip */}
                  <div className={`flex items-center gap-2 bg-gradient-to-r ${grad} px-5 py-3`}>
                    <SubIcon size={20} className="text-white" />
                    <span className="text-sm font-extrabold text-white">{subj}</span>
                    <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-white/70">
                      <RiTimeLine size={11} /> {lesson.estimatedMins} min
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-extrabold text-midnight">{lesson.title}</h3>
                    {lesson.storyContext && (
                      <p className="mt-1 text-xs text-midnight/50">
                        Part of "{lesson.storyContext}"
                      </p>
                    )}
                    <Link href={`/student/lesson?activityId=${lesson.id}`} className="mt-4">
                      <button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-lumora/10 py-2.5 text-sm font-bold text-lumora transition-all hover:bg-lumora hover:text-white">
                        <RiBookOpenLine size={15} />
                        Read lesson
                        <RiArrowRightLine size={13} className="ml-auto transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Practice ── */}
      {practice.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-extrabold text-midnight">
            <RiPencilLine size={17} className="text-mint" /> Practice
          </h2>
          <div className="activity-grid grid gap-4 sm:grid-cols-2">
            {practice.map((act) => {
              const subj = act.skill.learningObjective.strand.subject.name;
              const SubIcon = subjectIcon[subj] ?? RiStarSmileLine;
              const grad = subjectGrad[subj] ?? "from-mint to-[#1aada0]";
              const diff = diffLabel(act.difficulty);
              return (
                <div key={act.id}
                  className="activity-card flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_4px_16px_-4px_rgba(27,27,58,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_-4px_rgba(27,27,58,0.18)]">
                  <div className={`flex items-center gap-2 bg-gradient-to-r ${grad} px-5 py-3`}>
                    <SubIcon size={20} className="text-white" />
                    <span className="text-sm font-extrabold text-white">{subj}</span>
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${diff.bg}`}>
                      {diff.l}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-extrabold text-midnight">{act.title}</h3>
                    <p className="mt-1 text-xs text-midnight/50">
                      {act.skill.name} · {act.estimatedMins} min
                    </p>
                    <Link href={`/student/practice?activityId=${act.id}`} className="mt-4">
                      <button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-mint/10 py-2.5 text-sm font-bold text-mint transition-all hover:bg-mint hover:text-white">
                        <RiPencilLine size={15} />
                        Start practice
                        <RiArrowRightLine size={13} className="ml-auto transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Empty ── */}
      {lessons.length === 0 && practice.length === 0 && !mission && (
        <div className="rounded-3xl border-2 border-dashed border-lavender bg-white py-12 text-center">
          <RiCompassDiscoverLine size={36} className="mx-auto mb-3 text-lumora/40" />
          <p className="font-extrabold text-midnight">Belum ada konten untuk stage ini.</p>
          <p className="mt-1 text-sm text-midnight/45">Konten baru akan muncul setelah guru menambahkannya.</p>
        </div>
      )}
    </div>
  );
}
