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
  "/login",
  "/profile",
  "/history",
  "/streak",
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
              navText: getComputedStyle(window.innerWidth <= 680 ? document.querySelector(".mobile-help-menu a") : document.querySelector(".main-nav .nav-link")).color,
              navBackground: getComputedStyle(window.innerWidth <= 680 ? document.querySelector(".mobile-help-menu") : document.querySelector(".site-header")).backgroundColor,
              yearMenuLinkText: getComputedStyle(document.querySelector("#year-level-navigation .navigation-panel-heading > a")).color,
              yearMenuBackground: getComputedStyle(document.querySelector("#year-level-navigation")).backgroundColor,
              reviewMenuLinkText: getComputedStyle(document.querySelector("#review-materials-navigation .navigation-panel-heading > a")).color,
              reviewMenuBackground: getComputedStyle(document.querySelector("#review-materials-navigation")).backgroundColor,
              reviewCardText: getComputedStyle(document.querySelector(".review-materials-menu-card p")).color,
              reviewCardBackground: getComputedStyle(document.querySelector(".review-materials-menu-card")).backgroundColor,
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
              ".answer-feedback", ".auth-panel", ".login-panel", ".profile-account-card",
              ".history-list-item", ".streak-calendar-card", ".streak-summary-card", ".streak-unlock-dialog", ".year-level-menu-year", ".review-materials-menu-card",
              ".review-materials-page-card",
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
          check("Dark primary navigation text contrast meets WCAG AA: " + activeRoute,
            contrastRatio(dark.navText, dark.navBackground) >= 4.5,
            JSON.stringify({ foreground: dark.navText, background: dark.navBackground,
              ratio: contrastRatio(dark.navText, dark.navBackground) }));
          check("Dark Year Levels menu link contrast meets WCAG AA: " + activeRoute,
            contrastRatio(dark.yearMenuLinkText, dark.yearMenuBackground) >= 4.5,
            JSON.stringify({ foreground: dark.yearMenuLinkText, background: dark.yearMenuBackground,
              ratio: contrastRatio(dark.yearMenuLinkText, dark.yearMenuBackground) }));
          check("Dark Review Materials link contrast meets WCAG AA: " + activeRoute,
            contrastRatio(dark.reviewMenuLinkText, dark.reviewMenuBackground) >= 4.5,
            JSON.stringify({ foreground: dark.reviewMenuLinkText, background: dark.reviewMenuBackground,
              ratio: contrastRatio(dark.reviewMenuLinkText, dark.reviewMenuBackground) }));
          check("Dark Review Materials card text contrast meets WCAG AA: " + activeRoute,
            contrastRatio(dark.reviewCardText, dark.reviewCardBackground) >= 4.5,
            JSON.stringify({ foreground: dark.reviewCardText, background: dark.reviewCardBackground,
              ratio: contrastRatio(dark.reviewCardText, dark.reviewCardBackground) }));
          check("No page-wide horizontal overflow in Dark: " + activeRoute,
            Math.max(dark.documentWidth, dark.bodyWidth) <= dark.viewportWidth + 1,
            "viewport=" + dark.viewportWidth + ", document=" + dark.documentWidth + ", body=" + dark.bodyWidth);

          if (route === "/" && width === 1440) {
            await page.waitForFunction(
              () => window.localStorage.getItem("cestudy:theme:v1") === "dark",
              null,
              { timeout: 5000 },
            ).catch(() => {});
            const storedTheme = await page.evaluate(() => window.localStorage.getItem("cestudy:theme:v1"));
            check("Dark preference is saved locally before refresh: " + activeRoute,
              storedTheme === "dark", String(storedTheme));

            await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
            await page.locator("h1").first().waitFor({ state: "visible", timeout: 12000 });
            const restoredTheme = await page.evaluate(() => ({
              theme: document.documentElement.dataset.theme || "",
              colorScheme: getComputedStyle(document.documentElement).colorScheme,
              themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content") || "",
              storedTheme: window.localStorage.getItem("cestudy:theme:v1"),
              selectedLabel: document.querySelector(".theme-toggle-option.is-selected")?.getAttribute("aria-label") || "",
              selectedPressed: document.querySelector(".theme-toggle-option.is-selected")?.getAttribute("aria-pressed") || "",
            }));
            check("Dark preference restores after browser refresh: " + activeRoute,
              restoredTheme.theme === "dark" &&
                restoredTheme.colorScheme === "dark" &&
                restoredTheme.themeColor === "#0B1421" &&
                restoredTheme.storedTheme === "dark" &&
                restoredTheme.selectedLabel === "Dark" &&
                restoredTheme.selectedPressed === "true",
              JSON.stringify(restoredTheme));
          }

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
              navText: getComputedStyle(window.innerWidth <= 680 ? document.querySelector(".mobile-help-menu a") : document.querySelector(".main-nav .nav-link")).color,
              navBackground: getComputedStyle(window.innerWidth <= 680 ? document.querySelector(".mobile-help-menu") : document.querySelector(".site-header")).backgroundColor,
              yearMenuLinkText: getComputedStyle(document.querySelector("#year-level-navigation .navigation-panel-heading > a")).color,
              yearMenuBackground: getComputedStyle(document.querySelector("#year-level-navigation")).backgroundColor,
              reviewMenuLinkText: getComputedStyle(document.querySelector("#review-materials-navigation .navigation-panel-heading > a")).color,
              reviewMenuBackground: getComputedStyle(document.querySelector("#review-materials-navigation")).backgroundColor,
              reviewCardText: getComputedStyle(document.querySelector(".review-materials-menu-card p")).color,
              reviewCardBackground: getComputedStyle(document.querySelector(".review-materials-menu-card")).backgroundColor,
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
          check("Light primary navigation text contrast meets WCAG AA: " + activeRoute,
            contrastRatio(light.navText, light.navBackground) >= 4.5,
            JSON.stringify({ foreground: light.navText, background: light.navBackground,
              ratio: contrastRatio(light.navText, light.navBackground) }));
          check("Light Year Levels menu link contrast meets WCAG AA: " + activeRoute,
            contrastRatio(light.yearMenuLinkText, light.yearMenuBackground) >= 4.5,
            JSON.stringify({ foreground: light.yearMenuLinkText, background: light.yearMenuBackground,
              ratio: contrastRatio(light.yearMenuLinkText, light.yearMenuBackground) }));
          check("Light Review Materials link contrast meets WCAG AA: " + activeRoute,
            contrastRatio(light.reviewMenuLinkText, light.reviewMenuBackground) >= 4.5,
            JSON.stringify({ foreground: light.reviewMenuLinkText, background: light.reviewMenuBackground,
              ratio: contrastRatio(light.reviewMenuLinkText, light.reviewMenuBackground) }));
          check("Light Review Materials card text contrast meets WCAG AA: " + activeRoute,
            contrastRatio(light.reviewCardText, light.reviewCardBackground) >= 4.5,
            JSON.stringify({ foreground: light.reviewCardText, background: light.reviewCardBackground,
              ratio: contrastRatio(light.reviewCardText, light.reviewCardBackground) }));
          check("No page-wide horizontal overflow in Light: " + activeRoute,
            Math.max(light.documentWidth, light.bodyWidth) <= light.viewportWidth + 1,
            "viewport=" + light.viewportWidth + ", document=" + light.documentWidth + ", body=" + light.bodyWidth);

          if (route === "/" && width === 1440) {
            await page.waitForFunction(
              () => window.localStorage.getItem("cestudy:theme:v1") === "light",
              { timeout: 5000 },
            );
            await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
            await page.locator("h1").first().waitFor({ state: "visible", timeout: 12000 });
            const restoredLight = await page.evaluate(() => ({
              theme: document.documentElement.dataset.theme || "",
              colorScheme: getComputedStyle(document.documentElement).colorScheme,
              bodyBackground: getComputedStyle(document.body).backgroundColor,
              themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content") || "",
              storedTheme: window.localStorage.getItem("cestudy:theme:v1"),
              selectedLabel: document.querySelector(".theme-toggle-option.is-selected")?.getAttribute("aria-label") || "",
              selectedPressed: document.querySelector(".theme-toggle-option.is-selected")?.getAttribute("aria-pressed") || "",
            }));
            check("Light preference restores after browser refresh: " + activeRoute,
              restoredLight.theme === "light" &&
                restoredLight.colorScheme === "light" &&
                restoredLight.bodyBackground === "rgb(255, 255, 255)" &&
                restoredLight.themeColor === "#FFFFFF" &&
                restoredLight.storedTheme === "light" &&
                restoredLight.selectedLabel === "Light" &&
                restoredLight.selectedPressed === "true",
              JSON.stringify(restoredLight));
          }
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

    for (const width of viewports) {
      activeRoute = "hybrid navigation at " + width + "px";
      await page.setViewportSize({ width, height: 900 });
      await page.goto(baseUrl + "/", { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.locator("h1").first().waitFor({ state: "visible", timeout: 12000 });

      const themeTargets = await page.locator(".theme-toggle-option").evaluateAll((nodes) =>
        nodes.map((node) => Math.round(node.getBoundingClientRect().height)),
      );
      check("Theme controls have 44px targets: " + activeRoute,
        themeTargets.length === 2 && themeTargets.every((height) => height >= 44),
        JSON.stringify(themeTargets));

      if (width > 680) {
        const mainNav = page.getByRole("navigation", { name: "Main navigation" });
        const navTargets = await mainNav.locator("a.nav-link, button.nav-dropdown-trigger").evaluateAll((nodes) =>
          nodes.filter((node) => node.getClientRects().length > 0)
            .map((node) => ({ label: node.textContent.trim(), height: Math.round(node.getBoundingClientRect().height) })),
        );
        check("Desktop/tablet navigation controls have 44px targets: " + activeRoute,
          navTargets.length >= 5 && navTargets.every((target) => target.height >= 44),
          JSON.stringify(navTargets));
        if (width > 680 && width <= 850) {
          const tabletGap = await mainNav.evaluate((node) => Number.parseFloat(getComputedStyle(node).columnGap));
          check("Tablet navigation keeps 8px target separation: " + activeRoute, tabletGap >= 8, String(tabletGap));
        }
        if (width > 1100) {
          check("Wide-desktop navigation labels stay on one line: " + activeRoute,
            navTargets.every((target) => target.height <= 48),
            JSON.stringify(navTargets));
        }

        const yearTrigger = mainNav.getByRole("button", { name: "Year Levels" });
        await yearTrigger.click();
        const yearPanel = page.getByRole("region", { name: "Year-level navigation" });
        await yearPanel.waitFor({ state: "visible", timeout: 5000 });
        check("Year Levels menu exposes overview destination: " + activeRoute,
          await yearPanel.getByRole("link", { name: "Browse all year levels" }).isVisible().catch(() => false));
        const yearMenuStateReady = await page.waitForFunction(() => {
          const panel = document.querySelector("#year-level-navigation");
          return Boolean(panel?.querySelector(".year-level-menu-year") || panel?.querySelector(".navigation-panel-error"));
        }, { timeout: 8000 }).then(() => true).catch(() => false);
        check("Year Levels menu reaches a content or recoverable error state: " + activeRoute,
          yearMenuStateReady, yearMenuStateReady ? "" : "Neither catalog entries nor a recovery panel appeared within 8 seconds.");
        if (!yearMenuStateReady) {
          const name = "year-menu-loading-" + width + "px.png";
          await page.screenshot({ path: path.join("artifacts", name), fullPage: true }).catch(() => {});
        }
        const loadedYearSections = await yearPanel.locator(".year-level-menu-year > summary").count();
        if (loadedYearSections > 0) {
          const yearTargets = await yearPanel.locator("a, summary").evaluateAll((nodes) =>
            nodes.filter((node) => node.getClientRects().length > 0)
              .map((node) => ({ label: node.textContent.trim().replace(/\s+/g, " "), height: Math.round(node.getBoundingClientRect().height) })),
          );
          check("Loaded Year Levels menu targets are at least 44px: " + activeRoute,
            yearTargets.length >= 7 && yearTargets.every((target) => target.height >= 44),
            JSON.stringify(yearTargets));
        } else if (yearMenuStateReady) {
          const errorAlert = yearPanel.getByRole("alert");
          check("Year Levels menu provides recovery when catalog data is unavailable: " + activeRoute,
            await errorAlert.isVisible().catch(() => false) &&
              await yearPanel.getByRole("link", { name: "Open Subject Catalog" }).isVisible().catch(() => false));
          const recoveryTargets = await yearPanel.locator("a").evaluateAll((nodes) =>
            nodes.filter((node) => node.getClientRects().length > 0)
              .map((node) => ({ label: node.textContent.trim().replace(/\s+/g, " "), height: Math.round(node.getBoundingClientRect().height) })),
          );
          check("Visible Year Levels recovery links have 44px targets: " + activeRoute,
            recoveryTargets.length >= 3 && recoveryTargets.every((target) => target.height >= 44),
            JSON.stringify(recoveryTargets));
        }
        const yearOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
        check("Year Levels menu does not cause horizontal overflow: " + activeRoute, yearOverflow);
        await page.keyboard.press("Escape");
        check("Escape closes Year Levels and restores focus: " + activeRoute,
          await yearTrigger.getAttribute("aria-expanded") === "false" &&
            await yearTrigger.evaluate((node) => node === document.activeElement));

        const materialsTrigger = mainNav.getByRole("button", { name: "Review Materials Hub" });
        await materialsTrigger.click();
        const materialsPanel = page.getByRole("region", { name: "Review Materials Hub navigation" });
        await materialsPanel.waitFor({ state: "visible", timeout: 5000 });
        const requiredGroups = ["Formula Sheets", "Problem Sets with Solutions", "Video Tutorials"];
        const visibleGroups = await Promise.all(requiredGroups.map((name) =>
          materialsPanel.getByRole("heading", { name }).isVisible().catch(() => false),
        ));
        check("Review Materials menu exposes the three approved categories: " + activeRoute,
          visibleGroups.every(Boolean), JSON.stringify({ requiredGroups, visibleGroups }));
        const materialsTargets = await materialsPanel.locator("a").evaluateAll((nodes) =>
          nodes.filter((node) => node.getClientRects().length > 0)
            .map((node) => ({ label: node.textContent.trim().replace(/\s+/g, " "), height: Math.round(node.getBoundingClientRect().height) })),
        );
        check("Visible Review Materials links have 44px targets: " + activeRoute,
          materialsTargets.length >= 4 && materialsTargets.every((target) => target.height >= 44),
          JSON.stringify(materialsTargets));
        const materialsOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
        check("Review Materials menu does not cause horizontal overflow: " + activeRoute, materialsOverflow);
        await page.keyboard.press("Escape");
        check("Escape closes Review Materials and restores focus: " + activeRoute,
          await materialsTrigger.getAttribute("aria-expanded") === "false" &&
            await materialsTrigger.evaluate((node) => node === document.activeElement));

        await mainNav.getByRole("link", { name: "Subject Catalog" }).click();
        await page.waitForFunction(() => window.location.pathname === "/catalog" && document.activeElement?.id === "main-content");
        check("Route change hands focus to main content: " + activeRoute,
          await page.locator("#main-content").evaluate((node) => node === document.activeElement));
      } else {
        const moreToggle = page.locator(".mobile-menu-toggle");
        const initialToggleLabel = await moreToggle.getAttribute("aria-label");
        check("Mobile More control has its open-state accessible name: " + activeRoute,
          /^Open more pages menu/.test(initialToggleLabel || ""), initialToggleLabel || "missing aria-label");
        const toggleHeight = await moreToggle.evaluate((node) => Math.round(node.getBoundingClientRect().height));
        check("Mobile More control has a 44px target: " + activeRoute, toggleHeight >= 44, String(toggleHeight));
        await moreToggle.click();
        const moreMenu = page.getByRole("navigation", { name: "More CEStudy pages" });
        await moreMenu.waitFor({ state: "visible", timeout: 5000 });
        const requiredLinks = ["Review Materials Hub", "Mock Exam Portal", "Community Forum"];
        const visibleLinks = await Promise.all(requiredLinks.map((name) =>
          moreMenu.getByRole("link", { name }).isVisible().catch(() => false),
        ));
        check("Mobile More menu exposes all approved destinations: " + activeRoute,
          visibleLinks.every(Boolean), JSON.stringify({ requiredLinks, visibleLinks }));
        const moreTargets = await moreMenu.locator("a").evaluateAll((nodes) =>
          nodes.filter((node) => node.getClientRects().length > 0)
            .map((node) => ({ label: node.textContent.trim().replace(/\s+/g, " "), height: Math.round(node.getBoundingClientRect().height) })),
        );
        check("Mobile More links have 44px targets: " + activeRoute,
          moreTargets.length >= 10 && moreTargets.every((target) => target.height >= 44),
          JSON.stringify(moreTargets));
        check("Mobile More menu does not cause horizontal overflow: " + activeRoute,
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
        await page.keyboard.press("Escape");
        check("Escape closes More and restores focus: " + activeRoute,
          await moreToggle.getAttribute("aria-expanded") === "false" &&
            await moreToggle.evaluate((node) => node === document.activeElement));
        await moreToggle.click();
        await moreMenu.getByRole("link", { name: "Review Materials Hub" }).click();
        await page.waitForFunction(() => window.location.pathname === "/review-materials" && document.activeElement?.id === "main-content");
        check("Mobile destination navigation hands focus to main content: " + activeRoute,
          await page.locator("#main-content").evaluate((node) => node === document.activeElement));
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
