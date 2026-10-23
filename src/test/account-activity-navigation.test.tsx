import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Layout } from "../components/Layout";

const mockUseAuth = vi.hoisted(() => vi.fn());
vi.mock("../contexts/AuthContext", () => ({ useAuth: mockUseAuth }));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseAuth.mockReturnValue({
    user: null,
    loading: false,
    configured: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  });
  localStorage.clear();
});

describe("account and learning activity navigation", () => {
  it("provides guest sign-in, local lesson history, and streak routes in the mobile More menu", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Layout><p>Page content</p></Layout></MemoryRouter>);

    await user.click(screen.getByRole("button", { name: /open more pages menu/i }));

    const menu = screen.getByRole("navigation", { name: "More CEStudy pages" });
    expect(within(menu).getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login");
    expect(within(menu).getByRole("link", { name: "Lesson history" })).toHaveAttribute("href", "/history");
    expect(within(menu).getByRole("link", { name: "Streak calendar" })).toHaveAttribute("href", "/streak");
  });

  it("routes signed-in students to their profile without adding a fifth bottom tab", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "google-student", email: "student@example.com" },
      loading: false,
      configured: true,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    const user = userEvent.setup();
    render(<MemoryRouter><Layout><p>Page content</p></Layout></MemoryRouter>);

    await user.click(screen.getByRole("button", { name: /open more pages menu/i }));
    const menu = screen.getByRole("navigation", { name: "More CEStudy pages" });
    expect(within(menu).getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("navigation", { name: "Quick navigation" }).querySelectorAll("a")).toHaveLength(4);
  });
});
