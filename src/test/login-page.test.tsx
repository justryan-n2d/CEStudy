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
    expect(googleButton.querySelector("img.google-signin-icon")).toHaveAttribute("src", "/branding/google.svg");
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

  it.each([
    ["absolute external URL", "https://evil.example/collect"],
    ["protocol-relative URL", "//evil.example/collect"],
    ["backslash-based protocol-relative URL", "\\\\evil.example\\collect"],
    ["javascript URL", "javascript:alert(1)"],
    ["login redirect loop", "/login?next=/streak"],
  ])("rejects an unsafe callback destination (%s) when signed in", (_label, target) => {
    mockUseAuth.mockReturnValue({
      user: { id: "google-student", email: "student@example.com" },
      loading: false,
      configured: true,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={[`/login?next=${encodeURIComponent(target)}`]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<p>Profile destination reached</p>} />
          <Route path="*" element={<p>Unsafe destination reached</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Profile destination reached")).toBeInTheDocument();
    expect(screen.queryByText("Unsafe destination reached")).not.toBeInTheDocument();
  });

  it.each([
    ["hash fragment", "/login#error=access_denied&error_description=User%20canceled"],
    ["query-style hash fragment", "/login#?error=access_denied&error_description=User%20canceled"],
  ])("shows recoverable feedback when OAuth cancellation is returned as a %s", (_label, callbackUrl) => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      configured: true,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });

    render(<MemoryRouter initialEntries={[callbackUrl]}><LoginPage /></MemoryRouter>);

    expect(screen.getByRole("alert")).toHaveTextContent(/canceled or could not be completed/i);
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeEnabled();
  });

  it("shows recoverable feedback after OAuth cancellation and allows retry", async () => {
    const signInWithGoogle = vi.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      configured: true,
      signInWithGoogle,
      signOut: vi.fn(),
    });
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/login?error=access_denied&error_description=User%20canceled"]}>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/canceled or could not be completed/i);
    const retryButton = screen.getByRole("button", { name: /continue with google/i });
    expect(retryButton).toBeEnabled();
    await user.click(retryButton);

    expect(signInWithGoogle).toHaveBeenCalledOnce();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    // The mock resolves without performing a browser redirect, so the pending label is expected here.
    expect(screen.getByRole("button", { name: /opening google/i })).toBeDisabled();
  });

  it("recovers after OAuth initiation fails and permits a second attempt", async () => {
    const signInWithGoogle = vi.fn()
      .mockRejectedValueOnce(new Error("provider unavailable"))
      .mockResolvedValueOnce(undefined);
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      configured: true,
      signInWithGoogle,
      signOut: vi.fn(),
    });
    const user = userEvent.setup();
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    const retryButton = screen.getByRole("button", { name: /continue with google/i });

    await user.click(retryButton);
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be started/i);
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: /continue with google/i }));
    expect(signInWithGoogle).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows recovery when PKCE callback has a code but no explicit error and no session was established", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      configured: true,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={["/login?code=opaque-regression-code"]}>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/canceled or could not be completed/i);
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeEnabled();
    expect(screen.queryByText(/opaque-regression-code/)).not.toBeInTheDocument();
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
