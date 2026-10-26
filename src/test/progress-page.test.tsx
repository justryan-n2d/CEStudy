import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ProgressPage } from "../pages/ProgressPage";
import { learningActivityStorageKey, learningProgressStorageKey, setLessonCompleted } from "../data/learning-progress";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "progress-test-user", email: "student@example.com" },
    loading: false,
    configured: true,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  }),
}));

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("student progress page", () => {
  it("explains the empty state and links back to the library", () => {
    render(<MemoryRouter><ProgressPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "No completed lessons yet" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Learning streak" })).not.toBeInTheDocument();
    expect(screen.getByText(/stay in this browser on this device/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse the library" })).toHaveAttribute("href", "/catalog");
  });

  it("lists completed lessons and links to the exact lesson route", () => {
    setLessonCompleted({
      lessonId: "lesson-1",
      subjectSlug: "basic-algebra",
      unitNumber: 3,
      title: "Factorization",
    }, true, "progress-test-user");

    render(<MemoryRouter><ProgressPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Factorization" })).toBeInTheDocument();
    expect(screen.getByText("1", { selector: ".progress-list-heading strong" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open lesson/i })).toHaveAttribute("href", "/study/basic-algebra/3");
  });

  it("keeps progress when the student cancels the clear action", async () => {
    const user = userEvent.setup();
    setLessonCompleted({
      lessonId: "lesson-1",
      subjectSlug: "basic-algebra",
      unitNumber: 1,
      title: "Algebra Foundations",
    }, true, "progress-test-user");
    vi.stubGlobal("confirm", vi.fn(() => false));

    render(<MemoryRouter><ProgressPage /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: "Clear progress and streak" }));

    expect(screen.getByRole("heading", { name: "Algebra Foundations" })).toBeInTheDocument();
    expect(localStorage.getItem(learningProgressStorageKey("progress-test-user"))).not.toBeNull();
  });

  it("allows clearing streak history even when no lesson remains checked", async () => {
    const user = userEvent.setup();
    setLessonCompleted({
      lessonId: "lesson-3",
      subjectSlug: "basic-algebra",
      unitNumber: 3,
      title: "Factoring",
    }, true, "progress-test-user");
    setLessonCompleted({
      lessonId: "lesson-3",
      subjectSlug: "basic-algebra",
      unitNumber: 3,
      title: "Factoring",
    }, false, "progress-test-user");
    vi.stubGlobal("confirm", vi.fn(() => true));

    render(<MemoryRouter><ProgressPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "No completed lessons yet" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear progress and streak" }));

    expect(localStorage.getItem(learningActivityStorageKey("progress-test-user"))).toBeNull();
  });

  it("clears local progress after confirmation", async () => {
    const user = userEvent.setup();
    setLessonCompleted({
      lessonId: "lesson-2",
      subjectSlug: "basic-algebra",
      unitNumber: 2,
      title: "Linear Equations",
    }, true, "progress-test-user");
    vi.stubGlobal("confirm", vi.fn(() => true));

    render(<MemoryRouter><ProgressPage /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: "Clear progress and streak" }));

    expect(screen.getByRole("heading", { name: "No completed lessons yet" })).toBeInTheDocument();
    expect(localStorage.getItem(learningProgressStorageKey("progress-test-user"))).toBeNull();
  });
});
