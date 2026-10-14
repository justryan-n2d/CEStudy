# CEStudy

**A low-cost Civil Engineering reviewer for students.**

CEStudy helps Civil Engineering students from first year through fourth year browse subjects, revisit prerequisite mathematics, and build toward a reliable practice library.

## Current status

**The website is deployed on Cloudflare Pages:** [https://cestudy.pages.dev](https://cestudy.pages.dev). The production deployment was reported successful on 2026-10-15, and the user reported that the initial mobile smoke tests worked. The earlier failed legacy Cloudflare Worker named `cestudy` was subsequently deleted; the live Pages site remains the active frontend host.

The app includes a 72-subject catalog, four year-level routes, subject pages, and a practice flow. The dedicated remote Supabase project is configured with 72 catalog entries and eight unpublished Basic Algebra draft questions. Remote RLS and read-only grants were verified. The default-privilege hardening migration and expanded database tests are now in place. The security update to Vitest 4.1.11 passed the full CI suite. Latest main-branch verification [run 38623258999](https://github.com/justryan-n2d/CEStudy/actions/runs/38623258999) passed `npm audit` (0 vulnerabilities), lint, unit tests, production build, Pages deployment check, and isolated Supabase migration/RLS tests. **Current phase: Phase 3, deployed web MVP and technical verification.** The site is not ready to open broadly to students: responsive/accessibility review, browser console and network checks, backup/restore planning, student validation, and content review remain. See [current project status](docs/PROJECT_STATUS.md) and [roadmap](docs/ROADMAP.md).

### Deployment and smoke-test record (2026-10-15)

- **Live URL:** [https://cestudy.pages.dev](https://cestudy.pages.dev)
- **Hosting:** Cloudflare Pages, connected to the `justryan-n2d/CEStudy` GitHub repository; production branch `main`.
- **Build settings:** `npm run build`, output directory `dist`, repository root.
- **Security headers:** `public/_headers` sets a restrictive Content Security Policy and baseline browser security headers. CI verifies the file is packaged; the live response and CSP behavior still need a browser check.
- **User-reported manual checks:** homepage, subject catalog, catalog search and filters, Year 2 route, Mathematics Foundations, subject details/direct route refresh, and catalog display worked on mobile.
- **Still to verify before wider release:** inspect the site at 320 px and desktop widths; review browser console/network requests; check CHED source links and unpublished-question visibility; complete accessibility, backup/restore, security, and content-review gates.

Do not describe CEStudy as production-ready for a student launch until the remaining release checks have passed. The eight practice questions remain **needs review** and hidden until a human reviewer checks and intentionally publishes them.

## Product boundaries

- Free-first, responsive web app designed for mobile screens.
- Four year levels, Mathematics Foundations and Refreshers, and five specialization areas.
- CHED placements are reference examples and may differ by university.
- No student-facing AI tutor, AI-generated questions, live AI API calls, account registration, public submissions, or cross-device progress in the MVP.
- Only deliberately published questions are returned to public clients.
- No question is marked verified merely because it was generated or seeded.

## Technology

- React + TypeScript + Vite + Tailwind CSS
- Cloudflare Pages hosting
- Supabase PostgreSQL with explicit grants and Row Level Security
- GitHub for source control, tests, and CI

See the docs folder for project scope, roadmap, security requirements, implementation plan, catalog design, architecture decision, development workflow, Supabase setup, and Cloudflare Pages deployment.

## Local development

Requirements: Node.js 22.12+ and npm.

1. Install the exact dependency versions with `npm ci` (the lockfile is committed).
2. Start the development server using `npm run dev`.
3. Run `npm run lint`, `npm run test -- --run`, and `npm run build` before sharing changes.

## Supabase setup

The dedicated remote CEStudy Supabase project has been created and the migration/seed have been applied. Cloudflare Pages has been configured with the browser build variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the deployed website. For local development, use the local Supabase workflow described in [the setup guide](docs/deployment/supabase-setup.md). Never share credentials in chat or commit them. Only a publishable key belongs in browser code; never use a secret/service-role key or database password in a `VITE_*` variable.

The migrations grant only SELECT to anon and authenticated roles for the catalog and practice tables. RLS exposes catalog entries and only practice rows whose status is published. Public write grants and policies are absent. Default privileges for objects created by the normal `postgres` migration role are hardened so future public tables, sequences, and functions do not automatically grant rights to client roles or `PUBLIC`.

## Content review gate

Seeded Basic Algebra questions are original draft material with status needs-review. A human reviewer must check each prompt, option, correct answer, solution step, and explanation. Only then may a trusted maintainer change the status to published.

## License

No open-source license has been added. Do not assume the source code is licensed for reuse.
