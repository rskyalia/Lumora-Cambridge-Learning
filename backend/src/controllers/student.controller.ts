import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";

// ---- Validation schemas ----

const OnboardingSchema = z.object({
  studentId: z.string().cuid(),
  stage: z.number().int().min(1).max(6),
  interests: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
});

// ---- Controllers ----

/**
 * POST /api/students/onboarding
 * Siswa memilih Stage 1–3, minat, dan tujuan belajar (Bagian 7).
 */
export async function completeOnboarding(req: AuthedRequest, res: Response) {
  const parsed = OnboardingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { studentId, stage, interests, goals } = parsed.data;

  const student = await prisma.student.update({
    where: { id: studentId },
    data: { stage, interests, goals },
  });

  res.json(student);
}

/**
 * GET /api/students/:studentId/world
 * Student Progress & Learning World (Frame 08, Bagian 16).
 */
export async function getLearningWorld(req: Request, res: Response) {
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
      achievements: { orderBy: { earnedAt: "desc" }, take: 10 },
      recommendations: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          activity: true,
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
  });

  if (!student) return res.status(404).json({ error: "Student tidak ditemukan" });

  // Kelompokkan mastery per subject untuk metafora "world" (Bagian 16).
  const worldBySubject: Record<string, number[]> = {};
  for (const m of student.mastery) {
    const subject = m.skill.learningObjective.strand.subject.name;
    worldBySubject[subject] = worldBySubject[subject] ?? [];
    worldBySubject[subject].push(m.masteryScore);
  }
  const world = Object.entries(worldBySubject).map(([subject, scores]) => ({
    subject,
    masteryPct: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100),
  }));

  const latest = student.recommendations[0];
  const todaysMission = latest
    ? {
        activityId: latest.activityId,
        title: latest.activity.title,
        subject: latest.skill.learningObjective.strand.subject.name,
        mode: latest.mode,
        estimatedMins: latest.activity.estimatedMins,
      }
    : null;

  res.json({
    name: student.name,
    stage: student.stage,
    xp: student.xp,
    streak: student.streak,
    world,
    achievements: student.achievements,
    todaysMission,
  });
}

/**
 * GET /api/students/:studentId/progress
 * Mengembalikan mastery history per skill untuk ditampilkan sebagai sparkline
 * di halaman Progress siswa (Bagian 8, Mastery.history JSON).
 */
export async function getStudentProgress(req: Request, res: Response) {
  const { studentId } = req.params;

  const masteries = await prisma.mastery.findMany({
    where: { studentId },
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
  });

  if (!masteries.length) {
    // Student ada tapi belum ada mastery — kembalikan array kosong
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) return res.status(404).json({ error: "Student tidak ditemukan" });
    return res.json({ skills: [] });
  }

  const skills = masteries.map((m) => {
    const history = Array.isArray(m.history)
      ? (m.history as { score: number; timestamp: string }[])
      : [];

    return {
      skillId: m.skillId,
      skillName: m.skill.name,
      subject: m.skill.learningObjective.strand.subject.name,
      strandName: m.skill.learningObjective.strand.name,
      currentMasteryPct: Math.round(m.masteryScore * 100),
      updatedAt: m.updatedAt,
      // history dipakai untuk sparkline — array [{score: 0..1, timestamp}]
      history: history.map((h) => ({
        score: Math.round(h.score * 100),
        timestamp: h.timestamp,
      })),
    };
  });

  res.json({ skills });
}
