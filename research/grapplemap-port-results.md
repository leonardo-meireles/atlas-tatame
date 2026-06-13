# GrappleMap Port — Phase 2 Results

> Deliverable for PRD `.scratch/figuras-grapplemap-pipeline/PRD.md` Phase 2.
> Code: `src/lib/grapplemap/{parser.ts, parser.test.ts, bjj-filter.ts}` (pure, isolated).
> Source data: `source_repos/GrappleMap/GrappleMap.txt` (public domain).

## What was built

- **`src/lib/grapplemap/parser.ts`** — pure module, no I/O. Public entry:
  `parseGrappleMap(text) => { positions: GMPosition[]; transitions: GMTransition[]; tags: string[] }`.
  Includes the base62 codec (`decodeFrame`/`encodeFrame`/`fromBase62`/`toBase62Pair`),
  the block-reading state machine, description/tag/properties parsing, and a faithful
  port of GrappleMap's reorientation-aware connectivity matcher (`isReoriented`) used to
  resolve each transition's `fromId`/`toId`.
- **`src/lib/grapplemap/bjj-filter.ts`** — `filterByTags` (tag/name whitelist) and
  `closedGuardNeighbourhood` (BFS outward from closed-guard seeds over resolved
  connectivity, like `grow()` in gm.js). Curated `BJJ_TAGS` (75 tags) and
  `CLOSED_GUARD_TAGS`.
- **`src/lib/grapplemap/parser.test.ts`** — 21 Vitest tests, all green.

## Counts

| Metric | Value |
| --- | --- |
| Total positions (1-frame blocks) | **601** |
| Total transitions (>=2-frame blocks) | **1485** |
| Distinct tags in the data | 161 |
| Transitions with both endpoints resolved | **1246 (84%)** |
| Transitions unresolved (no matching node) | 239 (16%) |

After the **BJJ tag whitelist** (`filterByTags`, 75 tags):

| Metric | Value |
| --- | --- |
| Positions kept | **531** of 601 |
| Transitions kept | **202** of 1485 |

> Note: the tag whitelist keeps most *positions* (most of the data is ground BJJ —
> only ~70 are pure standing/takedown/judo) but few *transitions*, because most
> transitions in `GrappleMap.txt` carry only an action/grip tag (or none) rather than
> a control tag. For transitions, **graph-walk (neighbourhood) is the better filter**,
> since it follows real edges out of guard rather than relying on transition tags.

After the **closed-guard neighbourhood** (`closedGuardNeighbourhood`, BFS over resolved
connectivity from `closed_guard`/`full_guard` seeds):

| Hops | Positions | Transitions |
| --- | --- | --- |
| seeds only (hop 0) | 55 | — |
| 1 | 106 | 172 |
| 2 | 293 | 578 |
| 3 | 516 | 1089 |

This is the density we gain: from the **55** closed-guard seed positions, **1 hop**
already pulls in **106 positions and 172 named transitions**; **2 hops** reaches
**293 positions / 578 transitions** — a coherent connected sub-graph (guard → sweeps →
submissions → passes → top control) rather than 3600 disconnected entries.

## Sample of the closed-guard neighbourhood (names we'd gain)

**Closed-guard seed positions (sample of 55):** full guard kimura · octopus closed
guard · posture broken full guard · standing vs closed guard · mission control ·
chill dog · seated full guard guillotine · closed guard w/ double unders · hip bump
sweep w/ hand post · clamp guard · sit-up guard · irish collar · boston handshake
triangle · full guard shoulder pin w/ bicep ride · rubber guard (rat guard) · closed
guard w/ overhook + collar tie.

**Positions reached at 1 hop (sample of 106):** standing vs de la riva · recovering
guard · omoplata on side · mount · knee on belly w/ head&arm · spiderweb w/ S-grip ·
butterflies engaged w/ double unders · perpendicular triangle · half guard arm
triangle · pendulum sweep · arm lock · triangle threat · spider guard w/ shins
against biceps · z-guard vs cross-grip · half guard w/ crossface vs neck frame.

**Transition (move) names reached at 1 hop (sample):** bottom closes guard · arm
shuck · hip bump · pendulum sweep start · triangle · omoplata · rubber guard · shrimp
escape · to full guard · knee slice · cop sweep · upa to get arm back · break guard
using knee · whizzer sweep · hip heist · ankle pick · pull guard · to back ·
reverse technical stand-up · kimura.

These are exactly the closed-guard MVP moves (armlock/armbar, triangle, omoplata,
kimura, hip bump sweep, pendulum sweep, guard passes, posture/break sequences) plus
the positions they lead to (mount, side control, knee-on-belly, back, half guard).

## How this maps onto our `Grafo` (`src/lib/types.ts`)

The GrappleMap model is intentionally kept separate from the domain `Grafo`. The
eventual wiring (a later phase, NOT done here to respect the file lane) is a pure
adapter `GMPosition/GMTransition → Posicao/Transicao`:

`GMPosition → Posicao`
| `Posicao` field | Source |
| --- | --- |
| `slug` | slugified pt-BR name (curated; provenance via `sourceLineNr`) |
| `nome` | curated pt-BR translation of `GMPosition.name` (English source) |
| `resumo` / `principios` | authored by us (not in GrappleMap) |
| `imagem` | `public/stills/<slug>.png|svg`, pre-rendered from `GMPosition.pose` |
| `raiz` | set on the closed-guard root |
| `acesso` | our own (`free`/`paid`) policy |

`GMTransition → Transicao`
| `Transicao` field | Source |
| --- | --- |
| `slug` | slugified pt-BR name |
| `nome` | curated pt-BR translation of `GMTransition.name` |
| `tipo` | derived: tags/name → `raspagem` (sweep), `finalizacao` (submission tags), `ataque`, `perda-de-guarda` |
| `de` | slug of the `Posicao` whose `GMPosition.id === fromId` |
| `para` | slug for `toId`; `null` for a submission/terminal (or unresolved) edge |
| `passos` | authored (could seed from keyframe count / detailed flag) |
| `acesso` | our own policy |

The pose joint coordinates (`GMPosition.pose`, `GMTransition.frames`) feed the
**FiguraRenderer** (Phase 3) to draw the still — they do not live on `Posicao`/
`Transicao` themselves. Connectivity (`fromId`/`toId`) is what makes the
`de`/`para` wiring possible without manual edge authoring.

## Parsing edge cases & notes

- **Connectivity is reorientation-aware, not exact.** `isReoriented` ports
  `is_reoriented` (positions.cpp:198-259): align the two players' heads via a y-axis
  rotation + translation, then test `basicallySame` (per-joint distance² ≤ 0.0016,
  i.e. 4 cm), trying optional mirror (x-flip + Left/Right joint swap, players.hpp:73)
  and player-swap. A head-to-head-distance early-out (Δ > 0.05) prunes most pairs.
- **84% of transitions resolve both endpoints; 16% (239) do not.** This matches
  GrappleMap's own design: upstream caches connectivity in a sidecar `.index` file and
  some transition endpoints are not exact reorientations of any standalone node (they
  are intermediate/dangling, or rely on a tolerance/heuristic we did not replicate
  1:1). Unresolved transitions keep `fromId`/`toId = null` rather than guessing — the
  neighbourhood filter simply skips them. This is sufficient for growing the
  closed-guard sub-graph; tightening the remaining 16% (e.g. matching the closest node
  within tolerance, or porting the `.index` build) is a future refinement.
- **`atan2(x, z)`** is used for the heading angle. Any consistent angle convention
  works because the same rotation is re-derived and re-applied; it is never persisted.
- **Names contain literal `\n`** (backslash-n, two chars) = forced display line break,
  preserved verbatim in `GMPosition.name`. The pt-BR adapter should replace with spaces
  or `<br>`.
- **`properties:` line** parsed into booleans `{ top, bottom, bidirectional, detailed }`.
  `detailed` = 10 keyframes/sec hint, `bidirectional` = usable both ways — relevant when
  deriving `de`/`para` direction later.
- **Frame splitting tolerant of whitespace.** `decodeFrame` strips all whitespace before
  decoding, so the 4-line indent split (and any stray spaces) is irrelevant — matches the
  C++ `nextdigit` skip-whitespace behaviour.
- **Round-trip verified.** `encodeFrame(decodeFrame(blob)) === blob` is asserted in the
  tests against a real block from the top of the file, validating the whole codec
  (base62 + offsets + joint order) against ground truth.
- **Zero-frame blocks** (would only arise from stray description text) are ignored.

## Test status

`./node_modules/.bin/vitest run src/lib/grapplemap` → **21 passed**.
`./node_modules/.bin/next build` → **passes** (TypeScript clean, all routes built).
