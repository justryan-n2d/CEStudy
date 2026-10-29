export const LEARNING_HISTORY_STORAGE_KEY = "cestudy:opened-lesson-history:v2:guest";
const USER_HISTORY_STORAGE_PREFIX = "cestudy:opened-lesson-history:v2:user:";
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

/** Keep guest history separate from the local history for each signed-in account. */
export function learningHistoryStorageKey(userId?: string | null): string {
  const normalizedUserId = userId?.trim();
  return normalizedUserId
    ? `${USER_HISTORY_STORAGE_PREFIX}${encodeURIComponent(normalizedUserId)}`
    : LEARNING_HISTORY_STORAGE_KEY;
}

function isValidOpenedLesson(value: unknown): value is OpenedLesson {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return typeof record.lessonId === "string" && record.lessonId.trim().length > 0
    && record.lessonId.length <= 256
    && typeof record.subjectSlug === "string" && /^[a-z0-9-]+$/.test(record.subjectSlug)
    && typeof record.unitNumber === "number" && Number.isSafeInteger(record.unitNumber) && record.unitNumber >= 0
    && typeof record.title === "string" && record.title.trim().length > 0
    && typeof record.lastOpenedAt === "string" && Number.isFinite(new Date(record.lastOpenedAt).getTime());
}

function safeHistory(value: unknown): OpenedLesson[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, OpenedLesson>();
  for (const entry of value) {
    if (!isValidOpenedLesson(entry)) continue;
    const normalized: OpenedLesson = {
      lessonId: entry.lessonId,
      subjectSlug: entry.subjectSlug,
      unitNumber: entry.unitNumber,
      title: entry.title,
      // Never trust a path stored in localStorage. Regenerate it from validated parts.
      path: `/study/${entry.subjectSlug}/${entry.unitNumber}`,
      lastOpenedAt: new Date(entry.lastOpenedAt).toISOString(),
    };
    const previous = unique.get(normalized.lessonId);
    if (!previous || normalized.lastOpenedAt > previous.lastOpenedAt) {
      unique.set(normalized.lessonId, normalized);
    }
  }
  return [...unique.values()]
    .sort((a, b) => b.lastOpenedAt.localeCompare(a.lastOpenedAt))
    .slice(0, MAX_HISTORY_ENTRIES);
}

/** History is local to this browser and separately keyed for guest mode and accounts. */
export function readLessonHistory(userId?: string | null): OpenedLesson[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(learningHistoryStorageKey(userId));
    return stored ? safeHistory(JSON.parse(stored)) : [];
  } catch {
    return [];
  }
}

/** Record a validated published-lesson identity, not an arbitrary URL. */
export function recordOpenedLesson(
  input: OpenedLessonInput,
  now: Date = new Date(),
  userId?: string | null,
): OpenedLesson[] {
  if (typeof input.lessonId !== "string" || !input.lessonId.trim() || input.lessonId.length > 256
    || typeof input.subjectSlug !== "string" || !/^[a-z0-9-]+$/.test(input.subjectSlug)
    || !Number.isSafeInteger(input.unitNumber) || input.unitNumber < 0
    || typeof input.title !== "string" || !input.title.trim()
    || !Number.isFinite(now.getTime())) {
    return readLessonHistory(userId);
  }

  const entry: OpenedLesson = {
    lessonId: input.lessonId,
    subjectSlug: input.subjectSlug,
    unitNumber: input.unitNumber,
    title: input.title,
    path: `/study/${input.subjectSlug}/${input.unitNumber}`,
    lastOpenedAt: now.toISOString(),
  };
  const next = [
    entry,
    ...readLessonHistory(userId).filter((lesson) => lesson.lessonId !== entry.lessonId),
  ].slice(0, MAX_HISTORY_ENTRIES);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(learningHistoryStorageKey(userId), JSON.stringify(next));
    } catch {
      // Keep lesson navigation usable if browser storage is unavailable or full.
    }
  }
  return next;
}

export function clearLessonHistory(userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(learningHistoryStorageKey(userId));
  } catch {
    // The page remains usable if storage is blocked.
  }
}
