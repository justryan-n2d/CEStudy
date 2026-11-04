import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

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
  vi.restoreAllMocks();
});

describe("contact, support, bug reports, and feedback", () => {
  it("shows the configured website contact and four distinct destinations", () => {
    renderPage(<ContactPage />);
    expect(screen.getByRole("link", { name: "cestudy00@gmail.com" })).toHaveAttribute("href", "mailto:cestudy00@gmail.com");
    expect(screen.getByRole("link", { name: "View support options" })).toHaveAttribute("href", "/support");
    expect(screen.getByRole("link", { name: /report a bug/i })).toHaveAttribute("href", "/bug-reports");
    expect(screen.getByRole("link", { name: /send feedback/i })).toHaveAttribute("href", "/feedback");
  });

  it("builds a Gmail draft with the recipient, automatic subject, and report details", () => {
    const url = new URL(buildGmailComposeUrl({
      recipient: "cestudy00@gmail.com",
      summary: "Search does not work",
      page: "Subject catalog",
      observed: "Results stay the same",
      expected: "Results should update",
      steps: "Open catalog, then search",
    }));
    expect(url.origin + url.pathname).toBe("https://mail.google.com/mail/");
    expect(url.searchParams.get("to")).toBe("cestudy00@gmail.com");
    expect(url.searchParams.get("su")).toBe("CEStudy bug report: Search does not work");
    expect(url.searchParams.get("body")).toContain("Results stay the same");
    expect(url.searchParams.get("body")).toContain("Open catalog, then search");
  });

  it("opens Gmail with the website address prefilled", async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderPage(<BugReportsPage />);
    await user.type(screen.getByLabelText(/Short summary/), "The search button is unresponsive");
    await user.type(screen.getByLabelText(/What happened/), "The search button does not update the result list.");
    await user.click(screen.getByRole("button", { name: /Open Gmail draft/i }));
    expect(open).toHaveBeenCalledTimes(1);
    const url = new URL(String(open.mock.calls[0][0]));
    expect(url.searchParams.get("to")).toBe("cestudy00@gmail.com");
    expect(url.searchParams.get("su")).toBe("CEStudy bug report: The search button is unresponsive");
  });

  it("sends feedback and displays the exact success popup", async () => {
    const user = userEvent.setup();
    renderPage(<FeedbackPage />);
    await user.type(screen.getByLabelText(/Message/), "Please add clearer worked examples to the math topics.");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByRole("heading", { name: "message sent!" })).toBeInTheDocument();
    expect(screen.getByText("Thank you for helping us improve CEStudy. Your feedback helps us make the site better for civil engineering students.")).toBeInTheDocument();
    expect(invokeMock).toHaveBeenCalledWith("submit-public-message", expect.objectContaining({
      body: expect.objectContaining({ type: "feedback", category: "general" }),
    }));
  });

  it("shows a loading state while feedback is being sent", async () => {
    let release: ((value: { data: { ok: boolean }; error: null }) => void) | undefined;
    invokeMock.mockImplementation(() => new Promise<{ data: { ok: boolean }; error: null }>(resolve => { release = resolve; }));
    const user = userEvent.setup();
    renderPage(<FeedbackPage />);
    await user.type(screen.getByLabelText(/Message/), "Please add clearer worked examples to the math topics.");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByRole("button", { name: /Sending message/i })).toBeDisabled();
    release?.({ data: { ok: true }, error: null });
    expect(await screen.findByRole("heading", { name: "message sent!" })).toBeInTheDocument();
  });

  it("handles a non-Response Supabase error context without throwing a clone error", async () => {
    invokeMock.mockResolvedValue({
      data: null,
      error: { message: "Edge Function returned a non-2xx status code", context: { status: 503 } },
    });
    const user = userEvent.setup();
    renderPage(<FeedbackPage />);
    await user.type(screen.getByLabelText(/Message/), "Please correct the formula shown in the second-year subject.");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't send this message. Check your connection and try again.");
    expect(screen.queryByText(/clone is not a function/i)).not.toBeInTheDocument();
  });

  it("shows a failure state when a notification cannot be sent", async () => {
    invokeMock.mockResolvedValue({ data: { ok: false, message: "The authorized inbox could not be notified." }, error: null });
    const user = userEvent.setup();
    renderPage(<FeedbackPage />);
    await user.type(screen.getByLabelText(/Message/), "The subject title on this page seems incorrect.");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("The authorized inbox could not be notified.");
    expect(screen.queryByRole("heading", { name: "message sent!" })).not.toBeInTheDocument();
  });

  it("keeps support completion disabled until GCash details are configured", async () => {
    vi.stubEnv("VITE_GCASH_QR_URL", "");
    const user = userEvent.setup();
    renderPage(<SupportPage gcashQrUrl="" />);
    await user.click(screen.getByRole("button", { name: "View GCash details" }));
    expect(screen.getByText("The GCash QR code has not been configured yet.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Complete" })).toBeDisabled();
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it("uses the saved QR and the GCash brand icon by default", async () => {
    const user = userEvent.setup();
    renderPage(<SupportPage />);
    expect(document.querySelector(".payment-mark-gcash img")).toHaveAttribute("src", "/branding/icons/gcash.svg");
    await user.click(screen.getByRole("button", { name: "View GCash details" }));
    expect(screen.getByRole("img", { name: "GCash payment QR code" })).toHaveAttribute("src", "/branding/gcash-support-qr.png");
  });

  it("records a configured support confirmation and shows the receipt state", async () => {
    const user = userEvent.setup();
    renderPage(<SupportPage gcashQrUrl="/test-gcash-qr.png" />);
    await user.click(screen.getByRole("button", { name: "View GCash details" }));
    expect(screen.getByRole("img", { name: "GCash payment QR code" })).toHaveAttribute("src", "/test-gcash-qr.png");
    await user.click(screen.getByRole("checkbox", { name: /I have sent support using GCash/i }));
    await user.click(screen.getByRole("button", { name: "Complete" }));
    expect(await screen.findByRole("heading", { name: "Support confirmation sent" })).toBeInTheDocument();
    expect(invokeMock).toHaveBeenCalledWith("submit-public-message", expect.objectContaining({
      body: expect.objectContaining({ type: "support", provider: "gcash", confirmed: true }),
    }));
  });
});
