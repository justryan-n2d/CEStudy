# CEStudy pre-launch checklist

Do not announce or open CEStudy broadly to student users until each blocking item is checked and evidence is recorded.

## Dependency and build

- [x] `package-lock.json` is committed and `npm ci` succeeds.
- [x] Latest main CI after the Stage 1 audit and Privacy notice merge passed lint, tests, dependency audit, build/header packaging, backup crypto/retention checks, and isolated Supabase RLS tests in [run 39142266631](https://github.com/justryan-n2d/CEStudy/actions/runs/39142266631) on commit `97d6e8d`.
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
- [x] A fresh encrypted snapshot was uploaded and read-back verified in the latest [backup workflow run 39433566649](https://github.com/justryan-n2d/CEStudy/actions/runs/39433566649) on 2026-10-20; retention kept four verified sets and hid three stale/incomplete artifacts. The run was successful and had clean summary logs, but its pre-PR validator still checked only `catalog_subjects` and `practice_questions`.
- [ ] After PR #48's three-table validator and per-table success logging are merged, rerun backup from `main`; verify `catalog_subjects`, `practice_questions`, and `subject_lessons` are each explicitly logged as verified, and confirm archive/checksum/marker read-back plus retention succeed. The latest successful run [39433566649](https://github.com/justryan-n2d/CEStudy/actions/runs/39433566649) did not yet use that validator.
- [ ] Restore the refreshed backup into a separate managed Supabase test project after explicit cost approval; local restore does not test managed Supabase system roles or settings.
- [x] Live Chromium network capture confirmed the deployed browser requests use `qqmdwltfgpqtcvdbcmto.supabase.co` and an `sb_publishable_` key; no privileged key was detected. See [live browser run 38909783333](https://github.com/justryan-n2d/CEStudy/actions/runs/38909783333).

## Cloudflare Pages deployment

- [x] GitHub repository linked to Pages; build command is `npm run build`, output directory is `dist`.
- [x] Pages deployment for the public Privacy notice succeeded, and `public/_redirects` and `public/_headers` are included in the production build. The live route is [https://cestudy.pages.dev/privacy](https://cestudy.pages.dev/privacy).
- [x] Live Chromium captured real catalog requests to the dedicated CEStudy Supabase URL; all returned HTTP 200 and the API returned 72 subjects. See [live browser run 38909783333](https://github.com/justryan-n2d/CEStudy/actions/runs/38909783333).
- [x] Chromium responsive checks at 320 px and 1440 px passed with no horizontal overflow. A separate physical-device and accessibility check remains advisable.
- [x] Post-correction Chromium smoke test [run 39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712) passed 135/135 checks. Direct navigation and heading checks include the `/privacy` route, as well as the existing catalog, year-level, math, subject, practice, contact, support, bug-report, and feedback routes.
- [x] The rendered catalog source link matches the [official CHED 2017 memorandum archive](https://legacy.ched.gov.ph/2017-ched-memorandum-orders/); the linked PDF returned HTTP 200 and `application/pdf` in Chromium. Catalog search/filters are user-reported as working, but a full automated matrix of search/filter empty states remains pending.
- [x] Post-correction Chromium [run 39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712) reported no browser console, page, request, or same-origin HTTP errors.
- [x] PR #14 adds a regression test for the six identified small-text selectors to stay at or above 4.5:1 contrast, an accessible live status for catalog result counts, and combined search/year/category/classification/content-status filters. This is source/test coverage, not a substitute for full rendered WCAG or device testing.
- [x] Latest live Pages responses included CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy. CSP allowed the expected Supabase host. The `/privacy` route was checked for those headers too in [run 39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712).
- [x] Post-correction database checks confirm the anonymous role receives zero rows from `subject_lessons` and `practice_questions`; both tables still expose only published records through RLS.
- [x] Public UI/API check confirmed no draft questions or lessons are exposed; the latest Chromium smoke test also confirmed the published-only practice API returned zero question rows.
- [x] Re-run the production Chromium smoke suite after the 2026-10-18 publication-status correction and Privacy notice release: [run 39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712), 135/135 checks passed with zero failures.

- [ ] On a physical Android phone, test portrait/landscape, keyboard-only navigation, TalkBack, 200% text zoom, touch targets, all five catalog filters in combinations, no-results recovery, and direct-route refresh. Record device/browser and findings before launch.

## Educational content and pilot

- [x] The original eight questions have a separate historical pre-review. A first-pass AI-assisted math/choice-structure audit covered all 52 live question records on 2026-10-18. Database checks confirmed required fields, unique choices, and exactly one stored correct answer among choices for every record. No definite mismatch was identified in the first pass; this is not independent academic approval. See [Stage 1 audit](../reviews/2026-10-18-stage1-content-and-publication-audit.md).
- [ ] Identify a qualified human reviewer to independently review the 52 questions and 13 lessons before anything changes to `published`.
- [ ] Every proposed published question and lesson is checked for correctness, clear steps, source/attribution, originality, and permission to use. No lessons or questions are currently published.
- [x] Proposed measures and session procedure documented in the [controlled student pilot plan](../plans/2026-10-15-student-pilot-plan.md).
- [ ] Recruit volunteers and run the pilot only after blocking release checks and human review are complete.
- [x] Add the public [Privacy notice](https://cestudy.pages.dev/privacy) describing browsing, browser-local study history/progress, feedback and support confirmations, bug-report email drafts, and service providers. The current live site remains a no-account experience. The optional Google sign-in/Profile/streak feature is in draft [PR #44](https://github.com/justryan-n2d/CEStudy/pull/44); CI, Supabase migration/RLS tests, secret scan, and preview deploy passed, but Google OAuth setup and real sign-in/sign-out testing are still required before that feature can be merged.
- [x] A feedback/contact path and correction/removal process are ready: Contact, Feedback, and Report a bug are live; the [content authoring/publication policy](../content-authoring-and-publication.md) explains correction/removal, and the public [Privacy notice](https://cestudy.pages.dev/privacy) provides the contact route.
- [ ] Production promotion is explicitly approved only after all blocking items pass.
