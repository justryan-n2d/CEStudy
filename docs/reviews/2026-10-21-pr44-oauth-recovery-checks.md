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

## Manual Gate 1: Real Google provider cancellation (2026-10-21)

**Result: PASS, based on user-observed manual test.** The tester started Google sign-in through the deployed PR preview and cancelled at the actual Google provider screen (not by injecting callback query parameters). The user reported:

- Google returned to Login: **PASS**.
- App remained signed out: **PASS**.
- No stuck spinner or false success state: **PASS**.
- Retry initiated normally: **PASS**.

**Evidence boundary:** this result is based on the tester's reported observations in the conversation. No screen recording, screenshot, timestamped browser log, or provider trace was attached. It confirms Gate 1 at the reported level, but does not close Gate 2 (controlled real provider/callback failure) or Gate 3 (production consent-screen and Supabase redirect review). Keep PR #44 open and in draft.


## Manual Gate 3: Google consent and redirect configuration review (2026-10-21)

**Result: INCOMPLETE.** The source code and recorded setup values were reviewed against current Google and Supabase documentation. The live Google Auth Platform consent settings and Supabase Auth URL allowlist have not been directly verified. Do not publish the Google app or change production redirect settings during this read-only review.

### Evidence checked

- The connected Supabase project listing confirms that the CEStudy project reference qqmdwltfgpqtcvdbcmto exists and is ACTIVE_HEALTHY. The available Supabase connection exposes project metadata, not the live Auth URL Configuration or Google provider settings.
- src/contexts/AuthContext.tsx calls supabase.auth.signInWithOAuth with provider google, a same-origin /login callback, and a validated internal next path. It does not request additional Google scopes in application code.
- The existing setup record documents Google Auth Platform project cestudy-2026, External audience, Testing publishing status, the CEStudy Supabase callback URL, production Site URL, and the production/preview/local redirect entries. These remain recorded values, not proof of current dashboard state.

### Review findings

| Configuration | Recorded value or expectation | Read-only assessment |
|---|---|---|
| Google audience and publishing | External audience, currently recorded as Testing | Reasonable for preview QA. Do not switch to In production until the intended audience, enabled scopes, branding, and any verification requirements are confirmed. |
| Google data access scopes | Supabase's documented sign-in baseline is openid, userinfo.email, and userinfo.profile | The app code requests no extra scopes, but the actual Google Auth Platform Data Access screen still needs confirmation. Google's current policy guide says External/Testing is generally limited to up to 100 allowlisted test users, with an exception for apps that request only basic identity scopes. Confirm the actual scope list before relying on that exception. |
| Google Authorized redirect URI | https://qqmdwltfgpqtcvdbcmto.supabase.co/auth/v1/callback | Matches the callback structure required by Supabase's Google sign-in guide. Confirm this exact URI in the live Google OAuth Web client. |
| Google Authorized JavaScript origins | The setup record lists https://cestudy.pages.dev and development-only http://localhost:5173 | The production origin is appropriate. The current record does not list the tested branch-preview origin, so verify whether that origin is intended/required for this OAuth client. Keep localhost development-only; consider a separate development OAuth client or remove localhost from the production client when local testing no longer needs it. |
| Supabase Site URL | https://cestudy.pages.dev | Correct as the documented production base URL. Verify it in the live dashboard. |
| Supabase Redirect URLs | Production /login; the checked branch-preview /login; a wildcard scoped to feature-google-auth-streak-g-2k99.cestudy.pages.dev; and http://localhost:5173/login for local development | The pattern follows Supabase guidance to use exact production URLs and restrict wildcards to preview/development use. Verify the live allowlist and remove stale preview/local entries when they are no longer required for testing. |

### Required manual console confirmation

1. In [Google Auth Platform](https://console.cloud.google.com/auth/overview) for project cestudy-2026, inspect **Audience** and **Data Access**. Confirm whether publishing status is still Testing, the intended audience is External, and the requested scopes are limited to identity sign-in (openid, email, and profile). Do not add scopes or publish the app as part of this check.
2. Under **Clients**, open the actual Web OAuth client. Confirm the Authorized redirect URI is exactly https://qqmdwltfgpqtcvdbcmto.supabase.co/auth/v1/callback. Review Authorized JavaScript origins for the production site, whether the current preview origin is intentionally allowed for preview testing, and whether localhost should stay only on a separate development client. Never copy the client secret into chat or the public repository.
3. In the [CEStudy Supabase Auth URL Configuration](https://supabase.com/dashboard/project/qqmdwltfgpqtcvdbcmto/auth/url-configuration), confirm the Site URL is https://cestudy.pages.dev; the production redirect is exactly https://cestudy.pages.dev/login; and the preview wildcard is restricted to the named CEStudy preview alias. Keep http://localhost:5173/login only while it is needed for development/testing.
4. Record the visible setting values and whether each matches. Do not share secret values, OAuth codes, tokens, or account-specific data.

References reviewed on 2026-10-21:

- [Google OAuth app state overview](https://developers.google.com/identity/protocols/oauth2/production-readiness/overview): External/Testing behavior, test-user limits, and the basic-identity-scope exception.
- [Supabase Sign in with Google](https://supabase.com/docs/guides/auth/social-login/auth-google): required sign-in scopes, Google OAuth client setup, and the Supabase callback URI.
- [Supabase Auth redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls): Site URL, redirect allowlist matching, and guidance to use exact production URLs and scoped preview/development wildcards.

**Gate decision:** Gate 3 is not passed yet. The documented setup is structurally aligned, but a read-only repository review cannot confirm the live dashboard values. Complete the three console checks above before marking Gate 3 passed. Gate 2's controlled real callback-failure test remains separately open for the scheduled desktop session. Keep PR #44 open and in draft.
