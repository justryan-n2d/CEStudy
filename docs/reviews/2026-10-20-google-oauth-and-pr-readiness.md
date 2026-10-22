# Google OAuth and Pull Request Readiness Record

**Verification date:** 2026-10-20  
**Verification timestamp:** 2026-10-20 23:30:12 +08:00 (Asia/Manila)  
**Repository:** [justryan-n2d/CEStudy](https://github.com/justryan-n2d/CEStudy)  
**Purpose:** Record the OAuth configuration and manually reported browser checks, then separate completed evidence from remaining release gates for PRs #44 and #47.

> The live sign-in/logout steps below were reported as completed by the project owner during this session. This documentation change did not independently replay the browser session or access any credential values.

## Google OAuth configuration

- Google Cloud OAuth project ID: `cestudy-2026`.
- Audience: External; consent screen remains in Testing mode. Only configured test users can use the test configuration until the app's publishing and verification requirements are addressed.
- Dedicated Supabase project reference: `qqmdwltfgpqtcvdbcmto`.
- Google OAuth client's authorized redirect URI is the Supabase Auth callback: `https://qqmdwltfgpqtcvdbcmto.supabase.co/auth/v1/callback`.
- Supabase site URL is `https://cestudy.pages.dev`.
- Allowed return URLs include the production login route, the checked preview login route, the preview's scoped wildcard, and local development `http://localhost:5173/login`.
- The preview wildcard added for the tested branch is `https://feature-google-auth-streak-g-2k99.cestudy.pages.dev/**`.

**Secret handling:** Do not commit the Google client secret, Supabase secret/service-role key, database password, OAuth authorization code, recovery token, or any student's data. Never place a privileged secret in a `VITE_*` variable. The repository should document configuration names and redirect URLs only, not secret values or the test user's email address.

## Manual browser verification reported by the project owner

| Check | Result | Evidence / interpretation |
|---|---|---|
| Google sign-in from the Cloudflare preview | **Passed** | Authentication succeeded and returned to that same preview's `/profile` route after the preview redirect URL was added to Supabase. |
| Profile identity state | **Passed** | The signed-in Google account appeared on Profile and showed as connected. |
| Session persistence | **Passed** | Refreshing `/profile` retained the signed-in session. |
| Sign-out persistence | **Passed** | After signing out, refreshing returned the app to its signed-out state. |
| Guest access | **Passed** | The public library remained accessible while signed out. |

These tests establish the main preview sign-in/session path, not every OAuth error path and not production-wide release readiness.

## Remaining OAuth checks

Before PR #44 can be considered merge-ready, complete and record:

1. **Cancellation recovery:** Start Google sign-in, cancel at the provider, and verify the UI returns to a usable signed-out state with no stuck spinner or misleading success state.
2. **Provider/error recovery:** Exercise a provider or callback failure and verify the error is understandable, retry works, and the page remains usable after refresh.
3. **Unsafe return target:** Try an external or malformed `next`/`returnTo` value and verify the app rejects it or falls back to a safe internal path. Unit tests in the branch do not replace this manual deployed-flow check.
4. **Production readiness:** Before announcing the account feature, confirm the Google OAuth consent/publishing requirements and Supabase redirect allowlist are correct for production. Testing-mode acceptance is not proof that any Google account can sign in.
5. **Final retest after branch reconciliation:** Repeat sign-in, refresh, sign-out, cancellation and return-path tests on the final preview generated from the reconciled branch.

## Pull request #44: Google sign-in, profile, study streak and dark-mode/accessibility work

- PR: [#44](https://github.com/justryan-n2d/CEStudy/pull/44).
- At the timestamp above, GitHub reported the PR as **open, draft, and not mergeable**.
- Recorded head: `4551e4e5b2c1a54e627415b296471bb761b2ad56`.
- A fresh compare against `main` reported the branch as **diverged**, with 92 commits ahead and 2 commits behind. The merge base was `44ceab69364ba0b094399fbd878ccd38d942356c`; the compared `main` head was `358bbc322ce09f1e8b880c2811ca5b732d9c2451`.
- PR metadata links the recorded head to successful CI run [39432289551](https://github.com/justryan-n2d/CEStudy/actions/runs/39432289551), secret scan [39432289211](https://github.com/justryan-n2d/CEStudy/actions/runs/39432289211), and Cloudflare preview [118660472757](https://github.com/justryan-n2d/CEStudy/runs/118660472757). These historical passes do not eliminate the need to rerun checks after updating the branch.
- **Decision: do not merge yet.** Reconcile the branch with current `main`, resolve any conflicts without discarding later changes, rerun required CI/secret scan/preview checks, and finish the remaining OAuth checks above. Keep the PR draft until those gates pass.

## Pull request #47: narrow historical Gitleaks test-fixture allowlist

- PR: [#47](https://github.com/justryan-n2d/CEStudy/pull/47).
- At the timestamp above, GitHub reported it as open and non-draft; the PR metadata said mergeable, but a fresh compare against `main` reported **diverged**, with 1 commit ahead and 2 commits behind. Do not use the mergeable flag alone as evidence that it is up to date or security-verified.
- Recorded head: `07df0feedfdcf81456c97fa79938d97a1ca073a0`.
- The PR records successful CI [39404037762](https://github.com/justryan-n2d/CEStudy/actions/runs/39404037762) and secret-scan [39404037818](https://github.com/justryan-n2d/CEStudy/actions/runs/39404037818). The existing passes should not be treated as proof that the historical finding was actually suppressed by the allowlist.
- **Configuration issue to resolve:** the current `.gitleaks.toml` allowlist's `regexes` expression matches the entire source line, but it does not set `regexTarget`. Gitleaks defaults that field to `secret`, which tests the extracted secret rather than the source line. Add `regexTarget = "line"` for the line-based expression, keeping the commit, path, exact-line expression and `condition = "AND"` restrictions.
- Then update the branch with current `main`, rerun CI, and dispatch/verify a **full-history** scan that demonstrates the intended historical fixture is excluded while unrelated/new synthetic findings are still detected. The workflow at `.github/workflows/secret-scan.yml` supports `workflow_dispatch` and checks out full Git history, but the result must be inspected to confirm the actual scan scope and expected allowlist behavior.
- **Decision: do not merge until the allowlist behavior is corrected and demonstrated.**

Gitleaks reference: [configuration and allowlists](https://github.com/gitleaks/gitleaks#configuration) and [Gitleaks allowlist examples](https://newreleases.io/project/github/gitleaks/gitleaks/release/v8.16.0), including the documented default `regexTarget` behavior.

## Recommended order

1. Correct and verify PR #47's line-targeted historical exception, reconcile it with current `main`, and rerun the full-history scan plus CI.
2. Reconcile PR #44 with current `main`, rerun CI and secret scan, inspect the new preview, then finish cancellation/error and unsafe-return tests.
3. Only after all of those checks pass, reconsider each PR for merge. Neither PR is approved for merge by this record.

---

**Scope note:** This record reflects repository state and test results available at the timestamp above. Recheck PR heads, branch divergence, and checks before making a merge decision.



## PR #44 OAuth recovery and deployed-preview checks (refreshed 2026-10-21)

**Live PR metadata checked before this documentation sync:** PR #44 is open, draft, and unmerged. GitHub reports mergeable/clean. Branch: `feature/google-auth-streak-gate-rebased`. Verified application/test head: `18276056fbecae2e2ea80068f3298ea184b2d77b`. Base: `main` at `e6f657cbbf94467e427fc6183c9714e965098598`.

Fresh checks on that exact application/test head passed:
- [CI run 39461277462](https://github.com/justryan-n2d/CEStudy/actions/runs/39461277462): passed, including `Lint, test, and build` and `Supabase migration and RLS tests`.
- [Full-history secret scan 39461277393](https://github.com/justryan-n2d/CEStudy/actions/runs/39461277393): passed.
- [Cloudflare Pages check 118761260082](https://github.com/justryan-n2d/CEStudy/runs/118761260082): passed for the same SHA; preview deployment [becd5395.cestudy.pages.dev](https://becd5395.cestudy.pages.dev).
- Unit tests: **199 passed across 32 files**. Lint, dependency audit, production build, backup verification/retention tests, and isolated Supabase migration/RLS tests passed.
- Chromium smoke on built production preview: **159/159 assertions passed** at 320 px and 1440 px.
- Chromium smoke on deployed branch preview: **157/157 assertions passed** at 320 px and 1440 px, with no browser page errors reported.

Automated OAuth coverage passes for injected `access_denied` and `server_error` callbacks, recovery/retry behavior, and five unsafe return-target forms. It validates the app's response after callback parameters reach Login, but it does not exercise the real Google provider cancellation screen or induce a live provider/Supabase callback failure.

### Manual merge gates still open

1. Start Google sign-in and cancel at the actual Google provider screen. Verify the app returns to a usable signed-out Login page, remains signed out, has no stuck spinner or false success state, and permits retry.
2. Exercise one controlled real provider/callback failure. Verify readable feedback, retry, and recovery after refresh.
3. Review Google consent-screen Testing-mode/publishing requirements and production Supabase redirect allowlists before enabling the account feature for general availability.

**Documentation-only sync note:** the run IDs above validate the application/test head. After committing this documentation update, refresh PR #44 and verify new CI, full-history secret-scan, and Cloudflare Pages results for the resulting latest PR head. Do not infer that the pre-sync run IDs test a later docs-only commit.

PR #44 must remain open and in draft until all three manual gates are completed and recorded. No merge or production deployment is approved by this record. Keep draft lessons and practice questions unpublished.

These OAuth gates are distinct from CEStudy's broad-launch gates: physical-device/accessibility QA, corrected live backup verification and recovery, human review of educational content, and the controlled student pilot remain open.
