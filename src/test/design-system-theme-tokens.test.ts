import { describe, expect, it } from "vitest";
import stylesheet from "../styles/global.css?raw";

function themeRule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rule = stylesheet.match(new RegExp(escaped + "\\s*\\{([^}]*)\\}", "s"));
  expect(rule, "Expected semantic theme rule for " + selector).toBeTruthy();
  return rule?.[1] ?? "";
}

function expectTokens(rule: string, declarations: Array<[string, string]>) {
  for (const [token, value] of declarations) {
    expect(rule, "Expected " + token + " to equal " + value).toMatch(
      new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*:\\s*" + value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*;"),
    );
  }
}

describe("shared semantic theme token foundation", () => {
  it("defines the required light-theme semantic roles while keeping the existing brand blue", () => {
    expectTokens(themeRule(":root"), [
      ["--ui-page-bg", "#ffffff"],
      ["--ui-surface", "#ffffff"],
      ["--ui-surface-raised", "#ffffff"],
      ["--ui-surface-muted", "#f7f9fc"],
      ["--ui-text", "#24384b"],
      ["--ui-heading", "#0b263d"],
      ["--ui-text-muted", "#637487"],
      ["--ui-border", "#dce5ec"],
      ["--ui-focus", "#0754b5"],
      ["--ui-link", "#0754b5"],
      ["--ui-brand", "#0754b5"],
      ["--ui-brand-hover", "#06458f"],
    ]);
  });

  it("defines equivalent semantic roles for a future explicit dark theme", () => {
    expectTokens(themeRule(':root[data-theme="dark"]'), [
      ["--ui-page-bg", "#0b1421"],
      ["--ui-surface", "#121f30"],
      ["--ui-surface-raised", "#172538"],
      ["--ui-surface-muted", "#101c2b"],
      ["--ui-text", "#e5edf6"],
      ["--ui-heading", "#f3f7fb"],
      ["--ui-text-muted", "#b6c4d4"],
      ["--ui-border", "#2b3d51"],
      ["--ui-focus", "#90c4ff"],
      ["--ui-link", "#90c4ff"],
      ["--ui-brand", "#0754b5"],
    ]);
  });

  it("uses semantic tokens in shared shell, action, form, and error surfaces", () => {
    expect(stylesheet).toMatch(/\.site-header\s*\{[^}]*background:\s*var\(--ui-surface\)/s);
    expect(stylesheet).toMatch(/\.site-footer\s*\{[^}]*background:\s*var\(--ui-footer-bg\)/s);
    expect(stylesheet).toMatch(/\.button-primary\s*\{[^}]*background:\s*var\(--ui-brand\)/s);
    expect(stylesheet).toMatch(/\.button-secondary\s*\{[^}]*background:\s*var\(--ui-surface\)/s);
    expect(stylesheet).toMatch(/input,select\s*\{width:100%;[^}]*border:1px solid var\(--ui-control-border\)/s);
    expect(stylesheet).toMatch(/\.state-error\s*\{[^}]*background:\s*var\(--ui-error-bg\)/s);
  });
});
