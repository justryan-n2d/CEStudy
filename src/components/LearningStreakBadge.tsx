import { useAuth } from "../contexts/AuthContext";
import { readLearningActivityDays } from "../data/learning-progress";
import { getLearningStreak } from "../data/learning-streak";

export function LearningStreakBadge() {
  const { user, loading } = useAuth();

  // The streak UI itself is unavailable until a Google-authenticated session exists.
  if (loading || !user) return null;

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
