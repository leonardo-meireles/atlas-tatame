# Corpus de tradução BJJ pt-BR — backlog completo do GrappleMap

> Deliverable de dados: `src/lib/grapplemap/pt-br-names-extra.ts` (1139 entradas
> auto-geradas), mesclado em `PT_BR_NAMES` por `src/lib/grapplemap/pt-br-names.ts`.
> Gerador determinístico: `.scratch/gen-pt-br-extra.test.ts`.
> Camada hand-curada de referência (style guide): as ~250 entradas de
> `PT_BR_NAMES_CURATED` + `research/gm-translations.md`.

Este corpus cobre TODO o resto do GrappleMap que não estava na camada curada:
**600 posições distintas** e **812 transições distintas** (por `gmKey`), das quais
**494 posições + 665 transições estavam sem tradução** antes deste trabalho.
Backlog após esta entrega: **0**.

## Método

O vocabulário do GrappleMap é fortemente **composicional** ("side control w/ head&arm
vs neck frame", "bottom gets reverse 2-on-1"). Traduzir 1159 rótulos à mão seria
inconsistente e propenso a erro. Em vez disso, um **tradutor determinístico** aplica
as convenções da casa:

1. **Glossário de frases** (match mais longo primeiro) sobre o nome tokenizado —
   ~300 frases multi-palavra mapeadas para o termo BR-canônico.
2. **Glossário de palavras** para o que sobra (verbos, partes do corpo, conectores).
3. **Conectores** normalizados: `w/`→com, `w/o`→sem, `&`/`+`→e, `vs`→vs, `to`→para,
   `from`→de, `on`→no, `in`→na, `for`→pro.
4. **Title Case** com preposições/conectores minúsculos (de, com, vs, na, pra...).
5. **Slug** ASCII-kebab sem acento derivado do nomeBR (espelha `fallbackSlug`),
   de-duplicado contra todos os slugs existentes (curados + extra).
6. **`tipo`** (só transições) inferido por regex: raspagem / finalizacao /
   perda-de-guarda / ataque (default).

Saídas de frase são protegidas (separador interno) pra que, p.ex., "body lock"
não tenha o "lock" re-traduzido como "travar".

## Decisão por termo — traduzir vs manter original

Princípio (CONTEXT.md + `gm-translations.md`): **termo canônico = o mais falado no
tatame brasileiro** — uma mistura de português e anglicismos aceitos. O BJJ brasileiro
mantém muito termo em inglês/japonês; traduz o vocabulário core de posição/ação/corpo.

### Mantidos no original (anglicismo de tatame / nome próprio)

Confirmado por glossários BR (bjjheroes PT, bjj.pro.br, amarelocipobjj, muitomaisacao):
o praticante brasileiro fala estes termos em inglês/japonês no dia a dia.

| Termo EN | pt-BR (mantido) | Por quê |
| --- | --- | --- |
| berimbolo | Berimbolo | gíria BR de origem ("berimbolar"); universal |
| leg drag | Leg Drag | falado em inglês; "arrastada de perna" é raro |
| x-guard / single leg x | Guarda-X / Single Leg X | falado em inglês |
| single leg / double leg | Single Leg / Double Leg | "baiana" existe p/ double, mas single/double dominam no tatame |
| de la riva | De la Riva | nome próprio (Ricardo de la Riva) |
| truck, twister | Truck, Twister | sem termo BR; falados em inglês |
| omoplata, monoplata | Omoplata, Monoplata | omoplata já é pt; ambos universais |
| kimura | Kimura | nome próprio (Masahiko Kimura) |
| anaconda, d'arce, brabo | Anaconda, D'Arce, Brabo | estrangulamentos por nome próprio |
| heel hook, toe hold | Heel Hook, Toe Hold | leglock terminology em inglês |
| underhook, overhook→sobre-gancho, whizzer, crossface | idem / Sobre-Gancho | underhook/whizzer/crossface ficam; overhook vira "sobre-gancho" (já curado) |
| lockdown, body lock, grapevine, seatbelt | idem | controles falados em inglês |
| frame, pummel, clinch, sprawl | idem | termos de tatame em inglês |
| ashi, slx, gogoplata, spider web | idem | nomes próprios / posições importadas |
| over/under | Over-Under | falado em inglês |
| fireman's carry, uchi-mata, o-soto-gari, ouchi-gari, seoi-nage | idem | quedas de judô pelo nome japonês |
| kesa-gatame, kuzure-kesa-gatame | idem | judô |
| nomes idiomáticos do GrappleMap | New Jersey, Honey Hole, Electric Chair, Cocoon, Crab Ride, Stoner Control, Gangsta Lean, Tony Montana, Jaws of Life, Jedi Mind Trick, Millenium Falcon, The Homer, Old School, Safe Haven, Cement Job, Sorcerer, Broomstick, Jailbreak, Spladle, Funk, Barzegar | gírias/coined names sem equivalente BJJ-padrão; mantidos verbatim como nome próprio |

### Traduzidos (vocabulário BR canônico)

| Termo EN | pt-BR | Fonte / razão |
| --- | --- | --- |
| rear naked choke / rnc | Mata-leão | termo BR universal |
| knee on belly / kob | Joelho na Barriga | glossário BR padrão |
| side control / judo side | Cem-Quilos / Cem-Quilos de Judô | voz do projeto (já curado) |
| back mount / back control | Pegada nas Costas | "pega/tomada das costas" |
| half guard / closed guard / open guard | Meia-Guarda / Guarda Fechada / Guarda Aberta | glossário BR |
| spider guard | Guarda-Aranha | glossário BR |
| butterfly (guard) | Guarda de Gancho | termo BR (já curado) |
| north/south | Norte-Sul; choke→Estrangulamento Norte-Sul | glossário BR |
| mount (high/low) | Montada (Alta/Baixa) | glossário BR |
| turtle | Tartaruga | glossário BR |
| guillotine | Guilhotina | glossário BR |
| triangle / arm triangle | Triângulo / Triângulo de Braço | glossário BR |
| armbar / arm bar | Armlock | CONTEXT.md prefere "armlock" |
| knee bar | Chave de Joelho | glossário BR |
| calf crank | Calf Slicer | uso BR mais comum que "esmaga-panturrilha" |
| sweep / hip bump sweep / pendulum | Raspagem / Raspagem de Quadril / Raspagem de Pêndulo | glossário BR |
| pass (and variants) | Passagem (...) | glossário BR ("passagem de guarda") |
| takedown / throw | Queda | glossário BR |
| escape | Fuga; hip escape→Fuga de Quadril | glossário BR |
| collar tie | Pegada de Nuca | já curado |
| wrist control | Controle de Punho | já curado |
| front headlock | Gravata Frontal | glossário BR |
| neck crank | Gravata de Pescoço | glossário BR |
| figure four | Figura-Quatro | já curado |
| knee slice / knee slide | Joelho Cortando | já curado |
| double unders / double overs | Duplo por Baixo / Duplo por Cima | já curado |
| seoi-nage (drop) | Seoi-nage Ajoelhado | judô + descritor BR |
| partes do corpo / ações | braço, perna, joelho, quadril, cabeça, pescoço, punho, cotovelo, ombro, pé, tornozelo, gancho, pegada, gola, costas, prender, agarrar, empurrar, puxar, virar, rolar, soltar, recuperar, encaixar, pisar, cortar | tradução direta pt-BR |
| narração de quem-faz | De Cima / De Baixo / Para / De | já curado; o GrappleMap narra a ação |

## Convenções de estilo (alinhadas às ~250 curadas)

- **nomeBR**: Title Case. Preposições e conectores minúsculos no meio:
  `de, da, do, com, sem, na, no, vs, e, pra, pro, para, em, por, a, o`. Acentos pt-BR
  preservados ("Triângulo", "Cem-Quilos", "Mata-leão", "Em Pé").
- **slug**: ASCII-kebab, sem acento, sem barra (`/`→`-`), igual à saída de
  `fallbackSlug`. Único entre TODAS as entradas (curadas + extra); colisões ganham
  sufixo `-2`, `-3` (ex.: `raspagem-de-quadril-2`, `mata-leao-2` quando já há outro).
- **Manter inglês quando**: é nome próprio (pessoa/técnica), gíria de tatame falada
  em inglês, queda de judô (nome japonês), ou coined name do GrappleMap sem equivalente.
- **Capitalização de nomes próprios hifenizados**: corrigida explicitamente
  (D'Arce, De la Riva, O-soto-gari, Uchi-mata, Seoi-nage, Kesa-gatame, New Jersey).
- **`tipo`** só em transições: `raspagem` (sweep), `finalizacao` (submission),
  `perda-de-guarda` (passagem/abertura/levantada/fuga), `ataque` (default — setup,
  pegada, avanço de controle não-terminal).

## Limitações / pontos a revisar à mão

São **96 chaves** marcadas pelo heurístico do gerador (`research/extra-flagged.txt`).
A grande maioria é **legítima** (nomes próprios/anglicismos mantidos de propósito:
Truck, Twister, Berimbolo, Lockdown, Seatbelt, etc.). Itens que um revisor de tatame
pode querer ajustar:

1. **Concordância de gênero em conectores genéricos** — `on`→"no", `in`→"na" aplicados
   uniformemente; em alguns compostos sai levemente torto (ex.: "Cem-quilos no
   Estrangulamento Braço Lado"). Aceitável numa camada derivada; refinável por frase.
2. **Ordem adjetivo×substantivo** — `reverse X` foi tratado caso a caso para os mais
   comuns ("Leg Drag Invertido", "Triângulo Invertido"); compostos raros podem sair
   como "Invertida X".
3. **Termos sem fricção mas com escolha estilística** — `combat base`→"Base de Combate"
   (já curado), `over/under`→"Over-Under" (mantido em inglês). Decisão de casa, não erro.
4. **Tokens residuais não-traduzíveis** — abreviações/artefatos do GrappleMap como
   `...a`, `?`, `wip`, `(un)kneel`, `air 300`, `kick-up2`, `snapdown2` ficam quase
   verbatim por não terem significado de técnica. Esperado.

Regenerar após mexer no glossário:
`./node_modules/.bin/vitest run --config .scratch/vitest.gen.config.ts .scratch/gen-pt-br-extra.test.ts`

## Fontes

- BJJ Heroes — Dicionário/Vocabulário de Jiu Jitsu (PT): https://www.bjjheroes.com/dicionario-de-jiu-jitsu
- BJJ Heroes — The Truck / The Berimbolo: https://www.bjjheroes.com/techniques/the-truck , https://www.bjjheroes.com/techniques/the-berimbolo
- bjj.pro.br — Dicionário do Jiu-Jitsu / Leg Drag / Double Leg: https://bjj.pro.br/categoria/dicionario-do-jiu-jitsu
- Amarelo Cipó — Glossário de Jiu-Jitsu: https://amarelocipobjj.com.br/glossario-de-jiu-jitsu/
- Muito Mais Ação — Melhor Dicionário de Jiu Jitsu: https://muitomaisacaojiujitsu.com.br/2015/08/melhor-dicionario-de-jiu-jitsu.html
- Wikipédia (pt) — Lista de técnicas do jiu-jitsu: https://pt.wikipedia.org/wiki/Lista_de_t%C3%A9cnicas_do_jiu-jitsu
- Sharpen Iron Academy — BJJ Terms with Portuguese Translations: https://sharpenironacademy.com/blog/frequently-used-bjj-terms-descriptions-translations
