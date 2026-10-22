import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const { fetchCatalogSubjectsMock } = vi.hoisted(() => ({ fetchCatalogSubjectsMock: vi.fn() }));
vi.mock("../data/catalog-api", () => ({ fetchCatalogSubjects: fetchCatalogSubjectsMock }));

import { Layout } from "../components/Layout";
import type { CatalogSubject } from "../types/catalog";

const catalog: CatalogSubject[] = [
  {
    slug: "calculus-1", title: "Calculus 1", summary: "Limits and derivatives.",
    yearLevel: 1, semester: "First semester", category: "year-level",
    classification: "ched-common-course", specialization: null, aliases: [],
    sourceReference: "https://example.invalid/curriculum.pdf", sourceNote: "Sample placement.",
    availability: "coming-soon", displayOrder: 1,
  },
  {
    slug: "chemistry-for-engineers", title: "Chemistry for Engineers", summary: "Engineering chemistry.",
    yearLevel: 1, semester: "Second semester", category: "year-level",
    classification: "ched-common-course", specialization: null, aliases: [],
    sourceReference: "https://example.invalid/curriculum.pdf", sourceNote: "Sample placement.",
    availability: "coming-soon", displayOrder: 2,
  },
  {
    slug: "statics-of-rigid-bodies", title: "Statics of Rigid Bodies", summary: "Equilibrium.",
    yearLevel: 2, semester: "First semester", category: "year-level",
    classification: "ched-common-course", specialization: null, aliases: [],
    sourceReference: "https://example.invalid/curriculum.pdf", sourceNote: "Sample placement.",
    availability: "coming-soon", displayOrder: 3,
  },
  {
    slug: "structural-analysis-1", title: "Structural Analysis 1", summary: "Structural analysis.",
    yearLevel: 3, semester: "First semester", category: "year-level",
    classification: "ched-common-course", specialization: null, aliases: [],
    sourceReference: "https://example.invalid/curriculum.pdf", sourceNote: "Sample placement.",
    availability: "coming-soon", displayOrder: 4,
  },
  {
    slug: "design-project", title: "Design Project", summary: "Capstone work.",
    yearLevel: 4, semester: "Second semester", category: "year-level",
    classification: "ched-specialized-course", specialization: null, aliases: [],
    sourceReference: "https://example.invalid/curriculum.pdf", sourceNote: "Sample placement.",
    availability: "coming-soon", displayOrder: 5,
  },
  {
    slug: "basic-algebra", title: "Basic and Advanced Algebra", summary: "Foundational algebra.",
    yearLevel: null, semester: null, category: "math-foundation",
    classification: "supplementary-math-foundation", specialization: null, aliases: [],
    sourceReference: "", sourceNote: "", availability: "has-published-content", displayOrder: 6,
  },
];

function renderLayout(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Layout><h1>Test destination</h1></Layout>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  fetchCatalogSubjectsMock.mockReset();
  fetchCatalogSubjectsMock.mockResolvedValue(catalog);
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("Blueprint Academy hybrid navigation", () => {
  it("opens the Year Levels disclosure and derives semester/subject links from catalog metadata", async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole("button", { name: "Year Levels" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = await screen.findByRole("region", { name: "Year-level navigation" });
    expect(within(panel).getByRole("link", { name: "Browse all year levels" })).toHaveAttribute("href", "/years");

    await user.click(within(panel).getByText("First year", { selector: ".year-level-menu-year-title" }));
    expect(within(panel).getByText("First semester", { selector: ".year-level-menu-semester > summary" })).toBeInTheDocument();
    expect(within(panel).getByText("Second semester", { selector: ".year-level-menu-semester > summary" })).toBeInTheDocument();

    const firstYearSection = within(panel).getByText("First year", { selector: ".year-level-menu-year-title" }).closest("details");
    expect(firstYearSection).not.toBeNull();
    await user.click(within(firstYearSection as HTMLElement).getByText("First semester", { selector: ".year-level-menu-semester > summary" }));
    expect(within(panel).getByRole("link", { name: /Calculus 1/ })).toHaveAttribute("href", "/subjects/calculus-1");
    expect(within(panel).queryByText("Basic and Advanced Algebra")).not.toBeInTheDocument();
    expect(fetchCatalogSubjectsMock).toHaveBeenCalledTimes(1);
  });

  it("shows a useful recovery path if catalog data fails to load in the Year Levels menu", async () => {
    const user = userEvent.setup();
    fetchCatalogSubjectsMock.mockRejectedValueOnce(new Error("Catalog unavailable"));
    renderLayout();

    await user.click(screen.getByRole("button", { name: "Year Levels" }));
    const panel = await screen.findByRole("region", { name: "Year-level navigation" });
    expect(within(panel).getByRole("alert")).toHaveTextContent(/could not load year-level subjects/i);
    expect(within(panel).getByRole("link", { name: "Browse all year levels" })).toHaveAttribute("href", "/years");
  });

  it("closes the Year Levels disclosure on Escape and restores focus to its trigger", async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole("button", { name: "Year Levels" });
    await user.click(trigger);
    expect(await screen.findByRole("region", { name: "Year-level navigation" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("region", { name: "Year-level navigation" })).not.toBeInTheDocument());
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("opens a Review Materials mega-menu with all three approved resource categories", async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole("button", { name: "Review Materials Hub" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);

    const panel = await screen.findByRole("region", { name: "Review Materials Hub navigation" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(within(panel).getByRole("heading", { name: "Formula Sheets" })).toBeInTheDocument();
    expect(within(panel).getByRole("heading", { name: "Problem Sets with Solutions" })).toBeInTheDocument();
    expect(within(panel).getByRole("heading", { name: "Video Tutorials" })).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: /browse all review materials/i })).toHaveAttribute("href", "/review-materials");
  });

  it("exposes direct Mock Exam Portal and Community Forum destinations without implying exam controls exist", async () => {
    const user = userEvent.setup();
    renderLayout();

    expect(screen.getByRole("link", { name: "Mock Exam Portal" })).toHaveAttribute("href", "/mock-exam-portal");
    expect(screen.getByRole("link", { name: "Community Forum" })).toHaveAttribute("href", "/community");

    const mobileToggle = screen.getByRole("button", { name: "Open more pages menu" });
    await user.click(mobileToggle);
    const more = screen.getByRole("navigation", { name: "More CEStudy pages" });
    expect(within(more).getByRole("link", { name: "Review Materials Hub" })).toHaveAttribute("href", "/review-materials");
    expect(within(more).getByRole("link", { name: "Mock Exam Portal" })).toHaveAttribute("href", "/mock-exam-portal");
    expect(within(more).getByRole("link", { name: "Community Forum" })).toHaveAttribute("href", "/community");
    expect(screen.queryByRole("button", { name: /start mock exam/i })).not.toBeInTheDocument();
  });

  it("closes an open global navigation panel when a route is changed", async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole("button", { name: "Review Materials Hub" }));
    expect(await screen.findByRole("region", { name: "Review Materials Hub navigation" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Subject Catalog" }));
    await waitFor(() => expect(screen.queryByRole("region", { name: "Review Materials Hub navigation" })).not.toBeInTheDocument());
  });
});
