export const LEARNING_PROGRESS_STORAGE_KEY = "cestudy:completed-lessons:v1";
export const LEARNING_ACTIVITY_DAYS_STORAGE_KEY = "cestudy:learning-activity-days:v1";

export interface LessonCompletionInput {
  lessonId: string;
  subjectSlug: string;
  unitNumber: number;
  title: string;
}

export interface CompletedLesson extends LessonCompletionInput {
  completedAt: string;
  /** The learner's local calendar day when the lesson was completed. */
  completedOn: string;
}

export function formatLocalDateKey(date: Date): string {
  if (!Number.isFinite(date.getTime())) return "";
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isValidCalendarDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function parseCompletedLesson(value: unknown): CompletedLesson | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.lessonId !== "string" || !record.lessonId.trim()
    || typeof record.subjectSlug !== "string" || !record.subjectSlug.trim()
    || typeof record.unitNumber !== "number" || !Number.isInteger(record.unitNumber) || record.unitNumber < 0
    || typeof record.title !== "string" || !record.title.trim()
    || typeof record.completedAt !== "string" || !Number.isFinite(new Date(record.completedAt).getTime())) {
    return null;
  }

  const completedAt = record.completedAt;
  const parsedCompletedAt = new Date(completedAt);
  const completedOn = isValidCalendarDateKey(record.completedOn)
    ? record.completedOn
    : formatLocalDateKey(parsedCompletedAt);

  return {
    lessonId: record.lessonId,
    subjectSlug: record.subjectSlug,
    unitNumber: record.unitNumber,
    title: record.title,
    completedAt,
    completedOn,
  };
}

export function readLearningActivityDays(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(LEARNING_ACTIVITY_DAYS_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter(isValidCalendarDateKey))];
  } catch {
    return [];
  }
}

function recordLearningActivityDay(day: string): string[] {
  const days = readLearningActivityDays();
  if (days.includes(day)) return days;
  const next = [...days, day].filter(isValidCalendarDateKey).sort();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LEARNING_ACTIVITY_DAYS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the current screen usable when browser storage is unavailable.
    }
  }
  return next;
}

export function readCompletedLessons(): CompletedLesson[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(LEARNING_PROGRESS_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.map(parseCompletedLesson).filter((item): item is CompletedLesson => item !== null)
      : [];
  } catch {
    return [];
  }
}

export function setLessonCompleted(
  lesson: LessonCompletionInput,
  completed: boolean,
): CompletedLesson[] {
  const current = readCompletedLessons();
  const remaining = current.filter((item) => item.lessonId !== lesson.lessonId);
  const now = new Date();
  const completedOn = formatLocalDateKey(now);
  const next = completed
    ? [...remaining, { ...lesson, completedAt: now.toISOString(), completedOn }]
    : remaining;

  if (completed) recordLearningActivityDay(completedOn);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the current screen usable when browser storage is unavailable.
    }
  }
  return next;
}

export function clearLessonProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LEARNING_PROGRESS_STORAGE_KEY);
    window.localStorage.removeItem(LEARNING_ACTIVITY_DAYS_STORAGE_KEY);
  } catch {
    // The page remains usable if browser storage is blocked.
  }
}
