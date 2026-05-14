import Link from "next/link";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-sky-600 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to analysis
      </a>
      <header className="sticky top-0 z-40 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-400 text-xs font-bold text-slate-950">
              FL
            </span>
            <p className="text-sm font-semibold text-white">FinLab AI</p>
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-zinc-400 sm:flex">
            <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-300">
              Competition build
            </span>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        {children}
      </main>
      <footer className="border-t border-[var(--color-border-subtle)] py-4 text-center text-[11px] text-zinc-500 sm:text-xs">
        LabLens IQ — illustrative analytics only, not investment advice. Wire your LLM and market data feeds via{" "}
        <code className="rounded bg-zinc-800 px-1 py-0.5 font-mono text-[10px] text-zinc-300">/api/analyze</code>.
      </footer>
    </div>
  );
}
