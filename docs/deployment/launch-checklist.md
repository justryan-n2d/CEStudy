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
- [x] Backup/recovery procedure documented in [backup and recovery plan](backup-and-recovery.md).\n- [ ] Create a real private off-site export, test restoring it to a separate temporary project, and record verification before adding mutable student data or submissions.
- [ ] Verify directly in Cloudflare Pages settings that the browser build uses only the CEStudy URL and publishable key, never a secret/service-role key.

## Cloudflare Pages deployment

- [x] GitHub repository linked to Pages; build command is `npm run build`, output directory is `dist`.
- [x] Pages preview deployment succeeded in CI; `public/_redirects` and `public/_headers` are included in the production build.
- [ ] Verify the live site's network requests reach the dedicated CEStudy Supabase URL (not just the bundled catalog fallback).
- [ ] Mobile 320 px and desktop views checked.
- [ ] Direct links and refreshes are checked across the app routes (key routes have been user-tested on mobile; full route-by-route sweep remains).
- [ ] Catalog search/filter empty states and CHED links checked in the live browser. The catalog's CHED PDF URL matches the link on the [official CHED 2017 memorandum archive](https://legacy.ched.gov.ph/2017-ched-memorandum-orders/), but the deployed click-through still needs a browser test.
- [ ] Browser console/network checks show no unexpected errors.
- [ ] Live Cloudflare Pages response headers are present and Content Security Policy causes no required-resource violations.
- [ ] Practice review gate verified in the deployed UI as well as database policy tests; no unpublished questions are leaked.

## Educational content and pilot

- [x] Mathematical pre-review completed for all eight seeded questions with no answer/step mismatch found; see [review record](../reviews/2026-10-15-basic-algebra-draft-review.md). This does not replace human approval. All eight stay unpublished.\n- [ ] Human content reviewer identified and all questions independently approved before any status changes to `published`.
- [ ] Every published question is checked for correctness, clear steps, source/attribution, and permission to use. No questions are currently published.
- [x] Proposed measures and session procedure documented in the [controlled student pilot plan](../plans/2026-10-15-student-pilot-plan.md).\n- [ ] Recruit volunteers and run the pilot only after blocking release checks and human review are complete.
- [ ] A feedback/contact path and correction/removal process are ready.
- [ ] Production promotion is explicitly approved only after all blocking items pass.
