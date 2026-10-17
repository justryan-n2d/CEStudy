# CEStudy contact, support, bug report, and feedback pages

## Page plan

### Contact: `/contact`
- Show `cestudy00@gmail.com` as the public contact address, with an optional Pages environment override.
- Provide clear links to the distinct support, bug-report, and feedback pages.

### Support: `/support`
- Offer GCash and PayPal cards.
- GCash opens a dialog with the configured QR image, an optional message, a user confirmation checkbox, and a Complete button.
- PayPal opens the configured PayPal link in a new tab, then offers an optional message and the same explicit confirmation step.
- Confirmation creates a private record and notifies the allowlisted CEStudy recipients. It is a user-reported confirmation, not proof of payment. No amount or payment verification is inferred.

### Bug reports: `/bug-reports`
- Collect a short summary, affected page/feature, observed behavior, expected behavior, and reproduction steps.
- Open a Gmail compose draft with a subject such as `CEStudy bug report: Search does not return results` and a prefilled report body.
- The user reviews and sends the email themselves. CEStudy does not store this report.
- The recipient defaults to `cestudy00@gmail.com`; a Pages environment override is optional.

### Feedback: `/feedback`
- Collect optional name and reply email, a category, and the message.
- Show sending/loading state, an actionable error if submission or notification fails, and a success dialog whose heading is exactly `message sent!`.
- Public visitors cannot read submission tables. The Edge Function sends the message body only to the server-configured recipient allowlist.
- The public form has no attachment upload and requires no student account.

## Privacy and security

- `feedback_messages`, `support_confirmations`, and `contact_submission_limits` have RLS enabled and no client-facing policies. The `anon` and `authenticated` roles have no table privileges.
- Only the Edge Function's server-side service key can use the private table REST API. The browser never receives that key.
- The Edge Function validates types and length, requires a UUID idempotency key, uses database-backed per-fingerprint rate limits, and returns no message records to the caller.
- A rate limit stores a keyed SHA-256 fingerprint, not a raw IP address; stale entries are pruned on each rate-limit call.
- The function sends separate notification emails to each entry in `ADMIN_NOTIFICATION_RECIPIENTS`. The request body cannot set or change recipients.
- A successful UI dialog appears only after all allowlisted notifications return successfully and the stored status is updated. If notification fails after storage, the error says the private submission was retained.
- Resend idempotency keys prevent duplicate notices when a user retries the same submission.
- Support confirmation emails must clearly say the payment is not independently verified.

## Configuration required before enabling the live form

### Public Cloudflare Pages build variables

Set these as Pages environment variables, then rebuild/deploy. These values are public by design and must not contain keys or secrets.

- `VITE_CESTUDY_CONTACT_EMAIL`: defaults to `cestudy00@gmail.com`.
- `VITE_BUG_REPORT_EMAIL`: defaults to `cestudy00@gmail.com`.
- `VITE_GCASH_QR_URL`: optional same-origin override for the approved GCash QR image. If omitted or blank, Support uses `/branding/gcash-support-qr.png`, cropped from the QR supplied by the site owner. Keep the file under `public/branding/` to comply with the existing CSP.
- `VITE_PAYPAL_SUPPORT_URL`: the HTTPS PayPal support/donation URL.

### Supabase Edge Function secrets

Set these under the CEStudy Supabase project's Edge Function secrets. Never commit or add these to Vite variables. Resend has no verified sender domain configured yet, so email notifications stay unavailable until a sender domain and API key are set.

- `FEEDBACK_INBOX_ACCESS_KEY`: a high-entropy private key of at least 32 characters for the owner inbox. It belongs only in Supabase Edge Function secrets, never in `VITE_*` variables.
- `RESEND_API_KEY`: Resend API key used by the server function.
- `RESEND_FROM_EMAIL`: sender identity on a domain verified in Resend.
- `ADMIN_NOTIFICATION_RECIPIENTS`: optional comma-separated allowlist of authorized feedback/support recipients. If absent, only `cestudy00@gmail.com` is notified.
- `ALLOWED_ORIGINS`: comma-separated allowlist of CEStudy origins, including production and the stable Cloudflare branch-preview URL. Add a temporary preview URL only if that exact preview needs to submit messages.

Supabase provides its function URL and server-side secret key through its runtime environment. Do not add them to client code.

## Deploy order

1. Review and merge the code only after CI and the database RLS tests pass.
2. Set the Supabase Edge Function secrets and Cloudflare public build variables.
3. Apply the reviewed database migration.
4. Deploy `submit-public-message` with JWT verification disabled only because the public form supports signed-out visitors; its request validation, origin allowlist, private DB permissions, and rate-limit RPC are required.
5. Deploy `feedback-inbox-admin` after setting `FEEDBACK_INBOX_ACCESS_KEY` as a server-side Supabase secret. It disables JWT verification only because it validates a custom owner key and HMAC-signed token itself.
6. Verify anonymous submissions are stored as Anonymous with timestamps, an invalid owner key/token cannot access the inbox, unlock attempts are throttled, unapproved origins are rejected, and anonymous table reads/inserts fail. Verify support notices say payment is unverified.
7. Test Gmail recipient and subject after the destination address is configured.
8. Delete test feedback/support records through trusted maintenance tooling if test submissions are used.

## Dependency decision

No new npm package is required. The frontend reuses the installed Supabase client; the Edge Function uses Deno's built-in `fetch` to call the Resend Email API and the existing Supabase REST/RPC interface.


## Owner-only feedback inbox: `/feedbacks`

- Feedback submissions are anonymous until CEStudy implements accounts. The public form does not request a name or email; the owner inbox labels each sender **Anonymous** and uses the server-created `created_at` timestamp.
- The Feedbacks top-navigation link and its tiny red unread dot appear only while the owner has unlocked the inbox in the current tab. The header refreshes unread count every 45 seconds and when the window regains focus.
- Selecting a message marks it read server-side. The inbox loads 25 entries at a time and includes older messages when requested.
- `feedback-inbox-admin` verifies `FEEDBACK_INBOX_ACCESS_KEY` server-side, rate-limits unlock attempts using a separate database bucket, and issues a 30-minute HMAC-signed token. The raw key is not persisted in the browser; the token is held in page memory and disappears on reload.
- The browser never reads the private feedback table directly. Anonymous/authenticated DB roles still have no table privileges; the Edge Function checks a signed owner token before listing, counting, or updating read state.
- Before enabling the inbox, add a random key of at least 32 characters as the Supabase Edge Function secret `FEEDBACK_INBOX_ACCESS_KEY`. Never expose it through `VITE_*` variables or source control. The inbox remains disabled until that secret, the migration, and the Edge Function are deployed.
- This is a temporary owner gate because CEStudy accounts do not exist yet. Replace it with Supabase Auth and a dedicated owner/admin role when accounts are implemented.
