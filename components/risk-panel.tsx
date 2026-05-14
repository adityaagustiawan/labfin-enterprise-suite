"use client";

import type { FullAnalysis } from "@/lib/types";

function riskLabel(pct: number): string {
  if (pct < 35) return "Low";
  if (pct < 55) return "Moderate";
  return "High";
}

function Bar({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  const pct = Math.round(Math.min(100, Math.max(0, value)));
  const band = riskLabel(pct);
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 sm:text-sm">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-zinc-200">
          {pct}% — {band}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-zinc-500">{hint}</p>
    </div>
  );
}

export function RiskPanel({ analysis }: { analysis: FullAnalysis }) {
  const rs = analysis.riskScores;
  return (
    <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">Risk analysis</h3>
      <p className="mt-1 text-xs text-zinc-500 sm:text-sm">Higher % = higher stress (FinScope-style dial).</p>
      <div className="mt-4 space-y-4">
        <Bar
          label="Overall financial risk"
          value={rs.overallFinancial}
          hint="Blended view of earnings quality, liquidity, and leverage."
        />
        <Bar
          label="Liquidity risk"
          value={rs.liquidity}
          hint="Current coverage and working-capital tightness."
        />
        <Bar
          label="Leverage risk"
          value={rs.leverage}
          hint="Debt load vs. equity and refinancing sensitivity."
        />
        <Bar
          label="Solvency risk"
          value={rs.solvency}
          hint="Debt stack vs. assets and structural leverage flags."
        />
      </div>
    </section>
  );
}
