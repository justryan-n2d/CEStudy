import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CatalogSubject } from "../types/catalog";

const mocks = vi.hoisted(() => ({
  fetchCatalogSubjects: vi.fn(),
}));

vi.mock("../data/catalog-api", () => ({
  fetchCatalogSubjects: mocks.fetchCatalogSubjects,
}));

import { useCatalog } from "../hooks/useCatalog";

const subject: CatalogSubject = {
  slug: "statics-of-rigid-bodies",
  title: "Statics of Rigid Bodies",
  summary: "Forces and equilibrium.",
  yearLevel: 2,
  semester: "First semester",
  category: "year-level",
  classification: "ched-common-course",
  specialization: null,
  aliases: ["statics"],
  sourceReference: "https://example.edu/curriculum",
  sourceNote: "Synthetic curriculum source note.",
  availability: "coming-soon",
  displayOrder: 10,
};

beforeEach(() => {
  mocks.fetchCatalogSubjects.mockReset();
});

describe("useCatalog", () => {
  it("starts in a loading state and exposes the fetched subjects", async () => {
    let resolveRequest!: (items: CatalogSubject[]) => void;
    mocks.fetchCatalogSubjects.mockReturnValue(new Promise<CatalogSubject[]>((resolve) => {
      resolveRequest = resolve;
    }));

    const { result } = renderHook(() => useCatalog());

    expect(result.current.loading).toBe(true);
    expect(result.current.subjects).toEqual([]);
    expect(result.current.error).toBeNull();

    await act(async () => {
      resolveRequest([subject]);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.subjects).toEqual([subject]);
    expect(result.current.error).toBeNull();
  });

  it("exposes a readable error when loading the catalog fails", async () => {
    mocks.fetchCatalogSubjects.mockRejectedValue(new Error("Catalog service unavailable."));

    const { result } = renderHook(() => useCatalog());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.subjects).toEqual([]);
    expect(result.current.error).toBe("Catalog service unavailable.");
  });

  it("does not update hook state after the component unmounts", async () => {
    let resolveRequest!: (items: CatalogSubject[]) => void;
    mocks.fetchCatalogSubjects.mockReturnValue(new Promise<CatalogSubject[]>((resolve) => {
      resolveRequest = resolve;
    }));

    const { result, unmount } = renderHook(() => useCatalog());
    unmount();

    await act(async () => {
      resolveRequest([subject]);
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.subjects).toEqual([]);
  });
});
