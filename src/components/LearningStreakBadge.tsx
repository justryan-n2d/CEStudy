import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { readLearningActivityDays } from "../data/learning-progress";
import { getLearningStreak } from "../data/learning-streak";

export function LearningStreakBadge() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <section className="learning-streak learning-streak-locked" aria-label="Learning streak">
        <div className="learning-streak-main">
          <span className="learning-streak-flame" aria-hidden="true">🔥</span>
          <strong>Sign-in required</strong>
        </div>
        <small>Sign in with Google to track your learning streak.</small>
        <Link className="text-link" to="/login">Sign in with Google</Link>
      </section>
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
