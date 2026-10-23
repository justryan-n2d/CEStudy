import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProfilePage() {
  const { user, loading, configured, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSignOut = async () => {
    setError(null);
    setNotice(null);
    setSigningOut(true);
    try {
      await signOut();
      setNotice("You have signed out of CEStudy. Your browser-local learning data remains on this device.");
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
          <p className="profile-note">Lesson history and completed-lesson progress stay in this browser on this device. Streak activity is also local and keyed to your Supabase user ID. Appearance preferences stay on this device. Signing out does not erase this data, and activity does not sync across devices.</p>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <div className="profile-actions">
            <Link className="button button-secondary" to="/progress">Learning progress</Link>
            <button className="button button-secondary" type="button"
              onClick={() => void handleSignOut()} disabled={signingOut}>
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </section>
      ) : (
        <section className="auth-panel profile-panel">
          <h2>No account connected</h2>
          <p>Sign in with Google only when you want to use the account-specific streak. Lesson history, completed-lesson progress, and appearance preferences stay local to this browser. No account is needed to browse subjects and lessons.</p>
          {notice && <p className="auth-note" role="status">{notice}</p>}
          <div className="profile-actions">
            <Link className="button button-primary" to="/login?next=%2Fprofile">Continue with Google</Link>
            <Link className="button button-secondary" to="/catalog">Browse the library</Link>
          </div>
          {!configured && <p className="auth-note" role="status">Google sign-in is not configured for this deployment yet.</p>}
        </section>
      )}

      <section className="profile-shortcuts-section" aria-labelledby="profile-shortcuts-title">
        <h2 id="profile-shortcuts-title">Learning activity</h2>
        <nav className="profile-shortcut-list" aria-label="Your local learning activity">
          <Link className="profile-shortcut" to="/history">
            <span><strong>Lesson history</strong><small>Return to recently opened published lessons on this device</small></span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="profile-shortcut" to="/progress">
            <span><strong>Learning progress</strong><small>Review locally saved completed lessons</small></span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="profile-shortcut" to="/streak">
            <span><strong>Streak calendar</strong><small>View this account’s locally recorded study days</small></span>
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </section>
    </div>
  );
}
