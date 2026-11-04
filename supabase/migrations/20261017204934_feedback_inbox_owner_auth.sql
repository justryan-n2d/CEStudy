-- Add server-maintained read state for the private owner inbox.
alter table public.feedback_messages add column if not exists read_at timestamptz null;
create index if not exists feedback_messages_unread_created_at_idx on public.feedback_messages(created_at desc) where read_at is null;

-- Keep owner key-guessing attempts separate from public feedback/support quotas.
alter table public.contact_submission_limits drop constraint if exists contact_submission_limits_form_type_check;
alter table public.contact_submission_limits add constraint contact_submission_limits_form_type_check check(form_type in ('feedback','support','inbox_auth'));

create or replace function public.consume_public_submission_rate_limit(
  p_identity_hash text, p_form_type text, p_max_submissions integer, p_window_seconds integer
)
returns table(allowed boolean, retry_after_seconds integer)
language plpgsql security definer set search_path = ''
as $function$
declare
  v_now timestamptz := pg_catalog.clock_timestamp();
  v_started timestamptz;
  v_attempts integer;
begin
  if p_identity_hash is null or p_identity_hash !~ '^[a-f0-9]{64}$'
     or p_form_type not in ('feedback','support','inbox_auth')
     or p_max_submissions < 1 or p_max_submissions > 20
     or p_window_seconds < 60 or p_window_seconds > 86400 then
    raise exception 'invalid rate-limit arguments' using errcode = '22023';
  end if;
  delete from public.contact_submission_limits where window_started_at < v_now - interval '48 hours';
  insert into public.contact_submission_limits(identity_hash,form_type,window_started_at,attempts)
    values(p_identity_hash,p_form_type,v_now,1)
  on conflict(identity_hash,form_type) do update
    set window_started_at = case when public.contact_submission_limits.window_started_at <=
      v_now - pg_catalog.make_interval(secs => p_window_seconds::double precision) then v_now
      else public.contact_submission_limits.window_started_at end,
    attempts = case when public.contact_submission_limits.window_started_at <=
      v_now - pg_catalog.make_interval(secs => p_window_seconds::double precision) then 1
      else public.contact_submission_limits.attempts + 1 end
  returning public.contact_submission_limits.window_started_at,public.contact_submission_limits.attempts
  into v_started,v_attempts;
  allowed := v_attempts <= p_max_submissions;
  retry_after_seconds := case when allowed then 0 else greatest(1,ceil(extract(epoch from (
    v_started + pg_catalog.make_interval(secs => p_window_seconds::double precision) - v_now
  )))::integer) end;
  return next;
end;
$function$;
revoke all on function public.consume_public_submission_rate_limit(text,text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_public_submission_rate_limit(text,text,integer,integer) to service_role;
