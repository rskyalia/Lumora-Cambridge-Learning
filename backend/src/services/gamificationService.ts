import { prisma } from "../lib/prisma";

/**
 * Gamification engine (Bagian 20).
 *
 * Dipanggil setelah setiap attempt (untuk XP) dan setelah session ditutup
 * (untuk streak dan achievement).
 *
 * Prinsip: tidak ada ranking anak — focus pada perkembangan pribadi.
 * Threshold bersifat konfigurasi produk, bukan standar universal.
 */

// ---- XP constants ----
const XP_CORRECT = 10;   // per jawaban benar
const XP_SESSION = 20;   // bonus per sesi selesai

// ---- Achievement thresholds ----
const ACHIEVEMENT_DEFS = [
  { label: "Quick Thinker",  type: "BADGE" as const, check: "quickThinker" },
  { label: "5 Day Streak",   type: "STREAK" as const, threshold: 5 },
  { label: "6 Day Streak",   type: "STREAK" as const, threshold: 6 },
  { label: "10 Day Streak",  type: "STREAK" as const, threshold: 10 },
  { label: "5 Activities",   type: "BADGE" as const,  threshold: 5 },
  { label: "10 Activities",  type: "BADGE" as const,  threshold: 10 },
  { label: "25 Activities",  type: "BADGE" as const,  threshold: 25 },
  { label: "100 XP",         type: "XP" as const,     threshold: 100 },
  { label: "500 XP",         type: "XP" as const,     threshold: 500 },
];

// ---- Helpers ----

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayDiff(a: Date, b: Date): number {
  const msPerDay = 86_400_000;
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / msPerDay);
}

// ---- Main exports ----

/**
 * Dipanggil setelah setiap attempt berhasil.
 * Menambah XP jika jawaban benar; memeriksa achievement XP.
 */
export async function awardAttemptXp(studentId: string, isCorrect: boolean): Promise<void> {
  if (!isCorrect) return;

  await prisma.student.update({
    where: { id: studentId },
    data: { xp: { increment: XP_CORRECT } },
  });

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (student) await checkAndUnlockAchievements(studentId, student.xp, student.streak, 0);
}

/**
 * Dipanggil saat session ditutup (PATCH /sessions/:id/end).
 * Hitung streak (tambah / pertahankan / reset), award session XP,
 * update completed-activities count, cek achievements.
 */
export async function processSessionEnd(studentId: string): Promise<void> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      sessions: {
        where: { endedAt: { not: null } },
        orderBy: { endedAt: "desc" },
        take: 2,
      },
    },
  });
  if (!student) return;

  const completedSessions = student.sessions;
  const totalCompleted = await prisma.learningSession.count({
    where: { studentId, endedAt: { not: null } },
  });

  // ---- Streak calculation ----
  let newStreak = student.streak;
  const now = new Date();

  if (completedSessions.length >= 2) {
    // Ada sesi sebelumnya — cek gap hari
    const prevSession = completedSessions[1]; // index 0 adalah sesi yang baru ditutup
    const gap = dayDiff(prevSession.endedAt!, now);

    if (gap === 0) {
      // Sudah belajar hari ini sebelumnya — tidak tambah streak
      newStreak = student.streak;
    } else if (gap === 1) {
      // Belajar hari berturut-turut
      newStreak = student.streak + 1;
    } else {
      // Lewat lebih dari 1 hari — reset
      newStreak = 1;
    }
  } else {
    // Sesi pertama yang selesai
    newStreak = 1;
  }

  // ---- Update student ----
  const newXp = student.xp + XP_SESSION;
  await prisma.student.update({
    where: { id: studentId },
    data: { streak: newStreak, xp: newXp },
  });

  await checkAndUnlockAchievements(studentId, newXp, newStreak, totalCompleted);
}

/**
 * Periksa apakah ada achievement baru yang harus di-unlock.
 * Tidak akan membuat duplikat — cek apakah label sudah ada dulu.
 */
async function checkAndUnlockAchievements(
  studentId: string,
  xp: number,
  streak: number,
  completedActivities: number
): Promise<void> {
  const existing = await prisma.achievement.findMany({
    where: { studentId },
    select: { label: true },
  });
  const existingLabels = new Set(existing.map((a) => a.label));

  const toCreate: { studentId: string; type: "BADGE" | "STREAK" | "XP"; label: string; value: number }[] = [];

  for (const def of ACHIEVEMENT_DEFS) {
    if (existingLabels.has(def.label)) continue;

    if (def.check === "quickThinker") {
      // Quick Thinker: unlock saat XP pertama kali earned (ada attempt benar)
      if (xp >= XP_CORRECT) {
        toCreate.push({ studentId, type: def.type, label: def.label, value: 1 });
      }
      continue;
    }

    if (!def.threshold) continue;

    const value =
      def.type === "STREAK"
        ? streak
        : def.type === "XP"
        ? xp
        : completedActivities; // BADGE untuk activities

    if (value >= def.threshold) {
      toCreate.push({ studentId, type: def.type, label: def.label, value: def.threshold });
    }
  }

  if (toCreate.length > 0) {
    await prisma.achievement.createMany({ data: toCreate });
  }
}
