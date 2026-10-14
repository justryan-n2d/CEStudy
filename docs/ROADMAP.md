# CEStudy Development Roadmap

**Status (2026-10-15):** Phase 3, deployed web MVP and technical verification. The site is live at [https://cestudy.pages.dev](https://cestudy.pages.dev), initial mobile smoke tests were reported successful, and the earlier failed legacy `cestudy` Worker has been deleted. Wider student release and validation remain pending.  
**Approach:** Validate the problem, define a small MVP, build the responsive web app first, and defer native mobile apps until the core experience proves useful.

## Current checkpoint (2026-10-15)

- The repository contains the React + TypeScript + Vite + Tailwind app, 72-subject catalog, four year-level routes, Mathematics Foundations, and subject detail pages.
- Reproducible dependency setup is committed. Security PR [#1](https://github.com/justryan-n2d/CEStudy/pull/1) updated Vitest to patched 4.1.11; [candidate CI run 38622378132](https://github.com/justryan-n2d/CEStudy/actions/runs/38622378132) passed `npm audit` with zero vulnerabilities, lint, tests, build, Pages preview, and isolated Supabase migration/RLS tests.
- The dedicated CEStudy Supabase project is initialized in Singapore: 72 catalog rows, eight `needs-review` questions, zero published questions. RLS and read-only client grants were verified; Supabase security advisor returned no findings. A default-privilege hardening migration is applied and the database tests now cover anonymous/authenticated write denial and future defaults.
- **Cloudflare Pages is deployed** at [https://cestudy.pages.dev](https://cestudy.pages.dev) from `justryan-n2d/CEStudy`. The user reported that the initial mobile smoke tests worked. The separate failed legacy Worker named `cestudy` was deleted after Pages was working. The chosen architecture does not require a Worker just to host the frontend; add a Worker or Edge Function only for a specific server-side feature.
- Phase 0, Phase 1 (problem validation), and Phase 2 (MVP definition) have some unfinished evidence/checklist items. Building began before user interviews and success metrics were fully recorded; this should be corrected before expanding beyond a small technical preview.

## Phase 0: Project foundation

- [x] Create the GitHub repository.
- [x] Add initial project documentation.
- [x] Keep the repository public for now, as decided.
- [x] Select the initial technology stack.
- [x] Document mandatory backend security requirements.
- [ ] Agree on the first target user and most important problem.
- [ ] Define success metrics for a small pilot.

**Exit condition:** The target user, first use case, MVP boundary, and initial success measures are written down.

## Phase 1: Validate the need

- [ ] Talk to Civil Engineering students from different year levels.
- [ ] Identify how students currently review and where existing tools fall short.
- [ ] Find the first few subjects and topics worth supporting.
- [ ] Test whether students value question practice, explanations, progress tracking, or another feature most.
- [ ] Check content sourcing, attribution, and permissions for contributed materials.
- [ ] Record findings and revise scope before building.

**Exit condition:** Evidence supports one focused use case and a manageable initial content set.

## Phase 2: Define the MVP

- [ ] Map the main user journey from landing page to completing a practice session.
- [ ] Prioritize features as Must-have, Later, or Out of scope.
- [ ] Draft mobile-first wireframes.
- [ ] Define the question format, answer explanations, topic tags, and content review status.
- [ ] Decide whether accounts are necessary for the first release.
- [ ] Refine privacy, moderation, backup, and abuse-prevention requirements for the chosen MVP.
- [ ] Estimate database, hosting, and storage costs under realistic usage. Estimate AI costs only if a student-facing AI feature is proposed for a later phase.

**Exit condition:** The MVP and technical design can be implemented without major unresolved decisions.

## Selected initial stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS.
- **Hosting:** Cloudflare Pages.
- **Main backend:** Supabase PostgreSQL with RLS; Auth and Storage when needed.
- **Source control and automation:** GitHub.
- **Optional server-side functions:** Cloudflare Workers or Supabase Edge Functions only for specific requirements.

See [Project Scope](PROJECT_SCOPE.md) for the direction and [Security Requirements](SECURITY_REQUIREMENTS.md) for mandatory security standards.

## Phase 3: Build the web MVP

The initial scaffold and catalog are committed to `main`. Frontend CI and local Supabase policy tests have passed, and the dedicated remote Supabase project has also been provisioned and checked. The Pages production site is now live at [https://cestudy.pages.dev](https://cestudy.pages.dev); responsive, browser, accessibility, backup/restore, and release checks remain.

Possible MVP components:
- [x] Responsive home and subject navigation.
- [x] Subject and topic pages.
- [x] Practice-question flow is implemented; questions remain hidden until published.
- [x] Content source/verification metadata is represented in the catalog and practice schema.
- [ ] Basic progress tracking if it is essential to the validated use case.
- [ ] Minimal, protected content-management workflow for managing and reviewing questions.
- [x] Database migration with explicit read grants and RLS policies applied to the dedicated remote project.
- [x] Automated local database security tests and remote checks for RLS/grants/publication status.
- [ ] Complete accessibility and browser-error review on the deployed preview.
- [x] Configure Cloudflare Pages, publish the site, and add baseline security headers; the Pages preview build and deploy succeeded in CI.
- [ ] Verify the production API connection, actual response headers/CSP behavior, and browser console/network on desktop and a 320 px viewport.
- [x] Document a source-controlled recovery path for the current seeded-only dataset; full production backup/export and restore drill remain required before mutable student data is added.

**Exit condition:** A small group can use the site to complete the core study task reliably on a phone, and security checks show that unauthorized actions are denied.

## Phase 4: Test and improve

- [ ] Test with a small group of students.
- [ ] Check answer accuracy and report incorrect or unclear content.
- [ ] Measure whether users complete practice sessions and return.
- [ ] Fix high-impact usability, security, and reliability issues.
- [ ] Review actual costs and free-tier limits.
- [ ] Document known limitations and support/contact process.
- [ ] Complete the production security gate in [Security Requirements](SECURITY_REQUIREMENTS.md).

**Exit condition:** User feedback, usage evidence, and security testing justify the next development step.

## Phase 5: Expand carefully

Possible future work, only when evidence supports it:
- [ ] User-submitted questions with moderation and attribution.
- [ ] Consider an optional AI Study Helper only after student testing shows a clear need; evaluate accuracy, privacy, backend security, and cost before approving it. No student-facing AI tutor or live AI API is included in the MVP.
- [ ] Bookmarks, custom quizzes, and richer progress insights.
- [ ] Offline-friendly behavior or downloadable reviewer sets.
- [ ] Additional subjects and year levels.
- [ ] Revenue options that preserve a useful free tier.
- [ ] Android/iOS delivery, based on web usage and user demand.

## Ongoing quality and safety checklist

- [ ] Never commit API keys, tokens, passwords, or real user data.
- [ ] Verify calculations and technical answers before marking them as reviewed.
- [ ] Clearly distinguish verified content from unreviewed community or AI-generated content.
- [ ] Respect copyright and require clear rights/attribution for submitted material.
- [ ] Collect only the personal data the product actually needs.
- [ ] Apply least privilege and review database grants, RLS policies, views, functions, and storage policies.
- [ ] Test denial cases, including cross-user access and privilege escalation.
- [ ] Monitor service limits, storage, backups, and recurring costs.
- [ ] Avoid adding features just because they are technically possible.

## Decision log

Record significant choices with the date, options considered, reason, and consequences.

| Date | Decision | Status |
|---|---|---|
| 2026-10-14 | Start with product definition and a responsive web MVP; postpone native mobile apps until validated | Approved direction |
| 2026-10-14 | Use React + TypeScript + Vite + Tailwind CSS, hosted on Cloudflare Pages, with Supabase as the main backend and GitHub for development | Selected |
| 2026-10-14 | Require database-enforced access control, least-privilege grants, RLS, secret management, and automated security tests before production | Mandatory |
| 2026-10-14 | Exclude student-facing AI tutor, AI-generated questions, and live AI API integration from the MVP; reconsider AI only after student feedback | Approved scope |


## Implementation checkpoint (updated 2026-10-15)

- [x] Create the initial React + TypeScript + Vite + Tailwind application shell.
- [x] Add the curriculum note, four year-level routes, search/filterable 72-record catalog, detail pages, and Mathematics Foundations hub.
- [x] Add Supabase catalog/practice schema, public-read-only grants, RLS policies, and draft Basic Algebra seed records.
- [x] Keep all eight Basic Algebra questions in `needs-review` status and hide them from public queries until a trusted reviewer approves publication.
- [x] Add focused UI/data tests and GitHub Actions checks for lint, tests, and production build.
- [x] Observe successful GitHub Actions app checks (ESLint, five test files, and production build all passed for the initial app commit).
- [x] Confirm the isolated Supabase migration, seed, and RLS policy tests pass in [GitHub Actions run 38595589226](https://github.com/justryan-n2d/CEStudy/actions/runs/38595589226).
- [x] Generate and commit `package-lock.json`; locked installation and frontend checks pass in the lockfile-refresh workflow.
- [x] Create the separate remote CEStudy Supabase project, apply the migration, seed data, and verify RLS, grants, draft visibility, and security-advisor output. See [remote Supabase verification](deployment/2026-10-15-remote-supabase-verification.md).
- [x] Apply `20261014190554_client_default_privileges_hardening.sql` remotely and expand automated RLS/default-permission tests.
- [x] Upgrade Vitest to 4.1.11; candidate CI passed `npm audit` (0 vulnerabilities), lint, tests, build, Pages deployment, and isolated Supabase security tests.
- [x] Add baseline Cloudflare Pages security headers and CI packaging checks; the live response/CSP check remains a manual release gate.
- [x] Connect Cloudflare Pages to `justryan-n2d/CEStudy`, configure the two CEStudy browser environment variables, and deploy the site at [https://cestudy.pages.dev](https://cestudy.pages.dev). Initial mobile smoke tests were reported successful; further viewport and browser checks remain.
- [ ] Complete target-user validation and define pilot success measures.
- [ ] Identify the human content reviewer; review each practice question before publishing.
