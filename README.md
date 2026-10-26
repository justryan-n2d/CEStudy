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

[PR #67](https://github.com/justryan-n2d/CEStudy/pull/67) remains open and in draft on `feat/local-history-streak-2026-10-23b`, based on `main` at `887b3f5a0b826ac0019f266de5e53fd6278958d3`. The code/test head immediately before this documentation-only update was `0781c4b6caa09717442c794e757ccda980c35a0c`; the branch now also contains the documentation reconciliation. Its scope includes Google OAuth through Supabase Auth PKCE, session restoration/refresh, safe return paths, callback recovery/retry feedback, profile and sign-out, device-local opened-lesson history and completion progress, and streak days keyed to the signed-in user's ID. These are candidate-branch features, not shipped `main` features.

The four GitHub checks attached to the pre-documentation code/test head showed success on 2026-10-23, including CI, Supabase migration/RLS, full-history Gitleaks, and Cloudflare Pages preview deployment. Those results do not validate the documentation-only update; use the PR's latest head and check runs for current results. No independent review is recorded. Real-preview OAuth/configuration checks and the account-switching/data-isolation review remain outstanding.

### Learning-content readiness

The last recorded read-only live database audit, dated **2026-10-19**, reported 72 catalog subjects, 52 practice questions, and 13 lessons. All 52 questions and all 13 lessons were `needs-review`, with zero published questions and zero published lessons. These figures are **the last recorded audit, not a fresh database check for this documentation update**. Public access must continue to expose only deliberately published learning content. A qualified human reviewer must approve content before publication.

### Release decision

CEStudy is not approved for broad student launch. Remaining gates include human academic review and publication approval, an isolated managed-Supabase restore after the content correction, Backblaze lifecycle and GitHub failure-notification confirmation, physical-device and accessibility QA, complete responsive/keyboard/search-filter verification, and a controlled student pilot with recorded outcomes. The latest encrypted backup workflow passed on 2026-10-25; that automated backup result does not replace the managed-Supabase restore. If account integration remains in scope, PR #67 must stay draft until independent review, fresh checks on its final head, real-preview Google cancellation and PKCE failure/retry checks, preview redirect configuration review, an explicit account-switching/data-isolation decision, and review-thread resolution are complete.

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
- Lesson completion and opened-lesson history are browser-local, not server-synced. In PR #67, streak days are keyed by Supabase user ID, but opened-lesson history and completed-lesson records use browser-wide keys shared across accounts on the same device. Cross-account visibility/account switching remains a release-review question.
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
