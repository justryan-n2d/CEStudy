import { describe, expect, it } from "vitest";
import { safeInternalReturnPath } from "../lib/safe-return-path";

describe("safeInternalReturnPath", () => {
  const origin = "https://cestudy.pages.dev";

  it("preserves a same-origin route, query, and fragment", () => {
    expect(safeInternalReturnPath("/study/basic-algebra/7?from=history#example", "/profile", origin))
      .toBe("/study/basic-algebra/7?from=history#example");
  });

  it("rejects an external destination", () => {
    expect(safeInternalReturnPath("https://evil.example/collect", "/profile", origin))
      .toBe("/profile");
  });

  it("rejects protocol-relative destinations", () => {
    expect(safeInternalReturnPath("//evil.example/collect", "/streak", origin))
      .toBe("/streak");
  });

  it("rejects backslash-based protocol-relative destinations", () => {
    expect(safeInternalReturnPath("\\\\evil.example\\collect", "/profile", origin))
      .toBe("/profile");
  });

  it("prevents a login-to-login redirect loop", () => {
    expect(safeInternalReturnPath("/login?next=/streak", "/profile", origin))
      .toBe("/profile");
  });

  it("uses Profile for empty, malformed, or unsafe fallback values", () => {
    expect(safeInternalReturnPath("", "/login", origin)).toBe("/profile");
    expect(safeInternalReturnPath("/streak", "https://evil.example", origin)).toBe("/streak");
  });
});
