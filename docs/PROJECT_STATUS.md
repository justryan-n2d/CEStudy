# CEStudy project status

**Last updated:** 2026-10-15  
**Current phase:** Phase 3, build and deployment verification of the web MVP.  
**Release status:** Not ready to open to students. There is no verified Cloudflare Pages preview URL yet.

## Phase summary

| Phase | State | Notes |
| --- | --- | --- |
| 0. Project foundation | Partially complete | Stack and repository docs are in place. Target user and success metrics still need to be recorded. |
| 1. Validate the need | Not yet evidenced | Student interviews and comparison of current study/reviewer needs have not been documented. |
| 2. Define the MVP | Direction selected, validation incomplete | Initial scope and architecture were approved; detailed user journey, wireframes, pilot metrics, and content operations still need completion. |
| 3. Build the web MVP | In progress | Frontend and remote database are built/configured. Cloudflare Pages preview remains to be deployed and verified. |
| 4. Test and improve | Not started as a student pilot | Start after the preview is live. Do not invite a larger student audience until technical and content gates pass. |
| 5. Expand carefully | Deferred | Accounts, synced progress, public submissions, AI tutor, and native mobile apps remain out of MVP scope. |

## Completed and verified

### Frontend and engineering workflow

- React + TypeScript + Vite + Tailwind CSS app committed to `main`.
- Home/catalog UI, four year-level routes, Mathematics Foundations, and subject detail pages.
- Searchable and filterable 72-record subject catalog with curriculum-source notes.
- Basic Algebra practice flow exists, but no question is published yet.
- `package-lock.json` is committed and `npm ci` is used for reproducible installs.
- Latest GitHub Actions run on commit `d95c1b03ded0aa8df24ffb50cd6be001fa052efd` passed: [CI run 38603970336](https://github.com/justryan-n2d/CEStudy/actions/runs/38603970336).

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

The selected hosting target is **Cloudflare Pages** connected to the GitHub repository. The Cloudflare dashboard groups Pages and Workers under **Workers & Pages**, but no dedicated Cloudflare Worker is required just to host this frontend. Do not create a Worker solely because the dashboard currently shows no CEStudy Worker. Create a Worker or Supabase Edge Function only when a specific server-side requirement justifies it.

Expected Pages build settings:

- Root directory: repository root
- Build command: `npm ci && npm run build`
- Build output: `dist`
- Node.js: 22
- Production branch: `main`

Set these environment variables for the preview environment using values from the dedicated CEStudy Supabase project:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Only the publishable key is appropriate for a browser build. Never place a secret/service-role key, database password, or access token into a `VITE_*` variable or public repository.

See [Cloudflare Pages setup](deployment/cloudflare-pages.md).

## Next actions, in order

1. Create a **Pages** application from Cloudflare's Workers & Pages dashboard and connect `justryan-n2d/CEStudy` through Git integration.
2. Add the preview environment variables for the dedicated CEStudy project.
3. Wait for the real preview deployment URL. Do not guess or fabricate it.
4. Inspect the preview on mobile (320 px) and desktop. Test catalog loading, search/filters, curriculum references, direct route refresh, hidden unpublished questions, and browser console/network errors.
5. Record the actual preview URL, deployment commit, test results, and any fixes in this repository.
6. Complete student discovery and set initial pilot success measures. Identify a human content reviewer.
7. Keep all sample questions unpublished until their answers and explanations are independently verified.
8. Only after the preview passes, conduct a small, controlled pilot and document feedback before inviting a wider group.

## Documentation practice

Keep significant decisions, migrations, security changes, deployment settings, test evidence, known limitations, and launch approvals documented in Git. Do **not** put credentials, API secrets, database passwords, access tokens, private account data, or real student data in the public repository. This status page is a summary, not a substitute for the linked detailed guides and verification records.
