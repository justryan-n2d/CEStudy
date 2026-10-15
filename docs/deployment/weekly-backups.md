# CEStudy automated weekly database backups

**Status:** Workflow and scripts are committed, but the first live backup is not active/verified until repository secrets, the age recipient variable, Backblaze lifecycle cleanup, and GitHub failure notifications are configured and the first workflow run passes.

## Schedule and storage

- **Schedule:** Sundays at 02:00 UTC (10:00 AM Philippine time); the workflow can also be run manually from GitHub Actions.
- **Destination:** private Backblaze B2 bucket `cestudy-db-backups`, prefix `termux/weekly/`.
- **Retention:** latest four complete verified encrypted database dumps. Pruning runs only after the newest backup and its checksum have been read back and verified. Incomplete artifacts are hidden only after a newer successful verified backup exists.
- **Encryption:** `age` public-key encryption before upload. The public recipient is a GitHub repository variable. The private identity must stay outside GitHub and must be backed up safely by the maintainer.
- **Database client:** PostgreSQL 17, matching the verified CEStudy server version 17.11.
- **Failure alerts:** GitHub Actions email notifications configured to notify for failed workflows only. The run summary also includes a link to the failed run.

A workflow run is not a verified backup until the workflow completes successfully. Neither the earlier failed Termux attempts nor this configuration work produced a confirmed backup.

## 1. Prepare an age encryption key on Termux

Do this once. `age` was installed during the Termux setup.

```sh
mkdir -p "$HOME/.config/age"
chmod 700 "$HOME/.config/age"
age-keygen -o "$HOME/.config/age/cestudy-backup-identity.txt"
chmod 600 "$HOME/.config/age/cestudy-backup-identity.txt"
age-keygen -y "$HOME/.config/age/cestudy-backup-identity.txt"
```

The last command prints the public recipient beginning with `age1`. Copy only that public recipient to GitHub. The file `cestudy-backup-identity.txt` contains the private identity. Store it in at least two safe places, with one copy in encrypted storage separate from Backblaze. Never commit it, upload it beside the encrypted backups, or paste it into chat. If the private identity is lost, the encrypted backups cannot be decrypted.

## 2. Add the age recipient as a repository variable

1. Open the [CEStudy repository](https://github.com/justryan-n2d/CEStudy).
2. Select **Settings**.
3. Under **Secrets and variables**, select **Actions**.
4. Open the **Variables** tab and select **New repository variable**.
5. Name: `CESTUDY_AGE_RECIPIENT`.
6. Value: the output of `age-keygen -y ...` from Step 1, beginning with `age1`.
7. Save the variable.

This is a public encryption recipient, not a decryption key. The private identity stays on the maintainer's trusted device/offline backup.

## 3. Add the database and B2 repository secrets

In the same **Settings → Secrets and variables → Actions** page, open **Secrets** and create each repository secret below. Do not place these values in code, workflow YAML, a `VITE_*` variable, or a public issue.

| Secret name | Value |
| --- | --- |
| `CESTUDY_DB_HOST` | `aws-0-ap-southeast-1.pooler.supabase.com` |
| `CESTUDY_DB_PORT` | `5432` |
| `CESTUDY_DB_USER` | `postgres.qqmdwltfgpqtcvdbcmto` |
| `CESTUDY_DB_PASSWORD` | Current CEStudy database password that passed the `psql` login test |
| `B2_APPLICATION_KEY_ID` | Key ID from the restricted key for the `cestudy-db-backups` bucket |
| `B2_APPLICATION_KEY` | The matching Backblaze application-key secret (the key value, not the key ID) |

The configured Backblaze key must be limited to bucket `cestudy-db-backups` and prefix `termux/`; read/write access is needed for file listing, upload, and remote verification. Never use a Backblaze master application key in GitHub Actions. The script uploads only to `termux/weekly/`.

## 4. Configure B2 hidden-version cleanup

The workflow hides stale B2 objects after a newer verified backup exists. Backblaze retains hidden file versions unless a lifecycle rule deletes them, so configure a rule for the automation prefix too. Backblaze documents lifecycle cleanup in its [Lifecycle Rules guide](https://www.backblaze.com/docs/en/cloud-storage-lifecycle-rules).

1. Sign in to Backblaze and open **B2 Cloud Storage → Buckets → `cestudy-db-backups`**.
2. Open **Lifecycle Settings** and choose **Use custom lifecycle rules**.
3. Add a rule with file name prefix `termux/weekly/`.
4. Set **Days from uploading to hiding** to **None** (the rule must not expire current backups by age).
5. Set **Days from hiding to deleting** to **1**.
6. Save/update the bucket lifecycle settings.

This lets the four retained current backups remain visible while older files hidden by the workflow are eventually permanently removed. Do not use a rule that hides all files after a fixed number of days; that could hide valid current backups.

## 5. Turn on failure email notifications

GitHub supports email notifications for workflow failures. See its [official Actions notification instructions](https://docs.github.com/en/subscriptions-and-notifications/how-tos/managing-github-actions-notifications).

1. Open [GitHub notification settings](https://github.com/settings/notifications).
2. Under **System → Actions**, choose **Email** and select **Only notify for failed workflows**.
3. Save the setting. Make sure the account receiving notifications watches the CEStudy repository and has a verified notification email address.

GitHub sends scheduled-workflow notifications to the user who initially created the workflow; confirm the notification settings on the account that receives these alerts. The workflow's failure summary also links to the run, but an email will depend on these notification settings.

## 6. Run the first backup and verify it

After the variable, six repository secrets, lifecycle rule, and notifications are configured:

1. Open the repository's **Actions** tab.
2. Select **CEStudy weekly database backup**.
3. Choose **Run workflow** on branch `main`.
4. Open the new run and wait for it to finish.
5. Require the green success result and the run summary confirming that the encrypted archive, checksum, and verification marker were read back successfully.
6. In Backblaze, inspect `cestudy-db-backups/termux/weekly/`. It should contain the current `.dump.age`, `.dump.age.sha256`, and `.dump.age.verified` files plus up to three earlier complete verified sets.

Do not count a failed or cancelled run as a backup. If the run fails, open the failed step and inspect its logs; do not post connection strings, database passwords, Backblaze keys, or private age identities anywhere. The workflow does not upload plaintext dumps or publish database data as GitHub Actions artifacts.

## What the backup covers and what it does not

Each encrypted `.dump.age` file contains a PostgreSQL custom-format dump of the CEStudy database (all dumpable database schemas, tables, and data). The workflow checks that the archive can be listed by `pg_restore` and includes the app tables `public.catalog_subjects` and `public.practice_questions` before encrypting it. It also checks the SHA-256 of the uploaded encrypted object by streaming it back from B2.

A database dump does not include cluster-wide PostgreSQL roles, Supabase project settings/API keys, Cloudflare Pages settings, GitHub settings, Edge Function source, or the contents of Supabase Storage objects. Keep migrations in Git and document/backup any future Edge Functions, Storage objects, or mutable student data separately. A successful upload check is not a restore drill; restore a copy into a separate test project before relying on this as a complete disaster-recovery plan.

## Recovery key reminder

The workflow intentionally has no decryption private key. To decrypt a downloaded archive on Termux after verifying its checksum, use the private identity file created in Step 1, for example:

```sh
sha256sum -c CEStudy-YYYYMMDDTHHMMSSZ.dump.age.sha256
age --decrypt \
  --identity "$HOME/.config/age/cestudy-backup-identity.txt" \
  --output CEStudy-restore-test.dump \
  CEStudy-YYYYMMDDTHHMMSSZ.dump.age
pg_restore --list CEStudy-restore-test.dump
```

Replace the timestamped filename with the actual downloaded filename. This command only lists the dump's contents; it does not restore or modify any database. Perform a real restore only against a separate test Supabase project, never the live project as the first attempt.
