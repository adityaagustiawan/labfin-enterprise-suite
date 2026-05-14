import { DEMO_TICKERS } from "./demo-tickers";

export interface CompanyListItem {
  ticker: string;
  name: string;
  sector?: string;
  year: number;
}

export function listDemoCompanies(): CompanyListItem[] {
  return Object.values(DEMO_TICKERS)
    .filter((c) => Boolean(c.ticker))
    .map((c) => ({
      ticker: c.ticker as string,
      name: c.company_name,
      sector: c.sector,
      year: c.year,
    }));
}
