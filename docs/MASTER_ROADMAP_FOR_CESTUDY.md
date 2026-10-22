# MASTER ROADMAP FOR CEStudy

**Document status:** Owner-approved direction; canonical planning document for CEStudy UX/UI redesign and roadmap tracking.
**Owner approval:** Blueprint Academy selected on 2026-10-22 (Asia/Manila).
**Baseline snapshot:** `main` at `ffbabc6072d46bcd12af1358d17b169a0f8abbc9`, inspected 2026-10-22.
**Scope of this record:** Product direction, UX/UI decisions, verified baseline, implementation sequence, acceptance criteria, and release safeguards.
**Application implementation status:** No application code changes are authorized by this document.

> **Authority:** Use this document as the canonical plan for CEStudy's product direction, UX/UI scope, approved design decisions, and implementation sequence. It consolidates the owner-approved directions recorded in [PR #51](https://github.com/justryan-n2d/CEStudy/pull/51). If planning documents conflict, this roadmap's latest owner-approved decision register takes precedence. Actual code, current data contracts, security policy, and CI/release gates remain authoritative for what is implemented and safe to ship. This document does not authorize implementation, merge, deployment, or production changes by itself.

> **Repository note:** This file is being proposed through a documentation-only pull request. Until that pull request is merged, the file is available on its branch rather than `main`. For planning in the meantime, treat this version as the working canonical roadmap. Do not merge stale or contradictory planning changes merely to make their documents appear current.

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

| Item | Verified state on 2026-10-22 |
|---|---|
| Repository | [justryan-n2d/CEStudy](https://github.com/justryan-n2d/CEStudy), public repository |
| Default branch | `main` |
| Inspected `main` SHA | `ffbabc6072d46bcd12af1358d17b169a0f8abbc9` |
| Latest commit message | `docs: add UI UX Pro Max integration guidance` |
| Stack declared by `package.json` | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, React Router 7, Supabase JS, KaTeX 0.19, Vitest and Testing Library |
| Main CI run | [39758495387, success](https://github.com/justryan-n2d/CEStudy/actions/runs/39758495387) |
| Main full-history secret scan | [39758495402, success](https://github.com/justryan-n2d/CEStudy/actions/runs/39758495402) |
| Main live website Chromium smoke | [39758768389, success](https://github.com/justryan-n2d/CEStudy/actions/runs/39758768389) |

The main workflows above passed on the exact inspected main commit. This is fresh GitHub Actions evidence, not a claim that this assistant ran the tests locally.

### 3.2 Relevant open pull requests

| PR | Current status and relevance | Planning rule |
|---|---|---|
| [#51 Website-first information architecture](https://github.com/justryan-n2d/CEStudy/pull/51) | Open, draft, not merged; documentation-only changes in its head. Head `e721345e738c54503d9dcf27ab1cec4f448c778e`; 18 commits ahead and 1 commit behind current `main` at inspection. | Its owner-approved decisions have been consolidated here. Do not assume its changed documents are already on `main`. |
| [#44 Google sign-in and local streak](https://github.com/justryan-n2d/CEStudy/pull/44) | Open, draft, not merged. Head `662e413601cef93100534b8be52f1a76fe35b335`; 103 commits ahead and 1 commit behind current `main`, with merge base `e6f657cbbf94467e427fc6183c9714e965098598`. | Treat auth, theme, history, streak, profile, menu, and community routes as draft-branch work until merged and separately release-approved. |
| [#54 Route focus and tablet navigation accessibility](https://github.com/justryan-n2d/CEStudy/pull/54) | Open, draft, based on current `main`, 7 commits ahead at inspection. | Re-evaluate route-focus handoff and tablet touch targets against the new navigation design. Do not merge its existing-nav styling as an isolated final navigation implementation. |
| [#32 Production fraction visual check](https://github.com/justryan-n2d/CEStudy/pull/32) | Open, not draft, not merged. It adds a production Chromium visual-test harness. | Useful validation proposal, but its workflow and screenshots are not part of `main` until the PR is accepted and merged. |

### 3.3 Existing route inventory on `main`

Verified route registration is in `src/App.tsx` at the inspected main commit.

| Route or page | Status | Notes for redesign |
|---|---|---|
| `/` | Existing | Home with subject/year entry points, local progress entry, and math foundations |
| `/catalog` | Existing | Search/filterable subject catalog with loading, error, results, and empty states |
| `/years`, `/year/:year` | Existing | Year overview and year-specific page; semester/subject hierarchy must rely on verified metadata |
| `/subjects/:slug` | Existing | Subject metadata, source details, availability and lesson entry points |
| `/study/:slug`, `/study/:slug/:unit` | Existing | Published lesson reader and local lesson completion |
| `/practice/basic-algebra` | Existing, content currently guarded by publication state | Live smoke configuration expects zero published practice questions and verifies the empty/review gate |
| `/progress` | Existing | Explicitly local to the current browser/device in `src/pages/ProgressPage.tsx` |
| `/math-foundations` | Existing | Mathematics foundation catalog |
| `/about`, `/privacy` | Existing | Informational and privacy pages |
| `/contact`, `/support`, `/bug-reports`, `/feedback`, `/feedbacks` | Existing | Support and feedback surfaces, with inbox access tied to its actual gate |
| `/owner/content-review` | Existing | Privileged content-review surface; preserve its access boundary |
| `/login`, `/profile`, `/history`, `/streak`, `/menu`, `/community` | PR #44 draft-only | Present in PR #44 branch, not in the inspected main route table |
| Review Materials Hub, Mock Exam Portal, Student Dashboard as a broader learning hub, full Community Forum, unit converter | Proposed | Do not represent these as full working features until separately implemented and verified |

### 3.4 Existing reusable foundations

- `src/components/Layout.tsx` owns the public shell, current header, current four-item mobile quick navigation, the More menu, and footer.
- `src/styles/global.css` contains the established brand values, global typography, button/card conventions, responsive rules, reduced-motion rules, and equation overflow styles.
- `src/pages/CatalogPage.tsx` uses `CatalogFilters`, `SubjectCard`, and `useCatalog`, with loading/error/empty states.
- `src/pages/StudyPage.tsx` calls `fetchPublishedLessons`, stores lesson completion locally, and uses `MarkdownContent` for the lesson body.
- `src/pages/PracticePage.tsx` calls `fetchPublishedPracticeQuestions` and delegates question rendering to `PracticeQuestion`.
- `src/pages/ProgressPage.tsx` calls `readCompletedLessons` and `readLearningActivityDays`; it explicitly states progress is not synced to an account.
- `src/components/LatexMath.tsx`, `LazyLatexMath.tsx`, `InlineMathText.tsx`, and `MarkdownContent.tsx` are the key existing equation and lesson text path.

Retain and improve these foundations where they are fit for purpose. Do not introduce a parallel design system or alternate equation renderer without a specific, tested reason.

## 4. Focused baseline verification

### 4.1 Audit result summary

| Area | Result | Evidence | Remaining gap |
|---|---|---|---|
| Main theme | Verified: main has a light-theme CSS baseline and no ThemeProvider or theme-init script in its inspected route bootstrap. | `src/App.tsx`, `src/styles/global.css`, main tree. | The explicit Light/Dark control is not on main. PR #44 implementation must be reviewed before integration. |
| Equation rendering | Verified: shared KaTeX renderer, lazy wrapper, inline/plain-text math detection, limited Markdown parser, representative tests, and horizontal overflow CSS exist. | `src/components/LatexMath.tsx`; `LazyLatexMath.tsx`; `InlineMathText.tsx`; `MarkdownContent.tsx`; `src/test/latex-rendering.test.tsx`; `src/styles/global.css`. | No fresh local run was possible. Keyboard access to overflowed display equations, accessible fallback announcements, and dark-theme equation coverage are not proven by the inspected test names. |
| PR #44 integration points | Verified: branch adds ThemeProvider, AuthProvider, Google-only auth context, local theme persistence, profile/history/streak/menu/community routes, and browser tests. | PR #44 current source and PR description. Current-head CI and secret scan passed. | PR remains draft. A direct visual preview inspection was blocked. Rebase/synchronize and review code, tests, OAuth gates and theme coverage before merge. |
| Responsive navigation | Verified: main uses a desktop header, a More menu, a four-item mobile quick-navigation bar, and CSS breakpoints around 850px, 680px, and 560px. | `src/components/Layout.tsx`, `src/styles/global.css`, `scripts/live-smoke.cjs`. | Main live smoke tests layout overflow at 320px and 1440px only. 390px, 768px, 1024px, full keyboard flow, and redesigned menu behavior remain to be checked. |
| Main CI / live smoke | Pass on inspected main SHA. | [CI](https://github.com/justryan-n2d/CEStudy/actions/runs/39758495387), [secret scan](https://github.com/justryan-n2d/CEStudy/actions/runs/39758495402), [live smoke](https://github.com/justryan-n2d/CEStudy/actions/runs/39758768389). | These checks do not constitute a WCAG certification or all-target-width redesign test. |

### 4.2 Theme baseline: main and PR #44

**Main branch:** `src/App.tsx` directly composes `BrowserRouter`, `Layout`, and `Routes`; it does not wrap the app with a `ThemeProvider`. The inspected main CSS begins with light values such as white page backgrounds, `#24384b` body text, `#0754B5` brand blue, and related light-mode variables. The main tree does not contain PR #44's `src/contexts/ThemeContext.tsx` or `public/theme-init.js`. A working explicit dark-mode switch therefore must not be assumed to exist on main.

**PR #44 branch:**

- `src/contexts/ThemeContext.tsx` defines `light` and `dark`, reads and writes `cestudy:theme:v1` in localStorage, applies `document.documentElement.dataset.theme` and `colorScheme`, and updates the `theme-color` meta tag. Storage failures fall back to light for the current session.
- `public/theme-init.js` reads the same key before the Vite module starts, then sets the initial theme and browser theme color to reduce a theme flash.
- PR #44's `src/App.tsx` wraps `ThemeProvider` and `AuthProvider` around the app.
- PR #44 expands `src/styles/global.css` with many dark-theme overrides and shared `--ui-*` semantic values. Its stylesheet is much larger than main's and should be audited for token coverage and duplicate/page-specific overrides before extending it. Do not simply append more dark-mode overrides for every new page.
- `scripts/ui-theme-smoke.cjs` tests theme persistence, selected surfaces, several accessible states, contrast on chosen controls, reduced motion, and overflow at 320px and 1440px across a defined route list.
- The route list in that browser script does not include the lesson route or practice route. It also does not check all five roadmap viewports. The redesigned theme gate must add lesson and practice coverage, formula rendering, and 390px/768px/1024px verification.

**Recorded checks for PR #44:** current PR-head [CI run 39578952302](https://github.com/justryan-n2d/CEStudy/actions/runs/39578952302), [secret scan 39578952309](https://github.com/justryan-n2d/CEStudy/actions/runs/39578952309), and [Cloudflare deployment check 119151620066](https://github.com/justryan-n2d/CEStudy/runs/119151620066) are reported as successful in the PR description. The description also records successful browser smoke assertions at 320px and 1440px on the tested feature branch. These are evidence from the branch's automated checks, not a manual visual approval or a merge/release approval.

**Persistence decision remains open.** Device-local preference using the PR #44 key is a viable candidate, but do not silently change this into account synchronization. The owner has approved a Light/Dark toggle, light-default baseline, and no System option, not a server-side preference model.

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

- Current main CI, secret scan, and live browser smoke returned success for main SHA `ffbabc6072d46bcd12af1358d17b169a0f8abbc9`.
- Current PR #44 CI and secret scan returned success for its current PR head, as shown in the PR description. PR #44 remains draft.
- The available web/browser fetch returned a cache-miss response for the PR #44 preview URL. The container could not clone GitHub because DNS resolution for `github.com` failed. Therefore no new local test run or direct screenshot inspection was completed by this audit.
- Treat the PR's recorded Chromium assertions as CI evidence, not as independent manual visual QA. The direct preview capture and physical Android/TalkBack checks remain outstanding.

## 5. Approved owner decisions

| Decision | Status and rule |
|---|---|
| Visual direction | **Approved: Blueprint Academy**, 2026-10-22. |
| Brand | Preserve canonical logo geometry and `#0754B5` brand-blue baseline. Do not generate a replacement logo. |
| Theme | Explicit Light/Dark toggle; retain light default; do not add a System option. |
| Theme persistence | Unresolved. Device-local persistence is a candidate; do not assume account synchronization. |
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
├── Review Materials Hub (planned)
│   ├── Formula Sheets
│   ├── Problem Sets with Solutions
│   └── Video Tutorials
├── Mock Exam Portal (high-level destination, not authorization for expanded exam features)
├── Community Forum (planned; current PR #44 page is only a launch placeholder)
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
| Review Materials Hub | Planned | Formula Sheets, Problem Sets with Solutions, Video Tutorials; show availability, review state, source/version, and download state only when real data exists. |
| Practice | Existing, limited pool | Preserve current answer flow; improve question/tools layout, feedback and responsive access. Main live smoke currently expects zero published questions. |
| Results / Progress | Existing progress and per-session results | Separate current-session score from stored history; show device-local scope and only real values. |
| Student Dashboard | Proposed | Private hub for progress, recent activity, bookmarks, saved formulas, history and settings. No fake insights or cross-device claims. |
| Account / Settings | Privacy exists; extra account pages draft-only | Clear privacy, theme, sound, motion, authentication and storage disclosures. Theme persistence remains undecided. |
| Community | Draft route in PR #44 is a placeholder, not a working forum | Future searchable discussions, problem threads, math comments, reporting and moderation only after backend and permission decisions. Public identity must not expose email. |
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
- Authentication stays optional unless separately approved; preserve safe return-path handling and OAuth safeguards from PR #44.
- Keep email addresses private. Apply the approved CEStudy public identity on community content when relevant.
- Do not weaken the content review/publication workflow or expose private review notes, unpublished questions, service-role credentials, or sensitive user data.
- Never put actual question content into a public seed or publish unpublished learning content solely to make a UI look populated.
- If an interface depends on new data or permissions, stop at the interface proposal until the data contract is approved.

## 13. Prioritized implementation roadmap

Each slice must be separately scoped, reviewed, tested, and authorized. This roadmap does not authorize code changes.

### Phase 0: Canonical plan and baseline (current)

**Status:** Source inspection and existing CI evidence recorded. Direct preview capture and a fresh local run are blocked by the available environment. Do not describe the baseline as a complete live visual audit.

Work:
- Keep this roadmap as the canonical record once the documentation PR is merged.
- Confirm current main SHA, PR states, routes, existing components, test setup and CI.
- Record theme, equation, PR #44, and responsive-navigation baselines.
- Preserve the current passing main CI/live-smoke/secret-scan gate.

Exit criteria:
- All product decisions and unresolved items are explicit.
- Baseline code evidence and prior test results have source links.
- Direct preview screenshots or fresh local/browser checks are collected before visual implementation review if the tool/environment becomes available.

### Phase 1: Shared foundation and theme tokens

**Priority:** first implementation candidate. **Relative effort:** Medium. **Risk:** Medium due theme-wide regression potential.

Primary paths to inspect: `src/styles/global.css`, `src/components/Layout.tsx`, `src/App.tsx`, PR #44's `src/contexts/ThemeContext.tsx`, `public/theme-init.js`, relevant tests, and `scripts/ui-theme-smoke.cjs`.

User outcome: a stable visual base where common surfaces, text, borders, focus and controls behave consistently in Light and Dark.

Acceptance criteria:
- Preserve canonical logo and brand blue.
- Keep Light as default; support explicit Light/Dark only, with no System option.
- Theme persistence follows a separately approved decision; do not silently add account synchronization.
- Use shared semantic tokens and remove avoidable page-specific token contradictions.
- Do not regress current main pages or PR #44's auth/streak design where it is later integrated.
- Add theme contrast/component tests and browser checks for home, catalog, study, practice, forms, dialog, tables and equation error/overflow states.
- Test at 320px, 390px, 768px, 1024px and 1440px.

Dependencies and blockers:
- Agree whether PR #44's existing localStorage approach is accepted for the first release.
- Inspect full dark token coverage and verify theme initialization before React paints.
- Do not integrate draft authentication simply to obtain ThemeProvider; isolate or deliberately port theme work only after branch integration review.

### Phase 2: Navigation and route focus

**Relative effort:** Large. **Risk:** High because this touches the global shell and every route.

Primary paths: `src/components/Layout.tsx`, `src/App.tsx`, `src/styles/global.css`, navigation tests, and PR #54 candidate changes.

Acceptance criteria:
- Hybrid public header contains the approved destinations with clear active states.
- Year/semester/subject hierarchy uses verified content metadata.
- Review mega-menu exposes only the approved three groups and accurately represents content availability.
- Mock Exam Portal and Community Forum are high-level targets only until implemented.
- Student Dashboard/account controls are not duplicated or ambiguous.
- Keyboard, Escape, focus handoff, touch targets and route refresh are verified.
- Phone navigation exposes all destinations without copying the native app tab bar.
- Recheck and adapt route-focus handoff and tablet 44px target changes from PR #54 rather than merging its old navigation styling blindly.

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

Primary paths: `src/pages/ProgressPage.tsx`, `src/data/learning-progress.ts`, PR #44 auth/profile/history/streak modules if and when integrated, relevant Supabase policies and CI security tests.

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
| Theme persistence | Open | Owner confirms device-local or account-synchronized. Device-local is the lower-complexity candidate. |
| Final token values | Proposed | Validate contrast and real component rendering in both themes |
| Phone-web navigation presentation | Partially specified | Compare current four-item quick nav plus menu sheet against a grouped sheet/accordion without copying native tabs |
| PR #44 integration | Draft-only | Review branch status, OAuth/recovery safeguards, local data behavior and theme tokens before deciding how to port/merge |
| PR #54 route focus and tablet targets | Draft-only | Evaluate reusable focus handoff and 44px targets against target navigation |
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

When the owner authorizes implementation in a later conversation, start with the repository and branch baseline, then use the approved design decision and the relevant phase from this document. Do not attempt the whole roadmap in one PR.

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
| 2026-10-22 | Created the master roadmap; recorded the owner-approved Blueprint Academy direction; consolidated PR #51 decisions; recorded a focused source/CI baseline of main theme, equation rendering, PR #44, responsive navigation, and current related PRs. No application source was changed. |

---

**End of canonical roadmap.** Update this file when the owner approves changes to the overall direction, decision register, phase ordering, or implementation gates.