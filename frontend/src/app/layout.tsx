import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProviderWrapper } from "@/components/AuthProviderWrapper";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
  // Preload + swap eliminates layout shift and speeds up font render
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Lumora — Learn differently. Grow confidently.",
  description:
    "Cambridge-aligned adaptive learning platform for primary learners. Evidence-led, personalised, child-first.",
  // Speeds up LCP on first visit by hinting the browser early
  other: {
    "theme-color": "#6C5CE7",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={nunito.variable}>
      <body className="min-h-screen font-sans">
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
