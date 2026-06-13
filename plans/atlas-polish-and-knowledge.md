# Blueprint: Atlas Jiu-Jitsu — Polish de UI/UX + Base de Conhecimento Curada

**Modo**: direto (sem git remote / gh — edição in-place, sem branch/PR).
**Objetivo**: deixar o SaaS polido e coeso (menos "AI slop"), navbar e hierarquia de cor melhores, thumbnails e figura repensadas, opcional `/mapa-v2` (grafo + vídeo, sem animação 3D), e uma base de conhecimento de BJJ **verdadeira e curada** ingerida de fontes externas → traduzida pt-BR.
**Stack**: Next 16 + React 19 + TS + Tailwind 4 (tokens OKLCH em `globals.css`), pnpm. Gate por passo: `pnpm exec tsc --noEmit` · `pnpm test` (156) · `rm -rf .next && pnpm build` (exit 0).

## Proveniência + atribuição (Workstream D) — autorizado pelo dono
**Decisão do dono**: fontes são públicas, o projeto é **open-source**, uso **autorizado**. D0 não bloqueia — vira **registro de proveniência + atribuição** (boa prática OSS) + reescrita própria das definições (qualidade anti-slop, não cópia verbatim).
| Fonte | Tipo | Plano |
|---|---|---|
| ubershmekel/bjjdata | open-source (GitHub) | ✅ ingerir + atribuir |
| kaggle grappling-techniques | dataset | ✅ ingerir; registrar licença do dataset + atribuir |
| vicos.si jiujitsu | dataset acadêmico (vídeo) | ✅ usar; **citar o paper/lab** (norma acadêmica) |
| bjjheroes / jiujitsubrotherhood | glossários (texto) | ✅ usar como **lista de termos** + **reescrever definição em pt-BR próprio** (melhor voz + atribui) |
| grappleflows.com | concorrente comercial | ✅ autorizado; na prática bloqueia scraping (Cloudflare/ToS) → priorizar estudo de estrutura/UX + Firecrawl onde passar |
Cada nó ingerido carrega `fonte` + `sourceUrl` + `licenca` (proveniência rastreável = exigência do open-source).

---

## Grafo de dependências (modo direto)

```
A1 (design tokens) ──┬─→ A2 (navbar) ──┐
                     ├─→ B1 (thumbnails)├─→ B2 (polish surfaces) ─→ C1 (/mapa-v2)
                     └─→ ............... ┘
D0 (gate licença) ─→ D1 (ingest) ─→ D2 (schema) ─→ D3 (tradução pt-BR) ─→ D4 (curadoria) ─→ D5 (merge no grafo)

Paralelo: trilha A/B/C (front-end)  ∥  trilha D (dados). Independentes até D5.
Dentro de A/B/C: A1 primeiro (fundação); A2+B1 paralelos; B2 depois; C1 por último.
```

Total: **11 passos**. Paralelizáveis: {A2, B1} após A1; trilha D inteira em paralelo à trilha A/B/C.

---

## Passo A1 — Sistema de design: contraste + hierarquia (fundação)
**Contexto**: Dor central do dono — "cores muito parecidas, difícil destacar o importante; AI slop". A paleta atual (`globals.css`) é toda neutro-quente próxima (paper/clay/funcionais), com pouca separação de **superfície vs ação vs ênfase**. `/prototipo` já tem 3 direções exploradas (A latão+Fraunces, B aço+Hedvig, C musgo+Instrument). 
**Tarefas**:
1. Rodar `/impeccable` (craft) pra travar UMA direção de cor/fonte (do `/prototipo` ou nova) com **acento secundário** distinto do clay pra ênfase/hierarquia.
2. Em `globals.css`: aumentar a separação de luminosidade entre `--paper`/`--paper-2`/`--paper-edge` (superfícies legíveis), introduzir o acento secundário escolhido como token, e uma escala de ênfase clara (texto primário/secundário/faint com mais contraste).
3. Garantir contraste WCAG AA em texto sobre todas as superfícies.
**Mirror**: tokens OKLCH existentes (`globals.css:9-73`), `tipoMeta` (cor=significado).
**Verificação**: `pnpm build`; checagem manual de contraste; nada de hex cru novo.
**Exit**: paleta com hierarquia clara (superfície/ação/ênfase separadas), 1 direção travada, build verde.

## Passo A2 — Navbar redesign  *(paralelo a B1, depende de A1)*
**Contexto**: "navbar estranha". Hoje `site-header.tsx`: logo + Planos + CTA, estado ativo já existe mas o dono ainda acha estranho.
**Tarefas**: rodar `/impeccable` no header; repensar layout/peso/divisões; usar o acento secundário de A1 pra marcar seção ativa com clareza; revisar mobile.
**Mirror**: `site-header.tsx` (usePathname/ativo já implementado).
**Verificação**: build + checar `/`, `/mapa`, `/precos` desktop+mobile.
**Exit**: navbar lê como intencional, seção ativa óbvia, mobile sem amputar.

## Passo B1 — Thumbnails dos nós  *(paralelo a A2, depende de A1)*
**Contexto**: "thumbnails não tão legais". Hoje os nós do grafo (`mapa.tsx` NodeThumb/NodeCard) usam still/figura pequena.
**Tarefas**: redesenhar o card-nó — still 2D limpo (não 3D), nome legível, cor de tipo clara, badge de acesso; migrar `<img>` → `next/image` (perf deferida P2). Estilo serigrafia/halftone travado da marca.
**Mirror**: `mapa.tsx` NodeThumb, `still.tsx`, `tipoMeta`.
**Verificação**: build; checar `/mapa`.
**Exit**: thumbnails legíveis e on-brand, sem cara de placeholder.

## Passo B2 — Polish impeccable das superfícies  *(depende de A1, A2, B1)*
**Contexto**: "UIUX desconexo/confuso". Aplicar coesão em home, /precos, node-expandido com os tokens novos.
**Tarefas**: rodar `/impeccable` + skills (`typeset`, `layout`, `polish`) em `page.tsx`, `precos/page.tsx`, `node-expandido.tsx`; hierarquia de seção, ritmo de espaço, ênfase com acento secundário; aplicar os P1 de UI do `docs/impeccable-audit.md` + persona PRD (`.claude/prds/atlas-persona-fixes.prd.md`).
**Verificação**: build + percorrer fluxo como faixa-branca.
**Exit**: 3 superfícies lêem como um documento só, coeso.

## Passo C1 — `/mapa-v2` (grafo + vídeo, sem animação 3D)  *(depende de B2)*
**Contexto**: dono acha "vídeos/animação estranhos"; quer alternativa: só o **grafo de posições + vídeos**, sem R3F animado.
**Tarefas**: nova rota `src/app/mapa-v2/page.tsx` reusando `graph.ts`/`xyflow`/`localSubgraph`/`tipoMeta` mas o nó expandido mostra **still 2D + vídeo + passos** (sem `FiguraR3F`/animação). Manter trilha/legenda/onboarding. É uma vista paralela (não substitui `/mapa` ainda — A/B teste).
**Mirror**: `mapa-explorer.tsx`/`node-expandido.tsx` (remover só o `FiguraR3F`), `video-embed.tsx`.
**Verificação**: build (rota nova no SSG); `/mapa-v2` carrega leve, sem WebGL.
**Exit**: `/mapa-v2` funcional, mais leve, sem animação; dono compara com `/mapa`.

---

## Passo D0 — Proveniência + atribuição das fontes
**Contexto**: uso autorizado pelo dono (público + open-source). D0 registra proveniência, não bloqueia.
**Tarefas**: pra cada fonte, registrar `sourceUrl` + licença/atribuição exigida em `docs/research/fontes-conhecimento.md` (vira o NOTICE/ATTRIBUTION do repo OSS); definir o método de ingestão por fonte (API/JSON/Firecrawl).
**Verificação**: doc de proveniência completo (6 fontes, licença + atribuição).
**Exit**: mapa de fontes com atribuição pronto pro NOTICE do open-source.

## Passo D1 — Ingestão das fontes permitidas  *(depende de D0)*
**Contexto**: puxar dados só das fontes ✅/⚠️ aprovadas em D0.
**Tarefas**: scripts em `scripts/ingest/` (TS via tsx) — bjjdata (JSON do GitHub), kaggle/vicos se aprovados, glossários como **lista de termos** (não definições). Salvar cru em `docs/research/raw/` (não em `src/content` ainda). Firecrawl pode ajudar nos sites permitidos.
**Mirror**: `src/lib/grapplemap/parser.ts` (padrão de parse→tipos), `scripts/` existente.
**Verificação**: arquivos crus salvos + contagem por fonte.
**Exit**: dados crus das fontes aprovadas em disco, com proveniência (sourceUrl/licença).

## Passo D2 — Schema unificado de conhecimento  *(depende de D1)*
**Contexto**: normalizar fontes heterogêneas num modelo único.
**Tarefas**: estender `src/lib/types.ts` (ou novo `knowledge.ts`) — posição/técnica/transição/termo com proveniência (`fonte`, `licenca`, `sourceUrl`). Mapear cada fonte → schema. Dedup por conceito (reusar `concept-collapse.ts`).
**Mirror**: `types.ts`, `concept-collapse.ts`, `curator-validators.ts`.
**Verificação**: `pnpm test` (novos testes de normalização); tsc.
**Exit**: dataset unificado tipado + testes.

## Passo D3 — Tradução pt-BR canônica  *(depende de D2)*
**Contexto**: traduzir pro "melhor pt-BR do tatame"; **manter inglês onde o termo é inventado/usado em inglês** (armlock, underhook, leg drag…). Já existe `pt-br-names*.ts` com 1.139 entradas.
**Tarefas**: estender o mapa de tradução; regra: termo BR-canônico (CONTEXT.md) senão mantém EN. Flag de baixa-confiança pra revisão humana.
**Mirror**: `pt-br-names.ts`/`pt-br-names-extra.ts`, glossário do CONTEXT.md.
**Verificação**: testes de tradução (casos EN-mantido vs traduzido); tsc.
**Exit**: dataset traduzido, termos EN preservados onde correto, baixa-confiança marcada.

## Passo D4 — Curadoria + revisão de verdade  *(depende de D3)*
**Contexto**: "100% verdadeiro" exige revisão (não publicar dado cru/errado). Reusar os 10 validadores + gate `isPublicada`.
**Tarefas**: rodar `runAllValidators` no dataset; marcar `status: rascunho` por padrão; revisão técnica (humana + agente) por nó antes de `publicado`; descartar/flag duvidoso.
**Mirror**: `curator-validators.ts`, `pose-meta.ts` (status gate).
**Verificação**: relatório de validação (erros/warns) zerado nos publicados.
**Exit**: subconjunto revisado marcado `publicado`; resto fica `rascunho`.

## Passo D5 — Merge no grafo do produto  *(depende de D4 + B2)*
**Contexto**: integrar o conhecimento curado ao `grafo.ts`/conteúdo, expandindo além da guarda fechada com verdade.
**Tarefas**: merge incremental dos nós publicados em `src/content`; respeitar `isPublicada`; atualizar sitemap. Sem quebrar o MVP atual.
**Verificação**: build (páginas novas no SSG); `runAllValidators`; fluxo manual.
**Exit**: grafo expandido só com conteúdo curado+verdadeiro; gate verde.

---

## Riscos
| Risco | Prob | Mitigação |
|---|---|---|
| Scrape de grappleflows = legal/anti-marca | Alta | D0 marca ❌; só estudo de UX |
| Licença restritiva (vicos/kaggle) | Média | D0 decide; default referência, não ingestão |
| Tradução automática erra termo do tatame | Média | D3 flag baixa-confiança → D4 revisão humana |
| Trocar paleta quebra contraste/tokens | Média | A1 com checagem WCAG + build por passo |
| `/mapa-v2` vira manutenção dupla | Média | é A/B temporário; decidir 1 vencedor depois |
| Dado "100% verdadeiro" sem revisão humana | Alta | D4 gate `rascunho`→`publicado` obrigatório |

## Acceptance global
- [ ] Paleta com hierarquia clara (A1); navbar e thumbnails on-brand (A2,B1); superfícies coesas (B2)
- [ ] `/mapa-v2` leve sem animação (C1)
- [ ] Gate de licença documentado, grappleflows excluído (D0)
- [ ] Conhecimento ingerido→normalizado→traduzido→**revisado** antes de publicar (D1-D4)
- [ ] Só conteúdo curado entra no grafo (D5); gate verde em todo passo
