# GAN Harness Build Report

**Brief:** "tudo" — polir as 3 superfícies (landing, mapa, preços) pra qualidade de lançamento.
**Goal override:** "iterar até score 10".
**Result:** ✅ PASS — **10.0 / 10**
**Iterations:** 4
**Eval mode:** code-only (Playwright não instalado)

## Score Progression

| Iter | Design (.30) | Originality (.20) | Craft (.30) | Functionality (.20) | Total |
|------|------|------|------|------|------|
| 1 | 8 | 8 | 7 | 9 | **7.9** |
| 2 | 9 | 9 | 8 | 9 | **8.7** |
| 3 | 10 | 9 | 9 | 9 | **9.3** |
| 4 | 10 | 10 | 10 | 10 | **10.0** |

7.9 → 8.7 → 9.3 → **10.0**

## Por iteração (commits)

- **iter 1 (5b87d4c)** — conversão/clareza: âncora de preço no hero, beat "sem PDF de IA", CTA de fechamento, onboarding ciente de mobile, "passo X de N" na trilha, placeholder honesto na lona, reversão de risco em /precos.
- **iter 2 (9de4159)** — craft/correção: a11y `inert` no drawer, `role=dialog→note`, tokens `--step-*`, removido número inventado "200 técnicas", `Plano` discriminated union, `useIsMobile()`.
- **iter 3 (2fde998)** — glifo ☰ → ícone real, emoji 👆 removido, escala `--step-*` completa (display+corpo), `nav aria-label`, voz de professor na landing, OG palette nomeada/mapeada aos tokens.
- **iter 4 (1413f21)** — beat concorrente/Atlas assimétrico (Atlas lidera, concorrente vira aside riscado), 2º eco da cadência de professor, **toggle de índice persistente** (1 hamburger, `aria-expanded` real, label Abrir/Fechar, ícone ☰↔X, z-40), wording do hint alinhado ao controle, anti-stack MapHint×Onboarding.

## Gate final — PASS

- `pnpm test`: 18 arquivos, **149 passando**.
- `pnpm build` (após `rm -rf .next`): **EXIT 0**, **313 páginas SSG**.
- Runtime prod: todas as rotas testadas retornam **200** (`/`, `/mapa`, `/precos`, `/posicao`, `/drill`, `/instrutor`, `/opengraph-image`, `/sitemap.xml`, `/robots.txt`).
- Zero hex novo nos arquivos de app/componente (constante `OG` é a exceção documentada); sem secrets; pt-BR; `isPublicada` honrado.
- ⚠️ Flake: `.next` stale dá `ENOTEMPTY` (resíduo de `next start`/watcher) — `pkill -f next; rm -rf .next` antes de buildar.

## Remaining
Nenhum defeito dedutível no escopo. Notas fora do rubric (tamanhos ad-hoc no header/footer globais) deixadas intactas de propósito.

## Files
- gan-harness/spec.md, eval-rubric.md, generator-state.md
- gan-harness/feedback/feedback-001.md … feedback-004.md
- gan-harness/build-report.md (este)
