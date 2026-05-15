import Link from "next/link";
import { listDemoCompanies } from "@/lib/company-registry";
import { Search, Building2, Globe, Calendar, ArrowRight } from "lucide-react";

export default function CompaniesPage() {
  const rows = listDemoCompanies();
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-sky-500 rounded-full" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400">Registry</p>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Enterprise Directory</h1>
          <p className="mt-1 text-sm text-zinc-400">Explore the complete list of analyzed companies and historical data.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-sky-400 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search tickers..." 
            className="h-10 w-full md:w-64 rounded-xl border border-white/5 bg-zinc-900/50 pl-10 pr-4 text-sm text-zinc-100 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-zinc-900/80 text-[10px] uppercase tracking-widest text-zinc-500">
                <th className="px-6 py-4 font-bold border-b border-white/5">Ticker</th>
                <th className="px-6 py-4 font-bold border-b border-white/5">Company Name</th>
                <th className="px-6 py-4 font-bold border-b border-white/5">Industry Sector</th>
                <th className="px-6 py-4 font-bold border-b border-white/5">Latest Fiscal</th>
                <th className="px-6 py-4 font-bold border-b border-white/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((c) => (
                <tr key={c.ticker} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-lg bg-sky-500/10 px-2.5 py-1 font-mono text-xs font-bold text-sky-400 border border-sky-500/20">
                      {c.ticker}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-sky-500/20 group-hover:text-sky-400 transition-colors">
                        <Building2 size={16} />
                      </div>
                      <span className="font-medium text-zinc-200">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Globe size={14} className="text-zinc-600" />
                      {c.sector ?? "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-mono text-zinc-300">
                      <Calendar size={14} className="text-zinc-600" />
                      {c.year}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/companies/${encodeURIComponent(c.ticker)}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 transition-all hover:shadow-lg hover:shadow-sky-600/20"
                    >
                      View Report
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

