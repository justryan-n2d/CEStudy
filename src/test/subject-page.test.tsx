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

function renderSubjectPage(slug: string) {
  return render(
    <MemoryRouter initialEntries={["/subjects/" + slug]}>
      <Routes>
        <Route path="/subjects/:slug" element={<SubjectPage />} />
      </Routes>
    </MemoryRouter>,
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
    expect(screen.queryByText(/Typical placement:/)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Open curriculum source/ })).not.toBeInTheDocument();
  });

  it("renders source provenance, available placement metadata, and at most three related subjects", async () => {
    const subject = makeSubject();
    const relatedSubjects = Array.from({ length: 5 }, (_, index) => makeSubject({
      slug: "related-subject-" + (index + 1),
      title: "Related Subject " + (index + 1),
      displayOrder: index + 2,
    }));
    mocks.fetchCatalogSubjects.mockResolvedValue([subject, ...relatedSubjects]);

    renderSubjectPage("first-subject");

    expect(await screen.findByRole("heading", { name: "First Subject" })).toBeInTheDocument();
    expect(screen.getByText(/Typical placement:/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "CHED sample curriculum: common course" })).toBeInTheDocument();
    expect(screen.getByText("Coming soon", { selector: ".detail-hero .status" })).toBeInTheDocument();
    expect(screen.getByText("Synthetic source note for tests.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open curriculum source ↗" })).toHaveAttribute(
      "href",
      "https://example.edu/first-subject",
    );
    expect(screen.getAllByRole("link", { name: /Related Subject/ })).toHaveLength(3);
  });

  it("keeps Basic Algebra linked directly to its reviewer", async () => {
    const algebra = makeSubject({
      slug: "basic-algebra",
      title: "Basic and Advanced Algebra",
      summary: "Algebra foundations.",
      yearLevel: null,
      semester: null,
      category: "math-foundation",
      classification: "supplementary-math-foundation",
      sourceReference: "CEStudy supplementary review catalog",
      availability: "in-preparation",
    });
    mocks.fetchCatalogSubjects.mockResolvedValue([algebra]);

    renderSubjectPage("basic-algebra");

    expect(await screen.findByRole("heading", { name: "Basic and Advanced Algebra" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open reviewer →" })).toHaveAttribute(
      "href",
      "/study/basic-algebra",
    );
    expect(screen.queryByRole("heading", { name: "Course classification" })).not.toBeInTheDocument();
  });

  it("shows a not-found state when the requested slug is absent", async () => {
    mocks.fetchCatalogSubjects.mockResolvedValue([makeSubject()]);

    renderSubjectPage("missing-subject");

    expect(await screen.findByRole("heading", { name: "Subject not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to subjects" })).toHaveAttribute("href", "/catalog");
  });

  it("shows a recoverable error state when the catalog request fails", async () => {
    mocks.fetchCatalogSubjects.mockRejectedValue(new Error("Catalog request failed."));

    renderSubjectPage("first-subject");

    expect(await screen.findByRole("alert")).toHaveTextContent("Subject unavailable");
    expect(screen.getByRole("alert")).toHaveTextContent("Catalog request failed.");
    expect(screen.getByRole("link", { name: "Return to subjects" })).toHaveAttribute("href", "/catalog");
  });
});
