# PRD — Evolução para Iniciantes (Atlas do Tatame)

**Status**: draft · **Data**: 2026-05-29 · **Dono**: Leonardo
**Objetivo de negócio**: transformar o estado atual num produto **atrativo para o iniciante de
BJJ brasileiro** que quer aprender — reduzir atrito até o primeiro aprendizado e dar senso de
progresso, sustentando o modelo de compra única (free → atlas R$ 19).

## Contexto

App já tem base sólida: grafo `/mapa`, painel de nó, figura, preços, 17 testes. Avaliação de
UX para iniciante = **7.5/10**. Gargalo não é o conteúdo nem a arquitetura — é a **falta de
orientação para quem nunca pisou no tatame**: cai no mapa e não sabe por onde começar nem o que
as cores significam. Ver `CONTEXT.md` e `research/graph-learning-platforms.md` (padrões
adotados: trilha curada sobreposta à exploração livre, hook-first onboarding).

## Métrica norte

**Time-to-first-technique** (tempo até abrir o passo-a-passo da primeira técnica) e
**% de visitantes que aprendem ≥1 técnica**. Hoje: sem instrumentação. Meta: ≥70% chegam a 1
técnica na 1ª sessão.

## Princípios

- Não quebrar a estética "sem PDF de IA" nem a voz de professor de tatame.
- Tudo opcional e dispensável — exploração livre continua intacta (não virar wizard rígido).
- Zero backend novo no MVP: estado de progresso/onboarding em `localStorage`.

## Epics priorizados

### P0 — Orientação imediata (semana 1, baixo risco)
- **E1. Legenda de cores sempre visível** no mapa/sidebar (raspagem=verde, finalização=vermelho,
  perda=ocre, posição=creme). Hoje só aparece na home. → `mapa-sidebar.tsx`.
- **E2. Onboarding "comece aqui"** — no 1º acesso ao `/mapa` (gate `localStorage`), destacar
  Guarda Fechada como ponto de partida + 1 dica: "Toque numa linha colorida para ver a técnica."
  Dispensável, não reaparece. → novo `onboarding-mapa.tsx` + estado em `mapa-explorer.tsx`.

### P1 — Caminho do iniciante (semana 2)
- **E3. Dificuldade por transição** — campo `dificuldade: "iniciante"|"intermediario"|"avancado"`
  em `Transicao` (`src/lib/types.ts`), preenchido no `grafo.ts`. Badge no card
  (`transicao-item.tsx` / `node-expandido.tsx`) e ordenação "mais fácil primeiro".
- **E4. Trilha "Faixa Branca"** — sequência curada de 5-8 técnicas fundamentais sobreposta ao
  mapa (highlight da rota), nav "próxima recomendada". Reusa `localSubgraph`.

### P2 — Senso de progresso & conteúdo (semana 3+)
- **E5. Progresso local** — `src/lib/progress.ts` (localStorage): técnicas vistas, "2/4 raspagens
  aprendidas" na sidebar, check nos cards.
- **E6. Drills só com posições publicadas** — filtrar/ocultar passos "fora do mapa"
  (`drill/[slug]/page.tsx` + `drills.json`) ou fallback de vídeo.
- **E7. Preview de vídeo** nos cards (ícone play + duração via metadata no build).

### P3 — Monetização & retenção (depois do core)
- Integrar checkout (Pix/cartão, compra única) — `/precos` já desenhado, hoje "Em breve".
- Instrumentar métrica norte (analytics leve, sem cookie invasivo).

## Fora de escopo

Passagem de guarda, outras guardas, i18n, editor de poses (Phase 3 do pipeline figura),
pose-from-video agent (já scaffoldado, sprint futuro).

## Verificação

`pnpm test` verde + `pnpm build` ok a cada epic. UX validada rodando `pnpm dev` e percorrendo
o fluxo: home → mapa → primeira técnica como um iniciante.
