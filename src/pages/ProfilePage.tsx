import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProfilePage() {
  const { user, loading, signOut } = useAuth();
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
      <Link className="back-link" to="/menu">← Menu</Link>
      <section className="page-intro">
        <span className="kicker">Account</span>
        <h1>Your profile</h1>
        <p>Manage your sign-in and open your study tools.</p>
      </section>

      {loading ? (
        <section className="state-panel" role="status">
          <h2>Checking your account</h2>
          <p>One moment while CEStudy checks your sign-in.</p>
        </section>
      ) : user ? (
        <>
          <section className="profile-account-card" aria-label="Google account">
            <span className="profile-avatar" aria-hidden="true">
              {(user.email?.trim().charAt(0) || "G").toUpperCase()}
            </span>
            <div className="profile-account-copy">
              <strong>{user.email ?? "Google account"}</strong>
              <span>Google account connected</span>
            </div>
            <span className="profile-connected-status">
              <span aria-hidden="true">✓</span> Connected
            </span>
          </section>

          <section className="profile-data-note">
            <strong>Your study data</strong>
            <p>Streak history, lesson history, progress, and appearance are saved on this device. They do not sync across devices yet.</p>
          </section>

          <section className="profile-shortcuts-section" aria-labelledby="profile-shortcuts-title">
            <h2 id="profile-shortcuts-title">Your study tools</h2>
            <nav className="profile-shortcut-list" aria-label="Your study tools">
              <Link className="profile-shortcut" to="/history">
                <span><strong>Lesson history</strong><small>Return to lessons you opened</small></span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="profile-shortcut" to="/progress">
                <span><strong>Learning progress</strong><small>Review completed lessons</small></span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="profile-shortcut" to="/streak">
                <span><strong>Streak calendar</strong><small>See your recorded study days</small></span>
                <span aria-hidden="true">→</span>
              </Link>
            </nav>
          </section>

          {error && <p className="login-error" role="alert">{error}</p>}
          <section className="profile-signout-section">
            <div>
              <strong>Sign out of CEStudy</strong>
              <p>You can continue browsing the library after signing out.</p>
            </div>
            <button className="button button-secondary" type="button" onClick={() => void handleSignOut()} disabled={signingOut}>
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </section>
        </>
      ) : (
        <section className="state-panel profile-guest-panel">
          <h2>Sign in to activate your study streak</h2>
          <p>The engineering library stays open to everyone. Sign in with Google to unlock streak tracking for this device.</p>
          <div className="profile-guest-actions">
            <Link className="button button-primary" to="/login?next=%2Fprofile">Continue with Google</Link>
            <Link className="button button-secondary" to="/catalog">Browse the library</Link>
          </div>
        </section>
      )}
    </div>
  );
}
