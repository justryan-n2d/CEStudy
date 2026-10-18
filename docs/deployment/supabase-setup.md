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
- No public INSERT, UPDATE, or DELETE grants/policies on these tables.

For local validation, use the documented Supabase CLI workflow and `npx supabase test db`. For a new dedicated remote project, link the repository with the CEStudy project reference, inspect migration status, run a dry run, and apply migrations using the CLI. Review the target project reference carefully before any remote write.

The public seed contains catalog metadata only. The live database currently has 52 practice questions and 13 lesson records, all `needs-review` and none published. Do not place real question or lesson content in public seed files. Content must remain in the private CEStudy database and must not be published until a qualified human independently checks correctness, clarity, originality, and attribution.

## 3. Configure the frontend

Set these values in a private local environment file or the Cloudflare Pages build environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Only a publishable key belongs in a browser build. A publishable key is not a permission boundary: explicit grants and RLS must remain the enforcement point. Never expose a Supabase secret/service-role key, database password, or access token in browser code or a `VITE_*` variable.

## 4. Optional Google sign-in setup

Google sign-in is optional and only unlocks the local learning-streak feature. Browsing lessons remains available without an account. Study progress and history stay in this browser; signing in does not create server-side progress or cross-device sync.

To enable sign-in, configure Google OAuth in Google Cloud and the dedicated CEStudy Supabase project:

1. In [Google Auth Platform](https://console.cloud.google.com/auth/overview), configure the consent screen and create an OAuth client ID with application type **Web application**.
2. Add these **Authorized JavaScript origins**:
   - `https://cestudy.pages.dev`
   - `http://localhost:5173` for local development only.
3. Add the Supabase callback as an **Authorized redirect URI** in Google Cloud: `https://qqmdwltfgpqtcvdbcmto.supabase.co/auth/v1/callback`.
4. In the [CEStudy Supabase Auth providers dashboard](https://supabase.com/dashboard/project/qqmdwltfgpqtcvdbcmto/auth/providers), enable **Google** and enter the OAuth client ID and client secret. Store the secret only in Supabase provider settings, never in Git, frontend source, a `VITE_*` variable, or chat.
5. In Supabase **Authentication → URL Configuration**, set the Site URL to `https://cestudy.pages.dev` and add `https://cestudy.pages.dev/login` to allowed redirect URLs. Add `http://localhost:5173/login` for local testing only.
6. Save the provider configuration and test sign-in, sign-out, cancellation, and safe return destinations on the production and local URLs. Do not claim OAuth is production-ready until a real end-to-end test passes.

See the [Supabase Google sign-in guide](https://supabase.com/docs/guides/auth/social-login/auth-google).

## 5. Remote verification gate

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
