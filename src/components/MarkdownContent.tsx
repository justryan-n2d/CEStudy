import type { ReactNode } from "react";
import { InlineMathText } from "./InlineMathText";
import { LazyLatexMath } from "./LazyLatexMath";

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "step-heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "display-math"; latex: string }
  | { type: "blockquote"; blocks: Block[] }
  | { type: "thematic-break" };

function parseDisplayMath(lines: string[], startIndex: number): { blocks: Block[]; nextIndex: number } | null {
  const line = lines[startIndex].trim();
  const opener = line.startsWith("\\[") ? "\\[" : line.startsWith("$$") ? "$$" : null;
  if (!opener) return null;
  const closer = opener === "\\[" ? "\\]" : "$$";
  const firstLine = line.slice(opener.length);
  const sameLineClose = firstLine.indexOf(closer);
  if (sameLineClose >= 0) {
    const blocks: Block[] = [{ type: "display-math", latex: firstLine.slice(0, sameLineClose).trim() }];
    const trailing = firstLine.slice(sameLineClose + closer.length).trim();
    if (trailing) blocks.push({ type: "paragraph", text: trailing });
    return { blocks, nextIndex: startIndex + 1 };
  }

  const formulaLines = [firstLine];
  for (let index = startIndex + 1; index < lines.length; index++) {
    const closeIndex = lines[index].indexOf(closer);
    if (closeIndex >= 0) {
      formulaLines.push(lines[index].slice(0, closeIndex));
      const blocks: Block[] = [{ type: "display-math", latex: formulaLines.join("\n").trim() }];
      const trailing = lines[index].slice(closeIndex + closer.length).trim();
      if (trailing) blocks.push({ type: "paragraph", text: trailing });
      return { blocks, nextIndex: index + 1 };
    }
    formulaLines.push(lines[index]);
  }

  // Unmatched delimiters are left as normal text instead of swallowing the rest of a lesson.
  return null;
}

function isBlockquoteLine(line: string): boolean {
  return /^\s{0,3}>/.test(line);
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index++; continue; }

    if (isBlockquoteLine(lines[index])) {
      const quotedLines: string[] = [];
      while (index < lines.length && isBlockquoteLine(lines[index])) {
        quotedLines.push(lines[index].replace(/^\s{0,3}>\s?/, ""));
        index++;
      }
      blocks.push({ type: "blockquote", blocks: parseBlocks(quotedLines.join("\n")) });
      continue;
    }

    const displayMath = parseDisplayMath(lines, index);
    if (displayMath) {
      blocks.push(...displayMath.blocks);
      index = displayMath.nextIndex;
      continue;
    }

    if (/^(?:-{3,}|_{3,}|\*{3,})$/.test(line)) {
      blocks.push({ type: "thematic-break" });
      index++;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length as 1 | 2 | 3, text: heading[2] });
      index++;
      continue;
    }

    const stepHeading = line.match(/^\*\*(Step\s+\d+\s*[:.)-]?\s*.+)\*\*$/i);
    if (stepHeading) {
      blocks.push({ type: "step-heading", text: stepHeading[1] });
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
      if (!next
        || isBlockquoteLine(lines[index])
        || /^(#{1,3})\s+/.test(next)
        || /^\*\*(Step\s+\d+\s*[:.)-]?\s*.+)\*\*$/i.test(next)
        || /^[-*]\s+/.test(next)
        || /^\d+\.\s+/.test(next)
        || /^(?:-{3,}|_{3,}|\*{3,})$/.test(next)
        || parseDisplayMath(lines, index)) break;
      paragraph.push(next);
      index++;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function renderBlocks(blocks: Block[], keyPrefix: string): ReactNode[] {
  return blocks.map((block, index) => {
    const key = `${keyPrefix}-${index}`;
    if (block.type === "display-math") {
      return <LazyLatexMath key={key} latex={block.latex} displayMode />;
    }
    if (block.type === "blockquote") {
      return <blockquote className="markdown-blockquote" key={key}>{renderBlocks(block.blocks, key)}</blockquote>;
    }
    if (block.type === "thematic-break") return <hr className="markdown-divider" key={key} />;
    if (block.type === "step-heading") {
      return <h4 className="markdown-step-heading" key={key}><InlineMathText text={block.text} /></h4>;
    }
    if (block.type === "heading") {
      if (block.level === 1) return <h2 key={key}><InlineMathText text={block.text} /></h2>;
      if (block.level === 2) return <h3 key={key}><InlineMathText text={block.text} /></h3>;
      return <h4 key={key}><InlineMathText text={block.text} /></h4>;
    }
    if (block.type === "unordered-list") {
      return <ul key={key}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineMathText text={item} /></li>)}</ul>;
    }
    if (block.type === "ordered-list") {
      return <ol key={key}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineMathText text={item} /></li>)}</ol>;
    }
    return <p key={key}><InlineMathText text={block.text} /></p>;
  });
}

/** Render a safe Markdown subset with headings, lists, quotations, and KaTeX math. */
export function MarkdownContent({ markdown }: { markdown: string }) {
  return <div className="markdown-content">{renderBlocks(parseBlocks(markdown), "lesson")}</div>;
}
