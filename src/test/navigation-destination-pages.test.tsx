import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MockExamPortalPage } from "../pages/MockExamPortalPage";
import { CommunityPage } from "../pages/CommunityPage";

describe("planned learning destinations", () => {
  it("does not imply an exam can start before reviewed question sets are available", () => {
    render(<MemoryRouter><MockExamPortalPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Mock Exam Portal" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Exam sessions are not available here yet" })).toBeInTheDocument();
    expect(screen.getByText(/No mock-exam session, timer, result summary, or exam-readiness score/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse subjects" })).toHaveAttribute("href", "/catalog");
    expect(screen.queryByRole("button", { name: /start mock exam/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });

  it("keeps the community page honest while posting, replies and moderation are not implemented", () => {
    render(<MemoryRouter><CommunityPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Community Forum" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Discussions are not open yet" })).toBeInTheDocument();
    expect(screen.getByText(/Posting, replies, editing, reporting, and moderation are not available/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Help shape the community" })).toHaveAttribute("href", "/feedback");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /post|reply|report/i })).not.toBeInTheDocument();
  });
});
