import { Request, Response } from "express";
import { recommendNextActivity } from "../services/recommendationEngine";

// Endpoint eksplisit untuk memicu recommendation engine (Bagian 19),
// dipakai mis. saat siswa membuka "Today's Mission" tanpa baru saja
// menyelesaikan attempt.
export async function getNextRecommendation(req: Request, res: Response) {
  const { studentId, skillId } = req.params;

  const result = await recommendNextActivity(studentId, skillId);
  if (!result) {
    return res.status(404).json({ error: "No activity available for this skill yet" });
  }
  res.json(result);
}
