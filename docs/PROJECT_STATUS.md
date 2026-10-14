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
- **Old Worker:** A separate Cloudflare Worker/application named `cestudy` had a failed Wrangler deployment and showed no active routes in the dashboard. It is not needed by the documented Pages + Supabase architecture. Review its triggers, domains, and bindings in Cloudflare before deleting it; do not confuse it with the working Pages site.

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
- Latest recorded GitHub Actions run on commit `d95c1b03ded0aa8df24ffb50cd6be001fa052efd` passed: [CI run 38603970336](https://github.com/justryan-n2d/CEStudy/actions/runs/38603970336).

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

1. Review the failed legacy `cestudy` Worker in the Cloudflare dashboard. Confirm it has no custom domains/routes, production traffic, or bindings needed by anything else; then delete only that Worker if the review confirms it is unused. Keep the working Pages site.
2. Run the remaining deployed-site checks at 320 px and desktop widths; inspect console/network errors and confirm CHED source links.
3. Confirm public clients cannot see unpublished practice questions and that the existing RLS/read-only permissions still behave as intended.
4. Complete accessibility and backup/restore planning, and record results.
5. Complete student discovery and set pilot success measures. Identify a human content reviewer.
6. Keep all sample questions unpublished until their answers and explanations are independently verified.
7. After the release checks pass, run a small, controlled student pilot and document feedback before inviting a wider group.

## Documentation practice

Keep significant decisions, migrations, security changes, deployment settings, test evidence, known limitations, and launch approvals documented in Git. Do **not** put credentials, API secrets, database passwords, access tokens, private account data, or real student data in the public repository. This status page is a summary, not a substitute for the linked detailed verification records.
