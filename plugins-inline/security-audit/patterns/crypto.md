# Cryptography weakness patterns

Reference catalog for the crypto branch of `security-auditor`.

## Hashing

| Algorithm | Use for | Severity if misused |
|-----------|---------|---------------------|
| MD5 | file/content integrity only | critical when used for passwords / signatures / tokens |
| SHA-1 | legacy compat only | high when used for new signatures / passwords |
| SHA-256 / SHA-512 | content integrity, HMAC base | safe |
| BLAKE2 / BLAKE3 | content integrity, fast | safe |
| bcrypt | password hashing | safe (cost ≥ 12 in 2026) |
| scrypt | password hashing | safe (N ≥ 2^17, r=8, p=1) |
| argon2id | password hashing | safe (m ≥ 64 MiB, t ≥ 3, p ≥ 1) |
| PBKDF2 | password hashing | safe (iterations ≥ 600_000 for SHA-256) |

Detection signals:

- `crypto.createHash("md5")` + `req.body.password` → critical (password storage with MD5)
- `crypto.createHash("md5")` + file-integrity context → info / skip
- `hashlib.sha1(password.encode())` → high
- `Digest::MD5.hexdigest(secret)` → high

## Symmetric encryption

| Cipher | Status |
|--------|--------|
| DES, 3DES | broken — never use |
| RC4 | broken — never use |
| Blowfish | deprecated — avoid for new code |
| AES-128/192/256-CBC | safe with random IV + HMAC (Encrypt-then-MAC) |
| AES-128/192/256-CTR | safe with unique nonce + MAC |
| AES-128/192/256-GCM | preferred — authenticated, unique nonce required |
| ChaCha20-Poly1305 | preferred — authenticated |

Always-bad signals:

- `crypto.createCipher(...)` Node — deprecated, MD5-derived KDF, no IV
- ECB mode anywhere (`AES/ECB/`, `Cipher.ECB`, `"ecb"`)
- Hard-coded IV / nonce / key in source
- IV reuse across messages with the same key (especially GCM / CTR — catastrophic)
- Custom block-cipher modes

Safe pattern (Node):

```ts
const key = crypto.randomBytes(32)              // 256-bit key (store in secret manager, not source)
const iv = crypto.randomBytes(12)               // GCM nonce: 12 bytes, fresh each message
const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()])
const tag = cipher.getAuthTag()
// store iv || ciphertext || tag together; decrypt requires all three
```

## Asymmetric encryption / signatures

| Algorithm | Status |
|-----------|--------|
| RSA-1024 | weak — reject for new keys |
| RSA-2048 | acceptable until ~2030 |
| RSA-3072 / 4096 | safe |
| RSA-PKCS#1 v1.5 padding | avoid for encryption (use OAEP); legacy-OK for signing with SHA-2 |
| RSA-OAEP | safe encryption padding |
| RSA-PSS | safe signature padding |
| ECDSA P-256 / P-384 | safe |
| Ed25519 | preferred for signing |
| X25519 | preferred for ECDH |

Signals:

- RSA key size literal `1024` in `generateKeyPair` / `openssl genrsa` → high
- ECDSA with deterministic-k missing (rare in modern libs, but check custom impls) → high
- DSA at any size → high

## Randomness

For anything security-sensitive (session ids, password reset tokens, IVs, nonces, salts, CSRF tokens, key material):

| Language | DO NOT USE | USE INSTEAD |
|----------|------------|-------------|
| JS / Node | `Math.random()` | `crypto.randomBytes(n)` / `crypto.randomUUID()` |
| Python | `random.*`, `random.Random` | `secrets.token_bytes(n)` / `secrets.token_hex(n)` |
| Ruby | `rand`, `srand` | `SecureRandom.bytes(n)` / `SecureRandom.hex(n)` |
| Go | `math/rand` | `crypto/rand` |
| Rust | `rand::thread_rng` (still good if `SecureRng`) — but prefer | `getrandom` / `rand::rngs::OsRng` |
| Java | `java.util.Random` | `java.security.SecureRandom` |
| PHP | `rand()`, `mt_rand()` | `random_bytes(n)` / `random_int(...)` |

## TLS / certificate validation

Always-bad signals:

- Node: `rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED=0`
- Python: `verify=False` in `requests`, `ssl._create_unverified_context`
- Go: `tls.Config{InsecureSkipVerify: true}`
- Java: `TrustAllCerts`, `HostnameVerifier` returning `true` unconditionally
- Ruby: `OpenSSL::SSL::VERIFY_NONE`
- PHP: `CURLOPT_SSL_VERIFYPEER => false`

For local dev with self-signed certs:

- Add the CA to the OS trust store, or
- Generate a properly-signed dev cert (mkcert, smallstep)

Never ship TLS bypass to production.

## Misuse signals to flag

- Encrypting then sending the key in the same payload
- Reusing a single key across symmetric and HMAC purposes
- Truncating MAC outputs below 16 bytes
- Comparing HMACs / tokens with `==` / `===` / `String.equals` (timing leak) — use constant-time comparison: `crypto.timingSafeEqual`, `hmac.compare_digest`, `subtle.ConstantTimeCompare`
- Storing the encryption key in the same file/repo as the ciphertext
- "Encrypting" by XORing with a static value
- Writing a custom hash / cipher / KDF / PRNG from scratch

## Recommended fixes by category

| Misuse | Fix |
|--------|-----|
| MD5/SHA1 password hash | `argon2id` (server-side) with random salt, then re-prompt user on next login |
| Hard-coded IV | Generate fresh IV per encryption with CSPRNG; prepend to ciphertext |
| `Math.random` for token | Replace with `crypto.randomBytes(32).toString("hex")` |
| `rejectUnauthorized: false` | Remove flag; install proper cert chain |
| ECB mode | Switch to GCM (authenticated) or CBC + HMAC |
| RSA-1024 | Re-generate key at ≥ 2048 (preferably 3072); rotate + revoke old key |
| `bcrypt` cost < 10 | Re-hash on next successful login at cost 12+ |
| Custom crypto | Replace with `libsodium` / `tink` / language-stdlib equivalents |
