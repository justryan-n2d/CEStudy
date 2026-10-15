#!/usr/bin/env bash
set -Eeuo pipefail
set +x

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
test_root="$(mktemp -d)"
trap 'rm -rf "$test_root"' EXIT
umask 077

openssl req -x509 -newkey rsa:3072 -sha256 \
  -keyout "$test_root/private-key.pem" \
  -out "$test_root/public-cert.pem" \
  -days 1 -nodes -subj '/CN=CEStudy encryption test' >/dev/null 2>&1
printf 'CEStudy encryption regression test: private table data 12345\n' > "$test_root/plain.dump"

python3 "$repo_root/scripts/encrypt-db-backup.py" encrypt \
  --certificate "$test_root/public-cert.pem" \
  --input "$test_root/plain.dump" \
  --output "$test_root/backup.dump.enc"

if grep -aFq 'private table data 12345' "$test_root/backup.dump.enc"; then
  echo 'FAIL: encrypted output contains the test plaintext.' >&2
  exit 1
fi

python3 "$repo_root/scripts/encrypt-db-backup.py" decrypt \
  --identity "$test_root/private-key.pem" \
  --input "$test_root/backup.dump.enc" \
  --output "$test_root/restored.dump"

cmp "$test_root/plain.dump" "$test_root/restored.dump"

# Corrupt the authentication tag and require decryption to fail without leaving
# a plaintext output file behind.
cp "$test_root/backup.dump.enc" "$test_root/corrupt.dump.enc"
python3 - "$test_root/corrupt.dump.enc" <<'PY'
import pathlib, sys
p = pathlib.Path(sys.argv[1])
data = bytearray(p.read_bytes())
data[-1] ^= 0x01
p.write_bytes(data)
PY
if python3 "$repo_root/scripts/encrypt-db-backup.py" decrypt \
  --identity "$test_root/private-key.pem" \
  --input "$test_root/corrupt.dump.enc" \
  --output "$test_root/corrupt-restored.dump"; then
  echo 'FAIL: decryption accepted a corrupted authentication tag.' >&2
  exit 1
fi
if [[ -e "$test_root/corrupt-restored.dump" ]]; then
  echo 'FAIL: failed authenticated decryption left a plaintext output file.' >&2
  exit 1
fi

echo 'PASS: RSA-OAEP/AES-256-GCM encrypt/decrypt and tamper rejection.'
