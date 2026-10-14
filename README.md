# CEStudy

**A low-cost Civil Engineering reviewer for students.**

CEStudy helps Civil Engineering students from first year through fourth year browse subjects, revisit prerequisite mathematics, and build toward a reliable practice library.

## Current status

The first responsive app scaffold and curriculum-aware catalog are committed to `main`; automated checks and backend integration still need verification. The local catalog can be explored before Supabase is configured. When Supabase is configured, the app reads public catalog records through a read-only client policy. Basic Algebra questions are seeded as **needs review** and are not available to student-facing queries until a human reviewer checks them and intentionally publishes them.

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

1. Install packages with npm install.
2. Start the development server using npm run dev.
3. Run npm run lint, npm run test -- --run, and npm run build before sharing changes.

Generate and commit a package lockfile from a network-enabled development environment before release. It cannot be generated reliably through repository-file editing alone.

## Supabase setup

1. Create or select a Supabase project. Never share credentials in chat or commit them.
2. Apply the SQL migration in the migrations folder.
3. Run supabase/seed.sql through the local seed workflow or Supabase SQL Editor after the migration. It is safe to rerun.
4. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in the local or Cloudflare Pages environment. Use only a publishable key in the browser; never use a secret/service-role key.
5. Run the RLS tests using the Supabase CLI before production.

The migration grants only SELECT to anon and authenticated roles for catalog and practice tables. RLS exposes catalog entries and only practice rows whose status is published. Public write grants and policies are absent.

## Content review gate

Seeded Basic Algebra questions are original draft material with status needs-review. A human reviewer must check each prompt, option, correct answer, solution step, and explanation. Only then may a trusted maintainer change the status to published.

## License

No open-source license has been added. Do not assume the source code is licensed for reuse.
