import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    configured: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  }),
}));
import { LoginPage } from "../pages/LoginPage";

describe("Google sign-in page", () => {
  it("only offers Google as the sign-in method", () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: /sign in to cestudy/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("explains when Supabase is not configured", () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    expect(screen.getByText(/supabase configuration is required/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeDisabled();
  });
});
