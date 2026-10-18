# CEStudy Stage 1 release audit

**Audit date:** 2026-10-18  
**Status:** Partial completion. This record does not approve a broad launch.  
**Scope:** Live Supabase access control, content publication state, question structure and first-pass mathematical consistency, backup evidence, CI/security checks, and remaining launch gates.  
**Live site:** https://cestudy.pages.dev

## Live database snapshot

A read-only query before the publication correction found 72 catalog subjects, 52 practice questions, and 13 lesson records. All 52 questions were already `needs-review`, with zero published questions. Two lessons were marked `published`, even though their source notes described draft material and one explicitly said human academic review was still required.

To prevent unreviewed learning content from being exposed, both lesson records were returned to `needs-review`, their review timestamps were cleared, and the private review notes recorded the reason. The catalog entry for Algebra Foundations was changed to `in-preparation`. This is a reversible status change, not a deletion.

**Verified state after the correction:**

| Check | Result |
|---|---:|
| Catalog subjects | 72 |
| Practice questions | 52, all `needs-review` |
| Published practice questions | 0 |
| Lesson records | 13, all `needs-review` |
| Published lesson records | 0 |
| Public/anonymous rows returned from `practice_questions` | 0 |
| Public/anonymous rows returned from `subject_lessons` | 0 |

The public catalog remains readable. The lesson and question policies remain published-only. RLS is enabled on all six inspected public-schema tables. Private feedback/support tables have no client grants and no client-facing policies; the Supabase security advisor reports three informational “RLS enabled, no policy” findings for those intentionally private tables. Do not add public policies to those private tables simply to clear the informational lint.

## Practice-question pre-review

A first-pass AI-assisted review covered all 52 live question records without copying their content into this public report.

Automated database checks confirmed:

- 52 of 52 records have the required nonempty prompt/topic/answer/explanation/source fields and a valid-sized choices and solution-steps array.
- 52 of 52 records have unique choices.
- 52 of 52 stored correct answers appear exactly once in their choice list.
- 52 of 52 remain `needs-review`; none has a review timestamp or independent reviewer note.

The mathematical/solution consistency pass did not identify a definite arithmetic or answer mismatch. This is a preliminary aid, not a substitute for a qualified human reviewer. It does not establish academic suitability, clarity, source rights, originality, or attribution. Do not publish any of the 52 questions or 13 lessons until each intended release item is independently reviewed and approved.

The original eight question review remains in [the 2026-10-15 pre-review](2026-10-15-basic-algebra-draft-review.md); it is a historical review of that original subset, not evidence that the current 52-question bank has human approval.

## CI, security, backup, and live-site evidence

- Main CI after the audit documentation merge passed lint, tests, dependency audit, build/header packaging, backup-crypto/retention checks, and isolated Supabase migration/RLS tests: [run 39142266631](https://github.com/justryan-n2d/CEStudy/actions/runs/39142266631). The matching full-history secret scan passed: [run 39142266706](https://github.com/justryan-n2d/CEStudy/actions/runs/39142266706).
- The active [Protect main ruleset](https://github.com/justryan-n2d/CEStudy/rules/25242389) requires PRs and successful CI, migration/RLS tests, and full-history secret scanning. Force-pushes and branch deletion are blocked.
- After the 2026-10-18 publication correction and Privacy notice merge, production Chromium smoke test [run 39143299712](https://github.com/justryan-n2d/CEStudy/actions/runs/39143299712) passed **135/135 checks**, zero failures. It verified direct routes including `/privacy`, all required response headers, the privacy footer link, live Supabase host/publishable key, published-only practice API returning zero rows, 320 px and 1440 px layouts, and no captured browser/runtime errors.
- The public [Privacy notice](https://cestudy.pages.dev/privacy) was shipped through [PR #42](https://github.com/justryan-n2d/CEStudy/pull/42); its CI and secret scan passed.
- The optional Google sign-in/Profile/Menu/streak feature has been carried forward onto current main in draft [PR #44](https://github.com/justryan-n2d/CEStudy/pull/44). Current-head CI [39144866445](https://github.com/justryan-n2d/CEStudy/actions/runs/39144866445), the full-history secret scan [39144866462](https://github.com/justryan-n2d/CEStudy/actions/runs/39144866462), and the Cloudflare Pages preview passed. Live extracts confirmed that `/login`, `/profile`, `/menu`, `/history`, `/streak`, `/progress`, `/community`, and `/privacy` resolve to their expected pages. This is preview-route verification, not a true Google OAuth end-to-end test. Google Cloud/Supabase provider and redirect configuration plus sign-in, cancellation, sign-out, and safe return-path testing remain open; keep PR #44 in draft.
- The actual encrypted 2026-10-15 backup was checksum-verified, decrypted, and restored into isolated local PostgreSQL 18.2, as recorded in [the restore drill](../deployment/restore-drill-2026-10-16.md). It predates the current 52-question/13-lesson live database state and the status correction documented here. A fresh encrypted backup is required. A restore into a separate managed Supabase project remains untested.

## Remaining Stage 1 release gates

1. Run and verify a fresh encrypted database backup after the 2026-10-18 content-status correction.
2. Restore that refreshed backup into a separate managed Supabase test project after explicit cost approval, then verify table counts, content statuses, RLS, and grants.
3. In Backblaze B2, confirm lifecycle cleanup handles old hidden versions without hiding current verified backups.
4. Confirm GitHub Actions failure-email notifications are enabled.
5. [x] Run a live Chromium smoke test after the database correction and Privacy notice release, including direct routes, headers, live Supabase host/key, and published-only API behavior. [Run 39142423824](https://github.com/justryan-n2d/CEStudy/actions/runs/39142423824) passed 135/135 checks with zero failures.
6. Complete manual accessibility and physical-device checks, including Android, keyboard, screen-reader/TalkBack, zoom, touch targets, and search/filter no-results recovery.
7. Configure Google OAuth in Google Cloud and Supabase, then test sign-in, sign-out, safe return destinations, and the profile/streak journey end to end. The new Profile and safe return-path implementation is in draft [PR #44](https://github.com/justryan-n2d/CEStudy/pull/44), not in production.
8. Have a qualified human reviewer approve the specific questions and lessons intended for release.
9. Run the documented 5–8 student pilot only after the blocking safety gates and content review pass. Record results and a go/no-go decision.

**Release decision:** Stage 1 is not complete yet. The app is deployed, the Privacy notice is live, and main CI/security plus 135/135 production Chromium checks pass. A fresh backup of current database state, managed-target restore, B2 lifecycle and GitHub failure-email confirmation, physical-device QA, human content approval, Google OAuth end-to-end testing if PR #44 remains in scope, and the student pilot remain necessary before broad launch.
