import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PrivacyPage } from "../pages/PrivacyPage";

describe("Privacy notice", () => {
  it("explains public browsing, optional Google sign-in, and device-local study data", () => {
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Privacy notice" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /browsing and study progress/i })).toBeInTheDocument();
    expect(screen.getByText(/stay in your browser on this device/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /google sign-in/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /study data stored in this browser/i })).toBeInTheDocument();
    expect(screen.getByText(/streak activity is kept under the signed-in Supabase user ID/i)).toBeInTheDocument();
    expect(screen.getByText(/not currently synced across devices/i)).toBeInTheDocument();
  });

  it("explains private feedback and support-confirmation storage", () => {
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: /feedback and support confirmations/i })).toBeInTheDocument();
    expect(screen.getByText(/only the authorized CEStudy maintainer can read these messages/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "cestudy00@gmail.com" })).toHaveAttribute("href", "mailto:cestudy00@gmail.com");
  });

  it("explains that bug reports are sent only when the visitor sends the Gmail draft", () => {
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>);

    expect(screen.getByText(/report a bug opens a prepared Gmail draft/i)).toBeInTheDocument();
    expect(screen.getByText(/nothing is sent until you choose to send that email/i)).toBeInTheDocument();
  });

  it("provides links for contact, feedback, and correction/deletion requests", () => {
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>);

    expect(screen.getByRole("link", { name: /send feedback/i })).toHaveAttribute("href", "/feedback");
    expect(screen.getByRole("link", { name: /contact cestudy/i })).toHaveAttribute("href", "/contact");
  });
});
