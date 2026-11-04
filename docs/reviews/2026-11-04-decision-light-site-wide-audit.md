# CEStudy Decision-Light Design: site-wide UX audit

**Audit date:** 2026-11-04  
**Repository baseline:** \`main\` after PR #77, merge commit \`b8e0a2843325f4b940e30e4b29b3890282ca0dac\`  
**Standard:** [Decision-Light Design standard](../specs/UX_UI_DESIGN_SYSTEM.md#decision-light-design-standard-binding), approved and merged through [PR #77](https://github.com/justryan-n2d/CEStudy/pull/77)  
**Audit status:** Source-level review completed across all 21 registered route patterns. Live visual, keyboard, touch and student usability validation remains outstanding.  
**Scope:** Audit only. No application files, UI behavior, tests, database state, access policies, authentication, content publication or production configuration were changed.

## 1. Executive assessment

The source review found that CEStudy already applies several good decision-light patterns: the catalog keeps advanced filters collapsed until requested; subject cards have one destination; question answers remain genuine peer choices; the practice question has one primary submit/next action in each question state; and recoverable unavailable states prioritize Retry.

The main remaining friction is not that the website offers too many educational choices. It is that some navigation choices lead to features that are not yet usable, a few screens give the wrong action priority, and some utility or repeated navigation controls occupy space without helping the current task.

**Four confirmed issues should be resolved or explicitly accepted before Phase 4:**

1. Planned resource, exam and community destinations are still exposed as active global navigation choices even though their pages are launch placeholders.
2. A completed lesson can display two primary-styled actions at once: Mark as incomplete and Next topic / Practice problems.
3. The current empty Practice page has only one useful exit action, but it is styled as secondary.
4. The Mock Exam Portal links to the current Practice page even though that page presently has no published questions, creating a known dead-end route.

Additional improvements concern the persistent theme toggle, repeated unavailable resource categories, duplicate year navigation, optional bug-report fields, and the conditional PayPal setup state. These are documented below.

This audit does **not** recommend hiding real answer choices, reducing the four year-level choices, removing meaningful engineering alternatives, or concealing frequently used study tools. Those are genuine task choices and must remain available.

## 2. Method and evidence limits

### Inspected

- All route declarations in [src/App.tsx](../../src/App.tsx).
- The global shell and desktop/mobile navigation in [src/components/Layout.tsx](../../src/components/Layout.tsx).
- Every route page component registered by App.tsx.
- Relevant shared components: catalog filters, subject cards, year-level grid/dropdown, Review Materials menu, theme toggle, practice question, learning-streak badge, connection notice and unavailable state.
- Button hierarchy and responsive rules in [src/styles/global.css](../../src/styles/global.css).
- Existing browser smoke coverage in [scripts/theme-smoke.cjs](../../scripts/theme-smoke.cjs) and [scripts/live-smoke.cjs](../../scripts/live-smoke.cjs).
- The repository's recorded Phase 3 integration and current content-publication status.

### Coverage

App.tsx registers **21 explicit route patterns**, including both Study route patterns, plus a wildcard fallback. This source audit reviewed all 21 patterns and their page components.

Existing automation is useful but is not a complete site-wide UX audit:

- The theme smoke suite exercises 13 route patterns across 320, 390, 768, 1024 and 1440 CSS-pixel widths in both themes.
- The live smoke suite checks a smaller set of route headings, catalog behavior, mobile quick navigation, selected support links and practice state.
- The existing test suite is not evidence that every owner-only page, every parameter value, every conditional state, or every task flow has been manually reviewed.

### Limitations

The connected browser context was unavailable in this session, and the public CEStudy site could not be opened through the available browser retrieval path. I therefore did not inspect the live DOM visually, click through the live pages, verify the current production environment variables, or test a physical phone, keyboard-only flow, screen reader or touch target.

Findings below are classified as:

- **Confirmed from source:** the relevant control, route or state is explicitly present in the current source.
- **Conditional:** the issue depends on a runtime configuration or actual content state that could not be verified here.
- **Needs visual/usability validation:** source suggests a friction point, but actual impact must be checked with rendered screens or students.

The report does not claim that a code-level review is equivalent to a live visual audit.

## 3. Prioritized findings

### DL-01 - Unavailable destinations occupy active global navigation

**Priority:** P1 - owner decision required before Phase 4  
**Confidence:** High for the route state; medium for the final navigation treatment.

The desktop main navigation exposes Review Materials Hub, Mock Exam Portal and Community Forum. The mobile More menu also exposes all three under Resources. Each destination currently leads to a placeholder:

- Review Materials lists Formula Sheets, Problem Sets with Solutions and Video Tutorials as unavailable.
- Mock Exam Portal explicitly says exam sessions are not available and that the page is a navigation placeholder.
- Community Forum explicitly says discussions are not open and that posting, replies, editing, reporting and moderation are unavailable.

These pages are honest about their status, which is good. However, a student is still asked to choose among three primary navigation destinations that do not yet provide a usable study task. The labels consume high-value navigation space without helping the student complete the current job.

**Recommendation:** Hide these three destinations from the active desktop primary navigation and mobile Resources menu until each destination offers at least one meaningful, available student task. Keep the routes and roadmap plans intact. Reintroduce each navigation entry when its feature has reviewed, published content or a functional workflow. Do not present a disabled-looking control as active navigation.

**Approval boundary:** This revisits the previously approved navigation information architecture. The new Decision-Light standard is binding, but the exact removal/replacement of these top-level entries should be owner-approved before application changes.

Evidence: [Layout.tsx](../../src/components/Layout.tsx#L159-L225), [ReviewMaterialsMegaMenu.tsx](../../src/components/ReviewMaterialsMegaMenu.tsx#L12-L83), [ReviewMaterialsPage.tsx](../../src/pages/ReviewMaterialsPage.tsx#L12-L50), [MockExamPortalPage.tsx](../../src/pages/MockExamPortalPage.tsx#L1-L23), [CommunityPage.tsx](../../src/pages/CommunityPage.tsx#L1-L25).

### DL-02 - Completed lesson can show two primary-styled actions

**Priority:** P1 - correct before Phase 4  
**Confidence:** High; directly confirmed by component state logic.

On the Study page, the completion button changes to primary styling when the lesson is complete. The next-topic or practice-problems link is also primary. A student who has completed a lesson therefore sees two primary-styled actions in the same lesson workflow:

- Mark as incomplete
- Next topic / Practice problems

Mark as incomplete is a reversible correction to local progress. It should not compete with the forward learning action.

**Recommendation:** Keep Mark as complete / Mark as incomplete in secondary or quiet styling in both states. Reserve primary emphasis for Next topic or Practice problems. Keep the undo action accessible and clearly labelled.

Evidence: [StudyPage.tsx](../../src/pages/StudyPage.tsx#L140-L156).

### DL-03 - The only Practice empty-state action is styled as secondary

**Priority:** P1 - small fix before Phase 4  
**Confidence:** High; directly confirmed by source.

When no published questions are available, the Practice page shows “Questions coming soon” and one useful action: Browse subjects. It is styled as button-secondary even though it is the only action that moves the student to another useful study destination.

The repository status records that the current practice questions have not been published. The empty state is therefore a real, likely-to-be-seen state, not an edge case.

**Recommendation:** Promote Browse subjects to the primary action in this empty state. Do not add another button merely to create a second choice. Keep the unpublished-content gate and its honest message.

Evidence: [PracticePage.tsx](../../src/pages/PracticePage.tsx#L57-L80), [PROJECT_STATUS.md](../PROJECT_STATUS.md).

### DL-04 - Mock Exam Portal offers a link to a known empty Practice page

**Priority:** P1 - remove the dead-end route before Phase 4  
**Confidence:** High for the current source/content state.

The Mock Exam Portal correctly states that no exam sessions are available. It offers Browse subjects as the primary action and Open current practice page as a secondary action. The latter leads to /practice/basic-algebra, whose current empty state says questions are coming soon and only offers Browse subjects.

This adds an unnecessary navigation step without creating a meaningful alternative task.

**Recommendation:** Remove or conditionally hide Open current practice page until the destination contains at least one published question or usable practice activity. Re-add it only when the student can actually practice.

Evidence: [MockExamPortalPage.tsx](../../src/pages/MockExamPortalPage.tsx#L1-L23), [PracticePage.tsx](../../src/pages/PracticePage.tsx#L57-L80).

### DL-05 - Theme selection remains permanently visible in the global header

**Priority:** P2 - navigation simplification recommendation  
**Confidence:** High for placement; usability impact still needs validation.

ThemeToggle is rendered in the shared header on every route. It exposes Light and Dark as two persistent controls, although changing theme is a preference action rather than the student's primary task on most screens. The toggle itself has accessible labels and 44px minimum targets, which must be preserved.

**Recommendation:** Move the Light/Dark control into a clearly labelled More or Preferences menu instead of showing both options persistently in the global header. Preserve the explicit two-choice Light/Dark control, current selection indication, keyboard access, accessible names and 44px targets. Do not add a System theme option.

This is a placement recommendation only. It does not reverse the approved Light/Dark feature decision.

Evidence: [Layout.tsx](../../src/components/Layout.tsx#L185-L205), [ThemeToggle.tsx](../../src/components/ThemeToggle.tsx#L1-L36), [global.css](../../src/styles/global.css#L939-L1007).

### DL-06 - Review Materials repeats unavailable choices and repeated status copy

**Priority:** P2 - simplify until content is ready  
**Confidence:** High; directly confirmed by source.

The Review Materials page renders three category cards, each labelled Not available yet, and repeats the same availability/download explanation. The mega-menu also renders three Coming soon cards, each with a View section link, plus Browse all review materials. All these links lead to the same unavailable destination rather than to an available resource.

The three categories describe legitimate future resource types, but they are not currently selectable student tasks.

**Recommendation:** Until at least one resource is published, use one concise page-level availability state. Mention the planned resource types once in supporting text if that helps set expectations. Keep Browse Subject Catalog as the one primary useful destination. Remove the three View section links and repeated unavailable cards. When resources become available, show only the categories that contain real, reviewed resources.

Evidence: [ReviewMaterialsPage.tsx](../../src/pages/ReviewMaterialsPage.tsx#L12-L50), [ReviewMaterialsMegaMenu.tsx](../../src/components/ReviewMaterialsMegaMenu.tsx#L12-L83).

### DL-07 - Home page duplicates the complete Year Levels choice set

**Priority:** P2 - low-risk cleanup  
**Confidence:** High; directly confirmed by source.

The home page shows a View all years link beside Explore by year and then renders YearLevelGrid. YearLevelGrid already displays all four choices: First year, Second year, Third year and Fourth year. The View all years link therefore duplicates a route into the same choice set immediately beside the four direct links.

**Recommendation:** Remove View all years from this specific section, or change it only if it is given a distinct purpose that the four year cards do not already satisfy. Keep all four year-level choices; they are genuine peer choices, not unnecessary options.

Evidence: [HomePage.tsx](../../src/pages/HomePage.tsx#L44-L48), [YearLevelGrid.tsx](../../src/components/YearLevelGrid.tsx#L3-L20).

### DL-08 - Optional bug-report context is always expanded in the form

**Priority:** P3 - improvement candidate; validate before changing  
**Confidence:** Medium; visual impact not checked.

The Bug Report form correctly requires a short summary and description of what happened. It also displays Page or feature, What did you expect? and Steps to reproduce inline, although those three fields are optional.

**Recommendation:** Keep the two required fields visible. Consider placing the three optional context fields under a single labelled disclosure such as Add details (optional). This can make the initial form shorter without losing useful diagnostic context. Do not make steps-to-reproduce mandatory, and do not hide the required description.

Evidence: [BugReportsPage.tsx](../../src/pages/BugReportsPage.tsx#L58-L103).

### DL-09 - PayPal can open a configuration dead end

**Priority:** P2 if PayPal is not configured; otherwise no finding  
**Confidence:** Conditional; runtime environment was not inspected.

The Support page always renders a View PayPal details button. If VITE_PAYPAL_SUPPORT_URL is absent or invalid, opening it displays a not-configured message, while the optional note and confirmation controls remain present and the Complete action is disabled.

If the production build does not configure PayPal, the student can select an option that cannot complete.

**Recommendation:** Verify the current production configuration. If PayPal is not configured, mark the method unavailable in the selection surface or do not expose it as a selectable payment method. Do not open a modal that contains unusable confirmation fields. If it is configured, retain PayPal as a genuine peer payment-method choice.

Evidence: [SupportPage.tsx](../../src/pages/SupportPage.tsx#L29-L56), [SupportPage.tsx](../../src/pages/SupportPage.tsx#L86-L145).

### DL-10 - Year-level dropdown repeats Subject Catalog navigation

**Priority:** P3 - optional cleanup  
**Confidence:** High for duplication; usefulness should be checked in interaction testing.

The Year Levels dropdown already sits beside a direct Subject Catalog link in desktop navigation. Its own footer also contains Subject Catalog and Math Foundations links. The Subject Catalog destination is therefore repeated inside the dropdown, even though the dropdown's main purpose is to browse year, semester and subject.

**Recommendation:** Consider removing the duplicate Subject Catalog link from this menu footer. Retain Math Foundations if student task observation shows that it is a useful prerequisite path from year-level browsing.

Evidence: [Layout.tsx](../../src/components/Layout.tsx#L159-L184), [YearLevelDropdown.tsx](../../src/components/YearLevelDropdown.tsx#L107-L170).

## 4. Route-by-route audit matrix

| Route pattern | Audit result | Notes |
|---|---|---|
| / | Needs minor cleanup | One clear hero primary action. Remove the duplicate View all years link (DL-07). |
| /about | Acceptable | Send feedback is primary; Report a bug and Contact are secondary, distinct intents. |
| /privacy | Acceptable | Contact is primary and Send feedback is secondary. Both are relevant privacy follow-up paths. |
| /review-materials | P2 | Three unavailable cards and repeated messages; simplify until reviewed resources exist (DL-06). |
| /mock-exam-portal | P1 | Secondary Practice link points to the current empty practice state (DL-04). |
| /community | Acceptable page state; navigation issue | The page clearly says discussions are not open and provides one relevant feedback action. Its global navigation exposure is covered by DL-01. |
| /catalog | Good pattern | Search is immediately available; four advanced filters are collapsed under Filters, with an active-filter count and conditional clear control. |
| /years | Good pattern | Four year levels are genuine, mutually exclusive destinations. Keep all four visible. |
| /year/:year | Good pattern | Semesters group related subjects; subjects remain peer destinations. |
| /math-foundations | Good pattern | Focused subject list. No unnecessary filter panel or competing CTA identified in source. |
| /subjects/:slug | Acceptable | Basic Algebra has one Open reviewer primary action. Other subject pages communicate availability and curriculum metadata; do not invent an action when content is not published. |
| /study/:slug | P1 state-specific | On an active completed lesson, completion undo and forward navigation both receive primary styling (DL-02). |
| /study/:slug/:unit | P1 state-specific | Same Study component and completion-state issue as above (DL-02). |
| /progress | Good pattern | Empty state has one primary Browse the library action; Clear progress appears only when there is activity to clear. |
| /practice/basic-algebra | P1 | Current no-question state has one useful action, Browse subjects, styled as secondary (DL-03). |
| /owner/content-review | Acceptable workflow hierarchy | Private unlock has one primary action. Review actions are state-dependent, with Verify/Publish primary and alternate outcomes secondary. Keep the confirmation and publication safeguards. |
| /contact | Acceptable directory | Email, Support, Bug report and Feedback represent different contact intents. Do not collapse them without student evidence. |
| /support | Conditional | GCash and PayPal are genuine peer methods. Verify method configuration and avoid selectable dead ends (DL-09). |
| /bug-reports | P3 | Required summary and observed behavior are appropriate; optional context may be progressively disclosed (DL-08). |
| /feedback | Good pattern | One category selector, one message field and one submit action. Categories are classification options, not competing primary buttons. |
| /feedbacks | Acceptable owner tool | Private unlock has one primary action. Refresh, Lock and message-level actions are utilities or contextual actions. |
| * (fallback) | Acceptable | Unknown paths return to Home. |

## 5. Patterns to preserve

Do not apply Hick-Hyman Law as a raw button-count rule. The following existing patterns are appropriate and should be retained:

- **Catalog filtering:** search remains visible; the four filters are disclosed only when requested. This is a strong progressive-disclosure pattern.
- **Year selection:** first through fourth year are four genuine peer choices. Do not hide three just to reduce the number of visible choices.
- **Subject cards:** each card has one destination and communicates content availability. Avoid adding a second action inside each card.
- **Practice answers:** answer options are the task itself. Keep them equally legible and selectable. Check answer is the primary action before submission; Next question is primary after feedback.
- **Study topic navigation:** topic search stays available and the topic list can be collapsed while a lesson is open. Keep a discoverable way to reopen it.
- **Recovery states:** the shared unavailable component prioritizes Retry and places an optional return link below it. Preserve this hierarchy.
- **Owner content review:** review outcomes vary by item state. Keep the current state-specific safeguards, confirmation before publishing, and distinction between primary and alternate outcomes.
- **Contact and support choices:** contact intents and payment methods are genuine alternatives. Do not arbitrarily hide or demote one when the user is intentionally choosing between them.

## 6. Recommended correction order

1. Resolve the owner decision on unavailable global navigation destinations (DL-01).
2. Correct the Study completed-state hierarchy, Practice empty-state button priority, and Mock Exam dead-end link (DL-02, DL-03, DL-04).
3. Decide the theme-toggle placement while retaining the approved Light/Dark behavior (DL-05).
4. Simplify the unavailable Review Materials page/menu and remove the duplicate year/catalog links (DL-06, DL-07, DL-10).
5. Verify PayPal runtime configuration and decide whether to progressively disclose optional bug-report fields (DL-08, DL-09).
6. Implement only owner-approved corrections in a separate, focused change set. Re-run relevant tests and the theme/live browser smoke suite.

## 7. Phase 4 gate and audit status

**Source-level Decision-Light review:** Complete across all 21 registered route patterns.

**Visual and live interaction audit:** Not complete. The current environment did not provide an attached browser context or a usable live-site page. No claim is made about the appearance of every route at runtime, physical phone behavior, screen-reader interaction or student retention.

**Owner triage:** Pending. DL-01 changes previously approved global navigation and requires an explicit decision. The remaining findings should be accepted, rejected or prioritized before implementation.

**Phase 4:** Remains not started. Do not begin Practice Workspace implementation until the P1 findings have been triaged, the required visual/browser verification is completed, and the owner approves the resulting Phase 4 entry baseline.

A reduction in choices is a design hypothesis, not proof of improved retention. After corrections, test representative student tasks and measure completion, time on task, errors/recovery and secondary-tool discoverability. Do not claim a retention lift without longitudinal student evidence.
