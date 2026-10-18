import { render,screen,waitFor } from "@testing-library/react";
import { describe,expect,it } from "vitest";
import { MarkdownContent } from "../components/MarkdownContent";
import { PracticeQuestion } from "../components/PracticeQuestion";
import type { PracticeQuestion as PracticeQuestionData } from "../types/study-content";

const syntheticQuestion:PracticeQuestionData={
  id:"synthetic-latex-question",
  subjectSlug:"basic-algebra",
  topic:"Synthetic topic",
  prompt:"Solve \\(x + 2 = 5\\).",
  choices:["\\(x = 3\\)","\\(x = 7\\)"],
  correctAnswer:"\\(x = 3\\)",
  solutionSteps:["Subtract 2: \\(x = 5 - 2\\)."],
  explanation:"Therefore \\(x = 3\\).",
  sourceNote:"Synthetic test fixture only.",
  displayOrder:1,
};

describe("LaTeX math rendering",()=>{
  it("renders inline and display expressions in lesson Markdown",async()=>{
    const markdown = "The formula is \\(a^2 + b^2 = c^2\\).\n\n\\[\n\\frac{a}{b} = c\n\\]";
    render(<MarkdownContent markdown={markdown} />);

    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(2));
    expect(document.querySelector(".katex-display")).toBeInTheDocument();
    expect(document.querySelector(".katex [style]")).toBeInTheDocument();
    expect(screen.getByText(/The formula is/)).toBeInTheDocument();
    expect(document.querySelector(".latex-math-error")).not.toBeInTheDocument();
  });

  it("does not treat prices or inline-code examples as math",()=>{
    const tick = String.fromCharCode(96);
    const markdown = "The fee is $5 and the example is " + tick + "\\(x+2\\)" + tick + ".";
    render(<MarkdownContent markdown={markdown} />);

    expect(document.querySelector(".markdown-content p")?.textContent).toContain("The fee is $5");
    expect(document.querySelectorAll(".katex")).toHaveLength(0);
    expect(screen.getByText("\\(x+2\\)")).toBeInTheDocument();
  });

  it("renders math in practice prompts, choices, and worked explanations",async()=>{
    render(<PracticeQuestion question={syntheticQuestion} index={0} total={1} selectedAnswer={"\\(x = 3\\)"} submitted={true}
      onSelect={()=>{}} onSubmit={()=>{}} onNext={()=>{}} />);

    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(5));
    expect(document.querySelector(".practice-question-card h2")?.textContent).toContain("Solve");
    expect(screen.getByText(/Subtract 2/)).toBeInTheDocument();
  });

  it("preserves unmatched delimiters as readable text",()=>{
    render(<MarkdownContent markdown={"Unfinished formula: \\(x + 2"} />);
    expect(screen.getByText("Unfinished formula: \\(x + 2")).toBeInTheDocument();
    expect(document.querySelectorAll(".katex")).toHaveLength(0);
  });

  it("shows malformed LaTeX as readable source",async()=>{
    render(<MarkdownContent markdown={"Invalid formula: \\(\\notARealCommand{x}\\)"} />);
    await waitFor(()=>expect(screen.getByText("\\notARealCommand{x}")).toHaveClass("latex-math-error"));
    expect(document.querySelectorAll(".katex")).toHaveLength(0);
  });

  it("keeps raw HTML as text",()=>{
    const html = '<img src=x onerror=alert(1)>';
    render(<MarkdownContent markdown={"Literal text " + html} />);
    expect(document.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("Literal text " + html)).toBeInTheDocument();
  });

  it("auto-renders equations already stored as plain Unicode text",async()=>{
    render(<MarkdownContent markdown={"The quadratic formula is x = (-b ± √(b² - 4ac))/(2a)."} />);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(1));
    expect(document.querySelector(".latex-math-error")).not.toBeInTheDocument();
    expect(screen.getByText(/The quadratic formula is/)).toBeInTheDocument();
  });

  it("renders multi-part equations and keeps explanatory prose",async()=>{
    const lesson = "For 2x² + 4x + 5 = 0, the discriminant is D = 4² - 4(2)(5) = 16 - 40 = -24. Since D < 0, the roots are nonreal.";
    render(<MarkdownContent markdown={lesson} />);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(3));
    expect(screen.getByText(/Since/)).toBeInTheDocument();
    expect(document.querySelector(".latex-math-error")).not.toBeInTheDocument();
  });

  it("renders double-dollar display math",async()=>{
    const dollar = String.fromCharCode(36);
    render(<MarkdownContent markdown={["Displayed formula:", dollar+dollar, "\\frac{a}{b} = c", dollar+dollar].join("\n")} />);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(1));
    expect(document.querySelector(".katex-display")).toBeInTheDocument();
  });

  it("supports single-dollar inline math without converting currency",async()=>{
    const dollar = String.fromCharCode(36);
    render(<MarkdownContent markdown={"Area is " + dollar + "x^2" + dollar + " and the fee is " + dollar + "5."} />);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(1));
    expect(document.querySelector(".markdown-content p")?.textContent).toContain("fee is $5");
  });
  it("auto-renders formula rearrangement without absorbing instruction words",async()=>{
    const lesson = "If A = lw and l ≠ 0, divide both sides by l to get w = A/l.";
    render(<MarkdownContent markdown={lesson} />);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(3));
    expect(document.querySelector(".markdown-content")?.textContent).toContain("divide both sides by l to get");
    expect(document.querySelector(".latex-math-error")).not.toBeInTheDocument();
  });

  it("renders standalone Unicode expressions inside lesson prose",async()=>{
    const lesson = "Write a number as a × 10^n, where 1 ≤ |a| < 10.";
    render(<MarkdownContent markdown={lesson} />);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(2));
    expect(document.querySelector(".latex-math-error")).not.toBeInTheDocument();
  });

  it("keeps paired currency amounts as text",()=>{
    const dollar = String.fromCharCode(36);
    const lesson = "Fees are " + dollar + "5 + " + dollar + "6.";
    render(<MarkdownContent markdown={lesson} />);
    expect(document.querySelectorAll(".katex")).toHaveLength(0);
    expect(document.querySelector(".markdown-content p")?.textContent).toContain("Fees are $5 + $6.");
  });

  it("renders a bare LaTeX fraction without requiring extra delimiters",async()=>{
    const lesson = String.raw`The fraction is \frac{2x}{3}.`;
    render(<MarkdownContent markdown={lesson} />);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(1));
    expect(document.querySelector(".katex .mfrac")).toBeInTheDocument();
    expect(document.querySelector(".markdown-content")?.textContent).toContain("The fraction is ");
    expect(document.querySelector(".latex-math-error")).not.toBeInTheDocument();
  });

  it("renders nested bare fractions and fraction equations",async()=>{
    const nested = String.raw`Nested: \frac{2x}{\frac{3}{4}}.`;
    const equation = String.raw`Simplify x = \frac{2x}{3}.`;
    render(<><MarkdownContent markdown={nested} /><MarkdownContent markdown={equation} /></>);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(2));
    expect(document.querySelectorAll(".katex .mfrac").length).toBeGreaterThanOrEqual(3);
    expect(document.querySelectorAll(".latex-math-error")).toHaveLength(0);
  });

  it("keeps instruction words outside equations with bare fractions",async()=>{
    const equation = String.raw`Simplify x = \frac{2x}{3}.`;
    render(<MarkdownContent markdown={equation} />);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(1));
    const renderedMath = document.querySelector(".katex");
    expect(renderedMath?.textContent?.toLowerCase()).not.toContain("simplify");
    expect(document.querySelector(".markdown-content")?.textContent).toContain("Simplify");
    expect(document.querySelector(".katex .mfrac")).toBeInTheDocument();
  });

  it("does not render bare fraction commands inside inline code",()=>{
    const tick = String.fromCharCode(96);
    const markdown = "Type " + tick + String.raw`\frac{2x}{3}` + tick + " literally.";
    render(<MarkdownContent markdown={markdown} />);
    expect(document.querySelectorAll(".katex")).toHaveLength(0);
    expect(document.querySelector("code")?.textContent).toBe(String.raw`\frac{2x}{3}`);
  });

  it("renders math patterns used across different engineering subjects through the shared lesson renderer",async()=>{
    const examples = [
      { subject:"Algebra", markdown:"Quadratic formula: \\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)." },
      { subject:"Trigonometry", markdown:"Identity: \\(\\sin^2\\theta + \\cos^2\\theta = 1\\)." },
      { subject:"Calculus", markdown:"Derivative: \\(\\frac{d}{dx}x^3 = 3x^2\\)." },
      { subject:"Integral calculus", markdown:"Integral:\n\\[\n\\int_0^L w(x)\\,dx = F(L)-F(0)\n\\]" },
      { subject:"Series", markdown:"Summation:\n$$\n\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}\n$$" },
      { subject:"Linear algebra", markdown:"Matrix:\n\\[\nA = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}\n\\]" },
      { subject:"Structural analysis", markdown:"Equilibrium: \\(\\sum F_x = 0,\\quad \\sum M_A = 0\\)." },
      { subject:"Mechanics of materials", markdown:"Normal stress: \\(\\sigma = \\frac{P}{A}\\)." },
      { subject:"Fluid mechanics", markdown:"Hydrostatic pressure: \\(p = \\rho g h\\)." },
      { subject:"Surveying", markdown:"Traverse components: \\(\\Delta E = L\\sin\\theta,\\quad \\Delta N = L\\cos\\theta\\)." },
      { subject:"Piecewise equations", markdown:"\\(f(x) = \\begin{cases} x^2 & x \\ge 0 \\\\ -x & x < 0 \\end{cases}\\)" },
    ];
    render(<>{examples.map((example)=><MarkdownContent key={example.subject} markdown={example.markdown} />)}</>);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(examples.length));
    expect(document.querySelectorAll(".katex-display")).toHaveLength(3);
    expect(document.querySelectorAll(".latex-math-error")).toHaveLength(0);
  });

  it("renders math across all student-facing practice question fields for any subject",async()=>{
    const question:PracticeQuestionData = {
      ...syntheticQuestion,
      subjectSlug:"fluid-mechanics",
      topic:"Hydrostatics: \\(p = \\rho g h\\)",
      prompt:"Calculate pressure: \\(p = \\frac{F}{A}\\).",
      choices:["\\(p = \\frac{F}{A}\\)","\\(p = FA\\)"],
      correctAnswer:"\\(p = \\frac{F}{A}\\)",
      solutionSteps:["Use \\(p = \\frac{F}{A}\\).","Substitute the force and area into \\(F/A\\)."],
      explanation:"Pressure is force divided by area: \\(p = \\frac{F}{A}\\).",
      sourceNote:"Synthetic fixture: \\(p = \\rho g h\\).",
    };
    render(<PracticeQuestion question={question} index={0} total={1} selectedAnswer={"\\(p = FA\\)"} submitted={true}
      onSelect={()=>{}} onSubmit={()=>{}} onNext={()=>{}} />);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(9));
    expect(document.querySelectorAll(".katex .mfrac").length).toBeGreaterThanOrEqual(4);
    expect(document.querySelectorAll(".latex-math-error")).toHaveLength(0);
  });

  it("stacks simple slash fractions in automatically detected lesson equations",async()=>{
    const lesson = "Fractions: 3/4 − 1/6 = 9/12 − 2/12 = 7/12.";
    render(<MarkdownContent markdown={lesson} />);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(1));
    expect(document.querySelectorAll(".katex .mfrac")).toHaveLength(5);
    expect(document.querySelector(".latex-math-error")).not.toBeInTheDocument();
  });

  it("stacks simple slash fractions in explicit math and preserves unit notation",async()=>{
    const lesson = "Inline formula: \\(p = F/A\\); unit notation: \\(v = \\mathrm{m/s}\\).";
    render(<MarkdownContent markdown={lesson} />);
    await waitFor(()=>expect(document.querySelectorAll(".katex")).toHaveLength(2));
    expect(document.querySelectorAll(".katex .mfrac")).toHaveLength(1);
    expect(document.querySelector(".latex-math-error")).not.toBeInTheDocument();
  });

});