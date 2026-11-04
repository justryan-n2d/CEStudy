import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubjectPage } from "../pages/SubjectPage";
import type { CatalogSubject } from "../types/catalog";

const mocks = vi.hoisted(() => ({
  fetchCatalogSubjects: vi.fn(),
}));

vi.mock("../data/catalog-api", () => ({
  fetchCatalogSubjects: mocks.fetchCatalogSubjects,
}));

function makeSubject(overrides: Partial<CatalogSubject> = {}): CatalogSubject {
  return {
    slug: "first-subject",
    title: "First Subject",
    summary: "A first synthetic subject fixture.",
    yearLevel: 2,
    semester: "First semester",
    category: "year-level",
    classification: "ched-common-course",
    specialization: null,
    aliases: ["first"],
    sourceReference: "https://example.edu/first-subject",
    sourceNote: "Synthetic source note for tests.",
    availability: "coming-soon",
    displayOrder: 1,
    ...overrides,
  };
}

function RouteControls() {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate("/subjects/second-subject")}>
      Show second subject
    </button>
  );
}

beforeEach(() => {
  mocks.fetchCatalogSubjects.mockReset();
});

describe("subject page route lifecycle", () => {
  it("shows a loading state instead of stale subject content when the slug changes", async () => {
    const firstSubject = makeSubject();
    const secondSubject = makeSubject({
      slug: "second-subject",
      title: "Second Subject",
      summary: "A second synthetic subject fixture.",
      sourceReference: "",
      yearLevel: null,
      semester: null,
    });

    let resolveFirst!: (items: CatalogSubject[]) => void;
    let resolveSecond!: (items: CatalogSubject[]) => void;

    mocks.fetchCatalogSubjects
      .mockImplementationOnce(() => new Promise<CatalogSubject[]>((resolve) => {
        resolveFirst = resolve;
      }))
      .mockImplementationOnce(() => new Promise<CatalogSubject[]>((resolve) => {
        resolveSecond = resolve;
      }));

    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/subjects/first-subject"]}>
        <RouteControls />
        <Routes>
          <Route path="/subjects/:slug" element={<SubjectPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => expect(resolveFirst).toBeDefined());
    await act(async () => {
      resolveFirst([firstSubject, secondSubject]);
    });
    expect(await screen.findByRole("heading", { name: "First Subject" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show second subject" }));

    expect(screen.getByRole("status")).toHaveTextContent("Loading subject…");
    expect(screen.queryByRole("heading", { name: "First Subject" })).not.toBeInTheDocument();

    await waitFor(() => expect(resolveSecond).toBeDefined());
    await act(async () => {
      resolveSecond([firstSubject, secondSubject]);
    });
    expect(await screen.findByRole("heading", { name: "Second Subject" })).toBeInTheDocument();
  });
});
