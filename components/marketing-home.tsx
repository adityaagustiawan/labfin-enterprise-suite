import Link from "next/link";
import { MarketingVideoBackdrop } from "@/components/marketing-video-backdrop";

export default function MarketingHome() {
  return (
    <div className="relative min-h-dvh text-zinc-100">
      <MarketingVideoBackdrop />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="border-b border-white/10 bg-[#0a0f14]/65 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0f14]/45">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-400 text-sm font-bold text-slate-950">
                FL
              </span>
              <div>
                <p className="text-sm font-semibold">FinLab AI</p>
                <p className="text-[10px] text-zinc-400">Enterprise AI · finlab.ai 2026</p>
              </div>
            </div>
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href="/analyze"
                className="rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/10 hover:text-white"
              >
                Analyze
              </Link>
              <Link
                href="/companies"
                className="hidden rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/10 hover:text-white sm:inline"
              >
                Companies
              </Link>
              <Link
                href="/analyze"
                className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-900/40 sm:text-sm"
              >
                Launch terminal
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 space-y-16 px-4 py-12 sm:px-6 sm:py-16">
          <section className="space-y-5 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/95">
              Enterprise AI · lab-lab.ai finalist build
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl">
              Institutional-grade financial analysis in seconds.
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-zinc-300 sm:mx-0 sm:text-lg">
              LabLens IQ ingests structured statements, validates anomalies, computes ratios, and cross-checks a
              transparent rules engine — similar in spirit to public demos like{" "}
              <a className="text-sky-400 underline-offset-2 hover:underline" href="https://finscope-xai.lovable.app/">
                FinScope
              </a>{" "}
              and{" "}
              <a
                className="text-sky-400 underline-offset-2 hover:underline"
                href="https://lablab-ai-finance-buddy.lovable.app"
              >
                Finlab AI
              </a>
              .
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/analyze"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-emerald-500 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-black/30"
              >
                Open the analyst terminal
              </Link>
              <Link
                href="/companies/AMZN"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm text-white backdrop-blur-sm hover:border-white/35 hover:bg-white/10"
              >
                View sample company (AMZN demo)
              </Link>
            </div>
          </section>

          <section className="grid gap-6 rounded-2xl border border-white/10 bg-[#0a0f14]/55 p-6 shadow-2xl shadow-black/40 backdrop-blur-md sm:grid-cols-4 sm:p-8">
            {[
              {
                title: "Multimodal AI",
                body: "Direct Gemini API integration to summarize company reports, market predictions, and financial documents from video, images, or voice.",
              },
              {
                title: "3 input modes",
                body: "Manual entry, curated tickers, or compare — normalized to one JSON contract.",
              },
              {
                title: "Ratio engine",
                body: "Profitability, liquidity, leverage, and growth — deterministic and auditable.",
              },
              {
                title: "Hybrid verdict",
                body: "Narrative + rule flags + risk dials before you wire Gemini or GPT.",
              },
            ].map((c) => (
              <div key={c.title} className="space-y-2">
                <h2 className="text-base font-semibold text-white">{c.title}</h2>
                <p className="text-sm leading-relaxed text-zinc-400">{c.body}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-dashed border-white/15 bg-[#05080c]/50 p-6 backdrop-blur-md sm:p-8">
            <h2 className="text-lg font-semibold text-white">The pipeline</h2>
            <ol className="mt-4 space-y-3 text-sm text-zinc-400">
              <li>
                <span className="font-mono text-sky-400">01</span> Input — AI Multimodal (Video/Image/Voice), manual,
                ticker fetcher, or PDF.
              </li>
              <li>
                <span className="font-mono text-sky-400">02</span> Extract — Automatically identify companies and
                financial data from media.
              </li>
              <li>
                <span className="font-mono text-sky-400">03</span> Compute — ratios, benchmarks, stress scores.
              </li>
              <li>
                <span className="font-mono text-sky-400">04</span> Reason — grounded analyst chat today; swap for your
                model tomorrow.
              </li>
            </ol>
            <p className="mt-6 text-[11px] leading-relaxed text-zinc-500">
              Background videos live in{" "}
              <code className="rounded bg-black/40 px-1 font-mono text-[10px] text-zinc-300">public/marketing/</code> and
              play in a loop: when one clip ends, the next starts automatically (see{" "}
              <code className="font-mono text-[10px]">lib/marketing-videos.ts</code>). Override with a single file via{" "}
              <code className="rounded bg-black/40 px-1 font-mono text-[10px] text-zinc-300">
                NEXT_PUBLIC_MARKETING_VIDEO_URL
              </code>{" "}
              in <code className="font-mono text-[10px]">.env.local</code>.
            </p>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-[#0a0f14]/70 py-6 text-center text-xs text-zinc-500 backdrop-blur-md">
          LabLens IQ — not investment advice. External reference repos (e.g. labfin-enterprise-suite) can be wired in when
          available.
        </footer>
      </div>
    </div>
  );
}
