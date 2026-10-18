import katex from "katex";
import "katex/dist/katex.min.css";

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "⁺": "+", "⁻": "-",
};

function normalizeMathNotation(source: string): string {
  return source
    .replace(/([A-Za-z0-9)])([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+)/gu, (_match, base: string, power: string) =>
      base + "^{" + [...power].map((digit) => SUPERSCRIPT_DIGITS[digit] ?? digit).join("") + "}")
    .replace(/√\(([^()]*)\)/gu, "\\sqrt{$1}")
    .replace(/√([A-Za-z0-9]+)/gu, "\\sqrt{$1}")
    .replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/gu, "\\frac{$1}{$2}")
    .replace(/×/gu, "\\times ")
    .replace(/÷/gu, "\\div ")
    .replace(/±/gu, "\\pm ")
    .replace(/≠/gu, "\\ne ")
    .replace(/≤/gu, "\\le ")
    .replace(/≥/gu, "\\ge ")
    .replace(/−/gu, "-")
    .replace(/!=/gu, "\\ne ")
    .replace(/<=/gu, "\\le ")
    .replace(/>=/gu, "\\ge ");
}

export function LatexMath({ latex, displayMode = false }: { latex: string; displayMode?: boolean }) {
  if (!latex.trim()) return <span>{latex}</span>;

  try {
    const html = katex.renderToString(normalizeMathNotation(latex), {
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
