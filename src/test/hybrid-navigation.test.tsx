import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";

const stylesheet = readFileSync(new URL("../styles/global.css", import.meta.url), "utf8");

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
  vi.useRealTimers();
  localStorage.clear();
});

describe("Blueprint Academy hybrid navigation", () => {
  it("uses shared semantic theme tokens for navigation panels", () => {
    expect(stylesheet).toMatch(/\.year-level-menu\s*\{[^}]*background:\s*var\(--ui-surface\)/s);
    expect(stylesheet).toMatch(/\.review-materials-menu\s*\{[^}]*background:\s*var\(--ui-surface\)/s);
    expect(stylesheet).toMatch(/\.review-materials-menu-card\s*\{[^}]*background:\s*var\(--ui-surface-muted\)/s);
    expect(stylesheet).toMatch(/\.navigation-panel-error\s*\{[^}]*background:\s*var\(--ui-error-bg\)/s);
    expect(stylesheet).toMatch(/\.review-materials-menu-status\s*\{[^}]*background:\s*var\(--ui-disabled-bg\)/s);
  });

  it("opens the Year Levels disclosure and derives semester/subject links from catalog metadata", async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole("button", { name: "Year Levels" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = await screen.findByRole("region", { name: "Year-level navigation" });
    expect(within(panel).getByRole("link", { name: "Browse all year levels" })).toHaveAttribute("href", "/years");
    await within(panel).findByText("First year", { selector: ".year-level-menu-year-title" });

    await user.click(within(panel).getByText("First year", { selector: ".year-level-menu-year-title" }));
    const firstYearSection = within(panel).getByText("First year", { selector: ".year-level-menu-year-title" }).closest("details");
    expect(firstYearSection).not.toBeNull();
    const firstYear = within(firstYearSection as HTMLElement);
    expect(firstYear.getByText("First semester", { selector: ".year-level-menu-semester > summary" })).toBeInTheDocument();
    expect(firstYear.getByText("Second semester", { selector: ".year-level-menu-semester > summary" })).toBeInTheDocument();

    await user.click(firstYear.getByText("First semester", { selector: ".year-level-menu-semester > summary" }));
    expect(within(panel).getByRole("link", { name: /Calculus 1/ })).toHaveAttribute("href", "/subjects/calculus-1");
    expect(within(panel).queryByText("Basic and Advanced Algebra")).not.toBeInTheDocument();
    expect(fetchCatalogSubjectsMock).toHaveBeenCalledTimes(1);
  });

  it("shows an accessible recovery path when the catalog request stalls", async () => {
    vi.useFakeTimers();
    fetchCatalogSubjectsMock.mockReturnValueOnce(new Promise<CatalogSubject[]>(() => {}));
    renderLayout();

    fireEvent.click(screen.getByRole("button", { name: "Year Levels" }));
    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(screen.getByRole("alert")).toHaveTextContent(/catalog request timed out/i);
    expect(screen.getByRole("link", { name: "Open Subject Catalog" })).toHaveAttribute("href", "/catalog");
  });

  it("does not replace the timeout message with a late catalog response", async () => {
    vi.useFakeTimers();
    let resolveCatalog: (items: CatalogSubject[]) => void = () => {};
    fetchCatalogSubjectsMock.mockReturnValueOnce(new Promise<CatalogSubject[]>((resolve) => {
      resolveCatalog = resolve;
    }));
    renderLayout();

    fireEvent.click(screen.getByRole("button", { name: "Year Levels" }));
    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });
    expect(screen.getByRole("alert")).toHaveTextContent(/catalog request timed out/i);

    await act(async () => {
      resolveCatalog(catalog);
      await Promise.resolve();
    });

    expect(screen.getByRole("alert")).toHaveTextContent(/catalog request timed out/i);
    expect(screen.queryByText("Calculus 1")).not.toBeInTheDocument();
  });

  it("reuses successfully loaded catalog data when the Year Levels menu is reopened", async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole("button", { name: "Year Levels" });
    await user.click(trigger);
    await screen.findByRole("region", { name: "Year-level navigation" });
    await waitFor(() => expect(fetchCatalogSubjectsMock).toHaveBeenCalledTimes(1));

    await user.click(trigger);
    await waitFor(() => expect(screen.queryByRole("region", { name: "Year-level navigation" })).not.toBeInTheDocument());
    await user.click(trigger);
    await screen.findByRole("region", { name: "Year-level navigation" });

    expect(fetchCatalogSubjectsMock).toHaveBeenCalledTimes(1);
  });

  it("shows a useful recovery path if catalog data fails to load in the Year Levels menu", async () => {
    const user = userEvent.setup();
    fetchCatalogSubjectsMock.mockRejectedValueOnce(new Error("Catalog unavailable"));
    renderLayout();

    await user.click(screen.getByRole("button", { name: "Year Levels" }));
    const panel = await screen.findByRole("region", { name: "Year-level navigation" });
    expect(await within(panel).findByRole("alert")).toHaveTextContent(/could not load year-level subjects/i);
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

  it("keeps Subject Catalog active while reading or practicing a subject", () => {
    renderLayout("/study/basic-algebra");

    const mainNavigation = within(screen.getByRole("navigation", { name: "Main navigation" }));
    expect(mainNavigation.getByRole("link", { name: "Subject Catalog" })).toHaveClass("active");
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

    const mainNavigation = within(screen.getByRole("navigation", { name: "Main navigation" }));
    expect(mainNavigation.getByRole("link", { name: "Mock Exam Portal" })).toHaveAttribute("href", "/mock-exam-portal");
    expect(mainNavigation.getByRole("link", { name: "Community Forum" })).toHaveAttribute("href", "/community");

    const mobileToggle = screen.getByRole("button", { name: "Open more pages menu" });
    await user.click(mobileToggle);
    const more = screen.getByRole("navigation", { name: "More CEStudy pages" });
    expect(within(more).getByRole("link", { name: "Review Materials Hub" })).toHaveAttribute("href", "/review-materials");
    expect(within(more).getByRole("link", { name: "Mock Exam Portal" })).toHaveAttribute("href", "/mock-exam-portal");
    expect(within(more).getByRole("link", { name: "Community Forum" })).toHaveAttribute("href", "/community");
    expect(screen.queryByRole("button", { name: /start mock exam/i })).not.toBeInTheDocument();
  });

  it("closes desktop and mobile navigation panels on outside pointer interaction", async () => {
    const user = userEvent.setup();
    renderLayout();

    const materialsTrigger = screen.getByRole("button", { name: "Review Materials Hub" });
    await user.click(materialsTrigger);
    expect(await screen.findByRole("region", { name: "Review Materials Hub navigation" })).toBeVisible();
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(screen.queryByRole("region", { name: "Review Materials Hub navigation" })).not.toBeInTheDocument());
    expect(materialsTrigger).toHaveAttribute("aria-expanded", "false");

    const mobileToggle = screen.getByRole("button", { name: "Open more pages menu" });
    await user.click(mobileToggle);
    expect(screen.getByRole("navigation", { name: "More CEStudy pages" })).toBeVisible();
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "More CEStudy pages" })).not.toBeInTheDocument());
    expect(mobileToggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes an open global navigation panel when a route is changed", async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole("button", { name: "Review Materials Hub" }));
    expect(await screen.findByRole("region", { name: "Review Materials Hub navigation" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Subject Catalog" }));
    await waitFor(() => expect(screen.queryByRole("region", { name: "Review Materials Hub navigation" })).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole("main")).toHaveFocus());
  });
});
