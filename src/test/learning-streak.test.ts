import { describe, expect, it } from "vitest";
import { getLearningStreak } from "../data/learning-streak";

describe("learning streak", () => {
  it("counts one active day once even when multiple completions share that day", () => {
    const result = getLearningStreak([
      "2026-10-18",
      "2026-10-18",
      "2026-10-18",
    ], new Date(2026, 9, 18, 12));

    expect(result).toEqual({ currentStreak: 1, completedToday: true });
  });

  it("counts consecutive local calendar days including today", () => {
    const result = getLearningStreak([
      "2026-10-16",
      "2026-10-17",
      "2026-10-18",
    ], new Date(2026, 9, 18, 12));

    expect(result).toEqual({ currentStreak: 3, completedToday: true });
  });

  it("keeps yesterday's streak active until the current day ends", () => {
    const result = getLearningStreak([
      "2026-10-16",
      "2026-10-17",
    ], new Date(2026, 9, 18, 12));

    expect(result).toEqual({ currentStreak: 2, completedToday: false });
  });

  it("resets the current streak after a missed day", () => {
    const result = getLearningStreak([
      "2026-10-14",
      "2026-10-16",
    ], new Date(2026, 9, 18, 12));

    expect(result).toEqual({ currentStreak: 0, completedToday: false });
  });

  it("uses the saved local calendar day rather than recalculating it from UTC", () => {
    const result = getLearningStreak(
      ["2026-10-18"],
      new Date(2026, 9, 18, 12),
    );

    expect(result).toEqual({ currentStreak: 1, completedToday: true });
  });

  it("ignores malformed calendar dates instead of counting them", () => {
    const result = getLearningStreak(
      ["not-a-date", "2026-02-30"],
      new Date(2026, 9, 18, 12),
    );

    expect(result).toEqual({ currentStreak: 0, completedToday: false });
  });
});
