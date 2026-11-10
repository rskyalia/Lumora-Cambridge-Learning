import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

// Design System — Bagian 12 dokumen konsep:
// Visual direction: friendly premium, modern, clean, playful tapi tidak childish.
// Typeface: Nunito. Palette: Midnight/Navy, Lumora Purple, Lavender, Mint, Sun/Yellow.
//
// Shadcn/UI integration: CSS variables (--background, --primary, etc.) are
// defined in globals.css and mapped here via hsl() so both raw Tailwind tokens
// (bg-lumora, text-mint) AND Shadcn utility classes (bg-primary, text-muted-foreground)
// work side-by-side.
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // ── Lumora brand colours (direct use) ──────────────────────────
      colors: {
        midnight: {
          DEFAULT: "#1B1B3A",
          soft: "#2E2E55",
        },
        lumora: {
          DEFAULT: "#6C5CE7", // Lumora Purple — brand primary
          light: "#9B8CF2",
        },
        lavender: "#EDEAFF",
        mint: {
          DEFAULT: "#2EC4B6",
          soft: "#DFF7F4",
        },
        sun: {
          DEFAULT: "#FFC857",
          soft: "#FFF3DA",
        },

        // ── Shadcn/UI semantic tokens ───────────────────────────────
        // These wire up Shadcn components to the CSS variables in globals.css.
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },

      fontFamily: {
        sans: ["var(--font-nunito)", "Nunito", "system-ui", "sans-serif"],
      },

      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 2px)",
        sm:   "calc(var(--radius) - 4px)",
        card: "1.5rem",
        pill: "999px",
      },

      boxShadow: {
        soft: "0 8px 24px -8px rgba(27, 27, 58, 0.15)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;
