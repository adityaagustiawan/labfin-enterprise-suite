# LabLens IQ — agent playbook

This repo ships a Next.js financial terminal inspired by public demos such as [FinScope](https://finscope-xai.lovable.app/) and [Finlab AI](https://lablab-ai-finance-buddy.lovable.app/). An external monorepo ([labfin-enterprise-suite](https://github.com/adityaagustiawan/labfin-enterprise-suite)) was referenced by the owner but is not vendored here (GitHub API returned 404 — likely private or renamed).

## What “agent” means here

1. **Playwright smoke agent** — automated browser + API checks. Run after substantive UI or engine edits.
2. **Cursor / coding agent** — use this file as the checklist when reviewing PRs or regenerating features.

## Verify commands

```bash
npm install
npm run build
npm run verify:e2e
```

First-time Playwright on a machine:

```bash
npx playwright install chromium
```

`verify:e2e` starts `npx next dev --turbopack -p 4173` (see `playwright.config.ts`) so it does not collide with a dev server on port 3000. Set `CI=1` to always spawn a fresh server.

## Routes to spot-check manually

| Route | Expect |
|-------|--------|
| `/` | Marketing hero + “Launch terminal” |
| `/analyze` | Manual / ticker / compare tabs |
| `/companies` | Table of demo tickers |
| `/companies/AMZN` | FinScope-style overview, risk dials, trends (if `history` present), analyst chat |
| `/compare` | Two-ticker board |
| `/watchlist` | LocalStorage-backed list |
| `/forecast/AMZN` | CAGR stub from `history` |

## API contract

`POST /api/analyze` with `CompanyFinancials` JSON (see `lib/types.ts`). Response must include `riskScores.overallFinancial`, `liquidity`, `leverage`, `solvency`.

## Regression targets

- Changing `runFullAnalysis` or `riskFromRatios` should update Playwright expectations if field names change.
- Recharts panels are client-only; e2e uses real Chromium — good coverage for dynamic imports.
