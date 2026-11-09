import type { SubjectLesson } from "../types/lesson-content";

const IGNORED_TERMS = new Set([
  "about", "after", "also", "among", "apply", "applying", "are", "based", "before",
  "being", "between", "both", "can", "each", "from", "have", "into", "more", "most",
  "other", "same", "should", "such", "that", "their", "them", "then", "these", "this",
  "those", "through", "using", "when", "where", "which", "while", "with", "within",
  "without", "your", "lesson", "lessons", "topic", "topics",
]);

function keywords(values: string[]): Set<string> {
  const terms = values
    .join(" ")
    .normalize("NFKD")
    .toLocaleLowerCase()
    .match(/[\p{L}\p{N}]{3,}/gu) ?? [];

  return new Set(terms.filter((term) => !IGNORED_TERMS.has(term)));
}

/**
 * Recommend a small set of genuinely related lessons from the same subject.
 * Shared title terms carry slightly more weight than shared objective terms.
 * Lessons with no meaningful overlap are omitted rather than filling the list
 * with unrelated content.
 */
export function getRelatedLessons(
  currentLesson: SubjectLesson,
  lessons: SubjectLesson[],
  limit = 3,
): SubjectLesson[] {
  if (!Number.isInteger(limit) || limit <= 0) return [];

  const currentTitleTerms = keywords([currentLesson.title]);
  const currentObjectiveTerms = keywords(currentLesson.learningObjectives);

  return lessons
    .filter((lesson) => lesson.id !== currentLesson.id && lesson.subjectSlug === currentLesson.subjectSlug)
    .map((lesson) => {
      const titleTerms = keywords([lesson.title]);
      const objectiveTerms = keywords(lesson.learningObjectives);
      let score = 0;

      for (const term of titleTerms) {
        if (currentTitleTerms.has(term) || currentObjectiveTerms.has(term)) score += 2;
      }
      for (const term of objectiveTerms) {
        if (currentTitleTerms.has(term) || currentObjectiveTerms.has(term)) score += 1;
      }

      return { lesson, score };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      const leftDistance = Math.abs(left.lesson.unitNumber - currentLesson.unitNumber);
      const rightDistance = Math.abs(right.lesson.unitNumber - currentLesson.unitNumber);
      return leftDistance - rightDistance || left.lesson.unitNumber - right.lesson.unitNumber;
    })
    .slice(0, limit)
    .map(({ lesson }) => lesson);
}
