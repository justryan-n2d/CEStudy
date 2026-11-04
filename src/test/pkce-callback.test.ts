import { createClient } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Characterize the installed Supabase JS SDK's browser PKCE callback contract.
 * No real project, network, account, authorization code, or token is used.
 */
describe("installed Supabase SDK PKCE callback processing", () => {
  const storageKey = "cestudy-pkce-callback-regression";

  afterEach(() => {
    localStorage.clear();
    window.history.replaceState({}, "", "/");
    vi.unstubAllGlobals();
  });

  it("reports token-exchange failure while leaving the callback code for UI recovery", async () => {
    window.history.replaceState({}, "", "/login");

    const options = {
      auth: {
        storageKey,
        flowType: "pkce" as const,
        persistSession: true,
        autoRefreshToken: false,
        detectSessionInUrl: true,
      },
    };
    const initiator = createClient(
      "https://cestudy-test-project.supabase.co",
      "sb_publishable_test_key",
      options,
    );

    await initiator.auth.initialize();
    const started = await initiator.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
        skipBrowserRedirect: true,
      },
    });
    expect(started.error).toBeNull();
    expect(Object.keys(localStorage).some((key) => key.endsWith("-code-verifier"))).toBe(true);

    window.history.replaceState({}, "", "/login?code=opaque-regression-code");
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const requestUrl = String(input);
      if (requestUrl.includes("/token")) {
        return new Response(
          JSON.stringify({ message: "Invalid authorization code", code: "invalid_grant" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
    });
    vi.stubGlobal("fetch", fetchMock);

    const callbackClient = createClient(
      "https://cestudy-test-project.supabase.co",
      "sb_publishable_test_key",
      options,
    );
    const initialized = await callbackClient.auth.initialize();
    const { data } = await callbackClient.auth.getSession();

    expect(fetchMock.mock.calls.some(([input]) => String(input).includes("/token"))).toBe(true);
    expect(initialized.error).not.toBeNull();
    expect(data.session).toBeNull();
    expect(new URL(window.location.href).searchParams.get("code")).toBe("opaque-regression-code");
  });
});
