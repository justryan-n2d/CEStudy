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
4. Keep content unpublished while review is pending. Both tables use RLS policies that permit client-role reads only for rows marked `published`; anon/authenticated roles have no write privileges. Browser roles also cannot read the private `review_notes` and `reviewed_at` columns. Use the owner-only content review screen at `/owner/content-review`; its `content-review-admin` Edge Function validates the same private `FEEDBACK_INBOX_ACCESS_KEY` used by the feedback inbox, issues a short-lived in-memory token, and uses server-side privileges for the approved edit/review actions.
5. If local development needs example data, use placeholders such as `TEST LESSON BODY`, `TEST PROMPT`, `TEST OPTION A`, and `TEST STEP`, not the real draft.

## Human review and publish

Before publishing, the maintainer-reviewer must check a lesson's alignment with the approved syllabus, clarity, examples and mathematics, or a question's prompt, all choices, correct answer, every solution step, explanation, originality, and source/attribution or usage permission. Automated arithmetic checks are useful but are not academic approval.

The owner-only review screen supports direct edits that save the item as `needs-review`, a separate explicit transition to `verified`, and a separate, confirmed publish action available only from `verified`. A published item can be returned to review or marked correction-required, which removes it from the student-facing query. After publishing or unpublishing, confirm the catalog availability and published-only API/UI behavior. Content approval is per item, not a blanket approval for an entire unit.

## Automated guard and current state

- `supabase/seed.sql` seeds the public subject catalog only. It does not insert lesson bodies or actual practice-question rows.
- `public.subject_lessons` holds 13 Algebra Foundations lesson records. As of the 2026-10-18 Stage 1 audit, all 13 are `needs-review`; two that had been marked published despite draft notes were returned to review. Their review timestamps were cleared and the audit reason was recorded in private `review_notes`.
- `public.practice_questions` holds 52 practice-question records: the 44-question newer set plus the original eight draft records. All 52 are `needs-review` and none is published.
- GitHub Actions rejects a public seed that contains an INSERT into `public.practice_questions` or the key fields commonly used to embed question answers and solutions.
- RLS tests create generic synthetic published and unpublished fixtures inside a rolled-back transaction. They verify that anon/authenticated clients see only the published fixture.
- The original eight draft rows remain in Supabase with `needs-review`; they are no longer recreated from the current public seed file. The remaining 44 questions also remain private and unreviewed.
- The live Algebra Foundations bank currently consists of 13 lesson records and 52 practice questions, all `needs-review`. A 2026-10-18 audit returned two draft-marked lessons to review; the catalog entry is `in-preparation`, and anonymous access now returns zero rows from both lesson and question tables. `content-review-admin` is active, but every publication still requires explicit human review and approval.
- The project must continue to keep student-facing publication deliberately separate from question authoring. Do not add a public client path that can create, read, or publish drafts.

## Cloudflare Pages

Repository visibility is unchanged. Cloudflare Pages remains configured to build from `justryan-n2d/CEStudy`, production branch `main`, with `npm run build` and `dist`. The code changes are delivered through a normal pull request and CI; verify the production Pages deployment and `https://cestudy.pages.dev` after merging. No repository-visibility migration or reconnect is required for this decision.


## Author mathematical notation

The shared math pipeline applies across every subject and future topic. All student lesson text goes through `MarkdownContent`; practice topics, prompts, choices, correct answers, solution steps, explanations, and source notes go through `InlineMathText`. Do not create subject-specific math renderers.

Use explicit delimiters for formulas in new content. They give every KaTeX expression a clear start and end, especially for calculus, summations, matrices, vectors, structural equilibrium, mechanics of materials, fluids, surveying, and future engineering subjects.

- Inline formula: `\(a^2 + b^2 = c^2\)`
- Display formula on separate lines:

  `\[`

  `\frac{a}{b} = c`

  `\]`

KaTeX also accepts single-dollar inline and double-dollar display delimiters. The shared renderer recognizes common complete grouped commands such as a bare fraction or square root without delimiters, but that automatic detection is intentionally limited. Use explicit delimiters for commands such as integrals, summations, matrices, piecewise functions, or any complex expression.

KaTeX supports a broad LaTeX-like math syntax, not every LaTeX package or custom command. Unsupported or malformed expressions remain visible as readable source instead of breaking the page. Existing plain Unicode equations are also auto-detected when their mathematical structure is clear.

Single currency values, ordinary prose, and inline-code examples remain literal. Raw HTML is not supported. Keep KaTeX's `trust: false` setting and bounded expansion/size options in place.
