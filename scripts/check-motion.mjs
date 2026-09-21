import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = [];
const errors = [];
await fs.mkdir("test-results", { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  const settle = async () => {
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document
              .getAnimations()
              .filter(
                (a) => a.playState === "running" || a.playState === "pending",
              ).length,
        ),
      )
      .toBe(0);
  };
  await page.goto(base);
  await page.locator("h1").waitFor();
  assert.notEqual(
    await page
      .locator(".page-stage")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  const carousel = page.locator(".hero-carousel");
  await carousel.getByRole("button", { name: "Siguiente imagen" }).click();
  await expect(carousel.locator("img.is-active")).toHaveAttribute(
    "src",
    /carousel-press/,
  );
  await carousel.getByRole("button", { name: "Siguiente imagen" }).click();
  await carousel.getByRole("button", { name: "Siguiente imagen" }).click();
  await expect(carousel.locator("img.is-active")).toHaveAttribute(
    "src",
    /carousel-print/,
  );
  await settle();
  assert.equal(await carousel.locator('img[aria-hidden="false"]').count(), 1);
  assert.equal(
    await carousel
      .locator("img.is-active")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  const card = page.locator(".product-preview").first();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute("data-motion", "revealed");
  await card.focus();
  assert.equal(await card.evaluate((el) => getComputedStyle(el).opacity), "1");
  report.push(
    "Normal motion: route entry, scroll reveal, focused content and rapid carousel changes OK",
  );

  await page
    .getByRole("navigation", { name: "Navegación principal", exact: true })
    .getByRole("link", { name: "Productos", exact: true })
    .click();
  await expect(page).toHaveURL(/\/productos$/);
  assert.equal(
    await page.locator("#main").evaluate((el) => document.activeElement === el),
    true,
  );
  await page.getByRole("button", { name: "Editorial", exact: true }).click();
  await page.getByRole("link", { name: "Cotizar este producto" }).click();
  await page.locator("#quote-name").fill("Prueba de movimiento");
  await page.locator("#quote-printType").selectOption("digital");
  await expect(page.locator("#quote-name")).toHaveValue("Prueba de movimiento");
  await expect(page.locator("#quote-category")).toHaveValue("editorial");
  await page.goBack();
  await page.goForward();
  await expect(page.locator("#quote-category")).toHaveValue("editorial");
  report.push(
    "Navigation: main focus, browser back/forward and query changes preserve the expected state OK",
  );

  await page.goto(base);
  await page.locator(".product-preview").last().scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await settle();
  assert.equal(
    await page
      .locator(".page-stage")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await carousel.getByRole("button", { name: "Siguiente imagen" }).click();
  await expect(carousel.locator("img.is-active")).toHaveAttribute(
    "src",
    /carousel-press/,
  );
  assert.equal(
    await carousel
      .locator("img.is-active")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
    "0s",
  );
  assert.equal(
    await carousel
      .locator("img.is-active")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  report.push(
    "Reduced motion: live preference changes cancel animations and keep content immediately visible OK",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator("#mobile-navigation")).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("button", { name: "Abrir menú" }),
  ).toHaveAttribute("aria-expanded", "false");

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base);
    const stage = await page.locator(".hero-carousel-stage").boundingBox();
    for (const button of await page
      .locator(".hero-carousel-controls button")
      .all()) {
      const box = await button.boundingBox();
      assert.ok(
        box.width >= 44 && box.height >= 44,
        `${width}: touch control size`,
      );
      assert.ok(
        box.x >= stage.x - 1 && box.x + box.width <= stage.x + stage.width + 1,
        `${width}: controls fit the photo`,
      );
    }
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
  }
  report.push(
    "Responsive controls: 44px targets fit at 320/390/768/1440px; menu closes on desktop resize OK",
  );

  // Real touch events verify swipe without synthetic pointer-capture errors.
  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  const touchPage = await touchContext.newPage();
  touchPage.on("pageerror", (error) => errors.push(error.message));
  await touchPage.goto(base);
  await touchPage.locator(".hero-carousel-stage").scrollIntoViewIfNeeded();
  const photo = await touchPage.locator(".hero-carousel-stage").boundingBox();
  const cdp = await touchContext.newCDPSession(touchPage);
  const y = photo.y + photo.height / 2;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: photo.x + 270, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: photo.x + 190, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: photo.x + 100, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(
    touchPage.locator(".hero-carousel-image.is-active"),
  ).toHaveAttribute("src", /carousel-press/);
  await touchContext.close();
  report.push(
    "Touch: horizontal swipe changes the image without browser errors OK",
  );

  // Keep review artifacts with motion enabled, after the finite transitions settle.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/tecnologia"]) {
      await page.goto(base + route);
      for (const element of await page
        .locator(
          ".section-heading, .product-preview, .feature-equipment, .equipment-secondary article, .quote-banner",
        )
        .all()) {
        await element.scrollIntoViewIfNeeded();
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await settle();
      await page.screenshot({
        path: `test-results/motion-${width}-${route.slice(1) || "inicio"}.png`,
        fullPage: true,
      });
    }
  }
  assert.deepEqual(errors, []);
  await fs.writeFile("test-results/motion-report.txt", report.join("\n"));
  console.log(report.join("\n"));
} finally {
  await browser.close();
}
