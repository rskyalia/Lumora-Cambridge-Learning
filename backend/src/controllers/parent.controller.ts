import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { buildParentInsight } from "../services/insightsService";
import { AuthedRequest } from "../middleware/auth";

/**
 * GET /api/parent/me/children
 * Mengembalikan daftar anak yang terhubung ke akun parent yang sedang login.
 */
export async function getMyChildren(req: AuthedRequest, res: Response) {
  const userId = req.user!.sub;

  const parent = await prisma.parentProfile.findUnique({
    where: { userId },
    include: { children: { select: { id: true, name: true, stage: true } } },
  });
  if (!parent) return res.status(404).json({ error: "Parent profile tidak ditemukan" });

  res.json({ children: parent.children });
}

/**
 * GET /api/parent/child/:studentId
 * Parent Dashboard (Bagian 14): profil anak, learning time, streak,
 * completed activities, progress per subject, AI insight.
 */
export async function getChildDashboard(req: Request, res: Response) {
  const { studentId } = req.params;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      mastery: {
        include: {
          skill: {
            include: {
              learningObjective: {
                include: { strand: { include: { subject: true } } },
              },
            },
          },
        },
      },
      sessions: true,
      parentInsights: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!student) return res.status(404).json({ error: "Student tidak ditemukan" });

  // Hitung completed activities dan learning time (Bagian 14)
  const completedSessions = student.sessions.filter((s) => s.endedAt);
  const completedActivities = completedSessions.length;

  // Learning time: total durasi sesi yang sudah selesai (dalam menit)
  const totalMs = completedSessions.reduce((sum, s) => {
    return sum + (s.endedAt!.getTime() - s.startedAt.getTime());
  }, 0);
  const totalMins = Math.round(totalMs / 60_000);
  const learningTime =
    totalMins >= 60
      ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`
      : `${totalMins}m`;

  // Progress per subject
  const masteryBySubject: Record<string, { scores: number[]; label: string }> = {};
  for (const m of student.mastery) {
    const subject = m.skill.learningObjective.strand.subject.name;
    const strandLabel = m.skill.learningObjective.strand.name;
    if (!masteryBySubject[subject]) {
      masteryBySubject[subject] = { scores: [], label: strandLabel };
    }
    masteryBySubject[subject].scores.push(m.masteryScore);
  }
  const subjectProgress = Object.entries(masteryBySubject).map(([subject, { scores, label }]) => ({
    subject,
    label,
    masteryPct: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100),
  }));

  const overallProgress = subjectProgress.length
    ? Math.round(subjectProgress.reduce((sum, s) => sum + s.masteryPct, 0) / subjectProgress.length)
    : 0;

  // Weekly activity chart: berapa session per hari dalam 7 hari terakhir
  const now = new Date();
  const weeklyData: number[] = Array(7).fill(0);
  for (const s of student.sessions) {
    const dayDiff = Math.floor((now.getTime() - s.startedAt.getTime()) / 86_400_000);
    if (dayDiff >= 0 && dayDiff < 7) {
      weeklyData[6 - dayDiff]++;
    }
  }

  // AI insight: refresh jika belum ada atau sudah > 1 hari
  const existingInsight = student.parentInsights[0];
  const isStale =
    !existingInsight ||
    new Date().getTime() - existingInsight.createdAt.getTime() > 86_400_000;

  let aiInsightText = existingInsight?.summary ?? null;
  if (isStale && student.mastery.length > 0) {
    const fresh = await buildParentInsight(studentId);
    if (fresh) aiInsightText = fresh.summary;
  }

  res.json({
    name: student.name,
    stage: student.stage,
    streak: student.streak,
    learningTime,
    completedActivities,
    overallProgress,
    subjectProgress,
    weeklyData,
    aiInsight: aiInsightText,
  });
}
