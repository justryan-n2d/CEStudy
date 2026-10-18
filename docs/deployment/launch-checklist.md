# CEStudy pre-launch checklist

Do not announce or open CEStudy broadly to student users until each blocking item is checked and evidence is recorded.

## Dependency and build

- [x] `package-lock.json` is committed and `npm ci` succeeds.
- [x] Latest-main CI passed lint, tests, dependency audit, build/header packaging, backup crypto/retention checks, and isolated Supabase RLS tests in [run 38909521705](https://github.com/justryan-n2d/CEStudy/actions/runs/38909521705) on commit `e66b95a`.
- [x] `npm audit --audit-level=high` reports no high or critical dependency vulnerabilities; the successful audit reported 0 vulnerabilities after upgrading Vitest to 4.1.11.
- [x] Review `.gitignore` and current source-code search results: `.env` files, key files, `secrets/`, and `credentials/` are excluded, and searches found no common Supabase service-role key or database-URL patterns.
- [x] Latest-main full-history Gitleaks scan passed on commit `e66b95a`: [workflow run 38909521941](https://github.com/justryan-n2d/CEStudy/actions/runs/38909521941). The scheduled workflow lives at [secret-scan.yml](../../.github/workflows/secret-scan.yml) and also runs on pushes, pull requests, and manual dispatch.
- [x] Future-question content policy implemented: the repo stays public by decision, the original eight drafts are accepted as disclosed, `supabase/seed.sql` contains catalog metadata only, CI rejects practice-question content in that seed, and future real drafts belong only in the CEStudy Supabase database. Follow [the authoring policy](../content-authoring-and-publication.md).
- [x] Active [Protect main ruleset](https://github.com/justryan-n2d/CEStudy/rules/25242389) verified: pull requests required; CI, Supabase migration/RLS tests, and full-history secret scan required; branch deletion/force pushes blocked; no bypass actors. Documentation verification PR [#13](https://github.com/justryan-n2d/CEStudy/pull/13) passed required checks before merge.

## Supabase

- [x] Dedicated CEStudy Supabase project and correct project reference confirmed.
- [x] Migrations applied without resetting or damaging a shared/production database.
- [x] RLS enabled and grants reviewed on every exposed table.
- [x] Anonymous catalog reads work. The three student-facing tables use explicit client grants and RLS; clients cannot write, and lesson/question rows are readable only when `status = 'published'`.
- [x] Live publication gate verified on 2026-10-18: all 52 practice questions and all 13 lessons are `needs-review`, with zero published. Anonymous-role SQL checks returned zero rows from both content tables. Algebra Foundations is marked `in-preparation`.
- [x] Anonymous and authenticated write attempts are denied in isolated database security tests.
- [x] Supabase security advisor reviewed. The current findings are three informational `RLS enabled, no policy` notices for private tables that have no client grants; no high or critical security lint findings were returned. Default-privilege hardening is applied for new objects created by the standard `postgres` migration owner.
- [x] Recovery method for the current catalog and schema is documented; public catalog metadata can be seeded from source. Actual unpublished question rows are intentionally not reconstructed from public Git, and the encrypted database backup is the recovery source for those rows.
- [x] Backup/recovery procedure documented in [backup and recovery plan](backup-and-recovery.md).
- [x] The real encrypted off-site backup was verified and restored to isolated local PostgreSQL 18.2; see [restore-drill evidence](restore-drill-2026-10-16.md).
- [ ] Run and verify a fresh encrypted backup after the 2026-10-18 publication-status correction.
- [ ] Restore the refreshed backup into a separate managed Supabase test project after explicit cost approval; local restore does not test managed Supabase system roles or settings.
- [x] Live Chromium network capture confirmed the deployed browser requests use `qqmdwltfgpqtcvdbcmto.supabase.co` and an `sb_publishable_` key; no privileged key was detected. See [live browser run 38909783333](https://github.com/justryan-n2d/CEStudy/actions/runs/38909783333).

## Cloudflare Pages deployment

- [x] GitHub repository linked to Pages; build command is `npm run build`, output directory is `dist`.
- [x] Pages preview deployment succeeded in CI; `public/_redirects` and `public/_headers` are included in the production build.
- [x] Live Chromium captured real catalog requests to the dedicated CEStudy Supabase URL; all returned HTTP 200 and the API returned 72 subjects. See [live browser run 38909783333](https://github.com/justryan-n2d/CEStudy/actions/runs/38909783333).
- [x] Chromium responsive checks at 320 px and 1440 px passed with no horizontal overflow. A separate physical-device and accessibility check remains advisable.
- [x] Fresh direct navigation to six routes returned HTTP 200 with the expected page heading: home, catalog, Year 2, math foundations, subject detail, and practice. See [live browser run 38909783333](https://github.com/justryan-n2d/CEStudy/actions/runs/38909783333).
- [x] The rendered catalog source link matches the [official CHED 2017 memorandum archive](https://legacy.ched.gov.ph/2017-ched-memorandum-orders/); the linked PDF returned HTTP 200 and `application/pdf` in Chromium. Catalog search/filters are user-reported as working, but a full automated matrix of search/filter empty states remains pending.
- [x] Live Chromium recorded no browser console, page, request, or same-origin HTTP errors. See [live browser run 38909783333](https://github.com/justryan-n2d/CEStudy/actions/runs/38909783333).
- [x] PR #14 adds a regression test for the six identified small-text selectors to stay at or above 4.5:1 contrast, an accessible live status for catalog result counts, and combined search/year/category/classification/content-status filters. This is source/test coverage, not a substitute for full rendered WCAG or device testing.
- [x] Live Pages responses included CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy; CSP allowed the expected Supabase host and no browser errors were observed. See [live browser run 38909783333](https://github.com/justryan-n2d/CEStudy/actions/runs/38909783333).
- [x] Post-correction database checks confirm the anonymous role receives zero rows from `subject_lessons` and `practice_questions`; both tables still expose only published records through RLS.
- [ ] Re-run the production Chromium smoke suite after the 2026-10-18 publication-status correction. The last documented run [39069495822](https://github.com/justryan-n2d/CEStudy/actions/runs/39069495822) predates that live change.

- [ ] On a physical Android phone, test portrait/landscape, keyboard-only navigation, TalkBack, 200% text zoom, touch targets, all five catalog filters in combinations, no-results recovery, and direct-route refresh. Record device/browser and findings before launch.

## Educational content and pilot

- [x] The original eight questions have a separate historical pre-review. A first-pass AI-assisted math/choice-structure audit covered all 52 live question records on 2026-10-18. Database checks confirmed required fields, unique choices, and exactly one stored correct answer among choices for every record. No definite mismatch was identified in the first pass; this is not independent academic approval. See [Stage 1 audit](../reviews/2026-10-18-stage1-content-and-publication-audit.md).
- [ ] Identify a qualified human reviewer to independently review the 52 questions and 13 lessons before anything changes to `published`.
- [ ] Every proposed published question and lesson is checked for correctness, clear steps, source/attribution, originality, and permission to use. No lessons or questions are currently published.
- [x] Proposed measures and session procedure documented in the [controlled student pilot plan](../plans/2026-10-15-student-pilot-plan.md).
- [ ] Recruit volunteers and run the pilot only after blocking release checks and human review are complete.
- [ ] Add a short privacy notice that accurately describes optional Google sign-in, local study data, and the public feedback/support forms before recruiting pilot students.
- [ ] A feedback/contact path and correction/removal process are ready.
- [ ] Production promotion is explicitly approved only after all blocking items pass.
