# CEStudy Project Scope

## Vision

Make Civil Engineering review materials and practice more accessible to students, especially those who need a low-cost, mobile-friendly study tool.

## Intended users

- Civil Engineering students in first through fourth year.
- Students reviewing foundational and major subjects.
- Eventually, educators or trusted contributors who can help review and improve materials.

These groups are initial assumptions and should be validated with student feedback.

## Core problem to investigate

Students may have reviewer files and scattered practice questions but lack a convenient way to find topic-based questions, understand explanations, and identify what to review next. The first validation step is to check whether this is a frequent, important problem for the intended users.

## Initial product principles

1. **Mobile-first:** the main experience should work well on common phones and slower connections.
2. **Free-first:** minimize running costs and avoid paywalls around the basic learning loop.
3. **Accuracy before quantity:** prioritize reviewed, well-explained questions over a large unverified question bank.
4. **Transparent sources:** record attribution and the review status of content.
5. **Useful AI:** AI may help explain concepts, but should not be treated as an unquestionable source of engineering answers.
6. **Privacy by default:** avoid collecting unnecessary personal information.
7. **Incremental development:** ship a small, useful web MVP before considering native mobile apps.

## Candidate MVP features

Final MVP features are **not yet approved**. Candidates to validate:
- Browse subjects and topics.
- Answer practice questions.
- See explanations and relevant references.
- Save questions or review progress.
- Basic content-management and review workflow.

Accounts, AI features, community submissions, advanced analytics, and mobile applications should be added only if the validated use case requires them.

## Out of scope for the first version

- Claiming that CEStudy replaces textbooks, instructors, official codes, or professional judgment.
- Automatically publishing unreviewed engineering calculations as verified answers.
- Building every year level and subject before testing a small set.
- Building separate native Android and iOS apps before the web experience is validated.
- Expensive infrastructure before actual usage requires it.

## Content quality and permissions

- Track the source and attribution for materials.
- Only publish content the project has permission to use or that is appropriately licensed.
- Label submitted or AI-assisted content as unreviewed until it has passed the chosen review process.
- Provide a way to report mistakes and correct them.
- Do not imply endorsement by a university, professional organization, or licensing authority.

## Technical direction

The technology stack has not been selected. Evaluate options using:
- Free-tier limits and likely operating costs.
- Ease of coding, testing, and maintaining from a phone.
- Security and access control.
- Backup and data export options.
- Portability and avoidance of unnecessary vendor lock-in.
- Accessibility, performance, and mobile support.

Potential tools may include GitHub, a managed database/backend, and a low-cost hosting platform, but no specific choice is final.

## Key risks

| Risk | Initial response |
|---|---|
| Incorrect engineering answers | Review process, source metadata, user reports, and visible verification status |
| Copyright issues | Permission checks, attribution, and content removal process |
| AI costs grow unexpectedly | Usage limits, caching where appropriate, and AI as an optional feature |
| Free-tier limits change | Monitor usage, keep backups, and review alternatives |
| Scope becomes too large | Validate and ship one core study workflow first |
| Low student retention | Test with real students and measure return usage before expanding |

## Open questions

- Which single subject or review task should be supported first?
- Which problems do students currently struggle with most?
- Is sign-in needed in the MVP?
- What content can be legally and reliably sourced?
- What level of answer review is practical?
- What are the acceptable monthly costs at pilot and growth stages?
