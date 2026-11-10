"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  RiMenuLine,
  RiCloseLine,
  RiArrowRightLine,
  RiFlashlightFill,
  RiHome4Line,
  RiSettings4Line,
  RiTeamLine,
  RiUserSmileLine,
} from "react-icons/ri";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "#features",     label: "Features",    Icon: RiSettings4Line },
  { href: "#how-it-works", label: "How it works", Icon: RiHome4Line },
  { href: "#roles",        label: "For you",      Icon: RiTeamLine },
  { href: "#about",        label: "About",        Icon: RiUserSmileLine },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef      = useRef<HTMLElement>(null);
  const mobileRef   = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLAnchorElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  /* scroll shadow + reading progress */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const el = progressRef.current;
      if (el) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        el.style.transform = `scaleX(${ratio})`;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* entrance */
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const tl = gsap.timeline();
    tl.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.4)" }
    ).fromTo(".nav-link-item",
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.07 },
      "-=0.3"
    ).fromTo(".nav-cta",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)" },
      "-=0.2"
    );
  }, []);

  /* logo bounce on hover */
  const handleLogoEnter = () => {
    gsap.to(logoRef.current, { scale: 1.1, rotate: -5, duration: 0.2, ease: "power2.out" });
  };
  const handleLogoLeave = () => {
    gsap.to(logoRef.current, { scale: 1, rotate: 0, duration: 0.3, ease: "elastic.out(1,0.5)" });
  };

  /* mobile menu */
  useEffect(() => {
    if (!mobileRef.current) return;
    if (menuOpen) {
      gsap.fromTo(mobileRef.current,
        { height: 0, opacity: 0, y: -10 },
        { height: "auto", opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
      gsap.fromTo(".mobile-nav-item",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.06, ease: "power2.out", delay: 0.1 }
      );
    } else {
      gsap.to(mobileRef.current, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
    }
  }, [menuOpen]);

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-lavender/80 bg-white/90 shadow-[0_4px_24px_-8px_rgba(108,92,231,0.22)] backdrop-blur-md dark:border-white/10 dark:bg-[#0B0B1A]/85 dark:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)]"
          : "border-b border-transparent bg-white/70 backdrop-blur-sm dark:bg-[#0B0B1A]/60"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          ref={logoRef}
          href="/"
          className="flex items-center gap-2.5"
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-lumora to-lumora-light text-white shadow-[0_4px_12px_rgba(108,92,231,0.4)]">
            <span className="text-base font-extrabold">L</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold text-midnight dark:text-white">Lumora</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-lumora/60 dark:text-lumora-light/70">
              Adaptive Learning
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              className="nav-link-item flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold text-midnight/60 transition-all hover:bg-lavender hover:text-lumora dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-lumora-light"
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className="nav-cta rounded-2xl px-4 py-2 text-sm font-bold text-midnight/70 transition-colors hover:text-lumora dark:text-white/70 dark:hover:text-lumora-light"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="nav-cta group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-lumora to-lumora-light px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(108,92,231,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(108,92,231,0.45)]"
          >
            <RiFlashlightFill size={14} className="text-sun" />
            Get started
            <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center justify-center rounded-xl border-2 border-lavender p-2 text-midnight/70 transition-all hover:border-lumora hover:text-lumora dark:border-white/15 dark:text-white/70 dark:hover:border-lumora-light dark:hover:text-lumora-light"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div ref={mobileRef} className="overflow-hidden lg:hidden" style={{ height: 0, opacity: 0 }}>
        <div className="border-t border-lavender bg-white px-6 pb-6 pt-4 dark:border-white/10 dark:bg-[#0E0E22]">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-item flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-midnight/70 transition-colors hover:bg-lavender hover:text-lumora dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-lumora-light"
              >
                <Icon size={16} className="text-lumora dark:text-lumora-light" />
                {label}
              </a>
            ))}
          </nav>

          {/* theme row */}
          <div className="mobile-nav-item mt-3 flex items-center justify-between rounded-2xl bg-lavender/70 px-4 py-2.5 dark:bg-white/[0.06]">
            <div>
              <p className="text-sm font-bold text-midnight dark:text-white">Appearance</p>
              <p className="text-[11px] font-semibold text-midnight/45 dark:text-white/45">
                Light or dark, your choice
              </p>
            </div>
            <ThemeToggle />
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-lavender pt-4 dark:border-white/10">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl border-2 border-lavender py-3 text-center text-sm font-bold text-midnight/70 transition-colors hover:border-lumora hover:text-lumora dark:border-white/15 dark:text-white/70 dark:hover:border-lumora-light dark:hover:text-lumora-light"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lumora to-lumora-light py-3 text-sm font-bold text-white shadow-[0_6px_18px_-6px_rgba(108,92,231,0.5)]"
            >
              <RiFlashlightFill size={14} className="text-sun" />
              Get started free
              <RiArrowRightLine size={14} />
            </Link>
          </div>

          {/* promo tag */}
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-lavender to-mint-soft px-4 py-2.5 dark:from-white/[0.06] dark:to-white/[0.04]">
            <RiFlashlightFill size={13} className="shrink-0 text-lumora dark:text-lumora-light" />
            <p className="text-xs font-semibold text-midnight/60 dark:text-white/55">
              Cambridge-aligned · Adaptive · Free to try
            </p>
          </div>
        </div>
      </div>

      {/* reading progress */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
        <div
          ref={progressRef}
          className="h-full origin-left bg-gradient-to-r from-lumora via-mint to-sun"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </header>
  );
}
