# Web vulnerability patterns

Reference catalog. Used by `security-auditor` and `security-auditor-deep` to anchor pattern recognition. NOT an executable regex set — agents interpret context, not raw matches.

## SQL injection (CWE-89 · A03:2021)

| Stack | Anti-pattern | Safe form |
|-------|-------------|-----------|
| Node (mysql2, pg, sqlite) | `` db.query(`SELECT ... ${x}`) `` | `db.query("SELECT ... ?", [x])` |
| Knex | `knex.raw('... ' + x)` | `knex.raw('... ?', [x])` |
| Prisma | `prisma.$queryRawUnsafe('... ' + x)` | `prisma.$queryRaw\`... ${Prisma.sql([x])}\`` |
| Python (sqlite3, psycopg) | `cursor.execute(f"... {x}")` | `cursor.execute("... %s", (x,))` |
| Django ORM | `Model.objects.raw('... ' + x)` | `Model.objects.raw('... %s', [x])` |
| SQLAlchemy | `session.execute("... " + x)` | `session.execute(text("... :x"), {"x": x})` |
| Ruby ActiveRecord | `User.where("name = '#{x}'")` | `User.where(name: x)` |
| Go database/sql | `db.Query("... " + x)` | `db.Query("... ?", x)` |
| PHP PDO | `$db->query("... $x")` | `$stmt = $db->prepare("... ?"); $stmt->execute([$x]);` |

## Command injection (CWE-78 · A03:2021)

| Stack | Anti-pattern | Safe form |
|-------|-------------|-----------|
| Node | `child_process.exec(`cmd ${x}`)` | `child_process.execFile("cmd", [x])` |
| Python | `os.system(f"cmd {x}")` / `subprocess.run(..., shell=True)` | `subprocess.run(["cmd", x])` |
| Ruby | `` system("cmd #{x}") `` / backticks | `system("cmd", x)` |
| Go | `exec.Command("sh", "-c", "cmd " + x)` | `exec.Command("cmd", x)` |
| PHP | `shell_exec("cmd " . $x)` | `escapeshellarg($x)` + explicit args |

## XSS (CWE-79 · A03:2021)

| Stack | Anti-pattern | Safe form |
|-------|-------------|-----------|
| React | `<div dangerouslySetInnerHTML={{ __html: x }} />` | Render as text, or `DOMPurify.sanitize(x)` first |
| Vue | `<div v-html="x">` | `<div>{{ x }}</div>` or sanitize first |
| Angular | `[innerHTML]="x"` (with `bypassSecurityTrustHtml`) | Avoid bypass; let Angular sanitize |
| Vanilla JS | `el.innerHTML = x` / `document.write(x)` | `el.textContent = x` / `el.append(document.createTextNode(x))` |
| Express | `res.send(htmlWithUserData)` | Template engine with escaping; or sanitize |
| Jinja2 | `{{ x \| safe }}` | `{{ x }}` |
| ERB | `<%= raw x %>` / `x.html_safe` | `<%= x %>` |

## Path traversal (CWE-22 · A01:2021)

Validate target after resolution:

```ts
// Node
const target = path.resolve(uploadsDir, userName)
if (!target.startsWith(uploadsDir + path.sep)) throw new Error("blocked")
```

```python
# Python
target = (uploads_dir / user_name).resolve()
if not str(target).startswith(str(uploads_dir.resolve()) + os.sep):
    raise PermissionError()
```

```go
// Go
target := filepath.Clean(filepath.Join(uploadsDir, userName))
if !strings.HasPrefix(target, uploadsDir+string(os.PathSeparator)) {
    return errors.New("blocked")
}
```

## SSRF (CWE-918 · A10:2021)

Allowlist the host:

```ts
const ALLOWED = new Set(["api.example.com", "cdn.example.com"])
const u = new URL(userUrl)
if (!ALLOWED.has(u.host)) throw new Error("host not allowed")
if (u.protocol !== "https:") throw new Error("https only")
// Also block private ranges: 127.0.0.0/8, 10.0.0.0/8, 169.254.0.0/16, ::1, fc00::/7
```

DNS rebinding: re-resolve and re-check after `fetch` redirects.

## Open redirect (CWE-601 · A01:2021)

```ts
function safeRedirect(target: string): string {
  // Allow only relative paths, or absolute URLs to known hosts
  if (target.startsWith("/") && !target.startsWith("//")) return target
  try {
    const u = new URL(target)
    if (ALLOWED_REDIRECT_HOSTS.has(u.host)) return target
  } catch {}
  return "/"
}
```

## CSRF (CWE-352 · A01:2021)

State-changing endpoints (`POST`, `PUT`, `PATCH`, `DELETE`) need one of:

- `SameSite=Lax` (default for modern browsers) + same-site only flows
- Anti-CSRF token verified per request
- Custom header on `XMLHttpRequest` / `fetch` (e.g. `X-Requested-With`) + CORS preflight

## Auth & session (CWE-287 · A07:2021)

Session cookie hardening:

```ts
res.cookie("sid", token, {
  httpOnly: true,
  secure: true,           // HTTPS only
  sameSite: "lax",
  path: "/",
  maxAge: 1000 * 60 * 60 * 8,
  domain: undefined,      // only this exact host
})
```

JWT:

- Reject `alg: "none"`.
- Pin allowed algorithms: `{ algorithms: ["RS256"] }`.
- Verify `iss`, `aud`, `exp`, `nbf`.
- Never store JWT in `localStorage` for session auth; use `httpOnly` cookies.

## Insecure deserialization (CWE-502 · A08:2021)

- Python: replace `pickle.load` / `yaml.load` with `json.loads` or `yaml.safe_load`.
- Java: avoid `ObjectInputStream`; if unavoidable, validate class names via custom `resolveClass` whitelist.
- Ruby: prefer `JSON.parse`; use `YAML.safe_load` not `YAML.load`.
- PHP: avoid `unserialize` on untrusted; prefer `json_decode`.
- Node: never deserialize functions from user input.
