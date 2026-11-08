# Shared Lesson Content Presentation Standard

Date: 2026-11-08  
Target PR: https://github.com/justryan-n2d/CEStudy/pull/81  
Target branch: feat/phase4-practice-question-validation-2026-11-05  
Status: Implemented in PR branch; exact-head CI and preview verification pending.

## Goal

Apply one consistent textbook-style lesson presentation contract to both:
- Owner Content Review lesson preview (including the preview of unsaved editor changes).
- Student-facing Study / Lesson Reader.

The contract applies to every lesson subject and topic, not only Algebra Foundations. The owner-provided Mathalino screenshots are a visual reference for hierarchy and spacing, not a source for copying lesson prose.

## Binding content and presentation decisions

1. Keep explanatory prose left-aligned, readable, and in its original teaching order.
2. Center display equations in both preview surfaces. Give them deliberate vertical whitespace above and below. On narrow screens, preserve horizontal accessibility and avoid clipping or page overflow.
3. Present sample/worked problem statements as standalone centered prompts without list markers. This includes authored “Example:” / “Problem:” statements, example prompts formatted as standalone bold Markdown lines, and the first prompt paragraph following a “Worked example” / “Solved example” heading. The following solution explanation and numbered working steps remain in their natural order and retain semantic ordered lists.
4. When a topic has a real set of notation definitions, units, variables, or diagram labels, retain it as a semantic bulleted legend. Do not invent a legend for topics that do not need one. Other genuine lists remain lists.
5. Do not display generic “Key Method”, “Common errors to avoid”, “Common errors”, “Common mistakes”, or singular “Common mistake(s)” sections in lesson content. Prefer specific explanatory prose, examples, and meaningful notation legends instead. This is a content rule for all existing and future lesson topics, not a label-only visual hide for one lesson.
6. Remove the specifically rejected “One-step and two-step equations” example section from the Solving Linear Equations lesson. Preserve the underlying inverse-operations concept in the preceding conceptual explanation; do not keep that rejected section or its worked example.
7. Do not display a “Learning Objectives” / “Learning objective” section inside lesson Markdown. Retain each lesson's structured objectives separately in `subject_lessons.learning_objectives`. They remain available to the application model, topic search/snippets, related-lesson ranking, and recommendation descriptions. Never delete or empty that metadata as part of lesson presentation cleanup.
8. “Key takeaway” is not the same as the rejected “Key Method” section. Retain topic-specific takeaways unless a separate content decision changes them.
9. Apply these rules in both Owner Content Review preview and the student Lesson Reader. The owner preview must show the same cleaned lesson presentation as students, while its title/status/editor fields and review workflow remain unchanged.

## Scope

In scope:
- `src/components/MarkdownContent.tsx`: shared `lesson-reader` presentation variant and content transformations.
- `src/pages/ContentReviewPage.tsx`: owner lesson preview uses the shared variant, including unsaved editor Markdown.
- `src/pages/StudyPage.tsx`: student lesson content continues to use the same shared variant.
- `src/styles/global.css`: shared centered equation and sample-problem layout for both surfaces.
- Focused student and owner preview tests.
- Existing lesson Markdown in Supabase, across all currently existing subjects/topics.
- This plan and `docs/MASTER_ROADMAP_FOR_CESTUDY.md`.

Out of scope:
- Dashboard / Recently Studied cards, catalog and subject discovery layouts, Practice Workspace, progress/history, question content, lesson objectives metadata, lesson IDs/titles, curriculum sequence, review notes, approval/publication status, schema, RLS/grants, OAuth, and production deployment.
- Creating lesson records for subjects that do not yet have lesson content. The shared renderer rule will apply automatically when those lessons are authored.

## Implementation and data boundary

- Both owner and student lesson preview surfaces use the same `MarkdownContent` `lesson-reader` variant. The default Markdown variant for non-lesson contexts remains unchanged.
- The rendering transformation also handles Markdown edits that have not yet been saved in Owner Content Review.
- Existing Supabase lesson body Markdown was cleaned because some content existed only in database rows and would otherwise continue to appear in both previews. This was a content-only update to `subject_lessons.lesson_markdown`; no schema/migration was necessary.
- The separate `learning_objectives` JSON arrays, statuses, IDs, slugs, titles, source notes, review notes, and reviewed timestamps were not changed.
- The one-/two-step worked-example section was removed from the body while the general inverse-operations explanation was retained in the preceding concept section.
- No raw lesson content is copied into this public repository documentation.

## Supabase content cleanup record

A guarded update was applied to all 14 lesson rows present in the CEStudy Supabase project at the time of the change:
- 13 `basic-algebra` lessons remained `needs-review`.
- 1 `ui-inspection-demo` synthetic inspection lesson remained `published`.
- Removed matching “Common errors”, “Common mistakes”, “Key method”, “Learning objective(s)”, and the one-/two-step example section where present.
- All 43 structured learning objectives were retained (40 across Algebra Foundations and 3 in the UI inspection demo).
- Post-update verification confirmed no targeted section heading remained in any of the 14 Markdown bodies and all 14 records retained their previous statuses.

No lesson records currently exist for other catalog subjects. Those will receive the same rules through the shared renderer when content is added; no placeholder content or new lesson rows were created.

## Acceptance criteria

- [x] The owner preview and student lesson reader both use the shared textbook-style lesson presentation.
- [x] Generic Key Method, Common Errors, Common Mistakes, Learning Objectives body sections and the rejected one-/two-step example section are removed from existing stored lesson Markdown where present.
- [x] Structured learning objectives remain intact and continue to be used as metadata.
- [x] Display equations receive centered alignment and generous vertical space in the shared lesson presentation.
- [x] Sample problems become centered standalone prompts without bullets; genuine solution steps and legends remain semantic lists.
- [x] The shared renderer applies the same behavior to future topics and subjects.
- [x] On application commit `2117d81d95b1b19646506822a45d5b8d036ad614`: 36/36 test files and 236/236 tests passed; ESLint, production build, Pages routing/security-header packaging, and backup syntax/encryption/retention checks passed.
- [x] Chromium theme/responsive checks passed 1,698/1,698 assertions across populated lesson checks, Light/Dark themes, KaTeX readability, and overflow at the 320/390/768/1024/1440px viewport matrix. Connectivity/skeleton browser verification passed 613/613 assertions. Secret scan passed.
- [ ] Supabase isolated migration/RLS CI could not reach the test phase: Supabase CLI 2.84.2 installation failed because the GitHub release checksum download returned HTTP 504. The stack and migration/RLS tests were skipped; rerun this job when the release endpoint is available. This is an infrastructure/setup failure, not a reported migration or RLS assertion failure.
- [ ] Owner verifies the populated Owner Review and student Lesson Reader previews on a physical mobile device, including long formulas, Light/Dark themes, and topics with and without a notation legend.

## Verification and release notes

The Markdown renderer is shared with other Markdown contexts. Only the explicit `lesson-reader` variant applies these rules; generic Markdown consumers retain their default behavior. Owner Content Review's preview now opts into that shared variant intentionally.

Application commit `2117d81d95b1b19646506822a45d5b8d036ad614` passed the application CI and browser jobs listed above. Cloudflare Pages deployed this exact commit to [the current preview](https://68a30ed0.cestudy.pages.dev). Owner preview: `/owner/content-review`. Student lesson route pattern: `/study/:subjectSlug/:unit` (published lessons only). The isolated Supabase migration/RLS CI did not execute because the CLI download failed with HTTP 504; do not treat that job as passing.

This PR remains a draft and is not merged. No Cloudflare production deployment occurred. The Supabase content-only update has been applied and verified.

## Change history

- 2026-11-08: Expanded the original student-only lesson-reader request to the Owner Content Review preview and all existing Supabase lesson records; retained all structured learning-objective metadata and documented the all-subject future-content rule.
