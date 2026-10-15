#!/usr/bin/env python3
"""Encrypt/decrypt CEStudy PostgreSQL dumps with RSA-OAEP + AES-256-GCM.

The format is intentionally small and versioned:
  8-byte magic | 2-byte wrapped-key length | 12-byte nonce | wrapped AES key
  | AES-GCM ciphertext | 16-byte GCM authentication tag

The complete header is authenticated as GCM additional data. The public
certificate can encrypt but cannot decrypt. The private RSA key never belongs
in GitHub Actions.
"""
from __future__ import annotations

import argparse
import getpass
import os
import struct
import sys
from pathlib import Path

from cryptography import x509
from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

MAGIC = b"CESTUDY1"
NONCE_BYTES = 12
TAG_BYTES = 16
CHUNK_BYTES = 1024 * 1024
OAEP_PADDING = padding.OAEP(
    mgf=padding.MGF1(algorithm=hashes.SHA256()),
    algorithm=hashes.SHA256(),
    label=None,
)


def ensure_distinct_paths(source: Path, target: Path) -> None:
    if source.resolve() == target.resolve():
        raise ValueError("Input and output paths must be different.")
    if target.exists():
        raise FileExistsError(f"Refusing to overwrite existing output file: {target}")


def encrypt_file(certificate_path: Path, input_path: Path, output_path: Path) -> None:
    ensure_distinct_paths(input_path, output_path)
    cert = x509.load_pem_x509_certificate(certificate_path.read_bytes())
    public_key = cert.public_key()
    if not isinstance(public_key, rsa.RSAPublicKey) or public_key.key_size < 3072:
        raise ValueError("Certificate must contain an RSA public key of at least 3072 bits.")

    aes_key = os.urandom(32)
    nonce = os.urandom(NONCE_BYTES)
    wrapped_key = public_key.encrypt(aes_key, OAEP_PADDING)
    header = MAGIC + struct.pack(">H", len(wrapped_key)) + nonce + wrapped_key

    encryptor = Cipher(algorithms.AES(aes_key), modes.GCM(nonce)).encryptor()
    encryptor.authenticate_additional_data(header)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        with input_path.open("rb") as source, output_path.open("xb") as target:
            target.write(header)
            while True:
                chunk = source.read(CHUNK_BYTES)
                if not chunk:
                    break
                target.write(encryptor.update(chunk))
            target.write(encryptor.finalize())
            target.write(encryptor.tag)
            target.flush()
            os.fsync(target.fileno())
        output_path.chmod(0o600)
    except Exception:
        output_path.unlink(missing_ok=True)
        raise


def load_private_key(identity_path: Path):
    pem = identity_path.read_bytes()
    try:
        return serialization.load_pem_private_key(pem, password=None)
    except TypeError:
        passphrase = getpass.getpass("Private key passphrase: ").encode("utf-8")
        return serialization.load_pem_private_key(pem, password=passphrase)


def decrypt_file(identity_path: Path, input_path: Path, output_path: Path) -> None:
    ensure_distinct_paths(input_path, output_path)
    private_key = load_private_key(identity_path)
    if not isinstance(private_key, rsa.RSAPrivateKey) or private_key.key_size < 3072:
        raise ValueError("Private key must be RSA with at least 3072 bits.")

    total_size = input_path.stat().st_size
    with input_path.open("rb") as source:
        magic = source.read(len(MAGIC))
        if magic != MAGIC:
            raise ValueError("Not a recognized CEStudy encrypted backup.")
        length_bytes = source.read(2)
        if len(length_bytes) != 2:
            raise ValueError("Encrypted backup header is incomplete.")
        wrapped_len = struct.unpack(">H", length_bytes)[0]
        if wrapped_len < 256 or wrapped_len > 8192:
            raise ValueError("Encrypted backup has an invalid wrapped-key length.")
        nonce = source.read(NONCE_BYTES)
        wrapped_key = source.read(wrapped_len)
        header = MAGIC + length_bytes + nonce + wrapped_key
        if len(nonce) != NONCE_BYTES or len(wrapped_key) != wrapped_len:
            raise ValueError("Encrypted backup header is incomplete.")
        header_len = len(header)
        ciphertext_len = total_size - header_len - TAG_BYTES
        if ciphertext_len < 0:
            raise ValueError("Encrypted backup is truncated.")
        source.seek(-TAG_BYTES, os.SEEK_END)
        tag = source.read(TAG_BYTES)
        if len(tag) != TAG_BYTES:
            raise ValueError("Encrypted backup authentication tag is missing.")
        source.seek(header_len)

        aes_key = private_key.decrypt(wrapped_key, OAEP_PADDING)
        decryptor = Cipher(algorithms.AES(aes_key), modes.GCM(nonce, tag)).decryptor()
        decryptor.authenticate_additional_data(header)

        output_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            with output_path.open("xb") as target:
                remaining = ciphertext_len
                while remaining:
                    chunk = source.read(min(CHUNK_BYTES, remaining))
                    if not chunk:
                        raise ValueError("Encrypted backup ended unexpectedly.")
                    remaining -= len(chunk)
                    target.write(decryptor.update(chunk))
                # Do not treat plaintext as valid unless GCM authentication passes.
                target.write(decryptor.finalize())
                target.flush()
                os.fsync(target.fileno())
            output_path.chmod(0o600)
        except Exception:
            output_path.unlink(missing_ok=True)
            raise


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="action", required=True)

    encrypt_parser = subparsers.add_parser("encrypt", help="Encrypt a dump to a public certificate")
    encrypt_parser.add_argument("--certificate", type=Path, required=True)
    encrypt_parser.add_argument("--input", type=Path, required=True)
    encrypt_parser.add_argument("--output", type=Path, required=True)

    decrypt_parser = subparsers.add_parser("decrypt", help="Decrypt a backup with the private key")
    decrypt_parser.add_argument("--identity", type=Path, required=True)
    decrypt_parser.add_argument("--input", type=Path, required=True)
    decrypt_parser.add_argument("--output", type=Path, required=True)

    args = parser.parse_args()
    try:
        if args.action == "encrypt":
            encrypt_file(args.certificate, args.input, args.output)
            print("Encrypted backup created.")
        else:
            decrypt_file(args.identity, args.input, args.output)
            print("Decryption and AES-GCM authentication succeeded.")
        return 0
    except (OSError, ValueError, TypeError, InvalidTag) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
