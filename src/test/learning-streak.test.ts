import { describe, expect, it } from "vitest";
import { getLearningStreak } from "../data/learning-streak";
import type { CompletedLesson } from "../data/learning-progress";

function completion(lessonId: string, completedOn: string): CompletedLesson {
  return {
    lessonId,
    subjectSlug: "basic-algebra",
    unitNumber: 1,
    title: "Test lesson",
    completedAt: `${completedOn}T12:00:00.000Z`,
    completedOn,
  };
}

describe("learning streak", () => {
  it("counts one active day once even when several lessons were completed that day", () => {
    const result = getLearningStreak([
      completion("lesson-1", "2026-10-18"),
      completion("lesson-2", "2026-10-18"),
      completion("lesson-3", "2026-10-18"),
    ], new Date(2026, 9, 18, 12));

    expect(result).toEqual({ currentStreak: 1, completedToday: true });
  });

  it("counts consecutive local calendar days including today", () => {
    const result = getLearningStreak([
      completion("lesson-1", "2026-10-16"),
      completion("lesson-2", "2026-10-17"),
      completion("lesson-3", "2026-10-18"),
    ], new Date(2026, 9, 18, 12));

    expect(result).toEqual({ currentStreak: 3, completedToday: true });
  });

  it("keeps yesterday's streak active until the current day ends", () => {
    const result = getLearningStreak([
      completion("lesson-1", "2026-10-16"),
      completion("lesson-2", "2026-10-17"),
    ], new Date(2026, 9, 18, 12));

    expect(result).toEqual({ currentStreak: 2, completedToday: false });
  });

  it("resets the current streak after a missed day", () => {
    const result = getLearningStreak([
      completion("lesson-1", "2026-10-14"),
      completion("lesson-2", "2026-10-16"),
    ], new Date(2026, 9, 18, 12));

    expect(result).toEqual({ currentStreak: 0, completedToday: false });
  });

  it("ignores malformed calendar dates instead of counting them", () => {
    const result = getLearningStreak([
      completion("lesson-1", "not-a-date"),
    ], new Date(2026, 9, 18, 12));

    expect(result).toEqual({ currentStreak: 0, completedToday: false });
  });
});
