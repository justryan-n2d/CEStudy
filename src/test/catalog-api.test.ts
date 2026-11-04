import { beforeEach, describe, expect, it, vi } from "vitest";
import { CATALOG_SUBJECTS } from "../data/catalog";

const mocks = vi.hoisted(() => ({
  supabase: null as null | { from: ReturnType<typeof vi.fn> },
  from: vi.fn(),
  select: vi.fn(),
  order: vi.fn(),
}));

vi.mock("../lib/supabase", () => ({
  get supabase() {
    return mocks.supabase;
  },
}));

import { fetchCatalogSubjects } from "../data/catalog-api";

const query = {
  select: mocks.select,
  order: mocks.order,
};

const remoteRow = {
  slug: "statics-of-rigid-bodies",
  title: "Statics of Rigid Bodies",
  summary: "Forces and equilibrium.",
  year_level: 2,
  semester: "First semester",
  category: "year-level",
  classification: "ched-common-course",
  specialization: null,
  aliases: ["statics", "engineering statics"],
  source_reference: "https://example.edu/curriculum",
  source_note: "Synthetic curriculum source note.",
  availability: "coming-soon",
  display_order: 10,
};

beforeEach(() => {
  mocks.supabase = { from: mocks.from };
  mocks.from.mockReset().mockReturnValue(query);
  mocks.select.mockReset().mockReturnValue(query);
  mocks.order.mockReset().mockResolvedValue({ data: [remoteRow], error: null });
});

describe("catalog API", () => {
  it("uses the local catalog fallback when Supabase is not configured", async () => {
    mocks.supabase = null;

    await expect(fetchCatalogSubjects()).resolves.toBe(CATALOG_SUBJECTS);
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("selects the public catalog projection and maps database fields to the app model", async () => {
    const subjects = await fetchCatalogSubjects();

    expect(mocks.from).toHaveBeenCalledWith("catalog_subjects");
    expect(mocks.select).toHaveBeenCalledWith(
      "slug,title,summary,year_level,semester,category,classification,specialization,aliases,source_reference,source_note,availability,display_order",
    );
    expect(mocks.order).toHaveBeenCalledWith("display_order", { ascending: true });
    expect(mocks.select.mock.calls[0][0]).not.toMatch(/review_notes|reviewed_at/);
    expect(subjects).toEqual([{
      slug: "statics-of-rigid-bodies",
      title: "Statics of Rigid Bodies",
      summary: "Forces and equilibrium.",
      yearLevel: 2,
      semester: "First semester",
      category: "year-level",
      classification: "ched-common-course",
      specialization: null,
      aliases: ["statics", "engineering statics"],
      sourceReference: "https://example.edu/curriculum",
      sourceNote: "Synthetic curriculum source note.",
      availability: "coming-soon",
      displayOrder: 10,
    }]);
  });

  it("preserves nullable year and semester values from the database", async () => {
    mocks.order.mockResolvedValueOnce({
      data: [{
        ...remoteRow,
        year_level: null,
        semester: null,
      }],
      error: null,
    });

    const [subject] = await fetchCatalogSubjects();

    expect(subject.yearLevel).toBeNull();
    expect(subject.semester).toBeNull();
  });

  it("returns a safe error when the database query fails", async () => {
    mocks.order.mockResolvedValueOnce({
      data: null,
      error: { message: "Internal database detail." },
    });

    await expect(fetchCatalogSubjects()).rejects.toThrow(
      "The subject catalog could not be loaded.",
    );
  });
});
