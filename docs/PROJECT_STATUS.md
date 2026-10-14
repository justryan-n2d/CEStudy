# CEStudy project status

**Last updated:** 2026-10-15  
**Current phase:** Phase 3, deployed web MVP and technical verification.  
**Release status:** The Cloudflare Pages site is live and initial mobile smoke tests were reported successful. Do not open CEStudy broadly to students until the remaining technical, content, and pilot gates pass.

**Live website:** [https://cestudy.pages.dev](https://cestudy.pages.dev)


## Release verification update (2026-10-15)

### Confirmed directly

- The dedicated Supabase project named CEStudy is `ACTIVE_HEALTHY`; the source client reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. It never names a service-role key as browser configuration. The published source `public/_headers` allows connections only to the dedicated CEStudy Supabase host. **The actual Cloudflare Pages environment values and live browser request have not been independently inspected**, so a direct browser-network check remains required.
- Remote database query confirmed 72 catalog subjects, 8 practice questions, 0 published questions and 8 unpublished questions. Both public tables have RLS enabled. The practice-question SELECT policy only allows `status = 'published'`; `anon` and `authenticated` have SELECT only and no public client write privileges. The Supabase security advisor returned no security lint findings.
- CI verifies that the built Pages artifact contains `_headers` and `_redirects`. Source headers include Content Security Policy, `X-Content-Type-Options`, `X-Frame-Options`, Referrer Policy and Permissions Policy. The actual production HTTP response and CSP runtime behavior have not been verified in a browser during this audit.
- A Gitleaks workflow now checks full Git history on push/PR, can be run manually, and scans weekly. The initial full-history scan passed: [Secret scan run 38624711552](https://github.com/justryan-n2d/CEStudy/actions/runs/38624711552).
- An official CHED 2017 memorandum archive links the catalog's CMO No. 92, s. 2017 Civil Engineering PDF. [CHED memorandum archive](https://legacy.ched.gov.ph/2017-ched-memorandum-orders/).
- All eight original Basic Algebra sample questions passed a mathematical answer/step consistency pre-review. No correction was identified. This is **not** the required independent human content approval; every question remains `needs-review` and unpublished. See [sample question pre-review](reviews/2026-10-15-basic-algebra-draft-review.md).
- Backup/recovery instructions and a controlled pilot plan have been documented in [backup and recovery](deployment/backup-and-recovery.md) and [student pilot plan](plans/2026-10-15-student-pilot-plan.md). A real off-site database export, restore drill and student pilot have **not** been completed.

### Not independently verified in this session

The available browser/network tools could not retrieve the live Pages site or run a real browser. This is a tooling limitation, not evidence that the site is down. Production request URLs, response headers, browser console errors, 320 px/desktop layouts, route-by-route refreshes, and live CHED clicks must still be checked from a real browser before public launch. Initial mobile checks noted above were reported by the user and are not an independent browser audit.

The GitHub integration successfully read the public repository but its API permission did not allow reading branch-protection settings; the public rulesets endpoint returned an empty list. The state of main-branch protection is therefore not confirmed.


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

## User-reported smoke tests

The following checks were reported working on mobile after deployment:

- Homepage opens.
- Subject catalog displays.
- Search and catalog filters work.
- Year 2 route opens.
- Mathematics Foundations page opens.
- Subject detail routes load and can be refreshed directly.
- Catalog content appears as expected.

These are user-reported functional checks, not an independent browser audit. Still pending: test at a 320 px viewport and desktop width; inspect browser console and network requests; verify CHED links; confirm unpublished practice questions remain hidden; and complete accessibility, backup/restore, and security release checks.

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
