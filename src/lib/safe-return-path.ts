/**
 * Restrict post-authentication destinations to paths on the current origin.
 * OAuth callback URLs must never become an open redirect.
 */
export function safeInternalReturnPath(
  value: string | null | undefined,
  fallback = "/profile",
  origin = window.location.origin,
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
      if (candidate.origin === base.origin && candidate.pathname !== "/login") {
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
    if (candidate.origin !== base.origin || candidate.pathname === "/login") {
      return safeFallback;
    }
    return candidate.pathname + candidate.search + candidate.hash;
  } catch {
    return safeFallback;
  }
}
