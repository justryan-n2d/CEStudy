# PR #44 dark-mode and accessibility verification

**Verification date:** 2026-10-20  
**Pull request:** [#44, optional Google sign-in and local study streak](https://github.com/justryan-n2d/CEStudy/pull/44)  
**Verified source head:** `a4bc452e1a76795144fed4c75730850ef2652d2c`  
**PR state:** Open and draft. This record does not approve merging the feature or launching CEStudy broadly.

## Code changes verified

- The streak calendar's today outline, selected-day outline and matching legend outline now use the semantic `--ui-focus` token instead of hardcoding a light-theme blue.
- The dark selected-day detail panel uses the shared raised-surface, border and text tokens. Removed duplicate grouped CSS overrides that were replacing the intended raised surface with a muted surface.
- Accessibility regression helpers now find repeated CSS rules and resolve semantic CSS color variables rather than rejecting valid `var(--ui-text-muted)` values.
- Added `scripts/ui-theme-smoke.cjs` and integrated it into `.github/workflows/ci.yml` after the production Vite build. It opens the built app in Chromium. It does not contact the Google OAuth provider or require a configured account.

## Automated verification evidence

- [CEStudy CI run 39409560301](https://github.com/justryan-n2d/CEStudy/actions/runs/39409560301): passed on the verified source head. This includes dependency audit, ESLint, unit tests, production build/header packaging, backup encryption/retention tests, the rendered-browser checks and isolated Supabase migration/RLS tests.
- [Rendered theme/accessibility job](https://github.com/justryan-n2d/CEStudy/actions/runs/39409560301/job/118583867724): **142/142 assertions passed, 0 failed**. The added checks verify the selected-date detail panel is visible and its computed background, border and text use the intended dark theme tokens.
- [Full-history secret scan 39409560328](https://github.com/justryan-n2d/CEStudy/actions/runs/39409560328): passed on the same source head.
- [Cloudflare Pages branch deployment](https://github.com/justryan-n2d/CEStudy/runs/118583809263): succeeded for the PR head.
- The dedicated CI database job passed migration and row-level-security tests, including published-only question/lesson visibility, client-write denial and private review-field protection.

### Chromium coverage

The browser smoke test uses the built Vite preview at both **320 px** and **1440 px**. It checks:

- Persisted dark theme, the document's `color-scheme` and `theme-color`, and dark page/surface colors across `/`, `/privacy`, `/login`, `/profile`, `/menu`, `/history`, `/streak`, `/progress` and `/community`.
- Privacy body-text contrast and the Google sign-in label's contrast in allowed default/hover/pressed surface states. The multicolor Google logo must use the local `/branding/icons/google.svg` asset on a white tile.
- Keyboard skip-link focus, theme-aware focus styling, the streak calendar's today/selected states, dialog role and focus trap, Escape closing and focus return, reduced-motion behavior, horizontal overflow and uncaught page errors.

This validates the current branch's rendered behavior in Chromium. It is not a WCAG certification or a substitute for a physical Android device, TalkBack, 200% text zoom, or a real Google OAuth end-to-end transaction.

## Current read-only Supabase state

On 2026-10-20, read-only project inspection reconfirmed:

| Data / control | Observed state |
|---|---|
| Catalog subjects | 72 |
| Practice questions | 52, all `needs-review`, 0 published |
| Lessons | 13, all `needs-review`, 0 published |
| RLS | Enabled on all six current public tables |
| Actual `anon`-role query | 72 catalog rows visible; 0 practice-question rows and 0 lesson rows visible |
| Client column grants | Authenticated clients can select lesson bodies/question prompts but cannot select private `review_notes` fields |
| Client write access | Denied on the catalog, lesson and practice-content tables |
| Security advisor | Three `INFO` no-policy notices on the intentionally private feedback, support-confirmation and submission-limit tables |

The three advisor notices reflect private tables with no direct client grants; they should remain private. The feature branch did not change remote database schema or rows.

## Release gates that remain open

- [ ] Configure Google OAuth in Google Cloud and the dedicated CEStudy Supabase project.
- [ ] Verify real successful sign-in, cancellation and retry/error behavior, safe return paths, sign-out, and local streak separation on the intended production/local URLs. Do not commit or share the OAuth client secret.
- [ ] Run a fresh encrypted off-site database backup for the current live state and confirm the remote archive, checksum and `.verified` marker by read-back. The last recorded real backup predates the 2026-10-18 content-status correction; CI crypto tests are not a real backup run.
- [ ] After explicit cost approval, restore the refreshed backup into a separate managed Supabase test project and validate counts, roles, grants, RLS and published-only visibility. The existing successful restore was into isolated local PostgreSQL only.
- [ ] Confirm Backblaze B2 hidden-version lifecycle cleanup, GitHub Actions failure-email settings and protected private-key/passphrase recovery copies.
- [ ] On a physical Android device, verify portrait/landscape, keyboard navigation, TalkBack, 200% text zoom, tap targets, catalog filter combinations, no-results recovery and direct-route refresh. Record device/browser and findings.
- [ ] Independently review the 52 questions and 13 lessons for technical correctness, originality, citations/rights and clarity. Leave all unpublished until a qualified human records approval.
- [ ] Run the planned 5–8-student controlled pilot only after the technical gates and initial human content review are complete.
- [ ] Complete the documented Phase 1 student-discovery and Phase 2 user-journey/UX-validation catch-up without rebuilding completed screens.

**Release decision:** PR #44 remains draft. The current branch's automated code and browser checks pass, but real OAuth and physical-device checks are outstanding. Phase 7 is still current, and CEStudy is not approved for a broad student launch.
