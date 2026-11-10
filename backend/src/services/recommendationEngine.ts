import { prisma } from "../lib/prisma";
import { updateMastery } from "./masteryEngine";
import type { RecommendationMode, RecommendationResult } from "../types";

/**
 * Recommendation engine — Bagian 19 dokumen konsep:
 * 1. Identifikasi skill yang sedang dipelajari         -> parameter `skillId`
 * 2. Ambil riwayat performa terbaru                    -> masteryEngine.updateMastery
 * 3. Hitung/prediksi mastery                            -> masteryEngine.updateMastery
 * 4. Periksa tingkat kesulitan aktivitas yang tersedia  -> pickActivity()
 * 5. Pilih mode: reinforce / practice / advance         -> pickMode()
 * 6. Berikan aktivitas berikutnya sesuai learning objective
 * 7. Catat hasil sebagai evidence baru                  -> dilakukan saat attempt baru dibuat
 * 8. Update mastery, ulangi                             -> loop terjadi di controller pemanggil
 */

// Threshold adalah konfigurasi produk (Bagian 8.2), bukan konstanta absolut.
const REINFORCE_THRESHOLD = 0.55;
const ADVANCE_THRESHOLD = 0.8;

function pickMode(masteryScore: number): { mode: RecommendationMode; reason: string } {
  if (masteryScore < REINFORCE_THRESHOLD) {
    return {
      mode: "REINFORCE",
      reason: "Mastery masih di bawah threshold — perlu penguatan sebelum lanjut.",
    };
  }
  if (masteryScore >= ADVANCE_THRESHOLD) {
    return {
      mode: "ADVANCE",
      reason: "Ready for a little more — performa konsisten kuat pada skill ini.",
    };
  }
  return {
    mode: "PRACTICE",
    reason: "Mastery berkembang baik — lanjutkan latihan pada level saat ini.",
  };
}

async function pickActivity(skillId: string, mode: RecommendationMode) {
  const targetType = mode === "REINFORCE" ? "REINFORCEMENT" : mode === "ADVANCE" ? "ADVANCE" : "PRACTICE";

  const activity =
    (await prisma.activity.findFirst({ where: { skillId, type: targetType } })) ??
    // fallback: kalau tidak ada aktivitas dengan tipe persis, ambil aktivitas skill manapun
    // agar siswa tetap punya aktivitas berikutnya (evidence-led, bukan buntu).
    (await prisma.activity.findFirst({ where: { skillId } }));

  return activity;
}

export async function recommendNextActivity(
  studentId: string,
  skillId: string
): Promise<RecommendationResult | null> {
  const { newScore } = await updateMastery(studentId, skillId);
  const { mode, reason } = pickMode(newScore);
  const activity = await pickActivity(skillId, mode);

  if (!activity) return null;

  await prisma.recommendation.create({
    data: { studentId, skillId, activityId: activity.id, mode, reason },
  });

  return { skillId, activityId: activity.id, mode, reason };
}
