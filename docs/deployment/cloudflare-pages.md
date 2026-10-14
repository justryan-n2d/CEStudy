# Deploy CEStudy to Cloudflare Pages

This guide describes the planned static-site deployment. Deployment is not complete until the generated preview has been tested on mobile and desktop.

## Build settings

- Production branch: main
- Build command: npm run build
- Build output directory: dist
- Runtime: static frontend; Supabase serves public catalog and published practice reads

## Steps

1. Open Cloudflare Dashboard and connect the CEStudy GitHub repository under Workers & Pages.
2. Select main as the production branch, npm run build as build command, and dist as output directory.
3. Configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY only after reviewing Supabase grants and RLS. A publishable key is intentionally public; never use a secret/service-role key.
4. Deploy a preview first. Test at 320 px and desktop widths, including navigation, all year levels, search/filters, the CHED note and source link, math foundations, and the practice publication gate.
5. Promote only after database tests deny public writes and unapproved practice questions remain inaccessible.

## SPA routing

Confirm Pages serves index.html as a fallback for routes such as /catalog, /year/2, and /subjects/statics-of-rigid-bodies. Verify the deployed site.

## Before launch

Re-check current Cloudflare Pages limits, Supabase pricing and quotas, and CHED issuances. Keep preview and production settings separate, document content/database backups, and run the security release gate.
