# Webapp Jiu — Context

Web app / SaaS que ensina Jiu-Jitsu brasileiro como um grafo explorável de posições e
transições, com visual original de alta qualidade — explicitamente a antítese dos concorrentes
de PDF AI-slop. Escopo do MVP: **somente guarda fechada**. Público 100% brasileiro,
conteúdo 100% pt-BR.

## Idioma e nomenclatura

- **Conteúdo e display**: pt-BR sempre. Sem camada i18n no MVP (uma língua só, embutida).
- **Termo canônico = o mais usado no tatame brasileiro** — mistura de português e
  anglicismos. Não traduzir mecanicamente; usar o que o praticante BR realmente fala.
- **Slugs/IDs/URLs**: ASCII em português, sem acento (ex: `guarda-fechada`,
  `raspagem-tesoura`). Display mantém acento ("Guarda Fechada").

## Language (glossário)

**Posição** (`posicao`):
Configuração estável e nomeada de dois lutadores (ex: Guarda Fechada). Um nó no grafo.
_Evitar_: estado, pose (reservar "pose" pro sentido 3D/keyframe).

**Transição** (`transicao`):
Movimento direcionado de uma Posição para outra (raspagem, passagem, entrada de finalização).
Uma aresta no grafo. Tem uma perspectiva — pertence a um dos lutadores.
_Evitar_: movimento, técnica (vago demais), aresta (termo de implementação).

**Guarda Fechada** (`guarda-fechada`, raiz do MVP):
Lutador de baixo de costas, pernas em volta do tronco do oponente com tornozelos cruzados.
A única Posição-raiz do MVP.
_Evitar_: guarda full, closed guard (usar o termo BR).

**Raspagem** (`raspagem`):
Transição que inverte a dominância (de baixo → de cima) a partir de uma guarda.
_Evitar_: sweep, virada.

**Finalização** (`finalizacao`):
Transição terminal que força o tap (chave articular ou estrangulamento). Folha do grafo.
_Evitar_: submission, sub.

**Princípio** (`principio`):
Instrução conceitual ligada a uma Posição (não a uma Transição) — ex: "quebrar a postura",
"controlar um braço + um lado". O "porquê", distinto do "como".
_Evitar_: dica, conceito.

### Termos BR-canônicos relevantes ao MVP (registrar conforme surgem)

- **Quebrar a postura** — desequilibrar o oponente pra frente, base do jogo de guarda fechada.
- **Pegada** (não "grip") — controle com as mãos (manga, gola, etc).
- **Armlock** — BR fala anglicizado; preferir "armlock" a "chave de braço" no display.
- **Estrangulamento** — choke. (Ex: cruzado, guilhotina.)
- **Passagem (de guarda)** — fora do escopo MVP, mas é o termo BR para guard pass.

## Flagged ambiguities

- **"Pose" vs "Posição"**: "Posição" = conceito de BJJ (nó do grafo). "Pose" = dado
  esquelético 3D/keyframe (coordenadas de junta do GrappleMap) usado pra renderizar a
  ilustração. Uma Posição pode ser ilustrada por uma ou mais Poses.
- **Histórico**: a primeira versão deste glossário tinha termos canônicos em inglês.
  Revertido — público BR exige termo BR-canônico. Inglês fica só onde o praticante BR
  realmente fala inglês (ex: armlock).

## Out of scope (MVP)

- Passagem de guarda / jogo de cima (dobraria o grafo e exigiria modelar o lado do oponente).
- Outras guardas, montada, cem-quilos (side control), quedas.
- Link pra vídeos grátis (submissionsearcher) — futuro.
- Camada i18n / multi-idioma.

## Pipeline visual — figuras das posições (decidido via pesquisa, ver `research/`)

- **GrappleMap é DOMÍNIO PÚBLICO** (código E as ~3.600 poses, sem atribuição). Veredito:
  **PORTAR pra TypeScript**, não forkar o C++. Parser ~40 linhas, renderer ~200 linhas → R3F;
  editor é o trabalho pesado (~3-4 sem). Fonte de pose = `source_repos/GrappleMap/GrappleMap.txt`.
- Pipeline commercial-clean: poses GrappleMap (público) → renderer TS nosso → **um único
  estilo-da-casa travado** → assets pré-renderizados. Evitar SMPL/AMASS/OpenPose (research-only).
- Estilo das figuras: mannequins de cápsula 2 tons (estilo GrappleMap) — proof atual em
  `public/stills/guarda-fechada.png` (Blender, `stills/PIPELINE.md`). Diferencial: **nenhum
  concorrente renderiza figuras posadas**.
- Buyer-ID watermark entra no render. UI usa placeholders/glifo enquanto não há still.

## Modelo de apresentação (consumo do conteúdo)

- **Mapa primário + painel** (estilo GrappleFlows): grafo na lona de tatame ocupa a tela
  (`/mapa`), clicar num nó abre painel lateral (folha embaixo no mobile) com figura/vídeo/
  princípios/passos e botões das próximas saídas. Texto mínimo, navegação por conexão.
- Posição → painel com Still + princípios + saídas. Transição → vídeo + passos + "leva a".
