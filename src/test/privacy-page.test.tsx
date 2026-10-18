import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PrivacyPage } from "../pages/PrivacyPage";

describe("Privacy page", () => {
  it("explains optional Google sign-in and device-local study data", () => {
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { level: 1, name: /privacy notice/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /google sign-in/i })).toBeInTheDocument();
    expect(screen.getByText(/history, completed lessons, streak activity, and appearance are stored in this browser/i)).toBeInTheDocument();
    expect(screen.getByText(/not currently synced across devices/i)).toBeInTheDocument();
  });

  it("explains private feedback/support storage and how to contact CEStudy", () => {
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: /feedback and support/i })).toBeInTheDocument();
    expect(screen.getByText(/when you submit feedback or a support confirmation, the message is sent to CEStudy/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cestudy00@gmail.com/i })).toHaveAttribute("href", "mailto:cestudy00@gmail.com");
  });
});
