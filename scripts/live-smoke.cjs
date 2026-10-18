const fs = require("node:fs/promises");
const path = require("node:path");
const playwrightModulePath = process.env.PLAYWRIGHT_MODULE_PATH || "playwright";
const { chromium } = require(playwrightModulePath);

const baseUrl = (process.env.CESTUDY_BASE_URL || "https://cestudy.pages.dev").replace(/\/$/, "");
const expectedSupabaseHost = process.env.EXPECTED_SUPABASE_HOST || "qqmdwltfgpqtcvdbcmto.supabase.co";
const expectedPublishedCount = Number(process.env.EXPECTED_PUBLISHED_QUESTION_COUNT || "0");
const checks = [];
const failures = [];
const runtimeErrors = [];
const apiResponses = [];
let activeRoute = "(startup)";

function check(name, passed, detail = "") {
  checks.push({ name, passed, detail });
  if (!passed) failures.push({ name, detail });
}

function recordApiResponse(kind, response) {
  const request = response.request();
  const url = new URL(response.url());
  const headers = request.headers();
  const key = headers.apikey || "";
  apiResponses.push({
    kind,
    host: url.host,
    pathname: url.pathname,
    status: response.status(),
    filterStatus: url.searchParams.get("status"),
    apikeyIsPublishable: key.startsWith("sb_publishable_"),
    apikeyIsPrivileged: key.startsWith("sb_secret_") ||
      (key.startsWith("eyJ") && key.toLowerCase().includes("service_role")),
    bodyPromise: response.json().catch(() => null),
  });
}

async function main() {
  await fs.mkdir("artifacts", { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push("console error at " + activeRoute + ": " + message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push("page error at " + activeRoute + ": " + error.message));
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText || "request failed";
    if (!failure.includes("ERR_ABORTED")) {
      const url = new URL(request.url());
      runtimeErrors.push("request failed at " + activeRoute + ": " + request.method() + " " + url.host + url.pathname + " (" + failure + ")");
    }
  });
  page.on("response", (response) => {
    let url;
    try { url = new URL(response.url()); } catch { return; }
    if (url.hostname.endsWith(".supabase.co") && url.pathname.startsWith("/rest/v1/catalog_subjects")) {
      recordApiResponse("catalog", response);
    }
    if (url.hostname.endsWith(".supabase.co") && url.pathname.startsWith("/rest/v1/practice_questions")) {
      recordApiResponse("practice", response);
    }
    if (url.hostname === new URL(baseUrl).hostname && response.status() >= 400) {
      runtimeErrors.push("same-origin HTTP " + response.status() + " at " + activeRoute + ": " + url.pathname);
    }
  });

  const routes = [
    { path: "/", heading: /Build your CE foundation\./ },
    { path: "/catalog", heading: /Subject catalog/ },
    { path: "/years", heading: /Year levels/ },
    { path: "/year/2", heading: /Second year/ },
    { path: "/math-foundations", heading: /Math foundations/ },
    { path: "/subjects/basic-algebra", heading: /Algebra Foundations/ },
    { path: "/practice/basic-algebra", heading: /Algebra Foundations practice/ },
    { path: "/study/basic-algebra", heading: /Algebra Foundations/ },
    { path: "/contact", heading: /Contact CEStudy/ },
    { path: "/support", heading: /Support CEStudy/ },
    { path: "/bug-reports", heading: /Report a bug/ },
    { path: "/feedback", heading: /Feedback/ },
  ];

  let lastResponse;
  for (const route of routes) {
    activeRoute = route.path;
    try {
      lastResponse = await page.goto(baseUrl + route.path, { waitUntil: "networkidle", timeout: 45000 });
      check("Direct route returns HTTP 200: " + route.path, Boolean(lastResponse && lastResponse.status() === 200), "status=" + (lastResponse?.status() ?? "no response"));
      await page.locator("h1").first().waitFor({ state: "visible", timeout: 15000 });
      const heading = (await page.locator("h1").first().innerText()).trim();
      check("Expected page heading: " + route.path, route.heading.test(heading), "heading=" + heading);
      if (route.path === "/") {
        const heroImage = page.locator(".hero-visual img").first();
        const heroImageLoaded = await heroImage.evaluate((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0).catch(() => false);
        check("Homepage hero image loaded from the configured source", heroImageLoaded, heroImageLoaded ? "image decoded" : "hero image failed to load");
        const csp = (await lastResponse?.allHeaders())?.["content-security-policy"] || "";
        check("CSP allows the approved Unsplash image host", csp.includes("https://images.unsplash.com"), csp.includes("https://images.unsplash.com") ? "image host allowed" : "image host missing from CSP");
      }
      const alerts = await page.locator('[role="alert"]').count();
      check("No application alert/error on " + route.path, alerts === 0, "alertCount=" + alerts);

      const headers = lastResponse ? await lastResponse.allHeaders() : {};
      const expectedHeaders = [
        ["Content-Security-Policy", "content-security-policy"],
        ["X-Content-Type-Options", "x-content-type-options"],
        ["X-Frame-Options", "x-frame-options"],
        ["Referrer-Policy", "referrer-policy"],
        ["Permissions-Policy", "permissions-policy"],
      ];
      for (const [label, key] of expectedHeaders) {
        check("Live response header " + label + ": " + route.path, Boolean(headers[key]), headers[key] ? "present" : "missing");
      }
      if (headers["content-security-policy"]) {
        const cspHasHost = headers["content-security-policy"].includes(expectedSupabaseHost);
        check("CSP allows expected Supabase host: " + route.path, cspHasHost, cspHasHost ? "expected host present" : "expected host missing");
      }
    } catch (error) {
      check("Load page: " + route.path, false, error.message);
      try {
        await page.screenshot({ path: path.join("artifacts", "failure-" + route.path.replace(/[^a-z0-9]+/gi, "-") + ".png"), fullPage: true });
      } catch {}
    }
  }


  for (const [label, href] of [
    ["Contact CEStudy", "/contact"],
    ["Support us", "/support"],
    ["Report a bug", "/bug-reports"],
    ["Send feedback", "/feedback"],
  ]) {
    const count = await page.locator(`footer a[href="${href}"]`).count();
    check("Footer link exists: " + label, count === 1, "href=" + href + ", count=" + count);
  }

  for (const width of [320, 1440]) {
    activeRoute = "/catalog at " + width + "px";
    try {
      await page.setViewportSize({ width, height: 900 });
      lastResponse = await page.goto(baseUrl + "/catalog", { waitUntil: "networkidle", timeout: 45000 });
      const metrics = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      const measuredWidth = Math.max(metrics.document, metrics.body);
      check(
        "No horizontal overflow at " + width + "px",
        measuredWidth <= metrics.viewport + 1,
        "viewport=" + metrics.viewport + ", documentWidth=" + metrics.document + ", bodyWidth=" + metrics.body
      );
      await page.screenshot({ path: path.join("artifacts", "catalog-" + width + "px.png"), fullPage: true });
      if (width === 320) {
        await page.goto(baseUrl + "/", { waitUntil: "networkidle", timeout: 45000 });
        const bottomTabs = page.getByRole("navigation", { name: "Quick navigation" });
        check("Mobile quick navigation is visible at 320px", await bottomTabs.isVisible().catch(() => false), "viewport=320");
        check("Mobile navigation has four destinations", await bottomTabs.locator("a").count() === 4, "expected=4 tabs");
        await page.getByRole("button", { name: "Open more pages menu" }).click();
        const helpMenu = page.getByRole("navigation", { name: "More CEStudy pages" });
        check("More menu opens by tap", await helpMenu.isVisible().catch(() => false), "menu opened");
        check("More menu includes support and feedback", await helpMenu.getByRole("link", { name: "Support us" }).count() === 1 && await helpMenu.getByRole("link", { name: "Send feedback" }).count() === 1, "routes present");
      }
    } catch (error) {
      check("Responsive check at " + width + "px", false, error.message);
    }
  }

  const catalog = apiResponses.filter((item) => item.kind === "catalog");
  check("Browser made a live catalog API request", catalog.length > 0, "responses=" + catalog.length);
  check(
    "Catalog API uses the dedicated CEStudy host",
    catalog.length > 0 && catalog.every((item) => item.host === expectedSupabaseHost),
    "hosts=" + ([...new Set(catalog.map((item) => item.host))].join(",") || "none")
  );
  check(
    "Catalog API uses only a publishable key",
    catalog.length > 0 && catalog.every((item) => item.apikeyIsPublishable && !item.apikeyIsPrivileged),
    "key contents are not logged"
  );
  check(
    "Catalog API responses return HTTP 200",
    catalog.length > 0 && catalog.every((item) => item.status === 200),
    "statuses=" + (catalog.map((item) => item.status).join(",") || "none")
  );

  let catalogRowsConfirmed = false;
  for (const item of catalog) {
    if (item.status !== 200) continue;
    try {
      const body = await item.bodyPromise;
      if (Array.isArray(body) && body.length === 72) catalogRowsConfirmed = true;
    } catch {}
  }
  check("Live API returns all 72 catalog subjects", catalogRowsConfirmed, catalogRowsConfirmed ? "72 rows received" : "could not confirm 72 returned rows");

  const practice = apiResponses.filter((item) => item.kind === "practice");
  check("Practice page made a live API request", practice.length > 0, "responses=" + practice.length);
  check(
    "Practice API query filters status to published",
    practice.length > 0 && practice.every((item) => item.filterStatus === "eq.published"),
    "status filter checked"
  );
  check(
    "Practice API uses the dedicated host and only a publishable key",
    practice.length > 0 && practice.every((item) => item.host === expectedSupabaseHost && item.apikeyIsPublishable && !item.apikeyIsPrivileged),
    "key contents are not logged"
  );

  const practiceCounts = [];
  for (const item of practice) {
    if (item.status !== 200) {
      practiceCounts.push(null);
      continue;
    }
    try {
      const body = await item.bodyPromise;
      practiceCounts.push(Array.isArray(body) ? body.length : null);
    } catch {
      practiceCounts.push(null);
    }
  }
  check(
    "Practice API returns expected published count (" + expectedPublishedCount + ")",
    practiceCounts.length > 0 && practiceCounts.every((count) => count === expectedPublishedCount),
    "returnedCounts=" + (practiceCounts.join(",") || "none")
  );

  activeRoute = "/practice/basic-algebra";
  await page.goto(baseUrl + "/practice/basic-algebra", { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
  const practiceText = await page.locator("body").innerText().catch(() => "");
  if (expectedPublishedCount === 0) {
    check(
      "Practice page shows empty state and no seed draft prompt",
      practiceText.includes("Questions coming soon") && !practiceText.includes("Solve for x: 3x + 5 = 20."),
      "draft prompt absent from rendered page"
    );
  }

  activeRoute = "CHED source link";
  try {
    await page.goto(baseUrl + "/catalog", { waitUntil: "networkidle", timeout: 45000 });
    const link = page.locator('a[href*="CMO-92-s.-2017-BS-Civil-Engineering.pdf"]').first();
    const href = await link.getAttribute("href");
    check(
      "Rendered catalog links to official CHED CMO 92 PDF",
      href === "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
      href || "link missing"
    );
    if (href) {
      const pdf = await context.request.get(href, { timeout: 45000 });
      const contentType = pdf.headers()["content-type"] || "";
      const bytes = await pdf.body();
      check("CHED PDF returns HTTP 200", pdf.status() === 200, "status=" + pdf.status());
      const validPdf = contentType.toLowerCase().includes("pdf") && bytes.subarray(0, 5).toString() === "%PDF-";
      check("CHED source response is a PDF", validPdf, "contentType=" + contentType);
    }
  } catch (error) {
    check("CHED source-link verification", false, error.message);
  }

  check(
    "No browser console, page, request, or same-origin HTTP errors",
    runtimeErrors.length === 0,
    runtimeErrors.join(" | ") || "none captured"
  );

  const apiSummary = apiResponses.map((item) => ({
    kind: item.kind,
    host: item.host,
    pathname: item.pathname,
    status: item.status,
    filterStatus: item.filterStatus,
    apikeyIsPublishable: item.apikeyIsPublishable,
    apikeyIsPrivileged: item.apikeyIsPrivileged,
  }));
  const summary = {
    baseUrl,
    checkedViewports: [320, 1440],
    expectedSupabaseHost,
    checkCount: checks.length,
    passedCount: checks.filter((item) => item.passed).length,
    failedCount: failures.length,
    checks,
    failures,
    apiSummary,
    runtimeErrors,
  };
  await fs.writeFile(path.join("artifacts", "live-smoke-summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  await browser.close();
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
