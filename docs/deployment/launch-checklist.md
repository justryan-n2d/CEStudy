# CEStudy pre-launch checklist

Do not announce or open CEStudy broadly to student users until each blocking item is checked and evidence is recorded.

## Dependency and build

- [x] `package-lock.json` is committed and `npm ci` succeeds.
- [x] GitHub Actions lint, tests, frontend build, dependency audit, and Supabase database security tests passed on the latest main commit in [run 38623258999](https://github.com/justryan-n2d/CEStudy/actions/runs/38623258999).
- [x] `npm audit --audit-level=high` reports no high or critical dependency vulnerabilities; the successful audit reported 0 vulnerabilities after upgrading Vitest to 4.1.11.
- [x] Review `.gitignore` and current source-code search results: `.env` files, key files, `secrets/`, and `credentials/` are excluded, and searches found no common Supabase service-role key or database-URL patterns.
- [x] Full-history Gitleaks scan passed on the first run: [workflow run 38624711552](https://github.com/justryan-n2d/CEStudy/actions/runs/38624711552). The scheduled workflow lives at [secret-scan.yml](../../.github/workflows/secret-scan.yml) and also runs on pushes, pull requests, and manual dispatch.
- [ ] In GitHub repository settings, verify whether `main` requires pull requests and passing CI status checks before merge. The current repository connection could not inspect branch-protection settings.

## Supabase

- [x] Dedicated CEStudy Supabase project and correct project reference confirmed.
- [x] Migrations applied without resetting or damaging a shared/production database.
- [x] RLS enabled and grants reviewed on every exposed table.
- [x] Anonymous catalog reads work; the two app tables grant client roles SELECT only.
- [x] Questions requiring review remain hidden; all eight remote questions remain `needs-review`, with zero published.
- [x] Anonymous and authenticated write attempts are denied in isolated database security tests.
- [x] Supabase security advisor reviewed; no security lint findings. Default-privilege hardening is applied for new objects created by the standard `postgres` migration owner.
- [x] Recovery method for the current seeded-only database is documented in [remote Supabase verification](2026-10-15-remote-supabase-verification.md); schema and baseline data are source-controlled and rebuilt by the isolated CI setup.
- [x] Backup/recovery procedure documented in [backup and recovery plan](backup-and-recovery.md).
- [ ] Create a real private off-site export, test restoring it to a separate temporary project, and record verification before adding mutable student data or submissions.
- [x] Live Chromium network capture confirmed the deployed browser requests use `qqmdwltfgpqtcvdbcmto.supabase.co` and an `sb_publishable_` key; no privileged key was detected. See [live browser run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289).

## Cloudflare Pages deployment

- [x] GitHub repository linked to Pages; build command is `npm run build`, output directory is `dist`.
- [x] Pages preview deployment succeeded in CI; `public/_redirects` and `public/_headers` are included in the production build.
- [x] Live Chromium captured real catalog requests to the dedicated CEStudy Supabase URL; all returned HTTP 200 and the API returned 72 subjects. See [live browser run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289).
- [x] Chromium responsive checks at 320 px and 1440 px passed with no horizontal overflow. A separate physical-device and accessibility check remains advisable.
- [x] Fresh direct navigation to six routes returned HTTP 200 with the expected page heading: home, catalog, Year 2, math foundations, subject detail, and practice. See [live browser run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289).
- [x] The rendered catalog source link matches the [official CHED 2017 memorandum archive](https://legacy.ched.gov.ph/2017-ched-memorandum-orders/); the linked PDF returned HTTP 200 and `application/pdf` in Chromium. Catalog search/filters are user-reported as working, but a full automated matrix of search/filter empty states remains pending.
- [x] Live Chromium recorded no browser console, page, request, or same-origin HTTP errors. See [live browser run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289).
- [x] Live Pages responses included CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy; CSP allowed the expected Supabase host and no browser errors were observed. See [live browser run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289).
- [x] Deployed UI displays the review gate and no seed draft prompt; live API query filters to `status=published` and returns zero rows. SQL checks under `anon` and `authenticated` also returned zero unpublished questions. See [live browser run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289).

## Educational content and pilot

- [x] Mathematical pre-review completed for all eight seeded questions with no answer/step mismatch found; see [review record](../reviews/2026-10-15-basic-algebra-draft-review.md). This does not replace human approval. All eight stay unpublished.
- [ ] Human content reviewer identified and all questions independently approved before any status changes to `published`.
- [ ] Every published question is checked for correctness, clear steps, source/attribution, and permission to use. No questions are currently published.
- [x] Proposed measures and session procedure documented in the [controlled student pilot plan](../plans/2026-10-15-student-pilot-plan.md).
- [ ] Recruit volunteers and run the pilot only after blocking release checks and human review are complete.
- [ ] A feedback/contact path and correction/removal process are ready.
- [ ] Production promotion is explicitly approved only after all blocking items pass.
