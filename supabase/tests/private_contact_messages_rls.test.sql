begin;
select plan(30);

select ok((select relrowsecurity from pg_class where oid='public.feedback_messages'::regclass),'RLS enabled on feedback_messages');
select ok((select relrowsecurity from pg_class where oid='public.support_confirmations'::regclass),'RLS enabled on support_confirmations');
select ok((select relrowsecurity from pg_class where oid='public.contact_submission_limits'::regclass),'RLS enabled on contact_submission_limits');
select ok(exists(select 1 from information_schema.columns where table_schema='public' and table_name='feedback_messages' and column_name='read_at'),'feedback messages have server-maintained read state');
select ok(to_regclass('public.feedback_messages_unread_created_at_idx') is not null,'unread feedback has a partial index');

select is((select count(*)::integer from pg_policies where schemaname='public' and tablename in ('feedback_messages','support_confirmations','contact_submission_limits')),0,'private submissions have no client-facing RLS policies');

select ok(not has_table_privilege('anon','public.feedback_messages','SELECT,INSERT,UPDATE,DELETE'),'anon has no privileges on feedback messages');
select ok(not has_table_privilege('authenticated','public.feedback_messages','SELECT,INSERT,UPDATE,DELETE'),'authenticated has no privileges on feedback messages');
select ok(not has_table_privilege('anon','public.support_confirmations','SELECT,INSERT,UPDATE,DELETE'),'anon has no privileges on support confirmations');
select ok(not has_table_privilege('authenticated','public.support_confirmations','SELECT,INSERT,UPDATE,DELETE'),'authenticated has no privileges on support confirmations');
select ok(not has_table_privilege('anon','public.contact_submission_limits','SELECT,INSERT,UPDATE,DELETE'),'anon has no privileges on rate-limit table');
select ok(not has_table_privilege('authenticated','public.contact_submission_limits','SELECT,INSERT,UPDATE,DELETE'),'authenticated has no privileges on rate-limit table');

select ok(has_table_privilege('service_role','public.feedback_messages','SELECT'),'service role can read private feedback');
select ok(has_table_privilege('service_role','public.feedback_messages','INSERT'),'service role can insert private feedback');
select ok(has_table_privilege('service_role','public.feedback_messages','UPDATE'),'service role can update notification state');
select ok(has_table_privilege('service_role','public.support_confirmations','SELECT'),'service role can read private support confirmations');
select ok(has_table_privilege('service_role','public.support_confirmations','INSERT'),'service role can insert support confirmations');
select ok(has_table_privilege('service_role','public.support_confirmations','UPDATE'),'service role can update notification state');
select ok(not has_table_privilege('service_role','public.contact_submission_limits','SELECT,INSERT,UPDATE,DELETE'),'service role accesses rate-limit data only through the RPC');

select ok(not has_function_privilege('anon','public.consume_public_submission_rate_limit(text,text,integer,integer)','EXECUTE'),'anon cannot execute the rate-limit function');
select ok(not has_function_privilege('authenticated','public.consume_public_submission_rate_limit(text,text,integer,integer)','EXECUTE'),'authenticated cannot execute the rate-limit function');
select ok(has_function_privilege('service_role','public.consume_public_submission_rate_limit(text,text,integer,integer)','EXECUTE'),'service role can execute the rate-limit function');

set local role service_role;
select ok((select allowed from public.consume_public_submission_rate_limit(repeat('a',64),'feedback',2,3600)),'first message is allowed');
select ok((select allowed from public.consume_public_submission_rate_limit(repeat('a',64),'feedback',2,3600)),'second message is allowed');
select ok(not (select allowed from public.consume_public_submission_rate_limit(repeat('a',64),'feedback',2,3600)),'third message is rate limited');
select is((select retry_after_seconds > 0 from public.consume_public_submission_rate_limit(repeat('a',64),'feedback',2,3600)),true,'rate-limit response includes a positive retry delay');
select ok((select allowed from public.consume_public_submission_rate_limit(repeat('b',64),'inbox_auth',1,900)),'first owner unlock attempt is allowed');
select ok(not (select allowed from public.consume_public_submission_rate_limit(repeat('b',64),'inbox_auth',1,900)),'repeated owner unlock attempt is rate limited');
select throws_ok($select * from public.consume_public_submission_rate_limit(repeat('z',64),'inbox_auth_invalid',1,900)$,'22023',null,'unsupported rate-limit categories are rejected');
select throws_ok($select * from public.consume_public_submission_rate_limit(repeat('z',64),'feedback',0,3600)$,'22023',null,'invalid rate-limit settings are rejected');

select * from finish();
rollback;
