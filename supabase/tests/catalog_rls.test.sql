begin;
select plan(21);

select ok((select relrowsecurity from pg_class where oid='public.catalog_subjects'::regclass),'RLS enabled on catalog_subjects');
select ok((select relrowsecurity from pg_class where oid='public.practice_questions'::regclass),'RLS enabled on practice_questions');
select ok(exists(select 1 from pg_policies where schemaname='public' and tablename='catalog_subjects' and cmd='SELECT' and roles @> ARRAY['anon']::name[]),'catalog has a SELECT policy for anon');
select ok(exists(select 1 from pg_policies where schemaname='public' and tablename='practice_questions' and cmd='SELECT' and roles @> ARRAY['anon']::name[] and qual like '%published%'),'practice has a published-only SELECT policy for anon');
select ok(not exists(
  select 1 from pg_default_acl d
  cross join lateral aclexplode(d.defaclacl) acl
  where d.defaclrole=(select oid from pg_roles where rolname='postgres')
    and d.defaclnamespace='public'::regnamespace and d.defaclobjtype='r'
    and (acl.grantee=0 or acl.grantee in (select oid from pg_roles where rolname in ('anon','authenticated')))
),'future public tables created by postgres do not default to client/PUBLIC grants');
select ok(not exists(
  select 1 from pg_default_acl d
  cross join lateral aclexplode(d.defaclacl) acl
  where d.defaclrole=(select oid from pg_roles where rolname='postgres')
    and d.defaclnamespace='public'::regnamespace and d.defaclobjtype='S'
    and (acl.grantee=0 or acl.grantee in (select oid from pg_roles where rolname in ('anon','authenticated')))
),'future public sequences created by postgres do not default to client/PUBLIC grants');
select ok(not exists(
  select 1 from pg_default_acl d
  cross join lateral aclexplode(d.defaclacl) acl
  where d.defaclrole=(select oid from pg_roles where rolname='postgres')
    and d.defaclnamespace='public'::regnamespace and d.defaclobjtype='f'
    and (acl.grantee=0 or acl.grantee in (select oid from pg_roles where rolname in ('anon','authenticated')))
),'future public functions created by postgres do not default to client/PUBLIC EXECUTE');

-- Add one temporary published fixture as the migration/test owner. Seeded questions remain needs-review.
insert into public.practice_questions (
  id, subject_slug, topic, prompt, choices, correct_answer, solution_steps,
  explanation, source_note, status, display_order
) values (
  'rls-published-visible-test', 'basic-algebra', 'RLS policy test',
  'Which option is the test fixture answer?', '["A", "B"]'::jsonb, 'A',
  '["Test-only fixture"]'::jsonb, 'Test fixture, rolled back at the end.',
  'Test-only data; not educational content.', 'published', 999
);

set local role anon;
select ok((select count(*) from public.catalog_subjects)>=70,'anon can read the public catalog');
select is((select count(*) from public.practice_questions),1::bigint,'anon sees the one published fixture and none of the eight draft questions');
select throws_ok($$insert into public.catalog_subjects(slug,title,summary,category,classification,source_reference,source_note,availability,display_order) values('unauthorized-test','Unauthorized','Denied','year-level','ched-common-course','test','test','coming-soon',99999)$$,'42501',null,'anon catalog INSERT denied');
select throws_ok($$update public.catalog_subjects set title='Tampered' where slug='calculus-1'$$,'42501',null,'anon catalog UPDATE denied');
select throws_ok($$delete from public.catalog_subjects where slug='calculus-1'$$,'42501',null,'anon catalog DELETE denied');
select throws_ok($$insert into public.practice_questions(id,subject_slug,topic,prompt,choices,correct_answer,solution_steps,explanation,source_note,status,display_order) values('unauthorized-question','basic-algebra','test','test','["a","b"]'::jsonb,'a','["step"]'::jsonb,'test','test','published',99999)$$,'42501',null,'anon cannot INSERT/publish practice questions');
select throws_ok($$update public.practice_questions set status='published' where status='needs-review'$$,'42501',null,'anon cannot publish draft questions');

reset role;
set local role authenticated;
select ok((select count(*) from public.catalog_subjects)>=70,'authenticated can read the public catalog');
select is((select count(*) from public.practice_questions),1::bigint,'authenticated sees only the published fixture and none of the eight draft questions');
select throws_ok($$insert into public.catalog_subjects(slug,title,summary,category,classification,source_reference,source_note,availability,display_order) values('authenticated-unauthorized-test','Unauthorized','Denied','year-level','ched-common-course','test','test','coming-soon',99998)$$,'42501',null,'authenticated catalog INSERT denied');
select throws_ok($$update public.catalog_subjects set title='Tampered' where slug='calculus-1'$$,'42501',null,'authenticated catalog UPDATE denied');
select throws_ok($$delete from public.catalog_subjects where slug='calculus-1'$$,'42501',null,'authenticated catalog DELETE denied');
select throws_ok($$insert into public.practice_questions(id,subject_slug,topic,prompt,choices,correct_answer,solution_steps,explanation,source_note,status,display_order) values('authenticated-unauthorized-question','basic-algebra','test','test','["a","b"]'::jsonb,'a','["step"]'::jsonb,'test','test','published',99997)$$,'42501',null,'authenticated practice INSERT denied');
select throws_ok($$update public.practice_questions set status='published' where status='needs-review'$$,'42501',null,'authenticated cannot publish draft questions');

select * from finish();
rollback;
