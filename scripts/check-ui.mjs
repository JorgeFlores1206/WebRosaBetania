import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const output = new URL("../test-results/", import.meta.url);
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const failures = [];
const reports = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (error) => failures.push(error.message));
  const routes = [
    "/",
    "/tecnologia",
    "/productos",
    "/impresion",
    "/cotizacion",
    "/contacto",
  ];
  for (const width of [1440, 390, 768, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(base + route);
      await page.locator("h1").waitFor();
      await page.evaluate(() => document.fonts.ready);
      // Trigger deferred images before checking their loaded state and taking full screenshots.
      for (const img of await page.locator("main img").all())
        await img.scrollIntoViewIfNeeded();
      await page.evaluate(async () => {
        await Promise.all(
          Array.from(document.images).map((img) =>
            img.decode().catch(() => {}),
          ),
        );
        window.scrollTo(0, 0);
      });
      assert.equal(
        await page.locator("h1").count(),
        1,
        `${width} ${route}: single h1`,
      );
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        images: Array.from(document.images)
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.src),
        title: document.title,
      }));
      assert.equal(
        state.overflow,
        false,
        `${width} ${route}: horizontal overflow`,
      );
      assert.deepEqual(state.images, [], `${width} ${route}: broken images`);
      assert.match(state.title, /Rosa Betania/);
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: new URL(
            `${width}-${route.slice(1) || "inicio"}.png`,
            output,
          ).pathname.replace(/^\/(\w:)/, "$1"),
          fullPage: true,
        });
      reports.push(`${width}px ${route}: OK`);
      console.log(`${width}px ${route}: OK`);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  const carousel = page.getByRole("region", {
    name: "Galería de impresión y procesos",
  });
  await carousel.getByRole("button", { name: "Siguiente imagen" }).click();
  await expect(carousel.locator("img.is-active")).toHaveAttribute(
    "src",
    /carousel-press\.webp$/,
  );
  assert.match(
    await carousel.locator("img.is-active").getAttribute("alt"),
    /Speedmaster/,
  );
  await carousel.focus();
  await page.keyboard.press("ArrowRight");
  await expect(carousel.locator("img.is-active")).toHaveAttribute(
    "src",
    /empaques\.webp$/,
  );
  await carousel.getByRole("button", { name: "Imagen anterior" }).click();
  await expect(carousel.locator("img.is-active")).toHaveAttribute(
    "src",
    /carousel-press\.webp$/,
  );
  assert.equal(
    await page
      .locator(
        'img[src*="speedmaster.webp"], img[src*="ctp.webp"], img[src*="insumos.webp"]',
      )
      .count(),
    0,
    "Low-resolution images are not rendered",
  );
  reports.push(
    "Home carousel manual controls and removal of low-resolution images OK",
  );
  const menu = page.locator(".menu-toggle");
  await menu.focus();
  await page.keyboard.press("Enter");
  assert.equal(await menu.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Escape");
  assert.equal(await menu.getAttribute("aria-expanded"), "false");
  assert.equal(
    await menu.evaluate((el) => document.activeElement === el),
    true,
  );
  await menu.click();
  await page
    .getByRole("navigation", { name: "Navegación móvil" })
    .getByRole("link", { name: "Productos", exact: true })
    .click();
  assert.equal(new URL(page.url()).pathname, "/productos");
  assert.equal(
    await page
      .getByRole("button", { name: "Abrir menú" })
      .getAttribute("aria-expanded"),
    "false",
  );
  reports.push(
    "Mobile menu: keyboard Enter/Escape, focus return, navigation and close OK",
  );
  for (const [name, id] of [
    ["Papelería", "papeleria"],
    ["Editorial", "editorial"],
    ["Empaques", "empaques"],
    ["Invitaciones", "invitaciones"],
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    assert.equal(await page.locator(".catalog-card").count(), 1);
    assert.equal(new URL(page.url()).searchParams.get("categoria"), id);
    await page.getByRole("link", { name: "Cotizar este producto" }).click();
    assert.equal(await page.locator("#quote-category").inputValue(), id);
    await page.reload();
    assert.equal(await page.locator("#quote-category").inputValue(), id);
    await page.goto(base + "/productos");
  }
  await page.getByRole("button", { name: "Todos", exact: true }).click();
  assert.equal(await page.locator(".catalog-card").count(), 4);
  for (const type of ["offset", "digital"]) {
    await page.goto(base + "/impresion");
    await page.getByRole("link", { name: `Cotizar impresión ${type}` }).click();
    assert.equal(await page.locator("#quote-printType").inputValue(), type);
    await page.reload();
    assert.equal(await page.locator("#quote-printType").inputValue(), type);
  }
  reports.push(
    "All catalog filters and quote links: selections persist after reload OK",
  );
  await page.goto(base + "/cotizacion");
  await page.getByRole("button", { name: "Descargar solicitud" }).click();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 6);
  assert.equal(
    await page
      .locator("#quote-name")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.getByLabel("Nombre", { exact: false }).fill("Ana Pérez");
  await page.getByLabel("Correo electrónico").fill("correo-invalido");
  await page.getByLabel("Teléfono", { exact: false }).fill("70000000");
  await page.locator("#quote-category").selectOption("editorial");
  await page.locator("#quote-quantity").fill("0");
  await page
    .locator("#quote-description")
    .fill("Quiero imprimir una revista de 24 páginas.");
  await page.getByRole("button", { name: "Descargar solicitud" }).click();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 2);
  await page.locator("#quote-email").fill("ana@example.com");
  await page.locator("#quote-quantity").fill("150");
  const requests = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") requests.push(request.url());
  });
  const promise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descargar solicitud" }).click();
  const download = await promise;
  assert.equal(download.suggestedFilename(), "solicitud-rosa-betania.txt");
  const downloaded = await fs.readFile(await download.path(), "utf8");
  assert.match(downloaded, /Nombre: Ana Pérez/);
  assert.match(downloaded, /Cantidad: 150 unidades/);
  assert.match(downloaded, /Este archivo no ha sido enviado/);
  assert.deepEqual(requests, [], "No personal information sent over network");
  await page
    .getByText("Tu solicitud está preparada.", { exact: true })
    .waitFor();
  await page.reload();
  assert.equal(await page.locator("#quote-name").inputValue(), "");
  assert.equal(await page.locator("#quote-category").inputValue(), "editorial");
  reports.push(
    "Validation, focus, actual download content, no submission and no persisted personal fields OK",
  );
  await page.goto(base + "/pagina-inexistente");
  await page.getByRole("link", { name: "Volver al inicio" }).click();
  assert.equal(new URL(page.url()).pathname, "/");
  assert.deepEqual(failures, [], "No browser JavaScript errors");
  reports.push("404 recovery and browser error check OK");
  await fs.writeFile(
    new URL("ui-report.txt", output),
    reports.join("\n") + "\n",
  );
  console.log(reports.join("\n"));
} finally {
  await browser.close();
}
