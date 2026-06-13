# GrappleMap → pt-BR translations (closed-guard neighbourhood)

> Deliverable: `src/lib/grapplemap/pt-br-names.ts`.
> "A gente já tem as posições, só precisa traduzir." This is the curated
> translation layer mapping each English GrappleMap name to the term a Brazilian
> jiu-jitsu practitioner actually uses on the mat (BR-canonical), plus an ASCII
> slug for URLs/IDs.

## Scope & method

- **Set**: the closed-guard **1-hop neighbourhood** —
  `closedGuardNeighbourhood(parseGrappleMap(GrappleMap.txt), { hops: 1 })` —
  **106 positions + 172 transitions**. Extracted via a throwaway vitest under
  `.scratch/` (no new deps), same pattern as the existing extractors.
- The data file is keyed by the **lowercased, line-break-cleaned** GrappleMap
  name (`gmKey()` strips the literal `\n` marker and collapses whitespace).
  Because of the keying, repeated transition names collapse: the 172 transitions
  reduce to **121 distinct names**, and **3 names** are shared between a position
  and a transition (`inside trip`, `irish collar`, `mount` — one keyed entry
  serves both, carrying the transition's `tipo`).
- **Total: 224** distinct gmName labels in the 1-hop set = **224 entries** in
  `PT_BR_NAMES` (one per distinct name). The 3 collisions
  (`inside trip`/`irish collar`/`mount`, each shared by a position and a
  transition) fold into a single entry carrying the transition's `tipo`;
  `omoplata`/`triangle`/`rubber guard` do **not** collide because the position
  name differs from the transition name. Verified: every 1-hop gmName has a
  translation, no extra keys, every slug is unique ASCII-kebab.

## tipo derivation (transitions only)

Per the port-results adapter table, `tipo` is derived from GrappleMap tags
(and name when tags are empty — most transitions carry no control tag):

| tipo | meaning | signal |
| --- | --- | --- |
| `raspagem` | sweep (reverses dominance from guard) | `sweep`/`butterfly_sweep`/`hip_bump` tag, or name with "sweep"/"hip bump"/"pendulum"/"upa to unbalance" |
| `finalizacao` | submission entry/finish | `armbar`/`kimura`/`omoplata`/`triangle`/`guillotine`/`arm_choke` tag, or name "triangle"/"kimura"/"omoplata"/"tap"/"finish"/"collar choke" |
| `perda-de-guarda` | guard pass / break / getting up (the guard player loses) | `knee_slice`/`knee_pin`/`pass_*`/`stand_up`/`frame` tag, or name "break guard"/"pass"/"escape"/"get up"/"top ..." advancing |
| `ataque` | offensive setup / threat / non-terminal control advance | default for grip/posture/positioning steps from the bottom |

Positions have **no** `tipo` (the field is omitted).

## Translation choices (BR-canonical, per CONTEXT.md)

CONTEXT.md rule: *termo canônico = o mais usado no tatame brasileiro* — a mix of
Portuguese and accepted anglicisms; do not translate mechanically.

**Translated to pt-BR (clear BR vocabulary):**
- closed guard / full guard → **Guarda Fechada**; posture broken → **postura quebrada**
  ("quebrar a postura" is the glossary term).
- mount → **Montada**; side control / "judo side" → **Cem Quilos**;
  knee on belly → **Joelho na Barriga**; turtle → **Tartaruga**;
  half guard → **Meia-Guarda**; back → **Costas**.
- sweep → **Raspagem**; hip bump (sweep) → **Raspagem de Quadril**;
  pendulum sweep → **Raspagem de Pêndulo** (started: "Início da Raspagem de Pêndulo").
- triangle → **Triângulo**; armbar/arm lock → **Armlock** (CONTEXT.md: BR fala
  anglicizado, preferir "armlock"); guillotine → **Guilhotina**.
- collar tie → **pegada de nuca**; collar → **gola** ("pegada", não "grip", per
  glossário); wrist control → **controle de punho**; underhook stays **underhook**
  (mat anglicism), overhook → **sobre-gancho**; crossface stays **crossface**.
- shrimp escape → **Fuga de Quadril**; stand up → **Ficar de Pé**;
  reverse technical stand-up → **Levantada Técnica Invertida**.
- "break guard" → **Abrir a Guarda**; "open guard" (the act) → **Abrir para
  Guarda Aberta**; knee slice → **Joelho Cortando**.
- spider guard → **Guarda-Aranha**; butterfly (guard) → **Guarda de Gancho**;
  double unders → **duplo por baixo**.
- "to/top/bottom ..." step labels → literal pt-BR ("De Cima ...", "De Baixo ...",
  "Para ...") since these are GrappleMap's own narration of who-does-what.

**Kept as anglicism / proper noun (real mat usage or no clean pt term):**
- **Kimura, Omoplata, Triângulo** — Omoplata is already pt-spelled and universal.
- **Armlock** (per CONTEXT.md), **Whizzer**, **Underhook**, **Crossface**,
  **Lockdown**, **Body Lock**, **Grapevine**, **Clinch**, **Octopus**, **Z-guard**,
  **De la Riva**, **Ankle Pick**, **Leg Lace**, **Hip Heist**, **Pummel**.
- GrappleMap idiom / coined names with no BJJ-standard term — kept verbatim as
  proper nouns: **Mission Control, Rubber Guard, Rat Guard, Chill Dog, Boston
  Handshake, New York, Muddy Waters, Swim Move, Double Bag, The County, Zombie,
  Bicep Ride, Kung Fu Move, Be Like Rubber, K-control, Cop Sweep, Homie**.

## Flagged uncertainties

These are the entries I am least confident about — worth a second pass from
someone who trains:

1. **`hip bump` → "Raspagem de Quadril"** — correct mechanic, but many BR
   academies just say **"hip bump"** or **"upa"** (the bridge). "Upa" is used
   here only for the `upa to ...` transitions. Decide house term.
2. **`omoplata` (transition)** vs **`omoplata on side` (position)** — both real;
   I gave the transition slug `omoplata-entrada` to avoid colliding with future
   position slugs. Same pattern for `kimura-entrada`, `triangulo-entrada`,
   `rubber-guard-entrada`, `gola-irlandesa-entrada` (transition entries) so they
   don't clash with the positions of the same name.
3. **`combat base` → "Base de Combate"** — literal; some say just "base". Kept
   literal because it is the recognizable wrestling/MMA term.
4. **`homie` / `6 o'clock homie` / `chill dog` / `boston handshake` / `muddy
   waters` / `new york` / `zombie` / `the county`** — these are GrappleMap's
   invented nicknames (rubber-guard / 10th-planet flavored). No BR equivalent;
   kept as proper nouns. If the product wants descriptive names, these need
   author input.
5. **`judo side` → "Cem Quilos de Judô"** — it is a side-control-from-judo pin
   (kesa-gatame-ish). "Cem Quilos" is the BR side-control term; "de Judô"
   disambiguates. Could also be **"Kesa"**.
6. **`pimp-arm`, `t-rex`, `c-cups`, `2-on-1`** — slang grips kept as-is inside
   longer names ("pimp-arm", "T-rex", "C-cup", "2-em-1"). 2-on-1 is universally
   "2-em-1" or "dois-em-um" in BR.
7. **`clamp` / `clamp guard`** — kept "Clamp"; no standard pt term, and it is a
   relatively obscure control.
8. **`granby`** → kept "Granby" (the roll); universal.
9. **`...` transition** — a literal-ellipsis unnamed transition in the source
   (its union tags carry armbar/arm_choke/guillotine). Mapped to "Transição sem
   Nome" / `transicao-sem-nome`, tipo `finalizacao`. Likely should be dropped or
   renamed once the real edge is identified.
10. **`finish` / `escape` / `sweep` / `triangle` / `pin knee` etc.** — these
    short transition names recur on many different edges in GrappleMap (same
    label, different start/end). Keyed by name they collapse to one translation;
    if the product needs per-edge display names, disambiguation must come from
    the `de`/`para` endpoints, not this table.

## Verification

- Throwaway extractor (`.scratch/figuras-grapplemap-pipeline/list-names.test.ts`)
  → 106 positions, 172 transitions (121 distinct names).
- Coverage test (`verify-names.test.ts`): 224 distinct gmName keys all covered,
  0 missing, 0 extra, 0 duplicate slugs, all slugs ASCII-kebab. All green.
- `./node_modules/.bin/next build` → passes (pure data file, TypeScript clean).
