const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");

const baseUrl = (process.env.CESTUDY_BASE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const checks = [];
const failures = [];

function check(name, passed, detail = "") {
  checks.push({ name, passed, detail });
  if (!passed) failures.push({ name, detail });
}

function luminance(rgb) {
  const channels = rgb.match(/[\d.]+/g)?.slice(0, 3).map(Number);
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
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    await page.goto(baseUrl + "/menu", { waitUntil: "domcontentloaded", timeout: 30000 });
    const themeSwitch = page.getByRole("switch", { name: /switch to dark mode/i });
    check("Menu exposes an accessible dark-mode switch", await themeSwitch.count() === 1);
    await themeSwitch.click();

    const toggled = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      colorScheme: document.documentElement.style.colorScheme,
      themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content") || "",
      savedTheme: localStorage.getItem("cestudy:theme:v1"),
    }));
    check("Toggling dark mode updates document theme", toggled.theme === "dark" && toggled.colorScheme === "dark", JSON.stringify(toggled));
    check("Toggling dark mode updates browser theme color", toggled.themeColor === "#0B1421", toggled.themeColor);
    check("Theme preference is persisted locally", toggled.savedTheme === "dark", toggled.savedTheme);

    await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
    check("Dark mode persists after reload", await page.evaluate(() => document.documentElement.dataset.theme === "dark"));

    const routes = [
      { path: "/", heading: /Build your CE foundation\./, surface: ".hero-visual" },
      { path: "/privacy", heading: /Privacy notice/i, surface: ".privacy-content > section" },
      { path: "/login", heading: /Sign in to CEStudy|Checking your sign-in/i, surface: ".login-panel" },
      { path: "/profile", heading: /Your profile/i, surface: ".profile-guest-panel" },
      { path: "/menu", heading: /Menu/i, surface: ".menu-link-card" },
      { path: "/history", heading: /Lesson history/i, surface: ".history-empty" },
      { path: "/streak", heading: /Streak calendar/i, surface: ".streak-calendar-card" },
      { path: "/progress", heading: /Your learning progress/i, surface: ".progress-empty" },
      { path: "/community", heading: /CEStudy community/i, surface: ".community-launch-panel" },
    ];

    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        try {
          const response = await page.goto(baseUrl + route.path, { waitUntil: "domcontentloaded", timeout: 30000 });
          check("Direct route returns HTTP 200 at " + width + "px: " + route.path, Boolean(response && response.status() === 200), "status=" + (response?.status() ?? "no response"));
          const heading = page.locator("h1").first();
          await heading.waitFor({ state: "visible", timeout: 10000 });
          if (route.path === "/login") {
            // A configured Supabase client briefly renders its session-checking state on first load.
            await page.getByRole("heading", { name: /^sign in to cestudy$/i }).waitFor({ state: "visible", timeout: 10000 });
          }
          await page.locator(route.surface).first().waitFor({ state: "visible", timeout: 10000 });
          const headingText = (await heading.innerText()).trim();
          check("Expected heading at " + width + "px: " + route.path, route.heading.test(headingText), "heading=" + headingText);

          const visualState = await page.evaluate((surfaceSelector) => {
            const surface = document.querySelector(surfaceSelector);
            return {
              theme: document.documentElement.dataset.theme || "",
              colorScheme: document.documentElement.style.colorScheme,
              bodyBackground: getComputedStyle(document.body).backgroundColor,
              surfaceBackground: surface ? getComputedStyle(surface).backgroundColor : "missing",
              hasSurface: Boolean(surface),
              viewportWidth: window.innerWidth,
              documentWidth: document.documentElement.scrollWidth,
              bodyWidth: document.body.scrollWidth,
            };
          }, route.surface);

          check("Dark theme remains active on " + route.path, visualState.theme === "dark" && visualState.colorScheme === "dark");
          check("Dark page background is consistent on " + route.path, visualState.bodyBackground === "rgb(11, 20, 33)", visualState.bodyBackground);
          check("Dark content surface exists and is not white on " + route.path,
            visualState.hasSurface && visualState.surfaceBackground !== "rgb(255, 255, 255)" && visualState.surfaceBackground !== "missing",
            visualState.surfaceBackground);
          check("No horizontal overflow at " + width + "px: " + route.path,
            Math.max(visualState.documentWidth, visualState.bodyWidth) <= visualState.viewportWidth + 1,
            "viewport=" + visualState.viewportWidth + ", document=" + visualState.documentWidth + ", body=" + visualState.bodyWidth);

          if (route.path === "/privacy") {
            const contrast = await page.locator(".privacy-content > section").first().evaluate((section) => {
              const paragraph = section.querySelector("p");
              return {
                foreground: paragraph ? getComputedStyle(paragraph).color : "",
                background: getComputedStyle(section).backgroundColor,
              };
            });
            check("Privacy body text contrast meets WCAG AA in dark mode",
              contrastRatio(contrast.foreground, contrast.background) >= 4.5,
              JSON.stringify(contrast));
          }

          if (route.path === "/login") {
            const googleButton = page.locator(".google-signin-button").first();
            const exists = await googleButton.count() > 0;
            check("Google sign-in button exists on Login", exists);
            if (exists) {
              // The CI preview intentionally has no provider secrets, so the real button is normally disabled.
              // Check that unavailable state, then temporarily enable the DOM control to verify the actual
              // enabled-state brand styling without starting an OAuth request.
              await page.mouse.move(0, 0);
              const renderedState = await googleButton.evaluate((button) => {
                const style = getComputedStyle(button);
                return {
                  disabled: button instanceof HTMLButtonElement && button.disabled,
                  background: style.backgroundColor,
                  foreground: style.color,
                  opacity: style.opacity,
                  setupNoteVisible: Boolean(document.querySelector(".login-setup-note")),
                };
              });
              check("Google sign-in disabled state matches the visible setup notice",
                renderedState.disabled === renderedState.setupNoteVisible,
                JSON.stringify(renderedState));
              if (renderedState.disabled) {
                check("Disabled Google sign-in remains visibly disabled and readable",
                  renderedState.background === "rgb(241, 243, 244)" &&
                    renderedState.foreground === "rgb(60, 64, 67)" &&
                    renderedState.opacity === "1" &&
                    contrastRatio(renderedState.foreground, renderedState.background) >= 4.5,
                  JSON.stringify(renderedState));
              }

              const enabledStyle = await googleButton.evaluate((button) => {
                // Disable transitions before toggling the synthetic control, or the browser may report an
                // intermediate color while the disabled-state background animates back to the brand surface.
                button.style.transition = "none";
                if (button instanceof HTMLButtonElement) button.disabled = false;
                button.getBoundingClientRect();
                const icon = button.querySelector("img");
                const style = getComputedStyle(button);
                return {
                  disabled: button instanceof HTMLButtonElement && button.disabled,
                  background: style.backgroundColor,
                  foreground: style.color,
                  hovered: button.matches(":hover"),
                  active: button.matches(":active"),
                  icon: icon?.getAttribute("src") || "",
                  iconTileBackground: icon?.parentElement ? getComputedStyle(icon.parentElement).backgroundColor : "missing",
                };
              });
              check("Enabled Google sign-in uses the white brand treatment in dark mode",
                !enabledStyle.disabled &&
                  !enabledStyle.hovered &&
                  !enabledStyle.active &&
                  enabledStyle.background === "rgb(255, 255, 255)" &&
                  enabledStyle.foreground === "rgb(31, 31, 31)",
                JSON.stringify(enabledStyle));
              check("Google logo remains on a white tile",
                enabledStyle.iconTileBackground === "rgb(255, 255, 255)",
                JSON.stringify(enabledStyle));
              check("Google sign-in uses the local brand asset",
                enabledStyle.icon === "/branding/icons/google.svg",
                enabledStyle.icon);
              check("Enabled Google sign-in label contrast meets WCAG AA",
                contrastRatio(enabledStyle.foreground, enabledStyle.background) >= 4.5,
                JSON.stringify(enabledStyle));
            }
          }
        } catch (error) {
          check("Route smoke check: " + route.path + " at " + width + "px", false, error.message);
        }
      }
    }

    // Simulate OAuth cancellation/provider-error callback URLs without contacting Google.
    // The external provider click/cancel itself still requires an interactive test account.
    const oauthErrorScenarios = [
      { label: "cancellation", error: "access_denied", description: "The user canceled Google sign-in." },
      { label: "provider failure", error: "server_error", description: "The provider could not complete sign-in." },
    ];
    for (const scenario of oauthErrorScenarios) {
      const callbackUrl = new URL("/login", baseUrl);
      callbackUrl.searchParams.set("error", scenario.error);
      callbackUrl.searchParams.set("error_description", scenario.description);
      const callbackResponse = await page.goto(callbackUrl.toString(), { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.getByRole("heading", { name: /^sign in to cestudy$/i }).waitFor({ state: "visible", timeout: 10000 });
      await page.getByRole("alert").waitFor({ state: "visible", timeout: 10000 });
      const callbackState = await page.evaluate(() => {
        const button = document.querySelector(".google-signin-button");
        return {
          origin: window.location.origin,
          pathname: window.location.pathname,
          heading: document.querySelector("h1")?.textContent?.trim() || "",
          alertText: document.querySelector('[role="alert"]')?.textContent?.trim() || "",
          buttonLabel: button?.textContent?.trim() || "",
          buttonDisabled: button instanceof HTMLButtonElement ? button.disabled : true,
          setupNoteVisible: Boolean(document.querySelector(".login-setup-note")),
        };
      });
      check("OAuth " + scenario.label + " callback stays on local Login route",
        Boolean(callbackResponse && callbackResponse.status() === 200) &&
          callbackState.origin === new URL(baseUrl).origin &&
          callbackState.pathname === "/login" &&
          /sign in to cestudy/i.test(callbackState.heading),
        JSON.stringify(callbackState));
      check("OAuth " + scenario.label + " callback displays recovery feedback",
        /canceled or could not be completed/i.test(callbackState.alertText),
        callbackState.alertText);
      check("OAuth " + scenario.label + " callback clears pending state and preserves retry/setup",
        callbackState.buttonLabel === "Continue with Google" &&
          callbackState.buttonDisabled === callbackState.setupNoteVisible,
        JSON.stringify(callbackState));
      await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
      await page.getByRole("heading", { name: /^sign in to cestudy$/i }).waitFor({ state: "visible", timeout: 10000 });
      await page.getByRole("alert").waitFor({ state: "visible", timeout: 10000 });
      check("OAuth " + scenario.label + " callback remains recoverable after refresh",
        await page.getByRole("alert").count() === 1 &&
          /canceled or could not be completed/i.test(await page.getByRole("alert").innerText()));
    }

    // Hostile values must not navigate the signed-out Login page away from this app origin.
    // Unit tests also assert that returnTo resolves safely to /profile for these values.
    const unsafeTargets = [
      { label: "absolute external URL", value: "https://evil.example/steal" },
      { label: "protocol-relative URL", value: "//evil.example/steal" },
      { label: "backslash protocol-relative URL", value: "\\\\evil.example\\steal" },
      { label: "javascript URL", value: "javascript:alert(1)" },
      { label: "login redirect loop", value: "/login?next=%2Fstreak" },
    ];
    for (const target of unsafeTargets) {
      const loginUrl = new URL("/login", baseUrl);
      loginUrl.searchParams.set("next", target.value);
      const targetResponse = await page.goto(loginUrl.toString(), { waitUntil: "domcontentloaded", timeout: 30000 });
      const targetState = await page.evaluate(() => ({
        origin: window.location.origin,
        pathname: window.location.pathname,
        heading: document.querySelector("h1")?.textContent?.trim() || "",
        hasLoginPanel: Boolean(document.querySelector(".login-panel")),
        hasSignInButton: Boolean(document.querySelector(".google-signin-button")),
      }));
      check("Unsafe return target stays on local Login: " + target.label,
        Boolean(targetResponse && targetResponse.status() === 200) &&
          targetState.origin === new URL(baseUrl).origin &&
          targetState.pathname === "/login" &&
          /sign in to cestudy/i.test(targetState.heading) &&
          targetState.hasLoginPanel &&
          targetState.hasSignInButton,
        JSON.stringify(targetState));
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(baseUrl + "/menu", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.evaluate(() => { document.body.tabIndex = -1; document.body.focus(); });
    await page.keyboard.press("Tab");
    const focusState = await page.evaluate(() => {
      const active = document.activeElement;
      const style = active ? getComputedStyle(active) : null;
      return {
        tagName: active?.tagName || "",
        outlineColor: style?.outlineColor || "",
        outlineStyle: style?.outlineStyle || "",
        outlineWidth: style?.outlineWidth || "",
        focusedSkipLink: active?.classList.contains("skip-link") || false,
      };
    });
    check("Keyboard navigation exposes the skip link", focusState.focusedSkipLink, JSON.stringify(focusState));
    check("Dark-mode keyboard focus uses the accessible focus token",
      focusState.outlineColor === "rgb(144, 196, 255)" && focusState.outlineStyle === "solid" && parseFloat(focusState.outlineWidth) >= 2,
      JSON.stringify(focusState));

    await page.goto(baseUrl + "/streak", { waitUntil: "domcontentloaded", timeout: 30000 });
    const today = page.locator(".streak-calendar-day.is-today").first();
    const todayCount = await today.count();
    check("Streak calendar renders today's state", todayCount === 1);
    if (todayCount === 1) {
      const before = await today.evaluate((element) => {
        const style = getComputedStyle(element);
        return { outlineColor: style.outlineColor, outlineWidth: style.outlineWidth };
      });
      check("Today's calendar outline uses the dark focus token",
        before.outlineColor === "rgb(144, 196, 255)" && before.outlineWidth === "2px",
        JSON.stringify(before));
      await today.click();
      const selected = await today.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          selected: element.classList.contains("is-selected"),
          outlineColor: style.outlineColor,
          outlineWidth: style.outlineWidth,
        };
      });
      check("Selecting a calendar day keeps a visible theme-aware outline",
        selected.selected && selected.outlineColor === "rgb(144, 196, 255)" && selected.outlineWidth === "3px",
        JSON.stringify(selected));
      const detail = page.locator(".streak-day-detail").first();
      check("Selected date detail message is rendered", await detail.count() === 1);
      if (await detail.count() === 1) {
        const detailStyle = await detail.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            background: style.backgroundColor,
            borderColor: style.borderTopColor,
            foreground: style.color,
          };
        });
        check("Selected-day detail uses the dark raised surface token",
          detailStyle.background === "rgb(23, 37, 56)",
          JSON.stringify(detailStyle));
        check("Selected-day detail uses theme-aware border and text tokens",
          detailStyle.borderColor === "rgb(43, 61, 81)" && detailStyle.foreground === "rgb(229, 237, 246)",
          JSON.stringify(detailStyle));
      }
    }

    await page.goto(baseUrl + "/streak", { waitUntil: "domcontentloaded", timeout: 30000 });
    const streakTrigger = page.getByRole("button", { name: /learning streak, zero days/i }).first();
    check("Signed-out streak preview is keyboard-accessible", await streakTrigger.count() === 1);
    if (await streakTrigger.count()) {
      await streakTrigger.click();
      const dialog = page.getByRole("dialog", { name: /unlock your learning streak/i });
      check("Streak prompt exposes an accessible modal dialog", await dialog.count() === 1);
      await page.keyboard.press("Tab");
      check("Tab keeps focus inside the streak dialog", await dialog.evaluate((node) => node.contains(document.activeElement)));
      await page.keyboard.press("Shift+Tab");
      check("Shift+Tab keeps focus inside the streak dialog", await dialog.evaluate((node) => node.contains(document.activeElement)));
      await page.keyboard.press("Escape");
      check("Escape closes the streak dialog", await page.getByRole("dialog").count() === 0);
      check("Closing the streak dialog restores trigger focus", await streakTrigger.evaluate((node) => node === document.activeElement));
    }

    const reducedContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const reducedPage = await reducedContext.newPage();
    await reducedPage.goto(baseUrl + "/", { waitUntil: "domcontentloaded", timeout: 30000 });
    const motionState = await reducedPage.evaluate(() => {
      const hero = document.querySelector(".hero-home .hero-copy");
      return {
        preferenceHonored: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        animationName: hero ? getComputedStyle(hero).animationName : "missing",
        transitionDuration: hero ? getComputedStyle(hero).transitionDuration : "missing",
      };
    });
    check("Reduced-motion preference is active in the browser", motionState.preferenceHonored);
    check("Hero entrance animation is disabled for reduced-motion users",
      motionState.animationName === "none",
      JSON.stringify(motionState));
    await reducedContext.close();

    check("No uncaught browser page errors", runtimeErrors.length === 0, runtimeErrors.join(" | ") || "none");

    const summary = {
      baseUrl,
      checkedViewports: [320, 1440],
      checkCount: checks.length,
      passedCount: checks.filter((item) => item.passed).length,
      failedCount: failures.length,
      checks,
      failures,
    };
    console.log(JSON.stringify(summary, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
