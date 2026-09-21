import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
const directory = new URL("../public/images/", import.meta.url);
// Recolor the exact source pixels; preserve every alpha value and all geometry.
const original = await sharp(await fs.readFile(new URL("logo-footer-original.png", directory)))
  .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const palettes = {
  green: { "157,157,156": [21,63,53], "230,0,124": [21,63,53], "243,159,197": [57,115,95], "249,220,235": [141,185,164] },
  light: { "157,157,156": [255,255,255], "230,0,124": [255,255,255], "243,159,197": [141,185,164], "249,220,235": [237,245,240] },
};
for (const [variant, palette] of Object.entries(palettes)) {
  const pixels = Buffer.from(original.data);
  for (let i = 0; i < pixels.length; i += 4) {
    const replacement = palette[Array.from(pixels.subarray(i, i + 3)).join(",")];
    if (replacement) pixels.set(replacement, i);
  }
  await sharp(pixels, { raw: original.info }).png().toFile(fileURLToPath(new URL(`logo-${variant}.png`, directory)));
}
const conversions = {
  "corporate.jpg": ["papeleria.webp", "hero.webp"],
  "editorial.jpg": ["editorial.webp"],
  "packaging.jpg": ["empaques.webp"],
  "invitations.jpg": ["invitaciones.webp"],
  "hero-banner-1.jpg": ["carousel-print.webp"],
  "hero-banner-2.jpg": ["carousel-press.webp"],
  "hero-workshop.jpg": ["carousel-workshop.webp"],
  "color-proof.jpg": ["color-proof.webp"],
};
for (const [source, targets] of Object.entries(conversions)) {
  for (const target of targets) {
    await sharp(await fs.readFile(new URL(source, directory)))
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 83 })
      .toFile(fileURLToPath(new URL(target, directory)));
  }
}
// The official raster is kept untouched. Crop only its existing symbol for the favicon.
const favicon = await sharp(
  await fs.readFile(new URL("logo-green.png", directory)),
)
  .extract({ left: 204, top: 0, width: 146, height: 125 })
  .resize(64, 64, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();
await fs.writeFile(new URL("favicon.png", directory), favicon);
console.log("Prepared 10 optimized photographs, including carousel images, and a symbol favicon.");
