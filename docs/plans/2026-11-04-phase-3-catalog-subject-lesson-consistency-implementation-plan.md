# Phase 3: Catalog, Subject and Lesson Consistency Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking. Complete one task and its review gate before beginning the next.

**Goal:** Improve consistency and reliability across CEStudy's subject discovery, subject details and published lesson reader while preserving the current Blueprint Academy structure and all existing data/privacy behavior.

**Architecture:** Keep the current React page/component boundaries and the existing Supabase data-access functions. Add missing API/page regression coverage first, then make only the smallest changes proven necessary by those tests. Verify the shared KaTeX/Markdown rendering in a synthetic published lesson on the built app in both themes and all five approved viewport widths; do not publish or modify live lesson content.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, React Router 7, Supabase JS, KaTeX 0.19, Vitest, Testing Library, Playwright in GitHub Actions.

## Global Constraints

- Preserve the owner-approved Blueprint Academy direction. This plan is an incremental consistency pass, not a new site redesign or new visual system.
- Follow `docs/specs/UX_UI_DESIGN_SYSTEM.md` and its binding design-quality and anti-template standard. Avoid default purple/blue gradients, centering every page, decorative headline word highlighting, unnecessary eyebrow/kicker copy, and em dashes in new interface copy. Use small labels only when they communicate actual classification, status or navigation context.
- Keep the approved light-default theme with explicit Light/Dark controls and the device-local `cestudy:theme:v1` preference. Do not add a System theme or account synchronization.
- Preserve the current logo geometry, CEStudy brand blue `#0754B5`, global navigation, mobile quick navigation and More menu. Do not replace the Blueprint Academy shell.
- Do not invent year-level or semester assignments, curriculum claims, subject availability, related-subject relationships, lesson objectives, source attribution or published content. Use existing metadata and verified source notes only.
- The public catalog remains browsable. Student lesson and practice APIs must continue to expose only records whose status is `published`. Never weaken RLS, add privileged browser keys, or include `review_notes` / `reviewed_at` in student-facing queries.
- Lesson completion and activity remain browser-local. Do not add sign-in, account synchronization, server-side progress, analytics or cross-device sync in Phase 3.
- Do not edit live Supabase rows, migrations, publication statuses, production configuration or OAuth settings in this phase. Use synthetic test fixtures for browser-level lesson rendering.
- Use test-driven development for every behavior change: add a focused failing test, verify the failure, implement the minimum fix, verify the pass, then run affected integration checks.
- Avoid new dependencies unless an unmet requirement is demonstrated and the current stack cannot satisfy it.

---

## Repository Audit: Current Baseline

### Catalog and subject discovery

- `src/pages/CatalogPage.tsx` uses `useCatalog`, `CatalogFilters` and `SubjectCard`. It searches titles, summaries, aliases and specializations, and filters by year, category, classification and availability.
- `src/components/CatalogFilters.tsx` keeps advanced filters collapsed by default and exposes active-filter count and clear-filter behavior.
- `src/test/catalog-pages.test.tsx` already covers search/aliases, collapsed filters, no-results recovery, year routes, combined filters, unassigned mathematics foundations and result-count announcements.
- `src/test/catalog.test.ts` covers year-level presence, specialization areas, year-independent mathematics foundations, absence of generic numbered specialty placeholders and source/status metadata.
- `src/data/catalog-api.ts` maps Supabase rows to `CatalogSubject` and orders them by `display_order`. There is no dedicated `catalog-api` test file yet.
- `src/hooks/useCatalog.ts` owns the Catalog page loading/error lifecycle. Its states are implemented, but no focused hook test was found in `src/test`.
- `src/pages/SubjectPage.tsx` loads the subject by slug and renders classification, source note/reference, optional year/semester, specialization, availability and related subjects. Basic Algebra has a direct reviewer entry. No dedicated `SubjectPage` test was found.
- `src/test/subject-card.test.tsx` checks subject-card navigation but does not cover the subject-detail page.

### Study reader and mathematical content

- `src/pages/StudyPage.tsx` loads `fetchPublishedLessons(subjectSlug)`, searches published lesson title/slug/objectives/body, renders lesson Markdown and saves completion locally.
- `src/data/lesson-api.ts` selects public lesson columns only, filters by subject and `status = published`, and orders by `unit_number`.
- `src/types/lesson-content.ts` validates lesson records through `parseSubjectLesson`; the public reader filters malformed and non-published rows.
- `src/test/lesson-api.test.ts` covers the selected public fields, published-only query, defensive rejection of an unexpected unpublished row and empty results.
- `src/test/study-page.test.tsx` covers empty published content, rendering a published lesson, multi-term topic search/navigation and local completion/undo. It does not currently have dedicated loading/error, previous/next, invalid-unit or stale-request cases.
- `src/components/MarkdownContent.tsx`, `InlineMathText.tsx`, `LazyLatexMath.tsx` and `LatexMath.tsx` are the established math/Markdown path. `src/test/latex-rendering.test.tsx` already covers inline/display math, matrices, nested fractions, currency, malformed formulas, HTML-as-text, engineering formula examples and practice question fields.
- The current theme smoke route `/study/basic-algebra` reaches the honest empty/review state because there are no published lessons. Thus the existing browser matrix does not currently exercise a populated lesson containing rendered KaTeX in both themes.

### Release and content baseline

- A live read-only query on 2026-11-04 confirmed 72 catalog subjects, 52 practice questions and 13 lessons; every question and lesson is `needs-review`, and none are published.
- Do not publish a lesson or question to enable tests. Browser-level populated lesson tests must intercept the local preview's lesson API request with synthetic fixture data.
- The current main CI command sequence is `npm ci --no-audit --no-fund`, `npm run lint`, `npm run test -- --run`, `npm run build`, the existing Chromium theme smoke script, backup crypto/retention checks, and `supabase test db`.

---

## Task 1: Lock the Catalog API and Subject Page contracts

**Files:**
- Create: `src/test/catalog-api.test.ts`
- Create: `src/test/subject-page.test.tsx`
- Create: `src/test/use-catalog.test.ts`
- Modify only if a failing test proves a behavior defect: `src/data/catalog-api.ts`, `src/hooks/useCatalog.ts`, `src/pages/SubjectPage.tsx`, `src/test/catalog-pages.test.tsx`

**Interfaces:**
- Consumes: `fetchCatalogSubjects(): Promise<CatalogSubject[]>` from `src/data/catalog-api.ts`.
- Consumes: `CatalogSubject` from `src/types/catalog.ts`.
- Consumes: `useCatalog()` returning `{ subjects, loading, error }`.
- Preserves: `SubjectPage` route `/subjects/:slug` and the current Basic Algebra reviewer route `/study/basic-algebra`.

- [ ] **Step 1: Add the Catalog API regression tests**

Test these cases using the existing Supabase mock pattern:
- When Supabase is not configured, the API returns the typed static `CATALOG_SUBJECTS` fallback.
- With Supabase configured, it selects the currently used catalog columns and calls `.order("display_order", { ascending: true })`.
- The mapped result preserves `slug`, title/summary, aliases, nullable year/semester, category/classification, specialization, source reference/note, availability and display order.
- A Supabase query error rejects with the existing safe user-facing catalog error, without exposing raw database details.
- Static catalog records have unique slugs, valid year-level values (`1` to `4` or `null`), valid availability/classification values and non-empty source notes.

- [ ] **Step 2: Run the API characterization tests**

Run: `npm run test -- --run src/test/catalog-api.test.ts`
Expected: assertions for behavior already present in `catalog-api.ts` pass. If a test exposes a real defect, isolate that assertion as a regression test and verify the failing behavior before changing production code. Do not force an artificial failure merely to create a RED step.

- [ ] **Step 3: Add the Subject Page behavior tests**

Use `MemoryRouter` with `/subjects/:slug` and mock `fetchCatalogSubjects`. Verify:
- Loading is announced while the request is pending.
- A rejected request shows a recoverable error and a link back to `/catalog`.
- An unknown slug shows the existing not-found state and a link back to `/catalog`.
- A valid subject shows its title, summary, accurate availability, classification label and source note.
- Year and semester text appears only when those fields exist; `null` year/semester never becomes a guessed placement.
- An HTTP(S) source reference becomes the source link; a non-URL note is not turned into a link.
- Related subjects exclude the current subject and contain no more than three records.
- Basic Algebra continues to link directly to `/study/basic-algebra`.

- [ ] **Step 4: Run the Subject Page characterization tests**

Run: `npm run test -- --run src/test/subject-page.test.tsx`
Expected: assertions matching current loading, error, not-found, source, availability and related-subject behavior pass. If a requirement is not met, retain a focused failing regression test before making the minimum correction.

- [ ] **Step 5: Add focused `useCatalog` loading/error lifecycle characterization tests**

Verify initial loading, successful data delivery, error state and ignoring a late promise after unmount. Preserve the current hook interface; do not add retries or new user-visible actions unless a separate requirement is approved.

- [ ] **Step 6: Run the focused hook tests**

Run: `npm run test -- --run src/test/use-catalog.test.ts`
Expected: the current hook behavior is documented by passing assertions. If a required lifecycle behavior is absent, keep the specific failing assertion as a regression test.

- [ ] **Step 7: Run the Catalog/Subject integration tests**

Run: `npm run test -- --run src/test/catalog-api.test.ts src/test/subject-page.test.tsx src/test/use-catalog.test.ts src/test/catalog-pages.test.tsx src/test/catalog.test.ts src/test/subject-card.test.tsx`
Expected: all focused tests pass; the existing search/filter, result announcement, navigation and availability behavior remains intact.

**Review gate:** inspect the diff to confirm no unverified curriculum metadata, labels, subject assignments or extra decorative content was added. Commit this independently passing slice before Task 2.

---

## Task 2: Strengthen the published Study reader contract

**Files:**
- Modify: `src/test/lesson-api.test.ts`
- Modify: `src/test/study-page.test.tsx`
- Modify only if a failing test proves a behavior defect: `src/data/lesson-api.ts`, `src/pages/StudyPage.tsx`, `src/types/lesson-content.ts`

**Interfaces:**
- Consumes: `fetchPublishedLessons(subjectSlug: string): Promise<SubjectLesson[]>`.
- Consumes: `SubjectLesson` from `src/types/lesson-content.ts`.
- Preserves: `/study/:slug` and `/study/:slug/:unit`, topic search, `MarkdownContent`, local completion and current previous/next links.

- [ ] **Step 1: Extend the lesson API tests**

Add assertions that the query filters by the requested `subject_slug` and `status = published`, orders by `unit_number` ascending, excludes `review_notes` and `reviewed_at` from the selected columns, rejects with the current safe error on a Supabase failure, returns an empty list for no published rows, and drops malformed or unexpectedly non-published rows from a response.

- [ ] **Step 2: Run the lesson API characterization tests**

Run: `npm run test -- --run src/test/lesson-api.test.ts`
Expected: existing public-column selection, published-only filtering and empty-result behavior pass. Add or isolate a failing regression assertion only if the expanded contract identifies an actual behavior defect.

- [ ] **Step 3: Extend the Study Page tests**

Add cases for:
- Loading state while the lesson request is pending.
- Recoverable request error without exposing private row content.
- Empty published-content state remains honest and offers no lesson-completion control.
- An invalid or missing unit does not render a different lesson by accident.
- Previous and Next navigate to the adjacent published lesson in unit order; boundary conditions omit unavailable navigation.
- A search with no matches shows the no-results message and does not reveal a non-matching lesson.
- A subject-route change does not allow a late response for the previous subject to replace the new subject's content.
- Completion and undo remain local to the current browser; no Supabase write is introduced.

- [ ] **Step 4: Run the Study Page characterization tests**

Run: `npm run test -- --run src/test/study-page.test.tsx`
Expected: existing empty, published lesson, search/navigation and local completion behavior remains passing. Any proposed new requirement that is not met must be isolated in a focused failing test before code changes.

- [ ] **Step 5: Implement the smallest reader/API corrections**

Only fix demonstrated failures. Preserve published-only filtering, current `SubjectLesson` types, unit ordering, safe error copy, local-only completion and the existing route contract. Do not redesign the entire lesson page or add account/progress syncing.

- [ ] **Step 6: Verify Study and lesson API integration**

Run: `npm run test -- --run src/test/lesson-api.test.ts src/test/lesson-content.test.ts src/test/study-page.test.tsx src/test/learning-progress.test.ts src/test/learning-streak.test.ts`
Expected: all focused tests pass, draft lesson content remains hidden, and completion continues to write only browser-local state.

**Review gate:** review the changed Study Page at phone and desktop widths before accepting any visual adjustment. Keep math source, lesson wording and source attribution unchanged unless an independently reviewed content correction is required.

---

## Task 3: Verify populated lesson math rendering in both themes

**Files:**
- Modify: `src/test/latex-rendering.test.tsx`
- Modify: `scripts/theme-smoke.cjs`
- Modify only if a failing test proves a rendering defect: `src/components/MarkdownContent.tsx`, `src/components/InlineMathText.tsx`, `src/components/LazyLatexMath.tsx`, `src/components/LatexMath.tsx`, `src/styles/global.css`

**Interfaces:**
- Consumes: `MarkdownContent({ markdown }: { markdown: string })`.
- Consumes: the current KaTeX rendering path and semantic theme tokens.
- Produces: browser smoke coverage for a synthetic published lesson on the local built preview, without writing to Supabase or changing live data.

- [ ] **Step 1: Add deterministic formula and theme fixtures**

Extend the existing renderer tests only for uncovered edge cases. Reuse representative formulas already in the test suite: inline and display fractions, nested fractions, matrices, quadratic/trigonometric expressions and explanatory prose. Add assertions that malformed formulas remain readable source text and that the original Markdown fixture is not mutated.

Add a synthetic `subject_lessons` REST response fixture in the local Playwright smoke script. Intercept only the local preview request for the test subject, return one synthetic row with `status: published`, and include a realistic lesson body containing headings, objectives, inline math, a display equation and a worked solution. Do not call the live database for this fixture.

- [ ] **Step 2: Run the renderer characterization tests**

Run: `npm run test -- --run src/test/latex-rendering.test.tsx`
Expected: all existing math/rendering tests remain passing. New assertions document current behavior; if they demonstrate a genuine renderer defect, isolate that case and confirm the failure before fixing it.

- [ ] **Step 3: Add browser assertions for the populated lesson**

On the built local preview, visit `/study/basic-algebra/1` with the synthetic API response and verify:
- The lesson heading and source Markdown render.
- Expected `.katex` nodes appear for the fixture's equations.
- No `.latex-math-error` nodes appear for valid formulas.
- Invalid fixture input uses the existing readable fallback rather than crashing the page.
- In both Light and Dark themes, equation text and surrounding surfaces remain readable.
- At 320, 390, 768, 1024 and 1440 px, the equation container does not cause page-wide horizontal overflow.
- No new theme state or user preference is written other than the existing `cestudy:theme:v1` key.

- [ ] **Step 4: Verify the browser smoke on the local production build**

Run through the existing CI workflow: `npm run build`, then the configured `scripts/theme-smoke.cjs` job with its Playwright module and preview URL. The workflow already installs Chromium and starts the built app on port 4173.
Expected: the existing 1,682 theme/navigation checks plus the new synthetic lesson assertions pass with zero runtime errors.

- [ ] **Step 5: Run the full Phase 3 regression set**

Run: `npm run lint`
Run: `npm run test -- --run`
Run: `npm run build`
Expected: lint is clean, the full Vitest suite passes, and Vite builds production assets. CI must also pass the existing Supabase migration/RLS tests, backup crypto/retention tests and Chromium smoke job.

**Review gate:** compare before/after screenshots for the populated lesson at phone and desktop widths in both themes. Reject changes that add generic gradients, unnecessary centered sections, word-highlight headline styling, decorative eyebrow copy, nested cards without a functional reason, or functionality that is not real.

---

## Explicitly deferred to later product-roadmap phases

- Phase 4 owns the Practice Workspace layout and tools drawer/sheet. Phase 3 must preserve the current `PracticePage` and `PracticeQuestion` answer, feedback, explanation, next-question and results behavior.
- Phase 5 owns the account integration. Do not modify PR #67, `AuthContext`, OAuth callbacks, profile/history/streak routes or user-scoped local storage in Phase 3.
- No new subject content, lesson content, practice questions, diagrams or curriculum placements are authored in this plan.

## Unresolved product decision

**Learning objectives in the lesson reader:** `SubjectLesson.learningObjectives` is currently used for topic search, but the student-facing `StudyPage` does not display the objectives. The existing `study-page.test.tsx` explicitly asserts that the objectives are not rendered. The roadmap calls for a consistent hierarchy for objectives, lesson sections, formulas, solutions and next steps. Decide whether a concise, clearly labelled Learning Objectives section should appear above the lesson body, or whether objectives should remain search-only. No change to this behavior should be made until the owner decides.

## Phase 3 completion criteria

- Catalog search/filter behavior, availability, source/provenance and empty/error recovery remain covered by tests.
- Subject detail loading/error/not-found, source links, optional year/semester and related-subject behavior are directly covered.
- Student lesson APIs request public columns only and return published rows only; malformed/unpublished content remains hidden.
- Study reader loading/error/empty/search/navigation/completion behavior is covered without changing local-only progress boundaries.
- A synthetic populated lesson renders representative engineering math in both themes at all five target widths without page-wide overflow or formula-rendering errors.
- The full lint, unit test, production build, database migration/RLS and browser CI gates pass.
- No change to live content publication, database schema, production settings, authentication or deployment is included.

## Unresolved execution rule

After the owner reviews this plan and decides the learning-objectives question, implement one task at a time. Do not hand the entire Catalog, Subject and Study surface to a coding agent as one simultaneous redesign.