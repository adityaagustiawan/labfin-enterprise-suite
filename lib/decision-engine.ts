import type { CalculatedRatios, DecisionResult } from "./types";

/**
 * Hybrid scoring: extends blueprint rules with margins, OCF quality, and debt ratio.
 * Max score 10 for clearer mapping to health rating.
 */
export function evaluateCompany(r: CalculatedRatios): DecisionResult {
  let score = 0;
  const flags: string[] = [];
  const maxScore = 10;

  if (r.roe >= 15) score += 2;
  else if (r.roe >= 8) score += 1;
  else flags.push("LOW_ROE");

  if (r.current_ratio >= 2.0) score += 2;
  else if (r.current_ratio >= 1.2) score += 1;
  else flags.push("LIQUIDITY_RISK");

  if (r.debt_to_equity <= 1.0) score += 2;
  else if (r.debt_to_equity <= 2.0) score += 1;
  else flags.push("HIGH_LEVERAGE");

  if (r.revenue_growth_yoy != null) {
    if (r.revenue_growth_yoy > 10) score += 2;
    else if (r.revenue_growth_yoy > 0) score += 1;
    else flags.push("DECLINING_REVENUE");
  } else {
    score += 1;
  }

  if (r.net_profit_margin >= 12) score += 1;
  else if (r.net_profit_margin < 3) flags.push("THIN_MARGINS");

  if (r.ocf_to_net_income != null) {
    if (r.ocf_to_net_income >= 1) score += 1;
    else if (r.ocf_to_net_income < 0.5) flags.push("WEAK_CASH_CONVERSION");
  }

  if (r.debt_ratio > 0.75) flags.push("HIGH_DEBT_TO_ASSETS");

  let verdict: string;
  if (score >= 8) verdict = "HEALTHY GROWTH PROFILE";
  else if (score >= 5) verdict = "STABLE — MONITOR SELECT METRICS";
  else verdict = "ELEVATED RISK — DEEP DIVE RECOMMENDED";

  return { score, maxScore, verdict, flags };
}
