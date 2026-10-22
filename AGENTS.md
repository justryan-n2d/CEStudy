# CEStudy instructions for coding agents

These instructions apply to repository-wide coding and review tasks. Follow the current issue, task, and pull-request scope, plus the project security requirements in `docs/SECURITY_REQUIREMENTS.md`.

## UI UX Pro Max reference

- Official upstream project: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Keep the upstream skill separate. Do not copy or vendor its implementation into CEStudy, and do not add it as a production npm dependency.
- Use the upstream project's current guidance as a design reference for visual direction, page patterns, typography, spacing, accessibility, responsive behavior, and quality checks.
- A link in this repository does not install the skill or make it automatically active. Claim automatic activation only after confirming that the selected coding environment has installed and loaded the skill.
- ChatGPT workflows may consult the published guidance manually. A compatible coding agent may use the actual skill only when its supported installation and access requirements are satisfied.

## Before changing UI or UX

1. Inspect the current branch, relevant open PRs, routes, page components, shared UI components, and current styling. Do not rely on stale screenshots or assumptions about which draft features have shipped.
2. Inspect `src/styles/global.css` for current global styles and tokens. If `docs/specs/UX_UI_DESIGN_SYSTEM.md` exists in the checked-out branch, read it too. That specification is proposed in [PR #51](https://github.com/justryan-n2d/CEStudy/pull/51); until it is merged into the branch being changed, do not assume the file is present on `main`.
3. Reuse existing tokens, components, and dependencies before introducing alternatives. Verify that a token or component actually exists before referring to it as implemented.
4. Treat design inspirations, including Discord, Duolingo, GitHub, and Autodesk AutoCAD, as references for CEStudy's own design. Do not clone their interfaces, logos, protected assets, or distinctive screens, and do not imply affiliation.
5. Preserve the current approved scope. A design plan is not implementation authorization for unrelated features, backend changes, content publication, or release.

## Required design quality

- Keep layouts usable from 320 px upward. For substantial responsive changes, check appropriate widths including 320, 360, 390, 768, 1024, and 1440 px when the available test environment supports them.
- Preserve keyboard usability, visible focus, semantic controls, adequate contrast, readable equations and diagrams, and reduced-motion behavior.
- Do not rely on color, glow, sound, or animation alone to communicate meaning. Motion and sound must be optional where applicable and must not obstruct studying.
- Keep light and dark theme states consistent when a task touches themes. Follow the owner decisions in the active approved plan or PR; do not silently change the default theme, add a System option, or invent unfinished tokens.
- Prefer existing dependencies and CSS. New dependencies require a concrete benefit, compatibility review, and explicit inclusion in the scoped change.
- Keep UI state accurate. Do not present draft, unreviewed, unavailable, or unpublished study content as approved or published.

## Security and release safeguards

- Follow `docs/SECURITY_REQUIREMENTS.md` and the repository's existing CI, secret-scanning, browser-test, database, and release gates.
- Never weaken RLS, authorization, validation, secret handling, content-approval, licensing, or privacy safeguards to make a UI flow easier.
- Do not add credentials, secrets, private student data, or privileged values to source control, browser code, prompts committed to the repository, logs, or screenshots.
- Do not merge or deploy as a side effect of completing a task. A maintainer must review the change and its required checks.

## GitHub-first workflow

1. Check the repository status, target base branch, related open PRs, and whether an existing branch already covers the task.
2. Use a dedicated branch for non-trivial work and keep unrelated features out of the change.
3. Review the full diff, verify documentation paths and commands, run the checks appropriate to the change, and report anything that could not be tested.
4. Open a PR with scope, verification results, and known limitations. Do not bypass branch protection, required reviewers, CI, secret scanning, or release gates.

## UI UX Pro Max integration plan

Read [the integration plan](docs/plans/2026-10-22-ui-ux-pro-max-integration-plan.md) for the intended free-first workflow, Android constraints, optional coding-agent installation, and acceptance criteria.
