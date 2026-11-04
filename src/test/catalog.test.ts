import { describe, expect, it } from "vitest";
import { CATALOG_SUBJECTS } from "../data/catalog";
import { SPECIALIZATIONS } from "../types/catalog";

describe("catalog contract", () => {
  it("includes all four year levels", () => {
    for (const year of [1, 2, 3, 4]) {
      expect(CATALOG_SUBJECTS.some((subject) => subject.yearLevel === year)).toBe(true);
    }
  });

  it("includes all five specialization areas", () => {
    for (const label of SPECIALIZATIONS) {
      expect(CATALOG_SUBJECTS.some((subject) => subject.specialization === label)).toBe(true);
    }
  });

  it("includes year-independent mathematics foundations", () => {
    const list = CATALOG_SUBJECTS.filter((subject) => subject.category === "math-foundation");
    expect(list.length).toBeGreaterThanOrEqual(6);
    expect(list.every((subject) => subject.yearLevel === null)).toBe(true);
    expect(list.some((subject) => subject.slug === "basic-algebra")).toBe(true);
  });

  it("does not present generic numbered specialty slots as real subjects", () => {
    expect(CATALOG_SUBJECTS.some((subject) => /professional course - specialized [1-5]/i.test(subject.title))).toBe(false);
  });

  it("keeps content status separate from subject discovery", () => {
    expect(CATALOG_SUBJECTS.some((subject) => subject.availability === "coming-soon")).toBe(true);
    expect(CATALOG_SUBJECTS.every((subject) => Boolean(subject.sourceNote))).toBe(true);
  });

  it("keeps catalog slugs unique and metadata within the supported contract", () => {
    const slugs = CATALOG_SUBJECTS.map((subject) => subject.slug);
    const validYears = new Set([1, 2, 3, 4]);
    const validClassifications = new Set([
      "ched-common-course",
      "ched-specialized-course",
      "supplementary-math-foundation",
      "additional-ce-review-topic",
    ]);
    const validAvailability = new Set(["coming-soon", "in-preparation", "has-published-content"]);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(CATALOG_SUBJECTS.every((subject) => subject.yearLevel === null || validYears.has(subject.yearLevel))).toBe(true);
    expect(CATALOG_SUBJECTS.every((subject) => validClassifications.has(subject.classification))).toBe(true);
    expect(CATALOG_SUBJECTS.every((subject) => validAvailability.has(subject.availability))).toBe(true);
    expect(CATALOG_SUBJECTS.every((subject) => subject.sourceNote.trim().length > 0)).toBe(true);
  });
});
