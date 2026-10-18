# CEStudy Roadmap

**Last reviewed:** 2026-10-18  
**Current phase:** Phase 7, pre-launch hardening and release gates.  
**Live website:** https://cestudy.pages.dev

The canonical roadmap is [PHASE_PLAN.md](PHASE_PLAN.md). It records each project's phase, a clear status, the tasks that remain, and the exit criteria through the student pilot, final polishing, and broad launch. Use it instead of older phase labels when deciding what work comes next.

## Current state

- The React + TypeScript + Vite + Tailwind frontend is built and deployed on Cloudflare Pages.
- The app connects to the dedicated CEStudy Supabase project. The catalog contains 72 subjects. The live database currently holds 52 practice questions and 13 lesson records, all `needs-review`, with zero published in either content table after the 2026-10-18 release audit.
- Automated CI and Supabase migration/RLS tests are passing on the latest feature branch, and a full-history secret scan passed. The latest documented production Chromium smoke test is from 2026-10-17, before the 2026-10-18 publication-status correction, so a new production smoke run is still required.
- This is a working deployed MVP, not yet a broadly launched student product. A fresh backup and managed-target restore, B2 lifecycle and GitHub email settings, post-correction production smoke test, manual accessibility/device testing, independent content approval, and the student pilot remain. Main-branch protection is active and verified; the public-repository question-content policy is documented and guarded by CI.

## Locked product direction (2026-10-18)

**CEStudy is both a comprehensive engineering knowledge library and an interactive learning platform.** Students can freely browse subjects and topics, or optionally follow guided learning paths and track progress. See the [learning model decision](product/COMBINED_LEARNING_MODEL.md) for the locked scope, implementation order, acceptance criteria, and constraints.

The first implementation slice is device-local progress plus a flame streak for published lessons only. One or more completions on the same local calendar day count as one streak day. It must not add accounts, cross-device sync, new Supabase writes, or unpublished content exposure. Existing Phase 7 release gates remain active; this direction does not approve a broad launch.

## Ordered priorities

1. **Finish release hardening (current):** create and verify a fresh encrypted backup after the latest database correction, complete a managed-target restore rehearsal, confirm B2 lifecycle and GitHub failure notifications, keep unpublished content out of public source, and re-run production smoke/security checks.
2. **Finish manual quality checks:** test search/filter edge cases, accessibility, direct routes, mobile and desktop behavior, published-only question visibility, and the feedback/correction path.
3. **Prepare content:** have a human reviewer check every question, source, answer, and explanation. Keep unreviewed content unpublished.
4. **Run the controlled pilot:** use the documented 5–8-student plan, record anonymous task results, fix priority problems, and make a go/no-go decision.
5. **Polish and launch:** complete metadata and visual/content review, verify the production deployment, then announce broadly only after the release checklist is complete.

## Product decisions to preserve

- Start with a low-cost, mobile-first web MVP. Keep the current Cloudflare Pages URL `cestudy.pages.dev` for now; custom domain setup is deferred.
- Use React + TypeScript + Vite + Tailwind, Cloudflare Pages, Supabase PostgreSQL/RLS, and GitHub for source control and CI.
- Do not introduce Supabase Storage unless a feature needs uploaded files or private objects. The current structured content lives in PostgreSQL, while off-site database backups target the existing private Backblaze B2 bucket.
- Keep student-facing AI, student accounts, public submissions, cross-device progress, and native Android/iOS apps out of the MVP unless user evidence justifies a later decision. Device-local progress for published lessons is the approved first learning-platform increment.
- Prioritize reviewed engineering content, database-enforced authorization, minimal personal-data collection, transparent sourcing, and reproducible checks.

## Supporting documentation

- [Organized phase plan and release checklist](PHASE_PLAN.md)
- [Current project status and verification record](PROJECT_STATUS.md)
- [Project scope](PROJECT_SCOPE.md)
- [Security requirements](SECURITY_REQUIREMENTS.md)
- [Cloudflare Pages deployment](deployment/cloudflare-pages.md)
- [Supabase setup](deployment/supabase-setup.md)
- [Repository privacy and branch protection](deployment/github-privacy-and-branch-protection.md)
- [Weekly database backup setup](deployment/weekly-backups.md)
- [Pre-launch checklist](deployment/launch-checklist.md)
- [Controlled student pilot plan](plans/2026-10-15-student-pilot-plan.md)

