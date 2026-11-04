# CEStudy UX/UI Design System

**Status:** Brand foundations established; owner has approved the Light/Dark toggle, website navigation direction, and Practice workspace layout. No application implementation is authorized by this document.  
**Platforms:** Website-first responsive web now; native Android and iOS later
**Decision update:** 2026-11-04, Decision-Light Design (Hick-Hyman Law) approved as a binding interaction standard and explicit five-signal design quality review guidance added; 2026-10-23, device-local theme preference approved for the first release  
**Product goal:** Help Civil Engineering students find subjects and useful math foundations quickly.

**Website strategy (updated 2026-10-21):** CEStudy is website-first, not mobile-first. Plan the desktop information architecture and primary website workflows first, then adapt the approved structure for tablet and phone browsers. Mobile-browser usability remains required, but must not dictate the entire website architecture. The future native app will receive a separately designed interaction model. See the [dated website-first information architecture plan](../plans/2026-10-21-website-first-information-architecture-plan.md) and the [modern gamified UX/UI decision plan](../plans/2026-10-21-modern-gamified-ux-decision-plan.md).

## Design principles

1. **Website-first information architecture.** Design the desktop website structure and primary workflows first. Adapt them responsively for tablet and phone browsers afterward; mobile-browser usability remains required but does not set the overall architecture.
2. **Logo-led, not logo-disconnected.** Retain the canonical master logo and its geometry. The exact logo blue is `#0754B5`; use its transparent blue-art variant on pale or white surfaces when a larger brand mark is useful.
3. **Theme toggle approved.** Provide a clear Light/Dark toggle and keep the existing light-default baseline for this plan. Do not switch to a dark-first default or add a System option without a separate owner decision. The modern direction draws inspiration from **Discord** (community and navigation), **Duolingo** (quests, XP, streak feedback, and learning rewards), **GitHub** (structured activity and progress), and **Autodesk AutoCAD** (precision engineering-workspace styling, dark drafting canvas, and technical panels). These references inform CEStudy's own design system and must not be copied.
4. **Brand accents with restraint.** Use CEStudy blue for primary actions, links, focus indicators, and small selected states. Evaluate proposed electric green, cyan/neon blue, and safety orange only for appropriate semantic roles and verified contrast. Avoid large full-width blue panels, excessive glow, and neon colors as the sole way to convey status.
5. **Useful copy only.** Text must help students navigate, understand a content status, learn a concept, or recover from a problem. Remove repeated claims, filler slogans, generic marketing copy, and statistics that do not help a student make a decision.
6. **Motion with purpose.** Motion may show hover, focus, selection, feedback, or the arrival of content. It must not delay studying or act as decoration.
7. **Performance is a design requirement.** Prefer CSS and existing dependencies; avoid large animations, continuous effects, unnecessary image payloads, repeated data fetching, and gratuitous blur or shadow.

## Design quality and anti-template standard (binding)

**Purpose:** Make CEStudy visually distinctive through deliberate, useful design rather than novelty or decoration. This standard applies to designers and coding agents proposing or changing any meaningful UI.

> **Binding principle:** "Every significant UI element must have a clear purpose grounded in user needs, information hierarchy, product identity, or functionality. Components must not be added simply to make the interface look modern, polished, or visually impressive."

This standard does not ban simplicity, reusable components, cards, shadows, gradients, animation, or visual personality. It requires a reason for each choice. A plain layout is not automatically generic, and a polished layout is not automatically good. Evaluate the interface against its real task, content, and CEStudy identity.

### Binding principles

1. **Task before template.** Identify the user, task, key information, primary action, and important recovery paths before choosing a layout. Do not force every route into a hero-plus-card-grid or dashboard template.
2. **Content earns the space.** Lessons, questions, equations, diagrams, assumptions, units, worked steps, and explanations take priority over decorative surfaces. Never shrink or fragment technical content to preserve a visual motif.
3. **Use the least structure that preserves meaning.** Prefer hierarchy, spacing, alignment, and concise labels first. Add a container only when it clarifies grouping, separation, interaction, or state.
4. **Reuse behavior, not a single page shape.** Share tokens and components where semantics and interaction match. Allow different page structures for reading, scanning, comparing, solving, tracking, and discussion.
5. **Truth over polish.** Loading, empty, unavailable, error, disabled, and success states must reflect actual product behavior. A mockup must label unimplemented interactions as proposed or nonfunctional.
6. **Evidence over invented content.** No fabricated engineering facts, placeholder metrics, unsupported readiness claims, fake review statuses, or repetitive filler copy. Technical material requires suitable verification/provenance and clear units, assumptions, notation, and worked reasoning.
7. **Restraint is contextual.** Brand blue `#0754B5`, semantic color, elevation, borders, radius, iconography, and motion must reinforce meaning or interaction. Color and decoration cannot be the only way to convey state.
8. **Preserve approved decisions.** Keep Blueprint Academy, canonical logo geometry/assets, website-first IA, Light/Dark toggle with Light as the default, and no System theme option. Inspiration from Duolingo, Discord, GitHub, and AutoCAD must be translated into an original CEStudy system, not copied.
9. **Accessibility and responsiveness are part of the design.** Keyboard access, visible focus, readable contrast, zoom/reflow, reduced motion, adequate target size, and viewport-specific behavior are acceptance criteria, not polish tasks.
10. **Inspect before approval.** Generated output is a draft until reviewed against the relevant task, nearby existing pages, content accuracy, interaction states, responsive behavior, accessibility, and maintainability.

### Anti-patterns and acceptance criteria

| Anti-pattern | Why it harms CEStudy | Preferred alternative | Acceptance criterion |
|---|---|---|---|
| Nested cards by default | Multiple surfaces, borders, shadows, and radii obscure relationships and add visual noise. | Open layout, one coherent workspace surface, spacing, headings, dividers, or a plain list. | Every additional container level has a documented grouping, boundary, interaction, or state purpose. |
| One card per statistic, paragraph, button, or navigation item | Makes scanning slower and gives ordinary content false importance. | Inline metric with context, aligned list, table, or typography-led grouping. | Cards represent genuinely distinct, self-contained units, not merely individual DOM/content fragments. |
| Repetitive card grids across unrelated pages | Hides the difference between reading, comparing, practicing, and discussing. | Choose layout from task: reading column, searchable list, comparison table, problem workspace, thread, or summary. | The page structure can be justified by the primary user task; a sibling page is not copied without review. |
| Oversized hero or empty whitespace | Pushes useful learning content and navigation below the fold without improving understanding. | Compact purpose statement and immediate route into the relevant task/content. | Above-the-fold space communicates the page purpose and a useful next action or real content. |
| Generic gradients, glow, blur, floating ornaments | Compete with formulas and content and may reduce contrast or performance. | Neutral surfaces and restrained semantic accents; retain effects only with a clear purpose. | Each decorative effect has a stated purpose and survives a remove-it test: removing it would meaningfully harm comprehension, identity, or feedback. |
| Unnecessary pills, badges, icons, shadows, borders, and animation | Increases visual emphasis without increasing meaning. | Plain text, spacing, dividers, or static state feedback. | Every badge/icon/effect communicates status, navigation, recognition, or feedback that text/layout alone does not communicate as well. |
| Arbitrary type combinations or display typography | Weakens hierarchy and technical readability. | Existing Inter/system stack and established type scale; use emphasis only for hierarchy. | Typography has consistent roles, readable line length, and supports equations and long-form reading. |
| Gamification overload | Rewards can overpower study content and encourage engagement without learning value. | Quiet, optional progress summaries and contextual feedback. | Every mechanic defines what it measures, why it helps learning, how it is verified, and how distraction/privacy are controlled. |
| Fake functionality or content | Users cannot trust a control, availability label, statistic, or engineering explanation. | Real behavior or explicitly labelled prototype state; verified content and provenance. | All interactive controls have defined behavior and all factual metrics/statuses have an actual source. |
| Purple/blue overload or gradients used as a default visual identity | Repeated saturated purple, blue-purple gradients, glow, or gradient-filled controls can make unrelated pages look like the same generic SaaS template and compete with CEStudy's own identity. | Use the approved CEStudy blue `#0754B5` selectively, with neutral surfaces and semantic colors that communicate real states. | Color and gradients have a documented purpose; the interface does not depend on a purple/blue gradient aesthetic to look finished or establish hierarchy. |
| Centering every section by default | Repeated centered headlines, paragraphs, cards, and controls ignore reading direction and content shape, making dense educational material harder to scan. | Choose alignment for the task. Use left alignment for most reading, explanatory, and technical content; reserve centered alignment for compact, genuinely balanced contexts. | Alignment is justified by content and task, not applied as a page-wide template. Long-form text, lists, tables, equations, and workspaces remain easy to scan. |
| Em dashes used as a default copy style | Habitual em-dash phrasing can make otherwise different sections sound templated and interrupt concise instructional copy. | Write direct, natural sentences. Prefer periods, commas, colons, or parentheses when they express the relationship clearly. | Copy is read aloud and edited for natural rhythm; em dashes are not used as a repetitive stylistic crutch. |
| Arbitrarily color-highlighted words in headlines | Coloring one word or phrase only for visual novelty creates artificial emphasis and marketing gloss without clarifying meaning. | Use the established type hierarchy. Apply color emphasis only when it communicates a real link, state, category, or approved semantic distinction. | Every differently colored headline fragment has a specific meaning; removing the color would remove useful information, not just decoration. |
| Repeated or unnecessary eyebrow labels | Small uppercase labels above every heading add visual noise and repeat information that the headline already communicates. | Start with a clear heading. Keep an eyebrow only when it adds useful context such as category, section ownership, status, or wayfinding. | Each eyebrow contributes information not already present in the heading or nearby navigation; remove redundant labels. |

### Five common template-driven design and copy pitfalls

Treat these as explicit review signals, not automatic proof that a design is poor. A technique may be appropriate in a specific context. The concern is unexamined repetition, lack of purpose, and use as a substitute for hierarchy or useful content.

1. **Purple/blue overload and gradients:** Do not default to saturated purple, blue-purple gradients, glowing surfaces, or gradient-filled calls to action. Preserve CEStudy's approved `#0754B5` brand blue and use it with restraint. A gradient is acceptable only when it serves a clear, documented purpose and does not weaken contrast or product identity.
2. **Everything centered:** Do not center every headline, paragraph, section, card, and control by habit. Choose alignment from the content and user task. Reading and technical material will generally benefit from left alignment; centered composition remains valid for compact states or content that is genuinely balanced.
3. **Em-dash-heavy copy:** Do not use em dashes as a default writing rhythm or as a shortcut for connecting every thought. Prefer concise, natural sentences and ordinary punctuation. An em dash is not prohibited when it is genuinely the clearest grammatical choice.
4. **Decorative color inside headlines:** Do not highlight arbitrary words in a headline with a different color solely to make the text appear more dynamic. Color emphasis must communicate a real semantic distinction, link, state, or approved brand role.
5. **Eyebrow-label overuse:** Do not place small uppercase labels above every heading or section. Keep an eyebrow only when it adds useful context, category, status, or wayfinding that the heading does not already provide.

The review question is not whether one of these techniques appears once. Ask whether it is repeated without a task-based reason, adds redundant emphasis, or makes CEStudy resemble a generic template.

### Choose layout by the job being done

| Pattern | Use when | Avoid when |
|---|---|---|
| Open layout | Reading, explaining a concept, displaying a short form or a small number of related controls. | A real boundary or state needs to be unmistakable and cannot be conveyed through hierarchy. |
| Card / contained surface | A self-contained destination, mixed-content item, independent summary, or workspace whose boundary helps the task. | Items are homogeneous and mainly need scanning, sorting, or comparison; a card is being used just to fill space. |
| List | Students scan, filter, sort, or move through similar subjects, lessons, questions, or discussions. | Each item has materially different content that benefits from a flexible preview. |
| Table | Values need side-by-side comparison, engineering reference lookup, or precise row/column relationships. | On narrow screens it becomes unreadable; provide a deliberate responsive alternative or labelled horizontal scrolling where appropriate. |
| Global navigation drawer | The current approved shell uses one left off-canvas drawer opened by the 44px menu control beside the canonical logo, on desktop and mobile. Keep its destination groups concise and task-relevant; do not add a parallel persistent sidebar. A dense workspace may have its own separate tools panel only when it supports real functionality. |
| Tabs | A small set of peer views within the same task/context, with easy switching and no need to compare all panels at once. | The content represents distinct destinations that need direct links, browser history, or independent sharing. |
| Accordion | Secondary detail is optional, long, or repeatedly hides content users do not always need. | Core instructions, critical assumptions, or step-by-step solutions should be visible to understand the task. |
| Modal/dialog | A focused, short decision or interruption requires attention and the underlying task should remain contextually present. | The task is lengthy, navigational, or requires comparing background content. Prefer a route, inline form, or suitable drawer. |
| Drawer/sheet | Contextual tools or secondary navigation must temporarily occupy limited space, especially in narrow practice layouts. | The content is central to the task and would be unnecessarily hidden behind another action. |
| Badge/status | A compact, meaningful state or category must be recognized at a glance. | It repeats a heading, adds decoration, or reports an unverified state. Use ordinary text for low-priority metadata. |
| Animation | It explains state change, preserves orientation, or provides useful feedback. | It delays reading or action, repeats celebration for routine steps, causes layout shift, or distracts. Respect reduced-motion preferences. |

### Visual hierarchy, spacing, density, and color

- **Hierarchy:** Give each region one clear primary focus. Use heading levels, alignment, proximity, and whitespace before adding color, borders, shadows, or badges. Do not create several competing primary actions in one region.
- **Spacing:** Continue the existing 4px/8px spacing increments. Use consistent spacing to show relatedness; do not add empty space simply to make a screen look premium or force content below the fold.
- **Typography:** Continue the Inter/system fallback stack, 16px starting body size, and responsive headings. Prioritize readable line length and line height for technical explanations; distinguish equation labels, assumptions, units, intermediate steps, and final answers without decorative type.
- **Density:** Use comfortable density for reading pages and progressive density for technical workspaces. Keep the question, answer state, diagram, and necessary tools visible in the approved flexible desktop Practice layout. On narrow screens, prioritize the question and place secondary tools in an accessible drawer, tab, or sheet.
- **Color:** Use `#0754B5` for primary actions, links, focus, and selected states as defined by semantic tokens. Keep status distinguishable without color alone. Do not introduce a new palette or theme option without documenting and approving it.
- **Surface effects:** Shadows, gradients, borders, blur, and rounded corners are allowed when they signal a meaningful boundary or interaction. Avoid stacking several of these on the same region without a reason.
- **Responsive behavior:** Preserve the website's information architecture while adapting presentation. Validate at the existing target widths of 320, 360, 390, 768, 1024, and 1440px; do not force a mobile-native tab bar onto the website.
- **Engineering content:** Use adequate space for equations, units, diagrams, tables, assumptions, source/provenance notes, and sequential solution steps. Avoid page-wide overflow; use a deliberate wrapping or labelled horizontal-scroll treatment for technical expressions where needed.

### Interaction and prototype truth

For each interactive element, document its trigger, result, available states, and recovery behavior. Consider loading, empty, success, error, disabled, focus, and permission/unavailable states where relevant. At minimum:

- Buttons and links have distinguishable actions and labels; do not style a nonfunctional placeholder as an active primary action.
- Menus and drawers define opening, closing, keyboard operation, focus handling, and narrow-screen behavior.
- Forms define validation, errors, disabled/submitting state, success feedback, and whether user input is preserved after recoverable failure.
- Filters show active selections, result counts where meaningful, and a clear/reset path.
- Progress, review, publication, offline, and reward states are derived from real data and clearly scoped; do not imply backend persistence when state is local or simulated.
- Prototypes identify unimplemented behavior. A screenshot or polished static prototype is not evidence that the feature exists.

### Gamification guardrail

Gamification must remain secondary to learning content and useful feedback. Each proposed XP, quest, streak, badge, leaderboard, or animation must specify: the learning/user benefit; the event or data that proves it; its visual priority; privacy and anti-abuse boundaries; and how it can be disabled or made less distracting where appropriate. A mechanic being independently toggleable does not approve its reward values, eligibility rules, ranking model, or default enabled state. Preserve the existing owner-approved boundaries in the [Modern Gamified UX/UI Decision Plan](../plans/2026-10-21-modern-gamified-ux-decision-plan.md); board-readiness claims and the deferred exam-specific features remain unapproved.

### Design quality review checklist (required before significant UI approval)

Reviewers and coding agents must answer all items before a significant new page, component family, or redesign is considered ready:

- [ ] Does the design communicate its purpose and target users clearly?
- [ ] Is purple/blue color and gradient use restrained, with the approved CEStudy blue used intentionally rather than a generic gradient aesthetic?
- [ ] Is alignment chosen for the content and task, rather than centering every section by default?
- [ ] Is copy natural and concise, without repetitive em-dash phrasing?
- [ ] Do differently colored words or phrases in headlines communicate real meaning rather than decorative emphasis?
- [ ] Does each eyebrow label add context or wayfinding that the heading does not already communicate?
- [ ] Is the layout appropriate for the actual task, rather than copied from a generic template?
- [ ] Are nested cards and containers limited to cases with a clear purpose?
- [ ] Can any decorative component be removed without reducing usability, comprehension, identity, or meaningful feedback?
- [ ] Is hierarchy clear without excessive colors, borders, shadows, badges, icons, or type styles?
- [ ] Does the page feel like CEStudy's Blueprint Academy direction rather than a generic template or clone?
- [ ] Is all educational content accurate, useful, and appropriately verified, with units, assumptions, notation, and worked steps where needed?
- [ ] Are primary actions discoverable, with one clearly prioritized action per focused task state and no unrelated competing primary buttons?
- [ ] Are genuine peer choices, such as multiple-choice answers, still equally understandable and prominent?
- [ ] Are advanced or conditional options progressively disclosed without hiding essential or frequently used controls?
- [ ] Are visible controls relevant to the current user, task, content availability, and state, with unavailable behavior represented truthfully?
- [ ] Have common and less-frequent tasks been checked for completion, time on task, errors/recovery, and discoverability without making unsupported retention claims?
- [ ] Have responsive behavior, keyboard access, focus visibility, contrast, zoom/reflow, reduced motion, and relevant loading/empty/success/error/disabled states been considered?
- [ ] Has the actual rendered implementation or prototype been inspected and tested, rather than accepted from its initial generated appearance?
- [ ] Has the page been compared with existing CEStudy pages and the relevant student task? Does each shared component improve clarity, behavior, or consistency?
- [ ] For substantial redesigns, has the reviewer explicitly examined visual hierarchy, content density, redundant containers, and unnecessary decoration?

**Required review note:** Record the target task, primary layout rationale, any intentionally nested containers or decorative effects and their purpose, states tested, viewport/theme coverage, content verification status, and known gaps. If a checklist item is not met, record it as a blocker or an explicitly accepted limitation rather than silently skipping it.

### Decisions and ownership

- **Binding:** The principles and checklist in this section; the Decision-Light Design standard and its five rules; approved brand assets/tokens, website-first direction, Light/Dark toggle with Light default and no System option; truthful content/status, accessibility, and existing security/publication boundaries.
- **Context-dependent:** Card use, visual effects, layout density, sidebars, tabs, accordions, dialogs/drawers, motion, and which non-essential options should be disclosed. Base visibility on task relevance and actual usage; do not hide frequent or essential controls just to reduce visible choices.
- **Owner approval required:** Changes to brand/logo geometry or palette, website information architecture, theme choices, proposed gamification defaults/rewards/eligibility/leaderboard policy, exam-readiness metrics, or other currently unapproved product scope.
- **Not evidence of a defect by itself:** A card, gradient, animation, hero, or dense layout. It becomes an issue when it lacks a task-based purpose, harms comprehension/accessibility/performance, or creates unjustified visual emphasis.

### Research basis

These rules are project-specific applications of established guidance, not universal prohibitions against particular visual patterns:

- [Material Design 3: Cards](https://m3.material.io/components/cards/guidelines) advises against forcing content into cards when spacing, headings, or dividers create a simpler hierarchy.
- [Material Design 3: Lists](https://m3.material.io/components/lists/guidelines) describes lists as optimized for reading comprehension and compact scanning.
- [Nielsen Norman Group: Card View vs. List View](https://www.nngroup.com/videos/card-view-vs-list-view/) summarizes the trade-off: lists favor efficient scanning/sorting, while cards can group mixed content.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) provides the accessibility baseline for contrast, reflow, keyboard operation, focus, and target size. Apply the success criteria appropriate to the project's declared conformance target and test actual pages.
- [MDN: Using media queries for accessibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using_for_accessibility) documents `prefers-reduced-motion` support.

## Decision-Light Design standard (binding)

**Owner decision:** Approved 2026-11-04. This standard applies to all significant CEStudy website and future product UI design, review, and implementation work. It supplements the task-based design quality standard above.

**Purpose:** Reduce avoidable interface decision friction so students can focus on finding, understanding, and practicing Civil Engineering material. Use Hick-Hyman Law as a design heuristic: in choice-reaction tasks, response time generally increases with the information uncertainty among available alternatives. The classic model is logarithmic for equally probable alternatives. This does not mean every additional button creates the same delay, that fewer choices always produce a better interface, or that reducing choices automatically increases retention. The task, probability and similarity of choices, user experience, and consequences matter. Validate design decisions with realistic student tasks rather than treating the law as a button-count formula.

### Five binding rules

1. **One primary action.** Identify the student's current task and state, then make its next useful action visually obvious. A screen may contain distinct task regions, but each focused task region should have one clear primary action. Do not invent a call to action where the user is meant to read, compare, or explore.
2. **Prioritize the main button.** Give the primary action the strongest appropriate visual emphasis. Use the established CEStudy primary-button treatment and preserve contrast, visible focus, accessible names, and clear state feedback. Secondary actions should not compete with it.
3. **Hide unnecessary options through progressive disclosure.** Keep essential and frequently used controls available. Place genuinely advanced, infrequent, or conditional options behind a clearly labelled and discoverable control, such as "Advanced options" or a relevant settings/menu entry. Reveal conditional controls when their prerequisite becomes relevant. Do not make common tasks require repeated menu-diving.
4. **Avoid equally prominent competing actions.** Do not give unrelated actions in the same task region equal primary-button emphasis when one is clearly the next step. Use primary, secondary, and quiet/link treatments to communicate hierarchy. This rule does not apply to genuine peer choices that are themselves the task, such as multiple-choice answers, mutually exclusive decisions, or alternatives that students must compare. Those choices must remain equally understandable and appropriately prominent.
5. **Do not show irrelevant options.** Show controls that are relevant to the current user, task, content availability, and interaction state. Do not display controls for unavailable or unimplemented functionality as though they work. When a control is not yet available because a known sequential prerequisite has not been completed, keep it visibly disabled with a concise explanation when that helps the student understand the sequence; do not hide it in a way that makes the workflow undiscoverable.

### Guardrails and exceptions

- **Do not remove real learning choices.** Do not reduce, preselect, or visually demote answer choices, engineering solution alternatives, formula references, units, assumptions, source material, or comparison data when those items are central to the learning task.
- **Do not hide essentials.** Primary learning content, current task state, required inputs, frequently used study tools, accessibility controls, privacy/security information, error recovery, and necessary back, cancel, retry, or exit paths must remain available when the task requires them.
- **Make disclosed options findable.** A hidden option needs a clear label, an understandable reason for its placement, and a predictable route to reveal it. Prefer one secondary disclosure level; repeated layers of hidden menus are a warning sign, not a simplification strategy.
- **Base visibility on evidence.** Use task analysis, student observation, usage frequency, and support feedback to decide what is primary, secondary, advanced, or irrelevant. Do not assume that a control is unimportant merely because it is visually inconvenient.
- **Preserve security boundaries.** Hiding a UI control is not authorization. Supabase policies, server-side checks, route guards, and publication rules remain authoritative.
- **Do not optimize clicks alone.** A shorter interface is not automatically a faster or more successful one. Avoid adding clicks to common tasks just to make a screen look minimal.

### Required review and acceptance checks

Before approving a significant screen or flow, reviewers must verify:

- [ ] The target user, task, current state, and decision being made are identified.
- [ ] The primary action for each focused task region is named and its priority is visually clear.
- [ ] Secondary actions are visibly secondary unless they represent genuine peer choices.
- [ ] Genuine peer choices, including student answer choices, remain equally legible and are not artificially ranked.
- [ ] Every hidden control is genuinely advanced, infrequent, conditional, or irrelevant to the current state, and its reveal path is clear.
- [ ] Essential and frequently used content, controls, tools, accessibility support, and recovery paths have not been hidden.
- [ ] Unavailable and sequentially gated controls communicate their actual state without implying functionality that does not exist.
- [ ] Common and less-frequent tasks are both tested with realistic student scenarios across relevant viewport sizes, themes, and input methods.
- [ ] Usability checks consider task completion, time on task, errors/recovery, and whether students can discover secondary tools. Do not claim a retention improvement without longitudinal evidence.

**Audit status:** This document establishes the binding standard only. It does not claim that existing CEStudy routes have already passed a site-wide Decision-Light audit. That audit is a separate deferred work item and a prerequisite to beginning Blueprint Academy Phase 4.

### Research basis

- [W. E. Hick, *On the Rate of Gain of Information* (1952)](https://doi.org/10.1080/17470215208416600), the original choice-reaction-time study.
- [Proctor and Schneider, *Hick's law for choice reaction time: A review* (2018)](https://doi.org/10.1080/17470218.2017.1322622), a review discussing the law's scope, historical context, and limitations.
- [Oxford Academic, Introduction to Human-Computer Interaction, section on the Hick-Hyman Law](https://academic.oup.com/book/60808/chapter/528999086), explains the relationship between response alternatives, information, and choice reaction time.
- [Nielsen Norman Group, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/), guidance on keeping the most important options visible while making advanced or rarely used features available on request.
- [Appian SAIL, Progressive Disclosure](https://docs.appian.com/suite/help/26.3/sail/ux-progressive-disclosure.html), practical guidance for conditional controls, advanced options, and sequential flows.

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

- **Header and global navigation:** compact light-default header with the 44px menu control immediately before the canonical master logo. The control opens one left off-canvas navigation drawer on desktop and mobile. The drawer groups Learning, My learning, and Help and support; Year Levels stays nested under Learning; Subject Catalog appears once; Theme is under Preferences; owner tools are shown only after their real access gate is unlocked.
- **Year-Level navigation (planned):** hierarchy from 1st to 4th year, then semester and subject, based on verified curriculum/content metadata.
- **Future resource destinations (not current global navigation):** Review Materials Hub is a later product phase for Formula Sheets, Problem Sets with Solutions, and Video Tutorials. Show only real, published, reviewed resources when implemented; do not restore a global mega-menu or imply availability before then.
- **Equation renderer:** shared rendering path for inline/display math in lessons, formula sheets, problem sets/solutions, quizzes, results, forum discussions, and approved offline material.
- **Offline/download state:** consistent labels for available to download, downloading, downloaded, update available, failed, unavailable offline, stale, and removed, only where each state is applicable.
- **Theme toggle:** explicit Light/Dark preference; no System option is approved. Keep light as the initial default baseline and use approved device-local `cestudy:theme:v1` persistence with pre-React initialization; account synchronization is out of scope for the first release. Year levels opens the overview page, not Year 1.
- **Gamification controls:** XP/rewards, quests, streak freezes, badges, leaderboards, and retry-related reward behavior should be independently toggleable. Privacy and opt-in controls are user-respecting; anti-abuse/integrity safeguards remain mandatory while a reward feature is active.
- **Practice workspace:** target a flexible approximate 70/30 question/tools layout on desktop only when a real functional tool exists. At narrow widths, use a single-column question view and move actual supporting tools into an accessible drawer, tab, or sheet. Do not render an empty or inert tools panel.
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
- Current desktop navigation: compact header with a 44px menu control immediately before the canonical logo; one left off-canvas drawer contains Learning, My learning, and Help and support groups. Year Levels preserves the verified year → semester → subject hierarchy.
- The same drawer is used on tablet/phone browsers. Do not describe the older hybrid header, four-item quick navigation, or More menu as current. Review Materials, Mock Exam, full Community Forum, and signed-in Student Dashboard remain future product destinations, not current global nav entries. Do not assume the future native-app tab bar is the correct mobile-web navigation.
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
| Reduced motion | Disable nonessential transitions and entrance effects | Respect OS preference and provide an accessible in-app control where needed |
| Sound effects | Optional supplemental feedback | Never autoplay; always provide visible/accessibility-equivalent feedback and a reliable mute path |

- Prefer `transform` and `opacity` over animations that trigger layout.
- Avoid continuous parallax, autoplay, large video backgrounds, excessive backdrop blur, and new animation libraries without a demonstrated need.
- Reserve image dimensions and optimize assets; do not load hero assets larger than needed.
- Avoid duplicate catalog fetches and unnecessary React re-renders.
- Compare build size, mobile loading, layout stability, interaction responsiveness, and browser errors before and after the redesign.

## Content rule

**If a sentence does not help a student act, understand, or recover, remove it.** Do not add text to fill empty space. Do not repeat a heading in another sentence, claim content is reviewed without verification, or display meaningless/unnecessary statistics.

## Acceptance checks

- The real master logo is unchanged and legible against both the light and dark theme concepts.
- The current website navigation uses the compact menu/logo header and left off-canvas drawer on all viewport sizes; it preserves year → semester → subject and keeps the catalog destination unique. Future Review Materials, Mock Exam, full Community Forum, and private Student Dashboard features are not represented as current global navigation.
- The responsive website does not inherit the native app's five-tab structure without separate usability review.
- Inline/display equations render through the shared path, including fractions, nested fractions, matrices/vectors, subscripts/superscripts, units, and a readable invalid-expression fallback.
- Dark Mode applies consistently and persists according to the approved preference model.
- Offline Access only indicates an item is downloaded when its complete package is stored; download, failure, update, stale, remove, and unavailable states are explicit.
- Content licensing and publication approval are required before protected materials are made downloadable.
- Logo blue is used sparingly in both themes. Light-theme white surfaces remain part of the supported design and remain the initial default baseline; Dark Mode is available through the approved Light/Dark toggle.
- All current routes share the established tokens, typography, spacing, button behavior, and focus patterns. Reuse card patterns only when their semantic purpose matches the page task; do not require every route to use cards.
- Year levels links to an overview that lists all four years.
- No filler marketing statements or non-actionable metrics appear on the homepage.
- Hover/focus states work, and reduced-motion is respected.
- Desktop information architecture and primary journeys are clear at 1440px and 1024px; responsive layouts remain usable at 768px, 390px, and 320px.
- Contrast, keyboard behavior, route refreshes, and catalog/practice behavior remain intact without horizontal page overflow.
- CI, browser smoke checks, and available accessibility checks pass before merging.


## Revision record

- **2026-11-04:** Added the owner-approved, binding Decision-Light Design standard based on Hick-Hyman Law. Formalized the five rules, peer-choice and essential-control exceptions, progressive-disclosure guardrails, required review checks, and research references. Explicitly recorded that the existing-route audit is deferred and required before Phase 4. Documentation only; no application UI or behavior changed.

- **2026-11-04:** Expanded the design quality and anti-template standard with five explicit design/copy signals: purple/blue gradient overload, default-centered layouts, repetitive em-dash phrasing, decorative colored headline fragments, and redundant eyebrow labels. Expanded the required checklist from 12 to 17 items. Preserved context-sensitive exceptions, Blueprint Academy, existing brand assets/tokens, website-first IA, and approved theme behavior. Documentation only.

- **2026-10-29:** Added the binding design quality and anti-template standard, task-based layout selection guidance, nested-container acceptance criteria, interaction/prototype truth requirements, and a required design review checklist. Documentation only; approved product decisions and application code are unchanged.

- **2026-10-21T19:10:04+08:00 (Asia/Manila):** Added the requested website navigation model, native five-tab app design, Offline Access, LaTeX/equation rendering, and Dark Mode requirements. Documentation-only change.
- **2026-10-21:** Linked the modern gamified UX/UI decision plan and documented planning gates for quests, rewards, healthy engagement, exam evidence, and responsive navigation. Documentation-only change.
- **2026-10-22:** Recorded owner decisions: explicit Light/Dark toggle with existing light-default baseline; independently toggleable gamification mechanics; approved healthy-engagement safeguards including optional Night Owl; exam-specific PRC mapping, a dedicated past-question sourcing/permissions workflow, the proposed 100-question challenge and readiness measures deferred; hybrid global navigation, workspace-only collapsible sidebar and flexible 70/30 Practice layout approved. Documentation-only change.
- **2026-11-05:** PR #79 replaced the former hybrid/quick-navigation shell with one left off-canvas drawer on desktop and mobile. The compact header places its 44px menu control immediately before the canonical logo. The drawer groups Learning, My learning, and Help and support; Theme is under Preferences; duplicate destinations and unfinished Review Materials/Mock Exam global links were removed. This update aligns this design-system document with the merged current implementation.
- **2026-10-23:** Approved device-local theme persistence using `cestudy:theme:v1` and pre-React initialization for the first release. Account synchronization and cross-device theme sync remain out of scope.

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
- Keep the existing light-default baseline and provide the approved Light/Dark toggle. Use device-local `cestudy:theme:v1` persistence with pre-React initialization; account synchronization is out of scope. The design references are Discord for community/navigation, Duolingo for learning quests/rewards, GitHub for activity/progress, and Autodesk AutoCAD for a precise technical-workspace aesthetic. Use these references to inform CEStudy's own design, not to copy other interfaces.
- Offline packages need explicit version, availability, update, and removal states. Browser service workers/storage and native app local storage/synchronization are different technical implementations.
- Brand/service logos are sourced from SVGL (https://svgl.app/) when available and stored locally. Generic interface icons remain simple and visually consistent.


### Website-specific structure (current baseline, subject to redesign)

- **Current main baseline after PR #79:** a compact brand header with a 44px menu control immediately before the canonical CEStudy logo. The control opens the same left off-canvas navigation drawer on desktop, tablet, and phone.
- The drawer contains Learning (Home, Subject Catalog once, nested Year Levels, Math Foundations), My learning (device-local Progress), and Help and support (About, Contact, Support, Report a bug, Send feedback, Privacy notice). The Light/Dark toggle is in Preferences. The owner-only Feedback inbox is conditional on its actual unlock session.
- Review Materials Hub and Mock Exam are not global navigation entries; their legacy routes redirect to Subject Catalog. Community remains reachable by its direct route, but the full forum is not implemented. Dashboard/account/profile/history/streak functionality remains subject to the separate Phase 5 integration and its security gates.
- The old hybrid header, mobile quick-navigation row, and More menu are superseded, not the current navigation model.
- Dashboard progress/bookmarks must be private to the correct user, and weak-subject signals must show evidence/coverage rather than implying mastery from a tiny sample.
- Resource menus show real availability, review state, and provenance. Download only content whose source and redistribution rights have been approved.
- The Year Levels hierarchy remains operable within the navigation drawer at all widths. The mobile-browser shell uses the same off-canvas drawer pattern as desktop and does not inherit the native app tab bar.
- Offline Access should include a download manager for approved reviewer PDFs, formula sheets, and mock-test packages. Specify storage, source/version, update, removal, and offline-attempt synchronization before implementation.
- Use equation rendering across lessons, formula sheets, problem sets, quizzes, results, and forum posts/comments. Offline materials need local access to any required rendering assets.


### Future native mobile app

- The app Home supports a reviewed daily question, quick-start study streak, and recently opened modules where real content/history exists.
- The target native tab bar has five tabs: **Home**, **Subjects / Library**, **Practice**, **Calculator / Tools**, and **Profile**.
- **Home:** daily review question, streak entry, recent modules.
- **Subjects / Library:** year/subject catalog, structured reading, authorized reviewer PDFs and formula sheets for offline use.
- **Practice:** flashcards, customizable timed quizzes, and Shuffled Practice.
- **Calculator / Tools:** unit converter first; verified steel references and bounded concrete-learning references only after source review.
- **Profile:** saved formulas/questions, settings, Light/Dark toggle, Offline Access manager, account and privacy controls. Board-readiness measurements are not approved in the current plan.
- Offline timed-test packages need local question/answer/explanation data, math-rendering assets, clear timer behavior, and an explicit unsynced-attempt policy.
- Provide a Dark Mode toggle using shared semantic tokens and verify device-local `cestudy:theme:v1` preference restoration after refresh.
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
