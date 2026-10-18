# CEStudy Learning Model Decision

**Status:** Locked product direction  
**Decision date:** 2026-10-18  
**Applies to:** CEStudy web app and future mobile clients

## Decision

CEStudy will combine a comprehensive, freely browsable Civil Engineering knowledge library with optional guided learning paths and personal progress tracking. Students must be able to explore content on their own or choose a more structured route. Guided learning must never be required to access the library.

## Experience principles

1. **Free browsing first-class:** Students can explore the subject catalog, year levels, math foundations, topics, formulas, and worked examples without enrolling in a path.
2. **Guided learning is optional:** Published lessons can be followed in a suggested sequence with previous/next navigation, practice activities where available, and clear content availability states.
3. **Progress is useful, not intrusive:** Students can mark published lessons complete, resume work, and view what they have completed. Do not invent completion percentages for lessons or subjects that have no published content.
4. **Content trust comes first:** Only lessons returned by the published-content API may be read and marked complete. Unreviewed questions and draft lessons remain hidden. Original explanations and illustrations require technical review and appropriate sourcing.
5. **Mobile-first and future-ready:** Keep the React + TypeScript + Vite + Tailwind frontend and Supabase backend. Build responsive behavior that can support future Android/iOS clients without duplicating learning rules.

## Incremental implementation plan

### 0. Preserve release safety
- Continue the existing Phase 7 release gates, human content review, accessibility/device QA, and controlled student pilot.
- Use feature branches and pull requests with the existing lint, unit-test, build, database-security, and secret-scan checks.
- Do not interpret this product decision as approval for a broad public launch.

### 1. First implementation slice
- Add an optional local progress tracker for published lessons.
- Show a flame streak based on consecutive local calendar days on which the student completes at least one published lesson.
- Save only lesson ID, subject slug, unit number, title, completion timestamp, and local completion day in browser local storage.
- Provide a progress page with links back to completed lessons and a clear-all action.
- State plainly that progress is stored on this device and is not synced.
- Do not add sign-in, new Supabase tables, database writes, analytics, or cross-device tracking for this slice.

### 2. Strengthen guided learning
- Make subject-level learning sequences discoverable from the library and subject detail pages.
- Add learning objectives, worked examples, practice, and explanations when verified content is ready.
- Offer clear next/previous navigation while preserving free topic search and direct navigation.
- Recommend next steps only when suitable published content exists.

### 3. Expand the engineering knowledge library
- Fill out the BSCE subject map gradually across all four year levels.
- Organize original lessons by subject, topic, and prerequisite.
- Add accurate formulas, diagrams, worked examples, search, related topics, and source notes.
- Require technical/content review before content is labelled verified or published.

### 4. Improve personal study tools
- Consider bookmarks, review queues, and optional goals after the initial workflow is evaluated with students.
- Keep progress local by default until student research justifies account-based syncing.
- Before introducing accounts or synced progress, define data ownership, deletion, consent, RLS, recovery, and security tests.

### 5. Evaluate mobile apps later
- Keep the web learning model and content API independent of any single UI.
- Evaluate a shared React shell (for example, Capacitor) versus dedicated native interfaces only after web usage and pilot feedback support the investment.
- Offline lessons and store publication require separate UX, data, privacy, performance, and cost decisions.

## Acceptance criteria for the first slice

- Students can freely browse the existing library without creating an account.
- A student can mark a published lesson complete and reverse that action.
- The flame shows the number of consecutive active calendar days; multiple lessons on the same day count as one day.
- A streak completed yesterday remains current until today ends; a missed day resets the active streak to zero.
- The local date is stored separately from the timestamp to avoid UTC midnight shifting the activity day.
- The progress page displays only records saved in the current browser.
- Completed lesson links return to the correct subject and unit.
- Malformed local data does not crash the app.
- Clearing progress removes the local records after confirmation.
- No unpublished question or lesson content is exposed.
- Automated tests, lint, and production build pass.
- No account or server-side student-progress storage is introduced.

## Locked constraints

- Do not rebuild the existing website from scratch.
- Do not copy Mathalino or textbook content, illustrations, branding, or distinctive presentation. Use external references for research and make original learning material with citations.
- Do not add paid services or additional database infrastructure without a clear need and cost review.
- Keep native Android/iOS apps, student accounts, cross-device syncing, and student-facing AI as separate later decisions.
