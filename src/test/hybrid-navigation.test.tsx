import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../components/Layout";
import type { CatalogSubject } from "../types/catalog";

const { fetchCatalogSubjectsMock } = vi.hoisted(() => ({ fetchCatalogSubjectsMock: vi.fn() }));
vi.mock("../data/catalog-api", () => ({ fetchCatalogSubjects: fetchCatalogSubjectsMock }));

const firstYearSubject: CatalogSubject = {
  slug: "calculus-1",
  title: "Calculus 1",
  summary: "Differential and integral calculus",
  yearLevel: 1,
  semester: "First semester",
  category: "year-level",
  classification: "ched-common-course",
  specialization: null,
  aliases: [],
  sourceReference: "Synthetic test fixture",
  sourceNote: "Synthetic test fixture",
  availability: "coming-soon",
  displayOrder: 1,
};

function renderLayout(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Layout>
        <Routes>
          <Route path="*" element={<h1>Test destination</h1>} />
        </Routes>
      </Layout>
    </MemoryRouter>,
  );
}

beforeEach(() => fetchCatalogSubjectsMock.mockResolvedValue([firstYearSubject]));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("CEStudy sidebar navigation", () => {
  it("places the menu control immediately before the master logo", () => {
    renderLayout();

    const header = document.querySelector(".site-header");
    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    const brand = screen.getByRole("link", { name: "CEStudy home" });

    expect(header?.firstElementChild?.firstElementChild).toBe(trigger);
    expect(trigger.compareDocumentPosition(brand) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("opens one consistent navigation drawer with available destinations and preferences", async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));

    const drawer = screen.getByRole("dialog", { name: "CEStudy navigation" });
    const navigation = within(drawer).getByRole("navigation", { name: "CEStudy pages" });
    expect(drawer).toHaveAttribute("aria-modal", "true");

    for (const label of [
      "Home",
      "Subject Catalog",
      "Math Foundations",
      "Progress",
      "About us",
      "Contact CEStudy",
      "Support us",
      "Report a bug",
      "Send feedback",
      "Privacy notice",
    ]) {
      expect(within(navigation).getByRole("link", { name: label })).toBeInTheDocument();
    }

    for (const unavailable of ["Review Materials Hub", "Mock Exam Portal", "Community Forum"]) {
      expect(within(navigation).queryByRole("link", { name: unavailable })).not.toBeInTheDocument();
    }

    expect(within(navigation).getAllByRole("link", { name: "Subject Catalog" })).toHaveLength(1);
    const theme = within(drawer).getByRole("group", { name: "Color theme" });
    expect(within(theme).getByRole("button", { name: "Light" })).toBeInTheDocument();
    expect(within(theme).getByRole("button", { name: "Dark" })).toBeInTheDocument();
  });

  it("keeps the year → semester → subject hierarchy without duplicating Subject Catalog", async () => {
    const user = userEvent.setup();
    renderLayout("/year/1");

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));
    const drawer = screen.getByRole("dialog", { name: "CEStudy navigation" });
    const navigation = within(drawer).getByRole("navigation", { name: "CEStudy pages" });
    const yearTrigger = within(navigation).getByRole("button", { name: "Year Levels" });

    expect(yearTrigger).toHaveClass("active");
    await user.click(yearTrigger);

    const panel = await screen.findByRole("region", { name: "Year-level navigation" });
    expect(within(panel).getByRole("link", { name: "Browse all year levels" })).toHaveAttribute("href", "/years");
    await screen.findByText("First year", { selector: ".year-level-menu-year-title" });

    await user.click(within(panel).getByText("First year", { selector: ".year-level-menu-year-title" }));
    const firstYear = within(panel).getByText("First semester", { selector: ".year-level-menu-semester > summary" });
    await user.click(firstYear);

    expect(within(panel).getByRole("link", { name: /Calculus 1/ })).toHaveAttribute("href", "/subjects/calculus-1");
    expect(within(navigation).getAllByRole("link", { name: "Subject Catalog" })).toHaveLength(1);
    expect(within(panel).queryByRole("link", { name: "Subject Catalog" })).not.toBeInTheDocument();
    expect(within(panel).queryByRole("link", { name: "Math Foundations" })).not.toBeInTheDocument();
  });

  it("keeps keyboard focus inside the open sidebar", async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));
    const drawer = screen.getByRole("dialog", { name: "CEStudy navigation" });
    const close = within(drawer).getByRole("button", { name: "Close navigation menu" });
    const dark = within(drawer).getByRole("button", { name: "Dark" });

    expect(close).toHaveFocus();
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(dark).toHaveFocus();
    await user.keyboard("{Tab}");
    expect(close).toHaveFocus();
  });

  it("closes on Escape and returns focus to the menu trigger", async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "CEStudy navigation" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "CEStudy navigation" })).not.toBeInTheDocument());
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes when the backdrop is clicked and restores focus", async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Dismiss navigation backdrop" }));

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "CEStudy navigation" })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("slides the sidebar out to the right before it is hidden", async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    await user.click(trigger);
    const drawer = screen.getByRole("dialog", { name: "CEStudy navigation" });
    const layer = document.querySelector(".site-sidebar-layer");
    expect(layer).not.toBeNull();

    await user.click(within(drawer).getByRole("button", { name: "Close navigation menu" }));

    expect(layer).toHaveClass("is-closing");
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(drawer).not.toHaveAttribute("role", "dialog");

    fireEvent.transitionEnd(drawer, { propertyName: "transform" });
    await waitFor(() => expect(layer).not.toHaveClass("is-closing"));
  });

  it("marks the learning destination active and closes after route navigation", async () => {
    const user = userEvent.setup();
    renderLayout("/study/basic-algebra/1");

    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));
    const drawer = screen.getByRole("dialog", { name: "CEStudy navigation" });
    expect(within(drawer).getByRole("link", { name: "Subject Catalog" })).toHaveClass("active");

    await user.click(within(drawer).getByRole("link", { name: "Subject Catalog" }));

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "CEStudy navigation" })).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole("main")).toHaveFocus());
  });
});
