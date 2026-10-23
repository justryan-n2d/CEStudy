import { describe, expect, it } from "vitest";
import stylesheet from "../styles/global.css?raw";

const lightTokenBlock = stylesheet.match(/:root\s*\{(?=[^}]*--ui-page-bg)[^}]+\}/)?.[0] ?? "";
const darkTokenBlock = stylesheet.match(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/)?.[1] ?? "";

describe("semantic theme token foundation", () => {
  it("defines the required light and dark semantic color roles", () => {
    for (const token of [
      "--ui-page-bg",
      "--ui-surface",
      "--ui-surface-raised",
      "--ui-surface-muted",
      "--ui-text",
      "--ui-heading",
      "--ui-text-muted",
      "--ui-border",
      "--ui-hover",
      "--ui-focus",
      "--ui-link",
      "--ui-success-bg",
      "--ui-warning-bg",
      "--ui-error-bg",
      "--ui-disabled-bg",
    ]) {
      expect(lightTokenBlock, "missing light token " + token).toContain(token);
      expect(darkTokenBlock, "missing dark token " + token).toContain(token);
    }
  });

  it("keeps the CEStudy brand blue and routes keyboard focus through the theme token", () => {
    expect(stylesheet).toContain("--brand-blue:#0754B5");
    expect(stylesheet).toContain("outline:3px solid var(--ui-focus)");
  });


  it("provides dark-theme overrides for the owner content-review workspace", () => {
    for (const selector of [
      ".review-summary-strip > div",
      ".review-summary-strip strong",
      ".review-summary-strip span",
      ".content-review-header p", 
      ".content-review-tabs",
      ".content-review-tabs button",
      ".content-review-tabs button.active",
      ".content-review-tabs button span", 
      ".content-review-list",
      ".content-review-list-item",
      ".content-review-list-item.active", 
      ".content-review-detail",
      ".review-detail-card",
      ".review-detail-card p",
      ".review-source-note", 
      ".review-answer-details",
      ".review-answer-details summary", 
      ".review-answer-body",
      ".review-action-panel textarea",
      ".review-confirm-check",
      ".review-action-panel .form-field small", 
    ]) {
      expect(stylesheet, "missing dark-theme override for " + selector)
        .toContain(':root[data-theme="dark"] ' + selector);
    }
  });

  it("styles the theme selector and existing app surfaces for dark mode", () => {
    expect(stylesheet).toContain(".theme-toggle");
    expect(stylesheet).toContain(':root[data-theme="dark"] .site-header');
    expect(stylesheet).toContain(':root[data-theme="dark"] .subject-card');
    expect(stylesheet).toContain(':root[data-theme="dark"] .latex-math-error');
    expect(stylesheet).toContain("@media(prefers-reduced-motion:reduce)");
  });
});
