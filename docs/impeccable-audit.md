# Impeccable — Crítica + Audit Completo (Atlas Jiu-Jitsu)

**Data:** 2026-05-29 · **Contexto:** `.impeccable.md` (atlas do tatame; preciso/fincado/confiante;
papel-claro + grafo na lona; clay; cor=significado). **Método:** crítica de design (dimensões
impeccable) + audit funcional por rota + telas reais (localhost:3000) + leitura de código.

## Veredito

Produto **forte e coeso** — voz de professor, paleta clay/lona fora do clichê de IA, grafo como
herói. Passa no "AI slop test" (não parece gerado). GAN-build levou as 3 superfícies a 10/10 de
design. Os problemas restantes são **funcionais/de borda** e **responsivos**, não estéticos.

## Scorecard (0–10, dimensões impeccable)

| Dimensão | Nota | Nota |
|---|---|---|
| Typography | 9 | Bricolage+Hanken, escala modular `--step-*` single-source. |
| Color & Theme | 9 | OKLCH, neutros tingidos, clay raro, cor funcional. Sem AI-palette. |
| Layout & Space | 8 | `--space-*` 4pt; landing assimétrica boa; falta auditar ritmo mobile. |
| Motion | 8 | lamina/cascata com ease-out + guard reduced-motion. |
| Interaction | 7 | onboarding/legenda/trilha bons; faltam estados de erro/empty em bordas. |
| AI-slop test | 10 | sem gradiente-texto, sem border-stripe, sem neon. |

## Bugs encontrados nesta sessão

| # | Sev | Item | Status |
|---|---|---|---|
| B1 | P0 | CSS não carregava (Turbopack 500): docs `gan-harness/*.md` com `var(--step-*)` viravam classe → CSS inválido. Fix: `@import "tailwindcss" source("../")`. | ✅ corrigido |
| B2 | P0 | Cabeça descolada do corpo nas figuras 3D animadas: `lerpFighter` reordenava chaves; renderer casava juntas por índice. Fix: preservar ordem + teste. | ✅ corrigido |
| B3 | P1 | Navbar sem highlight da seção ativa. Fix: `usePathname` + estado ativo (sublinhado clay / botão contorno). | ✅ corrigido |
| B4 | P1 | Drill com passos "fora do mapa" (ex: clamp guard) → sem dados 3D → canvas vazio sem explicação. | ⏳ aberto |

## Audit funcional por rota

- **/** home — hero/contraste/CTA sólidos. Verificar: fallback da figura quando still falha; ritmo de seções no mobile.
- **/mapa** — herói; legenda+trilha+onboarding+toggle ok. Verificar: foco/teclado nas arestas; densidade em telas <360px.
- **/precos** — planos claros, checkout MP via env, reversão de risco. Botão "Abre no lançamento" honesto.
- **/posicao/[slug]** — still + princípios + saídas (com badge de dificuldade + ordenação). OK.
- **/drill/[slug]** — **B4**: passos fora-do-mapa quebram a experiência 3D + lista.
- **/instrutor/[slug]** — referência (syllabus). Baixa prioridade GTM.
- internas (/prototipo, /visualizador, /studio) — fora do índice (robots).

## Fixes a executar (escopo do workflow ECC)

**P0/P1 (rodar agora):**
1. **B4 — drills fora-do-mapa**: na `DrillPlayer`/`drill/[slug]`, detectar passos sem pose 3D (`temPose3D`) e: (a) marcar claramente o passo como "fora do mapa — sem figura ainda" e (b) garantir que o player 3D só anima entre passos COM dados, sem canvas vazio mudo. Nunca um void sem texto.
2. **A11y sweep global**: heading hierarchy (1 h1/página), landmarks (`main` já no layout; checar `header/nav` rotulados), foco visível não-clipado, nomes acessíveis em todos os controles (player de drill, viewer, setas).
3. **Responsivo**: auditar /mapa e /precos em ≤360px e ~768px — densidade do grafo, cards de preço, drawer. Adaptar, não amputar.
4. **Figura — robustez**: fallback honesto quando pose/trans 3D falha ao carregar (placeholder, não canvas vazio); confirmar B2 em várias transições.

**P2 (depois):** preview de vídeo nos cards (E7); progresso localStorage (E5); copy microajustes.

## Não-regredir
149→150 testes verdes · `pnpm build` exit 0 (sempre `rm -rf .next` antes) · zero hex novo fora do `OG` documentado · pt-BR · `isPublicada` honrado · tokens `--step-*`/`--space-*`.
