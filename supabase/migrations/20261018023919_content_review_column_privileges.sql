-- Keep maintainer-only review notes and review timestamps out of browser-accessible column grants.
-- RLS still filters rows to published content; column privileges also prevent reading private metadata on published rows.
revoke select on table public.subject_lessons from anon, authenticated;
grant select (
  id, subject_slug, unit_number, slug, title, learning_objectives,
  lesson_markdown, source_note, status, updated_at
) on table public.subject_lessons to anon, authenticated;

revoke select on table public.practice_questions from anon, authenticated;
grant select (
  id, subject_slug, topic, prompt, choices, correct_answer,
  solution_steps, explanation, source_note, status, display_order
) on table public.practice_questions to anon, authenticated;
