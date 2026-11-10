import { prisma } from "../lib/prisma";
import type { LearningSignals, MasteryEstimate } from "../types";

/**
 * Adaptive loop — bagian "Observe -> Estimate" (Bagian 8, dokumen konsep).
 *
 * MVP ini memakai rule-based weighted update, bukan model ML penuh, sesuai
 * catatan Bagian 8.2: "Threshold harus diperlakukan sebagai konfigurasi
 * produk dan divalidasi menggunakan data nyata, bukan dianggap sebagai
 * ukuran universal kemampuan anak."
 *
 * Learning rate & bobot signal didesain agar mudah diganti dengan model
 * yang lebih canggih (mis. Bayesian Knowledge Tracing / IRT) tanpa mengubah
 * kontrak fungsi ini.
 */

const LEARNING_RATE = 0.35;
const RECENCY_WEIGHT = 0.2;
const RESPONSE_TIME_BASELINE_MS = 20_000; // 20 detik dianggap wajar untuk practice

export function computeLearningSignals(
  attempts: { isCorrect: boolean; attemptNumber: number; responseTimeMs: number; difficulty: number }[]
): LearningSignals {
  if (attempts.length === 0) {
    return {
      accuracy: 0,
      attemptsAvg: 1,
      responseTimeMs: RESPONSE_TIME_BASELINE_MS,
      difficulty: 1,
      recentAccuracyTrend: 0,
    };
  }

  const accuracy = attempts.filter((a) => a.isCorrect).length / attempts.length;
  const attemptsAvg = attempts.reduce((sum, a) => sum + a.attemptNumber, 0) / attempts.length;
  const responseTimeMs = attempts.reduce((sum, a) => sum + a.responseTimeMs, 0) / attempts.length;
  const difficulty = attempts[attempts.length - 1].difficulty;

  // Recent performance diberi perhatian lebih (Bagian 8.1): bandingkan paruh
  // kedua vs paruh pertama dari attempt yang tersedia.
  const half = Math.max(1, Math.floor(attempts.length / 2));
  const firstHalfAcc = attempts.slice(0, half).filter((a) => a.isCorrect).length / half;
  const secondHalfAcc =
    attempts.slice(half).filter((a) => a.isCorrect).length / Math.max(1, attempts.length - half);
  const recentAccuracyTrend = secondHalfAcc - firstHalfAcc;

  return { accuracy, attemptsAvg, responseTimeMs, difficulty, recentAccuracyTrend };
}

function performanceScore(signals: LearningSignals): number {
  const attemptsPenalty = Math.min(1, (signals.attemptsAvg - 1) * 0.15); // makin banyak percobaan, makin turun
  const speedBonus =
    signals.responseTimeMs <= RESPONSE_TIME_BASELINE_MS
      ? 0.05
      : -Math.min(0.1, (signals.responseTimeMs - RESPONSE_TIME_BASELINE_MS) / 100_000);

  const base = signals.accuracy - attemptsPenalty + speedBonus;
  const withRecency = base + RECENCY_WEIGHT * signals.recentAccuracyTrend;

  return Math.max(0, Math.min(1, withRecency));
}

/**
 * Update mastery satu skill berdasarkan attempt-attempt terbaru pada skill
 * tersebut. Menulis riwayat skor ke kolom `history` (dipakai untuk grafik
 * di teacher/parent dashboard).
 */
export async function updateMastery(studentId: string, skillId: string): Promise<MasteryEstimate> {
  const recentAttempts = await prisma.attempt.findMany({
    where: { studentId, question: { activity: { skillId } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const signals = computeLearningSignals(recentAttempts.reverse());
  const score = performanceScore(signals);

  const existing = await prisma.mastery.findUnique({
    where: { studentId_skillId: { studentId, skillId } },
  });

  const previousScore = existing?.masteryScore ?? 0.5; // prior netral untuk skill baru
  const newScore = previousScore + LEARNING_RATE * (score - previousScore);

  const history = Array.isArray(existing?.history) ? (existing!.history as any[]) : [];
  history.push({ score: newScore, timestamp: new Date().toISOString() });

  await prisma.mastery.upsert({
    where: { studentId_skillId: { studentId, skillId } },
    create: { studentId, skillId, masteryScore: newScore, history },
    update: { masteryScore: newScore, history },
  });

  return { skillId, previousScore, newScore, signals };
}
