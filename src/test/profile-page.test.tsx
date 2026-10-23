import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ProfilePage } from "../pages/ProfilePage";

const mockUseAuth = vi.hoisted(() => vi.fn());

vi.mock("../contexts/AuthContext", () => ({ useAuth: mockUseAuth }));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseAuth.mockReturnValue({
    user: null, loading: false, configured: true,
    signInWithGoogle: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn().mockResolvedValue(undefined),
  });
});

describe("Profile page", () => {
  it("lets guests start Google sign-in or continue browsing", () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /your profile/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continue with google/i })).toHaveAttribute("href", "/login?next=%2Fprofile");
    expect(screen.getByRole("link", { name: /browse the library/i })).toHaveAttribute("href", "/catalog");
    expect(screen.getByRole("link", { name: /view lesson history/i })).toHaveAttribute("href", "/history");
  });

  it("shows a loading state while the session is checked", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true, configured: true, signInWithGoogle: vi.fn(), signOut: vi.fn() });
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByRole("status")).toHaveTextContent(/checking your account/i);
    expect(screen.queryByRole("link", { name: /continue with google/i })).not.toBeInTheDocument();
  });

  it("shows the connected Google account and a sign-out action, without dead feature links", () => {
    mockUseAuth.mockReturnValue({ user: { id: "google-student-1", email: "student@example.com" }, loading: false, configured: true, signInWithGoogle: vi.fn(), signOut: vi.fn() });
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText("student@example.com")).toBeInTheDocument();
    expect(screen.getByText(/google account connected/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /lesson history/i })).toHaveAttribute("href", "/history");
    expect(screen.getByRole("link", { name: /learning progress/i })).toHaveAttribute("href", "/progress");
    expect(screen.getByRole("link", { name: /streak calendar/i })).toHaveAttribute("href", "/streak");
  });

  it("returns to the guest profile state after successful sign-out", async () => {
    const signOut = vi.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      user: { id: "google-student-1", email: "student@example.com" },
      loading: false,
      configured: true,
      signInWithGoogle: vi.fn(),
      signOut,
    });
    const user = userEvent.setup();
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: /sign out/i }));
    expect(signOut).toHaveBeenCalledOnce();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("signs out and reports recoverable errors", async () => {
    const signOut = vi.fn().mockRejectedValue(new Error("network"));
    mockUseAuth.mockReturnValue({ user: { id: "google-student-1", email: "student@example.com" }, loading: false, configured: true, signInWithGoogle: vi.fn(), signOut });
    const user = userEvent.setup();
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: /sign out/i }));
    expect(signOut).toHaveBeenCalledOnce();
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not sign out/i);
  });
});
