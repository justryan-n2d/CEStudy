# Lesson Reader: Textbook-Style Presentation Plan

Date: 2026-11-08  
Target PR: https://github.com/justryan-n2d/CEStudy/pull/81  
Target branch: feat/phase4-practice-question-validation-2026-11-05  
Status: Owner-requested implementation; review and CI verification required.

## Goal

Make the student lesson reader read like a carefully typeset learning text, using the owner-provided Mathalino screenshots as a visual reference. The screenshots guide content hierarchy and spacing only; CEStudy must use its own original lesson content and preserve attribution/source requirements.

## Binding presentation decisions

1. Keep explanatory prose left-aligned and readable.
2. Center display equations. Give each equation generous space above and below without clipping, forcing horizontal page overflow, or left-aligning it on mobile.
3. Present sample/worked problems as standalone centered prompts rather than ordinary unordered/ordered-list entries. Where an example includes a governing formula, keep that formula centered as display math.
4. Keep solution explanations and numbered solution steps in their original logical order. Do not convert solution steps into decorative bullets.
5. Add a bulleted legend only when the topic needs symbol, variable, unit, or diagram-label definitions. If the topic has no meaningful legend, do not invent one. Other lists remain semantic lists only when they represent a real set of items.
6. Do not display a Learning Objectives section in the student lesson body. Retain every lesson's objectives as structured metadata; never delete them as part of presentation work. The existing `subject_lessons.learning_objectives` field is parsed into `SubjectLesson.learningObjectives`, included in StudyPage topic search/snippets, used by `getRelatedLessons` to rank related lessons, and may supply the short description beneath a recommended lesson. These metadata-driven uses are distinct from rendering an objectives section in the lesson body. Keep the field and its consumers intact unless a separately reviewed product decision changes them.
7. Suppress the lesson-reader sections titled “Key Method”, “Common errors to avoid”, and “One-step and two-step equations, example”. Suppression applies to the student reader presentation only. Do not delete or rewrite Supabase lesson rows or alter the curriculum catalog as part of this UI task.
8. Do not create generic “Key Method” or “Common errors to avoid” headings in future lesson-reader content. Prefer specific explanatory prose, worked examples, and relevant notation legends.

## Scope

In scope: src/pages/StudyPage.tsx, the student-reader presentation mode in src/components/MarkdownContent.tsx, lesson-reader-only styles in src/styles/global.css, focused tests, this plan, and the canonical roadmap.

Out of scope: Dashboard/recently studied cards, catalog and subject pages, Practice Workspace, progress/history, owner content-review rendering, the shared Markdown default mode, database schema/data, lesson publication, Supabase policies, OAuth, production configuration, and deployment.

## Implementation boundary

The Markdown renderer is shared with the owner content-review surface. Implement an explicit student lesson-reader variant and scope filtering/centering styles to that variant under the lesson article. The default Markdown rendering must remain unchanged. Keep stored Markdown and source records intact; do not perform data migration or live content mutation.

## Acceptance criteria

- [ ] The student reader does not render “Key Method”, “Common errors to avoid”, “Learning Objectives”, or the named one-step/two-step example section and their section content.
- [ ] Display equations are horizontally centered with clear vertical spacing on desktop and mobile.
- [ ] Sample-problem lists become centered standalone problem prompts without list markers.
- [ ] Legitimate legends remain real unordered lists when authored and needed; no legend is fabricated.
- [ ] Conceptual prose and worked solution steps retain their logical order and readable alignment.
- [ ] Owner review and other default Markdown consumers retain their previous headings/list presentation.
- [ ] No unrelated dashboard, progress, practice, data, or publication behavior changes.
- [ ] Focused tests, lint, production build, and the PR's applicable CI/browser checks pass. Inspect both themes and responsive widths; automated checks do not replace the owner’s physical-device review.

## Verification notes

The existing MarkdownContent is shared by the student Study page and owner Content Review page. A dedicated rendering variant is therefore required to keep this request page-scoped. Do not claim stored lesson data was edited: all UI filtering in this plan occurs during presentation. The `learning_objectives` structured field is retained and remains available to search and recommendation logic; hiding its Markdown section does not remove or invalidate that metadata.

## Change history

- 2026-11-08: Initial owner-approved presentation contract for the PR #81 lesson reader revision.
