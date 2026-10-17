import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const { invokeMock } = vi.hoisted(() => ({ invokeMock: vi.fn() }));
vi.mock("../lib/supabase", () => ({ supabase: { functions: { invoke: invokeMock } } }));

import { Layout } from "../components/Layout";
import { FeedbacksPage } from "../pages/FeedbacksPage";
import type { FeedbackRecord } from "../data/feedback-inbox";
import { FeedbackPage } from "../pages/FeedbackPage";
import { HomePage } from "../pages/HomePage";
import {
  clearFeedbackInboxSession,
  lockFeedbackInbox,
  unlockFeedbackInbox,
} from "../data/feedback-inbox";

let mockUnreadCount = 1;
const sampleFeedback: FeedbackRecord[] = [{
  id: "d9b2f95b-5a9c-4ba8-9a8f-bdc2bd7c3c5e",
  category: "content",
  message: "Please add worked examples for the trigonometry section.",
  created_at: "2026-10-10T12:30:00.000Z",
  read_at: null,
}];

function makeReply(action: string) {
  if (action === "mark-read") { mockUnreadCount = 0; sampleFeedback[0].read_at = new Date().toISOString(); return { data: { ok: true }, error: null }; }
  if (action === "unlock") return { data: { ok: true, token: "signed-owner-token", expiresAt: new Date(Date.now() + 30 * 60_000).toISOString() }, error: null };
  if (action === "unread-count") return { data: { ok: true, unreadCount: mockUnreadCount }, error: null };
  if (action === "list") return { data: { ok: true, messages: sampleFeedback, hasMore: false }, error: null };
  return { data: { ok: true }, error: null };
}

beforeEach(() => {
  lockFeedbackInbox();
  mockUnreadCount = 1;
  sampleFeedback[0].read_at = null;
  invokeMock.mockReset();
  invokeMock.mockImplementation((_name: string, options: { body: { action: string } }) => Promise.resolve(makeReply(options.body.action)));
});
afterEach(() => {
  cleanup();
  clearFeedbackInboxSession();
  vi.restoreAllMocks();
});

describe("anonymous feedback submission", () => {
  it("does not ask for an account name or email address", () => {
    render(<MemoryRouter><FeedbackPage /></MemoryRouter>);
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.getByText(/privately and anonymously/i)).toBeInTheDocument();
  });
});

describe("owner-only feedback inbox", () => {
  it("does not show the owner navigation item to signed-out visitors", () => {
    render(<MemoryRouter><Layout><HomePage /></Layout></MemoryRouter>);
    expect(screen.queryByRole("link", { name: /Feedbacks/ })).not.toBeInTheDocument();
  });

  it("shows the Feedbacks link and red unread dot only after owner unlock", async () => {
    render(<MemoryRouter><Layout><HomePage /></Layout></MemoryRouter>);
    await unlockFeedbackInbox("test-owner-access-key-at-least-32-characters");
    expect(await screen.findByRole("link", { name: /Feedbacks/ })).toBeInTheDocument();
    expect(await screen.findByRole("status", { name: "Unread feedback" })).toBeInTheDocument();
    expect(invokeMock).toHaveBeenCalledWith("feedback-inbox-admin", expect.objectContaining({
      body: { action: "unread-count" },
      headers: { "x-feedback-inbox-token": "signed-owner-token" },
    }));
  });

  it("requires unlocking and displays each message as Anonymous with a sent date", async () => {
    render(<MemoryRouter><FeedbacksPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Unlock feedback inbox" })).toBeInTheDocument();
    expect(screen.queryByText(sampleFeedback[0].message)).not.toBeInTheDocument();
    await unlockFeedbackInbox("test-owner-access-key-at-least-32-characters");
    expect(await screen.findByText("Anonymous")).toBeInTheDocument();
    expect(screen.getByText("Content correction")).toBeInTheDocument();
    expect(screen.getByText(sampleFeedback[0].message)).toBeInTheDocument();
    expect(document.querySelector("time")).toHaveAttribute("dateTime", sampleFeedback[0].created_at);
  });

  it("marks a message as read only through the owner-authenticated function and clears the red dot immediately", async () => {
    const user = userEvent.setup();
    await unlockFeedbackInbox("test-owner-access-key-at-least-32-characters");
    render(<MemoryRouter><Layout><FeedbacksPage /></Layout></MemoryRouter>);
    await screen.findByRole("link", { name: /Feedbacks/ });
    expect(await screen.findByRole("status", { name: "Unread feedback" })).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: /Anonymous/ }));
    await waitFor(() => expect(invokeMock).toHaveBeenCalledWith("feedback-inbox-admin", expect.objectContaining({
      body: { action: "mark-read", id: sampleFeedback[0].id },
      headers: { "x-feedback-inbox-token": "signed-owner-token" },
    })));
    await waitFor(() => expect(screen.queryByRole("status", { name: "Unread feedback" })).not.toBeInTheDocument());
  });
});
