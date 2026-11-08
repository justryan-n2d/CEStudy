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

  it("uses the textbook-style presentation only in student lesson-reader mode", () => {
    const markdown = String.raw`# Solving Linear Equations

A concise explanation stays as normal lesson prose.

## One-step and two-step equations, example
This section is intentionally omitted from the student reader.

## Key Method
This generic method section should not be shown.

## Common errors to avoid
This generic error list should not be shown.

## Learning Objectives
These objectives should remain metadata, not lesson content.

## Governing formula
\[
2x + 3 = 7
\]

## Sample Problems
### Example 3: Solve \(5x = 20\)
- Example 1: \(2x + 3 = 7\)
- Example 2: \(4x - 1 = 11\)

## Legend
- \(x\) represents the unknown value.
- \(b\) represents the constant term.`;
    const { container } = render(<MarkdownContent markdown={markdown} variant="lesson-reader" />);

    expect(screen.queryByText(/intentionally omitted from the student reader/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/generic method section should not be shown/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/generic error list should not be shown/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/objectives should remain metadata/i)).not.toBeInTheDocument();
    expect(container.querySelector(".markdown-display-math")).toBeInTheDocument();

    const sampleProblems = container.querySelector(".markdown-sample-problems");
    expect(sampleProblems?.querySelectorAll("p")).toHaveLength(2);
    expect(container.querySelectorAll(".markdown-sample-problem")).toHaveLength(3);
    expect(sampleProblems?.querySelector("ul, ol")).not.toBeInTheDocument();

    const legend = container.querySelector("ul");
    expect(legend).toBeInTheDocument();
    expect(legend?.querySelectorAll("li")).toHaveLength(2);
  });

  it("keeps generic Markdown presentation unchanged outside the student lesson reader", () => {
    const markdown = String.raw`## Key Method
Keep this section in the owner review rendering.

## Sample Problems
- Example 1: \(2x + 3 = 7\)`;
    const { container } = render(<MarkdownContent markdown={markdown} />);

    expect(screen.getByRole("heading", { name: "Key Method" })).toBeInTheDocument();
    expect(container.querySelector(".markdown-sample-problems")).not.toBeInTheDocument();
    expect(container.querySelector("ul li")).toBeInTheDocument();
  });

  it("applies the textbook-style section and sample-problem rules on the student lesson route", async () => {
    vi.mocked(fetchPublishedLessons).mockResolvedValueOnce([{
      ...relatedLessons[0],
      lessonMarkdown: "## Key Method\nThis section is not displayed in the student reader.\n\n## Common errors to avoid\nThis section is not displayed either.\n\n## Learning Objectives\nObjectives remain metadata.\n\n## Concept\nThis explanation remains visible.\n\n## Sample Problems\n- Example 1: \\(2x + 3 = 7\\)\n- Example 2: \\(4x - 1 = 11\\)\n\n## Legend\n- \\(x\\) is the unknown.",
    }]);
    const { container } = renderStudyPage();

    expect(await screen.findByText("This explanation remains visible.")).toBeInTheDocument();
    expect(screen.queryByText(/This section is not displayed/)).not.toBeInTheDocument();
    expect(screen.queryByText("Objectives remain metadata.")).not.toBeInTheDocument();
    expect(container.querySelector(".markdown-sample-problems")?.querySelectorAll("p")).toHaveLength(2);
    expect(container.querySelector(".markdown-sample-problems ul")).not.toBeInTheDocument();
    expect(container.querySelector(".markdown-content-lesson-reader ul li")).toBeInTheDocument();
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
> Check the result using \(8 + 2 \times 5 = 18\).`}
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

    expect(await screen.findByRole("heading", { name: "Order of Operations", level: 2 })).toBeInTheDocument();
    expect(screen.queryByText(/days streak/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /mark as complete/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/progress is saved on this device/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /view my progress/i })).not.toBeInTheDocument();
  });

  it("recommends at most three relevant lessons from the same subject", async () => {
    renderStudyPage();

    expect(await screen.findByRole("heading", { name: "Order of Operations", level: 2 })).toBeInTheDocument();

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

    expect(await screen.findByRole("heading", { name: "Order of Operations", level: 2 })).toBeInTheDocument();
    const recommendations = screen.getByRole("region", { name: "Recommended lessons" });
    expect(within(recommendations).getByText("No related lessons are available yet.")).toBeInTheDocument();
    expect(within(recommendations).queryByRole("link")).not.toBeInTheDocument();
  });
});
