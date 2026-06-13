# Evaluation — Iteration 004

Mode: code-only (Playwright not installed). Assessed by reading every scoped source file,
running a clean `rm -rf .next && pnpm build` + `pnpm test`, and targeted hex/raw-size/secret
greps. Built on iteration 3 (9.3). Each iter-3 punch-list item was verified by reading the
actual file — not by trusting the generator summary.

## Gate (must pass or the run fails regardless of score)

| Gate item | Result | Evidence |
|---|---|---|
| `pnpm test` green (≥149, none weakened) | PASS | 18 files, 149 passed (2.35s). No test deleted/weakened; graph/figura purity suite untouched. |
| `pnpm build` succeeds (clean) | PASS | `rm -rf .next` then build → EXIT 0, "Generating static pages (313/313)", `/posicao/[slug]` (283) + `/drill/[slug]` (9) + `/instrutor/[slug]` (10) + `/opengraph-image` + `/robots.txt` + `/sitemap.xml` all generated. |
| Zero new hardcoded hex in scoped files | PASS | grep `#[0-9a-fA-F]{3,6}` across page.tsx, precos/page.tsx, mapa-explorer, mapa, mapa-sidebar, trilha-faixa-branca, onboarding-mapa → 0 (exit 1). OG hex remains the named `OG` constant, out of scope. |
| Scoped raw `text-[N…]` sizes | PASS (bonus) | grep `text-\[[0-9]` across all 7 scoped files → 0. Type still fully on `--step-*`. |
| No secrets/API keys in client code | PASS | grep `sk-/api-key/secret/bearer/password/token` → 0. Only `NEXT_PUBLIC_MP_LINK_*` link envs in precos. |
| pt-BR only; `isPublicada` honored | PASS | All copy pt-BR; `filtraPublicado` (mapa-explorer.tsx:19-37) gates de/para/slug; landing stats gate at page.tsx:21-27. |

**Gate: PASS (all items).**

---

## Scores

| Criterion | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Design Quality | 10 | 0.30 | 3.00 |
| Originality | 10 | 0.20 | 2.00 |
| Craft | 10 | 0.30 | 3.00 |
| Functionality | 10 | 0.20 | 2.00 |
| **TOTAL** | | | **Weighted total: 10.0** |

## Verdict: PASS — **10/10 reached.**

---

## Iter-3 punch-list — verified resolved by reading the files

**Originality 9 → 10**

1. **Two-column "concorrente / O Atlas" silhouette broken — DONE.** page.tsx:249-271 is no
   longer a symmetric 2-up grid. "O Atlas" now LEADS as a single full-width block
   (`max-w-[60ch]`, `--step-0h` body, `boxShadow: inset 3px 0 0 var(--clay)` serigrafia rule,
   full-ink tone). "O concorrente" is demoted to a quiet `--ink-faint` aside beneath it
   (page.tsx:264-270) with the competitor claim itself struck through
   (`line-through decoration-[var(--paper-edge)]`). The form now matches the voice — the page
   affirms in a plate, the competitor is a margin footnote. The one remaining generic-table
   silhouette on the landing is gone.
2. **Coaching cadence echoed once more — DONE.** "Como funciona" step 03 (page.tsx:129-133)
   now ends with a quoted live correction in the same professor voice as the "O Atlas" beat:
   "…no português do tatame: 'não força, deixa ele vir e usa o peso dele'." The page now reads
   as one coach talking across beats, exactly the move iter-3 named. The cadence is no longer
   isolated to a single paragraph.

**Craft 9 → 10 + Functionality 9 → 10 (shared toggle item)**

3. **Mobile index is now a persistent, discoverable toggle — DONE (option a).**
   mapa-explorer.tsx:149-161: ONE hamburger button stays mounted whenever `mobile` is true,
   in BOTH drawer states. `onClick` flips `setSidebarAberta((v) => !v)`;
   `aria-expanded={sidebarAberta}` now reflects the TRUE state (no longer hardcoded `false`);
   `aria-label` switches "Fechar índice"/"Abrir índice"; the icon flips hamburger
   (`M4 7h16M4 12h16M4 17h16`) → X (`M6 6l12 12M18 6L6 18`) at line 158. It sits at `z-40`,
   above the `aside` at `z-30` (mapa-sidebar.tsx:54) and the backdrop at `z-20`
   (mapa-explorer.tsx:140), so it remains tappable and discoverable while the drawer is open —
   the backdrop is no longer the only collapse path. This closes the Craft a11y nuance (a
   labeled control that advertises `aria-expanded=true` to collapse) AND the Functionality
   wiring gap in one move. `aria-controls="mapa-indice"` still resolves to the aside's id
   (mapa-sidebar.tsx:53).
4. **Onboarding hint wording aligned with the control's accessible name — DONE.**
   onboarding-mapa.tsx:63-81: the mobile branch now reads "toque em **Abrir índice** [svg] pra
   abrir", matching the button's `aria-label="Abrir índice"` verbatim. The inline hamburger SVG
   (same `M4 7h16…` path as the real control) is kept and `aria-hidden`. Hint copy and AT name
   are now the same words; the desktop branch correctly still reads "ao lado" (line 83).
5. **MapHint no longer stacks with the first-run onboarding note — DONE.** Verified the full
   chain: `OnboardingMapa` reports visibility via `onVisivel` (onboarding-mapa.tsx:13,29-32,
   firing on `aberto` and on unmount) → `mapa-explorer` tracks it in `onboardingVisivel`
   (state at :62, wired at :188) and passes `suppressHint={onboardingVisivel}` into `<Mapa>`
   (:184) → `Mapa` accepts `suppressHint` (mapa.tsx:355,367-368) and gates the hint
   `{!suppressHint && <MapHint />}` (mapa.tsx:424). On a first mobile visit the beginner sees
   one coach-mark (the onboarding card), not a top pill + bottom card competing. When the
   onboarding is dismissed, `onVisivel(false)` flips `suppressHint` off and MapHint behaves as
   before. The cleanup `return () => onVisivel?.(false)` also prevents a stuck-suppressed hint
   on unmount.

All five iter-3 items are genuinely resolved in source — confirmed by reading, not by summary.

---

## Dimension 1 — Design: 10/10 (held)

Untouched this iteration and still earns the 10. Color routes through `var(--…)` everywhere
(scoped hex grep = 0); spacing through `--space-*`; type fully single-sourced on `--step-*`
(scoped `text-\[[0-9]` grep = 0); `tabular-nums` on every numeral and price. The new
asymmetric contrast beat (page.tsx:249-271) reuses the existing `inset 3px 0 0 var(--clay)`
serigrafia rule rather than introducing a card-soup drop shadow — it deepens, not flattens, the
identity. No gradient hero swap, no glassmorphism, no emoji-as-icon, no SaaS chrome on the mapa
rail. The dark `.tatame` canvas stays distinct from paper. There is no in-scope design defect to
point at. **10.**

## Dimension 2 — Originality: 10/10 (was 9)

The two structural gaps that held it at 9 are both closed. The contrast beat's *silhouette* —
the last piece of the landing whose shape echoed a generic comparison table — is gone: the
affirmation now leads as a full-width plate and the competitor is a struck-through margin note,
so the layout's form carries the brand's stance instead of borrowing a SaaS pattern. The
coaching voice now recurs (step 03 quoted correction + the "O Atlas" beat), so the page reads as
one professor across beats rather than one coached paragraph in an editorial document. Price
framing stays unmistakably BR and anti-SaaS ("pra sempre · sem mensalidade", "menos que uma
aula", plan names Faixa Branca / Atlas Completo / Trilha avulsa); mapa keeps graph-native
metaphors ("Você está aqui", Trilha Faixa Branca, "As cores das linhas"); numerals stay honest
(`numFinais`/`numRaspagens`/`numVideos` computed from the curated graph, page.tsx:23-27). Nobody
would mistake this for a template. **10.**

## Dimension 3 — Craft: 10/10 (was 9)

All three residual a11y/state nuances from iter-3 are closed:
- The mobile index is now a single persistent toggle that flips `aria-expanded` true/false and
  swaps its accessible name + icon, layered above the drawer so a keyboard/SR user can collapse
  it from a labeled control — not only the backdrop.
- The onboarding hint and the control's accessible name are now the same words ("Abrir índice").
- The transient MapHint is suppressed while the first-run onboarding note is visible, so a
  first-time mobile visitor gets one coach-mark, not two competing.

Everything right in iter-3 holds: `inert` + `aria-hidden` on the closed drawer
(mapa-sidebar.tsx:63-64) keeps off-canvas nav out of the tab order and AT tree; `role="note"`
is the honest non-modal semantics; the "Montando o mapa…" placeholder (mapa-explorer.tsx:162-174)
covers both `loadExtras` in-flight and nothing-published, never a blank void; `raiz` is guarded
(`?.`, :49,51,52); `centro` stays put on close (`fechar` only clears `sel`, :77) so no view jump;
legend swatches and edges both source `tipoMeta(...).corOnMat`; the global
`prefers-reduced-motion` guard covers the MapHint keyframes (no new unguarded motion — the only
animation added, the `animate-pulse` dot, is a Tailwind utility under that same global guard);
checkout anchors keep `rel="noopener noreferrer"`. No edge or state left open. **10.**

## Dimension 4 — Functionality: 10/10 (was 9)

The single remaining wiring-completeness gap (the open mobile drawer collapsible only via the
backdrop) is closed by the persistent labeled toggle. All three critical flows are fully wired
and behavior-preserving:
- **Landing:** 2 CTAs to `/mapa` (hero pill :50, closing pill :298); 2 visible links to
  `/precos` (price anchor :63, closing secondary :304); price anchor "R$ 19 · pra sempre · sem
  mensalidade" present; "sem PDF de IA" beat is structured copy (:237-272). Server component, no
  client-only import.
- **Mapa:** `escolher` expands + anchors via `setCentro` (:66-75); `fechar` preserves `centro`
  (:77); Esc handler (:78-82); mobile drawer + persistent toggle (`aria-expanded` reflecting
  state) + backdrop all toggle correctly; legend from the single `tipoMeta` source;
  `isPublicada` filter intact; `raiz` undefined-safe; empty/loading placeholder honest.
- **Preços (in scope, unchanged this iter — no regression):** free CTA always routes to `/mapa`;
  env-set checkout renders the external anchor with correct rel; env-unset renders the safe
  "abre no lançamento" + free link; 3 plans render Grátis / R$ 19 / R$ 12.

No regression to the explorer state model; build SSG of position/drill pages still succeeds. **10.**

---

## What Improved Since Iteration 3
- **Originality 9 → 10:** asymmetric contrast beat (affirmation plate + struck-through competitor
  aside) breaks the comparison-table silhouette; second coaching echo in step 03.
- **Craft 9 → 10:** persistent labeled hamburger toggle (`aria-expanded` now truthful + X icon);
  hint wording matches the control's accessible name; MapHint suppressed under onboarding.
- **Functionality 9 → 10:** discoverable, labeled collapse affordance for the mobile drawer.

## What Regressed Since Iteration 3
- None. 149 tests pass unchanged; clean build EXIT 0 with 313 SSG pages; explorer state model and
  `isPublicada` gate intact; Design surface untouched (no regression to its 10).

---

## Verdict: 10/10 reached — punch-list empty.

Delta vs iter 3: **9.3 → 10.0 (+0.7).** Design held at 10; Originality 9 → 10; Craft 9 → 10;
Functionality 9 → 10. Every iter-3 item was implemented as specified and verified in source. No
remaining gap. Gate green on all six items.

Optional, non-blocking observations (NOT required for the 10, outside the deductible criteria):
- The persistent hamburger (`z-40`) and the onboarding note (`z-40`) share a z-layer, but they
  occupy non-overlapping corners (toggle top-left, note bottom-anchored), so there is no visual
  collision. No action needed.
- `site-header.tsx` / `site-footer.tsx` still carry a few ad-hoc rem sizes — explicitly OUTSIDE
  the rubric's scoped surfaces, correctly left untouched to keep the diff scoped.

## Screenshots
N/A — code-only mode. Assessment via source read of all 7 scoped files + mapa.tsx signature/gate,
`pnpm test` (149 passed), clean `rm -rf .next && pnpm build` (EXIT 0, 313 SSG pages), and
targeted hex/raw-size/secret greps (all 0 in scope).
