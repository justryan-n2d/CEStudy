import type { ReactNode } from "react";
import { InlineMathText } from "./InlineMathText";
import { LazyLatexMath } from "./LazyLatexMath";

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "step-heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "sample-problem"; text: string }
  | { type: "sample-problems"; items: string[] }
  | { type: "display-math"; latex: string }
  | { type: "blockquote"; blocks: Block[] }
  | { type: "thematic-break" };

type MarkdownVariant = "default" | "lesson-reader";

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

function parseBlocks(markdown: string, variant: MarkdownVariant = "default"): Block[] {
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
      blocks.push({ type: "blockquote", blocks: parseBlocks(quotedLines.join("\n"), variant) });
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

    if (variant === "lesson-reader") {
      const standaloneBoldHeading = line.match(/^\*\*([^*].*?)\*\*$/);
      if (standaloneBoldHeading) {
        blocks.push({ type: "heading", level: 3, text: standaloneBoldHeading[1] });
        index++;
        continue;
      }
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
        || (variant === "lesson-reader" && /^\*\*([^*].*?)\*\*$/.test(next))
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

function normalizeSectionHeading(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/^\s*\d+[\s.)-]+/, "")
    .replace(/[*_\x60]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isSuppressedLessonSection(title: string): boolean {
  const normalized = normalizeSectionHeading(title);
  return normalized === "key method"
    || normalized === "common errors to avoid"
    || normalized === "learning objectives"
    || normalized.startsWith("one step and two step equations");
}

function isSampleProblemsHeading(title: string): boolean {
  const normalized = normalizeSectionHeading(title);
  return normalized === "examples"
    || normalized.startsWith("worked examples")
    || normalized.startsWith("solved examples")
    || normalized.startsWith("sample problems")
    || normalized.startsWith("practice problems")
    || normalized.startsWith("sample exercises");
}

function isSampleProblemStatement(text: string): boolean {
  return /^(?:example|problem)\s*(?:#?\d+)?\s*[:.)-]/i.test(text.trim());
}

function prepareLessonReaderBlocks(blocks: Block[]): Block[] {
  const visible: Block[] = [];
  let suppressedHeadingLevel: number | null = null;
  let sampleProblemsHeadingLevel: number | null = null;

  for (const block of blocks) {
    if (suppressedHeadingLevel !== null) {
      if (block.type !== "heading" || block.level > suppressedHeadingLevel) continue;
      suppressedHeadingLevel = null;
    }

    if (block.type === "heading") {
      if (isSuppressedLessonSection(block.text)) {
        suppressedHeadingLevel = block.level;
        if (sampleProblemsHeadingLevel !== null && block.level <= sampleProblemsHeadingLevel) {
          sampleProblemsHeadingLevel = null;
        }
        continue;
      }

      if (sampleProblemsHeadingLevel !== null && block.level <= sampleProblemsHeadingLevel) {
        sampleProblemsHeadingLevel = null;
      }
      if (isSampleProblemsHeading(block.text)) {
        sampleProblemsHeadingLevel = block.level;
      }
      visible.push(block);
      continue;
    }

    if (block.type === "blockquote") {
      visible.push({ ...block, blocks: prepareLessonReaderBlocks(block.blocks) });
      continue;
    }

    if (block.type === "unordered-list" || block.type === "ordered-list") {
      if (sampleProblemsHeadingLevel !== null || block.items.every(isSampleProblemStatement)) {
        visible.push({ type: "sample-problems", items: block.items });
      } else {
        visible.push(block);
      }
      continue;
    }

    if (block.type === "paragraph" && (
      sampleProblemsHeadingLevel !== null || isSampleProblemStatement(block.text)
    )) {
      visible.push({ type: "sample-problem", text: block.text });
      continue;
    }

    visible.push(block);
  }

  return visible;
}

function renderBlocks(
  blocks: Block[],
  keyPrefix: string,
  variant: MarkdownVariant = "default",
): ReactNode[] {
  const visibleBlocks = variant === "lesson-reader" ? prepareLessonReaderBlocks(blocks) : blocks;

  return visibleBlocks.map((block, index) => {
    const key = keyPrefix + "-" + index;
    if (block.type === "display-math") {
      return variant === "lesson-reader"
        ? <div className="markdown-display-math" key={key}><LazyLatexMath latex={block.latex} displayMode /></div>
        : <LazyLatexMath key={key} latex={block.latex} displayMode />;
    }
    if (block.type === "blockquote") {
      return <blockquote className="markdown-blockquote" key={key}>{renderBlocks(block.blocks, key, variant)}</blockquote>;
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
    if (block.type === "sample-problems") {
      return (
        <div className="markdown-sample-problems" key={key}>
          {block.items.map((item, itemIndex) => (
            <p className="markdown-sample-problem" key={itemIndex}><InlineMathText text={item} /></p>
          ))}
        </div>
      );
    }
    if (block.type === "sample-problem") {
      return <p className="markdown-sample-problem" key={key}><InlineMathText text={block.text} /></p>;
    }
    return <p key={key}><InlineMathText text={block.text} /></p>;
  });
}

/** Render the safe Markdown subset used by lessons and the owner review workspace. */
export function MarkdownContent({
  markdown,
  variant = "default",
}: {
  markdown: string;
  variant?: MarkdownVariant;
}) {
  const variantClass = variant === "lesson-reader" ? " markdown-content-lesson-reader" : "";
  return <div className={"markdown-content" + variantClass}>{renderBlocks(parseBlocks(markdown, variant), "lesson", variant)}</div>;
}
