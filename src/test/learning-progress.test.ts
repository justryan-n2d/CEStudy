import { beforeEach, describe, expect, it } from "vitest";
import {
  clearLessonProgress,
  LEARNING_ACTIVITY_DAYS_STORAGE_KEY,
  LEARNING_PROGRESS_STORAGE_KEY,
  readCompletedLessons,
  readLearningActivityDays,
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
    expect(result[0].completedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(readCompletedLessons()).toEqual(result);
  });

  it("records a local activity day when a published lesson is completed", () => {
    setLessonCompleted(lesson, true);
    const now = new Date();
    const expectedDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    expect(readLearningActivityDays()).toEqual([expectedDay]);
  });

  it("records one activity day when multiple lessons are completed that day", () => {
    setLessonCompleted(lesson, true);
    setLessonCompleted({ ...lesson, lessonId: "lesson-2", title: "Second lesson" }, true);

    expect(readLearningActivityDays()).toHaveLength(1);
  });

  it("keeps the activity day if the lesson is later marked incomplete", () => {
    setLessonCompleted(lesson, true);
    setLessonCompleted(lesson, false);

    expect(readCompletedLessons()).toEqual([]);
    expect(readLearningActivityDays()).toHaveLength(1);
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

  it("migrates older local records by deriving their local completion day", () => {
    localStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify([{
      ...lesson,
      completedAt: "2026-10-17T17:00:00.000Z",
    }]));

    expect(readCompletedLessons()[0].completedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
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
    expect(readLearningActivityDays()).toEqual([]);
    expect(localStorage.getItem(LEARNING_ACTIVITY_DAYS_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem("unrelated-app-data")).toBe("keep");
  });
});
