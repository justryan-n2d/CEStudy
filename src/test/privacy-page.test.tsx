import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PrivacyPage } from "../pages/PrivacyPage";

describe("Privacy notice", () => {
  it("explains local study data, feedback storage, and contact choices", () => {
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Privacy notice" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /browsing and study progress/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /optional google sign-in and account sessions/i })).toBeInTheDocument();
    expect(screen.getByText(/Google sign-in is optional/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign out control on your profile/i)).toBeInTheDocument();
    expect(screen.getByText(/opened lesson history and completed-lesson progress stay in your browser on this device/i)).toBeInTheDocument();
    expect(screen.getByText(/scoped to the signed-in Google user ID/i)).toBeInTheDocument();
    expect(screen.getByText(/not sent to CEStudy.s servers or synced across devices/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /feedback and support confirmations/i })).toBeInTheDocument();
    expect(screen.getByText(/only the authorized cestudy maintainer can read/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "cestudy00@gmail.com" })).toHaveAttribute("href", "mailto:cestudy00@gmail.com");
  });

  it("clarifies that a bug report is only sent if the visitor sends the Gmail draft", () => {
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>);

    expect(screen.getByText(/report a bug opens a prepared gmail draft/i)).toBeInTheDocument();
    expect(screen.getByText(/nothing is sent until you choose to send that email/i)).toBeInTheDocument();
  });

  it("provides a feedback link to request correction or deletion", () => {
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>);

    expect(screen.getByRole("link", { name: /send feedback/i })).toHaveAttribute("href", "/feedback");
    expect(screen.getByRole("link", { name: /contact cestudy/i })).toHaveAttribute("href", "/contact");
  });
});
