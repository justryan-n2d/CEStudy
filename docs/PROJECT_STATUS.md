# CEStudy project status

**Last updated:** 2026-10-15  
**Current phase:** Phase 3, deployed web MVP and technical verification.  
**Release status:** The Cloudflare Pages site is live and initial mobile smoke tests were reported successful. Do not open CEStudy broadly to students until the remaining technical, content, and pilot gates pass.

**Live website:** [https://cestudy.pages.dev](https://cestudy.pages.dev)

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
- Security update PR [#1](https://github.com/justryan-n2d/CEStudy/pull/1) merged as `6b69e7b`. Candidate [CI run 38622378132](https://github.com/justryan-n2d/CEStudy/actions/runs/38622378132) passed ESLint, tests, production build, `npm audit` (0 vulnerabilities), Pages preview deployment, and the isolated Supabase migration/RLS test suite.
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
5. Complete a full repository/history secret scan and verify Cloudflare's production environment uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, never a secret/service-role key.
6. Complete student discovery and set pilot success measures. Identify a human content reviewer.
7. Keep all sample questions unpublished until their answers and explanations are independently verified.
8. After the release checks pass, run a small, controlled student pilot and document feedback before inviting a wider group.

## Documentation practice

Keep significant decisions, migrations, security changes, deployment settings, test evidence, known limitations, and launch approvals documented in Git. Do **not** put credentials, API secrets, database passwords, access tokens, private account data, or real student data in the public repository. This status page is a summary, not a substitute for the linked detailed verification records.
