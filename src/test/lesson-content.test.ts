import { describe, expect, it } from "vitest";
import {
  canTransitionContentStatus,
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
