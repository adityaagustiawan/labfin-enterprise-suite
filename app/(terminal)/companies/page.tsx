import Link from "next/link";
import { listDemoCompanies } from "@/lib/company-registry";

export default function CompaniesPage() {
  const rows = listDemoCompanies();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl">Companies</h1>
        <p className="mt-1 text-sm text-zinc-400">Demo registry — swap for your database or market data feed.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border-subtle)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Ticker</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">Latest FY</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-[var(--color-surface-elevated)]">
            {rows.map((c) => (
              <tr key={c.ticker} className="text-zinc-200">
                <td className="px-4 py-3 font-mono text-sky-200">{c.ticker}</td>
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-zinc-400">{c.sector ?? "—"}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-zinc-300">{c.year}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/companies/${encodeURIComponent(c.ticker)}`}
                    className="rounded-lg border border-zinc-600 px-2 py-1 text-xs text-zinc-200 hover:border-sky-500/50 hover:text-sky-100"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
