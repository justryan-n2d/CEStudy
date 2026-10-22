import { describe, expect, it } from "vitest";
import stylesheet from "../styles/global.css?raw";

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
      expect(stylesheet, `missing light token ${token}`).toContain(token);
      expect(stylesheet, `missing dark semantic token block for ${token}`).toContain(':root[data-theme="dark"]');
    }
  });

  it("keeps the CEStudy brand blue and routes keyboard focus through the theme token", () => {
    expect(stylesheet).toContain("--brand-blue:#0754B5");
    expect(stylesheet).toContain("outline:3px solid var(--ui-focus)");
  });

  it("styles the theme selector and existing app surfaces for dark mode", () => {
    expect(stylesheet).toContain(".theme-toggle");
    expect(stylesheet).toContain(':root[data-theme="dark"] .site-header');
    expect(stylesheet).toContain(':root[data-theme="dark"] .subject-card');
    expect(stylesheet).toContain(':root[data-theme="dark"] .latex-math-error');
    expect(stylesheet).toContain("@media(prefers-reduced-motion:reduce)");
  });
});
