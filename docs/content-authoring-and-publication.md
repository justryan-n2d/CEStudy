# Unpublished question authoring and publication

**Decision (2026-10-16): keep `justryan-n2d/CEStudy` public.** The original eight draft questions have already been exposed in public Git history, and that exposure is accepted. They are treated as disclosed material. Do not spend time rewriting history or changing repository visibility for those drafts.

The fix is to protect all **future** unpublished content. The public repository remains useful for transparent app development, while real draft questions stay in the dedicated CEStudy Supabase project.

## Where content belongs

- **Public GitHub repository:** application code, schema migrations, public catalog metadata, documentation that does not reproduce unreleased questions, and generic synthetic test fixtures only.
- **CEStudy Supabase database:** actual unpublished question prompts, answer options, correct answers, worked solutions, explanations, review notes, and publication status.
- **Public app/API:** only rows deliberately marked `published`; the current app must not provide a draft-authoring endpoint or client-side privilege.

Never commit an unpublished question bank to `supabase/seed.sql`, application source, test fixtures, screenshots, issue/PR text, workflow logs, or build artifacts.

## Add a future draft

1. Open the official Supabase Dashboard and select the dedicated **CEStudy** project (`qqmdwltfgpqtcvdbcmto`).
2. Open **SQL Editor** using your authorized project account. Do not place database passwords, secret/service-role keys, or other credentials into application code or public logs.
3. Insert the real question directly into `public.practice_questions` with `status = 'needs-review'`. Use a unique ID and the existing table schema; do not put its question text in the SQL file committed to GitHub.
4. Keep it unpublished while review is pending. The existing RLS SELECT policy permits client roles to see published questions only; anonymous and authenticated clients do not get write access. A privileged dashboard session is used for maintainer edits.
5. If local development needs example data, use placeholders such as `TEST PROMPT`, `TEST OPTION A`, and `TEST STEP`, not the real draft.

## Human review and publish

Before publishing, a human reviewer must check the prompt, all choices, correct answer, each solution step, explanation, math, clarity, originality, and source/attribution or usage permission. An automated arithmetic check is not academic approval.

Only an authorized maintainer may update an approved row from `needs-review` to `published` through the privileged Supabase dashboard. After the change, run the live published-only API/UI checks and confirm the intended question is the only newly exposed content. If there is an error, return the row to `needs-review` promptly and verify the public API no longer returns it.

## Automated guard and current state

- `supabase/seed.sql` seeds the public subject catalog only. It does not insert actual practice-question rows.
- GitHub Actions rejects a public seed that contains an INSERT into `public.practice_questions` or the key fields commonly used to embed question answers and solutions.
- RLS tests create generic synthetic published and unpublished fixtures inside a rolled-back transaction. They verify that anon/authenticated clients see only the published fixture.
- The eight existing draft rows remain in Supabase with `needs-review`; the decision does not publish or delete them. They are no longer recreated from the current public seed file.
- The project must continue to keep student-facing publication deliberately separate from question authoring. Do not add a public client path that can create, read, or publish drafts.

## Cloudflare Pages

Repository visibility is unchanged. Cloudflare Pages remains configured to build from `justryan-n2d/CEStudy`, production branch `main`, with `npm run build` and `dist`. The content-separation change is already on `main` in [commit `64bc447`](https://github.com/justryan-n2d/CEStudy/commit/64bc447b7c725fea62402ff4f9f5c6960586bee9). Confirm that the latest production Pages deployment succeeded and run the live-site smoke checks before closing the release gate. No repository-visibility migration or reconnect is required for this decision.
