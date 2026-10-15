# CEStudy automated weekly database backups

**Status:** The first real weekly backup succeeded in GitHub Actions run [38773249088](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088). The run exported the live database, encrypted it, uploaded the archive and checksum to the correct private B2 bucket, read both back for verification, wrote and re-read the `.verified` marker, and completed retention. One verified backup set is confirmed. A real decrypt and full restore into a separate test database have **not** been completed yet.

## Schedule and destination

- Schedule: Sundays at 02:00 UTC (10:00 AM Philippine time); a maintainer can also start a run manually in GitHub Actions.
- Destination: private Backblaze B2 bucket `cestudy-db-backup`, prefix `termux/weekly/`.
- Retention: four latest complete verified encrypted backups. Each set contains an encrypted database dump, SHA-256 checksum, and verification marker. Pruning happens only after the newest set is uploaded and read back successfully.
- Encryption: a random AES-256 key encrypts the dump with authenticated AES-GCM; the AES key is wrapped with RSA-OAEP using a 3072-bit public certificate. GitHub Actions receives only the public certificate. The private key never goes to GitHub.
- Database client: PostgreSQL 17, matching the verified CEStudy server version 17.11.
- Failure details: failed runs automatically get a GitHub Actions summary with a direct run link. Email alerts depend on GitHub notification settings, which still need manual confirmation.

### What is automatic, and what is manual?

**Automatic in GitHub Actions:** the weekly schedule; B2 access preflight; PostgreSQL export; archive and expected-table checks; encryption using the public certificate; upload of the encrypted archive and checksum; remote read-back checks; creation and verification of the `.verified` marker; retention pruning after successful verification; failure summary; and CI tests for encrypt/decrypt, corrupted-tag rejection, retention, migrations, RLS, lint, and build.

**Still manual:** Backblaze's lifecycle rule for deleting hidden old versions; GitHub account email notification settings; keeping protected copies of the private key and passphrase; downloading and decrypting a real backup; restoring the decrypted dump into a separate Supabase test database; validating restored counts, grants, RLS, and published-only question visibility; and recording the restore evidence. A successful upload is not proof that a full restore works.

## 1. Generate a private key and public certificate in Termux

First install the supported packages:

```sh
pkg update
pkg install openssl python python-cryptography
```

Then create the files. Do not overwrite existing key files.

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

OpenSSL should prompt you to set a passphrase for the private key. Save it securely. The private-key file is encrypted, and restoration will ask for its passphrase.

**Never commit, paste, or upload `private-key.pem` to GitHub or to the Backblaze backup bucket.** Keep two protected copies of the private key and its passphrase in separate secure locations. If the key is lost, the encrypted database backups cannot be decrypted. Keep `public-cert.pem` alongside the private key for restore operations.

## 2. Public recipient certificate (already committed)

The public recipient certificate is already committed at `scripts/backup-recipient-cert.pem`. No further Termux copy or commit is needed for the current setup.

- The workflow reads this public certificate directly from the repository.
- A public certificate can encrypt the dump but cannot decrypt it. It is safe to keep in source control.
- Keep `private-key.pem` and its passphrase outside GitHub and outside the backup bucket. Keep protected recovery copies.
- Do not generate a new key or replace the certificate as a troubleshooting step. Key rotation requires a deliberate recovery plan and validation that older backups remain decryptable.

## 3. Verify the database and B2 repository secrets

The failed workflow log showed that the database/B2 secrets were present and the database export plus encryption completed. Keep these values in **Settings → Secrets and variables → Actions → Secrets**. Do not print them, paste them into chat, or put them in source files, workflow YAML, a `VITE_*` variable, or a public issue. Recreate a secret only if it is missing or you have confirmed that its value is incorrect.

| Secret name | Value |
| --- | --- |
| `CESTUDY_DB_HOST` | `aws-0-ap-southeast-1.pooler.supabase.com` |
| `CESTUDY_DB_PORT` | `5432` |
| `CESTUDY_DB_USER` | `postgres.qqmdwltfgpqtcvdbcmto` |
| `CESTUDY_DB_PASSWORD` | Current CEStudy database password that passed the `psql` login test |
| `B2_APPLICATION_KEY_ID` | Key ID for the restricted key for bucket `cestudy-db-backup` |
| `B2_APPLICATION_KEY` | The matching Backblaze application-key secret, not its ID |

The workflow uses the existing bucket named exactly `cestudy-db-backup` and prefix `termux/weekly/`. The Backblaze key error confirmed that this is the bucket your current key is authorized to use, so the workflow has now been changed to target that same bucket. Do not create another bucket just to match the earlier mistaken plural name.

The application key must have read and write access for the `termux/` prefix, including listing files. Do not use a Backblaze master application key. The workflow checks access to the configured bucket and prefix before starting the database export. If the preflight still fails, confirm the key is restricted to `cestudy-db-backup`, the prefix is `termux/`, and the key ID and application-key value in GitHub both belong to the same restricted key.

## 4. Configure Backblaze hidden-version cleanup

The workflow hides stale B2 objects after a newer verified backup exists. Backblaze retains hidden versions unless a lifecycle rule deletes them, so configure cleanup for this prefix too. See the [Backblaze lifecycle rules guide](https://www.backblaze.com/docs/en/cloud-storage-lifecycle-rules).

1. Sign in to Backblaze and open **B2 Cloud Storage → Buckets → `cestudy-db-backup`**.
2. Open **Lifecycle Settings** and choose **Use custom lifecycle rules**.
3. Add a rule for file name prefix `termux/weekly/`.
4. Set **Days from uploading to hiding** to **None**.
5. Set **Days from hiding to deleting** to **1**.
6. Save the lifecycle settings.

Do not configure a rule that hides all current files after a fixed age; it could hide one of the latest four backups.

## 5. Enable GitHub failure email notifications

See [GitHub Actions notification settings](https://docs.github.com/en/subscriptions-and-notifications/how-tos/managing-github-actions-notifications).

1. Open [GitHub notification settings](https://github.com/settings/notifications).
2. Under **System → Actions**, select **Email** and choose **Only notify for failed workflows**.
3. Save the settings. Ensure the account that created the workflow has a verified email and appropriate repository notification settings.

The GitHub Actions run summary also includes a direct link to a failure, but email depends on these account notification settings.

## 6. Check the successful backup and future scheduled runs

The first successful post-fix run is [38773249088](https://github.com/justryan-n2d/CEStudy/actions/runs/38773249088). It retained one verified set. For future manual verification, after confirming the required secrets, configuring the lifecycle rule, and enabling failure notifications:

1. Open the repository **Actions** tab.
2. Select **CEStudy weekly database backup**.
3. Choose **Run workflow** on branch `main`.
4. Open the run and wait for completion.
5. Require the green success result and its summary confirming the encrypted archive, checksum, and verification marker were read back successfully.
6. In Backblaze, inspect `cestudy-db-backup/termux/weekly/`. Each complete set contains `.dump.enc`, `.dump.enc.sha256`, and `.dump.enc.verified` files, with up to four complete sets retained.

Do not count failed or cancelled runs as backups. If a run fails, inspect the failing step without sharing database credentials, B2 keys, or the private key. The workflow does not upload plaintext dumps as GitHub Actions artifacts.

## What a backup contains

Each `.dump.enc` file is a PostgreSQL custom-format export encrypted by `scripts/encrypt-db-backup.py`. The helper uses RSA-OAEP with SHA-256 to wrap a fresh random AES key, then encrypts the dump in streaming chunks with AES-256-GCM. The format header is authenticated as additional data, and decryption refuses a corrupted authentication tag. Before encryption, the workflow checks that `pg_restore` can read the dump and that it includes `public.catalog_subjects` and `public.practice_questions`. It then verifies that the SHA-256 of the uploaded encrypted bytes matches the local file.

The workflow uses the pinned dependency in [`requirements-backup.txt`](../../requirements-backup.txt). Termux restores should install the maintained package with `pkg install python-cryptography`, not `pip install cryptography`.

A database dump does not include cluster-wide PostgreSQL roles, Supabase project settings/API keys, Cloudflare Pages settings, GitHub settings, Edge Function source, or Supabase Storage object contents. Preserve migrations in Git and handle any future Edge Functions, Storage objects, and mutable student data separately. A successful upload check is not a restore drill; test restoring in a separate Supabase project before relying on the backups for disaster recovery.

## Restore a downloaded backup for inspection

Download a `.dump.enc` file and its `.sha256` file from B2 to Termux. In the folder containing both files, verify the checksum:

```sh
sha256sum -c CEStudy-YYYYMMDDTHHMMSSZ.dump.enc.sha256
```

Replace the timestamp with the actual file name. Then download the exact encryption helper revision from GitHub and decrypt to a local test dump:

```sh
curl -fsSL \
  https://raw.githubusercontent.com/justryan-n2d/CEStudy/d0bf8e4b9d264db912e497b4849eed8a4c202c0a/scripts/encrypt-db-backup.py \
  -o "$HOME/encrypt-db-backup.py"

python "$HOME/encrypt-db-backup.py" decrypt \
  --identity "$HOME/.config/cestudy-backup/private-key.pem" \
  --input CEStudy-YYYYMMDDTHHMMSSZ.dump.enc \
  --output "$HOME/CEStudy-restore-test.dump"

pg_restore --list "$HOME/CEStudy-restore-test.dump"
```

The helper asks for the private key passphrase and validates AES-GCM authentication. These commands only decrypt and list the dump; they do not change a database. Perform a full restore test against a separate temporary Supabase project, never the live database on the first attempt.
