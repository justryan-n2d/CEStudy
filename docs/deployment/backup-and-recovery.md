# CEStudy database backup and recovery plan

**Status:** Automated weekly backup is active. The actual October 15 snapshot was decrypted and restored into isolated local PostgreSQL 18.2 on 2026-10-16; see [restore-drill evidence](restore-drill-2026-10-16.md). A fresh encrypted backup of the current live database after the 2026-10-18 publication-status correction passed on [workflow run 38773249088, attempt 2](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088). The archive/checksum were uploaded to private Backblaze B2, read back and SHA-256 verified, and retention completed with three verified sets kept and no stale/incomplete artifacts pruned. A restore of this refreshed snapshot into a separate managed Supabase project remains required. Backblaze hidden-version lifecycle cleanup and GitHub failure-email settings also need manual confirmation.
**Scope:** Current seeded-only MVP, before student accounts, submissions, or other mutable user data are introduced.

## Current recovery position

The live database currently stores 72 catalog subjects, 52 practice questions, and 13 lesson records. All 52 questions and all 13 lessons are `needs-review`; none are published. Migrations and `supabase/seed.sql` are committed, but the seed contains catalog metadata only. Actual unpublished question and lesson content is maintained in the private CEStudy database and must be recovered from a current encrypted backup.

This is a reproducible baseline, not a point-in-time backup of the live database. The remote database is authoritative for its current state. Do not assume source control contains any future edits made directly in Supabase.

## Minimum backup policy

1. Keep schema changes in reviewed migrations. **Do not commit unreleased question text to a public repository or public build artifact.** Prior public Git history contains the original eight draft questions, and that past exposure is accepted. The current public `supabase/seed.sql` contains catalog metadata only; future unpublished lesson and question content must remain in the private database. See [repository privacy and branch protection](github-privacy-and-branch-protection.md).
2. Before introducing published questions or other content maintained outside the seed, export the database before and after each publication batch.
3. Before adding accounts, student progress, public submissions, or other mutable user data, configure at least weekly logical exports to private off-site storage and retain the most recent four weekly exports. Use a shorter interval if the acceptable amount of lost data is lower.
4. Keep export files, database connection strings, database passwords, access tokens, and encryption keys out of Git, public artifacts, chat, and application build variables. Store backups in private, encrypted storage with restricted access.
The CEStudy Supabase organization is on the Free plan. Supabase documents automatic daily backups for Pro, Team, and Enterprise plans and recommends that Free projects regularly export data with the CLI and keep off-site backups. See [Supabase Database Backups](https://supabase.com/docs/guides/platform/backups). Recheck plan features before any future upgrade or student-data launch.

## Automated weekly Backblaze workflow

A scheduled workflow is active at [`.github/workflows/weekly-db-backup.yml`](../../.github/workflows/weekly-db-backup.yml). It runs Sundays at 02:00 UTC (10:00 AM Philippine time) and can also be run manually. It exports the database with PostgreSQL 17, validates the archive and expected tables, encrypts with RSA-OAEP/SHA-256 plus streaming AES-256-GCM, uploads to the private `cestudy-db-backup/termux/weekly/` prefix, reads the archive and checksum back, verifies the `.verified` marker, and retains the latest four complete verified sets. The current-state backup after the October 18 publication correction is [run 38773249088, attempt 2](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088), and passed read-back verification. The fresh-backup gate is complete; B2 lifecycle cleanup, GitHub failure-email preferences, and a restore into a separate managed Supabase project remain manual release checks.

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

After the export, verify that the archive exists and the checksum file is present. Copy the backup to encrypted private off-site storage and keep the checksum with it. Database dumps do not include Storage object files; the current CEStudy project has no Storage buckets or student uploads. The one-off `scripts/backup-supabase.sh` helper has not been verified against the live database; the separate weekly GitHub Actions workflow is the verified backup path. Do not treat the helper as a recovery proof.

## Safe restore drill

The real backup has passed a local isolated restore drill on 2026-10-16; see [restore-drill evidence](restore-drill-2026-10-16.md). That test restored only the `public` application schema and recreated app-facing permissions locally. It did not test a managed Supabase target.

For a managed-Supabase-target recovery rehearsal (still outstanding), perform this before relying on backups for future mutable data:

1. Create a separate temporary Supabase project. Confirm its name and project reference before running any restore command.
2. Follow the restore procedure in the official guide for the exported `roles.sql`, `schema.sql`, and `data.sql`, adapting the documented connection string to the new temporary project only.
3. Never restore over the production project as a first test. Never run `supabase db reset --linked` against the live/shared project.
4. Run read-only checks in the temporary project: catalog count, question count and statuses, RLS enabled on both app tables, published-question count, client grants, and the Supabase security advisor.
5. For a refreshed snapshot, confirm 72 catalog records, 52 questions, 13 lessons, zero published questions and lessons, client write restrictions, and policies that only return explicitly published content. Investigate any difference before declaring the drill successful.
6. Record the date, tool/CLI version, backup filenames (not their contents or connection details), restore result, validation output, and corrective actions in a new Git-tracked verification note.
7. Remove the temporary project only after the test has passed and any needed evidence is recorded. Check billing before creating it.

## Recovery priorities

- **Current baseline:** rebuild schema and baseline content from migrations and seed; then recheck remote-only changes before resuming.
- **Published content or mutable data:** restore the newest valid private export to a separate project first, validate it, then plan a controlled production recovery. Do not replace production or promote the temporary project without reviewing the current data and downtime implications.
- **Lost credentials:** rotate the affected database password/key through the Supabase dashboard, update the private deployment configuration, and redeploy only after confirming that no privileged key is exposed to the browser.

## Release gate

- [x] Create the password-protected RSA private key and public certificate in Termux, commit the public certificate, and configure the database/B2 repository secrets.
- [ ] Configure and confirm the B2 lifecycle rule for `termux/weekly/` and GitHub failed-workflow email notifications.
- [x] Complete a successful live weekly-workflow run; run 38773249088 verified the encrypted archive, checksum, and `.verified` marker in B2.
- [x] Decrypt the actual B2 backup in Termux, verify its checksum and AES-GCM authentication, restore its `public` application schema into isolated local PostgreSQL 18.2, and validate counts, RLS, and client permissions. Evidence: [restore drill](restore-drill-2026-10-16.md).
- [x] Run/verify a fresh encrypted backup after the 2026-10-18 content-status correction: [run 38773249088, attempt 2](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088).
- [ ] Restore/rehearse the refreshed backup into a separate managed Supabase project and validate platform-target behavior; the local restore does not cover Supabase-managed roles/system schemas/settings.
- [ ] Backup cadence and retention owner agreed before mutable data or student accounts launch.
- [ ] Recovery steps and latest export location are known to the maintainer.

The weekly backup automation is active and has completed a successful live backup from an earlier database state. That real encrypted snapshot was decrypted and restored to isolated local PostgreSQL. On 2026-10-18, production publication statuses were corrected, so the current database must be backed up again before the recovery evidence is considered current. Remaining gates are the B2 hidden-version lifecycle rule, GitHub failure-email preferences, and a separate managed-Supabase-target restore. The current-state backup is verified, but current-state recovery is not proven until that refreshed snapshot has been restored and validated on the managed target.
