"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { THEME_ROOT_ID, THEME_STORAGE_KEY } from "./theme-config";

// ─────────────────────────────────────────────────────────────────────────────
// Landing-only theme system.
//
// The `dark` class is applied to #landing-root (not <html>) so switching the
// landing page theme never leaks into /login, /student, /teacher, etc.
// The inline script in app/page.tsx applies the saved/system theme before
// paint to avoid a flash of the wrong theme on first load.
// ─────────────────────────────────────────────────────────────────────────────

type Theme = "light" | "dark";

interface LandingThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ROOT_ID = THEME_ROOT_ID;
const STORAGE_KEY = THEME_STORAGE_KEY;

const LandingThemeContext = createContext<LandingThemeContextValue | null>(null);

function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.getElementById(ROOT_ID);
  if (!root) return;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function LandingThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Read the theme that the inline script already applied (hard load) or fall
  // back to the saved/system preference (client-side navigation back to /).
  useEffect(() => {
    const stored = readStoredTheme();
    const current = document.getElementById(ROOT_ID);
    const applied: Theme =
      stored ??
      (current?.classList.contains("dark") ? "dark" : systemTheme());

    setThemeState(applied);
    applyTheme(applied);
    setMounted(true);

    // Follow the OS only while the visitor hasn't picked a theme manually.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme()) return;
      const next: Theme = event.matches ? "dark" : "light";
      setThemeState(next);
      applyTheme(next);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage can be unavailable in private mode — ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((previous) => {
      const next: Theme = previous === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, mounted }),
    [theme, setTheme, toggleTheme, mounted],
  );

  return (
    <LandingThemeContext.Provider value={value}>
      {children}
    </LandingThemeContext.Provider>
  );
}

export function useLandingTheme() {
  const context = useContext(LandingThemeContext);
  if (!context) {
    throw new Error("useLandingTheme must be used inside <LandingThemeProvider>");
  }
  return context;
}


