# Blueprint Academy Phase 4: Practice Workspace Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking. Complete each task and its review gate before starting the next.

**Goal:** Turn CEStudy's existing Basic Algebra practice route into a responsive, accessible Practice Workspace while preserving the verified question, answer, feedback, explanation, session-result, and publication behavior.

**Architecture:** Keep the current React page, `PracticeQuestion` data contract, published-only Supabase query, and shared `InlineMathText` / KaTeX rendering path. Add a task-oriented workspace frame around the current practice flow, with a flexible question area and an optional tools slot that appears only when at least one approved, functional tool exists. Keep attempts in memory for the active session only.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, React Router 7, Supabase JS, KaTeX 0.19, Vitest, Testing Library, and the existing Playwright-based GitHub Actions browser checks.

## Global Constraints

- Preserve the owner-approved Blueprint Academy direction, design tokens, existing logo, and CEStudy brand blue `#0754B5`.
- Keep Light as the default theme and retain the explicit Light/Dark toggle. Do not add a System theme.
- Follow `docs/specs/UX_UI_DESIGN_SYSTEM.md`, including its binding anti-template, Decision-Light, accessibility, and interaction-truth standards.
- Keep `/practice/basic-algebra` and the current Basic Algebra question source as the first implementation target. Do not imply that every subject has a practice bank.
- Keep `fetchPublishedPracticeQuestions` restricted to `status = published` and the current public columns. Never ship draft or `needs-review` records to the student UI, add privileged browser credentials, or weaken Supabase grants/RLS.
- The existing `practice_questions` schema does not define separate structured fields for diagrams, question data, or units. Do not invent these fields or add a migration as part of this plan. Preserve and render the supplied prompt text and inline/display math. A structured diagram/data/unit contract requires a separate reviewed content and schema decision.
- Do not author, modify, verify, approve, publish, or retire live questions in Phase 4. Use synthetic fixtures for populated states and visual checks.
- Do not add server-side attempts, account synchronization, sign-in dependencies, cross-device progress, analytics, or localStorage persistence. Session answers and score remain in memory for the active page session.
- Do not add a timer unless a real timed activity and its duration, pause, expiration, and completion behavior are separately approved and implemented.
- Do not add skip, arbitrary question jumping, previous-question review, shuffled ordering, or retry rewards without a separate behavior decision. Preserve the current display order and next-question progression.
- Do not introduce an AI tutor, Mock Exam Portal, board-readiness metric, leaderboard, XP, quest, reward, or broad exam workflow in this phase.
- Do not show a decorative or inert calculator, formula reference, scratchpad, or tools drawer. The first tool inventory is an explicit open decision. A tools slot may be implemented, but it must render no panel or trigger until a real tool is selected and fully functional.
- Do not replace the existing equation renderer or introduce another UI framework/dependency for this work.
- Preserve the honest empty/review gate while no questions are published. Automated synthetic fixtures do not count as published content or approval to launch.

---

## Phase 4 definition and target experience

Phase 4 is the **Practice Workspace** workstream. It upgrades the focused problem-solving experience rather than creating a separate exam platform.

### Implementation status (2026-11-05)

The implementation work for Tasks 1-3 is committed on the draft feature PR [#81](https://github.com/justryan-n2d/CEStudy/pull/81), latest head `d9268a806748c1aa5426b9dacdafc0467f1a219a`. Automated verification on that exact head passed: 224 tests across 35 files, ESLint, production build, 1,693/1,693 Light/Dark responsive assertions, 613/613 connectivity/skeleton browser assertions, Supabase migration/RLS tests, and secret scanning. The current live Basic Algebra route intentionally supplies no tools; no calculator/formula/scratchpad UI is rendered. Owner review and physical-device accessibility QA remain open, so this phase is implemented in draft but is **not yet owner-accepted or release-ready**.

### In scope

1. **Practice session flow**
   - Load the published question set for the selected practice route.
   - Present one question at a time in the existing display order.
   - Allow one answer selection, explicit answer submission, and no answer changes after submission.
   - Show correct/incorrect feedback, the correct answer when incorrect, ordered solution steps, the explanation, and the source note.
   - Advance to the next question and show an accurate end-of-session score.
   - Allow a completed session to restart from the first loaded question with the score and selection reset.
   - Preserve loading, unavailable/retry, and no-published-question states.

2. **Workspace layout**
   - Use a flexible desktop question/tools composition, approximately 70/30 as a starting point when functional supporting tools exist. The question area takes the width required by the engineering problem; the ratio is not rigid.
   - Keep the complete prompt, choices, feedback, and solution readable. Avoid decorative nested cards and excessive containers.
   - The optional tools region must collapse or dock when that behavior is useful and implemented.
   - At phone widths, use a single-column question-first layout. Any real supporting tools move into an accessible drawer, sheet, or tab.
   - When no approved functional tool exists, do not render an empty tools panel or a dead control. The question area may use the available width.

3. **Engineering content and mathematics**
   - Reuse `InlineMathText` and the shared KaTeX renderer for prompts, topic labels, choices, correct answers, solution steps, and explanations.
   - Preserve the mathematical meaning, variable names, units, source notes, and order of reviewed solution steps.
   - Support long statements, long options, and wide equations without page-wide horizontal overflow.
   - Render diagrams or separately structured data/units only when an approved content contract supplies them. The current schema does not provide those fields.

4. **Truthful interaction states**
   - Distinguish loading, unavailable, no published questions, unanswered, selected, submitted-correct, submitted-incorrect, next-question, and completed-session states.
   - Use one clearly prioritized action for the current state: answer submission after selection, then next question or session result after feedback.
   - Keep answer choices visually and semantically equal choices; Decision-Light must not hide or demote valid alternatives.
   - Show timer UI only if a real timed mode exists.

5. **Verification**
   - Cover the real practice route using synthetic published-question fixtures in browser checks.
   - Verify Light and Dark themes at 320, 390, 768, 1024, and 1440 px.
   - Verify keyboard operation, visible focus, radio-group semantics, screen-reader feedback announcements, reduced-motion behavior where motion is added, and mobile touch-target sizing.
   - Keep the live no-published-content state honest and verify API failures can be retried.

### Explicitly out of scope

- Authoring or reviewing question-bank content; changing publication status; new live questions or diagrams.
- Supabase schema changes, RLS/grant changes, privileged API paths, attempt persistence, account integration, profile/history/streak sync, or analytics.
- Mock exams, timed tests, exam setup, shuffled pools, bookmarks, attempt history, rankings, and board-exam readiness.
- AI tutoring or automated solution generation.
- A general unit converter or engineering calculator. The roadmap places the first validated unit converter in Phase 8.
- Formula Sheets, Problem Sets with Solutions, or Video Tutorials as a resource hub. Those are Phase 6.
- Gamification and retry rewards. These remain under Phase 9 and require their separate policy decisions.

### Open product decisions

- **First functional practice tools:** the specific tool or tools for the optional desktop panel and mobile sheet have not been approved. Do not assume calculator, formula sheet, scratchpad, or unit converter. Recommendation: finish and validate the question-first workspace before adding a tool; this avoids shipping a decorative panel and keeps correctness review bounded.
- **Structured diagrams/data/units:** the current database contract stores prompt text, choices, correct answer, solution steps, explanation, and source note. Decide separately whether engineering questions need structured diagram/image or data/unit fields and define their review, storage, licensing, and accessibility requirements before changing the schema.
- **Question navigation and timing:** the current flow is sequential and untimed. Keep it that way unless the owner separately approves skip/revisit, shuffled mode, or a timed session with explicit rules.

## Task 1: Lock the existing session behavior with complete state and retry coverage

**Files:**
- Modify: `src/pages/PracticePage.tsx`
- Modify: `src/components/PracticeQuestion.tsx` only where a tested behavior requires it
- Test: `src/test/practice-flow.test.tsx`
- Test: `src/test/practice-content.test.ts`

**Interfaces:**
- Consumes: `fetchPublishedPracticeQuestions(subjectSlug?: string): Promise<PracticeQuestion[]>`
- Consumes: `PracticeQuestion` from `src/types/study-content.ts`
- Preserves: the existing `PracticeQuestion` component props and the published-only API contract.
- Produces: deterministic UI behavior for load, retry, empty, active, submitted, completed, and restart states; no persisted attempt interface.

- [x] **Step 1: Add focused failing behavior tests**

Add or extend tests proving:
- A rejected first request shows the existing unavailable state and a Retry action.
- Selecting Retry starts a new request; a subsequent successful response displays the first question.
- A loading response does not expose a stale question from an earlier request.
- The Check answer action is disabled until an option is selected.
- Submitting a correct answer shows correct feedback and the ordered steps; submitting an incorrect answer reveals the correct answer, explanation, and source note.
- Submitted options cannot be changed and the answer cannot be submitted twice.
- The final next action opens the result state with the exact score and question count.
- Restart returns to question one with no selected option and a zero score.
- The content parser rejects a correct answer that is not exactly one of the displayed choices, and rejects blank or duplicate choices rather than rendering an impossible or ambiguous question.
- An empty published response keeps the Questions coming soon review gate and does not render a question or invented progress.

Run: `npm test -- --run src/test/practice-flow.test.tsx src/test/practice-content.test.ts`

Expected: newly added assertions fail only where the current implementation does not satisfy the explicit state contract.

- [x] **Step 2: Verify the focused failure**

Record the command output and the decisive failing assertion. Correct test setup problems instead of treating import, syntax, or environment errors as a valid red result.

- [x] **Step 3: Implement the minimum state correction**

Keep the current in-memory session model and published-only API. Fix only state-reset, retry, or interaction defects demonstrated by the tests. Do not add persistence, timer behavior, question randomization, or new scoring policy.

- [x] **Step 4: Verify the focused pass**

Run: `npm test -- --run src/test/practice-flow.test.tsx src/test/practice-content.test.ts`

Expected: all targeted session and content-validation assertions pass without weakening existing checks.

- [x] **Step 5: Run integration checks**

Run: `npm test -- --run`, `npm run lint`, and `npm run build`.

Expected: all Vitest tests, ESLint, TypeScript project build, and Vite production build pass.

- [x] **Step 6: Commit the passing deliverable**

```bash
git add src/pages/PracticePage.tsx src/components/PracticeQuestion.tsx src/test/practice-flow.test.tsx src/test/practice-content.test.ts
git commit -m "test: harden practice session state flow"
```

## Task 2: Build the responsive Blueprint Academy workspace frame

**Files:**
- Create: `src/components/PracticeWorkspace.tsx`
- Modify: `src/pages/PracticePage.tsx`
- Modify: `src/components/PracticeQuestion.tsx` only where composition requires it
- Modify: `src/styles/global.css`
- Test: `src/test/practice-workspace.test.tsx` (new)

**Interfaces:**
- Consumes: the existing question/session state and `PracticeQuestion` component.
- Proposed component interface: `PracticeWorkspace({ children, tools? })`, where `children` is the primary question/session content and `tools` is absent until a functional approved tool is supplied.
- Produces: a responsive workspace frame. With functional tools, desktop uses a flexible question/tools split and phone uses an accessible tools sheet/drawer. Without tools, no empty panel or inert open-tools control is rendered.

- [x] **Step 1: Add focused failing layout tests**

Verify:
- The practice question is the primary content and retains its full prompt, answer choices, feedback, and explanation.
- When no tools are supplied, the layout does not render an empty tools panel, a fake calculator, or an open-tools control.
- When a functional test tool is supplied, the desktop frame exposes a distinct question region and tools region without clipping either region.
- On phone layouts, the tool action opens an accessible sheet/dialog, Escape closes it, focus returns to the trigger, and hidden content is not keyboard reachable.
- At 320px and 390px, the question remains the first and primary content column.

Run: `npm test -- --run src/test/practice-workspace.test.tsx`

Expected: the new layout assertions fail before the workspace frame exists.

- [x] **Step 2: Verify the relevant failure**

Record the failing assertions and ensure the test reaches the rendered practice page rather than failing during test setup.

- [x] **Step 3: Implement the workspace frame**

Use the existing spacing, border, focus, surface, and theme tokens. Keep the question column flexible rather than forcing an exact 70/30 split. Render the tools region only when a real functional tool is supplied. Use a proper accessible dialog/sheet pattern on narrow screens if tools are supplied. Do not add new UI dependencies.

- [x] **Step 4: Verify the focused pass**

Run: `npm test -- --run src/test/practice-workspace.test.tsx src/test/practice-flow.test.tsx`

Expected: all responsive composition and existing session-flow tests pass.

- [x] **Step 5: Run integration checks**

Run: `npm run lint` and `npm run build`.

Expected: lint, TypeScript project build, and Vite production build pass.

- [x] **Step 6: Commit the passing deliverable**

```bash
git add src/components/PracticeWorkspace.tsx src/pages/PracticePage.tsx src/components/PracticeQuestion.tsx src/styles/global.css src/test/practice-workspace.test.tsx
git commit -m "feat: add responsive practice workspace frame"
```

## Task 3: Verify engineering math, responsive states, and accessibility in the browser

**Files:**
- Modify: `scripts/theme-smoke.cjs`
- Modify: `scripts/connectivity-skeleton-smoke.cjs` only if an additional loading/retry assertion is needed
- Reuse: `src/test/practice-flow.test.tsx`, `src/test/practice-workspace.test.tsx`, `src/components/InlineMathText.tsx`, `src/components/LatexMath.tsx`, and existing theme tokens.

**Interfaces:**
- Consumes: the built app, current `/practice/basic-algebra` route, synthetic published-question browser fixture, and existing CI smoke harness.
- Produces: browser evidence for the practice question, answer, feedback, solution, result, retry, and empty states across the approved theme/viewport matrix.

- [x] **Step 1: Add focused browser assertions**

Using synthetic fixture data only, verify:
- Long question text and representative inline/display math render without clipping or page-wide horizontal overflow.
- Long answer labels remain readable and selectable.
- Both correct and incorrect submitted states render the right feedback and solution.
- Session completion and restart show the correct score and reset state.
- Loading, rejected-request retry, and zero-published-question states remain distinct and accurate.
- Light and Dark themes render the question, selected answer, feedback, solution steps, and controls with readable contrast.
- The practice page works at 320, 390, 768, 1024, and 1440 px.
- Keyboard users can select answers, submit, advance, and operate any supplied tool sheet without losing focus.
- Screen-reader status announcements identify the result state; reduced-motion preferences are respected if the workspace adds motion.
- No timer, calculator, formula panel, or tool trigger appears unless its actual implementation is part of the tested page.

- [x] **Step 2: Verify the relevant failure**

Run the existing theme browser smoke against the current production build and record the new failing assertion before changing browser or layout code.

- [x] **Step 3: Implement only demonstrated fixes**

Correct question width, math overflow, focus handling, status semantics, or theme contrast based on the failed assertions. Keep math source and answer correctness unchanged.

- [x] **Step 4: Verify the focused pass**

Run the updated browser smoke through the repository's GitHub Actions workflow on the feature branch.

Expected: all new practice assertions pass at every target viewport in both Light and Dark; no runtime errors are reported.

- [x] **Step 5: Run full integration and security checks**

Run the repository's CI, connectivity/skeleton browser checks, Supabase migration/RLS tests, and secret scan on the final Phase 4 head.

Expected: all required jobs pass; the public question API remains published-only; no production data or configuration changes occur.

- [x] **Step 6: Commit the passing deliverable**

```bash
git add scripts/theme-smoke.cjs scripts/connectivity-skeleton-smoke.cjs
git commit -m "test: verify practice workspace across themes and viewports"
```

## Phase 4 exit criteria

<text>**Automated implementation criteria on draft PR #81:**</text>
- [x] The existing sequential answer/submission/feedback/solution/next/result/restart flow passes focused tests.
- [x] Loading, retry, and empty publication states are honest and verified.
- [x] The question-first workspace responds correctly at all five target widths.
- [x] No tools panel or trigger appears without a functional tool; the supplied-tools sheet has focus, inert-background, close, and reduced-motion coverage.
- [x] Synthetic engineering math content renders through KaTeX and does not cause page-wide or answer-option overflow in either theme.
- [x] Keyboard focus containment/restoration, status feedback, and reduced-motion behavior are covered by automated tests.
- [x] CI, Supabase migration/RLS, connectivity/browser, and secret-scan workflows pass on the final implementation head.

**Owner acceptance and release criteria still outstanding:**
- [ ] Owner reviews the Cloudflare preview and confirms the Practice Workspace visual/interaction direction.
- [ ] Manually check Android layout and touch behavior, TalkBack/screen-reader output, keyboard-only navigation, and 200% text zoom.
- [ ] Confirm any real tool before supplying it to the workspace. The current route has none and correctly renders no tools UI.

**Release boundary:** Completion of this product workstream is not approval to publish questions, change production data, deploy to production, launch CEStudy broadly, or bypass the separate operational release Phase 7.

## Effort, risk, and sequence

- **Effort:** Large. This is a multi-task UI and behavior change with responsive, math-rendering, and accessibility verification.
- **Risk:** High where solution correctness, long engineering content, or focus behavior is affected. Risk is lower for the frame-only work because it preserves the existing data and session contracts.
- **Recommended sequence:** Task 1, then Task 2, then Task 3. Keep tool-specific work out of these tasks until the owner approves a concrete tool and its behavior.
- **Current baseline:** `main` at `5f9ec1dc0bb3d3eb63bd4deb03a0dc01db05f76e`, with PR #79 merged.
