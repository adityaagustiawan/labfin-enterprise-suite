import Link from "next/link";
import { loadDemoTicker } from "@/lib/demo-tickers";
import LabFinStandaloneAgent from "@/components/labfin-standalone-agent";

function cagr(start: number, end: number, years: number) {
  if (start <= 0 || years <= 0) return null;
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}

export default async function ForecastPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const sym = decodeURIComponent(ticker).toUpperCase();
  const data = loadDemoTicker(sym);
  const hist = data?.history ?? [];
  const first = hist[0];
  const last = hist[hist.length - 1];
  const years = first && last ? last.year - first.year : 0;
  const revCagr = first && last && years > 0 ? cagr(first.revenue, last.revenue, years) : null;
  const niCagr = first && last && years > 0 ? cagr(Math.max(first.net_income, 1), last.net_income, years) : null;

  return (
    <div className="space-y-4">
      <nav className="text-xs text-zinc-500">
        <Link href="/companies" className="text-sky-400 hover:underline">
          Companies
        </Link>
        <span className="mx-1.5 text-zinc-600">/</span>
        <Link href={`/companies/${encodeURIComponent(sym)}`} className="font-mono text-sky-400 hover:underline">
          {sym}
        </Link>
        <span className="mx-1.5 text-zinc-600">/</span>
        <span className="text-zinc-300">Forecast</span>
      </nav>
      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-5 sm:p-6">
        <h1 className="text-xl font-semibold">AI forecast (deterministic stub)</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Premium feature placeholder — uses historical CAGR from the demo <span className="font-mono">{sym}</span>{" "}
          series when available. Wire your LLM or econometric model behind this route.
        </p>
        {!data && (
          <p className="mt-4 text-sm text-amber-200">Unknown ticker in this demo build.</p>
        )}
        {data && (
          <dl className="mt-6 grid gap-3 font-mono text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <dt className="text-xs text-zinc-500">Revenue CAGR ({first?.year ?? "—"}→{last?.year ?? "—"})</dt>
              <dd className="mt-1 text-lg text-zinc-100">
                {revCagr == null ? "—" : `${revCagr.toFixed(2)}%`}
              </dd>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <dt className="text-xs text-zinc-500">Net income CAGR</dt>
              <dd className="mt-1 text-lg text-zinc-100">
                {niCagr == null ? "—" : `${niCagr.toFixed(2)}%`}
              </dd>
            </div>
          </dl>
        )}
        <Link
          href={`/companies/${encodeURIComponent(sym)}`}
          className="mt-6 inline-flex rounded-xl border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500"
        >
          ← Back to company
        </Link>
      </div>
      <div className="mt-12 border-t border-zinc-800 pt-12">
        <LabFinStandaloneAgent />
      </div>
    </div>
  );
}
