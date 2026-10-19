import { describe, expect, it } from "vitest";

import stylesheet from "../styles/global.css?raw";

function cssColorFor(selector: string): string {
  const start = stylesheet.indexOf(`${selector}{`);
  expect(start, `Expected a CSS rule for ${selector}`).toBeGreaterThanOrEqual(0);
  if (start < 0) return "#000000";
  const end = stylesheet.indexOf("}", start);
  const rule = stylesheet.slice(start + selector.length + 1, end);
  const declaration = rule.split(";").find((part) => part.trim().startsWith("color:"));
  const color = declaration?.slice(declaration.indexOf(":") + 1).trim();
  expect(color, `Expected a literal text color for ${selector}`).toMatch(/^#[0-9a-f]{6}$/i);
  return color ?? "#000000";
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
    expect(stylesheet).not.toMatch(/:root\[data-theme="dark"\]\s*\.google-signin-button\s*\{[^}]*background(?:-color)?:\s*#(?:131314|242428)/);
    expect(stylesheet).toContain(':root[data-theme="dark"] .google-signin-button:disabled');
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
