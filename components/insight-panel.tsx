import type { FullAnalysis } from "@/lib/types";

const recStyles: Record<string, string> = {
  "Strong Buy": "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30",
  Buy: "bg-sky-500/15 text-sky-100 ring-sky-500/30",
  Hold: "bg-amber-500/10 text-amber-100 ring-amber-500/25",
  Sell: "bg-orange-500/10 text-orange-100 ring-orange-500/25",
  "Strong Sell": "bg-red-500/15 text-red-100 ring-red-500/35",
};

export function InsightPanel({ analysis }: { analysis: FullAnalysis }) {
  const { insights, benchmark, benchmarkDeltas } = analysis;
  const rs = recStyles[insights.recommendation] ?? "bg-zinc-800 text-zinc-200";

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-5">
      <div>
        <h3 className="text-sm font-semibold sm:text-base">AI-grade narrative</h3>
        <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
          Deterministic analyst layer — swap for LLM with the same JSON contract.
        </p>
      </div>

      <div className={`rounded-xl px-3 py-2 ring-1 sm:px-4 sm:py-3 ${rs}`}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
          Recommendation
        </p>
        <p className="mt-1 text-lg font-semibold sm:text-xl">{insights.recommendation}</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-200/90 sm:text-sm">
          {insights.executiveSummary}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            Strengths
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-zinc-300 sm:text-sm">
            {insights.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            Watch items
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-zinc-300 sm:text-sm">
            {insights.weaknesses.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      {insights.risks.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400/80">
            Key risks
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-red-200/90 sm:text-sm">
            {insights.risks.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
          Benchmark deltas (vs. {analysis.financials.sector ?? "general"} sector template)
        </p>
        <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] text-zinc-300 sm:text-xs">
          <dt className="text-zinc-500">ROE − industry</dt>
          <dd className="text-right tabular-nums">
            {benchmarkDeltas.roe_vs_industry >= 0 ? "+" : ""}
            {benchmarkDeltas.roe_vs_industry.toFixed(1)} pp
          </dd>
          <dt className="text-zinc-500">D/E − industry</dt>
          <dd className="text-right tabular-nums">
            {benchmarkDeltas.dte_vs_industry >= 0 ? "+" : ""}
            {benchmarkDeltas.dte_vs_industry.toFixed(2)}
          </dd>
          <dt className="text-zinc-500">Sector ROE ref.</dt>
          <dd className="text-right tabular-nums">{benchmark.industry_roe}%</dd>
        </dl>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
          Suggested next steps
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-zinc-300 sm:text-sm">
          {insights.actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
