"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  RiBrainLine, RiBookOpenLine, RiMagicLine, RiBarChart2Line,
  RiMedalLine, RiShieldCheckLine, RiArrowRightLine,
  RiStarSmileLine, RiGraduationCapLine, RiTeamLine, RiLightbulbFlashLine,
  RiFlashlightFill, RiCheckboxCircleLine, RiMapPin2Line, RiMailLine,
  RiPhoneLine, RiGlobalLine, RiTrophyLine, RiAwardLine, RiHeartLine,
  RiEyeLine, RiEditLine, RiRepeatLine, RiRocketLine, RiMusicLine,
  RiCompassLine, RiPlanetLine, RiUserLine, RiUserStarLine, RiGroupLine,
  RiSchoolLine, RiAtomLine, RiCalculatorLine,
  RiQuillPenLine, RiLightbulbLine, RiWaterFlashLine, RiArrowDownLine,
} from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

// ── types ──────────────────────────────────────────────────────────────────

interface Stat     { value: string; label: string }
interface Feature  { icon: string;  title: string; desc: string; color: string }
interface LoopItem { step: string;  icon: string;  desc: string }
interface RoleStep { icon: string;  title: string; desc: string }
interface Role     {
  id: string; emoji: string; role: string; tagline: string;
  color: string; textColor: string;
  steps: RoleStep[];
  cta: { label: string; href: string };
}
interface Education  { school: string; period: string; major: string; note: string }
interface Developer  {
  name: string; title: string; bio: string;
  location: string; email: string; phone: string; portfolio: string;
  education: Education[];
  skills: string[];
  highlights: { icon: string; text: string }[];
}
interface Props {
  stats: Stat[]; features: Feature[]; adaptiveLoop: LoopItem[];
  roles: Role[]; developer: Developer;
}

// ── icon maps ──────────────────────────────────────────────────────────────

const featureIconMap: Record<string, React.ReactNode> = {
  "🧠": <RiBrainLine       size={28} />,
  "📚": <RiBookOpenLine    size={28} />,
  "🎯": <RiMagicLine       size={28} />,
  "📊": <RiBarChart2Line   size={28} />,
  "🏅": <RiMedalLine       size={28} />,
  "🔒": <RiShieldCheckLine size={28} />,
};

const featureColorMap: Record<
  string,
  { bg: string; icon: string; ring: string; glow: string }
> = {
  "🧠": {
    bg: "bg-lumora/10 dark:bg-lumora/20",
    icon: "text-lumora dark:text-lumora-light",
    ring: "ring-lumora/15 dark:ring-lumora/25",
    glow: "bg-lumora/30",
  },
  "📚": {
    bg: "bg-mint-soft dark:bg-mint/15",
    icon: "text-mint dark:text-mint",
    ring: "ring-mint/20 dark:ring-mint/25",
    glow: "bg-mint/30",
  },
  "🎯": {
    bg: "bg-sun-soft dark:bg-sun/15",
    icon: "text-[#C98A12] dark:text-sun",
    ring: "ring-sun/30 dark:ring-sun/25",
    glow: "bg-sun/35",
  },
  "📊": {
    bg: "bg-lumora/10 dark:bg-lumora/20",
    icon: "text-lumora dark:text-lumora-light",
    ring: "ring-lumora/15 dark:ring-lumora/25",
    glow: "bg-lumora/30",
  },
  "🏅": {
    bg: "bg-mint-soft dark:bg-mint/15",
    icon: "text-mint dark:text-mint",
    ring: "ring-mint/20 dark:ring-mint/25",
    glow: "bg-mint/30",
  },
  "🔒": {
    bg: "bg-sun-soft dark:bg-sun/15",
    icon: "text-[#C98A12] dark:text-sun",
    ring: "ring-sun/30 dark:ring-sun/25",
    glow: "bg-sun/35",
  },
};

const loopIconMap: Record<string, React.ReactNode> = {
  "📖": <RiBookOpenLine  size={30} />,
  "✏️": <RiEditLine      size={30} />,
  "👁️": <RiEyeLine       size={30} />,
  "📊": <RiBarChart2Line size={30} />,
  "🔄": <RiRepeatLine    size={30} />,
};

const loopColors = [
  "from-lumora to-lumora-light",
  "from-mint to-mint/80",
  "from-sun to-sun/80",
  "from-lumora-light to-mint",
  "from-midnight to-midnight-soft",
];

const roleIconMap: Record<string, React.ReactNode> = {
  "🎒":    <RiUserLine      size={52} />,
  "👩‍🏫":  <RiUserStarLine  size={52} />,
  "👨‍👩‍👧": <RiGroupLine     size={52} />,
};

// decorative floating subject icons for hero — all from ri
const subjectIcons = [
  { Icon: RiCalculatorLine, color: "text-mint",        size: 30, cls: "float-icon-1", pos: "left-[4%] top-[22%]" },
  { Icon: RiAtomLine,       color: "text-sun",         size: 28, cls: "float-icon-2", pos: "left-[8%] bottom-[24%]" },
  { Icon: RiQuillPenLine,   color: "text-lumora",      size: 30, cls: "float-icon-3", pos: "right-[5%] top-[20%]" },
  { Icon: RiMusicLine,      color: "text-mint",        size: 26, cls: "float-icon-4", pos: "right-[10%] bottom-[28%]" },
  { Icon: RiLightbulbLine,  color: "text-sun",         size: 28, cls: "float-icon-5", pos: "left-[20%] top-[9%]" },
  { Icon: RiCompassLine,    color: "text-lumora",      size: 26, cls: "float-icon-6", pos: "right-[22%] top-[11%]" },
  { Icon: RiPlanetLine,     color: "text-mint",        size: 30, cls: "float-icon-7", pos: "left-[15%] bottom-[14%]" },
  { Icon: RiWaterFlashLine, color: "text-sun",         size: 24, cls: "float-icon-8", pos: "right-[16%] bottom-[17%]" },
];

// ── component ──────────────────────────────────────────────────────────────

export function LandingClient({ stats, features, adaptiveLoop, roles, developer }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {

      // ── HERO entrance ──────────────────────────────────────────────
      const heroTl = gsap.timeline();
      heroTl
        .fromTo(".hero-badge",
          { scale: 0.6, opacity: 0, rotate: -6 },
          { scale: 1,   opacity: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" })
        .fromTo(".hero-h1-line1",
          { x: -60, opacity: 0 },
          { x: 0,   opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.1")
        .fromTo(".hero-h1-line2",
          { x: 60,  opacity: 0 },
          { x: 0,   opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .fromTo(".hero-underline",
          { strokeDasharray: 240, strokeDashoffset: 240 },
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" }, "-=0.35")
        .fromTo(".hero-sub",
          { y: 30,  opacity: 0 },
          { y: 0,   opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3")
        .fromTo(".hero-cta-primary",
          { scale: 0.8, opacity: 0 },
          { scale: 1,   opacity: 1, duration: 0.5, ease: "back.out(1.8)" }, "-=0.2")
        .fromTo(".hero-cta-secondary",
          { x: 30,  opacity: 0 },
          { x: 0,   opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .fromTo(".stat-tile",
          { y: 40, opacity: 0, scale: 0.9 },
          { y: 0,  opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)", stagger: 0.1 }, "-=0.2");

      // ── Floating subject icons ──────────────────────────────────────
      const floatData = [
        { cls: ".float-icon-1", y: -20, x:  8,  d: 4.0, delay: 0.0 },
        { cls: ".float-icon-2", y:  16, x: -10, d: 5.5, delay: 0.4 },
        { cls: ".float-icon-3", y: -14, x:  12, d: 3.8, delay: 0.8 },
        { cls: ".float-icon-4", y:  18, x: -8,  d: 6.0, delay: 0.3 },
        { cls: ".float-icon-5", y: -12, x:  10, d: 4.5, delay: 1.0 },
        { cls: ".float-icon-6", y:  14, x: -12, d: 5.0, delay: 0.6 },
        { cls: ".float-icon-7", y: -18, x:  6,  d: 4.8, delay: 0.2 },
        { cls: ".float-icon-8", y:  10, x: -6,  d: 3.5, delay: 0.9 },
      ];
      floatData.forEach(({ cls, y, x, d, delay }) => {
        gsap.fromTo(cls,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)", delay: 0.8 + delay });
        gsap.to(cls, { y, x, duration: d, ease: "sine.inOut", repeat: -1, yoyo: true, delay });
      });

      // ── Blob float ─────────────────────────────────────────────────
      gsap.to(".hero-blob-1", { y: -24, x:  14, scale: 1.05, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".hero-blob-2", { y:  18, x: -10, scale: 0.95, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1 });
      gsap.to(".hero-blob-3", { y: -12, x:  16, scale: 1.08, duration: 5, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 0.5 });

      // ── CTA primary pulse ──────────────────────────────────────────
      gsap.to(".hero-cta-primary", {
        boxShadow: "0 0 0 12px rgba(108,92,231,0)",
        duration: 1.5, ease: "power2.out", repeat: -1, delay: 2,
      });

      // ── LOOP section ───────────────────────────────────────────────
      gsap.fromTo(".loop-title",
        { y: 40, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".loop-section", start: "top 82%" } });

      gsap.fromTo(".loop-step",
        { y: 50, opacity: 0, scale: 0.85 },
        { y: 0,  opacity: 1, scale: 1,  duration: 0.6, ease: "back.out(1.4)", stagger: 0.13,
          scrollTrigger: { trigger: ".loop-section", start: "top 78%" } });

      // connector line draw
      gsap.fromTo(".loop-connector",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: ".loop-section", start: "top 75%" } });

      // ── FEATURES section ───────────────────────────────────────────
      gsap.fromTo(".features-title",
        { y: 40, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".features-section", start: "top 82%" } });

      gsap.fromTo(".feature-card",
        { y: 60, opacity: 0, rotate: 3 },
        { y: 0,  opacity: 1, rotate: 0, duration: 0.65, ease: "back.out(1.2)", stagger: 0.1,
          scrollTrigger: { trigger: ".features-section", start: "top 78%" } });

      // ── ROLES section ──────────────────────────────────────────────
      gsap.fromTo(".roles-title",
        { y: 40, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".roles-section", start: "top 82%" } });

      gsap.fromTo(".role-card",
        { y: 60, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.18,
          scrollTrigger: { trigger: ".roles-section", start: "top 78%" } });

      // ── CTA banner ────────────────────────────────────────────────
      gsap.fromTo(".cta-content",
        { scale: 0.92, opacity: 0 },
        { scale: 1,    opacity: 1, duration: 0.8, ease: "back.out(1.4)",
          scrollTrigger: { trigger: ".cta-section", start: "top 82%" } });

      // ── DEV section ───────────────────────────────────────────────
      gsap.fromTo(".dev-panel",
        { y: 50, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".dev-section", start: "top 80%" } });

      gsap.fromTo(".skill-tag",
        { scale: 0, opacity: 0, rotate: -10 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.35, ease: "back.out(1.8)", stagger: 0.045,
          scrollTrigger: { trigger: ".skill-tag", start: "top 90%" } });

      gsap.fromTo(".highlight-card",
        { x: -30, opacity: 0 },
        { x: 0,   opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.1,
          scrollTrigger: { trigger: ".highlight-card", start: "top 88%" } });

      // ── Stat counter animation ────────────────────────────────────
      document.querySelectorAll<HTMLElement>(".stat-number").forEach((el) => {
        const target = el.getAttribute("data-target");
        if (!target) return;

        const numeric = parseFloat(target.replace(/[^0-9.]/g, ""));
        if (Number.isNaN(numeric)) return;

        const suffix = target.replace(/[0-9.]/g, "");
        const obj = { val: 0 };

        gsap.to(obj, {
          val: numeric, duration: 2, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => { el.textContent = `${Math.round(obj.val)}${suffix}`; },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // hover animation handlers
  const onCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { y: -6, scale: 1.02, duration: 0.25, ease: "power2.out" });
  };
  const onCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.35, ease: "elastic.out(1,0.5)" });
  };

  return (
    <div ref={rootRef}>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-[#F4F1FF] via-white to-[#E8FAF7] px-6 py-24 text-midnight sm:py-32 dark:from-[#0B0B1A] dark:via-[#11112C] dark:to-[#0A1A22] dark:text-white">

        {/* dotted grid + glow */}
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 dark:opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lumora/15 blur-[110px] dark:bg-lumora/25" />

        {/* blobs */}
        <div className="hero-blob-1 pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-lumora/20 blur-[80px] dark:bg-lumora/25" />
        <div className="hero-blob-2 pointer-events-none absolute -bottom-24 right-0 h-[400px] w-[400px] rounded-full bg-mint/15 blur-[80px] dark:bg-mint/20" />
        <div className="hero-blob-3 pointer-events-none absolute right-1/3 top-16 h-64 w-64 rounded-full bg-sun/20 blur-[60px] dark:bg-sun/15" />

        {/* floating subject icons */}
        {subjectIcons.map(({ Icon, color, size, cls, pos }, i) => (
          <div
            key={i}
            className={`${cls} pointer-events-none absolute hidden opacity-0 lg:block ${pos}`}
          >
            <div
              className={`rounded-2xl border border-white/70 bg-white/70 p-3 shadow-[0_10px_30px_-10px_rgba(27,27,58,0.25)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.07] dark:shadow-none ${color} dark:brightness-110`}
            >
              <Icon size={size} />
            </div>
          </div>
        ))}

        {/* content */}
        <div className="relative mx-auto w-full max-w-4xl text-center">

          {/* badge */}
          <div className="hero-badge mb-6 inline-flex items-center gap-2.5 rounded-full border border-lumora/15 bg-white/75 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-midnight/70 shadow-[0_4px_20px_-8px_rgba(27,27,58,0.25)] backdrop-blur-md dark:border-white/15 dark:bg-white/10 dark:text-white/80 dark:shadow-none">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            Cambridge Primary · Stage 1–3 · Adaptive Learning
          </div>

          {/* heading */}
          <h1 className="font-extrabold leading-[1.08] tracking-tight">
            <span className="hero-h1-line1 block text-5xl text-midnight sm:text-6xl lg:text-7xl dark:text-white">
              Learn differently.
            </span>
            <span className="hero-h1-line2 relative mt-1 block">
              <span className="bg-gradient-to-r from-lumora via-[#8B7CF6] to-mint bg-clip-text text-5xl text-transparent sm:text-6xl lg:text-7xl dark:from-lumora-light dark:via-[#C4B5FD] dark:to-mint">
                Grow confidently.
              </span>
            </span>
          </h1>

          {/* hand-drawn underline */}
          <svg
            aria-hidden="true"
            className="mx-auto mt-3 h-3 w-52 text-mint/70 sm:w-64 dark:text-mint/60"
            viewBox="0 0 220 12"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              className="hero-underline"
              d="M2 9C42 3 84 3 124 6C154 8 184 7 218 4"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          {/* sub */}
          <p className="hero-sub mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-midnight/60 dark:text-white/65">
            Lumora watches how students learn, estimates skill mastery, and recommends
            the perfect next activity — for every child, every time.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="hero-cta-primary group inline-flex items-center gap-2.5 rounded-full bg-lumora px-9 py-4 text-base font-extrabold text-white shadow-[0_12px_34px_-8px_rgba(108,92,231,0.65)] transition-all hover:-translate-y-1 hover:bg-lumora-light hover:shadow-[0_16px_44px_-8px_rgba(108,92,231,0.7)] dark:bg-white dark:text-lumora dark:shadow-[0_12px_34px_-10px_rgba(255,255,255,0.35)] dark:hover:bg-lavender"
            >
              <RiRocketLine size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:rotate-12" />
              Start for free
              <RiArrowRightLine size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="hero-cta-secondary inline-flex items-center gap-2 rounded-full border border-midnight/10 bg-white/70 px-8 py-4 text-base font-bold text-midnight/80 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-lumora/40 hover:bg-white hover:text-lumora dark:border-white/20 dark:bg-white/5 dark:text-white/85 dark:hover:border-white/40 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <RiWaterFlashLine size={18} />
              See how it works
            </a>
          </div>

          {/* stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="stat-tile group relative overflow-hidden rounded-2xl border border-midnight/[0.07] bg-white/70 px-4 py-5 text-center shadow-[0_10px_34px_-20px_rgba(27,27,58,0.45)] backdrop-blur-md transition-all hover:-translate-y-1 hover:border-lumora/30 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none dark:hover:border-lumora/40 dark:hover:bg-white/[0.07]"
              >
                <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-lumora/50 to-transparent" />
                <p
                  className="stat-number text-3xl font-extrabold text-midnight dark:text-white"
                  data-target={s.value}
                >
                  {s.value}
                </p>
                <p className="mt-1.5 text-xs font-semibold leading-tight text-midnight/50 dark:text-white/50">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* scroll cue */}
          <a
            href="#how-it-works"
            className="mt-14 inline-flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-midnight/35 transition-colors hover:text-lumora dark:text-white/35 dark:hover:text-lumora-light"
          >
            Scroll
            <RiArrowDownLine size={16} className="animate-bounce" />
          </a>
        </div>

        {/* bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 30 Q360 60 720 30 Q1080 0 1440 30 L1440 60 L0 60 Z"
              className="fill-midnight/[0.03] dark:fill-white/[0.04]"
            />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LOOP SECTION
      ══════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="loop-section relative overflow-hidden bg-gradient-to-b from-[#F6F3FF] via-white to-white px-6 py-24 dark:from-[#0D0D22] dark:via-[#0B0B1A] dark:to-[#0B0B1A]"
      >
        {/* deco circles */}
        <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-lumora/5 dark:bg-lumora/10" />
        <div className="pointer-events-none absolute -left-16 bottom-10 h-40 w-40 rounded-full bg-mint/10 dark:bg-mint/5" />

        <div className="mx-auto max-w-5xl">
          <div className="loop-title text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-lumora/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lumora dark:bg-lumora/15 dark:text-lumora-light">
              <RiRepeatLine size={13} />
              The Core Loop
            </div>
            <h2 className="text-balance text-3xl font-extrabold text-midnight sm:text-4xl dark:text-white">
              How adaptive learning works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-midnight/55 dark:text-white/55">
              Every session feeds the loop. The more a student learns, the smarter
              Lumora&apos;s recommendations become.
            </p>
          </div>

          {/* Steps panel */}
          <div className="relative mt-16 overflow-hidden rounded-3xl border border-midnight/[0.06] bg-white/70 p-8 shadow-[0_30px_80px_-50px_rgba(27,27,58,0.5)] backdrop-blur-sm sm:p-10 dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-none">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-lumora/10 blur-2xl dark:bg-lumora/15" />

            {/* connecting line behind bubbles — desktop only */}
            <div
              className="loop-connector absolute left-[10%] right-[10%] top-[4.65rem] hidden h-0.5 origin-left bg-gradient-to-r from-lumora/40 via-mint/40 to-sun/40 sm:block"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              {adaptiveLoop.map((item, i) => (
                <div key={item.step} className="loop-step group flex flex-1 flex-col items-center gap-3">
                  {/* bubble */}
                  <div
                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${loopColors[i]} text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.35)] ring-4 ring-white transition-transform duration-300 group-hover:-translate-y-1 dark:ring-[#12122A]`}
                  >
                    {loopIconMap[item.icon] ?? <span className="text-2xl">{item.icon}</span>}
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-midnight shadow dark:bg-[#0B0B1A] dark:text-white">
                      {i + 1}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="font-extrabold text-midnight dark:text-white">{item.step}</p>
                    <p className="mx-auto mt-1 max-w-[110px] text-xs leading-relaxed text-midnight/50 dark:text-white/50">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* loop tagline */}
          <div className="mt-10 flex items-center justify-center gap-3 rounded-2xl border border-lumora/20 bg-lumora/5 px-6 py-3 dark:border-lumora/25 dark:bg-lumora/10">
            <RiRepeatLine className="shrink-0 text-lumora dark:text-lumora-light" size={18} />
            <p className="text-sm font-semibold text-lumora dark:text-lumora-light">
              This loop runs continuously — every answer makes the next recommendation smarter.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section
        id="features"
        className="features-section relative overflow-hidden bg-white px-6 py-24 dark:bg-[#0B0B1A]"
      >
        <div className="pointer-events-none absolute -left-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-lavender/50 blur-3xl dark:bg-lumora/10" />
        <div className="pointer-events-none absolute -right-10 top-1/3 h-48 w-48 rounded-full bg-mint-soft blur-2xl dark:bg-mint/5" />

        <div className="relative mx-auto max-w-5xl">
          <div className="features-title text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-mint-soft px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0E8C82] dark:bg-mint/15 dark:text-mint">
              <RiStarSmileLine size={13} />
              Platform Features
            </div>
            <h2 className="text-balance text-3xl font-extrabold text-midnight sm:text-4xl dark:text-white">
              Everything in one adaptive system
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-midnight/55 dark:text-white/55">
              Six building blocks that turn everyday practice into a clear picture of growth.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const meta =
                featureColorMap[f.icon] ??
                { bg: "bg-lumora/10 dark:bg-lumora/20", icon: "text-lumora dark:text-lumora-light", ring: "ring-lumora/15 dark:ring-lumora/25", glow: "bg-lumora/30" };
              return (
                <div
                  key={f.title}
                  className="feature-card group relative cursor-default overflow-hidden rounded-3xl border border-midnight/[0.06] bg-white p-7 shadow-[0_12px_44px_-28px_rgba(27,27,58,0.4)] transition-colors hover:border-lumora/30 dark:border-white/[0.08] dark:bg-white/[0.035] dark:shadow-none dark:hover:border-lumora/40 dark:hover:bg-white/[0.055]"
                  onMouseEnter={onCardEnter}
                  onMouseLeave={onCardLeave}
                >
                  <span
                    className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${meta.glow}`}
                  />
                  <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-4 ${meta.bg} ${meta.icon} ${meta.ring}`}>
                    {featureIconMap[f.icon] ?? <RiLightbulbFlashLine size={28} />}
                  </div>
                  <h3 className="text-base font-extrabold text-midnight dark:text-white">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-midnight/55 dark:text-white/55">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ROLES
      ══════════════════════════════════════════════ */}
      <section
        id="roles"
        className="roles-section relative overflow-hidden bg-gradient-to-b from-[#F7F5FF] to-white px-6 py-24 dark:from-[#0D0D22] dark:to-[#0B0B1A]"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-sun-soft blur-3xl dark:bg-sun/5" />

        <div className="mx-auto max-w-5xl">
          <div className="roles-title text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sun-soft px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-midnight dark:bg-sun/15 dark:text-sun">
              <RiTeamLine size={13} />
              Built for Everyone
            </div>
            <h2 className="text-balance text-3xl font-extrabold text-midnight sm:text-4xl dark:text-white">
              One platform, three perspectives
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-midnight/55 dark:text-white/55">
              Students learn, teachers guide, parents follow — each role gets exactly the view they need.
            </p>
          </div>

          <div className="mt-14 space-y-10">
            {roles.map((r, idx) => (
              <div
                key={r.id}
                className={`role-card overflow-hidden rounded-3xl border border-midnight/[0.05] shadow-[0_24px_70px_-40px_rgba(27,27,58,0.55)] dark:border-white/[0.08] dark:shadow-[0_24px_70px_-40px_rgba(0,0,0,0.8)] ${
                  idx % 2 === 0 ? "lg:flex" : "lg:flex lg:flex-row-reverse"
                }`}
              >
                {/* color panel */}
                <div className={`relative flex flex-col items-start justify-between overflow-hidden bg-gradient-to-br ${r.color} p-10 lg:w-[42%]`}>
                  {/* deco shapes */}
                  <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
                  <div className="pointer-events-none absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-white/10" />
                  <div className="pointer-events-none absolute right-4 bottom-4 h-16 w-16 rounded-2xl bg-white/10" />

                  <div className="relative z-10">
                    <div className={`mb-3 inline-flex rounded-2xl bg-white/15 p-3 ring-1 ring-white/20 ${r.textColor}`}>
                      {roleIconMap[r.emoji] ?? <span className="text-5xl">{r.emoji}</span>}
                    </div>
                    <h3 className={`text-2xl font-extrabold ${r.textColor}`}>{r.role}</h3>
                    <p className={`mt-1.5 text-sm font-semibold ${r.textColor} opacity-70`}>{r.tagline}</p>
                  </div>

                  <Link
                    href={r.cta.href}
                    className={`relative z-10 mt-8 inline-flex items-center gap-2.5 rounded-full border-2 border-current px-6 py-3 text-sm font-extrabold transition-all hover:bg-white/15 hover:gap-4 ${r.textColor}`}
                  >
                    {r.cta.label}
                    <RiArrowRightLine size={15} />
                  </Link>
                </div>

                {/* steps panel */}
                <div className="flex-1 bg-white p-10 dark:bg-[#12122A]">
                  <p className="mb-6 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-midnight/25 dark:text-white/30">
                    <RiLightbulbFlashLine size={14} className="text-lumora dark:text-lumora-light" />
                    How it works for {r.role.toLowerCase()}s
                  </p>
                  <ol className="space-y-5">
                    {r.steps.map((step, si) => (
                      <li key={step.title} className="flex items-start gap-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lumora/20 to-mint/20 text-xs font-extrabold text-lumora dark:from-lumora/30 dark:to-mint/20 dark:text-lumora-light">
                          {si + 1}
                        </span>
                        <div>
                          <p className="font-extrabold text-midnight dark:text-white">{step.title}</p>
                          <p className="mt-0.5 text-sm leading-relaxed text-midnight/50 dark:text-white/50">{step.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════ */}
      <section className="cta-section relative overflow-hidden bg-gradient-to-br from-lumora via-[#7B6BEF] to-mint px-6 py-20 text-white dark:from-[#4B3FD1] dark:via-[#6C5CE7] dark:to-[#1E9E92]">
        {/* deco */}
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
        <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-10 left-16 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-sun/25 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-mint/30 blur-3xl" />

        <div className="cta-content relative mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-sm">
            <RiFlashlightFill size={34} className="text-sun" />
          </div>
          <h2 className="text-balance text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Ready to learn differently?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/80">
            Join Lumora today — for students who want to grow, teachers who want insight,
            and parents who want to understand.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-9 py-4 font-extrabold text-lumora shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
            >
              <RiStarSmileLine size={18} />
              Create free account
              <RiArrowRightLine size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 font-bold text-white transition-all hover:border-white hover:bg-white/10"
            >
              Log in
            </Link>
          </div>

          {/* small trust indicators */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-semibold text-white/70">
            {[
              { Icon: RiCheckboxCircleLine, label: "No credit card" },
              { Icon: RiShieldCheckLine,    label: "Privacy-first" },
              { Icon: RiGraduationCapLine,  label: "Cambridge-aligned" },
            ].map(({ Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon size={14} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          DEVELOPER
      ══════════════════════════════════════════════ */}
      <section
        id="about"
        className="dev-section relative overflow-hidden bg-white px-6 py-24 dark:bg-[#0B0B1A]"
      >
        <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-lavender/50 blur-3xl dark:bg-lumora/10" />

        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-lavender px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lumora dark:bg-white/10 dark:text-lumora-light">
              <RiHeartLine size={13} />
              Developer
            </div>
            <h2 className="text-balance text-3xl font-extrabold text-midnight sm:text-4xl dark:text-white">
              Built with ❤️ by
            </h2>
          </div>

          <div className="dev-panel mt-12 overflow-hidden rounded-3xl border border-midnight/[0.05] shadow-[0_30px_90px_-50px_rgba(27,27,58,0.6)] dark:border-white/[0.08] dark:shadow-[0_30px_90px_-50px_rgba(0,0,0,0.9)] lg:flex">

            {/* left — profile */}
            <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-br from-midnight to-midnight-soft px-8 py-12 text-white lg:w-72 lg:shrink-0">
              <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-lumora/20" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-mint/15" />

              {/* avatar */}
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-lumora/40 to-mint/30 text-3xl font-extrabold ring-4 ring-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
                MA
              </div>
              <h3 className="relative z-10 mt-5 text-center text-xl font-extrabold">{developer.name}</h3>
              <p className="relative z-10 mt-1 text-center text-sm text-white/60">{developer.title}</p>

              {/* contact rows */}
              <div className="relative z-10 mt-7 w-full space-y-2.5">
                {[
                  { Icon: RiMailLine,    text: developer.email },
                  { Icon: RiPhoneLine,   text: developer.phone },
                  { Icon: RiGlobalLine,  text: developer.portfolio },
                  { Icon: RiMapPin2Line, text: developer.location },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2.5 transition-colors hover:bg-white/15">
                    <Icon size={14} className="shrink-0 text-lumora-light" />
                    <span className="break-all text-xs text-white/65">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* right — detail */}
            <div className="flex-1 bg-white p-10 dark:bg-[#12122A]">
              <p className="leading-relaxed text-midnight/65 dark:text-white/60">{developer.bio}</p>

              {/* education */}
              <div className="mt-7">
                <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-midnight/25 dark:text-white/30">
                  <RiSchoolLine size={14} className="text-lumora dark:text-lumora-light" />
                  Education
                </p>
                <div className="space-y-3">
                  {developer.education.map((e) => (
                    <div key={e.school} className="flex items-start gap-3 rounded-2xl bg-lavender/40 px-4 py-3 transition-colors hover:bg-lavender/60 dark:bg-white/[0.05] dark:hover:bg-white/[0.08]">
                      <RiGraduationCapLine size={20} className="mt-0.5 shrink-0 text-lumora dark:text-lumora-light" />
                      <div>
                        <p className="font-extrabold text-midnight dark:text-white">{e.school}</p>
                        <p className="text-sm text-midnight/55 dark:text-white/55">{e.major}</p>
                        <p className="text-xs text-midnight/35 dark:text-white/35">{e.period} · {e.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* tech stack */}
              <div className="mt-7">
                <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-midnight/25 dark:text-white/30">
                  <RiFlashlightFill size={14} className="text-lumora dark:text-sun" />
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {developer.skills.map((s) => (
                    <span
                      key={s}
                      className="skill-tag inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-lumora/10 to-mint/10 px-3.5 py-1.5 text-xs font-semibold text-lumora ring-1 ring-lumora/15 dark:from-lumora/20 dark:to-mint/15 dark:text-lumora-light dark:ring-white/10"
                    >
                      <RiCheckboxCircleLine size={11} />
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* highlights */}
              <div className="mt-7">
                <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-midnight/25 dark:text-white/30">
                  <RiTrophyLine size={14} className="text-sun" />
                  Highlights
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {developer.highlights.map((h, i) => (
                    <div
                      key={h.text}
                      className="highlight-card flex items-start gap-3 rounded-2xl border-2 border-lavender p-3.5 transition-all hover:border-lumora/30 hover:shadow-soft dark:border-white/10 dark:hover:border-lumora/40 dark:hover:shadow-none"
                    >
                      <RiAwardLine
                        size={18}
                        className={`mt-0.5 shrink-0 ${
                          i === 0 ? "text-midnight/40 dark:text-white/40" :
                          i === 2 ? "text-sun" :
                          "text-lumora dark:text-lumora-light"
                        }`}
                      />
                      <p className="text-xs leading-relaxed text-midnight/55 dark:text-white/55">{h.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
