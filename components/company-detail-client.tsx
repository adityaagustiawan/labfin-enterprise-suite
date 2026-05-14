"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { loadDemoTicker } from "@/lib/demo-tickers";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist-storage";
import type { FullAnalysis } from "@/lib/types";

export default function CompanyDetailClient({ ticker }: { ticker: string }) {
  const symbol = ticker.toUpperCase();
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    setWatching(isInWatchlist(symbol));
  }, [symbol]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError(null);
      const payload = loadDemoTicker(symbol);
      if (!payload) {
        setAnalysis(null);
        setError("Unknown ticker for this demo.");
        return;
      }
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Analysis failed");
        const data = (await res.json()) as FullAnalysis;
        if (!cancelled) setAnalysis(data);
      } catch {
        if (!cancelled) setError("Could not load analysis.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return (
    <div className="space-y-4">
      <nav className="text-xs text-zinc-500">
        <Link href="/companies" className="text-sky-400 hover:underline">
          Companies
        </Link>
        <span className="mx-1.5 text-zinc-600">/</span>
        <span className="font-mono text-zinc-300">{symbol}</span>
      </nav>

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {analysis && (
        <>
          <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300/90">
                FinLab AI · Enterprise run
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                {analysis.financials.company_name}
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                <span className="font-mono text-sky-200">{symbol}</span>
                <span className="mx-2 text-zinc-600">·</span>
                Latest: {analysis.financials.year}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const on = toggleWatchlist(symbol);
                  setWatching(on);
                }}
                className={`min-h-[40px] rounded-xl border px-4 text-sm font-medium ${
                  watching
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-100"
                    : "border-zinc-600 bg-zinc-900 text-zinc-200 hover:border-zinc-500"
                }`}
              >
                {watching ? "Watching" : "Watch"}
              </button>
              <Link
                href="/analyze"
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-sky-500/40 bg-sky-600/20 px-4 text-sm font-medium text-sky-100 hover:bg-sky-600/30"
              >
                New report
              </Link>
              <Link
                href={`/forecast/${encodeURIComponent(symbol)}`}
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-zinc-600 bg-zinc-900 px-4 text-sm text-zinc-200 hover:border-zinc-500"
              >
                AI forecast
              </Link>
            </div>
          </div>

          <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-zinc-200">Overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{analysis.insights.executiveSummary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-200/80">AI rating</p>
                <p className="mt-1 font-mono text-2xl font-bold text-emerald-100">
                  {analysis.insights.healthRating}
                  <span className="text-sm font-normal text-emerald-200/70">/10</span>
                </p>
              </div>
              <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-200/80">Stance</p>
                <p className="mt-1 text-lg font-semibold text-sky-50">{analysis.insights.recommendation}</p>
              </div>
              <div className="rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Engine</p>
                <p className="mt-1 text-sm font-medium leading-snug text-zinc-100">{analysis.decision.verdict}</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs text-zinc-300 sm:grid-cols-3 lg:grid-cols-6 sm:text-sm">
              <div>
                <dt className="text-zinc-500">ROE</dt>
                <dd className="tabular-nums text-zinc-100">{analysis.ratios.roe.toFixed(2)}%</dd>
              </div>
              <div>
                <dt className="text-zinc-500">ROA</dt>
                <dd className="tabular-nums text-zinc-100">{analysis.ratios.roa.toFixed(2)}%</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Net margin</dt>
                <dd className="tabular-nums text-zinc-100">{analysis.ratios.net_profit_margin.toFixed(2)}%</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Current</dt>
                <dd className="tabular-nums text-zinc-100">{analysis.ratios.current_ratio.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">D/E</dt>
                <dd className="tabular-nums text-zinc-100">{analysis.ratios.debt_to_equity.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Quick</dt>
                <dd className="tabular-nums text-zinc-100">{analysis.ratios.quick_ratio.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Gross margin</dt>
                <dd className="tabular-nums text-zinc-100">{analysis.ratios.gross_profit_margin.toFixed(2)}%</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Rev. growth</dt>
                <dd className="tabular-nums text-zinc-100">
                  {analysis.ratios.revenue_growth_yoy == null
                    ? "—"
                    : `${analysis.ratios.revenue_growth_yoy.toFixed(2)}%`}
                </dd>
              </div>
            </dl>
          </section>

          <AnalysisDashboard analysis={analysis} showAnalystChat showTrendCharts omitHeader />
        </>
      )}
    </div>
  );
}
