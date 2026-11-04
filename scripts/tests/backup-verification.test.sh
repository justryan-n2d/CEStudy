#!/usr/bin/env bash
set -Eeuo pipefail
set +x

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
backup_script="$repo_root/scripts/weekly-db-backup.sh"

# A backup must not be called verified unless its archive listing includes all
# three live application content tables. Keep this list explicit and reviewable.
expected_table_list='expected_tables=(catalog_subjects practice_questions subject_lessons)'
if ! grep -Fq -- "$expected_table_list" "$backup_script"; then
  echo "FAIL: backup archive verification must require catalog, practice questions, and lessons." >&2
  exit 1
fi


# Print explicit successful evidence for every required table, so a green run
# proves which archive contents were checked without exposing database rows.
if ! grep -Fq -- "Verified required archive table: public.%s" "$backup_script"; then
  echo "FAIL: backup logs must name each required table after archive validation." >&2
  exit 1
fi

# Bash treats backticks inside double quotes as command substitutions. The
# summary must use printf placeholders rather than interpolate metadata as shell.
unsafe_summary_lines=(
  'echo "- UTC timestamp: `$stamp`"'
  'echo "- Encrypted archive: `$archive_name`"'
  'echo "- SHA-256: `$archive_sha256`"'
  'echo "- Remote prefix: `${bucket}/${prefix}/`"'
)
for line in "${unsafe_summary_lines[@]}"; do
  if grep -Fq -- "$line" "$backup_script"; then
    echo "FAIL: unsafe command-substitution pattern remains in backup summary." >&2
    exit 1
  fi
done

echo "PASS: backup verification requires lessons and summary metadata is safe from shell substitution."
