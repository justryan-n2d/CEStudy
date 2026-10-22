import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Layout } from "../components/Layout";
import { HomePage } from "../pages/HomePage";
import { HERO_IMAGE } from "../config/hero-image";
import { YearLevelsPage } from "../pages/YearLevelsPage";
import stylesheet from "../styles/global.css?raw";

describe("homepage and year-level navigation", () => {
  it("keeps the homepage focused on useful destinations", () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Build your CE foundation." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse subjects/i })).toHaveAttribute("href", "/catalog");
    expect(screen.getByRole("link", { name: /math foundations/i })).toHaveAttribute("href", "/math-foundations");
    expect(screen.getByRole("link", { name: "View my progress" })).toHaveAttribute("href", "/progress");
    expect(screen.getByRole("heading", { name: "Mark lessons as you finish them" })).toBeInTheDocument();
    const heroImage = screen.getByRole("img", { name: /bridge crossing a river/i });
    expect(heroImage).toHaveAttribute("width", "1600");
    expect(heroImage).toHaveAttribute("height", "1200");
    expect(heroImage.getAttribute("srcset")).toContain("640 640w");
    expect(heroImage).toHaveAttribute("fetchpriority", "high");
    expect(heroImage).toHaveAttribute("src", HERO_IMAGE.src);
    expect(HERO_IMAGE.srcSet).toContain("640 640w");
    expect(HERO_IMAGE.alt).toMatch(/bridge crossing a river/i);
    expect(document.querySelector(".hero-brand-overlay")).toHaveAttribute("src", "/branding/cestudy-master-logo-transparent.svg");
    const heroDisc = document.querySelector(".hero-brand-disc");
    expect(heroDisc).toHaveAttribute("aria-hidden", "true");
    expect(heroDisc?.nextElementSibling).toHaveClass("hero-brand-overlay");
    expect(stylesheet).toContain(".hero-visual .hero-brand-disc{");
    expect(stylesheet).toContain("background:rgba(255,255,255,.2)");
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
  it("keeps the four main destinations in mobile quick navigation", () => {
    render(<MemoryRouter initialEntries={["/"]}><Layout><HomePage /></Layout></MemoryRouter>);
    const quickNav = document.querySelector('nav[aria-label="Quick navigation"]');
    expect(quickNav?.querySelector('a[href="/"]')).toHaveTextContent("Home");
    expect(quickNav?.querySelector('a[href="/catalog"]')).toHaveTextContent("Subjects");
    expect(quickNav?.querySelector('a[href="/years"]')).toHaveTextContent("Years");
    expect(quickNav?.querySelector('a[href="/math-foundations"]')).toHaveTextContent("Math");
  });

  it("moves focus to the main content after route navigation", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Layout>
          <Routes>
            <Route path="/" element={<h1>Home page</h1>} />
            <Route path="/catalog" element={<h1>Subject catalog page</h1>} />
          </Routes>
        </Layout>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("link", { name: "Subject catalog" }));

    const main = screen.getByRole("main");
    expect(screen.getByRole("heading", { name: "Subject catalog page" })).toBeInTheDocument();
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(main).toHaveFocus();
  });

  it("defines 44px touch targets and 8px spacing for tablet top navigation", () => {
    expect(stylesheet).toContain("@media (min-width:681px) and (max-width:850px)");
    expect(stylesheet).toContain(".main-nav .nav-link");
    expect(stylesheet).toMatch(/min-height:\\s*44px/);
    expect(stylesheet).toMatch(/\\.main-nav\\s*\\{\\s*gap:\\s*\\.5rem;/);
  });

  it("points the shared navigation to the year-level overview", () => {
    render(<MemoryRouter initialEntries={["/"]}><Layout><HomePage /></Layout></MemoryRouter>);
    expect(screen.getByRole("navigation", { name: "Main navigation" }).querySelector('a[href="/years"]')).toHaveTextContent("Year levels");
  });
  it("opens the More menu with an animated dropdown and reduced-motion fallback", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/"]}><Layout><HomePage /></Layout></MemoryRouter>);
    const button = screen.getByRole("button", { name: "Open more pages menu" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByRole("navigation", { name: "More CEStudy pages" });
    expect(menu).toHaveClass("is-open");
    expect(menu).toBeVisible();
    expect(stylesheet).toContain("@keyframes ce-menu-drop-in");
    expect(stylesheet).toContain('.mobile-menu-toggle[aria-expanded="true"] .navigation-glyph');
    expect(stylesheet).toContain("@media(prefers-reduced-motion:reduce)");
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
    expect(screen.getByRole("navigation", { name: "Contact and help" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About us" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Contact CEStudy" })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: "Support us" })).toHaveAttribute("href", "/support");
    expect(screen.getByRole("link", { name: "Report a bug" })).toHaveAttribute("href", "/bug-reports");
    expect(screen.getByRole("link", { name: "Send feedback" })).toHaveAttribute("href", "/feedback");
  });

});