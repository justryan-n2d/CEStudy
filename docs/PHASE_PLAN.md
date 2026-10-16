# CEStudy: Organized Project Phases and Release Plan

**Last reviewed:** 2026-10-16  
**Live website:** https://cestudy.pages.dev  
**Current phase:** **Phase 7, Pre-launch hardening and release gates**  
**Launch status:** The web MVP is deployed, but the broad student launch is not approved.

This is the canonical phase plan for CEStudy. Use this file for the overall order and status of work. The detailed deployment, database, security, backup, and pilot documents linked below remain the step-by-step references for those tasks.

## Where we are now

CEStudy is **past the storage setup stage and past initial frontend development**. The deployed app already has a React frontend, a 72-subject catalog, year-level routes, Mathematics Foundations, subject detail pages, and a Basic Algebra practice screen. It connects to the dedicated Supabase database. The deployment passed an automated Chromium check with 70/70 checks, and an earlier CI run passed lint, tests, dependency audit, build, and database security tests.

The current job is to make the deployed MVP safe and reliable enough for a controlled student pilot. Do not describe the site as fully launch-ready until the remaining release gates pass.

### What “storage” means for CEStudy

- **Supabase database:** In use. The 72 catalog subjects and eight draft practice questions are stored in PostgreSQL tables. RLS and read-only public access have been tested.
- **Supabase Storage buckets:** **Not configured, and not needed for the current MVP.** The app currently has no user-uploaded files or private media. Do not add a bucket unless an approved feature requires file/object storage.
- **Database backup storage:** One real encrypted database backup was successfully uploaded and read-back verified in GitHub Actions run [38773249088](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088), under the private Backblaze B2 bucket `cestudy-db-backup/termux/weekly/`. The scheduler, verification, and four-set retention are automated. The full decrypt and separate-database restore drill, B2 lifecycle cleanup, and GitHub failure-email preferences still need confirmation.

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
| 6 | Automated and manual technical QA | **Partially complete** | Initial CI and 70/70 live Chromium checks passed; full accessibility and physical-device review plus some search/filter edge cases remain. |
| 7 | Pre-launch hardening and release gates | **CURRENT** | Verify backup recovery, enforce future-question content separation, configure branch protection, complete final QA, and update release documentation. |
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
- [x] 72 catalog subjects and eight draft Basic Algebra questions are seeded.
- [x] Both exposed tables have RLS and explicit client grants.
- [x] Public clients can read the catalog but cannot insert, update, delete, or publish questions.
- [x] The practice-question read policy only exposes rows marked published.
- [x] All eight draft questions remain `needs-review`; the published count is zero.
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
- [x] Live Chromium check [38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289) passed 70/70 checks, including six routes, 320 px/1440 px overflow checks, the live catalog API, security headers, and the CHED PDF link.

### Boundary
The site is technically deployed, but deployment is not the same as approval for a broad student launch.

## Phase 6: Automated and manual technical QA

**Status: PARTIALLY COMPLETE**

### Evidence already recorded
- [x] Earlier main CI run [38627053630](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053630) passed lint, tests, dependency audit, build, and isolated Supabase migration/RLS tests.
- [x] Live browser smoke test [38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289) passed 70/70 checks.
- [x] Full-history Gitleaks scan [38627053653](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053653) passed at the time it ran.

### Remaining QA tasks
- [ ] Re-run CI and the secret scan on the latest phase-plan commit and any final code changes; use the latest run result, not a previous green run, as release evidence.
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
- [ ] Confirm GitHub Actions failure email notifications are enabled in account settings.
- [ ] Keep the private decryption key and passphrase securely outside GitHub, with a protected recovery copy.
- [ ] Decrypt the real B2 backup on Termux and confirm `pg_restore --list` succeeds.
- [ ] Restore the real dump into a separate temporary Supabase database, validate record counts, grants, RLS, and published-only question visibility, and record evidence. Never test restore against production.
- [ ] Update backup status to fully recovery-tested only after the isolated full restore passes.

Follow [weekly backup setup](deployment/weekly-backups.md) and [backup/recovery plan](deployment/backup-and-recovery.md).

### 7.2 Protect future unpublished question content without changing repository visibility

- [x] Keep the GitHub repository public by decision; the original eight drafts are accepted as disclosed. No history rewrite or visibility migration is needed for those questions.
- [x] Remove the real practice-question INSERT block from the current public `supabase/seed.sql`; it now seeds public catalog metadata only.
- [x] Replace educational-looking test question examples with synthetic placeholders and make the RLS test create generic published/unpublished fixtures inside a rolled-back transaction.
- [x] Add a CI guard that fails if practice-question INSERTs, `practice_seed`, `correct_answer`, or `solution_steps` return to the public seed.
- [x] Document the Supabase-only workflow for future drafts in [unpublished question authoring and publication](content-authoring-and-publication.md).
- [ ] After merge, confirm the CI guard passes, the Cloudflare Pages production deployment succeeds, and the live site still loads the catalog and published-only practice review gate.
- [ ] Configure a `main` branch ruleset requiring PRs and successful CI plus full-history secret scan. Branch protection is a separate release gate.
- [ ] Continue to require human review before changing any future question to `published`.

### 7.3 Protect the main branch and rerun security checks
- [ ] Configure a `main` ruleset that requires a pull request and passing CI checks.
- [ ] Require the relevant CI app/database checks and full-history secret scan. Do not require an approval count that a single maintainer cannot meet.
- [ ] Block force-pushes and verify the rule with a small documentation pull request.
- [ ] Re-run dependency audit, CI, and secret scanning after repository and code changes.
- [ ] Verify Cloudflare browser variables contain only the CEStudy Supabase URL and publishable key.
- [ ] Record the final security review and any accepted limitations.

### 7.4 Finish launch documentation and user safeguards
- [ ] Provide a clear feedback/contact route.
- [ ] Document how users report a wrong question, broken CHED link, or copyright concern, and how the maintainer corrects or removes content.
- [ ] Add a short privacy notice appropriate to the actual release. Do not claim data practices or analytics that are not implemented.
- [ ] Confirm the current MVP does not require student accounts, private uploads, or extra personal-data collection.

### 7.5 Final production QA
- [ ] Run the Phase 6 checklist on the latest production deployment.
- [ ] Confirm there are zero draft questions visible through the public UI or public API.
- [ ] Confirm required response headers, direct routes, mobile layouts, search/filter behavior, and official curriculum links.
- [ ] Check the site from a signed-out/private browser and the actual Android phone.
- [ ] Update the status page with links to the latest successful run evidence.

### Phase 7 exit criteria
Backup and restore have been proven; future-question content is kept out of public source and branch protection is checked; latest CI/security checks pass; the privacy/feedback path exists; and manual accessibility/device/production QA is recorded.

## Phase 8: Human content review and approved question publishing

**Status: NOT STARTED**

The eight Basic Algebra questions have an initial mathematical consistency pre-review, but that is not independent academic approval. All eight remain unpublished.

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

## Phase 11: Ongoing operations and future expansion

**Status: DEFERRED UNTIL AFTER LAUNCH**

### Ongoing maintenance
- Keep dependencies and CI current.
- Review security notices, access policies, failed runs, and storage/hosting costs.
- Confirm scheduled backups and periodically repeat restore drills.
- Correct reported errors and keep content-source records.
- Monitor only the minimum information needed to operate the service, and explain any collection clearly.

### Future features, only after evidence supports them
- Bookmarks or progress tracking.
- Accounts and synced study progress.
- Trusted content-management tools or moderated submissions.
- Offline-friendly reviewer sets.
- More verified practice content.
- An optional AI Study Helper, only after a separate accuracy, privacy, security, and cost review.
- Android/iOS delivery only after the web product proves useful.

These are not blockers for the current no-account web MVP and should not distract from completing the release gates.

## Immediate next actions

1. Decrypt the verified real backup in Termux, then run the complete restore drill in an isolated database. A Supabase branch is available as a test target, but it has an estimated usage cost of $0.01344 per hour while active, so confirm before creating it.
3. Keep the repository public by decision. After the question-content protection changes merge, verify the CI guard and confirm Cloudflare Pages deploys successfully. Future unpublished question text stays in Supabase, not public source.
4. Configure main-branch protection and rerun CI plus the full-history secret scan.
5. Complete the physical-device, accessibility, route, search/filter, and privacy review.
6. Identify a human question reviewer, approve a small set, and publish only approved content.
7. Run the controlled student pilot, fix high-impact issues, and record the go/no-go decision.
8. Complete final polish and only then make a broad launch announcement.

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
