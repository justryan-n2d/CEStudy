import { beforeEach, describe, expect, it } from "vitest";
import {
  clearLessonProgress,
  LEARNING_PROGRESS_STORAGE_KEY,
  readCompletedLessons,
  setLessonCompleted,
} from "../data/learning-progress";

const lesson = {
  lessonId: "lesson-1",
  subjectSlug: "basic-algebra",
  unitNumber: 1,
  title: "Algebra Foundations",
};

beforeEach(() => {
  localStorage.clear();
});

describe("device-local learning progress", () => {
  it("records a completed lesson in local storage", () => {
    const result = setLessonCompleted(lesson, true);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(lesson);
    expect(result[0].completedAt).toBeTruthy();
    expect(readCompletedLessons()).toEqual(result);
  });

  it("does not create duplicate records when a lesson is marked complete twice", () => {
    setLessonCompleted(lesson, true);
    const result = setLessonCompleted({ ...lesson, title: "Updated title" }, true);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Updated title");
  });

  it("removes a lesson record when the student marks it incomplete", () => {
    setLessonCompleted(lesson, true);

    expect(setLessonCompleted(lesson, false)).toEqual([]);
    expect(readCompletedLessons()).toEqual([]);
  });

  it("returns an empty list for malformed stored JSON", () => {
    localStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, "{not json");

    expect(readCompletedLessons()).toEqual([]);
  });

  it("ignores invalid records without crashing", () => {
    localStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify([
      lesson,
      { lessonId: "missing-fields" },
    ]));

    expect(readCompletedLessons()).toEqual([]);
  });

  it("clears only CEStudy progress data", () => {
    localStorage.setItem("unrelated-app-data", "keep");
    setLessonCompleted(lesson, true);
    clearLessonProgress();

    expect(readCompletedLessons()).toEqual([]);
    expect(localStorage.getItem("unrelated-app-data")).toBe("keep");
  });
});
