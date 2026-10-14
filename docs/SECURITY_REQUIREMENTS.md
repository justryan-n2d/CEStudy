# CEStudy Security Requirements

**Status:** Approved project requirement  
**Last reviewed:** 2026-10-14  
**Applies to:** Development, testing, deployment, and production  
**Owner:** CEStudy maintainers

## 1. Security commitment

Security is a release requirement, not a frontend-only feature or a task to postpone until launch. CEStudy must enforce authorization at trusted backend and database boundaries. Hiding buttons, protecting routes in React, or validating data only in the browser does not count as access control.

These requirements define the baseline for implementation. They do not claim that the application is already secure or guarantee that every vulnerability can be prevented. Security checks must be implemented and verified before production release.

## 2. Selected architecture

- **Frontend:** React + TypeScript + Vite + Tailwind CSS.
- **Web hosting:** Cloudflare Pages.
- **Main backend:** Supabase, using PostgreSQL and Row Level Security (RLS); Supabase Auth and Storage will be enabled as needed by approved MVP features.
- **Source control and automation:** GitHub.
- **Optional future backend compute:** Cloudflare Workers or Supabase Edge Functions only when a specific server-side need justifies them. Do not duplicate backend services without a clear reason.

The browser is an untrusted environment. The frontend may use a Supabase publishable key, but database permissions and RLS must limit every operation that key can perform.

## 3. Non-negotiable database security

1. Enable RLS on every table in a schema exposed through the Supabase Data API. Review views and functions separately because their permissions and behavior can differ from ordinary tables.
2. Configure PostgreSQL grants and RLS policies together. RLS policies do not replace object-level grants.
3. Use least privilege. Grant each database role only the operations and objects it needs.
4. Create clear, operation-specific policies for SELECT, INSERT, UPDATE, and DELETE where those operations are relevant. Avoid broad policies that grant more access than a feature requires.
5. Default to deny. New tables, columns, views, functions, and storage buckets must not become public unintentionally.
6. Keep schema changes in reviewed, version-controlled migrations. Review grants and policies in the same migration as the objects they protect.
7. Never trust user IDs, ownership fields, role names, verification flags, or publication status supplied by the browser. Enforce ownership and allowed state changes in database policies or trusted server-side logic.
8. Review database views, RPC functions, triggers, and stored procedures for permission bypasses. Do not use SECURITY DEFINER by default. Any justified use must receive a security review, restrict EXECUTE permission, validate caller authorization, and use a safe search path.
9. Run database security checks and policy tests after schema or authorization changes. Passing tests in the UI alone is insufficient.

## 4. Initial access model

Exact policies must be written and tested against the final schema. This table describes the intended access model, not implemented permissions.

| Role | Intended access |
|---|---|
| Signed-out visitor (anon) | Read only reviewer content explicitly approved and published for public use. No access to private user data or content-management operations. |
| Signed-in student | Read published reviewer content; read or change only their own permitted profile, bookmarks, and study progress. No ability to approve, publish, or grant themselves elevated access. |
| Content reviewer | Review assigned content and submit review decisions only within explicitly granted responsibilities. |
| Administrator | Manage content and users only through protected, explicitly authorized operations. Administrative access must be limited to trusted, designated accounts. |
| Privileged server or migration role | Used only for a defined trusted operation. Credentials are never placed in client code and must not be generally available to the application. |

The MVP may launch without accounts if accounts are not essential to the validated study experience. Do not add unnecessary personal-data collection merely to enable sign-in.

## 5. Authentication and role management

- Authenticate users with a supported, maintained authentication flow when accounts are introduced.
- Verify identity and authorization on every protected operation; a frontend route guard is only a usability feature.
- Enforce record ownership using the authenticated identity, such as auth.uid(), and ensure INSERT and UPDATE policies prevent users from assigning records to another user.
- Never use user-editable user metadata as the source of truth for authorization or administrator status.
- Store elevated roles in a protected server-controlled role system or trusted app metadata. Users must not be able to modify their own role.
- Limit administrator access to designated accounts. Require multi-factor authentication for administrator accounts where the selected setup supports it; document compensating safeguards if it cannot be enabled.
- Configure session expiration, account recovery, email verification, and authentication rate limits appropriately before accounts launch.
- When a user is removed or loses privileges, assess session revocation and token lifetime so old sessions cannot retain inappropriate access.

## 6. Secrets and environment configuration

- Only a Supabase publishable key may be included in client-side configuration. It is public by design and safe only when database grants and RLS are correct.
- Never expose Supabase secret or service-role keys, database passwords, signing secrets, private API keys, or privileged tokens in the browser, Vite variables intended for the client, committed files, logs, screenshots, or public issues.
- Secret/service-role credentials bypass RLS. Use them only in tightly controlled server-side or maintenance contexts that perform explicit authorization and validation. Prefer user-scoped access governed by RLS when possible.
- Store deployment credentials in the relevant platform's protected secret manager, such as GitHub Actions secrets or Cloudflare Worker secrets. Do not put secret values in ordinary configuration variables.
- Keep local secret files out of Git using .gitignore. Provide a sanitized example environment file containing placeholder values only.
- Enable and run secret scanning. If a credential is exposed, treat it as compromised: revoke or rotate it promptly, inspect use where logs are available, and remove the exposure from current code and history as appropriate. Deleting a visible string alone does not invalidate a leaked credential.

## 7. API, input, and application security

- Validate and constrain all untrusted input at the backend/database boundary, including types, lengths, accepted values, ownership, and allowed state transitions.
- Use parameterized database operations and safe query construction. Never build SQL by concatenating untrusted input.
- Apply appropriate authentication, authorization, rate limiting, payload-size limits, and timeouts to custom APIs, AI endpoints, uploads, and expensive operations.
- Do not rely on CORS, obscured endpoints, API keys, hidden UI controls, or client-side checks as authorization.
- Treat reviewer text, user submissions, imported files, Markdown, URLs, and AI-generated output as untrusted until validated. Avoid rendering raw HTML from untrusted content; prevent cross-site scripting.
- Configure appropriate browser security headers, including a considered Content Security Policy, for the deployed site. Test changes so needed assets continue to work.
- Keep dependencies maintained, commit the lockfile, review security advisories, and avoid unnecessary packages.
- If custom server-side code is added, keep it small and focused. Verify caller identity and permission inside the server-side operation instead of assuming the frontend has already checked.

## 8. File and object storage

- Keep private files in private buckets by default. Public buckets may contain only assets intentionally approved for public access.
- Write and test Storage access policies. A user must not read, replace, or delete another user's private objects without explicit authorization.
- Restrict file types, sizes, and upload frequency. Do not trust browser-provided MIME types as the only validation.
- Use short-lived signed URLs when temporary access to private files is appropriate.
- Plan separate backup and recovery for uploaded objects. Do not assume a database backup automatically includes all Storage files.

## 9. Student privacy and content integrity

- Collect only data needed for the approved product features and explain why it is collected.
- Keep personal study progress, profile details, and private submissions inaccessible to other students by default.
- Separate drafted, submitted, reviewed, rejected, and published content states. Students must not be able to mark their own content as verified or publish it without authorization.
- Preserve source, attribution, permission status, reviewer status, and correction history for study content where applicable.
- Treat AI-generated explanations as unverified until they pass the project's chosen review process. AI output must not grant its own verification status.
- Provide a practical way to report incorrect content and remove content when there is a valid rights or safety concern.

## 10. Automated security testing

Create repeatable tests for the actual database permissions and RLS policies. Use Supabase database tests where practical, including supabase test db, and run tests in CI or an equivalent controlled workflow.

At minimum, verify:

- Signed-out users cannot create, edit, delete, or publish reviewer content.
- Signed-out users can read only content intended for public release.
- Student A cannot read or modify Student B's profile, bookmarks, progress, or private files.
- A student cannot change their own role, set administrator status, approve content, or bypass publication rules.
- Authorized reviewers and administrators can perform only their explicitly permitted operations.
- INSERT and UPDATE cannot assign another user's ID or bypass ownership checks.
- Unapproved content, secrets, privileged tables, and private storage objects are not exposed through the Data API, views, RPC functions, or Storage API.
- Both permitted and forbidden SELECT, INSERT, UPDATE, and DELETE cases are covered for relevant database roles.
- Direct API requests are tested, not just normal frontend flows.

For each access rule, test both the expected success case and the expected denial case. A test suite that checks only successful requests is incomplete.

## 11. CI, deployment, backups, and operations

- Run automated build, type-check, lint, and security tests before merging or releasing.
- Use protected environment secrets and separate preview/testing configuration from production configuration.
- Review GitHub Actions permissions and third-party actions; give workflows only the repository permissions they need.
- Run dependency and secret scanning. Consider static analysis and database-policy checks as the codebase grows.
- Apply schema changes through reviewed migrations and verify the resulting policies after deployment.
- Maintain backups or exports for important database content and independently plan for Storage objects. Test restoration instead of assuming a backup is usable.
- Monitor available authentication, database, platform, and application logs for suspicious or excessive activity without logging passwords, tokens, or unnecessary personal information.
- Document key rotation and incident response steps. On suspected compromise, restrict affected operations, rotate credentials, review available logs, fix the root cause, and restore data only from a verified clean backup if needed.

## 12. Release security gate

The production release must not proceed until the applicable items below are complete:

- [ ] All exposed tables have reviewed grants and RLS policies.
- [ ] Views, functions, RPC endpoints, and Storage policies have been reviewed.
- [ ] Authorization is enforced at database or trusted server boundaries, not only in the UI.
- [ ] Role escalation and cross-user access tests are passing.
- [ ] No privileged secrets are present in the client bundle, Git history for the release, or public configuration.
- [ ] Authentication and admin access settings have been reviewed if accounts or admin tools are enabled.
- [ ] Input validation, rate limiting, and abuse controls are in place for relevant endpoints.
- [ ] Dependency, build, and security tests pass; unresolved critical/high severity issues are fixed or formally assessed before release.
- [ ] Backup and recovery procedures are documented and a restore has been tested for data that must be recoverable.
- [ ] Production settings and deployment secrets have been checked separately from development/preview settings.
- [ ] Final security review is recorded, with any accepted risks and follow-up actions documented.

If a requirement is not applicable to the current MVP, record why instead of silently skipping it. If a critical access-control test fails, block release until it is fixed and verified.

## 13. Incident response minimum

If a key, account, or dataset may be compromised:

1. Contain the affected access path and revoke or rotate compromised credentials.
2. Review available logs and assess which data or operations may have been affected.
3. Patch the cause, add a regression test, and verify that the unauthorized action is denied.
4. Restore affected data only from a verified clean backup when necessary.
5. Document the incident, response, and any required user notification.

## 14. Official references

Review these current official guides during implementation, and re-check them when Supabase or Cloudflare behavior changes:

- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase: Securing your API](https://supabase.com/docs/guides/api/securing-your-api)
- [Supabase API keys and elevated access](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase secure configuration and production guidance](https://supabase.com/docs/guides/security/product-security)
- [Supabase production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
- [Cloudflare Workers secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

These requirements describe CEStudy's intended baseline. They must be translated into concrete schema migrations, policies, tests, and deployment configuration before the application is considered production-ready.
