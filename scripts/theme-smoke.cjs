const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");

const baseUrl = (process.env.CESTUDY_BASE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const viewports = [320, 390, 768, 1024, 1440];
const routes = [
  "/",
  "/about",
  "/contact",
  "/support",
  "/catalog",
  "/years",
  "/year/2",
  "/math-foundations",
  "/subjects/basic-algebra",
  "/study/basic-algebra",
  "/practice/basic-algebra",
  "/progress",
  "/privacy",
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
    const syntheticCatalogRows = [
      {
        slug: "calculus-1", title: "Calculus 1",
        summary: "Foundational limits, derivatives, and engineering applications.",
        year_level: 1, semester: "First semester", category: "year-level",
        classification: "ched-common-course", specialization: null,
        aliases: ["differential calculus"],
        source_reference: "https://example.invalid/curriculum",
        source_note: "Synthetic Playwright catalog fixture only.",
        availability: "has-published-content", display_order: 1,
      },
      {
        slug: "statics-of-rigid-bodies", title: "Statics of Rigid Bodies",
        summary: "Forces, equilibrium, moments, and rigid-body analysis.",
        year_level: 2, semester: "First semester", category: "year-level",
        classification: "ched-common-course", specialization: null,
        aliases: ["statics", "engineering statics"],
        source_reference: "https://example.invalid/curriculum",
        source_note: "Synthetic Playwright catalog fixture only.",
        availability: "has-published-content", display_order: 2,
      },
      {
        slug: "strength-of-materials", title: "Strength of Materials",
        summary: "Stress, strain, deformation, and member behavior.",
        year_level: 3, semester: "First semester", category: "year-level",
        classification: "ched-common-course", specialization: null,
        aliases: ["mechanics of materials"],
        source_reference: "https://example.invalid/curriculum",
        source_note: "Synthetic Playwright catalog fixture only.",
        availability: "has-published-content", display_order: 3,
      },
      {
        slug: "structural-design", title: "Structural Design",
        summary: "Analysis and design concepts for civil engineering structures.",
        year_level: 4, semester: "First semester", category: "year-level",
        classification: "ched-common-course", specialization: null,
        aliases: ["structural engineering"],
        source_reference: "https://example.invalid/curriculum",
        source_note: "Synthetic Playwright catalog fixture only.",
        availability: "has-published-content", display_order: 4,
      },
      {
        slug: "basic-algebra", title: "Basic and Advanced Algebra",
        summary: "Arithmetic, factoring, functions, equations, and engineering formula rearrangement.",
        year_level: null, semester: null, category: "math-foundation",
        classification: "supplementary-math-foundation", specialization: null,
        aliases: ["algebra", "factoring", "equations"],
        source_reference: "CEStudy supplementary review catalog",
        source_note: "Synthetic Playwright catalog fixture only.",
        availability: "has-published-content", display_order: 5,
      },
    ];

    const syntheticPublishedLesson = {
      id: "synthetic-playwright-algebra-unit-01",
      subject_slug: "basic-algebra",
      unit_number: 1,
      slug: "factoring-quadratic-trinomials",
      title: "Factoring Quadratic Trinomials",
      learning_objectives: [
        "Identify two numbers whose product and sum match the target coefficients.",
      ],
      lesson_markdown: String.raw`## Topic outline
- Standard form of a quadratic trinomial
- Factoring into two linear expressions
- Checking the resulting roots

## Conceptual explanation
A quadratic trinomial has a squared term, a linear term, and a constant. Factoring rewrites the expression as a product of simpler factors.

## Formula and method
Start with \(x^2 + 5x + 6 = 0\). Find two numbers whose product is 6 and whose sum is 5.

\[
x^2 + 5x + 6 = (x + 2)(x + 3)
\]

## Step-by-step worked solution
Problem: Solve \(x^2 + 5x + 6 = 0\).

1. Find two numbers with product 6 and sum 5: 2 and 3.
2. Rewrite the trinomial as \( (x + 2)(x + 3) = 0 \).
3. Set each factor equal to zero.

\[
x + 2 = 0
\]

\[
x + 3 = 0
\]

The solutions are \(x=-2\) and \(x=-3\).`,
      source_note: "Synthetic Playwright fixture only. This content is not stored or published in Supabase.",
      status: "published",
      updated_at: "2026-11-04T00:00:00.000Z",
    };

    const syntheticPublishedPracticeQuestion = {
      id: "synthetic-playwright-practice-01",
      subject_slug: "basic-algebra",
      topic: "Engineering mathematics • synthetic layout fixture",
      prompt: String.raw`A civil engineering student is checking a simplified rectangular member model. For this synthetic layout test only, assume the effective area and lever arm have already been reviewed and use the relationship \\(M_u = \\phi A_s f_y(d-a/2)\\). The student must identify the expression that correctly isolates the required steel area, while keeping every supplied symbol and factor in the correct position. This intentionally long problem statement verifies that a realistic engineering prompt wraps inside the Practice Workspace rather than stretching the page beyond the phone viewport.`,
      choices: [
        String.raw`Option A: \\(A_s = \\frac{M_u}{\\phi f_y(d-a/2)}\\), with the full effective lever arm retained in the denominator.`,
        String.raw`Option B: \\(A_s = \\frac{M_u(d-a/2)}{\\phi f_y}\\), multiplying by the lever arm instead of dividing by it.`,
        String.raw`Option C: \\(A_s = \\frac{M_u}{\\phi f_y(d-a/2)}\\), interpreted with the stated positive design factors and the reviewed effective depth.`,
        String.raw`Option D: \\(A_s = \\frac{\\phi f_y(d-a/2)}{M_u}\\), which reverses the required ratio.`,
      ],
      correct_answer: String.raw`Option C: \\(A_s = \\frac{M_u}{\\phi f_y(d-a/2)}\\), interpreted with the stated positive design factors and the reviewed effective depth.`,
      solution_steps: [
        String.raw`Start from \\(M_u = \\phi A_s f_y(d-a/2)\\).`,
        String.raw`Divide both sides by \\(\\phi f_y(d-a/2)\\) to isolate \\(A_s\\).`,
        String.raw`The resulting expression is \\(A_s = \\frac{M_u}{\\phi f_y(d-a/2)}\\).`,
      ],
      explanation: "Synthetic fixture only. The expression is included to test math rendering and wrapping, not to provide approved engineering instruction.",
      source_note: "Synthetic Playwright fixture only. This question is not stored or published in Supabase.",
      display_order: 1,
    };

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    let includeSyntheticPublishedLesson = true;
    await page.route("https://cestudy-math-smoke.invalid/rest/v1/**", async (route) => {
      const resource = new URL(route.request().url()).pathname.split("/").filter(Boolean).pop();
      const payload = resource === "subject_lessons"
        ? (includeSyntheticPublishedLesson ? [syntheticPublishedLesson] : [])
        : resource === "catalog_subjects"
          ? syntheticCatalogRows
          : resource === "practice_questions"
            ? [syntheticPublishedPracticeQuestion]
            : [];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "content-range": `0-${Math.max(0, payload.length - 1)}/${payload.length}` },
        body: JSON.stringify(payload),
      });
    });


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

          const navigationToggle = page.getByRole("button", { name: "Open navigation menu" });
          check("Sidebar menu control is visible: " + activeRoute, await navigationToggle.isVisible().catch(() => false));
          await navigationToggle.click();
          const navigationDrawer = page.getByRole("dialog", { name: "CEStudy navigation" });
          await navigationDrawer.waitFor({ state: "visible", timeout: 5000 });
          const themeGroup = navigationDrawer.getByRole("group", { name: "Color theme" });
          check("Theme selector is available inside the sidebar: " + activeRoute, await themeGroup.isVisible().catch(() => false));
          if (!(await themeGroup.isVisible().catch(() => false))) continue;

          const darkButton = themeGroup.getByRole("button", { name: "Dark" });
          await darkButton.click();
          if (route === "/practice/basic-algebra") {
            await page.locator(".practice-question-card h2").waitFor({ state: "visible", timeout: 10000 });
            await page.locator(".practice-question-card .katex").first().waitFor({ state: "visible", timeout: 10000 });
          }
          await page.waitForFunction(
            () => getComputedStyle(document.querySelector(".site-sidebar-link")).color === "rgb(243, 247, 251)",
            null,
            { timeout: 5000 },
          );
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
              navText: getComputedStyle(document.querySelector(".site-sidebar-link")).color,
              navBackground: getComputedStyle(document.querySelector(".site-sidebar")).backgroundColor,
              practiceWorkspace: (() => {
                const root = document.querySelector('[data-testid="practice-workspace"]');
                const wrapper = document.querySelector(".practice-wrap");
                const content = root?.querySelector(".practice-workspace__content");
                return {
                  exists: Boolean(root),
                  contentWidth: content?.getBoundingClientRect().width ?? 0,
                  wrapperMaxWidth: wrapper ? getComputedStyle(wrapper).maxWidth : "",
                  hasToolsPanel: Boolean(root?.querySelector(".practice-workspace__tools")),
                  hasToolsTrigger: Boolean(root?.querySelector(".practice-workspace__tools-trigger")),
                };
              })(),
              practiceContent: (() => {
                const card = document.querySelector(".practice-question-card");
                const question = card?.querySelector("h2");
                const options = [...(card?.querySelectorAll(".answer-option") ?? [])];
                const math = [...(card?.querySelectorAll(".katex") ?? [])];
                const mathErrors = [...(card?.querySelectorAll(".latex-math-error") ?? [])];
                const optionOverflowCount = options.filter((option) => {
                  const label = option.querySelector("span");
                  return label && label.scrollWidth > label.clientWidth + 1;
                }).length;
                return {
                  promptVisible: Boolean(question && question.getBoundingClientRect().width > 0),
                  questionWidth: card?.getBoundingClientRect().width ?? 0,
                  questionClientWidth: card?.clientWidth ?? 0,
                  questionScrollWidth: card?.scrollWidth ?? 0,
                  optionCount: options.length,
                  optionOverflowCount,
                  katexCount: math.length,
                  mathErrorCount: mathErrors.length,
                  promptText: question?.textContent?.slice(0, 100) ?? "",
                };
              })(),
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
              ".answer-feedback", ".about-principle", ".about-next",
              ".practice-question-card", ".contact-primary-card", ".contact-option-card",
              ".support-method-card", ".study-entry-panel", ".feedback-action-menu",
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
          const darkContentReadability = await page.evaluate(() =>
            [...document.querySelectorAll(".about-principle p, .about-next p, .privacy-content > section p, .contact-primary-card p, .contact-option-card p, .support-method-card p, .practice-source, .answer-options legend, .answer-feedback p, .answer-feedback ol")]
              .map((node) => {
                const surface = node.closest(".about-principle, .about-next, .privacy-content > section, .contact-primary-card, .contact-option-card, .support-method-card, .practice-question-card, .answer-feedback");
                return {
                  text: node.textContent?.trim().slice(0, 80) ?? "",
                  foreground: getComputedStyle(node).color,
                  background: surface ? getComputedStyle(surface).backgroundColor : "",
                };
              }),
          );
          check("Dark About and Privacy body copy meets WCAG AA: " + activeRoute,
            darkContentReadability.every((item) => contrastRatio(item.foreground, item.background) >= 4.5),
            JSON.stringify(darkContentReadability));
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
          check("No page-wide horizontal overflow in Dark: " + activeRoute,
            Math.max(dark.documentWidth, dark.bodyWidth) <= dark.viewportWidth + 1,
            "viewport=" + dark.viewportWidth + ", document=" + dark.documentWidth + ", body=" + dark.bodyWidth);

          if (route === "/practice/basic-algebra") {
            const workspace = dark.practiceWorkspace;
            check("Dark practice route keeps a visible question-first workspace: " + activeRoute,
              workspace.exists && workspace.contentWidth > 0 && workspace.contentWidth <= width + 1,
              JSON.stringify(workspace));
            check("Dark practice workspace uses the expanded width cap: " + activeRoute,
              workspace.wrapperMaxWidth === "1120px", JSON.stringify(workspace));
            check("Dark practice route omits tools UI when no functional tool is supplied: " + activeRoute,
              !workspace.hasToolsPanel && !workspace.hasToolsTrigger, JSON.stringify(workspace));
            check("Dark practice renders the synthetic long prompt and all four answer choices: " + activeRoute,
              dark.practiceContent.promptVisible &&
                dark.practiceContent.optionCount === 4 &&
                dark.practiceContent.questionWidth > 0,
              JSON.stringify(dark.practiceContent));
            check("Dark practice renders KaTeX without math fallback errors: " + activeRoute,
              dark.practiceContent.katexCount >= 2 && dark.practiceContent.mathErrorCount === 0,
              JSON.stringify(dark.practiceContent));
            check("Dark practice question and options fit without internal horizontal overflow: " + activeRoute,
              dark.practiceContent.questionScrollWidth <= dark.practiceContent.questionClientWidth + 1 &&
                dark.practiceContent.optionOverflowCount === 0,
              JSON.stringify(dark.practiceContent));
          }

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
            await page.getByRole("button", { name: "Open navigation menu" }).click();
            await page.getByRole("dialog", { name: "CEStudy navigation" }).waitFor({ state: "visible", timeout: 5000 });
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
          await page.waitForFunction(
            () => getComputedStyle(document.querySelector(".site-sidebar-link")).color === "rgb(11, 38, 61)",
            null,
            { timeout: 5000 },
          );
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
              navText: getComputedStyle(document.querySelector(".site-sidebar-link")).color,
              navBackground: getComputedStyle(document.querySelector(".site-sidebar")).backgroundColor,
              practiceWorkspace: (() => {
                const root = document.querySelector('[data-testid="practice-workspace"]');
                const wrapper = document.querySelector(".practice-wrap");
                const content = root?.querySelector(".practice-workspace__content");
                return {
                  exists: Boolean(root),
                  contentWidth: content?.getBoundingClientRect().width ?? 0,
                  wrapperMaxWidth: wrapper ? getComputedStyle(wrapper).maxWidth : "",
                  hasToolsPanel: Boolean(root?.querySelector(".practice-workspace__tools")),
                  hasToolsTrigger: Boolean(root?.querySelector(".practice-workspace__tools-trigger")),
                };
              })(),
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
          check("No page-wide horizontal overflow in Light: " + activeRoute,
            Math.max(light.documentWidth, light.bodyWidth) <= light.viewportWidth + 1,
            "viewport=" + light.viewportWidth + ", document=" + light.documentWidth + ", body=" + light.bodyWidth);

          if (route === "/practice/basic-algebra") {
            const workspace = light.practiceWorkspace;
            check("Light practice route keeps a visible question-first workspace: " + activeRoute,
              workspace.exists && workspace.contentWidth > 0 && workspace.contentWidth <= width + 1,
              JSON.stringify(workspace));
            check("Light practice workspace uses the expanded width cap: " + activeRoute,
              workspace.wrapperMaxWidth === "1120px", JSON.stringify(workspace));
            check("Light practice route omits tools UI when no functional tool is supplied: " + activeRoute,
              !workspace.hasToolsPanel && !workspace.hasToolsTrigger, JSON.stringify(workspace));
            check("Light practice renders the synthetic long prompt and all four answer choices: " + activeRoute,
              light.practiceContent.promptVisible &&
                light.practiceContent.optionCount === 4 &&
                light.practiceContent.questionWidth > 0,
              JSON.stringify(light.practiceContent));
            check("Light practice renders KaTeX without math fallback errors: " + activeRoute,
              light.practiceContent.katexCount >= 2 && light.practiceContent.mathErrorCount === 0,
              JSON.stringify(light.practiceContent));
            check("Light practice question and options fit without internal horizontal overflow: " + activeRoute,
              light.practiceContent.questionScrollWidth <= light.practiceContent.questionClientWidth + 1 &&
                light.practiceContent.optionOverflowCount === 0,
              JSON.stringify(light.practiceContent));
          }

          if (route === "/" && width === 1440) {
            await page.waitForFunction(
              () => window.localStorage.getItem("cestudy:theme:v1") === "light",
              { timeout: 5000 },
            );
            await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
            await page.locator("h1").first().waitFor({ state: "visible", timeout: 12000 });
            await page.getByRole("button", { name: "Open navigation menu" }).click();
            await page.getByRole("dialog", { name: "CEStudy navigation" }).waitFor({ state: "visible", timeout: 5000 });
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

    const marqueeSubjects = [
      "Statics of Rigid Bodies",
      "Fundamentals of Surveying",
      "Mechanics of Deformable Bodies",
      "Construction Materials and Testing",
      "Structural Theory",
      "Highway and Railroad Engineering",
      "Principles of Steel Design",
      "Principles of Reinforced/Prestressed Concrete",
      "Hydrology",
      "Hydraulics",
      "Geotechnical Engineering 1 (Soil Mechanics)",
      "Principles of Transportation Engineering",
      "Quantity Surveying",
      "Construction Methods and Project Management",
    ];

    for (const width of viewports) {
      activeRoute = "homepage marquee at " + width + "px";
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(baseUrl + "/", { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.locator("h1").first().waitFor({ state: "visible", timeout: 12000 });
      const marquee = page.locator(".home-marquee");
      const track = page.locator(".home-marquee-track");
      const groups = marquee.locator(".home-marquee-group");
      const groupTexts = await groups.allTextContents();
      check("Marquee has two identical loop groups: " + activeRoute,
        groupTexts.length === 2 && groupTexts[0].replace(/\s+/g, " ").trim() === groupTexts[1].replace(/\s+/g, " ").trim(),
        JSON.stringify(groupTexts));
      check("Marquee contains only real CEStudy curriculum subjects: " + activeRoute,
        marqueeSubjects.every((subject) => groupTexts[0]?.includes(subject)) &&
          !/learn by year|strengthen math foundations|practice step by step|build your ce foundation/i.test(groupTexts[0] ?? ""),
        groupTexts[0] ?? "");
      check("Marquee remains decorative and non-interactive: " + activeRoute,
        await marquee.getAttribute("aria-hidden") === "true" &&
          await marquee.locator("a, button, input").count() === 0);
      const edgeFades = await page.evaluate(() => {
        const node = document.querySelector(".home-marquee");
        if (!node) return null;
        const before = getComputedStyle(node, "::before");
        const after = getComputedStyle(node, "::after");
        return {
          before: before.backgroundImage,
          after: after.backgroundImage,
          beforePointerEvents: before.pointerEvents,
          afterPointerEvents: after.pointerEvents,
        };
      });
      check("Marquee has non-interactive left and right edge fades: " + activeRoute,
        Boolean(edgeFades?.before.includes("gradient") && edgeFades?.after.includes("gradient") &&
          edgeFades.beforePointerEvents === "none" && edgeFades.afterPointerEvents === "none"),
        JSON.stringify(edgeFades));
      const box = await marquee.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        const beforeTime = await track.evaluate((node) => {
          const animation = node.getAnimations()[0];
          return {
            playState: animation?.playState ?? "missing",
            currentTime: Number(animation?.currentTime ?? 0),
          };
        });
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(300);
        const afterTime = await track.evaluate((node) => {
          const animation = node.getAnimations()[0];
          return {
            playState: animation?.playState ?? "missing",
            currentTime: Number(animation?.currentTime ?? 0),
            computedPlayState: getComputedStyle(node).animationPlayState,
          };
        });
        check("Marquee keeps moving after pointer hover and click: " + activeRoute,
          beforeTime.playState === "running" && afterTime.playState === "running" &&
            afterTime.computedPlayState === "running" && afterTime.currentTime > beforeTime.currentTime,
          JSON.stringify({ beforeTime, afterTime }));
      } else {
        check("Marquee remains visible for interaction check: " + activeRoute, false, "No marquee bounding box");
      }
    }

    for (const width of viewports) {
      activeRoute = "hybrid navigation at " + width + "px";
      await page.setViewportSize({ width, height: 900 });
      await page.goto(baseUrl + "/", { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.locator("h1").first().waitFor({ state: "visible", timeout: 12000 });

      const navigationToggle = page.getByRole("button", { name: "Open navigation menu" });
      const toggleHeight = await navigationToggle.evaluate((node) => Math.round(node.getBoundingClientRect().height));
      check("Sidebar menu control has a 44px target: " + activeRoute, toggleHeight >= 44, String(toggleHeight));
      await navigationToggle.click();
      const drawer = page.getByRole("dialog", { name: "CEStudy navigation" });
      await drawer.waitFor({ state: "visible", timeout: 5000 });
      const themeTargets = await drawer.locator(".theme-toggle-option").evaluateAll((nodes) =>
        nodes.map((node) => Math.round(node.getBoundingClientRect().height)),
      );
      check("Theme controls have 44px targets inside the sidebar: " + activeRoute,
        themeTargets.length === 2 && themeTargets.every((height) => height >= 44),
        JSON.stringify(themeTargets));
      const sidebarNavigation = drawer.getByRole("navigation", { name: "CEStudy pages" });
      const expectedLinks = [
        "Home", "Subject Catalog", "Math Foundations", "Progress",
        "About us", "Contact CEStudy", "Support us", "Report a bug", "Send feedback", "Privacy notice",
      ];
      const yearLevelsButton = sidebarNavigation.getByRole("button", { name: "Year Levels" });
      const yearButtonHeight = await yearLevelsButton.evaluate((node) => Math.round(node.getBoundingClientRect().height));
      check("Year Levels disclosure has a 44px target: " + activeRoute, yearButtonHeight >= 44, String(yearButtonHeight));
      await yearLevelsButton.click();
      const yearLevelsPanel = drawer.getByRole("region", { name: "Year-level navigation" });
      await yearLevelsPanel.waitFor({ state: "visible", timeout: 5000 });
      check("Year Levels retains its browse-all route: " + activeRoute,
        await yearLevelsPanel.getByRole("link", { name: "Browse all year levels" }).getAttribute("href") === "/years");
      check("Year Levels does not duplicate Subject Catalog or Math Foundations: " + activeRoute,
        await yearLevelsPanel.getByRole("link", { name: "Subject Catalog" }).count() === 0 &&
        await yearLevelsPanel.getByRole("link", { name: "Math Foundations" }).count() === 0 &&
        await sidebarNavigation.getByRole("link", { name: "Subject Catalog" }).count() === 1);
      const availableLinks = await Promise.all(expectedLinks.map((name) =>
        sidebarNavigation.getByRole("link", { name }).isVisible().catch(() => false),
      ));
      check("Sidebar exposes the approved available destinations: " + activeRoute,
        availableLinks.every(Boolean), JSON.stringify({ expectedLinks, availableLinks }));
      const removedDestinations = ["Review Materials Hub", "Mock Exam Portal", "Community Forum"];
      const removedLinksVisible = await Promise.all(removedDestinations.map((name) =>
        sidebarNavigation.getByRole("link", { name }).count().then((count) => count > 0),
      ));
      check("Unavailable destinations are absent from global navigation: " + activeRoute,
        removedLinksVisible.every((visible) => !visible), JSON.stringify({ removedDestinations, removedLinksVisible }));
      check("Subject Catalog appears once in the sidebar: " + activeRoute,
        await sidebarNavigation.getByRole("link", { name: "Subject Catalog" }).count() === 1);
      const sidebarTargets = await sidebarNavigation.locator("a").evaluateAll((nodes) =>
        nodes.filter((node) => node.getClientRects().length > 0)
          .map((node) => ({ label: node.textContent.trim().replace(/\s+/g, " "), height: Math.round(node.getBoundingClientRect().height) })),
      );
      check("Sidebar navigation links have 44px targets: " + activeRoute,
        sidebarTargets.length >= expectedLinks.length && sidebarTargets.every((target) => target.height >= 44),
        JSON.stringify(sidebarTargets));
      const drawerWidth = await drawer.evaluate((node) => Math.round(node.getBoundingClientRect().width));
      check("Sidebar drawer fits the viewport without page overflow: " + activeRoute,
        drawerWidth <= width && await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
        "drawerWidth=" + drawerWidth + ", viewport=" + width);
      await page.keyboard.press("Escape");
      check("Escape closes the sidebar and restores focus: " + activeRoute,
        await page.getByRole("dialog", { name: "CEStudy navigation" }).count() === 0 &&
          await navigationToggle.evaluate((node) => node === document.activeElement));
      await navigationToggle.click();
      const reopenedDrawer = page.getByRole("dialog", { name: "CEStudy navigation" });
      await reopenedDrawer.getByRole("link", { name: "Subject Catalog" }).click();
      await page.waitForFunction(() => window.location.pathname === "/catalog" && document.activeElement?.id === "main-content");
      check("Sidebar route navigation closes the drawer and focuses main content: " + activeRoute,
        await page.locator("#main-content").evaluate((node) => node === document.activeElement));

    }

    for (const width of viewports) {
      activeRoute = "synthetic populated engineering-math lesson at " + width + "px";
      await page.setViewportSize({ width, height: 900 });

      includeSyntheticPublishedLesson = false;
      const baselineResponse = await page.goto(baseUrl + "/study/basic-algebra", {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      check("Empty reviewer baseline returns HTTP 200: " + activeRoute,
        Boolean(baselineResponse && baselineResponse.status() === 200),
        "status=" + (baselineResponse?.status() ?? "no response"));
      await page.getByRole("heading", { name: "Reviewer content is being prepared" })
        .waitFor({ state: "visible", timeout: 12000 });
      check("Empty reviewer baseline clearly reports no published topics: " + activeRoute,
        await page.locator(".study-empty").isVisible().catch(() => false));
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      const baselineThemeGroup = page.getByRole("dialog", { name: "CEStudy navigation" }).getByRole("group", { name: "Color theme" });
      for (const themeName of ["Dark", "Light"]) {
        await baselineThemeGroup.getByRole("button", { name: themeName }).click();
        await page.waitForFunction(
          (expectedTheme) => document.documentElement.dataset.theme === expectedTheme,
          themeName.toLowerCase(),
          { timeout: 5000 },
        );
        if (width === 390 || width === 1440) {
          await page.screenshot({
            path: path.join("artifacts", "empty-reviewer-" + themeName.toLowerCase() + "-" + width + "px.png"),
            fullPage: true,
          });
        }
      }

      includeSyntheticPublishedLesson = true;
      const response = await page.goto(baseUrl + "/study/basic-algebra/1", {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      check("Synthetic lesson route returns HTTP 200: " + activeRoute,
        Boolean(response && response.status() === 200),
        "status=" + (response?.status() ?? "no response"));

      await page.getByRole("heading", { name: "Factoring Quadratic Trinomials" })
        .waitFor({ state: "visible", timeout: 12000 });
      await page.waitForFunction(
        () => document.querySelectorAll(".study-lesson .katex").length >= 7,
        null,
        { timeout: 10000 },
      );

      const lessonContent = await page.evaluate(() => {
        const article = document.querySelector(".study-lesson");
        const articleRect = article?.getBoundingClientRect();
        const mathNodes = [...(article?.querySelectorAll(".katex") ?? [])];
        return {
          title: article?.querySelector("h2")?.textContent?.trim() ?? "",
          sectionHeadings: [...(article?.querySelectorAll(".markdown-content h2, .markdown-content h3, .markdown-content h4") ?? [])]
            .map((node) => node.textContent?.trim() ?? ""),
          articleText: article?.textContent ?? "",
          mathCount: mathNodes.length,
          displayMathCount: article?.querySelectorAll(".katex-display").length ?? 0,
          mathErrors: article?.querySelectorAll(".latex-math-error").length ?? 0,
          objectiveHeadingCount: [...(article?.querySelectorAll("h1, h2, h3, h4, h5, h6") ?? [])]
            .filter((node) => /learning objectives/i.test(node.textContent ?? "")).length,
          articleWidth: article?.clientWidth ?? 0,
          articleScrollWidth: article?.scrollWidth ?? 0,
          viewportWidth: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          mathBoundsFit: Boolean(articleRect) && mathNodes.every((node) => {
            const rect = node.getBoundingClientRect();
            return rect.left >= articleRect.left - 1 && rect.right <= articleRect.right + 1;
          }),
          formulaColor: mathNodes[0] ? getComputedStyle(mathNodes[0]).color : "",
          articleBackground: article ? getComputedStyle(article).backgroundColor : "",
          outlinePresent: [...(article?.querySelectorAll("h2, h3, h4") ?? [])]
            .some((node) => node.textContent?.trim() === "Topic outline"),
          workedSteps: article?.querySelectorAll(".markdown-content ol li").length ?? 0,
          objectiveVisibleInArticle: (article?.textContent ?? "").includes(
            "Identify two numbers whose product and sum match the target coefficients.",
          ),
        };
      });

      check("Synthetic lesson contains the expected practical review structure: " + activeRoute,
        lessonContent.title === "Factoring Quadratic Trinomials" &&
          ["Topic outline", "Conceptual explanation", "Formula and method", "Step-by-step worked solution"]
            .every((heading) => lessonContent.sectionHeadings.includes(heading)),
        JSON.stringify({ title: lessonContent.title, headings: lessonContent.sectionHeadings }));
      check("Synthetic lesson has at least seven rendered KaTeX expressions: " + activeRoute,
        lessonContent.mathCount >= 7 && lessonContent.displayMathCount >= 3,
        JSON.stringify({ mathCount: lessonContent.mathCount, displayMathCount: lessonContent.displayMathCount }));
      check("Valid lesson formulas have no rendering errors: " + activeRoute,
        lessonContent.mathErrors === 0, "mathErrors=" + lessonContent.mathErrors);
      check("Worked solution is presented as three ordered steps: " + activeRoute,
        lessonContent.workedSteps === 3, "workedSteps=" + lessonContent.workedSteps);
      check("Learning objectives remain search metadata and are not displayed in the lesson: " + activeRoute,
        lessonContent.objectiveHeadingCount === 0 && !lessonContent.objectiveVisibleInArticle);
      check("Lesson math does not overflow its article or viewport: " + activeRoute,
        lessonContent.articleScrollWidth <= lessonContent.articleWidth + 1 &&
          lessonContent.documentWidth <= lessonContent.viewportWidth + 1 &&
          lessonContent.mathBoundsFit,
        JSON.stringify({
          articleWidth: lessonContent.articleWidth,
          articleScrollWidth: lessonContent.articleScrollWidth,
          viewportWidth: lessonContent.viewportWidth,
          documentWidth: lessonContent.documentWidth,
          mathBoundsFit: lessonContent.mathBoundsFit,
        }));

      await page.getByRole("button", { name: "Open navigation menu" }).click();
      const themeGroup = page.getByRole("dialog", { name: "CEStudy navigation" }).getByRole("group", { name: "Color theme" });
      for (const themeName of ["Dark", "Light"]) {
        await themeGroup.getByRole("button", { name: themeName }).click();
        await page.waitForFunction(
          (expectedTheme) => document.documentElement.dataset.theme === expectedTheme,
          themeName.toLowerCase(),
          { timeout: 5000 },
        );
        const themeMetrics = await page.evaluate(() => {
          const article = document.querySelector(".study-lesson");
          const firstMath = article?.querySelector(".katex");
          return {
            theme: document.documentElement.dataset.theme ?? "",
            foreground: firstMath ? getComputedStyle(firstMath).color : "",
            background: article ? getComputedStyle(article).backgroundColor : "",
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
            mathErrorCount: article?.querySelectorAll(".latex-math-error").length ?? 0,
          };
        });
        check(themeName + " theme is applied to the populated lesson: " + activeRoute,
          themeMetrics.theme === themeName.toLowerCase(), themeMetrics.theme);
        check(themeName + " theme keeps KaTeX readable at WCAG AA contrast: " + activeRoute,
          contrastRatio(themeMetrics.foreground, themeMetrics.background) >= 4.5,
          JSON.stringify({
            foreground: themeMetrics.foreground,
            background: themeMetrics.background,
            ratio: contrastRatio(themeMetrics.foreground, themeMetrics.background),
          }));
        check(themeName + " theme has no page overflow or math errors: " + activeRoute,
          themeMetrics.documentWidth <= themeMetrics.viewportWidth + 1 &&
            themeMetrics.mathErrorCount === 0,
          JSON.stringify(themeMetrics));
        if (width === 390 || width === 1440) {
          await page.screenshot({
            path: path.join("artifacts", "populated-lesson-" + themeName.toLowerCase() + "-" + width + "px.png"),
            fullPage: true,
          });
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
