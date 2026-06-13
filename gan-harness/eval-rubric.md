# Evaluation Rubric — Atlas do Tatame Launch Polish

**Mode: code-only.** Playwright is NOT installed. Every check below is assessable by
reading the source of the three surfaces, running `pnpm build` and `pnpm test`, and
reasoning about the rendered output. Do not assume browser automation.

**Scope of evaluation (only these surfaces + their direct components):**
- Landing: `src/app/page.tsx`
- Mapa: `src/components/mapa-explorer.tsx`, `mapa.tsx`, `mapa-sidebar.tsx`, `trilha-faixa-branca.tsx`, `onboarding-mapa.tsx`
- Preços: `src/app/precos/page.tsx`
- Shared tokens: `src/app/globals.css`

**Scoring:** 4 dimensions, each 0–10. Weighted total = Σ(score × weight).
**Pass threshold = 7.0 weighted.** Weights sum to 1.0.

---

## Gate (must pass or the run fails regardless of score)
- `pnpm test` green (≥149 tests, none deleted/weakened).
- `pnpm build` succeeds.
- No new hardcoded hex color (`#[0-9a-fA-F]{3,6}`) in the scoped files.
- No secrets/API keys in client code (only `NEXT_PUBLIC_*` link envs).
- pt-BR copy only; no unpublished content leaked (`isPublicada` honored).

---

## Dimension 1 — Design (weight: 0.30)

Does the polished output deepen the established cartographic / serigrafia / "no AI
slop" identity using the existing token system?

Code-only checks:
- [ ] All color references in scoped files resolve through `var(--…)` tokens; zero new hex. (grep)
- [ ] Spacing uses `--space-*`; headings/numerals use `--font-display` + `--step-*`; tabular nums on numeric stats/prices.
- [ ] No AI-slop patterns introduced: no gradient hero swaps, no glassmorphism, no emoji-as-icon, no generic drop-shadow card soup. Brand motifs (paper grain, `.tatame`, "Lâmina/plate" captions, color==meaning) preserved.
- [ ] Section rhythm on landing follows the eyebrow → h2 → lede pattern consistently; preços cards equal-height and degrade 3-up → 1-up.
- [ ] Mapa dark-canvas vs paper surfaces remain distinct; sidebar rail stays "index/legend", not SaaS chrome.

Anchors: 9–10 every change reinforces the identity and reads as one designed document; 7–8 on-brand, minor inconsistencies; 5–6 functional but flattens the identity; ≤4 introduces slop or breaks the token system.

## Dimension 2 — Originality (weight: 0.20)

Does it sharpen the differentiator (professor-de-tatame voice, "sem PDF de IA", curated
map) versus a generic SaaS landing/pricing?

Code-only checks:
- [ ] Landing has an explicit "sem PDF de IA" contrast beat as structured copy (not only the footer line).
- [ ] Copy across all three surfaces carries the tatame voice; price/value framing is distinctive ("menos que uma aula", "pra sempre", "sem mensalidade"), not boilerplate "Pro/Premium" SaaS language.
- [ ] Mapa uses the graph-native metaphors ("você está aqui", trilha, cores das linhas) rather than generic dashboard chrome.
- [ ] No generic stock phrasing or filler; numerals are honest (derived from the curated graph, not invented).

Anchors: 9–10 unmistakably this product, nobody would confuse it for a template; 7–8 clearly differentiated; 5–6 generic-leaning; ≤4 indistinguishable from a SaaS starter.

## Dimension 3 — Craft (weight: 0.30)

Polish details: states, transitions, accessibility, robustness, voice continuity.

Code-only checks:
- [ ] Empty/loading/fallback states handled: mapa shows an honest placeholder when extras load or graph is empty and never a blank void; explorer safe when `raiz` is undefined; landing hero figure degrades gracefully; stats never show a confusing bare `0`.
- [ ] Animations reuse existing keyframes and stay under the `prefers-reduced-motion` guard; no unguarded motion added.
- [ ] Accessibility: keyboard reachability + visible `:focus-visible` (clay outline) not clipped by `overflow-hidden`; correct `aria-label`/`aria-current`/`role` on interactive elements (hamburger, backdrop, dialog, nav buttons).
- [ ] External checkout links keep `target="_blank"` + `rel="noopener noreferrer"`; "Em breve" reads as "opens at launch" with a working free path, not a dead button.
- [ ] Onboarding copy correct in BOTH mobile (drawer closed) and desktop layouts (the "ao lado" bug is resolved).
- [ ] Voice/visual continuity from landing → preços (same brand lines, same token usage).

Anchors: 9–10 every edge/state considered, accessible, motion-safe; 7–8 solid with a couple of gaps; 5–6 happy-path only; ≤4 broken states or a11y regressions.

## Dimension 4 — Functionality (weight: 0.20)

Do the critical flows work as code, with behavior preserved?

Code-only checks:
- [ ] Landing: ≥2 CTAs route to `/mapa`; ≥1 visible link routes to `/precos`; price anchor present.
- [ ] Mapa: select expands+anchors a node; Esc/X/click-outside closes without view jump (`centro` preserved); mobile drawer + hamburger + backdrop toggle correctly; trilha "passo X de N" count derives from `passosValidos`; legend colors sourced from `tipoMeta(...).corOnMat` (single source) and match edge colors.
- [ ] Preços: free plan CTA always works; env-set checkout renders the external anchor; env-unset renders the safe "abre no lançamento" state + free link; 3 plans render with correct prices (Grátis / R$19 / R$12).
- [ ] No regression to the explorer state model; `isPublicada` filtering intact; build SSG of position/drill pages still succeeds.

Anchors: 9–10 all three flows fully wired and behavior-preserving; 7–8 all work with a minor rough edge; 5–6 one flow partially broken; ≤4 a primary flow broken or a test/build regression.

---

## Weighted score
`total = 0.30*Design + 0.20*Originality + 0.30*Craft + 0.20*Functionality`
**Ship if total ≥ 7.0 AND all Gate items pass.**
