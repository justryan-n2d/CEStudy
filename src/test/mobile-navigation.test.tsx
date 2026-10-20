import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Layout } from "../components/Layout";

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

describe("responsive primary navigation", () => {
  it("has a Menu tab and global streak badge instead of the old More control", () => {
    render(<MemoryRouter initialEntries={["/menu"]}><Layout>Page content</Layout></MemoryRouter>);

    expect(screen.getByRole("navigation", { name: "Quick navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /menu/i })).toHaveAttribute("href", "/menu");
    expect(screen.getByRole("button", { name: /learning streak, zero days/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /more pages menu/i })).not.toBeInTheDocument();
    expect(document.querySelector("#mobile-help-menu")).toBeNull();
  });

  it("marks Menu active while viewing one of its linked pages", () => {
    render(<MemoryRouter initialEntries={["/history"]}><Layout>History content</Layout></MemoryRouter>);

    expect(screen.getByRole("link", { name: /menu/i })).toHaveClass("active");
  });
});
