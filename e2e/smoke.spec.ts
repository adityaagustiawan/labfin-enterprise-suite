import { expect, test } from "@playwright/test";
import { loadDemoTicker } from "../lib/demo-tickers";

test.describe("LabLens smoke", () => {
  test("marketing home loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Institutional-grade/i })).toBeVisible();
  });

  test("terminal analyze loads", async ({ page }) => {
    await page.goto("/analyze");
    await expect(page.getByRole("heading", { name: /New analysis/i })).toBeVisible();
  });

  test("companies table lists AMZN", async ({ page }) => {
    await page.goto("/companies");
    await expect(page.getByRole("cell", { name: "AMZN", exact: true })).toBeVisible();
  });

  test("company detail renders Amazon demo", async ({ page }) => {
    await page.goto("/companies/AMZN");
    await expect(page.getByRole("heading", { name: /Amazon/i })).toBeVisible();
    await expect(page.getByText(/Risk analysis/i)).toBeVisible();
  });

  test("POST /api/analyze returns ratios", async ({ request }) => {
    const payload = loadDemoTicker("LLAB");
    expect(payload).toBeTruthy();
    const res = await request.post("/api/analyze", { data: payload });
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.ratios).toBeTruthy();
    expect(typeof json.ratios.roe).toBe("number");
    expect(json.riskScores).toMatchObject({
      overallFinancial: expect.any(Number),
      liquidity: expect.any(Number),
      leverage: expect.any(Number),
      solvency: expect.any(Number),
    });
  });
});
