// Verify a marketplace plugin manifest's Ed25519 signature against the public
// key in .keys/codezal-signing.pub. Mirrors the app's verification path so you
// can confirm a manifest will install before pushing.
//
// Usage:
//   node scripts/verify-plugin.mjs plugins/code-reviewer.json
//   node scripts/verify-plugin.mjs --all
import { webcrypto } from "node:crypto"
import { readFile, readdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, resolve, join } from "node:path"
import { canonicalManifest } from "./lib/canonical.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, "..")
const pubPath = resolve(repoRoot, ".keys", "codezal-signing.pub")

async function loadPublicKey() {
  const b64 = (await readFile(pubPath, "utf8")).trim()
  const raw = Buffer.from(b64, "base64")
  return webcrypto.subtle.importKey("raw", raw, { name: "Ed25519" }, false, [
    "verify",
  ])
}

async function verifyOne(key, manifestPath) {
  // Tek dosyadaki hata (bozuk JSON, geçersiz imza vb.) tüm --all batch'ini
  // öldürmesin; hatayı raporla ve false dönerek devam et.
  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"))
    if (!manifest.signature) {
      console.log(`MISSING  ${manifestPath}`)
      return false
    }
    const data = new TextEncoder().encode(canonicalManifest(manifest))
    const sig = Buffer.from(manifest.signature, "base64")
    const ok = await webcrypto.subtle.verify({ name: "Ed25519" }, key, sig, data)
    console.log(`${ok ? "VALID   " : "INVALID "} ${manifestPath}`)
    return ok
  } catch (e) {
    console.log(`ERROR    ${manifestPath} (${e.message})`)
    return false
  }
}

async function curatedManifests() {
  const dir = resolve(repoRoot, "plugins")
  const files = await readdir(dir)
  const out = []
  for (const f of files) {
    if (f.endsWith(".json")) out.push(join(dir, f))
  }
  return out
}

async function main() {
  const args = process.argv.slice(2)
  const key = await loadPublicKey()
  const targets = args.includes("--all")
    ? await curatedManifests()
    : args.map((a) => resolve(repoRoot, a))
  if (targets.length === 0) {
    console.error("Usage: node scripts/verify-plugin.mjs <manifest.json | --all>")
    process.exit(1)
  }
  let allOk = true
  for (const t of targets) {
    const ok = await verifyOne(key, t)
    if (!ok) allOk = false
  }
  process.exit(allOk ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
