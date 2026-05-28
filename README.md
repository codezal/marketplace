# Codezal Marketplace

Codezal uygulamasının resmi eklenti **index/registry** repo'sudur. Plugin binary'leri burada **host edilmez** — sadece metadata + upstream repo'lara SHA-pin referansı tutulur (npm/pypi/homebrew benzeri).

## Yapı

```
index.json            # tüm plugin'lerin master listesi
plugins/<name>.json   # her plugin için per-plugin manifest (source, attribution, permissions…)
plugins-inline/       # opsiyonel: bu repo içinde tutulan plugin'ler (Codezal tarafından yazılanlar)
schemas/              # JSON Schema dosyaları
```

## Channels

- **codezal-curated** — Codezal tarafından doğrulanmış. `verified: true`. Yeşil rozet UI'da.
- **community** — Topluluk submit'i. `verified: false`. Sarı uyarı UI'da, "kendi sorumluluğunda".
- **local** — Kullanıcının kendi disk'indeki plugin (geliştirme amaçlı).

## Plugin Submit Süreci

1. Bu repo'yu fork et.
2. Plugin'i upstream bir GitHub repo'da hazır tut (kendi repo'n veya uyumlu lisanslı public repo).
3. `plugins/<name>.json` oluştur — `source.sha` pin'lenmiş olmalı.
4. `index.json`'a satır ekle (`channel: "community"`).
5. PR aç. Codezal maintainer review eder. Curated için `verified: true` ve daha sıkı denetim.

### Zorunlu alanlar

- `name` (kebab-case)
- `version` (semver)
- `description`
- `license` (SPDX id, örn `Apache-2.0`, `MIT`)
- `author.name`
- `permissions[]` (boş array olabilir)
- `source` (`git-subdir` / `git-repo` / `inline` — `sha` pin)
- `attribution` (upstream kod yeniden paketleniyorsa zorunlu — `originalAuthor`, `originalRepo`, `modified`)

### Lisans uyumluluğu

- Apache-2.0 upstream'den paketleniyorsa LICENSE + NOTICE plugin dizininde olmalı.
- Marka kullanımı YASAK — "Anthropic", "Claude" vb. trademark'lar plugin manifest'inde **sadece attribution metadata alanlarında** geçebilir, plugin adı/branding olarak değil.

## Plugin Source Tipleri

### `git-subdir`
Upstream repo'nun bir alt dizinini plugin olarak kullan. En yaygın.
```json
"source": {
  "type": "git-subdir",
  "repo": "owner/repo",
  "path": "plugins/my-plugin",
  "sha": "<commit-sha>",
  "ref": "main"
}
```

### `git-repo`
Tüm upstream repo plugin'in kendisi.
```json
"source": {
  "type": "git-repo",
  "repo": "owner/repo",
  "sha": "<commit-sha>"
}
```

### `inline`
Bu marketplace repo'sunun içinde yer alan plugin (`plugins-inline/<name>/`).
```json
"source": { "type": "inline", "path": "plugins-inline/my-plugin" }
```

## Güvenlik

- Her plugin manifest'inde `sha` PIN'LIDIR — upstream branch değişse bile kullanıcının yüklediği sürüm sabit kalır.
- Update için `sha` güncellenmeli ve client'lar pull edip "Güncelle" butonuyla yeni sürümü kabul etmeli.
- High-risk permission'lar (`shell.exec`, `mcp.register`, `hooks.register`) install öncesi kullanıcı onay modal'ında kırmızı uyarı tetikler.
