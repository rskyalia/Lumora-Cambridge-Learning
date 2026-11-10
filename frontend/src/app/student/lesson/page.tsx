"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DonutRing } from "@/components/ui/DonutRing";
import { useAuth } from "@/context/AuthContext";
import { getActivity, getLearningWorld, type ActivityData, type LearningWorldData } from "@/lib/api";
import {
  RiBookOpenLine, RiArrowRightLine, RiArrowLeftLine,
  RiLightbulbFlashLine, RiTargetLine, RiRocketLine,
  RiRefreshLine, RiSkipForwardLine, RiGlobalLine,
  RiAtomLine, RiCalculatorLine, RiStarSmileLine,
} from "react-icons/ri";

const subjectIconMap: Record<string, React.ElementType> = {
  English: RiBookOpenLine,
  Mathematics: RiCalculatorLine,
  Science: RiAtomLine,
  "Global Perspectives": RiGlobalLine,
};

// Step icons by type
const stepIconMap: Record<string, { Icon: React.ElementType; bg: string; color: string }> = {
  story:     { Icon: RiBookOpenLine,       bg: "bg-lumora/10",  color: "text-lumora" },
  objective: { Icon: RiTargetLine,         bg: "bg-mint-soft",  color: "text-mint"   },
  concept:   { Icon: RiLightbulbFlashLine, bg: "bg-sun-soft",   color: "text-[#b88000]" },
  ready:     { Icon: RiRocketLine,         bg: "bg-lavender",   color: "text-lumora" },
};

function buildSteps(activity: ActivityData & { skill: any }) {
  const subject   = activity.skill?.learningObjective?.strand?.subject?.name ?? "";
  const strand    = activity.skill?.learningObjective?.strand?.name ?? activity.skill?.name ?? "";
  const loDesc    = activity.skill?.learningObjective?.description ?? "";
  const story     = activity.storyContext;

  const steps: { type: string; title: string; body: string }[] = [];
  if (story) steps.push({
    type: "story",
    title: story,
    body: `Dalam tema "${story}", kita akan mengeksplorasi ${strand.toLowerCase()} melalui cerita yang dekat dengan kehidupan sehari-hari. Yuk mulai!`,
  });
  steps.push({ type: "objective", title: "Apa yang akan kamu pelajari", body: loDesc || `Pada pelajaran ini kamu akan belajar tentang ${strand}.` });
  steps.push({ type: "concept",   title: activity.title, body: `Perhatikan baik-baik materi berikut sebelum kamu mencoba soal latihan. Setiap pertanyaan yang kamu jawab membantu Lumora menyesuaikan pelajaran berikutnya.` });
  steps.push({ type: "ready",     title: "Siap berlatih?", body: `Kamu sudah membaca materi "${activity.title}". Sekarang waktunya mencoba beberapa soal!` });
  return steps;
}

export default function LessonPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useAuth();

  const activityId = searchParams.get("activityId");
  const studentId  = profile?.id as string | undefined;

  const [activity, setActivity] = useState<(ActivityData & { skill: any }) | null>(null);
  const [world,    setWorld]    = useState<LearningWorldData | null>(null);
  const [step,     setStep]     = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardRef  = useRef<HTMLDivElement>(null);
  const rootRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activityId) { setError("Lesson tidak ditemukan."); setIsLoading(false); return; }
    Promise.all([
      getActivity(activityId),
      studentId ? getLearningWorld(studentId) : Promise.resolve(null),
    ])
      .then(([act, w]) => { setActivity(act as any); setWorld(w); })
      .catch(e => setError(e instanceof Error ? e.message : "Gagal memuat lesson"))
      .finally(() => setIsLoading(false));
  }, [activityId, studentId]);

  // Entrance
  useEffect(() => {
    if (!rootRef.current || isLoading) return;
    gsap.fromTo(rootRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
  }, [isLoading]);

  // Step card flip animation
  const animateStep = (nextStep: number) => {
    if (!cardRef.current) { setStep(nextStep); return; }
    gsap.to(cardRef.current, {
      opacity: 0, x: -30, scale: 0.95, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setStep(nextStep);
        gsap.fromTo(cardRef.current,
          { opacity: 0, x: 30, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: "back.out(1.3)" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-lavender" />
        <div className="h-3 rounded-full bg-lavender" />
        <div className="h-56 animate-pulse rounded-3xl bg-lavender" />
        <div className="flex gap-3">
          <div className="h-11 w-24 animate-pulse rounded-full bg-lavender" />
          <div className="h-11 w-24 animate-pulse rounded-full bg-lavender" />
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <Card className="border-2 border-sun/40 bg-sun-soft py-10 text-center">
        <RiRefreshLine size={32} className="mx-auto mb-2 text-sun" />
        <p className="font-semibold text-midnight">{error ?? "Lesson tidak tersedia."}</p>
        <Button className="mt-4" onClick={() => router.push("/student/learn")}>Kembali ke Learn</Button>
      </Card>
    );
  }

  const steps   = buildSteps(activity);
  const current = steps[step];
  const isLast  = step === steps.length - 1;
  const subject = (activity as any).skill?.learningObjective?.strand?.subject?.name ?? "";
  const SubIcon = subjectIconMap[subject] ?? RiStarSmileLine;
  const stepMeta = stepIconMap[current.type] ?? stepIconMap.concept;
  const StepIcon = stepMeta.Icon;
  const subjectMastery = world?.world.find(w => w.subject === subject);

  return (
    <div ref={rootRef} className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 rounded-full bg-lumora/10 px-3 py-1 text-xs font-bold text-lumora">
              <SubIcon size={12} /> {subject || "Lesson"}
            </span>
            <span className="text-xs text-midnight/40">Step {step + 1} of {steps.length}</span>
          </div>
          <h1 className="mt-2 text-xl font-extrabold text-midnight">{activity.title}</h1>
        </div>
        {subjectMastery && (
          <div className="flex shrink-0 flex-col items-center gap-1">
            <DonutRing percent={subjectMastery.masteryPct} size={52} stroke={5} color="#6C5CE7" />
            <p className="text-xs text-midnight/40">Mastery</p>
          </div>
        )}
      </div>

      {/* ── Progress bar ── */}
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${
            i < step ? "bg-lumora" : i === step ? "bg-lumora-light" : "bg-lavender"
          }`} />
        ))}
      </div>

      {/* ── Step card ── */}
      <div ref={cardRef} className="rounded-3xl bg-white p-7 shadow-[0_4px_20px_-4px_rgba(27,27,58,0.12)]">
        <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${stepMeta.bg}`}>
          <StepIcon size={28} className={stepMeta.color} />
        </div>
        <h2 className="text-xl font-extrabold text-midnight">{current.title}</h2>
        <p className="mt-3 text-base leading-relaxed text-midnight/65">{current.body}</p>

        {activity.storyContext && current.type !== "story" && (
          <p className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-lumora/60">
            <RiStarSmileLine size={12} /> Theme: {activity.storyContext}
          </p>
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => animateStep(step - 1)}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-full border-2 border-lavender px-5 py-2.5 text-sm font-bold text-midnight/60 transition-all hover:border-lumora hover:text-lumora disabled:opacity-30"
        >
          <RiArrowLeftLine size={15} /> Back
        </button>

        {isLast ? (
          <Link href={`/student/practice?activityId=${activity.id}`}>
            <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-lumora to-lumora-light px-6 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_12px_rgba(108,92,231,0.35)] transition-all hover:shadow-[0_6px_18px_rgba(108,92,231,0.45)]">
              <RiRocketLine size={15} />
              Start practice
              <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        ) : (
          <button
            onClick={() => animateStep(step + 1)}
            className="group inline-flex items-center gap-2 rounded-full bg-lumora px-6 py-2.5 text-sm font-extrabold text-white transition-all hover:bg-lumora-light"
          >
            Next
            <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>

      {/* Skip */}
      {!isLast && (
        <p className="text-center">
          <Link href={`/student/practice?activityId=${activity.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-midnight/35 transition-colors hover:text-lumora">
            <RiSkipForwardLine size={13} /> Skip to practice
          </Link>
        </p>
      )}
    </div>
  );
}
