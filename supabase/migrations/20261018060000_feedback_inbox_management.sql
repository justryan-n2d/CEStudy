-- Persist owner-managed pin state while keeping every mutation server-only.
alter table public.feedback_messages
  add column if not exists is_pinned boolean not null default false;

create index if not exists feedback_messages_pinned_created_at_idx
  on public.feedback_messages(is_pinned desc, created_at desc);

-- Deletion is required by the owner-only Edge Function. Do not grant DELETE to
-- anon or authenticated; those roles retain no direct table privileges.
grant delete on table public.feedback_messages to service_role;
