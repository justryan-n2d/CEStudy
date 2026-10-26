# CEStudy project status

**Last updated:** 2026-10-26

**Current workstream:** Canonical roadmap-led UX integration, with PR #67 as the single main-targeted account-integration candidate.

**Operational release phase:** **Phase 7, pre-launch hardening and release gates.**

**Release status:** CEStudy is **not approved for a broad student launch**. A read-only SQL query on 2026-10-26 confirmed 72 catalog subjects, 52 practice questions and 13 lessons; all 52 questions and all 13 lessons are `needs-review`, with zero published rows. Counts/status were verified; lesson/question content has not received independent academic approval.

**Production website:** [https://cestudy.pages.dev](https://cestudy.pages.dev)

**Current `main` SHA:** `887b3f5a0b826ac0019f266de5e53fd6278958d3`

**PR #67 code/test head before this docs-only update:** `8c942711c40019758682b70599fccc2aa7c69807` on `feat/local-history-streak-2026-10-23b`, based on `main` at the SHA above. All four GitHub checks passed on this code/test head; the docs-only update needs fresh checks.

## Current main implementation baseline

The shared Light/Dark theme foundation is already merged on `main`: the Light/Dark toggle uses Light as the default/fallback, the device-local key is `cestudy:theme:v1`, and `public/theme-init.js` applies the saved preference before React renders. There is no System option.

The canonical hybrid public navigation is already merged on `main`: a Year Levels dropdown, Review Materials Hub mega-menu, direct Mock Exam Portal and Community Forum destinations, the existing four-item mobile quick-navigation bar, and a More menu. The navigation shell and routes must not be described as wholly unimplemented. However, `/review-materials` marks Formula Sheets, Problem Sets with Solutions and Video Tutorials unavailable; `/mock-exam-portal` has no exam session, timer, result summary or readiness score; and `/community` is a launch placeholder with no posting, replies, editing, reporting or moderation. A signed-in Student Dashboard and account navigation are not implemented on main.

The candidate-only `/login`, `/profile`, `/history`, and `/streak` routes and Google-authenticated profile/session behavior are on PR #67, not production `main`. Candidate code separates guest history/completions from each signed-in user's history/completions using versioned localStorage keys; streak days are also keyed by user ID. This is browser-local scope separation, not server-side security or cross-device sync. Legacy unscoped v1 history/completion records are ignored rather than assigned to an account. Independent review and real-preview account-switching tests remain required before release.

## Canonical roadmap and integration sequence

- **Canonical product direction:** [MASTER_ROADMAP_FOR_CESTUDY.md](MASTER_ROADMAP_FOR_CESTUDY.md) is the source of truth for Blueprint Academy, design direction, scope, sequencing, acceptance criteria, and release gates. Actual source code and current security/workflow results determine implementation status.
- **Stage 0, Gitleaks security gate:** PR #59 merged on 2026-10-23 after CI, PR-diff scanning and full-history Gitleaks succeeded. This completed that secret-scanning gate only; it did not complete all Phase 0 or Phase 7 work.
- **Stage 1, theme foundation:** PR #56 merged on 2026-10-23. Main has the explicit Light/Dark toggle, Light default/fallback, device-local `cestudy:theme:v1`, and early theme initialization. Phase 1 remains **current**, not complete, pending independent review and manual preview/accessibility checks.
- **Stage 2, hybrid public navigation:** PR #57 merged on 2026-10-23. Main has the canonical Year Levels dropdown, Review Materials mega-menu, direct Mock Exam Portal and Community Forum links, four-item mobile quick navigation, and More menu. The Review Materials, Mock Exam and Community destinations are placeholders for their full workflows. Phase 2 remains **current**, not complete, pending independent review/manual preview and responsive/accessibility follow-up.
- **Main CI evidence:** current main SHA `887b3f5a0b826ac0019f266de5e53fd6278958d3` has successful recorded CI/Supabase migration-RLS checks [39884056913](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056913) and full-history Gitleaks [39884056672](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056672). Production Chromium [40240604028](https://github.com/justryan-n2d/CEStudy/actions/runs/40240604028) passed on 2026-10-25 for that main SHA. Encrypted backup workflow [40172509628](https://github.com/justryan-n2d/CEStudy/actions/runs/40172509628) passed on 2026-10-25; managed-Supabase restore after the content correction remains required.
- **Current PR #67 candidate:** live metadata confirms open, draft, unmerged, branch `feat/local-history-streak-2026-10-23b`, based on `main` at `887b3f5a0b826ac0019f266de5e53fd6278958d3`. Code/test head `8c942711c40019758682b70599fccc2aa7c69807` passed all four attached checks. No review submissions, requested reviewers, review comments or review threads were recorded at the last metadata check. Keep the PR draft; a mergeable flag is not approval.
- **Current PR #67 code/test checks:** all four checks attached to `8c942711c40019758682b70599fccc2aa7c69807` passed: [CI including lint/tests/build and Supabase migration/RLS, run 40269399491](https://github.com/justryan-n2d/CEStudy/actions/runs/40269399491), [full-history secret scan, run 40269399468](https://github.com/justryan-n2d/CEStudy/actions/runs/40269399468), and [Cloudflare Pages check](https://github.com/justryan-n2d/CEStudy/runs/121398826175). CI reported 35 test files passed and migration/RLS tests passed. Preview deployment succeeded at [commit preview](https://06358ebf.cestudy.pages.dev) and [branch preview](https://feat-local-history-streak-20-4d7n.cestudy.pages.dev). The dependency audit reported two moderate Vitest/@vitest-mocker advisories; it did not fail because the command is `npm audit --audit-level=high`. These results are for the pre-documentation code/test head and do not validate this docs commit.
- **Historical account branches:** PR #44 is the legacy overlapping account implementation with a competing UI shell. PR #64 is the auth/session/profile source slice, and PR #65/#66 are older dependent history/streak drafts. Their current states are in the table below. Do not merge, close, retarget or otherwise change older PRs as part of this task.
- **Manual OAuth and account-data release gates:** real Google cancellation/recovery in the latest preview, a controlled PKCE token-exchange failure followed by a successful retry, and the exact preview redirect allow-lists in Google Auth Platform and Supabase are **NOT VERIFIED**. Follow the [manual verification runbook](reviews/2026-10-26-pr67-preview-and-launch-verification.md). Do not change production OAuth settings to accommodate a preview. The code/test candidate now scopes history/completions per guest/account and includes regression tests; verify sign-in, sign-out, account switching, clearing only the active scope, and no stale account data appearing. Local storage remains browser-profile data, not server-side security. Direct interactive preview testing was not possible in this environment; the local clone attempt failed because DNS could not resolve `github.com`.
- **Release restriction:** no production deployment, production OAuth/configuration change, database schema/RLS/data change, unpublished-content publication, or weakening of security controls is authorized. Passing automated checks does not approve broad launch.

## Completed integration gates (verified 2026-10-23)

- PR #58 merged the canonical roadmap/status reconciliation. The roadmap is on `main`, the first-release theme preference is recorded as device-local, and the status tracker now reflects the staged integration order.
- PR #59 merged the corrected Gitleaks allowlist and PR full-history scan. The full-history job scanned 1,014 commits and reported no leaks. PR #47 is closed as superseded.
- PR #51 merged the supporting IA, gamified UX, and design-system documents after reconciliation with this roadmap.
- PR #56 merged the shared theme foundation after the dark-mode regression fix and fresh CI/secret-scan verification. The Phase 1 tracker remains current pending independent review/manual external preview inspection.
- PR #57 merged the hybrid public navigation after fresh CI, full-history secret scan, Supabase migration/RLS checks, backup checks, and 1,682/1,682 Chromium assertions. PR #54 is closed as superseded.

## Current pull-request state (verified 2026-10-26)

| PR | Current role | Live state and required handling |
|---|---|---|
| [#44](https://github.com/justryan-n2d/CEStudy/pull/44) | Legacy overlapping account implementation and competing UI shell | Open, draft, unmerged, not mergeable. Head branch `feature/google-auth-streak-gate-rebased`, SHA `662e413601cef93100534b8be52f1a76fe35b335`; recorded base SHA `e6f657cbbf94467e427fc6183c9714e965098598`. Do not merge wholesale or modify its state. |
| [#64](https://github.com/justryan-n2d/CEStudy/pull/64) | Auth/session/profile source slice consolidated into #67 | Open, draft, unmerged, mergeable. Head `feat/google-auth-session-profile-2026-10-23` at `69cabc3ceb8872163a41202e8e18be72b59e7f5e`, base `main` at `887b3f5a0b826ac0019f266de5e53fd6278958d3`. Do not merge separately or close as superseded without authorization. Prior checks are historical for this slice. |
| [#65](https://github.com/justryan-n2d/CEStudy/pull/65) | Older dependent history/streak slice | Open, draft, unmerged, not mergeable. Head `feat/student-learning-history-streak-2026-10-23` at `af3457b6538f34b8c6cd8910439b531ee61f6843`, stacked on #64 branch SHA `854f6c68bf0eb068df6a5f10e9229fecc588b74a`. Do not merge or close as part of this task. |
| [#66](https://github.com/justryan-n2d/CEStudy/pull/66) | Older dependent/alternate history-streak slice | Open, draft, unmerged, not mergeable. Head `feat/learning-history-streak-2026-10-23` at `9c4a310728abc503e13b8851679f322cd510c845`, stacked on #64 branch SHA `854f6c68bf0eb068df6a5f10e9229fecc588b74a`. Do not merge or close as part of this task. |
| [#67](https://github.com/justryan-n2d/CEStudy/pull/67) | Single main-targeted account integration candidate | Open, draft, unmerged, mergeable at the last metadata read. Base `main` SHA `887b3f5a0b826ac0019f266de5e53fd6278958d3`; head branch `feat/local-history-streak-2026-10-23b`. Code/test head `8c942711c40019758682b70599fccc2aa7c69807` passed all four checks, but that does not validate this docs-only update. No independent review or requested reviewers were recorded. |

**PR #67 preview evidence:** the pre-documentation code/test head had a successful Pages deployment, with commit preview [50585177.cestudy.pages.dev](https://50585177.cestudy.pages.dev) and branch preview [feat-local-history-streak-20-4d7n.cestudy.pages.dev](https://feat-local-history-streak-20-4d7n.cestudy.pages.dev). Automated deployment success does not prove that real OAuth works at the chosen origin. Verify the exact preview-origin redirect allow-lists without changing production settings.

**Merge restriction:** no merge in this task. Before a later merge, recheck the current base/head SHAs, comparison/conflicts, final-head CI and full-history Gitleaks, independent review, review threads, preview OAuth recovery, redirect configuration, and account-switching/data-isolation decision.

## Latest recorded production verification

- **Main baseline:** the live repository read for this task identifies `887b3f5a0b826ac0019f266de5e53fd6278958d3` as current `main`.
- **CI and security:** GitHub CI/Supabase migration-RLS checks [39884056913](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056913) and full-history Gitleaks [39884056672](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056672) show success for that main SHA.
- **Production browser:** live Chromium [40240604028](https://github.com/justryan-n2d/CEStudy/actions/runs/40240604028) passed on 2026-10-25 for the current main SHA. The task did not run the browser suite locally.
- **Backup:** [run 40172509628](https://github.com/justryan-n2d/CEStudy/actions/runs/40172509628) completed successfully on 2026-10-25. Its log verifies `public.catalog_subjects`, `public.practice_questions`, and `public.subject_lessons`, uploaded the encrypted archive and checksum, streamed the archive back for SHA-256 verification, retained four verified backups and hid three stale/incomplete artifacts. A managed-Supabase restore after the content correction remains untested.
- **Live content data:** read-only SQL on 2026-10-26 confirmed 72 subjects, 52 practice questions and 13 lessons; all questions and lessons are `needs-review`, with zero published. No content text was reviewed or published. Keep unpublished content unavailable until qualified human review and explicit publication.
- **Still open before launch:** isolated managed-Supabase restore after the correction, Backblaze lifecycle and GitHub failure-email confirmation, protected recovery-key copies, full accessibility and physical-device review, search/filter and direct-route state QA, independent human content approval, and a controlled student pilot. If PR #67 remains in scope, its separate OAuth/recovery, independent-review, current-head checks and account-switching/data-isolation gates also remain mandatory.

## Stage 1 release audit (2026-10-18)

- **Catalog:** 72 subjects.
- **Practice bank:** 52 records, all `needs-review`; 0 published.
- **Lesson bank:** 13 records, all `needs-review`; 0 published.
- **Publication correction:** two lesson rows whose source notes identified them as drafts were returned to `needs-review`. Review timestamps were cleared, an audit note was recorded in the private database, and Algebra Foundations was changed to `in-preparation`.
- **Live access check:** all six public/private data tables inspected have RLS enabled. The anonymous database role returned zero rows from `subject_lessons` and `practice_questions`; published-only read policies remain in place. The security advisor returned three informational no-policy findings for private tables that have no client grants, not actionable public-table policy gaps.
- **Question pre-review:** all 52 questions passed basic database integrity checks for nonempty required fields, unique options, and exactly one matching stored correct answer. A first-pass AI-assisted math/solution consistency check found no definite answer mismatch. This is not independent academic review. Do not publish any question or lesson until a qualified human records approval.
- **Current limitations:** At the time of the 2026-10-18 audit, a clean backup run using the corrected three-table verifier, a managed-Supabase recovery rehearsal, Backblaze lifecycle and GitHub failure-email settings, real-device accessibility, human content review, Google OAuth configuration and end-to-end verification for the account-integration candidate, and a 5–8 student pilot remained open. See the [Stage 1 audit record](reviews/2026-10-18-stage1-content-and-publication-audit.md).


## Product direction locked (2026-10-18)

CEStudy will combine free browsing of the engineering knowledge library with optional guided learning paths and personal progress tracking. The decision is recorded in [the combined learning model](product/COMBINED_LEARNING_MODEL.md) and reflected in [the roadmap](ROADMAP.md) and [phase plan](PHASE_PLAN.md).

The main-branch first progress increment lets visitors mark a published lesson complete and view/clear browser-local completion progress and activity. This is not the account-specific history/streak feature from PR #67, and meaningful student-facing lesson-progress use still waits for content approval because the last recorded audit showed zero published lessons. Unit tests cover duplicate completions, one activity day per calendar day, malformed local data, clearing progress and date handling. It adds no student accounts, server-side progress writes or cross-device sync. Because zero lessons are currently published, meaningful student-facing lesson-progress use must wait for Phase 8 content approval. Phase 7 release gates still apply; implementation does not approve a broad launch.


## Owner feedback management update (2026-10-18)

PR #22 is merged to main and adds:
- Immediate unread-count refresh after feedback submission in the same tab, on focus/visibility changes, and every 15 seconds while the private owner session is unlocked.
- The unread red dot on the mobile **More** menu button, in addition to the Feedbacks link.
- A three-dot menu on each owner inbox message with persistent Pin/Unpin and confirmed permanent Delete actions.
- Server-side ordering of pinned messages first, then newest-first for unpinned messages. Unpinning returns a message to its chronological position.
- Regression tests for the notification dot, pin/unpin, deletion, and same-session feedback submission.

**Live Supabase verification (project qqmdwltfgpqtcvdbcmto):** migration 20261017224950_feedback_inbox_management is applied; feedback_messages.is_pinned and its ordering index exist; RLS remains enabled; anon/authenticated have no direct SELECT, INSERT, UPDATE, or DELETE privileges on feedback_messages; service_role can delete; feedback-inbox-admin is ACTIVE at version 3. No client-facing policies or privileged browser key were added.

**Automated verification:** [PR CI passed](https://github.com/justryan-n2d/CEStudy/actions/runs/39076019540) including lint, unit tests, production build, and isolated Supabase migration/RLS tests; [secret scan passed](https://github.com/justryan-n2d/CEStudy/actions/runs/39076019549). The latest frontend still needs a manual owner-key smoke test on the live Cloudflare Pages site before the owner-only flow can be marked end-to-end verified.
## Feedback inbox rollout update (2026-10-18)

PR #18 (responsive redesign and private anonymous owner inbox) and PR #19 (Cloudflare Pages commit-preview origin handling) are merged to `main`.

- **Live frontend:** [https://cestudy.pages.dev](https://cestudy.pages.dev)
- **Supabase project:** `qqmdwltfgpqtcvdbcmto`
- **Live Edge Functions:** `submit-public-message` is ACTIVE at version 2; `feedback-inbox-admin` is ACTIVE at version 3. Both use `verify_jwt=false` for public-form/custom-owner-token handling; the admin function verifies its own signed owner token, and server-side validation and table grants/RLS remain required.
- **Remote migration history:** `20261014170630` `public_catalog_and_practice`, `20261014190554` `client_default_privileges_hardening`, `20261017204914` `private_public_messages`, and `20261017204934` `feedback_inbox_owner_auth`, and `20261017224950` `feedback_inbox_management`. Repository migration filenames are aligned to these applied remote versions to avoid future history drift.
- **Live security check:** RLS is enabled on private feedback/support tables. Anon/authenticated have no direct SELECT or INSERT privilege on `feedback_messages`; anon cannot execute the private rate-limit RPC. The owner inbox uses the server-side Edge Function rather than a client database query.
- **Owner access secret:** The owner reported `FEEDBACK_INBOX_ACCESS_KEY` configured in Supabase function secrets. Its value is not retrievable through this workflow and is not committed.
- **Troubleshooting:** `l.clone is not a function` was fixed by guarding Response methods in the frontend error handler. PR #19 allows only exact HTTPS eight-hex commit-preview hosts under `cestudy.pages.dev`. Earlier browser attempts have corresponding rows in the feedback table despite errors shown by the form; message bodies and IDs are omitted here. Check the inbox before retrying.
- **Post-fix endpoint evidence:** Supabase logs recorded `OPTIONS 200` and two `POST 200` responses from `submit-public-message` after PR #19, and the table held three feedback rows at inspection. Live grants still deny anon/authenticated direct reads and inserts. The owner-only unlock and red-dot-clearing flow remains unverified by automation; see the [detailed live verification record](deployment/feedback-inbox-rollout-2026-10-18.md#post-origin-fix-live-submission-check-2026-10-18-utc).
- **Email status:** Feedback email notification is optional/best-effort, with in-app unread state as primary. Support confirmation email needs verified Resend sender configuration.
- **Automated verification:** [main CI](https://github.com/justryan-n2d/CEStudy/actions/runs/39069346430), [secret scan](https://github.com/justryan-n2d/CEStudy/actions/runs/39069346426), and [live browser smoke test](https://github.com/justryan-n2d/CEStudy/actions/runs/39069495822) passed. The existing smoke suite does not itself assert feedback form success, owner unlock, or unread-dot clearing.

Detailed architecture, access model, checks, and manual checklist: [feedback inbox rollout record](deployment/feedback-inbox-rollout-2026-10-18.md).

## Release verification update (2026-10-15)

### Historical live browser verification (2026-10-17)

Automated Chromium smoke test [run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289) passed **70/70 checks** against the live Pages deployment.

- Six live routes loaded directly with HTTP 200 and the expected page heading: home, catalog, Year 2, Mathematics Foundations, Basic Algebra subject detail, and Basic Algebra practice.
- The live responses contained Content Security Policy, `X-Content-Type-Options`, `X-Frame-Options`, Referrer Policy, and Permissions Policy headers. The CSP includes the dedicated CEStudy Supabase host.
- At 320 px and 1440 px viewport widths, Chromium measured no horizontal overflow.
- Browser console, page, request, and same-origin HTTP error checks reported no errors.
- Actual network requests reached `qqmdwltfgpqtcvdbcmto.supabase.co`. Catalog requests returned HTTP 200 and all 72 catalog entries. Captured API key headers used the `sb_publishable_` prefix; no privileged/service-role key was detected in browser requests. Key material is not included in the logs.
- The practice API request used `status=eq.published`, returned HTTP 200 and zero rows at the time of that historical run. The practice screen displayed its review gate and did not show a seeded draft prompt. Newer post-correction evidence is available in [production smoke run 39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712).
- The rendered CHED CMO No. 92, s. 2017 link matched the official Civil Engineering PDF. The PDF returned HTTP 200 and `application/pdf`.

This is an automated Chromium run at 320 px and 1440 px, not a full accessibility audit or testing on every physical device/browser.

### Database access and privacy confirmed

- The dedicated Supabase project named CEStudy is `ACTIVE_HEALTHY`, with project ref `qqmdwltfgpqtcvdbcmto`.
- Live query after the Stage 1 audit confirmed 72 catalog subjects, 52 practice questions, and 13 lesson records. All 52 questions and all 13 lessons are `needs-review`; published count is zero for both content tables.
- The catalog, practice-question, and lesson tables have RLS enabled. Lesson and question SELECT policies expose only rows where `status = 'published'`; public client roles have no INSERT/UPDATE/DELETE grants.
- A post-audit query executed as `anon` returned 0 rows from `subject_lessons` and 0 rows from `practice_questions`. The public catalog continues to be readable.
- The Supabase security advisor returned three informational `RLS enabled, no policy` notices for private feedback/support tables with no client grants. All six inspected tables had RLS enabled, and the three content tables' published-only access was checked directly. Default-privilege hardening is applied for objects created through standard `postgres`-owned migrations.

### Secret scanning and dependency CI

- Full-history Gitleaks scan passed on latest source commit: [run 38627053653](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053653). The workflow checks pushes and pull requests, supports manual runs, and scans weekly. A scan is useful protection but does not replace rotating any credential if a leak is ever identified.
- Latest CI passed lint, unit tests, dependency audit, build, Pages header/redirect packaging, and isolated Supabase migration/RLS tests: [run 38627053630](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053630).
- An official CHED 2017 memorandum archive links CMO No. 92, s. 2017, Civil Engineering: [CHED memorandum archive](https://legacy.ched.gov.ph/2017-ched-memorandum-orders/).

### Content, backup and pilot gates still open

- The original eight questions have a separate mathematical consistency pre-review. A first-pass AI-assisted math/choice structure audit covered all 52 live question records on 2026-10-18. Database checks confirmed required fields, unique choices, and exactly one option matching `correct_answer` for each record; no definite answer mismatch was identified in the first pass. This is not independent academic approval. All 52 questions and 13 lessons remain `needs-review` until a qualified reviewer checks clarity, workings, explanations, originality, and attribution. See the [Stage 1 audit record](reviews/2026-10-18-stage1-content-and-publication-audit.md) and the [original eight-question pre-review](reviews/2026-10-15-basic-algebra-draft-review.md).
- **Future-question content protection decision:** the repository remains public because the exposure of the original eight drafts is accepted; those questions are treated as already disclosed. The public `supabase/seed.sql` contains catalog metadata only, and CI rejects practice-question inserts or answer/solution fields returning to that seed. Future unpublished prompts, options, answers, solutions, and review notes belong directly in the CEStudy Supabase database with `needs-review` status. RLS hides unpublished rows from anon/authenticated API clients. The production deployment after the Privacy notice merge was validated by [Chromium run 39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712).
- A fresh live database snapshot was exported on 2026-10-20 in [39433566649](https://github.com/justryan-n2d/CEStudy/actions/runs/39433566649); archive/checksum/marker read-back and retention succeeded (four verified sets kept; three stale/incomplete artifacts hidden), and the logs had no summary errors. This run used old main commit `44ceab69364ba0b094399fbd878ccd38d942356c`, whose pre-encryption archive check required only `catalog_subjects` and `practice_questions`. PR #48 has since merged the corrected three-table assertion and per-table success output; repeat the backup from current `main`. The October 16 local restore is still an older snapshot, and managed Supabase restore, B2 lifecycle cleanup, protected key copies and failure-email settings remain open.
- The controlled 5–8-student pilot procedure and proposed metrics are documented in [student pilot plan](plans/2026-10-15-student-pilot-plan.md). No student pilot has been run.
- The public [Privacy notice](https://cestudy.pages.dev/privacy) was merged in PR #42, and its route, headers, and footer link passed the latest production Chromium smoke suite.
- The active [Protect main ruleset](https://github.com/justryan-n2d/CEStudy/rules/25242389) is verified. It requires pull requests plus `Lint, test, and build`, `Supabase migration and RLS tests`, and `Scan repository history for secrets`; it also blocks branch deletion and non-fast-forward updates and has no bypass actors. Verification PR [#13](https://github.com/justryan-n2d/CEStudy/pull/13) passed its required CI and secret-scan checks before merge.

Do not open CEStudy broadly to students until a human reviewer is identified, the pilot/review process is approved, the required recovery safeguards are completed for the data CEStudy will hold, and final manual accessibility/device QA has been recorded.

## Phase summary

The authoritative phase table and detailed tasks live in [the organized phase plan](PHASE_PLAN.md). Current summary:

| Phase | State | Evidence-based notes |
| --- | --- | --- |
| 0. Repository and project foundation | Complete | Stack, repository, security requirements, scripts and CI exist. |
| 1. Student discovery and problem validation | Not started | No discovery findings are documented in the repository yet. |
| 2. MVP scope, user journey and UX specification | Partially complete | Product scope/stack and deployed UI baseline exist; discovery, written user journey and validated pilot measures remain. |
| 3. Database, backend access and security baseline | Complete for current MVP | Live RLS, explicit grants, published-only policies and migration tests are in place. Current backup recovery is tracked in Phase 7. |
| 4. Frontend MVP implementation | Complete for current app scope | Browse/catalog, subject pages, lesson/practice screens, local progress/streak, privacy and feedback paths are implemented. Published learning content remains a separate gate. |
| 5. Cloudflare Pages and Supabase integration | Complete for initial deployment | Production site is active at [cestudy.pages.dev](https://cestudy.pages.dev). |
| 6. Automated and manual technical QA | Partially complete | Recorded CI and 135/135 production smoke checks passed; physical-device/accessibility review and the complete search/filter matrix remain. |
| 7. Pre-launch hardening and release gates | **Current** | A fresh run with the corrected three-table validator, managed-target restore, backup notification/lifecycle settings and manual QA remain. |
| 8. Human content review and approved publishing | Partially complete: tools implemented | Owner-only review UI/API and database publication controls exist; all 52 questions and 13 lessons still need independent human approval. |
| 9. Controlled student pilot | Not started | Plan is documented for 5–8 students; no pilot has run. |
| 10. Final polish and broad public launch | Not started | Pilot results, final checks and an explicit launch decision are outstanding. |
| 11. Ongoing operations and future expansion | Partially implemented; expansion deferred | CI, scheduled security/backup workflows, feedback tooling and browser-local progress exist. Accounts, AI and native apps remain future decisions. |

**Storage clarification:** Supabase PostgreSQL is already in use. A Supabase Storage bucket is not configured and is not required for this MVP. Encrypted database backups target Backblaze B2 bucket `cestudy-db-backup`. The real encrypted backup has been decrypted and restored to an isolated local PostgreSQL test database; a managed-Supabase-target restore remains untested.

## Deployment record (2026-10-15)

- **Live URL:** [https://cestudy.pages.dev](https://cestudy.pages.dev)
- **Hosting:** Cloudflare Pages, connected to GitHub repository `justryan-n2d/CEStudy`.
- **Production branch:** `main`.
- **Build command:** `npm run build`.
- **Build output directory:** `dist`.
- **Deployment result:** The user reported that Pages creation/deployment succeeded and that the site worked during the initial mobile checks.
- **Legacy Worker cleanup:** The user confirmed on 2026-10-15 that the separate failed Cloudflare Worker named `cestudy` was deleted after the Pages site was working. The active frontend remains the Pages project at `https://cestudy.pages.dev`; the Worker was not required by the Pages + Supabase architecture.

## User-reported and automated smoke tests

The following initial checks were reported working on mobile after deployment: homepage, subject catalog, catalog search and filters, Year 2, Mathematics Foundations, subject detail routes with direct refresh, and catalog display.

The subsequent independent Chromium run [38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289) passed 70/70 live checks, including six direct-route loads, live Supabase API and publishable-key verification, required response headers, 320 px and 1440 px overflow checks, zero browser/runtime errors, hidden unpublished questions, and the official CHED PDF link.

Launch-gate summary updated 2026-10-26: the latest encrypted backup workflow passed on 2026-10-25 in [run 40172509628](https://github.com/justryan-n2d/CEStudy/actions/runs/40172509628), but managed-Supabase-target restore, Backblaze lifecycle and GitHub failure-email confirmation, full accessibility and physical-device review, Google OAuth preview/configuration verification for candidate PR #67, human review of questions and lessons, and the controlled student pilot remain open. The historical post-correction production smoke run [39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712) passed 135/135 checks on 2026-10-18; the latest recorded main-branch Chromium check is [40240604028](https://github.com/justryan-n2d/CEStudy/actions/runs/40240604028) on 2026-10-25. PR #14 adds regression coverage for key filter combinations and small-text contrast; the full search/filter matrix and on-device assistive-technology behavior still need manual QA.

## Completed and verified

### Frontend and engineering workflow

- React + TypeScript + Vite + Tailwind CSS app committed to `main`.
- Home/catalog UI, four year-level routes, Mathematics Foundations, and subject detail pages.
- Searchable and filterable 72-record subject catalog with curriculum-source notes.
- Basic Algebra practice flow exists, but no question is published yet.
- `package-lock.json` is committed and `npm ci` is used for reproducible installs.
- Security update PR [#1](https://github.com/justryan-n2d/CEStudy/pull/1) merged as `6b69e7b`. Latest main-branch [CI run 38623258999](https://github.com/justryan-n2d/CEStudy/actions/runs/38623258999) passed ESLint, tests, production build, `npm audit` (0 vulnerabilities), Pages deployment check, and the isolated Supabase migration/RLS test suite. The baseline migration filename now matches the remote migration version.
- CI now verifies that `dist/_redirects` and `dist/_headers` are packaged. Weekly Dependabot updates are configured for npm and GitHub Actions. The production response headers and browser CSP behavior still require an on-device/browser check.

### Supabase

- Dedicated `CEStudy` project created in Singapore, separate from all other applications.
- Migration applied and seed loaded.
- `catalog_subjects`: 72 rows.
- `practice_questions`: 52 rows, all `needs-review`; published count is 0.
- `subject_lessons`: 13 rows, all `needs-review`; published count is 0.
- The encrypted backup workflow passed on 2026-10-25 in [run 40172509628](https://github.com/justryan-n2d/CEStudy/actions/runs/40172509628). A managed-Supabase restore after the live content correction remains required before recovery can be considered current.
- RLS is enabled on both tables.
- Public roles can read intended records; public INSERT/UPDATE/DELETE privileges are absent.
- The practice-question RLS policy only allows rows where `status = 'published'`.
- The remote verification query recorded table counts, RLS status, and grants at the time of that audit; those values were not re-read for this documentation update.
- Supabase security advisor returned no lint findings.
- Migration `20261014190554_client_default_privileges_hardening.sql` is applied remotely. New tables, sequences, and functions created by the standard `postgres` migration owner no longer receive default client/PUBLIC grants.
- Expanded pgTAP tests cover anonymous and authenticated reads, published-only practice visibility, denied writes, and safe defaults for future objects. CI passed these tests.
- The managed `supabase_admin` role's default privileges could not be changed through the ordinary project database connection and remain platform-managed. No app-facing objects in `public` are owned by that role; create application objects through reviewed `postgres`-owned migrations with explicit grants and RLS.
- The public schema currently contains only the two expected app tables and no public views/functions or Storage buckets. Performance advisor shows three unused catalog indexes at this early usage stage; these are informational, not security findings, and should be reviewed after real query usage exists.
- A detailed record is available in [remote Supabase verification](deployment/2026-10-15-remote-supabase-verification.md).

## Architecture reminder: Pages, not a Worker

The selected hosting target is **Cloudflare Pages** connected to the GitHub repository. The working site is hosted at [https://cestudy.pages.dev](https://cestudy.pages.dev). The dashboard groups Pages and Workers under **Workers & Pages**, but no separate Cloudflare Worker is required just to host this frontend. Create a Worker or Supabase Edge Function only when a specific server-side requirement justifies it.

Current Pages build settings:

- Root directory: repository root
- Build command: `npm run build`
- Build output: `dist`
- Production branch: `main`

Cloudflare Pages has been configured with the following browser build variables using the dedicated CEStudy Supabase project:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Only the publishable key is appropriate for a browser build. Never place a secret/service-role key, database password, or access token into a `VITE_*` variable or public repository.

See [Cloudflare Pages setup](deployment/cloudflare-pages.md).

## Next actions, in order

The current operational priority is Phase 7. In parallel, complete the missing discovery and UX documentation from Phases 1–2 before expanding scope.

1. The 2026-10-25 encrypted-backup workflow log has been checked: all three required tables were verified, archive/checksum read-back passed, and retention kept four verified backups. Still test restore into a separate managed Supabase project after cost approval. Confirm B2 lifecycle cleanup, protected recovery-key copies and GitHub failure-email preferences.
2. Complete physical-device/accessibility QA and the remaining catalog search/filter, direct-route, no-results, loading and error-state checks. Record the final security review.
3. Complete Phase 1 discovery and Phase 2 user-journey/pilot-measure documentation; retain the shipped UI as the design baseline instead of rebuilding it.
4. Use the implemented owner review tools to get independent approval for a small initial lesson/question set. Keep all unapproved content unpublished.
5. Run the 5–8-student pilot after Phase 7 gates pass; use approved/published questions for any practice task. Record results and a go/no-go recommendation.
6. Complete Phase 10 polish and public-launch sign-off after critical pilot issues are resolved.

PR #67 is the current main-targeted integration candidate; PR #44 is the legacy overlapping UI shell, and PR #64, #65, and #66 are older source/dependent drafts. Current metadata identifies PR #67 as open and draft on `feat/local-history-streak-2026-10-23b`, based on main `887b3f5a0b826ac0019f266de5e53fd6278958d3`. Code/test head `8c942711c40019758682b70599fccc2aa7c69807` passed the four CI/security/preview checks, but the docs-only branch head needs fresh checks. Do not merge until independent review, current-head checks, real-preview Google cancellation and controlled PKCE failure/retry, exact preview redirect checks without altering production OAuth, account-scope behavior, review of two moderate dependency advisories, and current conflict/review-thread state have all been addressed. No production deployment, production OAuth-setting change, schema/RLS mutation, production data change, or unpublished-content release is authorized. Do not close or change older PR states without explicit owner authorization.

Do not create Supabase Storage buckets for the current MVP unless an approved feature needs file uploads or private objects.

## Documentation practice

Keep significant decisions, migrations, security changes, deployment settings, test evidence, known limitations, and launch approvals documented in Git. Do **not** put credentials, API secrets, database passwords, access tokens, private account data, or real student data in the public repository. This status page is a summary, not a substitute for the linked detailed verification records.
