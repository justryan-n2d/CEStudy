-- Public catalog and practice schema. No anon/authenticated write permissions.
create table if not exists public.catalog_subjects (
 slug text primary key check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text not null check(length(trim(title)) between 1 and 180),
 summary text not null check(length(trim(summary)) between 1 and 600),
 year_level smallint null check(year_level between 1 and 4),
 semester text null check(semester in ('First semester','Second semester','Summer / field experience')),
 category text not null check(category in ('year-level','specialization','math-foundation')),
 classification text not null check(classification in ('ched-common-course','ched-specialized-course','supplementary-math-foundation','additional-ce-review-topic')),
 specialization text null check(specialization in ('Construction Engineering and Management','Geotechnical Engineering','Structural Engineering','Transportation Engineering','Water Resources Engineering')),
 aliases text[] not null default '{}',source_reference text not null,source_note text not null,
 availability text not null check(availability in ('coming-soon','in-preparation','has-published-content')),
 display_order integer not null unique check(display_order>0),
 constraint math_foundation_not_year_level check(category<>'math-foundation' or year_level is null),
 constraint specialization_name_required check(category<>'specialization' or specialization is not null)
);
create index if not exists catalog_subjects_year_order_idx on public.catalog_subjects(year_level,display_order);
create index if not exists catalog_subjects_category_order_idx on public.catalog_subjects(category,display_order);
create index if not exists catalog_subjects_specialization_order_idx on public.catalog_subjects(specialization,display_order);
create table if not exists public.practice_questions (
 id text primary key check(id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 subject_slug text not null references public.catalog_subjects(slug) on delete restrict,
 topic text not null check(length(trim(topic)) between 1 and 120),
 prompt text not null check(length(trim(prompt)) between 1 and 1200),
 choices jsonb not null check(jsonb_typeof(choices)='array' and jsonb_array_length(choices) between 2 and 8),
 correct_answer text not null check(length(trim(correct_answer)) between 1 and 240),
 solution_steps jsonb not null check(jsonb_typeof(solution_steps)='array' and jsonb_array_length(solution_steps) between 1 and 12),
 explanation text not null check(length(trim(explanation)) between 1 and 1000),
 source_note text not null check(length(trim(source_note)) between 1 and 500),
 status text not null check(status in ('draft','needs-review','verified','published','correction-required','retired')),
 display_order integer not null check(display_order>0),unique(subject_slug,display_order)
);
create index if not exists practice_questions_public_order_idx on public.practice_questions(subject_slug,display_order) where status='published';
alter table public.catalog_subjects enable row level security;
alter table public.practice_questions enable row level security;
revoke all on table public.catalog_subjects from public,anon,authenticated;
revoke all on table public.practice_questions from public,anon,authenticated;
grant usage on schema public to anon,authenticated;
grant select on table public.catalog_subjects to anon,authenticated;
grant select on table public.practice_questions to anon,authenticated;
drop policy if exists "Public can read catalog subjects" on public.catalog_subjects;
create policy "Public can read catalog subjects" on public.catalog_subjects for select to anon,authenticated using(true);
drop policy if exists "Public can read published practice questions" on public.practice_questions;
create policy "Public can read published practice questions" on public.practice_questions for select to anon,authenticated using(status='published');
-- No public INSERT, UPDATE, or DELETE grants/policies by design.
