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
- No public INSERT, UPDATE, or DELETE grants/policies on these tables.

For local validation, use the documented Supabase CLI workflow and `npx supabase test db`. For a new dedicated remote project, link the repository with the CEStudy project reference, inspect migration status, run a dry run, and apply migrations using the CLI. Review the target project reference carefully before any remote write.

The seed contains catalog metadata and eight original draft Basic Algebra questions. The questions start as `needs-review`; they must not be published until a human has independently reviewed every prompt, option, answer, solution step, and explanation. Do not run draft seed data against a populated production project.

## 3. Configure the frontend

Set these values in a private local environment file or the Cloudflare Pages build environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Only a publishable key belongs in a browser build. A publishable key is not a permission boundary: explicit grants and RLS must remain the enforcement point. Never expose a Supabase secret/service-role key, database password, or access token in browser code or a `VITE_*` variable.

## 4. Google sign-in setup

CEStudy's login page offers **Google only**. Supabase Auth sessions persist in the browser, and the app uses the authenticated Supabase user ID to isolate local streak activity. Lesson browsing and completion tracking remain available without an account, but a signed-out completion does not count toward a streak.

Google OAuth needs one-time setup in Google Cloud and the dedicated CEStudy Supabase project:

1. In [Google Auth Platform](https://console.cloud.google.com/auth/overview), configure the consent screen and create an OAuth client ID with application type **Web application**.
2. Add these **Authorized JavaScript origins**:
   - `https://cestudy.pages.dev`
   - `http://localhost:5173` for local development only.
3. Add this **Authorized redirect URI** in Google Cloud: `https://qqmdwltfgpqtcvdbcmto.supabase.co/auth/v1/callback`.
4. In the [CEStudy Supabase dashboard](https://supabase.com/dashboard/project/qqmdwltfgpqtcvdbcmto/auth/providers), enable **Google** and enter the Google OAuth client ID and client secret. If Google is to remain CEStudy's only login method, disable unused sign-in providers such as Email and Phone in Supabase Auth. Keep the client secret in Supabase's provider configuration, never in GitHub, Vite variables, frontend source, or this chat.
5. In Supabase **Authentication → URL Configuration**, set the Site URL to `https://cestudy.pages.dev` and add these app redirect URLs:
   - `https://cestudy.pages.dev/login`
   - `http://localhost:5173/login` for local development.
6. Save the configuration, then test Google sign-in and sign-out on the production URL and local development URL.

The application code is prepared for Google OAuth, but the live sign-in flow cannot work until the Google client ID/secret and Supabase provider/redirect settings above are configured. Do not mark authentication as production-verified before that manual test passes. See the [current Supabase Google sign-in guide](https://supabase.com/docs/guides/auth/social-login/auth-google).

## 5. Remote verification gate

After configuring the project:

1. Confirm `catalog_subjects` and `practice_questions` exist under `public`.
2. Confirm RLS is enabled on both tables.
3. Verify the anonymous client can read the catalog.
4. Verify the anonymous client sees only rows with `status = 'published'`.
5. Verify anonymous insert/update/delete operations fail.
6. Run the Supabase security advisor checks and review all findings before preview.
7. Confirm the frontend API URL and publishable key belong to CEStudy.

Keep this setup separate from production release approval. The local CI security test is necessary but cannot establish that a remote project or Pages environment is configured correctly.

## References

- [Supabase local development workflow](https://supabase.com/docs/guides/local-development/cli-workflows)
- [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase database testing](https://supabase.com/docs/guides/database/testing)
