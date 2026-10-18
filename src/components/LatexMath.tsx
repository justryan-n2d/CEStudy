import katex from "katex";
import "katex/dist/katex.min.css";

export function LatexMath({ latex, displayMode = false }: { latex: string; displayMode?: boolean }) {
  if (!latex.trim()) return <span>{latex}</span>;

  try {
    const html = katex.renderToString(latex, {
      displayMode,
      output: "htmlAndMathml",
      throwOnError: true,
      trust: false,
      maxExpand: 500,
      maxSize: 20,
    });
    return displayMode
      ? <div className="latex-math-block" dangerouslySetInnerHTML={{ __html: html }} />
      : <span className="latex-math-inline" dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    // Invalid formulas stay readable and never break the surrounding lesson or question.
    return displayMode
      ? <div className="latex-math-error">{latex}</div>
      : <span className="latex-math-error">{latex}</span>;
  }
}
