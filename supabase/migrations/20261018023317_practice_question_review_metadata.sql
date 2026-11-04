alter table public.practice_questions
  add column if not exists review_notes text not null default ''
    check (length(review_notes) <= 4000),
  add column if not exists reviewed_at timestamptz null,
  add column if not exists updated_at timestamptz not null default now();

comment on column public.practice_questions.review_notes is
  'Private maintainer notes used during academic review; do not expose in student-facing practice responses.';
comment on column public.practice_questions.reviewed_at is
  'Timestamp when a maintainer marked the question verified.';
