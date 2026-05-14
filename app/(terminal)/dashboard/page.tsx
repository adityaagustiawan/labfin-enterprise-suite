import Link from "next/link";
import { listDemoCompanies } from "@/lib/company-registry";

export default function DashboardPage() {
  const companies = listDemoCompanies();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Quick entry points — FinScope-style navigation lives in the sidebar.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/analyze"
          className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 text-sm font-medium text-sky-50 hover:border-sky-400/50"
        >
          New analysis →
        </Link>
        <Link
          href="/companies"
          className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-4 text-sm font-medium text-zinc-100 hover:border-zinc-500"
        >
          Browse {companies.length} demo companies →
        </Link>
        <Link
          href="/watchlist"
          className="rounded-2xl border border-zinc-700 bg-zinc-900/40 p-4 text-sm font-medium text-zinc-100 hover:border-zinc-500"
        >
          Watchlist →
        </Link>
      </div>
      <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-zinc-200">Suggested deep dive</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Open the AMZN demo snapshot for multi-year trend panels inspired by the public FinScope company view.
        </p>
        <Link
          href="/companies/AMZN"
          className="mt-4 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Open Amazon.com demo
        </Link>
      </section>
    </div>
  );
}
