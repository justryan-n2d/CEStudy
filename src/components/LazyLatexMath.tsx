import { lazy, Suspense } from "react";

const LatexMathChunk = lazy(() => import("./LatexMath").then((module) => ({
  default: module.LatexMath,
})));

export function LazyLatexMath({ latex, displayMode = false }: { latex: string; displayMode?: boolean }) {
  const fallback = displayMode
    ? <div className="latex-math-block">{latex}</div>
    : <span className="latex-math-inline">{latex}</span>;

  return (
    <Suspense fallback={fallback}>
      <LatexMathChunk latex={latex} displayMode={displayMode} />
    </Suspense>
  );
}
