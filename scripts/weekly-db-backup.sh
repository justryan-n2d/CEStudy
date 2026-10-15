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
  AGE_RECIPIENT
  RUNNER_TEMP
  GITHUB_STEP_SUMMARY
)
for name in "${required_vars[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    echo "ERROR: Required workflow setting '$name' is missing." >&2
    exit 2
  fi
done

for cmd in psql pg_dump pg_restore age rclone sha256sum grep awk cmp; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "ERROR: Required command is missing: $cmd" >&2
    exit 2
  }
done

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
if [[ ! "$AGE_RECIPIENT" =~ ^age1[023456789acdefghjklmnpqrstuvwxyz]{30,}$ ]]; then
  echo "ERROR: CESTUDY_AGE_RECIPIENT does not look like a valid age public recipient." >&2
  exit 2
fi

pg_dump_version="$(pg_dump --version)"
if [[ ! "$pg_dump_version" =~ PostgreSQL\ 17\. ]]; then
  echo "ERROR: PostgreSQL 17 client required for the live CEStudy PostgreSQL 17.11 database; found: $pg_dump_version" >&2
  exit 2
fi

export PGSSLMODE=require
export PGPASSWORD="$CESTUDY_DB_PASSWORD"
unset CESTUDY_DB_PASSWORD
server_version_num="$(psql --no-password --no-psqlrc -qAt \
  --host="$CESTUDY_DB_HOST" --port="$CESTUDY_DB_PORT" \
  --username="$CESTUDY_DB_USER" --dbname=postgres \
  --set=ON_ERROR_STOP=1 --command='SHOW server_version_num')"
if [[ ! "$server_version_num" =~ ^[0-9]+$ ]] || (( server_version_num / 10000 != 17 )); then
  echo "ERROR: Expected PostgreSQL 17 on CEStudy; received server major version '$server_version_num'." >&2
  exit 1
fi

# rclone uses environment-based configuration. Its temporary config file is
# intentionally empty and private so this job does not depend on runner state.
work_dir="$(mktemp -d "${RUNNER_TEMP%/}/cestudy-weekly-backup.XXXXXX")"
trap 'result=$?; rm -rf -- "$work_dir"; unset PGPASSWORD RCLONE_CONFIG_B2_ACCOUNT RCLONE_CONFIG_B2_KEY B2_APPLICATION_KEY_ID B2_APPLICATION_KEY AGE_RECIPIENT; exit "$result"' EXIT
rclone_config="$work_dir/rclone.conf"
: > "$rclone_config"
chmod 600 "$rclone_config"
export RCLONE_CONFIG="$rclone_config"
export RCLONE_CONFIG_B2_TYPE=b2
export RCLONE_CONFIG_B2_ACCOUNT="$B2_APPLICATION_KEY_ID"
export RCLONE_CONFIG_B2_KEY="$B2_APPLICATION_KEY"
# Use B2 hide markers rather than permanent deletion. The bucket lifecycle rule
# described in the docs permanently expires hidden versions after one day.
export RCLONE_CONFIG_B2_HARD_DELETE=false
unset B2_APPLICATION_KEY_ID B2_APPLICATION_KEY

bucket="cestudy-db-backups"
prefix="termux/weekly"
remote_dir="b2:${bucket}/${prefix}"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
archive_name="CEStudy-${stamp}.dump.age"
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

# Verify archive readability and expected application tables before encryption.
pg_restore --list "$dump_file" > "$work_dir/archive-toc.txt"
for table in catalog_subjects practice_questions; do
  if ! grep -Eq "TABLE public ${table}([[:space:]]|$)" "$work_dir/archive-toc.txt"; then
    echo "ERROR: The dump does not include expected table public.${table}." >&2
    exit 1
  fi
done

printf 'Encrypting the database dump with the configured age public key...\n'
age --recipient "$AGE_RECIPIENT" --output "$encrypted_file" "$dump_file"
if [[ ! -s "$encrypted_file" ]]; then
  echo "ERROR: age did not create a non-empty encrypted archive." >&2
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
checks=pg_restore_list,expected_tables,remote_sha256
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
  echo "- UTC timestamp: \`$stamp\`"
  echo "- Encrypted archive: \`$archive_name\`"
  echo "- SHA-256: \`$archive_sha256\`"
  echo "- Remote prefix: \`${bucket}/${prefix}/\`"
  echo '- Local PostgreSQL archive listing and expected tables verified before encryption.'
  echo '- Uploaded encrypted bytes and checksum file were read back and matched.'
  echo '- Retention pruning ran only after the new backup was verified.'
} >> "$GITHUB_STEP_SUMMARY"

printf 'SUCCESS: Encrypted backup uploaded and verified.\n'
