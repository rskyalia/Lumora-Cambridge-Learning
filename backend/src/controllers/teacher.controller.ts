import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { buildClassSummary } from "../services/insightsService";
import { AuthedRequest } from "../middleware/auth";

/**
 * GET /api/teacher/me/classes
 * Mengembalikan daftar kelas milik guru yang sedang login.
 */
export async function getMyClasses(req: AuthedRequest, res: Response) {
  const userId = req.user!.sub;

  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    include: { classes: true },
  });
  if (!teacher) return res.status(404).json({ error: "Teacher tidak ditemukan" });

  res.json({ classes: teacher.classes });
}

/**
 * GET /api/teacher/class/:classId
 * Teacher Dashboard (Bagian 13): KPI kelas, class mastery per subject,
 * AI insights, learner overview, completionPct.
 */
export async function getClassDashboard(req: Request, res: Response) {
  const { classId } = req.params;

  const summary = await buildClassSummary(classId);
  if (!summary) return res.status(404).json({ error: "Class tidak ditemukan" });

  const classRoom = await prisma.classRoom.findUnique({
    where: { id: classId },
    include: {
      students: {
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
        },
      },
      teacherInsights: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { skill: { include: { learningObjective: { include: { strand: { include: { subject: true } } } } } } },
      },
    },
  });

  // Mastery per subject untuk class overview
  const masteryBySubject: Record<string, number[]> = {};
  for (const student of classRoom?.students ?? []) {
    for (const m of student.mastery) {
      const subject = m.skill.learningObjective.strand.subject.name;
      masteryBySubject[subject] = masteryBySubject[subject] ?? [];
      masteryBySubject[subject].push(m.masteryScore);
    }
  }
  const classMastery = Object.entries(masteryBySubject).map(([subject, scores]) => ({
    subject,
    masteryPct: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100),
  }));

  // Learner overview: setiap siswa, skill terkuat dan status
  const learnerOverview = (classRoom?.students ?? []).map((s) => {
    const top = [...s.mastery].sort((a, b) => b.masteryScore - a.masteryScore)[0];
    return {
      studentId: s.id,
      name: s.name,
      focusSkill: top?.skill.name ?? "—",
      masteryPct: top ? Math.round(top.masteryScore * 100) : 0,
      status: top && top.masteryScore < 0.55 ? "Practice" : "On track",
    };
  });

  // Format teacher insights untuk UI
  const aiInsights = (classRoom?.teacherInsights ?? []).map((ti) => ({
    summary: ti.summary,
    suggestedAction: ti.suggestedAction,
    skill: ti.skill.name,
    subject: ti.skill.learningObjective.strand.subject.name,
  }));

  res.json({
    ...summary,
    classMastery,
    aiInsights,
    learnerOverview,
  });
}

/**
 * GET /api/teacher/student/:studentId
 * Detail individual siswa untuk tampilan guru — mastery per skill,
 * recent attempts, session history, achievements (Bagian 13).
 */
export async function getStudentDetail(req: Request, res: Response) {
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
        orderBy: { updatedAt: "desc" },
      },
      achievements: { orderBy: { earnedAt: "desc" } },
      sessions: {
        orderBy: { startedAt: "desc" },
        take: 10,
        include: {
          activity: {
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
          attempts: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  });

  if (!student) return res.status(404).json({ error: "Student tidak ditemukan" });

  // Mastery per skill dengan history untuk sparkline
  const masteryBySkill = student.mastery.map((m) => {
    const history = Array.isArray(m.history)
      ? (m.history as { score: number; timestamp: string }[])
      : [];
    return {
      skillId: m.skillId,
      skillName: m.skill.name,
      subject: m.skill.learningObjective.strand.subject.name,
      strand: m.skill.learningObjective.strand.name,
      currentMasteryPct: Math.round(m.masteryScore * 100),
      status: m.masteryScore < 0.55 ? "Practice" : m.masteryScore >= 0.80 ? "Advance" : "On track",
      history: history.map((h) => ({ score: Math.round(h.score * 100), timestamp: h.timestamp })),
    };
  });

  // Recent sessions
  const recentSessions = student.sessions.map((s) => {
    const totalAttempts = s.attempts.length;
    const correctAttempts = s.attempts.filter((a) => a.isCorrect).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : null;
    const durationMs =
      s.endedAt ? s.endedAt.getTime() - s.startedAt.getTime() : null;

    return {
      sessionId: s.id,
      activityTitle: s.activity.title,
      subject: s.activity.skill.learningObjective.strand.subject.name,
      startedAt: s.startedAt,
      durationMins: durationMs ? Math.round(durationMs / 60_000) : null,
      accuracy,
      totalAttempts,
      completed: !!s.endedAt,
    };
  });

  // Overall progress
  const allScores = student.mastery.map((m) => m.masteryScore);
  const overallMasteryPct = allScores.length
    ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100)
    : 0;

  res.json({
    studentId: student.id,
    name: student.name,
    stage: student.stage,
    xp: student.xp,
    streak: student.streak,
    overallMasteryPct,
    masteryBySkill,
    recentSessions,
    achievements: student.achievements,
  });
}
