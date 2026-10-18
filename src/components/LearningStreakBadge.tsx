import { getLearningStreak } from "../data/learning-streak";
import type { CompletedLesson } from "../data/learning-progress";

interface LearningStreakBadgeProps {
  completedLessons: readonly CompletedLesson[];
}

export function LearningStreakBadge({ completedLessons }: LearningStreakBadgeProps) {
  const { currentStreak, completedToday } = getLearningStreak(completedLessons);
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
