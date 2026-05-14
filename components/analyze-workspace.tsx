"use client";

import { useMemo, useState } from "react";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { runFullAnalysis } from "@/lib/analyze";
import { DEMO_TICKERS, loadDemoTicker } from "@/lib/demo-tickers";
import type {
  BalanceSheet,
  CashFlow,
  CompanyFinancials,
  FullAnalysis,
  IncomeStatement,
} from "@/lib/types";

type Tab = "manual" | "ticker" | "compare" | "ai";

const defaultManual: CompanyFinancials = {
  source: "manual",
  company_name: "PT Contoh Tbk",
  ticker: "CNTX",
  sector: "Retail",
  year: 2024,
  prior_year_revenue: 900_000,
  income_statement: {
    revenue: 1_000_000,
    cost_of_goods_sold: 600_000,
    gross_profit: 400_000,
    operating_expense: 150_000,
    net_income: 200_000,
  },
  balance_sheet: {
    total_assets: 500_000,
    total_liabilities: 100_000,
    total_equity: 400_000,
    current_assets: 250_000,
    current_liabilities: 80_000,
    inventory: 40_000,
  },
  cash_flow: {
    operating_cash_flow: 220_000,
    investing_cash_flow: -50_000,
    financing_cash_flow: -30_000,
  },
};

function NumField({
  label,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 outline-none ring-sky-500/0 transition focus:border-sky-500/60 focus:ring-2"
      />
    </label>
  );
}

export default function AnalyzeWorkspace() {
  const [tab, setTab] = useState<Tab>("manual");
  const [manual, setManual] = useState<CompanyFinancials>(defaultManual);
  const [tickerSymbol, setTickerSymbol] = useState("LLAB");
  const [compareA, setCompareA] = useState("AAPL");
  const [compareB, setCompareB] = useState("MSFT");
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [comparePair, setComparePair] = useState<{ a: FullAnalysis; b: FullAnalysis } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiFile, setAiFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aiResult, setAiResult] = useState<{ summary: string; extractedData?: Partial<CompanyFinancials>; isBusiness: boolean } | null>(null);

  const tabs = useMemo(
    () =>
      [
        { id: "manual" as const, label: "Manual" },
        { id: "ai" as const, label: "AI Multimodal" },
        { id: "ticker" as const, label: "Ticker demo" },
        { id: "compare" as const, label: "Compare" },
      ] satisfies { id: Tab; label: string }[],
    [],
  );

  async function handleAIUpload() {
    if (!aiFile) return;
    setError(null);
    setLoading(true);
    setAiResult(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", aiFile);

    try {
      const res = await fetch("/api/analyze/multimodal", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "AI Analysis failed");
      }
      
      const result = await res.json();
      setAiResult(result);
      
      // Automatically merge and run analysis if any data was extracted
      const hasData = result.extractedData && (
        result.extractedData.company_name || 
        result.extractedData.ticker || 
        (result.extractedData.income_statement && result.extractedData.income_statement.revenue > 0)
      );

      if (hasData) {
        const nextFinancials = {
          ...manual,
          company_name: result.extractedData.company_name || manual.company_name,
          ticker: result.extractedData.ticker || manual.ticker,
          sector: result.extractedData.sector || manual.sector,
          year: result.extractedData.year || manual.year,
          income_statement: { ...manual.income_statement, ...result.extractedData.income_statement },
          balance_sheet: { ...manual.balance_sheet, ...result.extractedData.balance_sheet },
          cash_flow: { ...manual.cash_flow, ...result.extractedData.cash_flow },
        };
        
        setManual(nextFinancials);
        
        try {
          const analysisResult = await postAnalyze(nextFinancials);
          setAnalysis(analysisResult);
          setTab("manual"); // Switch to manual tab to show the filled data
        } catch {
          setError("AI extracted data but the financial engine failed to process it. Please check the Manual tab.");
        }
      } else {
        // If no data found, still run analysis on current manual data to show "something"
        try {
          const analysisResult = await postAnalyze(manual);
          setAnalysis(analysisResult);
        } catch {
          setError("AI couldn't extract financial data from this media.");
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI Error");
    } finally {
      setLoading(false);
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setAiFile(file);
    }
  };

  function applyAIData() {
    if (!aiResult?.extractedData) return;

    const mergeFinancials = <T extends object>(prev: T, next?: Partial<T>): T => {
      if (!next) return prev;
      const result = { ...prev };
      (Object.keys(next) as Array<keyof T>).forEach((key) => {
        const val = next[key];
        if (val !== 0 && val !== null && val !== undefined) {
          result[key] = val as T[keyof T];
        }
      });
      return result;
    };

    setManual((prev) => ({
      ...prev,
      company_name: aiResult.extractedData?.company_name || prev.company_name,
      ticker: aiResult.extractedData?.ticker || prev.ticker,
      sector: aiResult.extractedData?.sector || prev.sector,
      year: aiResult.extractedData?.year || prev.year,
      income_statement: mergeFinancials(
        prev.income_statement,
        aiResult.extractedData?.income_statement as Partial<IncomeStatement>,
      ),
      balance_sheet: mergeFinancials(
        prev.balance_sheet,
        aiResult.extractedData?.balance_sheet as Partial<BalanceSheet>,
      ),
      cash_flow: mergeFinancials(
        prev.cash_flow,
        aiResult.extractedData?.cash_flow as Partial<CashFlow>,
      ),
    }));
    setTab("manual");
  }

  async function postAnalyze(payload: CompanyFinancials): Promise<FullAnalysis> {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error((j as { error?: string }).error ?? "Request failed");
    }
    return res.json();
  }

  async function runManual() {
    setError(null);
    setLoading(true);
    setComparePair(null);
    try {
      const local = runFullAnalysis(manual);
      if (!local.validation.isValid) {
        setAnalysis(null);
        setError(local.validation.issues.filter((i) => i.severity === "error").map((i) => i.message).join(" · "));
        return;
      }
      const result = await postAnalyze(manual);
      setAnalysis(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function runTicker() {
    setError(null);
    setLoading(true);
    setComparePair(null);
    const data = loadDemoTicker(tickerSymbol);
    if (!data) {
      setLoading(false);
      setError(`No demo dataset for "${tickerSymbol}". Try: ${Object.keys(DEMO_TICKERS).join(", ")}`);
      return;
    }
    try {
      const result = await postAnalyze(data);
      setAnalysis(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function runCompare() {
    setError(null);
    setLoading(true);
    setAnalysis(null);
    const a = loadDemoTicker(compareA);
    const b = loadDemoTicker(compareB);
    if (!a || !b) {
      setLoading(false);
      setError("Pick two valid demo tickers from the list shown below.");
      return;
    }
    try {
      const [ra, rb] = await Promise.all([postAnalyze(a), postAnalyze(b)]);
      setComparePair({ a: ra, b: rb });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="mb-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-6">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">New analysis</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Manual JSON payload, curated tickers, or side-by-side compare — same engine as company detail pages.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-2.5 py-1.5 text-[11px] font-medium transition sm:px-3 sm:text-sm ${
                tab === t.id
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-900/40"
                  : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {tab === "manual" && (
        <section className="mb-6 space-y-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block space-y-1 sm:col-span-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Company</span>
              <input
                value={manual.company_name}
                onChange={(e) => setManual({ ...manual, company_name: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-sm outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/30"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Ticker</span>
              <input
                value={manual.ticker ?? ""}
                onChange={(e) => setManual({ ...manual, ticker: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 font-mono text-sm outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/30"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Sector hint</span>
              <input
                value={manual.sector ?? ""}
                onChange={(e) => setManual({ ...manual, sector: e.target.value })}
                placeholder="Software, Retail…"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-sm outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/30"
              />
            </label>
            <NumField
              label="Fiscal year"
              value={manual.year}
              onChange={(n) => setManual({ ...manual, year: Math.round(n) })}
            />
            <NumField
              label="Prior year revenue (optional)"
              value={manual.prior_year_revenue ?? 0}
              onChange={(n) => setManual({ ...manual, prior_year_revenue: n > 0 ? n : null })}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 sm:col-span-3">
              Income statement
            </p>
            <NumField
              label="Revenue"
              value={manual.income_statement.revenue}
              onChange={(n) =>
                setManual({
                  ...manual,
                  income_statement: { ...manual.income_statement, revenue: n },
                })
              }
            />
            <NumField
              label="COGS"
              value={manual.income_statement.cost_of_goods_sold}
              onChange={(n) =>
                setManual({
                  ...manual,
                  income_statement: { ...manual.income_statement, cost_of_goods_sold: n },
                })
              }
            />
            <NumField
              label="Gross profit"
              value={manual.income_statement.gross_profit}
              onChange={(n) =>
                setManual({
                  ...manual,
                  income_statement: { ...manual.income_statement, gross_profit: n },
                })
              }
            />
            <NumField
              label="Operating expense"
              value={manual.income_statement.operating_expense}
              onChange={(n) =>
                setManual({
                  ...manual,
                  income_statement: { ...manual.income_statement, operating_expense: n },
                })
              }
            />
            <NumField
              label="Net income"
              value={manual.income_statement.net_income}
              onChange={(n) =>
                setManual({
                  ...manual,
                  income_statement: { ...manual.income_statement, net_income: n },
                })
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 sm:col-span-3">
              Balance sheet
            </p>
            <NumField
              label="Total assets"
              value={manual.balance_sheet.total_assets}
              onChange={(n) =>
                setManual({
                  ...manual,
                  balance_sheet: { ...manual.balance_sheet, total_assets: n },
                })
              }
            />
            <NumField
              label="Total liabilities"
              value={manual.balance_sheet.total_liabilities}
              onChange={(n) =>
                setManual({
                  ...manual,
                  balance_sheet: { ...manual.balance_sheet, total_liabilities: n },
                })
              }
            />
            <NumField
              label="Total equity"
              value={manual.balance_sheet.total_equity}
              onChange={(n) =>
                setManual({
                  ...manual,
                  balance_sheet: { ...manual.balance_sheet, total_equity: n },
                })
              }
            />
            <NumField
              label="Current assets"
              value={manual.balance_sheet.current_assets}
              onChange={(n) =>
                setManual({
                  ...manual,
                  balance_sheet: { ...manual.balance_sheet, current_assets: n },
                })
              }
            />
            <NumField
              label="Current liabilities"
              value={manual.balance_sheet.current_liabilities}
              onChange={(n) =>
                setManual({
                  ...manual,
                  balance_sheet: { ...manual.balance_sheet, current_liabilities: n },
                })
              }
            />
            <NumField
              label="Inventory (optional)"
              value={manual.balance_sheet.inventory ?? 0}
              onChange={(n) =>
                setManual({
                  ...manual,
                  balance_sheet: { ...manual.balance_sheet, inventory: n },
                })
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 sm:col-span-3">
              Cash flow
            </p>
            <NumField
              label="Operating CF"
              value={manual.cash_flow.operating_cash_flow}
              onChange={(n) =>
                setManual({ ...manual, cash_flow: { ...manual.cash_flow, operating_cash_flow: n } })
              }
            />
            <NumField
              label="Investing CF"
              value={manual.cash_flow.investing_cash_flow}
              onChange={(n) =>
                setManual({ ...manual, cash_flow: { ...manual.cash_flow, investing_cash_flow: n } })
              }
            />
            <NumField
              label="Financing CF"
              value={manual.cash_flow.financing_cash_flow}
              onChange={(n) =>
                setManual({ ...manual, cash_flow: { ...manual.cash_flow, financing_cash_flow: n } })
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={runManual}
              disabled={loading}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-emerald-500 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-900/30 disabled:opacity-50"
            >
              {loading ? "Running…" : "Run analysis"}
            </button>
            <button
              type="button"
              onClick={() => setManual(defaultManual)}
              className="text-sm text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
            >
              Reset sample
            </button>
          </div>
        </section>
      )}

      {tab === "ticker" && (
        <section className="mb-6 space-y-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-6">
          <label className="block max-w-xs space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Demo ticker</span>
            <input
              value={tickerSymbol}
              onChange={(e) => setTickerSymbol(e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 font-mono text-sm uppercase outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/30"
            />
          </label>
          <p className="text-xs text-zinc-500">
            Built-in:{" "}
            <span className="font-mono text-zinc-300">{Object.keys(DEMO_TICKERS).join(", ")}</span>
          </p>
          <button
            type="button"
            onClick={runTicker}
            disabled={loading}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Loading…" : "Analyze ticker"}
          </button>
        </section>
      )}

      {tab === "compare" && (
        <section className="mb-6 space-y-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Company A</span>
              <input
                value={compareA}
                onChange={(e) => setCompareA(e.target.value.toUpperCase())}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 font-mono text-sm outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/30"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Company B</span>
              <input
                value={compareB}
                onChange={(e) => setCompareB(e.target.value.toUpperCase())}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 font-mono text-sm outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/30"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={runCompare}
            disabled={loading}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Comparing…" : "Compare"}
          </button>

          {comparePair && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
              <table className="min-w-full text-left text-xs sm:text-sm">
                <thead className="bg-zinc-900/80 text-zinc-400">
                  <tr>
                    <th className="px-3 py-2 font-medium">Metric</th>
                    <th className="px-3 py-2 font-mono">{comparePair.a.financials.ticker}</th>
                    <th className="px-3 py-2 font-mono">{comparePair.b.financials.ticker}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-200">
                  {(
                    [
                      ["Health", comparePair.a.insights.healthRating, comparePair.b.insights.healthRating],
                      ["ROE %", comparePair.a.ratios.roe, comparePair.b.ratios.roe],
                      ["ROA %", comparePair.a.ratios.roa, comparePair.b.ratios.roa],
                      ["Net margin %", comparePair.a.ratios.net_profit_margin, comparePair.b.ratios.net_profit_margin],
                      ["Current ratio", comparePair.a.ratios.current_ratio, comparePair.b.ratios.current_ratio],
                      ["D/E", comparePair.a.ratios.debt_to_equity, comparePair.b.ratios.debt_to_equity],
                    ] as const
                  ).map(([label, va, vb]) => (
                    <tr key={label}>
                      <td className="px-3 py-2 text-zinc-400">{label}</td>
                      <td className="px-3 py-2 font-mono tabular-nums">
                        {typeof va === "number" ? va.toFixed(label === "Health" ? 1 : 2) : va}
                      </td>
                      <td className="px-3 py-2 font-mono tabular-nums">
                        {typeof vb === "number" ? vb.toFixed(label === "Health" ? 1 : 2) : vb}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-3 py-2 text-zinc-400">Rec.</td>
                    <td className="px-3 py-2">{comparePair.a.insights.recommendation}</td>
                    <td className="px-3 py-2">{comparePair.b.insights.recommendation}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {tab === "ai" && (
        <section className="mb-6 space-y-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-6">
          <div className="space-y-4">
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`rounded-xl border border-dashed p-4 sm:p-8 text-center transition-colors ${
                isDragging
                  ? "border-sky-500 bg-sky-500/10"
                  : "border-zinc-700 bg-zinc-950/40"
              }`}
            >
              <input
                type="file"
                id="ai-upload"
                className="hidden"
                accept="video/*,audio/*,image/*"
                onChange={(e) => setAiFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="ai-upload"
                className="cursor-pointer space-y-2 text-zinc-400 hover:text-zinc-200"
              >
                <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-zinc-800">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-medium">
                  {aiFile ? aiFile.name : "Tap to upload or drop files"}
                </p>
                <p className="hidden sm:block text-xs text-zinc-500">
                  Multimodal AI will summarize and extract financial data
                </p>
              </label>
            </div>

            <button
              type="button"
              onClick={handleAIUpload}
              disabled={loading || !aiFile}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-emerald-500 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-900/30 disabled:opacity-50"
            >
              {loading ? "AI is analyzing..." : "Analyze Media"}
            </button>

            {aiResult && (
              <div className="mt-6 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-200">AI Analysis</h3>
                  {aiResult.extractedData && (
                    <button
                      onClick={applyAIData}
                      className="text-xs font-medium text-sky-400 hover:text-sky-300"
                    >
                      Apply extracted data →
                    </button>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap">
                  {aiResult.summary}
                </p>
                {aiResult.extractedData && (
                  <div className="mt-4 rounded-lg bg-black/40 p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                      Extracted Entities
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300">
                        {aiResult.extractedData.company_name || "Unknown Company"}
                      </span>
                      {aiResult.extractedData.ticker && (
                        <span className="rounded bg-sky-900/30 px-2 py-0.5 text-[11px] font-mono text-sky-400">
                          {aiResult.extractedData.ticker}
                        </span>
                      )}
                      {aiResult.extractedData.sector && (
                        <span className="rounded bg-emerald-900/30 px-2 py-0.5 text-[11px] text-emerald-400">
                          {aiResult.extractedData.sector}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
        >
          {error}
        </div>
      )}

      {analysis && (
        <div className="pb-10">
          <AnalysisDashboard analysis={analysis} showAnalystChat />
        </div>
      )}
    </>
  );
}
