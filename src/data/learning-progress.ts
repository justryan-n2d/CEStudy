export const LEARNING_PROGRESS_STORAGE_KEY = "cestudy:completed-lessons:v2:guest";
const USER_PROGRESS_STORAGE_PREFIX = "cestudy:completed-lessons:v2:user:";
export const LEARNING_ACTIVITY_DAYS_STORAGE_KEY = "cestudy:learning-activity-days:v2:";
export const LEARNING_ACTIVITY_CHANGED_EVENT = "cestudy:learning-activity-changed";

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
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

/** Separate guest progress from completed lessons for each signed-in account. */
export function learningProgressStorageKey(userId?: string | null): string {
  const normalizedUserId = userId?.trim();
  return normalizedUserId
    ? `${USER_PROGRESS_STORAGE_PREFIX}${encodeURIComponent(normalizedUserId)}`
    : LEARNING_PROGRESS_STORAGE_KEY;
}

/** Activity is isolated by the stable Supabase user ID and remains in this browser. */
export function learningActivityStorageKey(userId: string): string {
  return `${LEARNING_ACTIVITY_DAYS_STORAGE_KEY}${encodeURIComponent(userId.trim())}`;
}

function parseCompletedLesson(value: unknown): CompletedLesson | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.lessonId !== "string" || !record.lessonId.trim()
    || typeof record.subjectSlug !== "string" || !/^[a-z0-9-]+$/.test(record.subjectSlug)
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

/** Signed-out callers get an empty list, never another account's learning days. */
export function readLearningActivityDays(userId?: string | null): string[] {
  if (typeof window === "undefined" || !userId?.trim()) return [];
  try {
    const stored = window.localStorage.getItem(learningActivityStorageKey(userId));
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter(isValidCalendarDateKey))].sort();
  } catch {
    return [];
  }
}

function recordLearningActivityDay(day: string, userId: string): string[] {
  const days = readLearningActivityDays(userId);
  if (days.includes(day)) return days;
  const next = [...days, day].filter(isValidCalendarDateKey).sort();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(learningActivityStorageKey(userId), JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(LEARNING_ACTIVITY_CHANGED_EVENT, { detail: { userId } }));
    } catch {
      // Browser storage may be blocked or full. Do not break lesson reading.
    }
  }
  return next;
}

export function readCompletedLessons(userId?: string | null): CompletedLesson[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(learningProgressStorageKey(userId));
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    const unique = new Map<string, CompletedLesson>();
    for (const value of parsed) {
      const lesson = parseCompletedLesson(value);
      if (lesson) unique.set(lesson.lessonId, lesson);
    }
    return [...unique.values()];
  } catch {
    return [];
  }
}

/**
 * Completed-lesson status is device-local for all visitors. Streak activity is
 * recorded only for a signed-in Google user and never uses a shared anonymous key.
 */
export function setLessonCompleted(
  lesson: LessonCompletionInput,
  completed: boolean,
  userId?: string | null,
): CompletedLesson[] {
  if (!lesson.lessonId.trim() || !/^[a-z0-9-]+$/.test(lesson.subjectSlug)
    || !Number.isInteger(lesson.unitNumber) || lesson.unitNumber < 0 || !lesson.title.trim()) {
    return readCompletedLessons(userId);
  }

  const current = readCompletedLessons(userId);
  const remaining = current.filter((item) => item.lessonId !== lesson.lessonId);
  const now = new Date();
  const completedOn = formatLocalDateKey(now);
  const next = completed
    ? [...remaining, { ...lesson, completedAt: now.toISOString(), completedOn }]
    : remaining;

  if (completed && userId?.trim()) recordLearningActivityDay(completedOn, userId);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(learningProgressStorageKey(userId), JSON.stringify(next));
    } catch {
      // Keep the lesson page usable if browser storage is blocked or full.
    }
  }
  return next;
}

/** Clears local lesson progress and, only when supplied, that user's streak days. */
export function clearLessonProgress(userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(learningProgressStorageKey(userId));
  } catch {
    // Continue to the current user's streak cleanup even if progress storage fails.
  }
  if (!userId?.trim()) return;
  try {
    window.localStorage.removeItem(learningActivityStorageKey(userId));
    window.dispatchEvent(new CustomEvent(LEARNING_ACTIVITY_CHANGED_EVENT, { detail: { userId } }));
  } catch {
    // The page remains usable if storage is unavailable.
  }
}
