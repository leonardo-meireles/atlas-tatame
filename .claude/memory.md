# Project Memory — webapp-jiu

Durable decisions and state. Update as the project evolves. Complements `CONTEXT.md`
(produto/glossário) and `research/` (investigações). This file = decisões vivas + estado.

## Decisões travadas

- **Produto**: Atlas do Tatame — grafo explorável de BJJ, pt-BR, MVP = guarda fechada.
  Antítese do "PDF de IA".
- **Monetização**: compra única barata (R$ 19 atlas completo / R$ 12 trilha avulsa),
  **sem assinatura**. Free tier = guarda fechada inteira. Pagamento ainda não integrado.
- **Figura**: portar GrappleMap (domínio público) pra TS, não forkar C++. Estilo travado
  = **C (serigrafia/riso, dois tons)** após protótipo em `/prototipo`. Render pré-gerado
  (PNG/SVG no build) + R3F ao vivo só no nó expandido (híbrido).
- **Dados**: `src/content/grafo.ts` é curado à mão (fonte da verdade); `*.generated.ts`
  vêm do parser — não editar à mão. `isPublicada()` controla o que aparece na UI.

## Estado atual (avaliado em 2026-05-29)

- Beginner-UX ≈ 7.5/10. Core sólido (mapa + painel + figura + 17 testes).
- Pagamento "Em breve" — sem checkout ativo.

## Gaps de iniciante priorizados (backlog — ver `docs/prd/`)

1. ~~**Onboarding "comece aqui"**~~ — ✅ FEITO (`onboarding-mapa.tsx`, gate localStorage).
2. ~~**Legenda de cores**~~ — ✅ FEITO (bloco "As cores das linhas" em `mapa-sidebar.tsx`).
3. ~~**Dificuldade / "aprenda primeiro"**~~ — ✅ FEITO. Campo `dificuldade` em `Transicao`
   (`types.ts`), helper `src/lib/dificuldade.ts` (`ordenarPorDificuldade`), `DificuldadeBadge`
   (`badges.tsx`), badge + sort "mais fácil primeiro" em `transicao-item.tsx`. 7 transições da
   guarda fechada classificadas em `grafo.ts`. Teste: `dificuldade.test.ts`.
4. **Progresso** (localStorage: técnicas vistas, "2/4 raspagens"). (P1)
5. **Drills "fora do mapa"** — passos apontam pra posições não publicadas. (P2)
6. **Preview de vídeo** nos cards (ícone play + duração). (P2)

## E4 — Trilha Faixa Branca (✅ versão GTM-mínima)

`src/content/trilhas.ts` (`TRILHA_FAIXA_BRANCA`, `passosValidos`) +
`src/components/trilha-faixa-branca.tsx` no topo do índice (`mapa-sidebar.tsx`). Lista numerada
de 7 fundamentos, clique navega. Sem route-highlight no grafo nem progresso (cortados pra GTM).

## Decisão de escopo: GTM primeiro (2026-05-29)

Parar de expandir features de iniciante. Free tier já é usável e bom. Foco no MÍNIMO pra lançar:
shareability (OG/meta), measurement (analytics), deploy, captura de interesse pro pago.
**Cortados até pós-launch**: E5 progresso, E6 drills fora-do-mapa, E7 preview vídeo, checkout.

### Decisões GTM (do usuário)
- Checkout **primeiro** (não waitlist) · deploy **Vercel** · analytics **pulado** por ora.
- Gateway = **Mercado Pago payment links** (Pix+cartão, compra única, zero backend/secret).

### Feito no pass GTM (✅)
- Metadata `openGraph`/`twitter` + `metadataBase` (`layout.tsx`).
- OG image dinâmica `src/app/opengraph-image.tsx` (next/og).
- SEO: `src/app/sitemap.ts` + `src/app/robots.ts`.
- `/precos`: botões → `NEXT_PUBLIC_MP_LINK_ATLAS`/`_TRILHA` (fallback "Em breve").
- `.env.example` + `docs/launch-gtm.md` (passos MP + Vercel).

### Pendente manual (usuário) — ver `docs/launch-gtm.md`
- Criar 2 links de pagamento no Mercado Pago + setar envs.
- `vercel` deploy + envs no painel + domínio + submeter sitemap no GSC.
- Fulfillment do pago é manual (sem gating/auth ainda; `acesso:"paid"` é só visual).
  Upgrade futuro: SDK mercadopago + `/api/checkout` + webhook + entitlement.

## GAN-build (2026-05-29) — polish 3 superfícies → 8.7/10

`/ecc:gan-build` rodado (brief "tudo", code-only, threshold 7.0). 2 iterações: 7.9 → 8.7,
parou por diminishing returns. Ganhos: conversão na landing/preços, a11y (`inert` no drawer,
`role=note`, hamburger `aria-controls`), tokens `--step-*`, removido número inventado
("200 técnicas"). Novo `src/lib/use-is-mobile.ts`. Artefatos em `gan-harness/`.
**Flake**: sempre `rm -rf .next` antes de `pnpm build` (ENOTEMPTY com cache stale).

## ⚠️ Gotcha Tailwind v4 — scan de conteúdo (resolvido 2026-05-29)

Sintoma: `pnpm dev` (Turbopack) dava **500 + página sem estilo**; `globals.css:1250 Parsing CSS
failed — Unexpected token Delim('*')`. Prod (`next build`) tolerava.
Causa: Tailwind v4 auto-escaneia TODO o projeto (incl. `.md`). Docs em `gan-harness/*.md` e
`.claude/memory.md` mencionavam `text-[length:var(--step-*)]` como exemplo → Tailwind gerou
`font-size: var(--step-*)` (CSS inválido) → Turbopack quebra.
Fix: `@import "tailwindcss" source("../");` em `globals.css` — escopa o scan só a `src/`.
Regra: não escrever nomes de classe Tailwind literais (`text-[...]`, `var(--token-*)`) em docs
dentro do repo, OU mantê-los fora de `src/`. Tokens `--step--N` (hífen duplo) viraram
`--step-{4xs,3xs,2xs,xs}` no mesmo fix.

## Blueprint polish + conhecimento (2026-05-31)

Plano: `plans/atlas-polish-and-knowledge.md`. Executado autônomo (/goal "roda tudo"):
- **Design**: acento secundário **latão `--grau`** + 3ª superfície `--paper-sunk` + contraste ↑
  (resolve "cores parecidas/sem hierarquia"). Marca clay + Bricolage/Hanken intactas.
- **Navbar**: wordmark "Atlas do/Tatame", seção ativa em latão (`site-header.tsx`).
- **Thumbnails**: chapa serigrafia recuada + filete cor-tipo + selo latão (`mapa.tsx`).
- **Superfícies**: home (âncora "embaixo", hierarquia latão), preços (garantia 7d), card
  (regra-de-ouro sempre visível). 
- **`/mapa-v2`**: grafo + painel 2D (still+vídeo), **SEM animação 3D** — `mapa-v2-explorer.tsx`,
  `mapa-canvas-v2.tsx`, `painel-no-v2.tsx`.
- **Conhecimento**: D0 proveniência (`docs/research/fontes-conhecimento.md`), ingestão de 117
  termos pt-BR (glossários públicos) → `/glossario` (página + busca; `src/content/glossario.json`,
  `src/lib/glossario.ts`, `glossario-lista.tsx`). Mantém EN canônico.
- Estado: tsc 0 · **156 testes** · build exit 0 · 315 páginas.

### Pendente (precisa do dono / não-autônomo)
- Kaggle (API key), ViCoS (licença comercial vs pesquisa).
- Revisão de FAIXA do glossário draft (3 flags) antes de "100% verdadeiro".
- D5 merge do grafo de técnicas além da guarda fechada.
- Vídeos EN → fila recuradoria pt-BR; autoridade/credencial na home (H4).
- VideoDB (decisão de migrar pipeline de vídeo) — ver `/ecc:council` pendente.

## Convenções de trabalho

- Rodar `pnpm test` antes de fechar qualquer mudança.
- Reutilizar utilidades puras de `src/lib/` antes de criar lógica nova.
- Imutável sempre; slugs ASCII sem acento; display com acento.
