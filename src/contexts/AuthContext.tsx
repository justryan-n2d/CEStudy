import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const unavailableAuthAction = async (): Promise<void> => {
  throw new Error("Supabase configuration is required for Google sign-in.");
};

function googleAuthenticatedUser(user: User | null | undefined): User | null {
  if (!user) return null;
  const primaryProvider = user.app_metadata?.provider;
  const hasGoogleIdentity = user.identities?.some((identity) => identity.provider === "google") ?? false;
  return primaryProvider === "google" || hasGoogleIdentity ? user : null;
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

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(googleAuthenticatedUser(session?.user));
      setLoading(false);
    });

    void supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        setUser(error ? null : googleAuthenticatedUser(data.session?.user));
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase) {
      throw new Error("Supabase configuration is required for Google sign-in.");
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabase) {
      throw new Error("Supabase configuration is required to sign out.");
    }
    const { error } = await supabase.auth.signOut();
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
