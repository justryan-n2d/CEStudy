-- Private public-contact submissions. Public clients can submit only through the
-- rate-limited Edge Function; no anon/authenticated table privileges or read policies.
create table if not exists public.feedback_messages (
  id uuid primary key default gen_random_uuid(),
  client_submission_id uuid not null unique,
  sender_name text null check(sender_name is null or length(trim(sender_name)) <= 80),
  sender_email text null check(sender_email is null or (length(trim(sender_email)) <= 254 and sender_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
  category text not null check(category in ('general','content','usability','accessibility','feature','other')),
  message text not null check(length(trim(message)) between 10 and 4000),
  notification_status text not null default 'pending' check(notification_status in ('pending','sent','failed')),
  notification_sent_at timestamptz null,
  created_at timestamptz not null default now()
);
create index if not exists feedback_messages_created_at_idx on public.feedback_messages(created_at desc);

create table if not exists public.support_confirmations (
  id uuid primary key default gen_random_uuid(),
  client_submission_id uuid not null unique,
  provider text not null check(provider in ('gcash','paypal')),
  sender_message text null check(sender_message is null or length(trim(sender_message)) <= 500),
  user_confirmed_payment boolean not null check(user_confirmed_payment),
  payment_status text not null default 'user-confirmed-unverified' check(payment_status = 'user-confirmed-unverified'),
  notification_status text not null default 'pending' check(notification_status in ('pending','sent','failed')),
  notification_sent_at timestamptz null,
  created_at timestamptz not null default now()
);
create index if not exists support_confirmations_created_at_idx on public.support_confirmations(created_at desc);

-- Stores only a keyed hash of the caller fingerprint, never the raw IP address.
create table if not exists public.contact_submission_limits (
  identity_hash text not null check(identity_hash ~ '^[a-f0-9]{64}$'),
  form_type text not null check(form_type in ('feedback','support')),
  window_started_at timestamptz not null,
  attempts integer not null check(attempts >= 1),
  primary key(identity_hash, form_type)
);
create index if not exists contact_submission_limits_window_idx on public.contact_submission_limits(window_started_at);

alter table public.feedback_messages enable row level security;
alter table public.support_confirmations enable row level security;
alter table public.contact_submission_limits enable row level security;

revoke all on table public.feedback_messages from public, anon, authenticated;
revoke all on table public.support_confirmations from public, anon, authenticated;
revoke all on table public.contact_submission_limits from public, anon, authenticated;

-- Only trusted server-side code can use the REST table API to store/update these
-- submissions. No public or authenticated SELECT policy exists.
grant select, insert, update on table public.feedback_messages to service_role;
grant select, insert, update on table public.support_confirmations to service_role;
-- The rate-limit table is accessible only to the security-definer RPC owner.
revoke all on table public.contact_submission_limits from service_role;

create or replace function public.consume_public_submission_rate_limit(
  p_identity_hash text,
  p_form_type text,
  p_max_submissions integer,
  p_window_seconds integer
)
returns table(allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_now timestamptz := pg_catalog.clock_timestamp();
  v_started timestamptz;
  v_attempts integer;
  v_reset_window boolean;
begin
  if p_identity_hash is null or p_identity_hash !~ '^[a-f0-9]{64}$'
     or p_form_type not in ('feedback','support')
     or p_max_submissions < 1 or p_max_submissions > 20
     or p_window_seconds < 60 or p_window_seconds > 86400 then
    raise exception 'invalid rate-limit arguments' using errcode = '22023';
  end if;

  delete from public.contact_submission_limits
    where window_started_at < v_now - interval '48 hours';

  insert into public.contact_submission_limits(identity_hash, form_type, window_started_at, attempts)
    values (p_identity_hash, p_form_type, v_now, 1)
  on conflict (identity_hash, form_type) do update
    set window_started_at = case
          when public.contact_submission_limits.window_started_at <=
            v_now - pg_catalog.make_interval(secs => p_window_seconds::double precision)
          then v_now
          else public.contact_submission_limits.window_started_at
        end,
        attempts = case
          when public.contact_submission_limits.window_started_at <=
            v_now - pg_catalog.make_interval(secs => p_window_seconds::double precision)
          then 1
          else public.contact_submission_limits.attempts + 1
        end
  returning public.contact_submission_limits.window_started_at,
            public.contact_submission_limits.attempts
  into v_started, v_attempts;

  allowed := v_attempts <= p_max_submissions;
  retry_after_seconds := case
    when allowed then 0
    else greatest(
      1,
      ceil(extract(epoch from (
        v_started + pg_catalog.make_interval(secs => p_window_seconds::double precision) - v_now
      )))::integer
    )
  end;
  return next;
end;
$function$;

revoke all on function public.consume_public_submission_rate_limit(text,text,integer,integer) from public, anon, authenticated;
grant execute on function public.consume_public_submission_rate_limit(text,text,integer,integer) to service_role;
