---
name: review-deep
description: Derin kod review — multi-agent pipeline + confidence scoring + CLAUDE.md compliance + git history. Mevcut branch'in PR'ı tespit edilir, yoksa local diff'i derin inceler.
---

# /review-deep

Derin / multi-agent review pipeline. `/review` tek-pass + hızlıdır; bu komut
derin, çok-perspektifli, false-positive guard'lı.

Bu komut çağrıldığında modele iletilecek prompt:

```
code-reviewer-deep agent'ını çağır. Argüman: $ARGS (boş olabilir)

Hedef tespit sırası:
1. $ARGS sayıysa → o numaralı GitHub PR (`gh pr view <num>` + `gh pr diff <num>`)
2. $ARGS "branch <base>" formatındaysa → branch diff (`git diff <base>...HEAD`)
3. $ARGS boşsa:
   a. `gh pr view --json number,title,state,isDraft,author` dene → mevcut branch'in PR'ı varsa onu kullan
   b. Yoksa `gh pr list --head $(git branch --show-current) --json number,title` → sonuç varsa kullan
   c. Hala yoksa: local branch diff'i kullan (`git merge-base HEAD origin/main` → ondan HEAD'e diff)
   d. Hiçbiri belirlenemezse kullanıcıya 1 satır sor: "PR numarası veya 'branch <base>' verebilir misin?"

Pipeline (code-reviewer-deep agent yönetir):
- Eligibility: PR closed/draft/automated/zaten-review'lı mı? Evet → durdur.
- Context: kök ve değişen dizinlerin CLAUDE.md yolları (içerik değil, path)
- Summary: değişikliğin 3 satırlık özeti
- Multi-perspective review (paralel):
  · CLAUDE.md compliance
  · Shallow bug scan (sadece diff, scope dışı yok)
  · Git blame + history bağlamı
  · Önceki PR yorumları
  · Kod içi yorumlardaki yönergeler (NOTE/TODO/WARNING)
- Confidence scoring: her bulgu 0-100, <80 filtrelenir
- Final çıktı: kısa, link'li, severity-tagged. Code-reviewer formatına uyumlu
  (path:line + emoji + severity + problem + fix) ama bağlam linkleri ekli.

Eğer PR ise: review'i `gh pr comment <num> --body "..."` ile post etmeyi
kullanıcıya teklif et (otomatik post YAPMA — onay iste). Markdown linkleri
permalink formatında olsun:
  https://github.com/<owner>/<repo>/blob/<full-sha>/<path>#L<start>-L<end>

Local diff ise: terminal output, post yok.

Praise yok. Pre-existing issue'leri rapor etme. Linter/typecheck/test
hatalarını rapor etme (CI'da yakalanır). Scope dışı bulgu yok.
```
