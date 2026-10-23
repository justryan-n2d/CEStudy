import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import { safeInternalReturnPath } from "../lib/safe-return-path";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: (returnTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const unavailableAuthAction: AuthContextValue["signInWithGoogle"] = async () => {
  throw new Error("Supabase configuration is required for Google sign-in.");
};

function googleAuthenticatedUser(user: User | null | undefined): User | null {
  if (!user) return null;
  const primaryProvider = user.app_metadata?.provider;
  const hasGoogleIdentity = user.identities?.some((identity) => identity.provider === "google") ?? false;

  // An explicitly non-Google primary provider must not be presented as a Google account
  // merely because a Google identity is linked to the same Supabase user.
  return primaryProvider === "google" || (primaryProvider == null && hasGoogleIdentity)
    ? user
    : null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  configured: hasSupabaseConfig,
  signInWithGoogle: unavailableAuthAction,
  signOut: unavailableAuthAction,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(hasSupabaseConfig);
  const authEventVersion = useRef(0);

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) return;

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      authEventVersion.current += 1;
      setUser(googleAuthenticatedUser(session?.user));
      setLoading(false);
    });

    const initialVersion = authEventVersion.current;
    void supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active || authEventVersion.current !== initialVersion) return;
        setUser(error ? null : googleAuthenticatedUser(data.session?.user));
        setLoading(false);
      })
      .catch(() => {
        if (!active || authEventVersion.current !== initialVersion) return;
        setUser(null);
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (returnTo = "/profile") => {
    if (!supabase) {
      throw new Error("Supabase configuration is required for Google sign-in.");
    }

    const safeReturnTo = safeInternalReturnPath(returnTo, "/profile", window.location.origin);
    const callback = new URL("/login", window.location.origin);
    callback.searchParams.set("next", safeReturnTo);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callback.toString(),
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabase) {
      throw new Error("Supabase configuration is required to sign out.");
    }
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      configured: hasSupabaseConfig,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
