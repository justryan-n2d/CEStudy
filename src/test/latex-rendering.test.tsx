import { render,screen } from "@testing-library/react";
import { describe,expect,it } from "vitest";
import { MarkdownContent } from "../components/MarkdownContent";
import { PracticeQuestion } from "../components/PracticeQuestion";
import type { PracticeQuestion as PracticeQuestionData } from "../types/study-content";

const syntheticQuestion:PracticeQuestionData={
  id:"synthetic-latex-question",
  subjectSlug:"basic-algebra",
  topic:"Synthetic topic",
  prompt:String.raw`Solve \(x + 2 = 5\).`,
  choices:[String.raw`\(x = 3\)`,String.raw`\(x = 7\)`],
  correctAnswer:String.raw`\(x = 3\)`,
  solutionSteps:[String.raw`Subtract 2: \(x = 5 - 2\).`],
  explanation:String.raw`Therefore \(x = 3\).`,
  sourceNote:"Synthetic test fixture only.",
  displayOrder:1,
};

describe("LaTeX math rendering",()=>{
  it("renders inline and display expressions in lesson Markdown",()=>{
    render(<MarkdownContent markdown={String.raw`The formula is \(a^2 + b^2 = c^2\).

\[
\frac{a}{b} = c
\]`} />);

    expect(document.querySelectorAll(".katex")).toHaveLength(2);
    expect(document.querySelector(".katex-display")).toBeInTheDocument();
    expect(screen.getByText(/The formula is/)).toBeInTheDocument();
    const visibleText = document.querySelector(".markdown-content")?.cloneNode(true) as HTMLElement;
    visibleText.querySelectorAll(".katex").forEach((node) => node.remove());
    expect(visibleText.textContent).not.toMatch(/\\\(|\\\[|frac\{a\}/);
  });

  it("does not treat prices or inline-code examples as math",()=>{
    render(<MarkdownContent markdown={String.raw`The fee is $5 and the example is ` + "`\\(x+2\\)`" + String.raw`.`} />);

    expect(screen.getByText(/The fee is \$5/)).toBeInTheDocument();
    expect(document.querySelectorAll(".katex")).toHaveLength(0);
    expect(screen.getByText(String.raw`\(x+2\)`)).toBeInTheDocument();
  });

  it("renders math in practice prompts, choices, and worked explanations",()=>{
    render(<PracticeQuestion question={syntheticQuestion} index={0} total={1} selectedAnswer={String.raw`\(x = 3\)`} submitted={true}
      onSelect={()=>{}} onSubmit={()=>{}} onNext={()=>{}} />);

    expect(document.querySelectorAll(".katex")).toHaveLength(5);
    expect(document.querySelector(".practice-question-card h2")?.textContent).toContain("Solve");
    expect(screen.getByText(/Subtract 2/)).toBeInTheDocument();
  });

  it("preserves unmatched delimiters as readable text",()=>{
    render(<MarkdownContent markdown={String.raw`Unfinished formula: \(x + 2`} />);
    expect(screen.getByText(String.raw`Unfinished formula: \(x + 2`)).toBeInTheDocument();
    expect(document.querySelectorAll(".katex")).toHaveLength(0);
  });
});
