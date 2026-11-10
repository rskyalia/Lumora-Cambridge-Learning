import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";
import { processSessionEnd } from "../services/gamificationService";

const CreateSessionSchema = z.object({
  studentId: z.string().cuid(),
  activityId: z.string().cuid(),
});

const EndSessionSchema = z.object({
  sessionId: z.string().cuid(),
});

/**
 * POST /api/sessions
 * Membuat LearningSession baru saat siswa memulai sebuah activity (Bagian 7).
 */
export async function createSession(req: AuthedRequest, res: Response) {
  const parsed = CreateSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { studentId, activityId } = parsed.data;

  const activity = await prisma.activity.findUnique({ where: { id: activityId } });
  if (!activity) return res.status(404).json({ error: "Activity tidak ditemukan" });

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return res.status(404).json({ error: "Student tidak ditemukan" });

  const session = await prisma.learningSession.create({
    data: { studentId, activityId },
  });

  res.status(201).json(session);
}

/**
 * PATCH /api/sessions/:sessionId/end
 * Menutup sesi dengan mengisi endedAt — dipakai untuk menghitung learning time.
 */
export async function endSession(req: AuthedRequest, res: Response) {
  const { sessionId } = req.params;

  const session = await prisma.learningSession.findUnique({ where: { id: sessionId } });
  if (!session) return res.status(404).json({ error: "Session tidak ditemukan" });
  if (session.endedAt) return res.status(409).json({ error: "Session sudah ditutup" });

  const updated = await prisma.learningSession.update({
    where: { id: sessionId },
    data: { endedAt: new Date() },
  });

  // Streak update + session XP + achievement check (non-blocking)
  processSessionEnd(session.studentId).catch(() => {});

  res.json(updated);
}
