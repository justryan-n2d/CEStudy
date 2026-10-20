# CEStudy current backup and archive-verification audit

**Audit date:** 2026-10-20  
**Live project:** CEStudy Supabase, production data exported by the existing scheduled-backup workflow  
**Status:** A current snapshot was encrypted, uploaded and read back successfully. The full release gate remains open until the corrected three-table validator runs against the live database and a managed-target restore is completed.

## Fresh backup evidence

- Workflow: [CEStudy weekly database backup, run 38773249088, attempt 3](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088).
- The rerun checked out source commit `21089d5e774952c541154eafaf475cefd92cf12b`, so it used an older version of `scripts/weekly-db-backup.sh`.
- Export/encryption/upload occurred on 2026-10-20. The archive timestamp written by the workflow was `20261020T105202Z`.
- Encrypted archive: `CEStudy-20261020T105202Z.dump.enc`.
- Logged SHA-256: `215fff404b92ef25a8f90eca33f6fa2289c8e1b568181d5a1a47b042b0413115`.
- The job logged that it streamed the uploaded archive back through SHA-256 verification, then completed retention with **four verified backup sets kept and zero stale/incomplete artifacts hidden**.
- The export, encryption, archive read-back and retention steps completed before the final Markdown-summary lines ran.

## What this run did not prove

Two validation weaknesses were identified in the old script revision:

1. Its `pg_restore --list` check explicitly required only `catalog_subjects` and `practice_questions`. The current live database also contains `subject_lessons` (13 rows), so the verifier could have passed without explicitly requiring the lesson table to be present in the archive.
2. Four Markdown-summary `echo` statements placed backtick-delimited metadata inside double quotes. Bash interpreted the backticks as command substitutions and logged `command not found` for the timestamp, archive name, checksum and remote prefix. Those messages occurred after archive upload/read-back and retention; the job still concluded success. Current `main` already uses `printf` for those summary fields, but the rerun used the older commit.

The old run is evidence of a fresh encrypted archive upload, checksum/marker read-back and retention. It is **not** final evidence that the archive verifier required all three content tables or that the workflow summary was clean.

## Corrective change and CI evidence

[PR #48](https://github.com/justryan-n2d/CEStudy/pull/48) adds:

- an explicit required-table list containing `catalog_subjects`, `practice_questions` and `subject_lessons`;
- a regression test that fails if the lesson table is removed from the list;
- a guard against restoring the old backtick command-substitution patterns; and
- execution of that regression test in the existing CI job.

The new test first failed on the old two-table implementation in [CI run 39430805954](https://github.com/justryan-n2d/CEStudy/actions/runs/39430805954), then the implementation was updated. The corrected code head `ef46d2615a8c9b1450434315e0277a32c1399442` passed [CI run 39430991750](https://github.com/justryan-n2d/CEStudy/actions/runs/39430991750), including the new backup-verification test and isolated Supabase migration/RLS tests. [Full-history secret scan 39430991755](https://github.com/justryan-n2d/CEStudy/actions/runs/39430991755) also passed. PR #48 remains open; the corrected script has not yet been run against live B2.

## Remaining recovery gates

- [ ] After PR #48 is merged, run **CEStudy weekly database backup** from branch `main` in GitHub Actions. Confirm no summary errors.
- [ ] Verify the new archive list explicitly contains `catalog_subjects`, `practice_questions` and `subject_lessons`; confirm encrypted archive/checksum/verification-marker read-back and retention.
- [ ] After explicit cost approval, restore the new archive into a **separate managed Supabase test project**, not production. Validate table counts, RLS, grants, column-level protection and published-only row visibility. The October 16 local PostgreSQL restore does not test Supabase-managed roles/system schemas/settings.
- [ ] Confirm the Backblaze B2 hidden-version lifecycle rule does not hide current verified sets.
- [ ] Confirm GitHub Actions failure-email preferences and protected private-key/passphrase recovery copies.

**Decision:** Do not mark Phase 7 recovery as complete yet. The live snapshot delivery succeeded, but the corrected validator needs a clean run and managed-Supabase-target recovery still needs separate proof.
