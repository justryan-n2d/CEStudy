export const LEARNING_HISTORY_STORAGE_KEY = "cestudy:opened-lesson-history:v1";
const MAX_HISTORY_ENTRIES = 100;

export interface OpenedLessonInput {
  lessonId: string;
  subjectSlug: string;
  unitNumber: number;
  title: string;
}

export interface OpenedLesson extends OpenedLessonInput {
  path: string;
  lastOpenedAt: string;
}

function isValidOpenedLesson(value: unknown): value is OpenedLesson {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return typeof record.lessonId === "string" && record.lessonId.trim().length > 0
    && typeof record.subjectSlug === "string" && /^[a-z0-9-]+$/.test(record.subjectSlug)
    && typeof record.unitNumber === "number" && Number.isInteger(record.unitNumber) && record.unitNumber >= 0
    && typeof record.title === "string" && record.title.trim().length > 0
    && typeof record.lastOpenedAt === "string" && Number.isFinite(new Date(record.lastOpenedAt).getTime());
}

function safeHistory(value: unknown): OpenedLesson[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, OpenedLesson>();
  for (const entry of value) {
    if (!isValidOpenedLesson(entry)) continue;
    unique.set(entry.lessonId, {
      lessonId: entry.lessonId,
      subjectSlug: entry.subjectSlug,
      unitNumber: entry.unitNumber,
      title: entry.title,
      path: "/study/" + entry.subjectSlug + "/" + entry.unitNumber,
      lastOpenedAt: new Date(entry.lastOpenedAt).toISOString(),
    });
  }
  return [...unique.values()]
    .sort((a, b) => b.lastOpenedAt.localeCompare(a.lastOpenedAt))
    .slice(0, MAX_HISTORY_ENTRIES);
}

export function readLessonHistory(): OpenedLesson[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(LEARNING_HISTORY_STORAGE_KEY);
    return stored ? safeHistory(JSON.parse(stored)) : [];
  } catch {
    return [];
  }
}

/** Records a published lesson route in this browser, whether the student is signed in or not. */
export function recordOpenedLesson(input: OpenedLessonInput, now: Date = new Date()): OpenedLesson[] {
  if (!input.lessonId.trim() || !/^[a-z0-9-]+$/.test(input.subjectSlug)
    || !Number.isInteger(input.unitNumber) || input.unitNumber < 0
    || !input.title.trim() || !Number.isFinite(now.getTime())) {
    return readLessonHistory();
  }

  const entry: OpenedLesson = {
    ...input,
    path: "/study/" + input.subjectSlug + "/" + input.unitNumber,
    lastOpenedAt: now.toISOString(),
  };
  const next = [
    entry,
    ...readLessonHistory().filter((lesson) => lesson.lessonId !== entry.lessonId),
  ].slice(0, MAX_HISTORY_ENTRIES);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LEARNING_HISTORY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep navigation usable if browser storage is unavailable or full.
    }
  }
  return next;
}

export function clearLessonHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LEARNING_HISTORY_STORAGE_KEY);
  } catch {
    // The page remains usable if browser storage is blocked.
  }
}
