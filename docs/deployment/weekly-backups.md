# CEStudy automated weekly database backups

**Status:** The workflow and scripts are committed. The first backup is not active or verified until the certificate variable, repository secrets, Backblaze lifecycle rule, failure email notifications, and a successful manual workflow run are complete.

## Schedule and destination

- Schedule: Sundays at 02:00 UTC (10:00 AM Philippine time); a maintainer can also start a run manually in GitHub Actions.
- Destination: private Backblaze B2 bucket `cestudy-db-backups`, prefix `termux/weekly/`.
- Retention: four latest complete verified encrypted backups. Each set contains an encrypted database dump, SHA-256 checksum, and verification marker. Pruning happens only after the newest set is uploaded and read back successfully.
- Encryption: OpenSSL CMS using AES-256-GCM, with a 3072-bit RSA recipient certificate. GitHub Actions receives only the public certificate. The private key is never stored in GitHub.
- Database client: PostgreSQL 17, matching the verified CEStudy server version 17.11.
- Failure details: failed runs get a GitHub Actions summary with a direct run link. GitHub account notifications must be configured to receive failure emails.

A workflow run is not a verified backup until it finishes successfully. The earlier failed Termux attempts did not create a confirmed backup.

## 1. Generate a private key and public certificate in Termux

OpenSSL is available in Termux. This avoids the known `age-keygen` error reported by Termux users.

Run these commands:

```sh
umask 077
mkdir -p "$HOME/.config/cestudy-backup"
chmod 700 "$HOME/.config/cestudy-backup"

if [ -e "$HOME/.config/cestudy-backup/private-key.pem" ] || [ -e "$HOME/.config/cestudy-backup/public-cert.pem" ]; then
  echo "STOP: One or both key files already exist. Do not overwrite them."
else
  openssl req -x509 -newkey rsa:3072 -sha256 \
    -keyout "$HOME/.config/cestudy-backup/private-key.pem" \
    -out "$HOME/.config/cestudy-backup/public-cert.pem" \
    -days 3650 \
    -subj "/CN=CEStudy weekly database backup"
fi

chmod 600 "$HOME/.config/cestudy-backup/private-key.pem"
chmod 600 "$HOME/.config/cestudy-backup/public-cert.pem"
openssl x509 -in "$HOME/.config/cestudy-backup/public-cert.pem" -noout -subject -dates
```

OpenSSL should prompt you to set a passphrase for the private key. Save it securely. The private key file is encrypted, and the backup restore process will prompt for that passphrase.

**Never commit, paste, or upload `private-key.pem` to GitHub or to the Backblaze backup bucket.** Keep two protected copies of the private key and its passphrase in separate secure locations. If the key is lost, the encrypted database backups cannot be decrypted. Keep `public-cert.pem` alongside the private key for future restore operations.

## 2. Add the public certificate as a GitHub repository variable

The public certificate is safe for encryption-only use in the workflow; it cannot decrypt a backup. Encode it as a single line in Termux:

```sh
base64 "$HOME/.config/cestudy-backup/public-cert.pem" | tr -d '\n'
printf '\n'
```

Copy the entire single-line output. Do not send it in chat.

1. Open the [CEStudy repository](https://github.com/justryan-n2d/CEStudy).
2. Select **Settings**.
3. Under **Secrets and variables**, open **Actions**.
4. Select the **Variables** tab, then **New repository variable**.
5. Name it `CESTUDY_BACKUP_CERT_B64`.
6. Paste the one-line base64 certificate value and save.

The variable is public encryption material, not a private key or credential.

## 3. Add the database and B2 repository secrets

In the same **Settings → Secrets and variables → Actions** page, open **Secrets** and create each repository secret. Do not place these values in repository files, workflow YAML, a `VITE_*` variable, or a public issue.

| Secret name | Value |
| --- | --- |
| `CESTUDY_DB_HOST` | `aws-0-ap-southeast-1.pooler.supabase.com` |
| `CESTUDY_DB_PORT` | `5432` |
| `CESTUDY_DB_USER` | `postgres.qqmdwltfgpqtcvdbcmto` |
| `CESTUDY_DB_PASSWORD` | Current CEStudy database password that passed the `psql` login test |
| `B2_APPLICATION_KEY_ID` | Key ID for the restricted key for bucket `cestudy-db-backups` |
| `B2_APPLICATION_KEY` | The matching Backblaze application-key secret, not its ID |

The B2 key must be restricted to bucket `cestudy-db-backups` and prefix `termux/`. Read/write access is needed for upload, listing, and remote verification. Do not use a Backblaze master application key. The workflow writes under `termux/weekly/`.

## 4. Configure Backblaze hidden-version cleanup

The workflow hides stale B2 objects after a newer verified backup exists. Backblaze retains hidden versions unless a lifecycle rule deletes them, so configure cleanup for this automation prefix too. See the [Backblaze lifecycle rules guide](https://www.backblaze.com/docs/en/cloud-storage-lifecycle-rules).

1. Sign in to Backblaze and open **B2 Cloud Storage → Buckets → `cestudy-db-backups`**.
2. Open **Lifecycle Settings** and choose **Use custom lifecycle rules**.
3. Add a rule for file name prefix `termux/weekly/`.
4. Set **Days from uploading to hiding** to **None**.
5. Set **Days from hiding to deleting** to **1**.
6. Save the lifecycle settings.

Do not configure a rule that hides all currently visible files after a fixed age. That could hide a backup still within the retained latest four.

## 5. Enable GitHub failure email notifications

See [GitHub Actions notification settings](https://docs.github.com/en/subscriptions-and-notifications/how-tos/managing-github-actions-notifications).

1. Open [GitHub notification settings](https://github.com/settings/notifications).
2. Under **System → Actions**, select **Email** and choose **Only notify for failed workflows**.
3. Save the settings. Ensure the account that created the workflow has a verified email and appropriate repository notification settings.

The GitHub Actions run summary also provides a direct link to the failure, but email depends on these account notification settings.

## 6. Run the first backup and verify it

After the variable, six repository secrets, lifecycle rule, and notification settings are configured:

1. Open the repository **Actions** tab.
2. Select **CEStudy weekly database backup**.
3. Choose **Run workflow** on branch `main`.
4. Open the new run and wait for completion.
5. Require the green success result and its summary confirming that the encrypted archive, checksum, and verification marker were read back successfully.
6. In Backblaze, inspect `cestudy-db-backups/termux/weekly/`. The current set should contain the `.dump.cms`, `.dump.cms.sha256`, and `.dump.cms.verified` files, plus up to three older complete verified sets.

Do not count failed or cancelled runs as backups. If a run fails, inspect the failing step without sharing database credentials, B2 keys, or the private key. The workflow does not upload plaintext database dumps as GitHub artifacts.

## What a backup contains

Each `.dump.cms` file is a PostgreSQL custom-format export of the CEStudy database's dumpable schemas, tables, and data, encrypted with CMS AES-256-GCM. Before encryption the workflow checks that `pg_restore` can read the archive and that it includes `public.catalog_subjects` and `public.practice_questions`. It then parses the CMS container and checks the SHA-256 of the uploaded encrypted bytes by streaming the file back from B2.

A database dump does not include cluster-wide PostgreSQL roles, Supabase project settings/API keys, Cloudflare Pages settings, GitHub settings, Edge Function source, or Supabase Storage object contents. Preserve migrations in Git and handle any future Edge Functions, Storage objects, and mutable student data separately. A successful upload check is not a restore drill; test restoration in a separate Supabase project before relying on the backups for disaster recovery.

## Restore a downloaded backup for inspection

Download an encrypted archive and its `.sha256` file from B2 to Termux, then move into the folder containing both files. Verify the checksum:

```sh
sha256sum -c CEStudy-YYYYMMDDTHHMMSSZ.dump.cms.sha256
```

Replace the timestamp with the actual file name. Then decrypt into a local test dump:

```sh
openssl cms -decrypt -binary -inform DER \
  -in CEStudy-YYYYMMDDTHHMMSSZ.dump.cms \
  -recip "$HOME/.config/cestudy-backup/public-cert.pem" \
  -inkey "$HOME/.config/cestudy-backup/private-key.pem" \
  -out "$HOME/CEStudy-restore-test.dump"

pg_restore --list "$HOME/CEStudy-restore-test.dump"
```

OpenSSL will ask for the private key's passphrase. These commands only verify and list the dump; they do not change any database. Perform a full restore test against a separate temporary Supabase project, never the live database on the first attempt.
