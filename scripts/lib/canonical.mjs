// Canonical manifest serialization — MUST match the app's
// src/lib/plugins/signing.ts canonicalManifest() byte-for-byte.
//
// Rules:
// - object keys sorted lexicographically, recursively
// - top-level `signature` field excluded
// - arrays keep order
// - no insignificant whitespace (JSON.stringify default)

function sortValue(v) {
  if (Array.isArray(v)) return v.map(sortValue)
  if (v && typeof v === "object") {
    const out = {}
    for (const k of Object.keys(v).sort()) out[k] = sortValue(v[k])
    return out
  }
  return v
}

export function canonicalManifest(manifest) {
  const clone = { ...manifest }
  delete clone.signature
  return JSON.stringify(sortValue(clone))
}
