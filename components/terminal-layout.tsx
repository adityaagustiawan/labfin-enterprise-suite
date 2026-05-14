"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { LoginPage } from "./login-page";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/analyze", label: "New analysis", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { href: "/companies", label: "Companies", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { href: "/compare", label: "Compare", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { href: "/watchlist", label: "Watchlist", icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
] as const;

export function TerminalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <div className="min-h-dvh bg-[#070b10]" />;
  // Sign-in page bypassed for public demo
  // if (!user) return <LoginPage />;

  return (
    <div className="flex min-h-dvh bg-[var(--color-surface)] text-zinc-100">
      <aside
        id="terminal-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[var(--color-border-subtle)] bg-[#070b10] transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-14 items-center gap-2 border-b border-[var(--color-border-subtle)] px-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-400 text-sm font-bold text-slate-950">
            FL
          </span>
          <div>
            <p className="text-sm font-semibold">FinLab AI</p>
            <p className="text-[10px] text-zinc-500">Terminal</p>
          </div>
        </div>
        <nav className="space-y-0.5 p-3">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  active ? "bg-sky-600/20 text-sky-100 ring-1 ring-sky-500/30" : "text-zinc-300 hover:bg-zinc-800/80"
                }`}
              >
                <svg className={`h-4 w-4 shrink-0 ${active ? "text-sky-400" : "text-zinc-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--color-border-subtle)] bg-zinc-950/50 p-3">
          <div className="flex items-center gap-3">
            {user.picture ? (
              <img src={user.picture} alt="" className="h-8 w-8 rounded-lg object-contain bg-white p-1" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400">
                {user.email.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-zinc-200">Public Demo</p>
              <div className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                <p className="truncate text-[9px] uppercase tracking-wider text-zinc-500">
                  Full Access
                </p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              title="Logout"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 px-3 backdrop-blur-md sm:px-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/80 text-zinc-200 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="terminal-sidebar"
          >
            <span className="sr-only">Toggle sidebar</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <p className="truncate text-xs font-medium text-zinc-400 sm:text-sm">
              <span className="mr-2 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
                Live
              </span>
              FinLab AI Terminal v1
            </p>
            <Link
              href="/"
              className="shrink-0 rounded-lg border border-zinc-700 px-2 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800 sm:text-xs"
            >
              Marketing site
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-4 sm:py-6 lg:px-6">{children}</main>
        <footer className="border-t border-[var(--color-border-subtle)] py-3 text-center text-[10px] text-zinc-500 sm:text-xs">
          Illustrative analytics only — not investment advice. Inspired by terminal UX patterns in public demos such as{" "}
          <a className="text-sky-400 underline-offset-2 hover:underline" href="https://finscope-xai.lovable.app/">
            FinScope
          </a>
          .
        </footer>
      </div>
    </div>
  );
}
