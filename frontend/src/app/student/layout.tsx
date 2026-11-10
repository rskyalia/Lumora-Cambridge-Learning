"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import {
  RiBookOpenLine,
  RiPencilLine,
  RiBarChart2Line,
  RiTrophyLine,
  RiCompassDiscoverLine,
  RiLogoutBoxLine,
  RiFlashlightFill,
} from "react-icons/ri";

const tabs = [
  { href: "/student/learn",    label: "Learn",    Icon: RiBookOpenLine },
  { href: "/student/practice", label: "Practice", Icon: RiPencilLine },
  { href: "/student/result",   label: "Result",   Icon: RiTrophyLine },
  { href: "/student/progress", label: "Progress", Icon: RiBarChart2Line },
  { href: "/student/world",    label: "My World", Icon: RiCompassDiscoverLine },
];

function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const headerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(headerRef.current,
      { y: -70, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.4)" }
    ).fromTo(".student-tab-item",
      { y: -15, opacity: 0, scale: 0.85 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)", stagger: 0.06 },
      "-=0.2"
    );
  }, []);

  // Page content fade-in on route change
  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender/30 to-white">
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-lavender/60 bg-white/95 px-4 py-3 shadow-[0_2px_12px_-2px_rgba(108,92,231,0.12)] backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-lumora to-lumora-light text-white shadow-[0_4px_10px_rgba(108,92,231,0.35)] transition-transform group-hover:scale-105">
              <RiFlashlightFill size={15} />
            </div>
            <span className="hidden text-base font-extrabold text-midnight transition-colors group-hover:text-lumora sm:block">
              Lumora
            </span>
          </Link>

          {/* Tab nav */}
          <nav className="flex flex-1 justify-center gap-0.5 overflow-x-auto rounded-2xl bg-lavender/60 p-1">
            {tabs.map(({ href, label, Icon }) => {
              const isActive =
                pathname === href ||
                pathname.startsWith(href + "/") ||
                (href === "/student/learn" && pathname === "/student/lesson");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`student-tab-item flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all sm:px-4 sm:text-sm ${
                    isActive
                      ? "bg-white text-lumora shadow-[0_2px_8px_rgba(108,92,231,0.2)]"
                      : "text-midnight/55 hover:bg-white/60 hover:text-lumora"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-lumora" : ""} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User + logout */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden max-w-[80px] truncate text-xs font-semibold text-midnight/50 sm:block">
              {user?.name}
            </span>
            <button
              onClick={logout}
              title="Keluar"
              className="flex items-center gap-1 rounded-xl border-2 border-lavender p-1.5 text-midnight/50 transition-all hover:border-lumora hover:text-lumora"
            >
              <RiLogoutBoxLine size={16} />
            </button>
          </div>
        </div>
      </header>

      <div ref={contentRef} className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </div>
    </div>
  );
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["STUDENT"]}>
      <StudentShell>{children}</StudentShell>
    </AuthGuard>
  );
}
