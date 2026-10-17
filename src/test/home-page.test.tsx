import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Layout } from "../components/Layout";
import { HomePage } from "../pages/HomePage";
import { YearLevelsPage } from "../pages/YearLevelsPage";
import stylesheet from "../styles/global.css?raw";

describe("homepage and year-level navigation", () => {
  it("keeps the homepage focused on useful destinations", () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Find your CE subjects." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse subjects/i })).toHaveAttribute("href", "/catalog");
    expect(screen.getByRole("link", { name: /math foundations/i })).toHaveAttribute("href", "/math-foundations");
    for (const year of ["First year", "Second year", "Third year", "Fourth year"]) {
      expect(screen.getByRole("link", { name: `Browse ${year} subjects` })).toBeInTheDocument();
    }
    expect(screen.queryByText(/free-first|mobile-friendly|carefully reviewed content|AI tutor features/i)).not.toBeInTheDocument();
  });
  it("provides an overview with all four year levels", () => {
    render(<MemoryRouter initialEntries={["/years"]}><Routes><Route path="/years" element={<YearLevelsPage />} /></Routes></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Year levels" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse First year subjects" })).toHaveAttribute("href", "/year/1");
    expect(screen.getByRole("link", { name: "Browse Fourth year subjects" })).toHaveAttribute("href", "/year/4");
  });
  it("points the shared navigation to the year-level overview", () => {
    render(<MemoryRouter initialEntries={["/"]}><Layout><HomePage /></Layout></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Year levels" })).toHaveAttribute("href", "/years");
  });
  it("uses white by default and the actual master-logo blue as an accent", () => {
    expect(stylesheet).toContain("background:#fff;");
    expect(stylesheet).toContain("--brand-blue:#0754B5");
    expect(stylesheet).toContain(".button-primary{background:var(--brand-blue)");
    expect(stylesheet).toContain("background:var(--blue-soft)");
    expect(stylesheet).not.toContain("backdrop-filter:blur");
  });
  it("shows copyright, contact, support, and feedback links in the footer", () => {
    render(<MemoryRouter initialEntries={["/"]}><Layout><HomePage /></Layout></MemoryRouter>);
    expect(screen.getByText(`© ${new Date().getFullYear()} CEStudy. All rights reserved.`)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Contact, support, and feedback" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact maintainer/i })).toHaveAttribute("href", "https://github.com/justryan-n2d");
    expect(screen.getByRole("link", { name: /support & bug reports/i })).toHaveAttribute("href", "https://github.com/justryan-n2d/CEStudy/issues");
    expect(screen.getByRole("link", { name: /send feedback/i })).toHaveAttribute("href", "https://github.com/justryan-n2d/CEStudy/issues/new");
  });

});