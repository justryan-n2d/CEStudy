import { supabase } from "../lib/supabase";
import { parsePracticeQuestion, type PracticeQuestion } from "../types/study-content";
export { parsePracticeQuestion };

export async function fetchPublishedPracticeQuestions(subjectSlug = "basic-algebra"): Promise<PracticeQuestion[]> {
  // Draft questions are never bundled locally. Database grants and RLS are the real security boundary.
  if (!supabase) return [];
  const { data, error } = await supabase.from("practice_questions")
    .select("id,subject_slug,topic,prompt,choices,correct_answer,solution_steps,explanation,source_note,display_order")
    .eq("subject_slug", subjectSlug).eq("status", "published").order("display_order", { ascending: true });
  if (error) throw new Error("Published practice questions could not be loaded. Check Supabase configuration and read policies.");
  return (data ?? []).map(row => parsePracticeQuestion(row as Record<string, unknown>))
    .filter((question): question is PracticeQuestion => question !== null);
}
