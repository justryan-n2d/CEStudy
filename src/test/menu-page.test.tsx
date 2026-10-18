import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MenuPage } from "../pages/MenuPage";
import { ThemeProvider } from "../contexts/ThemeContext";

const mockUseAuth = vi.hoisted(() => vi.fn());

vi.mock("../contexts/AuthContext", () => ({ useAuth: mockUseAuth }));

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  mockUseAuth.mockReset();
  mockUseAuth.mockReturnValue({
    user: null,
    loading: false,
    configured: true,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  });
});

function renderMenu() {
  return render(
    <MemoryRouter>
      <ThemeProvider><MenuPage /></ThemeProvider>
    </MemoryRouter>,
  );
}

describe("mobile menu page", () => {
  it("shows profile, history, streak, community, support, feedback, and bug report links", () => {
    renderMenu();

    expect(screen.getByRole("link", { name: /profile/i })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("link", { name: /history/i })).toHaveAttribute("href", "/history");
    expect(screen.getByRole("link", { name: /streak/i })).toHaveAttribute("href", "/streak");
    expect(screen.getByRole("link", { name: /community/i })).toHaveAttribute("href", "/community");
    expect(screen.getByRole("link", { name: /support us/i })).toHaveAttribute("href", "/support");
    expect(screen.getByRole("link", { name: /send feedback/i })).toHaveAttribute("href", "/feedback");
    expect(screen.getByRole("link", { name: /report a bug/i })).toHaveAttribute("href", "/bug-reports");
  });

  it("switches the page theme and saves the preference", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("switch", { name: /switch to dark mode/i }));

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("cestudy:theme:v1")).toBe("dark");
    expect(screen.getByRole("switch", { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it("restores a previously saved theme", () => {
    localStorage.setItem("cestudy:theme:v1", "dark");
    renderMenu();

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(screen.getByRole("button", { name: /switch to light mode/i })).toBeInTheDocument();
  });
});
