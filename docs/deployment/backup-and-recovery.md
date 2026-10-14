# CEStudy database backup and recovery plan

**Status:** Plan documented. A production export and restore drill have not yet been performed.
**Scope:** Current seeded-only MVP, before student accounts, submissions, or other mutable user data are introduced.

## Current recovery position

The app currently stores 72 catalog subjects and eight Basic Algebra questions marked `needs-review`. No question is published. Migrations and `supabase/seed.sql` are committed in the CEStudy repository, so the current baseline can be recreated in a fresh, isolated Supabase project and tested through CI.

This is a reproducible baseline, not a point-in-time backup of the live database. The remote database is authoritative for its current state. Do not assume source control contains any future edits made directly in Supabase.

## Minimum backup policy

1. Keep every schema change in a reviewed migration and every intentionally source-controlled baseline record in `supabase/seed.sql`.
2. Before introducing published questions or other content maintained outside the seed, export the database before and after each publication batch.
3. Before adding accounts, student progress, public submissions, or other mutable user data, configure at least weekly logical exports to private off-site storage and retain the most recent four weekly exports. Use a shorter interval if the acceptable amount of lost data is lower.
4. Keep export files, database connection strings, database passwords, access tokens, and encryption keys out of Git, public artifacts, chat, and application build variables. Store backups in private, encrypted storage with restricted access.
5. Recheck the project plan and current Supabase backup options before a student-data launch. Supabase's official guidance notes that downloadable automated daily backups depend on plan; Free Plan projects should create their own exports and keep off-site copies.

## Creating a logical export

Use the current official Supabase CLI backup guide: https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore

Run these commands from a trusted computer with the Supabase CLI and PostgreSQL tools installed. Set `CESTUDY_DB_URL` in the terminal's private environment using the **CEStudy project's** database connection string from Supabase Dashboard > Connect. Prefer the session pooler connection string unless direct connectivity is supported. Do not paste credentials into chat or commit them. Do not place this value in any `VITE_*` browser variable.

```sh
supabase db dump --db-url "$CESTUDY_DB_URL" -f roles.sql --role-only
supabase db dump --db-url "$CESTUDY_DB_URL" -f schema.sql
supabase db dump --db-url "$CESTUDY_DB_URL" -f data.sql --use-copy --data-only -x "storage.buckets_vectors" -x "storage.vector_indexes"
```

Save the three resulting SQL files in a private backup folder **outside the Git repository**, record the export date and CEStudy project name in a separate non-secret manifest, then transfer them to encrypted off-site storage. Verify the files are non-empty. Keep the original files protected; do not upload them to the public CEStudy repository. Database dumps do not include Storage object files, but the current CEStudy project has no Storage buckets or student uploads.

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

- [ ] Export files created and copied to encrypted private off-site storage.
- [ ] Restore drill in a separate Supabase project passed and recorded.
- [ ] Backup cadence and retention owner agreed before mutable data or student accounts launch.
- [ ] Recovery steps and latest export location are known to the maintainer.

The plan is documented, but the export, off-site copy, and restore drill remain uncompleted actions.
