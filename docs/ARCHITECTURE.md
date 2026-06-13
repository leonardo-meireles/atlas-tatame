# Architecture

Atlas Jiu-Jitsu is a static Next.js app (SSG) with three distinct computational layers: a data pipeline that ingests public-domain skeletal data, a pure math layer for pose manipulation, and a React graph canvas for exploration. Each layer is independent — the math doesn't know about React, the pipeline doesn't know about the renderer.

---

## Data flow

```
GrappleMap (.txt)
    └── parser.ts          base62 skeletal codec → raw positions
        └── bjj-filter.ts  neighborhood filter around BJJ hub nodes
            └── concept-collapse.ts  variant names → canonical slugs
                └── pt-br-names.ts  English → pt-BR mapping
                    └── *.generated.ts  committed generated TypeScript

grafo.ts (hand-curated)
    └── merged at build time via graph.ts (server-only)
        ├── SSG: getGrafo() → static pages
        └── Client: graph-client.ts → lazy extras fetch
```

The split between generated and curated data is intentional. GrappleMap provides skeletal geometry and rough connectivity (~3600 positions); the curated layer (`grafo.ts`) contributes step-by-step explanations, pt-BR names, and editorial decisions about what belongs in the atlas.

---

## Publication gate

`src/lib/published-graph.ts` — `getPublishedGraph(grafo: Grafo): Grafo`

Only positions and transitions that pass all three conditions appear in the UI:

1. The transition has at least one step (curated content exists)
2. Both endpoints are published (`isPublicada()` in `pose-meta.ts`)
3. The transition slug itself is published

This is a **deep module**: one function call at the entry point enforces the invariant for the entire app. Adding content to a transition automatically makes it visible; removing it hides it. No scattered `if (published)` guards.

---

## Pure pose math

`src/lib/figura/` has zero React, zero Three.js imports.

| File | Responsibility |
|------|----------------|
| `pose.ts` | Joint normalization, `SKELETON` bone tree |
| `anim.ts` | Quaternion SLERP interpolation between keyframes |
| `framing.ts` | Camera distance/angle heuristics per position type |
| `pictograma.ts` | 2D projection for SVG fallback renderer |
| `figura-data.ts` | `loadPose` / `loadTrans` — fetch + cache pose JSON |

The isolation means the math is testable without a DOM or WebGL context. `anim.test.ts` and `framing.test.ts` run in Vitest with no setup. The Three.js renderer (`figura-r3f.tsx`) and the SVG fallback (`still.tsx`) both consume the same pose structs — swapping renderers touches only the consumer.

---

## Curator validators

`src/lib/curator-validators.ts` — 11 structural linting rules, all pure functions over `Grafo`.

| Rule | Level | Catches |
|------|-------|---------|
| `semOrfaos` | warn/error | Positions with no incoming or outgoing edges |
| `semIlhas` | warn | Positions unreachable from `guarda-fechada` via BFS |
| `hubsConectados` | warn | Hub nodes with fewer than 3 hub neighbors in ≤4 hops |
| `semDuplicacaoSemantica` | warn | Transitions with identical (name, type, source) |
| `saidasMinimas` | warn | Published positions with no offensive exits |
| `tem3D` | error/warn | Positions without 3D poses; transitions without frames |
| `namingLint` | warn | English words in names; non-kebab slugs |
| `familiaCoerente` | warn | Unknown `familia` values |
| `polosCoerentes` | warn | Sweeps from top, passes to bottom |
| `statusGate` | warn | Unpublished items in the graph data |
| `setasAnotacoesEmSincronia` | warn | Mismatch between `setas` count and `ANOTACOES` entries |

Validators run as part of `pnpm test`. `runAllValidators(g)` returns all issues; `ERROR`-level issues should block ship; `WARN`-level issues are tracked noise (legitimate leaf nodes, work-in-progress stubs).

---

## Server / client boundary

Next.js App Router with `output: 'export'` for GitHub Pages.

**`src/lib/graph.ts`** — `server-only` import. Merges the generated GrappleMap graph with the hand-curated graph, applies the publication gate, runs validators in development. Called at build time for SSG page generation.

**`src/lib/graph-client.ts`** — Zustand store. Ships the core positions on page load; lazy-fetches `extras.json` (full transition steps, annotations) after mount. Avoids sending a 15 MB payload to clients who never open a node.

The extras endpoint (`/grafo/extras.json`) is a static JSON file generated at build time. Cache-Control header: `public, max-age=3600, stale-while-revalidate=86400`.

---

## Graph layout

`src/components/mapa.tsx` + `src/components/mapa-explorer.tsx`

- **@xyflow/react** handles node/edge rendering and pan/zoom
- **@dagrejs/dagre** computes the initial DAG layout (top-to-bottom, position type as layer hint)
- Local subgraph (`src/lib/local-subgraph.ts`): BFS from the selected node, depth-limited. Renders neighborhood, not the full graph — keeps the canvas readable at MVP scale
- Node expansion is in-canvas (no route change): `useGrafo` store holds `posicaoAberta`, sidebar reads from it

---

## Security

Static app — no auth, no database, no user input that reaches a server.

- **CSP headers** via `next.config.ts`: `script-src 'self' 'unsafe-inline'`, frame-src limited to `youtube-nocookie.com`
- **No env secrets**: only `GITHUB_PAGES` and `NEXT_PUBLIC_BASE_PATH` are used at build time; neither is sensitive
- **No third-party scripts**: no analytics, no tag managers, no CDN-loaded JS
- OWASP Top 10: all N/A or not applicable for a static read-only site

---

## Key decisions

**Why SSG over SSR?** Content changes infrequently (curated by hand). SSG gives free hosting (GitHub Pages), instant page loads, and zero server attack surface.

**Why GrappleMap?** Public domain skeletal data with ~3600 real BJJ positions. The alternative was drawing stick figures by hand. Parser investment (~400 LOC) paid off: we got a connected graph, not a flat list.

**Why pt-BR only?** The target user is a Brazilian white belt who trained at a Brazilian academy. Translating BJJ vocabulary from English introduces errors — "armlock" is already the word on the Brazilian mat.

**Why no auth?** Originally planned as SaaS. Pivoted to open source: lower friction for contributors, no cookie banners, no GDPR surface.
