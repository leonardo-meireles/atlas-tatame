# Evaluation — Iteration 001

Mode: code-only (Playwright not installed; assessed by reading scoped source, running
`pnpm test` + `pnpm build`, and reasoning about rendered output).

## Gate (must pass or the run fails regardless of score)

| Gate item | Result | Evidence |
|---|---|---|
| `pnpm test` green (≥149, none weakened) | PASS | 18 files, 149 passed (2.95s). |
| `pnpm build` succeeds | PASS | EXIT 0 after clean `.next`; 313 static pages, SSG of `/posicao/[slug]` (283), `/drill/[slug]` (9), `/instrutor/[slug]` (10) intact. See note below. |
| Zero new hardcoded hex in scoped files | PASS | grep `#[0-9a-fA-F]{3,6}` across page.tsx, precos/page.tsx, mapa-explorer, onboarding-mapa, trilha-faixa-branca, mapa-sidebar, mapa.tsx → 0 matches. |
| No secrets/API keys in client code | PASS | Only `NEXT_PUBLIC_MP_LINK_ATLAS` / `_TRILHA` (link-only) in precos; no key/secret/token patterns. |
| pt-BR only; `isPublicada` honored | PASS | All copy pt-BR; `filtraPublicado` + sitemap both gate on `isPublicada`. |

**Gate: PASS (all items).**

> Build note (not a code defect): the first `pnpm build` errored with
> `ENOTEMPTY: rmdir .next/server/app` — a stale build-artifact race, not a source
> problem. `rm -rf .next && pnpm build` succeeds cleanly with EXIT 0. The generator's
> claim of a green build is accurate. Flagging only so the harness does a clean `.next`
> before gating future iterations to avoid a false failure.

---

## Scores

| Criterion | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Design Quality | 8 | 0.30 | 2.40 |
| Originality | 8 | 0.20 | 1.60 |
| Craft | 7 | 0.30 | 2.10 |
| Functionality | 9 | 0.20 | 1.80 |
| **TOTAL** | | | **Weighted total: 7.9** |

## Verdict: PASS (threshold 7.0)

---

## Dimension 1 — Design: 8/10

Strong. Every change routes color through `var(--…)` tokens, spacing through
`--space-*`, headings/numerals through `--font-display` + `--step-*` with `tabular-nums`
on every numeral (hero price anchor, stats, prices, trilha count, princípios). The new
landing sections reuse the established `border-t py-[var(--space-3xl)]` rhythm and the
eyebrow → h2 → lede pattern consistently (Como funciona, O porquê, O que isto não é).
The "O concorrente vs O Atlas" strip uses an `inset 3px 0 0 var(--clay)` rule rather
than a drop-shadow card — on-brand, no slop. Preços cards are equal-height via
`items-stretch` + `flex-1` list + `min-h-[3em]` pitch, degrading 3-up → 1-up cleanly.
Mapa dark-canvas vs paper surfaces stay distinct; the sidebar reads as index/legend, not
SaaS chrome. No gradient hero swap, no glassmorphism, no emoji-as-icon.

Why not 9: two genuine token-discipline cracks.
1. **Raw-pixel sizes proliferate in scoped files.** The hero/landing leans on
   `text-[0.78rem]`, `text-[1.05rem]`, `text-[2rem]`, `text-[1.4rem]`, `text-[1.15rem]`,
   `text-[1rem]`, `text-[0.95rem]`, `text-[0.85rem]`, etc. The spec says headings/numerals
   should ride the `--step-*` scale; several display-weight headings (`text-[2rem]` step
   number at page.tsx:136, `text-[1.4rem]` princípio numeral at :227, `text-[1.2rem]`
   plan name) bypass the modular scale. This is "functional but flattens the scale's
   single-source intent" — it works visually but is exactly the kind of ad-hoc sizing the
   token system exists to prevent.
2. **`opengraph-image.tsx` hardcodes brand color as hex** (`#1b1410`, `#241a13`,
   `#c98a63`, `#f4ece2`, `#3f8f6b`, `#c2452f`). It is out of the rubric's scoped-files
   list and Satori/`ImageResponse` cannot resolve CSS vars, so hex is defensible — but
   those hand-picked greens/reds are an *eyeballed* approximation of `--raspagem` /
   `--finalizacao`, not derived from the OKLCH tokens, so the share-card brand can drift
   from the live palette over time.

## Dimension 2 — Originality: 8/10

The differentiator is sharp and structural, not cosmetic. The "O que isto não é"
section is a real structured contrast beat (concorrente: "PDF de IA com 200 técnicas
soltas… você decora, esquece, continua apanhando embaixo" vs Atlas: "cada caminho tem
cor, princípio e passo a passo… você entende, não decora") — this is the originality
hook an organic visitor needs, and it is no longer buried in the footer. Price framing
is distinctively BR and anti-SaaS: "pra sempre · sem mensalidade", "menos que uma aula",
"pagou uma vez, é seu", plan names "Faixa Branca / Atlas Completo / Trilha avulsa"
instead of Free/Pro/Premium. The mapa keeps graph-native metaphors ("Você está aqui",
Trilha Faixa Branca, "As cores das linhas", "Montando o mapa…") rather than dashboard
chrome. Stats are honest — derived from the curated graph (`passos.length > 0` +
`isPublicada`), not invented.

Why not 9: the contrast beat reads slightly generic in shape ("competitor bad / us
good" two-column) and the concorrente column invents an unverifiable "200 técnicas"
figure — minor, but it is the one number on the page not derived from the graph, which
sits awkwardly next to the otherwise scrupulous honesty. The professor-de-tatame *voice*
is present but mostly in nouns; few sentences carry an actual coaching cadence (an
imperative, a "olha", a correction) that would make it unmistakably a person talking.

## Dimension 3 — Craft: 7/10

Solid, with real gaps. What's right: empty/loading placeholder on the lona
("Montando o mapa…") replaces the blank void; `raiz` guarded with `?.`; the `animate-pulse`
dot is covered by the universal `prefers-reduced-motion` guard (globals.css:247 zeroes
`animation-duration` on `*`), so no unguarded motion. Onboarding copy is now layout-aware
via matchMedia — desktop "ao lado", mobile "toque no menu ☰ pra abrir" — the "ao lado"
bug is resolved. Trilha shows "passo X de N" derived purely from `passosValidos`. Legend
swatches and edges both source `tipoMeta(...).corOnMat` (single source verified in
mapa.tsx:183/218/221/224) so color==meaning holds. Checkout anchors keep
`target="_blank" rel="noopener noreferrer"`; "Abre no lançamento" is clearly not a dead
button (outlined `--ink-faint` + helper line linking to `/mapa`). Stats hide a bare `0`
via `.filter(s.n > 0)`.

Why only 7 — accessibility and state correctness gaps that a senior would not ship:
1. **`aria-hidden` on the desktop sidebar can hide the live navigation.** mapa-sidebar.tsx:57
   sets `aria-hidden={!mobileAberto}`. The explorer passes `mobileAberto={mobile ? sidebarAberta : true}`,
   so on desktop it's `aria-hidden={false}` — fine. But the moment the viewport is
   mobile-width with the drawer closed, the entire `<aside>` (which on desktop is the
   only nav) is `aria-hidden=true` *and* still focusable — its buttons are translated
   off-canvas via `translateX(-100%)` but remain in the tab order. That's the classic
   "focusable inside aria-hidden" a11y violation: a keyboard/screen-reader user can Tab
   into hidden, off-screen nav buttons. Add `inert` (or `tabIndex={-1}` + `visibility:hidden`
   on the closed state) instead of relying on transform alone.
2. **Hero fallback glyph is `aria-hidden` and the `<figure>` has only a generic label.**
   page.tsx:77 `aria-label="Figura da guarda fechada"` is fine, but if `Pictograma`
   returns null the visible content is a decorative SVG marked `aria-hidden` plus a tiny
   "Guarda fechada" caption — acceptable, but the figure communicates nothing structural
   to AT beyond the label. Low severity; the degrade-gracefully requirement is met
   visually.
3. **Two independent matchMedia listeners for the same breakpoint** (mapa-explorer.tsx:56
   and onboarding-mapa.tsx:27) duplicate the `(max-width: 767px)` query. Not a bug, but
   it's a missed reuse — a `useIsMobile()` hook in `src/lib` would be the DRY move and
   the spec explicitly asks to reuse-before-create.
4. **`role="dialog"` on the onboarding card without focus management.** onboarding-mapa.tsx:46
   declares `role="dialog" aria-label` but does not trap or move focus, and Esc (handled
   globally in the explorer) closes the *expanded node*, not the dialog. A `role="dialog"`
   that ignores Esc and never receives focus is a misleading role — either downgrade to a
   non-modal `role="note"`/`region`, or wire focus + its own Esc. Right now the global Esc
   handler and the dialog semantics are uncoordinated.
5. **Voice/visual continuity landing → preços is good but not perfect:** the landing's
   anchor says "R$ 19 · pra sempre · sem mensalidade" and preços leads "Comece de graça.
   Destrave tudo por menos que uma aula." — continuous. Minor: landing uses "atlas
   completo" lowercase as a phrase while preços titles the plan "Atlas Completo"; trivial.

## Dimension 4 — Functionality: 9/10

All three critical flows are wired and behavior-preserving.
- **Landing:** 2 CTAs to `/mapa` (hero pill :51, closing pill :292); 2 visible links to
  `/precos` (price anchor :63, closing secondary :298); price anchor "R$ 19" +
  "sem mensalidade" + "pra sempre" present. Server component, no client-only import added.
- **Mapa:** `escolher` expands + anchors via `setCentro`; `fechar` only clears `sel`,
  leaving `centro` put (no view jump on close — verified in state model). Esc handler
  (mapa-explorer.tsx:80), mobile drawer + hamburger + backdrop toggle correctly with
  matched `aria-label`s. Legend colors from the single `tipoMeta` source match edge
  colors. "passo X de N" derives from `passosValidos`. `isPublicada` filter intact.
- **Preços:** free CTA always routes to `/mapa`; env-set checkout renders external anchor
  with correct rel; env-unset renders the safe "Abre no lançamento" + free link; 3 plans
  render Grátis / R$ 19 / R$ 12 with the destaque "Melhor valor" badge.

Why not 10: the destaque plan's CTA `href: "/mapa"` (precos/page.tsx:59) is dead config
in the env-set branch (the anchor uses `p.checkout`, not `p.href`), and in the env-unset
branch the `cta` string "Garantir meu acesso" is never rendered — both are harmless but
are unused fields that will mislead the next editor. Tighten the `Plano` model so paid
plans don't carry an ignored `href`.

---

## What Improved Since Last Iteration
- Baseline iteration; improvements measured against the pre-polish surfaces described in
  the spec's "Current state" notes:
  - Landing gained a real price anchor, a structured "sem PDF de IA" beat, a closing CTA,
    an honest stats caption, and a never-empty hero figure fallback.
  - Mapa fixed the "ao lado" mobile-onboarding bug, added "passo X de N", and added an
    honest empty/loading placeholder instead of a blank lona.
  - Preços added value-first benefit ordering, a risk-reversal trust strip, and turned
    "Em breve" into a non-broken "Abre no lançamento" with a working free path.

## What Regressed Since Last Iteration
- None. Tests, build, and the explorer state model are intact.

---

## Prioritized improvements for Iteration 2 (highest score-impact first)

1. **[Craft, a11y — biggest mover]** Fix the focusable-inside-`aria-hidden` sidebar.
   In `mapa-sidebar.tsx`, when closed on mobile add `inert` to the `<aside>` (or
   `visibility:hidden` + `tabIndex={-1}` on its buttons) so off-canvas nav is not Tab-
   reachable while `aria-hidden`. This is the one true a11y violation and the clearest
   lever from 7 → 8 on Craft.

2. **[Craft, semantics]** Reconcile the onboarding `role="dialog"`
   (`onboarding-mapa.tsx`). Either (a) downgrade to `role="note"`/`region` since it is a
   dismissible non-modal hint, or (b) keep `dialog` and add focus-on-open + its own Esc.
   Current state is a role that lies about its behavior.

3. **[Design, tokens]** Move the display-weight ad-hoc sizes onto the `--step-*` scale:
   the `text-[2rem]` step numeral (`page.tsx:136`), `text-[1.4rem]` princípio numeral
   (`:227`), and the plan name `text-[1.2rem]` (`precos:113`). Keeps the modular scale as
   the single source and pushes Design toward 9.

4. **[Originality, honesty]** Replace or source the invented "200 técnicas" in the
   concorrente column with either a non-numeric jab or a graph-derived contrast, so the
   contrast beat keeps the page's otherwise-scrupulous numeric honesty.

5. **[Functionality, cleanliness]** Tighten the `Plano` type in `precos/page.tsx` so paid
   plans don't carry an ignored `href`/`cta` (the destaque `href: "/mapa"` is dead in the
   checkout branch). Removes misleading config.

6. **[Craft, DRY]** Extract the duplicated `matchMedia("(max-width: 767px)")` logic
   (mapa-explorer + onboarding-mapa) into a single `useIsMobile()` hook in `src/lib`.

7. **[Design, brand drift]** Derive the `opengraph-image.tsx` palette from the OKLCH
   token values (compute hex once from the tokens, comment the provenance) so the share
   card cannot drift from the live brand — Satori can't read CSS vars, but the values can
   be sourced rather than eyeballed.

## Screenshots
N/A — code-only mode (Playwright not installed). Assessment via source read +
`pnpm test` (149 passed) + `pnpm build` (EXIT 0, 313 SSG pages) + targeted greps.
