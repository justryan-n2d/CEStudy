# CEStudy Modern Gamified UX/UI Decision Plan

**Status:** Planning proposal. Product decisions in this document are not yet approved for implementation.  
**Prepared:** 2026-10-21 (Asia/Manila)  
**Related plan:** [Website-First Information Architecture and Structure Plan](./2026-10-21-website-first-information-architecture-plan.md)  
**Related specification:** [UX/UI Design System](../specs/UX_UI_DESIGN_SYSTEM.md)

## Purpose and scope

This document defines how CEStudy should resolve five design and product questions raised by the modern, gamified website direction:

1. Whether the website should default to dark or light mode.
2. How quests, XP, streaks, badges, leaderboards, and possible future tokens should work.
3. How to make study rewarding without pressuring students into unhealthy routines or intrusive effects.
4. How to ground board-exam practice and readiness indicators in current, approved evidence.
5. How navigation and the split-screen practice workspace should adapt across desktop, tablet, and phone browsers.

This is a decision plan, not an implementation specification. It adds no routes, components, business logic, database structures, RLS policies, question records, or release approvals. Existing features on PR #44 remain draft-branch work and must not be treated as functionality shipped to main.

## Decision register

| Area | Current state | What must be produced before implementation |
|---|---|---|
| Theme and visual language | Earlier spec says light default; newer owner direction favors a dark-first CAD-inspired interface | Compare representative light-first and dark-first prototypes, choose default and preference persistence |
| Quest and reward rules | Reward names and example values proposed, not finalized | Written XP, streak, badge, retry, abuse-prevention, timezone, and privacy rules |
| Healthy engagement | Optional sounds and reduced motion required; Night Owl quest remains questionable | Approved defaults and wording that support student choice and avoid promoting late-night studying |
| Exam accuracy | A 100-question weekend challenge is proposed; official coverage and count not yet established | PRC-sourced exam blueprint, question provenance and rights, scoring/readiness methodology |
| Responsive navigation | Existing target is a hybrid top navigation; collapsible side navigation is a new proposal | Page-by-page navigation model and tested breakpoints, including a narrow practice workspace |

## 1. Theme conflict and modern engineering visual language

### Existing requirement and newer direction

The earlier website-first plan and design-system specification identify white/light as the default and dark mode as an option. A later owner request proposes dark as the main visual direction, inspired by Discord, Duolingo, GitHub, and CAD/code-editor interfaces. Neither requirement should be silently overwritten. The default-theme choice remains open until a comparison is reviewed.

### Options to compare

| Option | Description | Benefits | Risks and trade-offs |
|---|---|---|---|
| A. Light-first | Keep the existing white/light default and offer a complete dark mode | Least disruptive to the existing design baseline; familiar reading surface | Does not fully reflect the newer dark-first direction |
| B. Dark-first | Use a deep slate or midnight-blue default with a complete light alternative | Aligns with the modern engineering-workspace direction; gives dashboards and practice a distinctive identity | Requires careful contrast, equation readability, glow restraint, and design-system migration |
| C. System-led | Follow the device theme for the initial appearance, then honor an explicit user override | Respects device preference and can reduce surprise | Different users may see different first impressions; it does not guarantee a dark-first brand experience |

**Recommended exploration, not a final decision:** prototype Option B first because it best reflects the newest stated preference, then compare it with Option A using the same representative pages. The owner must approve the default after seeing the comparison. Option C remains available if system consistency becomes more important.

### Prototype and evaluation scope

Compare both theme variants on the same desktop flows:

- Public Home and year/semester/subject navigation.
- Review Materials page, long formula/equation content, and problem solutions.
- Student Dashboard with streak, readiness evidence, quests, and progress.
- Split-screen Practice session with question, diagram, timer, answer controls, and formula panel.
- Community problem thread, comment composer, and leaderboard.
- Dialogs, menus, charts, empty/error states, and focus indicators.

Candidate dark palette direction only, not finalized tokens:

- Deep slate or midnight surfaces.
- Existing CEStudy brand blue #0754B5 retained for brand continuity.
- Electric green for selected success/progress accents, neon blue/cyan for selected interactive states, and safety orange for carefully scoped warnings.
- Semantic colors must remain distinguishable in both themes. Do not use neon fills or glow as the primary way to communicate status.

Evaluation criteria: text and control contrast, equation/diagram readability, long-session comfort, information hierarchy, visual crowding, keyboard focus, reduced-motion behavior, perceived loading performance, and consistency across routes. Use contrast checks and manual keyboard/screen-reader review rather than choosing colors by appearance alone.

### Theme decisions still requiring owner approval

- Light default, dark default, or system-led initial theme.
- Light/Dark toggle only or Light/Dark/System.
- Whether the preference remains device-local or later synchronizes with an account. The current PR #44 branch's local preference is not evidence that account synchronization exists.
- Whether dark styling applies identically across the whole website or whether public reading and dense study workspaces need different surface treatments.

## 2. Quests, XP, streaks, badges, leaderboards, and future tokens

The following are proposed rules to evaluate, not approved backend behavior or an approved data model.

### Candidate quest catalogue

| Quest | Owner-proposed reward | Proposed eligibility to evaluate | Required safeguards |
|---|---:|---|---|
| The Daily Load | +20 XP; proposed to maintain the streak | Complete the eligible Daily Review Question and reach its result/explanation state | One reward per dated quest instance; answering incorrectly should not automatically invalidate a genuine attempt |
| Stress Test | +50 XP | Score at least 80% on a defined five-question Statics of Rigid Bodies quiz | Freeze the eligible pool/version for that instance; retries cannot repeatedly mint XP for the same instance |
| Night Owl | +30 XP | Complete an eligible module during a stated overnight window | Keep optional; do not present late-night study as better or multiply streak/leaderboard value because of the hour |
| Group Study | +100 XP | Participate in three eligible community discussion threads | Define eligible participation after moderation and anti-spam rules; avoid rewarding repeated low-value posts |
| The Board Simulator | +500 XP and proposed "Subgrade Master" badge | Complete an approved mock-exam package whose length and subject coverage have been verified | Keep the proposed 100-question count and badge name provisional; do not call it an official-format simulator without evidence |

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

### Night Owl quest decision

The Night Owl example is not approved merely because it has a proposed XP value. Compare two treatments:

- Keep it as an optional, low-prominence challenge that grants no additional streak multiplier or ranking advantage based on the hour.
- Prefer a more flexible challenge, such as "Study on Your Schedule", whose window is selected by the student and which rewards a completed study session without suggesting that overnight studying is ideal.

The second option is recommended for prototyping. If Night Owl remains, students must be able to ignore or hide it without penalties, and the interface must not send prompts encouraging them to stay awake.

### Motion and audio requirements

- Add a clear sound-effects preference. Sound must never autoplay before an intentional user interaction, and users need a reliable mute path.
- Sound is supplemental feedback only. Every quest completion, correct/incorrect answer, and milestone must also have visible and accessible non-audio feedback.
- Respect the operating-system reduced-motion preference and offer an in-app motion control if needed. Essential state changes must remain clear when animation is disabled.
- Use brief, purposeful transitions. Streak flame glow, reward pop, and milestone celebrations must not run continuously, block the next action, obscure equations, or shift the layout.
- Avoid punishing copy, loss-framed reminders, false urgency, excessive notifications, or designs that make users feel they must maintain a streak at the expense of rest, classwork, or other needs.
- Provide a calm path through practice: readable timer controls, pause/exit behavior where appropriate, and clear explanation of whether unfinished work is saved.

## 4. Exam authenticity, question sourcing, and readiness evidence

### Official exam evidence checked for this planning pass

The Professional Regulation Commission's **Board Resolution No. 01 (s. 2026)** changes the CELE schedule beginning with the March 2026 examination and subsequent schedules. It lists:

- First day: **Principles of Structural Analysis and Design**, 8:00 AM to 2:00 PM.
- Second day, 8:00 AM to 1:00 PM: **Applied Mathematics, Surveying, Principles of Transportation and Highway Engineering, Construction Management and Methods**.
- Second day, 2:00 PM to 6:00 PM: **Hydraulics and Principles of Geotechnical Engineering**.

The resolution also states that the structural-analysis subject has seventy-five computational questions, with the change intended to provide more solving time. This is evidence for that subject, not evidence that the whole CELE is a 100-question exam.

Sources checked 2026-10-21:
- [PRC Board Resolution No. 01 (s. 2026), adjustments beginning March 2026](https://www.prc.gov.ph/sites/default/files/2026-01%20Adjustments%20To%20Be%20Administered%20Starting%20With%20The%20March%202026%20Civil%20Engineers%20Licensure%20Exam.pdf)
- [PRC Civil Engineering Board page, including resolutions and Tables of Specifications](https://www.prc.gov.ph/Pages/PRBv4/CivilEngineering.htm)
- [PRC 2026 schedule of examinations](https://www.prc.gov.ph/2026-schedule-examination)

The proposed labels SEC, GEH, and AMSTE should be treated as candidate CEStudy group names, not canonical current exam labels, until they are mapped and reviewed against the current PRC resolution and applicable Tables of Specifications.

### Exam-simulation decision gate

Before using terms such as "Board Simulator", "official-format", or "Board Ready":

1. Identify the current official exam program and applicable Table(s) of Specifications for each subject area.
2. Map every candidate question to a subject, topic, intended difficulty, answer format, verified solution, source, and review status.
3. Record the source and reuse/license decision for every external or past-exam question. Do not assume that an exam item is free to republish.
4. Decide whether the proposed 100-question weekend challenge is a **CEStudy custom practice challenge** or a simulation of a verified official format. These are different product claims.
5. For an official-format claim, verify session lengths, subject distribution, question count, answer formats, permitted tools/calculators, and rules against current official material before configuring the simulator.
6. Make results disclose question count, topic/subject coverage, date/version of the blueprint, and the limits of the sample.

The proposed Board Readiness Gauge must not be a decorative percentage. Define its scoring and coverage using verified content and actual completed attempts, explain what evidence contributes to it, and show "Not enough data yet" when coverage or sample size is insufficient. Do not infer readiness from XP, streak duration, or a small sample alone.

The "Subgrade Master" badge also needs review for technical clarity and alignment with approved question content before it is used publicly.

## 5. Navigation, collapsible sidebar, and split-screen practice

### Keep global navigation and workspace navigation distinct

The current website-first target is a hybrid global header with Year-Level dropdown, Review Materials Hub, direct Mock Exam Portal and Community Forum links, plus the private Student Dashboard/account control. The new Discord-inspired collapsible left sidebar is a presentation proposal, not automatic approval to replace that global navigation everywhere.

Compare three navigation models:

| Model | Best fit to evaluate | Trade-off |
|---|---|---|
| Hybrid header with a scoped collapsible sidebar | Public pages use the current hybrid target; a sidebar appears only in dense signed-in dashboard/workspace contexts | Requires consistent active states and a clear difference between public and workspace navigation |
| Persistent collapsible sidebar | Learning library, dashboard, and practice share a strong app-like left navigation | Can consume the space needed for problem statements, diagrams, tables, and solutions |
| Contextual workspace navigation | Practice uses a compact toolbar and task controls while the rest of the website keeps the hybrid header | May feel different from Dashboard unless shared patterns and navigation labels are consistent |

**Recommended exploration:** start with the hybrid header on public pages, and prototype a collapsible sidebar only for dense signed-in workspaces. Do not add a permanent left rail merely to make the interface look more like Discord.

### Split-screen Practice constraints

The proposed desktop layout has a problem area at roughly 70% and a gamification/tools panel at roughly 30%. Treat those as starting proportions, not fixed widths.

The question area must retain room for complete LaTeX, diagrams/images, accessible answer controls, unit-aware numerical inputs where appropriate, explanations, and the timer. The supporting panel may contain pacing guidance, XP status, and a formula cheat sheet, but it must be collapsible or dockable so the core question is not squeezed.

At 1024px and narrower, compare a collapsed global sidebar, a collapsed/right-drawer tools panel, and an alternate layout. At 768px and phone widths, do not compress the three-column experience. Use a single-column question view with tools in a drawer, tabbed panel, or explicitly opened sheet. Timer, answer status, and submit/exit controls must remain visible and keyboard accessible.

### Responsive test targets

Plan and test the main workflows at 1440px, 1024px, 768px, 390px, and 320px. Check:

- No page-wide horizontal overflow, clipped diagrams, or clipped equation expressions.
- Global navigation, year/semester/subject menus, sidebar open/close, and focus restoration work using keyboard, pointer, and touch.
- Practice remains usable without the right-side panel; opening it does not obscure the current question, timer, or submitted answer.
- Mobile layouts use a distinct responsive arrangement, not a squeezed desktop sidebar and 70/30 split.
- Reduced motion, audio off, zoom, visible focus, and readable errors are covered in both themes.

## 6. Decision and review sequence

1. **Evidence pass:** confirm the current design-system baseline, PR #44 status boundaries, the current official CELE structure, and existing question/progress evidence. Do not infer missing behavior from a route or UI element.
2. **Theme comparison:** prepare equivalent light-first and dark-first concepts for Home, Dashboard, and Practice. Present contrast/readability trade-offs and obtain an explicit default-theme decision.
3. **Reward rules:** review each quest's completion criteria, reward amount, retry policy, timezone, streak effect, and anti-abuse behavior. Defer tokens.
4. **Health and accessibility review:** settle the overnight quest direction, sound default and controls, motion behavior, and reduced-motion requirements.
5. **Exam content review:** create an authoritative blueprint and question-provenance checklist before approving official-format labels, 100-question scope, readiness percentages, or associated badges.
6. **Navigation comparison:** test the hybrid header, workspace sidebar, and responsive Practice panel against the same tasks at the documented viewport widths.
7. **Owner review:** update this decision record and the shared design system with approved choices. Unapproved items remain marked open.
8. **Implementation planning:** produce separately reviewable implementation plans only after the design choices, content rights, data requirements, security boundaries, and acceptance checks are approved.

## Planning exit criteria

The planning phase is ready to be reviewed as complete only when:

- One theme-default option and its preference persistence model are approved.
- The desktop global navigation and scoped sidebar behavior are described unambiguously.
- Each first-release quest has a verifiable completion event, reward amount, award uniqueness rule, retry policy, timezone, and streak effect.
- Badge and leaderboard rules disclose criteria, privacy controls, ranking boundaries, and anti-abuse handling.
- Night Owl is either replaced with a flexible schedule challenge or kept optional under explicit safeguards.
- Audio and motion preferences, including non-audio feedback and reduced-motion behavior, are defined.
- Board-exam subject names, content mapping, question reuse rights, and readiness methodology are checked against current official sources.
- The 100-question challenge is accurately described as a custom practice challenge unless official-format evidence supports a simulator claim.
- Desktop, tablet, and phone layouts preserve readable practice content and essential controls.

## Explicit non-goals

This decision plan does not authorize application code, new routes, database migrations, tables, RLS policies, server reward functions, public leaderboard data, question-bank changes, offline packages, OAuth changes, deployment changes, or changes to PR #44's status and release gates.
