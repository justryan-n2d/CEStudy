import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { safeInternalReturnPath } from "../lib/safe-return-path";

export function LoginPage() {
  const { user, loading, configured, signInWithGoogle } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const returnTo = safeInternalReturnPath(params.get("next"), "/profile", window.location.origin);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(() =>
    params.has("error") || params.has("error_description")
      ? "Google sign-in was canceled or could not be completed. Please try again."
      : null,
  );

  const handleGoogleSignIn = async () => {
    setError(null);
    setPending(true);
    try {
      await signInWithGoogle(returnTo);
    } catch {
      setError("Google sign-in could not be started. Check your connection and try again.");
      setPending(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrap login-page">
        <section className="login-panel">
          <span className="kicker">CEStudy account</span>
          <h1>Checking your sign-in</h1>
          <p role="status">Checking whether you are already signed in.</p>
        </section>
      </div>
    );
  }

  if (user) return <Navigate to={returnTo} replace />;

  return (
    <div className="page-wrap login-page">
      <section className="login-panel">
        <span className="kicker">CEStudy account</span>
        <h1>Sign in to CEStudy</h1>
        <p className="login-description">Use your Google account to unlock your learning streak. The engineering library remains open without signing in.</p>
        <button className="button button-primary google-signin-button" type="button"
          onClick={() => void handleGoogleSignIn()} disabled={!configured || pending}>
          <span className="google-signin-icon-wrap" aria-hidden="true">
            <img className="google-signin-icon" src="/branding/icons/google.svg" alt="" width={20} height={20} />
          </span>
          {pending ? "Opening Google…" : "Continue with Google"}
        </button>
        {!configured && (
          <p className="login-setup-note">Supabase configuration is required before Google sign-in can be used on this deployment.</p>
        )}
        {error && <p className="login-error" role="alert">{error}</p>}
        <p className="login-footnote">Streak history is saved for your signed-in account on this device. Cross-device syncing is not available yet.</p>
        <Link className="text-link" to="/">← Back to CEStudy</Link>
      </section>
    </div>
  );
}
