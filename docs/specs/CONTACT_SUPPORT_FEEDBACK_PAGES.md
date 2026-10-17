# CEStudy contact, support, bug report, and feedback pages

## Page plan

### Contact: `/contact`
- Show the configured public contact email when one has been supplied.
- Provide clear links to the distinct support, bug-report, and feedback pages.
- If no contact email is configured, say so instead of inventing a destination.

### Support: `/support`
- Offer GCash and PayPal cards.
- GCash opens a dialog with the configured QR image, an optional message, a user confirmation checkbox, and a Complete button.
- PayPal opens the configured PayPal link in a new tab, then offers an optional message and the same explicit confirmation step.
- Confirmation creates a private record and notifies the allowlisted CEStudy recipients. It is a user-reported confirmation, not proof of payment. No amount or payment verification is inferred.

### Bug reports: `/bug-reports`
- Collect a short summary, affected page/feature, observed behavior, expected behavior, and reproduction steps.
- Open a Gmail compose draft with a subject such as `CEStudy bug report: Search does not return results` and a prefilled report body.
- The user reviews and sends the email themselves. CEStudy does not store this report.
- The send button stays disabled until the intended Gmail recipient has been configured.

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

- `VITE_CESTUDY_CONTACT_EMAIL`: the public CEStudy contact address.
- `VITE_BUG_REPORT_EMAIL`: the Gmail address that should receive bug reports.
- `VITE_GCASH_QR_URL`: an HTTPS URL or same-origin path to the approved GCash QR image.
- `VITE_PAYPAL_SUPPORT_URL`: the HTTPS PayPal support/donation URL.

### Supabase Edge Function secrets

Set these under the CEStudy Supabase project's Edge Function secrets. Never commit or add these to Vite variables.

- `RESEND_API_KEY`: Resend API key used by the server function.
- `RESEND_FROM_EMAIL`: sender identity on a domain verified in Resend.
- `ADMIN_NOTIFICATION_RECIPIENTS`: comma-separated allowlist of exactly the addresses you authorize to receive and read feedback/support messages.
- `ALLOWED_ORIGINS`: comma-separated allowlist of CEStudy origins, including production and the stable Cloudflare branch-preview URL. Add a temporary preview URL only if that exact preview needs to submit messages.

Supabase provides its function URL and server-side secret key through its runtime environment. Do not add them to client code.

## Deploy order

1. Review and merge the code only after CI and the database RLS tests pass.
2. Set the Supabase Edge Function secrets and Cloudflare public build variables.
3. Apply the reviewed database migration.
4. Deploy `submit-public-message` with JWT verification disabled only because the public form supports signed-out visitors; its request validation, origin allowlist, private DB permissions, and rate-limit RPC are required.
5. Verify a feedback test reaches only the authorized inbox, verify an unapproved origin is rejected, confirm anonymous table reads/inserts fail, and verify support test email says payment is unverified.
6. Test Gmail recipient and subject after the destination address is configured.
7. Delete test feedback/support records through trusted maintenance tooling if test submissions are used.

## Dependency decision

No new npm package is required. The frontend reuses the installed Supabase client; the Edge Function uses Deno's built-in `fetch` to call the Resend Email API and the existing Supabase REST/RPC interface.
