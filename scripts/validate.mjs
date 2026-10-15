import { chromium } from "/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  permissions: ["clipboard-read", "clipboard-write"]
});
const page = await context.newPage();
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));

await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
await page.getByRole("heading", { name: "Neon Borough FC" }).waitFor();
if (!(await page.getByText("Fictional names").isVisible())) throw new Error("Anonymised-data status banner is missing.");
if (!(await page.getByText("Vesper").first().isVisible())) throw new Error("Real goalscorer data did not render.");

const opponentSelect = page.locator("select").nth(1);
await opponentSelect.selectOption({ label: "Calamity Athletic" });
await page.getByRole("heading", { name: "Calamity Athletic" }).waitFor();
if (!(await page.getByText("Nova").first().isVisible())) throw new Error("Opponent switch did not update scorer threat.");

await page.getByRole("button", { name: /Update data/i }).click();
await page.getByRole("heading", { name: "Import league CSVs" }).waitFor();
const fixturesInput = page.locator('input[type="file"]').nth(1);
await fixturesInput.setInputFiles({
  name: "fixtures.csv",
  mimeType: "text/csv",
  buffer: Buffer.from("date,home_team,away_team\n2026-09-20,Electric Flamingos FC,Calamity Athletic\n")
});
await page.getByText("fixtures.csv · 1 rows").waitFor();
await page.getByRole("button", { name: /Use imported data/i }).click();
await page.locator("select").nth(1).selectOption({ label: "Calamity Athletic" });
await page.getByText(/20 Sep · HOME/i).waitFor();

const copyButton = page.getByRole("button", { name: /Copy team brief/i });
await copyButton.click();
await page.getByRole("button", { name: "Copied" }).waitFor();
const copied = await page.evaluate(() => navigator.clipboard.readText());
if (!copied.includes("PRE-MATCH: Electric Flamingos FC vs Calamity Athletic")) throw new Error("Copied report has the wrong teams.");
if (!copied.includes("Nova leads with 4 goals")) throw new Error("Copied report omits the leading scorer.");

await page.screenshot({ path: "validation-desktop.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
await page.screenshot({ path: "validation-mobile.png", fullPage: true });
if (await page.locator("body").evaluate((el) => el.scrollWidth > window.innerWidth + 1)) throw new Error("Mobile page has horizontal overflow.");
if (errors.length) throw new Error(`Browser errors: ${errors.join(" | ")}`);

console.log(JSON.stringify({
  status: "passed",
  checks: ["real seed data", "opponent switch", "goalscorer update", "fixture CSV import", "fixture context", "report copy", "mobile overflow"],
  report_preview: copied.split("\n").slice(0, 7)
}, null, 2));

await browser.close();
