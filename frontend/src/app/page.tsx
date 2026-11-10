import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingClient } from "@/components/landing/LandingClient";
import { LandingThemeProvider } from "@/components/landing/LandingThemeProvider";
import { THEME_ROOT_ID, THEME_STORAGE_KEY } from "@/components/landing/theme-config";

// ─────────────────────────────────────────────
// All static data lives here (server component).
// Animations & icons are handled by client components.
// ─────────────────────────────────────────────

const stats = [
  { value: "3",    label: "Cambridge Primary stages" },
  { value: "4",    label: "Core subjects" },
  { value: "100%", label: "Evidence-led recommendations" },
  { value: "∞",    label: "Adaptive learning paths" },
];

const features = [
  {
    icon: "🧠",
    title: "Adaptive Engine",
    desc: "Every answer you submit becomes a learning signal. Lumora tracks accuracy, response time, and attempt patterns to continuously estimate your skill mastery.",
    color: "bg-lumora/10",
  },
  {
    icon: "📚",
    title: "Story-Based Lessons",
    desc: "Lessons are wrapped in real-world cross-subject themes like 'Let's Save Water!' — connecting English, Mathematics, and Science in one narrative.",
    color: "bg-mint-soft",
  },
  {
    icon: "🎯",
    title: "Personalised Recommendations",
    desc: "After each session, the system picks your next activity — reinforce, practice, or advance — based on your current mastery score, not a fixed schedule.",
    color: "bg-sun-soft",
  },
  {
    icon: "📊",
    title: "Real-Time Mastery Tracking",
    desc: "Mastery scores update after every attempt using a weighted learning model. Full history is saved so teachers and parents can track growth over time.",
    color: "bg-lumora/10",
  },
  {
    icon: "🏅",
    title: "Gamification",
    desc: "XP, day streaks, and achievement badges motivate daily learning — without competitive rankings. Progress is personal, not comparative.",
    color: "bg-mint-soft",
  },
  {
    icon: "🔒",
    title: "Privacy-First Design",
    desc: "Children's data is treated as sensitive. Only the minimum necessary data is collected, and every insight is framed to inform — not judge.",
    color: "bg-sun-soft",
  },
];

const adaptiveLoop = [
  { step: "Learn",    icon: "📖", desc: "Interactive story-based lesson" },
  { step: "Practice", icon: "✏️", desc: "Adaptive questions by difficulty" },
  { step: "Observe",  icon: "👁️", desc: "System records every learning signal" },
  { step: "Estimate", icon: "📊", desc: "Mastery score updated in real-time" },
  { step: "Adapt",    icon: "🔄", desc: "Next activity chosen by evidence" },
];

const roles = [
  {
    id: "student",
    emoji: "🎒",
    role: "Student",
    tagline: "Learn at your own pace",
    color: "from-lumora to-lumora-light",
    textColor: "text-white",
    steps: [
      { icon: "1", title: "Onboarding",     desc: "Choose your Cambridge Primary stage, interests, and learning goals." },
      { icon: "2", title: "Lesson",         desc: "Read a short story-based lesson that connects real life to curriculum." },
      { icon: "3", title: "Practice",       desc: "Answer adaptive questions — difficulty adjusts to your performance." },
      { icon: "4", title: "Mastery Update", desc: "Your skill score updates immediately after each session." },
      { icon: "5", title: "Next Mission",   desc: "The system recommends your next activity based on your evidence." },
    ],
    cta: { label: "Start learning", href: "/login" },
  },
  {
    id: "teacher",
    emoji: "👩‍🏫",
    role: "Teacher",
    tagline: "Insight that drives action",
    color: "from-mint to-mint/70",
    textColor: "text-white",
    steps: [
      { icon: "1", title: "Class Dashboard", desc: "See KPI tiles: active learners, average mastery, completion rate, and who needs support." },
      { icon: "2", title: "Subject Mastery", desc: "View class-level mastery per subject with visual charts and status labels." },
      { icon: "3", title: "AI Insights",     desc: "Get evidence-led summaries like 'Geometry needs reinforcement — 7 learners show repeated errors.'" },
      { icon: "4", title: "Learner Detail",  desc: "Click any learner to see their skill breakdown, session history, and mastery sparklines." },
      { icon: "5", title: "Take Action",     desc: "Assign reinforcement activities based on data, not guesswork." },
    ],
    cta: { label: "View dashboard", href: "/login" },
  },
  {
    id: "parent",
    emoji: "👨‍👩‍👧",
    role: "Parent",
    tagline: "Progress you can understand",
    color: "from-sun to-sun/70",
    textColor: "text-midnight",
    steps: [
      { icon: "1", title: "Child Profile",    desc: "See your child's name, stage, streak, and learning time in a simple hero card." },
      { icon: "2", title: "Subject Progress", desc: "View mastery across English, Mathematics, and Science with visual progress rings." },
      { icon: "3", title: "Weekly Activity",  desc: "A 7-day chart shows how consistently your child is learning each day." },
      { icon: "4", title: "AI Insight",       desc: "Plain-language summaries tell you what's going well and where extra practice helps." },
    ],
    cta: { label: "See an example", href: "/login" },
  },
];

const developer = {
  name:      "Muhammad Alif Sya'bani",
  title:     "Public Speaker & Web Developer",
  bio:       "Programmer, Graphic Designer, dan Public Speaker dengan pengalaman dalam pengembangan aplikasi berbasis web, desain visual, branding, serta komunikasi publik. Memiliki minat pada UI/UX, Artificial Intelligence, dan transformasi digital.",
  location:  "Jenggawah, Jember, Jawa Timur",
  email:     "syahbanialif79@gmail.com",
  phone:     "(+62) 831 1208 8830",
  portfolio: "syahbanialif.vercel.app",
  education: [
    { school: "SMK Nuris Jember",         period: "2023–2026", major: "Computer & Network Engineering",             note: "GPA 89/100" },
    { school: "Politeknik Negeri Malang",  period: "2026–Now",  major: "Applied Science in Informatics Engineering", note: "Freshman" },
  ],
  skills: [
    "Next.js", "React.js", "TypeScript", "Tailwind CSS",
    "PHP", "MySQL", "Figma", "UI/UX Design", "AI Prompt Engineering",
  ],
  highlights: [
    { icon: "🥈", text: "Juara 2 English Speech Competition – Kabupaten 2025" },
    { icon: "🏅", text: "Silver Medal – Olimpiade Bahasa Inggris Nasional 2024" },
    { icon: "🥇", text: "Juara 1 News Anchor BIG SMK Jatim Cup – Jember 2024" },
    { icon: "📊", text: "Peringkat 1 Paralel – SMK Nuris Jember 2024/2025" },
  ],
};

// Runs before paint (inline, inside #landing-root) to prevent a light flash
// when the visitor prefers dark mode or has chosen it before.
const themeScript = `
(function () {
  try {
    var key = "${THEME_STORAGE_KEY}";
    var root = document.getElementById("${THEME_ROOT_ID}");
    if (!root) return;
    var stored = localStorage.getItem(key);
    var dark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
  } catch (e) { /* ignore */ }
})();
`;

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function HomePage() {
  return (
    <LandingThemeProvider>
      {/* The `dark` class is scoped to this element by LandingThemeProvider. */}
      <div id={THEME_ROOT_ID} className="min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        <div className="min-h-screen bg-[#FAF9FF] text-midnight transition-colors duration-300 dark:bg-[#0B0B1A] dark:text-white">

          {/* Sticky navbar — client (scroll shadow + theme toggle + mobile menu) */}
          <LandingNavbar />

          {/* All animated sections — client (GSAP + react-icons) */}
          <LandingClient
            stats={stats}
            features={features}
            adaptiveLoop={adaptiveLoop}
            roles={roles}
            developer={developer}
          />

          {/* ════════════════════════════════
              FOOTER — server-rendered, no animation needed
          ════════════════════════════════ */}
          <footer className="border-t border-lavender bg-white px-6 py-12 dark:border-white/10 dark:bg-[#0B0B1A]">
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

                {/* Brand */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-lumora to-lumora-light text-sm font-extrabold text-white shadow-[0_4px_12px_rgba(108,92,231,0.35)]">
                      L
                    </div>
                    <span className="text-lg font-extrabold text-midnight dark:text-white">Lumora</span>
                  </div>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-midnight/55 dark:text-white/50">
                    Cambridge-aligned adaptive learning for primary learners.
                    Evidence-led, child-first, calm progress.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Student", "Teacher", "Parent"].map((role) => (
                      <Link
                        key={role}
                        href="/register"
                        className="rounded-pill bg-lavender px-3 py-1 text-xs font-bold text-midnight/60 transition-colors hover:bg-lavender/70 hover:text-lumora dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15 dark:hover:text-lumora-light"
                      >
                        {role}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Platform links */}
                <div>
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-midnight/30 dark:text-white/35">
                    Platform
                  </p>
                  <ul className="space-y-2">
                    {[
                      { label: "Features",     href: "#features" },
                      { label: "How it works", href: "#how-it-works" },
                      { label: "For students", href: "#roles" },
                      { label: "For teachers", href: "#roles" },
                      { label: "For parents",  href: "#roles" },
                    ].map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className="text-sm text-midnight/55 transition-colors hover:text-lumora dark:text-white/50 dark:hover:text-lumora-light"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Developer links */}
                <div>
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-midnight/30 dark:text-white/35">
                    Developer
                  </p>
                  <ul className="space-y-2">
                    {[
                      { label: "About the dev", href: "#about",                     ext: false },
                      { label: "Portfolio",      href: `https://${developer.portfolio}`, ext: true  },
                      { label: "Contact",        href: `mailto:${developer.email}`,      ext: true  },
                    ].map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          target={l.ext ? "_blank" : undefined}
                          rel={l.ext ? "noopener noreferrer" : undefined}
                          className="text-sm text-midnight/55 transition-colors hover:text-lumora dark:text-white/50 dark:hover:text-lumora-light"
                        >
                          {l.label}
                          {l.ext && <span className="ml-1 text-xs opacity-40">↗</span>}
                        </a>
                      </li>
                    ))}
                  </ul>

                  {/* Quick-access buttons */}
                  <div className="mt-5 space-y-2">
                    <Link
                      href="/login"
                      className="block rounded-2xl bg-lumora/10 px-4 py-2.5 text-center text-sm font-bold text-lumora transition-colors hover:bg-lumora/20 dark:bg-white/10 dark:text-lumora-light dark:hover:bg-white/15"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="block rounded-2xl bg-gradient-to-r from-lumora to-lumora-light px-4 py-2.5 text-center text-sm font-bold text-white shadow-[0_6px_18px_-6px_rgba(108,92,231,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-6px_rgba(108,92,231,0.6)]"
                    >
                      Get started →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-lavender pt-8 sm:flex-row dark:border-white/10">
                <p className="text-xs text-midnight/35 dark:text-white/35">
                  © {new Date().getFullYear()} Lumora · Cambridge-aligned adaptive learning · Concept project
                </p>
                <p className="text-xs text-midnight/35 dark:text-white/35">
                  Built by{" "}
                  <a
                    href={`https://${developer.portfolio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-lumora hover:underline dark:text-lumora-light"
                  >
                    {developer.name}
                  </a>
                  {" "}· Jember, Jawa Timur
                </p>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </LandingThemeProvider>
  );
}
