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
- `public.subject_lessons` holds the Algebra Foundations unit lessons; all 13 initial lessons were inserted as `needs-review`.
- `public.practice_questions` holds the matching new practice set; all 44 new questions were inserted as `needs-review`. The existing eight draft questions were left unchanged.
- GitHub Actions rejects a public seed that contains an INSERT into `public.practice_questions` or the key fields commonly used to embed question answers and solutions.
- RLS tests create generic synthetic published and unpublished fixtures inside a rolled-back transaction. They verify that anon/authenticated clients see only the published fixture.
- The eight existing draft rows remain in Supabase with `needs-review`; the decision does not publish or delete them. They are no longer recreated from the current public seed file.
- The initial Algebra Foundations bank consists of 13 lessons and 44 new questions in `needs-review`. None are published automatically. The owner-only review function must be deployed with the PR before the review screen works in the deployed site.
- The project must continue to keep student-facing publication deliberately separate from question authoring. Do not add a public client path that can create, read, or publish drafts.

## Cloudflare Pages

Repository visibility is unchanged. Cloudflare Pages remains configured to build from `justryan-n2d/CEStudy`, production branch `main`, with `npm run build` and `dist`. The code changes are delivered through a normal pull request and CI; verify the production Pages deployment and `https://cestudy.pages.dev` after merging. No repository-visibility migration or reconnect is required for this decision.


## Author mathematical notation

The shared lesson and practice renderer supports LaTeX and also detects obvious equations already saved as plain Unicode text.

- Inline math: `\(a^2 + b^2 = c^2\)` or `$a^2 + b^2 = c^2$`
- Display math on its own lines, using either delimiter style:

  ```text
  \[
  \frac{a}{b} = c
  \]
  ```

  ```text
  $$
  \frac{a}{b} = c
  $$
  ```

Explicit delimiters are preferred for new or ambiguous formulas. Common complete grouped LaTeX commands such as `\frac{2x}{3}`, `\sqrt{x}`, and nested fractions are also recognized without extra delimiters. For an equation containing a fraction, use explicit delimiters when possible, for example `\(x = \\frac{2x}{3}\)`. Legacy expressions with clear equality/inequality structure and Unicode math symbols are automatically rendered in lesson prose, headings, lists, practice prompts, answer choices, solutions, explanations, and source notes. Unicode superscripts, square roots, and common math operators are normalized before rendering.

Single currency values such as `$5`, ordinary prose, and inline-code examples remain literal. Raw HTML is not supported. If automatic detection could change the meaning of a sentence, wrap the exact expression in explicit math delimiters.

KaTeX output is rendered with HTML + MathML, trusted commands disabled, and bounded expansion/size options. The site's CSP allows inline style attributes for KaTeX formula layout; because that CSP directive applies to inline style attributes generally, keep the no-raw-HTML rule and KaTeX's `trust: false` setting in place.
