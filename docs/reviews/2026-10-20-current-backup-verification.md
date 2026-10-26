# CEStudy current backup and archive-verification audit

**Audit date:** 2026-10-20  
**Live project:** CEStudy Supabase, backed up by the production GitHub Actions workflow  
**Status:** The original 2026-10-20 audit below records the historical two-table-validator gap. A follow-up verification was completed on 2026-10-26 using live backup run [40172509628](https://github.com/justryan-n2d/CEStudy/actions/runs/40172509628); see the current follow-up section before using the older assessment.

## Follow-up verification (2026-10-26)

The corrected three-table validator has now passed against the live CEStudy Supabase database in [weekly backup run 40172509628](https://github.com/justryan-n2d/CEStudy/actions/runs/40172509628), completed 2026-10-25.

- Logs explicitly verified `public.catalog_subjects`, `public.practice_questions`, and `public.subject_lessons`.
- The encrypted archive and checksum were uploaded to the private Backblaze B2 target and read back for SHA-256 verification.
- The remote `.verified` marker was read back and compared successfully.
- Retention completed with four verified backup sets retained and three stale or incomplete artifacts hidden.
- Result: **the live three-table backup-validation gate is passed**. This does not prove that an archive can be restored into a managed Supabase project.

**Still unverified:** a restore into a separate managed Supabase project after cost approval; the B2 lifecycle rule for hidden/old versions; GitHub Actions failed-workflow email notifications; and the recovery copies of private encryption keys/passphrases.

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

PR #48 is merged. The corrected validator subsequently passed against the live database in run 40172509628 on 2026-10-25.

## Remaining recovery gates

- [x] Run **CEStudy weekly database backup** from current `main`: [run 40172509628](https://github.com/justryan-n2d/CEStudy/actions/runs/40172509628) explicitly named all three required tables, archive/checksum/verification-marker read-back succeeded, and retention completed.
- [ ] After explicit cost approval, restore the refreshed archive into a **separate managed Supabase test project**, not production. Validate table counts, RLS, grants, column protections, and published-only row visibility. The October 16 local PostgreSQL restore does not test Supabase-managed roles, system schemas, or project settings.
- [ ] Confirm the Backblaze B2 hidden-version lifecycle rule does not hide current verified sets.
- [ ] Confirm GitHub Actions failure-email preferences.
- [ ] Confirm protected private-key and passphrase recovery copies are stored outside GitHub.

**Decision:** The corrected live three-table backup-validation gate is passed. Do not mark Phase 7 recovery complete yet: the managed-Supabase-target restore, B2 lifecycle verification, GitHub failure-email check and protected recovery-key copy check still need separate evidence.
