import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MenuPage } from "../pages/MenuPage";
import { ThemeProvider } from "../contexts/ThemeContext";

const mockUseAuth = vi.hoisted(() => vi.fn());

vi.mock("../contexts/AuthContext", () => ({ useAuth: mockUseAuth }));

const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]') ?? document.createElement("meta");
themeColorMeta.name = "theme-color";
if (!themeColorMeta.isConnected) document.head.append(themeColorMeta);

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  document.documentElement.style.removeProperty("color-scheme");
  themeColorMeta.content = "#FFFFFF";
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
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(themeColorMeta).toHaveAttribute("content", "#0B1421");
    expect(localStorage.getItem("cestudy:theme:v1")).toBe("dark");
    expect(screen.getByRole("switch", { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it("switches back to light mode and restores the light browser theme color", async () => {
    localStorage.setItem("cestudy:theme:v1", "dark");
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("switch", { name: /switch to light mode/i }));

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(themeColorMeta).toHaveAttribute("content", "#FFFFFF");
    expect(localStorage.getItem("cestudy:theme:v1")).toBe("light");
  });

  it("restores a previously saved theme", () => {
    localStorage.setItem("cestudy:theme:v1", "dark");
    renderMenu();

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(screen.getByRole("switch", { name: /switch to light mode/i })).toBeInTheDocument();
  });
});
