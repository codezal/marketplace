// Sign a marketplace plugin manifest with the Codezal Ed25519 private key.
//
// Reads the private key from .keys/codezal-signing.key, computes the canonical
// form of the manifest (excluding any existing `signature`), signs it, and
// writes the base64 signature back into the manifest's `signature` field.
//
// Only curated + verified manifests need signing; the app enforces signature
// verification for the codezal-curated channel.
//
// Usage:
//   node scripts/sign-plugin.mjs plugins/code-reviewer.json
//   node scripts/sign-plugin.mjs --all          # sign every curated manifest
import { webcrypto } from "node:crypto"
import { readFile, writeFile, readdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, resolve, join } from "node:path"
import { canonicalManifest } from "./lib/canonical.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, "..")
const privPath = resolve(repoRoot, ".keys", "codezal-signing.key")

async function loadPrivateKey() {
  let b64
  try {
    b64 = (await readFile(privPath, "utf8")).trim()
  } catch {
    console.error(
      "Private key not found at .keys/codezal-signing.key. Run: node scripts/keygen.mjs",
    )
    process.exit(1)
  }
  const pkcs8 = Buffer.from(b64, "base64")
  return webcrypto.subtle.importKey("pkcs8", pkcs8, { name: "Ed25519" }, false, [
    "sign",
  ])
}

async function signOne(key, manifestPath) {
  const raw = await readFile(manifestPath, "utf8")
  const manifest = JSON.parse(raw)
  const canonical = canonicalManifest(manifest)
  const data = new TextEncoder().encode(canonical)
  const sig = await webcrypto.subtle.sign({ name: "Ed25519" }, key, data)
  manifest.signature = Buffer.from(new Uint8Array(sig)).toString("base64")
  // Pretty-print with trailing newline to match repo style.
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
  console.log(`signed: ${manifestPath}`)
}

async function curatedManifests() {
  const dir = resolve(repoRoot, "plugins")
  const files = await readdir(dir)
  const out = []
  for (const f of files) {
    if (!f.endsWith(".json")) continue
    const p = join(dir, f)
    const m = JSON.parse(await readFile(p, "utf8"))
    if (m.channel === "codezal-curated" && m.verified) out.push(p)
  }
  return out
}

async function main() {
  const args = process.argv.slice(2)
  const key = await loadPrivateKey()
  let targets
  if (args.includes("--all")) {
    targets = await curatedManifests()
  } else if (args.length > 0) {
    targets = args.map((a) => resolve(repoRoot, a))
  } else {
    console.error("Usage: node scripts/sign-plugin.mjs <manifest.json | --all>")
    process.exit(1)
  }
  for (const t of targets) await signOne(key, t)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
