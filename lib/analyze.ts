import type {
  BenchmarkPack,
  CalculatedRatios,
  CompanyFinancials,
  DecisionResult,
  FullAnalysis,
  InsightReport,
} from "./types";
import { evaluateCompany } from "./decision-engine";
import { computeRatios } from "./ratios";
import { sectorBenchmark, validateFinancials } from "./validation";

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function benchmarkDeltas(r: CalculatedRatios, b: BenchmarkPack) {
  return {
    roe_vs_industry: r.roe - b.industry_roe,
    dte_vs_industry: r.debt_to_equity - b.industry_dte,
    cr_vs_industry: r.current_ratio - b.industry_current_ratio,
    npm_vs_industry: r.net_profit_margin - b.industry_npm,
  };
}

function riskFromRatios(r: CalculatedRatios, d: DecisionResult) {
  const flagWeight = d.flags.length * 10;

  const liquidity = clamp(
    22 + (r.current_ratio < 1.0 ? 42 : r.current_ratio < 1.2 ? 28 : r.current_ratio < 2 ? 12 : 4),
    5,
    92,
  );

  const leverage = clamp(
    18 +
      (r.debt_to_equity > 1.5 ? 32 : r.debt_to_equity > 1 ? 18 : 6) +
      (r.debt_ratio > 0.55 ? 18 : 0),
    8,
    90,
  );

  const solvency = clamp(
    24 +
      (r.debt_ratio > 0.7 ? 28 : r.debt_ratio > 0.5 ? 14 : 4) +
      (d.flags.includes("HIGH_LEVERAGE") ? 12 : 0),
    10,
    92,
  );

  const earningsStress = clamp(
    30 +
      (r.net_profit_margin < 5 ? 22 : 0) +
      (r.operating_margin < 5 ? 14 : 0) +
      flagWeight * 0.45,
    8,
    90,
  );

  const overallFinancial = clamp(Math.round((earningsStress + liquidity + leverage) / 3), 8, 92);

  return { overallFinancial, liquidity, leverage, solvency };
}

function synthesizeInsights(
  f: CompanyFinancials,
  r: CalculatedRatios,
  d: DecisionResult,
  b: BenchmarkPack,
): InsightReport {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const risks: string[] = [];

  if (r.roe >= b.industry_roe) strengths.push(`ROE at ${r.roe.toFixed(1)}% is at or above sector norm (~${b.industry_roe}%).`);
  else weaknesses.push(`ROE trails sector (~${b.industry_roe}%) at ${r.roe.toFixed(1)}%.`);

  if (r.current_ratio >= b.industry_current_ratio)
    strengths.push(`Liquidity (current ${r.current_ratio.toFixed(2)}) meets or beats sector peers.`);
  else weaknesses.push(`Current ratio ${r.current_ratio.toFixed(2)} is lean versus sector (~${b.industry_current_ratio}).`);

  if (r.debt_to_equity <= b.industry_dte)
    strengths.push(`Leverage is controlled versus sector debt/equity norms.`);
  else weaknesses.push(`Leverage is above typical sector levels — refinancing and coverage matter.`);

  if (r.net_profit_margin >= b.industry_npm)
    strengths.push(`Net margin ${r.net_profit_margin.toFixed(1)}% is competitive for the sector.`);
  else weaknesses.push(`Net margin ${r.net_profit_margin.toFixed(1)}% sits below sector average (~${b.industry_npm}%).`);

  if (r.revenue_growth_yoy != null && r.revenue_growth_yoy > 8)
    strengths.push(`Revenue grew ~${r.revenue_growth_yoy.toFixed(1)}% YoY — demand tailwind.`);
  if (r.revenue_growth_yoy != null && r.revenue_growth_yoy < 0)
    weaknesses.push(`Revenue contracted ~${Math.abs(r.revenue_growth_yoy).toFixed(1)}% YoY.`);

  if (r.ocf_to_net_income != null && r.ocf_to_net_income >= 1)
    strengths.push("Operating cash flow covers net income — earnings quality looks supportive.");
  if (r.ocf_to_net_income != null && r.ocf_to_net_income < 0.7)
    weaknesses.push("Cash generation lags reported earnings — review working capital and one-offs.");

  for (const fl of d.flags) {
    if (fl === "LIQUIDITY_RISK") risks.push("Short-term liquidity may constrain operations or refinancing flexibility.");
    if (fl === "HIGH_LEVERAGE") risks.push("High leverage amplifies sensitivity to rates, margins, and covenant tests.");
    if (fl === "DECLINING_REVENUE") risks.push("Top-line pressure can compress multiples and strategic optionality.");
    if (fl === "THIN_MARGINS") risks.push("Thin margins leave little buffer for cost shocks or competitive pricing.");
    if (fl === "WEAK_CASH_CONVERSION") risks.push("Weak cash conversion increases reliance on external funding.");
    if (fl === "HIGH_DEBT_TO_ASSETS") risks.push("Asset-heavy debt stack raises solvency risk in a downturn.");
  }

  const healthRating = clamp(4 + d.score * 0.65 + (r.roe > 12 ? 0.8 : 0) + (r.current_ratio > 1.5 ? 0.5 : 0), 1, 10);

  let recommendation: InsightReport["recommendation"] = "Hold";
  if (healthRating >= 8.2 && d.flags.length === 0) recommendation = "Strong Buy";
  else if (healthRating >= 7 && d.score >= 7) recommendation = "Buy";
  else if (healthRating <= 4 || d.score <= 3) recommendation = "Strong Sell";
  else if (healthRating <= 5.5) recommendation = "Sell";

  const executiveSummary = `${f.company_name} (${f.year}): ${d.verdict}. Health score ${healthRating.toFixed(1)}/10 with ${d.flags.length} structural flag(s). Focus on ${d.flags[0] ?? "margin durability and cash conversion"} relative to ${f.sector ?? "sector"} peers.`;

  const actions = [
    "Stress-test margins ±200 bps and map impact on covenant headroom.",
    "Reconcile OCF to net income and flag non-recurring items.",
    "Compare working capital days vs. top quartile peers.",
  ];

  return {
    executiveSummary,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    risks: risks.slice(0, 5),
    healthRating: Math.round(healthRating * 10) / 10,
    recommendation,
    actions,
  };
}

export function runFullAnalysis(f: CompanyFinancials): FullAnalysis {
  const validation = validateFinancials(f);
  const benchmark = sectorBenchmark(f.sector);
  const ratios = computeRatios(f);
  const decision = evaluateCompany(ratios);
  const deltas = benchmarkDeltas(ratios, benchmark);
  const riskScores = riskFromRatios(ratios, decision);
  const insights = synthesizeInsights(f, ratios, decision, benchmark);

  return {
    financials: f,
    ratios,
    validation,
    decision,
    benchmark,
    benchmarkDeltas: deltas,
    insights,
    riskScores,
  };
}
