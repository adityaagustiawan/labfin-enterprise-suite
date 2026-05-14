"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FullAnalysis } from "@/lib/types";

export function ChartSummary({ analysis }: { analysis: FullAnalysis }) {
  const f = analysis.financials;
  const i = f.income_statement;
  const data = [
    {
      name: "Income",
      Revenue: i.revenue / 1e6,
      "Gross profit": i.gross_profit / 1e6,
      "Net income": i.net_income / 1e6,
    },
  ];

  return (
    <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-3 sm:p-5">
      <h3 className="text-sm font-semibold sm:text-base">Income scale (USD millions)</h3>
      <p className="mt-1 text-xs text-zinc-500">Normalized for chart readability.</p>
      <div className="mt-3 h-56 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(v: number) => [`${v.toFixed(1)}M`, ""]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Revenue" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Gross profit" fill="#34d399" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Net income" fill="#a78bfa" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
