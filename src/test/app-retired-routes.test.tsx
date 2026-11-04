import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import App from "../App";

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

describe("retired student destinations", () => {
  it.each(["/review-materials", "/mock-exam-portal"])(
    "redirects the legacy %s URL to Subject Catalog",
    async (legacyPath) => {
      window.history.replaceState({}, "", legacyPath);
      render(<App />);

      await waitFor(() => expect(window.location.pathname).toBe("/catalog"));
    },
  );
});
