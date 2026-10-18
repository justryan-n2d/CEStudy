import { supabase } from "../lib/supabase";

interface PublishedLessonTopic {
  kind: "lesson";
  subjectSlug: string;
  unitNumber: number;
  slug: string;
  title: string;
  learningObjectives: string[];
}

interface PublishedPracticeTopic {
  kind: "practice";
  subjectSlug: string;
  topic: string;
  title: string;
  questionCount: number;
}

export type PublishedTopicIndexEntry = PublishedLessonTopic | PublishedPracticeTopic;

export async function fetchPublishedTopicIndex(): Promise<PublishedTopicIndexEntry[]> {
  if (!supabase) return [];

  const [lessonResult, questionResult] = await Promise.all([
    supabase.from("subject_lessons")
      .select("subject_slug,unit_number,slug,title,learning_objectives,status")
      .eq("status", "published")
      .order("unit_number", { ascending: true }),
    supabase.from("practice_questions")
      .select("subject_slug,topic,status")
      .eq("status", "published")
      .order("topic", { ascending: true }),
  ]);

  if (lessonResult.error || questionResult.error) {
    throw new Error("Published topics could not be loaded.");
  }

  const lessonTopics: PublishedLessonTopic[] = (lessonResult.data ?? [])
    .filter((row) => row.status === "published"
      && typeof row.subject_slug === "string"
      && typeof row.unit_number === "number"
      && Number.isInteger(row.unit_number)
      && row.unit_number >= 0
      && row.unit_number <= 12
      && typeof row.slug === "string"
      && typeof row.title === "string"
      && row.title.trim().length > 0
      && Array.isArray(row.learning_objectives)
      && row.learning_objectives.every((objective: unknown) => typeof objective === "string"))
    .map((row) => ({
      kind: "lesson" as const,
      subjectSlug: row.subject_slug as string,
      unitNumber: row.unit_number as number,
      slug: row.slug as string,
      title: row.title as string,
      learningObjectives: row.learning_objectives as string[],
    }));

  const groupedPracticeTopics = new Map<string, { subjectSlug: string; topic: string; questionCount: number }>();
  for (const row of questionResult.data ?? []) {
    if (row.status !== "published"
      || typeof row.subject_slug !== "string"
      || typeof row.topic !== "string"
      || !row.topic.trim()) continue;

    const topic = row.topic.trim();
    const key = row.subject_slug + ":" + topic.normalize("NFKC").toLowerCase();
    const current = groupedPracticeTopics.get(key);
    if (current) current.questionCount += 1;
    else groupedPracticeTopics.set(key, { subjectSlug: row.subject_slug, topic, questionCount: 1 });
  }

  const practiceTopics: PublishedPracticeTopic[] = [...groupedPracticeTopics.values()].map((entry) => ({
    kind: "practice",
    subjectSlug: entry.subjectSlug,
    topic: entry.topic,
    title: entry.topic,
    questionCount: entry.questionCount,
  }));

  return [...practiceTopics, ...lessonTopics];
}
