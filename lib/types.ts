export type FinancialSource = "manual" | "pdf" | "ticker";

export interface IncomeStatement {
  revenue: number;
  cost_of_goods_sold: number;
  gross_profit: number;
  operating_expense: number;
  net_income: number;
}

export interface BalanceSheet {
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  current_assets: number;
  current_liabilities: number;
  inventory?: number;
}

export interface CashFlow {
  operating_cash_flow: number;
  investing_cash_flow: number;
  financing_cash_flow: number;
}

/** Optional multi-year points for terminal-style trend charts (FinScope-style). */
export interface FiscalHistoryPoint {
  year: number;
  revenue: number;
  net_income: number;
  operating_cash_flow: number;
  total_liabilities: number;
}

export interface CompanyFinancials {
  source: FinancialSource;
  company_name: string;
  ticker?: string;
  sector?: string;
  year: number;
  quarter?: number | null;
  prior_year_revenue?: number | null;
  /** When present, company detail shows revenue / OCF / debt trend charts. */
  history?: FiscalHistoryPoint[];
  income_statement: IncomeStatement;
  balance_sheet: BalanceSheet;
  cash_flow: CashFlow;
  /** Optional valuation inputs when ticker/market data exists */
  market_price_per_share?: number | null;
  shares_outstanding?: number | null;
  enterprise_value?: number | null;
  ebitda?: number | null;
}

export interface CalculatedRatios {
  roe: number;
  roa: number;
  net_profit_margin: number;
  gross_profit_margin: number;
  operating_margin: number;
  current_ratio: number;
  quick_ratio: number;
  debt_to_equity: number;
  debt_ratio: number;
  revenue_growth_yoy: number | null;
  ocf_to_net_income: number | null;
  pe_ratio: number | null;
  ev_to_ebitda: number | null;
}

export interface DecisionResult {
  score: number;
  maxScore: number;
  verdict: string;
  flags: string[];
}

export interface BenchmarkPack {
  industry_roe: number;
  industry_dte: number;
  industry_current_ratio: number;
  industry_npm: number;
}

export interface ValidationIssue {
  code: string;
  message: string;
  severity: "error" | "warning";
}

export interface AnalysisPayload {
  financials: CompanyFinancials;
  ratios: CalculatedRatios;
  validation: { issues: ValidationIssue[]; isValid: boolean };
  decision: DecisionResult;
  benchmark: BenchmarkPack;
  benchmarkDeltas: Record<string, number>;
}

export interface InsightReport {
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  healthRating: number;
  recommendation:
    | "Strong Buy"
    | "Buy"
    | "Hold"
    | "Sell"
    | "Strong Sell";
  actions: string[];
}

export interface FullAnalysis extends AnalysisPayload {
  insights: InsightReport;
  /** 0–100 stress scores (FinScope-style: higher = more risk). */
  riskScores: {
    overallFinancial: number;
    liquidity: number;
    leverage: number;
    solvency: number;
  };
}
