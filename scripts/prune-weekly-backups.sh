#!/usr/bin/env bash
set -Eeuo pipefail
set +x

if [[ $# -ne 1 || -z "${1:-}" ]]; then
  echo "Usage: $0 <rclone-remote-directory>" >&2
  exit 2
fi

remote_dir="$1"
command -v rclone >/dev/null 2>&1 || {
  echo "ERROR: rclone is required." >&2
  exit 2
}

listing_file="$(mktemp)"
trap 'rm -f "$listing_file"' EXIT
rclone lsf --files-only "$remote_dir" > "$listing_file"

mapfile -t names < "$listing_file"
declare -A present=()
for name in "${names[@]}"; do
  [[ -n "$name" ]] && present["$name"]=1
done

# A backup counts as verified only if its marker and both payload files exist.
# Timestamps are UTC and fixed-width, so reverse lexical order is newest first.
mapfile -t markers < <(
  grep -E '^CEStudy-[0-9]{8}T[0-9]{6}Z\.dump\.age\.verified$' "$listing_file" \
    | LC_ALL=C sort -r || true
)
valid_markers=()
for marker in "${markers[@]}"; do
  archive="${marker%.verified}"
  checksum="${archive}.sha256"
  if [[ -n "${present[$archive]+yes}" && -n "${present[$checksum]+yes}" ]]; then
    valid_markers+=("$marker")
  fi
done

if [[ ${#valid_markers[@]} -eq 0 ]]; then
  echo "ERROR: No complete verified backup set found; refusing to prune remote files." >&2
  exit 1
fi

declare -A keep=()
keep_count=0
for marker in "${valid_markers[@]}"; do
  archive="${marker%.verified}"
  checksum="${archive}.sha256"
  if [[ $keep_count -lt 4 ]]; then
    keep["$archive"]=1
    keep["$checksum"]=1
    keep["$marker"]=1
    keep_count=$((keep_count + 1))
  fi
done

# Hide all our stale or incomplete backup artifacts only after a new verified
# backup has been uploaded. A B2 lifecycle rule removes hidden versions later.
deleted_count=0
for name in "${names[@]}"; do
  if [[ "$name" =~ ^CEStudy-[0-9]{8}T[0-9]{6}Z\.dump\.age(\.sha256|\.verified)?$ ]] \
     && [[ -z "${keep[$name]+yes}" ]]; then
    rclone deletefile "${remote_dir%/}/$name"
    deleted_count=$((deleted_count + 1))
  fi
done

echo "Retention complete: kept $keep_count verified backup(s); hid $deleted_count stale or incomplete artifact(s)."
