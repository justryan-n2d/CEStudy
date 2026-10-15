#!/usr/bin/env bash
set -Eeuo pipefail
set +x

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
test_root="$(mktemp -d)"
trap 'rm -rf "$test_root"' EXIT
umask 077

# Exercise the same password-protected private-key format that the maintainer
# will create on Termux. This passphrase is test-only and used in an isolated
# temporary directory.
openssl req -x509 -newkey rsa:3072 -sha256 \
  -keyout "$test_root/private-key.pem" \
  -out "$test_root/public-cert.pem" \
  -days 1 -passout pass:test-passphrase \
  -subj '/CN=CEStudy encryption test' >/dev/null 2>&1
printf 'CEStudy encryption regression test: private table data 12345\n' > "$test_root/plain.dump"

python3 "$repo_root/scripts/encrypt-db-backup.py" encrypt \
  --certificate "$test_root/public-cert.pem" \
  --input "$test_root/plain.dump" \
  --output "$test_root/backup.dump.enc"

if grep -aFq 'private table data 12345' "$test_root/backup.dump.enc"; then
  echo 'FAIL: encrypted output contains the test plaintext.' >&2
  exit 1
fi

decrypt_with_test_key() {
  python3 - "$repo_root/scripts/encrypt-db-backup.py" "$test_root/private-key.pem" "$1" "$2" <<'PY'
import importlib.util
import pathlib
import sys

module_path, identity, encrypted, output = sys.argv[1:]
spec = importlib.util.spec_from_file_location("cestudy_encrypt", module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.getpass.getpass = lambda _prompt: "test-passphrase"
module.decrypt_file(pathlib.Path(identity), pathlib.Path(encrypted), pathlib.Path(output))
PY
}

decrypt_with_test_key "$test_root/backup.dump.enc" "$test_root/restored.dump"
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
if decrypt_with_test_key "$test_root/corrupt.dump.enc" "$test_root/corrupt-restored.dump"; then
  echo 'FAIL: decryption accepted a corrupted authentication tag.' >&2
  exit 1
fi
if [[ -e "$test_root/corrupt-restored.dump" ]]; then
  echo 'FAIL: failed authenticated decryption left a plaintext output file.' >&2
  exit 1
fi

echo 'PASS: RSA-OAEP/AES-256-GCM encrypt/decrypt with password-protected key and tamper rejection.'
