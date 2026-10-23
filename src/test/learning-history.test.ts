import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LEARNING_HISTORY_STORAGE_KEY,
  readLessonHistory,
  recordOpenedLesson,
} from "../data/learning-history";

const firstLesson = {
  lessonId: "algebra-1",
  subjectSlug: "basic-algebra",
  unitNumber: 1,
  title: "Algebra Foundations",
};
const secondLesson = {
  lessonId: "algebra-2",
  subjectSlug: "basic-algebra",
  unitNumber: 2,
  title: "Linear Equations",
};

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("opened lesson history", () => {
  it("records the most recently opened lesson with a working route", () => {
    recordOpenedLesson(firstLesson, new Date("2026-10-17T10:00:00.000Z"));

    expect(readLessonHistory()).toEqual([{
      ...firstLesson,
      path: "/study/basic-algebra/1",
      lastOpenedAt: "2026-10-17T10:00:00.000Z",
    }]);
  });

  it("moves a lesson to the top when opened again without creating duplicates", () => {
    recordOpenedLesson(firstLesson, new Date("2026-10-17T10:00:00.000Z"));
    recordOpenedLesson(secondLesson, new Date("2026-10-17T11:00:00.000Z"));
    recordOpenedLesson(firstLesson, new Date("2026-10-17T12:00:00.000Z"));

    expect(readLessonHistory()).toHaveLength(2);
    expect(readLessonHistory()[0]).toMatchObject({
      lessonId: firstLesson.lessonId,
      lastOpenedAt: "2026-10-17T12:00:00.000Z",
    });
  });

  it("uses a safe empty state for malformed browser storage", () => {
    localStorage.setItem(LEARNING_HISTORY_STORAGE_KEY, "{broken");

    expect(readLessonHistory()).toEqual([]);
  });

  it("rebuilds safe internal paths instead of trusting stored paths", () => {
    localStorage.setItem(LEARNING_HISTORY_STORAGE_KEY, JSON.stringify([{
      ...firstLesson,
      path: "https://evil.example/steal",
      lastOpenedAt: "2026-10-17T10:00:00.000Z",
    }]));

    expect(readLessonHistory()[0].path).toBe("/study/basic-algebra/1");
  });

  it("ignores malformed timestamps and records", () => {
    localStorage.setItem(LEARNING_HISTORY_STORAGE_KEY, JSON.stringify([
      { ...firstLesson, lastOpenedAt: "not-a-date" },
      { lessonId: "missing-title", subjectSlug: "basic-algebra", unitNumber: 2 },
    ]));

    expect(readLessonHistory()).toEqual([]);
  });

  it("keeps navigation usable when local storage is unavailable or full", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage full", "QuotaExceededError");
    });

    expect(() => recordOpenedLesson(firstLesson)).not.toThrow();
    expect(readLessonHistory()).toEqual([]);
  });

  it("limits retained history to the latest 100 unique lessons", () => {
    for (let index = 1; index <= 105; index += 1) {
      recordOpenedLesson({
        lessonId: `lesson-${index}`,
        subjectSlug: "basic-algebra",
        unitNumber: index,
        title: `Lesson ${index}`,
      }, new Date(2026, 0, index));
    }

    expect(readLessonHistory()).toHaveLength(100);
    expect(readLessonHistory().some((lesson) => lesson.lessonId === "lesson-1")).toBe(false);
    expect(readLessonHistory()[0].lessonId).toBe("lesson-105");
  });
});
