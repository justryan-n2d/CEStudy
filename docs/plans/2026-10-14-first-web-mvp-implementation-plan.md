# CEStudy First Web MVP Implementation Plan

> **For agentic workers:** Use the host's available task-by-task implementation workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first useful, responsive CEStudy website with the full four-year BSCE subject catalog, transparent curriculum references, and one focused practice module whose material is reviewed before being labeled verified.

**Architecture:** The repository currently contains planning documentation and no application source or test setup. The user has approved a responsive React + TypeScript + Vite + Tailwind CSS web app, hosted on Cloudflare Pages, with Supabase as the main backend and GitHub for source control and automation. Supabase PostgreSQL will hold the subject catalog and published practice content from the first backend-enabled release. Every exposed table must have reviewed grants and RLS policies. The browser is untrusted; it receives only a publishable key, while writes and content publication remain restricted to trusted maintenance paths in the MVP.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, React Router, `@supabase/supabase-js`, Supabase PostgreSQL and RLS, Vitest, React Testing Library, Supabase database tests where practical, GitHub Actions, and Cloudflare Pages. User-facing AI, AI-generated questions, live AI API calls, account registration, cross-device progress, public submissions, and native Android/iOS apps are deferred. Supabase Auth and Storage should be added only when an approved feature needs them.

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
- Do not implement account registration, cloud-synced progress, public submissions, paid features, a student-facing AI tutor, AI-generated questions, or live AI API calls in this first version.
- Use AI tools during development or drafting only as assistants; independently check engineering calculations, explanations, and references before publishing content.
- The technology stack has been selected. Task 1 records the approved decision and its security boundaries; it is not a second approval gate.
- Proposed application file paths below are not present in the current repository; create them as implementation tasks require.

---

## Task 1: Record the approved web and backend architecture

**Files:**
- Create: `docs/decisions/0001-initial-web-architecture.md` (proposed)
- Reference: `docs/specs/2026-10-14-subject-catalog-design.md`
- Reference: `docs/PROJECT_SCOPE.md`

**Interfaces:**
- Consumes: approved subject catalog and project scope.
- Produces: a concise decision record reflecting the already-approved frontend, hosting, Supabase backend, security controls, testing approach, and deferred features.

- [ ] **Step 1: Compare the viable approaches**

Document these options and their trade-offs:
1. **Selected:** Vite + React + TypeScript + Tailwind CSS; Supabase PostgreSQL stores the subject catalog and published practice content, with RLS-controlled public reads and no client-side write permissions in the MVP; Cloudflare Pages deploys the web app from GitHub.
2. A static HTML/CSS/JavaScript app with local data. Fewer dependencies, but less aligned with the selected backend-driven catalog and content workflow.
3. A server-rendered full-stack framework plus database. More capability than the selected approach requires for this MVP and not chosen at this time.

- [ ] **Step 2: Evaluate against project constraints**

The decision record must summarize why the selected stack fits mobile usability, editing through GitHub, testing, accessibility, deployment, cost, data portability, and future expansion. State that service limits can change and must be rechecked before launch. Document that the Supabase publishable key is public by design and is safe only with correct grants and RLS; privileged keys must never reach the client.

- [ ] **Step 3: Record the decision and its boundaries**

Record Option 1 as already approved. Supabase PostgreSQL and RLS are part of the chosen architecture; Auth and Storage remain deferred until needed. Public content is maintained through reviewed migrations or trusted maintenance operations, not a public admin interface. No AI API key or live AI service is needed for the MVP. Do not reopen the stack decision unless the user requests a change.

- [ ] **Step 4: Verify the decision record**

Review the document against every evaluation criterion above. Expected result: one selected path, reasons for selection, deployment approach, known trade-offs, and explicit deferred features; no unresolved choice about which approach is being implemented.

- [ ] **Step 5: Review gate**

The user has approved the architecture. Proceed after the decision record is consistent with the current stack and security requirements.

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
- Create: `src/lib/supabase.ts`
- Create: `.env.example` (placeholders only; no real credentials)

**Interfaces:**
- Consumes: the approved architecture decision from Task 1.
- Produces: an accessible application shell, route outlet, reusable page layout, and working lint/test/build scripts.

- [ ] **Step 1: Add the initial smoke test**

Test that the application renders the CEStudy identity, primary navigation, and a main content landmark. Expected initial failure: the test cannot yet render the required shell.

- [ ] **Step 2: Create the smallest app shell**

Set up the agreed frontend stack and scripts named `dev`, `build`, `preview`, `test`, and `lint`. Add `@supabase/supabase-js` and a small client module configured from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. These values must be placeholders in `.env.example`; never put a secret/service-role key in a `VITE_` variable. Add a header, navigation, main region, and footer with semantic HTML. Use Tailwind CSS, responsive layouts, and visible keyboard focus states. Do not make protected write operations from the browser.

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

## Task 3: Create the Supabase schema, RLS policies, and seeded catalog

**Files (proposed):**
- Create: `supabase/config.toml` and migration(s), initialized using the Supabase CLI
- Create: `supabase/seed.sql` or an equivalent version-controlled seed file
- Create: `src/types/catalog.ts`
- Create: `src/data/catalog.ts` as a typed Supabase data-access layer
- Create: `src/components/CurriculumNotice.tsx`
- Create: `src/components/SubjectCard.tsx`
- Create: `src/components/CatalogFilters.tsx`
- Create: `src/pages/CatalogPage.tsx`
- Create: `src/pages/YearLevelPage.tsx`
- Create: `src/pages/MathFoundationsPage.tsx`
- Create: `src/pages/SubjectPage.tsx`
- Create: `src/test/catalog.test.ts`
- Create: `src/test/catalog-pages.test.tsx`
- Create: `src/test/security/catalog-rls.test.sql` or equivalent database tests
- Modify: `src/App.tsx`

**Interfaces:**
- Define typed `YearLevel = 1 | 2 | 3 | 4` and `CatalogSubject` records with stable ID/slug, title, category, classification, typical placement where applicable, optional specialization, source reference, and content availability.
- Store catalog subjects in Supabase PostgreSQL and use checked-in migrations/seed data as the source-controlled update path for the MVP.
- Subject classification values: `ched-common-course`, `ched-specialized-course`, `supplementary-math-foundation`, and `additional-ce-review-topic`.
- Subject availability values: `coming-soon`, `in-preparation`, and `has-published-content`.
- The typed data-access layer reads catalog records from Supabase; the client must not receive privileged credentials.
- Public catalog reads are intentional. Do not place private moderation notes or other non-public fields in tables readable by the `anon` role.

- [ ] **Step 1: Add failing catalog contract tests**

Test the catalog schema and policies. Confirm public users can read intended catalog entries, cannot insert/update/delete catalog records, and cannot access private/internal fields. Test expected denial cases using direct API/database requests, not only by hiding UI controls. Also verify seed data includes all four year levels, Mathematics Foundations, all five specialization areas, and appropriate CHED source notes.

- [ ] **Step 2: Add catalog metadata**

Initialize Supabase migrations using the documented CLI workflow. Create the subject/catalog schema and constraints; enable RLS on every exposed table; configure grants and explicit policies together. Public roles may select intentionally public catalog information only. Do not grant public insert, update, or delete access. Seed the catalog from the approved design document and preserve the distinction between common courses, specialized professional courses, supplementary math foundations, and additional CE review topics. Include the official CHED link and a note that course placement can vary by university. Preserve sample-semester placement only where it is given in the design document.

- [ ] **Step 3: Build the browse experience**

Provide entry points for First Year, Second Year, Third Year, Fourth Year, and Mathematics Foundations. Include subject search and filters for year level, subject family, classification, and content availability. Subject detail pages show the name, classification, typical placement if available, source note, content status, and curriculum-reference link.

- [ ] **Step 4: Add explicit empty and edge states**

An empty search returns a helpful no-results message and a way to clear filters. Subjects without published materials remain listed with `Coming soon` or `Content in preparation`. Long course titles must wrap on small screens. A specialized subject may be reachable from both its year placement and specialization category without creating duplicate catalog records.

- [ ] **Step 5: Verify the focused pass**

Run the catalog UI tests and Supabase database policy tests using the project’s documented local/test workflow.  
Expected: schema/seed checks pass; intended public SELECT requests succeed; anonymous writes and unauthorized access fail; page tests cover curriculum note visibility, link presence, search behavior, filter clearing, no-results behavior, and all four year-level routes.

- [ ] **Step 6: Run the integration checks and commit**

Run: `npm run lint && npm run test -- --run && npm run build`, plus the database security test command documented for the repository.  
Expected: UI tests pass, production build succeeds, and database policies deny unauthorized requests. Commit with message: `feat: add secure curriculum-aware CE subject catalog`.

---

## Task 4: Add one reviewed learning slice and a basic practice flow

**Initial topic recommendation:** Basic Algebra, because it is explicitly included in the approved Mathematics Foundations catalog. Confirm the initial topic and the number of questions before authoring content; this plan recommends a small set of 8-12 original questions rather than trying to populate every subject immediately.

**Files (proposed):**
- Create: `src/types/study-content.ts`
- Create: `src/data/math-foundations/basic-algebra.ts` as reviewed seed content for the Supabase question bank
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
- The first practice session does not require sign-in and does not save progress between devices or sessions. Published questions are retrieved from Supabase through public read policies; drafts and review-only questions must remain unavailable to public clients.

- [ ] **Step 1: Add failing data and flow tests**

Cover correct and incorrect answers, retrying or moving to the next question, displaying worked steps after submission, an empty published question set, and exclusion of material in draft, review, correction-required, or retired status from the student view.

- [ ] **Step 2: Create the content model and original question set**

Draft 8-12 original Basic Algebra questions with calculations and worked steps, then seed them through a reviewed migration/seed workflow. Record status and source/review notes. Independently recalculate each answer and solution step. Until a human review gate is complete, items remain `needs-review` and must not be visible through public queries or RLS policies.

- [ ] **Step 3: Implement the practice flow**

Students can open a practice set, answer a question, submit an answer, see whether the answer is correct, read the reviewed solution steps, and move through the set. There is no student-facing AI tutor, AI-generated question flow, or live AI API integration in this MVP. Do not claim a student's progress is saved after leaving the page.

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

Configure GitHub Actions to run on pushes and pull requests. Use a supported Node.js LTS version, install dependencies with `npm ci`, then run lint, UI tests, production build, and applicable database/RLS checks. Grant read-only repository permissions unless another permission has a documented need. Do not put Supabase secret/service-role credentials in client variables or CI logs; use protected secrets only for a documented trusted task, and do not expose them to untrusted pull-request workflows.

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

- Student-facing AI tutoring, AI-generated questions, and live AI API calls. Reconsider only after student testing demonstrates a meaningful need and the accuracy, privacy, security, and cost controls have been designed.
- Account registration, password recovery, and cross-device progress, bookmarks, or analytics tied to individual students.
- Supabase Auth and Storage unless a specifically approved MVP feature needs them. Supabase PostgreSQL and RLS are in scope for the catalog and published practice content.
- A public admin dashboard, user-submitted content, moderation dashboards, and public authoring. Initially, curated content is changed through reviewed migrations or trusted maintenance operations.
- Payments and subscriptions.
- Native Android/iOS apps.
- Bulk entry of high-quality content into every subject.

## Open decisions before implementation

1. **Initial learning slice:** confirm Basic Algebra as the first practice module or name another foundation topic.
2. **Practice-set size:** approve the recommended 8-12 questions or choose a different initial count.
3. **Content review:** identify who performs the final human check before practice items move from `needs-review` to `published`. Until this is decided, seed material must remain unpublished.
4. **Supabase project setup:** create or select the Supabase project and configure local/preview/production environment values through the dashboard. Do not share credentials in chat or commit real values.
5. **Deployment access:** connect the GitHub repository to Cloudflare Pages through the Cloudflare dashboard. No credentials should be shared in chat.

## Reference links

- Approved catalog design: `docs/specs/2026-10-14-subject-catalog-design.md`
- Project scope: `docs/PROJECT_SCOPE.md`
- Cloudflare React-to-Pages guide: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Supabase plan and usage details: https://supabase.com/docs/guides/platform/billing-on-supabase
- Supabase RLS guide: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase API security guide: https://supabase.com/docs/guides/api/securing-your-api
- Supabase production checklist: https://supabase.com/docs/guides/deployment/going-into-prod
