# PR #44 OAuth recovery and return-target verification

**Verification date:** 2026-10-21 (Asia/Manila)  
**Repository:** [justryan-n2d/CEStudy](https://github.com/justryan-n2d/CEStudy)  
**Pull request:** [#44, optional Google sign-in and local study streak](https://github.com/justryan-n2d/CEStudy/pull/44)  
**Application/test head verified:** `18276056fbecae2e2ea80068f3298ea184b2d77b`  
**Deployed branch preview:** [feature-google-auth-streak-g-2k99.cestudy.pages.dev](https://feature-google-auth-streak-g-2k99.cestudy.pages.dev)  
**Cloudflare deployment for this application/test head:** [becd5395.cestudy.pages.dev](https://becd5395.cestudy.pages.dev)

**Live PR metadata checked before this documentation sync:** PR #44 was open, draft, and unmerged; GitHub reported mergeable/clean. Its base was `main` at `e6f657cbbf94467e427fc6183c9714e965098598`. The check-run API confirmed that CI, secret scan, and Cloudflare Pages all succeeded on the application/test head above.

**Documentation-only sync note:** the run IDs below validate the verified application/test head, not any later docs-only commit. After this record is committed, re-fetch the PR head and confirm fresh CI, full-history secret-scan, and Pages check runs on that latest head. The documentation update does not close the manual OAuth gates below.

## Fresh verification evidence

- [CI run 39461277462](https://github.com/justryan-n2d/CEStudy/actions/runs/39461277462): passed.
- [Full-history secret scan 39461277393](https://github.com/justryan-n2d/CEStudy/actions/runs/39461277393): passed.
- [Cloudflare Pages preview check 118761260082](https://github.com/justryan-n2d/CEStudy/runs/118761260082): passed.
- CI unit tests: **199 passed across 32 test files**.
- Lint, dependency audit, production build, backup encryption/retention/verification checks, and isolated Supabase migration/RLS tests: passed.
- Chromium smoke on the built Vite production preview: **159/159 assertions passed**, at 320 px and 1440 px.
- Chromium smoke on the deployed Cloudflare branch preview: **157/157 assertions passed**, at 320 px and 1440 px, with zero reported browser page errors.

The deployed run uses the PR branch preview alias after CI confirms the matching PR head's Cloudflare Pages check has succeeded. The local and deployed assertion totals differ by two because the local CI build has no Supabase config, so it also checks the disabled Google-button setup state; the deployed preview has its configured, enabled Google button.

## Outcomes for the three requested checks

| Check | Automated result | What the evidence establishes |
|---|---|---|
| Cancellation recovery | **Simulated callback passed** | The deployed preview was opened with `/login?error=access_denied&error_description=...`. It stayed on the local Login route, displayed the recovery alert, did not remain in an OAuth-pending state, preserved the error after refresh, and kept the retry/setup state appropriate to the configuration. A unit test also verifies that a retry starts and clears the prior alert. |
| Provider/error recovery | **Simulated callback and retry tests passed** | The deployed preview was opened with `error=server_error`. It displayed a recoverable alert after the session check completed and retained that state after refresh. A unit test also simulates an OAuth-start failure followed by a successful retry. No real upstream Google provider failure was induced. |
| Unsafe return target | **Automated coverage passed** | The deployed preview was opened with absolute external, protocol-relative, backslash-protocol-relative, `javascript:`, and login-loop return values; all remained on the app's Login route. Unit tests with a signed-in user cover those destination forms and verify fallback to `/profile`, rather than an external route. |

## Manual-provider limitation

The actual interactive Google cancellation action was **not performed** during this verification. The automated browser run had no authenticated Google test-user session and deliberately avoided handling credentials; it simulated the callback error state by directly loading the corresponding URL. This verifies the app's recovery UI and route behavior after receiving those callback parameters, but it does not prove what Google actually returns when a person presses Cancel at the provider.

Likewise, the callback-error UI was tested by injecting `server_error`; an actual provider-side or Supabase callback failure was not forced. The project owner previously reported the happy path as passing on the preview (sign-in, Google identity display, refresh persistence, sign-out persistence, and guest library access), but that does not replace the two manual failure-path checks.

## Merge-readiness decision

**Automated readiness: passed. Overall merge readiness: not yet approved.**

Keep PR #44 open and in draft until the following are completed and recorded on the latest preview:

1. Start Google sign-in, press Cancel on the real Google provider screen, and confirm the app returns to a usable signed-out Login page with retry available and no stuck spinner or false success state.
2. Exercise one real provider/callback failure path and verify a clear recovery message, retry, and refresh behavior.
3. Review Google OAuth consent-screen publishing/testing-mode requirements and production Supabase redirect allowlists before making the account feature generally available.

The safe-return-path logic has unit-test coverage for signed-in routing, and the deployed preview passed the unauthenticated-origin checks. No merge or production deployment was performed as part of this verification. All draft lessons and practice questions must remain unpublished.
