begin;
select plan(20);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.subject_lessons'::regclass),
  'RLS is enabled on subject_lessons'
);
select ok(
  exists(select 1 from pg_policies where schemaname='public' and tablename='subject_lessons'
    and cmd='SELECT' and roles @> ARRAY['anon']::name[] and qual like '%published%'),
  'anon has published-only SELECT policy'
);
select ok(
  exists(select 1 from pg_policies where schemaname='public' and tablename='subject_lessons'
    and cmd='SELECT' and roles @> ARRAY['authenticated']::name[] and qual like '%published%'),
  'authenticated has published-only SELECT policy'
);
select ok(has_table_privilege('anon','public.subject_lessons','select'),'anon can SELECT lessons');
select ok(not has_table_privilege('anon','public.subject_lessons','insert'),'anon cannot INSERT lessons');
select ok(not has_table_privilege('anon','public.subject_lessons','update'),'anon cannot UPDATE lessons');
select ok(not has_table_privilege('anon','public.subject_lessons','delete'),'anon cannot DELETE lessons');
select ok(has_table_privilege('authenticated','public.subject_lessons','select'),'authenticated can SELECT lessons');
select ok(not has_table_privilege('authenticated','public.subject_lessons','insert'),'authenticated cannot INSERT lessons');
select ok(not has_table_privilege('authenticated','public.subject_lessons','update'),'authenticated cannot UPDATE lessons');
select ok(not has_table_privilege('authenticated','public.subject_lessons','delete'),'authenticated cannot DELETE lessons');
select ok(
  not exists(select 1 from pg_policies where schemaname='public' and tablename='subject_lessons'
    and cmd in ('INSERT','UPDATE','DELETE')),
  'no client write policies exist on subject_lessons'
);

insert into public.catalog_subjects
  (slug,title,summary,category,classification,aliases,source_reference,source_note,availability,display_order)
values
  ('rls-test-subject','RLS Test Subject','Synthetic RLS fixture only','math-foundation',
   'supplementary-math-foundation',array['synthetic test'],'test fixture','Synthetic test fixture only',
   'coming-soon',99999);

insert into public.subject_lessons
  (id,subject_slug,unit_number,slug,title,learning_objectives,lesson_markdown,source_note,status)
values
  ('rls-published-lesson-test','rls-test-subject',0,'published-test','TEST PUBLISHED LESSON',
   '["TEST OBJECTIVE"]'::jsonb,'TEST PUBLISHED LESSON BODY','Synthetic test fixture only','published'),
  ('rls-unpublished-lesson-test','rls-test-subject',1,'unpublished-test','TEST UNPUBLISHED LESSON',
   '["TEST OBJECTIVE"]'::jsonb,'TEST UNPUBLISHED LESSON BODY','Synthetic test fixture only','needs-review');

set local role anon;
select is(
  (select count(*) from public.subject_lessons where subject_slug='rls-test-subject'),
  1::bigint,
  'anon sees only the published test lesson'
);
select throws_ok(
  $$insert into public.subject_lessons(id,subject_slug,unit_number,slug,title,learning_objectives,lesson_markdown,source_note,status)
    values('anon-write-test','rls-test-subject',2,'anon-write-test','TEST','["TEST"]'::jsonb,'TEST','TEST','published')$$,
  '42501',null,'anon cannot insert or publish a lesson'
);
select throws_ok(
  $$update public.subject_lessons set status='published' where id='rls-unpublished-lesson-test'$$,
  '42501',null,'anon cannot publish an unpublished lesson'
);
select throws_ok(
  $$delete from public.subject_lessons where id='rls-unpublished-lesson-test'$$,
  '42501',null,'anon cannot delete lesson content'
);

reset role;
set local role authenticated;
select is(
  (select count(*) from public.subject_lessons where subject_slug='rls-test-subject'),
  1::bigint,
  'authenticated sees only the published test lesson'
);
select throws_ok(
  $$insert into public.subject_lessons(id,subject_slug,unit_number,slug,title,learning_objectives,lesson_markdown,source_note,status)
    values('auth-write-test','rls-test-subject',2,'auth-write-test','TEST','["TEST"]'::jsonb,'TEST','TEST','published')$$,
  '42501',null,'authenticated cannot insert or publish a lesson'
);
select throws_ok(
  $$update public.subject_lessons set status='published' where id='rls-unpublished-lesson-test'$$,
  '42501',null,'authenticated cannot publish an unpublished lesson'
);
select throws_ok(
  $$delete from public.subject_lessons where id='rls-unpublished-lesson-test'$$,
  '42501',null,'authenticated cannot delete lesson content'
);

select * from finish();
rollback;
