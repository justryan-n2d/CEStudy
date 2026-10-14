# ADR 0001: Initial CEStudy web architecture

**Status:** Accepted on 2026-10-14

## Decision

Use React + TypeScript + Vite + Tailwind CSS, deploy the static build to Cloudflare Pages, use Supabase PostgreSQL with RLS for public catalog and published practice reads, and develop through GitHub. Native Android and iOS apps are deferred until the web MVP is validated.

## Options considered

1. **Selected: Vite, React, TypeScript, Tailwind, Supabase, and Cloudflare Pages.** Component-based UI, TypeScript, focused tests, GitHub source control, static hosting, and relational data with database-enforced access control.
2. **Static HTML/CSS/JavaScript with local data.** Simpler, but less aligned with the chosen database-backed catalog and versioned content workflow.
3. **Server-rendered full-stack framework.** More capability than the current catalog-and-practice MVP requires.

## Reasons and boundaries

- React components and mobile-first styling support reusable year, subject, and detail views.
- TypeScript and automated tests help catch interface and content model mistakes.
- Vite produces static assets suitable for Cloudflare Pages.
- Supabase stores structured, portable PostgreSQL data. Explicit grants and RLS are required for public reads.
- GitHub is the source of truth for code, migrations, seed content, tests, and deployment instructions.
- Start with a minimal database and low-cost static hosting. Provider quotas, behavior, prices, and limits can change and must be reviewed before launch.
- The Supabase publishable key is public by design and safe only when grants and RLS are correct. Never place a secret/service-role key, database password, or privileged token in client code or a Vite-prefixed variable.
- Public catalog content is read-only in the browser. Trusted updates use reviewed migrations or maintenance operations.
- Auth, Storage, AI API integration, student-facing AI tutor, AI-generated questions, account registration, cloud-synced progress, and public submissions are out of scope for this MVP.
- Database access tests must cover allowed and forbidden requests. Frontend route guards are not authorization.

## Consequences

Students can browse public subjects without accounts. Practice material remains hidden until its status is intentionally set to published. Before production, run database policy tests, re-check current CHED issuances, configure deployment environments, and test backups and restoration.
