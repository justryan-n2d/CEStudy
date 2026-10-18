-- Private-by-default lesson content storage.
-- Public clients can read only lessons deliberately marked published; there are no client write grants.
create table if not exists public.subject_lessons (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  subject_slug text not null references public.catalog_subjects(slug) on delete restrict,
  unit_number smallint not null check (unit_number between 0 and 12),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) between 1 and 180),
  learning_objectives jsonb not null
    check (jsonb_typeof(learning_objectives) = 'array'
      and jsonb_array_length(learning_objectives) between 1 and 8),
  lesson_markdown text not null
    check (length(trim(lesson_markdown)) between 1 and 20000),
  source_note text not null
    check (length(trim(source_note)) between 1 and 1200),
  status text not null
    check (status in ('draft','needs-review','verified','published','correction-required','retired')),
  review_notes text not null default ''
    check (length(review_notes) <= 4000),
  reviewed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_slug, unit_number),
  unique (subject_slug, slug)
);

create index if not exists subject_lessons_published_order_idx
  on public.subject_lessons(subject_slug, unit_number)
  where status = 'published';

alter table public.subject_lessons enable row level security;
revoke all on table public.subject_lessons from public, anon, authenticated;
grant select on table public.subject_lessons to anon, authenticated;
grant select, insert, update, delete on table public.subject_lessons to service_role;

drop policy if exists "Public can read published lessons" on public.subject_lessons;
create policy "Public can read published lessons"
  on public.subject_lessons for select to anon, authenticated
  using (status = 'published');

-- Do not grant client-side INSERT, UPDATE, DELETE. Maintainer edits use a privileged server/dashboard path.
