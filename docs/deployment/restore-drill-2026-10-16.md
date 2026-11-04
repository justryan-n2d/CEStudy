# CEStudy real-backup restore drill

**Test date:** 2026-10-16
**Result:** Passed for the isolated local application-schema restore. A restore into a separate managed Supabase project has not been tested.

## Backup identity and integrity

- Backup set timestamp in the marker: `20261015T165748Z`.
- Downloaded encrypted file: `termux_weekly_CEStudy-20261015T165748Z.dump.enc`.
- The SHA-256 shown in the downloaded checksum file, computed with `sha256sum` for the downloaded encrypted file, and recorded by the `.verified` marker matched: `37110f2572ce33ba33a600c8e738a2850780e39401a9df1a94c1b32a71d4a3d4`.
- Marker status was `verified`; marker timestamp and backup identifier corresponded to the October 15 backup set. The browser-downloaded filename included a `termux_weekly_` prefix while the marker's archive field used the original `CEStudy-...` name.
- The pinned repository helper `scripts/encrypt-db-backup.py` at commit `d0bf8e4b9d264db912e497b4849eed8a4c202c0a` decrypted the backup and reported successful AES-GCM authentication.
- `pg_restore --list` read the decrypted custom-format archive successfully. Its header reported 590 TOC entries and that it was dumped from PostgreSQL 17.11 by `pg_dump` 17.11.

## Isolated restore environment

- Device/runtime: Termux on Android, `aarch64-unknown-linux-android`.
- Local PostgreSQL server: 18.2.
- Target database: `cestudy_restore_test`.
- Server port: `55432`; `listen_addresses` was empty and the server used the private local Unix socket at `$HOME/cestudy-restore-drill/socket`. No TCP listener or production Supabase connection was used.
- The actual decrypted archive was restored with `pg_restore --schema=public --no-owner --no-acl --exit-on-error`. The initial full-ACL attempts stopped because a vanilla local server did not have Supabase-managed roles such as `service_role` and `supabase_admin`. The test database was recreated before the successful restore.
- Because ownership and ACL entries were intentionally skipped, the local `anon` and `authenticated` roles and intended application grants were configured separately for validation. This did not apply changes to the remote Supabase project.

## Validation results

| Check | Observed result |
| --- | --- |
| `public.catalog_subjects` rows | 72 |
| `public.practice_questions` rows | 8 |
| Question status counts | 8 `needs-review`; 0 published |
| RLS on `catalog_subjects` | Enabled |
| RLS on `practice_questions` | Enabled |
| Catalog policy | `SELECT` for `anon` and `authenticated`, predicate `true` |
| Practice policy | `SELECT` for `anon` and `authenticated`, predicate `status = 'published'` |
| `anon` visible catalog rows | 72 |
| `anon` visible practice rows | 0 |
| `authenticated` visible catalog rows | 72 |
| `authenticated` visible practice rows | 0 |
| Client table privileges | Both roles have `SELECT`; neither has `INSERT`, `UPDATE`, or `DELETE` on either table |

These checks were run against the restored local database. They prove that the actual backup's application schema and data can be recovered locally and that the checked application RLS and client access behavior can be recreated in this isolated test.

## Scope and remaining limitation

This was a real-backup, isolated **local PostgreSQL** restore of the `public` application schema, not a full Supabase platform restore. `--no-owner` and `--no-acl` deliberately omitted the backup's original role ownership and ACL entries; the application permissions were recreated locally and then tested. The drill did not restore or validate Supabase-managed system schemas, global/platform roles, project settings, Auth configuration, Storage objects, Edge Functions, or a live application connection to a restored managed Supabase project.

The separate managed-Supabase-target restore remains untested. Do not describe Supabase platform recovery as fully proven until a restore into a separate managed Supabase project is completed and validated, should that additional target-specific proof remain a release requirement. The production project was never used as the restore target.

## Related documentation

- [Weekly backup setup](weekly-backups.md)
- [Backup and recovery plan](backup-and-recovery.md)
- [Current project status](../PROJECT_STATUS.md)
- [Organized phase plan](../PHASE_PLAN.md)
