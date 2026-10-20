#!/usr/bin/env bash
set -Eeuo pipefail
set +x
umask 077

required_vars=(
  CESTUDY_DB_HOST
  CESTUDY_DB_PORT
  CESTUDY_DB_USER
  CESTUDY_DB_PASSWORD
  B2_APPLICATION_KEY_ID
  B2_APPLICATION_KEY
  RUNNER_TEMP
  GITHUB_STEP_SUMMARY
)
for name in "${required_vars[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    echo "ERROR: Required workflow setting '$name' is missing." >&2
    exit 2
  fi
done

for cmd in psql pg_dump pg_restore openssl python3 rclone sha256sum grep awk cmp head; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "ERROR: Required command is missing: $cmd" >&2
    exit 2
  }
done

# The recipient certificate is public encryption material and is stored
# directly in the repository. This avoids copying a long Base64 value through
# the GitHub Actions variables UI.
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cert_file="$script_dir/backup-recipient-cert.pem"
if [[ ! -s "$cert_file" ]]; then
  echo "ERROR: Missing scripts/backup-recipient-cert.pem." >&2
  echo "Copy the existing public-cert.pem from Termux into this repository file and push it to main." >&2
  echo "Do not copy private-key.pem. The public certificate is safe to commit; the private key is not." >&2
  exit 2
fi
if ! openssl x509 -in "$cert_file" -noout; then
  echo "ERROR: scripts/backup-recipient-cert.pem is not a valid PEM X.509 certificate." >&2
  exit 2
fi
if ! openssl x509 -in "$cert_file" -noout -text | grep -Fq 'Public Key Algorithm: rsaEncryption'; then
  echo "ERROR: The backup certificate must contain an RSA public key." >&2
  exit 2
fi
if ! openssl x509 -in "$cert_file" -noout -checkend 0 >/dev/null; then
  echo "ERROR: The backup recipient certificate is expired. Do not generate a new key unless you also plan a key-rotation and recovery procedure." >&2
  exit 2
fi

# Guard against accidentally backing up the wrong project or using a client
# that cannot dump this project's PostgreSQL 17 server.
if [[ "$CESTUDY_DB_HOST" != "aws-0-ap-southeast-1.pooler.supabase.com" ]]; then
  echo "ERROR: CESTUDY_DB_HOST does not match the verified CEStudy pooler host." >&2
  exit 2
fi
if [[ "$CESTUDY_DB_USER" != "postgres.qqmdwltfgpqtcvdbcmto" ]]; then
  echo "ERROR: CESTUDY_DB_USER does not match the verified CEStudy database user." >&2
  exit 2
fi
if [[ ! "$CESTUDY_DB_PORT" =~ ^[0-9]+$ ]] || [[ "$CESTUDY_DB_PORT" != "5432" ]]; then
  echo "ERROR: CESTUDY_DB_PORT must be 5432 for the configured session pooler." >&2
  exit 2
fi

pg_dump_version="$(pg_dump --version)"
if [[ ! "$pg_dump_version" =~ ^pg_dump\ \(PostgreSQL\)\ 17\. ]]; then
  echo "ERROR: PostgreSQL 17 client required for the live CEStudy PostgreSQL 17.11 database; found: $pg_dump_version" >&2
  exit 2
fi

# Create the protected temporary work area and configure B2 before touching
# the database. This lets us fail fast if the restricted B2 key targets the
# wrong bucket, instead of exporting and encrypting a dump that cannot upload.
work_dir="$(mktemp -d "${RUNNER_TEMP%/}/cestudy-weekly-backup.XXXXXX")"
trap 'result=$?; rm -rf -- "$work_dir"; unset PGPASSWORD RCLONE_CONFIG_B2_ACCOUNT RCLONE_CONFIG_B2_KEY B2_APPLICATION_KEY_ID B2_APPLICATION_KEY; exit "$result"' EXIT

# rclone uses environment-based configuration. Its temporary config file is
# intentionally empty and private so this job does not depend on runner state.
rclone_config="$work_dir/rclone.conf"
: > "$rclone_config"
chmod 600 "$rclone_config"
export RCLONE_CONFIG="$rclone_config"
export RCLONE_CONFIG_B2_TYPE=b2
export RCLONE_CONFIG_B2_ACCOUNT="$B2_APPLICATION_KEY_ID"
export RCLONE_CONFIG_B2_KEY="$B2_APPLICATION_KEY"
export RCLONE_CONFIG_B2_HARD_DELETE=false
unset B2_APPLICATION_KEY_ID B2_APPLICATION_KEY

bucket="cestudy-db-backup"
prefix="termux/weekly"
remote_dir="b2:${bucket}/${prefix}"

printf 'Checking Backblaze B2 access before exporting the database...\n'
if ! rclone lsf "$remote_dir" --max-depth 1 >/dev/null 2>"$work_dir/b2-preflight.log"; then
  if grep -qi 'you must use bucket' "$work_dir/b2-preflight.log"; then
    echo "ERROR: The configured Backblaze application key is restricted to a different bucket." >&2
    echo "This workflow requires the exact bucket name 'cestudy-db-backup' and prefix 'termux/'. Create a new restricted application key for that bucket, then update BOTH GitHub secrets B2_APPLICATION_KEY_ID and B2_APPLICATION_KEY." >&2
  else
    echo "ERROR: Cannot access the configured Backblaze destination 'cestudy-db-backup/termux/weekly/'." >&2
    echo "Check that the bucket exists and the paired application key ID/secret are correct, with read/write access to prefix 'termux/'. No database export was started." >&2
  fi
  exit 2
fi

export PGSSLMODE=require
export PGPASSWORD="$CESTUDY_DB_PASSWORD"
unset CESTUDY_DB_PASSWORD
printf 'Checking the database connection and PostgreSQL version...\n'
server_version_num="$(psql --no-password --no-psqlrc -qAt \
  --host="$CESTUDY_DB_HOST" --port="$CESTUDY_DB_PORT" \
  --username="$CESTUDY_DB_USER" --dbname=postgres \
  --set=ON_ERROR_STOP=1 --command='SHOW server_version_num')"
if [[ ! "$server_version_num" =~ ^[0-9]+$ ]] || (( server_version_num / 10000 != 17 )); then
  echo "ERROR: Expected PostgreSQL 17 on CEStudy; received server major version '$server_version_num'." >&2
  exit 1
fi

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
archive_name="CEStudy-${stamp}.dump.enc"
dump_file="$work_dir/CEStudy-${stamp}.dump"
encrypted_file="$work_dir/$archive_name"
checksum_name="${archive_name}.sha256"
checksum_file="$work_dir/$checksum_name"
marker_name="${archive_name}.verified"
marker_file="$work_dir/$marker_name"
remote_archive="$remote_dir/$archive_name"
remote_checksum="$remote_dir/$checksum_name"
remote_marker="$remote_dir/$marker_name"

printf 'Checking the database connection and PostgreSQL version...\n'
# Keep SQL output limited to a version number; never print connection settings.
printf 'Exporting the CEStudy database...\n'
pg_dump --no-password \
  --host="$CESTUDY_DB_HOST" \
  --port="$CESTUDY_DB_PORT" \
  --username="$CESTUDY_DB_USER" \
  --dbname=postgres \
  --format=custom \
  --file="$dump_file"

if [[ ! -s "$dump_file" ]]; then
  echo "ERROR: pg_dump created an empty file." >&2
  exit 1
fi

# Verify archive readability and all student-facing content tables before encryption.
pg_restore --list "$dump_file" > "$work_dir/archive-toc.txt"
expected_tables=(catalog_subjects practice_questions subject_lessons)
for table in "${expected_tables[@]}"; do
  if ! grep -Eq "TABLE public ${table}([[:space:]]|$)" "$work_dir/archive-toc.txt"; then
    echo "ERROR: The dump does not include expected table public.$table." >&2
    exit 1
  fi
  printf 'Verified required archive table: public.%s\n' "$table"
done

printf 'Encrypting with RSA-OAEP and streaming AES-256-GCM...\n'
python3 "$(dirname "$0")/encrypt-db-backup.py" encrypt \
  --certificate "$cert_file" --input "$dump_file" --output "$encrypted_file"
if [[ ! -s "$encrypted_file" ]]; then
  echo "ERROR: Encryption did not create a non-empty backup." >&2
  exit 1
fi
if [[ "$(head -c 8 "$encrypted_file")" != "CESTUDY1" ]]; then
  echo "ERROR: The encrypted backup has an invalid format header." >&2
  exit 1
fi
rm -f -- "$dump_file"

archive_sha256="$(sha256sum "$encrypted_file" | awk '{print $1}')"
printf '%s  %s\n' "$archive_sha256" "$archive_name" > "$checksum_file"
chmod 600 "$encrypted_file" "$checksum_file"

printf 'Uploading the encrypted archive and checksum to private Backblaze B2...\n'
rclone copyto "$encrypted_file" "$remote_archive" --transfers 1 --checkers 1
rclone copyto "$checksum_file" "$remote_checksum" --transfers 1 --checkers 1

printf 'Streaming the uploaded archive back through SHA-256 verification...\n'
remote_sha256="$(rclone cat "$remote_archive" | sha256sum | awk '{print $1}')"
if [[ "$remote_sha256" != "$archive_sha256" ]]; then
  echo "ERROR: The uploaded B2 archive checksum does not match the local encrypted archive." >&2
  exit 1
fi
if ! rclone cat "$remote_checksum" | cmp -s "$checksum_file" -; then
  echo "ERROR: The uploaded checksum file does not match the local checksum." >&2
  exit 1
fi

cat > "$marker_file" <<MARKER
status=verified
timestamp_utc=$stamp
archive=$archive_name
sha256=$archive_sha256
postgresql_major=17
encryption=RSA_OAEP_SHA256_AES_256_GCM
checks=pg_restore_list,expected_tables,encryption_format,remote_sha256
MARKER
rclone copyto "$marker_file" "$remote_marker" --transfers 1 --checkers 1
if ! rclone cat "$remote_marker" | cmp -s "$marker_file" -; then
  echo "ERROR: The remote verification marker could not be read back exactly." >&2
  exit 1
fi

# Pruning runs only after the new encrypted archive, checksum and marker all
# pass remote-read verification. On failure, old verified copies remain intact.
bash "$(dirname "$0")/prune-weekly-backups.sh" "$remote_dir"

{
  echo '## CEStudy weekly database backup succeeded'
  echo
  printf -- '- UTC timestamp: `%s`\n' "$stamp"
  printf -- '- Encrypted archive: `%s`\n' "$archive_name"
  printf -- '- SHA-256: `%s`\n' "$archive_sha256"
  printf -- '- Remote prefix: `%s`\n' "${bucket}/${prefix}/"
  echo '- PostgreSQL archive listing and expected tables verified before encryption.'
  echo '- The encrypted archive format header and uploaded ciphertext integrity were checked.'
  echo '- Uploaded encrypted bytes and checksum file were read back and matched.'
  echo '- Retention pruning ran only after the new backup was verified.'
} >> "$GITHUB_STEP_SUMMARY"

printf 'SUCCESS: Encrypted backup uploaded and verified.\n'
