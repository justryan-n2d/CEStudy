import { supabase } from "../lib/supabase";

export interface PublishedTopicIndexEntry {
  subjectSlug: string;
  unitNumber: number;
  slug: string;
  title: string;
  learningObjectives: string[];
}

export async function fetchPublishedTopicIndex(): Promise<PublishedTopicIndexEntry[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("subject_lessons")
    .select("subject_slug,unit_number,slug,title,learning_objectives,status")
    .eq("status", "published")
    .order("unit_number", { ascending: true });

  if (error) throw new Error("Published topics could not be loaded.");

  return (data ?? [])
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
      subjectSlug: row.subject_slug as string,
      unitNumber: row.unit_number as number,
      slug: row.slug as string,
      title: row.title as string,
      learningObjectives: row.learning_objectives as string[],
    }));
}
