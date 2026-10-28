# CEStudy Modern Gamified UX/UI Decision Plan

**Status:** Owner-reviewed planning record. Selected design directions are approved; feature implementation remains separately gated.  
**Prepared:** 2026-10-21 (Asia/Manila)  
**Decision update:** 2026-10-29 (Asia/Manila), anti-AI-slop standard linked; owner-approved gamification boundaries unchanged  
**Related plan:** [Website-First Information Architecture and Structure Plan](./2026-10-21-website-first-information-architecture-plan.md)  
**Related specification:** [UX/UI Design System](../specs/UX_UI_DESIGN_SYSTEM.md) (authoritative anti-AI-slop rules and required review checklist)

## Purpose and scope

This document defines how CEStudy should resolve five design and product questions raised by the modern, gamified website direction:

1. Whether the website should default to dark or light mode.
2. How quests, XP, streaks, badges, leaderboards, and possible future tokens should work.
3. How to make study rewarding without pressuring students into unhealthy routines or intrusive effects.
4. Which exam-specific extensions should remain out of scope unless the owner requests a separate proposal.
5. How navigation and the split-screen practice workspace should adapt across desktop, tablet, and phone browsers.

This is a decision plan, not an implementation specification. It adds no routes, components, business logic, database structures, RLS policies, question records, or release approvals. Existing features on PR #44 remain draft-branch work and must not be treated as functionality shipped to main.

## Decision register

| Area | Owner decision as of 2026-10-22 | Remaining boundary before implementation |
|---|---|---|
| Theme and visual language | Approved: explicit Light/Dark toggle. Keep the existing light-default baseline for now; do not silently switch to dark-first. | Use approved device-local `cestudy:theme:v1` persistence with pre-React initialization; account synchronization and cross-device sync are out of scope for the first release. Verify shared semantic tokens and contrast in both themes. |
| Quest and reward rules | Approved direction: XP, quests, streak freezes, badges, leaderboards, and retry/reward behavior must be independently toggleable. | Exact reward values, eligibility, uniqueness, retry behavior, privacy and anti-abuse rules still need definition. Safety/integrity controls must never be disabled while the related feature is active. |
| Healthy engagement | Approved: optional sound, reduced-motion support, and an optional Night Owl quest with safeguards. | Convert the approved principles into accessible acceptance checks. |
| Exam authenticity | Not approved in this plan. Do not scope current PRC CELE mapping, a past-question sourcing/permissions workflow, the proposed 100-question challenge, or readiness measurements here. | No official-format or board-readiness claims. Any future proposal requires a separate owner request. Existing content review/publication safeguards still apply. |
| Responsive navigation | Approved: hybrid global header, collapsible sidebar scoped to dense signed-in workspaces, and a flexible approximately 70/30 Practice workspace. | Specify exact responsive behavior and test the panel/sidebar at the planned viewport widths before implementation. |

## 1. Theme conflict and modern engineering visual language

### Existing requirement and newer direction

The owner confirmed on 2026-10-22 that CEStudy should have an explicit **Light/Dark toggle**. Keep the current light-default baseline for this plan; the new engineering-workspace direction should shape the dark theme without silently changing the initial default to dark-first. Do not add a System choice unless the owner separately approves it. Discord, Duolingo, GitHub, and Autodesk AutoCAD remain design inspirations for CEStudy's own interface, not interfaces to copy.

### Theme decision

| Choice | Status | Direction |
|---|---|---|
| Light theme | Supported and remains the initial default baseline for this plan | Preserve readable white/light surfaces and the current design baseline. |
| Dark theme | Approved as a full alternative | Use a coherent technical-workspace aesthetic, restrained accents, and complete semantic token coverage. |
| User control | Approved | Provide a clear Light/Dark toggle. Do not include a System option unless separately approved. |

The toggle resolves the need to support both preferences without approving a dark-first default change. The first-release preference model is approved: store `cestudy:theme:v1` on this device and restore it before React starts. Do not add account synchronization.

### Prototype and evaluation scope

Compare both theme variants on the same desktop flows:

- Public Home and year/semester/subject navigation.
- Review Materials page, long formula/equation content, and problem solutions.
- Student Dashboard with streak, progress history, quests (when enabled), and ordinary activity summaries; no board-readiness measure.
- Split-screen Practice session with question, diagram, timer, answer controls, and formula panel.
- Community problem thread, comment composer, and leaderboard.
- Dialogs, menus, charts, empty/error states, and focus indicators.

Candidate dark palette direction only, not finalized tokens:

- Deep slate or midnight surfaces with an AutoCAD-inspired precision-workspace feel. Do not reproduce AutoCAD's exact interface or imply affiliation.
- Existing CEStudy brand blue #0754B5 retained for brand continuity.
- Electric green for selected success/progress accents, neon blue/cyan for selected interactive states, and safety orange for carefully scoped warnings.
- Use clean technical panels, strong alignment, restrained grid/line details where useful, and readable spaces for engineering diagrams and equations. Avoid visual clutter and excessive glow.
- Semantic colors must remain distinguishable in both themes. Do not use neon fills or glow as the primary way to communicate status.

Evaluation criteria: text and control contrast, equation/diagram readability, long-session comfort, information hierarchy, visual crowding, keyboard focus, reduced-motion behavior, perceived loading performance, and consistency across routes. Use contrast checks and manual keyboard/screen-reader review rather than choosing colors by appearance alone.

### Theme decision and remaining implementation details

- Approved: explicit Light/Dark toggle; the existing light-default baseline remains in effect.
- Do not silently switch the site's default to dark-first or add a System choice.
- Approved first-release behavior: device-local `cestudy:theme:v1` with pre-React initialization. Account synchronization is out of scope; PR #44's draft implementation is not itself merge approval.
- Ensure shared semantic tokens keep reading pages, technical workspaces, equations, charts, dialogs, and focus states legible in both themes.

## 2. Quests, XP, streaks, badges, leaderboards, and future tokens

The following are proposed rules to evaluate, not approved backend behavior or an approved data model.

### Owner decision: configurable feature toggles

As of 2026-10-22, the owner wants the gamification mechanics to be individually switchable rather than treated as one inseparable bundle. Apply this direction to XP/reward display, quests, streak freezes, badges, leaderboards, and retry-related reward behavior. Use clear controls/configuration so a mechanic can be enabled or disabled independently. A toggle is not approval of the example reward amounts or completion rules, and not every feature must be enabled by default. Leaderboard participation must remain a user choice where privacy is involved. Anti-abuse and integrity safeguards are mandatory whenever a related reward feature is enabled and must not be toggled off as a way to bypass them.

### Candidate quest catalogue

| Quest | Owner-proposed reward | Proposed eligibility to evaluate | Required safeguards |
|---|---:|---|---|
| The Daily Load | +20 XP; proposed to maintain the streak | Complete the eligible Daily Review Question and reach its result/explanation state | One reward per dated quest instance; answering incorrectly should not automatically invalidate a genuine attempt |
| Stress Test | +50 XP | Score at least 80% on a defined five-question Statics of Rigid Bodies quiz | Freeze the eligible pool/version for that instance; retries cannot repeatedly mint XP for the same instance |
| Night Owl | +30 XP | Complete an eligible module during a stated overnight window | Keep optional; do not present late-night study as better or multiply streak/leaderboard value because of the hour |
| Group Study | +100 XP | Participate in three eligible community discussion threads | Define eligible participation after moderation and anti-spam rules; avoid rewarding repeated low-value posts |

The reward values above reproduce the owner's examples for planning. They are not commitments and can be changed after balancing and abuse review.

### Reward and retry policy to decide

Before coding, write exact definitions for:

- **Quest instance:** how a daily, weekly, rotating, or special quest is versioned and when a new eligible instance starts.
- **Completion:** the event that proves the user completed the requirement. A page view alone must not count as a completed quiz or module.
- **Reward uniqueness:** the same completion event must not award XP more than once, including after refresh, retries, device reconnect, offline sync, or duplicate requests.
- **Retries:** repeated practice should remain useful for learning. Award rules must distinguish additional learning activity from farming the same reward.
- **Partial completion:** specify whether interrupted quizzes or offline attempts save progress and which can qualify for rewards.
- **Quest changes:** define what happens if a quest's question pool, criteria, or reward changes while a user is working on it.
- **Correction and abuse review:** define what happens to wrongly awarded, duplicated, or fraudulent rewards and how a user can report a problem.

A reward ledger and a clear separation between earning rules and displayed totals are recommended design concepts, not an authorization to define database tables yet. If XP affects competitive rankings, the design must identify a trusted source for validating rewards. Client-only totals can be edited or replayed and should not be treated as secure leaderboard evidence.

### Streak and streak-freeze policy

Decide the following before a streak counter or freeze inventory becomes authoritative:

1. Which meaningful activity qualifies for a study day. The Daily Load is a proposed candidate, not the only possible rule.
2. Whether a wrong answer still counts when the student completes the question and reviews the explanation.
3. Which date and timezone define a study day, including daylight/timezone changes and offline use.
4. How the 10 PM to 2 AM boundary is attributed when a quest crosses midnight.
5. Whether streak freezes are earned, allocated, or otherwise available; how many can be held; when one is used; and whether a freeze can be applied retroactively.
6. Whether guest activity counts, and how device-local streak data is reconciled if account sync is added later.
7. How a student sees a missed day or a freeze outcome without shaming copy or misleading continuity claims.

Do not show a freeze count, XP balance, streak calendar, or readiness/ranking value unless the underlying state can support that claim. A small streak affordance in the top navigation must not crowd the global navigation or practice timer.

### Badges, leaderboard, and tokens

- Badges need explicit, understandable criteria and a real completion source. A badge should not imply board-exam readiness or professional status.
- Prefer separate weekly XP and longest-streak leaderboards over one unexplained composite score. State each ranking's metric and weekly reset boundary.
- Nationwide and My School views require an explicit privacy/participation decision. School affiliation should be opt-in and verified before it changes a competitive ranking.
- Participation in a public leaderboard must not reveal email addresses. Preserve the owner's existing public-identity preference: display **CEStudy** as the public author identity, not an email.
- Define opt-in/opt-out, blocking/reporting, anti-cheating review, rank reset rules, and whether a user can study privately without appearing on a leaderboard.
- **Platform tokens are deferred.** Do not introduce a token balance, purchase, transfer, redemption, cash value, or token-based paywall until a separate use case, fairness review, and owner approval exist. XP should initially be treated as a learning-feedback score rather than money or proof of mastery.

## 3. Healthy engagement, motion, and sound

### Night Owl quest: approved with safeguards

The owner approved including Night Owl as an **optional** quest. Keep it low-prominence; students may ignore or hide it without penalties. Do not describe late-night studying as better, grant a streak multiplier or ranking advantage because of the hour, or send prompts encouraging students to stay awake. The illustrative +30 XP value remains provisional until reward rules are finalized.

### Motion and audio requirements

- Add a clear sound-effects preference. Sound must never autoplay before an intentional user interaction, and users need a reliable mute path.
- Sound is supplemental feedback only. Every quest completion, correct/incorrect answer, and milestone must also have visible and accessible non-audio feedback.
- Respect the operating-system reduced-motion preference and offer an in-app motion control if needed. Essential state changes must remain clear when animation is disabled.
- Use brief, purposeful transitions. Streak flame glow, reward pop, and milestone celebrations must not run continuously, block the next action, obscure equations, or shift the layout.
- Avoid punishing copy, loss-framed reminders, false urgency, excessive notifications, or designs that make users feel they must maintain a streak at the expense of rest, classwork, or other needs.
- Provide a calm path through practice: readable timer controls, pause/exit behavior where appropriate, and clear explanation of whether unfinished work is saved.

## 4. Deferred exam-specific scope

**Owner decision on 2026-10-22: not approved for this plan.** Do not pursue or implement the current PRC CELE subject-structure mapping, a dedicated past-question sourcing/permissions workflow, the proposed 100-question challenge, or readiness measurements as part of this planning change. Do not describe a CEStudy challenge as an official-format simulation or present a board-readiness gauge based on this proposal.

The Mock Exam Portal may remain in the high-level website information architecture, but the exam-specific items above are deferred and are not implementation commitments. This decision does not waive ordinary content review, publication controls, or the requirement not to publish materials without appropriate approval. Any future proposal for the deferred items requires a separate owner request and review.

## 5. Navigation, collapsible sidebar, and split-screen practice

### Keep global navigation and workspace navigation distinct

The current website-first target is a hybrid global header with Year-Level dropdown, Review Materials Hub, direct Mock Exam Portal and Community Forum links, plus the private Student Dashboard/account control. The owner approved a collapsible sidebar only for dense signed-in workspaces; it must not replace the public global header everywhere.

Compare three navigation models:

| Model | Best fit to evaluate | Trade-off |
|---|---|---|
| Hybrid header with a scoped collapsible sidebar | Public pages use the current hybrid target; a sidebar appears only in dense signed-in dashboard/workspace contexts | Requires consistent active states and a clear difference between public and workspace navigation |
| Persistent collapsible sidebar | Learning library, dashboard, and practice share a strong app-like left navigation | Can consume the space needed for problem statements, diagrams, tables, and solutions |
| Contextual workspace navigation | Practice uses a compact toolbar and task controls while the rest of the website keeps the hybrid header | May feel different from Dashboard unless shared patterns and navigation labels are consistent |

**Approved direction (2026-10-22):** use the hybrid global header on public pages and a collapsible sidebar only in dense signed-in workspaces. Do not add a permanent left rail to every page.

### Split-screen Practice constraints

The approved desktop starting point is a flexible layout with the problem area at roughly 70% and the tools/rewards panel at roughly 30%. These are adjustable proportions, not fixed widths.

The question area must retain room for complete LaTeX, diagrams/images, accessible answer controls, unit-aware numerical inputs where appropriate, explanations, and the timer. The supporting panel may contain pacing guidance, XP status, and a formula cheat sheet, but it must be collapsible or dockable so the core question is not squeezed.

At 1024px and narrower, compare a collapsed global sidebar, a collapsed/right-drawer tools panel, and an alternate layout. At 768px and phone widths, do not compress the three-column experience. Use a single-column question view with tools in a drawer, tabbed panel, or explicitly opened sheet. Timer, answer status, and submit/exit controls must remain visible and keyboard accessible.

### Responsive test targets

Plan and test the main workflows at 1440px, 1024px, 768px, 390px, and 320px. Check:

- No page-wide horizontal overflow, clipped diagrams, or clipped equation expressions.
- Global navigation, year/semester/subject menus, sidebar open/close, and focus restoration work using keyboard, pointer, and touch.
- Practice remains usable without the right-side panel; opening it does not obscure the current question, timer, or submitted answer.
- Mobile layouts use a distinct responsive arrangement, not a squeezed desktop sidebar and 70/30 split.
- Reduced motion, audio off, zoom, visible focus, and readable errors are covered in both themes.

## 6. Decisions and remaining implementation gates

Owner decisions recorded on 2026-10-22:

1. **Theme:** provide a Light/Dark toggle, retain the light-default baseline, and use approved device-local `cestudy:theme:v1` persistence with pre-React initialization. Do not add account synchronization.
2. **Gamification:** make XP/rewards, quests, streak freezes, badges, leaderboards, and retry-related reward behavior independently toggleable. Exact award criteria, anti-abuse rules, retry semantics, date/timezone boundaries, leaderboard privacy, and default feature states remain to be designed. Defer platform tokens.
3. **Healthy engagement:** optional sound, reduced-motion support, and an optional Night Owl quest are approved with the safeguards in Section 3.
4. **Exam-specific extensions:** current PRC mapping, the past-question sourcing/permissions workflow, the proposed 100-question challenge, and readiness measurements are explicitly out of scope for this plan.
5. **Navigation and Practice:** use the hybrid global header, scope the collapsible sidebar to dense signed-in workspaces, and use an approximate 70/30 question/tools layout with a collapsible or dockable panel and a single-column phone layout.

### Planning exit criteria

Before implementing a feature, write a separate implementation plan with acceptance criteria and tests for that feature. In particular:

- Define exact XP/quest completion events, reward uniqueness, retry rules, and streak/timezone/freeze behavior.
- Define badge criteria and leaderboard privacy, opt-in/opt-out, ranking boundaries, and anti-abuse handling.
- Verify device-local theme persistence through an actual refresh and test both themes, optional audio feedback, reduced-motion behavior, and keyboard/accessibility states.
- Test the approved navigation model at 1440px, 1024px, 768px, 390px, and 320px, preserving access to the question, timer, answer state, and controls.
- Apply existing content review and publication requirements to all study materials without treating this plan as approval to publish content.

## Visual hierarchy and anti-slop guardrail

Follow the binding [Anti-AI-slop design standard](../specs/UX_UI_DESIGN_SYSTEM.md#anti-ai-slop-design-standard-binding) for any future screen or interaction design. In particular, do not let XP, quests, streaks, badges, leaderboards, or celebration effects dominate the learning task. Each mechanic must explain what it measures and why it helps the learner; use verified activity, modest visual priority, and accessible opt-out/reduced-distraction controls. This link does not approve unresolved reward values, eligibility, leaderboard rules, or exam-readiness measures.

## Explicit non-goals

This decision plan does not authorize application code, new routes, database migrations, tables, RLS policies, server reward functions, public leaderboard data, question-bank changes, offline packages, OAuth changes, deployment changes, or changes to PR #44's status and release gates.
