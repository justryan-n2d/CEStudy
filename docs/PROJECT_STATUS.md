# CEStudy project status

**Last updated:** 2026-10-18  
**Current phase:** **Phase 7, pre-launch hardening and release gates.**  
**Release status:** Stage 1 is not fully signed off. After the 2026-10-18 publication-status correction and Privacy notice release, production Chromium smoke test [run 39142423824](https://github.com/justryan-n2d/CEStudy/actions/runs/39142423824) passed **135/135 checks** with zero failures. It verified direct routes including `/privacy`, required security headers, responsive widths of 320 px and 1440 px, live Supabase host/key usage, zero published practice questions, and no captured browser/runtime errors. The live database has 72 catalog subjects, 52 practice questions, and 13 lessons; all questions and lessons are `needs-review`, with zero published in both tables. Two lesson records marked published despite draft notes were returned to review, and Algebra Foundations is `in-preparation`. Anonymous-role SQL verification returned zero rows from both content tables. The main-branch ruleset is active and verified. A fresh encrypted backup after the current database change, managed-Supabase-target restore, B2 lifecycle and GitHub failure-email confirmation, physical-device/accessibility QA, independent content review, Google OAuth end-to-end verification for the still-draft account feature, and the student pilot remain open. See the [Stage 1 audit record](reviews/2026-10-18-stage1-content-and-publication-audit.md), [restore-drill evidence](deployment/restore-drill-2026-10-16.md), and [organized phase plan](PHASE_PLAN.md).

**Live website:** [https://cestudy.pages.dev](https://cestudy.pages.dev)

## Latest production verification (2026-10-18)

- **Main CI:** commit `97d6e8d8009d7ba33846cb4a7d35a9bb260a9d48` passed [CEStudy CI run 39142266631](https://github.com/justryan-n2d/CEStudy/actions/runs/39142266631) and [full-history secret scan 39142266706](https://github.com/justryan-n2d/CEStudy/actions/runs/39142266706).
- **Live Chromium:** [run 39142423824](https://github.com/justryan-n2d/CEStudy/actions/runs/39142423824) passed 135 checks with zero failures. It includes the direct `/privacy` route, footer link, security response headers, published-only practice API, and responsive checks at 320 px and 1440 px.
- **Privacy notice:** [https://cestudy.pages.dev/privacy](https://cestudy.pages.dev/privacy) is live after PR #42. The latest browser run confirms the page route and footer link.
- **Still open:** a fresh encrypted backup and managed-Supabase restore for current live data, B2 lifecycle and GitHub failure-email confirmation, physical-device/accessibility QA, human approval of lessons/questions, Google OAuth end-to-end validation for draft PR #38 if retained, and the student pilot.


## Stage 1 release audit (2026-10-18)

- **Catalog:** 72 subjects.
- **Practice bank:** 52 records, all `needs-review`; 0 published.
- **Lesson bank:** 13 records, all `needs-review`; 0 published.
- **Publication correction:** two lesson rows whose source notes identified them as drafts were returned to `needs-review`. Review timestamps were cleared, an audit note was recorded in the private database, and Algebra Foundations was changed to `in-preparation`.
- **Live access check:** all six public/private data tables inspected have RLS enabled. The anonymous database role returned zero rows from `subject_lessons` and `practice_questions`; published-only read policies remain in place. The security advisor returned three informational no-policy findings for private tables that have no client grants, not actionable public-table policy gaps.
- **Question pre-review:** all 52 questions passed basic database integrity checks for nonempty required fields, unique options, and exactly one matching stored correct answer. A first-pass AI-assisted math/solution consistency check found no definite answer mismatch. This is not independent academic review. Do not publish any question or lesson until a qualified human records approval.
- **Current limitations:** a fresh encrypted backup after the database change, a managed-Supabase recovery rehearsal, Backblaze lifecycle and GitHub failure-email settings, real-device accessibility, human content review, Google OAuth end-to-end verification for PR #38, and a 5–8 student pilot remain open. See the [Stage 1 audit record](reviews/2026-10-18-stage1-content-and-publication-audit.md).


## Product direction locked (2026-10-18)

CEStudy will combine free browsing of the engineering knowledge library with optional guided learning paths and personal progress tracking. The decision is recorded in [the combined learning model](product/COMBINED_LEARNING_MODEL.md) and reflected in [the roadmap](ROADMAP.md) and [phase plan](PHASE_PLAN.md).

The first feature increment is device-local progress for published lessons plus a flame streak based on consecutive local calendar days with at least one completion. It must not add accounts, server-side student-progress writes, or cross-device sync. Current Phase 7 release gates still apply. Product direction approval does not approve a broad public launch.


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
- The practice API request used `status=eq.published`, returned HTTP 200 and zero rows at the time of that historical run. The practice screen displayed its review gate and did not show a seeded draft prompt. Newer post-correction evidence is available in [production smoke run 39142423824](https://github.com/justryan-n2d/CEStudy/actions/runs/39142423824).
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
- **Future-question content protection decision:** the repository remains public because the exposure of the original eight drafts is accepted; those questions are treated as already disclosed. The public `supabase/seed.sql` contains catalog metadata only, and CI rejects practice-question inserts or answer/solution fields returning to that seed. Future unpublished prompts, options, answers, solutions, and review notes belong directly in the CEStudy Supabase database with `needs-review` status. RLS hides unpublished rows from anon/authenticated API clients. The production deployment after the Privacy notice merge was validated by [Chromium run 39142423824](https://github.com/justryan-n2d/CEStudy/actions/runs/39142423824).
- The encrypted weekly backup workflow passed a live run [38773249088](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088). Its archive and checksum were read back and verified in private Backblaze B2. The actual October 15 backup was later decrypted and restored into isolated local PostgreSQL 18.2; see [restore-drill evidence](deployment/restore-drill-2026-10-16.md). That snapshot predates the current 52-question/13-lesson dataset and the 2026-10-18 publication-status correction. A fresh backup must be run and verified now, then restored into a separate managed Supabase project after explicit cost approval. B2 lifecycle cleanup and GitHub failure-email settings also need confirmation.
- The controlled 5–8-student pilot procedure and proposed metrics are documented in [student pilot plan](plans/2026-10-15-student-pilot-plan.md). No student pilot has been run.
- The public [Privacy notice](https://cestudy.pages.dev/privacy) was merged in PR #42, and its route, headers, and footer link passed the latest production Chromium smoke suite.
- The active [Protect main ruleset](https://github.com/justryan-n2d/CEStudy/rules/25242389) is verified. It requires pull requests plus `Lint, test, and build`, `Supabase migration and RLS tests`, and `Scan repository history for secrets`; it also blocks branch deletion and non-fast-forward updates and has no bypass actors. Verification PR [#13](https://github.com/justryan-n2d/CEStudy/pull/13) passed its required CI and secret-scan checks before merge.

Do not open CEStudy broadly to students until a human reviewer is identified, the pilot/review process is approved, the required recovery safeguards are completed for the data CEStudy will hold, and final manual accessibility/device QA has been recorded.

## Phase summary

The authoritative phase table and detailed tasks live in [the organized phase plan](PHASE_PLAN.md). Current summary:

| Phase | State | Notes |
| --- | --- | --- |
| 0. Repository and project foundation | Complete | Stack, repository, security requirements, and development workflow exist. |
| 1. Student discovery and problem validation | Not started | Student interviews and discovery findings are not yet documented. |
| 2. MVP scope, user journey, and UX specification | Partially complete | Scope and architecture are selected; discovery evidence, success measures, and wireframe/user-journey notes remain. |
| 3. Database, backend access, and security baseline | Complete for current MVP | Supabase tables, explicit grants, RLS, draft publication gate, and database tests are in place. |
| 4. Frontend MVP implementation | Complete for current MVP | Main catalog, year routes, foundations hub, subject pages, and practice screen are deployed. |
| 5. Cloudflare Pages and Supabase integration | Complete for initial deployment | Live site is active at [cestudy.pages.dev](https://cestudy.pages.dev). |
| 6. Automated and manual technical QA | Partially complete | Latest production Chromium run [39142423824](https://github.com/justryan-n2d/CEStudy/actions/runs/39142423824) passed 135/135 checks, including `/privacy`, direct routes, headers, and published-only API visibility. Physical-device and full assistive-technology review plus the complete search/filter edge-case matrix remain. |
| 7. Pre-launch hardening and release gates | **Current** | The actual backup passed a local isolated application-schema restore; managed Supabase target recovery, manual accessibility/device QA, human question review, and the controlled pilot remain. Main-branch ruleset is active; future question text is kept out of public source by policy and CI. |
| 8. Human content review and approved publishing | Not started | All 52 questions and 13 lessons remain `needs-review`; none are published pending qualified human review. |
| 9. Controlled student pilot | Not started | The 5–8-student pilot plan exists but has not run. |
| 10. Final polish and broad public launch | Not started | Complete pilot fixes and a documented go/no-go decision before announcing broadly. |
| 11. Ongoing operations and future expansion | Deferred | Accounts, AI tutor, submissions, and native mobile apps remain future options. |

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

Still pending before a student launch: a fresh encrypted backup after the live database change, managed-Supabase-target restore, Backblaze lifecycle and GitHub failure-email confirmation, full accessibility and physical-device review, Google OAuth end-to-end verification for draft PR #38, human review of questions and lessons, and the controlled student pilot. The post-correction production smoke test is complete: [run 39142423824](https://github.com/justryan-n2d/CEStudy/actions/runs/39142423824), 135/135 checks passed. PR #14 adds regression coverage for key filter combinations and small-text contrast; the full search/filter matrix and on-device assistive-technology behavior still need manual QA.

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

Follow the [organized phase plan](PHASE_PLAN.md) for the full checklist. The immediate order is:

1. Review the [completed local restore-drill evidence](deployment/restore-drill-2026-10-16.md).
2. If managed-Supabase-target recovery proof is required, restore to a separate temporary Supabase project only after approving the cost, then validate its rows, RLS, grants, and advisor results. Never use production as the test target.
3. Keep the repository public by decision. After the question-content protection PR merges, confirm Cloudflare Pages still deploys successfully and the live site works. Future unpublished questions must stay in the CEStudy Supabase database, not public source.
4. Keep the active main-branch ruleset in place. After PR #14 merges, rerun CI, Gitleaks, and the live Chromium smoke test on the resulting main commit.
5. Complete physical-device, keyboard/screen-reader accessibility review, search/filter edge cases, and final live privacy checks.
6. Identify a human content reviewer and approve a small initial question set before publishing it.
7. Run the documented 5–8-student pilot, address critical findings, and record the go/no-go decision.
8. Complete final polish and approve the broad launch only after the release gates pass.

Do not create Supabase Storage buckets for the current MVP unless an approved feature needs file uploads or private objects.

## Documentation practice

Keep significant decisions, migrations, security changes, deployment settings, test evidence, known limitations, and launch approvals documented in Git. Do **not** put credentials, API secrets, database passwords, access tokens, private account data, or real student data in the public repository. This status page is a summary, not a substitute for the linked detailed verification records.
