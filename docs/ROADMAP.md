# CEStudy Roadmap

**Last reviewed:** 2026-10-19  
**Current phase:** Phase 7, pre-launch hardening and release gates  
**Live website:** https://cestudy.pages.dev  
**Launch decision:** Broad student launch is not approved.

The [Phase Plan](PHASE_PLAN.md) is the single source of truth for phase definitions, detailed tasks and exit criteria. This roadmap is a short current-state summary. Statuses describe evidence, not a perfectly sequential history: frontend work was implemented before all student-discovery and UX validation work was documented.

## Current state: checked against code and live data

- **App code exists:** React + TypeScript + Vite + Tailwind, the subject catalog, four year-level routes, mathematics foundations, subject details, lesson/practice screens, browser-local lesson progress/streak, Privacy/Contact/Feedback/Bug Report flows, and owner-only content-review tooling.
- **Production is deployed:** Cloudflare Pages at [cestudy.pages.dev](https://cestudy.pages.dev), connected to the dedicated CEStudy Supabase project. The latest recorded production Chromium smoke test [39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712) passed 135/135 checks on 2026-10-18. Main CI [39143132029](https://github.com/justryan-n2d/CEStudy/actions/runs/39143132029) and full-history secret scan [39143131985](https://github.com/justryan-n2d/CEStudy/actions/runs/39143131985) also passed on their recorded commits.
- **Live content state:** A read-only database check on 2026-10-19 confirmed 72 catalog subjects, 52 practice questions and 13 lesson records. All 52 questions and 13 lessons are `needs-review`; none are verified or published. RLS and published-only student-facing policies remain in place.
- **Features are not the same as ready content:** Study/practice views, local progress and an owner review tool are implemented, but there are no published lessons or practice questions. Learning-content creation and independent review remain the main product gap.
- **Release blockers remain:** a fresh encrypted backup after the latest database correction, a managed-Supabase restore rehearsal, B2 lifecycle and GitHub failure-email checks, physical-device/accessibility QA, search/filter edge cases, independent human content review, and the controlled student pilot.
- **Optional accounts remain out of scope:** Google sign-in/Profile work is in draft [PR #44](https://github.com/justryan-n2d/CEStudy/pull/44). Browser-local progress is already in main. Do not merge account features without an explicit scope decision, OAuth configuration, and end-to-end sign-in/sign-out checks.

## Phase status at a glance

| Phase | Current status | What the evidence says |
|---|---|---|
| 0. Repository and project foundation | Complete | Stack, source control, project/security docs, scripts and CI exist. |
| 1. Student discovery and problem validation | Not started | No findings note based on student conversations is recorded. |
| 2. MVP scope, user journey and UX specification | Partially complete | Core scope/architecture and a shipped UI baseline exist; discovery, written journey and validated pilot measures remain. |
| 3. Database, backend access and security baseline | Complete for current MVP | Live RLS, grants and published-only content policies are implemented and checked. |
| 4. Frontend MVP implementation | Complete for current app scope | Core application workflows are implemented; published learning content is tracked separately in Phase 8. |
| 5. Cloudflare Pages and Supabase integration | Complete for initial deployment | Production Pages site and dedicated Supabase connection are active. |
| 6. Automated and manual technical QA | Partially complete | Recorded CI and production smoke checks pass; manual device/accessibility and edge-case checks remain. |
| 7. Pre-launch hardening and release gates | **Current** | Current-state backup/recovery proof, backup-account safeguards and manual QA remain. |
| 8. Human content review and approved publishing | Partially complete: tooling exists | Owner-only review UI/API and data access controls exist; human review and publication have not begun. |
| 9. Controlled student pilot | Not started | The 5–8-student plan exists; no pilot has run. |
| 10. Final polish and broad public launch | Not started | Pilot findings, final verification and launch approval remain. |
| 11. Ongoing operations and future expansion | Partially implemented; expansion deferred | CI, scheduled workflows, feedback tools and local progress exist; accounts, AI and native apps remain future choices. |

## Ordered priorities

1. **Finish Phase 7.** Back up the current live state, prove managed-Supabase recovery in a separate approved test project, verify B2 lifecycle and GitHub failure notifications, and complete manual device/accessibility/security checks.
2. **Close Phases 1–2 catch-up work in parallel.** Record student discovery, the primary user journey and validated pilot measures before investing in another feature family. Keep the deployed UI as the design baseline; do not rebuild the app to force the original sequence.
3. **Complete Phase 8 content approval.** Select a small first set of original learning content, obtain independent human review, record source/rights and approval, and publish only approved items.
4. **Run Phase 9 pilot.** Test navigation/search on 5–8 Civil Engineering students after Phase 7 gates pass. Use practice questions only if Phase 8 has explicitly approved and published them. Record anonymous findings and decisions.
5. **Complete Phase 10.** Fix high-impact pilot issues, run final release checks and document the broad-launch go/no-go decision.

## Product and technical decisions to preserve

- CEStudy is both a freely browsable engineering knowledge library and an optional guided-learning platform.
- Keep the current React + TypeScript + Vite + Tailwind, Cloudflare Pages, Supabase PostgreSQL/RLS and GitHub architecture.
- Browser-local lesson completion and streaks are implemented. Do not add server-side progress, accounts or cross-device sync unless separately approved after user research and a privacy/security review.
- Keep unpublished lessons/questions in Supabase, not in public seed files or frontend bundles. Human review is required before publication.
- Do not introduce Supabase Storage unless an approved feature requires object/file storage.
- Keep the default `cestudy.pages.dev` URL for now. Custom domain purchase/configuration remains deferred.
- Use original explanations, worked examples and diagrams informed by references, not copied textbook or Mathalino content.

## Supporting documents

- [Canonical phase plan](PHASE_PLAN.md)
- [Current project status](PROJECT_STATUS.md)
- [Project scope](PROJECT_SCOPE.md)
- [Security requirements](SECURITY_REQUIREMENTS.md)
- [Deployment and backup recovery plan](deployment/backup-and-recovery.md)
- [Pre-launch checklist](deployment/launch-checklist.md)
- [Content authoring and publication policy](content-authoring-and-publication.md)
- [Controlled student pilot plan](plans/2026-10-15-student-pilot-plan.md)
