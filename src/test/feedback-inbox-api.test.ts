import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { invokeMock } = vi.hoisted(() => ({ invokeMock: vi.fn() }));
vi.mock("../lib/supabase", () => ({ supabase: { functions: { invoke: invokeMock } } }));

import {
  getFeedbackInboxSessionToken,
  listFeedbackMessages,
  lockFeedbackInbox,
  unlockFeedbackInbox,
} from "../data/feedback-inbox";

beforeEach(() => {
  lockFeedbackInbox();
  invokeMock.mockReset();
});
afterEach(() => vi.restoreAllMocks());

describe("feedback inbox API error handling", () => {
  it("handles a non-Response error context and clears a session on 401", async () => {
    invokeMock.mockResolvedValueOnce({
      data: { ok: true, token: "test-owner-token", expiresAt: new Date(Date.now() + 60_000).toISOString() },
      error: null,
    });
    await unlockFeedbackInbox("test-owner-key-that-is-long-enough");
    expect(getFeedbackInboxSessionToken()).toBe("test-owner-token");

    invokeMock.mockResolvedValueOnce({ data: null, error: { context: { status: 401 } } });
    await expect(listFeedbackMessages()).rejects.toThrow(/expired|temporarily unavailable/i);
    expect(getFeedbackInboxSessionToken()).toBeNull();
  });

  it("does not throw a secondary parsing error for invalid JSON response bodies", async () => {
    invokeMock.mockResolvedValueOnce({
      data: { ok: true, token: "test-owner-token", expiresAt: new Date(Date.now() + 60_000).toISOString() },
      error: null,
    });
    await unlockFeedbackInbox("test-owner-key-that-is-long-enough");

    invokeMock.mockResolvedValueOnce({ data: null, error: { context: new Response("not json", { status: 500 }) } });
    await expect(listFeedbackMessages()).rejects.toThrow(/expired|temporarily unavailable/i);
  });
});
