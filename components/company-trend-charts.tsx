"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FiscalHistoryPoint } from "@/lib/types";

function billions(n: number) {
  return n / 1e9;
}

export function CompanyTrendCharts({ history }: { history: FiscalHistoryPoint[] }) {
  const data = history.map((h) => ({
    year: String(h.year),
    Revenue: billions(h.revenue),
    "Net income": billions(h.net_income),
    "Operating CF": billions(h.operating_cash_flow),
    "Total liabilities": billions(h.total_liabilities),
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-3 sm:p-4">
        <h3 className="text-sm font-semibold">Revenue &amp; net income</h3>
        <p className="text-[11px] text-zinc-500">USD billions · demo series</p>
        <div className="mt-2 h-52 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} width={36} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v.toFixed(1)}B`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Revenue" stroke="#38bdf8" strokeWidth={2} dot />
              <Line type="monotone" dataKey="Net income" stroke="#34d399" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-3 sm:p-4">
        <h3 className="text-sm font-semibold">Operating cash flow</h3>
        <p className="text-[11px] text-zinc-500">USD billions</p>
        <div className="mt-2 h-52 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} width={36} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v.toFixed(1)}B`, ""]}
              />
              <Line type="monotone" dataKey="Operating CF" stroke="#a78bfa" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-3 sm:p-4 lg:col-span-2">
        <h3 className="text-sm font-semibold">Debt trend</h3>
        <p className="text-[11px] text-zinc-500">Total liabilities · USD billions</p>
        <div className="mt-2 h-48 sm:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} width={36} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v.toFixed(1)}B`, ""]}
              />
              <Line type="monotone" dataKey="Total liabilities" stroke="#fb7185" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
