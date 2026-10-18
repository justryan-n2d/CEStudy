import type { ReactNode } from "react";
import { LatexMath } from "./LatexMath";

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "display-math"; latex: string };

function parseDisplayMath(lines: string[], startIndex: number): { blocks: Block[]; nextIndex: number } | null {
  const line = lines[startIndex].trim();
  if (!line.startsWith("\\[")) return null;

  const firstLine = line.slice(2);
  const sameLineClose = firstLine.indexOf("\\]");
  if (sameLineClose >= 0) {
    const blocks: Block[] = [{ type: "display-math", latex: firstLine.slice(0, sameLineClose).trim() }];
    const trailing = firstLine.slice(sameLineClose + 2).trim();
    if (trailing) blocks.push({ type: "paragraph", text: trailing });
    return { blocks, nextIndex: startIndex + 1 };
  }

  const formulaLines = [firstLine];
  for (let index = startIndex + 1; index < lines.length; index++) {
    const closeIndex = lines[index].indexOf("\\]");
    if (closeIndex >= 0) {
      formulaLines.push(lines[index].slice(0, closeIndex));
      const blocks: Block[] = [{ type: "display-math", latex: formulaLines.join("\n").trim() }];
      const trailing = lines[index].slice(closeIndex + 2).trim();
      if (trailing) blocks.push({ type: "paragraph", text: trailing });
      return { blocks, nextIndex: index + 1 };
    }
    formulaLines.push(lines[index]);
  }

  // An unmatched opener is left as Markdown text instead of silently consuming the rest of the lesson.
  return null;
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index++; continue; }

    const displayMath = parseDisplayMath(lines, index);
    if (displayMath) {
      blocks.push(...displayMath.blocks);
      index = displayMath.nextIndex;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length as 1 | 2 | 3, text: heading[2] });
      index++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index++;
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index++;
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length) {
      const next = lines[index].trim();
      if (!next || /^(#{1,3})\s+/.test(next) || /^[-*]\s+/.test(next) || /^\d+\.\s+/.test(next)) break;
      paragraph.push(next);
      index++;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

const CODE_TICK = String.fromCharCode(96);
const INLINE_TOKEN_PATTERN = new RegExp("(\\\\*\\\\*[^*]+\\\\*\\\\*|" + CODE_TICK + "[^" + CODE_TICK + "]+" + CODE_TICK + "|\\\\\\\\\\\\([\\\\s\\\\S]+?\\\\\\\\\\\\))", "g");

export function InlineMathText({ text }: { text: string }) {
  const pieces = text.split(INLINE_TOKEN_PATTERN);
  return <>{pieces.map((piece, index): ReactNode => {
    if (piece.startsWith("**") && piece.endsWith("**")) {
      return <strong key={index}><InlineMathText text={piece.slice(2, -2)} /></strong>;
    }
    if (piece.startsWith(CODE_TICK) && piece.endsWith(CODE_TICK)) {
      return <code key={index}>{piece.slice(1, -1)}</code>;
    }
    const math = piece.match(/^\\\\\\(([\\s\\S]+)\\\\\\)$/);
    if (math) return <LatexMath key={index} latex={math[1]} />;
    return piece;
  })}</>;
}

/** Render a deliberately small, safe subset of Markdown. It never interprets HTML. */
export function MarkdownContent({ markdown }: { markdown: string }) {
  const blocks = parseBlocks(markdown);
  return <div className="markdown-content">{blocks.map((block, index) => {
    if (block.type === "display-math") {
      return <LatexMath key={index} latex={block.latex} displayMode />;
    }
    if (block.type === "heading") {
      if (block.level === 1) return <h2 key={index}><InlineMathText text={block.text} /></h2>;
      if (block.level === 2) return <h3 key={index}><InlineMathText text={block.text} /></h3>;
      return <h4 key={index}><InlineMathText text={block.text} /></h4>;
    }
    if (block.type === "unordered-list") return <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineMathText text={item} /></li>)}</ul>;
    if (block.type === "ordered-list") return <ol key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineMathText text={item} /></li>)}</ol>;
    return <p key={index}><InlineMathText text={block.text} /></p>;
  })}</div>;
}
