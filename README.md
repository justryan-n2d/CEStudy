# CEStudy

**A low-cost Civil Engineering reviewer for students.**

CEStudy helps Civil Engineering students from first year through fourth year browse subjects, revisit prerequisite mathematics, and build toward a reliable practice library.

## Current status

**Live website:** [https://cestudy.pages.dev](https://cestudy.pages.dev), deployed on Cloudflare Pages. The old, failed legacy Cloudflare Worker named `cestudy` was removed; Pages remains the active frontend host.

The app has a 72-subject catalog, four year-level routes, subject detail pages, and a practice flow. Automated Chromium smoke test [run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289) passed **70/70 checks** against the live site. It verified the live Supabase connection and publishable key, security response headers, six direct routes, 320 px and 1440 px layouts, no captured browser errors, the CHED PDF link, and an empty published-practice set. GitHub Actions also passed lint, unit tests, dependency audit, build and isolated Supabase migration/RLS tests [in run 38627053630](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053630). Full-history Gitleaks scan passed [in run 38627053653](https://github.com/justryan-n2d/CEStudy/actions/runs/38627053653).

**Release status:** The deployed web MVP is passing its current automated technical smoke checks, but CEStudy is **not ready for a broad student launch yet**. A source-level privacy gap remains: this repository is public and `supabase/seed.sql` includes the text of the eight unpublished practice drafts. Database RLS hides them from the website/API but not from visitors to the repository; treat these initial questions as already disclosed. Restrict repository access and verify the Cloudflare Pages Git integration before adding any new unreleased question bank. The encrypted weekly Backblaze backup workflow using RSA-OAEP/SHA-256 and AES-256-GCM, plus four-copy retention logic, is committed. Activation secrets, the public certificate variable, B2 lifecycle cleanup, and failure notifications must be configured before the first successful run; the real restore drill is still pending. Human content sign-off, branch protection, and the student pilot are also pending. See [weekly backup setup](docs/deployment/weekly-backups.md), [current project status](docs/PROJECT_STATUS.md), [pre-launch checklist](docs/deployment/launch-checklist.md), [repository privacy guide](docs/deployment/github-privacy-and-branch-protection.md), and [roadmap](docs/ROADMAP.md).

### Deployment and smoke-test record (2026-10-15)

- **Live URL:** [https://cestudy.pages.dev](https://cestudy.pages.dev)
- **Hosting:** Cloudflare Pages connected to `justryan-n2d/CEStudy`; production branch `main`, build command `npm run build`, output directory `dist`.
- **Live browser check:** [Run 38627326289](https://github.com/justryan-n2d/CEStudy/actions/runs/38627326289), Chromium, 70/70 checks passed. Six routes returned HTTP 200. Responses had CSP, `X-Content-Type-Options`, `X-Frame-Options`, Referrer Policy, and Permissions Policy. The catalog loaded 72 rows from the dedicated CEStudy Supabase host with an `sb_publishable_` key; no privileged key was detected.
- **Responsive and runtime checks:** no horizontal overflow at 320 px or 1440 px and no browser console, page, request or same-origin HTTP errors in the run.
- **Practice privacy:** public API request is filtered to published items and returns zero rows; deployed UI shows the review gate. Independent RLS queries confirm `anon` and `authenticated` users cannot see any of the eight unpublished questions.
- **CHED source:** the rendered CMO No. 92, s. 2017 Civil Engineering PDF link returned HTTP 200 with `application/pdf`.
- **Still to do before a student launch:** full accessibility and physical-device review, GitHub branch-protection confirmation, a real private off-site database export and restore drill, human approval of all practice questions, and a controlled student pilot with recorded feedback.

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
