# PRD — Pipeline de figuras das posições (porta GrappleMap → estilo-da-casa)

Status: ready-for-agent

> Síntese consolidada das 5 pesquisas em `research/` (este PRD É a decisão final que
> "pega tudo dos outros agentes e decide o melhor"). Termos: ver `CONTEXT.md`. Apresentação
> mapa-primário + painel já construída (`/mapa`).

## Problem Statement

Cada Posição e Transição precisa de uma figura 2D clara mostrando dois lutadores na posição.
Hoje só existe um placeholder: ou o glifo de stick-figure (que o dono achou ilegível e "AI
slop") ou um render Blender posado à mão (estilo certo, mas pose imprecisa e não escala).
Sem um jeito determinístico de gerar figuras acuradas e consistentes pra **toda** posição, o
produto fica com cara de IA — exatamente o que diferencia do concorrente. Imagens geradas por
difusão (text-to-image) estão descartadas: mãos derretidas, contato quebrado, "cara de IA".

## Solution

Portar o **GrappleMap** (domínio público — código E ~3.600 poses, sem atribuição) para uma
biblioteca TypeScript que nós controlamos:

1. Um **parser** lê `GrappleMap.txt` → modelo de pose tipado (23 juntas × 2 lutadores).
2. Filtramos as poses relevantes (guarda fechada + saídas do MVP) por tags.
3. Um **renderer** desenha as duas figuras no **estilo-da-casa** (cápsulas + juntas, 2 tons),
   determinístico — mesma câmera/luz/traço pra todas, o que faz o conjunto parecer "feito por
   uma mão" e não por IA.
4. As figuras são **pré-renderizadas** em assets estáticos (PNG/SVG) no build → o web app só
   consome imagens (rápido, SEO, sem GPU no cliente).
5. Antes de fechar o estilo, **prototipar 2-3 variações de estilo-da-casa** na guarda fechada e
   escolher uma (pedido do dono: "ver as variações").

Resultado: figuras acuradas e consistentes pra qualquer posição, dirigidas por dados, com
licença 100% commercial-clean. Diferencial de mercado: nenhum concorrente renderiza figuras
posadas.

## User Stories

1. Como praticante, quero ver uma figura 2D clara de cada posição, para entender a configuração dos corpos sem ler muito texto.
2. Como praticante, quero que a figura mostre os dois lutadores distinguíveis (2 tons), para saber quem está por baixo e quem por cima.
3. Como praticante, quero que a pose seja anatomicamente correta (guarda fechada = um deitado com pernas em volta do outro ajoelhado), para confiar no conteúdo.
4. Como praticante no celular, quero que as figuras carreguem rápido, para consumir o mapa sem travar.
5. Como dono do produto, quero que todas as figuras tenham o mesmo estilo visual, para o site parecer feito por um artista e não por IA.
6. Como dono, quero gerar a figura de uma nova posição a partir de dados de pose, sem desenhar à mão, para escalar a biblioteca.
7. Como dono, quero filtrar as ~3.600 poses do GrappleMap para só as relevantes de BJJ/guarda fechada, para não poluir o conteúdo.
8. Como dono, quero traduzir os nomes das poses para os termos BR-canônicos, para casar com `CONTEXT.md`.
9. Como dono, quero comparar 2-3 variações de estilo-da-casa antes de fechar, para escolher a identidade visual com confiança.
10. Como dono, quero que o pipeline seja determinístico (mesmo input → mesmo output), para os assets serem versionáveis e diffáveis no git.
11. Como dono, quero o pipeline 100% commercial-clean (sem SMPL/AMASS/OpenPose research-only), para vender o produto sem risco legal.
12. Como agente de implementação, quero o parser do GrappleMap como módulo profundo testável, para validar contra entradas conhecidas isoladamente.
13. Como praticante, quero a figura da posição-raiz no painel do `/mapa` e no herói, para ancorar a navegação.
14. Como praticante, quero (futuro) girar/escorregar a figura num nó focado, para ver a pose em 3D — opt-in, sem pesar o resto.
15. Como dono, quero estampar um watermark com ID do comprador no render do conteúdo pago, para rastrear vazamentos.
16. Como dono, quero adicionar uma posição nova editando dados + rodando o build, para não depender de ferramenta externa.
17. Como praticante, quero que cada Transição tenha uma figura/representação do movimento, para entender o "como", não só a posição estática.
18. Como dono, quero o renderer desacoplado do web app, para trocar o estilo sem mexer no app.

## Implementation Decisions

**Decisão central (consolidada das 5 pesquisas): PORTAR o GrappleMap para TS, NÃO forkar o
C++.** GrappleMap é domínio público (código + dados, sem atribuição — `source_repos/GrappleMap/LICENSE`).
Forkar arrastaria WASM/C++/Boost/Babylon pro stack Next.js/R3F e travaria restyling. Portar
transforma `GrappleMap.txt` num dataset-semente público e nos dá controle total downstream.

Módulos (buscar módulos profundos, interface simples + testável):

- **`GrappleMapParser` (módulo profundo).** Entrada: texto de `GrappleMap.txt`. Saída: lista
  tipada de `{ posições[], transições[] }` onde cada pose/keyframe = 23 juntas × 2 lutadores
  com coordenadas 3D. Formato: blocos por linha; cada frame = 276 dígitos base62 em 4 linhas
  indentadas; coord int 0–3999 = metros, x/z offset −2, y=cima; jogador0=vermelho, jogador1=azul.
  Interface pequena e estável (`parse(text) → GrappleMapData`), implementação rica. Puro, sem I/O.
- **Modelo de pose / tipos.** `Pose` (juntas nomeadas + posições), distinto de `Posicao` do
  domínio (nó do grafo). Uma `Posicao` referencia uma ou mais `Pose` (ver ambiguidade em CONTEXT.md).
- **`FiguraRenderer`.** Recebe uma `Pose` → desenha duas figuras no estilo-da-casa. Alvo: R3F
  (cápsulas/esferas, toon flat, 2 tons, outline) e/ou SVG pra thumbnail. Constantes de raio/cor/
  limbs extraídas do GrappleMap (em `research/grapplemap-fork-port-plan.md`).
- **Pós-passo de estilo-da-casa (travado).** Um único filtro determinístico aplicado a todas as
  figuras (consistência = anti-IA). Candidatos a prototipar: (a) cápsula-toon R3F; (b) line-art
  Blender Grease-Pencil; (c) SVG line-art + svg2roughjs/halftone. Escolher 1 na fase de protótipo.
- **Pré-render (build step).** Headless (Puppeteer pra R3F, ou `blender --background`, ou SVG
  puro sem GPU) → `public/stills/<slug>.png|svg` (~1200x900, transparente). Determinístico.
- **Filtro BJJ + nomes.** Selecionar poses relevantes por tag; mapear pros slugs/nomes
  BR-canônicos do `grafo.ts`.

Decisões técnicas:
- Licenças commercial-clean apenas: three.js/R3F (MIT), Rough.js/svg2roughjs (MIT), Blender
  (GPL, output nosso), GrappleMap (domínio público). **Proibido:** SMPL/SMPL-X/STAR/AMASS
  (research-only), OpenPose (pago); Ready Player Me descontinua jan/2026.
- Estratégia híbrida de render: PNG/SVG pré-renderizado pra grafo e painel (padrão); R3F ao
  vivo só opcional num nó focado (girar/escorregar) — fase posterior.
- mannequin.js é GPL-3.0 → se usado, só em build-time (nunca no bundle do cliente).
- Fonte de pose precisa: usar dados do GrappleMap em vez de poses à mão (corrige a baixa
  legibilidade do proof atual em `public/stills/guarda-fechada.png`).

Fases:
1. **Protótipo de estilo** — ✅ FEITO. Comparados A (cápsula-toon), B (line-art), C
   (line-art + halftone) em `/prototipo`. **Escolhido: C** (serigrafia/riso, dois tons) —
   estilo-da-casa travado. O pós-passo de estilo da Fase 3 deve reproduzir o look do C de
   forma determinística (line-art + halftone com máscara por lutador, não por luminância).
2. **Parser + read-only** — `GrappleMapParser` + filtro BJJ + render das posições do MVP.
3. **Restyle/curate** — estilo travado, batch pré-render de todas as posições, nomes BR.
4. **(futuro) Editor** — reimplementar posicionamento em React/R3F (math em `src/gm.js` é JS liftável).

## Testing Decisions

Bom teste = verifica comportamento externo via interface pública, sobrevive a refactor, não
acopla em detalhe interno. Prior art: `src/lib/graph.test.ts` e `src/lib/tipo.test.ts` (Vitest,
funções puras testadas pela interface).

- **`GrappleMapParser` — testar (módulo profundo, alta prioridade).** Contra trechos conhecidos
  de `GrappleMap.txt`: dado um bloco de pose conhecido, o parser retorna as coordenadas de junta
  esperadas (decodificação base62, offsets, contagem 23×2). Casos: pose simples, transição com
  múltiplos keyframes, tags. Puro e isolado — ideal pra TDD.
- **Filtro BJJ — testar.** Dado o dataset parseado + um conjunto de tags, retorna só as poses
  esperadas; mapeamento slug→pose é estável.
- **`FiguraRenderer` — NÃO unit-testar pixel.** Saída visual; validar por inspeção visual/
  snapshot de imagem na fase de protótipo, não por teste unitário frágil. Testar só lógica pura
  extraível (ex: projeção de coordenada → posição de junta), se houver.
- Manter testes do grafo existentes verdes (8 passando).

## Out of Scope

- Editor de poses (fase 4, futuro).
- Animação / vídeo das transições (slot de vídeo já existe como placeholder no painel).
- Integração de vídeos reais (submissionsearcher) — futuro.
- Auth, pagamento (Mercado Pago), entitlement — outra track.
- R3F ao vivo no cliente pra todos os nós (só opt-in em nó focado, fase posterior).
- Forkar o C++ do GrappleMap (rejeitado).

## Further Notes

- 5 relatórios de pesquisa em `research/`: `grapplemap-fork-port-plan.md` (spec do formato +
  renderer + plano de fases), `2d-figure-pipeline.md`, `2d-stylization.md`,
  `survey-3d-body-pose.md`, `survey-web-avatar-apps.md`.
- Apresentação mapa-primário + painel já construída em `/mapa` (este PRD só cobre as figuras).
- Proof atual: `public/stills/guarda-fechada.png` + `stills/PIPELINE.md` (Blender). Estilo certo,
  pose à mão imprecisa — substituir por pose dirigida pelos dados do GrappleMap.
- Watermark buyer-ID entra no pós-passo de render do conteúdo pago.
