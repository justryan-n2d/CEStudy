# Repository content privacy and branch protection

**Decision (2026-10-16): keep the source repository public.** The initial eight draft questions are already disclosed and their exposure is accepted. The repository visibility will not be changed. Protect future unreleased questions by keeping their real text in the dedicated CEStudy Supabase database, not in public source files. See [unpublished question authoring and publication](../content-authoring-and-publication.md).

## 1. Protect future unpublished question content

- [x] Keep the public repository public; do not rewrite history for the already disclosed initial drafts.
- [x] Remove actual practice-question rows from the current public `supabase/seed.sql`. It seeds the public catalog only.
- [x] Add a CI guard that fails if question INSERTs or answer/solution fields return to the public seed.
- [x] Use synthetic placeholders only in tests. RLS tests exercise one synthetic published row and one synthetic `needs-review` row.
- [ ] Before each future question bank is created, follow the authoring process and human review gate in [the policy](../content-authoring-and-publication.md).

Existing RLS only protects database/API access; it cannot hide anything committed into a public repository. Real unreleased prompts, options, answers, solutions, and reviewer notes must not be added to public seed files, source, docs, tests, pull requests, workflow logs, screenshots, or build artifacts.

## 2. Confirm Cloudflare Pages connection and deployment

The live app is hosted by **Cloudflare Pages**, not GitHub Pages. Repository visibility is unchanged by this plan.

1. Open the Cloudflare Dashboard, then **Workers & Pages > CEStudy**.
2. Under **Settings**, confirm the connected repository is `justryan-n2d/CEStudy`, production branch is `main`, build command is `npm run build`, and output directory is `dist`.
3. Under **Deployments**, confirm the newest production build following the content-policy pull request is successful.
4. Open [https://cestudy.pages.dev](https://cestudy.pages.dev), browse the catalog, and refresh a direct route such as `/math-foundations/basic-algebra/practice`. The published-only gate should still appear while there are no published questions.
5. If the build does not run or fails, reconnect the Git integration only if the dashboard shows a genuine connection problem. Do not change the Supabase project URL or publishable key to troubleshoot a Git connection issue.

No visibility change was made, so the repository becoming private is not a deployment dependency in this task.

## 3. Protect the main branch

1. Open CEStudy on GitHub and choose **Settings**. If present, open **Rules > Rulesets** and select **New ruleset > New branch ruleset**. Otherwise use **Branches > Add branch protection rule**.
2. Name the rule `Protect main`, set enforcement to **Active**, and target branch `main`.
3. Require a pull request before merging. This project currently has a single maintainer, so leave the required-approval count at zero until another reviewer is available. Do not add bypass actors. If using classic branch protection, include administrators so the rule also applies to the repository owner.
4. Require these exact status checks:
   - `Lint, test, and build`
   - `Supabase migration and RLS tests`
   - `Scan repository history for secrets`
   
   These are the job names in `.github/workflows/ci.yml` and `.github/workflows/secret-scan.yml`. Do not require the live Chromium smoke test for pull requests: it is triggered after successful CI on `main`, not directly by `pull_request`.
5. Enable **Block force pushes**. Keep branch deletion blocked as well, then save the rule.
6. For verification, open the small documentation PR created for this change. Confirm all three required checks appear on the PR, the merge box identifies them as required, and merge is blocked while any required check is pending or failing. Once they pass, verify GitHub permits merge only when the configured PR requirements are satisfied. Do not use a passing PR by itself as proof of protection; first verify the saved rule targets `main` and is **Active**.

**Current status (verified 2026-10-16):** The active [Protect main ruleset](https://github.com/justryan-n2d/CEStudy/rules/25242389) targets the default branch, with required PRs and these exact status checks: `Lint, test, and build`, `Supabase migration and RLS tests`, and `Scan repository history for secrets`. Branch deletion and non-fast-forward updates are blocked, and no bypass actors are configured. The required-approval count is zero for the current single-maintainer setup. Verification PR [#13](https://github.com/justryan-n2d/CEStudy/pull/13) passed its required CI and secret-scan checks before it was merged. Keep the main ruleset active and verify its settings if rules change.

Official documentation: [GitHub repository visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility), [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/), [creating rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository), and [available rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).
