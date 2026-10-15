# Basic Algebra sample question pre-review

**Date:** 2026-10-15  
**Result:** Mathematical pre-review completed. These are AI-assisted checks, not a human academic/content approval. **All eight questions must remain `needs-review` until a human reviewer signs off. Do not publish them based on this document alone.**

## Item-by-item check

| ID | Question | Answer checked | Result |
|---|---|---|---|
| `algebra-q1-linear-equation` | Solve (3x + 5 = 20). | (x = 5) | Correct. Subtract 5, then divide by 3. |
| `algebra-q2-distributive-property` | Solve (2(x - 3) = 14). | (x = 10) | Answer correct. The prior solution bypassed the distributive property despite the topic label; draft steps were corrected to distribute first. Human review still required. |
| `algebra-q3-fraction-coefficient` | Solve ((3/4)x = 18). | (x = 24) | Correct. Multiply by (4/3). |
| `algebra-q4-variable-both-sides` | Solve (5x - 2 = 3x + 10). | (x = 6) | Correct. Subtract (3x), add 2, divide by 2. |
| `algebra-q5-factor-quadratic` | Factor (x^2 - 5x + 6). | ((x - 2)(x - 3)) | Correct. The numbers -2 and -3 multiply to 6 and add to -5. |
| `algebra-q6-square-roots` | Solve over the real numbers: (x^2 = 49). | (x = pm 7) | Correct. Both roots are included. |
| `algebra-q7-rearrange-ohms-law` | Rearrange (V = IR) for (I), assuming (R \ne 0). | (I = V/R) | Correct under the stated restriction. |
| `algebra-q8-ratio-split` | Split 40 in the ratio 2:3. | 16 and 24 | Correct. Five units total; one unit is 8. |

A pedagogical mismatch was found in item 2: its prior solution did not demonstrate the distributive property named by the topic. The live draft and source seed were corrected to distribute first; the status remains `needs-review`. The remaining answers and solution steps showed no arithmetic mismatch in this pass.

## Required human review before any publication

A qualified Civil Engineering/math reviewer must independently:

- Confirm the prompt is clear and appropriate for the stated topic and year level.
- Check every option, the unique intended answer, and each solution step independently.
- Check notation, accessibility, and that the explanation teaches the method rather than only giving the answer.
- Confirm original authorship/usage rights and any required attribution. These seeds are labeled as original CEStudy drafts.
- Record reviewer identity or role, review date, and each item's approval or required correction in a separate review log.

A trusted maintainer may update a question to `published` only after the above is complete. Until then, keep all eight records at `needs-review`. The database currently confirms 8 unpublished records and 0 published records, while RLS restricts public question reads to rows with `status = 'published'`.
