# CEStudy project status

**Last updated:** 2026-10-16  
**Current phase:** **Phase 7, pre-launch hardening and release gates.**  
**Release status:** The live web MVP is deployed and the automated live smoke test passed 70/70 checks. A real encrypted database backup has now succeeded, but decrypting and fully restoring that backup in an isolated database remains untested. The site is not approved for a broad student launch yet. Restore proof, branch protection, final manual QA, human content review, and the student pilot remain release gates. The repository stays public by decision; future unpublished question content is now being moved out of public source and guarded by CI. See the [organized phase plan](PHASE_PLAN.md) for the canonical status and next actions.

**Live website:** [https://cestudy.pages.dev](https://cestudy.pages.dev)


## Release verification update (2026-10-15)

### Live browser verification passed

Automated Chromium smoke test [run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289) passed **70/70 checks** against the live Pages deployment.

- Six live routes loaded directly with HTTP 200 and the expected page heading: home, catalog, Year 2, Mathematics Foundations, Basic Algebra subject detail, and Basic Algebra practice.
- The live responses contained Content Security Policy, `X-Content-Type-Options`, `X-Frame-Options`, Referrer Policy, and Permissions Policy headers. The CSP includes the dedicated CEStudy Supabase host.
- At 320 px and 1440 px viewport widths, Chromium measured no horizontal overflow.
- Browser console, page, request, and same-origin HTTP error checks reported no errors.
- Actual network requests reached `qqmdwltfgpqtcvdbcmto.supabase.co`. Catalog requests returned HTTP 200 and all 72 catalog entries. Captured API key headers used the `sb_publishable_` prefix; no privileged/service-role key was detected in browser requests. Key material is not included in the logs.
- The practice API request used `status=eq.published`, returned HTTP 200 and zero rows. The practice screen displayed its review gate and did not show a seeded draft prompt.
- The rendered CHED CMO No. 92, s. 2017 link matched the official Civil Engineering PDF. The PDF returned HTTP 200 and `application/pdf`.

This is an automated Chromium run at 320 px and 1440 px, not a full accessibility audit or testing on every physical device/browser.

### Database access and privacy confirmed

- The dedicated Supabase project named CEStudy is `ACTIVE_HEALTHY`, with project ref `qqmdwltfgpqtcvdbcmto`.
- Remote query confirmed 72 catalog subjects and eight practice questions, all with `needs-review`; published count remains zero.
- Both exposed public tables have RLS enabled. The practice SELECT policy exposes only rows where `status = 'published'`; client roles `anon` and `authenticated` have SELECT only, with no client INSERT/UPDATE/DELETE grants.
- Queries executed under both `anon` and `authenticated` returned 72 catalog rows and zero practice rows, including zero unpublished rows.
- Supabase security advisor returned no security lint findings. Default-privilege hardening is applied for objects created through standard `postgres`-owned migrations.

### Secret scanning and dependency CI

- Full-history Gitleaks scan passed on latest source commit: [run 38627053653](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053653). The workflow checks pushes and pull requests, supports manual runs, and scans weekly. A scan is useful protection but does not replace rotating any credential if a leak is ever identified.
- Latest CI passed lint, unit tests, dependency audit, build, Pages header/redirect packaging, and isolated Supabase migration/RLS tests: [run 38627053630](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053630).
- An official CHED 2017 memorandum archive links CMO No. 92, s. 2017, Civil Engineering: [CHED memorandum archive](https://legacy.ched.gov.ph/2017-ched-memorandum-orders/).

### Content, backup and pilot gates still open

- All eight original Basic Algebra questions received a mathematical answer/step consistency pre-review with no arithmetic mismatch found. This is not independent academic approval. All eight remain `needs-review` and unpublished until a human reviewer checks clarity, options, workings, explanations, and attribution. See [sample question pre-review](reviews/2026-10-15-basic-algebra-draft-review.md).
- **Future-question content protection decision:** the repository remains public because the exposure of the original eight drafts is acceptable; those questions are treated as already disclosed. The current change removes actual question rows from `supabase/seed.sql`, uses only synthetic test fixtures, and adds a CI rule preventing practice-question INSERTs or answer/solution fields from returning to the public seed. Future unpublished prompts, options, answers, solutions, and review notes must be authored directly in the CEStudy Supabase database with `needs-review` status. RLS hides unpublished rows from anon/authenticated API clients. Cloudflare Pages configuration is unchanged; confirm its post-merge production deployment and the live site before closing this release check.
- The GitHub Actions workflow, encryption helper, retention tests, and public recipient certificate at `scripts/backup-recipient-cert.pem` are committed. The first successful live backup run [38773249088](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088) exported the database, encrypted it, uploaded the encrypted archive and checksum to the correct singular bucket `cestudy-db-backup`, read them back for verification, verified the marker, and completed retention with one backup set. Current CI [38774949531](https://github.com/justryan-n2d/CEStudy/actions/runs/38774949531) also passed its encryption/decryption and retention tests using test data. A full restore of the actual backup into a separate database remains untested. Confirm Backblaze lifecycle cleanup and GitHub failure email settings. See [weekly backup setup](deployment/weekly-backups.md).
- The controlled 5–8-student pilot procedure and proposed metrics are documented in [student pilot plan](plans/2026-10-15-student-pilot-plan.md). No student pilot has been run.
- The GitHub integration cannot read the repository's branch-protection settings, and the public rulesets query returned no rulesets. Main-branch protection and required status-check settings must still be confirmed in GitHub Settings.

Do not open CEStudy broadly to students until a human reviewer is identified, the pilot/review process is approved, branch protection is checked, and the required recovery safeguards are completed for the data CEStudy will hold.

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
| 6. Automated and manual technical QA | Partially complete | Live Chromium run 38627326289 passed 70/70 checks; physical-device, accessibility, and some search/filter edge cases remain. |
| 7. Pre-launch hardening and release gates | **Current** | Verify backup and restore, configure branch protection, complete manual QA, and rerun current CI/security checks. Future question content is kept out of public source by policy and CI. |
| 8. Human content review and approved publishing | Not started | The eight drafts have not been independently approved; published count remains zero. |
| 9. Controlled student pilot | Not started | The 5–8-student pilot plan exists but has not run. |
| 10. Final polish and broad public launch | Not started | Complete pilot fixes and a documented go/no-go decision before announcing broadly. |
| 11. Ongoing operations and future expansion | Deferred | Accounts, AI tutor, submissions, and native mobile apps remain future options. |

**Storage clarification:** Supabase PostgreSQL is already in use. A Supabase Storage bucket is not configured and is not required for this MVP. Encrypted database backups target Backblaze B2 bucket `cestudy-db-backup`; one verified backup is present, but the actual decrypt and isolated restore drill remain pending.

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

Still pending before a student launch: full accessibility and physical-device review, confirmation of main-branch protection, a real-backup decrypt and isolated restore drill, human question review, and the controlled student pilot. Search/filter edge-case testing has not been exhaustively automated.

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
- `practice_questions`: 8 rows, all `needs-review`; published count is 0.
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

1. Download the verified backup set from B2 and test the real checksum and decryption in Termux using the saved private key.
2. Restore the decrypted archive into a separate temporary Supabase database and record validation evidence. A Supabase branch can be used as an isolated target after explicit cost approval.
3. Keep the repository public by decision. After the question-content protection PR merges, confirm Cloudflare Pages still deploys successfully and the live site works. Future unpublished questions must stay in the CEStudy Supabase database, not public source.
4. Configure main-branch protection with required CI and secret-scan checks. Rerun CI and the full-history secret scan on the latest commit.
5. Complete physical-device and accessibility review, search/filter edge cases, and final live privacy checks.
6. Identify a human content reviewer and approve a small initial question set before publishing it.
7. Run the documented 5–8-student pilot, address critical findings, and record the go/no-go decision.
8. Complete final polish and approve the broad launch only after the release gates pass.

Do not create Supabase Storage buckets for the current MVP unless an approved feature needs file uploads or private objects.

## Documentation practice

Keep significant decisions, migrations, security changes, deployment settings, test evidence, known limitations, and launch approvals documented in Git. Do **not** put credentials, API secrets, database passwords, access tokens, private account data, or real student data in the public repository. This status page is a summary, not a substitute for the linked detailed verification records.
