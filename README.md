# CEStudy

**A low-cost Civil Engineering reviewer for students.**

CEStudy helps Civil Engineering students from first year through fourth year browse subjects, revisit prerequisite mathematics, and build toward a reliable practice library.

## Current status

The app scaffold, 72-subject catalog, four year-level routes, subject pages, and practice flow are implemented. Reproducible dependency setup and CI checks pass. The dedicated remote Supabase project is configured with 72 catalog entries and eight unpublished Basic Algebra draft questions; remote RLS and read-only grants were verified. **Current phase: Phase 3, deploying and verifying the web MVP.** Cloudflare Pages is not connected yet, so there is no verified live preview. See [current project status](docs/PROJECT_STATUS.md) and [roadmap](docs/ROADMAP.md). Do not open CEStudy to students yet. The eight practice questions remain **needs review** and hidden until a human reviewer checks and intentionally publishes them.

Do not describe CEStudy as production-ready until database security tests, deployment checks, CHED source review, backups, and mobile usability checks are complete.

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

The dedicated remote CEStudy Supabase project has been created and the migration/seed have been applied. For local development, use the local Supabase workflow described in [the setup guide](docs/deployment/supabase-setup.md). For the hosted preview, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Cloudflare Pages to the values from the dedicated CEStudy project. Never share credentials in chat or commit them. Only a publishable key belongs in browser code; never use a secret/service-role key or database password in a `VITE_*` variable.

The migration grants only SELECT to anon and authenticated roles for catalog and practice tables. RLS exposes catalog entries and only practice rows whose status is published. Public write grants and policies are absent.

## Content review gate

Seeded Basic Algebra questions are original draft material with status needs-review. A human reviewer must check each prompt, option, correct answer, solution step, and explanation. Only then may a trusted maintainer change the status to published.

## License

No open-source license has been added. Do not assume the source code is licensed for reuse.
