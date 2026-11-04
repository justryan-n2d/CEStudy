export interface PracticeQuestion {
  id: string;
  subjectSlug: string;
  topic: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  solutionSteps: string[];
  explanation: string;
  sourceNote: string;
  displayOrder: number;
}

export function parsePracticeQuestion(row: Record<string, unknown>): PracticeQuestion | null {
  if (typeof row.id !== "string" || typeof row.subject_slug !== "string" ||
      typeof row.topic !== "string" || typeof row.prompt !== "string" ||
      !Array.isArray(row.choices) || !row.choices.every((value: unknown) => typeof value === "string") ||
      row.choices.length < 2 || typeof row.correct_answer !== "string" ||
      !Array.isArray(row.solution_steps) || !row.solution_steps.every((value: unknown) => typeof value === "string") ||
      row.solution_steps.length === 0 || typeof row.explanation !== "string" || typeof row.source_note !== "string") return null;
  return {
    id: row.id, subjectSlug: row.subject_slug, topic: row.topic, prompt: row.prompt,
    choices: row.choices as string[], correctAnswer: row.correct_answer,
    solutionSteps: row.solution_steps as string[], explanation: row.explanation, sourceNote: row.source_note,
    displayOrder: Number(row.display_order ?? 0),
  };
}
