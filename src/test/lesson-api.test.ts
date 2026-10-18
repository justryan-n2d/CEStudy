import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  select: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
}));
vi.mock("../lib/supabase", () => ({ supabase: { from: mocks.from } }));

import { fetchPublishedLessons } from "../data/lesson-api";

const publishedRow = {
  id: "algebra-foundations-unit-01",
  subject_slug: "basic-algebra",
  unit_number: 1,
  slug: "real-numbers-and-arithmetic",
  title: "Real Numbers and Arithmetic",
  learning_objectives: ["Calculate with real numbers"],
  lesson_markdown: "# TEST PUBLISHED BODY",
  source_note: "Synthetic test fixture.",
  status: "published",
  updated_at: "2026-10-18T00:00:00.000Z",
};

const query = { select: mocks.select, eq: mocks.eq, order: mocks.order };

beforeEach(() => {
  mocks.from.mockReset().mockReturnValue(query);
  mocks.select.mockReset().mockReturnValue(query);
  mocks.eq.mockReset().mockReturnValue(query);
  mocks.order.mockReset().mockResolvedValue({ data: [publishedRow], error: null });
});

describe("published lesson API", () => {
  it("requests only public lesson columns and filters by published status", async () => {
    const lessons = await fetchPublishedLessons("basic-algebra");

    expect(lessons).toHaveLength(1);
    expect(lessons[0].title).toBe("Real Numbers and Arithmetic");
    expect(mocks.from).toHaveBeenCalledWith("subject_lessons");
    expect(mocks.select).toHaveBeenCalledWith(
      "id,subject_slug,unit_number,slug,title,learning_objectives,lesson_markdown,source_note,status,updated_at",
    );
    expect(mocks.eq).toHaveBeenCalledWith("subject_slug", "basic-algebra");
    expect(mocks.eq).toHaveBeenCalledWith("status", "published");
    expect(mocks.select.mock.calls[0][0]).not.toMatch(/review_notes|reviewed_at/);
  });

  it("does not return an unpublished row even if a response contains one unexpectedly", async () => {
    mocks.order.mockResolvedValueOnce({
      data: [{ ...publishedRow, status: "needs-review", lesson_markdown: "# PRIVATE TEST DRAFT" }],
      error: null,
    });

    await expect(fetchPublishedLessons("basic-algebra")).resolves.toEqual([]);
  });

  it("returns an empty list when Supabase is not configured through the same data contract", async () => {
    mocks.order.mockResolvedValueOnce({ data: [], error: null });
    await expect(fetchPublishedLessons("basic-algebra")).resolves.toEqual([]);
  });
});
