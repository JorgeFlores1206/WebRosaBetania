import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/tecnologia",
      "/productos",
      "/impresion",
      "/cotizacion",
      "/contacto",
    ]) {
      await page.goto(
        (process.env.TEST_BASE_URL || "http://127.0.0.1:5173") + route,
      );
      await page.locator("h1").waitFor();
      const report = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      const violations = report.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      }));
      results.push({ width, route, violations });
      console.log(
        `${width}px ${route}: ${violations.length} accessibility violations`,
      );
    }
  }
  await fs.mkdir("test-results", { recursive: true });
  await fs.writeFile(
    "test-results/accessibility.json",
    JSON.stringify(results, null, 2),
  );
  assert.equal(
    results.flatMap((r) => r.violations).length,
    0,
    "See test-results/accessibility.json",
  );
} finally {
  await browser.close();
}
