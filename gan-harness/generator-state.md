# Generator State — Iteration 004

## What Was Built
Push from 9.3 toward 10.0 by executing the evaluator's iter-003 punch-list exactly.
Design is already at 10 — left untouched. Every change incremental, reversible,
token-respecting, pt-BR, immutable. 149 tests + clean production build (EXIT 0, 313 SSG
pages) stay green.

## What Changed This Iteration

### Originality 9 → 10 (page.tsx)
- **Broke the symmetric "concorrente / O Atlas" two-column silhouette.** The contrast beat
  no longer reads as a generic comparison table. "O Atlas" now LEADS as a single prominent
  full-width block (larger `--step-0h` body, `inset 3px 0 0 var(--clay)` serigrafia rule,
  full-ink tone). "O concorrente" is DEMOTED to a small, quiet `--ink-faint` aside beneath
  it — a struck-through (`line-through decoration-[var(--paper-edge)]`) footnote, not an
  equal column. The form now matches the voice: we affirm, the competitor is a margin note.
- **Echoed the coaching cadence once more.** Step 03 of "Como funciona" now ends with a
  quoted live correction in the same professor voice as the "O Atlas" beat —
  "…no português do tatame: 'não força, deixa ele vir e usa o peso dele'." The page now
  reads as one coach talking across beats, not one coached paragraph.

### Craft 9 → 10 + Functionality 9 → 10 (shared #1 item)
- **Mobile index is now a real, persistent, discoverable toggle.** Chose option (a):
  ONE hamburger button stays mounted in both states (`mapa-explorer.tsx`). It toggles
  `sidebarAberta`; `aria-expanded` reflects the true state; `aria-label` switches
  "Abrir índice" / "Fechar índice"; the icon flips hamburger → X when open. Raised to
  `z-40` (above the `aside` at z-30) so it stays tappable and discoverable while the drawer
  is open — the invisible backdrop is no longer the only way to collapse. This closes both
  the Craft a11y nuance (a control that reads expanded=true to collapse) and the
  Functionality wiring gap (labeled collapse affordance).
- **Aligned onboarding hint wording with the control's accessible name.**
  `onboarding-mapa.tsx` now says "toque em **Abrir índice**" (matching the button's
  `aria-label="Abrir índice"`) instead of "toque no botão de menu". Hint copy and AT name
  are the same words; the inline hamburger SVG (still matching the real control) is kept.
- **MapHint no longer stacks with the first-run onboarding note.** `OnboardingMapa` now
  reports its visibility via an `onVisivel` callback; `mapa-explorer` tracks it in
  `onboardingVisivel` and passes `suppressHint` into `<Mapa>`, which gates `MapHint`
  (`!suppressHint && <MapHint />`). On a first mobile visit the beginner sees one
  coach-mark (the onboarding card), not a top pill + bottom card competing. When the
  onboarding is dismissed, the hint behaves as before.

## Token / Constraint Compliance
- Scoped grep `#[0-9a-fA-F]{3,6}` (page, mapa-explorer, mapa, mapa-sidebar, onboarding) → ZERO.
- Scoped grep `text-\[[0-9]` → ZERO (full modular-scale compliance preserved).
- No new unguarded animation; the global `prefers-reduced-motion` guard still covers all.
- pt-BR throughout; `isPublicada()` untouched; immutable patterns; reuse-before-create.
- Design surface untouched — no regression to the 10.

## Known Issues
- None new. `site-header.tsx` / `site-footer.tsx` still carry a few ad-hoc rem sizes but
  remain OUTSIDE the rubric's scoped surface (left untouched to keep the diff scoped).

## Dimensions that should now be 10
- Design: 10 (held, untouched).
- Originality: 10 (asymmetric contrast beat + second coaching echo).
- Craft: 10 (persistent labeled toggle, hint wording aligned, no stacked coach-marks).
- Functionality: 10 (discoverable collapse affordance for the mobile drawer).

## Dev Server
- Not started (eval-mode is code-only).
- `pnpm test`: 18 files, 149 passed.
- `pnpm build`: EXIT 0, "Compiled successfully", 313 SSG pages (clean `.next` first).
