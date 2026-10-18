import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StreakPage } from "../pages/StreakPage";
import { formatLocalDateKey, learningActivityStorageKey } from "../data/learning-progress";

const mockUseAuth = vi.hoisted(() => vi.fn());

vi.mock("../contexts/AuthContext", () => ({ useAuth: mockUseAuth }));

beforeEach(() => {
  localStorage.clear();
  mockUseAuth.mockReset();
  mockUseAuth.mockReturnValue({
    user: { id: "calendar-test-user", email: "student@example.com" },
    loading: false,
    configured: true,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  });
});

describe("learning streak calendar", () => {
  it("highlights study days from the signed-in account's activity history", () => {
    const today = new Date();
    localStorage.setItem(
      learningActivityStorageKey("calendar-test-user"),
      JSON.stringify([formatLocalDateKey(today)]),
    );

    render(<MemoryRouter><StreakPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: /streak calendar/i })).toBeInTheDocument();
    expect(screen.getByText(/current streak/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /study day/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/study days are highlighted/i)).toBeInTheDocument();
  });

  it("does not show another account's streak history", () => {
    localStorage.setItem(
      learningActivityStorageKey("another-user"),
      JSON.stringify([formatLocalDateKey(new Date())]),
    );

    render(<MemoryRouter><StreakPage /></MemoryRouter>);

    expect(screen.getByText(/no study days recorded this month/i)).toBeInTheDocument();
  });

  it("encourages signed-out visitors to sign in without exposing a private streak count", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      configured: true,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    localStorage.setItem(
      learningActivityStorageKey("another-user"),
      JSON.stringify([formatLocalDateKey(new Date())]),
    );

    render(<MemoryRouter><StreakPage /></MemoryRouter>);

    expect(screen.getByRole("link", { name: /sign in with google/i })).toHaveAttribute("href", "/profile");
    expect(screen.getByText(/sign in to view your streak history/i)).toBeInTheDocument();
  });
});
