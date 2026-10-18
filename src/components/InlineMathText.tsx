import type { ReactNode } from "react";
import { LazyLatexMath } from "./LazyLatexMath";

const INLINE_TOKEN_PATTERN = /(\*\*[^*]+\*\*|[\x60][^\x60]+[\x60]|\\\([\s\S]+?\\\))/g;

export function InlineMathText({ text }: { text: string }) {
  const pieces = text.split(INLINE_TOKEN_PATTERN);
  return <>{pieces.map((piece, index): ReactNode => {
    if (piece.startsWith("**") && piece.endsWith("**")) {
      return <strong key={index}><InlineMathText text={piece.slice(2, -2)} /></strong>;
    }
    if (piece.charCodeAt(0) === 96 && piece.endsWith(String.fromCharCode(96))) {
      return <code key={index}>{piece.slice(1, -1)}</code>;
    }
    const math = piece.match(/^\\\(([\s\S]+)\\\)$/);
    if (math) return <LazyLatexMath key={index} latex={math[1]} />;
    return piece;
  })}</>;
}
