import { getLearningStreak } from "../data/learning-streak";
interface LearningStreakBadgeProps {
  activityDays: readonly string[];
}

export function LearningStreakBadge({ activityDays }: LearningStreakBadgeProps) {
  const { currentStreak, completedToday } = getLearningStreak(activityDays);
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
