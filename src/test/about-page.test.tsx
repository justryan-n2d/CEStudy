import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AboutPage } from "../pages/AboutPage";

describe("About CEStudy page", () => {
  it("explains the project purpose, standards, independence, and ways to help", () => {
    render(<MemoryRouter><AboutPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "About CEStudy" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Make the next study step clearer." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Accuracy before volume" })).toBeInTheDocument();
    expect(screen.getByText(/not affiliated with or endorsed by the Commission on Higher Education/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Send feedback" })).toHaveAttribute("href", "/feedback");
    expect(screen.getByRole("link", { name: "Report a bug" })).toHaveAttribute("href", "/bug-reports");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });
});
