# Deploy CEStudy to Cloudflare Pages

This guide documents CEStudy's Cloudflare Pages deployment and the remaining verification required before opening the site broadly to students.

## 1. Connect GitHub to Pages

1. Open the [Cloudflare dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages**.
2. Create a Pages application and select **Connect to Git** for the repository `justryan-n2d/CEStudy`.
3. Select `main` as the production branch.
4. Set the framework preset to **Vite** (or use the custom values below).
5. Use these build settings:

   - Build command: `npm run build` (Cloudflare Pages installs dependencies before building)
   - Build output directory: `dist`
   - Root directory: repository root
   - Node.js: 22

Cloudflare's Git integration should build a preview for a pull request or preview branch and a production deployment for the configured production branch. See the [official Git integration guide](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/).

## 2. Configure browser environment variables

After creating the dedicated CEStudy Supabase project and applying its reviewed migrations, configure these build variables in Pages **Settings → Environment variables** for the production environment and for previews when preview builds need the live database:

- `VITE_SUPABASE_URL`: the CEStudy project API URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: the project's publishable key.

These values are embedded in the browser build. Use only the publishable key, never a secret/service-role key, database password, or Supabase access token. Do not commit actual values to GitHub.

Without these variables, the app uses its bundled public catalog fallback. With them configured, it reads subjects from Supabase and reports database configuration/read-policy errors instead of silently hiding them.

## 3. Preview and routing checks

The repository includes `public/_redirects` to route client-side React paths through `index.html`. The `public/_headers` file sets baseline browser security headers, including a Content Security Policy that permits scripts and assets from the same origin and API connections to the dedicated CEStudy Supabase project. After deployment, verify the headers in browser developer tools and confirm the console reports no Content Security Policy violations.

Before release, verify the Pages preview:

- Open the homepage at a narrow mobile viewport (320 px) and a desktop viewport.
- Use navigation and directly load/reload `/catalog`, `/year/2`, `/math-foundations`, and `/subjects/statics-of-rigid-bodies`.
- Search by subject title and alias; combine and clear catalog filters.
- Confirm the CHED notice and source link are visible.
- Confirm unpublished practice rows do not appear and the practice page shows its review-gate empty state.
- Inspect the browser console and network panel for failed Supabase requests, missing assets, or routing errors.
- Confirm the preview uses the CEStudy Supabase project reference, not another app's project.

## 4. Production gate

Do not treat a successful build as evidence that the hosted preview works. Do not promote to production until the Supabase project's public permissions and RLS tests pass, the preview passes the checks above, the content-review process is in place, and the launch checklist is complete.

### References

- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Supabase local development and migrations](https://supabase.com/docs/guides/local-development/cli-workflows)
