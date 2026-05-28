// Generate a Codezal marketplace Ed25519 signing keypair.
//
// Writes the private key (PKCS8, base64) to .keys/codezal-signing.key and the
// public key (raw 32-byte, base64) to .keys/codezal-signing.pub. The .keys/
// directory is gitignored — the PRIVATE KEY MUST NEVER BE COMMITTED.
//
// After running, copy the printed public key into the app's
// src/lib/plugins/signing.ts CODEZAL_SIGNING_PUBKEY constant. Rotating the key
// invalidates every prior signature, so re-sign all manifests afterward.
//
// Usage: node scripts/keygen.mjs [--force]
import { webcrypto } from "node:crypto"
import { mkdir, writeFile, access } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const keysDir = resolve(here, "..", ".keys")
const privPath = resolve(keysDir, "codezal-signing.key")
const pubPath = resolve(keysDir, "codezal-signing.pub")

const b64 = (buf) => Buffer.from(new Uint8Array(buf)).toString("base64")

async function fileExists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function main() {
  const force = process.argv.includes("--force")
  if ((await fileExists(privPath)) && !force) {
    console.error(
      "Refusing to overwrite existing key. Pass --force to regenerate (invalidates all signatures).",
    )
    process.exit(1)
  }
  await mkdir(keysDir, { recursive: true })
  const kp = await webcrypto.subtle.generateKey({ name: "Ed25519" }, true, [
    "sign",
    "verify",
  ])
  const privPkcs8 = await webcrypto.subtle.exportKey("pkcs8", kp.privateKey)
  const pubRaw = await webcrypto.subtle.exportKey("raw", kp.publicKey)
  await writeFile(privPath, b64(privPkcs8) + "\n", { mode: 0o600 })
  await writeFile(pubPath, b64(pubRaw) + "\n")
  console.log("Keypair written to .keys/")
  console.log("Public key (embed in app signing.ts):")
  console.log(b64(pubRaw))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
