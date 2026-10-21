# CEStudy Website-First Information Architecture and Structure Plan

**Status:** Planning proposal; no application implementation authorized  
**Prepared at:** 2026-10-21T18:53:21+08:00 (Asia/Manila)  
**Repository:** [justryan-n2d/CEStudy](https://github.com/justryan-n2d/CEStudy)  
**Main baseline commit:** `e6f657cbbf94467e427fc6183c9714e965098598`  
**PR #44 head reviewed:** `662e413601cef93100534b8be52f1a76fe35b335` (open, draft, not merged)  
**Related specification:** [UX/UI Design System](../specs/UX_UI_DESIGN_SYSTEM.md)

## 1. Executive summary

CEStudy will follow a **website-first, not mobile-first, product-design strategy**. Plan the website's information architecture, desktop navigation, and primary page workflows first. Then adapt the approved website structure to tablet and phone browsers. Mobile-browser usability remains a requirement, but it will not dictate the entire website architecture. A future Android/iOS app should have a separately designed mobile interaction model while reusing CEStudy's brand, content taxonomy, data contracts, and learning rules.

This plan addresses structural changes made necessary by the planned Practice, Tools, and expanded Profile experiences. The existing navigation, menu, page hierarchy, and responsive layout are baselines to inspect, not fixed constraints.

**Recommended direction:** a hybrid desktop website shell:
- A concise global header with the CEStudy brand, the primary learning destinations, search when its behavior is defined, and an account/profile entry.
- A clear Learn grouping for subject catalog, year levels, mathematics foundations, and lessons.
- Direct entry to Practice and Tools because they are core learning destinations.
- Personal records such as readiness, saved formulas, progress, history, and streak grouped under the personal learning/Profile area rather than duplicated across multiple primary destinations.
- Contact, support, privacy, feedback, and other utility destinations remain secondary.
- Workspace-level subnavigation may be used inside dense Practice or Tools areas without making the global header longer.

This is a proposed information architecture, not an implementation commitment. Confirm the labels and exact grouping through the next design review.

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

| Alternative | Model | Advantages | Trade-offs | Assessment |
|---|---|---|---|---|
| A. Expanded top navigation | Place every key destination directly in the global header | High visibility; fast desktop access | Long labels and more destinations crowd the header; does not scale well as pages grow | Keep as a comparison option, not the default |
| B. Persistent desktop sidebar | Main site becomes an app-like left navigation with grouped destinations | Scales to many areas; clear selected states; good for a learning workspace | Changes the character of the public knowledge library; spends horizontal space; adds a structural layer to simple reading pages | Consider if testing shows frequent switching among many study destinations |
| C. Hybrid header plus contextual navigation | Concise global header for major areas; Learn grouping; subnavigation within dense Practice/Tools areas; personal records grouped under Profile | Retains a recognizable public website while accommodating more features; avoids duplicate global links | Requires careful decisions about what is global versus contextual | **Recommended starting point for the design review** |

### Proposed global destination model

**Desktop header candidates:**
- CEStudy brand/home
- Learn (with Subject catalog, Year levels, Math foundations, and published lessons)
- Practice
- Tools
- Community only when the destination contains a usable, approved experience
- Profile/account control

The precise set of labels and whether Learn is a direct link, menu, or landing page are decisions for the IA review. Do not blindly add every route to the global header.

**Personal-learning grouping:**
- Learning overview/readiness evidence
- Saved formulas
- Progress
- History
- Streak (if the PR #44 feature is approved and merged)

These may live within Profile or under a clearly named My Learning group, but should retain focused pages where complex tasks benefit from separate routes.

**Secondary destinations:**
- About, Contact, Support, Privacy, Feedback, Bug reports, and owner-only tools.
- Keep owner-only functionality out of student-facing primary navigation and enforce authorization at the server/data boundary.

## 5. Proposed sitemap and page hierarchy

This is a conceptual target, not a list of routes that already exist.

- **Home**
  - Primary path to browse subjects
  - Entry to Practice when the reviewed question pool is ready
  - Entry to Tools
  - Continue learning only when real, eligible progress data exists
- **Learn**
  - Subject catalog and search/filter
  - Year-level overview
  - Mathematics foundations
  - Subject detail
  - Topic/lesson reading
  - Contextual links to relevant practice, formulas, and tools
- **Practice**
  - Flashcards
  - Custom quiz setup
  - Shuffled practice
  - In-session question/card workflow
  - Results and incorrect-answer review
  - Recent attempts/review queue where actual records exist
- **Tools**
  - Searchable category directory
  - Unit converter
  - Steel-section reference, only after data/licensing validation
  - Concrete learning references, keeping educational examples separate from validated mix design
- **Profile / My Learning**
  - Account and identity (only if the PR #44 account feature is approved)
  - Learning overview and links to focused Progress/History/Streak pages
  - Formula bookmarks tied to source content
  - Learning and quiz preferences
  - Privacy, retention, and sign-out controls as applicable
- **Community**
  - Keep discoverable only when its intended text-post and problem-discussion experience is ready. Do not use a placeholder destination as if full community capabilities are implemented.
- **Help and policy**
  - About, Contact, Support, Privacy, Feedback, and Bug reports

## 6. Desktop-first website layout plan

### Global shell

- Retain the canonical logo and CEStudy design tokens.
- Evaluate header density at 1440px and 1024px before fixing navigation labels or breakpoints.
- Use direct global links for the highest-value areas and contextual navigation for lower-level destinations.
- A global search control is a candidate, but should not be added until the searchable content scope and results behavior are specified.
- Avoid a permanent sidebar across every reading page by default. Compare it on dense Practice/Tools/Personal Learning screens where local navigation might earn its space.
- Preserve skip-to-content, semantic navigation landmarks, visible keyboard focus, active-route indication, and clear text labels.

### Page layout candidates

| Page/workflow | Desktop structure to evaluate |
|---|---|
| Home | Clear primary action and paths into Learn, Practice, and Tools; keep marketing copy secondary |
| Subject catalog | Search/filter region, result count, readable subject grid/list, visible content availability |
| Subject/lesson | Reading-focused central content, related topics, formulas, relevant tool links, and optional practice links |
| Practice landing | Three primary modes (Flashcards, Custom Quiz, Shuffled Practice), then Continue/Review/Recent Results only when data exists |
| Quiz/flashcard session | Main question/card workspace; progress and session controls; explanation and source visibility; prevent secondary controls from competing with the question |
| Tools directory | Search, categories, concise cards with scope/limitations |
| Unit converter | Input quantity and source/target units beside a clearly labelled result; show conversion details and precision |
| Engineering reference tables | Wide searchable table on desktop with unit controls, source/version metadata, and an accessible comparison flow |
| Profile | Account and learning summary, saved formulas, settings; detailed records open the focused Progress/History/Streak pages |
| Progress/History | Dedicated record views with clear empty states, date/order semantics, and links back to relevant lessons or attempts |

### Wide-screen behavior

- Evaluate use of whitespace, readable line length, and page-specific max-widths; a reference table may need more space than a lesson.
- Use multi-column layouts only where they improve scanning and comparison.
- Do not force dense data tables into a narrow, centered reading column.
- Avoid duplicating the same action in a page header, global header, card, and footer unless it serves a distinct purpose.

## 7. Responsive website strategy (not mobile-first)

Design the desktop information architecture and its primary workflows first. Then adapt the same information hierarchy for tablet and phone browsers. Phone layouts may use a different presentation of navigation, but they should not dictate which destinations the entire website supports or how the desktop hierarchy must be organized.

Compare at least these mobile-web alternatives after the desktop IA is agreed:
1. A compact header with a navigation drawer/More menu and contextual page shortcuts.
2. A small quick-navigation bar plus a secondary menu.
3. A collapsible desktop header and grouped Learn/My Learning menus, without a persistent bottom bar.

Choose based on task frequency, labels, reachability, long-page content, and student testing. Do not assume a bottom bar or hamburger is automatically correct.

Responsive acceptance criteria:
- Test the agreed desktop design at 1440px and 1024px, tablet at 768px, and phone browser at 390px and 320px.
- No horizontal page overflow at supported widths. Wide tables may use an intentional, labelled horizontal scroll container when a card alternative would make comparison worse.
- Ensure fixed/sticky navigation does not cover page content, keyboard focus, dialogs, or final actions; respect safe-area insets where relevant.
- Preserve browser back/forward, direct route entry, refresh, and clear active states.
- Keep target sizes usable, labels visible, and focus indicators clear; test keyboard-only behavior and screen-reader names.
- Verify light/dark themes and reduced motion if present in the baseline.
- Treat phone-browser behavior as an acceptance requirement, not the first constraint used to design the site.

Existing 560px and 850px media-query breakpoints are reference points to inspect, not mandatory boundaries. Adjust them only after observing the desktop and intermediate layouts.

## 8. Feature fit and dependencies

### Practice first
Practice is the main new examination-preparation experience. It requires reviewed question/card content, correct answers, explanations, stable subject/topic identifiers, publication rules, question-pool behavior, and a defined session lifecycle. Start with Flashcards, a basic quiz, and Shuffled Practice. Do not label the experience an official licensure-exam simulator.

### Tools second
Start with a carefully tested unit converter using explicit dimensional compatibility and documented conversion rules. Keep calculation logic independent from UI components. Add steel tables only after sources and redistribution rights are approved. Concrete references must distinguish educational nominal-ratio examples from actual mix design and strength guarantees.

### Profile third
Reuse existing progress/history/appearance patterns where they exist, but distinguish local records from server-synchronized records. Formula bookmarks should reference stable formula/lesson identifiers and preserve source attribution. A readiness indicator must show coverage and evidence, must be withheld when evidence is insufficient, and must not be described as a validated pass prediction.

### Backend boundary
This plan creates no data models. Before implementation, re-inspect the full migrations/schema and policies. Establish ownership and RLS for attempts, responses, bookmarks, and preferences if these become server-stored. Reference tables and converter definitions can likely remain version-controlled static data until there is a concrete need for remote management.

## 9. Planning sequence and exit criteria

### Step 1 — Repository and route audit
**Deliverable:** an updated inventory of the exact target source state (main plus the reviewed PR #44 draft where relevant), routes, shared layout, page-specific patterns, theme tokens, test scripts, and data/security contracts.

**Exit criteria:** preview-to-commit match is verified or explicitly marked blocked; current production, main, and PR #44 features are separated; no proposed feature is described as shipped by inference.

### Step 2 — Information architecture
**Deliverable:** an approved sitemap, primary/secondary navigation inventory, route-to-destination mapping, label glossary, and at least two desktop navigation comparisons.

**Exit criteria:** every route has one canonical place; no duplicate Profile/Progress/History function is left unexplained; Practice and Tools are discoverable; community placement reflects actual readiness.

### Step 3 — Desktop navigation and page hierarchy
**Deliverable:** textual page trees/wireframes for Home, Learn/catalog, subject/lesson, Practice landing/session/results, Tools directory/unit converter, and Profile/My Learning.

**Exit criteria:** global versus local navigation is defined; primary actions and empty/loading/error states are listed; shared existing design tokens/components are mapped where verified; no visual implementation begins before design approval.

### Step 4 — Responsive-web adaptation
**Deliverable:** breakpoint/layout behavior and mobile-web navigation comparison based on the approved desktop IA.

**Exit criteria:** test widths are named; navigation does not overcrowd or cover content; wide tables have an explicit strategy; keyboard, focus, touch, zoom, and reduced-motion checks are accounted for.

### Step 5 — Technical and data mapping
**Deliverable:** route/component responsibilities, current-versus-proposed data matrix, security boundary notes, and testing matrix.

**Exit criteria:** each proposed feature has an explicit existing dependency or documented new requirement; no migration or permission is assumed; content publication status remains a release gate.

### Step 6 — Implementation proposal for future approval
**Deliverable:** small independent implementation slices, each with acceptance criteria, targeted tests, manual desktop/responsive QA, and rollback boundaries.

**Exit criteria:** the user explicitly authorizes implementation of the approved slice. Until then, work remains planning/documentation only.

### Step 7 — Future native app planning
**Deliverable:** a separate mobile-app user journey, navigation model, and platform/framework evaluation when mobile-app work is prioritized.

**Exit criteria:** mobile app navigation is designed for native usage rather than treated as a narrow website viewport; shared design tokens, content taxonomy, validation, and data contracts are identified separately from UI components.

## 10. Future verification checklist

For every eventual UI implementation PR:
- Verify the deployed preview corresponds to the exact commit under review.
- Review desktop at 1440px and 1024px, tablet at 768px, phone browser at 390px and 320px.
- Test the main user journey via keyboard and touch; verify focus visibility and semantic labels.
- Check active navigation, direct route loads, refresh, browser back/forward, and not-found behavior.
- Test both light and dark mode if available, reduced motion, empty/loading/error states, and horizontal overflow.
- Run repository-defined lint, unit/component tests, production build, database/RLS tests where affected, secret scanning, and the relevant browser smoke suite.
- Verify educational content and engineering reference data independently before publication.
- Do not merge PR #44 or change its release-gate status as a side effect of this plan.

## 11. Decisions and open questions

### Decided by the product owner on 2026-10-21
- CEStudy's next design direction is **website-first, not mobile-first**.
- Reorganizing the current website structure is allowed when required by the planned features.
- Plan the website and desktop workflows first; make the site responsive for phone browsers afterward.
- Plan a separate mobile-app interface when native app development begins.
- This work is planning/documentation only and does not authorize application implementation.

### Recommended, not yet approved
- Use the hybrid desktop header with contextual subnavigation as the initial IA direction.
- Group Progress, History, Streak, saved formulas, and readiness evidence under a personal-learning/Profile area, preserving focused destinations where useful.
- Prioritize Practice, then unit-conversion Tools, then Profile integration; defer reference datasets until verified.
- Leave the global search placement and exact mobile-web navigation pattern open until the IA and student journeys are reviewed.

### Remaining questions
- Is Learn best represented by a dedicated landing page, a header menu, or a direct Subject catalog link with secondary shortcuts?
- Should Community be a top-level destination immediately when implemented, or remain secondary until activity is established?
- Should Profile be labelled “Profile,” “My Learning,” or provide both an account identity control and a distinct My Learning page?
- Which navigation tasks are frequent enough to earn a global desktop slot?
- Which mobile-web alternative should be selected after desktop IA approval and testing?
- Which existing PR #44 behaviors will be retained, redesigned, or deferred once its release gates are resolved?

## 12. Scope guard

This is a plan only. It does not add routes, components, application logic, database tables, migrations, RLS policies, question records, reference datasets, or mobile-app code. It does not modify PR #44's branch, status, checks, or deployment. All feature work requires explicit implementation authorization after the applicable design and data decisions have been approved.
