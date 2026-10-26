# MASTER ROADMAP FOR CEStudy

**Document status:** Owner-approved direction; canonical planning document for CEStudy UX/UI redesign and roadmap tracking.
**Owner approval:** Blueprint Academy selected on 2026-10-22 (Asia/Manila).
**Baseline snapshot:** `main` at `887b3f5a0b826ac0019f266de5e53fd6278958d3`, rechecked 2026-10-26 (Asia/Manila).
**Scope of this record:** Product direction, UX/UI decisions, verified baseline, implementation sequence, acceptance criteria, and release safeguards.
**Application implementation status:** No application code changes are authorized by this document.

> **Authority:** Use this document as the canonical plan for CEStudy's product direction, UX/UI scope, approved design decisions, and implementation sequence. It consolidates the owner-approved directions recorded in [PR #51](https://github.com/justryan-n2d/CEStudy/pull/51). If planning documents conflict, this roadmap's latest owner-approved decision register takes precedence. Actual code, current data contracts, security policy, and CI/release gates remain authoritative for what is implemented and safe to ship. This document does not authorize implementation, merge, deployment, or production changes by itself.

> **Repository note (verified 2026-10-23):** This canonical roadmap is present on `main`. Its approved decisions control product direction, UX/UI scope, and implementation order. Supporting plans and feature PRs must be reconciled to this document before merge. Actual source code, data contracts, security controls, and CI/release gates still determine what is implemented and safe to ship.

## 1. Purpose and product outcome

CEStudy is a Civil Engineering learning and reviewer platform for undergraduate students. It should help students find the right subject, understand concepts and formulas, follow worked solutions, practice problems, and understand their actual learning activity.

The target is a distinctive, technically credible, student-friendly website that supports long reading sessions and dense engineering problem-solving without becoming a generic SaaS dashboard or a clone of another product.

The product should make sense when optional rewards are disabled, when a user is signed out, when no relevant history exists, when a subject has no published lessons, and when a service or resource is unavailable.

### Design direction selected by the owner

**Approved: Blueprint Academy.** Use this as the primary CEStudy visual direction. Combine:

- Comfortable light-default learning surfaces and clear educational feedback.
- A precise engineering-workspace layout for formulas, diagrams, tables, and practice tools.
- Clear navigation, structured activity, status clarity, and reusable components.
- A restrained CEStudy brand identity, retaining the canonical logo and brand blue `#0754B5`.

Use Duolingo, Discord, GitHub, and Autodesk AutoCAD only as references for selected design principles. Do not copy their logos, branding, exact screens, or proprietary assets.

### Design principles

1. **Learning content first.** Lessons, questions, diagrams, and solutions receive the space they need.
2. **One coherent product.** Learning pages and technical workspaces share tokens and component behavior.
3. **Progressive density.** Reading pages are comfortable; dense workspaces can expose more controls without crowding content.
4. **Truthful product state.** Never fabricate progress, available content, reward totals, rankings, or exam-readiness claims.
5. **Accessible by construction.** Keyboard operation, visible focus, contrast, zoom, reduced motion, and useful error recovery are requirements.
6. **Security at the actual boundary.** Hiding a control in the UI does not authorize access to protected data.
7. **Small reviewable releases.** Prefer focused vertical slices over a high-risk full-site rewrite.

## 2. Source-of-truth and change-control policy

This roadmap controls the intended product design, scope, decision register, and sequence. It does not replace the sources needed to verify actual behavior.

- Current source code and the checked-out commit determine what exists now.
- Supabase schemas, grants, RLS policies, Edge Functions, and access tests determine actual data access and authorization.
- Existing CI, secret scanning, backup verification, content review, publication, authentication, OAuth, and release gates remain binding.
- Supporting design and planning documents may add implementation detail, but cannot override explicit owner-approved decisions in this roadmap.
- Roadmap status labels must distinguish verified implementation from a proposal, draft-only feature, blocked check, and unresolved decision.
- Before revising an approved decision, record the new owner approval and update the decision register and revision history.
- When the roadmap changes, update affected acceptance criteria and test requirements. Do not silently treat an old PR or draft document as the latest approved direction.

## 3. Repository baseline and current status

### 3.1 Main branch snapshot

| Item | Verified state on 2026-10-26 |
|---|---|
| Repository | [justryan-n2d/CEStudy](https://github.com/justryan-n2d/CEStudy), public repository |
| Default branch | `main` |
| Current `main` SHA | `887b3f5a0b826ac0019f266de5e53fd6278958d3` |
| Latest main commit | `docs: record Phase 2 navigation merge`, committed 2026-10-23 |
| Stack declared by `package.json` | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, React Router 7, Supabase JS, KaTeX 0.19, Vitest and Testing Library |
| Main CI and Supabase migration/RLS checks | Success on this main SHA: [run 39884056913](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056913) |
| Main full-history secret scan | Success on this main SHA: [run 39884056672](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056672) |
| Production Chromium smoke | Success on 2026-10-25 for this main SHA: [run 40240604028](https://github.com/justryan-n2d/CEStudy/actions/runs/40240604028) |
| Encrypted backup workflow | Success on 2026-10-25: [run 40172509628](https://github.com/justryan-n2d/CEStudy/actions/runs/40172509628) |

These are GitHub-hosted results associated with the inspected main SHA or workflow. The local clone attempt for this audit failed because DNS could not resolve `github.com`; no local test/build command or direct interactive preview inspection was run. That limitation does not invalidate the linked GitHub check records, but it must not be represented as a fresh local run or manual visual approval.

### 3.2 Relevant pull requests and current integration state

Live GitHub metadata was rechecked on 2026-10-26. PR #67 is the current main-targeted integration candidate. The code/test head before this documentation-only update was `8c942711c40019758682b70599fccc2aa7c69807`; its CI, Supabase migration/RLS, secret-scan and Cloudflare preview checks completed successfully. The branch contains the account-scoped local-storage change and regression tests; this documentation-only commit requires fresh checks. The PR remains open, draft, unmerged, and reported mergeable at the last metadata read. A mergeable flag is not release approval.

| PR | Verified state and role | Required handling |
|---|---|---|
| [#44 Google sign-in and local learning activity](https://github.com/justryan-n2d/CEStudy/pull/44) | Open, draft, unmerged, not mergeable. Branch `feature/google-auth-streak-gate-rebased`, head `662e413601cef93100534b8be52f1a76fe35b335`; recorded base SHA `e6f657cbbf94467e427fc6183c9714e965098598`. | Legacy overlapping account implementation. Do not merge wholesale or import its competing theme/navigation shell. Do not change its state without separate authorization. |
| [#64 Google auth/session and profile](https://github.com/justryan-n2d/CEStudy/pull/64) | Open, draft, unmerged, mergeable. Branch `feat/google-auth-session-profile-2026-10-23`, head `69cabc3ceb8872163a41202e8e18be72b59e7f5e`, base `main` at `887b3f5a0b826ac0019f266de5e53fd6278958d3`. | Source slice for auth/session/profile/privacy now consolidated in #67. Do not merge separately. Preserve its existing state until the owner explicitly authorizes a follow-up. |
| [#65 device-local lesson history and account-isolated streaks](https://github.com/justryan-n2d/CEStudy/pull/65) | Open, draft, unmerged, not mergeable. Branch `feat/student-learning-history-streak-2026-10-23`, head `af3457b6538f34b8c6cd8910439b531ee61f6843`, stacked on #64's branch at `854f6c68bf0eb068df6a5f10e9229fecc588b74a`. | Older dependent slice, not the integration candidate. Do not merge or close as part of this documentation task. |
| [#66 device-local learning history and streak](https://github.com/justryan-n2d/CEStudy/pull/66) | Open, draft, unmerged, not mergeable. Branch `feat/learning-history-streak-2026-10-23`, head `9c4a310728abc503e13b8851679f322cd510c845`, stacked on #64's branch at `854f6c68bf0eb068df6a5f10e9229fecc588b74a`. | Older dependent/alternate slice, not the integration candidate. Do not merge or close as part of this documentation task. |
| [#67 integrated Google auth and device-local learning activity](https://github.com/justryan-n2d/CEStudy/pull/67) | Open, draft, unmerged, mergeable at the last metadata read. Branch `feat/local-history-streak-2026-10-23b`, base `main` at `887b3f5a0b826ac0019f266de5e53fd6278958d3`. The pre-documentation code/test head was `8c942711c40019758682b70599fccc2aa7c69807`, with its four attached checks successful. | Single main-targeted candidate for approved auth/profile/local activity. The branch separates guest and per-user history/completed lessons with versioned localStorage keys and includes regression coverage; data remains device-local and unscoped v1 records are not migrated. Keep draft until independent review, fresh checks, manual OAuth/callback/retry and account-switching tests, dependency-advisory review, current-base conflict check, and all release gates pass. |

**Checks on the pre-documentation PR #67 code/test head (these do not validate this documentation-only update):** all four checks passed on `8c942711c40019758682b70599fccc2aa7c69807`: [CI including lint/tests/build and Supabase migration/RLS, run 40269399491](https://github.com/justryan-n2d/CEStudy/actions/runs/40269399491), [full-history secret scan, run 40269399468](https://github.com/justryan-n2d/CEStudy/actions/runs/40269399468), and [Cloudflare Pages check](https://github.com/justryan-n2d/CEStudy/runs/121398826175). CI reported 35 test files passed; migration/RLS tests passed; preview deployed at [commit preview](https://06358ebf.cestudy.pages.dev) and [branch preview](https://feat-local-history-streak-20-4d7n.cestudy.pages.dev). The dependency audit reported two moderate Vitest/@vitest-mocker advisories; it did not fail because the command is `npm audit --audit-level=high`. These checks do not validate this documentation-only update; check the live PR for fresh results on the final head.

**Outstanding integration gates:** no independent reviewer approval or requested reviewers are recorded. Manual browser interaction against the latest preview has not been verified. Confirm Google provider cancellation/recovery, a controlled failed PKCE token exchange followed by a successful retry, and the exact preview redirect allow-lists in Google Auth Platform and Supabase. For standard Supabase Google sign-in, the Google OAuth client's authorized redirect URI is the Supabase Auth callback URL shown on the Supabase Google-provider page; the app preview URL is the post-login `redirectTo` that must match Supabase Auth URL Configuration. See [Supabase Google sign-in setup](https://supabase.com/docs/guides/auth/social-login/auth-google) and [Supabase redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls). Do not change production OAuth settings to accommodate a preview: if the current allow-list does not already permit the preview, stop and arrange a separate test configuration or owner-approved safe preview setup. The candidate scopes guest/user history and completion records with versioned localStorage keys and scopes streak days by user ID; verify account switching, clearing only the active scope, no stale account snapshot appearing, and legacy v1 records staying hidden. This remains browser-local, not server-side security. Also review the two moderate Vitest/@vitest-mocker advisories noted in CI. Recheck the current base/conflict state before any later merge.

PR #67 must not be merged, deployed to production, or used to publish content as part of this documentation-only task. Do not close, retarget, or otherwise modify #44, #64, #65, or #66 without the owner's explicit authorization.

**Completed security/documentation/UI gates:** PR #58 merged the roadmap/status reconciliation; PR #59 merged the Gitleaks allowlist and full-history scan; PR #51 merged supporting IA, gamified UX and design-system documents; PR #56 merged the theme foundation; and PR #57 merged canonical hybrid navigation. PR #47 and #54 are recorded as closed/superseded in their respective historical work. Those earlier gates do not replace the current PR #67 review and release requirements.

**Implementation sequencing:** theme and navigation foundations are implemented on `main`; Phases 1 and 2 remain **current**, not complete, while independent review and manual preview/UX checks are outstanding. Phase 5 remains **not started on main** while account integration is still a draft. Do not merge #64 separately; do not close older PRs as part of this task.

### 3.3 Existing route inventory on `main`

Route registration was inspected in `src/App.tsx` on the current `main` SHA. Route existence is not proof that a complete workflow or approved content exists.

| Route or page | Verified status on main | Implementation boundary |
|---|---|---|
| `/` | Existing | Homepage entry points to years, catalog, review resources and study surfaces. |
| `/catalog` | Existing | Search/filter subject catalog with loading, error, results and empty states. |
| `/years`, `/year/:year` | Existing | Four year levels; the Year Levels dropdown supports year and semester groupings from catalog metadata. |
| `/subjects/:slug` | Existing | Subject metadata, source details, availability and lesson entry points. |
| `/study/:slug`, `/study/:slug/:unit` | Existing | Published-lesson reader and device-local lesson completion. |
| `/practice/basic-algebra` | Existing, publication-gated | Practice UI exists, but no questions were published in the last recorded audit. Keep empty/review states honest. |
| `/progress` | Existing, device-local | Completion progress remains local to this browser. Main has no account-specific streak route. |
| `/review-materials` | Existing navigation placeholder | Shows Formula Sheets, Problem Sets with Solutions and Video Tutorials as unavailable until reviewed/published. No downloads or populated resource library. |
| `/mock-exam-portal` | Existing navigation placeholder | No exam session, timer, result summary or readiness score. |
| `/community` | Existing launch placeholder | Posting, replies, editing, reporting and moderation are unavailable; data contracts, identity and access controls are not implemented. |
| `/math-foundations`, `/about`, `/privacy` | Existing | Mathematics foundations and informational/privacy pages. |
| `/contact`, `/support`, `/bug-reports`, `/feedback`, `/feedbacks` | Existing | Support and feedback flows, with private inbox access controls. |
| `/owner/content-review` | Existing | Privileged owner content-review surface; preserve its access boundary. |
| `/login`, `/profile`, `/history`, `/streak` | Not registered on main | Present on unmerged PR #67 only; do not call them shipped. |
| Student Dashboard/account navigation | Not implemented on main | Approved direction, but not a current working product feature. |
| Full Review Materials Hub, full Mock Exam Portal, full Community Forum, unit converter | Planned/incomplete | Navigation shells do not equal completed workflows. Build only after metadata, review, provenance, rights, access and validation requirements are satisfied. |

### 3.4 Existing reusable foundations

- `src/components/Layout.tsx` owns the public shell, current header, current four-item mobile quick navigation, the More menu, and footer.
- `src/styles/global.css` contains the established brand values, global typography, button/card conventions, responsive rules, reduced-motion rules, and equation overflow styles.
- `src/pages/CatalogPage.tsx` uses `CatalogFilters`, `SubjectCard`, and `useCatalog`, with loading/error/empty states.
- `src/pages/StudyPage.tsx` calls `fetchPublishedLessons`, stores lesson completion locally, and uses `MarkdownContent` for the lesson body.
- `src/pages/PracticePage.tsx` calls `fetchPublishedPracticeQuestions` and delegates question rendering to `PracticeQuestion`.
- `src/pages/ProgressPage.tsx` calls `readCompletedLessons` and `readLearningActivityDays`; it explicitly states progress is not synced to an account.
- `src/components/LatexMath.tsx`, `LazyLatexMath.tsx`, `InlineMathText.tsx`, and `MarkdownContent.tsx` are the key existing equation and lesson text path.

Retain and improve these foundations where they are fit for purpose. Do not introduce a parallel design system or alternate equation renderer without a specific, tested reason.

## 3.5 Implementation status tracker

Statuses use the owner's exact labels: **current**, **complete**, **paused**, **incomplete**, and **not started**. A status describes this implementation effort, not whether a related draft PR or proposal exists. Mark a slice complete only after required code review and verification results are recorded.

| Slice | Status | Scope / exit condition |
|---|---|---|
| Phase 0: Canonical plan and baseline | **incomplete** | Main/PR metadata, source paths, and existing GitHub CI evidence are recorded. Direct visual preview capture and a fresh local test run remain blocked and must be resolved or explicitly accepted before declaring the baseline fully complete. |
| Phase 1: Shared foundation and theme tokens | **current** | Implementation merged at main commit `6aef33f37ea69c9b53acdbd975edf9b8feb2d0a5`; final code head `8208d8dbd2012a474a20bca5aa5cc0ad4b975146` passed [CI run 39880944679](https://github.com/justryan-n2d/CEStudy/actions/runs/39880944679) and [secret scan 39880944768](https://github.com/justryan-n2d/CEStudy/actions/runs/39880944768). Supabase migration/RLS and backup checks passed; Chromium smoke passed **853/853 assertions** across 10 routes and five viewport widths, including Light/Dark refresh persistence. The owner content-review dark-theme regression test failed on the test-first commit and passed after semantic-token overrides. Cloudflare Pages preview deployment succeeded, but direct external preview inspection was blocked by environment DNS/network. No independent review is recorded, so the phase remains **current**, not complete. |
| Phase 2: Navigation and route focus | **current** | Implementation merged in PR #57 at main commit `b4b18b2b1a2255d88dacdff546a90de2de18238b`; final code head `ae45bc7623d7443bc49554c4fcc007c48f604b0b` passed [CI run 39882597663](https://github.com/justryan-n2d/CEStudy/actions/runs/39882597663), [full-history secret scan 39882597625](https://github.com/justryan-n2d/CEStudy/actions/runs/39882597625), Supabase migration/RLS, backup checks, and **1,682/1,682 Chromium assertions** across 13 routes, both themes, and all five required widths. Full-history Gitleaks scanned 1,035 commits with no leaks. Cloudflare Pages preview deployment succeeded; direct external preview inspection was blocked by environment DNS/network. PR #54 is closed as superseded. No independent review is recorded, so Phase 2 remains **current**, not complete. The signed-in Dashboard/account sub-slice remains **paused** pending the reviewed auth/session contract from PR #44. |
| Phase 3: Catalog, subject and lesson consistency | **not started** | Unify browse/read experiences and verify shared math rendering in both themes. |
| Phase 4: Practice workspace | **not started** | Implement and verify the responsive question/tools workspace while preserving current question/answer behavior. |
| Phase 5: Progress and account integration | **not started** | Combined draft PR #67 now targets main and includes Google auth/session/profile plus device-local history and user-keyed streak; PR #64 is a source slice and must not merge separately. Keep account/Dashboard **paused** until independent review, fresh required CI and full-history Gitleaks pass, and manual OAuth preview/configuration gates are verified. Preserve local-only history/progress, per-user local streak isolation, and accurate privacy disclosures. |
| Phase 6: Review Materials Hub | **not started** | Build only after resource metadata, review status, provenance and rights rules are confirmed. |
| Phase 7: Community | **not started** | Remains blocked on data contracts, publication rules, identity and moderation/access controls. |
| Phase 8: Tools | **not started** | Start with a validated unit converter and tested unit definitions. |
| Phase 9: Gamification | **not started** | Blocked until the affected reward, eligibility, privacy, retry and anti-abuse rules are approved. |
| Phase 10: Offline access and native app | **not started** | Separate future architecture and design work; excluded from the current website theme foundation. |

**Active implementation branch:** `feat/local-history-streak-2026-10-23b` (consolidated account integration candidate). The earlier theme foundation branch `feat/blueprint-academy-theme-foundation` is historical.
**Verified main at implementation start:** `0862b5f243ca0e39f8bb82131c31fef28fbbab98`.
**Current implementation authorization:** The owner explicitly authorized application code changes in the conversation dated 2026-10-22. This authorizes work within the master roadmap, but does not authorize automatic merge, deployment, production data/configuration changes, or bypassing existing safeguards.

## 4. Focused baseline verification

### 4.1 Audit result summary

| Area | Result | Evidence | Remaining gap |
|---|---|---|---|
| Main theme | Verified on current main: explicit Light/Dark toggle, Light fallback/default, device-local `cestudy:theme:v1`, semantic tokens, and early bootstrap. | `src/contexts/ThemeContext.tsx`, `src/components/ThemeToggle.tsx`, `public/theme-init.js`, `src/styles/global.css`; main SHA `887b3f5a0b826ac0019f266de5e53fd6278958d3`. | Manual accessibility and visual inspection remains; do not import PR #44's competing theme implementation. |
| Hybrid public navigation | Verified on current main: Year Levels dropdown, Review Materials mega-menu, direct Mock Exam Portal and Community Forum links, four-item mobile quick navigation and More menu. | `src/components/Layout.tsx`, `YearLevelDropdown.tsx`, `ReviewMaterialsMegaMenu.tsx`, `src/App.tsx`; PR #57 is merged. | Resource, mock-exam and community pages are placeholders. Student Dashboard/account navigation is not implemented on main. |
| Learning content | Read-only SQL checked on 2026-10-26: 72 catalog subjects, 52 practice questions and 13 lessons; all 52 questions and all 13 lessons are `needs-review`, zero published. | Current read-only query against the dedicated CEStudy Supabase project. | Counts/status are current as of the query; question/lesson contents were not reviewed. Human academic review/publication approval remains required. |
| Equation rendering | Shared KaTeX renderer, lazy wrapper, inline/plain-text math detection, Markdown parser, representative tests and overflow CSS exist. | `src/components/LatexMath.tsx`, `LazyLatexMath.tsx`, `InlineMathText.tsx`, `MarkdownContent.tsx`, `src/test/latex-rendering.test.tsx`, `src/styles/global.css`. | Keyboard/assistive-technology use with overflowed equations, invalid-expression fallback announcements and full dark-theme coverage remain to be verified manually. |
| Account integration | Google-only auth/session/profile/privacy, local opened-lesson history/completion progress and user-keyed streak are implemented on PR #67 branch, not main. | Pre-documentation code/test head `0781c4b6caa09717442c794e757ccda980c35a0c` had successful CI/Gitleaks/Supabase/Pages checks. | Confirm the checks on the updated branch; independent review, real-preview OAuth recovery/configuration, and account-switching/data-isolation decision remain open. |
| Main CI and live smoke | Recorded GitHub CI, full-history Gitleaks, Supabase migration/RLS and latest live Chromium check succeeded for the inspected main SHA. | [CI/RLS 39884056913](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056913), [Gitleaks 39884056672](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056672), [live Chromium 40240604028](https://github.com/justryan-n2d/CEStudy/actions/runs/40240604028). | These checks do not constitute WCAG certification, physical-device QA, complete responsive redesign testing or broad-launch approval. |

### 4.2 Theme baseline: main and PR #44

**Current main (rechecked 2026-10-26; SHA `887b3f5a0b826ac0019f266de5e53fd6278958d3`):** Phase 1's shared theme foundation is merged in PR #56 and present in `main`. `src/components/Layout.tsx` owns the single `ThemeProvider` and mounts the explicit `ThemeToggle`; `src/contexts/ThemeContext.tsx` restores and stores the device-local `cestudy:theme:v1` choice with Light as the fallback; `public/theme-init.js` applies the stored choice before React renders. Light/Dark are the only approved options; there is no System option. Shared `--ui-*` semantic tokens are in `src/styles/global.css`.

The canonical hybrid website navigation is also implemented on main after PR #57: a Year Levels dropdown backed by catalog metadata, a Review Materials Hub mega-menu, direct Mock Exam Portal and Community Forum links, the existing four-item mobile quick-navigation bar, and a More menu. Treat these as navigation and route foundations, not proof that each destination workflow is complete. The `/review-materials` page marks its three resource categories unavailable; `/mock-exam-portal` offers no exam session/timer/results/readiness score; and `/community` explicitly says the forum is not open. A signed-in Student Dashboard/account control and `/login`, `/profile`, `/history`, `/streak` routes are not registered on main.

**PR #44 branch and theme conflict:**

- PR #44 carries an alternate `ThemeContext`, theme bootstrap, and broad global CSS changes. Those overlap the implementation already merged on current main. Do not port PR #44's copies of these theme components, its competing header/navigation, or its page-wide dark-theme overrides. Keep the current main `ThemeProvider` inside `Layout`, the existing `ThemeToggle`, canonical `--ui-*` tokens and early theme bootstrap.
- PR #64 wraps the canonical `Layout` with the single `AuthProvider` while preserving `Layout` as the owner of the existing `ThemeProvider`; this is the intended provider placement.
- The historical PR #44 file `scripts/ui-theme-smoke.cjs` is not a substitute for current-main verification. The current shared theme/browser checks in CI must be rerun on the final dependent integration head for routes, theme persistence, responsive widths, contrast, keyboard states and reduced motion.

**Historical checks for PR #44 (not current integration evidence):** [CI run 39578952302](https://github.com/justryan-n2d/CEStudy/actions/runs/39578952302), [secret scan 39578952309](https://github.com/justryan-n2d/CEStudy/actions/runs/39578952309), and [Cloudflare deployment check 119151620066](https://github.com/justryan-n2d/CEStudy/runs/119151620066) were reported as successful in that PR's historical description. The description also records successful browser smoke assertions at 320px and 1440px on the tested feature branch. These are evidence from the branch's automated checks, not a manual visual approval or a merge/release approval.

**Persistence decision: approved device-local.** Store the explicit Light/Dark selection in this browser using `cestudy:theme:v1` and restore it before React starts. Light remains the fallback when no valid saved choice exists or storage is blocked. Account synchronization and cross-device persistence are not approved.

### 4.3 Equation rendering baseline

**Verified implementation path on main:**

1. `MarkdownContent.tsx` parses a deliberately limited Markdown subset, including headings, paragraphs, lists, and display math delimited by `\\[...\\]` or `$$...$$`. It does not interpret raw HTML as HTML. Unmatched display delimiters remain text rather than consuming the rest of the lesson.
2. `InlineMathText.tsx` handles explicit inline math, common dollar-delimited expressions, plain Unicode equations, and selected bare LaTeX commands. It includes heuristics to avoid interpreting some currency/prose fragments as equations and converts selected simple slash fractions to stacked fractions.
3. `LazyLatexMath.tsx` lazy-loads the KaTeX component and displays source text while the chunk loads.
4. `LatexMath.tsx` uses KaTeX `renderToString`, `output: 'htmlAndMathml'`, `throwOnError: true`, `trust: false`, and bounded `maxExpand`/`maxSize`. Parse/render errors fall back to visible source text rather than crashing the lesson.
5. `src/styles/global.css` styles inline equations as inline-blocks and display equations with `max-width: 100%` and horizontal overflow contained in the equation block.

`src/test/latex-rendering.test.tsx` includes fixtures for inline/display math, currency, inline code, raw HTML, malformed and unmatched expressions, plain Unicode equations, multi-part equations, double-dollar display math, bare and nested fractions, engineering notation, practice question fields, and simple slash fractions with unit notation. The test file provides useful regression coverage and should be extended rather than replaced.

**Focused risks to test before changing the renderer:**

- The inline/plain-text detector is heuristic. Do not broadly change parsing regexes without adding the failing example to regression tests.
- An error fallback is present, but a browser and assistive-technology check is still needed to ensure an invalid formula is understandable and not announced as rendered math.
- Horizontal overflow CSS exists for display math, but keyboard access to a long equation's scroll container and a useful accessible label/instruction are not established by source inspection alone.
- Verify dark-theme text, equation backgrounds, error text, matrices, and diagrams together. The current PR #44 theme smoke route list omits `/study/...` and `/practice/...`.
- Verify equations on actual rendered student routes, not only a unit test DOM or a successful production build.
- Avoid changing the source of approved lesson/question math during a visual refactor. Source authority and mathematical correctness are separate from typography.

**Production visual verification status:** PR #32 proposes a Chromium check that injects bare and nested fraction examples into a production lesson response, captures desktop/mobile screenshots, and checks overflow. The PR and its workflow are not in main at the inspection snapshot. No screenshot from that harness was independently inspected in this audit.

### 4.4 Responsive navigation baseline

**Main behavior:**

- `src/components/Layout.tsx` has a sticky global header, logo/wordmark, primary links for Subject Catalog, Year Levels, and Math Foundations, a More button/panel, a skip link, a main landmark, and a four-item mobile quick-navigation bar.
- The More panel closes when a link changes route, on an outside pointer click, and on Escape.
- The shared stylesheet has multiple existing responsive rules around 850px, 680px, and 560px, with further page-specific media rules. Preserve current working behavior while consolidating rules where needed. Avoid adding new overrides without understanding existing cascade interactions.
- Main `scripts/live-smoke.cjs` visits home, catalog, years, year detail, math foundations, subject, practice, contact, support, bug reports, feedback, and privacy. It checks direct routes, headers, relevant public API behavior, browser errors, and horizontal overflow at 320px and 1440px. The current workflow is configured to expect zero published practice questions and a review-gate screen.

**PR #44 behavior:** adds a fifth Menu tab, an account/login entry on desktop, and a streak control; its mobile quick nav differs from main. This is draft behavior, not the required end state. The future native mobile app's five-tab design must not be copied automatically into phone web navigation.

**PR #54 candidate changes:** add main-content focus after route changes and 44px tablet navigation link targets with spacing at 681px to 850px. It is a draft explicitly deferred pending alignment with the larger navigation plan. Route-focus handoff is likely reusable; old `.main-nav` spacing should be evaluated against the new hybrid header before adoption.

**Responsive verification gap:** neither main smoke test nor PR #44's theme test covers all of 320px, 390px, 768px, 1024px, and 1440px. The implementation plan must add those widths for the redesigned global navigation and practice workspace.

### 4.5 Verification limitations

- On verified main SHA `887b3f5a0b826ac0019f266de5e53fd6278958d3`, GitHub CI/Supabase migration-RLS checks [39884056913](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056913) and full-history Gitleaks [39884056672](https://github.com/justryan-n2d/CEStudy/actions/runs/39884056672) show success. The latest recorded production Chromium smoke for that SHA [40240604028](https://github.com/justryan-n2d/CEStudy/actions/runs/40240604028) passed on 2026-10-25.
- PR #44 remains an open, unmerged legacy draft with a competing UI shell. Do not treat its historical checks as evidence for PR #67 or the current main baseline.
- The local clone attempt during this audit failed because DNS could not resolve `github.com`; no local test/build command or direct interactive preview inspection was performed. GitHub source files, PR metadata and existing workflow results were inspected remotely.
- Treat the PR's recorded Chromium assertions as CI evidence, not as independent manual visual QA. The direct preview capture and physical Android/TalkBack checks remain outstanding.

## 5. Approved owner decisions

| Decision | Status and rule |
|---|---|
| Visual direction | **Approved: Blueprint Academy**, 2026-10-22. |
| Brand | Preserve canonical logo geometry and `#0754B5` brand-blue baseline. Do not generate a replacement logo. |
| Theme | Explicit Light/Dark toggle; retain light default; do not add a System option. |
| Theme persistence | Approved | Device-local preference under `cestudy:theme:v1`; no account synchronization or cross-device sync. |
| Public navigation | Hybrid header with Year Levels dropdown, Review Materials Hub mega-menu, direct Mock Exam Portal and Community Forum entries, and signed-in Student Dashboard/account control. |
| Sidebar | Collapsible sidebar only for dense signed-in workspaces, not for every public page. |
| Duplicate destinations | Avoid competing Dashboard and Profile roles. Separate learning overview from account/settings only when the use case is clear. |
| Practice workspace | Desktop split approximately 70/30 as a starting point. Supporting tools collapsible or dockable. Phone web uses one-column question view and a drawer/tab/sheet for tools. |
| Gamification | XP/rewards, quests, streak freezes, badges, leaderboards, and retry reward behavior are independently configurable. Exact values, eligibility, retry policy, defaults, privacy, and abuse rules remain unresolved. |
| Healthy engagement | Optional sound, reduced motion, and optional Night Owl quest approved subject to safeguards. No late-night pressure, hour-based competitive advantage, or penalty for ignoring/hiding the quest. |
| Exam scope | Current PRC CELE mapping, a dedicated past-question source/permissions workflow, the proposed 100-question challenge, and board-readiness measures are out of scope. |
| Public identity | Where the approved community design decision applies, public author display identity is CEStudy, not an email address. |

## 6. Target information architecture

```text
Home
├── Year Levels
│   └── Year → Semester → Subject (only when verified metadata supports it)
│       └── Subject Detail
│           ├── Lessons / Worked Solutions
│           └── Available Practice
├── Subject Catalog
├── Review Materials Hub (current route and navigation placeholder; resource workflows planned)
│   ├── Formula Sheets
│   ├── Problem Sets with Solutions
│   └── Video Tutorials
├── Mock Exam Portal (high-level destination, not authorization for expanded exam features)
├── Community Forum (current main route is a launch placeholder; posting and moderation are planned)
├── Student Dashboard (private learning overview, planned)
│   ├── Progress and History
│   ├── Saved Questions and Formulas
│   └── Relevant activity and settings links
├── Calculator and Tools
│   └── Unit Converter (first candidate tool)
└── Account and Settings
    ├── Authentication
    ├── Theme
    ├── Privacy
    ├── Sound and Motion preferences
    └── Local-data and account-data disclosures
```

### Global navigation behavior

- Desktop: use the approved hybrid header and a Year Levels dropdown that can navigate the verified year/semester/subject hierarchy.
- Review Materials opens a grouped mega-menu for Formula Sheets, Problem Sets with Solutions, and Video Tutorials. Show actual published and reviewed resources only.
- Mock Exam Portal and Community Forum are direct high-level navigation targets, but their presence must not imply unfinished features work.
- Signed-out users retain access to the public library. Personal dashboard and account-specific information require the actual approved access model.
- Use a collapsible sidebar only when a dense signed-in workspace justifies it.
- Keep dashboard/account roles clear and avoid duplicate navigation paths that differ only by naming.

### Phone-web navigation

The current four-item bottom quick navigation is existing behavior, not a binding requirement for the final redesign. Retain, adapt, or remove it only after checking task discoverability and duplication in the hybrid model. Do not expand it to five tabs just because PR #44 or the future native app uses five destinations. A full-width sheet or grouped accordion must expose the remaining target destinations.

Nested menus must support keyboard, touch, visible state, Escape, focus restoration, and useful empty states. Direct routes and refresh behavior must continue to work.

## 7. Visual system specification

### 7.1 Theme token architecture

Use shared semantic tokens. Component styles should reference semantic roles such as page, surface, raised surface, text, muted text, border, selected, focus, success, warning, error, and disabled instead of hard-coding page-specific colors.

**Existing light values to preserve and audit:**

| Token / role | Existing baseline |
|---|---|
| Brand blue | `#0754B5` |
| Blue hover | `#06458F` |
| Soft blue selection | `#E8F0F8` |
| Navy | `#123451` |
| Strong navy text | `#0B263D` |
| Muted text | `#637487` |
| Border | `#DCE5EC` |
| Page | `#FFFFFF` |
| Soft surface | `#F7F9FC` |

These are existing values, not a guarantee that every text/control pairing passes contrast. Recalculate contrast for actual use cases.

**Candidate dark palette for comparison, not yet final:**

| Role | Candidate |
|---|---|
| Page | `#101820` |
| Surface | `#18232E` |
| Raised surface | `#202E3B` |
| Main text | `#E6EDF3` |
| Strong text | `#FFFFFF` |
| Muted text | `#A9B8C7` |
| Border | `#3A4A59` |
| Selected surface | `#233B53` |

Brand blue must remain the identity baseline. Validate its use on both light and dark surfaces. Green, cyan, or orange accents may only be used in appropriate semantic roles after contrast testing; never use glow or color alone to communicate state.

### 7.2 Typography, spacing, and layout

- Preserve Inter with system fallbacks unless a documented measurement supports a change.
- Body text starts at 16px. Metadata can be smaller only when it remains comfortably readable and meets contrast requirements.
- Use clear page/section/label hierarchy and logical document headings.
- Reading pages should target about 65 to 80 characters per line when practical.
- Maintain the existing 4px/8px spacing convention and a restrained radius scale.
- Use ordinary page widths around the existing 1120px content baseline when appropriate. Lesson reference tables and practice workspaces may require wider containers.
- Prefer clear panel borders and alignment over heavy shadows, blur, excessive gradients, or decorative neon.
- Keep the canonical logo proportions and approved assets. Do not redraw, stretch, rotate, independently recolor, or replace the artwork.

### 7.3 Shared component requirements

| Component | Required states and behavior |
|---|---|
| Header and navigation | Default, active, focused, open, closed, narrow-screen, keyboard and touch states |
| Year dropdown | Verified hierarchy, loading/empty state, keyboard controls, Escape and focus restoration |
| Review mega-menu | Three resource groups, accurate availability, narrow-screen sheet/accordion |
| Workspace sidebar | Collapsed/expanded, active destination, usable phone fallback |
| Buttons and links | Primary/secondary/quiet, hover, focus, disabled, loading, success/error feedback |
| Forms | Explicit labels, helpful validation, error announcements, recovery |
| Cards and status | Clear title, accurate metadata, one intended primary destination, status text not color alone |
| Tables | Header semantics, readable width, deliberate overflow, caption when useful |
| Dialogs and sheets | Title, close action, Escape, correct focus handling and scroll containment |
| Progress indicators | Real values only, clear labels and data scope |
| Lesson blocks | Learning objectives, concepts, formulas, worked solution steps, units and transitions |
| Practice | Question, diagram, answer selection, submit, result, explanation, retry and available tools |
| Forum | Readable threads and replies, math notation, report/moderation states matching real permissions |
| Downloads | Available/downloading/downloaded/update/failure/stale/unavailable states only after implementation |

### 7.4 Lesson and engineering content

Recommended lesson hierarchy:

1. Title and learning objectives.
2. Short concept explanation.
3. Definition or governing equation.
4. Worked example with numbered steps.
5. Units, assumptions, and interpretation.
6. Common mistake or check when supported by reviewed content.
7. Next available lesson or practice action.

This is a layout convention, not authorization to rewrite mathematical source content. Visual changes must not alter formula meaning, variable names, units, diagrams, or approved solution steps.

### 7.5 Practice workspace

- Start with a flexible question/tools split near 70/30 on desktop, but size it based on the problem content rather than enforcing a rigid ratio.
- The question region must fit the full statement, data, units, diagrams, equations, answer controls, and explanation.
- The tools region can collapse or dock where feasible. Do not add a nonfunctional calculator or formula panel as decoration.
- At phone widths, display the question in one column and expose supporting tools through a sheet, drawer, or tabs.
- Distinguish unanswered, selected, submitted, correct/incorrect feedback, explanation, next question, session complete, loading, error, and no-published-questions states.
- Display timers only for genuinely timed activities. Do not imply the Mock Exam Portal has timed pools unless those capabilities exist.
- Retry behavior and reward eligibility remain separate decisions.

## 8. Page-by-page redesign scope

| Page / surface | Status | Target and guardrails |
|---|---|---|
| Home | Existing | Clear entry points into years, catalog, review resources, practice, and tools. Continue links only from real eligible history; generic fallbacks otherwise. |
| Year Levels | Existing | Overview of all four years; nested relationships from verified metadata only. |
| Subject Catalog | Existing | Search, filters, accurate result counts, availability, useful reset and no-results recovery. Preserve current catalog behavior. |
| Subject Detail | Existing | Title, summary, source/provenance, availability, relevant lessons, and practice entry only when available. |
| Lesson / Study | Existing | Comfortable reading width, clear objectives and headings, consistent equation blocks, lesson outline/next links where supported, local completion disclosure. |
| Review Materials Hub | Navigation/page placeholder; full workflows planned | Formula Sheets, Problem Sets with Solutions, Video Tutorials; show availability, review state, source/version, and download state only when real data exists. No currently populated resource library or downloads. |
| Practice | Existing, limited pool | Preserve current answer flow; improve question/tools layout, feedback and responsive access. Main live smoke currently expects zero published questions. |
| Results / Progress | Existing progress and per-session results | Separate current-session score from stored history; show device-local scope and only real values. |
| Student Dashboard | Proposed | Private hub for progress, recent activity, bookmarks, saved formulas, history and settings. No fake insights or cross-device claims. |
| Account / Settings | Privacy exists; extra account pages draft-only | Clearly disclose device-local theme preference, sound, motion, authentication, and storage behavior. Do not imply account-synced theme settings. |
| Community | Current main route is a placeholder, not a working forum | Future searchable discussions, problem threads, math comments, reporting and moderation only after backend and permission decisions. Public identity must not expose email. |
| Calculator / Tools | Proposed | Unit converter first. Validate units, inputs, conversion factors and outputs. More engineering tools need sources and technical validation. |
| Offline manager | Cross-cutting proposal | Do not display as implemented until local storage, resource versions, download rights and sync rules are designed and verified. |

## 9. Responsive strategy and acceptance

Design desktop information architecture first, then adapt it to tablet and phone web. The native mobile app remains a separate future design project.

| Viewport | Target behavior |
|---|---|
| 1440px | Full hybrid header; grouped resource mega-menu; readable cards; comfortable content width; flexible 70/30 practice workspace |
| 1024px | Compact but readable header or grouped navigation; useful catalog grids; no clipped labels; adequate question width |
| 768px | Tablet navigation panel or wrap strategy; grouped menu; fewer grid columns; practice tools remain accessible |
| 390px | Phone sheet/accordion; single-column lesson/practice; supporting tools on demand; controls not obscured |
| 320px | Narrow menu; no page-wide horizontal overflow; deliberate handling for long labels, equations, tables and diagrams |

Existing breakpoints at 850px, 680px, and 560px are references to inspect, not mandates. Choose breakpoints where content ceases to fit comfortably.

Required responsive checks:

- No page-wide horizontal overflow.
- No clipped labels or lost navigation destinations.
- Focus is not obscured by sticky headers, bottom navigation, sheets, or dialogs.
- All menu controls work with keyboard and touch; Escape closes overlays; focus is restored appropriately.
- Long tables and equations scroll inside labelled containers where wrapping is not mathematically safe.
- Question, answer, explanation, and exit controls remain reachable in practice.
- Verify both themes at all five widths for every shared component touched.

## 10. Accessibility and technical-content standards

Target WCAG 2.2 AA. The redesign must include semantic landmarks, logical heading order, keyboard navigation, visible focus, usable zoom/reflow, sufficient text and non-text contrast, explicit form labels and errors, touch-friendly controls, and understandable status changes.

Respect reduced motion. Optional sound must never autoplay and must have a reliable mute control. Every audio/animation response needs an understandable visible equivalent. Motion must not block reading, obscure equations, or shift essential controls.

### Equation verification matrix

| Fixture | Required result |
|---|---|
| Inline and display expressions | Correct display style; surrounding prose remains intact |
| Simple and nested fractions | Proper structure and spacing |
| Subscripts and superscripts | Readable positioning and sizing |
| Matrices and vectors | Correct alignment without page-wide overflow |
| Units and engineering notation | Notation remains meaningful and readable |
| Long formulas | Deliberate wrapping or labelled horizontal scrolling |
| Equations in tables | Table and formula both remain accessible |
| Lesson and practice question content | Shared rendering semantics and ordering |
| Forum comments if/when implemented | Same shared math behavior |
| Invalid or unsupported expression | Safe readable source fallback, no crash, no unsafe HTML |
| Currency and prose boundaries | Currency and ordinary text must not be misinterpreted as math |

KaTeX documentation: [supported functions](https://katex.org/docs/supported), [error handling](https://katex.org/docs/error). The existence of a valid render is not proof of mathematical correctness.

## 11. Gamification and healthy engagement

Gamification is optional and must not be required to use the content library, read lessons, or practice.

Approved direction:

- XP/rewards, quests, streak freezes, badges, leaderboards, and retry-related reward behavior must be independently configurable.
- Sound is optional, never autoplayed, and always has a mute path.
- Reduced-motion support is required; an in-app motion control may be provided when useful.
- Night Owl may exist as an optional quest, but never pressures students to remain awake, gives hour-based ranking/streak advantages, or penalizes hiding/ignoring it.
- Do not shame missed days or frame streak preservation as more important than rest or other commitments.

Still unresolved before any reward feature is implemented:

- Exact values, completion definitions, eligibility, defaults, and feature interactions.
- Quest instance/version rules and unique award rules.
- Retry and duplicate submission behavior, including replay/offline/reconnect cases.
- Study-day timezone boundary, freeze allocation and use policy.
- Leaderboard participation, opt-in/out, anonymity/public identity, ranking metric and period.
- Anti-abuse enforcement and a trusted source of reward truth.
- Handling of incorrect or reversed rewards and appeal/report paths.

Example reward values in PR #51 are draft planning examples, not approved constants. Platform tokens are deferred. Do not display rewards or leaderboards until their rules and data sources exist.

## 12. Privacy, data and security boundaries

- Public library access remains usable while signed out unless a verified current access rule says otherwise.
- The inspected main progress page is device-local. Do not claim account synchronization or server-backed learning insights unless a verified contract supplies them.
- Dashboard data must be private to the correct user at the API/database boundary, not just conditionally rendered in React.
- Authentication stays optional unless separately approved; preserve safe return-path handling and OAuth safeguards on candidate PR #67. Do not treat the candidate as released until required review and real-preview checks pass.
- Keep email addresses private. Apply the approved CEStudy public identity on community content when relevant.
- Do not weaken the content review/publication workflow or expose private review notes, unpublished questions, service-role credentials, or sensitive user data.
- Never put actual question content into a public seed or publish unpublished learning content solely to make a UI look populated.
- If an interface depends on new data or permissions, stop at the interface proposal until the data contract is approved.

## 13. Prioritized implementation roadmap

Each slice must be separately scoped, reviewed, and tested. The owner explicitly authorized application code changes on 2026-10-22. That authorization is bounded by the approved roadmap and does not authorize automatic merge, deployment, production configuration/data changes, or weakening any existing safeguards. Keep the implementation status tracker current and mark a slice complete only after its acceptance criteria and verification are satisfied.

### Phase 0: Canonical plan and baseline (incomplete)

**Status:** Source inspection and existing CI evidence recorded. Direct preview capture and a fresh local run are blocked by the available environment. Do not describe the baseline as a complete live visual audit.

Work:
- Keep this roadmap as the canonical record. PR #55 was merged to `main` at commit `0862b5f243ca0e39f8bb82131c31fef28fbbab98`.
- Confirm current main SHA, PR states, routes, existing components, test setup and CI.
- Record the current main theme, equation, canonical navigation and PR #67 account-integration baselines. Keep PR #44 as a legacy conflict reference, not the current integration candidate.
- Preserve the current passing main CI/live-smoke/secret-scan gate.

Exit criteria:
- All product decisions and unresolved items are explicit.
- Baseline code evidence and prior test results have source links.
- Direct preview screenshots or fresh local/browser checks are collected before visual implementation review if the tool/environment becomes available.

### Phase 1: Shared foundation and theme tokens

**Status: implementation merged; phase remains current pending independent review.** The refresh defect was reproduced by a regression test and fixed by reading/writing `cestudy:theme:v1`, using a Light fallback for invalid or inaccessible storage, synchronizing `color-scheme` and browser theme color, and loading `public/theme-init.js` before the app module to prevent a Light flash. The owner content-review workspace also received dark semantic-token overrides after a test-first regression exposed hard-coded light surfaces. Final code head [8208d8d](https://github.com/justryan-n2d/CEStudy/commit/8208d8dbd2012a474a20bca5aa5cc0ad4b975146) passed [CI run 39880944679](https://github.com/justryan-n2d/CEStudy/actions/runs/39880944679), including lint, dependency audit, unit tests, production build, Pages/security-header packaging, backup checks, Supabase migration/RLS tests, and **853/853 Chromium assertions** across 10 routes and five viewport widths. [Secret scan 39880944768](https://github.com/justryan-n2d/CEStudy/actions/runs/39880944768) passed. Cloudflare Pages preview deployment succeeded; direct external preview inspection was blocked by environment DNS/network. PR #56 merged at `6aef33f`; no independent review is recorded, so Phase 1 remains **current**, not complete.

**Priority:** first implementation candidate. **Relative effort:** Medium. **Risk:** Medium due theme-wide regression potential.

Primary paths to inspect: `src/styles/global.css`, `src/components/Layout.tsx`, `src/App.tsx`, PR #44's `src/contexts/ThemeContext.tsx`, `public/theme-init.js`, relevant tests, and `scripts/ui-theme-smoke.cjs`.

User outcome: a stable visual base where common surfaces, text, borders, focus and controls behave consistently in Light and Dark.

Acceptance criteria:
- Preserve canonical logo and brand blue.
- Keep Light as default; support explicit Light/Dark only, with no System option.
- Use the approved device-local `cestudy:theme:v1` preference and early bootstrap; do not add account synchronization.
- Use shared semantic tokens and remove avoidable page-specific token contradictions.
- Do not regress the canonical main UI while integrating PR #67's approved auth/streak slice. PR #44's competing shell and theme/navigation changes remain excluded.
- Add theme contrast/component tests and browser checks for home, catalog, study, practice, forms, dialog, tables and equation error/overflow states.
- Test at 320px, 390px, 768px, 1024px and 1440px.

Dependencies and blockers:
- Resolve the account-switching/data-isolation question before merge: opened-lesson history and completed-lesson records use browser-local keys shared across signed-in accounts, while streak days are keyed by Supabase user ID. Do not claim every local activity record is isolated per account.
- Inspect full dark token coverage and verify theme initialization before React paints.
- Do not integrate draft authentication simply to obtain ThemeProvider; isolate or deliberately port theme work only after branch integration review.

### Phase 2: Navigation and route focus

**Relative effort:** Large. **Risk:** High because this touches the global shell and every route.

**Status: implementation merged; phase remains current pending independent review.** PR #57 merged at `b4b18b2b1a2255d88dacdff546a90de2de18238b`. Final head `ae45bc7623d7443bc49554c4fcc007c48f604b0b` passed CI, full-history secret scan, Supabase migration/RLS and backup checks, and 1,682/1,682 Chromium assertions across 13 routes, both themes, and all five required widths. Gitleaks scanned 1,035 commits with no leaks. Cloudflare Pages preview deployment succeeded; manual external preview inspection remains unavailable in this environment. PR #54 is closed as superseded. Phase 2 remains **current**, not complete, until independent review and manual external preview inspection are available.

Primary paths: `src/components/Layout.tsx`, `src/App.tsx`, `src/styles/global.css`, navigation tests, and PR #54 candidate changes.

Acceptance criteria:
- Hybrid public header contains the approved destinations with clear active states.
- Year/semester/subject hierarchy uses verified content metadata.
- Review mega-menu exposes only the approved three groups and accurately represents content availability.
- Mock Exam Portal and Community Forum are high-level targets only until implemented.
- Student Dashboard/account controls are not duplicated or ambiguous.
- Keyboard, Escape, focus handoff, touch targets and route refresh are verified.
- Phone navigation exposes all destinations without copying the native app tab bar.
- Route-focus handoff, Escape/focus restoration, visible focus styles, and 44px touch targets from PR #54 are implemented and verified in merged PR #57; PR #54 is closed as superseded.

### Phase 3: Catalog, subject and lesson consistency

**Relative effort:** Medium. **Risk:** Medium.

Primary paths: `src/pages/CatalogPage.tsx`, `src/pages/SubjectPage.tsx`, `src/pages/StudyPage.tsx`, `src/components/MarkdownContent.tsx`, catalog/lesson data APIs and their tests.

Acceptance criteria:
- Preserve search/filter behavior, availability messaging, source/provenance and useful empty/error recovery.
- Use one visual hierarchy for objectives, sections, formulas, solutions and next steps.
- Do not invent year/semester assignments.
- Equation formatting changes preserve canonical text and mathematical meaning.
- Verify all representative formula fixtures in both themes and narrow layouts.

### Phase 4: Practice workspace

**Relative effort:** Large. **Risk:** High for long engineering problems and answer correctness.

Primary paths: `src/pages/PracticePage.tsx`, `src/components/PracticeQuestion.tsx`, practice APIs/types, shared math renderer, relevant styles and tests.

Acceptance criteria:
- Preserve answer selection/submission, feedback, explanations, next question and result flow.
- Apply the flexible desktop question/tools split and collapsible/dockable panel only where its functionality exists.
- Phone view prioritizes the full question and moves tools into an accessible sheet/drawer/tab.
- Timer states correspond only to actual timed behavior.
- Current empty/review gate remains honest while no questions are published.
- Verify formulas, diagrams, overflow, keyboard flow and session completion at all target widths.

### Phase 5: Progress and account integration

**Relative effort:** Medium to Large. **Risk:** High if data scope is misrepresented.

Primary paths: `src/pages/ProgressPage.tsx`, `src/pages/HistoryPage.tsx`, `src/pages/StudyPage.tsx`, `src/data/learning-history.ts`, `src/data/learning-progress.ts`, PR #67 auth/profile/history/streak modules, relevant Supabase policies and CI security tests. Candidate code now uses separate guest/user localStorage keys for history and completed lessons. Verify scope-switch behavior on preview and preserve the disclosure that this is local storage, not server-side or cross-device sync.

Acceptance criteria:
- Device-local activity remains labelled as local until synchronization is separately built and approved.
- Dashboard data is private and based on actual records.
- Preserve OAuth safety, guest access, privacy disclosures, content review, and release gates.
- Do not introduce weak-topic metrics without sufficient reviewed question coverage and real attempt data.

### Phase 6: Review Materials Hub

**Relative effort:** Large. **Risk:** High around source rights and publication status.

Acceptance criteria:
- Formula Sheets, Problem Sets with Solutions, and Video Tutorials are browsable.
- Only real, reviewed resources appear as available.
- Source/version, licensing and download permissions are verified before download controls are functional.
- Error, empty, stale and unavailable states are accurate.

### Phase 7: Community

**Relative effort:** Large. **Risk:** High for privacy, moderation and access control.

Blockers before implementation:
- Define read/post/edit/delete/report permissions.
- Define moderation workflow and publication behavior.
- Define author identity and email privacy.
- Verify database contract and RLS.
- Confirm math rendering in comments.

Acceptance criteria:
- No visual affordance pretends an unfinished backend is live.
- Public identity does not expose email addresses.
- Reporting/moderation states reflect actual server-enforced permissions.

### Phase 8: Tools

**Relative effort:** Medium for the first unit converter. **Risk:** Medium for unit correctness.

Acceptance criteria:
- Clear input labels, units, conversion direction, result, and invalid input state.
- Unit definitions and conversion values have tested provenance.
- Do not present unvalidated engineering design calculations or reference data as authoritative.

### Phase 9: Gamification

**Relative effort:** Large. **Risk:** High for integrity and healthy engagement.

Do not start until the reward/quest/ranking decision register in Section 11 is resolved for the affected mechanic. Enforce anti-abuse controls server-side where rewards become authoritative. Core study remains useful with the feature off.

### Phase 10: Offline access and native app (separate future projects)

Offline browser storage, resource download manager, offline attempts and synchronization require a separate architecture and privacy review. Native Android/iOS gets a separate interaction design and framework decision. Do not add a mobile framework to the current website as part of this redesign.

## 14. Test strategy and implementation definition of done

For each implementation PR:

1. Establish the exact base commit and preserve unrelated worktree changes.
2. Keep the change set small and reviewable.
3. Add or update regression tests for changed behavior.
4. Run targeted tests, lint, typecheck, production build, and the repository's required CI/security workflows.
5. Check deep links and direct route refresh.
6. Check relevant routes in both themes and the five target viewport widths.
7. Run keyboard and focus checks, including Escape and focus restoration.
8. Inspect math content at the source, renderer, browser and deployed-test layers as applicable.
9. Review privacy, RLS/grants, publication gates, OAuth, CSP/security headers and secrets if the slice touches them.
10. Inspect the entire diff and verify that no safeguard was removed or weakened.
11. Report passed, failed, blocked and not-run checks separately.
12. Leave the PR unmerged and undeployed until the owner separately authorizes the next action.

**Definition of done:** user-visible behavior matches the approved scope, existing behavior is preserved, tests support the changed behavior, accessibility and responsive checks cover the touched surfaces, the diff is reviewed, and release/security safeguards remain intact.

## 15. Open decisions and blockers

| Decision or verification | Status | Required action |
|---|---|---|
| Blueprint Academy | Approved | Use as primary visual direction |
| Theme default and options | Approved | Light default; Light/Dark toggle only; no System option |
| Theme persistence | Decided | Owner approved device-local persistence under `cestudy:theme:v1`; account/cross-device synchronization remains out of scope. |
| Final token values | Proposed | Validate contrast and real component rendering in both themes |
| Phone-web navigation presentation | Partially specified | Compare current four-item quick nav plus menu sheet against a grouped sheet/accordion without copying native tabs |
| PR #67 account integration | Open draft candidate | Review current combined diff, OAuth/recovery safeguards, local data behavior, account-switching/data-isolation decision and current-head checks before any release decision |
| PR #54 route focus and tablet targets | Closed as superseded | Its focus handoff and 44px targets were incorporated into merged PR #57 |
| Equation scrolling accessibility | Unverified | Keyboard/screen-reader review of wide display equations and error fallback |
| Direct preview inspection | Blocked in this audit | Browser fetch returned cache miss; container clone attempt failed because DNS could not resolve GitHub |
| Fresh local tests | Blocked in this audit | No local clone available; latest GitHub CI evidence is linked in Section 3 |
| Dashboard server-backed data | Not approved by this roadmap alone | Verify data contract and authorization before design implies sync |
| Gamification rules | Open | Define eligibility, uniqueness, timezone, retries, opt-in, privacy and abuse controls |
| Community publishing/moderation | Open | Agree read/post/report/edit rules and server-side access controls |
| Offline access | Future proposal | Specify storage, licensing, versioning, stale state and sync behavior first |

## 16. External technical references

These official references guide technical verification; they do not replace the repository's installed-version inspection or local tests.

- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/): accessibility target and criteria.
- [React documentation](https://react.dev/learn): component and rendering fundamentals.
- [TypeScript documentation](https://www.typescriptlang.org/docs/): type-system behavior and configuration.
- [Vite documentation](https://vite.dev/guide/): build, development and preview behavior.
- [Tailwind CSS responsive design](https://tailwindcss.com/docs/responsive-design): responsive utility conventions.
- [Tailwind CSS dark mode](https://tailwindcss.com/docs/dark-mode): theme strategies; do not add a System option unless separately approved.
- [React Router documentation](https://reactrouter.com/): route behavior and navigation.
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security): server/database authorization and policy requirements.
- [KaTeX supported functions](https://katex.org/docs/supported) and [error handling](https://katex.org/docs/error): renderer limitations and safe fallbacks.
- [Cloudflare Pages serving pages](https://developers.cloudflare.com/pages/configuration/serving-pages/): SPA routing and deployment behavior.
- [GitHub Primer](https://primer.style/): product-interface patterns and accessible component ideas. Use principles rather than copying the visual identity.

## 17. Final implementation prompt

The owner has authorized application code changes for the roadmap. For each subsequent slice or later conversation, start with the repository and branch baseline, then implement only the next scoped phase from this document. Do not attempt the whole roadmap in one PR.

```text
Implement the authorized CEStudy UX/UI redesign slice from docs/MASTER_ROADMAP_FOR_CESTUDY.md.

First inspect the latest main commit, current working tree, relevant PRs, existing components, route registrations, design tokens, equation renderer, tests, CI and security controls. Preserve unrelated changes.

Create a focused feature branch from the verified base. Implement only the explicitly authorized slice. Use Blueprint Academy as the approved direction, preserve the canonical logo and #0754B5 brand blue, keep Light as default with a Light/Dark toggle only, and do not silently resolve open product decisions.

Favor existing components and dependencies. Do not fake features or data. Preserve learner-facing behavior, mathematical source content, publication gates, OAuth safety, privacy, Supabase access controls, secret scanning and release CI.

Test the changed behavior, lint, typecheck, build, responsive widths 320/390/768/1024/1440 where applicable, both themes, keyboard interactions, equation rendering and security boundaries as relevant. Inspect the full diff and report actual outputs, blockers, and remaining risks.

Do not merge, deploy, publish, change production data/configuration, or weaken safeguards. Stop after implementation, verification and review.
```

## 18. Revision history

| Date | Change |
|---|---|
| 2026-10-26 | Reconciled the baseline and integration tracker against live GitHub state. Current main is `887b3f5a0b826ac0019f266de5e53fd6278958d3`; the canonical theme and hybrid navigation are implemented, while Review Materials, Mock Exam and Community routes remain placeholders. PR #67 is open/draft on `feat/local-history-streak-2026-10-23b`; code/test head `8c942711c40019758682b70599fccc2aa7c69807` passed lint/tests/build, Supabase migration/RLS, full-history secret scan and Cloudflare preview. Guest and per-user history/completion now use separate versioned localStorage keys; legacy unscoped v1 entries are not migrated. A read-only SQL query on 2026-10-26 confirmed 72 catalog subjects, 52 questions and 13 lessons all `needs-review`, zero published. Backup logs from 2026-10-25 verified all three content tables, archive/checksum read-back and four retained verified backups. The managed-Supabase restore, manual OAuth/callback-retry/config checks, human academic review, independent PR review, and review of two moderate Vitest/@vitest-mocker advisories remain outstanding. The docs-only commit that follows needs its own checks. | |
| 2026-10-24 | Repaired OAuth callback recovery for query-string errors, `error_code`-only queries, ordinary hash fragments, and `#?` fragments. Added a regression assertion that exposed Supabase's default global sign-out scope; changed `AuthContext` to `signOut({ scope: "local" })` and clarified in the Privacy notice that other devices remain signed in. Final code/test head `9b725ebcc15307473e9b434ba19deacc986070e3` passed [CI 39985760608](https://github.com/justryan-n2d/CEStudy/actions/runs/39985760608): 215 tests across 35 files, lint/audit/build, 2,182/2,182 Chromium assertions with no runtime errors, backup verification and Supabase migration/RLS. Full-history Gitleaks [39985760606](https://github.com/justryan-n2d/CEStudy/actions/runs/39985760606) passed. Cloudflare preview `https://0dcca39c.cestudy.pages.dev` deployed; direct interaction failed DNS resolution from this environment. Independent review and actual Google cancellation, controlled PKCE failure/retry, and live Google/Supabase redirect configuration remain NOT VERIFIED. PR #67 remains draft; PR #64 must not merge separately. No production configuration/data/schema changes or content publication occurred. |
| 2026-10-23 | PR #44 remains a stale, non-mergeable draft; its competing shell was excluded. PR #67 was consolidated and retargeted to main as the single auth/profile plus device-local history/streak integration candidate, with base SHA `887b3f5a0b826ac0019f266de5e53fd6278958d3` and pre-documentation head `df4b247`. The previously stacked configuration prevented main-targeted full-history Gitleaks from running; retargeting should trigger the required scan and fresh CI. Independent review and actual preview Google cancellation, controlled PKCE exchange failure/retry, and live Google/Supabase redirect settings remain NOT VERIFIED. PR #64 must not merge separately and should be closed as superseded only after #67 merges. Phase 5 remains not started on main; account/Dashboard stays paused. No production deploy/config/data/schema or content publication occurred. |
| 2026-10-23 | PR #57 merged the roadmap-aligned hybrid public navigation at `b4b18b2b1a2255d88dacdff546a90de2de18238b`. Final head `ae45bc7` passed CI, full-history Gitleaks (1,035 commits, no leaks), Supabase migration/RLS and backup checks, and 1,682/1,682 Chromium assertions across 13 routes, both themes, and five viewport widths. Cloudflare Pages preview deployment succeeded; direct external preview inspection remains unavailable in this environment. PR #54 is closed as superseded. Phase 2 remains current pending independent review/manual preview inspection. No production deployment occurred. |
| 2026-10-23 | PR #56 merged the shared theme foundation at `6aef33f37ea69c9b53acdbd975edf9b8feb2d0a5`. Final code head `8208d8d` passed CI, secret scan, Supabase migration/RLS and backup checks, and 853/853 Chromium assertions. A test-first regression found and fixed missing dark-theme styling on the owner content-review workspace. Cloudflare Pages preview deployment succeeded; direct external preview inspection remains unavailable in this environment. Phase 1 remains current pending independent review. Phase 2 remains current pending PR #57 retargeting, synchronization, and fresh CI/full-history scan. No production deployment occurred. |
| 2026-10-22 | PR #55 merged the canonical roadmap. Owner authorized roadmap-bounded implementation. Phase 0 remains incomplete because local clone/manual live-preview inspection are unavailable. Phase 1 device-local theme persistence is implemented and verified at code head `e0fb7e068e1bdf5fcd39a346fb2b20c7f5b79031`: 24 test files / 134 unit tests, 853/853 Chromium assertions including actual Dark/Light refresh restoration, database and backup checks passed, and secret scan passed. Phase 1 remains current pending independent review. Phase 2 public navigation passed 148 unit tests and 1,682/1,682 Chromium assertions at code/test commit `61b81a911d2eb9dc52bfe25b940008ffeb267dc6`; job results are green but aggregate run status needs a fresh final run for the latest synced head. Phase 2 remains current pending review; signed-in Dashboard/account remains paused pending PR #44's reviewed auth/session contract. No merge or deployment was performed. |

---

**End of canonical roadmap.** Update this file when the owner approves changes to the overall direction, decision register, phase ordering, or implementation gates.
