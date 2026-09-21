import fs from "node:fs/promises";
const response = await fetch("https://rosabetania.com/");
if (!response.ok) throw new Error(`Official source: ${response.status}`);
const html = await response.text();
const urls = [
  ...new Set(
    (html.match(/(?:https?:)?\/\/[^\s"'<>);}]+/g) || []).filter((url) =>
      /uploads|facebook|mailto|maps/.test(url),
    ),
  ),
];
await fs.mkdir("docs", { recursive: true });
await fs.writeFile(
  "docs/official-resource-urls.txt",
  `Source: https://rosabetania.com/\nChecked: ${new Date().toISOString()}\n\n${urls.join("\n")}\n`,
);
console.log(
  urls
    .filter((url) =>
      /logo|invit|prensa|ctp|insumo|color|corporativa|revistas|adhesivos|facebook/.test(
        url,
      ),
    )
    .join("\n"),
);
