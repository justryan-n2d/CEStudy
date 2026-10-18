export const LEARNING_PROGRESS_STORAGE_KEY = "cestudy:completed-lessons:v1";

export interface LessonCompletionInput {
  lessonId: string;
  subjectSlug: string;
  unitNumber: number;
  title: string;
}

export interface CompletedLesson extends LessonCompletionInput {
  completedAt: string;
}

function isCompletedLesson(value: unknown): value is CompletedLesson {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return typeof record.lessonId === "string" && record.lessonId.length > 0
    && typeof record.subjectSlug === "string" && record.subjectSlug.length > 0
    && typeof record.unitNumber === "number" && Number.isInteger(record.unitNumber) && record.unitNumber >= 0
    && typeof record.title === "string" && record.title.trim().length > 0
    && typeof record.completedAt === "string" && record.completedAt.length > 0;
}

export function readCompletedLessons(): CompletedLesson[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(LEARNING_PROGRESS_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isCompletedLesson) : [];
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
  const next = completed
    ? [...remaining, { ...lesson, completedAt: new Date().toISOString() }]
    : remaining;

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
  } catch {
    // The page remains usable if browser storage is blocked.
  }
}
