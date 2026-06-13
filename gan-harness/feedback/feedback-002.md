# Evaluation — Iteration 002

Mode: code-only (Playwright not installed; assessed by reading scoped source, running
`pnpm test` + clean `pnpm build`, and targeted greps). Built on iteration 1 (7.9).

## Gate (must pass or the run fails regardless of score)

| Gate item | Result | Evidence |
|---|---|---|
| `pnpm test` green (≥149, none weakened) | PASS | 18 files, 149 passed (2.32s). No test deleted/weakened; suite covers `src/lib` graph/figura purity, untouched this iter. |
| `pnpm build` succeeds | PASS | Clean `rm -rf .next` first, then EXIT 0 — "Compiled successfully", TS clean, 313 static pages, SSG of `/posicao/[slug]` (283), `/drill/[slug]` (9), `/instrutor/[slug]` (10) intact. |
| Zero new hardcoded hex in scoped files | PASS | grep `#[0-9a-fA-F]{3,6}` across page.tsx, precos/page.tsx, mapa-explorer, mapa-sidebar, onboarding-mapa, use-is-mobile, trilha-faixa-branca, mapa.tsx → 0 matches. |
| No secrets/API keys in client code | PASS | Only `NEXT_PUBLIC_MP_LINK_ATLAS` / `_TRILHA` (link-only) in precos. No api-key/secret/sk-/bearer/password patterns. |
| pt-BR only; `isPublicada` honored | PASS | All copy pt-BR; `filtraPublicado` (mapa-explorer.tsx:19-37) still gates on `isPublicada` for de/para/slug. |

**Gate: PASS (all items).**

> Build note: confirmed the iter-1 stale-`.next` ENOTEMPTY flake — the first `rm -rf .next`
> hit `Directory not empty` (watcher/handle race), a second `rm -rf .next` cleared it, and
> `pnpm build` then ran clean to EXIT 0. The generator's green-build claim is accurate.

---

## Scores

| Criterion | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Design Quality | 9 | 0.30 | 2.70 |
| Originality | 9 | 0.20 | 1.80 |
| Craft | 8 | 0.30 | 2.40 |
| Functionality | 9 | 0.20 | 1.80 |
| **TOTAL** | | | **Weighted total: 8.7** |

## Verdict: PASS (threshold 7.0)

---

## Iter-1 items — verified resolved by reading the files

1. **Focusable-inside-`aria-hidden` sidebar (the one true a11y violation) — FIXED.**
   `mapa-sidebar.tsx:49` derives `fechadoNoMobile = !mobileAberto`; `:62-63` applies
   `aria-hidden={fechadoNoMobile}` **and** `inert={fechadoNoMobile}` together. When the
   drawer is closed on mobile, `inert` removes every child from the tab order and the AT
   tree — the off-canvas nav is no longer Tab-reachable. On desktop the explorer passes
   `mobileAberto={mobile ? sidebarAberta : true}`, so both flags stay off. Correct fix,
   exactly as prescribed. This is the lever that moves Craft 7 → 8.

2. **Onboarding `role="dialog"` semantics — FIXED.** `onboarding-mapa.tsx:43` is now
   `role="note"` with a comment documenting why (non-modal, no focus trap, no own Esc;
   global Esc closes the expanded node, not the card). The role no longer lies about
   behavior it lacks. The lowest-risk of the two prescribed options, correctly chosen.

3. **Ad-hoc display sizes → `--step-*` — FIXED.** grep confirms zero remaining
   `text-[2rem]` / `text-[1.4rem]` / `text-[1.2rem]` in the scoped files. `page.tsx:136`
   step numeral and `:167` stat numeral now ride `text-[length:var(--step-2)]`; `:227`
   princípio numeral rides `text-[length:var(--step-1)]`; `precos/page.tsx:125` plan name
   rides `text-[length:var(--step-1)]`. 13 `length:var(--step-*)` references across the
   two paper surfaces — display-weight type is back on the single modular scale.

4. **Invented "200 técnicas" honesty regression — FIXED.** `page.tsx:251-253` now reads
   "um monte de técnica solta" — no number. The only `200` tokens left on the landing are
   `duration-200` (two CTA pills) and an SVG `viewBox="0 0 200 150"` (the fallback glyph)
   — both legitimate. The page's numeric honesty is fully restored: every figure on it is
   graph-derived (`numFinais`/`numRaspagens`/`numVideos` computed at :23-27).

5. **`Plano` discriminated union + DRY `useIsMobile` — FIXED.** `precos/page.tsx:20-37`
   splits into `PlanoGratis` (carries `href`+`cta`) and `PlanoPago` (carries `cta`+optional
   `checkout`, **no** dead `href`). The render (`:147-179`) discriminates on `!p.pago` first
   so TS narrows cleanly across the three branches; behavior is identical, but the type now
   matches what each branch renders — the dead `href:"/mapa"` on the destaque plan is gone.
   `src/lib/use-is-mobile.ts` (new) exports `MOBILE_QUERY` + `useIsMobile()`, SSR-safe
   (starts `false`, syncs on mount, cleans up its listener). Both `mapa-explorer.tsx:54`
   and `onboarding-mapa.tsx:17` consume it; the explorer keeps its drawer-close side-effect
   in a separate `useEffect([mobile])` (:57-59) rather than duplicating the matchMedia. This
   is the reuse-before-create move the spec asked for, done well.

All five targeted items from iteration 1 are genuinely resolved in source — not just claimed.

---

## Dimension 1 — Design: 9/10 (was 8)

The two token-discipline cracks that capped iter-1 at 8 are closed: the ad-hoc display
sizes are on `--step-*`, and the landing/preços read as one designed document — eyebrow →
h2 → lede on every section, consistent `border-t py-[var(--space-3xl)]` rhythm, the
contrast strip uses `inset 3px 0 0 var(--clay)` (not a drop-shadow card), preços cards
equal-height via `items-stretch` + `min-h-[3em]` pitch + `flex-1` list, degrading 3-up →
1-up. Mapa dark-canvas vs paper stays distinct; sidebar reads as index/legend with the
brand gradient (`color-mix` of `--mat-2`/`--clay`), not SaaS chrome. Color routes through
tokens everywhere; tabular-nums on every numeral and price. No slop introduced.

Why not 10: the in-scope files are now clean, but a handful of body-copy sizes remain
ad-hoc (`text-[1.05rem]`, `text-[0.95rem]`, `text-[0.78rem]`, etc.). These are *body/label*
sizes, not display headings, so they're outside the spec's "headings/numerals on `--step-*`"
mandate and defensible — but a true 10 would have a `--step--1`/`--step--2` rung for the
recurring `0.78rem` eyebrow and `0.95rem` lede so even body type is single-sourced. The
out-of-scope `opengraph-image.tsx` still uses eyeballed brand hex (acknowledged, Satori
can't read CSS vars) — not penalized here as it's outside the rubric's scoped files.

## Dimension 2 — Originality: 9/10 (was 8)

The honesty regression that capped iter-1 is gone: removing the invented "200 técnicas"
means the one off-key note in an otherwise scrupulously graph-derived page is silenced, and
the "O que isto não é" beat now lands as a clean non-numeric jab ("um monte de técnica
solta, sem ordem e sem o porquê … você decora, esquece, e continua apanhando embaixo" vs
"cada caminho tem cor, princípio e passo a passo … você entende, não decora"). That is the
differentiator stated structurally, not in the footer. Price framing stays unmistakably BR
and anti-SaaS: "pra sempre · sem mensalidade", "menos que uma aula", "pagou uma vez, é seu",
plan names "Faixa Branca / Atlas Completo / Trilha avulsa". Mapa keeps graph-native
metaphors ("Você está aqui", Trilha Faixa Branca, "As cores das linhas", "Montando o mapa…").

Why not 10: the contrast beat is now honest but still a two-column "competitor bad / us
good" *shape*, and the professor-de-tatame voice lives mostly in nouns — few sentences carry
an actual coaching cadence (an imperative, an "olha", a live correction) that would make it
read as a specific person talking rather than well-chosen brand copy. That's the last reach
to a 10 and it's a copywriting move, not a code one.

## Dimension 3 — Craft: 8/10 (was 7) — improved as targeted

Craft moved from 7 to 8, driven by the two highest-leverage fixes: the `inert` sidebar
(the genuine a11y violation is gone) and the honest `role="note"` onboarding (the role no
longer misrepresents behavior). Everything that was right in iter-1 is preserved: empty/
loading placeholder on the lona ("Montando o mapa…", mapa-explorer.tsx:153-165) instead of
a blank void; `raiz` guarded with `?.`; the `animate-pulse` dot covered by the universal
`prefers-reduced-motion` guard; onboarding copy layout-aware via `useIsMobile()` (desktop
"ao lado", mobile "toque no menu ☰ pra abrir"); legend swatches and edges both source
`tipoMeta(...).corOnMat`; checkout anchors keep `target="_blank" rel="noopener noreferrer"`;
"Abre no lançamento" is a clearly-non-dead state with a free `/mapa` link; stats hide a bare
`0` via `.filter(s.n > 0)`. The new `useIsMobile` hook is SSR-safe and cleans up its listener.

Why not 9 — residual a11y/state gaps a senior would still close:
1. **Hamburger ↔ drawer relationship has no `aria-expanded`/`aria-controls`.**
   mapa-explorer.tsx:143 the "Abrir índice" button has a correct `aria-label` but doesn't
   advertise it controls the `<aside>` nor its open/closed state. A screen-reader user gets
   "Abrir índice, button" with no signal that activating it reveals a region. Add
   `aria-expanded={sidebarAberta}` + `aria-controls` pointing at the aside id.
2. **Onboarding ☰ glyph is a literal character (`<span aria-hidden>☰</span>`,
   onboarding-mapa.tsx:57) referencing the real hamburger SVG icon** — they're visually
   different shapes. Minor copy/visual mismatch: the hint points at "☰" but the actual
   control renders a 3-line SVG path. Harmless, but a pixel-perfect pass would reuse the
   same glyph or say "o botão de menu".
3. **`role="note"` is the honest downgrade, but the card still auto-appears over the canvas
   without ever moving focus to it** — fine for a `note` (non-modal), so this is now correct
   rather than a bug; noting only that a dismiss-on-Escape for the note itself (distinct from
   the node Esc) would be a nicety, not a requirement.
4. **Two `useEffect`s key on `mobile` across explorer** (the `loadExtras` mount effect and
   the drawer-close `[mobile]` effect) — clean, no issue; flagged only to confirm the DRY
   extraction didn't introduce a redundant listener (it didn't — single matchMedia in the hook).

None of these is a violation or a broken state; they're the polish delta between 8 and 9.

## Dimension 4 — Functionality: 9/10 (was 9) — held, cleaner internals

All three flows remain wired and behavior-preserving, and the `Plano` discriminated union
makes the preços branches provably exhaustive instead of carrying dead config.
- **Landing:** 2 CTAs to `/mapa` (hero pill :50, closing pill :291); 2 visible links to
  `/precos` (price anchor :63, closing secondary :297); price anchor "R$ 19 · pra sempre ·
  sem mensalidade" present (:64, :301). Server component, no client-only import.
- **Mapa:** `escolher` expands + anchors via `setCentro`; `fechar` only clears `sel`, so
  `centro` stays put (no view jump on close); Esc handler (:75-79); mobile drawer +
  hamburger + backdrop toggle with matched `aria-label`s; legend from the single `tipoMeta`
  source; "passo X de N" from `passosValidos`; `isPublicada` filter intact; `raiz` undefined-safe.
- **Preços:** free CTA always routes to `/mapa` (the `!p.pago` Link branch); env-set checkout
  renders the external anchor with correct rel; env-unset renders "Abre no lançamento" +
  free link; 3 plans render Grátis / R$ 19 / R$ 12 with the destaque "Melhor valor" badge.

Why not 10: the iter-1 dead-config nit (`href`/`cta` on paid plans) is now resolved by the
union, so the remaining gap is purely the Craft-side `aria-expanded`/`aria-controls` on the
hamburger — a wiring-completeness item, not a broken flow. No functional regression anywhere.

---

## What Improved Since Iteration 1
- **A11y:** the focusable-inside-`aria-hidden` sidebar is fixed with `inert` (Craft 7 → 8).
- **Semantics:** onboarding `role="dialog"` → honest `role="note"`.
- **Tokens:** all three flagged display-weight sizes moved onto `--step-*` (Design 8 → 9).
- **Honesty:** invented "200 técnicas" removed; landing is fully graph-derived (Originality 8 → 9).
- **Types/DRY:** `Plano` discriminated union drops dead `href`; `useIsMobile` hook removes
  the duplicated matchMedia (reuse-before-create satisfied).

## What Regressed Since Iteration 1
- None. 149 tests pass unchanged, build EXIT 0 with 313 SSG pages, explorer state model and
  `isPublicada` gate intact.

## Remaining improvements (low-impact; diminishing returns)
1. **[Craft]** Add `aria-expanded={sidebarAberta}` + `aria-controls="<aside id>"` to the
   hamburger so the drawer relationship is announced. Highest-value remaining item.
2. **[Design]** Add `--step--1`/`--step--2` rungs and migrate the recurring body/label sizes
   (`0.78rem` eyebrow, `0.95rem` lede) so even non-heading type is single-sourced.
3. **[Craft]** Make the onboarding "☰" hint match the actual hamburger glyph (reuse the SVG
   or say "o botão de menu").
4. **[Originality]** Inject one or two imperative/coaching sentences (a real "olha, …" or a
   correction) so the professor-de-tatame voice reads as a person, not brand nouns.
5. **[Design, out-of-scope]** Derive `opengraph-image.tsx` hex from the OKLCH tokens once,
   commented, so the share card can't drift from the live brand.

## Screenshots
N/A — code-only mode. Assessment via source read + `pnpm test` (149 passed) + clean
`pnpm build` (EXIT 0, 313 SSG pages) + targeted hex/secret/token greps.
