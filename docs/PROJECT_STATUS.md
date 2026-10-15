# CEStudy project status

**Last updated:** 2026-10-15  
**Current phase:** Phase 3, deployed web MVP and technical verification.  
**Release status:** The Cloudflare Pages site is live and initial mobile smoke tests were reported successful. Do not open CEStudy broadly to students until the remaining technical, content, and pilot gates pass.

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
- **Source-level privacy gap discovered:** the GitHub repository is public, and `supabase/seed.sql` contains the text of the eight unpublished questions. RLS hides these rows from the CEStudy website/API, but cannot protect files in a public GitHub repository. Treat these initial questions as already disclosed; do not use them as confidential assessments. Restrict repository access before adding any new unreleased question bank, then confirm Cloudflare Pages still deploys from the now-private repository. Previously downloaded public forks/copies cannot be recalled.
- Backup and recovery instructions are documented in [backup and recovery](deployment/backup-and-recovery.md). A real private off-site database export, restore drill, and restore evidence have **not** been completed.
- The controlled 5–8-student pilot procedure and proposed metrics are documented in [student pilot plan](plans/2026-10-15-student-pilot-plan.md). No student pilot has been run.
- The GitHub integration cannot read the repository's branch-protection settings, and the public rulesets query returned no rulesets. Main-branch protection and required status-check settings must still be confirmed in GitHub Settings.

Do not open CEStudy broadly to students until a human reviewer is identified, the pilot/review process is approved, branch protection is checked, and the required recovery safeguards are completed for the data CEStudy will hold.

## Phase summary

| Phase | State | Notes |
| --- | --- | --- |
| 0. Project foundation | Partially complete | Stack and repository docs are in place. Target user and success metrics still need to be recorded. |
| 1. Validate the need | Not yet evidenced | Student interviews and comparison of current study/reviewer needs have not been documented. |
| 2. Define the MVP | Direction selected, validation incomplete | Initial scope and architecture were approved; detailed user journey, wireframes, pilot metrics, and content operations still need completion. |
| 3. Build the web MVP | Deployed; verification continues | Cloudflare Pages production site is live at [cestudy.pages.dev](https://cestudy.pages.dev). Initial mobile smoke tests were reported successful. |
| 4. Test and improve | Technical checks in progress; student pilot not started | Complete browser, responsive, accessibility, content, backup, and security release checks before a small controlled pilot. |
| 5. Expand carefully | Deferred | Accounts, synced progress, public submissions, AI tutor, and native mobile apps remain out of MVP scope. |

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

Still pending before a student launch: full accessibility and physical-device review, confirmation of main-branch protection, real database export and restore drill, human question review, and the controlled student pilot. Search/filter edge-case testing has not been exhaustively automated.

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

1. Confirm the deployed browser requests use the dedicated CEStudy Supabase URL and only the publishable key; the catalog can use a bundled fallback, so a visible catalog alone does not prove the live API connection.
2. Check the live site's security response headers and browser console/network at 320 px and desktop widths; confirm routing, catalog search/filters, and CHED source links.
3. Complete an end-to-end UI check that unpublished questions remain hidden. Database-level RLS and write-denial tests already pass in CI.
4. Record and rehearse the current source-controlled database recovery approach. Before adding mutable student data, configure a production backup/export schedule and perform a restore drill.
5. Complete a full repository/history secret scan; a focused current-source scan found no common privileged-key patterns, but it does not examine every historical commit.
6. In GitHub repository settings, verify that `main` branch protection and required CI checks are configured as appropriate; the current connection could not inspect branch-protection settings.
7. Verify Cloudflare's production environment uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, never a secret/service-role key.
8. Complete student discovery and set pilot success measures. Identify a human content reviewer.
9. Keep all sample questions unpublished until their answers and explanations are independently verified.
10. After the release checks pass, run a small, controlled student pilot and document feedback before inviting a wider group.

## Documentation practice

Keep significant decisions, migrations, security changes, deployment settings, test evidence, known limitations, and launch approvals documented in Git. Do **not** put credentials, API secrets, database passwords, access tokens, private account data, or real student data in the public repository. This status page is a summary, not a substitute for the linked detailed verification records.
