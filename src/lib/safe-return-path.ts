/**
 * Restrict post-authentication destinations to routes on the current origin.
 * OAuth callback URLs must never become an open redirect or a login loop.
 */
function isLoginPathname(pathname: string): boolean {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    // Keep the original path if it contains malformed escapes.
  }
  return decoded.replace(/\/+$/, "").toLowerCase() === "/login";
}

export function safeInternalReturnPath(
  value: string | null | undefined,
  fallback = "/profile",
  origin = typeof window !== "undefined" ? window.location.origin : "https://cestudy.invalid",
): string {
  let base: URL;
  try {
    base = new URL(origin);
  } catch {
    return "/profile";
  }

  const resolveFallback = (): string => {
    try {
      const candidate = new URL(fallback, base);
      if (candidate.origin === base.origin && !isLoginPathname(candidate.pathname)) {
        return candidate.pathname + candidate.search + candidate.hash;
      }
    } catch {
      // Fail closed to the known local Profile route.
    }
    return "/profile";
  };

  const safeFallback = resolveFallback();
  if (!value || !value.trim()) return safeFallback;

  try {
    const candidate = new URL(value, base);
    if (candidate.origin !== base.origin || isLoginPathname(candidate.pathname)) {
      return safeFallback;
    }
    return candidate.pathname + candidate.search + candidate.hash;
  } catch {
    return safeFallback;
  }
}
