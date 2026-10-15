# Repository privacy and branch protection

**Required before adding new unreleased practice questions.** The live CEStudy app's RLS is working, but the repository is currently public and `supabase/seed.sql` contains the initial eight draft question texts. Repository files bypass the app and its RLS policies. Treat those initial questions as already disclosed. Changing visibility now helps prevent future browsing; it cannot erase copies or public forks that were made earlier.

## 1. Make the source repository private

1. Open [CEStudy on GitHub](https://github.com/justryan-n2d/CEStudy).
2. Open **Settings** for the repository. On a narrow mobile screen, the tab may be inside the tabs dropdown.
3. Open **General** and scroll to **Danger Zone**.
4. Beside **Change repository visibility**, select **Change visibility**.
5. Choose **Make private**, read the confirmation warning, type the repository name if prompted, and confirm.
6. Re-open the repository in a signed-out/private browser window to confirm its source files are no longer publicly readable.

Important: GitHub documents that existing public forks remain public and are detached from the original when a repository is made private. Treat the initial eight questions as disclosed, and do not rely on privacy to erase copies already downloaded. See the [official GitHub visibility instructions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility).

## 2. Confirm Cloudflare Pages remains connected

The live site is on **Cloudflare Pages**, not GitHub Pages.

1. Open Cloudflare Dashboard.
2. Select **Workers & Pages**, then the CEStudy Pages project.
3. Open **Settings** and locate the Git repository / Build configuration section.
4. Confirm the connected repository remains `justryan-n2d/CEStudy` and the production branch remains `main`.
5. Open **Deployments** and confirm the most recent production deployment is successful. If the connection stopped working after changing visibility, reconnect the GitHub integration with access to this private repository, then verify a fresh deployment. Do not alter the production Supabase URL or publishable key during this check.
6. Open https://cestudy.pages.dev again and confirm the catalog loads.

GitHub warns that converting a public repository to private changes who can see the code and may detach public forks; Cloudflare Pages has a separate Git integration. See [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/).

## 3. Protect the main branch

After visibility is handled:

1. In CEStudy, open **Settings**. If available, open **Rules > Rulesets** and choose **New ruleset > New branch ruleset**. If that UI is unavailable, use **Branches > Add branch protection rule**.
2. Name the rule `Protect main`, set enforcement to **Active**, and target branch `main`.
3. Require a pull request before merging. Since this is currently a single-maintainer project, do not require an approval count that you cannot satisfy; add an independent reviewer later when one is available.
4. Require the CI status checks. Select the checks corresponding to **Lint, test, and build** and **Supabase migration and RLS tests**. Also require the full-history secret scan check, shown as **Secret scan / Scan repository history for secrets** or its current equivalent in the GitHub check list.
5. Enable **Block force pushes**. Do not allow routine bypasses. Save the ruleset.
6. Open a small documentation pull request and confirm it cannot merge until its required checks pass. Merge only after CI and the secret scan are green.

The live-browser smoke test is triggered after successful CI on `main`, so do not add it as a required pull-request check unless its trigger is changed to run for pull requests first.

Official documentation: [creating repository rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository) and [available rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

## 4. Keep future unreleased questions out of public source

- Do not put real unpublished question prompts, correct answers, solutions, or assessment material in public seeds, fixtures, screenshots, CI logs, build artifacts, or pull request examples.
- A public app/API may safely serve deliberately published questions using RLS, but question authoring and review need a private source or private repository.
- Keep all eight current rows at `needs-review` until a human reviewer approves them; do not change status just to clear the release checklist.
- Re-run the live privacy check after the source visibility change and after any future question publication.
