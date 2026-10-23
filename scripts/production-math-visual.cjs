const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");

const baseUrl = (process.env.CESTUDY_BASE_URL || "https://cestudy.pages.dev").replace(/\/$/, "");
const expectedHost = process.env.EXPECTED_SUPABASE_HOST || "qqmdwltfgpqtcvdbcmto.supabase.co";
const slash = String.fromCharCode(92);
const checks = [];
const runtimeErrors = [];
let injectedRows = 0;
let interceptedResponses = 0;

function check(name, passed, detail) {
  checks.push({ name, passed, detail: detail || "" });
}

async function main() {
  await fs.mkdir("artifacts", { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  // Modify only the HTTP response delivered to this test browser. No production
  // lesson, database row, or publication status is written or changed.
  await page.route("**/rest/v1/subject_lessons**", async (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.hostname !== expectedHost) {
      return route.continue();
    }
    const response = await route.fetch();
    if (!response.ok()) {
      return route.fulfill({ response });
    }
    let rows;
    try {
      rows = await response.json();
    } catch {
      return route.fulfill({ response });
    }
    if (!Array.isArray(rows)) {
      return route.fulfill({ response });
    }

    interceptedResponses += 1;
    const updated = rows.map((row) => {
      if (row.subject_slug !== "basic-algebra" || Number(row.unit_number) !== 7) return row;
      injectedRows += 1;
      const examples = [
        "## Automated browser rendering check",
        "The fraction is " + slash + "frac{2x}{3}.",
        "Nested fraction: " + slash + "frac{2x}{" + slash + "frac{3}{4}}.",
        "Equation: x = " + slash + "frac{2x}{3}.",
      ].join("\n");
      return {
        ...row,
        lesson_markdown: String(row.lesson_markdown || "") + "\n\n" + examples,
      };
    });

    await route.fulfill({ response, json: updated });
  });

  const response = await page.goto(baseUrl + "/study/basic-algebra/7", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  check("Production lesson route returned HTTP 200", Boolean(response && response.status() === 200), "status=" + (response ? response.status() : "no response"));
  await page.getByRole("heading", { name: "Automated browser rendering check" }).waitFor({ state: "visible", timeout: 30000 }).catch(() => null);
  check("Browser received the intercepted live lesson response", interceptedResponses > 0, "intercepted responses=" + interceptedResponses);
  check("The test-only fraction fixture was injected into the browser response", injectedRows === 1, "matching lesson rows=" + injectedRows);

  const lesson = page.locator("article.study-lesson");
  const mathCount = await lesson.locator(".katex").count();
  const fractionCount = await lesson.locator(".katex .mfrac").count();
  const texAnnotations = await lesson.locator('.katex annotation[encoding="application/x-tex"]').allTextContents();
  const expectedBare = texAnnotations.some((item) => item.trim() === slash + "frac{2x}{3}");
  const expectedNested = texAnnotations.some((item) => item.trim() === slash + "frac{2x}{" + slash + "frac{3}{4}}");
  const hasMathErrors = await lesson.locator(".latex-math-error").count() > 0;

  check("Bare fraction is rendered as KaTeX output", expectedBare, "TeX annotations=" + texAnnotations.length);
  check("Nested fraction is rendered as KaTeX output", expectedNested, "TeX annotations=" + texAnnotations.length);
  check("Fraction markup contains stacked numerator/denominator layout", fractionCount >= 4, "fraction nodes=" + fractionCount);
  check("Injected examples contain no LaTeX rendering error", !hasMathErrors, "math error nodes=" + (hasMathErrors ? "present" : "none"));
  check("Rendered examples are visible on the production page", await page.getByText("The fraction is", { exact: false }).isVisible().catch(() => false), "visible in lesson article");
  check("Production lesson rendered mathematical content", mathCount > 0, "KaTeX nodes=" + mathCount);

  await page.screenshot({ path: path.join("artifacts", "production-fraction-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join("artifacts", "production-fraction-mobile.png"), fullPage: true });
  const mobileMetrics = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  check("Fraction examples do not cause mobile horizontal overflow",
    mobileMetrics.document <= mobileMetrics.viewport + 1 && mobileMetrics.body <= mobileMetrics.viewport + 1,
    JSON.stringify(mobileMetrics));

  check("No uncaught browser errors during the visual check", runtimeErrors.length === 0, runtimeErrors.join(" | ") || "none captured");

  const summary = {
    target: baseUrl + "/study/basic-algebra/7",
    note: "Fixture text was injected into the response within this browser run only; production data was not changed.",
    viewportSizes: [{ width: 1440, height: 1000 }, { width: 390, height: 844 }],
    checkCount: checks.length,
    passedCount: checks.filter((item) => item.passed).length,
    failedCount: checks.filter((item) => !item.passed).length,
    checks,
    runtimeErrors,
  };
  await fs.writeFile(path.join("artifacts", "production-fraction-visual-summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  await browser.close();
  if (summary.failedCount > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
