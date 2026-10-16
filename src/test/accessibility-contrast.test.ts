import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync("src/styles/global.css", "utf8");

function cssColorFor(selector: string): string {
  const start = stylesheet.indexOf(`${selector}{`);
  expect(start, `Expected a CSS rule for ${selector}`).toBeGreaterThanOrEqual(0);
  if (start < 0) return "#000000";
  const end = stylesheet.indexOf("}", start);
  const rule = stylesheet.slice(start, end);
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
