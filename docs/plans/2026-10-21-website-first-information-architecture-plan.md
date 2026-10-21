# CEStudy Website-First Information Architecture and Structure Plan

**Status:** Planning proposal; no application implementation authorized  
**Initially prepared at:** 2026-10-21T18:53:21+08:00 (Asia/Manila)  
**Last revised at:** 2026-10-21T19:10:04+08:00 (Asia/Manila)  
**Repository:** [justryan-n2d/CEStudy](https://github.com/justryan-n2d/CEStudy)  
**Main baseline commit:** `e6f657cbbf94467e427fc6183c9714e965098598`  
**PR #44 head reviewed:** `662e413601cef93100534b8be52f1a76fe35b335` (open, draft, not merged)  
**Related specification:** [UX/UI Design System](../specs/UX_UI_DESIGN_SYSTEM.md)


## 1. Executive summary

CEStudy follows a website-first, not mobile-first, design strategy. The website's desktop information architecture and primary workflows are planned first; tablet and phone browser layouts are adapted from that structure afterward. The future native mobile app will have a separately designed interaction model.

The owner's requested target for website navigation is:
- Year-Level dropdown: 1st, 2nd, 3rd, and 4th year, each expanding into semesters and the individual subjects within each semester.
- Review Materials Hub mega-menu: Formula Sheets, Problem Sets with Solutions, and Video Tutorials.
- Mock Exam Portal: timed quizzes, properly sourced and reuse-approved past board exam questions, and performance analytics based on actual attempt history.
- Student Dashboard: a private signed-in area for progress, evidence-backed weak-subject insights, and bookmarked questions.
- Community Forum: peer discussion boards for difficult problems and collaborative solution discussions.

The future mobile app has five requested tabs:
1. Home: daily review question, quick access to study streaks, and recently opened modules.
2. Subjects / Library: year/subject catalog, structured reading, and approved reviewer PDFs for offline use.
3. Practice: flashcards, customizable timed quizzes, and Shuffled Practice.
4. Calculator / Tools: unit converters first, then verified steel-section references and carefully bounded concrete-learning tools.
5. Profile: transparent readiness evidence, saved/bookmarked formulas, and settings.

Three cross-cutting capabilities are must-have product requirements: Offline Access, LaTeX/equation rendering, and a Dark Mode toggle. Offline Access must distinguish app-shell caching from deliberate resource downloads and downloaded interactive mock-test packs. Equation support should build on the existing KaTeX dependency, while verifying actual rendering and accessibility on each supported surface. Dark Mode should reuse semantic tokens rather than create a separate page-by-page theme.

This is a product/design specification, not implementation authorization. The requested navigation is the design target. Curriculum mapping, educational content quality, past-exam content rights, readiness calculations, download behavior, and security requirements remain evidence and approval gates.

## 2. Source baseline and evidence boundary

### Main branch

The latest PR metadata identifies main's base commit as `e6f657cbbf94467e427fc6183c9714e965098598`. The inspected main-branch `src/App.tsx` has routes for Home, About, Privacy, Catalog, Year Levels, individual year pages, Math Foundations, Subjects, Study, Progress, the existing Basic Algebra practice route, owner content review, Contact, Support, bug reports, Feedback, and the feedback inbox. The main-branch `src/components/Layout.tsx` owns the global header, desktop links, responsive/More navigation behavior, and footer.

The shared design-system specification currently describes a compact top navigation and a four-item mobile quick-navigation pattern for Home, Subjects, Years, and Math, with a More menu for secondary destinations. This is documented as the current website pattern, not a requirement to preserve it unchanged.

### PR #44 draft branch

PR #44 is open and draft, with head `662e413601cef93100534b8be52f1a76fe35b335`. It adds optional Google sign-in and routes/pages for Profile, Login, History, Streak, Menu, and Community, along with related local progress and appearance behavior. Its layout uses a five-destination mobile navigation pattern that includes Menu, plus account and streak elements in the header. These changes are **not merged into main** and must not be described as current production functionality.

The documented PR preview alias is [feature-google-auth-streak-g-2k99.cestudy.pages.dev](https://feature-google-auth-streak-g-2k99.cestudy.pages.dev). An independent open attempt on 2026-10-21 did not return accessible page content, so the preview's live appearance and exact deployed-commit correspondence were not verified in this planning pass. Before any visual baseline audit, verify the deployment commit and inspect the preview with a working browser.

### Existing architecture observed

- Stack in repository documentation: React, TypeScript, Vite, Tailwind CSS, React Router, Supabase, and Cloudflare Pages.
- Current UI styles include shared brand and semantic colors in `src/styles/global.css`; the design specification defines the established CEStudy logo, typography, theme, and component patterns.
- Main currently has a focused desktop header and a larger secondary destination set in page/footer navigation. PR #44 changes account and navigation affordances on its own branch.
- Existing progress and history direction is substantially device-local. Do not assume cross-device saved attempts, synchronized profile preferences, or server-backed readiness data exists.
- The project status and roadmap identify content review, publication, and release gates as independent constraints. The new information architecture does not imply approval to publish unreviewed lessons or questions.

**Verified:** the repository paths and route registrations inspected at the commits named above.  
**Unverified:** the live visual state of the PR preview, the latest physical-device behavior, and the current state of every Supabase schema/policy. These must be rechecked before related implementation work.

## 3. Product goals and design constraints

1. Website-first: decide the website's navigation and desktop workflows before responsive adaptation.
2. Preserve CEStudy's existing visual identity and design tokens. This plan changes the intended structural approach, not the brand palette or logo.
3. Do not equate a responsive website with the future mobile app. The website remains usable on phones, while the native app gets its own later interaction design.
4. Keep Subjects/Learn, Practice, and Tools discoverable. Practice has highest feature priority; Tools starts with the unit converter; Profile builds on existing progress and account behavior.
5. Avoid duplicate destinations. Profile summarizes personal learning and links to focused History/Progress/Streak views rather than cloning their entire contents.
6. Preserve public-library access and existing authentication/security boundaries. Hiding an action in the UI is not access control.
7. Keep each future implementation slice reviewable and separate from PR #44, which retains its current OAuth/release gates.
8. Do not implement proposed features until the relevant plan and acceptance criteria receive explicit approval.


## 4. Information-architecture alternatives

The user's requested navigation is now the target to develop. The comparison below concerns presentation, not a choice to replace the requested destinations.

| Alternative | Model | Advantages | Trade-offs | Assessment |
|---|---|---|---|---|
| A. Flat top-level links | Put every destination and subcategory in a single header | Direct access | Semester and material hierarchies become unwieldy; long labels crowd the header | Do not use as a fully flat menu |
| B. Persistent desktop sidebar | Sidebar groups learning, materials, exams, community, and personal dashboard | Scales for dense workflows | Takes space from lesson reading and technical reference tables; can make the public library feel like an admin app | Keep as a possible dashboard/workspace layout only |
| C. Requested hybrid navigation | Year-Level dropdown, Review Materials mega-menu, direct Mock Exam Portal and Community Forum entries, private Dashboard/account control | Matches the requested mental model and keeps key areas discoverable | Requires accessible nested-menu behavior and a dedicated responsive adaptation | Recommended target for desktop design |

### Target website navigation

1. **Year-Level dropdown**
   - Show 1st, 2nd, 3rd, and 4th year.
   - Expanding a year reveals its semester groups; selecting a semester reveals individual subjects.
   - Use verified curriculum/content metadata. Do not assume a semester field or complete mapping exists in the current schema.
   - Support mouse, keyboard, and touch. The interaction must not depend on hover alone.

2. **Review Materials Hub mega-menu**
   - Formula Sheets.
   - Problem Sets with Solutions.
   - Video Tutorials.
   - Only show real resources and truthful publication/review status. Include source/version and download availability when relevant.
   - Provide a clear destination to browse all resources within each group.

3. **Mock Exam Portal**
   - Quick access to timed quizzes, approved question sets, past board exam questions only when sourced and lawful reuse is confirmed, and performance analytics from real attempts.
   - Do not label the site an official board exam simulator without verified format, scope, coverage, and validation.

4. **Student Dashboard**
   - A private area available only to signed-in students; guests see a sign-in entry and can continue browsing public materials.
   - Show progress, bookmarked questions, and weak-subject/topic signals only where sufficient reviewed question data and attempt evidence exist.
   - Enforce privacy at the data/API boundary, not by hiding links.

5. **Community Forum**
   - One canonical student discussion destination for difficult problems and collaborative solution threads.
   - Decide whether reading is public/searchable and participation requires an account. Define moderation, reporting, author identity, privacy, and equation rendering before opening posting.
   - A route or placeholder page is not proof of a complete forum.

### Avoid duplicate destinations

The Student Dashboard is the website's personal hub. Do not create competing top-level Profile and Dashboard destinations unless research proves they serve distinct needs. Focused Progress, History, and attempt-review pages may remain separate, but should be linked from the Dashboard rather than copied into it. Formula and question bookmarks may share one saved-items area with clear categories.


## 5. Proposed sitemap and page hierarchy

This is the target structure for planning; it is not a list of shipped routes.

- **Home:** links to Year Levels, Review Materials, Mock Exams, and Tools; personalized continue-learning content appears only when real eligible history exists.
- **Year-Level dropdown:** 1st Year, 2nd Year, 3rd Year, 4th Year, each containing semesters and individual subjects.
- **Review Materials Hub:** Formula Sheets, Problem Sets with Solutions, Video Tutorials, with subject/topic discovery, provenance, review status, and authorized download behavior.
- **Mock Exam Portal:** timed quiz setup, Shuffled Practice, approved practice pools, lawfully reusable past board exam content, question session, result explanation, attempt history, and evidence-aware analytics.
- **Student Dashboard:** progress summary, weak areas with coverage/sample disclosure, bookmarked questions, saved formulas, attempt history, preferences, privacy controls, and sign-out where applicable.
- **Community Forum:** searchable discussion list, problem thread and comments, accessible math, posting/editing/reporting controls under approved rules.
- **Calculator / Tools:** unit converter first; steel-section tables only after source/license checks; concrete education references clearly separated from actual validated mix design.
- **Help and policy:** About, Contact, Support, Privacy, Feedback, and Bug Reports.
- **Future mobile app:** independent five-tab structure specified in Section 7.


## 6. Desktop-first website layout plan

### Global desktop shell

The global navigation target is:
- CEStudy logo/home.
- Year-Level dropdown.
- Review Materials Hub mega-menu.
- Mock Exam Portal direct tab.
- Community Forum direct tab.
- Student Dashboard/account control, private to signed-in students.

Search is a candidate shared capability. Do not add it until searchable content, result ranking, and empty-state behavior are specified. Help/policy and owner-only destinations remain secondary. A persistent sidebar should only be chosen for dense dashboard/workspace views if usability evidence supports it.

### Year-Level dropdown interaction

- Opening the dropdown shows the four years.
- Selecting a year reveals semester groups; selecting a semester reveals assigned subject links.
- Keep the selected year and semester context visible while browsing subjects.
- Support click/touch and keyboard operation, visible expanded/selected state, Escape to close, focus restoration, and direct destination links.
- If a mapping is missing or a semester has no eligible subjects, display a useful message rather than an empty panel.
- Before implementation, verify the curriculum version and actual year/semester/subject relationships. Create a data-model requirement if the current structures cannot represent them.

### Review Materials Hub mega-menu

- Use a readable desktop panel with three labelled groups: Formula Sheets, Problem Sets with Solutions, and Video Tutorials.
- Include a browse-all path for each resource group and only show current, real content.
- Keep publication status, source/version, and authorized download states explicit.
- Support keyboard and screen-reader navigation; do not depend on hover-only behavior.
- On smaller screens, transform into a full-width panel or accordion rather than shrinking a desktop mega-menu.

### Desktop page hierarchy

| Page/workflow | Desktop structure to evaluate |
|---|---|
| Home | Main paths into Year Levels, Review Materials, Mock Exams, and Tools |
| Year/semester/subject | Clear hierarchy, readable subject list, accurate content availability |
| Review Materials Hub | Search/filter by resource type, subject, topic, and availability |
| Formula sheet | Formula, variables, units, assumptions, usage notes, source and revision |
| Problem set | Problem, reviewed worked solution, related formula/tool, source status |
| Video tutorial | Title, subject/topic, lawful source/embedding, and captions/transcript where available |
| Mock Exam Portal | Eligible pool count, quiz settings, timed/untimed options, clear start, honest scope |
| Question session | Main question, accessible answer controls, timer/progress, equation support, explanation |
| Results/analytics | Score, accuracy, elapsed time, missed questions, topic evidence counts, sample/coverage caveats |
| Student Dashboard | Progress and bookmarks summary, evidence-backed weak areas, links to detailed records |
| Community Forum | Search, discussion list, problem thread, comments, reporting/moderation controls |
| Tools | Tool directory and input/result workspaces with units and explanations |

### Dark Mode

Dark Mode is a required capability for the website and future app.
- Keep the white/light theme as the default unless the owner approves a different default.
- Provide a visible Light/Dark toggle. Whether to include a System choice is an open decision.
- Reuse semantic tokens for background, surfaces, text, borders, focus, and status colors.
- Persist the website preference locally at first; account synchronization requires a separate privacy/data decision.
- Validate menu panels, equations, timers, tables, charts, result states, forum content, focus rings, and downloaded-material states in both themes.
- Do not assume the dark-mode implementation on PR #44's draft branch is present on main.


## 7. Responsive website strategy and future native app

### Responsive website, designed after desktop

The website's desktop hierarchy comes first. Tablet and phone-browser layouts must remain usable, but do not dictate the whole website IA.

At smaller widths:
- Convert Year-Level selection to touch- and keyboard-operable nested panels/accordions: year → semester → subject.
- Convert the Review Materials mega-menu to a full-width sheet or grouped accordion with the same three resource categories.
- Keep Mock Exam Portal and Community Forum discoverable.
- Keep Student Dashboard private. Do not automatically reuse the native app tab bar on mobile web.
- Support long subject labels, quiz questions, formulas, tables, and explanations without page-wide horizontal overflow. Intentional table scrolling must be labelled.
- Prevent sticky/fixed navigation from covering content, dialogs, focus, or final actions.

Evaluate desktop at 1440px and 1024px first, then tablet at 768px and phone browsers at 390px and 320px. Existing 560px and 850px breakpoints are references to audit, not mandatory boundaries.

### Future native mobile app tab bar

The requested native app uses five tabs:

1. **Home:** a daily review question drawn from reviewed eligible content, quick-start study streak, and recently opened modules. If no personalized history exists, use an honest generic fallback.
2. **Subjects / Library:** catalog organized by year and subject, structured reading, and approved reviewer PDFs/formula sheets for offline use.
3. **Practice:** flashcards, customizable timed quizzes, and Shuffled Practice for board-preparation practice.
4. **Calculator / Tools:** unit conversion first; add steel references only after dataset/licensing verification and concrete references only with clear educational limitations.
5. **Profile:** transparent readiness evidence, saved/bookmarked formulas/questions, settings, theme, offline downloads, account/privacy controls.

This is an app-specific target. Framework choice remains deferred. The native app should reuse CEStudy's brand, content taxonomy, learning rules, validation, and data contracts, but its components and navigation should be designed for mobile rather than squeezed from the web UI.

### Offline Access toggle and download manager

Offline Access is a must-have capability, with different technical behavior on web and native app platforms.

Proposed UX:
- A setting to enable offline access where supported.
- Per-resource download actions for approved reviewer PDFs, formula sheets, and designated mock-test packages.
- A download manager listing each item, source/version, status, update availability, and remove action.
- Clear queued, downloading, downloaded, update available, failed, unsupported offline, and removed states.
- Storage management, explicit remove/clear actions, and warnings when downloaded content is stale or has been withdrawn.

Website feasibility should be evaluated using service workers and Cache Storage for eligible app-shell/resources, plus appropriate storage for deliberate downloads. Browser storage is not unlimited and cannot be assumed permanent. See [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) and [MDN PWA offline guidance](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation).

The native app needs its own local-data and synchronization contract. [Android's offline-first guidance](https://developer.android.com/topic/architecture/data-layer/offline-first) recommends a local data source for core offline reads and explicit sync/conflict handling.

Offline requirements:
- Only approved, legally distributable content may be downloaded.
- Interactive mock-test packages must include reviewed questions, answer rules, explanations, and required equation-rendering assets.
- Define timer behavior across suspend/close/reopen and device-clock changes before offline timed tests ship.
- Save offline answers locally, clearly label unsynced attempts, and define duplicate prevention/conflict behavior before sync.
- Do not imply community posting or remote-only private records work offline unless specifically designed and tested.
- Define package versioning, update/expiry, eviction, storage limit, and deletion.
- A server-side content withdrawal cannot instantly remove a local offline copy. This limitation must inform which content can be downloaded.

### LaTeX/equation support

The inspected main-branch package manifest already includes KaTeX 0.19.0. This verifies a dependency, not complete or correct rendering on every page.

Requirements:
- Audit and reuse a shared math-rendering path for lessons, formula sheets, problem sets and solutions, questions, explanations, results, forum posts/comments, and approved offline materials.
- Verify inline/display equations, fractions and nested fractions, radicals, Greek symbols, subscripts/superscripts, matrices, vectors, and engineering units within supported syntax.
- Bundle required CSS and fonts locally for reliable rendering and offline use; do not rely on a CDN as the only source for downloaded materials.
- Preserve accessible output. See [KaTeX output options](https://katex.org/docs/options), [browser support](https://katex.org/docs/browser), and [supported syntax](https://katex.org/docs/supported).
- Safely handle malformed/unsupported input with a readable fallback. Do not interpret forum-supplied text as trusted HTML.
- Long equations must wrap or scroll in a labelled region without causing page-wide overflow.
- Choose and test a separate native-app equation-rendering solution when mobile-app work is authorized. The website package alone does not prove native support.

Regression fixtures should cover nested fractions, matrices, vectors, sub/superscripts, Greek letters, multi-line/display math, malformed expressions, long equations, copied output, both themes, offline assets, and layouts at 320px, 390px, 1024px, and 1440px.


## 8. Feature fit and dependencies

### Practice first

Practice and the Mock Exam Portal form the core examination-preparation experience: flashcards, customizable timed quizzes, Shuffled Practice, explanations, reviewed past-exam material where authorized, and attempt results. Dependencies include approved question content, answers, explanations, subject/topic mappings, difficulty definitions when used, publication policy, and clear session/timer behavior.

Analytics and weak-topic claims must come from actual, eligible attempts and display enough sample/coverage information. Do not advertise official-exam simulation or a licensure pass prediction without valid supporting evidence.

### Tools second

Start with a deterministic unit converter, explicit dimensions, reviewed conversion factors, precision rules, and tests. Steel-section references require verified source/version and redistribution rights. Concrete references must distinguish educational nominal-ratio examples from actual concrete mix design; do not imply that a simple ratio guarantees strength.

### Profile / Student Dashboard third

Use the requested private Student Dashboard as the web personal-learning area. Integrate existing progress/history patterns only after confirming which branch and data source they live on. Add bookmarked questions and formulas linked to stable content IDs. A readiness indicator must disclose tested coverage and evidence, and be withheld where evidence is insufficient.

### Review Materials and curriculum mapping

The Year-Level hierarchy needs a validated year/semester/subject mapping. The Review Materials Hub requires actual metadata for Formula Sheets, Problem Sets with Solutions, and Video Tutorials. Do not represent future content as currently available; confirm publishing status, source, and permitted distribution first.

### Community Forum

Define public/read-only versus account-required participation, author identity, reporting/moderation, deletion/retention, and equation safety before opening posting. A discussion thread must not expose private account data, and mathematical input must be rendered through a safe, tested path.

### Cross-cutting technical features

- **Offline Access:** define which resources are downloadable, content/version manifest, quota/storage behavior, stale/withdrawn-content handling, deletion, offline attempt storage, and sync policy separately for browser and native app.
- **LaTeX/equations:** audit the existing KaTeX integration and extend regression coverage before treating equation support as complete.
- **Dark Mode:** provide an explicit toggle, semantic tokens, persistence policy, and full-page/theme regression checks. PR #44's branch work is not automatically part of main.

### Backend and security boundary

This plan adds no schema. Reinspect migrations, tables, grants, and RLS before implementation. If attempts, bookmarks, preferences, or offline sync state are stored remotely, define owner-scoped policies and deletion behavior. Offline packages must contain only content approved for distribution; local caching is not a substitute for privacy, licensing, or publication review.


## 9. Planning sequence and exit criteria

### Step 1 - Baseline and navigation audit
Deliverable: current-main routes/components and separate PR #44 draft inventory, plus preview-to-commit verification status.
Exit: shipped versus draft features are clearly distinguished; preview identity is verified or explicitly blocked.

### Step 2 - Target website IA
Deliverable: Year-Level dropdown, Review Materials mega-menu, Mock Exam Portal, private Student Dashboard, and Community Forum sitemap with one canonical destination each.
Exit: route duplication is resolved; year/semester/subject mapping and the curriculum source are verified or documented as missing requirements.

### Step 3 - Desktop page hierarchy
Deliverable: textual page trees for each global destination, menu behavior, quiz, result, dashboard, forum, and tools workflows.
Exit: hover/click/keyboard/touch behavior, focus management, active states, and empty/loading/error states are specified before UI code.

### Step 4 - Equation and theme foundation
Deliverable: shared-renderer source audit, equation fixtures, dark-mode token map, and preference persistence decision.
Exit: supported syntax, malformed-input fallback, long-equation behavior, dark-theme coverage, and mobile web/app distinction are testable.

### Step 5 - Practice engine and Mock Exam Portal
Deliverable: reviewed question schema requirements, pool-selection behavior, session lifecycle, timer rules, results, attempts, and analytics definitions.
Exit: eligibility, insufficient pool, duplicate exposure, timeout/interruption, score consistency, user ownership, and RLS tests are explicit.

### Step 6 - Tools
Deliverable: unit catalog, dimensional rules, precision/error policy, and sources/license record for proposed engineering references.
Exit: conversions are independently checked and automated tests are specified; steel/concrete data is not included until approved.

### Step 7 - Student Dashboard and Community Forum
Deliverable: private dashboard hierarchy, evidence-backed weak-subject behavior, bookmark/source relationships, forum access, moderation, reporting, and retention decisions.
Exit: privacy boundaries and content safety rules are testable; no arbitrary readiness claims are allowed.

### Step 8 - Offline Access
Deliverable: downloadable resource manifest, user setting, download manager, version/update/remove rules, storage policy, and local attempt/sync contract.
Exit: airplane-mode use is defined for each supported resource; download status is accurate; offline material's publication and reuse rights are approved.

### Step 9 - Responsive website adaptation
Deliverable: tablet and phone-browser layouts based on the approved desktop IA.
Exit: Year-Level and Review Materials menus remain operable; no page-wide overflow; fixed navigation, equation layout, dark mode, keyboard/focus, and touch use are covered.

### Step 10 - Native mobile-app design
Deliverable: separate five-tab app flows for Home, Subjects / Library, Practice, Calculator / Tools, and Profile.
Exit: platform/framework choice is separately approved; offline, equation, and theme behavior are designed natively rather than assumed from website behavior.

### Step 11 - Implementation authorization
Deliverable: small implementation slices with acceptance criteria, tests, manual checks, and security review.
Exit: the owner explicitly authorizes the relevant slice. This plan update alone authorizes no application implementation.


## 10. Future verification checklist

Before merging any later implementation:
- Confirm the deployed preview corresponds to the exact commit under review.
- Test desktop at 1440px/1024px, tablet at 768px, and phone browser at 390px/320px.
- Verify Year-Level dropdown year → semester → subject with mouse, keyboard, and touch; test focus restoration, Escape, expanded state, and empty groups.
- Verify the Review Materials mega-menu is readable, keyboard-operable, and converts to a usable small-screen panel.
- Verify Mock Exam Portal question eligibility, timer/interruption rules, answer explanations, correct scoring, and sufficient sample/coverage disclosures.
- Verify past board exam material has source and reproduction/reuse approval before online display or offline download.
- Verify Student Dashboard records are owner-scoped in data policies, not only hidden in the UI.
- Test forum equation rendering, input sanitization, reporting/moderation, and privacy.
- Download approved content, switch to airplane mode, reopen it, confirm the complete item works, then test failed download, update, stale state, and removal.
- Verify offline tests save clearly marked unsynced attempts and cannot double-submit when synchronization returns.
- Run equation fixtures for nested fractions, matrices, units, sub/superscripts, long/malformed inputs, both themes, and offline assets.
- Test Dark Mode on menus, equations, quizzes, result states, tables, charts, forum pages, and focus indicators.
- Test direct routes, refresh, back/forward, loading/empty/error states, keyboard-only navigation, zoom, reduced motion, and horizontal overflow.
- Run repository lint, unit/component tests, build, applicable database/RLS checks, secret scanning, and browser smoke tests.
- Do not treat a route as evidence that a feature exists or content as approved because it renders.
- Do not bypass or alter PR #44's release gates through this work.


## 11. Decisions and open questions

### Direction provided by the owner on 2026-10-21, revised at 2026-10-21T19:03:29+08:00 (Asia/Manila)

- Website navigation target: Year-Level dropdown by year → semesters → subjects; Review Materials Hub mega-menu for Formula Sheets, Problem Sets with Solutions, and Video Tutorials; direct Mock Exam Portal; private Student Dashboard; Community Forum.
- Native app target: five tabs named Home, Subjects / Library, Practice, Calculator / Tools, and Profile.
- Must-have cross-cutting features: Offline Access toggle for downloadable materials, LaTeX/equation rendering on desktop and future app surfaces, and Dark Mode toggle.
- Website-first remains the development strategy. The app receives its own mobile interaction design.
- This is still planning and documentation; no app/web feature implementation is authorized by the navigation brief.

### Recommended implementation order

1. Practice and Mock Exam Portal, once question content is reviewed.
2. Unit converter and Tools foundation.
3. Student Dashboard with formulas/questions bookmarks and evidence-aware progress.
4. Year-Level semester mapping and Review Materials Hub completeness, subject to source/content verification.
5. Community Forum when access, moderation, privacy, and safe equation handling are defined.
6. Offline downloads after content rights, storage, versioning, and synchronization rules are approved.
7. Equation and Dark Mode regression coverage as cross-cutting foundations.
8. Separate native-app planning when that project is prioritized.

### Remaining decisions

- Which curriculum/version supplies the authoritative semester subject mapping?
- Which past board exam questions are lawfully reusable, and how will CEStudy cite their source and edition?
- Is forum reading public/searchable, while posting requires an account? What are the moderation and identity rules?
- What question coverage qualifies a weak-subject signal or readiness estimate?
- Does Dark Mode offer Light/Dark only or Light/Dark/System? Does the preference stay local or sync?
- Which resources can be downloaded, how much storage is allocated, and how are stale/withdrawn packages handled?
- How should offline timers respond to app suspension, device-clock changes, and network restoration?
- Which math syntax is required beyond the verified KaTeX support, and how is user-posted markup sanitized?
- When native app design begins, which framework is appropriate?

## 12. Scope guard

This is a plan only. Last revised 2026-10-21T19:10:04+08:00 (Asia/Manila). It does not add routes, components, application logic, database tables, migrations, RLS policies, question records, reference datasets, offline packages, or mobile-app code. It does not modify PR #44's branch, status, checks, or deployment. All feature work requires explicit implementation authorization after the applicable design and data decisions have been approved.
