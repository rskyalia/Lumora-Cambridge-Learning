/**
 * API client — semua request ke backend Lumora.
 * Token diambil dari localStorage (disimpan oleh AuthContext).
 * USE_MOCK dihapus — semua data sekarang dari backend live.
 */

import { getToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

// ---- Core fetch helpers ----

async function apiGet<T>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `API error ${res.status}`);
  }
  return res.json();
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `API error ${res.status}`);
  }
  return res.json();
}

async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `API error ${res.status}`);
  }
  return res.json();
}

// ---- Types ----

export interface LearningWorldData {
  name: string;
  stage: number;
  xp: number;
  streak: number;
  world: { subject: string; masteryPct: number }[];
  achievements: { id: string; type: string; label: string; value: number }[];
  todaysMission: {
    activityId: string;
    title: string;
    subject: string;
    mode: string;
    estimatedMins: number;
  } | null;
}

export interface AdaptiveResultData {
  feedback: { isCorrect: boolean; encouragement: string };
  mastery: {
    skillId: string;
    previousScore: number;
    newScore: number;
    signals: {
      accuracy: number;
      attemptsAvg: number;
      responseTimeMs: number;
      difficulty: number;
      recentAccuracyTrend: number;
    };
  };
  recommendation: {
    skillId: string;
    activityId: string;
    mode: string;
    reason: string;
  } | null;
}

export interface ActivityData {
  id: string;
  title: string;
  storyContext: string | null;
  subject?: string;
  difficulty: number;
  estimatedMins: number;
  skill: { id: string; name: string };
  questions: {
    id: string;
    prompt: string;
    difficulty: number;
    correctAnswer: string;
    metadata: { options?: string[] } | null;
  }[];
}

export interface TeacherDashboardData {
  className: string;
  activeLearners: number;
  avgMasteryPct: number;
  needSupport: number;
  completionPct: number;
  classMastery: { subject: string; masteryPct: number }[];
  aiInsights: { summary: string; suggestedAction: string; skill: string; subject: string }[];
  learnerOverview: {
    studentId: string;
    name: string;
    focusSkill: string;
    masteryPct: number;
    status: string;
  }[];
}

export interface ParentDashboardData {
  name: string;
  stage: number;
  streak: number;
  learningTime: string;
  completedActivities: number;
  overallProgress: number;
  subjectProgress: { subject: string; label: string; masteryPct: number }[];
  weeklyData: number[];
  aiInsight: string | null;
}

export interface SessionData {
  id: string;
  studentId: string;
  activityId: string;
  startedAt: string;
  endedAt: string | null;
}

// ---- API functions ----

export async function getLearningWorld(studentId: string): Promise<LearningWorldData> {
  return apiGet(`/students/${studentId}/world`);
}

export async function getTeacherDashboard(classId: string): Promise<TeacherDashboardData> {
  return apiGet(`/teacher/class/${classId}`);
}

export async function getParentDashboard(studentId: string): Promise<ParentDashboardData> {
  return apiGet(`/parent/child/${studentId}`);
}

export async function getActivity(activityId: string): Promise<ActivityData> {
  return apiGet(`/activities/${activityId}`);
}

export async function completeOnboarding(
  studentId: string,
  data: { stage: number; interests: string[]; goals: string[] }
): Promise<void> {
  await apiPost("/students/onboarding", { studentId, ...data });
}

export async function createSession(studentId: string, activityId: string): Promise<SessionData> {
  return apiPost("/sessions", { studentId, activityId });
}

export async function endSession(sessionId: string): Promise<SessionData> {
  return apiPatch(`/sessions/${sessionId}/end`);
}

export async function submitAttempt(payload: {
  studentId: string;
  sessionId: string;
  questionId: string;
  answer: string;
  responseTimeMs: number;
  attemptNumber: number;
}): Promise<AdaptiveResultData> {
  return apiPost("/activities/attempt", payload);
}

export async function getNextRecommendation(
  studentId: string,
  skillId: string
): Promise<{ skillId: string; activityId: string; mode: string; reason: string }> {
  return apiGet(`/recommendations/${studentId}/${skillId}`);
}

export async function getMyClasses(): Promise<{ classes: { id: string; name: string }[] }> {
  return apiGet("/teacher/me/classes");
}

export async function getMyChildren(): Promise<{
  children: { id: string; name: string; stage: number }[];
}> {
  return apiGet("/parent/me/children");
}

// ---- Types (new) ----

export interface ActivityListItem {
  id: string;
  title: string;
  type: string;
  storyContext: string | null;
  difficulty: number;
  estimatedMins: number;
  skill: {
    id: string;
    name: string;
    learningObjective: {
      strand: { subject: { name: string }; name: string };
      description: string;
    };
  };
}

export interface StudentProgressData {
  skills: {
    skillId: string;
    skillName: string;
    subject: string;
    strandName: string;
    currentMasteryPct: number;
    updatedAt: string;
    history: { score: number; timestamp: string }[];
  }[];
}

export interface TeacherStudentDetailData {
  studentId: string;
  name: string;
  stage: number;
  xp: number;
  streak: number;
  overallMasteryPct: number;
  masteryBySkill: {
    skillId: string;
    skillName: string;
    subject: string;
    strand: string;
    currentMasteryPct: number;
    status: string;
    history: { score: number; timestamp: string }[];
  }[];
  recentSessions: {
    sessionId: string;
    activityTitle: string;
    subject: string;
    startedAt: string;
    durationMins: number | null;
    accuracy: number | null;
    totalAttempts: number;
    completed: boolean;
  }[];
  achievements: { id: string; type: string; label: string; value: number; earnedAt: string }[];
}

// ---- New API functions ----

export async function listActivities(params: {
  stage?: number;
  type?: string;
}): Promise<ActivityListItem[]> {
  const qs = new URLSearchParams();
  if (params.stage !== undefined) qs.set("stage", String(params.stage));
  if (params.type) qs.set("type", params.type);
  return apiGet(`/activities?${qs.toString()}`);
}

export async function getStudentProgress(studentId: string): Promise<StudentProgressData> {
  return apiGet(`/students/${studentId}/progress`);
}

export async function getTeacherStudentDetail(
  studentId: string
): Promise<TeacherStudentDetailData> {
  return apiGet(`/teacher/student/${studentId}`);
}
