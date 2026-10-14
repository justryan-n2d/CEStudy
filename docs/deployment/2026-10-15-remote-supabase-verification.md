# CEStudy remote Supabase and deployment verification record

**Date:** 2026-10-15  
**Status:** Remote database permissions and policy checks passed; the Pages site is deployed and the Pages preview build passed CI. Browser-level production verification and a future production backup/restore drill remain open.

## What was configured

- Created a separate Supabase project named `CEStudy` in the approved organization.
- Selected region `ap-southeast-1` (Singapore) for the intended Philippines audience.
- Applied `supabase/migrations/20261014170630_public_catalog_and_practice.sql`, whose version matches the remote migration history.
- Seeded the public subject catalog and original practice-question drafts from `supabase/seed.sql`.
- Applied `20261014190554_client_default_privileges_hardening.sql` to the remote project.
- Deployed the website on Cloudflare Pages at [https://cestudy.pages.dev](https://cestudy.pages.dev), connected to the public GitHub repository `justryan-n2d/CEStudy`.

The project reference, endpoint, and key values are intentionally not recorded in this public repository. Store them in the appropriate project settings, not in source control.

## Remote database verification

| Check | Result |
| --- | --- |
| `catalog_subjects` table | Present, 72 rows |
| `practice_questions` table | Present, 8 rows |
| Row-level security on both app tables | Enabled |
| Catalog SELECT policy | `anon` and `authenticated` can read catalog entries |
| Practice-question SELECT policy | Client visibility is limited to `status = 'published'` |
| Actual client table privileges | Only SELECT for `anon` and `authenticated`; no client INSERT/UPDATE/DELETE on either app table |
| Published questions | 0 |
| Unpublished question state | All 8 remain `needs-review` |
| Public app objects | Only the two intended app tables; no public views/functions or Storage buckets were found |
| Supabase security advisor | No security lint findings |
| Default privileges for public objects created by `postgres` | PUBLIC, `anon`, and `authenticated` no longer receive default table, sequence, or function privileges |
| Security policy tests | Expanded isolated pgTAP suite passes, including anonymous/authenticated write denial and published-only visibility |

### Default-privilege scope note

The managed `supabase_admin` role's existing default privileges could not be changed through the normal project database connection; those platform-managed defaults remain unchanged. No app-facing public objects were found owned by that role. Create future app-facing database objects through reviewed migrations owned by the standard `postgres` migration role, with explicit grants and RLS, rather than creating them as `supabase_admin`.

## CI and Pages deployment verification

- Security PR [#1](https://github.com/justryan-n2d/CEStudy/pull/1) updated the development test runner to patched Vitest 4.1.11.
- Latest main-branch workflow run [38623258999](https://github.com/justryan-n2d/CEStudy/actions/runs/38623258999) passed:
  - `npm audit --audit-level=high` with **0 vulnerabilities**.
  - ESLint, frontend tests, and production build.
  - Pages preview deployment.
  - Isolated Supabase migration/RLS tests.
  - Checks that `dist/_redirects` and `dist/_headers` are packaged.
- `public/_headers` sets baseline headers including Content Security Policy, `X-Content-Type-Options`, `X-Frame-Options`, Referrer Policy, and a restrictive Permissions Policy. The artifact check confirms the file is packaged, but the actual production HTTP response and CSP behavior still require browser verification.
- Initial mobile smoke tests reported by the user: homepage, catalog, search/filters, Year 2, Mathematics Foundations, and key subject-detail route refreshes worked.

These checks do **not** independently prove that the deployed browser is calling the remote Supabase project rather than using the bundled catalog fallback. Verify that in browser network requests before release.

## Recovery and backup approach for the current MVP

The current dataset is reproducible from source control: database migrations and `supabase/seed.sql` are committed, the catalog contains 72 rows, and the only practice content is eight unpublished draft questions. The MVP has no student accounts, public submissions, uploads, or other intended mutable end-user data. CI starts an isolated Supabase stack, applies migrations/seed configuration, and runs database policy tests, which exercises rebuild-from-source in a disposable database.

This is a recovery path for the current seeded-only database, not a verified point-in-time production backup. Before introducing mutable student data, public submissions, or published content maintained outside source control, configure production backup/export retention and perform a restore drill into a separate project. Never run `supabase db reset --linked` against the production/shared project.

## Remaining release gates

1. In Cloudflare Pages settings, verify `VITE_SUPABASE_URL` is the dedicated CEStudy URL and `VITE_SUPABASE_PUBLISHABLE_KEY` is a publishable key, not a secret/service-role key.
2. On the deployed production site, use browser network checks to confirm catalog reads reach the CEStudy Supabase URL and verify that practice responses contain no `needs-review` records.
3. Verify live response headers/CSP, browser console/network, CHED link, all key routes, 320 px mobile layout, and desktop layout.
4. Complete a repository/history secret scan and the human question-review/pilot preparation items in [the launch checklist](launch-checklist.md).

See [Supabase setup](supabase-setup.md), [Cloudflare Pages setup](cloudflare-pages.md), and the [launch checklist](launch-checklist.md).
