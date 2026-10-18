# Unpublished question authoring and publication

**Decision (2026-10-16): keep `justryan-n2d/CEStudy` public.** The original eight draft questions have already been exposed in public Git history, and that exposure is accepted. They are treated as disclosed material. Do not spend time rewriting history or changing repository visibility for those drafts.

The fix is to protect all **future** unpublished content. The public repository remains useful for transparent app development, while real draft questions stay in the dedicated CEStudy Supabase project.

## Where content belongs

- **Public GitHub repository:** application code, schema migrations, public catalog metadata, documentation that does not reproduce unreleased questions, and generic synthetic test fixtures only.
- **CEStudy Supabase database:** actual unpublished lesson markdown and learning objectives in `public.subject_lessons`, plus question prompts, answer options, correct answers, worked solutions, explanations, review notes, and publication status in `public.practice_questions`.
- **Public app/API:** only rows deliberately marked `published`; the current app must not provide a draft-authoring endpoint or client-side privilege.

Never commit an unpublished question bank to `supabase/seed.sql`, application source, test fixtures, screenshots, issue/PR text, workflow logs, or build artifacts.

## Add a future draft

1. Open the official Supabase Dashboard and select the dedicated **CEStudy** project (`qqmdwltfgpqtcvdbcmto`).
2. Open **SQL Editor** using your authorized project account. Do not place database passwords, secret/service-role keys, or other credentials into application code or public logs.
3. Insert real lesson content directly into `public.subject_lessons` with `status = 'needs-review'`, and actual practice-question fields into `public.practice_questions` with the same status. Use unique IDs and existing constraints; do not put real lesson or question bodies, answers, or solutions into files committed to GitHub.
4. Keep content unpublished while review is pending. Both tables use RLS policies that permit client-role reads only for rows marked `published`; anon/authenticated roles have no write privileges. A privileged dashboard or approved server-side maintainer path is used for edits.
5. If local development needs example data, use placeholders such as `TEST LESSON BODY`, `TEST PROMPT`, `TEST OPTION A`, and `TEST STEP`, not the real draft.

## Human review and publish

Before publishing, a human reviewer must check the prompt, all choices, correct answer, each solution step, explanation, math, clarity, originality, and source/attribution or usage permission. An automated arithmetic check is not academic approval.

Only an authorized maintainer may update an approved row from `needs-review` to `published` through the privileged Supabase dashboard. After the change, run the live published-only API/UI checks and confirm the intended question is the only newly exposed content. If there is an error, return the row to `needs-review` promptly and verify the public API no longer returns it.

## Automated guard and current state

- `supabase/seed.sql` seeds the public subject catalog only. It does not insert lesson bodies or actual practice-question rows.
- `public.subject_lessons` holds the Algebra Foundations unit lessons; all 13 initial lessons were inserted as `needs-review`.
- `public.practice_questions` holds the matching new practice set; all 44 new questions were inserted as `needs-review`. The existing eight draft questions were left unchanged.
- GitHub Actions rejects a public seed that contains an INSERT into `public.practice_questions` or the key fields commonly used to embed question answers and solutions.
- RLS tests create generic synthetic published and unpublished fixtures inside a rolled-back transaction. They verify that anon/authenticated clients see only the published fixture.
- The eight existing draft rows remain in Supabase with `needs-review`; the decision does not publish or delete them. They are no longer recreated from the current public seed file.
- The project must continue to keep student-facing publication deliberately separate from question authoring. Do not add a public client path that can create, read, or publish drafts.

## Cloudflare Pages

Repository visibility is unchanged. Cloudflare Pages remains configured to build from `justryan-n2d/CEStudy`, production branch `main`, with `npm run build` and `dist`. The code changes are delivered through a normal pull request and CI; verify the production Pages deployment and `https://cestudy.pages.dev` after merging. No repository-visibility migration or reconnect is required for this decision.
