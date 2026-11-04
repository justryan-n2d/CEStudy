# CEStudy Mainline Verification and Product Phase 3 Audit

**Verified:** 2026-11-04  
**Main commit:** `ad96cc6148b95b563f247d9254bea5a6858b3cd0`  
**Documentation branch:** `docs/2026-11-04-roadmap-sync-phase3-plan`  
**Scope:** Read-only source, pull-request, CI, browser, live database and backup evidence review. This audit does not change application code, live database rows, publication status, authentication settings or production configuration.

## 1. Mainline and PR state

- PR [#69](https://github.com/justryan-n2d/CEStudy/pull/69) merged on 2026-11-04 at `ad96cc6148b95b563f247d9254bea5a6858b3cd0`. It adds the design-quality and anti-template standard and makes repository development guidance tool-neutral.
- PR [#67](https://github.com/justryan-n2d/CEStudy/pull/67) is the consolidated Google auth/profile/local history/streak candidate. It remains open and draft. Its head is `43aa6de27c30cca098f542597497b74102cf8442`; against current `main` it is 99 commits ahead and 19 behind, diverged, with GitHub reporting `mergeable=false`.
- PR #44 is an older parallel candidate. PRs #64-#66 are earlier or stacked source slices. They are not separate merge targets. Do not merge any of them independently.
- The current product sequence is: product roadmap Phase 3 Catalog/Subject/Study, Phase 4 Practice Workspace, then Phase 5 reconciliation of PR #67. The overall lifecycle plan's Phase 7 release gates continue to apply.

## 2. Current automated verification

| Check | Evidence | Result |
|---|---|---|
| Lint, tests, dependency audit, production build | [CI run 41775563340](https://github.com/justryan-n2d/CEStudy/actions/runs/41775563340) | Passed |
| Unit tests | Same CI run | 151 tests across 26 files |
| Supabase migration and RLS tests | Same CI run | Passed |
| Theme/navigation browser suite | Same CI run | 1,682/1,682 assertions passed |
| Theme/navigation coverage | Same CI run | 13 routes, Light and Dark, 320/390/768/1024/1440 px |
| Production browser smoke | [Live smoke run 41775770082](https://github.com/justryan-n2d/CEStudy/actions/runs/41775770082) | 135/135 checks passed, zero failures and zero runtime errors |
| Full-history secret scan | [Scheduled scan 41433925558](https://github.com/justryan-n2d/CEStudy/actions/runs/41433925558) | 1,191 commits / about 4.53 MB scanned, no leaks |

The merge-push secret scan also passed, but its merge-only commit range reported zero commits scanned. This audit does not misrepresent that check as a fresh full-history scan; the scheduled full-history scan is the evidence cited above.

The current main theme/navigation suite exercises the merged theme provider, Light/Dark control, early theme initialization, desktop navigation panels, mobile More menu, focus handoff, Escape handling, touch-target sizing, theme contrast checks and horizontal overflow. Automated coverage does not substitute for an owner visual review or physical Android accessibility testing.

## 3. Current live database state

A read-only query against the dedicated CEStudy Supabase project on 2026-11-04 returned:

| Table | Rows | Status |
|---|---:|---|
| `catalog_subjects` | 72 | Public catalog metadata |
| `practice_questions` | 52 | All `needs-review`; zero published |
| `subject_lessons` | 13 | All `needs-review`; zero published |

No row, schema, RLS policy or publication state was modified. Do not publish a lesson or question to support browser testing. Use synthetic fixtures for populated lesson and practice rendering checks.

## 4. Backup verification

The latest corrected live backup run is [41290656868](https://github.com/justryan-n2d/CEStudy/actions/runs/41290656868), completed on 2026-11-01 from main code commit `aa394ae578bb610e431aa8d672cd59953609de06`.

Its job logs explicitly confirmed the presence of all three required archive tables:

- `public.catalog_subjects`
- `public.practice_questions`
- `public.subject_lessons`

The workflow then encrypted and uploaded the archive to private Backblaze B2, read the encrypted archive and checksum back for SHA-256 verification, read back the verification marker, and completed retention with four verified sets kept and three stale/incomplete artifacts hidden.

**Closed by this evidence:** fresh live backup using the corrected three-table validator, archive/checksum/marker remote read-back and successful retention.

**Still open:**

- Restore the fresh backup into a separate managed Supabase test project and verify target-specific roles/settings, counts, RLS, grants and published-only visibility. Obtain cost approval before creating a separate test project. Never restore into production.
- Inspect the Backblaze B2 lifecycle rule for the singular `cestudy-db-backup` bucket and `termux/weekly/` prefix. Confirm hidden-version expiration does not remove a current verified archive, checksum or marker before the retention window.
- Confirm GitHub Actions failed-workflow email notifications in account notification settings.
- Confirm protected recovery copies of the private decryption key and passphrase are available outside GitHub and the repository.

The 2026-10-16 local PostgreSQL restore is historical and does not count as a managed Supabase restore.

## 5. Theme, navigation and accessibility status

**Automated checks passed:** current main CI verified 1,682/1,682 theme/navigation assertions across 13 routes, both themes and five widths. The live production smoke passed 135/135 checks.

**Not yet verified by a human/device:**

- Owner visual inspection of the merged Blueprint Academy pages and navigation.
- Physical Android portrait/landscape review.
- TalkBack traversal, labels, focus order and announcements.
- Android font scaling / 200% text zoom.
- Manual desktop keyboard-only route navigation.
- Complete manual search/filter matrix, including combinations, no-results, loading and error recovery.

Do not mark these manual checks complete from CI output.

## 6. Product-roadmap Phase 3 code audit

### Catalog

Existing implementation:

- `src/pages/CatalogPage.tsx` composes `useCatalog`, `CatalogFilters` and `SubjectCard`.
- Search includes title, summary, aliases and specialization.
- Filters include year, category, classification and availability.
- Existing `src/test/catalog-pages.test.tsx` covers search/aliases, collapsed filters, no-results recovery, year routes, combined filters, unassigned math foundations and live result-count announcements.
- `src/test/catalog.test.ts` covers four year levels, five specialization areas, year-independent math foundations, placeholders and source/status metadata.

Missing focused coverage:

- No dedicated `src/test/catalog-api.test.ts` was found for static fallback, Supabase column mapping/order and safe API errors.
- No focused `useCatalog` lifecycle test was found.

### Subject detail

Existing implementation:

- `src/pages/SubjectPage.tsx` loads the subject by slug, renders classification/source/availability and optional year/semester/specialization, and shows related subjects.
- Basic Algebra links directly to `/study/basic-algebra`.
- `src/test/subject-card.test.tsx` covers subject-card destinations, but no dedicated Subject Page test was found.

Missing focused coverage:

- Loading, error and not-found states.
- Optional year/semester display without invented placement.
- Source reference link behavior.
- Related-subject filtering and maximum count.
- Basic Algebra direct reviewer entry.

### Study reader and math

Existing implementation:

- `src/pages/StudyPage.tsx` uses `fetchPublishedLessons`, topic search, `MarkdownContent`, local completion and local streak activity.
- `src/data/lesson-api.ts` selects public lesson columns, filters by subject and `status = published`, and orders by unit number.
- `src/types/lesson-content.ts` validates lesson rows and content statuses.
- `src/test/lesson-api.test.ts` covers public selected fields, published filtering, unexpected unpublished data and empty results.
- `src/test/study-page.test.tsx` covers empty published content, published lesson rendering, topic search/navigation and local completion/undo.
- `src/test/latex-rendering.test.tsx` already covers broad KaTeX/Markdown cases: inline/display formulas, nested fractions, matrices, engineering formulas, malformed input fallback, currency, raw HTML as text and practice-question fields.

Missing focused coverage:

- Study page loading/error states, invalid unit, previous/next boundaries and stale requests.
- Browser-level populated lesson rendering through the student route in both themes. The current live database has no published lesson, so the current route's real-data state is an honest empty/review gate.

The dedicated plan adds a synthetic published lesson response only in the local Playwright preview. It does not mutate Supabase or publish content.

## 7. Dedicated Phase 3 plan

The implementation plan is:

[`docs/plans/2026-11-04-phase-3-catalog-subject-lesson-consistency-implementation-plan.md`](../plans/2026-11-04-phase-3-catalog-subject-lesson-consistency-implementation-plan.md)

It separates the work into three reviewable test-first tasks:

1. Catalog API, Catalog hook and Subject Page contracts.
2. Published lesson API and Study reader states/navigation.
3. Synthetic populated lesson math rendering in Light/Dark at all five target widths.

No application code was changed during the initial read-only audit. The subsequent controlled Phase 3 implementation work is recorded in Section 9 below.

### Owner decision recorded on 2026-11-04

The owner decided that `learningObjectives` remains searchable metadata only. The student-facing lesson reader must not display a separate, clearly labelled **Learning Objectives** section above the lesson body.

The intended lesson structure is practical review material organized around topical outlines, conceptual explanations, formulas and step-by-step worked solutions. The existing test that confirms objectives are not rendered remains part of the regression contract. No Learning Objectives display change is authorized in Phase 3.

## 8. Work explicitly not performed

- No application source code changed.
- No Supabase migration, live row, status, RLS policy, user or auth setting changed.
- No production Cloudflare Pages variable, domain, route or deployment setting changed.
- No OAuth provider, redirect allow-list or site URL changed.
- No lesson/question was published.
- No managed Supabase test project was created.
- No physical-device test was claimed.


## 9. Controlled Phase 3 implementation progress (2026-11-04)

The owner approved keeping lesson objectives as searchable metadata only. CEStudy's lesson reader does not show a separate Learning Objectives section. Lesson content remains organized around topical outlines, conceptual explanations, formulas and step-by-step worked solutions.

Three independent draft PRs were created from the verified main baseline. All remain open, draft and unmerged:

| PR | Scope | Verified result |
|---|---|---|
| [#71](https://github.com/justryan-n2d/CEStudy/pull/71) | Catalog API, `useCatalog`, SubjectPage tests and SubjectPage route-change state reset | [CI 41781851208](https://github.com/justryan-n2d/CEStudy/actions/runs/41781851208): 164 tests / 29 files; lint/build passed; 1,682/1,682 existing browser assertions; Supabase migration/RLS and secret scan passed |
| [#72](https://github.com/justryan-n2d/CEStudy/pull/72) | Published lesson API and StudyPage behavior contract tests | [CI 41783133738](https://github.com/justryan-n2d/CEStudy/actions/runs/41783133738): 163 tests / 26 files; lint/build passed; 1,682/1,682 existing browser assertions; Supabase migration/RLS and secret scan passed |
| [#73](https://github.com/justryan-n2d/CEStudy/pull/73) | Synthetic populated lesson, KaTeX rendering and both-theme browser verification | [CI 41784514166](https://github.com/justryan-n2d/CEStudy/actions/runs/41784514166): 152 tests / 26 files; lint/build passed; 1,757/1,757 browser assertions; Supabase migration/RLS and secret scan passed |

Task 1 reproduced a stale-subject route-change defect and fixed it by resetting the SubjectPage loading, error and subject state for a new slug. Task 2 confirmed the current reader/API implementation already satisfied the intended behavior, so no StudyPage or lesson API source change was required. Task 3 verified the shared Markdown/KaTeX path with synthetic data only.

The latest full-history Gitleaks run [41784514136](https://github.com/justryan-n2d/CEStudy/actions/runs/41784514136) scanned 1,233 commits and reported no leaks. The synthetic build uses the reserved `.invalid` host `cestudy-math-smoke.invalid` and a non-secret CI sentinel key; the Playwright route intercepts its REST requests. No live Supabase endpoint, records or publication statuses are used by the populated-lesson test.

The latest browser run uploaded artifact `cestudy-populated-lesson-visual-review`, containing before/after empty-reviewer and populated-lesson screenshots at 390px and 1440px in Light and Dark. The artifact expires 2026-11-11. Its human visual comparison remains an owner review item.

**Integration boundary:** PRs #71-#73 are draft and unmerged. Main remains at the recorded baseline until the owner explicitly authorizes integration. No live database, RLS, production Supabase configuration, OAuth settings, production deployment or lesson publication was changed by these Phase 3 slices.


## 10. Post-integration verification and Phase 3 closeout (2026-11-04)

The earlier sections of this document are a point-in-time audit of `main` at `ad96cc6148b95b563f247d9254bea5a6858b3cd0`. They are retained as historical baseline evidence. The Phase 3 integration and post-merge checks below supersede the earlier draft/unmerged status.

### Phase 3 merge record

| PR | Integrated scope | Merge commit |
|---|---|---|
| [#70](https://github.com/justryan-n2d/CEStudy/pull/70) | Canonical roadmap and Phase 3 plan reconciliation | `004f5e971fdb2a755619708c1a99dbea4bc93550` |
| [#71](https://github.com/justryan-n2d/CEStudy/pull/71) | Catalog/Subject contracts and stale-route correction | `d8c3e2bf62b4bf1e0f106d923d76981125ff996b` |
| [#72](https://github.com/justryan-n2d/CEStudy/pull/72) | Published lesson API and Study reader contracts | `c24736168c1e49a6f39c89a7eabb7abb69480932` |
| [#73](https://github.com/justryan-n2d/CEStudy/pull/73) | Synthetic populated lesson math and both-theme visual regression | `849c9d707b0cafd8c39ab63d9bf57260c54dd186` |

Final `main` after PR #73 is `849c9d707b0cafd8c39ab63d9bf57260c54dd186`.

### Post-merge verification

- [CEStudy CI run 41797726093](https://github.com/justryan-n2d/CEStudy/actions/runs/41797726093) completed successfully on final main. It passed 177 tests across 29 files, ESLint, dependency audit, production build, 1,757/1,757 theme/browser assertions, backup crypto/retention/verification tests, and isolated Supabase migration/RLS tests.
- [Live production Chromium smoke run 41798110114](https://github.com/justryan-n2d/CEStudy/actions/runs/41798110114) completed successfully.
- [Push secret scan 41797726053](https://github.com/justryan-n2d/CEStudy/actions/runs/41797726053) completed successfully. The Phase 3 PR heads also passed their required secret scans; PR #73's [full-history scan 41784514136](https://github.com/justryan-n2d/CEStudy/actions/runs/41784514136) scanned 1,233 commits with no leaks.
- The populated-lesson visual artifact attached to [run 41784514166](https://github.com/justryan-n2d/CEStudy/actions/runs/41784514166) was inspected before merge. It contains synthetic lesson screenshots in Light and Dark at mobile and desktop widths, plus the empty reviewer baseline. Artifact retention ends 2026-11-11.

### Phase 3 result and remaining boundaries

Product-roadmap Phase 3 is **complete and integrated**. The catalog, subject detail, published lesson reader/API contracts, stale-route correction, and populated lesson math verification now reside on `main`. No live lesson/question was published; no live database rows, schema, RLS policies, production Supabase/OAuth settings, or production deployment configuration were changed.

The overall operational release work remains Phase 7. Managed-Supabase restore, B2 lifecycle and failure notifications, protected key recovery copies, physical-device/accessibility QA, qualified human academic review and the controlled student pilot remain separate release gates.

Phase 4, Practice Workspace, is the next product-roadmap workstream. It has not yet started.

The connectivity/loading-skeleton feature in [PR #74](https://github.com/justryan-n2d/CEStudy/pull/74) is separate from Phase 3. Its standalone automated checks passed, but the branch was created from the pre-Phase-3 mainline and must be reconciled with current main. Visual review identified a mismatch in Practice answer-row placeholder colors, and the page-level rejection lifecycle tests do not yet cover all three request families. Do not merge PR #74 until those items are corrected and its checks pass on the refreshed branch.
