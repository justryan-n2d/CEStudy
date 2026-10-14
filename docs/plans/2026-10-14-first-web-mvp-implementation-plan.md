# CEStudy First Web MVP Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first useful, responsive CEStudy website with the full four-year BSCE subject catalog, transparent curriculum references, and one focused practice module whose material is reviewed before being labeled verified.

**Architecture:** The repository currently contains planning documentation and no application source or test setup. First record and approve the architecture choice, then build a small client-rendered web app. The recommended baseline is a React + TypeScript + Vite single-page app with a typed local catalog and question set, deployed from GitHub to Cloudflare Pages. Keep the initial catalog static; add a backend only after a feature requires accounts, remote editing, or synchronized user data.

**Tech Stack:** Not yet finalized. Recommended baseline for approval: React, TypeScript, Vite, React Router, plain responsive CSS, Vitest, React Testing Library, GitHub Actions, and Cloudflare Pages. Supabase, AI provider integrations, native Android/iOS apps, and account-based progress syncing are deferred.

## Global Constraints

- Follow `docs/specs/2026-10-14-subject-catalog-design.md` as the subject catalog source of truth.
- Show all four year levels from the first usable release.
- Include a Mathematics Foundations and Refreshers section accessible regardless of year level.
- Include the five named specialization areas: Construction Engineering and Management, Geotechnical Engineering, Structural Engineering, Transportation Engineering, and Water Resources Engineering.
- Display the curriculum transparency note and link to the CHED source.
- Explain that year-level placements follow the referenced CHED sample and may differ across universities.
- Do not describe supplementary mathematics foundations as standalone courses required by CMO No. 92, s. 2017.
- Every catalog subject remains discoverable even when study content is not ready; show an accurate availability status.
- Do not label material as verified until its calculations, answers, explanations, and references have been checked.
- Do not publish copied third-party material without appropriate rights and attribution.
- Keep secrets, tokens, and private user data out of the public repository.
- Favor mobile usability, fast loading, accessibility, simple maintenance, and minimal recurring cost.
- Do not implement account registration, cloud-synced progress, public submissions, paid features, or AI-generated answers in this first version.
- The recommended technology stack is a proposal, not a final decision. Do not scaffold the app until Task 1's architecture decision is approved.
- Proposed file paths below are not present in the current repository; create them only after the architecture decision is accepted.

---

## Task 1: Approve the initial web architecture

**Files:**
- Create: `docs/decisions/0001-initial-web-architecture.md` (proposed)
- Reference: `docs/specs/2026-10-14-subject-catalog-design.md`
- Reference: `docs/PROJECT_SCOPE.md`

**Interfaces:**
- Consumes: approved subject catalog and project scope.
- Produces: an explicit architecture decision covering frontend, hosting, data source, testing, and what is deferred.

- [ ] **Step 1: Compare the viable approaches**

Document these options and their trade-offs:
1. **Recommended:** Vite + React + TypeScript; catalog and initial reviewed study content stored as checked-in typed data; Cloudflare Pages deploys the static build from GitHub. No backend required for the initial catalog.
2. A static HTML/CSS/JavaScript app with local data. Fewer dependencies, but more manual structure as the subject catalog and practice interface grow.
3. A full-stack framework plus database from the beginning. More capability for accounts and content management, but adds configuration, backend permissions, and ongoing usage considerations before those features have been validated.

- [ ] **Step 2: Evaluate against project constraints**

The decision record must compare mobile friendliness, ease of editing through GitHub tools, testing, accessibility, deployment effort, free-tier limits, data portability, future expansion, and required secrets. State that free-tier limits can change and must be rechecked before launch.

- [ ] **Step 3: Record the decision and its boundaries**

Recommend Option 1 for approval. Keep Supabase deferred until remote content editing, accounts, or synchronized progress is required. No AI API key should be needed to render the first version. If a different option is selected, revise Tasks 2-5 before creating application files.

- [ ] **Step 4: Verify the decision record**

Review the document against every evaluation criterion above. Expected result: one selected path, reasons for selection, deployment approach, known trade-offs, and explicit deferred features; no unresolved choice about which approach is being implemented.

- [ ] **Step 5: Review gate**

Do not begin Task 2 until the user approves the architecture recommendation or asks for a revision.

---

## Task 2: Scaffold the responsive application shell

**Files (proposed):**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/global.css`
- Create: `src/test/setup.ts`
- Create: `src/test/smoke/App.test.tsx`
- Create: `eslint.config.js`

**Interfaces:**
- Consumes: the approved architecture decision from Task 1.
- Produces: an accessible application shell, route outlet, reusable page layout, and working lint/test/build scripts.

- [ ] **Step 1: Add the initial smoke test**

Test that the application renders the CEStudy identity, primary navigation, and a main content landmark. Expected initial failure: the test cannot yet render the required shell.

- [ ] **Step 2: Create the smallest app shell**

Set up the agreed frontend stack and scripts named `dev`, `build`, `preview`, `test`, and `lint`. Use React Router only if Task 1 approves the recommended React architecture. Add a header, navigation, main region, and footer with semantic HTML. Use responsive CSS and visible keyboard focus states.

- [ ] **Step 3: Keep global layout separate from content**

The shell owns typography, spacing, page width, navigation, and responsive layout only. Catalog data and study questions belong in separate modules and must not be hard-coded into the shell component.

- [ ] **Step 4: Verify the focused pass**

Run: `npm run test -- --run src/test/smoke/App.test.tsx`  
Expected: the smoke test passes and the app renders CEStudy navigation.

- [ ] **Step 5: Run the integration checks**

Run: `npm run lint && npm run build`  
Expected: no lint errors; Vite produces a production build in `dist/`.

- [ ] **Step 6: Commit the passing deliverable**

Commit through the connected GitHub tools with message: `feat: scaffold responsive CEStudy web app`. Termux is not required.

---

## Task 3: Build the typed subject catalog and curriculum-aware browsing

**Files (proposed):**
- Create: `src/data/catalog.ts`
- Create: `src/types/catalog.ts`
- Create: `src/components/CurriculumNotice.tsx`
- Create: `src/components/SubjectCard.tsx`
- Create: `src/components/CatalogFilters.tsx`
- Create: `src/pages/CatalogPage.tsx`
- Create: `src/pages/YearLevelPage.tsx`
- Create: `src/pages/MathFoundationsPage.tsx`
- Create: `src/pages/SubjectPage.tsx`
- Create: `src/test/catalog.test.ts`
- Create: `src/test/catalog-pages.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces `YearLevel = 1 | 2 | 3 | 4`.
- Produces a typed `CatalogSubject` record with stable `id` and `slug`, `title`, `category`, `classification`, typical placement where applicable, optional specialization, source reference, and content availability.
- Subject classification values: `ched-common-course`, `ched-specialized-course`, `supplementary-math-foundation`, and `additional-ce-review-topic`.
- Subject availability values: `coming-soon`, `in-preparation`, and `has-published-content`.
- The catalog module exports a single typed collection used by every catalog view.

- [ ] **Step 1: Add failing catalog contract tests**

Assert that the catalog has entries for all four year levels; includes a separate Mathematics Foundations section; represents all five specialization areas; includes a curriculum source for CHED-referenced entries; and does not display generic placeholders such as `Professional Course - Specialized 1` as real course names.

- [ ] **Step 2: Add catalog metadata**

Seed the catalog from the approved design document. Preserve the distinction between common courses, specialized professional courses, supplementary math foundations, and additional CE review topics. Include the official CHED link and a note that course placement can vary by university. Preserve the sample-semester placement only where it is given in the design document.

- [ ] **Step 3: Build the browse experience**

Provide entry points for First Year, Second Year, Third Year, Fourth Year, and Mathematics Foundations. Include subject search and filters for year level, subject family, classification, and content availability. Subject detail pages show the name, classification, typical placement if available, source note, content status, and curriculum-reference link.

- [ ] **Step 4: Add explicit empty and edge states**

An empty search returns a helpful no-results message and a way to clear filters. Subjects without published materials remain listed with `Coming soon` or `Content in preparation`. Long course titles must wrap on small screens. A specialized subject may be reachable from both its year placement and specialization category without creating duplicate catalog records.

- [ ] **Step 5: Verify the focused pass**

Run: `npm run test -- --run src/test/catalog.test.ts src/test/catalog-pages.test.tsx`  
Expected: data contract tests and page tests pass, including curriculum note visibility, link presence, search behavior, filter clearing, no-results behavior, and all four year-level routes.

- [ ] **Step 6: Run the integration checks and commit**

Run: `npm run lint && npm run test -- --run && npm run build`  
Expected: all catalog tests pass and the production build succeeds. Commit with message: `feat: add curriculum-aware CE subject catalog`.

---

## Task 4: Add one reviewed learning slice and a basic practice flow

**Initial topic recommendation:** Basic Algebra, because it is explicitly included in the approved Mathematics Foundations catalog. Confirm the initial topic and the number of questions before authoring content; this plan recommends a small set of 8-12 original questions rather than trying to populate every subject immediately.

**Files (proposed):**
- Create: `src/types/study-content.ts`
- Create: `src/data/math-foundations/basic-algebra.ts`
- Create: `src/components/PracticeQuestion.tsx`
- Create: `src/components/SolutionSteps.tsx`
- Create: `src/pages/PracticePage.tsx`
- Create: `src/test/practice-content.test.ts`
- Create: `src/test/practice-flow.test.tsx`
- Modify: `src/pages/MathFoundationsPage.tsx`
- Modify: `src/pages/SubjectPage.tsx`

**Interfaces:**
- Produces a `PracticeQuestion` record with stable `id`, `subjectId`, `topic`, `prompt`, optional answer choices, correct answer, ordered solution steps, short explanation, source note, and material status.
- Material statuses: `draft`, `needs-review`, `verified`, `published`, `correction-required`, and `retired`.
- The student-facing practice page consumes only items marked `published`. A status of `verified` alone is not the same as publication.
- The first practice session is in-memory only. It does not require sign-in and does not claim to save progress between devices or sessions.

- [ ] **Step 1: Add failing data and flow tests**

Cover correct and incorrect answers, retrying or moving to the next question, displaying worked steps after submission, an empty published question set, and exclusion of material in draft, review, correction-required, or retired status from the student view.

- [ ] **Step 2: Create the content model and original question set**

Draft 8-12 original Basic Algebra questions with calculations and worked steps. Record material status and source/review notes. The author must independently recalculate the answer and each solution step. Until a human review gate is completed, items remain `needs-review` and are not released as published.

- [ ] **Step 3: Implement the practice flow**

Students can open a practice set, answer a question, submit an answer, see whether the answer is correct, read the solution steps, and move through the set. Avoid AI-generated answers in the live app. Do not claim a student's progress is saved after leaving the page.

- [ ] **Step 4: Enforce the content publication gate**

A material item can become `published` only after its correctness and attribution have been checked. If a reported mistake invalidates an item, it must be removed from the published set or marked `correction-required` until fixed and reviewed. Do not auto-promote content based on its being present in the repository.

- [ ] **Step 5: Verify the focused pass**

Run: `npm run test -- --run src/test/practice-content.test.ts src/test/practice-flow.test.tsx`  
Expected: answer feedback and solution steps behave correctly; unpublished material is not exposed; an empty set displays a clear explanation rather than a broken page.

- [ ] **Step 6: Run the integration checks and commit**

Run: `npm run lint && npm run test -- --run && npm run build`  
Expected: all tests pass and the production build succeeds. Commit with message: `feat: add reviewed foundational practice flow`.

---

## Task 5: Add automated checks and prepare the live preview

**Files (proposed):**
- Create: `.github/workflows/ci.yml`
- Create: `docs/deployment/cloudflare-pages.md`
- Modify: `README.md`
- Modify: `.gitignore` only if the approved stack introduces additional generated files.

**Interfaces:**
- CI consumes the package scripts `npm run lint`, `npm run test -- --run`, and `npm run build`.
- Cloudflare Pages consumes the GitHub repository, production branch `main`, build command `npm run build`, and output directory `dist`.

- [ ] **Step 1: Add workflow checks**

Configure GitHub Actions to run on pushes and pull requests. Use a supported Node.js LTS version, install dependencies with `npm ci`, then run lint, tests, and production build. Grant read-only repository permissions unless another permission has a documented need. Do not expose secrets to workflows triggered by external pull requests.

- [ ] **Step 2: Add deployment instructions**

Document Cloudflare Pages project setup through its dashboard, connecting the GitHub repository and selecting `main` as the production branch. The expected build command is `npm run build`, and the build output directory is `dist`. Preview deployments should be used before promoting changes to production.

- [ ] **Step 3: Verify CI behavior**

Push or open a pull request with a harmless test change. Expected: the workflow installs dependencies deterministically, reports lint and test results, and fails the check when a test intentionally fails. Restore the test before merging.

- [ ] **Step 4: Verify the production build**

Run in CI: `npm ci && npm run lint && npm run test -- --run && npm run build`  
Expected: all commands succeed; the artifact in `dist/` contains the built application and static assets.

- [ ] **Step 5: Check live-preview acceptance criteria**

After Cloudflare Pages is connected, open the generated preview URL on a phone-sized viewport and a desktop viewport. Verify navigation, search, curriculum notice and official link, year-level organization, specialization labels, coming-soon states, practice flow, keyboard focus, and no horizontal page overflow.

- [ ] **Step 6: Commit the passing deliverable**

Commit with message: `ci: test CEStudy and document preview deployment`. Do not add API secrets or credentials to the repository.

---

## MVP acceptance criteria

The first version is ready for a small student pilot when:

- Students can navigate all four year levels and the Mathematics Foundations section.
- All five specialization categories are present and browsable.
- The CHED curriculum note and official reference link are easy to find.
- It is clear that typical subject placement may differ by university.
- Subjects without published materials remain discoverable with honest status labels.
- One small foundational practice set works from start to finish with checked answer feedback and step-by-step explanations.
- Unreviewed content is not exposed as published material.
- The app works at a 320 px viewport width without horizontal page overflow.
- Automated lint, test, and production-build checks pass.
- A preview deployment is tested before the app is described as live or production-ready.

## Explicitly deferred

- Accounts and password recovery.
- Persistent cross-device progress, bookmarks, and analytics tied to individual students.
- Supabase database and storage.
- AI tutoring, AI-generated questions, or API calls that require a secret.
- User-submitted content, moderation dashboards, and public authoring.
- Payments and subscriptions.
- Native Android/iOS apps.
- Bulk entry of high-quality content into every subject.

## Open decisions before implementation

1. **Architecture:** approve the recommended React + TypeScript + Vite + Cloudflare Pages baseline, or request a revised comparison before code is scaffolded.
2. **Initial learning slice:** confirm Basic Algebra as the first practice module or name another foundation topic.
3. **Practice-set size:** approve the recommended 8-12 questions or choose a different initial count.
4. **Content review:** identify who performs the final human check before practice items move from `needs-review` to `published`. Until this is decided, seed material must remain unpublished.
5. **Deployment access:** confirm that the user can connect the public GitHub repository to Cloudflare Pages through the Cloudflare dashboard. No credentials should be shared in chat.

## Reference links

- Approved catalog design: `docs/specs/2026-10-14-subject-catalog-design.md`
- Project scope: `docs/PROJECT_SCOPE.md`
- Cloudflare React-to-Pages guide: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Supabase plan and usage details (relevant only if a backend is introduced later): https://supabase.com/docs/guides/platform/billing-on-supabase
