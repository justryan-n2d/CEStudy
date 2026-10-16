import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../styles/global.css", import.meta.url), "utf8");

function cssColorFor(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rule = stylesheet.match(new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`));
  expect(rule, `Expected a CSS rule for ${selector}`).not.toBeNull();
  const color = rule?.[1].match(/(?:^|;)\\s*color:\\s*(#[0-9a-f]{6})(?:;|$)/i)?.[1];
  expect(color, `Expected a literal six-digit text color for ${selector}`).toBeTruthy();
  return color ?? "#000000";
}

function luminance(hex: string): number {
  const [r, g, b] = hex.slice(1).match(/../g)!.map((part) => parseInt(part, 16) / 255).map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground: string, background: string): number {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

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
