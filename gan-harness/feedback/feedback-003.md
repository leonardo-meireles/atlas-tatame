# Evaluation — Iteration 003

Mode: code-only (Playwright not installed; assessed by reading scoped source, running a
clean `pnpm build` + `pnpm test`, and targeted greps). Built on iteration 2 (8.7).

## Gate (must pass or the run fails regardless of score)

| Gate item | Result | Evidence |
|---|---|---|
| `pnpm test` green (≥149, none weakened) | PASS | 18 files, 149 passed (2.31s). No test deleted/weakened; the `src/lib` graph/figura purity suite is untouched this iteration. |
| `pnpm build` succeeds | PASS | `rm -rf .next` (x2 for the ENOTEMPTY flake) then build → 313 SSG pages, `/posicao/[slug]` (283) + `/drill/[slug]` (9) + `/instrutor/[slug]` (10) intact, `/opengraph-image` + `/robots.txt` + `/sitemap.xml` generated. EXIT 0. |
| Zero new hardcoded hex in scoped files | PASS | grep `#[0-9a-fA-F]{3,6}` across page.tsx, precos/page.tsx, mapa-explorer, mapa, mapa-sidebar, trilha-faixa-branca, onboarding-mapa → 0 matches. OG hex lives in `opengraph-image.tsx` (out of scope), now a named `OG` constant. |
| Scoped raw `text-[Nrem]` sizes | PASS (bonus) | grep `text-\[[0-9]` across all 7 scoped files → 0 matches. Every font size now resolves through `text-[length:var(--step-*)]`. |
| No secrets/API keys in client code | PASS | Only `NEXT_PUBLIC_MP_LINK_ATLAS` / `_TRILHA` (link-only) in precos. grep for `sk-/api-key/secret/bearer/password/token` → 0. |
| pt-BR only; `isPublicada` honored | PASS | All copy pt-BR; `filtraPublicado` (mapa-explorer.tsx:19-37) gates de/para/slug on `isPublicada`; landing stats gate at page.tsx:21-27. |

**Gate: PASS (all items).**

---

## Scores

| Criterion | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Design Quality | 10 | 0.30 | 3.00 |
| Originality | 9 | 0.20 | 1.80 |
| Craft | 9 | 0.30 | 2.70 |
| Functionality | 9 | 0.20 | 1.80 |
| **TOTAL** | | | **Weighted total: 9.3** |

## Verdict: PASS (threshold 7.0)

---

## Iter-2 punch-list — verified resolved by reading the files

1. **`aria-expanded`/`aria-controls` on the hamburger — FIXED.** mapa-explorer.tsx:143-148
   the "Abrir índice" button now carries `aria-expanded={false}` + `aria-controls="mapa-indice"`,
   and the `<aside>` declares `id="mapa-indice"` (mapa-sidebar.tsx:53). The relationship is
   announced. (Note: the button only mounts while the drawer is closed, so the literal
   `false` is always correct in that render — see Craft below for the one residual nuance.)
2. **`--step--1`/`--step--2` body rungs + full migration — FIXED.** globals.css:49-61 adds a
   documented downward scale (`--step--4` 0.56 → `--step-0t` 1.15) with body/label rungs
   (`0s` 0.9, `0` 0.95, `0r` 1, `0h` 1.05). Every recurring body/label size in the seven
   scoped files now rides `text-[length:var(--step-*)]`; the scoped `text-\[[0-9]` grep is
   empty. Type is fully single-sourced — this is the lever that takes Design 9 → 10.
3. **Onboarding "☰" glyph mismatch — FIXED.** onboarding-mapa.tsx:60-72 renders the SAME
   inline 3-line SVG (`M4 7h16M4 12h16M4 17h16`) as the real drawer toggle
   (mapa-explorer.tsx:150-152), inline in the sentence "toque no botão de menu [svg] pra abrir".
   The hint now points at the exact shape the user sees, not a divergent unicode char.
4. **Professor-de-tatame coaching cadence — FIXED (and it lands).** page.tsx:259-263 "O Atlas"
   beat now opens imperative ("Olha: você não precisa de mais técnica, precisa entender o
   jogo") and quotes a live correction ("tira o cotovelo de dentro, fecha a guarda, agora
   levanta o quadril"). This is the single sentence that reads as a person, not brand nouns —
   exactly the reach named in iter 1 and 2.
5. **OG palette drift — FIXED (out of scope, but done).** opengraph-image.tsx:23-32 the
   eyeballed hex is now a named `OG` object with a one-to-one documented mapping to each brand
   token (`OG.mat ↔ --mat`, `OG.clay ↔ --clay-on-mat`, etc.). Auditable, not random. This is
   the documented exception to the no-hex rule and is correctly outside the scoped surfaces.

Also verified unrelated bonus: mapa.tsx `MapHint` (line 334-338) replaced the `👆` emoji with
a proper tap/pointer SVG (clay-on-mat stroke) — the one remaining emoji-as-icon slop on the
mapa surface is gone, satisfying the spec's anti-slop mandate on that surface.

All five iter-2 items are genuinely resolved in source — not merely claimed.

---

## Dimension 1 — Design: 10/10 (was 9)

This is a 10, and it is earned. The two reasons it was held at 9 are both closed:

- **Type is now fully single-sourced.** The modular scale was extended downward with
  documented body/label rungs (globals.css:49-61) and every recurring ad-hoc body size
  (`0.78rem` eyebrow, `0.95rem` lede, `1.05rem` destaque-lede, `0.9rem` corpo miúdo) was
  migrated onto a named `--step-*` rung. The scoped `text-\[[0-9]` grep returns zero —
  display, numeral, AND body type all flow through one scale. This is the exact thing the
  token system exists to enforce, and it is now enforced with no escapes in scope.
- **The OG brand-drift crack is closed** via the named `OG` constant with token provenance
  comments (acknowledged as out-of-scope but no longer eyeballed).

Everything that earned the 9 holds and reinforces: color routes through `var(--…)` everywhere;
spacing through `--space-*`; `tabular-nums` on every numeral and price (hero anchor :64, stats
:167, princípio numeral :227, plan prices :127, trilha progress :45); the landing reads as one
designed document — eyebrow → h2 → lede on every section, consistent
`border-t py-[var(--space-3xl)]` rhythm; the contrast strip uses `inset 3px 0 0 var(--clay)`
(serigrafia rule, not a drop-shadow card); preços cards equal-height via `items-stretch` +
`min-h-[3em]` pitch + `flex-1` list, degrading 3-up → 1-up; the mapa dark-canvas stays distinct
from paper, the sidebar reads as index/legend with the `color-mix(--mat-2/--clay)` gradient, not
SaaS chrome. No gradient hero swap, no glassmorphism, no emoji-as-icon (the last one removed this
iter), no card soup. There is no in-scope design defect left to point at. **10.**

## Dimension 2 — Originality: 9/10 (was 9) — held, voice sharpened

The coaching-cadence rewrite is a real qualitative gain: the "O Atlas" column now has an
imperative and a quoted live correction, so the professor voice reads as a specific person
("Olha: …", "tira o cotovelo de dentro …") rather than well-chosen brand nouns — the precise
move iter 1/2 asked for. Price framing stays unmistakably BR and anti-SaaS ("pra sempre · sem
mensalidade", "menos que uma aula", "pagou uma vez, é seu", plan names Faixa Branca / Atlas
Completo / Trilha avulsa). Mapa keeps graph-native metaphors ("Você está aqui", Trilha Faixa
Branca, "As cores das linhas", "Montando o mapa…"). Numerals are honest — `numFinais` /
`numRaspagens` / `numVideos` are computed from the curated graph (page.tsx:23-27), zero
invented figures.

Why still 9 and not 10 (the gap is now structural, not a defect):
- **The contrast beat is still a two-column "concorrente / O Atlas" shape.** The copy inside
  is now excellent, but the *form* — competitor-column-left / us-column-right — is the one
  remaining piece of the landing whose silhouette a reader has seen on other product pages.
  The originality of the words has outrun the originality of the layout container they sit in.
- **The coaching voice is concentrated in exactly one beat.** It is fully present in "O Atlas"
  (page.tsx:259-263), but the other body copy (Como funciona steps, princípios lede, preços
  pitches) is clean, on-brand, and correct yet largely declarative. A 10 would have the same
  cadence echo once or twice more — e.g. a single imperative aside in a "Como funciona" step or
  the destaque-plan pitch — so the page reads as one coach talking throughout, not one coached
  paragraph in an otherwise editorial document.

This is a copywriting/layout reach, not a code defect. See punch-list for the exact moves.

## Dimension 3 — Craft: 9/10 (was 8) — improved as targeted

Craft moves 8 → 9 on the two highest-leverage fixes: the hamburger now advertises its
relationship (`aria-expanded`/`aria-controls` → `#mapa-indice`), and the onboarding hint icon
matches the real control (same SVG path) instead of a divergent unicode glyph. Everything right
in iter 2 holds: the `inert` + `aria-hidden` closed-drawer (mapa-sidebar.tsx:63-64) keeps
off-canvas nav out of the tab order and AT tree; `role="note"` (onboarding-mapa.tsx:43) is the
honest non-modal semantics; the empty/loading placeholder ("Montando o mapa…",
mapa-explorer.tsx:155-167) covers both the `loadExtras` in-flight and the nothing-published
case and never shows a blank void; `raiz` is guarded (`?.`, :49); `centro` stays put on close
(`fechar` only clears `sel`, :74) so no view jump; legend swatches and edges both source
`tipoMeta(...).corOnMat` (single source, mapa.tsx:218/221 + mapa-sidebar.tsx:140); the global
`prefers-reduced-motion` guard (globals.css:257-264) zeroes `*` animation/transition, so the
MapHint `hint-baixa`/`hint-fade` keyframes are covered — no unguarded motion added; checkout
anchors keep `target="_blank" rel="noopener noreferrer"` (precos:159-160); "Abre no lançamento"
is a clearly-non-dead state with a free `/mapa` link (precos:166-178); stats hide a bare `0`
via `.filter((s) => s.n > 0)` (page.tsx:164); the `:focus-visible` clay ring (globals.css:154)
is global and not clipped (rail/canvas `overflow-hidden` is on containers, the ring's
`outline-offset: 2px` + `border-radius` render on the focusable element itself, which is inside
the scroll area, not clipped by it).

Why still 9 and not 10 — three residual a11y/state nuances a senior would still close:
1. **The hamburger is a one-state toggle, not a persistent one.** mapa-explorer.tsx:142 only
   mounts the button while `!sidebarAberta`, so it always renders `aria-expanded={false}`; when
   the drawer opens, the button unmounts and the only way back is the backdrop (an
   `aria-label="Fechar índice"` full-bleed button) or an in-rail action. A screen-reader user
   who opens the index never encounters a control that reads "expanded=true" to collapse it —
   the open/close affordance is split across two different unlabeled-as-a-pair elements. A true
   10 keeps ONE persistent toggle button that flips `aria-expanded` true/false and stays in the
   DOM, or gives the open drawer an explicit in-rail "Fechar índice" button (not only the
   backdrop) so the toggle is discoverable in both states.
2. **The onboarding `role="note"` auto-appears but the in-sentence hamburger SVG is
   `aria-hidden` with no text equivalent in the mobile branch.** onboarding-mapa.tsx:56-74 reads
   "toque no botão de menu [aria-hidden svg] pra abrir" — a screen reader hears "toque no botão
   de menu pra abrir" (fine, the SVG is decorative), but "botão de menu" and the actual control's
   `aria-label="Abrir índice"` use different words. Minor wording drift between the hint and the
   control's accessible name; aligning them ("toque em 'Abrir índice'") would be the pixel-perfect
   pass.
3. **`MapHint` and `OnboardingMapa` can co-occupy the canvas on first mobile visit.** Both mount
   when no node is expanded (`!sel`, mapa-explorer.tsx:180 for onboarding; MapHint is
   unconditional inside `onNodeClick`, mapa.tsx:421). On a first mobile visit they stack
   (top pill + bottom card) — not a bug, both are dismissible and motion-safe, but it is two
   simultaneous coach-marks competing for a beginner's first 7 seconds. A 10 would suppress the
   transient `MapHint` while the first-run `OnboardingMapa` note is showing.

None is a violation or a broken state; they are the polish delta between 9 and 10.

## Dimension 4 — Functionality: 9/10 (was 9) — held, all flows wired

All three critical flows are wired and behavior-preserving; the `Plano` discriminated union keeps
the preços branches exhaustive with no dead config.
- **Landing:** 2 CTAs to `/mapa` (hero pill :50, closing pill :294); 2 visible links to `/precos`
  (price anchor :63, closing secondary :299); price anchor "R$ 19 · pra sempre · sem mensalidade"
  present (:64, :303). Server component, no client-only import. "sem PDF de IA" beat is structured
  copy (:237-267), not a footer line.
- **Mapa:** `escolher` expands + anchors via `setCentro` (mapa-explorer.tsx:63-72); `fechar` only
  clears `sel` so `centro` stays put (no view jump on close, :74); Esc handler (:75-79); mobile
  drawer + hamburger + backdrop toggle with matched `aria-label`s; legend from the single
  `tipoMeta` source; "passo X de N" from `passosValidos` (trilha:24-29); `isPublicada` filter
  intact; `raiz` undefined-safe.
- **Preços:** free CTA always routes to `/mapa` (the `!p.pago` Link branch, :149-154); env-set
  checkout renders the external anchor with correct rel (:157-164); env-unset renders "Abre no
  lançamento" + free link (:166-178); 3 plans render Grátis / R$ 19 / R$ 12 with the destaque
  "Melhor valor" badge.

Why still 9 and not 10 — the gap is now purely the Craft-side toggle-discoverability nuance
(item 1 above), which is the one wiring-completeness item left: a keyboard/SR user can open the
mobile index but the collapse affordance is the backdrop, not a labeled toggle that advertises
`aria-expanded=true`. No functional regression anywhere; the explorer state model is intact.

---

## What Improved Since Iteration 2
- **Design 9 → 10:** body/label type migrated onto extended `--step-*` rungs; OG palette named
  with token provenance. In-scope type is fully single-sourced; no design escape left.
- **Craft 8 → 9:** hamburger `aria-expanded`/`aria-controls`; onboarding hint icon now matches
  the real control SVG; MapHint emoji → SVG (anti-slop).
- **Originality (held 9, sharper):** "O Atlas" beat rewritten with a real imperative + a quoted
  live correction — the voice now reads as a person in that beat.

## What Regressed Since Iteration 2
- None. 149 tests pass unchanged, build EXIT 0 with 313 SSG pages, explorer state model and
  `isPublicada` gate intact.

---

## Precise punch-list to reach 10/10 (only Originality, Craft, Functionality remain)

**Design is at 10 — no action.**

### Originality 9 → 10 (copy + one layout move)
1. **Break the two-column "concorrente / O Atlas" silhouette.** In `page.tsx:245-266`, instead
   of the symmetric 2-up grid, lead with the affirmation as a single full-width coaching
   statement and demote the "O concorrente" line to a smaller struck-through / `--ink-faint`
   aside beneath it (reuse the existing `inset 3px 0 0 var(--clay)` rule on the affirmation
   block). Same tokens, but the shape stops echoing a generic comparison table.
2. **Echo the coaching cadence once more.** Add ONE imperative aside to a "Como funciona" step
   (`page.tsx:114-147`) — e.g. step 03 texto could end with a quoted correction in the same
   voice as the "O Atlas" beat ("…no português do tatame: 'não força, deixa ele vir'"). One more
   instance makes the whole page read as one coach, not one coached paragraph.

### Craft 9 → 10 (three a11y/state closes)
3. **Make the mobile index a persistent, discoverable toggle.** In `mapa-explorer.tsx`, either
   (a) keep ONE hamburger button mounted in both states and flip `aria-expanded={sidebarAberta}`
   (render an X icon when open), or (b) add an explicit in-rail "Fechar índice" button at the top
   of `mapa-sidebar.tsx` (not only the backdrop) so a keyboard/SR user can collapse the drawer
   from a labeled control. This also closes the Functionality gap (item 6).
4. **Align the onboarding hint wording with the control's accessible name.** In
   `onboarding-mapa.tsx:58`, change "toque no botão de menu" to match the control's
   `aria-label="Abrir índice"` (e.g. "toque em Abrir índice [svg]") so the hint and the AT name
   are the same words.
5. **Suppress the transient `MapHint` while the first-run onboarding note is visible.** Pass a
   prop (e.g. `suppressHint`) from `mapa-explorer.tsx` into `<Mapa>` derived from the onboarding
   open state, and gate `MapHint` on it (`mapa.tsx:421`), so a first-time mobile visitor sees one
   coach-mark, not a top pill + bottom card competing.

### Functionality 9 → 10 (one item, shared with Craft #3)
6. **Discoverable collapse affordance for the mobile drawer.** Same fix as Craft #3 — the only
   remaining wiring-completeness gap is that the open mobile index can only be collapsed via the
   backdrop, not a labeled toggle advertising `aria-expanded`. Implementing #3 closes this too.

If items 1-2 land, Originality → 10; items 3-5 → Craft 10; item 6 (= item 3) → Functionality 10,
which with Design already at 10 yields a weighted **10.0**.

## Screenshots
N/A — code-only mode. Assessment via source read of all 7 scoped files + globals.css +
opengraph-image.tsx, `pnpm test` (149 passed), clean `pnpm build` (EXIT 0, 313 SSG pages,
OG/robots/sitemap generated), and targeted hex/raw-size/secret greps (all 0 in scope).
