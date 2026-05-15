import Link from "next/link";
import { listDemoCompanies } from "@/lib/company-registry";
import { Zap, TrendingUp, BarChart3, ListFilter, PlayCircle } from "lucide-react";

export default function DashboardPage() {
  const companies = listDemoCompanies();
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-black/90 p-8 backdrop-blur-xl shadow-2xl group">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-sky-500/10 blur-[100px] rounded-full group-hover:bg-sky-500/20 transition-all duration-700" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400/80">
                Enterprise Terminal
              </p>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Market Intelligence Hub
            </h1>
            <p className="max-w-xl text-zinc-400 leading-relaxed">
              Real-time financial analytics, AI-driven forecasting, and multi-agent coordination. 
              Start your analysis by selecting a demo company or uploading your data.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/analyze"
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition-all hover:bg-sky-500 hover:shadow-sky-500/40 active:scale-95"
            >
              <PlayCircle size={18} />
              Launch Terminal
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/analyze"
          className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 p-6 transition-all hover:border-sky-500/50 hover:bg-zinc-900/60 shadow-xl"
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Advanced Analysis</h3>
              <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                Run deep-dive financial audits using our multi-agent quantitative engine.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
              New analysis <span className="text-lg">→</span>
            </div>
          </div>
        </Link>

        <Link
          href="/companies"
          className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 p-6 transition-all hover:border-emerald-500/50 hover:bg-zinc-900/60 shadow-xl"
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ListFilter size={120} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Company Directory</h3>
              <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                Explore our registry of {companies.length} enterprise entities and historical filings.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              Browse companies <span className="text-lg">→</span>
            </div>
          </div>
        </Link>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-6 shadow-xl">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              Suggested Deep Dive
            </h3>
            <div className="rounded-xl border border-white/5 bg-white/5 p-4">
              <p className="text-sm font-mono text-sky-200">AMZN FY2024</p>
              <p className="mt-1 text-xs text-zinc-400">
                View multi-year trend panels inspired by professional terminal views.
              </p>
              <Link
                href="/companies/AMZN"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-zinc-800 py-2 text-xs font-bold text-white transition-colors hover:bg-zinc-700"
              >
                Open Amazon.com Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
