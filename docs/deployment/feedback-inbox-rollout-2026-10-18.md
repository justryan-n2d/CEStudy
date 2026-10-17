# CEStudy feedback inbox rollout and verification

**Record date:** 2026-10-18  
**Repository:** `justryan-n2d/CEStudy`  
**Production frontend:** [https://cestudy.pages.dev](https://cestudy.pages.dev)  
**Supabase project:** `qqmdwltfgpqtcvdbcmto`  
**Public contact:** `cestudy00@gmail.com`

## Summary

PR #18 introduced the responsive redesign, separate Contact/Support/Bug Reports/Feedback pages, anonymous feedback form, private owner inbox, unread marker, About Us page and subtle motion. It merged into `main` as `df9f98ece03e8eeec252bda745416c28799402c5`.

PR #19 fixed Cloudflare Pages commit-preview origin handling and merged as `119b46b9e3c39d217c96819bb5491c720df0e827`. It accepts an explicit allowed origin or an HTTPS commit-preview hostname matching exactly `^[a-f0-9]{8}\.cestudy\.pages\.dev$`; it does not allow arbitrary Pages subdomains.

## Live deployment state

- `submit-public-message`: ACTIVE, version 2, `verify_jwt=false`. This endpoint accepts public anonymous feedback/support forms, validates the payload, applies a database-backed rate limit, and writes submissions with a server-only key.
- `feedback-inbox-admin`: ACTIVE, version 3, `verify_jwt=false`. This endpoint validates `FEEDBACK_INBOX_ACCESS_KEY` server-side, throttles unlock attempts through the private rate-limit RPC, issues a signed 30-minute HMAC token, and requires that token for list/count/mark-read/pin/unpin/delete operations. Database mutation calls remain server-side and use the Supabase secret/service role key.
- The owner reported `FEEDBACK_INBOX_ACCESS_KEY` was configured in Supabase Edge Function secrets. Its value is never retrieved, logged, copied to GitHub, or stored in this document.
- No verified Resend sender is currently configured. Email alerts are optional/best-effort for feedback; the private inbox and unread dot are the primary feedback notification. Support confirmation email still requires verified sender/API-key configuration.
- No new npm dependency was added.

## Database migrations and migration-history alignment

The live Supabase migration registry reports:

| Version | Migration | Purpose |
| --- | --- | --- |
| `20261014170630` | `public_catalog_and_practice` | Catalog/practice baseline |
| `20261014190554` | `client_default_privileges_hardening` | Restricts default client privileges |
| `20261017204914` | `private_public_messages` | Private feedback/support records, rate-limit table and RPC |
| `20261017204934` | `feedback_inbox_owner_auth` | Read timestamps, unread index and owner unlock rate-limit category |
| `20261017224950` | `feedback_inbox_management` | Persistent pin state, pinned-first index, service-role-only delete privilege |

The recent repository migration files originally had timestamps different from the live registry. This documentation follow-up renames them to match the already-applied remote versions without changing SQL content:
- `20261017130000_private_public_messages.sql` → `20261017204914_private_public_messages.sql`
- `20261018100000_feedback_inbox_owner_auth.sql` → `20261017204934_feedback_inbox_owner_auth.sql`
- `20261018060000_feedback_inbox_management.sql` → `20261017224950_feedback_inbox_management.sql`

This keeps future `supabase db push` and migration-history checks aligned. CI replays the renamed files against a fresh isolated Supabase stack.

## Live database access/security verification

A privileged SQL check on 2026-10-18 confirmed:

- RLS is enabled on `feedback_messages` and `support_confirmations`.
- `anon` and `authenticated` have neither SELECT nor INSERT privileges on `feedback_messages`.
- `anon` cannot execute `consume_public_submission_rate_limit`; `service_role` can.
- `read_at` and `feedback_messages_unread_created_at_idx` exist.
- The browser has no direct database path for reading feedback; owner reads and read-state writes go through the signed-token Edge Function.
- Supabase's informational `rls_enabled_no_policy` advisor entry for the private feedback/support/rate-limit tables is expected: RLS is enabled, no client policies are present, and client roles have no table privileges. Do not add public read policies to silence the advisory.

Stored feedback records were present following earlier attempts where the UI showed errors. The message bodies, identifiers and other private content are intentionally not copied into the public repository. The practical lesson is that a displayed error does not prove the record was not persisted; check the owner inbox before resubmitting to avoid duplicates.

## Post-origin-fix live submission check (2026-10-18, UTC, initial owner inbox rollout)

The Supabase unified function logs were checked for `2026-10-17T20:40:00Z` through `2026-10-17T21:50:00Z` after PR #19's commit-preview origin fix.

- Before the fix, `submit-public-message` received `OPTIONS 404` responses at approximately `20:41:27Z` to `20:41:40Z`.
- After the fix, the same endpoint logged `OPTIONS 200` at `21:08:58Z`, followed by `POST 200` responses at `21:09:00Z` and `21:10:32Z`.
- The live `feedback_messages` table contained **3 rows** at the time of the check. The row bodies and IDs were not selected or copied into this record.
- A fresh privilege check confirmed `anon` and `authenticated` still cannot `SELECT` or `INSERT` into `feedback_messages`; `anon` cannot execute `consume_public_submission_rate_limit`, while `service_role` can. The table has RLS enabled and `read_at` exists.

**What this does and does not prove:** the public endpoint accepted requests after the CORS/origin fix, and private feedback rows exist. The checked function-log window showed no request to `feedback-inbox-admin`, so this is **not** proof that the owner unlock, inbox rendering, sent date display, or red-dot-clearing flow has been completed end to end. Those owner UI checks remain on the manual checklist below. Do not infer from a frontend error that a request was not stored; inspect the inbox before sending duplicates.

## Owner notification and feedback actions update (2026-10-18)

PR #22 is merged to main. The owner feedback management release adds:

- The Feedbacks navigation red dot and a second red dot on the mobile **More** menu button whenever the unread count is positive.
- Immediate unread-count refresh after a successful in-app feedback submission, refresh on tab focus/visibility, and a 15-second polling interval while the owner session is unlocked.
- Per-message three-dot actions. **Pin** and **Unpin** write the boolean `is_pinned` to Supabase; the server sorts pinned rows first and keeps the remaining messages newest-first. After unpinning, the item returns to its time-based position.
- **Delete** asks for confirmation and permanently deletes the row from Supabase through the signed owner-only Edge Function. The browser never receives the service-role/secret key.

### Live checks after PR #22

- Supabase project `qqmdwltfgpqtcvdbcmto`: migration `20261017224950_feedback_inbox_management` recorded as applied.
- `public.feedback_messages.is_pinned` and `feedback_messages_pinned_created_at_idx` exist; RLS is still enabled.
- SQL privilege checks returned `anon_has_direct_access=false`, `authenticated_has_direct_access=false`, and `service_role_can_delete=true` for `public.feedback_messages`.
- `feedback-inbox-admin` is ACTIVE at version 3. Its signed owner-token check still gates list/count/read/pin/delete operations.
- [PR CI](https://github.com/justryan-n2d/CEStudy/actions/runs/39076019540) and [secret scan](https://github.com/justryan-n2d/CEStudy/actions/runs/39076019549) passed. The CI run covers lint, unit tests, production build, isolated Supabase migrations/RLS, red-dot behavior, pin/unpin ordering, and delete handling.

**Still required:** manually unlock the live owner inbox with the configured owner key, submit one new feedback message, confirm the red dot appears on Feedbacks and More, pin/unpin a record, and delete a disposable test message to verify the production UI end-to-end. This workflow did not read or reuse the owner secret, and public browser reachability for the latest Pages bundle was unavailable from the verification environment, so no live browser result is claimed.
## Frontend and origin troubleshooting

### Supabase error-context crash

The frontend previously called `context.clone().json()` without checking whether the context was a browser `Response`. A non-Response context caused `l.clone is not a function`, masking the underlying request error. `src/data/public-messages.ts` now checks for callable `clone` and `json` functions before parsing and otherwise shows a safe fallback. A regression test covers non-Response error context.

### Commit-preview CORS

Unique Cloudflare preview origins such as `9cdfab2c.cestudy.pages.dev` were not originally in the exact allowlist. PR #19 adds a strict eight-hex preview-host matcher to both Edge Functions. Arbitrary/lookalike hosts, non-HTTPS and port-bearing origins remain rejected.

### Optional email for feedback

A feedback submission is successful once private database storage succeeds. Email is an optional/best-effort alert and must not turn already-stored feedback into a reported delivery failure. The owner inbox/unread marker is the primary notification. Support confirmation notifications remain separate and require verified email configuration.

## Automated verification

- [PR #18 CI](https://github.com/justryan-n2d/CEStudy/actions/runs/39068080962): passed frontend lint/tests/build and isolated Supabase migration/RLS tests.
- [PR #18 secret scan](https://github.com/justryan-n2d/CEStudy/actions/runs/39068080893): passed.
- [Main CI after PR #19](https://github.com/justryan-n2d/CEStudy/actions/runs/39069346430): passed.
- [Main secret scan after PR #19](https://github.com/justryan-n2d/CEStudy/actions/runs/39069346426): passed.
- [Main live-browser smoke test](https://github.com/justryan-n2d/CEStudy/actions/runs/39069495822): passed its current smoke suite.
- [PR #18](https://github.com/justryan-n2d/CEStudy/pull/18) and [PR #19](https://github.com/justryan-n2d/CEStudy/pull/19) are merged.

The existing live browser smoke suite checks core routes, responsiveness, Supabase connection, security headers and unpublished-practice privacy. It does **not** claim that the feedback success dialog and owner-key inbox unlock/red-dot sequence were fully automated.

## Manual end-to-end checklist

1. Open `https://cestudy.pages.dev/feedback` or a permitted eight-hex commit preview.
2. Submit one recognizable, non-sensitive message of at least 10 characters.
3. Confirm the exact success heading `message sent!` appears.
4. Open `https://cestudy.pages.dev/feedbacks` and enter the owner key locally in the browser. Never paste it into issues, chat, build logs or source control.
5. Confirm the test entry appears as **Anonymous** with the correct sent date/time.
6. Confirm the Feedbacks navigation entry is shown while the owner session is unlocked and a small red dot appears for unread messages.
7. Open the message; confirm it becomes read and the dot clears without a full page reload.
8. Check that a wrong owner key is rejected and unlock attempts are rate-limited.
9. Confirm anonymous REST SELECT/INSERT requests to `feedback_messages` fail. The live privilege query already confirms corresponding grants are absent.
10. Record only pass/fail, timestamp and safe error codes. Do not log secrets, message bodies, owner tokens or private message identifiers.
11. Delete test records only after the owner confirms which entries are test data. Never delete real feedback automatically.

## Access model and future authentication

- Public senders remain anonymous until CEStudy implements accounts. The Feedback page does not collect sender names or email addresses.
- `FEEDBACK_INBOX_ACCESS_KEY` must be a high-entropy key of at least 32 characters stored exclusively in Supabase Edge Function secrets.
- Unlock issues a signed token valid for 30 minutes. The browser holds the token in memory; reload locks the inbox.
- `/feedbacks` fetches messages only through `feedback-inbox-admin`, showing category, message, sent date and read state.
- The shared key is temporary. Once accounts exist, replace it with Supabase Auth and an explicit owner/admin authorization check. Do not grant inbox access to all authenticated students.

## Related docs

- [Contact/support/feedback spec](../specs/CONTACT_SUPPORT_FEEDBACK_PAGES.md)
- [Project status](../PROJECT_STATUS.md)
- [Repository README](../../README.md)
