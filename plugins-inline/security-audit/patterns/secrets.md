# Secret patterns

Reference catalog for the secret-detection branch of `security-auditor`. Designed to maximize true positives while minimizing the most common false positives.

## Generic patterns

```
(?i)(api[_-]?key|access[_-]?key|secret[_-]?key|private[_-]?key|client[_-]?secret|token|password|passwd|pwd)\s*[:=]\s*["'][^"']{16,}["']
```

Confidence boosters (raise from medium → high):

- Variable name contains `_KEY`, `_TOKEN`, `_SECRET`, `_PASSWORD`
- Value is base64 / hex with high entropy (Shannon entropy > 4.5 per char)
- Surrounded by env-loader code that bypasses `process.env` / `os.environ`

Confidence reducers (drop to low or skip):

- Value matches `(example|placeholder|your[_-]?(api|key|secret)|xxxx+|<.*>|TODO|TBD|CHANGE[_-]?ME|dummy|fake|mock)`
- File path contains `tests/`, `__tests__/`, `__mocks__/`, `fixtures/`, `examples/`, `docs/`
- Value < 16 chars
- Value is all printable ASCII letters, no digits/symbols (likely a label not a secret)

## Provider-specific signatures

| Provider | Pattern | Notes |
|----------|---------|-------|
| AWS access key | `AKIA[0-9A-Z]{16}` | always high severity |
| AWS secret key | `(?i)aws_secret_access_key\s*[:=]\s*["'][A-Za-z0-9/+=]{40}["']` | |
| AWS session token | starts with `IQoJ`, length > 200 | |
| GitHub PAT (classic) | `ghp_[A-Za-z0-9]{36}` | |
| GitHub PAT (fine-grained) | `github_pat_[A-Za-z0-9_]{82}` | |
| GitHub OAuth | `gho_[A-Za-z0-9]{36}` | |
| GitHub user-to-server | `ghu_[A-Za-z0-9]{36}` | |
| GitHub server-to-server | `ghs_[A-Za-z0-9]{36}` | |
| GitHub refresh token | `ghr_[A-Za-z0-9]{36}` | |
| GitLab PAT | `glpat-[A-Za-z0-9_-]{20,}` | |
| Slack bot | `xoxb-[0-9]+-[0-9]+-[A-Za-z0-9]+` | |
| Slack user | `xoxp-[0-9]+-[0-9]+-[0-9]+-[A-Za-z0-9]+` | |
| Slack webhook | `https://hooks\.slack\.com/services/T[A-Z0-9]+/B[A-Z0-9]+/[A-Za-z0-9]+` | |
| Stripe live | `sk_live_[A-Za-z0-9]{24,}` | always critical |
| Stripe test | `sk_test_[A-Za-z0-9]{24,}` | medium (test key, still leak) |
| Stripe restricted | `rk_live_[A-Za-z0-9]{24,}` | |
| Stripe publishable | `pk_live_[A-Za-z0-9]{24,}` | low (designed to be public) |
| Google API | `AIza[0-9A-Za-z_-]{35}` | |
| Google OAuth | `[0-9]+-[A-Za-z0-9_]{32}\.apps\.googleusercontent\.com` | |
| Google service account | JSON containing `"type":\s*"service_account"` and `"private_key":` | always critical |
| OpenAI | `sk-[A-Za-z0-9]{20,}` (classic) / `sk-proj-[A-Za-z0-9_-]{20,}` (project) | |
| Anthropic | `sk-ant-[A-Za-z0-9_-]{32,}` | |
| Discord bot | `[MN][A-Za-z0-9]{23}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27}` | |
| Twilio | `SK[0-9a-f]{32}` / `AC[0-9a-f]{32}` | |
| SendGrid | `SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}` | |
| Mailgun | `key-[a-z0-9]{32}` | |
| Square | `sq0(atp|csp)-[A-Za-z0-9_-]{22,}` | |
| Heroku | UUID after `heroku` keyword | |
| npm token | `npm_[A-Za-z0-9]{36}` | |
| PyPI token | `pypi-AgEIcHlwaS5vcmc[A-Za-z0-9_-]{50,}` | |
| Cargo token | `cio[A-Za-z0-9]{32}` | |
| HashiCorp Vault | `hvs\.[A-Za-z0-9_-]{20,}` | |
| Datadog | 32-char hex after `DD_API_KEY` / `DD_APP_KEY` | |

## Cryptographic key material

```
-----BEGIN (RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY-----
```

Always critical. Even password-encrypted keys leak the key envelope.

```
-----BEGIN CERTIFICATE-----
```

Generally not a secret (public). Skip unless paired with an adjacent private key block.

## JWT in source

```
eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}
```

Decode the header without verifying. If `alg` is `none`, that's a separate finding (auth bypass). If the JWT is a refresh token or a long-lived access token, severity = critical.

## Database connection strings

```
(postgres|postgresql|mysql|mongodb|redis|amqp|amqps)://[^/\s:@]+:[^@\s]+@[^\s/]+
```

Severity = critical when the password segment is present.

## Common false positives to suppress

- `process.env.X` references (envvar names, not values)
- Bcrypt / PBKDF2 / Argon2 hashes (`$2[ayb]$`, `$argon2id$`) — these are stored intentionally
- Public keys (`ssh-rsa AAAA...`, `-----BEGIN PUBLIC KEY-----`)
- Test fixtures with `TEST_` / `DUMMY_` / `FAKE_` prefix
- Documentation showing the *shape* of a token (matches with `your-api-key-here` style)
- Lockfile integrity hashes (`sha512-...` in `package-lock.json`, `yarn.lock`)
- Git commit SHAs (40-char hex on a `commit` / `parent` / `tree` line)

## Recommended remediation

Standard fix is two-step:

1. **Rotate** the credential at the provider (this is irreversible — leaked = compromised).
2. **Remove from history** with `git filter-repo --invert-paths --path <file>` or BFG Repo-Cleaner. `git rm` alone leaves the value in history.

Then move the value into a secret manager (Vault, AWS Secrets Manager, Doppler, 1Password CLI, sops-encrypted file) and inject via env at runtime.

Mention this remediation chain in the finding fix line. Do not echo the secret value — use `<redacted, N chars, starts with X>`.
