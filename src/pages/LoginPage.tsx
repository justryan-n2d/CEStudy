import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { user, loading, configured, signInWithGoogle, signOut } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setPending(true);
    try {
      await signInWithGoogle();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Google sign-in could not be started. Please try again.");
      setPending(false);
    }
  };

  const handleSignOut = async () => {
    setError(null);
    setPending(true);
    try {
      await signOut();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "You could not be signed out. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="page-wrap login-page">
      <section className="login-panel">
        <span className="kicker">CEStudy account</span>
        {loading ? (
          <>
            <h1>Checking your sign-in</h1>
            <p role="status">Checking whether you are already signed in.</p>
          </>
        ) : user ? (
          <>
            <h1>You are signed in</h1>
            <p className="login-description">Your learning streak is enabled for this Google account on this device.</p>
            <p className="login-account">{user.email ?? "Google account"}</p>
            <div className="login-actions">
              <Link className="button button-primary" to="/progress">View my progress</Link>
              <button className="button button-secondary" type="button" onClick={handleSignOut} disabled={pending}>
                {pending ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>Sign in to CEStudy</h1>
            <p className="login-description">Use your Google account to unlock your learning streak. The knowledge library remains open without signing in.</p>
            <button className="button button-primary google-signin-button" type="button"
              onClick={handleGoogleSignIn} disabled={!configured || pending}>
              <span className="google-signin-icon-wrap" aria-hidden="true">
                <img className="google-signin-icon" src="/branding/icons/google.svg" alt="" width={20} height={20} />
              </span>
              {pending ? "Opening Google…" : "Continue with Google"}
            </button>
            {!configured && (
              <p className="login-setup-note">Supabase configuration is required before Google sign-in can be used on this deployment.</p>
            )}
          </>
        )}
        {error && <p className="login-error" role="alert">{error}</p>}
        <p className="login-footnote">Streak history is saved for your signed-in account on this device. Cross-device syncing is planned for a later stage.</p>
        <Link className="text-link" to="/">← Back to CEStudy</Link>
      </section>
    </div>
  );
}
