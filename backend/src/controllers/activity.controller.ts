import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { updateMastery } from "../services/masteryEngine";
import { recommendNextActivity } from "../services/recommendationEngine";
import { awardAttemptXp } from "../services/gamificationService";

// ---- Validation schemas ----

const AttemptSchema = z.object({
  studentId: z.string().cuid(),
  sessionId: z.string().cuid(),
  questionId: z.string().cuid(),
  answer: z.string().min(1),
  responseTimeMs: z.number().int().min(0),
  attemptNumber: z.number().int().min(1).default(1),
});

// ---- Controllers ----

/**
 * GET /api/activities/:activityId
 * Ambil activity beserta pertanyaan dan skill-nya.
 */
export async function getActivity(req: Request, res: Response) {
  const { activityId } = req.params;

  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      questions: true,
      skill: {
        include: {
          learningObjective: {
            include: { strand: { include: { subject: true } } },
          },
        },
      },
    },
  });
  if (!activity) return res.status(404).json({ error: "Activity tidak ditemukan" });

  res.json(activity);
}

/**
 * GET /api/activities?stage=3&type=LESSON
 * Daftar activities yang bisa difilter berdasarkan stage dan/atau type.
 * Dipakai oleh halaman Learn untuk menampilkan lesson berdasarkan stage siswa.
 */
export async function listActivities(req: Request, res: Response) {
  const StageSchema = z.coerce.number().int().min(1).max(6).optional();
  const TypeSchema = z.enum(["LESSON", "PRACTICE", "REINFORCEMENT", "ADVANCE"]).optional();

  const stage = StageSchema.safeParse(req.query.stage);
  const type = TypeSchema.safeParse(req.query.type);

  const activities = await prisma.activity.findMany({
    where: {
      type: type.success && type.data ? type.data : undefined,
      skill: {
        learningObjective: {
          stage: stage.success && stage.data ? stage.data : undefined,
        },
      },
    },
    include: {
      skill: {
        include: {
          learningObjective: {
            include: { strand: { include: { subject: true } } },
          },
        },
      },
    },
    orderBy: [{ difficulty: "asc" }, { title: "asc" }],
  });

  res.json(activities);
}

/**
 * POST /api/activities/attempt
 * Practice -> Feedback -> Evidence (Bagian 7).
 * Menyimpan attempt, memicu mastery update, dan menghasilkan rekomendasi
 * berikutnya (Adaptive Result, Bagian 15).
 */
export async function submitAttempt(req: Request, res: Response) {
  const parsed = AttemptSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { studentId, sessionId, questionId, answer, responseTimeMs, attemptNumber } = parsed.data;

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { activity: true },
  });
  if (!question) return res.status(404).json({ error: "Question tidak ditemukan" });

  // Validasi session ada dan milik student yang benar
  const session = await prisma.learningSession.findUnique({ where: { id: sessionId } });
  if (!session) return res.status(404).json({ error: "Session tidak ditemukan" });
  if (session.studentId !== studentId) {
    return res.status(403).json({ error: "Session bukan milik student ini" });
  }

  const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

  await prisma.attempt.create({
    data: {
      sessionId,
      questionId,
      studentId,
      isCorrect,
      responseTimeMs,
      attemptNumber,
      difficulty: question.difficulty,
    },
  });

  const masteryEstimate = await updateMastery(studentId, question.activity.skillId);
  const recommendation = await recommendNextActivity(studentId, question.activity.skillId);

  // XP per jawaban benar + cek achievement (non-blocking terhadap response)
  awardAttemptXp(studentId, isCorrect).catch(() => {});

  res.json({
    feedback: {
      isCorrect,
      encouragement: isCorrect
        ? "Great job! You've got this."
        : "Not quite — let's look at it a different way.",
    },
    mastery: masteryEstimate,
    recommendation,
  });
}
