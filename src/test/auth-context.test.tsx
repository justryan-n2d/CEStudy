import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

const authMocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  unsubscribe: vi.fn(),
}));

vi.mock("../lib/supabase", () => ({
  hasSupabaseConfig: true,
  supabase: {
    auth: {
      getSession: authMocks.getSession,
      onAuthStateChange: authMocks.onAuthStateChange,
      signInWithOAuth: authMocks.signInWithOAuth,
      signOut: authMocks.signOut,
    },
  },
}));

function AuthHarness() {
  const { loading, signInWithGoogle, signOut } = useAuth();
  return (
    <section>
      <span>{loading ? "Auth loading" : "Auth ready"}</span>
      <button type="button" onClick={() => void signInWithGoogle()}>Start Google sign-in</button>
      <button type="button" onClick={() => void signOut()}>Sign out</button>
    </section>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  authMocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
  authMocks.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: authMocks.unsubscribe } },
  });
  authMocks.signInWithOAuth.mockResolvedValue({ error: null });
  authMocks.signOut.mockResolvedValue({ error: null });
});

describe("Supabase Google authentication", () => {
  it("starts Google OAuth and returns to the CEStudy login page", async () => {
    const user = userEvent.setup();
    render(<AuthProvider><AuthHarness /></AuthProvider>);

    expect(await screen.findByText("Auth ready")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Start Google sign-in" }));

    expect(authMocks.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
        queryParams: { prompt: "select_account" },
      },
    });
  });

  it("signs out through Supabase Auth", async () => {
    const user = userEvent.setup();
    render(<AuthProvider><AuthHarness /></AuthProvider>);

    expect(await screen.findByText("Auth ready")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sign out" }));

    expect(authMocks.signOut).toHaveBeenCalledOnce();
  });

  it("unsubscribes from auth state changes when the provider unmounts", async () => {
    const { unmount } = render(<AuthProvider><AuthHarness /></AuthProvider>);
    expect(await screen.findByText("Auth ready")).toBeInTheDocument();

    unmount();

    expect(authMocks.unsubscribe).toHaveBeenCalledOnce();
  });
});
