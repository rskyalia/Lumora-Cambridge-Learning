export type RecommendationMode = "REINFORCE" | "PRACTICE" | "ADVANCE";

export interface LearningSignals {
  accuracy: number; // 0..1, rasio jawaban benar
  attemptsAvg: number; // rata-rata percobaan per soal
  responseTimeMs: number; // rata-rata waktu respons
  difficulty: number; // 1..5, level kesulitan aktivitas terakhir
  recentAccuracyTrend: number; // -1..1, tren performa terbaru (naik/turun)
}

export interface MasteryEstimate {
  skillId: string;
  previousScore: number; // 0..1
  newScore: number; // 0..1
  signals: LearningSignals;
}

export interface RecommendationResult {
  skillId: string;
  activityId: string;
  mode: RecommendationMode;
  reason: string;
}
