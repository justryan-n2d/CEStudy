import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HistoryPage } from "../pages/HistoryPage";
import { recordOpenedLesson } from "../data/learning-history";

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe("recently opened lesson history", () => {
  it("shows opened lessons in newest-first order with a direct link back to the lesson", () => {
    recordOpenedLesson({
      lessonId: "algebra-1",
      subjectSlug: "basic-algebra",
      unitNumber: 1,
      title: "Algebra Foundations",
    }, new Date("2026-10-16T10:00:00.000Z"));
    recordOpenedLesson({
      lessonId: "algebra-2",
      subjectSlug: "basic-algebra",
      unitNumber: 2,
      title: "Linear Equations",
    }, new Date("2026-10-17T10:00:00.000Z"));

    render(<MemoryRouter><HistoryPage /></MemoryRouter>);

    const lessons = screen.getAllByRole("heading", { level: 2 });
    expect(lessons[0]).toHaveTextContent("Linear Equations");
    expect(lessons[1]).toHaveTextContent("Algebra Foundations");
    expect(screen.getAllByRole("link", { name: /open lesson/i })[0]).toHaveAttribute("href", "/study/basic-algebra/2");
  });

  it("clears history only after confirmation", async () => {
    const user = userEvent.setup();
    recordOpenedLesson({
      lessonId: "algebra-1",
      subjectSlug: "basic-algebra",
      unitNumber: 1,
      title: "Algebra Foundations",
    });
    vi.stubGlobal("confirm", vi.fn(() => true));

    render(<MemoryRouter><HistoryPage /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: /clear history/i }));

    expect(screen.getByRole("heading", { name: "No opened lessons yet" })).toBeInTheDocument();
  });
});
