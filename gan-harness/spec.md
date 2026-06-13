# Product Specification: Atlas do Tatame — Launch Polish Pass

> Generated from brief: "tudo" — polish ALL THREE conversion/experience surfaces
> (landing, mapa explorer, preços) to launch-quality for go-to-market.

## Vision

Atlas do Tatame is the BJJ learning graph for the beginner who still gets crushed
from the bottom. It is explicitly the antithesis of the "PDF de IA" competitor: a
cartographic, hand-curated, pt-BR experience with the voice of a professor de tatame.
This is **not a rewrite** — it is a launch-quality polish pass on three working
surfaces. Every change must be incremental, reversible, token-respecting, and must
keep the existing 149 tests and the production build green.

## Design Direction (already established — respect, do not reinvent)

- **Color palette** (CSS vars in `src/app/globals.css`, OKLCH — never hardcode hex):
  - Paper surfaces: `--paper` `oklch(0.952 0.006 92)`, `--paper-2`, `--paper-edge`.
  - Ink: `--ink` `oklch(0.205 0.01 64)`, `--ink-soft`, `--ink-faint`.
  - Dark mat (graph canvas): `--mat`, `--mat-2`, `--mat-line`, `--on-mat`, `--on-mat-soft`.
  - Brand accent (faixa / couro): `--clay` `oklch(0.52 0.16 32)`, `--clay-deep`, `--clay-tint`, `--clay-on-mat`.
  - Functional-by-meaning: `--raspagem` (jade), `--finalizacao` (sangue), `--perda` (ocre), `--passagem` (índigo), each with `-tint` and `-on-mat` variants.
- **Typography**: `--font-display` (Bricolage Grotesque) for headings/numerals, `--font-sans` (Hanken) for body. Modular scale `--step--1`..`--step-4`. Tabular nums for numerals/stats.
- **Layout philosophy**: airy cartographic editorial on paper for landing/preços; dense dark "lona de tatame" canvas with a navigation rail for the mapa. The map is always the hero, not a SaaS chrome.
- **Visual identity (anti-AI-slop, enforce)**: paper grain background, EVA-tile `.tatame` texture, "Lâmina NN" plate captions, serigrafia two-tone figures, `lamina-sobe`/`conteudo-sobe`/`figura-surge` entrance animations, color == meaning. NO purple/indigo gradient heroes, NO glassmorphism, NO stock illustrations, NO generic rounded SaaS cards with drop shadows everywhere, NO emoji as iconography.
- **Inspiration**: GrappleFlows (map-primary + panel), cartographic field guides, silk-screen fight posters.

## Spacing & token rules (do-not-violate)

- Use the `--space-*` scale and `--step-*` scale via Tailwind arbitrary values, exactly as the existing files do. No raw `px` for spacing except the small intentional sub-token values already present (1–2px hairlines, dot sizes).
- All color references go through CSS vars. A code-only grep for hex literals (`#[0-9a-fA-F]{3,6}`) in the three surface files must return **zero new** matches.
- pt-BR copy only. ASCII slugs, accented display.
- Immutability everywhere; reuse `src/lib` + existing components before creating new ones.

---

## Surface 1 — Landing / Home (`src/app/page.tsx`)

### Current state
Server component. Hero ("Embaixo não é o fim. É o começo.") with a `Pictograma`
plate, "Como funciona" 3-step, honest stats grid (computed from curated graph),
`LandingMapPreview` (static SVG), princípios list, `TransicaoIndice` of saídas,
and a GrappleMap attribution note. Solid bones, honest numbers, on-brand. Gaps are
conversion craft, not structure.

### Target improvements (specific, conversion/clarity-focused)
1. **Single decisive primary CTA, repeated.** Hero CTA is good ("Começar pela guarda
   fechada →"). Add ONE closing CTA section after the saídas index (before/after the
   dataset note) that restates the value and links to `/mapa` AND `/precos` — primary
   to `/mapa` (free), secondary text link to `/precos` ("ou veja os planos"). Mirror
   the hero button styling (`bg-[var(--ink)]` pill, `hover:-translate-y-[1px]`).
2. **Price anchor on the landing.** The word "R$ 19 · pra sempre · sem mensalidade"
   must appear at least once on the landing as a trust/anchor microcopy near a CTA,
   linking to `/precos`. Today a WhatsApp/IG visitor never sees the price unless they
   hunt for it. Keep it understated (label-sized, `--ink-faint`), not a banner.
3. **Stats credibility.** Stats grid already computes honest numbers. Add a one-line
   honest caption tying the stats to the free promise ("tudo isto, de graça, sem
   cadastro"), and guard against a `0` value rendering as a bare "0" with no context
   (if any stat is 0, hide that cell rather than show an empty-looking stat).
4. **"Sem PDF de IA" proof beat.** The brand promise is the differentiator. Add a
   compact contrast strip (2 columns or a single sentence pair) that states what this
   is NOT (decoreba/PDF gerado por IA) vs what it IS (mapa curado no tatame, com o
   porquê). Reuse existing type tokens; no new illustration. This is the originality
   hook for an organic visitor.
5. **Hero figure robustness.** `Pictograma slug="guarda-fechada"` must degrade
   gracefully if the pose/still is unavailable (no broken/empty box) — confirm a
   visible fallback (glyph or label) so the first impression is never an empty frame.
6. **Section rhythm + scannability.** Ensure consistent vertical rhythm between
   sections (the existing `border-t py-[var(--space-3xl)]` pattern) and that every
   section header uses the eyebrow → h2 → lede pattern already established, so the page
   reads as one designed document, not stacked blocks.

### Files
- `src/app/page.tsx` (primary)
- May reuse: `src/components/transicao-item.tsx`, `src/components/landing-map-preview.tsx`, `src/components/pictograma.tsx`, `src/components/badges.tsx`.

### Acceptance criteria
- Landing renders server-side with no client-only dependency added to the page module.
- At least two CTAs route to `/mapa`; at least one visible link routes to `/precos`; price anchor ("R$ 19" + "sem mensalidade"/"pra sempre") appears at least once.
- A "sem PDF de IA" contrast beat is present as structured copy (not just the footer line).
- No hardcoded hex colors; all spacing via `--space-*`; pt-BR throughout.
- Stats never render a confusing bare `0`.
- `pnpm build` and `pnpm test` stay green.

---

## Surface 2 — Mapa Explorer (`src/components/mapa-explorer.tsx`, `mapa.tsx`, `mapa-sidebar.tsx`, `trilha-faixa-branca.tsx`, `onboarding-mapa.tsx`)

### Current state
Client explorer: local-subgraph view on `.tatame` canvas, sidebar rail with "Você
está aqui", Trilha Faixa Branca (numbered 7-step path), família landmarks, color
legend ("As cores das linhas"), footer hint. First-visit onboarding card (localStorage
gated). Mobile drawer with hamburger + backdrop. Esc closes the expanded node. The
beginner UX is already ~7.5/10; this is a craft + clarity refinement, not new features.

### Target improvements (specific, clarity-focused)
1. **Onboarding ↔ legend coherence.** The onboarding card says "as cores estão
   explicadas no índice ao lado" — on mobile the sidebar is a closed drawer, so "ao
   lado" is wrong/confusing. Make the onboarding copy mobile-aware (e.g. "no índice"
   / "toque no menu ☰ pra ver as cores") OR have the onboarding dismiss open the
   drawer once. Pick the lowest-risk path; copy must be correct in both layouts.
2. **Trilha progress affordance (visual only, no persistence).** The Trilha Faixa
   Branca shows the active step. Add a subtle "passo X de N" count label at the top of
   the trilha block so the beginner knows how long the path is. No localStorage progress
   (out of scope) — purely a derived count from `passosValidos`.
3. **Legend ↔ canvas parity.** The sidebar legend lists transition types present.
   Verify each legend swatch color (`meta.corOnMat`) matches the actual edge color the
   map renders for that type, so "cor == significado" holds. Document/lock this with the
   existing `tipo` helper as the single source.
4. **Empty / loading states.** While `loadExtras()` is in flight or if the filtered
   graph is empty (`grafo.posicoes.length === 0`), the canvas must show an honest
   placeholder ("carregando o mapa…" or "nada publicado ainda") instead of a blank dark
   void. Confirm the explorer handles `raiz === undefined` without crashing.
5. **Keyboard + focus polish.** Esc-to-close exists. Ensure the expanded node and the
   sidebar buttons are keyboard reachable and that `:focus-visible` (the global clay
   outline) is not clipped by `overflow-hidden` on the rail/canvas. The hamburger and
   backdrop must have correct `aria-label`s (they do — keep).
6. **"Você está aqui" always meaningful.** Confirm the rail's current-node indicator
   updates on every selection (it derives from `foco`) and that its color dot matches
   the node type, reinforcing the legend. No regression to the anchor-on-close behavior
   (view must not jump when a card closes — `centro` stays put).
7. **Reduced-motion respect.** Entrance animations already honor
   `prefers-reduced-motion`. Any new motion added must reuse the existing keyframes /
   `@media (prefers-reduced-motion: reduce)` guard — no unguarded animation.

### Files
- `src/components/mapa-explorer.tsx`, `src/components/mapa.tsx`, `src/components/mapa-sidebar.tsx`, `src/components/trilha-faixa-branca.tsx`, `src/components/onboarding-mapa.tsx`
- Reuse: `src/lib/tipo.ts`, `src/lib/local-subgraph.ts`, `src/lib/dedup-saidas.ts`, `src/content/trilhas.ts`.

### Acceptance criteria
- Onboarding copy is correct on both mobile (drawer closed) and desktop layouts.
- Trilha block shows a "passo X de N"-style count derived from valid steps.
- Empty-graph and loading paths render a visible, honest placeholder — never a blank canvas; no crash when `raiz` is undefined.
- Legend swatch colors are sourced from `tipoMeta(...).corOnMat` (single source) and match edge colors.
- No new unguarded animation; reduced-motion still respected.
- Free-exploration behavior unchanged: clicking a node expands+anchors, Esc/X/click-outside closes without view jump, mobile drawer toggles correctly.
- `pnpm build` and `pnpm test` stay green.

---

## Surface 3 — Preços (`src/app/precos/page.tsx`)

### Current state
Server component. Three plans (Faixa Branca grátis, Atlas Completo R$19 destaque,
Trilha avulsa R$12). Mercado Pago checkout via `NEXT_PUBLIC_MP_LINK_ATLAS` /
`_TRILHA` env, with safe "Em breve" fallback when env is unset. "Melhor valor" badge
on the highlighted plan. Footer reassurance line. The plumbing is done; this is layout,
proof, and conversion-copy optimization.

### Target improvements (specific, conversion-focused)
1. **Value framing over feature list.** The highlighted plan should lead with the
   single strongest line: pay-once, no subscription, "menos que uma aula". Keep feature
   lists but ensure the destaque plan's benefit ordering puts the emotional/value items
   first (acesso pra sempre, sem mensalidade) above mechanical features.
2. **Risk-reversal / trust row.** Add a compact trust strip below the plans:
   pagamento único (Pix ou cartão via Mercado Pago) · sem assinatura · grátis pra
   começar. This addresses the BR buyer's recurring-charge anxiety explicitly. Use
   label-sized type, inline separators (the existing hairline pattern), no fake
   guarantees/badges.
3. **"Em breve" must not read as broken.** When checkout env is unset, the disabled
   state must clearly communicate "abre no lançamento" rather than looking like a dead
   button. Keep it visually distinct (outlined, `--ink-faint`) but add a one-line
   helper ("checkout abre no lançamento — explore grátis enquanto isso", linking to
   `/mapa`). The free plan CTA must always work.
4. **Anchor + comparison clarity.** Make the price contrast legible at a glance: the
   free plan must visibly read as "grátis pra sempre", the R$19 as the recommended
   default (already destaque), and R$12 as the narrow-use option. Equalize card heights
   (the `min-h` pitch + `flex-1` list pattern already does most of this — verify on a
   3-up and that it degrades to 1-up on mobile cleanly).
5. **External-link hygiene.** Checkout links already use `target="_blank"` +
   `rel="noopener noreferrer"` — keep. No secrets in client code (envs are
   `NEXT_PUBLIC_*`, link-only, no API keys — confirm none added).
6. **Copy voice consistency.** Ensure pricing copy matches the professor-de-tatame
   voice and the "sem PDF de IA / sem mensalidade" brand line used on the landing, so a
   visitor who clicks from the landing feels continuity.

### Files
- `src/app/precos/page.tsx` (primary). May reuse `src/components/badges.tsx`.

### Acceptance criteria
- Highlighted plan leads with pay-once value framing; "sem mensalidade"/"pra sempre" present.
- A trust/risk-reversal strip is present (pagamento único · sem assinatura · grátis pra começar).
- "Em breve" state reads as "opens at launch" with a working free `/mapa` link, not a dead end; free plan CTA always functional.
- Checkout anchors keep `target="_blank"` + `rel="noopener noreferrer"`; no API keys/secrets introduced; env-driven links keep the safe fallback.
- 3 cards on desktop, clean 1-up stack on mobile, equal-height cards.
- No hardcoded hex; pt-BR; `pnpm build` and `pnpm test` stay green.

---

## Technical Stack (fixed — do not change)
- Frontend: Next.js 16 App Router, React 19, TypeScript 5, Tailwind 4 (`@tailwindcss/postcss`), CSS custom properties for tokens.
- Graph/figure: `@xyflow/react` + `@dagrejs/dagre`; `three.js` / `@react-three/fiber` / `drei` (figura). Static SVG preview on landing.
- Tests: Vitest + Testing Library. Package manager: pnpm.

## Do-Not-Regress List (hard constraints)
- [ ] `pnpm test` — all existing tests pass (149 at baseline). No test deleted/weakened to pass.
- [ ] `pnpm build` — production build succeeds (SSG of position/drill pages intact).
- [ ] Design tokens respected: zero new hardcoded hex; spacing via `--space-*`; type via `--step-*`/font vars.
- [ ] pt-BR copy only; ASCII slugs, accented display; professor-de-tatame voice.
- [ ] Immutability: no mutation of graph/content data; new objects only.
- [ ] Reuse-before-create: lean on `src/lib/*` and existing components; no duplicate utilities.
- [ ] `isPublicada()` gate honored — no unpublished position/transition leaks into any surface.
- [ ] Out of scope untouched: payment backend/entitlement, new content beyond guarda fechada, i18n, E5 progresso / E6 drills / E7 vídeo.
- [ ] No secrets/API keys in client code; only `NEXT_PUBLIC_*` link envs with safe fallback.
- [ ] No new unguarded animations (respect `prefers-reduced-motion`).
- [ ] Changes incremental and reversible (no large refactors of the explorer state model).

## Critical user flows (code-only assessable)
1. **Organic visitor → free map**: Lands on `/` → reads hero + how-it-works → clicks a CTA → reaches `/mapa`. (≥2 CTAs to `/mapa` present in `page.tsx`.)
2. **Beginner explores map**: `/mapa` → onboarding card (first visit) → Trilha step list → clicks a node → expanded card with passos → Esc closes without view jump. (State logic in `mapa-explorer.tsx` unchanged in behavior.)
3. **Visitor evaluates price**: `/` price anchor → `/precos` → reads value framing + trust strip → either clicks checkout (if env set) or sees a non-broken "abre no lançamento" + free `/mapa` link.
