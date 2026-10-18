export type ContentStatus =
  | "draft"
  | "needs-review"
  | "verified"
  | "published"
  | "correction-required"
  | "retired";

export interface SubjectLesson {
  id: string;
  subjectSlug: string;
  unitNumber: number;
  slug: string;
  title: string;
  learningObjectives: string[];
  lessonMarkdown: string;
  sourceNote: string;
  status: ContentStatus;
  reviewNotes: string;
  reviewedAt: string | null;
  updatedAt: string;
}

export interface ReviewPracticeQuestion {
  id: string;
  subjectSlug: string;
  topic: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  solutionSteps: string[];
  explanation: string;
  sourceNote: string;
  status: ContentStatus;
  displayOrder: number;
}

const STATUSES = new Set<ContentStatus>([
  "draft", "needs-review", "verified", "published", "correction-required", "retired",
]);

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringList(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0 || !value.every((item) => typeof item === "string")) return null;
  return value as string[];
}

function contentStatus(value: unknown): value is ContentStatus {
  return typeof value === "string" && STATUSES.has(value as ContentStatus);
}

export function parseSubjectLesson(row: unknown): SubjectLesson | null {
  if (!record(row)
    || typeof row.id !== "string"
    || typeof row.subject_slug !== "string"
    || typeof row.unit_number !== "number"
    || !Number.isInteger(row.unit_number)
    || row.unit_number < 0 || row.unit_number > 12
    || typeof row.slug !== "string"
    || typeof row.title !== "string" || !row.title.trim()
    || typeof row.lesson_markdown !== "string" || !row.lesson_markdown.trim()
    || typeof row.source_note !== "string"
    || !contentStatus(row.status)
    || (row.review_notes !== undefined && typeof row.review_notes !== "string")
    || (row.reviewed_at !== null && row.reviewed_at !== undefined && typeof row.reviewed_at !== "string")
    || (row.updated_at !== undefined && typeof row.updated_at !== "string")) return null;

  const objectives = stringList(row.learning_objectives);
  if (!objectives) return null;

  return {
    id: row.id,
    subjectSlug: row.subject_slug,
    unitNumber: row.unit_number,
    slug: row.slug,
    title: row.title,
    learningObjectives: objectives,
    lessonMarkdown: row.lesson_markdown,
    sourceNote: row.source_note,
    status: row.status,
    reviewNotes: typeof row.review_notes === "string" ? row.review_notes : "",
    reviewedAt: typeof row.reviewed_at === "string" ? row.reviewed_at : null,
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : "",
  };
}

export function parseReviewPracticeQuestion(row: unknown): ReviewPracticeQuestion | null {
  if (!record(row)
    || typeof row.id !== "string"
    || typeof row.subject_slug !== "string"
    || typeof row.topic !== "string" || !row.topic.trim()
    || typeof row.prompt !== "string" || !row.prompt.trim()
    || typeof row.correct_answer !== "string" || !row.correct_answer.trim()
    || typeof row.explanation !== "string" || !row.explanation.trim()
    || typeof row.source_note !== "string"
    || !contentStatus(row.status)
    || typeof row.display_order !== "number" || !Number.isInteger(row.display_order)) return null;

  const choices = stringList(row.choices);
  const solutionSteps = stringList(row.solution_steps);
  if (!choices || choices.length < 2 || !solutionSteps || !choices.includes(row.correct_answer)) return null;

  return {
    id: row.id,
    subjectSlug: row.subject_slug,
    topic: row.topic,
    prompt: row.prompt,
    choices,
    correctAnswer: row.correct_answer,
    solutionSteps,
    explanation: row.explanation,
    sourceNote: row.source_note,
    status: row.status,
    displayOrder: row.display_order,
  };
}

const ALLOWED_TRANSITIONS: Record<ContentStatus, readonly ContentStatus[]> = {
  draft: ["needs-review", "retired"],
  "needs-review": ["verified", "correction-required", "retired"],
  verified: ["published", "needs-review", "correction-required", "retired"],
  published: ["needs-review", "correction-required", "retired"],
  "correction-required": ["needs-review", "retired"],
  retired: [],
};

export function canTransitionContentStatus(from: ContentStatus, to: ContentStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}
