# CEStudy project status

**Last updated:** 2026-11-04  
**Current workstream:** Decision-Light Design documentation (A), followed by the deferred site-wide UX audit (C). Blueprint Academy Phase 3, Catalog/Subject/Study consistency, is complete and integrated into `main` through PRs #70-#73. Phase 4, Practice Workspace, remains not started and must not begin until audit C is completed.  
**Operational release phase:** **Phase 7, pre-launch hardening and release gates.**  
**Release status:** CEStudy is **not approved for a broad student launch**. A read-only live Supabase query on 2026-11-04 reconfirmed 72 catalog subjects, 52 practice questions and 13 lessons; all 52 questions and all 13 lessons remain `needs-review`, with zero published rows. Phase 3 completion does not approve content publication, a broad launch, or production deployment.

**Verified main:** `849c9d707b0cafd8c39ab63d9bf57260c54dd186` (2026-11-04). Post-merge CI [41797726093](https://github.com/justryan-n2d/CEStudy/actions/runs/41797726093) passed 177 tests across 29 files, lint, dependency audit, production build, 1,757/1,757 theme/browser assertions, backup checks and Supabase migration/RLS tests. Live Chromium smoke [41798110114](https://github.com/justryan-n2d/CEStudy/actions/runs/41798110114) passed. See the evidence section below.

**Live website:** [https://cestudy.pages.dev](https://cestudy.pages.dev)

## Canonical roadmap and integration sequence

- **2026-10-29 UX/UI planning update:** A documentation-only branch adds a binding design quality and anti-template standard to `docs/specs/UX_UI_DESIGN_SYSTEM.md`, including task-based layout rules, nested-container acceptance criteria, interaction/prototype truth, and a required design-review checklist. The master roadmap and related IA/gamification plans link to that authority. No application files, feature behavior, auth, database, production settings, merge, or production deployment are changed by this work. GitHub's automatic branch checks may build a preview. The branch remains subject to owner review and repository validation.

- **Source of truth:** [MASTER_ROADMAP_FOR_CESTUDY.md](MASTER_ROADMAP_FOR_CESTUDY.md) is already present on `main`. Its approved Blueprint Academy direction, implementation sequence, acceptance criteria, and release safeguards take priority over conflicting PR layouts or styling.
- **Decision-Light Design (owner-approved 2026-11-04):** Documentation task A adds the binding Hick-Hyman-based five-rule standard to the UX/UI Design System and roadmap. The separate site-wide audit C is deferred until A is integrated, and is required before Phase 4. Do not describe the current site as audited or redesign existing routes as part of A.
- **Supporting design decisions:** PR #51 is merged. Its IA, gamified UX, and design-system documents are reconciled with the canonical roadmap and approved device-local theme decision.
- **Stage 0, Gitleaks security gate: verified complete on 2026-10-23.** PR #59 merged at `a2c05dff7532b8f48838bcda9e73615613599086` after CI, the PR-diff secret scan, and a full-history scan of 1,014 commits / about 3.89 MB passed with no leaks. PR #47 is closed as superseded. This completes the Gitleaks allowlist gate only; Phase 0 and Phase 7 retain their other outstanding checks.
- **Stage 1, theme foundation:** PR #56 merged on 2026-10-23 at `6aef33f37ea69c9b53acdbd975edf9b8feb2d0a5`. Final head `8208d8dbd2012a474a20bca5aa5cc0ad4b975146` passed CI, secret scan, Supabase migration/RLS checks, and 853/853 Chromium assertions. The owner content-review dark-theme regression test first failed as expected and passed after the CSS fix. Phase 1 remains **current**, not complete, until independent review and manual preview inspection are available; external preview access was blocked by environment DNS/network.
- **Stage 2, public navigation:** PR #57 merged on 2026-10-23 at `b4b18b2b1a2255d88dacdff546a90de2de18238b`. Final head `ae45bc7623d7443bc49554c4fcc007c48f604b0b` passed CI, full-history secret scan, Supabase migration/RLS, backup checks, and 1,682/1,682 Chromium assertions. Cloudflare Pages preview deployment succeeded; manual external preview inspection remains unavailable due environment DNS/network. Phase 2 remains **current**, not complete, pending independent review and manual preview inspection.
- **Accessibility:** PR #54 is closed as superseded by PR #57. Route-focus handoff, Escape/focus restoration, visible focus styling, and minimum 44px navigation targets are included in the merged navigation implementation.
- **Account and learning activity features:** consolidated PR #67 is the current draft candidate for Google OAuth, profile, streak and learning history. Keep the approved main theme/navigation shell. PR #44 is an older parallel source branch, not the merge target.
- **PR #67 release gate:** its current head is 99 commits ahead and 19 behind current `main`, diverged and non-mergeable. After product-roadmap Phases 3 and 4, reconcile the complete diff and verify OAuth cancellation, callback error/retry, safe return paths, PKCE token-exchange failure then fresh retry, session refresh, local-scope sign-out, guest access, and per-user data boundaries. Keep draft until all required gates pass.
- **Deployment authorization:** Preview verification only. No production deployment, production auth configuration change, production data mutation, publication of draft content, or weakening of Supabase RLS is authorized by this integration plan.

## Completed integration gates (verified 2026-10-23)

- PR #58 merged the canonical roadmap/status reconciliation. The roadmap is on `main`, the first-release theme preference is recorded as device-local, and the status tracker now reflects the staged integration order.
- PR #59 merged the corrected Gitleaks allowlist and PR full-history scan. The full-history job scanned 1,014 commits and reported no leaks. PR #47 is closed as superseded.
- PR #51 merged the supporting IA, gamified UX, and design-system documents after reconciliation with this roadmap.
- PR #56 merged the shared theme foundation after the dark-mode regression fix and fresh CI/secret-scan verification. The Phase 1 tracker remains current pending independent review/manual external preview inspection.
- PR #57 merged the hybrid public navigation after fresh CI, full-history secret scan, Supabase migration/RLS checks, backup checks, and 1,682/1,682 Chromium assertions. PR #54 is closed as superseded.

## Current pull-request state (verified 2026-11-04)

| PR | Current role | State and next gate |
|---|---|---|
| [#70](https://github.com/justryan-n2d/CEStudy/pull/70) | Phase 3 documentation and implementation plan | Closed, merged 2026-11-04 at `004f5e971fdb2a755619708c1a99dbea4bc93550`. |
| [#71](https://github.com/justryan-n2d/CEStudy/pull/71) | Phase 3 Task 1: Catalog API, SubjectPage and `useCatalog` contracts | Closed, merged 2026-11-04 at `d8c3e2bf62b4bf1e0f106d923d76981125ff996b`; includes the reproduced/fixed stale-subject route state. |
| [#72](https://github.com/justryan-n2d/CEStudy/pull/72) | Phase 3 Task 2: published lesson API and Study reader contracts | Closed, merged 2026-11-04 at `c24736168c1e49a6f39c89a7eabb7abb69480932`. |
| [#73](https://github.com/justryan-n2d/CEStudy/pull/73) | Phase 3 Task 3: synthetic populated lesson math/browser verification | Closed, merged 2026-11-04 at `849c9d707b0cafd8c39ab63d9bf57260c54dd186`. |
| [#74](https://github.com/justryan-n2d/CEStudy/pull/74) | Separate connectivity and loading-skeleton feature | Open, draft, unmerged; 19 commits ahead and 4 behind current `main`, diverged from the pre-Phase-3 base. Standalone CI passed, but visual review identified a Practice answer-row theme mismatch and missing page-level rejected-request lifecycle coverage. Reconcile and fix before merge. |
| [#67](https://github.com/justryan-n2d/CEStudy/pull/67) | Consolidated Google auth, profile, local history and user-keyed streak candidate | Open, draft. Head `43aa6de27c30cca098f542597497b74102cf8442`; current `main` comparison: 99 commits ahead, 23 behind, diverged, GitHub mergeable=false. Reconcile after product roadmap Phases 3 and 4. |
| [#44](https://github.com/justryan-n2d/CEStudy/pull/44) | Earlier parallel account/streak candidate | Open, draft and not the integration target. Do not merge separately. |
| [#64-#66](https://github.com/justryan-n2d/CEStudy/pull/64) | Earlier/stacked source slices | Open, draft. Treat as source history for PR #67 only; do not merge independently. |

**PR #69:** merged 2026-11-04 at `ad96cc6148b95b563f247d9254bea5a6858b3cd0`. It adds the binding design-quality and anti-template standard and tool-neutral repository guidance. It does not change application code, production configuration, authentication, or database state.

**Merge rule:** Before any feature merge, verify current base/head SHAs and branch relationship, review the complete diff, and rerun required CI, secret scanning and relevant security tests. PR #67 is not ready for merge in its current diverged state.

## Product roadmap Phase 3 implementation status (2026-11-04)

**Status: COMPLETE AND INTEGRATED.** The owner authorized the merge after reviewing the implementation plan, CI results and the populated-lesson screenshots. PRs #70-#73 were squash-merged in dependency order:

| PR | Integrated deliverable | Merge commit |
|---|---|---|
| [#70](https://github.com/justryan-n2d/CEStudy/pull/70) | Canonical roadmap reconciliation and Phase 3 implementation plan | `004f5e971fdb2a755619708c1a99dbea4bc93550` |
| [#71](https://github.com/justryan-n2d/CEStudy/pull/71) | Catalog API, `useCatalog`, SubjectPage contracts and stale-route correction | `d8c3e2bf62b4bf1e0f106d923d76981125ff996b` |
| [#72](https://github.com/justryan-n2d/CEStudy/pull/72) | Published lesson API and Study reader regression contracts | `c24736168c1e49a6f39c89a7eabb7abb69480932` |
| [#73](https://github.com/justryan-n2d/CEStudy/pull/73) | Synthetic populated-lesson math and both-theme browser verification | `849c9d707b0cafd8c39ab63d9bf57260c54dd186` |

**Post-merge verification on final main `849c9d7`:**
- [CI run 41797726093](https://github.com/justryan-n2d/CEStudy/actions/runs/41797726093) passed: 177 tests across 29 files, ESLint, dependency audit, Vite production build, backup crypto/retention/verification tests, isolated Supabase migration/RLS tests, and 1,757/1,757 theme/browser assertions.
- [Live Chromium smoke run 41798110114](https://github.com/justryan-n2d/CEStudy/actions/runs/41798110114) completed successfully.
- [Push secret scan 41797726053](https://github.com/justryan-n2d/CEStudy/actions/runs/41797726053) completed successfully. The individual Phase 3 PR heads also passed their full-history secret-scan checks; PR #73's [run 41784514136](https://github.com/justryan-n2d/CEStudy/actions/runs/41784514136) scanned 1,233 commits with no leaks.
- The populated lesson visual-review artifact from [CI run 41784514166](https://github.com/justryan-n2d/CEStudy/actions/runs/41784514166) was inspected before merge. It covers the empty reviewer baseline and a synthetic populated lesson in Light/Dark at 390px and 1440px; the automated browser matrix also covers 320, 390, 768, 1024 and 1440px.

Task 1 fixed a demonstrated SubjectPage route-transition bug. Task 2 added contract tests because the existing Study reader/API implementation already met the verified requirements. Task 3 verifies the shared Markdown/KaTeX route without publishing live content. Learning objectives remain searchable metadata only and are not rendered as a separate lesson section.

**Safeguards preserved:** no live lesson/question was published; no live database row, schema, RLS policy, production Supabase/OAuth setting or production deployment configuration was changed by these PRs. The operational release phase remains Phase 7; Phase 3 completion is not broad-launch approval.

**Next product-design workstream:** Complete documentation task A, then run the deferred site-wide Decision-Light audit C across existing routes and significant task states. **Next product implementation workstream:** Phase 4, Practice Workspace, remains not started and is gated on audit C. Keep the connectivity/loading-skeleton PR #74 separate until it is reconciled with current main and the identified Practice skeleton visual issue and rejection-lifecycle coverage are addressed.

## Latest production and mainline verification (2026-11-04)

- **Final Phase 3 main:** `849c9d707b0cafd8c39ab63d9bf57260c54dd186`.
- **Post-merge CI:** [run 41797726093](https://github.com/justryan-n2d/CEStudy/actions/runs/41797726093) passed 177 tests across 29 files, ESLint, dependency audit, production build, backup crypto/retention/verification tests and isolated Supabase migration/RLS tests.
- **Theme and responsive browser checks:** the same CI run passed 1,757/1,757 assertions, including the synthetic populated lesson in Light and Dark at all five widths (320, 390, 768, 1024 and 1440 px).
- **Live Chromium:** [run 41798110114](https://github.com/justryan-n2d/CEStudy/actions/runs/41798110114) completed successfully after the final Phase 3 merge.
- **Secret scanning:** push scan [41797726053](https://github.com/justryan-n2d/CEStudy/actions/runs/41797726053) succeeded. Phase 3 PR heads also had successful secret scans; the full-history scan [41784514136](https://github.com/justryan-n2d/CEStudy/actions/runs/41784514136) scanned 1,233 commits with no leaks.
- **Earlier baseline evidence:** before Phase 3 integration, main commit `ad96cc6` passed [CI 41775563340](https://github.com/justryan-n2d/CEStudy/actions/runs/41775563340) with 151 tests / 26 files and 1,682/1,682 theme/navigation assertions; live smoke [41775770082](https://github.com/justryan-n2d/CEStudy/actions/runs/41775770082) passed 135/135. These are retained as historical pre-Phase-3 checks.
- **Backup:** [run 41290656868](https://github.com/justryan-n2d/CEStudy/actions/runs/41290656868) on 2026-11-01 explicitly verified `catalog_subjects`, `practice_questions` and `subject_lessons`, uploaded the encrypted archive/checksum, read both back, verified the remote marker, and retained four verified sets while hiding three stale/incomplete artifacts.
- **Current live data:** read-only Supabase query on 2026-11-04 returned 72 catalog subjects, 52 practice questions (all `needs-review`) and 13 lessons (all `needs-review`). No content was published or changed.

**Still open:** separate managed-Supabase restore, Backblaze B2 hidden-version lifecycle check, protected recovery-key copies, GitHub failed-workflow notification confirmation, physical Android/TalkBack/200% text zoom/keyboard checks, complete manual search/filter matrix, independent human academic review, and student pilot. These remain release gates; automated success does not replace them.

## Stage 1 release audit (2026-10-18)

- **Catalog:** 72 subjects.
- **Practice bank:** 52 records, all `needs-review`; 0 published.
- **Lesson bank:** 13 records, all `needs-review`; 0 published.
- **Publication correction:** two lesson rows whose source notes identified them as drafts were returned to `needs-review`. Review timestamps were cleared, an audit note was recorded in the private database, and Algebra Foundations was changed to `in-preparation`.
- **Live access check:** all six public/private data tables inspected have RLS enabled. The anonymous database role returned zero rows from `subject_lessons` and `practice_questions`; published-only read policies remain in place. The security advisor returned three informational no-policy findings for private tables that have no client grants, not actionable public-table policy gaps.
- **Question pre-review:** all 52 questions passed basic database integrity checks for nonempty required fields, unique options, and exactly one matching stored correct answer. A first-pass AI-assisted math/solution consistency check found no definite answer mismatch. This is not independent academic review. Do not publish any question or lesson until a qualified human records approval.
- **Current limitations:** the corrected three-table backup has now passed live; a managed-Supabase recovery rehearsal, Backblaze lifecycle and GitHub failure-email settings, protected key recovery copies, real-device accessibility, manual search/filter QA, human content review, OAuth end-to-end verification for the consolidated PR #67 if retained, and the 5–8 student pilot remain open. The October 18 [Stage 1 audit record](reviews/2026-10-18-stage1-content-and-publication-audit.md) remains historical evidence, not a current live query.


## Product direction locked (2026-10-18)

CEStudy will combine free browsing of the engineering knowledge library with optional guided learning paths and personal progress tracking. The decision is recorded in [the combined learning model](product/COMBINED_LEARNING_MODEL.md) and reflected in [the roadmap](ROADMAP.md) and [phase plan](PHASE_PLAN.md).

The first feature increment is already implemented on main: students can mark a published lesson complete, view browser-local completion history and streaks, and clear those records. Unit tests cover duplicate completions, one activity day per calendar day, malformed local data, clearing progress and date handling. It adds no student accounts, server-side progress writes or cross-device sync. Because zero lessons are currently published, meaningful student-facing lesson-progress use must wait for Phase 8 content approval. Phase 7 release gates still apply; implementation does not approve a broad launch.


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
Historical backup: the 2026-10-20 run [39433566649](https://github.com/justryan-n2d/CEStudy/actions/runs/39433566649) predates the three-table validator and is not used as current verification. The corrected live run [41290656868](https://github.com/justryan-n2d/CEStudy/actions/runs/41290656868) on 2026-11-01 verified all three tables and remote archive/checksum/marker read-back, retaining four verified sets. Managed restore, B2 lifecycle, protected key copies and failure-email settings remain open.
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

Still pending before a student launch: a separate managed-Supabase-target restore, Backblaze lifecycle and GitHub failure-email confirmation, protected recovery-key copies, full physical-device/accessibility review, OAuth configuration and end-to-end verification for the consolidated PR #67 if retained, human review of questions and lessons, and the controlled student pilot. The production smoke test [run 41775770082](https://github.com/justryan-n2d/CEStudy/actions/runs/41775770082) passed 135/135 checks on 2026-11-04. PR #14 adds regression coverage for key filter combinations and small-text contrast; the full manual search/filter matrix and on-device assistive-technology behavior still need QA.

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
- After the 2026-10-18 live status correction, a new backup and managed-Supabase restore check are required before recovery can be considered current.
- RLS is enabled on both tables.
- Public roles can read intended records; public INSERT/UPDATE/DELETE privileges are absent.
- The practice-question RLS policy only allows rows where `status = 'published'`.
- The remote verification query confirmed table counts, RLS status, and grants.
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

The ordered product sequence below follows the canonical UX/UI roadmap. The overall release lifecycle in `PHASE_PLAN.md` remains at Phase 7 until its operational and manual gates are cleared.

1. **Decision-Light documentation (A):** review this documentation-only branch, including the UX/UI Design System, master roadmap, and project status updates. No application source or behavior is changed.
2. **Close remaining operational verification gaps:** keep successful automated theme/navigation and backup checks recorded. Complete the remaining managed Supabase restore only after separate-project cost review, B2 lifecycle inspection, recovery-key protection, failure notification settings, and owner physical-device/accessibility review. Do not claim those manual items complete based on CI.
3. **Decision-Light site-wide audit (C):** after A is integrated into `main`, inspect every current route and significant task state against the binding standard. Record evidence, common and advanced task paths, accessibility and responsive findings, and prioritize proposed corrections for owner review. Do not start Phase 4 implementation during this audit.
4. **Product roadmap Phase 4:** proceed only after Phase 3 foundations and tests are integrated and verified and audit C is complete. Agree any Phase 4-relevant corrections before implementation. Improve the Practice Workspace without changing question correctness, publication rules, or answer/result behavior.
5. **Product roadmap Phase 5:** reconcile the consolidated [PR #67](https://github.com/justryan-n2d/CEStudy/pull/67) branch against current main only after Phases 3 and 4. Complete the Google/Supabase OAuth, callback recovery, privacy, sign-out and per-user isolation gates before any merge or release.

## Documentation practice

Keep significant decisions, migrations, security changes, deployment settings, test evidence, known limitations, and launch approvals documented in Git. Do **not** put credentials, API secrets, database passwords, access tokens, private account data, or real student data in the public repository. This status page is a summary, not a substitute for the linked detailed verification records.
