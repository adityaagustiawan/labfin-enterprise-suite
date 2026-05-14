"use client";

import { useState } from "react";
import { DEMO_TICKERS, loadDemoTicker } from "@/lib/demo-tickers";
import type { FullAnalysis } from "@/lib/types";

export default function ComparePageClient() {
  const [compareA, setCompareA] = useState("AAPL");
  const [compareB, setCompareB] = useState("MSFT");
  const [comparePair, setComparePair] = useState<{ a: FullAnalysis; b: FullAnalysis } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function postAnalyze(body: unknown): Promise<FullAnalysis> {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error((j as { error?: string }).error ?? "Request failed");
    }
    return res.json();
  }

  async function runCompare() {
    setError(null);
    setLoading(true);
    const a = loadDemoTicker(compareA);
    const b = loadDemoTicker(compareB);
    if (!a || !b) {
      setLoading(false);
      setError(`Pick two valid tickers: ${Object.keys(DEMO_TICKERS).join(", ")}`);
      return;
    }
    try {
      const [ra, rb] = await Promise.all([postAnalyze(a), postAnalyze(b)]);
      setComparePair({ a: ra, b: rb });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-6">
      <div>
        <h1 className="text-lg font-semibold sm:text-xl">Compare</h1>
        <p className="mt-1 text-sm text-zinc-400">FinScope-style KPI board for two demo issuers.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Company A</span>
          <input
            value={compareA}
            onChange={(e) => setCompareA(e.target.value.toUpperCase())}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 font-mono text-sm outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/30"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Company B</span>
          <input
            value={compareB}
            onChange={(e) => setCompareB(e.target.value.toUpperCase())}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 font-mono text-sm outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/30"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={runCompare}
        disabled={loading}
        className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Comparing…" : "Run compare"}
      </button>
      {error && (
        <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}
      {comparePair && (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-900/80 text-zinc-400">
              <tr>
                <th className="px-3 py-2 font-medium">Metric</th>
                <th className="px-3 py-2 font-mono">{comparePair.a.financials.ticker}</th>
                <th className="px-3 py-2 font-mono">{comparePair.b.financials.ticker}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-200">
              {(
                [
                  ["Health", comparePair.a.insights.healthRating, comparePair.b.insights.healthRating],
                  ["ROE %", comparePair.a.ratios.roe, comparePair.b.ratios.roe],
                  ["ROA %", comparePair.a.ratios.roa, comparePair.b.ratios.roa],
                  ["Net margin %", comparePair.a.ratios.net_profit_margin, comparePair.b.ratios.net_profit_margin],
                  ["Current ratio", comparePair.a.ratios.current_ratio, comparePair.b.ratios.current_ratio],
                  ["D/E", comparePair.a.ratios.debt_to_equity, comparePair.b.ratios.debt_to_equity],
                ] as const
              ).map(([label, va, vb]) => (
                <tr key={label}>
                  <td className="px-3 py-2 text-zinc-400">{label}</td>
                  <td className="px-3 py-2 font-mono tabular-nums">
                    {typeof va === "number" ? va.toFixed(label === "Health" ? 1 : 2) : va}
                  </td>
                  <td className="px-3 py-2 font-mono tabular-nums">
                    {typeof vb === "number" ? vb.toFixed(label === "Health" ? 1 : 2) : vb}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-3 py-2 text-zinc-400">Rec.</td>
                <td className="px-3 py-2">{comparePair.a.insights.recommendation}</td>
                <td className="px-3 py-2">{comparePair.b.insights.recommendation}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
