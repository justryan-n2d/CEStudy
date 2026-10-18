import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "../pages/LoginPage";

const mockUseAuth = vi.hoisted(() => vi.fn());

vi.mock("../contexts/AuthContext", () => ({
  useAuth: mockUseAuth,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseAuth.mockReturnValue({
    user: null,
    loading: false,
    configured: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  });
});

describe("Google sign-in page", () => {
  it("only offers Google as the sign-in method", () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: /sign in to cestudy/i })).toBeInTheDocument();
    const googleButton = screen.getByRole("button", { name: /continue with google/i });
    expect(googleButton).toBeInTheDocument();
    expect(googleButton.querySelector("img.google-signin-icon")).toHaveAttribute("src", "/branding/icons/google.svg");
    expect(googleButton.querySelector("img.google-signin-icon")).toHaveAttribute("alt", "");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("returns a signed-in student to the intended in-app page", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "google-student", email: "student@example.com" },
      loading: false,
      configured: true,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={["/login?next=%2Fstreak"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/streak" element={<p>Streak destination reached</p>} />
          <Route path="/profile" element={<p>Profile destination reached</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Streak destination reached")).toBeInTheDocument();
  });

  it("rejects an external callback destination when a user is already signed in", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "google-student", email: "student@example.com" },
      loading: false,
      configured: true,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={["/login?next=https%3A%2F%2Fevil.example%2Fcollect"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<p>Profile destination reached</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Profile destination reached")).toBeInTheDocument();
  });

  it("explains when Supabase is not configured", () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    expect(screen.getByText(/supabase configuration is required/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeDisabled();
  });

  it("starts the Google sign-in action when OAuth is configured", async () => {
    const signInWithGoogle = vi.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      configured: true,
      signInWithGoogle,
      signOut: vi.fn(),
    });
    const user = userEvent.setup();
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    expect(signInWithGoogle).toHaveBeenCalledOnce();
  });
});
