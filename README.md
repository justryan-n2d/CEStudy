# CEStudy

**A low-cost Civil Engineering reviewer for students.**

CEStudy helps Civil Engineering students from first year through fourth year browse subjects, revisit prerequisite mathematics, and build toward a reliable practice library.

## Current status

**Live website:** [https://cestudy.pages.dev](https://cestudy.pages.dev), deployed on Cloudflare Pages. The old, failed legacy Cloudflare Worker named `cestudy` was removed; Pages remains the active frontend host.  
**Current phase:** Phase 7, pre-launch hardening and release gates. The core frontend, database integration, and initial deployment are complete. The broad student launch is not approved yet. Follow the [organized phase plan](docs/PHASE_PLAN.md) for the authoritative phase statuses and next steps.

The app has a 72-subject catalog, four year-level routes, subject detail pages, and a practice flow. Automated Chromium smoke test [run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289) passed **70/70 checks** against the live site. It verified the live Supabase connection and publishable key, security response headers, six direct routes, 320 px and 1440 px layouts, no captured browser errors, the CHED PDF link, and an empty published-practice set. GitHub Actions also passed lint, unit tests, dependency audit, build and isolated Supabase migration/RLS tests [in run 38627053630](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053630). Full-history Gitleaks scan passed [in run 38627053653](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053653).

**Release status:** The deployed web MVP is passing its current automated technical smoke checks, but CEStudy is **not ready for a broad student launch yet**. The repository stays public by decision because the eight original draft questions are non-sensitive and their exposure is accepted. Future unpublished question text must stay in the CEStudy Supabase database and must never be added to public source, seed files, docs, tests, artifacts, or logs. The current public seed contains catalog metadata only, and CI checks this rule. Cloudflare Pages remains configured for this public repository; verify the production deployment after this policy change. A managed-Supabase-target restore check, B2 lifecycle cleanup, GitHub failure-email verification, human content approval, branch protection, and the controlled student pilot remain release gates. The encrypted weekly Backblaze backup workflow has completed a successful live run: [38773249088](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088). The encrypted archive, checksum, and verification marker were read back successfully, with one verified backup set retained. The real encrypted backup has now been decrypted and restored into isolated local PostgreSQL 18.2 in Termux; 72 catalog rows, eight unpublished questions, RLS policies, and client write restrictions passed validation. A restore into a separate managed Supabase project remains untested. See [restore-drill evidence](docs/deployment/restore-drill-2026-10-16.md). B2 lifecycle cleanup and GitHub failure email settings also need confirmation. Human content sign-off, branch protection, and the student pilot are also pending. See [weekly backup setup](docs/deployment/weekly-backups.md), [current project status](docs/PROJECT_STATUS.md), [pre-launch checklist](docs/deployment/launch-checklist.md), [repository privacy guide](docs/deployment/github-privacy-and-branch-protection.md), and [roadmap](docs/ROADMAP.md).

### Feedback inbox and contact rollout (2026-10-18)

The responsive redesign and anonymous feedback inbox have been merged into `main`.

- [PR #18](https://github.com/justryan-n2d/CEStudy/pull/18) merged the white/blue responsive UI, configurable hero photo with centered transparent master logo, animated menu/dialogs, the slightly darker footer, About Us, distinct Contact/Support/Bug Reports/Feedback pages, and the owner-only `/feedbacks` inbox.
- [PR #19](https://github.com/justryan-n2d/CEStudy/pull/19) fixed Cloudflare Pages commit-preview origin handling. Feedback/support endpoints accept the production URL, the stable redesign branch URL, explicitly configured origins, and only HTTPS eight-hex commit-preview hosts under `cestudy.pages.dev`. Unrelated or lookalike Pages domains are not allowed.
- The live Supabase project reports `submit-public-message` ACTIVE at version 2 and `feedback-inbox-admin` ACTIVE at version 3. The owner feedback management migration is applied as remote version `20261017224950`; its repository filename matches that recorded version to keep future migration checks aligned.
- A privileged live database check confirmed that anonymous/authenticated roles cannot directly read or insert feedback, RLS is enabled, and anon cannot call the private rate-limit RPC. The database contains submissions from earlier attempts despite the form having shown errors; message bodies and IDs are deliberately omitted from repository docs.
- The `l.clone is not a function` error was fixed by checking that a Supabase error context supports `clone()` and `json()` before parsing it. Email notification is best-effort for feedback; successful private storage is the delivery condition. Support confirmation email still requires a verified Resend sender/API key.
- The owner reported that `FEEDBACK_INBOX_ACCESS_KEY` was configured in Supabase Edge Function secrets. The value is never stored in source control, browser variables, logs, or this repository.
- [PR #22](https://github.com/justryan-n2d/CEStudy/pull/22) adds immediate unread-count refresh after successful feedback submission in the same tab, a 15-second refresh while the owner inbox is unlocked, focus/visibility refresh, and the red unread dot on the mobile **More** menu button.
- Each owner inbox card now has a three-dot menu. **Pin/Unpin** persists the `is_pinned` field in Supabase and pinned messages sort before other messages; unpinning restores chronological order. **Delete** asks for confirmation and permanently deletes the database row through the signed owner-only Edge Function.
- Live SQL verification after the migration confirmed that RLS is enabled, anon/authenticated roles have no direct SELECT/INSERT/UPDATE/DELETE privileges on feedback, and `service_role` can delete. The Edge Function is active at version 3. [PR CI passed](https://github.com/justryan-n2d/CEStudy/actions/runs/39076019540) and the [secret scan passed](https://github.com/justryan-n2d/CEStudy/actions/runs/39076019549).
- CI covers unread indicators, pin/unpin ordering, delete handling, and database grants. A manual owner-key check of the production UI and latest Cloudflare Pages bundle is still a release verification item; do not treat automated tests as a live end-to-end owner-session test.

**Verification:** [CI passed](https://github.com/justryan-n2d/CEStudy/actions/runs/39069346430) · [Secret scan passed](https://github.com/justryan-n2d/CEStudy/actions/runs/39069346426) · [Live website smoke test passed](https://github.com/justryan-n2d/CEStudy/actions/runs/39069495822).

Post-PR #19 Supabase function logs later showed an accepted `OPTIONS 200` and two `POST 200` responses, with three feedback rows present at the database check. That verifies endpoint acceptance, not the complete owner UI sequence. The existing browser smoke suite does not test the full feedback success dialog and owner-key unlock/red-dot flow; those steps remain on the [manual live verification checklist](docs/deployment/feedback-inbox-rollout-2026-10-18.md). UI errors do not prove a message was unsaved; check the owner inbox before retrying to avoid duplicates.

## Deployment and smoke-test record (2026-10-15)

- **Live URL:** [https://cestudy.pages.dev](https://cestudy.pages.dev)
- **Hosting:** Cloudflare Pages connected to `justryan-n2d/CEStudy`; production branch `main`, build command `npm run build`, output directory `dist`.
- **Live browser check:** [Run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289), Chromium, 70/70 checks passed. Six routes returned HTTP 200. Responses had CSP, `X-Content-Type-Options`, `X-Frame-Options`, Referrer Policy, and Permissions Policy. The catalog loaded 72 rows from the dedicated CEStudy Supabase host with an `sb_publishable_` key; no privileged key was detected.
- **Responsive and runtime checks:** no horizontal overflow at 320 px or 1440 px and no browser console, page, request or same-origin HTTP errors in the run.
- **Practice privacy:** public API request is filtered to published items and returns zero rows; deployed UI shows the review gate. Independent RLS queries confirm `anon` and `authenticated` users cannot see any of the eight unpublished questions.
- **CHED source:** the rendered CMO No. 92, s. 2017 Civil Engineering PDF link returned HTTP 200 with `application/pdf`.
- **Still to do before a student launch:** full accessibility and physical-device review, GitHub branch-protection confirmation, decrypting and restoring the real backup into an isolated test database, human approval of all practice questions, and a controlled student pilot with recorded feedback.

## Product boundaries

- Free-first, responsive web app designed for mobile screens.
- Four year levels, Mathematics Foundations and Refreshers, and five specialization areas.
- CHED placements are reference examples and may differ by university.
- No student-facing AI tutor, AI-generated questions, live AI API calls, student accounts, public academic-content submissions, or cross-device progress in the MVP. Published lesson completion may be stored locally in the current browser; it is not sent to the server or synced. Anonymous private feedback and support-confirmation forms are implemented.
- Only deliberately published questions are returned to public clients.
- No question is marked verified merely because it was generated or seeded.

## Technology

- React + TypeScript + Vite + Tailwind CSS
- Cloudflare Pages hosting
- Supabase PostgreSQL with explicit grants and Row Level Security
- GitHub for source control, tests, and CI

The locked product direction is documented in the [combined learning model decision](docs/product/COMBINED_LEARNING_MODEL.md): CEStudy combines free browsing, optional guided learning, and personal progress. The first progress increment is local to the browser and supports published lessons only. Start with the [organized phase plan](docs/PHASE_PLAN.md) for the current phase, detailed statuses, and ordered route to launch. See the docs folder for project scope, security requirements, catalog design, architecture decisions, development workflow, Supabase setup, Cloudflare Pages deployment, [question-content protection](docs/content-authoring-and-publication.md), and release checklists.

## Local development

Requirements: Node.js 22.12+ and npm.

1. Install the exact dependency versions with `npm ci` (the lockfile is committed).
2. Start the development server using `npm run dev`.
3. Run `npm run lint`, `npm run test -- --run`, and `npm run build` before sharing changes.

## Supabase setup

The dedicated remote CEStudy Supabase project has been created and the migration/seed have been applied. Cloudflare Pages has been configured with the browser build variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the deployed website. For local development, use the local Supabase workflow described in [the setup guide](docs/deployment/supabase-setup.md). Never share credentials in chat or commit them. Only a publishable key belongs in browser code; never use a secret/service-role key or database password in a `VITE_*` variable.

The migrations grant only SELECT to anon and authenticated roles for the catalog and practice tables. RLS exposes catalog entries and only practice rows whose status is published. Public write grants and policies are absent. Default privileges for objects created by the normal `postgres` migration role are hardened so future public tables, sequences, and functions do not automatically grant rights to client roles or `PUBLIC`.

## Content review gate

Actual unpublished question text is authored directly in the dedicated CEStudy Supabase database with status `needs-review`, not committed to this public repository. The public `supabase/seed.sql` seeds subject catalog metadata only. A human reviewer must check each prompt, option, correct answer, solution step, explanation, math, originality, and attribution. Only an authorized maintainer may change an approved question to `published`. See [unpublished question authoring and publication](docs/content-authoring-and-publication.md).

## License

No open-source license has been added. Do not assume the source code is licensed for reuse.
