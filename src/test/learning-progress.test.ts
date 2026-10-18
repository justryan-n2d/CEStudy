import { beforeEach, describe, expect, it } from "vitest";
import {
  clearLessonProgress,
  LEARNING_ACTIVITY_DAYS_STORAGE_KEY,
  LEARNING_PROGRESS_STORAGE_KEY,
  learningActivityStorageKey,
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
const signedInUserId = "auth-user-123";

beforeEach(() => {
  localStorage.clear();
});

describe("device-local learning progress", () => {
  it("records a completed lesson regardless of authentication", () => {
    const result = setLessonCompleted(lesson, true);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(lesson);
    expect(result[0].completedAt).toBeTruthy();
    expect(result[0].completedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(readCompletedLessons()).toEqual(result);
  });

  it("does not record streak activity for a signed-out lesson completion", () => {
    setLessonCompleted(lesson, true);

    expect(readLearningActivityDays()).toEqual([]);
    expect(localStorage.getItem(LEARNING_ACTIVITY_DAYS_STORAGE_KEY + "anonymous")).toBeNull();
  });

  it("records an activity day only for the signed-in account", () => {
    setLessonCompleted(lesson, true, signedInUserId);
    const now = new Date();
    const expectedDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    expect(readLearningActivityDays(signedInUserId)).toEqual([expectedDay]);
    expect(readLearningActivityDays("another-user")).toEqual([]);
  });

  it("records one activity day when multiple lessons are completed that day", () => {
    setLessonCompleted(lesson, true, signedInUserId);
    setLessonCompleted({ ...lesson, lessonId: "lesson-2", title: "Second lesson" }, true, signedInUserId);

    expect(readLearningActivityDays(signedInUserId)).toHaveLength(1);
  });

  it("keeps an activity day if the lesson is later marked incomplete", () => {
    setLessonCompleted(lesson, true, signedInUserId);
    setLessonCompleted(lesson, false, signedInUserId);

    expect(readCompletedLessons()).toEqual([]);
    expect(readLearningActivityDays(signedInUserId)).toHaveLength(1);
  });

  it("does not create duplicate lesson records when completion is repeated", () => {
    setLessonCompleted(lesson, true, signedInUserId);
    const result = setLessonCompleted({ ...lesson, title: "Updated title" }, true, signedInUserId);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Updated title");
  });

  it("removes a lesson record when the student marks it incomplete", () => {
    setLessonCompleted(lesson, true, signedInUserId);

    expect(setLessonCompleted(lesson, false, signedInUserId)).toEqual([]);
    expect(readCompletedLessons()).toEqual([]);
  });

  it("returns an empty list for malformed stored JSON", () => {
    localStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, "{not json");

    expect(readCompletedLessons()).toEqual([]);
  });

  it("migrates older local completion records by deriving their local completion day", () => {
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

  it("isolates activity history between accounts", () => {
    setLessonCompleted(lesson, true, signedInUserId);
    setLessonCompleted({ ...lesson, lessonId: "lesson-2" }, true, "other-user");

    expect(readLearningActivityDays(signedInUserId)).toHaveLength(1);
    expect(readLearningActivityDays("other-user")).toHaveLength(1);
    expect(learningActivityStorageKey(signedInUserId)).not.toBe(learningActivityStorageKey("other-user"));
  });

  it("clears lesson progress and only the current user's streak data", () => {
    localStorage.setItem("unrelated-app-data", "keep");
    setLessonCompleted(lesson, true, signedInUserId);
    setLessonCompleted({ ...lesson, lessonId: "lesson-2" }, true, "other-user");
    clearLessonProgress(signedInUserId);

    expect(readCompletedLessons()).toEqual([]);
    expect(readLearningActivityDays(signedInUserId)).toEqual([]);
    expect(readLearningActivityDays("other-user")).toHaveLength(1);
    expect(localStorage.getItem(learningActivityStorageKey(signedInUserId))).toBeNull();
    expect(localStorage.getItem(learningActivityStorageKey("other-user"))).not.toBeNull();
    expect(localStorage.getItem("unrelated-app-data")).toBe("keep");
  });
});
