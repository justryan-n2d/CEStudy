# CEStudy

**A low-cost Civil Engineering reviewer for students.**

CEStudy aims to help Civil Engineering students from first year through fourth year review concepts, practice questions, and prepare for exams using a smooth, student-friendly experience.

## Product direction

- **Free-first:** keep the core study experience affordable and useful.
- **Mobile-friendly:** build a responsive web app designed for students who primarily use phones, with PWA support considered where useful.
- **Useful practice:** organize questions by subject, topic, and difficulty where appropriate.
- **Trustworthy learning:** explain answers and flag uncertain or unreviewed material instead of presenting it as fact.
- **Community contributions:** allow learning materials and questions to be contributed with clear review and attribution rules.
- **No student-facing AI in the MVP:** prioritize reviewed practice materials; consider an AI Study Helper only after real student feedback justifies it.
- **Future-ready:** validate the web MVP before considering separate Android and iOS apps.

## Current status

**Planning and product definition.** The initial stack and mandatory security baseline have been selected. The MVP will not include a student-facing AI tutor or live AI API integration; implementation and production launch are not yet complete. See the [roadmap](docs/ROADMAP.md), [project scope](docs/PROJECT_SCOPE.md), and [security requirements](docs/SECURITY_REQUIREMENTS.md).

## Selected initial technology stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS.
- **Hosting:** Cloudflare Pages.
- **Main backend:** Supabase, using PostgreSQL and RLS; Auth and Storage will be added as required by the approved MVP.
- **Development workflow:** GitHub for source control and automated checks.

Cloudflare Workers or Supabase Edge Functions may be introduced later only when a specific server-side requirement justifies them. The initial architecture should stay simple and avoid overlapping backend services unnecessarily.

## Planned core experience

1. Browse reviewer materials by year, subject, and topic.
2. Practice questions and check explanations.
3. Track study progress and revisit difficult questions.
4. Use AI-assisted explanations where available, with clear usage limits and safeguards.
5. Contribute questions or study notes under defined review and attribution rules.

These are planned directions, not implemented features.

## Development and security principles

- Build the smallest useful version before adding advanced features.
- Prioritize accuracy, readability, accessibility, performance, and low data usage.
- Keep secrets and private user data out of Git.
- Enforce access control in PostgreSQL/Supabase and trusted backend operations, never only in the frontend.
- Require reviewed grants, RLS policies, least privilege, and automated allow/deny tests before production release.
- Verify important calculations and technical explanations before publication.
- Choose services based on cost, security, maintainability, backup options, and portability.
- Document major decisions in the repository.

## Documentation

- [Project scope](docs/PROJECT_SCOPE.md)
- [Development roadmap](docs/ROADMAP.md)
- [Security requirements](docs/SECURITY_REQUIREMENTS.md)

## License

No open-source license has been added. Do not assume the source code is licensed for reuse. A license decision can be made later.
