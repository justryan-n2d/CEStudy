# CEStudy Development Roadmap

**Status:** Planning  
**Approach:** Validate the problem, define a small MVP, build the responsive web app first, and defer native mobile apps until the core experience proves useful.

## Phase 0: Project foundation

- [x] Create the GitHub repository.
- [x] Add initial project documentation.
- [x] Keep the repository public for now, as decided.
- [x] Select the initial technology stack.
- [x] Document mandatory backend security requirements.
- [ ] Agree on the first target user and most important problem.
- [ ] Define success metrics for a small pilot.

**Exit condition:** The target user, first use case, MVP boundary, and initial success measures are written down.

## Phase 1: Validate the need

- [ ] Talk to Civil Engineering students from different year levels.
- [ ] Identify how students currently review and where existing tools fall short.
- [ ] Find the first few subjects and topics worth supporting.
- [ ] Test whether students value question practice, explanations, progress tracking, or another feature most.
- [ ] Check content sourcing, attribution, and permissions for contributed materials.
- [ ] Record findings and revise scope before building.

**Exit condition:** Evidence supports one focused use case and a manageable initial content set.

## Phase 2: Define the MVP

- [ ] Map the main user journey from landing page to completing a practice session.
- [ ] Prioritize features as Must-have, Later, or Out of scope.
- [ ] Draft mobile-first wireframes.
- [ ] Define the question format, answer explanations, topic tags, and content review status.
- [ ] Decide whether accounts are necessary for the first release.
- [ ] Refine privacy, moderation, backup, and abuse-prevention requirements for the chosen MVP.
- [ ] Estimate database, hosting, AI, and storage costs under realistic usage.

**Exit condition:** The MVP and technical design can be implemented without major unresolved decisions.

## Selected initial stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS.
- **Hosting:** Cloudflare Pages.
- **Main backend:** Supabase PostgreSQL with RLS; Auth and Storage when needed.
- **Source control and automation:** GitHub.
- **Optional server-side functions:** Cloudflare Workers or Supabase Edge Functions only for specific requirements.

See [Project Scope](PROJECT_SCOPE.md) for the direction and [Security Requirements](SECURITY_REQUIREMENTS.md) for mandatory security standards.

## Phase 3: Build the web MVP

The stack is selected. Implementation tasks should follow the approved MVP scope and security requirements.

Possible MVP components:
- [ ] Responsive home and subject navigation.
- [ ] Subject and topic pages.
- [ ] Practice-question flow with answer feedback.
- [ ] Clear explanations and content-source/verification metadata.
- [ ] Basic progress tracking if it is essential to the validated use case.
- [ ] Minimal, protected content-management workflow for managing and reviewing questions.
- [ ] Database migrations with explicit grants and RLS policies.
- [ ] Automated database security tests for both allowed and forbidden access.
- [ ] Error handling, accessibility checks, and privacy-conscious analytics.
- [ ] Deployment, environment configuration, secret management, and database/storage backup plan.

**Exit condition:** A small group can use the site to complete the core study task reliably on a phone, and security checks show that unauthorized actions are denied.

## Phase 4: Test and improve

- [ ] Test with a small group of students.
- [ ] Check answer accuracy and report incorrect or unclear content.
- [ ] Measure whether users complete practice sessions and return.
- [ ] Fix high-impact usability, security, and reliability issues.
- [ ] Review actual costs and free-tier limits.
- [ ] Document known limitations and support/contact process.
- [ ] Complete the production security gate in [Security Requirements](SECURITY_REQUIREMENTS.md).

**Exit condition:** User feedback, usage evidence, and security testing justify the next development step.

## Phase 5: Expand carefully

Possible future work, only when evidence supports it:
- [ ] User-submitted questions with moderation and attribution.
- [ ] AI-assisted explanations and study support with cost controls.
- [ ] Bookmarks, custom quizzes, and richer progress insights.
- [ ] Offline-friendly behavior or downloadable reviewer sets.
- [ ] Additional subjects and year levels.
- [ ] Revenue options that preserve a useful free tier.
- [ ] Android/iOS delivery, based on web usage and user demand.

## Ongoing quality and safety checklist

- [ ] Never commit API keys, tokens, passwords, or real user data.
- [ ] Verify calculations and technical answers before marking them as reviewed.
- [ ] Clearly distinguish verified content from unreviewed community or AI-generated content.
- [ ] Respect copyright and require clear rights/attribution for submitted material.
- [ ] Collect only the personal data the product actually needs.
- [ ] Apply least privilege and review database grants, RLS policies, views, functions, and storage policies.
- [ ] Test denial cases, including cross-user access and privilege escalation.
- [ ] Monitor service limits, storage, backups, and recurring costs.
- [ ] Avoid adding features just because they are technically possible.

## Decision log

Record significant choices with the date, options considered, reason, and consequences.

| Date | Decision | Status |
|---|---|---|
| 2026-10-14 | Start with product definition and a responsive web MVP; postpone native mobile apps until validated | Approved direction |
| 2026-10-14 | Use React + TypeScript + Vite + Tailwind CSS, hosted on Cloudflare Pages, with Supabase as the main backend and GitHub for development | Selected |
| 2026-10-14 | Require database-enforced access control, least-privilege grants, RLS, secret management, and automated security tests before production | Mandatory |
