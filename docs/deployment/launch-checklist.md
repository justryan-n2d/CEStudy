# CEStudy pre-launch checklist

Do not announce or open CEStudy to student users until each blocking item is checked and evidence is recorded.

## Dependency and build

- [ ] `package-lock.json` is committed and `npm ci` succeeds.
- [ ] GitHub Actions lint, tests, frontend build, and Supabase database security tests pass on the exact candidate commit.
- [ ] No secrets, credentials, or private environment files appear in the repository.

## Supabase

- [ ] Dedicated CEStudy Supabase project and correct project reference confirmed.
- [ ] Migrations applied without resetting or damaging a shared/production database.
- [ ] RLS enabled and grants reviewed on every exposed table.
- [ ] Anonymous catalog reads work.
- [ ] Questions requiring review remain hidden.
- [ ] Anonymous write attempts are denied.
- [ ] Supabase security advisors reviewed; database backup/restore strategy documented.
- [ ] Only URL + publishable key configured in the frontend; no privileged secret exposed.

## Cloudflare Pages deployment

- [x] GitHub repository linked to Pages; build command is `npm run build`, output directory is `dist`.
- [ ] Preview environment variables point at the CEStudy project.
- [ ] Mobile 320 px and desktop views checked.
- [ ] Direct links and refreshes work on every app route.
- [ ] Catalog search, filters, empty states, and source links work.
- [ ] Browser console/network checks show no unexpected errors.
- [ ] Cloudflare Pages security headers are present and Content Security Policy causes no required-resource violations.
- [ ] Practice review gate works and no unpublished questions are leaked.

## Educational content and pilot

- [ ] Human content reviewer identified.
- [ ] Every published question is checked for correctness, clear steps, source/attribution, and permission to use.
- [ ] Target-user validation and initial success metrics are recorded.
- [ ] A feedback/contact path and correction/removal process are ready.
- [ ] Production promotion is explicitly approved only after all blocking items pass.
