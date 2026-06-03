// Build the public registry.json from index.json + per-plugin manifests.
//
// registry.json is a single, denormalized catalog the Codezal website fetches
// (one HTTP request, no N+1). It holds only the card-facing fields — never the
// Ed25519 signature or source/install internals. The app does NOT read this
// file; it clones the repo and reads index.json + plugins/*.json directly.
// So registry.json is purely additive: regenerating it cannot affect the app.
//
// Usage:
//   node scripts/build-registry.mjs            # write registry.json
//   node scripts/build-registry.mjs --check    # fail if registry.json is stale (CI)
import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, "..")
const indexPath = resolve(repoRoot, "index.json")
const registryPath = resolve(repoRoot, "registry.json")

// index.json + her manifest'ten kart için gereken alanları çıkar.
// Manifest = source of truth (parse edilen gerçek veri); index entry yalnız pointer.
async function buildRegistry() {
  const index = JSON.parse(await readFile(indexPath, "utf8"))
  if (!Array.isArray(index.plugins)) {
    throw new Error("index.json plugins array eksik")
  }

  const plugins = []
  for (const entry of index.plugins) {
    const manifestPath = resolve(repoRoot, entry.manifestPath)
    const m = JSON.parse(await readFile(manifestPath, "utf8"))
    // Yalnızca vitrin alanları — signature / source / permissions taşınmaz.
    plugins.push({
      name: m.name,
      version: m.version,
      description: m.description,
      channel: m.channel,
      verified: m.verified === true,
      license: m.license,
      author: m.author?.name ?? null,
      ...(m.upstream ? { upstream: m.upstream } : {}),
      ...(Array.isArray(m.tags) && m.tags.length ? { tags: m.tags } : {}),
    })
  }

  // updatedAt = kaynağın (index.json) zamanı — build zamanı DEĞİL. Böylece
  // registry.json yalnız içerik değişince değişir (deterministik diff, CI temiz).
  return {
    version: 1,
    name: index.name ?? "Codezal Marketplace",
    ...(index.description ? { description: index.description } : {}),
    ...(index.updatedAt ? { updatedAt: index.updatedAt } : {}),
    plugins,
  }
}

async function main() {
  const check = process.argv.includes("--check")
  const registry = await buildRegistry()
  const next = JSON.stringify(registry, null, 2) + "\n"

  if (check) {
    // CI: registry.json güncel mi? Değilse fail — committer build:registry unutmuş.
    let current = ""
    try {
      current = await readFile(registryPath, "utf8")
    } catch {
      current = ""
    }
    if (current !== next) {
      console.error("STALE   registry.json — `npm run build:registry` çalıştır + commit et.")
      process.exit(1)
    }
    console.log(`OK      registry.json güncel (${registry.plugins.length} plugin)`)
    return
  }

  await writeFile(registryPath, next, "utf8")
  console.log(`WROTE   registry.json (${registry.plugins.length} plugin)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
