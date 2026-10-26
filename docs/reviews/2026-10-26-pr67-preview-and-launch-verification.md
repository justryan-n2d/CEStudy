# PR #67 preview and launch verification runbook

- **Updated:** 2026-10-26
- **Status:** Manual browser/provider-console checks are not yet recorded as complete. Automated checks do not replace them.
- **Candidate:** [PR #67](https://github.com/justryan-n2d/CEStudy/pull/67), still draft and unmerged.
- **Stable branch preview:** https://feat-local-history-streak-20-4d7n.cestudy.pages.dev
- **Commit preview from the checked code/test head:** https://06358ebf.cestudy.pages.dev
- **Production site:** https://cestudy.pages.dev

## Safety boundary

Do not change production OAuth settings to make a preview work. Do not change the Supabase production Site URL, publish draft content, alter production schema/RLS, or restore any backup over production. If a preview origin or callback is not already allowed by the existing configuration, stop and mark the preview test blocked. Use a separately approved staging Supabase project and a separate Google OAuth client before making any staging-only configuration changes.

The current live database has 72 catalog subjects, 52 questions and 13 lessons; every question and lesson is `needs-review`, with zero published. Do not publish a lesson merely to make manual testing possible.

## 1. Read-only redirect allow-list review

Use the stable branch preview URL above so the origin does not change on every commit.

### Google Auth Platform

1. Open Google Cloud Console and select the Google Cloud project that owns CEStudy's existing **Web application** OAuth client.
2. Open **Google Auth Platform → Clients**, then open that existing client. Do not create or edit a client in this read-only verification step.
3. Under **Authorized JavaScript origins**, check whether this exact origin is already listed:
   `https://feat-local-history-streak-20-4d7n.cestudy.pages.dev`
4. Under **Authorized redirect URIs**, confirm the value matches the callback URL shown in the CEStudy Supabase Dashboard's Google provider settings. The project reference used by the deployed app is `qqmdwltfgpqtcvdbcmto`, so the expected Supabase callback is normally:
   `https://qqmdwltfgpqtcvdbcmto.supabase.co/auth/v1/callback`
   Trust the callback URI displayed in Supabase if it differs.
5. **Do not add the Pages preview URL as Google's Authorized redirect URI.** Google sends the provider callback to Supabase Auth. The Pages preview is the application origin and final post-auth redirect.

Official reference: [Supabase Google sign-in setup](https://supabase.com/docs/guides/auth/social-sign-in/auth-google).

### Supabase Auth

1. Open the dedicated CEStudy Supabase project `qqmdwltfgpqtcvdbcmto`.
2. Open **Authentication → URL Configuration**.
3. Confirm **Site URL** remains `https://cestudy.pages.dev`.
4. In **Redirect URLs**, inspect whether this narrowly scoped match for the stable preview callback already exists:
   `https://feat-local-history-streak-20-4d7n.cestudy.pages.dev/login*`
   The host is exact, and the wildcard is limited to the `/login` callback suffix/query used for the internal `next` return path.
5. Do not save any changes during this review. If the exact origin/path match is missing, record the preview OAuth test as **BLOCKED**. Do not loosen production allow-lists or add a broad `*.cestudy.pages.dev/**` pattern to make it pass.

Official reference: [Supabase redirect URL configuration](https://supabase.com/docs/guides/auth/redirect-urls).

## 2. Google cancellation and callback recovery

Only run this if the existing configuration already allows the exact branch preview. Use the same browser profile for the entire flow.

1. Open `https://feat-local-history-streak-20-4d7n.cestudy.pages.dev/login?next=%2Fprofile`.
2. If already signed in, visit the preview's `/profile` page and use **Sign out** first.
3. Click **Continue with Google**.
4. At the Google account chooser/consent page, cancel or go back without completing sign-in.
5. Confirm that the browser returns to the preview's `/login` page; an accessible error alert explains that Google sign-in was canceled or could not be completed; the Google button is enabled for retry; no profile or signed-in state is shown; and no indefinite spinner remains.
6. Click **Continue with Google** again and complete sign-in using an existing authorized CEStudy test account.
7. Confirm that the app reaches `/profile`, refresh preserves the session, and **Sign out** ends the session in this browser. The app's sign-out call is local-scope; do not interpret this as signing out other devices.

Record the actual preview origin, browser, date/time, and each pass/fail outcome. A unit test that simulates cancellation is not a substitute for this real-provider test.

## 3. Controlled PKCE exchange failure, then a successful fresh retry

This test is easiest on desktop Chrome because it requires DevTools request blocking. It deliberately blocks the token exchange only in the test browser; it does not change OAuth provider settings or database records.

1. Open the stable branch preview in desktop Chrome and press **F12** to open DevTools.
2. Open DevTools' **Request blocking** tool (DevTools menu ⋮ → **More tools** → **Request blocking** in versions that expose it there).
3. Add the request pattern:
   `*://qqmdwltfgpqtcvdbcmto.supabase.co/auth/v1/token*`
   Enable request blocking. This targets the Supabase token-exchange endpoint, not the Google authorization endpoint.
4. Start Google sign-in from the preview and complete the Google flow. When the preview returns with a callback `code`, the token-exchange request should be blocked.
5. Confirm there is no authenticated profile/session; callback recovery/error feedback is shown; the page does not claim success or spin indefinitely; and the retry button is enabled.
6. Disable request blocking and remove/untick the pattern.
7. Start a **new** Google sign-in flow and complete it. Confirm the app reaches `/profile` and the session survives refresh.

Do not retry by reusing the same authorization code. Supabase documents PKCE codes as short-lived and single-use; the retry must start a new OAuth flow. If DevTools cannot keep request blocking active across the provider redirect, record the result as blocked rather than improvising by changing production configuration.

Official reference: [Supabase PKCE flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow).

## 4. Account isolation and account switching

The code now stores history and completed lessons in separate versioned localStorage keys for guest browsing and each Supabase user ID. Streak activity was already keyed by user ID. This is browser-local scope separation, **not server-side authorization or cross-device sync**. Old unscoped v1 history/completion keys are deliberately not migrated because their owner cannot be determined safely.

The current production database has no published lesson, so do not publish content just for testing. On a desktop preview, synthetic browser-local records may be used to verify page-level separation:

1. Sign in as existing test account A. In DevTools **Console**, run the snippet below to seed clearly labeled local-only history/progress fixtures for the currently signed-in user. These fixtures are not sent to Supabase.

```js
const authKey = Object.keys(localStorage).find((key) => key.endsWith("-auth-token"));
const authState = authKey ? JSON.parse(localStorage.getItem(authKey) || "null") : null;
const userId = authState?.user?.id;
if (!userId) throw new Error("No signed-in Supabase user ID found in this browser.");
const suffix = encodeURIComponent(userId);
const label = `QA account ${userId.slice(0, 8)}`;
const now = new Date();
const completedOn = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
localStorage.setItem(`cestudy:opened-lesson-history:v2:user:${suffix}`, JSON.stringify([{
  lessonId: `qa-history-${userId.slice(0, 8)}`,
  subjectSlug: "basic-algebra",
  unitNumber: 1,
  title: label,
  path: "/not-trusted",
  lastOpenedAt: now.toISOString()
}]));
localStorage.setItem(`cestudy:completed-lessons:v2:user:${suffix}`, JSON.stringify([{
  lessonId: `qa-progress-${userId.slice(0, 8)}`,
  subjectSlug: "basic-algebra",
  unitNumber: 1,
  title: label,
  completedAt: now.toISOString(),
  completedOn
}]));
location.assign("/history");
```

2. On `/history`, confirm the synthetic A label appears. Open `/progress` and confirm the matching completion label appears.
3. Sign out, then sign in with a **different existing test account B**. Run the same snippet again. Confirm B's label appears and A's label does not appear on either page.
4. Sign out and open `/history` and `/progress` as a guest. Confirm neither account's synthetic record appears.
5. Return to account A and use **Clear history** or **Clear progress**. Confirm only A's key is removed; account B's records remain when signed in again.
6. Remove synthetic QA records from the test browser when finished, or use a separate browser profile dedicated to this test.

Do not paste or share session tokens, access tokens, emails, or private storage dumps. Record this as a page/data-scope test only; it does not test creation of records from a real published lesson.

## 5. Backup lifecycle, notifications, and managed restore

### Verified automatically

Live backup run [40172509628](https://github.com/justryan-n2d/CEStudy/actions/runs/40172509628) passed on 2026-10-25. Its logs explicitly verified all three tables, read the encrypted archive and checksum back through SHA-256 verification, verified the remote marker, retained four verified backup sets, and hid three stale/incomplete artifacts.

### Still manual

- [ ] In Backblaze B2, inspect bucket `cestudy-db-backup` (singular) and lifecycle rules for the `termux/weekly/` prefix. Confirm lifecycle expiration/hidden-version cleanup cannot remove the active verified archive, `.sha256`, or `.verified` marker before the agreed retention window. The script uses `hard_delete=false`, and its own retention pruning intentionally hides stale/incomplete artifacts only after a new set is verified.
- [ ] In GitHub, open **Settings → Notifications → Actions** and verify notifications for failed workflow runs are enabled for a verified email/account. Do not assume the workflow's failure summary alone sends an email; the workflow step adds diagnostic details to the Actions run.
- [ ] Confirm recovery copies of the encryption private key/passphrase are protected and available outside GitHub. Do not put recovery secrets into the repository or chat.
- [ ] After cost approval, restore the latest encrypted backup into a **separate managed Supabase test project**, never production. Follow [the backup/recovery guide](../deployment/backup-and-recovery.md), validate counts, statuses, RLS, client grants, column protections, and published-only visibility, record the results, then delete the temporary project only after confirming recovery and cost.

## 6. Physical-device, accessibility, search/filter, and pilot gates

On a physical Android phone, record phone model, Android version, browser version, date/time, and results for each check:

- [ ] Portrait and landscape layouts at common phone widths; no horizontal overflow or clipped controls.
- [ ] Browser text zoom at 200% / larger Android font size; text and buttons remain usable.
- [ ] TalkBack traversal, labels, focus order, expanded menus/dialogs, and announcements for search-result/no-results states.
- [ ] Keyboard-only navigation on a desktop browser, including focus visibility and dialog Escape/focus return.
- [ ] Catalog search plus each filter alone and in combinations, zero-result behavior, clear/recover actions, loading/error states, and direct-route refresh.
- [ ] Touch targets, orientation changes, and network interruption/retry behavior.
- [ ] A qualified human reviewer independently approves each lesson/question before any publication.
- [ ] Only after blocking release gates and human review pass, run the planned controlled 5–8-student pilot and record outcomes.

## 7. Local diff whitespace check

No local CEStudy Git clone was available in the execution environment, so `git diff --check` was not run there. When a local clone is available, from the PR branch after fetching current refs run:

```sh
git fetch origin main
git diff --check origin/main...HEAD
```

Record the command output. A clean result closes this command-level whitespace check; it does not replace current-head CI/security checks or independent review.
