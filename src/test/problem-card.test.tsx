import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ProblemCard } from "../components/ProblemCard";

const problem = {
  id: "problem-rendering-fixture",
  subjectSlug: "basic-algebra",
  lessonId: "algebra-foundations-unit-06",
  topic: "Factoring out a common factor",
  prompt: "Factor 6x² + 9x.",
  correctAnswer: "3x(2x + 3)",
  solutionSteps: [
    "The greatest common factor is 3x.",
    "Divide each term by 3x to obtain 2x and 3.",
    "Write 3x(2x + 3).",
  ],
  sourceNote: "Synthetic test fixture only.",
  displayOrder: 1,
};

describe("problem solution disclosure", () => {
  it("renders the problem number and keeps the solution collapsed until requested", () => {
    render(<ProblemCard problem={problem} number={1} />);

    expect(screen.getByText("Problem 1")).toBeInTheDocument();
    expect(screen.getByText("Factor 6x² + 9x.")).toBeInTheDocument();
    expect(screen.getByText("View the solution")).toBeInTheDocument();
    expect(screen.queryByText("Final answer")).not.toBeVisible();
  });

  it("reveals only rendered solution steps and the final answer", async () => {
    const { container } = render(<ProblemCard problem={problem} number={2} />);
    fireEvent.click(screen.getByText("View the solution"));

    expect(screen.getByText("Problem 2")).toBeInTheDocument();
    expect(screen.getByText("The greatest common factor is 3x.")).toBeVisible();
    expect(screen.getByText("Final answer")).toBeVisible();
    expect(screen.getByText("3x(2x + 3)", { selector: ".problem-final-answer" })).toBeVisible();
    await waitFor(() => expect(container.querySelectorAll(".katex").length).toBeGreaterThan(0));
    expect(screen.queryByText(/Source note:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Explanation/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Choices/i)).not.toBeInTheDocument();
  });

  it("centers the disclosure summary and leaves a deliberate gap below the prompt", () => {
    const { container } = render(<ProblemCard problem={problem} number={1} />);
    const summary = container.querySelector(".problem-solution-summary");
    expect(summary).toHaveClass("problem-solution-summary");
    expect(container.querySelector(".problem-card")).toBeInTheDocument();
  });
});
