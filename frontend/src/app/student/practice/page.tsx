"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuestionCard } from "@/components/student/QuestionCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  getActivity,
  createSession,
  endSession,
  submitAttempt,
  type ActivityData,
  type AdaptiveResultData,
} from "@/lib/api";

// Fallback activityId jika tidak ada ?activityId= di URL (seeded default)
const FALLBACK_ACTIVITY_ID = process.env.NEXT_PUBLIC_FALLBACK_ACTIVITY_ID ?? "";

// Practice — sistem memberikan pertanyaan berdasarkan skill, tingkat
// kesulitan, dan performa terbaru (Bagian 7).
export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAuth();

  const activityId = searchParams.get("activityId") ?? FALLBACK_ACTIVITY_ID;
  const studentId = profile?.id as string | undefined;

  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastResult, setLastResult] = useState<AdaptiveResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const questionStartTime = useRef<number>(Date.now());

  // Load activity + create session
  useEffect(() => {
    if (!studentId || !activityId) {
      setError("Activity tidak ditemukan. Kembali ke halaman Learn.");
      setIsLoading(false);
      return;
    }

    async function init() {
      try {
        const [act, session] = await Promise.all([
          getActivity(activityId),
          createSession(studentId!, activityId),
        ]);
        setActivity(act);
        setSessionId(session.id);
        questionStartTime.current = Date.now();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat activity");
      } finally {
        setIsLoading(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, activityId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-lavender" />
        <div className="h-64 animate-pulse rounded-card bg-lavender" />
      </div>
    );
  }

  if (error || !activity || !sessionId || !studentId) {
    return (
      <Card className="border-2 border-sun/40 bg-sun-soft text-center">
        <p className="font-semibold text-midnight">{error ?? "Activity tidak tersedia."}</p>
        <Button className="mt-4" onClick={() => router.push("/student/learn")}>
          Kembali ke Learn
        </Button>
      </Card>
    );
  }

  const question = activity.questions[index];
  const isLast = index === activity.questions.length - 1;

  async function handleAnswered(isCorrect: boolean, selectedAnswer: string) {
    if (!question || !sessionId || !studentId) return;
    if (isCorrect) setCorrectCount((c) => c + 1);

    const responseTimeMs = Date.now() - questionStartTime.current;

    try {
      const result = await submitAttempt({
        studentId,
        sessionId,
        questionId: question.id,
        answer: selectedAnswer,
        responseTimeMs,
        attemptNumber: 1,
      });
      setLastResult(result);
    } catch {
      // Non-blocking — mastery update gagal tapi user tetap bisa lanjut
    }

    setTimeout(async () => {
      if (isLast) {
        // Tutup sesi sebelum pindah ke result
        try {
          await endSession(sessionId);
        } catch {
          // Non-blocking
        }
        // Tulis summary ke sessionStorage untuk halaman result
        if (lastResult?.mastery && activity) {
          const totalQ = activity.questions.length;
          const score = `${correctCount + (isCorrect ? 1 : 0)}/${totalQ}`;
          const accuracy = Math.round(((correctCount + (isCorrect ? 1 : 0)) / totalQ) * 100);
          sessionStorage.setItem(
            "lumora_last_result",
            JSON.stringify({
              skillName: activity.skill.name,
              score,
              accuracyPct: accuracy,
              attemptsAvg: Math.round(lastResult.mastery.signals.attemptsAvg),
              responseTimeSec: Math.round(lastResult.mastery.signals.responseTimeMs / 1000),
              masteryBefore: Math.round(lastResult.mastery.previousScore * 100),
              masteryAfter: Math.round(lastResult.mastery.newScore * 100),
              adaptiveSignal: lastResult.recommendation?.reason ?? "Keep going!",
              nextActivityTitle: "—",
              nextActivityId: lastResult.recommendation?.activityId ?? null,
            })
          );
        }
        router.push("/student/result");
      } else {
        setIndex((i) => i + 1);
        questionStartTime.current = Date.now();
      }
    }, 1200);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Badge tone="purple">{activity.skill.name}</Badge>
          <h1 className="mt-2 text-2xl font-extrabold text-midnight">{activity.title}</h1>
        </div>
        <p className="text-sm font-semibold text-midnight/50">
          Question {index + 1} of {activity.questions.length}
        </p>
      </div>

      <QuestionCard
        key={question.id}
        prompt={question.prompt}
        options={question.metadata?.options ?? [question.correctAnswer]}
        correctAnswer={question.correctAnswer}
        onAnswered={handleAnswered}
      />

      {activity.storyContext && (
        <Card className="mt-4 bg-lavender/50 text-sm text-midnight/60">
          Part of the "{activity.storyContext}" learning theme — answers here help Lumora pick your
          next activity.
        </Card>
      )}

      {/* Subtle mastery feedback after each answer (non-blocking) */}
      {lastResult?.mastery && (
        <p className="mt-3 text-center text-xs text-midnight/40">
          Mastery updated:{" "}
          {Math.round(lastResult.mastery.previousScore * 100)}% →{" "}
          {Math.round(lastResult.mastery.newScore * 100)}%
        </p>
      )}
    </div>
  );
}
