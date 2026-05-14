import type { CalculatedRatios, CompanyFinancials } from "./types";

function safeDiv(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return 0;
  return a / b;
}

export function computeRatios(f: CompanyFinancials): CalculatedRatios {
  const { income_statement: i, balance_sheet: b, cash_flow: c } = f;
  const inv = b.inventory ?? 0;

  const roe = safeDiv(i.net_income, b.total_equity) * 100;
  const roa = safeDiv(i.net_income, b.total_assets) * 100;
  const net_profit_margin = safeDiv(i.net_income, i.revenue) * 100;
  const gross_profit_margin = safeDiv(i.gross_profit, i.revenue) * 100;
  const operating_income = i.gross_profit - i.operating_expense;
  const operating_margin = safeDiv(operating_income, i.revenue) * 100;

  const current_ratio = safeDiv(b.current_assets, b.current_liabilities);
  const quick_ratio = safeDiv(b.current_assets - inv, b.current_liabilities);

  const debt_to_equity = safeDiv(b.total_liabilities, b.total_equity);
  const debt_ratio = safeDiv(b.total_liabilities, b.total_assets);

  let revenue_growth_yoy: number | null = null;
  if (
    typeof f.prior_year_revenue === "number" &&
    Number.isFinite(f.prior_year_revenue) &&
    f.prior_year_revenue > 0
  ) {
    revenue_growth_yoy = ((i.revenue - f.prior_year_revenue) / f.prior_year_revenue) * 100;
  }

  const ocf_to_net_income =
    i.net_income !== 0 ? safeDiv(c.operating_cash_flow, Math.abs(i.net_income)) : null;

  let pe_ratio: number | null = null;
  if (
    f.market_price_per_share &&
    f.shares_outstanding &&
    i.net_income !== 0 &&
    f.shares_outstanding > 0
  ) {
    const eps = i.net_income / f.shares_outstanding;
    if (eps > 0) pe_ratio = f.market_price_per_share / eps;
  }

  let ev_to_ebitda: number | null = null;
  if (f.enterprise_value && f.ebitda && f.ebitda > 0) {
    ev_to_ebitda = f.enterprise_value / f.ebitda;
  }

  return {
    roe,
    roa,
    net_profit_margin,
    gross_profit_margin,
    operating_margin,
    current_ratio,
    quick_ratio,
    debt_to_equity,
    debt_ratio,
    revenue_growth_yoy,
    ocf_to_net_income,
    pe_ratio,
    ev_to_ebitda,
  };
}
