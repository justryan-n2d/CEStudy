import katex, { type KatexOptions } from "katex";
import "katex/dist/katex.min.css";

function optionsForMath(displayMode: boolean): KatexOptions {
  // A null-prototype options object prevents inherited renderer settings from changing trust.
  return Object.assign(Object.create(null), {
    displayMode,
    output: "htmlAndMathml",
    throwOnError: false,
    trust: false,
    maxExpand: 500,
    maxSize: 20,
  }) as KatexOptions;
}

export function LatexMath({ latex, displayMode = false }: { latex: string; displayMode?: boolean }) {
  if (!latex.trim()) return <span>{latex}</span>;

  try {
    const html = katex.renderToString(latex, optionsForMath(displayMode));
    return displayMode
      ? <div className="latex-math-block" dangerouslySetInnerHTML={{ __html: html }} />
      : <span className="latex-math-inline" dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    // Broken notation stays readable and must never break the surrounding lesson or question.
    return displayMode
      ? <div className="latex-math-error">{latex}</div>
      : <span className="latex-math-error">{latex}</span>;
  }
}
