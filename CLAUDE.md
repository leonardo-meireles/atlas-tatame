# webapp-jiu — Atlas do Tatame

Web app / SaaS que ensina Jiu-Jitsu brasileiro como um **grafo explorável** de posições e
transições, com visual original — a antítese dos concorrentes de PDF AI-slop. Público 100%
brasileiro, conteúdo 100% pt-BR. MVP: **guarda fechada**.

> Contexto de produto completo (glossário, escopo, decisões): ver `CONTEXT.md`.
> Pesquisa e planos (figura, parser, UX de grafo): ver `research/`.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind 4** (`@tailwindcss/postcss`)
- **@xyflow/react** — grafo do `/mapa`; **@dagrejs/dagre** — layout
- **three.js / @react-three/fiber / drei** — figura 3D no nó expandido
- **Vitest** + Testing Library — testes
- Gerenciador de pacotes: **pnpm** (há `pnpm-lock.yaml` e `pnpm-workspace.yaml`)

## Comandos

```bash
pnpm dev        # next dev
pnpm build      # next build (SSG — gera páginas estáticas de posições/drills)
pnpm test       # vitest run (rodar antes de concluir qualquer mudança)
pnpm test:watch # vitest watch
pnpm lint       # eslint
```

## Arquitetura (onde mexer)

- **`src/content/`** — dados. `grafo.ts` = MVP curado à mão (fonte da verdade). Arquivos
  `*.generated.ts` vêm do parser GrappleMap — **não editar à mão**. `poses-meta.json` controla
  o que é publicado; `figura-manifest.json` registra renders 3D disponíveis.
- **`src/lib/types.ts`** — modelo: `Posicao`, `Transicao`, `Grafo`, `TipoTransicao`
  (`raspagem|finalizacao|ataque|passagem|perda-de-guarda`), `Familia`, `Polo`, `Seta`.
- **`src/lib/graph.ts`** — acesso server-only (`getGrafo`, `getPosicao`, `getTransicoesDe`).
  **`src/lib/graph-client.ts`** — store client (`useGrafo`, `loadExtras`).
- **`src/lib/grapplemap/`** — parser (`parser.ts`), tradução (`pt-br-names*.ts`),
  colapso de conceito (`concept-collapse.ts`), filtro BJJ (`bjj-filter.ts`).
- **`src/lib/figura/`** — math de pose/render. `pose.ts` (`normalize`, `SKELETON`),
  `pictograma.ts` (projeção 2D), `anim.ts` (interpolação SLERP), `figura-data.ts`
  (`loadPose`/`loadTrans`), `pose-meta.ts` (`isPublicada`, gate de publicação).
- **`src/lib/curator-validators.ts`** — 10 validadores puros do grafo (`runAllValidators`).
- **`src/components/`** — UI. `mapa-explorer.tsx` (estado), `mapa.tsx` (canvas),
  `mapa-sidebar.tsx`, `node-expandido.tsx`, `setas-overlay.tsx`, `pose-viewer.tsx`.
- **`src/app/`** — rotas. Públicas: `/`, `/mapa`, `/posicao/[slug]`, `/precos`,
  `/drill/[slug]`, `/instrutor/[slug]`. Internas/dev: `/prototipo`, `/visualizador`, `/studio`.

## Convenções (ver também `~/.claude/rules/ecc/`)

- **Idioma**: pt-BR no conteúdo e no display. Termo canônico = o do tatame BR (ver glossário
  em `CONTEXT.md`). Anglicismo só onde o praticante fala inglês (ex: "armlock").
- **Slugs/IDs/URLs**: ASCII sem acento (`guarda-fechada`). Display com acento.
- **Imutabilidade**: criar objetos novos, nunca mutar (regra global). Grafo é dado puro.
- **Reutilizar antes de criar**: utilidades puras já existem em `src/lib/` — checar
  `tipo.ts`, `dedup-saidas.ts`, `callouts.ts`, `local-subgraph.ts` antes de escrever lógica nova.
- **Arquivos pequenos e coesos**, early-return, sem números mágicos sem nome.
- **Publicação**: nunca expor posição não publicada na UI — usar `isPublicada()`
  (`src/lib/figura/pose-meta.ts`). `DIFERIDOS` lista o que fica escondido.

## Testes

- TDD quando viável: teste primeiro (`*.test.ts` ao lado do módulo). Cobertura em `src/lib/`.
- Lógica de grafo/figura é pura → testável sem render. Sempre rodar `pnpm test` antes de fechar.

## Fora de escopo (MVP)

Passagem de guarda / jogo de cima, outras guardas, quedas, i18n. Ver `CONTEXT.md`.
