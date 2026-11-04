# CEStudy Connectivity Awareness and Loading Skeletons Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accurate global browser-offline notice and page-matched, accessible shimmer skeletons to CEStudy's six learning/content loading states.

**Architecture:** A small `useNetworkStatus(): boolean` hook will subscribe only to browser `online` and `offline` events; `ConnectionStatusNotice` will render the one global offline message below the site header. A small set of skeleton compositions will reuse the page's existing layout classes and semantic theme tokens, with a single screen-reader loading announcement and decorative shapes hidden from assistive technology. Actual Supabase request failures remain page-level errors and are never re-labelled as device offline status.

**Tech Stack:** React 19, TypeScript, Vite, React Router, CSS custom properties, Vitest, React Testing Library, Playwright/Chromium, GitHub Actions.

## Global Constraints

- Preserve Blueprint Academy, current website navigation, the canonical CEStudy logo, the existing Light/Dark theme toggle, Light default, and theme preference key `cestudy:theme:v1`.
- Use existing theme tokens: `--ui-surface`, `--ui-surface-raised`, `--ui-surface-muted`, `--ui-text`, `--ui-text-muted`, and `--ui-border`. Do not hard-code Light-only colors into skeleton shapes.
- Use an approximately 1.2-second CSS-only shimmer on a 200% background track. Keep the highlight subtle and disable animation under `prefers-reduced-motion: reduce`.
- Keep the loading placeholder shaped like the content it replaces. Practice answer-option placeholder rows must use the active theme's muted surface token, not inherit the real answer-option theme surface. Do not add extra card layers, decorative labels, gradients, glows, spinner overlays, or a generic repeated dashboard grid.
- Decorative skeleton geometry must be hidden from assistive technology. Each loading composition exposes one concise `role="status"` announcement and marks its content region `aria-busy="true"`.
- Browser `navigator.onLine` is only a browser-reported network signal. Never call it `internetAvailable` or `supabaseConnected`, and never claim it verifies the public internet, Cloudflare, DNS, or Supabase availability.
- Do not add periodic probes, third-party health checks, timers, automatic retries, automatic reloads, service workers, PWA caching, background sync, or queued submissions.
- If a Supabase request fails while the browser reports online, retain the page's existing contextual error. Do not display the global offline notice for that failure.
- The global offline notice must not cover navigation, obscure study material, steal focus, or overlap the mobile bottom navigation. It appears in document flow immediately after the site header.
- Loading skeletons replace existing loading UI only on Subject Catalog, Year Levels, Math Foundations, Subject Details, Study Reader, and Practice. Keep `BrandLoader` for operation-level loading states where content-shaped placeholders would be misleading.
- Do not alter lesson content, searchable-only learning objectives, published-only API access, Supabase schema/RLS, authentication/OAuth, production configuration, or production data.
- This feature is independent of product Phase 3 PRs #70-#73. Do not merge those PRs as part of this work. Keep Phase 4 out of scope.
- Verify at 320, 390, 768, 1024, and 1440 CSS pixels, in Light and Dark, with reduced-motion behavior included.
- Do not introduce a dependency.

---

### Task 1: Browser connectivity hook and global offline notice

**Files:**
- Create: `src/hooks/useNetworkStatus.ts`
- Create: `src/components/ConnectionStatusNotice.tsx`
- Test: `src/test/network-status.test.tsx`
- Modify: `src/components/Layout.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces `useNetworkStatus(): boolean`; `true` means the browser currently reports online, and `false` means it currently reports offline.
- `ConnectionStatusNotice` consumes `useNetworkStatus`, returns `null` when online, and renders the compact notice when offline.
- Exact copy: `You're offline. Some CEStudy content may be unavailable until your connection returns.`

- [ ] **Step 1: Add focused failing hook and notice tests**

Test these outcomes:
1. With `navigator.onLine === true`, the hook returns true and no notice is rendered.
2. With `navigator.onLine === false` before mount, the hook returns false and the notice is visible.
3. Dispatching `offline` after mount changes the hook to false and displays the notice without a reload.
4. Dispatching `online` changes the hook to true and removes the notice without a reload.
5. Unmount removes both browser event listeners.
6. The notice exposes one polite status message and does not steal focus.
7. Rendering the notice while the browser reports online remains hidden, regardless of any unrelated page/service error state.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm run test -- --run src/test/network-status.test.tsx`

Expected: the focused suite fails because `useNetworkStatus` and/or `ConnectionStatusNotice` do not exist yet.

- [ ] **Step 3: Implement the minimum behavior**

Implement `useNetworkStatus` with `useSyncExternalStore` (or an equally small hook) and two event listeners only. Read `navigator.onLine` for the browser snapshot, use a safe online server/test snapshot, and remove listeners on unsubscribe. Do not use polling or fetch requests.

Render `ConnectionStatusNotice` immediately after `</header>` in `Layout` and before `<main>`. Use semantic surface, border, and text tokens. Use a restrained warning/info treatment with text as the primary signal. Keep it in normal document flow.

- [ ] **Step 4: Verify the focused pass**

Run: `npm run test -- --run src/test/network-status.test.tsx`

Expected: all connectivity and notice tests pass.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run test -- --run src/test/hybrid-navigation.test.tsx src/test/theme-context.test.tsx`

Expected: layout navigation and both theme modes remain unchanged.

- [ ] **Step 6: Commit the passing deliverable**

Commit message: `feat: add browser offline status notice`.

---

### Task 2: Reusable content-shaped skeleton compositions

**Files:**
- Create: `src/components/LoadingSkeletons.tsx`
- Test: `src/test/loading-skeletons.test.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- `SubjectGridSkeleton({ label }: { label: string })`
- `YearLevelSkeleton({ label }: { label: string })`
- `SubjectDetailSkeleton({ label }: { label: string })`
- `StudyReaderSkeleton({ label }: { label: string })`
- `PracticeQuestionSkeleton({ label }: { label: string })`

All exported compositions expose a single status announcement with the supplied label, an `aria-busy="true"` loading region, and decorative geometry under one `aria-hidden="true"` subtree. The low-level line/block shape primitive stays private to the module.

- [ ] **Step 1: Add focused failing component tests**

Test:
1. Each composition renders exactly one `role="status"` announcement with its label.
2. Each composition marks its loading region busy.
3. Placeholder shapes are inside an `aria-hidden="true"` subtree and do not create additional accessible text.
4. Subject grid has the same `.subject-grid` and `.subject-card` geometry as the loaded catalog, without a redundant outer card.
5. Subject detail follows `.detail-hero` and `.detail-panel` hierarchy.
6. Study reader follows `.study-layout`, `.study-outline`, and `.study-lesson` proportions, with no Learning Objectives placeholder.
7. Practice follows `.practice-question-card` and answer-option row proportions.
8. Year-level skeleton uses the existing semester section/list hierarchy instead of inventing a new page structure.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm run test -- --run src/test/loading-skeletons.test.tsx`

Expected: tests fail because the reusable skeleton compositions do not yet exist.

- [ ] **Step 3: Implement the minimum compositions and styling**

Use the existing surface and border tokens. Define a subtle CSS pseudo-element shimmer with `background-size: 200% 100%` and an approximately `1.2s linear infinite` animation. Use varied text-line widths (for example, full, medium, and short) so placeholders resemble text rather than a wall of identical bars. Match actual content padding, card radius, grid columns, and study workspace proportions. Do not place subject-card skeletons inside a second state card.

Under `prefers-reduced-motion: reduce`, disable the animation and retain static neutral shapes. Keep skeleton overflow clipped to each shape and preserve `min-width: 0` in grid/flex children.

- [ ] **Step 4: Verify the focused pass**

Run: `npm run test -- --run src/test/loading-skeletons.test.tsx`

Expected: all composition, semantics, and accessibility-tree tests pass.

- [ ] **Step 5: Run the affected integration check**

Run: `npm run test -- --run src/test/accessibility-contrast.test.ts src/test/theme-context.test.tsx`

Expected: existing text contrast and theme behavior still pass; skeletons use semantic tokens in both themes.

- [ ] **Step 6: Commit the passing deliverable**

Commit message: `feat: add reusable content loading skeletons`.

---

### Task 3: Replace the six learning/content loading states

**Files:**
- Modify: `src/pages/CatalogPage.tsx`
- Modify: `src/pages/YearLevelPage.tsx`
- Modify: `src/pages/MathFoundationsPage.tsx`
- Modify: `src/pages/SubjectPage.tsx`
- Modify: `src/pages/StudyPage.tsx`
- Modify: `src/pages/PracticePage.tsx`
- Create: `src/test/page-loading-skeletons.test.tsx`

**Interfaces consumed:**
- The five exports from `src/components/LoadingSkeletons.tsx`.
- `useCatalog`, `fetchCatalogSubjects`, `fetchPublishedLessons`, and `fetchPublishedPracticeQuestions` retain their existing signatures and published-only/public-column behavior.

- [ ] **Step 1: Add page-level deferred-request tests**

Mock each existing data API at its network boundary with a deferred promise. Verify the mapped page shows:
- Catalog: `SubjectGridSkeleton` while the subject request is pending.
- Year Levels: `YearLevelSkeleton` while the subject request is pending.
- Math Foundations: `SubjectGridSkeleton` while the subject request is pending.
- Subject Details: `SubjectDetailSkeleton` while the subject request is pending.
- Study Reader: `StudyReaderSkeleton` while the published lesson request is pending.
- Practice: `PracticeQuestionSkeleton` while the published question request is pending.

For each page, resolve the deferred request and assert the skeleton disappears before the existing populated, empty, or error state is displayed. Include rejected-request recovery for the catalog, lesson, and practice API families. Verify Retry reissues the corresponding request, restores its page-shaped skeleton while pending, and clears the unavailable state after success.

- [ ] **Step 2: Verify the relevant failure**

Run: `npm run test -- --run src/test/page-loading-skeletons.test.tsx`

Expected: tests fail because the six pages still use the logo loader or do not render the expected content-shaped skeleton.

- [ ] **Step 3: Migrate only the six approved loading branches**

Replace each page's `BrandLoader` with the corresponding composition. Keep page headings, search/filter controls, curriculum notices, loaded content, empty states, navigation, and local completion behavior unchanged. Use student-safe contextual request-failure copy; do not expose Supabase configuration or raw backend diagnostics. Remove redundant state-panel wrappers only where they would create an extra surface absent from the loaded page.

- [ ] **Step 4: Verify the focused pass**

Run: `npm run test -- --run src/test/page-loading-skeletons.test.tsx src/test/catalog-pages.test.tsx src/test/study-page.test.tsx src/test/lesson-api.test.ts`

Expected: all six loading states appear only while pending, disappear on resolve/reject, and the catalog/reader contracts remain unchanged.

- [ ] **Step 5: Run the full application tests, lint, and build**

Run:
- `npm run test -- --run`
- `npm run lint`
- `npm run build`

Expected: the complete unit suite, ESLint, TypeScript, and Vite production build pass.

- [ ] **Step 6: Commit the passing page migration**

Commit message: `feat: use content-shaped skeletons on learning pages`.

---

### Task 4: Browser verification, reduced motion, and screenshot review

**Files:**
- Create: `scripts/connectivity-skeleton-smoke.cjs`
- Create: `.github/workflows/connectivity-skeleton.yml`

- [ ] **Step 1: Add the focused browser smoke and workflow**

Build the app using only a test-only reserved host `https://cestudy-network-skeleton.invalid` and a non-secret sentinel publishable key. The browser smoke must intercept every request to that host. No live Supabase URL or key may be used.

Use deterministic held requests to keep each of the six page skeletons visible long enough to inspect. Release each request with a synthetic, safe response and verify the skeleton disappears. Test all five viewport widths (320, 390, 768, 1024, 1440) in Light and Dark. Capture phone/desktop screenshots for each composition and upload them as a seven-day artifact.

Verify:
1. Each of the six routes displays its mapped skeleton before the held data request is released.
2. The accessible status label is present once; decorative shapes are hidden.
3. No horizontal document overflow or clipped skeleton text occurs.
4. Skeleton dimensions fit the corresponding content region and do not add an extra outer card.
5. The shimmer animation is approximately 1.2 seconds in normal motion.
6. With reduced motion emulated, the shimmer animation is disabled while the static skeleton remains visible.
7. Switching Light/Dark while a request is pending updates skeleton surfaces using the active theme tokens.
8. Browser `offline` event displays the global notice; `online` removes it without reloading.
9. A synthetic service request failure while the browser remains online shows the relevant page error and does not display the global offline notice.
10. The browser console has no runtime errors.

- [ ] **Step 2: Verify the browser smoke**

Run in CI: `node scripts/connectivity-skeleton-smoke.cjs`

Expected: every route/theme/viewport assertion passes, the runtime error list is empty, and screenshots are uploaded.

- [ ] **Step 3: Run the full repository CI**

Expected: the new connectivity/skeleton workflow passes, and the existing CI workflow continues to pass its full unit, lint/build, theme/navigation, backup and Supabase migration/RLS checks.

- [ ] **Step 4: Review the final diff and open a draft PR**

Inspect that only the planned hook, notice, skeleton components, six loading branches, tests, CSS, workflow, browser script, and this plan changed. No database, production configuration, auth, content, or Phase 3 PR branch is modified.

Open one draft PR for owner review. Do not merge or deploy without explicit authorization.

- [ ] **Step 5: Commit the browser verification deliverable**

Commit message: `test: verify connectivity notice and loading skeletons`.

---

## Shared page-unavailable state and retry

The six content-loading routes also share one recoverable request-failure state: Subject Catalog, Year Levels, Math Foundations, Subject Details, Study Reader, and Practice.

- Render the owner-supplied cloud-disconnect SVG paths directly as an inline SVG in the shared component. Use `currentColor` for the paths so Light and Dark themes both recolor the artwork. Do not depend on an external CSS mask or an extra SVG network request.
- Use one reusable `UnavailableState` component with the page-specific title/message and a visible **Retry** button directly below the message.
- Retry must reissue the failed page request. While it is pending, return to that page's existing content-shaped skeleton; on success, remove the unavailable state and show the existing content or empty/review-gate state. On another failure, show the same recoverable state again.
- Student-facing messages must remain useful and must not expose implementation diagnostics such as Supabase URL, key, or public-read-policy configuration. The global browser-offline notice remains independent and must not claim to verify internet or Supabase health.
- Apply this shared state only to the six page-level catalog/lesson/practice request failures. Do not replace legitimate empty, not-found, review-gate, form-validation, or owner-authentication states.

## Implementation and verification status (2026-11-04)

The shared unavailable state is implemented on all six approved content-loading routes. The owner-supplied SVG geometry is rendered inline as three `currentColor` paths, avoiding the external CSS-mask failure seen in the Android screenshot. Each route has a Retry action that repeats its page data request and returns to its existing skeleton while pending. Subject Details retains its Return to subjects link. Student-facing failure messages do not expose Supabase setup or raw service diagnostics.

The first browser smoke pass on the earlier implementation head passed 594/594 checks with zero runtime errors, including six route error states and retry recovery. Its full-repository CI run found five stale assertions in older tests (technical error copy, old SubjectPage loading text, and the Subject Details navigation link). Those expectations were updated on the current branch, and the missing navigation link was restored. The Practice answer-row Light-theme mismatch was also fixed by increasing selector specificity, and an explicit Light/Dark browser assertion was added. **A new component regression test requires an actual three-path inline SVG. The browser smoke now checks tag type, all three path geometries, and matching SVG fill/color on all six routes in both themes. These latest corrections still require a fresh full CI and browser run.**

The original PR #74 branch was created before Phase 3 and had diverged from current main. To avoid overwriting Phase 3 work, this candidate has been reconstructed on a fresh branch from current main (`feat/connectivity-skeletons-mainline-2026-11-04`). The Phase 3 SubjectPage route lifecycle and its existing tests are retained. Fresh full CI, browser checks, and secret scanning on this integration branch are still required before merge.

## Completion and integration gate

The original PR #74 branch is superseded by the mainline-based integration branch because its old base conflicted with Phase 3. Use the replacement PR created from `feat/connectivity-skeletons-mainline-2026-11-04` for review and merge. The Phase 3 PRs #70-#73 are already merged and must not be replayed or reconciled as open PRs.

Phase 4 is explicitly paused by the owner. This plan does not authorize Phase 4 planning or implementation. Do not start a Phase 4 branch, write Phase 4 code, or open a Phase 4 PR until the owner gives a new instruction.

## Unresolved product decisions

None. The browser-offline notice, page-level service-error handling, shared unavailable-state visual, retry behavior, six skeleton mappings, motion behavior, theme support, and PR integration gate are specified above.
