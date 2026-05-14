"use client";

import dynamic from "next/dynamic";
import type { FullAnalysis } from "@/lib/types";
import { AnalystChat } from "./analyst-chat";
import { CompanyTrendCharts } from "./company-trend-charts";
import { InsightPanel } from "./insight-panel";
import { KpiGrid } from "./kpi-grid";
import { RiskPanel } from "./risk-panel";

const ChartSummary = dynamic(() => import("./chart-summary").then((m) => m.ChartSummary), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 items-center justify-center rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-sm text-zinc-500">
      Loading chart…
    </div>
  ),
});

function formatMoney(n: number) {
  if (Math.abs(n) >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function AnalysisDashboard({
  analysis,
  showAnalystChat,
  showTrendCharts,
  omitHeader,
}: {
  analysis: FullAnalysis;
  showAnalystChat?: boolean;
  /** When true, show multi-year trend charts if `history` exists on the payload. */
  showTrendCharts?: boolean;
  /** Hide the hero KPI header when an outer shell (e.g. company page) already rendered it. */
  omitHeader?: boolean;
}) {
  const f = analysis.financials;
  const i = f.income_statement;
  const b = f.balance_sheet;
  const c = f.cash_flow;
  const history = f.history ?? [];
  const trendsVisible = (showTrendCharts ?? true) && history.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {!omitHeader && (
      <header className="rounded-2xl border border-[var(--color-border-subtle)] bg-gradient-to-br from-[#0f172a] to-[var(--color-surface-elevated)] p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300/90">
              LabLens IQ · Enterprise run
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              {f.company_name}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {f.ticker && <span className="font-mono text-sky-200">{f.ticker}</span>}
              {f.ticker && " · "}
              FY {f.year}
              {f.quarter ? ` · Q${f.quarter}` : ""}
              {f.sector && ` · ${f.sector}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center sm:min-w-[7.5rem]">
              <p className="text-[10px] uppercase text-emerald-200/80">Health</p>
              <p className="font-mono text-2xl font-bold text-emerald-100">
                {analysis.insights.healthRating}
                <span className="text-sm font-normal text-emerald-200/70">/10</span>
              </p>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-center text-xs text-zinc-300">
              <span className="block text-[10px] uppercase text-zinc-500">Engine verdict</span>
              <span className="mt-0.5 block font-medium text-zinc-100">{analysis.decision.verdict}</span>
            </div>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-4 font-mono text-xs text-zinc-300 sm:grid-cols-4 sm:text-sm">
          <div>
            <dt className="text-zinc-500">Revenue</dt>
            <dd className="mt-0.5 tabular-nums text-zinc-100">{formatMoney(i.revenue)}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Net income</dt>
            <dd className="mt-0.5 tabular-nums text-zinc-100">{formatMoney(i.net_income)}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Total assets</dt>
            <dd className="mt-0.5 tabular-nums text-zinc-100">{formatMoney(b.total_assets)}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Operating CF</dt>
            <dd className="mt-0.5 tabular-nums text-zinc-100">{formatMoney(c.operating_cash_flow)}</dd>
          </div>
        </dl>

        {analysis.decision.flags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.decision.flags.map((fl) => (
              <span
                key={fl}
                className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-100"
              >
                {fl.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}
      </header>
      )}

      <KpiGrid ratios={analysis.ratios} />

      {trendsVisible && <CompanyTrendCharts history={history} />}

      <div className="grid gap-4 lg:grid-cols-5 lg:gap-5">
        <div className="space-y-4 lg:col-span-3">
          <ChartSummary analysis={analysis} />
          <RiskPanel analysis={analysis} />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <InsightPanel analysis={analysis} />
          {showAnalystChat && <AnalystChat analysis={analysis} />}
        </div>
      </div>
    </div>
  );
}
