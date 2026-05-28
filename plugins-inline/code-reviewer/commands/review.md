---
name: review
description: Kod review başlat. Argümansız → mevcut diff. Arg "branch <base>" → branch diff. Arg "<PR#>" → GitHub PR. Arg "<file>" → tek dosya.
---

# /review

Kod review agent'ını çağırır.

Bu komut çağrıldığında modele iletilecek prompt:

```
code-reviewer agent'ını çağır. Hedef: $ARGS

Hedef boşsa: mevcut çalışma ağacındaki diff'i review et (`git diff` ve `git diff --staged`).
"branch <base>" formatındaysa: `git diff <base>...HEAD` review et.
Sadece sayıysa (PR numarası): `gh pr view <num>` + `gh pr diff <num>` üzerinden review et.
Dosya yolu ise: o dosyanın TAMAMINI review et (diff yok).

code-reviewer agent'ının formatına sadık kal: path:line satırları + sondaki rollup.
Praise / scope-creep / refactor önerisi yok.
```
