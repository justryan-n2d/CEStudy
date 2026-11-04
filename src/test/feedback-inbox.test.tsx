import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const { invokeMock } = vi.hoisted(() => ({ invokeMock: vi.fn() }));
vi.mock("../lib/supabase", () => ({ hasSupabaseConfig: false, supabase: { functions: { invoke: invokeMock } } }));

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
const initialFeedback: Array<FeedbackRecord & { is_pinned: boolean }> = [
  {
    id: "d9b2f95b-5a9c-4ba8-9a8f-bdc2bd7c3c5e",
    category: "content",
    message: "Please add worked examples for the trigonometry section.",
    created_at: "2026-10-10T12:30:00.000Z",
    read_at: null,
    is_pinned: false,
  },
  {
    id: "b52f0d50-ec2a-4e20-9c1a-2d65f4a43b19",
    category: "general",
    message: "The year-level navigation should explain prerequisites.",
    created_at: "2026-10-08T12:30:00.000Z",
    read_at: "2026-10-08T13:00:00.000Z",
    is_pinned: false,
  },
];
let sampleFeedback: Array<FeedbackRecord & { is_pinned: boolean }> = [];


function makeReply(action: string, body: { id?: string; isPinned?: boolean } = {}) {
  const target = sampleFeedback.find(item => item.id === body.id);
  if (action === "mark-read") {
    if (target && !target.read_at) target.read_at = new Date().toISOString();
    mockUnreadCount = sampleFeedback.filter(item => !item.read_at).length;
    return { data: { ok: true }, error: null };
  }
  if (action === "set-pin") {
    if (target) target.is_pinned = Boolean(body.isPinned);
    return { data: { ok: true }, error: null };
  }
  if (action === "delete") {
    const index = sampleFeedback.findIndex(item => item.id === body.id);
    if (index >= 0) sampleFeedback.splice(index, 1);
    mockUnreadCount = sampleFeedback.filter(item => !item.read_at).length;
    return { data: { ok: true }, error: null };
  }
  if (action === "unlock") return { data: { ok: true, token: "signed-owner-token", expiresAt: new Date(Date.now() + 30 * 60_000).toISOString() }, error: null };
  if (action === "unread-count") return { data: { ok: true, unreadCount: mockUnreadCount }, error: null };
  if (action === "list") {
    const messages = [...sampleFeedback].sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned) || Date.parse(b.created_at) - Date.parse(a.created_at));
    return { data: { ok: true, messages, hasMore: false }, error: null };
  }
  return { data: { ok: true }, error: null };
}

beforeEach(() => {
  lockFeedbackInbox();
  sampleFeedback = initialFeedback.map(item => ({ ...item }));
  mockUnreadCount = sampleFeedback.filter(item => !item.read_at).length;
  invokeMock.mockReset();
  invokeMock.mockImplementation((name: string, options: { body: { action?: string; id?: string; isPinned?: boolean; type?: string } }) => {
    if (name === "submit-public-message") {
      mockUnreadCount += 1;
      sampleFeedback.push({
        id: "b99f9d20-4aa1-43bd-88fc-ae8ee3bf44d7",
        category: "general",
        message: "Please add another worked example.",
        created_at: new Date().toISOString(),
        read_at: null,
        is_pinned: false,
      });
      return Promise.resolve({ data: { ok: true }, error: null });
    }
    return Promise.resolve(makeReply(options.body.action ?? "", options.body));
  });
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
    expect((await screen.findAllByText("Anonymous")).length).toBeGreaterThan(0);
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
    await user.click(await screen.findByRole("button", { name: /Please add worked examples for the trigonometry section/ }));
    await waitFor(() => expect(invokeMock).toHaveBeenCalledWith("feedback-inbox-admin", expect.objectContaining({
      body: { action: "mark-read", id: sampleFeedback[0].id },
      headers: { "x-feedback-inbox-token": "signed-owner-token" },
    })));
    await waitFor(() => expect(screen.queryByRole("status", { name: "Unread feedback" })).not.toBeInTheDocument());
  });
  it("shows an unread dot on the More menu button while new feedback is unread", async () => {
    render(<MemoryRouter><Layout><HomePage /></Layout></MemoryRouter>);
    await unlockFeedbackInbox("test-owner-access-key-at-least-32-characters");
    const menuButton = await screen.findByRole("button", { name: /Open more pages menu/ });
    await waitFor(() => expect(menuButton.querySelector(".feedback-unread-dot")).toBeInTheDocument());
  });

  it("pins a message at the top and restores chronological order when unpinned", async () => {
    const user = userEvent.setup();
    await unlockFeedbackInbox("test-owner-access-key-at-least-32-characters");
    render(<MemoryRouter><FeedbacksPage /></MemoryRouter>);

    const olderMessage = initialFeedback[1].message;
    const olderCard = (await screen.findByText(olderMessage)).closest("article");
    if (!olderCard) throw new Error("Older feedback card was not rendered");
    await user.click(within(olderCard).getByRole("button", { name: "More feedback actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Pin" }));

    await waitFor(() => expect(invokeMock).toHaveBeenCalledWith("feedback-inbox-admin", expect.objectContaining({
      body: { action: "set-pin", id: initialFeedback[1].id, isPinned: true },
      headers: { "x-feedback-inbox-token": "signed-owner-token" },
    })));
    await waitFor(() => expect(within(screen.getAllByRole("article")[0]).getByText(olderMessage)).toBeInTheDocument());
    const pinnedCard = screen.getByText(olderMessage).closest("article");
    expect(pinnedCard).not.toBeNull();
    expect(within(pinnedCard!).getByLabelText("Pinned feedback")).toBeInTheDocument();

    await user.click(within(pinnedCard!).getByRole("button", { name: "More feedback actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Unpin" }));
    await waitFor(() => expect(invokeMock).toHaveBeenCalledWith("feedback-inbox-admin", expect.objectContaining({
      body: { action: "set-pin", id: initialFeedback[1].id, isPinned: false },
      headers: { "x-feedback-inbox-token": "signed-owner-token" },
    })));
    await waitFor(() => expect(within(screen.getAllByRole("article")[0]).getByText(initialFeedback[0].message)).toBeInTheDocument());
    const unpinnedCard = screen.getByText(olderMessage).closest("article");
    expect(unpinnedCard).not.toBeNull();
    expect(within(unpinnedCard!).queryByLabelText("Pinned feedback")).not.toBeInTheDocument();
    await user.click(within(unpinnedCard!).getByRole("button", { name: "More feedback actions" }));
    expect(screen.getByRole("menuitem", { name: "Pin" })).toBeInTheDocument();
  });

  it("deletes feedback through the owner-authenticated function and removes it from the inbox", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    await unlockFeedbackInbox("test-owner-access-key-at-least-32-characters");
    render(<MemoryRouter><FeedbacksPage /></MemoryRouter>);

    const message = initialFeedback[1].message;
    const card = (await screen.findByText(message)).closest("article");
    if (!card) throw new Error("Feedback card was not rendered");
    await user.click(within(card).getByRole("button", { name: "More feedback actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Delete" }));

    await waitFor(() => expect(invokeMock).toHaveBeenCalledWith("feedback-inbox-admin", expect.objectContaining({
      body: { action: "delete", id: initialFeedback[1].id },
      headers: { "x-feedback-inbox-token": "signed-owner-token" },
    })));
    await waitFor(() => expect(screen.queryByText(message)).not.toBeInTheDocument());
  });

  it("refreshes the unread dot immediately after a new feedback submission in the same app session", async () => {
    const user = userEvent.setup();
    mockUnreadCount = 0;
    sampleFeedback.forEach(item => { item.read_at = item.created_at; });
    await unlockFeedbackInbox("test-owner-access-key-at-least-32-characters");
    render(<MemoryRouter><Layout><FeedbackPage /></Layout></MemoryRouter>);

    expect(screen.queryByRole("status", { name: "Unread feedback" })).not.toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: /Message/ }), "Please add another worked example.");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByRole("heading", { name: "message sent!" })).toBeInTheDocument();
    expect(await screen.findByRole("status", { name: "Unread feedback" })).toBeInTheDocument();
  });

});
