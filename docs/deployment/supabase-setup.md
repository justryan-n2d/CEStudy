# CEStudy Supabase setup

## Project separation

Create a dedicated Supabase project for CEStudy. Do not link this repository to a different application's Supabase project. Never use project credentials from Bobaks Ranking or any unrelated application.

## 1. Create the project

Create the CEStudy project in the organization you choose from the Supabase dashboard. Check plan, region, cost, quotas, and pausing/backups before creating it. This repository does not store project IDs or credentials.

Recommended region: choose the nearest supported region for the intended users after checking the current Supabase options and plan. Record the project reference in your private setup notes or GitHub Actions variables, not in a secret-free documentation file if it would identify private account configuration.

## 2. Apply the schema

The source of truth is the migration under `supabase/migrations/`. It creates:

- `catalog_subjects`, readable by public roles through an explicit SELECT grant and RLS policy.
- `practice_questions`, readable by public roles only when `status = 'published'`.
- `subject_lessons`, readable by public roles only when `status = 'published'`.
- No public INSERT, UPDATE, or DELETE grants/policies on these three student-facing tables.

For local validation, use the documented Supabase CLI workflow and `npx supabase test db`. For a new dedicated remote project, link the repository with the CEStudy project reference, inspect migration status, run a dry run, and apply migrations using the CLI. Review the target project reference carefully before any remote write.

The public seed contains catalog metadata only. The live database currently has 52 practice questions and 13 lesson records, all `needs-review` and none published. Do not place real question or lesson content in public seed files. Content must remain in the private CEStudy database and must not be published until a qualified human independently checks correctness, clarity, originality, and attribution.

## 3. Configure the frontend

Set these values in a private local environment file or the Cloudflare Pages build environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Only a publishable key belongs in a browser build. A publishable key is not a permission boundary: explicit grants and RLS must remain the enforcement point. Never expose a Supabase secret/service-role key, database password, or access token in browser code or a `VITE_*` variable.

## 4. Remote verification gate

After configuring the project:

1. Confirm `catalog_subjects`, `practice_questions`, and `subject_lessons` exist under `public`.
2. Confirm RLS is enabled on all three student-facing tables.
3. Verify the anonymous client can read the catalog.
4. Verify the anonymous client sees only lesson and question rows with `status = 'published'`.
5. Verify anonymous insert/update/delete operations fail and private review fields are not browser-readable.
6. Run the Supabase security advisor checks and review each finding, distinguishing intentionally private tables with no client policies from actionable warnings.
7. Confirm the frontend API URL and publishable key belong to CEStudy.

Keep this setup separate from production release approval. The local CI security test is necessary but cannot establish that a remote project or Pages environment is configured correctly.

## References

- [Supabase local development workflow](https://supabase.com/docs/guides/local-development/cli-workflows)
- [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase database testing](https://supabase.com/docs/guides/database/testing)
