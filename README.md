# CEStudy

**A low-cost Civil Engineering reviewer for students.**

CEStudy helps Civil Engineering students from first year through fourth year browse subjects, revisit prerequisite mathematics, and build toward a reliable practice library.

## Current status

**Production website:** [https://cestudy.pages.dev](https://cestudy.pages.dev), hosted on Cloudflare Pages from `main`. The verified `main` commit is `887b3f5a0b826ac0019f266de5e53fd6278958d3` (2026-10-23). The latest recorded production Chromium smoke check for this commit passed on 2026-10-25: [run 40240604028](https://github.com/justryan-n2d/CEStudy/actions/runs/40240604028).

**Current phase:** Phase 7, pre-launch hardening and release gates. CEStudy is **not approved for broad student launch**. The shared theme foundation and canonical public navigation are already implemented on `main`; this does not close outstanding design review, content approval, discovery/pilot documentation, security/recovery tasks, or release checks.

### Implemented on `main`

- Searchable subject catalog, year-level overview and four year-level routes, subject detail pages, publication-gated lesson and practice screens, Mathematics Foundations, browser-local lesson completion/progress, contact/support/feedback flows, an owner-only content-review page, and a public [Privacy notice](https://cestudy.pages.dev/privacy).
- Canonical hybrid website navigation: Year Levels dropdown, Review Materials Hub mega-menu, direct Mock Exam Portal and Community Forum links, an explicit Light/Dark toggle with Light as the default, the existing four-item mobile quick-navigation bar, and a More menu.
- Theme preference is stored in this browser under `cestudy:theme:v1`. Light and Dark are the only choices; there is no System option.

### Existing destinations that are still placeholders

- `/review-materials` lists Formula Sheets, Problem Sets with Solutions, and Video Tutorials as **not available yet**. No downloads are offered.
- `/mock-exam-portal` is a navigation placeholder. It has no mock-exam session, timer, result summary, or readiness score.
- `/community` is a launch placeholder. Posting, replies, editing, reporting, and moderation are not available.
- A signed-in Student Dashboard and account navigation are not implemented on current `main`.

### PR #67 integration candidate, not production

[PR #67](https://github.com/justryan-n2d/CEStudy/pull/67) remains open and in draft on `feat/local-history-streak-2026-10-23b`, based on `main` at `887b3f5a0b826ac0019f266de5e53fd6278958d3`. The latest code/test head before this documentation update is `07742fcdb24ad34c45aedf80d043d188f75207d6`. It includes Google OAuth through Supabase Auth PKCE, session restoration/refresh, safe return paths, callback recovery/retry feedback, profile/sign-out, and device-local history, completion progress and streaks. These remain candidate-branch features, not shipped `main` capabilities.

The code/test head passed all four GitHub checks: [CI including lint/tests/build and Supabase migration/RLS, run 40350532538](https://github.com/justryan-n2d/CEStudy/actions/runs/40350532538), [full-history secret scan, run 40350533886](https://github.com/justryan-n2d/CEStudy/actions/runs/40350533886), and [Cloudflare Pages preview check](https://github.com/justryan-n2d/CEStudy/runs/121669500753). CI reported 35 test files passed, including the new legacy-completion migration tests, and successful migration/RLS tests. The dependency audit also reported two moderate Vitest/@vitest-mocker advisories; `npm audit --audit-level=high` did not fail because these were below its configured threshold. Review the advisories before merge rather than treating the dependency audit as clean. No independent review is recorded. Real Google cancellation/recovery, controlled PKCE failure-then-retry, and exact preview redirect-configuration checks remain outstanding.

### Learning-content readiness

A read-only SQL query on **2026-10-26** confirmed 72 catalog subjects, 52 practice questions, and 13 lessons. All 52 questions and all 13 lessons are `needs-review`, with zero published questions and zero published lessons. This verified counts and status only; it did not review lesson/question content or authorize publication. Public access must continue to expose only deliberately published learning content. A qualified human reviewer must approve content before publication.

### Release decision

CEStudy is not approved for broad student launch. Remaining gates include human academic review and publication approval, an isolated managed-Supabase restore after the content correction, Backblaze lifecycle and GitHub failure-notification confirmation, physical-device and accessibility QA, complete responsive/keyboard/search-filter verification, and a controlled student pilot with recorded outcomes. The October 25 encrypted-backup log confirms all three required tables, archive upload and SHA-256 read-back verification, and retention of four verified backups; a managed-Supabase restore remains required. PR #67 must stay draft until independent review, fresh checks on the final head, real-preview Google cancellation/recovery and controlled PKCE failure-then-retry, exact preview redirect configuration review, account-scope display/clear behavior, review of two moderate dependency advisories, and review-thread resolution are complete. The candidate keeps history and completion data in separate localStorage keys for guest mode and each signed-in user, but this is not server-side isolation or cross-device sync.

Do not change production OAuth settings, production data or schema, publish draft content, deploy to production, or merge PR #67 as part of documentation reconciliation. See the [current project status](docs/PROJECT_STATUS.md), [canonical roadmap](docs/MASTER_ROADMAP_FOR_CESTUDY.md), [organized phase plan](docs/PHASE_PLAN.md), [backup/recovery plan](docs/deployment/backup-and-recovery.md), and [pre-launch checklist](docs/deployment/launch-checklist.md).

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

## Deployment and verification evidence

The current `main` baseline is `887b3f5a0b826ac0019f266de5e53fd6278958d3`. GitHub CI/Supabase migration-RLS checks [39884056913](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056913) and full-history Gitleaks [39884056672](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056672) show success for this SHA. The latest recorded production Chromium check for the same SHA passed on 2026-10-25 in [run 40240604028](https://github.com/justryan-n2d/CEStudy/actions/runs/40240604028). The encrypted backup workflow completed successfully on 2026-10-25 in [run 40172509628](https://github.com/justryan-n2d/CEStudy/actions/runs/40172509628). These are GitHub-hosted records, not commands run locally during this documentation task.

- **Live URL:** [https://cestudy.pages.dev](https://cestudy.pages.dev)
- **Hosting:** Cloudflare Pages connected to `justryan-n2d/CEStudy`; production branch `main`, build command `npm run build`, output directory `dist`.
- **Production browser verification:** the 2026-10-25 Chromium check is successful for the current main SHA. It does not replace manual physical-device, assistive-technology, keyboard, or broad responsive QA.
- **Publication and access:** the last recorded read-only database audit on 2026-10-19 showed 52 practice questions and 13 lessons in `needs-review`, with zero published. That content state was not freshly inspected for this update. Lesson and practice access must continue to respect publication status.
- **Recovery:** the backup workflow check passed on 2026-10-25, but an isolated managed-Supabase restore after the latest live content correction remains a separate required gate.
- **Still required before launch:** managed-Supabase restore verification, Backblaze lifecycle and GitHub failure-notification confirmation, protected recovery-key copies, physical-device/accessibility and search-filter QA, human approval of lessons/questions, and the controlled student pilot. OAuth configuration and end-to-end verification are additionally required before PR #67 can be released if the account feature remains in scope. Main-branch CI success alone does not establish launch readiness.

## Product boundaries

- Free-first, responsive web app for Civil Engineering learning, with four year levels, Mathematics Foundations and Refreshers, and five specialization areas.
- Current production `main` does not ship student account routes or a signed-in Student Dashboard. Google auth/profile/history/streak are unmerged candidate features in [PR #67](https://github.com/justryan-n2d/CEStudy/pull/67), not production capabilities.
- In PR #67, guest history/completion and each signed-in user's history/completion use separate versioned browser-local storage keys; streak days are also keyed by user ID. This does not sync across devices and is not a server-side security boundary. Because production `main` had no student accounts, legacy v1 completion records migrate to the guest key on the canonical production hostname only, keeping the newest completion per lesson. Ambiguous preview-origin v1 completion records and legacy unscoped history/streak records remain unassigned and are not migrated.
- No student-facing AI tutor, AI-generated questions, live AI API calls, public academic-content submissions, or cross-device progress.
- Only deliberately published questions and lessons should be exposed to student clients.
- No question or lesson is approved merely because it was authored, generated, seeded, or passed automated checks.

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
