import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    configured: true,
    signInWithGoogle: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn(),
  });
});

describe("authenticated learning streak", () => {
  it("shows a muted zero streak to signed-out visitors", () => {
    render(<MemoryRouter><LearningStreakBadge /></MemoryRouter>);

    const lockedStreak = screen.getByRole("button", { name: /learning streak, zero days/i });
    expect(lockedStreak).toHaveClass("learning-streak-locked");
    expect(lockedStreak).toHaveTextContent("0");
    expect(lockedStreak).toHaveTextContent("day streak");
    expect(lockedStreak).toHaveTextContent(/sign in to unlock/i);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens an accessible prompt when a signed-out visitor clicks the streak", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><LearningStreakBadge /></MemoryRouter>);

    await user.click(screen.getByRole("button", { name: /learning streak, zero days/i }));

    expect(screen.getByRole("dialog", { name: /unlock your learning streak/i })).toBeInTheDocument();
    expect(screen.getByText(/you can still browse the full engineering library/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
  });

  it("starts Google login from the prompt", async () => {
    const signInWithGoogle = vi.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      configured: true,
      signInWithGoogle,
      signOut: vi.fn(),
    });
    const user = userEvent.setup();
    render(<MemoryRouter><LearningStreakBadge /></MemoryRouter>);

    await user.click(screen.getByRole("button", { name: /learning streak, zero days/i }));
    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    expect(signInWithGoogle).toHaveBeenCalledOnce();
  });

  it("explains missing OAuth configuration and disables the login action", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      configured: false,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    const user = userEvent.setup();
    render(<MemoryRouter><LearningStreakBadge /></MemoryRouter>);

    await user.click(screen.getByRole("button", { name: /learning streak, zero days/i }));

    expect(screen.getByText(/google sign-in is not configured/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeDisabled();
  });

  it("closes the prompt with Escape and returns focus to the streak trigger", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><LearningStreakBadge /></MemoryRouter>);
    const trigger = screen.getByRole("button", { name: /learning streak, zero days/i });

    await user.click(trigger);
    expect(screen.getByRole("button", { name: "Close streak sign-in prompt" })).toHaveFocus();
    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps keyboard focus inside the unlock dialog", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><LearningStreakBadge /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: /learning streak, zero days/i }));

    const closeButton = screen.getByRole("button", { name: "Close streak sign-in prompt" });
    const googleButton = screen.getByRole("button", { name: /continue with google/i });
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(googleButton).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it("shows a per-account streak when a Supabase Google user is signed in", () => {
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
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /learning streak, zero days/i })).not.toBeInTheDocument();
  });
});
