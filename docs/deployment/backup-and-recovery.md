# CEStudy database backup and recovery plan

**Status:** Automated weekly backup workflow and retention helper have been added. The public certificate variable, repository secrets, B2 lifecycle rule, failure email notifications, the first successful production run, and a restore drill remain pending.
**Scope:** Current seeded-only MVP, before student accounts, submissions, or other mutable user data are introduced.

## Current recovery position

The app currently stores 72 catalog subjects and eight Basic Algebra questions marked `needs-review`. No question is published. Migrations and `supabase/seed.sql` are committed in the CEStudy repository, so the current baseline can be recreated in a fresh, isolated Supabase project and tested through CI.

This is a reproducible baseline, not a point-in-time backup of the live database. The remote database is authoritative for its current state. Do not assume source control contains any future edits made directly in Supabase.

## Minimum backup policy

1. Keep schema changes in reviewed migrations. **Do not commit unreleased question text to a public repository or public build artifact.** The current public `supabase/seed.sql` contains the existing draft question text; treat those eight items as already disclosed rather than as confidential assessment questions. See [repository privacy and branch protection](github-privacy-and-branch-protection.md).
2. Before introducing published questions or other content maintained outside the seed, export the database before and after each publication batch.
3. Before adding accounts, student progress, public submissions, or other mutable user data, configure at least weekly logical exports to private off-site storage and retain the most recent four weekly exports. Use a shorter interval if the acceptable amount of lost data is lower.
4. Keep export files, database connection strings, database passwords, access tokens, and encryption keys out of Git, public artifacts, chat, and application build variables. Store backups in private, encrypted storage with restricted access.
The CEStudy Supabase organization is on the Free plan. Supabase documents automatic daily backups for Pro, Team, and Enterprise plans and recommends that Free projects regularly export data with the CLI and keep off-site backups. See [Supabase Database Backups](https://supabase.com/docs/guides/platform/backups). Recheck plan features before any future upgrade or student-data launch.

## Automated weekly Backblaze workflow

A scheduled workflow has been added at [`.github/workflows/weekly-db-backup.yml`](../../.github/workflows/weekly-db-backup.yml). It is scheduled for Sundays at 02:00 UTC (10:00 AM Philippine time), exports the database with PostgreSQL 17, encrypts with RSA-OAEP/SHA-256 plus streaming AES-256-GCM using a public certificate, uploads to the private `cestudy-db-backups/termux/weekly/` prefix, reads the uploaded encrypted archive back to verify its SHA-256, and retains the latest four complete verified sets. It does not run successfully until the maintainer completes the repository secret/variable setup, configures the B2 lifecycle rule for hidden versions, enables GitHub failure email notifications, and runs a first manual verification. Follow [automated weekly backup setup](weekly-backups.md) for the exact steps.

## Creating a logical export

Use the current official Supabase CLI backup guide: https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore

Run these commands from a trusted computer with the Supabase CLI and PostgreSQL tools installed. Set `CESTUDY_DB_URL` in the terminal's private environment using the **CEStudy project's** database connection string from Supabase Dashboard > Connect. Prefer the session pooler connection string unless direct connectivity is supported. Do not paste credentials into chat or commit them. Do not place this value in any `VITE_*` browser variable.

The repository includes a helper script that checks the supplied connection string contains the CEStudy project reference, writes the export outside Git with restrictive local file permissions, and records checksums.

In a trusted terminal, enter the database URL through a hidden prompt so it is not saved as a typed shell command:

```sh
read -rsp "Paste the CEStudy database URL from Supabase > Connect: " CESTUDY_DB_URL
export CESTUDY_DB_URL
printf '\\n'
bash scripts/backup-supabase.sh
unset CESTUDY_DB_URL
```

The script writes to `$HOME/CEStudy-backups/` by default. To create an encrypted archive using a GPG public key that is already configured locally, set `CESTUDY_GPG_RECIPIENT` to that key's recipient identifier before running the script. Without GPG encryption, the local archive is **not encrypted** and must be transferred only into private encrypted storage. Never commit backup output. Do not paste a database URL into GitHub Actions, chat, or any `VITE_*` variable.

The helper runs the equivalent of these Supabase CLI exports:

```sh
supabase db dump --db-url "$CESTUDY_DB_URL" -f roles.sql --role-only
supabase db dump --db-url "$CESTUDY_DB_URL" -f schema.sql
supabase db dump --db-url "$CESTUDY_DB_URL" -f data.sql --use-copy --data-only -x "storage.buckets_vectors" -x "storage.vector_indexes"
```

After the export, verify that the archive exists and the checksum file is present. Copy the backup to encrypted private off-site storage and keep the checksum with it. Database dumps do not include Storage object files; the current CEStudy project has no Storage buckets or student uploads. The script has been added to the repository, but **it has not yet been run against the live database**.

## Safe restore drill

Perform this before relying on the backups for mutable data:

1. Create a separate temporary Supabase project. Confirm its name and project reference before running any restore command.
2. Follow the restore procedure in the official guide for the exported `roles.sql`, `schema.sql`, and `data.sql`, adapting the documented connection string to the new temporary project only.
3. Never restore over the production project as a first test. Never run `supabase db reset --linked` against the live/shared project.
4. Run read-only checks in the temporary project: catalog count, question count and statuses, RLS enabled on both app tables, published-question count, client grants, and the Supabase security advisor.
5. Confirm the restored project has 72 catalog records, 8 questions, 0 published questions, only SELECT grants for client roles, and policies that only return published questions. Investigate any difference before declaring the drill successful.
6. Record the date, tool/CLI version, backup filenames (not their contents or connection details), restore result, validation output, and corrective actions in a new Git-tracked verification note.
7. Remove the temporary project only after the test has passed and any needed evidence is recorded. Check billing before creating it.

## Recovery priorities

- **Current baseline:** rebuild schema and baseline content from migrations and seed; then recheck remote-only changes before resuming.
- **Published content or mutable data:** restore the newest valid private export to a separate project first, validate it, then plan a controlled production recovery. Do not replace production or promote the temporary project without reviewing the current data and downtime implications.
- **Lost credentials:** rotate the affected database password/key through the Supabase dashboard, update the private deployment configuration, and redeploy only after confirming that no privileged key is exposed to the browser.

## Release gate

- [ ] Configure the repository secrets and `CESTUDY_AGE_RECIPIENT` variable for the weekly workflow.
- [ ] Configure the B2 lifecycle rule for `termux/weekly/` and enable GitHub failed-workflow email notifications.
- [ ] Complete a successful manual weekly-workflow run; confirm the encrypted archive, checksum, and `.verified` marker in B2.
- [ ] Restore drill in a separate Supabase project passed and recorded.
- [ ] Backup cadence and retention owner agreed before mutable data or student accounts launch.
- [ ] Recovery steps and latest export location are known to the maintainer.

The automation is committed but not yet activated: repository secrets, encryption recipient, lifecycle cleanup, notifications, the first live backup, and the restore drill remain uncompleted actions.
