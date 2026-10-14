# CEStudy Development Roadmap

**Status:** Planning  
**Approach:** Validate the problem, define a small MVP, build the responsive web app first, and defer mobile apps until the core experience proves useful.

## Phase 0: Project foundation

- [x] Create the GitHub repository.
- [x] Add initial project documentation.
- [ ] Confirm repository visibility and access settings.
- [ ] Agree on the first target user and most important problem.
- [ ] Define success metrics for a small pilot.
- [ ] Compare candidate tech stacks and their free-tier limits before committing.

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
- [ ] Define privacy, moderation, backup, and abuse-prevention requirements.
- [ ] Estimate database, hosting, AI, and storage costs under realistic usage.
- [ ] Select a stack based on cost, ease of development on mobile, security, and portability.

**Exit condition:** The MVP and technical design can be implemented without major unresolved decisions.

## Phase 3: Build the web MVP

The exact stack and implementation tasks will be chosen after Phase 2.

Possible MVP components:
- [ ] Responsive home and subject navigation.
- [ ] Subject and topic pages.
- [ ] Practice-question flow with answer feedback.
- [ ] Clear explanations and content-source/verification metadata.
- [ ] Basic progress tracking if it is essential to the validated use case.
- [ ] Minimal administration workflow for managing and reviewing content.
- [ ] Error handling, accessibility checks, and basic analytics that respect privacy.
- [ ] Deployment, environment configuration, and database backup plan.

**Exit condition:** A small group can use the site to complete the core study task reliably on a phone.

## Phase 4: Test and improve

- [ ] Test with a small group of students.
- [ ] Check answer accuracy and report incorrect or unclear content.
- [ ] Measure whether users complete practice sessions and return.
- [ ] Fix high-impact usability and reliability issues.
- [ ] Review actual costs and free-tier limits.
- [ ] Document known limitations and support/contact process.

**Exit condition:** User feedback and usage evidence justify the next development step.

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
- [ ] Monitor service limits, storage, backups, and recurring costs.
- [ ] Avoid adding features just because they are technically possible.

## Decision log

Record significant choices with the date, options considered, reason, and consequences.

| Date | Decision | Status |
|---|---|---|
| 2026-10-14 | Start with product definition and a responsive web MVP; postpone mobile apps until validated | Initial direction |
| 2026-10-14 | Keep the tech stack undecided until requirements and cost limits are reviewed | Open |
