# CEStudy UI UX Pro Max Integration Plan

**Status:** Documentation and agent-guidance integration proposed for review. Automatic skill activation in a separate coding agent is optional and must be verified independently.  
**Prepared:** 2026-10-22 (Asia/Manila)  
**Repository:** [justryan-n2d/CEStudy](https://github.com/justryan-n2d/CEStudy)  
**Upstream project:** [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)

## 1. Purpose

Use UI UX Pro Max as an additional design reference for CEStudy while keeping the existing GitHub-first development process, production safeguards, and free-only budget. The skill should improve the consistency of UX/UI planning and review; it must not replace inspection of the real repository, owner decisions, accessibility checks, tests, security review, or human pull-request review.

This document records the integration approach. It does not authorize an unrestricted redesign or bypass CEStudy's existing implementation and release gates.

## 2. Owner decisions

| Topic | Decision |
|---|---|
| How it is used | ChatGPT plus GitHub workflow, with a compatible coding agent where feasible |
| Development device | Android phone only; do not make a laptop, Termux, or local terminal a required step |
| Budget | Free only; usage limits are acceptable |
| Upstream files | Keep the upstream skill separate. Commit CEStudy-specific instructions and the official upstream link, not a copy of the upstream skill |
| Source control | Use a dedicated branch and a separate reviewed PR. Do not combine this integration with PR #51 |
| Runtime | Do not add UI UX Pro Max as a production app dependency |
| Release controls | Keep all existing CI, secret-scan, security, content-review, and release safeguards |

## 3. Recommended operating model

### ChatGPT: design coordinator

Use ChatGPT to inspect the relevant repository files and open PRs, consult the published UI UX Pro Max guidance manually, formulate a concrete design proposal, and review the resulting diff. The request should name the target page or flow and specify existing behavior that must remain unchanged.

The upstream link and `AGENTS.md` do not automatically install the skill in ChatGPT. When the actual skill is not loaded by the current environment, describe its guidance as manually consulted rather than claiming that the skill is active.

### GitHub: source of truth

Keep CEStudy's code, owner decisions, design documentation, changes, review discussion, and verification evidence in GitHub. Work from the latest appropriate base branch, use a scoped branch, and open a PR. Review open PRs before changing shared files.

PR #51 is a separate draft for the website-first information architecture and UX/UI design-system specification. Do not mix the UI UX Pro Max integration into PR #51. The specification file `docs/specs/UX_UI_DESIGN_SYSTEM.md` is available on that PR's branch but may not be present on `main` until merged. Check the actual branch before referencing the file as an available source.

### Compatible coding agent: optional implementer

A separate agent may use the actual upstream skill if all of the following are verified for the selected environment:

- Its supported setup can load the upstream skill without requiring a local Android installation.
- It can access the CEStudy repository with the minimum permissions needed.
- It can make changes on a dedicated branch or create a PR without bypassing required reviews.
- It can run the repository's applicable checks, or clearly report which checks it could not run.
- The setup is available within the owner's existing free access.

Do not assume that sharing the upstream URL installs the skill, that `AGENTS.md` itself activates it, or that a local CLI install works directly on Android. The upstream project's CLI installation instructions are a separate setup path and must be checked against the current official documentation before use.

## 4. Repository implementation

The integration should remain small and documentation-focused:

1. **`AGENTS.md`**: repository-wide instructions for coding agents, including the upstream reference, when to consult design guidance, UX/accessibility expectations, GitHub-first workflow, and non-negotiable security and release constraints.
2. **This plan**: records the selected workflow, feasibility limits, costs, optional setup, rollout, and acceptance checks.
3. **`docs/README.md`**: links to this plan so maintainers can find it.

Keep the upstream skill outside the repository. Do not commit its copied source, search database, generated design assets, environment-specific agent installation, or a production package dependency. Do not create a duplicate design-system specification. The existing proposed design-system specification in PR #51 remains responsible for CEStudy's product-specific design direction when that file is available in the working branch.

## 5. Feasibility and costs

| Component | Expected direct cost | Constraints |
|---|---:|---|
| Reference the public upstream repository | $0 | Guidance may be consulted manually |
| Commit CEStudy instructions and plan | $0 | Documentation-only repository change |
| Use existing GitHub-connected workflow | $0 additional by default | Subject to current account/tool usage limits and repository permissions |
| Automatically load the full skill in another agent | $0 only if an existing eligible setup supports it | Not guaranteed. Verify feature availability and installation requirements first |
| Add a paid subscription, paid runtime, or new service | Not approved | Do not add cost without a separate owner decision |

The project can proceed with the manual workflow even if no suitable free cloud coding agent is available. A free-tier limit is a reason to fall back to manual design guidance and a smaller task, not to bypass checks or purchase an upgrade.

## 6. Rollout plan

### Phase A: Establish repository guidance

- Add the root `AGENTS.md` and this standalone plan.
- Add a link to this plan in `docs/README.md`.
- Keep the change isolated from application code and PR #51.
- Review all changed lines and run applicable checks before requesting review.

### Phase B: Validate the workflow with one small task

After the documentation PR is reviewed and merged, choose one existing page or shared component for a limited design audit. First inspect current routes, components, global styles, design documentation available on the target branch, related PRs, and preview status. Produce a bounded proposal, implement only the approved scope in a separate PR, and compare the result with CEStudy's requirements.

A possible pilot is a focused consistency review of one existing page in light and dark mode, including keyboard focus, responsive behavior, and reduced-motion behavior. Do not start with a full-site redesign.

### Phase C: Check optional coding-agent activation

Only if a free, Android-compatible cloud agent is available, follow its current official setup instructions. Verify that it actually loads the upstream skill and can work through a reviewed GitHub PR. Record the verified agent and setup path in a future documentation update if that information is stable and useful. Do not make this optional phase a dependency of the manual workflow.

## 7. Required workflow for future UI tasks

1. **Inspect:** check the current base, task scope, related/open PRs, existing routes/components, shared tokens, and available previews.
2. **Consult:** read the relevant CEStudy design specification available on the checked-out branch and consult UI UX Pro Max for the specific design problem.
3. **Propose:** define the user problem, the smallest justified change, responsive states, accessibility considerations, and any behavior that must not change.
4. **Implement:** use current components/tokens first; avoid unnecessary dependencies and unrelated refactors.
5. **Verify:** inspect the full diff, run applicable lint/build/unit/browser tests and security gates, and report any checks that could not run. For visual work, inspect supported viewport sizes and both themes when applicable.
6. **Review:** open a separate PR with scope, evidence, and limitations. Do not merge or deploy automatically.

## 8. Design and safety constraints

- Use UI UX Pro Max as an additional design reference, not as an override of CEStudy's product decisions or security requirements.
- Treat Discord, Duolingo, GitHub, and Autodesk AutoCAD as inspirations for CEStudy's own design, not screens, logos, or assets to copy.
- Reuse existing styles and tokens. Inspect `src/styles/global.css` and any applicable design specification before proposing replacements.
- Preserve keyboard access, visible focus, semantic controls, sufficient contrast, equation readability, responsive layouts, and reduced-motion behavior.
- Keep Light/Dark behavior consistent with the owner decisions in the active approved plan or PR. Do not silently change the default theme or add a System option.
- Do not publish lessons or questions that lack required academic review and publication approval. Do not implement exam-authenticity claims without separate approved scope.
- Do not weaken access controls, Supabase RLS, server-side authorization, validation, secret scanning, privacy safeguards, CI, required review, or deployment gates.
- Follow `docs/SECURITY_REQUIREMENTS.md`. Never add secrets or private student information to documentation or source control.

## 9. Acceptance criteria

The integration is ready for review when:

- The official upstream link is present, and no upstream skill implementation has been copied into CEStudy.
- `AGENTS.md` explains how agents should consult design guidance without falsely claiming that the skill is automatically installed.
- This plan documents Android-only, free-only constraints and makes automatic coding-agent activation optional.
- The plan is linked from `docs/README.md`.
- Changes are isolated on a dedicated branch and submitted in a separate PR from PR #51.
- No production code, app dependency, backend configuration, database policy, question/lesson content, deployment setting, or release gate is changed.
- The diff and relevant checks are reviewed, and any unverified behavior is clearly reported.

## 10. Official reference

- [UI UX Pro Max Skill repository](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)

Check the upstream repository's current README and installation guidance before any future agent-specific setup. The source of truth for CEStudy's implemented behavior remains the checked-out CEStudy code and its verified tests, not a generic skill recommendation.
