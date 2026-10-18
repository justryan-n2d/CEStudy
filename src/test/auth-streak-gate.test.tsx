import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LearningStreakBadge } from "../components/LearningStreakBadge";
import { formatLocalDateKey, learningActivityStorageKey } from "../data/learning-progress";

const mockUseAuth = vi.hoisted(() => vi.fn());

vi.mock("../contexts/AuthContext", () => ({
  useAuth: mockUseAuth,
}));

beforeEach(() => {
  localStorage.clear();
  mockUseAuth.mockReset();
  mockUseAuth.mockReturnValue({
    user: null,
    loading: false,
    configured: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  });
});

describe("authenticated learning streak", () => {
  it("does not reveal the streak count to a signed-out visitor", () => {
    render(<MemoryRouter><LearningStreakBadge /></MemoryRouter>);

    expect(screen.getByText(/sign in with google to track your learning streak/i)).toBeInTheDocument();
    expect(screen.queryByText(/\d+ day(?:s)? streak/i)).not.toBeInTheDocument();
  });

  it("provides a link to Google sign-in", () => {
    render(<MemoryRouter><LearningStreakBadge /></MemoryRouter>);

    expect(screen.getByRole("link", { name: /sign in with google/i })).toHaveAttribute("href", "/login");
  });

  it("shows a per-account streak when a Supabase user is signed in", () => {
    const userId = "student-1";
    mockUseAuth.mockReturnValue({
      user: { id: userId },
      loading: false,
      configured: true,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    localStorage.setItem(learningActivityStorageKey(userId), JSON.stringify([formatLocalDateKey(new Date())]));

    render(<MemoryRouter><LearningStreakBadge /></MemoryRouter>);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("day streak")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /sign in with google/i })).not.toBeInTheDocument();
  });
});
