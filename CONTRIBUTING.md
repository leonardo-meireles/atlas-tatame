# Contributing to Atlas Jiu-Jitsu

Thanks for your interest. Contributions that improve the BJJ content, graph structure, or core UX are welcome.

## What's in scope

- **Content**: new positions, transitions, step-by-step explanations (pt-BR only)
- **Bug fixes**: graph layout, 3D renderer, parser edge cases
- **Validator improvements**: new rules in `src/lib/curator-validators.ts`
- **Accessibility**: keyboard navigation, screen reader labels

Out of scope for now: i18n, guard passing / top game, new payment/auth features (project is free and open).

## Setup

```bash
git clone https://github.com/leonardo-meireles/atlas-tatame.git
cd atlas-tatame
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # must pass before any PR
```

Requires Node 20+ and pnpm 10+.

## Adding content

All curated data lives in `src/content/grafo.ts`. Vocabulary follows the Brazilian mat — see the glossary in `CONTEXT.md` before naming anything. Slugs are ASCII kebab-case (`guarda-fechada`), display names use accents.

After editing `grafo.ts`, run the validators:

```bash
pnpm test
```

Validators catch orphan nodes, English names, missing 3D assets, and annotation drift before they reach the live atlas.

## Adding a position or transition

1. Add the entry to `src/content/grafo.ts`
2. Add step-by-step content (transitions) or annotations (positions with setas)
3. Check `src/lib/figura/pose-meta.ts` — new items default to `DIFERIDOS` (hidden) until a 3D pose/frame is available
4. Run `pnpm test` — fix any validator warnings before opening a PR

## Code conventions

- **pt-BR** in all content and display strings. ASCII in slugs/IDs/URLs.
- **No mutations** — create new objects, never mutate graph data.
- **Early return** over nested conditionals.
- **No comments** unless the WHY is non-obvious (a hidden constraint, a workaround for a specific bug).
- Pure functions in `src/lib/` — no side effects, no React imports, testable in isolation.

## Pull request checklist

- [ ] `pnpm test` passes (all validators, all unit tests)
- [ ] `pnpm build` succeeds (SSG, no type errors)
- [ ] `pnpm lint` clean
- [ ] New content is pt-BR and follows the glossary in `CONTEXT.md`
- [ ] No new positions exposed without a 3D pose (use `DIFERIDOS` gate)

## Reporting issues

Open a GitHub issue. Include: what you expected, what happened, and — for content issues — the BJJ position/technique name in both pt-BR and English if you know both.
