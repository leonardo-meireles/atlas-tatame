# Setas de anotação para figuras de BJJ — referências e vocabulário

Pesquisa de referência (research-only). Objetivo: tornar nossos *stills* 2D
estáticos legíveis para iniciantes adicionando **setas de anotação** — direção
de movimento, força/pressão e pegada — para que o aluno veja "empurra aqui,
raspa pra cá, pega aqui".

Nossa figura atual: SVG stick-figure com traço `--ink` (oponente) e `--clay`
(o laço/conexão), placeholder em `src/components/still.tsx`. As setas vivem
**por cima** dessa figura.

---

## 1. O que o GrappleMap realmente faz (e o que copiar)

GrappleMap (eel.is/GrappleMap, grapplemap.com, e o composer
`composer/index.html?<id>`) é um **grafo dirigido**: cada *vértice* é uma pose
concreta dos dois bonecos-palito, cada *aresta* é uma transição de uma pose pra
outra. Como ele comunica movimento:

- **Movimento = animação por keyframes, NÃO setas.** A própria FAQ admite que o
  sistema de animação é "very simplistic fixed-interval keyframes" (limita as
  juntas a ~5 mudanças de direção/seg). A transição é uma sequência interpolada
  de poses; o usuário vê o boneco *se mexer* em vez de uma seta indicando pra
  onde. **Não há setas de movimento nem vetores de força em lugar nenhum.**
- **Bonecos-palito minimalistas**: número mínimo de juntas, "ossos" extras só
  quando a técnica exige. Pega (grip fighting) é mal modelada — explicitamente
  uma limitação reconhecida pelo autor.
- **Controles do composer/viewer**: `external / red / blue / mirror / pause /
  random / drill / explorer / info`, mais `Prepend transition` e `Append
  transition` para montar sequências. Câmera externa, espelhar, pausar,
  perspectiva de cada jogador (red/blue).
- **Cor = identidade do jogador** (vermelho vs azul), não significado de ação.

**Bom de copiar:**
- Modelo mental de **grafo posição→transição** (já temos: `mapa.tsx`).
- Dois jogadores claramente diferenciados por cor (nós: `--ink` vs `--clay`).
- Câmera/perspectiva externa, postura limpa de stick-figure.

**Ruim / lacuna que vamos preencher:**
- Para um **still estático**, a animação por keyframes não existe — o frame
  congelado não diz nada sobre o movimento. **É exatamente aqui que entram nossas
  setas de anotação**, que o GrappleMap nunca usa. Estamos cobrindo a maior
  fraqueza de legibilidade dele.
- GrappleMap não distingue **direção** de **força** de **pegada** — tudo é só
  geometria do boneco. Nosso vocabulário de setas vai tornar isso explícito.

---

## 2. Como outras áreas comunicam MOVIMENTO e FORÇA (e a lição p/ nós)

| Domínio | Convenção observada | Lição p/ nós |
|---|---|---|
| **Apps de exercício** | Azul/vermelho = direção do **corpo**; **branco = direção da contração muscular**. Duas "camadas" de seta com cores distintas. | Separar *para onde o corpo vai* de *onde a força é aplicada* por **cor**. |
| **Biomecânica / free-body diagrams** | Força = vetor: **comprimento ∝ magnitude**, ponta indica sentido, ancorada no ponto de aplicação. | Seta de **pressão** pode usar comprimento/peso pra sugerir intensidade; ancorar no ponto de contato. |
| **IKEA / montagem** | Vocabulário fixo e pequeno: seta reta = inserir/mover; **seta curva/circular = girar/apertar**; seta pra fora = puxar/extrair; `!` = atenção; `X`-em-círculo = não faça. Mostrar a ação, não descrever. | Adotar **seta curva = rotação**. Manter o conjunto **pequeno e fixo**. Ícone de alerta opcional pro "erro comum". |
| **Labanotation / Motif** | Um símbolo codifica 4 fatores ao mesmo tempo: **forma = direção, sombreamento = nível, comprimento = duração, posição = parte do corpo**. Motif Notation = versão reduzida só com o essencial. | Não sobrecarregar um glifo com 4 significados (Laban é ilegível pra leigos). Preferir a filosofia **Motif: só o essencial**. Multiplexar no máximo 2 dimensões por seta (cor=tipo, forma da ponta=ênfase). |
| **Topo de escalada / "beta"** | Linha de rota sobre foto; **crux/esforço alto = linha mais grossa, estrela ou `!`**; setas em arco pra hazard/descida; legenda densa mas padronizada. | **Peso do traço = ênfase/esforço.** Usar com parcimônia — só o passo-chave fica grosso. Sempre ter uma **legenda** curta. |
| **Sankey / dataviz de fluxo** | **Largura da seta ∝ quantidade**; cor = categoria; ponta = direção/narrativa. Aviso recorrente: arrow encoding é ótimo pra mostrar direção SEM poluir, mas só funciona com **poucas setas**. | Largura/peso = importância; cor = categoria (tipo de ação); **limitar o número de setas** é a regra de ouro contra clutter. |

Princípio transversal de todos: **redundância controlada** (cor + forma da
ponta + estilo do traço apontando pro mesmo significado, pra funcionar em P&B,
daltonismo e telas pequenas) e **conjunto fechado e pequeno** de símbolos.

---

## 3. Vocabulário de anotação proposto (Tatame house style)

Quatro tipos de seta, mapeados nos tokens OKLCH já existentes em `globals.css`.
A cor carrega o **significado funcional** (consistente com o resto do app, onde
cor = significado), a **forma da ponta** e o **estilo do traço** dão redundância.

Tokens relevantes:
`--ink` (#quase-preto), `--clay`/`--clay-deep` (vermelho-couro, faixa/marca),
`--raspagem` (jade, "vira o jogo"), `--finalizacao` (sangue/oxblood, "acaba o
jogo"), `--perda` (ocre, atenção). Variantes `*-on-mat` para uso sobre a lona
escura.

### Os 4 tipos

**1. DIREÇÃO (movimento) — "pra onde o corpo/quadril vai"**
- Seta **reta**, traço **sólido**, ponta **cheia (triângulo fechado)**.
- Cor: **jade — `--raspagem`** (sobre lona: `--raspagem-on-mat`). É o token de
  "movimento que vira o jogo"; lê bem em papel e na lona.
- Peso: `2.5px`. Levemente arqueada (curva suave) é OK pra trajetórias.
- Uso: vetor de raspagem, sentido da passagem, deslocamento do quadril.

**2. PRESSÃO (força) — "empurra/pesa aqui"**
- Seta **reta e curta**, traço **sólido grosso**, ponta **larga em cunha
  (chevron aberto, estilo "►" achatado)**. Visualmente "pesada".
- Cor: **clay/oxblood — `--clay-deep`** (sobre lona: `--clay-on-mat`). É a cor
  da marca/força; distinta do jade da direção.
- Peso: `3.5–4px`; **comprimento curto** (força é local, não trajetória).
  Comprimento/peso podem sugerir intensidade (lição da biomecânica).
- Ancorar **no ponto de contato** apontando p/ dentro do corpo do oponente.

**3. PEGADA (contato) — "segura aqui"**
- **NÃO é seta** — é um **marcador**: anel/círculo aberto (`◎`) no ponto de
  pega, opcionalmente com um pequeno traço indicando a mão.
- Cor: **`--ink`** com preenchimento `--paper` (contraste neutro, não compete
  com as setas de ação). Sobre lona: `--on-mat`.
- Peso: anel `2px`, diâmetro pequeno (~10–14px). Numerar (1, 2) se houver duas
  pegadas em ordem.
- Mão dominante vs auxiliar: anel cheio vs anel vazado (opcional).

**4. ROTAÇÃO (giro/torção) — "gira por aqui"**
- Seta **curva/circular** (arco aberto ~270°), traço **tracejado**, ponta
  cheia. (Convenção IKEA "circular = girar".)
- Cor: herda do contexto — **jade** se for rotação de movimento (girar o corpo
  pra raspar), **clay** se for torção de força (kimura, torção do braço). O
  **tracejado** é o que marca "rotação" independentemente da cor.
- Peso: `2.5px`, traço `4 3` (dash).

### Tabela de codificação (implementável direto)

| Tipo | Significado | Cor (papel / lona) | Forma | Traço | Ponta | Peso |
|---|---|---|---|---|---|---|
| **Direção** | pra onde vai | `--raspagem` / `--raspagem-on-mat` | reta/arco suave | sólido | triângulo cheio | 2.5px |
| **Pressão** | onde empurrar | `--clay-deep` / `--clay-on-mat` | reta curta | sólido | cunha larga (chevron) | 3.5–4px |
| **Pegada** | onde segurar | `--ink` (fill `--paper`) / `--on-mat` | anel `◎` | sólido | — (sem ponta) | 2px |
| **Rotação** | girar/torcer | herda (jade/clay) | curva/arco | **tracejado 4 3** | triângulo cheio | 2.5px |
| *(opcional)* **Alerta** | erro comum | `--perda` (ocre) | `!` em círculo | — | — | — |

### Regras anti-clutter (a parte mais importante)

1. **Máximo 3 setas por figura** (idealmente 2). Lição convergente de
   Sankey/dataviz, topo de escalada e Motif Notation: arrow encoding só lê bem
   com poucas setas. Se precisar de mais, é porque são **dois frames** —
   divida em dois stills.
2. **Uma seta de ênfase por vez.** Só o *passo-chave* recebe peso grosso /
   ênfase (peso do traço = esforço, como o crux do topo). O resto fica fino.
3. **Texto com parcimônia.** No máximo 1 label curto por seta (verbo no
   imperativo: "raspa", "pesa", "puxa"). Preferir mostrar a ação a descrevê-la
   (filosofia IKEA). Numerar pegadas em vez de rotular.
4. **Redundância pra acessibilidade.** Cor + forma da ponta + estilo do traço
   apontam pro mesmo tipo — funciona em P&B, daltonismo e tela pequena. Nunca
   depender só da cor.
5. **Sempre haver uma legenda mínima** reutilizável (4 ícones) perto da figura
   ou na primeira ocorrência.
6. **Setas por cima, nunca cruzando o rosto/centro de massa** quando der —
   ancorar nos pontos de contato/articulações.
7. **Pegada (anel) é camada de baixo; setas de ação por cima.** Ordem de
   leitura: pega → direção/pressão → rotação.

---

## 4. Links de referência (takeaways)

- **GrappleMap (github.com/Eelis/GrappleMap)** — grafo posição→transição com
  bonecos-palito; movimento por **keyframes animados, zero setas**. Copiar o
  modelo de grafo; nossas setas cobrem a fraqueza dele (still estático não
  comunica movimento).
- **eel.is/GrappleMap/composer/index.html?307** — viewer/composer: controles
  external/red/blue/mirror/pause/drill, prepend/append transition. Cor = jogador,
  não ação.
- **TeachPE — Free Body Diagrams / Forces in Biomechanics**
  (teachpe.com/biomechanics/forces) — força = vetor com **comprimento ∝
  magnitude**, ancorado no ponto de aplicação. Base pra nossa seta de pressão.
- **IKEA visual grammar** (sketchboat.com/blog/the-ikea-manual...) — conjunto
  pequeno e fixo: reta=mover, **circular=girar**, fora=puxar, `!`=atenção,
  `X`=não faça; mostrar a ação em vez de descrever. Base pra rotação e alerta.
- **Labanotation / Motif Notation** (en.wikipedia.org/wiki/Labanotation;
  dancenotation.org) — um símbolo multiplexa direção/nível/duração/parte do
  corpo. Lição negativa (denso demais pra leigo) + adotar a filosofia **Motif:
  só o essencial**.
- **Climbing topos / beta** (rockclimbingrealms.com/climbing-guidebook-decoder)
  — **crux = linha mais grossa / estrela / `!`**; setas de hazard/descida;
  legenda padronizada. Base pra "peso do traço = ênfase" e legenda obrigatória.
- **Exercise app overlays** (cleveland clinic / healthline, concêntrico×excêntrico)
  — **azul/vermelho = direção do corpo, branco = contração muscular**: separar
  direção-do-corpo de aplicação-de-força por cor. Base direta do nosso par
  jade(direção) × clay(pressão).
- **Arrow encoding em dataviz / Sankey** (tandfonline 10.1080/1051144X.2021.1902039;
  CSE442 Visual Encoding, UW) — **largura ∝ magnitude**, cor = categoria, ponta =
  direção; arrow encoding mostra direção sem poluir **só com poucas setas**. Base
  da regra "máx. 3 setas".
- **Jiu-Jitsu University (Saulo Ribeiro)** — referência de legibilidade: gi azul
  vs branco pra separar os dois atletas, fotos grandes e bem espaçadas, multi-ângulo.
  Reforça: diferenciar os dois jogadores visualmente é pré-requisito antes de anotar.

---

## Vocabulário recomendado (resumo p/ implementação)

| Tipo | Cor (papel / lona) | Forma | Traço | Ponta | Peso |
|---|---|---|---|---|---|
| **DIREÇÃO** (pra onde vai) | `--raspagem` / `--raspagem-on-mat` (jade) | reta ou arco suave | sólido | triângulo cheio | 2.5px |
| **PRESSÃO** (onde empurra) | `--clay-deep` / `--clay-on-mat` (oxblood) | reta **curta** | sólido | cunha larga / chevron | 3.5–4px |
| **PEGADA** (onde segura) | `--ink` (fill `--paper`) / `--on-mat` | anel `◎` (marcador, sem haste) | sólido | sem ponta | 2px |
| **ROTAÇÃO** (girar/torcer) | herda jade ou oxblood | arco curvo (~270°) | **tracejado 4 3** | triângulo cheio | 2.5px |
| *(opcional)* **ALERTA** | `--perda` (ocre) | `!` em círculo | — | — | — |

Regras: **máx. 3 setas/figura** (ideal 2); só 1 seta de ênfase (grossa) por
vez; label curto e imperativo, parcimonioso; redundância cor+forma+traço
(nunca só cor); legenda mínima fixa de 4 ícones; pegada embaixo, setas de ação
por cima. Quando precisar de mais que 3 setas, dividir em dois stills.
