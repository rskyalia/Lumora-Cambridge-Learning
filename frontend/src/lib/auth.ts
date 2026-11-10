/**
 * Auth helpers — token opaque storage + type definitions.
 * JWT disimpan di localStorage (client-only).
 * Privacy-aware (Bagian 23): tidak menyimpan data anak melebihi yang diperlukan.
 */

export interface AuthUser {
  id: string;
  name: string;
  role: "STUDENT" | "TEACHER" | "PARENT" | "ADMIN";
}

export interface AuthProfile {
  id: string;
  [key: string]: unknown;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  profile: AuthProfile | null;
}

const TOKEN_KEY = "lumora_token";
const USER_KEY = "lumora_user";
const PROFILE_KEY = "lumora_profile";

export function saveSession(session: AuthSession) {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  localStorage.setItem(PROFILE_KEY, JSON.stringify(session.profile));
}

export function loadSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  if (!token || !userRaw) return null;
  try {
    const user = JSON.parse(userRaw) as AuthUser;
    const profile = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "null") as AuthProfile | null;
    return { token, user, profile };
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PROFILE_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
