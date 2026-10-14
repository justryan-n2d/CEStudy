# CEStudy remote Supabase provisioning record

**Date:** 2026-10-15  
**Status:** Database initialized and database-level security checks passed. Cloudflare preview verification is still pending.

## What was configured

- Created a separate Supabase project named `CEStudy` in the approved organization.
- Selected region `ap-southeast-1` (Singapore) for the intended Philippines audience.
- Applied `supabase/migrations/202610140001_public_catalog_and_practice.sql`.
- Seeded the public subject catalog and original practice-question drafts from `supabase/seed.sql`.

The project reference, endpoint, and key values are intentionally not recorded in this public repository. Store them in the appropriate project settings, not in source control.

## Remote verification

Checks run against the remote database:

| Check | Result |
| --- | --- |
| `catalog_subjects` table | Present, 72 rows |
| `practice_questions` table | Present, 8 rows |
| Row-level security on both tables | Enabled |
| Public-role catalog SELECT privilege | Granted |
| Public-role practice-question SELECT privilege | Granted; the row policy limits visibility to published questions |
| Public-role INSERT, UPDATE, DELETE privileges on both tables | Not granted |
| Published questions | 0 |
| Security advisor lints | No findings returned |

All eight seeded practice questions remain `needs-review`. Do not publish any question until a human reviewer checks its prompt, choices, answer, working, explanation, and source/permissions.

The checks above verify remote schema, grants, policies, seed counts, and Supabase security-advisor output. They do **not** yet establish that the hosted frontend can reach the remote API from Cloudflare Pages.

## Remaining deployment gates

1. Configure Cloudflare Pages from the GitHub repository.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to values from the dedicated CEStudy project. Never put a Supabase secret or service-role key in a `VITE_*` variable.
3. Wait for the Pages preview deployment and verify the actual preview URL.
4. Test catalog loading, hidden unpublished questions, denied anonymous writes, route refreshes, and mobile/desktop layouts in the deployed preview.
5. Complete the educational-content review and the remaining items in `launch-checklist.md` before inviting students.

See [Supabase setup](supabase-setup.md), [Cloudflare Pages setup](cloudflare-pages.md), and the [launch checklist](launch-checklist.md).
