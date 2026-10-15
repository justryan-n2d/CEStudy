#!/usr/bin/env bash
set -Eeuo pipefail
set +x
umask 077

# Run only on a trusted machine. Never put the DB URL into Git, a VITE_ variable,
# a workflow log, or a chat. Prefer entering it with `read -rsp` in your shell.
if [[ -z "${CESTUDY_DB_URL:-}" ]]; then
  echo "ERROR: CESTUDY_DB_URL is not set. Enter the CEStudy database URL in your trusted terminal first." >&2
  exit 2
fi

for command_name in supabase tar sha256sum; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "ERROR: Required command is missing: $command_name" >&2
    exit 2
  fi
done

if [[ -n "${CESTUDY_GPG_RECIPIENT:-}" ]] && ! command -v gpg >/dev/null 2>&1; then
  echo "ERROR: CESTUDY_GPG_RECIPIENT was set but gpg is not installed." >&2
  exit 2
fi

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_root="${CESTUDY_BACKUP_DIR:-$HOME/CEStudy-backups}"
output_dir="$backup_root/$timestamp"
archive="$backup_root/CEStudy-$timestamp.tar.gz"

mkdir -p "$backup_root"
chmod 700 "$backup_root"
mkdir "$output_dir"
chmod 700 "$output_dir"

cleanup() {
  unset CESTUDY_DB_URL
}
trap cleanup EXIT

echo "Exporting CEStudy database schema and data into a private local folder..."
supabase db dump --db-url "$CESTUDY_DB_URL" -f "$output_dir/roles.sql" --role-only
supabase db dump --db-url "$CESTUDY_DB_URL" -f "$output_dir/schema.sql"
supabase db dump --db-url "$CESTUDY_DB_URL" -f "$output_dir/data.sql" --use-copy --data-only -x "storage.buckets_vectors" -x "storage.vector_indexes"

for file in roles.sql schema.sql data.sql; do
  if [[ ! -s "$output_dir/$file" ]]; then
    echo "ERROR: Export is missing or empty: $file" >&2
    exit 1
  fi
  chmod 600 "$output_dir/$file"
done

supabase --version > "$output_dir/cli-version.txt"
printf 'Project: CEStudy (qqmdwltfgpqtcvdbcmto)\nExported UTC: %s\n' "$timestamp" > "$output_dir/manifest.txt"
(
  cd "$output_dir"
  sha256sum roles.sql schema.sql data.sql cli-version.txt manifest.txt > SHA256SUMS
)
chmod 600 "$output_dir/manifest.txt" "$output_dir/cli-version.txt" "$output_dir/SHA256SUMS"

tar -C "$backup_root" -czf "$archive" "$timestamp"
chmod 600 "$archive"

if [[ -n "${CESTUDY_GPG_RECIPIENT:-}" ]]; then
  gpg --batch --yes --trust-model always --recipient "$CESTUDY_GPG_RECIPIENT" --encrypt --output "$archive.gpg" "$archive"
  chmod 600 "$archive.gpg"
  rm -f "$archive"
  rm -rf "$output_dir"
  echo "Encrypted backup created: $archive.gpg"
  echo "Verify the encrypted archive checksum before transferring it off-site:"
  sha256sum "$archive.gpg" > "$archive.gpg.sha256"
  chmod 600 "$archive.gpg.sha256"
else
  echo "Backup archive created: $archive"
  echo "The archive contains SQL data and is NOT encrypted. Transfer it only to private encrypted storage."
  echo "Folder with individual SQL files: $output_dir"
  sha256sum "$archive" > "$archive.sha256"
  chmod 600 "$archive.sha256"
fi

echo "Do not commit backup output to Git. Keep at least one encrypted off-site copy."
