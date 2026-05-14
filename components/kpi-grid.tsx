import type { CalculatedRatios } from "@/lib/types";

type Band = "good" | "caution" | "danger";

function bandFor(metric: string, value: number): Band {
  switch (metric) {
    case "roe":
      return value > 15 ? "good" : value >= 8 ? "caution" : "danger";
    case "roa":
      return value > 10 ? "good" : value >= 5 ? "caution" : "danger";
    case "current_ratio":
      return value > 2 ? "good" : value >= 1.2 ? "caution" : "danger";
    case "debt_to_equity":
      return value < 1 ? "good" : value <= 2 ? "caution" : "danger";
    case "net_profit_margin":
      return value > 15 ? "good" : value >= 5 ? "caution" : "danger";
    default:
      return "caution";
  }
}

const bandClass: Record<Band, string> = {
  good: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  caution: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  danger: "border-red-500/40 bg-red-500/10 text-red-200",
};

export function KpiGrid({ ratios }: { ratios: CalculatedRatios }) {
  const items: { key: string; label: string; value: string; bandKey: string; raw: number }[] = [
    { key: "roe", label: "ROE", value: `${ratios.roe.toFixed(1)}%`, bandKey: "roe", raw: ratios.roe },
    { key: "roa", label: "ROA", value: `${ratios.roa.toFixed(1)}%`, bandKey: "roa", raw: ratios.roa },
    {
      key: "npm",
      label: "Net margin",
      value: `${ratios.net_profit_margin.toFixed(1)}%`,
      bandKey: "net_profit_margin",
      raw: ratios.net_profit_margin,
    },
    {
      key: "gpm",
      label: "Gross margin",
      value: `${ratios.gross_profit_margin.toFixed(1)}%`,
      bandKey: "net_profit_margin",
      raw: ratios.gross_profit_margin,
    },
    {
      key: "cr",
      label: "Current ratio",
      value: ratios.current_ratio.toFixed(2),
      bandKey: "current_ratio",
      raw: ratios.current_ratio,
    },
    {
      key: "qr",
      label: "Quick ratio",
      value: ratios.quick_ratio.toFixed(2),
      bandKey: "current_ratio",
      raw: ratios.quick_ratio,
    },
    {
      key: "de",
      label: "Debt / Equity",
      value: ratios.debt_to_equity.toFixed(2),
      bandKey: "debt_to_equity",
      raw: ratios.debt_to_equity,
    },
    {
      key: "dr",
      label: "Debt / Assets",
      value: `${(ratios.debt_ratio * 100).toFixed(1)}%`,
      bandKey: "debt_to_equity",
      raw: ratios.debt_to_equity,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => {
        const b = bandFor(it.bandKey, it.raw);
        return (
          <div
            key={it.key}
            className={`rounded-xl border px-3 py-3 sm:px-4 ${bandClass[b]}`}
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 sm:text-xs">
              {it.label}
            </p>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums sm:text-xl">{it.value}</p>
          </div>
        );
      })}
    </div>
  );
}
