# CEStudy repository guide

**Audience:** maintainers and contributors  
**Source of truth:** the code, migrations, workflows, and focused documents in this repository  
**Status date:** 2026-10-18

This guide explains where the main parts of CEStudy live, how data moves through the app, how to make a change safely, and which checks are expected before merge. It is an orientation document, not a replacement for the detailed security, deployment, or content-publication rules.

## 1. What this repository builds

CEStudy is a mobile-friendly Civil Engineering reviewer for students from first year through fourth year. The app is a React single-page web app deployed to Cloudflare Pages. Supabase PostgreSQL provides the public catalog and published reviewer content. GitHub stores application source, migrations, tests, documentation, and CI workflows.

Production URL: [https://cestudy.pages.dev](https://cestudy.pages.dev)

The project is still in pre-launch hardening. A successful build or deployment does not mean the content has been academically approved or that the student launch is authorized. See [Project Status](PROJECT_STATUS.md), [Phase Plan](PHASE_PLAN.md), and the [Pre-launch checklist](deployment/launch-checklist.md).

## 2. Main source layout

| Path | Responsibility |
| --- | --- |
| `src/main.tsx` | Browser application entry point. |
| `src/App.tsx` | Route table and page composition. Add or change route definitions here. |
| `src/components/` | Shared UI pieces such as the site layout, subject cards, topic reader, practice question, modal, and safe Markdown renderer. |
| `src/pages/` | Page-level views for the home page, catalog, year levels, subject details, lesson reader, practice, owner content review, and contact/support flows. |
| `src/data/` | API calls and data access adapters. Keep data-fetching concerns out of presentation components where the current API modules already cover them. |
| `src/hooks/` | Reusable React hooks, including catalog loading. |
| `src/types/` | Shared TypeScript data contracts for catalog, lessons, and practice content. |
| `src/styles/global.css` | Shared responsive styles and component styling. |
| `src/test/` | Vitest and Testing Library unit/component tests. Use synthetic fixtures only. |
| `supabase/migrations/` | Ordered SQL schema, grants, RLS policies, and data-management changes. |
| `supabase/tests/` | Database tests for policies, grants, publication filtering, and forbidden access. |
| `supabase/seed.sql` | Public catalog seed data only. It must not contain real unpublished lessons or practice questions. |
| `supabase/functions/` | Server-side Edge Functions for narrowly scoped public submissions and owner-authorized management actions. |
| `scripts/` | Live Chromium smoke checks and backup, encryption, retention, and their tests. |
| `.github/workflows/` | CI, live-site smoke verification, secret scanning, lockfile recovery, and scheduled backup workflows. |
| `public/` | Static assets and Cloudflare Pages routing/security-header files, including `_redirects` and `_headers`. |
| `docs/` | Product scope, architecture decisions, security requirements, content policy, UX, deployment, operations, research, and review records. |

### Page and data flow

1. `src/App.tsx` maps a URL to a page component; `src/components/Layout.tsx` supplies the shared site shell and navigation.
2. Pages use components and the modules in `src/data/` to load the information they need.
3. `src/lib/supabase.ts` initializes the browser Supabase client from the configured public Vite variables.
4. Supabase grants and Row Level Security (RLS) determine what a browser session can read. UI checks and hidden buttons are not authorization.
5. Cloudflare Pages serves the built static app from `dist/`. The `public/_headers` and `public/_redirects` files must be present in the output.

Use the existing component and data-access pattern before introducing new state libraries, backend services, or dependencies.

## 3. Core routes

Routes are defined in `src/App.tsx`; treat the file as the authoritative route list.

| Route pattern | Purpose |
| --- | --- |
| `/` | Home |
| `/catalog` | Searchable subject catalog |
| `/years`, `/year/:year` | Year-level browsing |
| `/math-foundations` | Supplementary mathematics topics |
| `/subjects/:slug` | Subject information and entry point |
| `/study/:slug`, `/study/:slug/:unit` | Published lesson/topic reader |
| `/practice/:slug` | Published practice questions for a subject; the topic query parameter can narrow the session when supported |
| `/owner/content-review` | Owner-only content review interface |
| `/feedbacks` | Owner feedback inbox |

The presence of a route does not prove it is available in production; a route added on a pull-request branch requires a successful preview deployment and merge/deployment before it becomes a production feature.

## 4. Data ownership and publication rules

### Public repository

The public repository may contain application code, migrations, public catalog metadata, documentation that does not reveal unreleased learning content, and generic synthetic fixtures.

**Never commit real unpublished question prompts, choices, correct answers, solution steps, explanations, unpublished lesson bodies, or private review notes** to source files, `supabase/seed.sql`, tests, screenshots, logs, issues, pull-request text, or build artifacts. CI includes a guard for practice-question content in the public seed.

### Supabase

Supabase is the data source for public catalog and published reviewer content. Key tables are defined through migrations and include the catalog, subject lessons, practice questions, and private feedback-related records.

- Client reads must be limited to content approved for public release, usually by a `status = 'published'` rule enforced by RLS and by the query.
- The browser must use only the Supabase publishable key. Never put a secret/service-role key, database password, signing secret, or access token in client code or a `VITE_*` variable.
- Public browser roles must not be granted write access to owner content-management operations.
- Review metadata such as private notes and internal review timestamps must not be made public simply because a page displays the corresponding content.
- Actual drafts belong in the dedicated CEStudy database with a review-needed status. Use the owner-only content review flow for authorized edits, verification, and explicit publication.

Before changing a table, column, status transition, grant, policy, view, or function, read [Security Requirements](SECURITY_REQUIREMENTS.md) and [Content authoring and publication](content-authoring-and-publication.md). Put schema changes in a migration; do not make an undocumented one-off production change.

## 5. Local development and standard checks

Requirements: Node.js 22+ and npm. Docker-compatible support is needed only for running the local Supabase test stack.

```bash
npm ci
npm run dev
npm run lint
npm run test -- --run
npm run build
```

For database migrations and RLS tests, install the Supabase CLI and use a local isolated stack:

```bash
supabase start
supabase db reset
supabase test db
supabase stop
```

Do not run `supabase db reset --linked` against a shared or production project. Treat it as destructive.

When changing a dependency, update `package.json` and the matching `package-lock.json` through npm. Do not hand-edit the lockfile. Routine CI uses `npm ci` so the committed lockfile defines the installed dependency tree.

## 6. Automated checks and deployment

The primary workflows live in `.github/workflows/`:

- **CI:** dependency audit, public-seed privacy guard, ESLint, unit tests, production build, Pages header/redirect packaging, backup script checks, and isolated Supabase migration/RLS tests.
- **Live browser smoke:** Chromium checks direct page loads, visible errors, key response headers, responsive layouts, expected Supabase requests, published-only responses, and the CHED source link. Read the run summary; a green build alone is not a browser test.
- **Secret scan:** scans repository history for exposed credentials.
- **Lockfile refresh:** repairs a missing lockfile update through a workflow, then invokes standard checks.
- **Weekly database backup:** creates and verifies encrypted backup artifacts and applies retention logic.

Cloudflare Pages builds the repository root with `npm run build` and publishes `dist`; production follows `main`. The default preview for a branch or commit is separate from production. Verify the exact deployed commit and preview URL in the Pages check before testing a preview.

A successful CI job validates only the checks it runs. Report database/RLS tests, deployment, live browser tests, manual device review, and content approval separately.

## 7. Math and content rendering contract

`src/components/MarkdownContent.tsx` deliberately supports a small safe subset of Markdown and does not interpret raw HTML. Math notation should be explicit:

- Inline math: `\\(x^2 + y^2 = r^2\\)`
- Display math on separate lines: `\\[\\frac{a}{b} = c\\]`

The dedicated KaTeX integration uses shared inline/display rendering components when present. Keep this path consistent across lessons, practice prompts, choices, answer feedback, and worked steps. Do not infer math from single dollar signs: prices such as `$5` are plain text, and math-like text inside inline code remains literal.

When using KaTeX, keep `trust: false`, bounded `maxExpand` and `maxSize`, and HTML + MathML output. Keep raw HTML unsupported. The CSP's `style-src-attr 'unsafe-inline'` allowance is needed for KaTeX's formula-layout attributes, but applies to inline style attributes generally. Keep `script-src 'self'` and do not enable trusted KaTeX commands without a separate security review.

For any release containing math rendering, verify the exact Pages preview commit, valid inline and display equations, malformed-formula fallback, currency, inline code, raw-HTML handling, mobile overflow, and the CSP response header. A passing build alone does not prove formulas render in the learner's browser.
 
## 8. Making a change safely

1. Read this guide plus the relevant focused design, security, content, or deployment documents.
2. Inspect the existing code, callers, tests, and Git history before editing.
3. Create a descriptive branch from the current `main` commit; keep independent documentation and feature work separate when practical.
4. For behavior changes, add a test that demonstrates the missing behavior, then implement the smallest change that passes it.
5. Review the diff for unrelated edits, unsafe data exposure, accessibility, mobile behavior, error paths, and outdated documentation.
6. Run lint, all unit tests, production build, and relevant database/security tests. Review the CI run for the exact branch commit.
7. Use the pull-request preview for browser checks. Keep the PR open for review and do not bypass branch protection.
8. After an approved merge, verify the production deployment and any affected live API/security behavior before marking it complete.

## 9. Documentation map

- [Project Scope](PROJECT_SCOPE.md) and [Roadmap](ROADMAP.md): intended product and direction.
- [Phase Plan](PHASE_PLAN.md) and [Project Status](PROJECT_STATUS.md): delivery state and ordered release gates.
- [Development Workflow](DEVELOPMENT.md): commands, local Supabase, and dependency/seed rules.
- [Security Requirements](SECURITY_REQUIREMENTS.md): grants, RLS, secrets, input handling, and release security.
- [Architecture Decision](decisions/0001-initial-web-architecture.md): why the current stack was selected.
- [Content authoring and publication](content-authoring-and-publication.md): where drafts belong and the explicit review-to-publish process.
- [UX/UI design system](specs/UX_UI_DESIGN_SYSTEM.md): branding, components, responsiveness, motion, and performance.
- [Cloudflare Pages](deployment/cloudflare-pages.md), [Supabase setup](deployment/supabase-setup.md), and [backup/recovery](deployment/backup-and-recovery.md): operational setup and recovery.
- [Pre-launch checklist](deployment/launch-checklist.md): blocking items before a broad student launch.
