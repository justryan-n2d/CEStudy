# CEStudy: Organized Project Phases and Release Plan

**Last reviewed:** 2026-11-04  
**Live website:** https://cestudy.pages.dev  
**Current phase:** **Phase 7, Pre-launch hardening and release gates**  
**Launch status:** The web MVP is deployed, but the broad student launch is not approved.

This is the canonical phase plan for CEStudy. Use this file for the overall order and status of work. The detailed deployment, database, security, backup, and pilot documents linked below remain the step-by-step references for those tasks.

## Where we are now

CEStudy is deployed. The overall lifecycle plan remains in **Phase 7: pre-launch hardening and release gates**; the broad student launch is not approved.

- **Current main:** `ad96cc6148b95b563f247d9254bea5a6858b3cd0` (2026-11-04). PR #69 merged and its documentation standard is on main.
- **Main CI:** [41775563340](https://github.com/justryan-n2d/CEStudy/actions/runs/41775563340) passed lint, audit, build, database migration/RLS tests, backup crypto/retention tests, 151 tests across 26 files, and 1,682/1,682 theme/navigation assertions across 13 routes, both themes and five viewport widths.
- **Live smoke:** [41775770082](https://github.com/justryan-n2d/CEStudy/actions/runs/41775770082) passed 135/135 checks with zero browser/runtime errors.
- **Full-history secret scan:** scheduled [41433925558](https://github.com/justryan-n2d/CEStudy/actions/runs/41433925558) on 2026-11-02 scanned 1,191 commits / about 4.53 MB with no leaks.
- **Current live Supabase data:** a read-only query on 2026-11-04 returned 72 catalog subjects, 52 practice questions and 13 lessons. All 52 questions and all 13 lessons remain `needs-review`; zero are published.
- **Backup:** live run [41290656868](https://github.com/justryan-n2d/CEStudy/actions/runs/41290656868) on 2026-11-01 verified all three required tables, encrypted and uploaded the archive, read back the archive/checksum/marker, and retained four verified sets. This closes the fresh three-table backup-run check; it does not prove a managed-Supabase restore or B2 lifecycle/notification settings.
- **Theme/navigation:** the merged implementation is verified by current CI across five widths and both themes. Owner visual sign-off, physical Android/TalkBack, 200% text zoom and manual keyboard checks remain open.
- **Consolidated account candidate:** PR #67 is open and draft. Its head is `43aa6de27c30cca098f542597497b74102cf8442`; compared with current main it is 99 commits ahead and 19 behind, diverged, and not mergeable. PR #44 is an older candidate; PR #64-#66 are earlier/stacked source slices. None should be merged independently.

### Current product-roadmap workstream

The UX/UI product roadmap's Phase 3 means **Catalog, Subject and Lesson consistency**; that numbering is separate from this lifecycle plan's database/security Phase 3. The dedicated implementation plan is [here](plans/2026-11-04-phase-3-catalog-subject-lesson-consistency-implementation-plan.md). Phase 4 Practice Workspace follows only after Phase 3 foundations/tests; Phase 5 returns to PR #67 only after the Practice Workspace sequence. These product workstreams do not bypass lifecycle Phase 7 release gates.

### What “storage” means for CEStudy

- **Supabase database:** In use. The 72 catalog subjects, 52 practice questions, and 13 lesson records are stored in PostgreSQL. All 52 questions and all 13 lessons are currently `needs-review`; no questions or lessons are published. Student-facing RLS checks returned zero published lessons and zero published questions to the anonymous role.
- **Supabase Storage buckets:** **Not configured, and not needed for the current MVP.** The app currently has no user-uploaded files or private media. Do not add a bucket unless an approved feature requires file/object storage.
- **Database backup storage:** The latest live [41290656868](https://github.com/justryan-n2d/CEStudy/actions/runs/41290656868) run on 2026-11-01 verified all three current required tables, remote archive/checksum/marker read-back and retention. Managed-Supabase-target restore, B2 lifecycle cleanup, protected recovery-key copies and GitHub failure-notification verification remain open.

## Status meanings

- **Complete:** The phase's defined work has been implemented and there is evidence for it.
- **Partially complete:** Some work is implemented, but one or more planned items or exit criteria remain.
- **Current:** This is the active phase and the next work should focus here.
- **Not started:** No completion evidence has been recorded yet.
- **Deferred:** Intentionally excluded from the current release.

A phase can be partially complete even when a later phase has already been built. CEStudy's first deployment happened before student discovery and all product-validation work were documented, so this plan tracks actual evidence instead of pretending the phases happened in a perfect sequence.

## Phase overview

| Phase | Name | Status | Reality check |
|---|---|---|---|
| 0 | Repository and project foundation | **Complete** | Repository, stack, security requirements, development scripts and CI exist. |
| 1 | Student discovery and problem validation | **Not started** | No documented student-discovery findings are recorded yet. |
| 2 | MVP scope, user journey and UX specification | **Partially complete** | Product scope and architecture are set and the live UI serves as the visual baseline; discovery evidence, written user journey and validated pilot measures remain. |
| 3 | Database, backend access and security baseline | **Complete for current MVP** | Live tables, explicit grants, RLS and published-only content policies are implemented and checked. Current-state backup recovery is tracked in Phase 7. |
| 4 | Frontend MVP implementation | **Complete for current app scope** | Core browsing, learning/practice interfaces, local progress, privacy and feedback flows are implemented. The published learning library is not yet populated. |
| 5 | Cloudflare Pages and Supabase integration | **Complete for initial deployment** | Production Pages site is connected to the dedicated CEStudy Supabase project. |
| 6 | Automated and manual technical QA | **Partially complete** | CI and recorded production Chromium checks passed; physical-device/accessibility QA and full search/filter edge cases remain. |
| 7 | Pre-launch hardening and release gates | **CURRENT** | Fresh current-state backup/recovery proof, backup-retention/notification safeguards, final manual QA and security sign-off remain. |
| 8 | Human content review and approved publishing | **Partially complete: tooling only** | Owner-only review UI/API and publication controls exist; independent human review and approved content publication have not started. |
| 9 | Controlled student pilot | **Not started** | The 5–8-student pilot plan exists but no pilot has run. It must wait for Phase 7 and use only reviewed content for practice tasks. |
| 10 | Final polish and broad public launch | **Not started** | Pilot findings, final checks and an explicit go/no-go decision are still required. |
| 11 | Ongoing operations and future expansion | **Partially implemented; expansion deferred** | CI, scheduled operational workflows, feedback/reporting and local progress exist. Account sync, AI assistance and native mobile apps remain future decisions. |

---

## Phase 0: Repository and project foundation

**Status: COMPLETE**

### Evidence already in the repository
- GitHub repository and source-controlled project documentation.
- Selected stack: React, TypeScript, Vite, Tailwind CSS, Cloudflare Pages, Supabase, and GitHub Actions.
- Product scope and security requirements.
- Development scripts, lockfile, lint, UI/unit tests, database policy tests, dependency audit, and secret-scanning workflow.
- Initial deployment and release records.

### Exit criteria
- [x] The stack and project direction are documented.
- [x] The security baseline is documented.
- [x] Development and CI entry points exist.

## Phase 1: Student discovery and problem validation

**Status: NOT STARTED**

Building ahead of validation means this work is still necessary. It does not mean the current frontend should be discarded.

### Tasks
- [ ] Talk to a few Civil Engineering students from different year levels.
- [ ] Ask how they currently find reviewers and practice questions.
- [ ] Identify which topics are hardest to review and why.
- [ ] Ask which first-release workflow matters most: finding subjects, solving questions, understanding solutions, or tracking progress.
- [ ] Record a short, anonymized findings note in the repository.
- [ ] Update the MVP scope if the evidence contradicts the current assumptions.

### Exit criteria
A concise discovery note records the target user, the main study problem, what students currently use, and the most useful first workflow.

## Phase 2: MVP scope, user journey and UX specification

**Status: PARTIALLY COMPLETE**

### Decisions and work already recorded
- [x] Free-first, mobile-first BSCE reviewer using the national curriculum as a reference, with a note that university subject placement differs.
- [x] Four year levels, supplementary mathematics foundations, subject pages and a practice flow are defined in the scope and implemented in the app.
- [x] React + TypeScript + Vite + Tailwind, Cloudflare Pages and Supabase are the selected stack.
- [x] The deployed UI is the current visual baseline, so new wireframes are not a prerequisite for documenting the existing interface.
- [x] The MVP excludes student accounts, server-side student progress, public academic-content submissions, file uploads, a student-facing AI tutor and native mobile apps.
- [x] Content review, correction, attribution and publication rules are documented in [the content authoring policy](content-authoring-and-publication.md).
- [x] Proposed usability tasks and success measures are recorded in the [student pilot plan](plans/2026-10-15-student-pilot-plan.md).

### Still needed
- [ ] Complete Phase 1 discovery and use the findings to confirm the first target learner and most important study problem.
- [ ] Write the primary end-to-end user journey, from discovering a subject through learning/practice and choosing a next step.
- [ ] Validate the proposed pilot success measures with target students before recruiting participants.
- [ ] Record any scope changes supported by discovery; do not add new feature families based only on assumptions.

### Exit criteria
A short discovery summary identifies the target learner and key study problem; the main user journey and MVP boundaries are written down; and pilot measures are reviewed before recruitment. Preserve the deployed UI as the baseline unless student evidence justifies changes.

## Phase 3: Database, backend access, and security baseline

**Status: COMPLETE FOR THE CURRENT MVP DATA MODEL**

### Implemented and tested
- [x] Dedicated CEStudy Supabase project is active.
- [x] 72 catalog subjects are seeded. The live database currently contains 52 private practice-question records and 13 private lesson records, not public seed content.
- [x] Catalog, lesson, and practice tables have RLS and explicit client grants; lesson/question content is student-visible only when explicitly published.
- [x] Public clients can read the catalog but cannot insert, update, delete, or publish questions.
- [x] The practice-question read policy only exposes rows marked published.
- [x] All 52 practice questions and all 13 lessons are currently `needs-review`; published count is zero for both content tables.
- [x] Database migration and RLS tests are included in CI.
- [x] Default-permission hardening for new objects created by the standard migration owner is applied and tested.
- [x] Live browser checks confirmed the site uses the dedicated Supabase endpoint and a publishable key, not a privileged browser key.

### Boundaries
- Do not add Supabase Storage just to make the app feel complete. No file upload feature is currently in scope.
- Do not put a database password, service-role key, private key, or other secret in a Vite browser variable or committed file.
- Operational backup configuration and restore proof belong to Phase 7, not to the completed RLS work.

### Exit criteria
The current read-only catalog/practice data model denies unauthorized access and passes the existing tests. Any future feature that adds user data, private objects, or writes needs a new threat/access review before implementation.

## Phase 4: Frontend MVP implementation

**Status: COMPLETE FOR THE CURRENT MVP**

### Implemented
- [x] React + TypeScript + Vite + Tailwind CSS app.
- [x] Homepage and subject navigation.
- [x] Searchable/filterable 72-subject catalog.
- [x] Four year-level routes.
- [x] Mathematics Foundations hub.
- [x] Subject detail pages.
- [x] Basic Algebra practice screen with an unpublished-content review gate.
- [x] CHED curriculum context/source link.
- [x] Client-side route refresh support and baseline security headers.

### Still belongs to final polish
Accessibility, physical-device testing, empty/error-state review, copy clarity, final contact/correction link, and any usability changes found during the student pilot.

### Exit criteria
The core browsing flow works, the deployed app does not expose draft questions, and no additional MVP feature is added without a clear user need.

## Phase 5: Cloudflare Pages and Supabase integration

**Status: COMPLETE FOR INITIAL DEPLOYMENT**

### Evidence
- [x] Live web app: https://cestudy.pages.dev
- [x] Cloudflare Pages is connected to `justryan-n2d/CEStudy`, production branch `main`.
- [x] Build command is `npm run build`; output directory is `dist`.
- [x] Production browser variables are the CEStudy Supabase URL and publishable key.
- [x] Legacy failed Cloudflare Worker named `cestudy` was removed; a separate Worker is not required for the current architecture.
- [x] Latest production Chromium check [39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712) passed 135/135 checks after the publication-status correction and Privacy notice release, including direct routes, 320 px/1440 px overflow checks, live Supabase API/key validation, security headers, the published-only practice endpoint, and the CHED PDF link.

### Boundary
The site is technically deployed, but deployment is not the same as approval for a broad student launch.

## Phase 6: Automated and manual technical QA

**Status: PARTIALLY COMPLETE**

### Evidence already recorded
- [x] Earlier main CI run [38627053630](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053630) passed lint, tests, dependency audit, build, and isolated Supabase migration/RLS tests.
- [x] Earlier live browser smoke test [38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289) passed 70/70 checks. The latest post-correction and post-Privacy run [39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712) passed 135/135 checks.
- [x] Full-history Gitleaks scan [38627053653](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053653) passed at the time it ran.

### Remaining QA tasks
- [x] Current main CI [run 39142266631](https://github.com/justryan-n2d/CEStudy/actions/runs/39142266631) and full-history secret scan [run 39142266706](https://github.com/justryan-n2d/CEStudy/actions/runs/39142266706) passed after the privacy release. This documentation update is also subject to the required PR checks.
- [ ] Test catalog search and filter combinations, clearing filters, no-result states, and aliases.
- [ ] Complete a keyboard-only and screen-reader/accessibility review of the main pages.
- [ ] Test on the actual target Android phone and at desktop/tablet sizes.
- [ ] Verify direct loading and refresh on every public route.
- [ ] Re-check console/network errors and response headers after any deployment or CSP changes.
- [ ] Check loading, no-data, error, and slow-connection behavior.

### Exit criteria
Critical defects are fixed, the latest CI is green, routes work directly, and a human has completed the physical-device/accessibility checklist.

## Phase 7: Pre-launch hardening and release gates

**Status: CURRENT**

Work through these in order. Do not move to the student pilot until the blocking items are completed and documented.

### 7.1 Complete the real-backup recovery drill
- [x] Backup script on `main` targets the established singular bucket `cestudy-db-backup` and now requires all three tables `catalog_subjects`, `practice_questions`, and `subject_lessons`, logging each table after validation.
- [x] Fresh current-state archive delivery on 2026-10-20: [39433566649](https://github.com/justryan-n2d/CEStudy/actions/runs/39433566649) succeeded. The encrypted archive was uploaded and read back for SHA-256 verification, the marker check completed, and retention kept four verified sets while hiding three stale/incomplete artifacts. This attempt predates the corrected validator; see the following open check.
- [x] Run a fresh backup from the corrected main validator: [run 41290656868](https://github.com/justryan-n2d/CEStudy/actions/runs/41290656868) explicitly logged all three required tables as verified, read back the encrypted archive/checksum/marker, and completed retention.
- [x] CI tests exercise encryption, decryption, corrupted-tag rejection, backup syntax, and retention behavior. This uses a temporary test key and test data, not the actual production backup.
- [ ] Confirm the Backblaze lifecycle rule deletes hidden old versions without hiding current backups.
- [ ] Confirm GitHub Actions failure email notifications are enabled in account settings.
- [ ] Keep the private decryption key and passphrase securely outside GitHub, with a protected recovery copy.
- [x] Decrypt the real B2 backup in Termux; checksum and marker hashes matched, AES-GCM authentication succeeded, and `pg_restore --list` read the PostgreSQL 17.11 custom-format archive.
- [x] Restore the actual dump into isolated local PostgreSQL 18.2 using `--schema=public --no-owner --no-acl --exit-on-error`; validate data counts, RLS, published-only visibility, and client privileges. Evidence: [restore drill](deployment/restore-drill-2026-10-16.md).
- [ ] Restore/rehearse against a separate managed Supabase project and validate the target-specific behavior. The local restore does not test Supabase-managed roles/system schemas/settings; never use production as the target.
- [x] Record the completed local restore evidence, while keeping managed-Supabase-target recovery explicitly untested.

Follow [weekly backup setup](deployment/weekly-backups.md) and [backup/recovery plan](deployment/backup-and-recovery.md).

### 7.2 Protect future unpublished question content without changing repository visibility

- [x] Keep the GitHub repository public by decision; the original eight drafts are accepted as disclosed. No history rewrite or visibility migration is needed for those questions.
- [x] Remove the real practice-question INSERT block from the current public `supabase/seed.sql`; it now seeds public catalog metadata only.
- [x] Replace educational-looking test question examples with synthetic placeholders and make the RLS test create generic published/unpublished fixtures inside a rolled-back transaction.
- [x] Add a CI guard that fails if practice-question INSERTs, `practice_seed`, `correct_answer`, or `solution_steps` return to the public seed.
- [x] Document the Supabase-only workflow for future drafts in [unpublished question authoring and publication](content-authoring-and-publication.md).
- [x] Confirm the CI guard and Cloudflare Pages production deployment succeeded; the latest production smoke test [39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712) confirmed the catalog loads and the published-only practice API returns zero questions.
- [x] Verify the active `main` branch ruleset requires PRs and successful CI plus full-history secret scan: [Protect main ruleset](https://github.com/justryan-n2d/CEStudy/rules/25242389).
- [x] Publication policy and owner-only review workflow require explicit maintainer review; actual academic review and individual approvals are tracked in Phase 8.

### 7.3 Protect the main branch and rerun security checks
- [x] The `main` ruleset requires a pull request and passing CI checks.
- [x] CI, Supabase migration/RLS tests, and full-history secret scan are required without a required approval count that a single maintainer cannot meet.
- [x] Branch deletion and force-pushes are blocked; verification PR [#13](https://github.com/justryan-n2d/CEStudy/pull/13) passed its required checks.
- [x] Main CI passed lint, tests, dependency audit, build/header packaging, backup crypto/retention checks, and isolated Supabase migration/RLS tests after the audit and Privacy notice changes: [run 39142266631](https://github.com/justryan-n2d/CEStudy/actions/runs/39142266631). The matching full-history secret scan passed: [run 39142266706](https://github.com/justryan-n2d/CEStudy/actions/runs/39142266706).
- [ ] Verify Cloudflare browser variables contain only the CEStudy Supabase URL and publishable key.
- [ ] Record the final security review and any accepted limitations.

### 7.4 Finish launch documentation and user safeguards
- [x] Provide clear Contact, Feedback, and Report a bug routes.
- [x] Document how users report a wrong question, broken CHED link, or copyright concern, and how the maintainer reviews/corrects/removes content in the [content authoring and publication policy](content-authoring-and-publication.md) and [public Privacy notice](https://cestudy.pages.dev/privacy).
- [x] Add the public [Privacy notice](https://cestudy.pages.dev/privacy) describing browser-local study data, feedback/support messages, bug-report email drafts, and service providers without claiming analytics or account features that are not currently in production.
- [x] The current MVP remains no-account/no-upload by decision. Optional Google sign-in/history/streak is not in production; PR #67 remains a separate draft candidate.

### 7.5 Final production QA
- [x] Run the production Chromium checklist after the publication-status correction and Privacy notice release: [run 39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712), 135/135 checks passed. Physical-device accessibility QA remains open.
- [x] Confirm zero draft lesson or question rows are visible via the public API: post-correction anonymous SQL checks returned zero rows from both content tables, and the live Chromium test verified the published-only practice endpoint returned zero questions.
- [x] Confirm required response headers, direct routes, responsive widths, and the official CHED curriculum PDF using [production Chromium run 39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712), which passed 135/135 checks.
- [ ] Finish the full search/filter edge-case matrix and no-results recovery checks; earlier browser tests covered only key paths and combinations.
- [ ] Check the site from a signed-out/private browser and the actual Android phone.
- [x] Update project status, README, phase plan, launch checklist, and audit record with the latest main CI/secret scan and production Chromium smoke evidence in this documentation change.

### Phase 7 exit criteria

Phase 7 is complete only when the following technical and operational evidence is current and recorded:

- [x] A fresh backup on `main` used the corrected three-table validator and verified archive, checksum and marker read-back with successful retention: [run 41290656868](https://github.com/justryan-n2d/CEStudy/actions/runs/41290656868).
- [ ] The refreshed backup is restored to a separate managed Supabase test project, after cost approval, and table counts, RLS, client grants and published-only access are validated. Production must never be the test restore target.
- [ ] Backblaze B2 hidden-version lifecycle behavior is checked without hiding current verified backups; GitHub Actions failure-email settings and protected recovery-key copies are confirmed.
- [ ] Physical Android-device, keyboard/screen-reader, touch-target and text-zoom checks are recorded; the remaining search/filter/no-results and loading/error-state matrix is tested.
- [ ] Current production variables and the final security review are checked and documented. The latest existing Chromium evidence is [run 39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712), which passed 135/135 checks on 2026-10-18; rerun it if a relevant production change is made.
- [x] Current MVP remains no-account/no-upload; optional account features stay out of production unless separately approved.

Phase 7 is a technical-readiness gate, not a declaration that content has been academically approved or that a student pilot has occurred. Human content approval belongs to Phase 8, the controlled pilot to Phase 9, and the broad launch decision to Phase 10. Phases 8 and 9 must not bypass the relevant earlier gates.

## Phase 8: Human content review and approved publishing

**Status: PARTIALLY COMPLETE: REVIEW TOOLING EXISTS; HUMAN APPROVAL HAS NOT STARTED**

The content workflow is implemented, but the content itself is not approved. On the live database check on 2026-10-19, all 52 questions and all 13 lessons remain `needs-review`; zero are published and zero are marked verified. The October 18 AI-assisted consistency pass found no definite answer mismatch, but it is not independent academic approval. See the [Stage 1 audit record](reviews/2026-10-18-stage1-content-and-publication-audit.md).

### Implemented foundation
- [x] Owner-only content review page at `/owner/content-review`, backed by the `content-review-admin` Supabase Edge Function.
- [x] Review API supports controlled edits and explicit review-status actions; owner sessions use short-lived tokens.
- [x] Unpublished lesson/question content and private review metadata are protected by database RLS and column-level privileges. Public APIs request published content only.
- [x] Real unpublished content is kept in the private CEStudy database, not inserted into the public seed.
- [x] Structural checks confirmed the current 52 questions have required fields, unique choices and one matching stored correct answer each; automated checks do not establish academic correctness, originality or rights.

### Remaining human-approval work
- [ ] Identify a qualified human reviewer for the mathematics and engineering content.
- [ ] Review each proposed item for accuracy, clear wording, answer options, solution steps, source attribution, originality and rights to use.
- [ ] Record reviewer role, review date, approval/rejection and correction notes without exposing private content in public Git.
- [ ] Keep uncertain or rejected items unpublished; use `needs-review`, `correction-required` or another appropriate non-public state.
- [ ] Publish only the items that the responsible reviewer has explicitly approved.
- [ ] Recheck the live API and student-facing UI after the first publication batch.

### Exit criteria
A small, useful initial set of lessons/questions has documented human approval, its sources and usage rights are recorded, and a live check confirms that only intentionally approved/published items are visible to students.

## Phase 9: Controlled student pilot

**Status: NOT STARTED**

Use the existing [controlled student pilot plan](plans/2026-10-15-student-pilot-plan.md). No pilot has run yet. Do not start until Phase 7 technical release blockers are cleared. Catalog/navigation tasks can be tested without practice questions, but any practice task must use content explicitly approved and published through Phase 8.

### Tasks
- [ ] Invite 5–8 volunteer Civil Engineering students, ideally across the early year levels.
- [ ] Explain that this is an optional usability pilot, not a graded activity.
- [ ] Ask participants to find subjects, use search/filter controls, open a detail page, refresh the route, and locate the curriculum source.
- [ ] Collect anonymous task results and brief feedback. Avoid student IDs, grades, passwords, and unnecessary personal details.
- [ ] Use the proposed measures: at least 80% task completion without help, zero critical privacy/security incidents, no blocking layout defects, and median ease score of at least 4/5.
- [ ] Record issues, changes made, remaining known limits, and a go/no-go decision.

### Exit criteria
The pilot is documented, critical issues are fixed or explicitly deferred, and there is evidence supporting a wider launch decision.

## Phase 10: Final polish and broad public launch

**Status: NOT STARTED**

This is the formal public-launch stage. The site is already reachable at its Pages URL, but the broader announcement should wait for the earlier gates.

### Final polish
- [ ] Fix high-impact pilot feedback and repeat the affected tests.
- [ ] Review mobile spacing, tap targets, text contrast, focus states, headings, and empty/error messages.
- [ ] Proofread page copy, subject naming, curriculum note, and all published explanations.
- [ ] Check page titles, favicon/app mark, social sharing metadata, and basic search-engine preview.
- [ ] Check that the contact/correction and privacy notices are easy to find.
- [ ] Confirm there is no accidental secret, draft question, test content, or debug output in the production build.
- [ ] Verify the correct production branch and latest deployment commit in Cloudflare Pages.
- [ ] Keep the default `cestudy.pages.dev` URL for now. Custom domain purchase and configuration are intentionally deferred.

### Go/no-go checklist
- [ ] Latest CI and secret scan are green.
- [ ] Production checks pass on mobile and desktop.
- [ ] Database access rules and unpublished-content privacy are verified.
- [ ] Human-approved content is published and attribution is correct.
- [ ] Backup plus restore drill evidence is recorded.
- [ ] Contact/correction/privacy information is available.
- [ ] Student pilot feedback is reviewed and launch decision is documented.
- [ ] Maintainer explicitly approves the broad launch.

### Release sequence
1. Make any final code/content changes through the protected workflow.
2. Verify the production deployment and its commit.
3. Open the site in a signed-out browser and on mobile.
4. Announce CEStudy to the intended audience with a clear early-stage feedback route.
5. Monitor feedback and disable or roll back a problematic feature if a serious privacy, security, or correctness issue appears.

### Exit criteria
The go/no-go checklist is complete, the launch decision is documented, and the public announcement has been made.

## Locked product direction: combined library + guided learning (2026-10-18)

CEStudy will combine free browsing of a comprehensive engineering knowledge library with optional guided learning paths and personal progress tracking. This decision is approved for incremental implementation without replacing the current MVP or weakening the launch gates above.

- Free browsing of catalog subjects, year levels, mathematics foundations, and any published topic remains available without enrollment or an account.
- Guided learning is optional. Published lessons may be followed in sequence, with previous/next navigation and practice activities when approved content exists.
- The first progress feature records completed published lessons locally in the browser only and shows a flame streak for consecutive local calendar days with at least one completion. Multiple lessons in one day count once. It does not add student accounts, server-side progress writes, analytics, or cross-device sync.
- The progress page must be clear about local-only storage and allow students to delete their progress.
- Future lesson content must be original, technically reviewed, and properly attributed. Only published material can appear to students.
- Expand the library and guided paths gradually, based on content readiness and student feedback. Evaluate account syncing and native Android/iOS apps as separate later decisions with privacy, security, cost, and UX reviews.

The approved first slice and its acceptance criteria are maintained in [the combined learning model decision](product/COMBINED_LEARNING_MODEL.md). The current Phase 7 production, content, backup, accessibility, and pilot gates still apply.

## Phase 11: Ongoing operations and future expansion

**Status: PARTIALLY IMPLEMENTED; BROADER EXPANSION DEFERRED**

This phase is not wholly untouched. The repository already has CI and required branch checks, a scheduled secret scan, a weekly encrypted database-backup workflow, feedback/contact/correction paths and owner-only review tooling. The local lesson-progress and streak feature is implemented on the current main branch in `src/data/learning-progress.ts`, `src/pages/StudyPage.tsx` and `src/pages/ProgressPage.tsx`. Those implementations do not mean every operational safeguard is finished; current-state backup recovery and manual release checks remain Phase 7 blockers.

### Ongoing maintenance still required
- [ ] Monitor dependency/security updates, failed workflows, and hosting/database costs.
- [ ] Keep scheduled backups healthy, confirm retention settings, and repeat restore drills. See Phase 7 for outstanding current-state recovery evidence.
- [ ] Review reports and correction requests; keep source, reviewer and publication records current.
- [ ] Limit collected information and describe any new data collection in the privacy notice before it ships.

### Future features, only after evidence supports them
- Optional bookmarks and review queues after the current workflow is evaluated with students.
- Accounts and cross-device study progress only after student research and a separate privacy/security review. Optional Google sign-in/history/streak remains in the consolidated draft [PR #67](https://github.com/justryan-n2d/CEStudy/pull/67), not in production.
- Trusted content-management expansions or moderated public submissions.
- Offline-friendly reviewer sets.
- Broader verified practice content across all BSCE subjects.
- An optional AI Study Helper only after a separate accuracy, privacy, security and cost review.
- Android/iOS delivery only after the web product proves useful and a mobile approach is approved.

The local progress/streak feature is already implemented, but actual lesson completion cannot be meaningfully used until reviewed lessons are published. These longer-term features are not blockers for the current no-account web MVP.

## Immediate next actions

1. **Finish remaining Phase 7 technical blockers:** the corrected three-table live backup has passed in run 41290656868. Rehearse restore into a separate managed Supabase test project only after cost approval. Confirm B2 lifecycle behavior, protected recovery-key copies and GitHub failure-email settings.
2. **Finish Phase 6/7 manual QA:** complete the actual Android-device, keyboard/TalkBack, text-zoom/touch-target, direct-route and search/filter/no-results matrix; record the final security review. Re-run production checks after relevant changes.
3. **Complete Phase 1/2 catch-up work in parallel:** document student discovery, the primary user journey and validated pilot measures. Keep the existing deployed UI as the design baseline; do not rebuild completed screens just to create retrospective wireframes.
4. **Complete Phase 8 content review:** identify a qualified reviewer, review the intended initial lesson/question set, record rights and decisions, and publish only explicitly approved items.
5. **Run Phase 9 pilot:** invite the planned 5–8 students only after Phase 7 blockers pass; use published questions only if Phase 8 has approved them. Record anonymous results and a go/no-go recommendation.
6. **Complete Phase 10 polish and launch approval:** resolve critical pilot issues, confirm production, finish metadata/accessibility review and record the owner's launch decision.
7. Keep consolidated account candidate PR #67 in draft until product-roadmap Phases 3 and 4 are complete, its branch is reconciled against current `main`, and OAuth setup plus end-to-end callback, sign-out, privacy and account-isolation gates pass. PR #44 and PR #64-#66 are not independent merge targets.

## Detailed supporting documents

- [Current project status](PROJECT_STATUS.md)
- [Security requirements](SECURITY_REQUIREMENTS.md)
- [Project scope](PROJECT_SCOPE.md)
- [Pre-launch checklist](deployment/launch-checklist.md)
- [Cloudflare Pages setup](deployment/cloudflare-pages.md)
- [Supabase setup](deployment/supabase-setup.md)
- [Repository privacy and branch protection](deployment/github-privacy-and-branch-protection.md)
- [Weekly backup setup](deployment/weekly-backups.md)
- [Backup and recovery plan](deployment/backup-and-recovery.md)
- [Controlled student pilot plan](plans/2026-10-15-student-pilot-plan.md)
