const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");

const baseUrl = (process.env.CESTUDY_BASE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const viewports = [320, 390, 768, 1024, 1440];
const routes = [
  "/",
  "/catalog",
  "/years",
  "/year/2",
  "/math-foundations",
  "/subjects/basic-algebra",
  "/study/basic-algebra",
  "/practice/basic-algebra",
  "/progress",
  "/privacy",
  "/review-materials",
  "/mock-exam-portal",
  "/community",
];
const checks = [];
const failures = [];
const runtimeErrors = [];
let activeRoute = "(startup)";

function check(name, passed, detail = "") {
  checks.push({ name, passed, detail });
  if (!passed) failures.push({ name, detail });
}

function luminance(color) {
  const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!channels || channels.length !== 3) return null;
  const linear = channels.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const fg = luminance(foreground);
  const bg = luminance(background);
  if (fg === null || bg === null) return 0;
  const values = [fg, bg].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

async function main() {
  await fs.mkdir("artifacts", { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on("pageerror", (error) => runtimeErrors.push(activeRoute + ": " + error.message));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(activeRoute + ": console " + message.text());
    });

    for (const width of viewports) {
      await page.setViewportSize({ width, height: 900 });

      for (const route of routes) {
        activeRoute = route + " at " + width + "px";
        try {
          const response = await page.goto(baseUrl + route, {
            waitUntil: "domcontentloaded",
            timeout: 30000,
          });
          check("Direct route returns HTTP 200: " + activeRoute,
            Boolean(response && response.status() === 200),
            "status=" + (response?.status() ?? "no response"));

          await page.locator("h1").first().waitFor({ state: "visible", timeout: 12000 });

          const themeGroup = page.getByRole("group", { name: "Color theme" });
          check("Theme selector is visible: " + activeRoute, await themeGroup.isVisible().catch(() => false));
          if (!(await themeGroup.isVisible().catch(() => false))) continue;

          const darkButton = themeGroup.getByRole("button", { name: "Dark" });
          await darkButton.click();
          const dark = await page.evaluate(() => {
            const selected = document.querySelector(".theme-toggle-option.is-selected");
            const selectedStyle = selected ? getComputedStyle(selected) : null;
            return {
              theme: document.documentElement.dataset.theme || "",
              colorScheme: getComputedStyle(document.documentElement).colorScheme,
              bodyBackground: getComputedStyle(document.body).backgroundColor,
              viewportWidth: window.innerWidth,
              documentWidth: document.documentElement.scrollWidth,
              bodyWidth: document.body.scrollWidth,
              selectedLabel: selected?.getAttribute("aria-label") || "",
              selectedPressed: selected?.getAttribute("aria-pressed") || "",
              selectedText: selectedStyle?.color || "",
              selectedBackground: selectedStyle?.backgroundColor || "",
              headingText: getComputedStyle(document.querySelector("h1")).color,
              bodyText: getComputedStyle(document.querySelector(".page-intro > p") || document.querySelector(".hero-copy > p") || document.querySelector("main p")).color,
              bodyBackgroundForText: getComputedStyle(document.body).backgroundColor,
            };
          });

          check("Dark theme applies to document: " + activeRoute,
            dark.theme === "dark" && dark.colorScheme === "dark",
            JSON.stringify({ theme: dark.theme, colorScheme: dark.colorScheme }));
          check("Dark page background uses semantic token: " + activeRoute,
            dark.bodyBackground === "rgb(11, 20, 33)", dark.bodyBackground);
          const darkSurfaces = await page.evaluate(() => {
            const selectors = [
              ".subject-card", ".year-card", ".filters-panel", ".detail-hero",
              ".detail-panel", ".study-lesson", ".review-gate", ".state-panel",
              ".privacy-content > section", ".surface-form", ".answer-option",
              ".answer-feedback",
            ];
            return selectors.flatMap((selector) =>
              [...document.querySelectorAll(selector)].slice(0, 3).map((node) => ({
                selector,
                background: getComputedStyle(node).backgroundColor,
                text: getComputedStyle(node).color,
              })),
            );
          });
          const whiteSurfaces = darkSurfaces.filter((surface) => surface.background === "rgb(255, 255, 255)");
          check("Detected content surfaces avoid white-on-dark mismatches: " + activeRoute,
            whiteSurfaces.length === 0,
            JSON.stringify({ surfaces: darkSurfaces, whiteSurfaces }));
          check("Dark toggle state is explicit: " + activeRoute,
            dark.selectedLabel === "Dark" && dark.selectedPressed === "true",
            JSON.stringify({ label: dark.selectedLabel, pressed: dark.selectedPressed }));
          check("Selected Dark control contrast meets WCAG AA: " + activeRoute,
            contrastRatio(dark.selectedText, dark.selectedBackground) >= 4.5,
            JSON.stringify({ foreground: dark.selectedText, background: dark.selectedBackground,
              ratio: contrastRatio(dark.selectedText, dark.selectedBackground) }));
          check("Dark page heading contrast is readable: " + activeRoute,
            contrastRatio(dark.headingText, dark.bodyBackgroundForText) >= 3,
            JSON.stringify({ foreground: dark.headingText, background: dark.bodyBackgroundForText,
              ratio: contrastRatio(dark.headingText, dark.bodyBackgroundForText) }));
          check("Dark introductory/body text contrast meets WCAG AA: " + activeRoute,
            contrastRatio(dark.bodyText, dark.bodyBackgroundForText) >= 4.5,
            JSON.stringify({ foreground: dark.bodyText, background: dark.bodyBackgroundForText,
              ratio: contrastRatio(dark.bodyText, dark.bodyBackgroundForText) }));
          check("No page-wide horizontal overflow in Dark: " + activeRoute,
            Math.max(dark.documentWidth, dark.bodyWidth) <= dark.viewportWidth + 1,
            "viewport=" + dark.viewportWidth + ", document=" + dark.documentWidth + ", body=" + dark.bodyWidth);

          const lightButton = themeGroup.getByRole("button", { name: "Light" });
          await lightButton.click();
          const light = await page.evaluate(() => {
            const selected = document.querySelector(".theme-toggle-option.is-selected");
            const selectedStyle = selected ? getComputedStyle(selected) : null;
            return {
              theme: document.documentElement.dataset.theme || "",
              colorScheme: getComputedStyle(document.documentElement).colorScheme,
              bodyBackground: getComputedStyle(document.body).backgroundColor,
              viewportWidth: window.innerWidth,
              documentWidth: document.documentElement.scrollWidth,
              bodyWidth: document.body.scrollWidth,
              selectedLabel: selected?.getAttribute("aria-label") || "",
              selectedPressed: selected?.getAttribute("aria-pressed") || "",
              selectedText: selectedStyle?.color || "",
              selectedBackground: selectedStyle?.backgroundColor || "",
              headingText: getComputedStyle(document.querySelector("h1")).color,
              bodyText: getComputedStyle(document.querySelector(".page-intro > p") || document.querySelector(".hero-copy > p") || document.querySelector("main p")).color,
              bodyBackgroundForText: getComputedStyle(document.body).backgroundColor,
            };
          });

          check("Light theme remains the reversible default: " + activeRoute,
            light.theme === "light" && light.colorScheme === "light",
            JSON.stringify({ theme: light.theme, colorScheme: light.colorScheme }));
          check("Light page background is white: " + activeRoute,
            light.bodyBackground === "rgb(255, 255, 255)", light.bodyBackground);
          check("Light toggle state is explicit: " + activeRoute,
            light.selectedLabel === "Light" && light.selectedPressed === "true",
            JSON.stringify({ label: light.selectedLabel, pressed: light.selectedPressed }));
          check("Selected Light control contrast meets WCAG AA: " + activeRoute,
            contrastRatio(light.selectedText, light.selectedBackground) >= 4.5,
            JSON.stringify({ foreground: light.selectedText, background: light.selectedBackground,
              ratio: contrastRatio(light.selectedText, light.selectedBackground) }));
          check("Light page heading contrast is readable: " + activeRoute,
            contrastRatio(light.headingText, light.bodyBackgroundForText) >= 3,
            JSON.stringify({ foreground: light.headingText, background: light.bodyBackgroundForText,
              ratio: contrastRatio(light.headingText, light.bodyBackgroundForText) }));
          check("Light introductory/body text contrast meets WCAG AA: " + activeRoute,
            contrastRatio(light.bodyText, light.bodyBackgroundForText) >= 4.5,
            JSON.stringify({ foreground: light.bodyText, background: light.bodyBackgroundForText,
              ratio: contrastRatio(light.bodyText, light.bodyBackgroundForText) }));
          check("No page-wide horizontal overflow in Light: " + activeRoute,
            Math.max(light.documentWidth, light.bodyWidth) <= light.viewportWidth + 1,
            "viewport=" + light.viewportWidth + ", document=" + light.documentWidth + ", body=" + light.bodyWidth);
        } catch (error) {
          check("Browser route/theme check: " + activeRoute, false, error.message);
          try {
            const name = route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
            await page.screenshot({
              path: path.join("artifacts", "theme-failure-" + width + "px-" + name + ".png"),
              fullPage: true,
            });
          } catch {}
        }
      }
    }

    const summary = {
      baseUrl,
      viewports,
      routes,
      checkCount: checks.length,
      passedCount: checks.filter((item) => item.passed).length,
      failedCount: failures.length,
      checks,
      failures,
      runtimeErrors,
    };
    await fs.writeFile(path.join("artifacts", "theme-smoke-summary.json"), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary, null, 2));
    if (failures.length || runtimeErrors.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
