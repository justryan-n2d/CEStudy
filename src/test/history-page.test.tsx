import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HistoryPage } from "../pages/HistoryPage";
import { recordOpenedLesson } from "../data/learning-history";

const mockUseAuth = vi.hoisted(() => vi.fn());
vi.mock("../contexts/AuthContext", () => ({ useAuth: mockUseAuth }));

beforeEach(() => {
  localStorage.clear();
  mockUseAuth.mockReset();
  mockUseAuth.mockReturnValue({
    user: null,
    loading: false,
    configured: true,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("recently opened lesson history", () => {
  it("shows only the active account's history and refreshes after account switching", () => {
    recordOpenedLesson({
      lessonId: "account-a-lesson",
      subjectSlug: "basic-algebra",
      unitNumber: 1,
      title: "Account A lesson",
    }, new Date("2026-10-16T10:00:00.000Z"), "account-a");
    recordOpenedLesson({
      lessonId: "account-b-lesson",
      subjectSlug: "basic-algebra",
      unitNumber: 2,
      title: "Account B lesson",
    }, new Date("2026-10-17T10:00:00.000Z"), "account-b");

    mockUseAuth.mockReturnValue({
      user: { id: "account-a" },
      loading: false,
      configured: true,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });

    const view = render(<MemoryRouter><HistoryPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Account A lesson" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Account B lesson" })).not.toBeInTheDocument();

    mockUseAuth.mockReturnValue({
      user: { id: "account-b" },
      loading: false,
      configured: true,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    view.rerender(<MemoryRouter><HistoryPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Account B lesson" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Account A lesson" })).not.toBeInTheDocument();
  });
  it("shows opened lessons in newest-first order with a direct link back to the lesson", () => {
    recordOpenedLesson({
      lessonId: "algebra-1",
      subjectSlug: "basic-algebra",
      unitNumber: 1,
      title: "Algebra Foundations",
    }, new Date("2026-10-16T10:00:00.000Z"));
    recordOpenedLesson({
      lessonId: "algebra-2",
      subjectSlug: "basic-algebra",
      unitNumber: 2,
      title: "Linear Equations",
    }, new Date("2026-10-17T10:00:00.000Z"));

    render(<MemoryRouter><HistoryPage /></MemoryRouter>);

    const lessons = screen.getAllByRole("heading", { level: 2 });
    expect(lessons[0]).toHaveTextContent("Linear Equations");
    expect(lessons[1]).toHaveTextContent("Algebra Foundations");
    expect(screen.getAllByRole("link", { name: /open lesson/i })[0]).toHaveAttribute("href", "/study/basic-algebra/2");
  });

  it("clears history only after confirmation", async () => {
    const user = userEvent.setup();
    recordOpenedLesson({
      lessonId: "algebra-1",
      subjectSlug: "basic-algebra",
      unitNumber: 1,
      title: "Algebra Foundations",
    });
    vi.stubGlobal("confirm", vi.fn(() => true));

    render(<MemoryRouter><HistoryPage /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: /clear history/i }));

    expect(screen.getByRole("heading", { name: "No opened lessons yet" })).toBeInTheDocument();
  });
});
