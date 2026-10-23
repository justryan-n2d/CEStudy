import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProfilePage() {
  const { user, loading, configured, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setError(null);
    setSigningOut(true);
    try {
      await signOut();
    } catch {
      setError("You could not sign out. Check your connection and try again.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="page-wrap profile-page">
      <Link className="back-link" to="/catalog">← Subject catalog</Link>
      <section className="page-intro">
        <span className="kicker">Account</span>
        <h1>Your profile</h1>
        <p>Manage your optional Google sign-in. The CEStudy library stays available without an account.</p>
      </section>

      {loading ? (
        <section className="auth-panel" role="status">
          <h2>Checking your account</h2>
          <p>One moment while CEStudy checks your sign-in.</p>
        </section>
      ) : user ? (
        <section className="auth-panel profile-panel">
          <section className="profile-account-card" aria-label="Google account">
            <span className="profile-avatar" aria-hidden="true">
              {(user.email?.trim().charAt(0) || "G").toUpperCase()}
            </span>
            <div className="profile-account-copy">
              <strong>{user.email ?? "Google account"}</strong>
              <span>Google account connected</span>
            </div>
            <span className="profile-connected-status">Connected</span>
          </section>
          <nav className="profile-shortcut-list" aria-label="Your study tools">
            <Link className="profile-shortcut" to="/history">
              <span><strong>Lesson history</strong><small>Return to lessons you opened</small></span><span aria-hidden="true">→</span>
            </Link>
            <Link className="profile-shortcut" to="/progress">
              <span><strong>Learning progress</strong><small>Review completed lessons</small></span><span aria-hidden="true">→</span>
            </Link>
            <Link className="profile-shortcut" to="/streak">
              <span><strong>Streak calendar</strong><small>See your recorded study days</small></span><span aria-hidden="true">→</span>
            </Link>
          </nav>
          <p className="profile-note">Lesson history, progress, and streak activity stay in this browser on this device. Streak days are scoped to the signed-in account and do not sync across devices. Signing out ends the active CEStudy Google session but does not delete the Google account.</p>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <div className="profile-actions">
            <button className="button button-secondary" type="button"
              onClick={() => void handleSignOut()} disabled={signingOut}>
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </section>
      ) : (
        <section className="auth-panel profile-panel">
          <h2>No account connected</h2>
          <p>Sign in with Google only when you want to use account-based study features. No account is needed to browse subjects and lessons.</p>
          <div className="profile-actions">
            <Link className="button button-primary" to="/login?next=%2Fprofile">Continue with Google</Link>
            <Link className="button button-secondary" to="/catalog">Browse the library</Link>
            <Link className="button button-secondary" to="/history">View lesson history</Link>
          </div>
          {!configured && <p className="auth-note" role="status">Google sign-in is not configured for this deployment yet.</p>}
        </section>
      )}
    </div>
  );
}
