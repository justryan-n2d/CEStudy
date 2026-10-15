#!/usr/bin/env bash
set -Eeuo pipefail
set +x

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
test_root="$(mktemp -d)"
trap 'rm -rf "$test_root"' EXIT
mkdir -p "$test_root/bin"
cat > "$test_root/bin/rclone" <<'MOCK'
#!/usr/bin/env bash
set -Eeuo pipefail
case "$1" in
  lsf)
    cat "$RCLONE_MOCK_LIST"
    ;;
  deletefile)
    printf '%s\n' "${2#*/weekly/}" >> "$RCLONE_MOCK_DELETED"
    ;;
  *)
    echo "Unexpected mocked rclone command: $*" >&2
    exit 99
    ;;
esac
MOCK
chmod +x "$test_root/bin/rclone"
export PATH="$test_root/bin:$PATH"
export RCLONE_MOCK_LIST="$test_root/files.txt"
export RCLONE_MOCK_DELETED="$test_root/deleted.txt"
: > "$RCLONE_MOCK_DELETED"

# Six valid verified backup sets plus one incomplete object. With four retained,
# two old sets (six files) and the orphan (one file) must be hidden.
for stamp in 20261001T020000Z 20261008T020000Z 20261015T020000Z 20261022T020000Z 20261029T020000Z 20261105T020000Z; do
  archive="CEStudy-${stamp}.dump.enc"
  printf '%s\n%s\n%s\n' "$archive" "$archive.sha256" "$archive.verified" >> "$RCLONE_MOCK_LIST"
done
printf '%s\n' 'CEStudy-20260924T020000Z.dump.enc' >> "$RCLONE_MOCK_LIST"

bash "$script_dir/prune-weekly-backups.sh" "b2:cestudy-db-backups/termux/weekly"

expected_keep=(
  CEStudy-20261015T020000Z.dump.enc
  CEStudy-20261015T020000Z.dump.enc.sha256
  CEStudy-20261015T020000Z.dump.enc.verified
  CEStudy-20261022T020000Z.dump.enc
  CEStudy-20261022T020000Z.dump.enc.sha256
  CEStudy-20261022T020000Z.dump.enc.verified
  CEStudy-20261029T020000Z.dump.enc
  CEStudy-20261029T020000Z.dump.enc.sha256
  CEStudy-20261029T020000Z.dump.enc.verified
  CEStudy-20261105T020000Z.dump.enc
  CEStudy-20261105T020000Z.dump.enc.sha256
  CEStudy-20261105T020000Z.dump.enc.verified
)
for name in "${expected_keep[@]}"; do
  if grep -Fxq "$name" "$RCLONE_MOCK_DELETED"; then
    echo "FAIL: recent verified backup was selected for deletion: $name" >&2
    exit 1
  fi
done
[[ $(wc -l < "$RCLONE_MOCK_DELETED") -eq 7 ]]
for stamp in 20261001T020000Z 20261008T020000Z; do
  for suffix in '' '.sha256' '.verified'; do
    grep -Fxq "CEStudy-${stamp}.dump.enc${suffix}" "$RCLONE_MOCK_DELETED"
  done
done
grep -Fxq 'CEStudy-20260924T020000Z.dump.enc' "$RCLONE_MOCK_DELETED"

# Fail closed when there is no complete verified backup: do not hide anything.
: > "$RCLONE_MOCK_DELETED"
printf '%s\n' 'CEStudy-20261112T020000Z.dump.enc' > "$RCLONE_MOCK_LIST"
if bash "$script_dir/prune-weekly-backups.sh" "b2:cestudy-db-backups/termux/weekly" >/dev/null 2>&1; then
  echo 'FAIL: retention succeeded despite there being no complete verified set.' >&2
  exit 1
fi
if [[ -s "$RCLONE_MOCK_DELETED" ]]; then
  echo 'FAIL: retention deleted files without a verified set.' >&2
  exit 1
fi
echo 'PASS: latest four complete verified sets retained; old and incomplete artifacts hidden; prune fails closed.'
