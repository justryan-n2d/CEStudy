import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MarkdownContent } from "../components/MarkdownContent";
import { StudyPage } from "../pages/StudyPage";
import { fetchPublishedLessons } from "../data/lesson-api";
import type { SubjectLesson } from "../types/lesson-content";

vi.mock("../data/lesson-api", () => ({
  fetchPublishedLessons: vi.fn(),
}));

function lesson(
  id: string,
  unitNumber: number,
  title: string,
  learningObjectives: string[],
): SubjectLesson {
  return {
    id,
    subjectSlug: "basic-algebra",
    unitNumber,
    slug: id,
    title,
    learningObjectives,
    lessonMarkdown: `## ${title}\n\nLesson content for ${title}.`,
    sourceNote: "Synthetic test fixture only.",
    status: "published",
    reviewNotes: "",
    reviewedAt: null,
    updatedAt: "",
  };
}

const relatedLessons = [
  lesson("current", 1, "Order of Operations", [
    "Evaluate numerical expressions using order of operations.",
    "Apply multiplication and division before addition and subtraction.",
  ]),
  lesson("exponents", 2, "Exponents and Roots", [
    "Evaluate powers and roots in numerical expressions.",
    "Apply exponent rules when simplifying expressions.",
  ]),
  lesson("algebraic-expressions", 3, "Algebraic Expressions", [
    "Simplify numerical and algebraic expressions using grouping symbols.",
  ]),
  lesson("unrelated", 4, "Concrete Mix Design", [
    "Determine the water-cement ratio for a concrete mixture.",
  ]),
  { ...lesson("other-subject", 5, "Order of Operations in Engineering", [
    "Use order of operations in engineering calculations.",
  ]), subjectSlug: "civil-engineering" },
];

function renderStudyPage() {
  return render(
    <MemoryRouter initialEntries={["/study/basic-algebra/1"]}>
      <Routes>
        <Route path="/study/:slug/:unit" element={<StudyPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("lesson reader", () => {
  beforeEach(() => {
    vi.mocked(fetchPublishedLessons).mockResolvedValue(relatedLessons);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders quoted Markdown as structured lesson content with properly separated steps and math", async () => {
    const { container } = render(
      <MarkdownContent
        markdown={String.raw`> **UI INSPECTION DEMO**
>
> ## Worked example
>
> **Step 1: Evaluate the parentheses.**
>
> \[
> 18 - 3(2 + 4)^2 \div 6
> \]
>
> **Step 2: Evaluate the exponent.**
>
> \[
> 18 - 3(6)^2 \div 6
> \]
>
> Check the result using \(8 + 2 \times 5 = 18\\).`}
      />,
    );

    expect(screen.getByRole("heading", { name: "Worked example" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Step 1: Evaluate the parentheses." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Step 2: Evaluate the exponent." })).toBeInTheDocument();
    expect(container.querySelector("blockquote")).toBeInTheDocument();

    await waitFor(() => {
      expect(container.querySelectorAll(".katex").length).toBeGreaterThanOrEqual(3);
    });
    expect(container.querySelector(".latex-math-error")).not.toBeInTheDocument();
    expect(container.textContent).not.toContain(String.raw`\[`);
    expect(container.textContent).not.toContain(String.raw`\]`);
  });

  it("removes streak, completion, and progress controls from the reading task", async () => {
    renderStudyPage();

    expect(await screen.findByRole("heading", { name: "Order of Operations" })).toBeInTheDocument();
    expect(screen.queryByText(/days streak/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /mark as complete/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/progress is saved on this device/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /view my progress/i })).not.toBeInTheDocument();
  });

  it("recommends at most three relevant lessons from the same subject", async () => {
    renderStudyPage();

    expect(await screen.findByRole("heading", { name: "Order of Operations" })).toBeInTheDocument();

    const recommendations = screen.getByRole("region", { name: "Recommended lessons" });
    expect(within(recommendations).getByRole("link", { name: "Exponents and Roots" })).toHaveAttribute(
      "href",
      "/study/basic-algebra/2",
    );
    expect(within(recommendations).getByRole("link", { name: "Algebraic Expressions" })).toHaveAttribute(
      "href",
      "/study/basic-algebra/3",
    );
    expect(within(recommendations).queryByRole("link", { name: "Concrete Mix Design" })).not.toBeInTheDocument();
    expect(within(recommendations).queryByRole("link", { name: "Order of Operations in Engineering" })).not.toBeInTheDocument();
    expect(within(recommendations).getAllByRole("link")).toHaveLength(2);
  });

  it("keeps the recommendation area honest when no related lesson has been published", async () => {
    vi.mocked(fetchPublishedLessons).mockResolvedValueOnce([relatedLessons[0]]);
    renderStudyPage();

    expect(await screen.findByRole("heading", { name: "Order of Operations" })).toBeInTheDocument();
    const recommendations = screen.getByRole("region", { name: "Recommended lessons" });
    expect(within(recommendations).getByText("No related lessons are available yet.")).toBeInTheDocument();
    expect(within(recommendations).queryByRole("link")).not.toBeInTheDocument();
  });
});
