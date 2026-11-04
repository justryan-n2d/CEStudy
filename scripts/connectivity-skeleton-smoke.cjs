const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");

const baseUrl = (process.env.CESTUDY_BASE_URL || "http://127.0.0.1:4174").replace(/\/$/, "");
const syntheticHost = "cestudy-network-skeleton.invalid";
const viewports = [320, 390, 768, 1024, 1440];
const routes = [
  { id: "subject-grid-catalog", path: "/catalog", skeleton: "subject-grid", label: "Loading the subject catalog…", empty: "No subjects found", grids: 1 },
  { id: "year-level", path: "/year/2", skeleton: "year-level", label: "Loading year-level subjects…", empty: "No listed subjects yet", grids: 2 },
  { id: "math-foundations", path: "/math-foundations", skeleton: "subject-grid", label: "Loading math topics…", empty: null, grids: 1 },
  { id: "subject-detail", path: "/subjects/basic-algebra", skeleton: "subject-detail", label: "Loading subject details…", empty: "Subject not found", grids: 0 },
  { id: "study-reader", path: "/study/basic-algebra", skeleton: "study-reader", label: "Loading reviewer…", empty: "Reviewer content is being prepared", grids: 0 },
  { id: "practice-question", path: "/practice/basic-algebra", skeleton: "practice-question", label: "Loading practice…", empty: "Questions coming soon", grids: 0 },
];

const checks = [];
const failures = [];
const runtimeErrors = [];
let activeRoute = "(startup)";
let responseMode = "empty";
let requestGate = null;

function check(name, passed, detail = "") {
  checks.push({ name, passed: Boolean(passed), detail });
  if (!passed) failures.push({ name, detail });
}

function createGate() {
  let release;
  const promise = new Promise((resolve) => { release = resolve; });
  return { promise, release };
}

function corsHeaders(origin) {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET,HEAD,OPTIONS",
    "access-control-allow-headers": "apikey,authorization,x-client-info,content-type,accept-profile,content-profile,prefer,range",
    "access-control-expose-headers": "content-range,content-profile",
    "access-control-max-age": "600",
    "vary": "Origin",
  };
}

async function main() {
  await fs.mkdir("artifacts", { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: "no-preference" });
  const page = await context.newPage();
  const origin = new URL(baseUrl).origin;

  page.on("pageerror", (error) => runtimeErrors.push(activeRoute + ": " + error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(activeRoute + ": console " + message.text());
  });

  await page.route("https://" + syntheticHost + "/rest/v1/**", async (route) => {
    const request = route.request();
    const requestUrl = new URL(request.url());
    const resource = requestUrl.pathname.split("/").filter(Boolean).pop() || "";

    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders(origin), body: "" });
      return;
    }

    const gateForRequest = requestGate;
    if (gateForRequest) await gateForRequest.promise;

    if (responseMode === "catalog-error" && resource === "catalog_subjects") {
      await route.fulfill({
        status: 500,
        headers: { ...corsHeaders(origin), "content-type": "application/json" },
        body: JSON.stringify({ code: "SYNTHETIC_FAILURE", message: "Synthetic browser smoke failure." }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      headers: { ...corsHeaders(origin), "content-type": "application/json", "content-range": "0-0/0" },
      body: "[]",
    });
  });

  try {
    for (const width of viewports) {
      for (const route of routes) {
        activeRoute = route.path + " at " + width + "px";
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ reducedMotion: "no-preference" });
        responseMode = "empty";
        requestGate = createGate();

        let response;
        try {
          response = await page.goto(baseUrl + route.path, { waitUntil: "domcontentloaded", timeout: 30000 });
        } catch (error) {
          check("Direct route navigation succeeds: " + activeRoute, false, String(error));
          requestGate.release();
          requestGate = null;
          continue;
        }

        check("Direct route returns HTTP 200: " + activeRoute,
          Boolean(response && response.status() === 200),
          "status=" + (response ? response.status() : "no response"));

        const region = page.locator('[data-skeleton="' + route.skeleton + '"]').first();
        let visible = false;
        try {
          await region.waitFor({ state: "visible", timeout: 10000 });
          visible = true;
        } catch {
          visible = false;
        }
        check("Mapped skeleton appears while request is held: " + activeRoute, visible);

        if (visible) {
          const structure = await region.evaluate((element) => {
            const status = element.querySelector(":scope > [role='status']");
            const busyVisual = element.querySelector("[aria-busy='true']");
            const shapes = [...element.querySelectorAll(".skeleton-shape")];
            const rect = element.getBoundingClientRect();
            const shapeBounds = shapes.map((shape) => {
              const bounds = shape.getBoundingClientRect();
              return { width: bounds.width, height: bounds.height, left: bounds.left, right: bounds.right };
            });
            return {
              label: status ? status.textContent.trim() : "",
              statusCount: element.querySelectorAll(":scope > [role='status']").length,
              statusOutsideBusy: Boolean(status && !status.closest("[aria-busy='true']")),
              busyCount: element.querySelectorAll("[aria-busy='true']").length,
              decorativeHidden: Boolean(busyVisual && busyVisual.getAttribute("aria-hidden") === "true"),
              shapeCount: shapes.length,
              shapeBounds,
              rootLeft: rect.left,
              rootRight: rect.right,
              documentWidth: document.documentElement.scrollWidth,
              viewportWidth: window.innerWidth,
              gridCount: element.querySelectorAll(".subject-grid").length,
              nestedStatePanel: Boolean(element.querySelector(".state-panel")),
              shimmerName: shapes[0] ? getComputedStyle(shapes[0]).animationName : "",
              shimmerDuration: shapes[0] ? getComputedStyle(shapes[0]).animationDuration : "",
            };
          });

          check("One polite live-region label is exposed outside the busy visual region: " + activeRoute,
            structure.statusCount === 1 && structure.statusOutsideBusy && structure.label === route.label,
            JSON.stringify({ label: structure.label, statusCount: structure.statusCount, outsideBusy: structure.statusOutsideBusy }));
          check("Placeholder geometry is decorative and marked busy: " + activeRoute,
            structure.busyCount === 1 && structure.decorativeHidden && structure.shapeCount >= 5,
            JSON.stringify({ busyCount: structure.busyCount, decorativeHidden: structure.decorativeHidden, shapeCount: structure.shapeCount }));
          check("Placeholder shapes fit their content region: " + activeRoute,
            structure.shapeBounds.every((shape) => shape.width > 0 && shape.height > 0 &&
              shape.left >= structure.rootLeft - 1 && shape.right <= structure.rootRight + 1),
            JSON.stringify({ rootLeft: structure.rootLeft, rootRight: structure.rootRight }));
          check("No page-wide horizontal overflow while loading: " + activeRoute,
            structure.documentWidth <= structure.viewportWidth + 1,
            "document=" + structure.documentWidth + ", viewport=" + structure.viewportWidth);
          check("Skeleton follows the existing grid structure: " + activeRoute,
            structure.gridCount === route.grids,
            "expected=" + route.grids + ", actual=" + structure.gridCount);
          check("Skeleton adds no nested state panel: " + activeRoute, !structure.nestedStatePanel);
          check("Shimmer uses the approved 1.2-second animation: " + activeRoute,
            structure.shimmerName === "ce-study-skeleton-shimmer" &&
              structure.shimmerDuration.split(",").every((duration) => duration.trim() === "1.2s"),
            JSON.stringify({ name: structure.shimmerName, duration: structure.shimmerDuration }));

          let lightBase = "";
          let darkBase = "";
          const themeGroup = page.getByRole("group", { name: "Color theme" });
          for (const themeName of ["Light", "Dark"]) {
            await themeGroup.getByRole("button", { name: themeName }).click();
            await page.waitForFunction(
              (expected) => document.documentElement.dataset.theme === expected,
              themeName.toLowerCase(),
              { timeout: 5000 },
            );
            const metrics = await page.evaluate(() => {
              const root = document.documentElement;
              const shape = document.querySelector("[data-skeleton] .skeleton-shape");
              const style = shape ? getComputedStyle(shape) : null;
              return {
                theme: root.dataset.theme || "",
                base: getComputedStyle(root).getPropertyValue("--ui-skeleton-base").trim(),
                highlight: getComputedStyle(root).getPropertyValue("--ui-skeleton-highlight").trim(),
                shapeColor: style ? style.backgroundColor : "",
                shapeImage: style ? style.backgroundImage : "",
                overflow: root.scrollWidth > window.innerWidth + 1,
              };
            });
            check(themeName + " theme applies to skeleton surfaces: " + activeRoute,
              metrics.theme === themeName.toLowerCase() && Boolean(metrics.base) && Boolean(metrics.highlight) &&
                metrics.shapeColor !== "" && metrics.shapeImage !== "none",
              JSON.stringify(metrics));
            check(themeName + " theme has no page overflow: " + activeRoute, !metrics.overflow, JSON.stringify(metrics));
            if (themeName === "Light") lightBase = metrics.base;
            if (themeName === "Dark") darkBase = metrics.base;

            if (width === 390 || width === 1440) {
              await page.screenshot({
                path: path.join("artifacts", "skeleton-" + route.id + "-" + themeName.toLowerCase() + "-" + width + "px.png"),
                fullPage: true,
              });
            }
          }
          check("Light and Dark skeleton palettes are distinct: " + activeRoute,
            Boolean(lightBase && darkBase && lightBase !== darkBase), JSON.stringify({ lightBase, darkBase }));

          await page.emulateMedia({ reducedMotion: "reduce" });
          const reducedMotion = await page.locator('[data-skeleton="' + route.skeleton + '"] .skeleton-shape').first().evaluate((shape) => {
            const style = getComputedStyle(shape);
            return { animationName: style.animationName, backgroundImage: style.backgroundImage };
          });
          check("Reduced motion disables shimmer but retains static shapes: " + activeRoute,
            reducedMotion.animationName === "none" && reducedMotion.backgroundImage === "none",
            JSON.stringify(reducedMotion));
          await page.emulateMedia({ reducedMotion: "no-preference" });

          if (route.id === "subject-grid-catalog" && width === 390) {
            await context.setOffline(true);
            const offlineVisible = await page.locator(".connection-status-notice").isVisible().catch(() => false);
            const offlineText = await page.locator(".connection-status-notice").textContent().catch(() => "");
            check("Browser offline event shows the global notice", offlineVisible && /You're offline/.test(offlineText || ""), offlineText || "");
            await context.setOffline(false);
            await page.locator(".connection-status-notice").waitFor({ state: "detached", timeout: 5000 });
            check("Browser online event removes the notice without reload",
              await page.locator(".connection-status-notice").count() === 0);
          }
        }

        requestGate.release();
        requestGate = null;
        try {
          await region.waitFor({ state: "detached", timeout: 10000 });
        } catch {
          check("Skeleton disappears after synthetic request resolves: " + activeRoute, false);
        }
        if (route.empty) {
          check("Existing empty state appears after the request resolves: " + activeRoute,
            await page.getByRole("heading", { name: route.empty }).isVisible().catch(() => false), route.empty);
        }
        check("No skeleton remains after resolution: " + activeRoute,
          await page.locator("[data-skeleton]").count() === 0);
      }
    }

    activeRoute = "online browser with a failing service request";
    responseMode = "catalog-error";
    requestGate = null;
    await context.setOffline(false);
    await page.goto(baseUrl + "/catalog", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.getByRole("alert").waitFor({ state: "visible", timeout: 10000 });
    check("Service failure remains page-specific while browser is online",
      await page.getByRole("alert").textContent().then((value) => /Catalog unavailable/.test(value || "")));
    check("Service failure does not display the global offline notice while browser is online",
      await page.locator(".connection-status-notice").count() === 0);
    check("Browser reports online in the service-error case",
      await page.evaluate(() => navigator.onLine === true));

  } catch (error) {
    failures.push({ name: "Unexpected smoke-script exception", detail: String(error) });
  } finally {
    if (requestGate) requestGate.release();
    await page.unrouteAll({ behavior: "wait" });
    await context.close();
    await browser.close();
  }

  const summary = {
    checkCount: checks.length,
    passedCount: checks.filter((item) => item.passed).length,
    failedCount: failures.length,
    failures,
    runtimeErrors,
    checks,
  };
  await fs.writeFile(path.join("artifacts", "connectivity-skeleton-summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length || runtimeErrors.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
