import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { readLearningActivityDays } from "../data/learning-progress";
import { getLearningStreak } from "../data/learning-streak";

export function LearningStreakBadge() {
  const { user, loading, configured, signInWithGoogle } = useAuth();
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [signInPending, setSignInPending] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!unlockOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUnlockOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      previouslyFocused?.focus();
    };
  }, [unlockOpen]);

  const openUnlockPrompt = () => {
    setSignInError(null);
    setUnlockOpen(true);
  };

  const handleGoogleSignIn = async () => {
    setSignInError(null);
    setSignInPending(true);
    try {
      await signInWithGoogle();
    } catch (reason) {
      setSignInError(reason instanceof Error
        ? reason.message
        : "Google sign-in could not be started. Please try again.");
      setSignInPending(false);
    }
  };

  if (loading) return null;

  if (!user) {
    return (
      <>
        <button
          type="button"
          className="learning-streak learning-streak-locked"
          aria-label="Learning streak, zero days. Click to unlock."
          aria-haspopup="dialog"
          aria-expanded={unlockOpen}
          onClick={openUnlockPrompt}
        >
          <span className="learning-streak-main">
            <span className="learning-streak-flame" aria-hidden="true">🔥</span>
            <strong>0</strong>
            <span>day streak</span>
          </span>
          <small>Sign in to unlock your streak.</small>
        </button>

        {unlockOpen && (
          <div
            className="streak-unlock-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setUnlockOpen(false);
            }}
          >
            <section
              ref={dialogRef}
              className="streak-unlock-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="streak-unlock-title"
              aria-describedby="streak-unlock-description"
            >
              <button
                ref={closeButtonRef}
                className="streak-unlock-close"
                type="button"
                aria-label="Close streak sign-in prompt"
                onClick={() => setUnlockOpen(false)}
              >
                ×
              </button>
              <span className="streak-unlock-flame" aria-hidden="true">🔥</span>
              <h2 id="streak-unlock-title">Unlock your learning streak</h2>
              <p id="streak-unlock-description">
                Sign in with Google to track your consecutive study days and keep your learning streak going.
                You can still browse the full engineering library without signing in.
              </p>
              <button
                className="button button-primary google-signin-button"
                type="button"
                onClick={() => void handleGoogleSignIn()}
                disabled={!configured || signInPending}
              >
                <span className="google-signin-mark" aria-hidden="true">G</span>
                {signInPending ? "Opening Google…" : "Continue with Google"}
              </button>
              {!configured && (
                <p className="login-setup-note" role="status">
                  Google sign-in is not configured for this deployment yet.
                </p>
              )}
              {signInError && <p className="login-error" role="alert">{signInError}</p>}
            </section>
          </div>
        )}
      </>
    );
  }

  const { currentStreak, completedToday } = getLearningStreak(readLearningActivityDays(user.id));
  const dayLabel = currentStreak === 1 ? "day" : "days";
  const prompt = currentStreak === 0
    ? "Complete a lesson today to start your streak."
    : completedToday
      ? "You completed a lesson today."
      : "Complete a lesson today to keep it going.";

  return (
    <section className="learning-streak" aria-label="Learning streak">
      <div className="learning-streak-main" role="status">
        <span className="learning-streak-flame" aria-hidden="true">🔥</span>
        <strong>{currentStreak}</strong>
        <span>{dayLabel} streak</span>
      </div>
      <small>{prompt}</small>
    </section>
  );
}
