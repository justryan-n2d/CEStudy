import { Fragment, type ReactNode } from "react";
import { LazyLatexMath } from "./LazyLatexMath";

const INLINE_TOKEN_PATTERN = /(\*\*[^*]+\*\*|\x60[^\x60]+\x60|\\\([\s\S]+?\\\)|(?<!\\)\$(?!\$)[^$\n]+(?<!\\)\$(?!\$))/g;
const MATH_EVIDENCE_PATTERN = /[\d²³⁰¹⁴⁵⁶⁷⁸⁹√^±×÷*\/]/u;
const SHORT_IDENTIFIER_PATTERN = /^[\p{L}]{1,2}$/u;
const STOP_WORDS = new Set([
  "and", "or", "then", "not", "because", "since", "the", "an", "for",
  "when", "where", "which", "it", "as", "from", "so", "while", "this", "that",
  "by", "to", "get", "if", "is", "are", "was", "were", "be", "with", "gives", "means",
  "shows", "describes", "produces", "correspond", "matching", "has", "have",
  "can", "must", "write", "solve", "example", "formula", "equation", "discriminant",
]);

interface MathRange { start: number; end: number }

function isOperator(char: string | undefined): boolean {
  return Boolean(char && "+-−±×÷*/^=≠<>≤≥".includes(char));
}

function isMathCharacter(text: string, index: number): boolean {
  const char = text[index];
  if (char === ".") return /\d/u.test(text[index - 1] ?? "") && /\d/u.test(text[index + 1] ?? "");
  return /[\p{L}\p{N}]/u.test(char)
    || "_{}()[]|√²³⁰¹⁴⁵⁶⁷⁸⁹⁺⁻".includes(char)
    || isOperator(char);
}

function stripLastStopWord(value: string, from: number): number {
  const suffix = value.slice(from);
  const pattern = /\b(?:and|or|then|not|because|since|the|an|for|when|where|which|it|as|from|so|while|this|that|by|to|get|if|is|are|was|were|be|with|gives|means|shows|describes|produces|correspond|matching|has|have|can|must|write|solve|example|formula|equation|discriminant)\b\s+/giu;
  let match: RegExpExecArray | null;
  let nextStart = from;
  while ((match = pattern.exec(suffix)) !== null) {
    nextStart = from + match.index + match[0].length;
  }
  return nextStart;
}

function findLeftBound(text: string, position: number): number {
  let start = position;
  const limit = Math.max(0, position - 140);
  while (start > limit) {
    if (isMathCharacter(text, start - 1) || /\s/u.test(text[start - 1])) {
      start--;
      continue;
    }
    break;
  }
  start = stripLastStopWord(text.slice(0, position), start);
  while (start < position && /\s/u.test(text[start])) start++;
  return start;
}

function findRightBound(text: string, position: number): number {
  let end = position;
  let depth = 0;
  const limit = Math.min(text.length, position + 180);
  while (end < limit) {
    const char = text[end];
    if (/\s/u.test(char)) {
      const wordMatch = text.slice(end).match(/^\s+([\p{L}]+)/u);
      if (wordMatch && depth === 0 && STOP_WORDS.has(wordMatch[1].toLowerCase())) break;
      end++;
      continue;
    }
    if (char === "(" || char === "[" || char === "{") {
      depth++;
      end++;
      continue;
    }
    if (char === ")" || char === "]" || char === "}") {
      depth = Math.max(0, depth - 1);
      end++;
      continue;
    }
    const decimalPoint = char === "." && /\d/u.test(text[end - 1] ?? "") && /\d/u.test(text[end + 1] ?? "");
    if (depth === 0 && ([",", ";", ":"].includes(char) || (char === "." && !decimalPoint))) break;
    if (isMathCharacter(text, end)) {
      end++;
      continue;
    }
    break;
  }
  while (end > position && /\s/u.test(text[end - 1])) end--;
  return end;
}

function isInsideRawHtmlTag(text: string, position: number): boolean {
  const lastOpen = text.lastIndexOf("<", position);
  const lastClose = text.lastIndexOf(">", position);
  return lastOpen > lastClose && text.indexOf(">", lastOpen) >= position;
}

function shouldRenderCandidate(candidate: string, left: string, right: string): boolean {
  if (!left.trim() || !right.trim()) return false;
  if (MATH_EVIDENCE_PATTERN.test(candidate)) return true;
  return SHORT_IDENTIFIER_PATTERN.test(left.trim()) && SHORT_IDENTIFIER_PATTERN.test(right.trim());
}

/**
 * Find obvious, existing equation fragments even when older lesson records
 * contain Unicode/plain-text math without explicit LaTeX delimiters.
 * Explicit delimiters remain preferred for ambiguous expressions.
 */
function findPlainMathRanges(text: string): MathRange[] {
  const ranges: MathRange[] = [];
  const relations = /[=≠<>≤≥]/gu;
  let match: RegExpExecArray | null;

  while ((match = relations.exec(text)) !== null) {
    const anchorStart = match.index;
    if (isInsideRawHtmlTag(text, anchorStart)) continue;

    const anchorEnd = anchorStart + match[0].length;
    const start = findLeftBound(text, anchorStart);
    const end = findRightBound(text, anchorEnd);
    if (start >= anchorStart || end <= anchorEnd) continue;

    const left = text.slice(start, anchorStart).trim();
    const right = text.slice(anchorEnd, end).trim();
    const candidate = text.slice(start, end).trim();
    if (!shouldRenderCandidate(candidate, left, right)) continue;
    ranges.push({ start, end });
  }

  ranges.sort((a, b) => a.start - b.start || a.end - b.end);
  const merged: MathRange[] = [];
  for (const range of ranges) {
    const previous = merged[merged.length - 1];
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}

function looksLikeDollarMath(expression: string): boolean {
  const value = expression.trim();
  if (!value || /\n/u.test(value)) return false;
  // Do not interpret paired currency amounts with intervening prose as an equation.
  if (/\s+[\p{L}]{2,}\s+/u.test(value) && !/[=+\-−*\/^_{}\\±√×÷]/u.test(value)) return false;
  return true;
}

function renderPlainText(text: string): ReactNode {
  const ranges = findPlainMathRanges(text);
  if (!ranges.length) return text;

  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const range of ranges) {
    if (range.start > cursor) parts.push(text.slice(cursor, range.start));
    parts.push(<LazyLatexMath key={"auto-math-" + range.start} latex={text.slice(range.start, range.end).trim()} />);
    cursor = range.end;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

export function InlineMathText({ text }: { text: string }) {
  const pieces = text.split(INLINE_TOKEN_PATTERN);
  return <>{pieces.map((piece, index): ReactNode => {
    if (piece.startsWith("**") && piece.endsWith("**")) {
      return <strong key={index}><InlineMathText text={piece.slice(2, -2)} /></strong>;
    }
    if (piece.charCodeAt(0) === 96 && piece.endsWith(String.fromCharCode(96))) {
      return <code key={index}>{piece.slice(1, -1)}</code>;
    }
    const parenthesizedMath = piece.match(/^\\\(([\s\S]+)\\\)$/);
    if (parenthesizedMath) return <LazyLatexMath key={index} latex={parenthesizedMath[1]} />;
    if (piece.startsWith("$") && piece.endsWith("$") && !piece.startsWith("$$") && looksLikeDollarMath(piece.slice(1, -1))) {
      return <LazyLatexMath key={index} latex={piece.slice(1, -1)} />;
    }
    return <Fragment key={index}>{renderPlainText(piece)}</Fragment>;
  })}</>;
}
