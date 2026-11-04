# CEStudy development workflow

## Requirements

- Node.js 22
- npm
- Git
- Docker-compatible runtime only when running Supabase locally

## Install and verify

Use the lockfile for deterministic dependency installation:

```bash
npm ci
npm run lint
npm run test -- --run
npm run build
npm run dev
```

When a dependency changes, update `package.json` and commit the corresponding `package-lock.json`. The `Refresh npm lockfile` workflow is a safety net: if a `package.json` change lands on `main` without the updated lockfile, it resolves the lock using the workflow's Node/npm environment, performs an install and all frontend checks, commits the lockfile, then dispatches the regular CI workflow on the updated `main` head.

CI must use `npm ci`, not `npm install`, for routine checks once the lockfile is committed. Do not hand-edit lockfile contents.

For Supabase Edge Function changes, install Deno 2 and run the security test module as well:

```bash
deno check supabase/functions/security_test.ts
deno test --allow-env=ALLOWED_ORIGINS,FEEDBACK_INBOX_ACCESS_KEY,SUPABASE_SERVICE_ROLE_KEY,SUPABASE_URL supabase/functions/security_test.ts
```

## Local Supabase

Install the Supabase CLI following its current official instructions. Start a local stack, apply the migration and seed, and run the row-level security tests:

```bash
npx supabase start
npx supabase db reset
npx supabase test db
npx supabase stop
```

The CI workflow already starts an isolated Supabase stack and runs `supabase test db`. Local setup must be reproducible and must not be exposed to public traffic.

## Changes to schema and seed data

- Put schema changes in timestamped migrations committed under `supabase/migrations/`.
- Keep review data and catalog fallback data aligned with the SQL seed.
- Run the full database security test suite after changing grants, policies, exposed tables, or publication states.
- Do not run `supabase db reset --linked` against a shared or production database; it is destructive.
- Never commit Supabase passwords, access tokens, secret keys, or actual deployment environment files.

## CI entry point

The GitHub Actions workflow `CEStudy CI` checks ESLint, frontend/data tests, the Vite production build, Supabase migration/RLS tests, and Deno Edge Function origin and owner-token security tests. A passing local or CI build does not prove that a real Pages deployment or remote Supabase project's settings are correct; follow the deployment and release checklists separately.
