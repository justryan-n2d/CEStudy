# CEStudy current backup and archive-verification audit

**Audit date:** 2026-10-20  
**Live project:** CEStudy Supabase, backed up by the production GitHub Actions workflow  
**Status:** PR #48 was merged into `main` at `6135f4faf6ca1c01c2abc49ca372e40ddfe1bc2b` on 2026-10-20. A fresh encrypted snapshot was successfully delivered and read back in the latest live run, [39433566649](https://github.com/justryan-n2d/CEStudy/actions/runs/39433566649), but that run used the pre-fix validator and checked only catalog and question tables. The merged `main` script now requires all three content tables and logs each successful check. The Phase 7 archive-validation gate remains open until a fresh run uses the corrected code. A managed-Supabase-target restore also remains untested.

## Latest successful live backup

- Workflow: [CEStudy weekly database backup, run 39433566649](https://github.com/justryan-n2d/CEStudy/actions/runs/39433566649).
- Trigger: manual workflow dispatch on 2026-10-20.
- Source: `main` commit `44ceab69364ba0b094399fbd878ccd38d942356c`.
- Job: [Export, encrypt, verify, and retain four backups](https://github.com/justryan-n2d/CEStudy/actions/runs/39433566649/job/118664596666), completed successfully.
- The logs show that the database export ran, the encrypted archive and checksum were uploaded to private Backblaze B2, the remote archive was read back through SHA-256 verification, and retention completed.
- Retention result: **four verified backup sets kept; three stale or incomplete artifacts hidden**.
- The run ended with `SUCCESS: Encrypted backup uploaded and verified.` No `command not found` summary errors appeared in this run.

## What the latest run proves

The current live database was freshly exported, encrypted, uploaded to the configured private B2 destination, and the encrypted bytes were read back for integrity verification. The workflow's verification-marker read-back and retention steps completed before the success result. This is usable evidence of fresh backup delivery and remote-read integrity.

It does **not** prove that the validator explicitly required every application content table:

1. The script version on `main` at commit `44ceab6` still declares only `catalog_subjects` and `practice_questions` in its expected-table loop. The live database also contains `subject_lessons` (13 lesson records), so the verifier could pass without enforcing the lesson-table presence check.
2. An earlier run, [38773249088, attempt 3](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088), checked out an older source commit `21089d5e774952c541154eafaf475cefd92cf12b`. That run also delivered an archive but printed four summary-only `command not found` errors after archive upload and retention. The latest run on `main` had clean summary logs, but it still used the two-table validator.

## Corrective change and CI evidence

[PR #48](https://github.com/justryan-n2d/CEStudy/pull/48), merged as `6135f4faf6ca1c01c2abc49ca372e40ddfe1bc2b`, adds:

- An explicit required-table list containing `catalog_subjects`, `practice_questions`, and `subject_lessons`.
- A regression test proving the validator cannot silently omit the lesson table.
- A guard against reintroducing unsafe backtick command substitution into the Actions Markdown summary.
- An explicit successful log line for each verified table, so the next live run identifies which checks passed without logging database rows or credentials.
- Execution of the regression test in the existing CI workflow.

The missing table check was first reproduced by [CI run 39430805954](https://github.com/justryan-n2d/CEStudy/actions/runs/39430805954). The per-table log assertion then failed as intended on commit `28f95dbc594bb5595635962612096db6233a41f9`, with [CI run 39434510999](https://github.com/justryan-n2d/CEStudy/actions/runs/39434510999) recording `FAIL: backup logs must name each required table after archive validation.` The script was updated on commit `80d8f9bc4495114a27f27effe3a13544953b22be`. That implementation commit passed [CI run 39434748294](https://github.com/justryan-n2d/CEStudy/actions/runs/39434748294), including lint, unit tests, build, backup crypto/retention/verification tests, and isolated Supabase migration/RLS tests. The matching [full-history secret scan 39434747834](https://github.com/justryan-n2d/CEStudy/actions/runs/39434747834) also passed.

PR #48 is merged. The corrected validator is now on `main`, but it has not yet run against the live database.

## Remaining recovery gates

- [ ] Run **CEStudy weekly database backup** from current `main`. Confirm the logs explicitly name all three required tables, archive/checksum/verification-marker read-back succeeds, retention completes, and there are no summary errors.
- [ ] After explicit cost approval, restore the refreshed archive into a **separate managed Supabase test project**, not production. Validate table counts, RLS, grants, column protections, and published-only row visibility. The October 16 local PostgreSQL restore does not test Supabase-managed roles, system schemas, or project settings.
- [ ] Confirm the Backblaze B2 hidden-version lifecycle rule does not hide current verified sets.
- [ ] Confirm GitHub Actions failure-email preferences.
- [ ] Confirm protected private-key and passphrase recovery copies are stored outside GitHub.

**Decision:** Do not mark Phase 7 recovery complete yet. The latest snapshot delivery succeeded, and its logs are clean, but the corrected three-table validator still needs a successful live run and managed-Supabase-target recovery still needs separate proof.
