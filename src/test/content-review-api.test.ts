import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { invokeMock } = vi.hoisted(() => ({ invokeMock: vi.fn() }));
vi.mock("../lib/supabase", () => ({ supabase: { functions: { invoke: invokeMock } } }));

import {
  fetchContentReviewBundle,
  getContentReviewSessionToken,
  lockContentReview,
  unlockContentReview,
} from "../data/content-review-api";

beforeEach(() => {
  lockContentReview();
  invokeMock.mockReset();
});
afterEach(() => vi.restoreAllMocks());

describe("content review API error handling", () => {
  it("handles a non-Response error context and clears the owner session on 401", async () => {
    invokeMock.mockResolvedValueOnce({
      data: { ok: true, token: "test-content-token", expiresAt: new Date(Date.now() + 60_000).toISOString() },
      error: null,
    });
    await unlockContentReview("test-owner-key-that-is-long-enough");
    expect(getContentReviewSessionToken()).toBe("test-content-token");

    invokeMock.mockResolvedValueOnce({ data: null, error: { context: { status: 401 } } });
    await expect(fetchContentReviewBundle()).rejects.toThrow(/temporarily unavailable/i);
    expect(getContentReviewSessionToken()).toBeNull();
  });

  it("does not throw a secondary parsing error for invalid JSON response bodies", async () => {
    invokeMock.mockResolvedValueOnce({
      data: { ok: true, token: "test-content-token", expiresAt: new Date(Date.now() + 60_000).toISOString() },
      error: null,
    });
    await unlockContentReview("test-owner-key-that-is-long-enough");

    invokeMock.mockResolvedValueOnce({ data: null, error: { context: new Response("not json", { status: 500 }) } });
    await expect(fetchContentReviewBundle()).rejects.toThrow(/temporarily unavailable/i);
  });
});
