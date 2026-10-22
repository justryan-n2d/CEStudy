import { describe, expect, it } from "vitest";

import stylesheet from "../styles/global.css?raw";

function cssRulesFor(selector: string): string[] {
  const rules: string[] = [];
  let cursor = 0;

  while (cursor < stylesheet.length) {
    const openingBrace = stylesheet.indexOf("{", cursor);
    if (openingBrace < 0) break;
    const closingBrace = stylesheet.indexOf("}", openingBrace + 1);
    if (closingBrace < 0) break;

    const previousBoundary = Math.max(
      stylesheet.lastIndexOf("}", openingBrace - 1),
      stylesheet.lastIndexOf("{", openingBrace - 1),
    );
    const ruleSelector = stylesheet
      .slice(previousBoundary + 1, openingBrace)
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();

    if (ruleSelector.split(",").some((part) => part.trim() === selector)) {
      rules.push(stylesheet.slice(openingBrace + 1, closingBrace));
    }
    cursor = openingBrace + 1;
  }

  return rules;
}

function resolveLightThemeColor(color: string): string {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;

  const variable = color.match(/^var\((--[a-z0-9-]+)\)$/i)?.[1];
  if (!variable) return color;

  const token = stylesheet.match(new RegExp(variable + ":\\s*(#[0-9a-f]{6})", "i"))?.[1];
  return token ?? color;
}

function cssColorFor(selector: string): string {
  const rules = cssRulesFor(selector);
  expect(rules.length, "Expected a CSS rule for " + selector).toBeGreaterThan(0);

  const color = rules
    .flatMap((rule) => rule.split(";"))
    .find((part) => part.trim().startsWith("color:"))
    ?.split(":").slice(1).join(":").trim();
  const resolved = color ? resolveLightThemeColor(color) : undefined;

  expect(resolved, "Expected a resolvable text color for " + selector).toMatch(/^#[0-9a-f]{6}$/i);
  return resolved ?? "#000000";
}

function luminance(hex: string): number {
  const channels = hex.slice(1).match(/../g)!.map((part) => parseInt(part, 16) / 255).map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground: string, background: string): number {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

describe("dark theme sign-in contrast", () => {
  it("keeps Google sign-in label readable on the dark streak unlock dialog", () => {
    expect(stylesheet).toContain(':root[data-theme="dark"] .streak-unlock-dialog > p');
    expect(stylesheet).toMatch(/\.google-signin-button\{[^}]*background:var\(--ui-brand-surface\)[^}]*color:var\(--ui-brand-text\)/);
    expect(stylesheet).toContain('--ui-brand-surface: #ffffff;');
    expect(stylesheet).toContain('--ui-brand-text: #1f1f1f;');
    expect(stylesheet).toContain(':root[data-theme="dark"] .button-primary:not(.google-signin-button)');
    expect(stylesheet).not.toMatch(/:root\[data-theme="dark"\]\s*\.google-signin-button\s*\{[^}]*background(?:-color)?:\s*#(?:131314|242428)/);
    expect(stylesheet).toContain(':root[data-theme="dark"] .google-signin-button:disabled');
  });
});

describe("shared theme tokens", () => {
  it("defines page, surface, text, heading, muted, and border tokens for dark mode", () => {
    expect(stylesheet).toContain('--ui-page-bg: #0b1421;');
    expect(stylesheet).toContain('--ui-surface: #121f30;');
    expect(stylesheet).toContain('--ui-surface-raised: #172538;');
    expect(stylesheet).toContain('--ui-text: #e5edf6;');
    expect(stylesheet).toContain('--ui-heading: #f3f7fb;');
    expect(stylesheet).toContain('--ui-text-muted: #b6c4d4;');
    expect(stylesheet).toContain('--ui-border: #2b3d51;');
    expect(stylesheet).toContain('--ui-focus: #0754b5;');
    expect(stylesheet).toContain('--ui-focus: #90c4ff;');
  });

  it.each([
    [".login-panel", "background:var(--ui-surface)"],
    [".profile-account-card", "background:var(--ui-surface)"],
    [".menu-link-card", "background:var(--ui-surface)"],
    [".history-list-item", "background:var(--ui-surface)"],
    [".streak-calendar-card", "background:var(--ui-surface)"],
    [".progress-list-item", "background:var(--ui-surface)"],
    [".community-launch-panel", "background:var(--ui-community-bg)"],
    [".privacy-content>section", "background:var(--ui-surface)"],
    ["input", "background:var(--ui-surface-raised)"],
    ["select", "background:var(--ui-surface-raised)"],
    [".streak-unlock-dialog", "background:var(--ui-surface)"],
  ])("%s uses a shared surface token", (selector, declaration) => {
    const matchingRules = cssRulesFor(selector);
    expect(matchingRules.length, "Expected a CSS rule for " + selector).toBeGreaterThan(0);
    expect(matchingRules.some((rule) => rule.includes(declaration))).toBe(true);
  });
});

describe("small text color contrast", () => {
  it.each([
    [".hero-note", "#f7f9fc"],
    [".year-number", "#ffffff"],
    [".year-arrow", "#ffffff"],
    ["input::placeholder", "#ffffff"],
    [".card-meta", "#ffffff"],
    [".practice-source", "#ffffff"],
  ])("%s meets WCAG AA normal-text contrast", (selector, background) => {
    const foreground = cssColorFor(selector);
    expect(contrastRatio(foreground, background), `${selector} contrast on ${background}`).toBeGreaterThanOrEqual(4.5);
  });
});

describe("theme-aware streak calendar indicators", () => {
  it.each([
    [".streak-calendar-day.is-today", "outline:2px solid var(--ui-focus)"],
    [".streak-calendar-day.is-selected", "outline:3px solid var(--ui-focus)"],
    [".streak-legend-dot.is-today", "outline:2px solid var(--ui-focus)"],
  ])("%s uses the theme-aware focus token", (selector, declaration) => {
    expect(stylesheet).toContain(`${selector}{${declaration}`);
  });
});
describe("selected date detail surface", () => {
  it("has one authoritative dark-theme rule using shared raised-surface tokens", () => {
    const rules = cssRulesFor(':root[data-theme="dark"] .streak-day-detail');
    expect(rules).toHaveLength(1);
    expect(rules[0]).toContain("background:var(--ui-surface-raised)");
    expect(rules[0]).toContain("border-color:var(--ui-border)");
    expect(rules[0]).toContain("color:var(--ui-text)");
  });
});
