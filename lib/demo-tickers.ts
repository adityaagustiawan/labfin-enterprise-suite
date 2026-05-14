import type { CompanyFinancials } from "./types";

/** Curated demo fundamentals — no external API keys. Replace with live feed in production. */
export const DEMO_TICKERS: Record<string, CompanyFinancials> = {
  LLAB: {
    source: "ticker",
    company_name: "LabLab AI Holdings (Demo)",
    ticker: "LLAB",
    sector: "Software",
    year: 2025,
    prior_year_revenue: 42_000_000,
    income_statement: {
      revenue: 58_500_000,
      cost_of_goods_sold: 19_200_000,
      gross_profit: 39_300_000,
      operating_expense: 22_100_000,
      net_income: 12_400_000,
    },
    balance_sheet: {
      total_assets: 96_000_000,
      total_liabilities: 28_000_000,
      total_equity: 68_000_000,
      current_assets: 41_000_000,
      current_liabilities: 14_500_000,
      inventory: 1_200_000,
    },
    cash_flow: {
      operating_cash_flow: 15_100_000,
      investing_cash_flow: -9_200_000,
      financing_cash_flow: -2_400_000,
    },
    market_price_per_share: 48,
    shares_outstanding: 22_000_000,
    enterprise_value: 1_050_000_000,
    ebitda: 19_500_000,
  },
  AAPL: {
    source: "ticker",
    company_name: "Apple Inc. (illustrative)",
    ticker: "AAPL",
    sector: "Technology",
    year: 2024,
    prior_year_revenue: 383_285_000_000,
    income_statement: {
      revenue: 391_035_000_000,
      cost_of_goods_sold: 210_352_000_000,
      gross_profit: 180_683_000_000,
      operating_expense: 57_046_000_000,
      net_income: 93_736_000_000,
    },
    balance_sheet: {
      total_assets: 364_980_000_000,
      total_liabilities: 308_030_000_000,
      total_equity: 56_950_000_000,
      current_assets: 143_566_000_000,
      current_liabilities: 133_000_000_000,
      inventory: 7_286_000_000,
    },
    cash_flow: {
      operating_cash_flow: 118_254_000_000,
      investing_cash_flow: -14_000_000_000,
      financing_cash_flow: -121_000_000_000,
    },
  },
  AMZN: {
    source: "ticker",
    company_name: "Amazon.com, Inc. (demo snapshot)",
    ticker: "AMZN",
    sector: "Consumer",
    year: 2025,
    prior_year_revenue: 637_931_000_000,
    history: [
      {
        year: 2022,
        revenue: 513_983_000_000,
        net_income: 11_317_000_000,
        operating_cash_flow: 46_752_000_000,
        total_liabilities: 308_000_000_000,
      },
      {
        year: 2023,
        revenue: 574_785_000_000,
        net_income: 30_425_000_000,
        operating_cash_flow: 84_946_000_000,
        total_liabilities: 355_000_000_000,
      },
      {
        year: 2024,
        revenue: 637_959_000_000,
        net_income: 59_248_000_000,
        operating_cash_flow: 115_877_000_000,
        total_liabilities: 385_000_000_000,
      },
      {
        year: 2025,
        revenue: 716_924_000_000,
        net_income: 77_670_000_000,
        operating_cash_flow: 139_510_000_000,
        total_liabilities: 406_977_000_000,
      },
    ],
    income_statement: {
      revenue: 716_924_000_000,
      cost_of_goods_sold: 356_582_363_400,
      gross_profit: 360_341_636_600,
      operating_expense: 248_000_000_000,
      net_income: 77_670_000_000,
    },
    balance_sheet: {
      total_assets: 818_042_000_000,
      total_liabilities: 406_977_000_000,
      total_equity: 411_065_000_000,
      current_assets: 210_000_000_000,
      current_liabilities: 200_000_000_000,
      inventory: 34_000_000_000,
    },
    cash_flow: {
      operating_cash_flow: 139_510_000_000,
      investing_cash_flow: -55_000_000_000,
      financing_cash_flow: -42_000_000_000,
    },
  },
  MSFT: {
    source: "ticker",
    company_name: "Microsoft Corp. (illustrative)",
    ticker: "MSFT",
    sector: "Software",
    year: 2024,
    prior_year_revenue: 211_915_000_000,
    income_statement: {
      revenue: 245_122_000_000,
      cost_of_goods_sold: 74_654_000_000,
      gross_profit: 170_468_000_000,
      operating_expense: 72_414_000_000,
      net_income: 88_136_000_000,
    },
    balance_sheet: {
      total_assets: 512_000_000_000,
      total_liabilities: 231_000_000_000,
      total_equity: 281_000_000_000,
      current_assets: 155_000_000_000,
      current_liabilities: 95_000_000_000,
      inventory: 3_000_000_000,
    },
    cash_flow: {
      operating_cash_flow: 118_548_000_000,
      investing_cash_flow: -97_622_000_000,
      financing_cash_flow: -43_531_000_000,
    },
  },
};

export function loadDemoTicker(symbol: string): CompanyFinancials | null {
  const key = symbol.trim().toUpperCase();
  return DEMO_TICKERS[key] ?? null;
}
