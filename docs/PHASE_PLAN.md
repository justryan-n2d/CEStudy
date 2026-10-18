# CEStudy: Organized Project Phases and Release Plan

**Last reviewed:** 2026-10-18  
**Live website:** https://cestudy.pages.dev  
**Current phase:** **Phase 7, Pre-launch hardening and release gates**  
**Launch status:** The web MVP is deployed, but the broad student launch is not approved.

This is the canonical phase plan for CEStudy. Use this file for the overall order and status of work. The detailed deployment, database, security, backup, and pilot documents linked below remain the step-by-step references for those tasks.

## Where we are now

CEStudy is **past initial frontend development and is now in release hardening**. The live site has a 72-subject catalog, year-level routes, Mathematics Foundations, subject detail pages, a practice area, and a public Privacy notice at `/privacy`. The dedicated Supabase database currently has 52 practice questions and 13 lesson records, all `needs-review`; there are zero published questions and zero published lessons. On 2026-10-18, two lesson records that were marked published despite draft notes were returned to `needs-review`, and the catalog now marks Algebra Foundations as `in-preparation`. After the correction and Privacy notice release, the latest production Chromium smoke test [run 39145884002](https://github.com/justryan-n2d/CEStudy/actions/runs/39145884002) passed **135/135 checks** with no failures, including direct routes, security headers, privacy route, responsive widths, the live Supabase connection and zero published practice questions. See the [Stage 1 audit record](reviews/2026-10-18-stage1-content-and-publication-audit.md).

The current job is to make the deployed MVP safe and reliable enough for a controlled student pilot. Do not describe the site as fully launch-ready until the remaining release gates pass.

### What “storage” means for CEStudy

- **Supabase database:** In use. The 72 catalog subjects, 52 practice questions, and 13 lesson records are stored in PostgreSQL. All 52 questions and all 13 lessons are currently `needs-review`; no questions or lessons are published. Student-facing RLS checks returned zero published lessons and zero published questions to the anonymous role.
- **Supabase Storage buckets:** **Not configured, and not needed for the current MVP.** The app currently has no user-uploaded files or private media. Do not add a bucket unless an approved feature requires file/object storage.
- **Database backup storage:** The actual encrypted October 15 backup was decrypted and restored into isolated local PostgreSQL. A fresh backup of the current database after the October 18 publication correction then passed on attempt 2 of [run 38773249088](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088): archive and checksum uploaded to private Backblaze B2, archive read back through SHA-256 verification, and retention completed with three verified sets kept and no stale/incomplete artifacts pruned. A managed-Supabase-target restore, B2 lifecycle cleanup, and GitHub failure-email preferences remain unverified. See [restore-drill evidence](deployment/restore-drill-2026-10-16.md).

## Status meanings

- **Complete:** The phase's defined work has been implemented and there is evidence for it.
- **Partially complete:** Some work is implemented, but one or more planned items or exit criteria remain.
- **Current:** This is the active phase and the next work should focus here.
- **Not started:** No completion evidence has been recorded yet.
- **Deferred:** Intentionally excluded from the current release.

A phase can be partially complete even when a later phase has already been built. CEStudy's first deployment happened before student discovery and all product-validation work were documented, so this plan tracks actual evidence instead of pretending the phases happened in a perfect sequence.

## Phase overview

| Phase | Name | Status | Main result |
|---|---|---|---|
| 0 | Repository and project foundation | **Complete** | Repository, stack, scope notes, security requirements, and core development workflow exist. |
| 1 | Student discovery and problem validation | **Not started** | Confirm the first users and the study problem with real student feedback. |
| 2 | MVP scope, user journey, and UX specification | **Partially complete** | Core scope and architecture are selected; discovery evidence, success targets, and wireframes are incomplete. |
| 3 | Database, backend access, and security baseline | **Complete for the current MVP** | Supabase schema, catalog, draft-question states, grants, RLS, and database tests are implemented. Backup operations remain a Phase 7 release gate. |
| 4 | Frontend MVP implementation | **Complete for the current MVP** | The main browsing and practice UI is built and deployed. Remaining design/accessibility polish is tracked in Phase 7. |
| 5 | Cloudflare Pages and Supabase integration | **Complete for initial deployment** | The live site uses the dedicated CEStudy Supabase project and the Pages deployment is active. |
| 6 | Automated and manual technical QA | **Partially complete** | The latest production Chromium smoke test [39145884002](https://github.com/justryan-n2d/CEStudy/actions/runs/39145884002) passed 135/135 checks after the Privacy notice release. Physical-device/accessibility review and some search/filter edge cases remain. |
| 7 | Pre-launch hardening and release gates | **CURRENT** | The local restore of the older encrypted backup is proven, and the main-branch ruleset is active. A fresh current-state encrypted backup passed on [run 38773249088, attempt 2](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088); production Chromium passed 135/135 checks. Managed-Supabase-target recovery, B2 lifecycle cleanup, GitHub failure-email verification, physical-device QA, independent content review, and the student pilot remain. Future question content stays out of public source. |
| 8 | Human content review and approved question publishing | **Not started** | Have a qualified human review each question and only publish content that passes the review process. |
| 9 | Controlled student pilot | **Not started** | Run the planned 5–8-student usability pilot after blocking release gates pass. |
| 10 | Final polish and broad public launch | **Not started** | Fix pilot findings, complete sign-off, and then announce the wider release. |
| 11 | Ongoing operations and future expansion | **Deferred until after launch** | Maintain content, security, costs, backups, and feedback before considering new features. |

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

## Phase 2: MVP scope, user journey, and UX specification

**Status: PARTIALLY COMPLETE**

### Already decided
- Free-first, mobile-first Civil Engineering reviewer.
- National BSCE curriculum as a reference, with a note that subject placement differs by university.
- Four year levels, foundations content, subject pages, and a practice flow.
- No student-facing AI tutor, AI-generated questions, sign-in, public submissions, or native mobile app in this MVP.
- The existing React/Vite/Tailwind stack and Supabase/Cloudflare architecture.

### Still needed
- [ ] Write a one-page main user journey from homepage to finding a subject or completing a practice task.
- [ ] Record the first target user and specific MVP problem after Phase 1 discovery.
- [ ] Agree on pilot success measures before recruiting students.
- [ ] Create or document the mobile-first wireframes for the main pages, or explicitly record that the implemented UI serves as the current baseline.
- [ ] Define the content review, correction, attribution, and publication workflow.
- [ ] Confirm the MVP requires no student accounts or file uploads.

### Exit criteria
The main user journey, included/excluded features, feedback path, and pilot measures are written down. Avoid expanding the scope before these are clear.

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
- [x] Latest production Chromium check [39145884002](https://github.com/justryan-n2d/CEStudy/actions/runs/39145884002) passed 135/135 checks after the publication-status correction and Privacy notice release, including direct routes, 320 px/1440 px overflow checks, live Supabase API/key validation, security headers, the published-only practice endpoint, and the CHED PDF link.

### Boundary
The site is technically deployed, but deployment is not the same as approval for a broad student launch.

## Phase 6: Automated and manual technical QA

**Status: PARTIALLY COMPLETE**

### Evidence already recorded
- [x] Earlier main CI run [38627053630](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053630) passed lint, tests, dependency audit, build, and isolated Supabase migration/RLS tests.
- [x] Earlier live browser smoke test [38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289) passed 70/70 checks. The latest post-correction and post-Privacy run [39145884002](https://github.com/justryan-n2d/CEStudy/actions/runs/39145884002) passed 135/135 checks.
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
- [x] Corrected script on `main` uses the existing singular bucket `cestudy-db-backup`.
- [x] Successful live backup run [38773249088](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088) verified uploaded encrypted bytes, checksum, verification marker, and retention.
- [x] CI tests exercise encryption, decryption, corrupted-tag rejection, backup syntax, and retention behavior. This uses a temporary test key and test data, not the actual production backup.
- [ ] Confirm the Backblaze lifecycle rule deletes hidden old versions without hiding current backups.
- [x] Fresh encrypted off-site backup run after the 2026-10-18 live publication correction: [workflow run 38773249088, attempt 2](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088). The encrypted archive and checksum were uploaded to private B2, the archive was read back and SHA-256 verified, and retention completed with three verified sets kept and no stale/incomplete artifacts pruned.
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
- [x] Confirm the CI guard and Cloudflare Pages production deployment succeeded; the latest production smoke test [39145884002](https://github.com/justryan-n2d/CEStudy/actions/runs/39145884002) confirmed the catalog loads and the published-only practice API returns zero questions.
- [x] Verify the active `main` branch ruleset requires PRs and successful CI plus full-history secret scan: [Protect main ruleset](https://github.com/justryan-n2d/CEStudy/rules/25242389).
- [ ] Continue to require human review before changing any future question to `published`.

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
- [ ] Confirm the current MVP does not require student accounts, private uploads, or extra personal-data collection.

### 7.5 Final production QA
- [x] Run the production Chromium checklist after the publication-status correction and Privacy notice release: [run 39145884002](https://github.com/justryan-n2d/CEStudy/actions/runs/39145884002), 135/135 checks passed. Physical-device accessibility QA remains open.
- [x] Confirm zero draft lesson or question rows are visible via the public API: post-correction anonymous SQL checks returned zero rows from both content tables, and the live Chromium test verified the published-only practice endpoint returned zero questions.
- [x] Confirm required response headers, direct routes, responsive widths, and the official CHED curriculum PDF using [production Chromium run 39145884002](https://github.com/justryan-n2d/CEStudy/actions/runs/39145884002), which passed 135/135 checks.
- [ ] Finish the full search/filter edge-case matrix and no-results recovery checks; earlier browser tests covered only key paths and combinations.
- [ ] Check the site from a signed-out/private browser and the actual Android phone.
- [x] Update project status, README, phase plan, launch checklist, and audit record with the latest main CI/secret scan and production Chromium smoke evidence in this documentation change.

### Phase 7 exit criteria
The older encrypted backup has been restored into isolated local PostgreSQL, but it predates the 2026-10-18 publication correction. The current-state encrypted backup then passed on [run 38773249088, attempt 2](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088), but it has not yet been restored into a managed Supabase target. B2 lifecycle and GitHub failure-email confirmation, physical-device/accessibility QA, human content approval, and the student pilot remain before broad release. Latest production smoke evidence is [run 39145884002](https://github.com/justryan-n2d/CEStudy/actions/runs/39145884002), with 135/135 checks passed.

## Phase 8: Human content review and approved question publishing

**Status: NOT STARTED**

The original eight questions have a separate initial pre-review record. On 2026-10-18, a first-pass AI-assisted mathematical and option-structure consistency audit covered the current 52-question bank. No definite arithmetic/answer mismatch was identified in that pass, and database checks confirmed all 52 records have unique options and the stored correct answer appears exactly once. This is not independent academic approval. All 52 questions and all 13 lessons remain `needs-review` and unpublished. See the [2026-10-18 audit record](reviews/2026-10-18-stage1-content-and-publication-audit.md).

### Tasks
- [ ] Identify a qualified human reviewer familiar with the relevant mathematics.
- [ ] Review every prompt, answer option, correct answer, solution step, explanation, wording, and attribution.
- [ ] Verify that original or sourced material has appropriate rights and attribution.
- [ ] Record reviewer, review date, result, and correction notes without exposing secrets.
- [ ] Keep any rejected or uncertain question in a non-published state.
- [ ] Publish only the questions that have passed the human review.
- [ ] Re-test the public API and UI to confirm only intentionally published records are visible.

### Exit criteria
A small, useful, reviewed practice set is available, and publication status is controlled by the trusted maintainer rather than by public clients.

## Phase 9: Controlled student pilot

**Status: NOT STARTED**

Use the existing [controlled student pilot plan](plans/2026-10-15-student-pilot-plan.md). Do not start the pilot until Phase 7 release blockers are cleared. Practice tasks must use only human-approved questions.

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

**Status: DEFERRED UNTIL AFTER LAUNCH**

### Ongoing maintenance
- Keep dependencies and CI current.
- Review security notices, access policies, failed runs, and storage/hosting costs.
- Confirm scheduled backups and periodically repeat restore drills.
- Correct reported errors and keep content-source records.
- Monitor only the minimum information needed to operate the service, and explain any collection clearly.

### Future features, only after evidence supports them
- Local-only progress tracking for published lessons is approved as the first incremental implementation.
- Optional bookmarks and review queues may follow if student feedback supports them.
- Accounts and synced study progress remain deferred pending student research and a separate privacy/security review.
- Trusted content-management tools or moderated submissions.
- Offline-friendly reviewer sets.
- More verified practice content.
- An optional AI Study Helper, only after a separate accuracy, privacy, security, and cost review.
- Android/iOS delivery only after the web product proves useful.

These are not blockers for the current no-account web MVP and should not distract from completing the release gates.

## Immediate next actions

1. Run and verify a fresh encrypted database backup after the 2026-10-18 publication-status correction. The known October 15 snapshot predates the current 52-question/13-lesson state.
2. Restore that refreshed backup into a separate temporary Supabase project only after explicit cost approval; the local application-schema restore does not test managed Supabase roles/system settings. A Supabase branch has an estimated usage cost of $0.01344 per hour while active.
3. Confirm the Backblaze B2 lifecycle rule and GitHub failure-email notifications, then run a fresh live Chromium smoke test after the database correction.
4. Complete physical-device accessibility QA, direct-route/refresh checks, search/filter edge cases, and privacy notice review. Configure and test Google OAuth end to end before the account features leave draft.
5. Identify a qualified human reviewer, review and approve specific lessons/questions, and publish only approved items.
6. Run the controlled student pilot, fix high-impact issues, and record the go/no-go decision.
7. Complete final polish and only then make a broad launch announcement.

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
