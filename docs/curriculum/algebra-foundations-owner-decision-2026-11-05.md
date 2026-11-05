# Owner Decision: Algebra Foundations Opening Sequence

**Decision date:** 2026-11-05  
**Status:** Approved by the CEStudy owner  
**Applies to:** Algebra Foundations curriculum, student lesson navigation and reader, and private owner content-review interface

## Binding decisions

1. **The first actual lesson is titled exactly “Solving Linear Equations.”** It is the first academic lesson learners encounter in Algebra Foundations.
2. **Do not create or include a readiness diagnostic.** There is no required diagnostic, optional diagnostic, separate Algebra Readiness phase, or diagnostic gate before the first lesson. Do not replace the removed diagnostic with another renamed assessment.
3. **Use lesson titles only in visible lesson labels.** Student-facing lesson lists, lesson-reader headers, and the private owner review list/detail should display the lesson title without “Unit 1,” “Unit 2,” “Unit 3,” numbered prefixes, or equivalent sequence badges/sub-labels.
4. **Keep ordering metadata internal.** Existing database sequence fields and route parameters may continue to determine order and identify lessons. They must not be rendered as student- or owner-visible “Unit N” labels.
5. **Keep the first lesson at college-algebra level.** It should teach equivalent equations and inverse operations, one-step and two-step equations, multi-step equations with distribution and like terms, variables on both sides, fractional/decimal coefficients, special cases (one solution, no solution, infinitely many solutions), suitable word problems, and solution verification. It must not be replaced by an elementary arithmetic lesson.

## Curriculum implementation notes

- The first lesson's content and examples must be written for college students. Worked examples should show mathematically valid transformations and checks, with progression from simple linear equations to multi-step forms.
- Arithmetic, fractions, signed numbers, expression simplification, and exponent skills may be reviewed within relevant lessons or practice when needed. They do not form a diagnostic stage that precedes the first lesson.
- Other topic groups remain in the syllabus, subject to subsequent academic review. This decision fixes the opening lesson and removes the diagnostic; it does not claim that every later topic has received new faculty approval.
- The syllabus should use plain lesson-title headings. Do not number lesson headings as units. Assessment references should use “lesson check” or “topic check,” not “unit check.”

## Existing Supabase data and scope of this documentation change

The live CEStudy database was inspected on 2026-11-05 and still contains a legacy draft row with ID `algebra-foundations-unit-00`, titled “Readiness Diagnostic: Find the Skills to Review,” and status `needs-review`. This row is not part of the approved curriculum and must not be surfaced in the lesson pathway, owner lesson list, or student API. It has not been deleted or modified by this documentation-only decision. Any database retirement/deletion and associated order-key changes must be handled as a separate, explicitly reviewed data change.

This commit changes repository documentation only. It does not modify Supabase rows, lesson content, application behavior, publication status, PR #81 implementation, or production deployment.

## Implementation acceptance checks

- The first visible and first ordered Algebra Foundations lesson is “Solving Linear Equations.”
- No readiness diagnostic or Algebra Readiness phase appears in the lesson sequence, student navigation, or private lesson-review list.
- No visible lesson label shows “Unit N” or an equivalent numbered prefix; the title is sufficient.
- Internal sequence metadata may remain but is not displayed.
- All actual lesson content remains unpublished until its normal item-by-item human review and explicit publication process is complete.
