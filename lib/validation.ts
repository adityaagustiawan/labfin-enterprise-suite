import type { BenchmarkPack, CompanyFinancials, ValidationIssue } from "./types";

const CURRENT_YEAR = new Date().getFullYear();

export function validateFinancials(f: CompanyFinancials): {
  issues: ValidationIssue[];
  isValid: boolean;
} {
  const issues: ValidationIssue[] = [];

  const num = (v: unknown) => typeof v === "number" && Number.isFinite(v);

  if (!f.company_name?.trim()) {
    issues.push({
      code: "NAME",
      message: "Company name is required.",
      severity: "error",
    });
  }

  if (f.year < 1990 || f.year > CURRENT_YEAR) {
    issues.push({
      code: "YEAR",
      message: `Fiscal year must be between 1990 and ${CURRENT_YEAR}.`,
      severity: "error",
    });
  }

  const { income_statement: i, balance_sheet: b, cash_flow: c } = f;

  const requiredPairs: [string, number | undefined][] = [
    ["Revenue", i.revenue],
    ["Cost of goods sold", i.cost_of_goods_sold],
    ["Gross profit", i.gross_profit],
    ["Operating expense", i.operating_expense],
    ["Net income", i.net_income],
    ["Total assets", b.total_assets],
    ["Total liabilities", b.total_liabilities],
    ["Total equity", b.total_equity],
    ["Current assets", b.current_assets],
    ["Current liabilities", b.current_liabilities],
    ["Operating cash flow", c.operating_cash_flow],
    ["Investing cash flow", c.investing_cash_flow],
    ["Financing cash flow", c.financing_cash_flow],
  ];

  for (const [label, v] of requiredPairs) {
    if (!num(v)) {
      issues.push({
        code: "MISSING",
        message: `${label} must be a finite number.`,
        severity: "error",
      });
    } else if ((v as number) < 0 && label === "Revenue") {
      issues.push({
        code: "NEGATIVE_REVENUE",
        message: "Negative revenue is unusual — confirm sign convention.",
        severity: "warning",
      });
    }
  }

  if (
    num(b.total_assets) &&
    num(b.total_liabilities) &&
    num(b.total_equity) &&
    b.total_equity > 0
  ) {
    const implied = b.total_liabilities + b.total_equity;
    const gap = Math.abs(b.total_assets - implied) / Math.max(b.total_assets, 1);
    if (gap > 0.05) {
      issues.push({
        code: "BALANCE_SHEET_IDENTITY",
        message:
          "Assets differ from Liabilities + Equity by more than 5%. Check inputs or consolidation scope.",
        severity: "warning",
      });
    }
  }

  if (num(b.total_assets) && num(b.total_liabilities) && b.total_liabilities > b.total_assets) {
    issues.push({
      code: "INSOLVENCY_HINT",
      message: "Liabilities exceed total assets — potential distress signal.",
      severity: "warning",
    });
  }

  if (num(b.current_liabilities) && b.current_liabilities === 0) {
    issues.push({
      code: "CR_DIV_ZERO",
      message: "Current liabilities are zero — current ratio undefined; use realistic figures.",
      severity: "error",
    });
  }

  if (num(b.total_equity) && b.total_equity <= 0) {
    issues.push({
      code: "NEGATIVE_EQUITY",
      message: "Non-positive equity — ROE and D/E are not economically meaningful.",
      severity: "warning",
    });
  }

  if (num(i.revenue) && i.revenue === 0) {
    issues.push({
      code: "ZERO_REVENUE",
      message: "Revenue is zero — margin ratios cannot be interpreted.",
      severity: "error",
    });
  }

  const hasErrors = issues.some((x) => x.severity === "error");
  return { issues, isValid: !hasErrors };
}

export function sectorBenchmark(sector?: string): BenchmarkPack {
  const s = (sector ?? "general").toLowerCase();
  if (s.includes("tech") || s.includes("software")) {
    return {
      industry_roe: 18,
      industry_dte: 0.65,
      industry_current_ratio: 2.1,
      industry_npm: 18,
    };
  }
  if (s.includes("bank") || s.includes("finance")) {
    return {
      industry_roe: 11,
      industry_dte: 8,
      industry_current_ratio: 1.05,
      industry_npm: 22,
    };
  }
  if (s.includes("retail") || s.includes("consumer")) {
    return {
      industry_roe: 14,
      industry_dte: 1.2,
      industry_current_ratio: 1.35,
      industry_npm: 4,
    };
  }
  return {
    industry_roe: 13,
    industry_dte: 1.0,
    industry_current_ratio: 1.5,
    industry_npm: 10,
  };
}
