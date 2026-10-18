import { supabase } from "../lib/supabase";
import { parseSubjectLesson, type SubjectLesson } from "../types/lesson-content";

export async function fetchPublishedLessons(subjectSlug: string): Promise<SubjectLesson[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("subject_lessons")
    .select("id,subject_slug,unit_number,slug,title,learning_objectives,lesson_markdown,source_note,status,review_notes,reviewed_at,updated_at")
    .eq("subject_slug", subjectSlug)
    .eq("status", "published")
    .order("unit_number", { ascending: true });
  if (error) throw new Error("Published lessons could not be loaded. Check Supabase configuration and read policies.");
  return (data ?? [])
    .map((row) => parseSubjectLesson(row as Record<string, unknown>))
    .filter((lesson): lesson is SubjectLesson => lesson !== null && lesson.status === "published");
}
