"use client";

import { RiMoonLine, RiSunLine } from "react-icons/ri";
import { useLandingTheme } from "./LandingThemeProvider";

/**
 * Light / dark switch for the landing page.
 * The knob and icons are driven by CSS (`.dark` ancestor), so there is no
 * hydration flicker — React only handles the click.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { toggleTheme } = useLandingTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light or dark mode"
      title="Light / dark mode"
      className={`group relative inline-flex h-9 w-[62px] shrink-0 items-center rounded-full border border-midnight/10 bg-lavender/80 px-1 transition-colors duration-300 hover:border-lumora/40 hover:bg-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumora focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/10 dark:hover:border-lumora-light/50 dark:hover:bg-white/15 dark:focus-visible:ring-offset-[#0B0B1A] ${className}`}
    >
      {/* knob */}
      <span className="absolute left-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sun shadow-[0_2px_8px_rgba(27,27,58,0.18)] transition-transform duration-300 ease-out dark:translate-x-[26px] dark:bg-[#1E1E40] dark:text-lumora-light">
        <RiSunLine size={14} className="dark:hidden" />
        <RiMoonLine size={14} className="hidden dark:block" />
      </span>

      {/* faint icons on the empty side of the track */}
      <span className="ml-auto mr-1 flex text-midnight/30 transition-colors group-hover:text-midnight/45 dark:hidden">
        <RiMoonLine size={13} />
      </span>
      <span className="ml-1 mr-auto hidden text-white/40 transition-colors group-hover:text-white/60 dark:flex">
        <RiSunLine size={13} />
      </span>
    </button>
  );
}
