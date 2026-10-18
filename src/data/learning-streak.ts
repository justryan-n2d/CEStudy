import {
  formatLocalDateKey,
  isValidCalendarDateKey,
  type CompletedLesson,
} from "./learning-progress";

export interface LearningStreakSummary {
  currentStreak: number;
  completedToday: boolean;
}

function shiftLocalDay(date: Date, offset: number): string {
  const shifted = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  shifted.setDate(shifted.getDate() + offset);
  return formatLocalDateKey(shifted);
}

/**
 * Counts consecutive local calendar days on which at least one lesson was completed.
 * If the learner completed a lesson yesterday but not yet today, the current streak
 * remains active for the rest of today.
 */
export function getLearningStreak(
  completedLessons: readonly CompletedLesson[],
  now: Date = new Date(),
): LearningStreakSummary {
  const today = formatLocalDateKey(now);
  if (!today) return { currentStreak: 0, completedToday: false };

  const activeDays = new Set(
    completedLessons
      .map((lesson) => lesson.completedOn)
      .filter((day): day is string => isValidCalendarDateKey(day)),
  );

  const completedToday = activeDays.has(today);
  const yesterday = shiftLocalDay(now, -1);
  const startOffset = completedToday ? 0 : activeDays.has(yesterday) ? 1 : null;
  if (startOffset === null) return { currentStreak: 0, completedToday: false };

  let currentStreak = 0;
  let offset = startOffset;
  while (activeDays.has(shiftLocalDay(now, -offset))) {
    currentStreak += 1;
    offset += 1;
  }

  return { currentStreak, completedToday };
}
