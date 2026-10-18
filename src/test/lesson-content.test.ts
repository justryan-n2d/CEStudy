import { describe, expect, it } from "vitest";
import {
  canTransitionContentStatus,
  parseReviewPracticeQuestion,
  parseSubjectLesson,
  type ContentStatus,
} from "../types/lesson-content";

const validLesson = {
  id: "algebra-foundations-unit-00",
  subject_slug: "basic-algebra",
  unit_number: 0,
  slug: "readiness-diagnostic",
  title: "Readiness Diagnostic",
  learning_objectives: ["Identify prerequisite gaps"],
  lesson_markdown: "# Diagnostic\nReview arithmetic.",
  source_note: "Original CEStudy draft.",
  status: "needs-review",
  review_notes: "Human review pending",
  reviewed_at: null,
  updated_at: "2026-10-18T00:00:00Z",
};

describe("lesson draft parsing", () => {
  it("maps a well-formed review lesson into the UI model", () => {
    expect(parseSubjectLesson(validLesson)).toMatchObject({
      id: "algebra-foundations-unit-00",
      subjectSlug: "basic-algebra",
      unitNumber: 0,
      title: "Readiness Diagnostic",
      status: "needs-review",
    });
  });

  it("rejects missing lesson body and invalid unit number", () => {
    expect(parseSubjectLesson({ ...validLesson, lesson_markdown: "" })).toBeNull();
    expect(parseSubjectLesson({ ...validLesson, unit_number: 13 })).toBeNull();
  });

  it("rejects unknown workflow statuses", () => {
    expect(parseSubjectLesson({ ...validLesson, status: "approved-by-ai" })).toBeNull();
  });
});

describe("content status transitions", () => {
  const cases: Array<[ContentStatus, ContentStatus, boolean]> = [
    ["needs-review", "verified", true],
    ["needs-review", "correction-required", true],
    ["verified", "published", true],
    ["published", "needs-review", true],
    ["correction-required", "needs-review", true],
    ["needs-review", "published", false],
    ["draft", "published", false],
    ["retired", "published", false],
  ];

  it.each(cases)("%s to %s is %s", (from, to, allowed) => {
    expect(canTransitionContentStatus(from, to)).toBe(allowed);
  });
});

const validQuestion = {
  id: "algebra-foundations-u00-q01",
  subject_slug: "basic-algebra",
  topic: "Synthetic topic",
  prompt: "TEST PROMPT",
  choices: ["TEST OPTION A", "TEST OPTION B"],
  correct_answer: "TEST OPTION B",
  solution_steps: ["TEST STEP ONE"],
  explanation: "TEST EXPLANATION",
  source_note: "Synthetic test fixture.",
  status: "needs-review",
  review_notes: "",
  reviewed_at: null,
  updated_at: "2026-10-18T00:00:00Z",
  display_order: 9,
};

describe("practice-question review parsing", () => {
  it("accepts a well-formed question with an answer present in its choices", () => {
    expect(parseReviewPracticeQuestion(validQuestion)).toMatchObject({
      id: "algebra-foundations-u00-q01",
      correctAnswer: "TEST OPTION B",
      status: "needs-review",
    });
  });

  it("rejects a review question if its answer is not one of its choices", () => {
    expect(parseReviewPracticeQuestion({ ...validQuestion, correct_answer: "NOT A CHOICE" })).toBeNull();
  });

  it("rejects invalid question choice and step arrays", () => {
    expect(parseReviewPracticeQuestion({ ...validQuestion, choices: ["ONLY ONE"] })).toBeNull();
    expect(parseReviewPracticeQuestion({ ...validQuestion, solution_steps: [] })).toBeNull();
  });
});
