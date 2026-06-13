# Atlas Jiu-Jitsu

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r184-black?logo=threedotjs)
![Tests](https://img.shields.io/badge/tests-vitest-6E9F18?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-22c55e)

> Interactive BJJ knowledge graph for white belts — in Portuguese.  
> Every position shows your options: sweep, submit, or pass. Free, no signup.

**[Open the Atlas →](https://leonardo-meireles.github.io/atlas-tatame)**

---

## What this is

I kept getting lost in BJJ as a beginner. Too many techniques, no structure, no map.  
This is the tool I wanted: positions as nodes, transitions as edges. Navigate the game like a city map, not a YouTube playlist.

- **Graph-first UX** — click any position, see what you can do next. Color encodes outcome: orange = submit, green = sweep.
- **3D figures** — custom Three.js renderer using [GrappleMap](https://eelis.net/GrappleMap/) public-domain skeletal data. Not AI-generated images — actual quaternion SLERP interpolation + camera framing heuristics per position type.
- **Curated content** — every transition has a step-by-step explanation written for beginners. 10 structural validators run at test time to catch curation errors before they ship.
- **100% pt-BR** — vocabulary of the Brazilian mat, not translated from English.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 App Router · SSG |
| UI | React 19 · Tailwind 4 |
| Graph visualization | @xyflow/react · Dagre layout |
| 3D figure renderer | Three.js · @react-three/fiber |
| Data pipeline | GrappleMap parser → BJJ filter → pt-BR adapter |
| Tests | Vitest — pure logic coverage |

---

## Architecture highlights

**Pure pose math** (`src/lib/figura/`): zero React, zero Three.js. Quaternion SLERP, per-joint bone propagation, camera framing heuristics — all tested independently of the renderer. Swapping renderers (SVG pictogram ↔ Three.js ↔ future) touches only the consumer, not the math.

**GrappleMap pipeline** (`src/lib/grapplemap/`): `parser.ts` decodes ~3600 GrappleMap positions from a base62 skeletal format (~400 LOC state machine). Then: BJJ neighborhood filter → concept collapse (variant names → canonical slugs) → pt-BR naming adapter → generated TypeScript. Running `pnpm generate` re-ingests the open-source dataset.

**10 curator validators** (`src/lib/curator-validators.ts`): structural linting rules that run at test time — orphan nodes, disconnected islands, English names, missing 3D assets, seta/annotation sync. Catches curation bugs before they reach the atlas.

**Server/client boundary**: `graph.ts` (`server-only`) holds the full merged graph at build time for SSG. `graph-client.ts` ships core positions to the client and lazy-fetches extras via `/grafo/extras.json` after mount — no 15 MB payload upfront.

**Publication gate** (`src/lib/published-graph.ts`): single function `getPublishedGraph(grafo)` enforces what appears in the UI — only transitions with step-by-step content, both endpoints published. Reversible: curating a transition (adding steps) makes it appear automatically.

---

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # vitest — pure logic coverage
pnpm build      # static site generation
pnpm lint       # eslint
```

---

## Project structure

```
src/
  app/            # Next.js routes (SSG)
  components/     # React UI components
  content/        # Curated graph data + generated GrappleMap data
  lib/
    figura/       # Pure pose math (SLERP, framing, geometry) — no React/Three
    grapplemap/   # GrappleMap parser, BJJ filter, pt-BR naming
    curator-validators.ts  # 10 structural linting rules
    published-graph.ts     # Publication gate (what appears in the UI)
    local-subgraph.ts      # BFS neighborhood for the canvas view
```

---

## Data

Skeletal data from [GrappleMap](https://eelis.net/GrappleMap/) by Eelis van der Weegen (public domain).  
All curated content — principles, step-by-step explanations, pt-BR names — is original.

---

## License

MIT — see [LICENSE](LICENSE).
