import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const { invokeMock } = vi.hoisted(() => ({ invokeMock: vi.fn() }));
vi.mock("../lib/supabase", () => ({
  supabase: { functions: { invoke: invokeMock } },
}));

import { ContactPage } from "../pages/ContactPage";
import { SupportPage } from "../pages/SupportPage";
import { FeedbackPage } from "../pages/FeedbackPage";
import { BugReportsPage, buildGmailComposeUrl } from "../pages/BugReportsPage";

function renderPage(element: ReactNode) {
  return render(<MemoryRouter>{element}</MemoryRouter>);
}

beforeEach(() => {
  invokeMock.mockReset();
  invokeMock.mockResolvedValue({ data: { ok: true }, error: null });
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("contact, support, bug reports, and feedback", () => {
  it("offers four separate destinations from the contact page", () => {
    renderPage(<ContactPage />);
    expect(screen.getByRole("heading", { name: "Contact CEStudy" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View support options" })).toHaveAttribute("href", "/support");
    expect(screen.getByRole("link", { name: "Report a bug" })).toHaveAttribute("href", "/bug-reports");
    expect(screen.getByRole("link", { name: "Send feedback" })).toHaveAttribute("href", "/feedback");
  });

  it("shows the requested subject and report body in the Gmail draft URL", () => {
    const url = new URL(buildGmailComposeUrl({
      recipient: "bugs@example.com",
      summary: "Search does not work",
      page: "Subject catalog",
      observed: "Results stay the same",
      expected: "Results should update",
      steps: "Open catalog, then search",
    }));
    expect(url.origin + url.pathname).toBe("https://mail.google.com/mail/");
    expect(url.searchParams.get("to")).toBe("bugs@example.com");
    expect(url.searchParams.get("su")).toBe("CEStudy bug report: Search does not work");
    expect(url.searchParams.get("body")).toContain("Results stay the same");
    expect(url.searchParams.get("body")).toContain("Open catalog, then search");
  });

  it("shows the bug-report destination setup state until an email is configured", () => {
    renderPage(<BugReportsPage />);
    expect(screen.getByRole("heading", { name: "Report a bug" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open gmail draft/i })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(/recipient gmail address has not been configured/i);
  });

  it("sends feedback through the Edge Function and displays the exact success popup", async () => {
    const user = userEvent.setup();
    renderPage(<FeedbackPage />);
    await user.type(screen.getByLabelText(/Message/), "Please add clearer worked examples to the math topics.");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByRole("heading", { name: "message sent!" })).toBeInTheDocument();
    expect(invokeMock).toHaveBeenCalledWith("submit-public-message", expect.objectContaining({
      body: expect.objectContaining({ type: "feedback", category: "general" }),
    }));
  });

  it("shows a failure state when the private notification cannot be sent", async () => {
    invokeMock.mockResolvedValue({ data: { ok: false, message: "The authorized inbox could not be notified." }, error: null });
    const user = userEvent.setup();
    renderPage(<FeedbackPage />);
    await user.type(screen.getByLabelText(/Message/), "The subject title on this page seems incorrect.");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("The authorized inbox could not be notified.");
    expect(screen.queryByRole("heading", { name: "message sent!" })).not.toBeInTheDocument();
  });

  it("keeps the support confirmation disabled until a payment destination is configured", async () => {
    vi.stubEnv("VITE_GCASH_QR_URL", "");
    const user = userEvent.setup();
    renderPage(<SupportPage />);
    await user.click(screen.getByRole("button", { name: "View GCash details" }));
    expect(screen.getByText("The GCash QR code has not been configured yet.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Complete" })).toBeDisabled();
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it("records a configured support confirmation and shows the confirmation state", async () => {
    vi.stubEnv("VITE_GCASH_QR_URL", "https://assets.example.com/gcash-qr.png");
    const user = userEvent.setup();
    renderPage(<SupportPage />);
    await user.click(screen.getByRole("button", { name: "View GCash details" }));
    expect(screen.getByRole("img", { name: "GCash payment QR code" })).toHaveAttribute("src", "https://assets.example.com/gcash-qr.png");
    await user.click(screen.getByRole("checkbox", { name: /I have sent support using GCash/i }));
    await user.click(screen.getByRole("button", { name: "Complete" }));
    expect(await screen.findByRole("heading", { name: "Support confirmation sent" })).toBeInTheDocument();
    await waitFor(() => expect(invokeMock).toHaveBeenCalledWith("submit-public-message", expect.objectContaining({
      body: expect.objectContaining({ type: "support", provider: "gcash", confirmed: true }),
    })));
  });
});
