# CEStudy UX/UI Design System

**Status:** Brand foundations established; website information architecture and theme default are under decision review  
**Platforms:** Website-first responsive web now; native Android and iOS later  
**Product goal:** Help Civil Engineering students find subjects and useful math foundations quickly.

**Website strategy (updated 2026-10-21):** CEStudy is website-first, not mobile-first. Plan the desktop information architecture and primary website workflows first, then adapt the approved structure for tablet and phone browsers. Mobile-browser usability remains required, but must not dictate the entire website architecture. The future native app will receive a separately designed interaction model. See the [dated website-first information architecture plan](../plans/2026-10-21-website-first-information-architecture-plan.md) and the [modern gamified UX/UI decision plan](../plans/2026-10-21-modern-gamified-ux-decision-plan.md).

## Design principles

1. **Website-first information architecture.** Design the desktop website structure and primary workflows first. Adapt them responsively for tablet and phone browsers afterward; mobile-browser usability remains required but does not set the overall architecture.
2. **Logo-led, not logo-disconnected.** Retain the canonical master logo and its geometry. The exact logo blue is `#0754B5`; use its transparent blue-art variant on pale or white surfaces when a larger brand mark is useful.
3. **Theme default under review.** The existing token table records the earlier light-theme baseline. The proposed modern direction draws inspiration from **Discord** (community and navigation), **Duolingo** (quests, XP, streak feedback, and learning rewards), **GitHub** (structured activity and progress), and **Autodesk AutoCAD** (precision engineering-workspace styling, dark drafting canvas, and technical panels). These references must inform CEStudy's own design system, not be copied. Compare light-first and dark-first concepts and do not treat the default as settled until the companion decision plan is approved.
4. **Brand accents with restraint.** Use CEStudy blue for primary actions, links, focus indicators, and small selected states. Evaluate proposed electric green, cyan/neon blue, and safety orange only for appropriate semantic roles and verified contrast. Avoid large full-width blue panels, excessive glow, and neon colors as the sole way to convey status.
5. **Useful copy only.** Text must help students navigate, understand a content status, learn a concept, or recover from a problem. Remove repeated claims, filler slogans, generic marketing copy, and statistics that do not help a student make a decision.
6. **Motion with purpose.** Motion may show hover, focus, selection, feedback, or the arrival of content. It must not delay studying or act as decoration.
7. **Performance is a design requirement.** Prefer CSS and existing dependencies; avoid large animations, continuous effects, unnecessary image payloads, repeated data fetching, and gratuitous blur or shadow.

## Design tokens

| Token | Value | Use |
|---|---|---|
| `--brand-blue` | `#0754B5` | Canonical logo color and primary actions |
| `--blue-hover` | `#06458F` | Hover/pressed state for primary actions |
| `--blue-soft` | `#E8F0F8` | Selected navigation and subtle emphasis |
| `--navy` | `#123451` | Strong text and secondary brand tone |
| `--navy-strong` | `#0B263D` | Headings |
| `--teal-dark` | `#236C62` | Limited accent and positive emphasis |
| `--muted` | `#637487` | Supporting text |
| `--line` | `#DCE5EC` | Borders and dividers |
| Page background | `#FFFFFF` | Default page surface |
| Card background | `#FFFFFF` | Cards and panels |
| Soft section surface | `#F7F9FC` | Low-emphasis grouping only |

The color rows above are the existing light-theme baseline, not a decision that light mode must remain the default. Define a matching dark semantic-token map during theme comparison. Both mappings must cover page/surface backgrounds, text, borders, focus, success, warning, error, disabled, hover, selected, equations, diagrams, charts, and dialogs.

Use Inter with system fallbacks. Body text starts at 16px; keep heading sizes responsive. Use consistent 4px/8px spacing increments and a restrained set of radii.

## Logo use

- Keep `public/branding/cestudy-master-logo.svg` as the full logo in the site header.
- Use `public/branding/cestudy-master-logo-transparent.svg` for a larger brand mark on a white/pale surface or on branded loading states.
- Keep `public/branding/cestudy-app-icon-rounded.svg` as favicon/app-icon source.
- Never redraw, stretch, rotate, independently recolor, or replace the canonical artwork with generated substitute artwork.
- Keep sufficient contrast around the blue-background master logo and preserve its proportions.

## Shared components

- **Header:** canonical logo, wordmark, concise navigation, white surface, thin border.
- **Year-Level navigation (planned):** hierarchy from 1st to 4th year, then semester and subject, based on verified curriculum/content metadata.
- **Review Materials mega-menu (planned):** Formula Sheets, Problem Sets with Solutions, and Video Tutorials. Show only available, appropriately reviewed resources.
- **Equation renderer:** shared rendering path for inline/display math in lessons, formula sheets, problem sets/solutions, quizzes, results, forum discussions, and approved offline material.
- **Offline/download state:** consistent labels for available to download, downloading, downloaded, update available, failed, unavailable offline, stale, and removed, only where each state is applicable.
- **Theme toggle:** explicit Light/Dark preference, with a System option only if separately approved. Persist according to the approved privacy/data policy. Year levels opens the overview page, not Year 1.
- **Primary button:** logo blue with white text; one main action per region.
- **Secondary button:** white with a neutral border and navy text.
- **Subject card:** title, relevant year/category metadata, accurate content availability, and one clear destination.
- **Year card:** year number and label only unless useful verified metadata exists.
- **Search/filter:** accessible labels, visible active filters, live result count, clear reset.
- **Status:** distinguish coming soon, in preparation, and published study content; never imply review is complete without evidence.
- **Feedback states:** consistent loading, empty, error, success, focus, and disabled behavior.
- **Curriculum notice:** preserve important CHED-reference context where it affects a user's interpretation; avoid duplicating notices without a reason.

## Responsive website behavior

- Website-first: establish the desktop information architecture, page hierarchy, and wide-screen workflows first, then design responsive adaptations. Existing 560px and 850px breakpoints are initial references, not mandatory boundaries.
- Target desktop navigation: Year-Level dropdown (year → semester → subject), Review Materials Hub mega-menu (Formula Sheets, Problem Sets with Solutions, Video Tutorials), direct Mock Exam Portal and Community Forum links, and a private signed-in Student Dashboard control.
- On tablet/phone browsers, make the year hierarchy and material groups work as panels or accordions. Do not shrink desktop menus or assume the future native-app tab bar is the correct mobile-web navigation.
- Desktop content should use page-appropriate widths. Reading pages may stay centered and constrained; reference tables and dense study workspaces may need wider containers.
- Tablet layouts should retain useful hierarchy, readable filters, and adequate content space without cramped labels.
- Phone browser layouts must remain usable and should prioritize the current task, search, and content. They may use different navigation presentation from desktop without changing the underlying destination model.
- Keep layouts usable at 320px and verify at 360, 390, 768, 1024, and 1440px. Do not force desktop tables or multi-column layouts into unreadable narrow surfaces.
- Verify long equations do not cause page-wide overflow; use a deliberate wrapping or labelled horizontal-scroll strategy where necessary.
- Test light and dark themes across dropdowns, mega-menus, formulas, timers, tables, results, forum content, and focus indicators.

## Motion and performance

| Element | Behavior | Constraint |
|---|---|---|
| Buttons | Quick color/press feedback | About 100–180ms |
| Cards | Small lift/border/shadow change on hover-capable devices | Avoid layout shifts |
| Page entry | One short opacity/translate transition where it helps orientation | No continuous animation |
| Loading | Skeleton or existing branded loader matching the expected content | No blocking delay |
| Reduced motion | Disable nonessential transitions and entrance effects | Respect OS preference |

- Prefer `transform` and `opacity` over animations that trigger layout.
- Avoid continuous parallax, autoplay, large video backgrounds, excessive backdrop blur, and new animation libraries without a demonstrated need.
- Reserve image dimensions and optimize assets; do not load hero assets larger than needed.
- Avoid duplicate catalog fetches and unnecessary React re-renders.
- Compare build size, mobile loading, layout stability, interaction responsiveness, and browser errors before and after the redesign.

## Content rule

**If a sentence does not help a student act, understand, or recover, remove it.** Do not add text to fill empty space. Do not repeat a heading in another sentence, claim content is reviewed without verification, or display meaningless/unnecessary statistics.

## Acceptance checks

- The real master logo is unchanged and legible against both the light and dark theme concepts.
- The planned website navigation supports year → semester → subject, the three Review Materials groups, Mock Exam Portal, Community Forum, and a private Student Dashboard.
- The responsive website does not inherit the native app's five-tab structure without separate usability review.
- Inline/display equations render through the shared path, including fractions, nested fractions, matrices/vectors, subscripts/superscripts, units, and a readable invalid-expression fallback.
- Dark Mode applies consistently and persists according to the approved preference model.
- Offline Access only indicates an item is downloaded when its complete package is stored; download, failure, update, stale, remove, and unavailable states are explicit.
- Content licensing and publication approval are required before protected materials are made downloadable.
- Logo blue is used sparingly in both themes. Light-theme white surfaces remain part of the supported design; the site's default theme is an open decision until the companion plan is approved.
- All current routes use the same token, type, spacing, button, card, and focus patterns.
- Year levels links to an overview that lists all four years.
- No filler marketing statements or non-actionable metrics appear on the homepage.
- Hover/focus states work, and reduced-motion is respected.
- Desktop information architecture and primary journeys are clear at 1440px and 1024px; responsive layouts remain usable at 768px, 390px, and 320px.
- Contrast, keyboard behavior, route refreshes, and catalog/practice behavior remain intact without horizontal page overflow.
- CI, browser smoke checks, and available accessibility checks pass before merging.


## Revision record

- **2026-10-21T19:10:04+08:00 (Asia/Manila):** Added the requested website navigation model, native five-tab app design, Offline Access, LaTeX/equation rendering, and Dark Mode requirements. Documentation-only change.
- **2026-10-21:** Linked the modern gamified UX/UI decision plan and marked the light-versus-dark default as open. Added planning gates for quests, rewards, healthy engagement, exam evidence, and responsive navigation. Documentation-only change.

## Footer

- Show the current year and `© YEAR CEStudy. All rights reserved.` without adding a long promotional description.
- Provide compact navigation links to the subject catalog, year-level overview, and math foundations.
- Link the footer to four dedicated pages: Contact, Support, Report a bug, and Feedback. The public contact and bug-report address is `cestudy00@gmail.com`.
- Clearly mark external links and open them safely in a new tab.
- Use a three-column desktop layout that becomes two columns on tablet and one column on phones.
- Keep the footer white, use the same neutral border and typography tokens, and reserve logo blue for link interaction/focus states.

## Cross-platform product system

CEStudy uses one design language with two intentionally different interfaces. The future app should not simply squeeze the responsive website into a native shell.


### Shared foundations

- The master logo, logo blue #0754B5, type and spacing tokens, semantic colors, and purposeful motion constraints.
- Consistent states for content availability, search/filter, progress, feedback, loading, errors, success, and offline downloads.
- Shared subject/content taxonomy, validation, formula conventions, data contracts, and access-control behavior.
- Website equations must use an audited shared renderer. Native app math rendering must be selected and tested independently.
- Light and dark themes use semantic tokens across all pages. The prior light-theme default is under review against the newer dark-first proposal. The design references are Discord for community/navigation, Duolingo for learning quests/rewards, GitHub for activity/progress, and Autodesk AutoCAD for a precise technical-workspace aesthetic. See the modern gamified UX/UI decision plan before locking the default or preference persistence model.
- Offline packages need explicit version, availability, update, and removal states. Browser service workers/storage and native app local storage/synchronization are different technical implementations.
- Brand/service logos are sourced from SVGL (https://svgl.app/) when available and stored locally. Generic interface icons remain simple and visually consistent.


### Website-specific structure (current baseline, subject to redesign)

- Current main baseline: a brand header with Subject catalog, Year levels, and Math foundations, plus secondary navigation. The documented mobile-web pattern uses a compact quick-navigation bar and a More menu. These are audit baselines, not immutable constraints.
- PR #44 remains a separate unmerged draft with its own account/profile/history/streak/community routes and navigation implementation. Do not treat draft functionality as shipped on main or change its release gates through this plan.
- Target website navigation: Year-Level dropdown for 1st, 2nd, 3rd, and 4th year with semester and subject levels; Review Materials Hub mega-menu for Formula Sheets, Problem Sets with Solutions, and Video Tutorials; direct Mock Exam Portal and Community Forum destinations; private signed-in Student Dashboard control.
- Dashboard progress/bookmarks must be private to the correct user, and weak-subject signals must show evidence/coverage rather than implying mastery from a tiny sample.
- Resource menus show real availability, review state, and provenance. Download only content whose source and redistribution rights have been approved.
- At tablet/phone widths, the year dropdown and resource mega-menu become operable panels/accordions. The mobile-browser navigation is decided separately from the native app tab bar.
- Offline Access should include a download manager for approved reviewer PDFs, formula sheets, and mock-test packages. Specify storage, source/version, update, removal, and offline-attempt synchronization before implementation.
- Use equation rendering across lessons, formula sheets, problem sets, quizzes, results, and forum posts/comments. Offline materials need local access to any required rendering assets.


### Future native mobile app

- The app Home supports a reviewed daily question, quick-start study streak, and recently opened modules where real content/history exists.
- The target native tab bar has five tabs: **Home**, **Subjects / Library**, **Practice**, **Calculator / Tools**, and **Profile**.
- **Home:** daily review question, streak entry, recent modules.
- **Subjects / Library:** year/subject catalog, structured reading, authorized reviewer PDFs and formula sheets for offline use.
- **Practice:** flashcards, customizable timed quizzes, and Shuffled Practice.
- **Calculator / Tools:** unit converter first; verified steel references and bounded concrete-learning references only after source review.
- **Profile:** evidence-aware readiness indicator, saved formulas/questions, settings, Dark Mode, Offline Access manager, account and privacy controls.
- Offline timed-test packages need local question/answer/explanation data, math-rendering assets, clear timer behavior, and an explicit unsynced-attempt policy.
- Provide a Dark Mode toggle using shared semantic tokens and define whether its preference is local or account-synchronized.
- Reuse brand, typography, statuses, content taxonomy, validation rules, and data contracts; rebuild UI components for native mobile interaction instead of simply squeezing the responsive website into an app shell.
- Choose and verify native equation rendering separately. The website's KaTeX dependency does not establish native rendering support.
- Defer platform/framework selection until app development is authorized. Do not add mobile framework dependencies to the current website.

## Photography and service icons
- Homepage bridge photograph: Juan Coronel on Unsplash, https://unsplash.com/photos/an-aerial-view-of-a-bridge-over-a-river-RFJb724c660. Delivered through Unsplash's image CDN using responsive widths. Browser smoke tests check loading and CSP.
- PayPal wordmark: public/branding/icons/paypal-wordmark.svg, sourced from SVGL. See docs/branding/svgl-icons.md.
- Use object-fit: cover and a tested focal point. Never stretch a small thumbnail to fill a large hero.

## Homepage photo and brand overlay
- The hero photo is configured centrally in `src/config/hero-image.ts`. Replacing the photograph means updating the photo ID, alternative text, and credit in that file, not changing the homepage component.
- The transparent master logo is centered above the hero photo, with a low-opacity white circle behind the logo. Keep the photo, circle, and logo as independently sized responsive layers.
- Dialogs use short opacity/transform enter and exit transitions; they do not block the close action and honor reduced-motion preferences.

## About page
- The About page explains CEStudy's purpose, navigation approach, publication/review standards, independent relationship to CHED, and ways to contact the maintainer. Avoid claims of official affiliation, accreditation, or comprehensive content coverage.
