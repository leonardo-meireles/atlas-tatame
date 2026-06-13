# Anotações didáticas das posições — fontes e raciocínio

## Problema

Reclamação do dono: uma figura sozinha não explica a posição. O praticante vê o boneco
posado mas não sabe O QUE faz aquilo ser uma guarda fechada (vs. pernas só apoiadas no
oponente). Falta o que o instrutor aponta no tatame: "olha o tornozelo cruzado", "cola o
cotovelo", "afunda o peito aqui".

## Solução de dados

`src/content/anotacoes.ts` exporta `ANOTACOES: Record<slug, Anotacao[]>`. Cada `Anotacao`
marca um ponto da figura que DEFINE a posição:

```ts
interface Anotacao {
  foco: string;   // o ponto anatômico/mecânico (ex: "tornozelos cruzados atrás das costas")
  tipo: "junta" | "pressao" | "pegada" | "controle";
  porque: string; // 1 linha do porquê tático
}
```

A UI desenha esses callouts sobre/ao lado da figura (linha + label + cor por `tipo`).

### Taxonomia de `tipo`

- **junta** — articulação/trava esquelética que ancora a posição (tornozelos cruzados, ganchos, peito do pé fisgado). Mapeia direto pra junta do GrappleMap.
- **pressao** — ponto onde o peso/força é cravado (peito no peito, joelho na barriga, cross-face).
- **pegada** — controle de mão BR-canônico (manga, gola, punho, underhook). CONTEXT.md: "Pegada", não "grip".
- **controle** — posicionamento/moldura que nega o escape sem ser junta nem pressão pura (cotovelos colados, base aberta, ângulo de quadril, queixo escondido).

## Conceitos cobertos (set MVP + vizinhança)

| slug | nome | nº anotações |
|------|------|--------------|
| `guarda-fechada` | Guarda Fechada (raiz MVP) | 6 |
| `montada` | Montada | 5 |
| `meia-guarda` | Meia-Guarda (half guard) | 5 |
| `cem-quilos` | Cem-Quilos (side control) | 5 |
| `joelho-na-barriga` | Joelho na Barriga (knee-on-belly) | 5 |
| `pegada-nas-costas` | Pegada nas Costas (back) | 6 |

Os slugs `guarda-fechada` e `montada` casam com `grafo.ts`. Os outros quatro são a
vizinhança citada no brief (ainda não nós do grafo MVP — `montada`, `cem-quilos` etc.
estão listados como out-of-scope em CONTEXT.md, mas o brief pede a anotação do conceito).

## Raciocínio por posição (BJJ real)

### Guarda Fechada
Definida pela trava de pernas. Os princípios do `grafo.ts` ditaram as anotações:
- tornozelos cruzados travam o quadril (CONTEXT.md princípio "pés cruzados controlam");
- joelhos apertam as costelas → sugam o oponente pra frente (quebra de postura);
- pegada manga + gola = "controlar sempre um braço e um lado" (princípio do grafo);
- cotovelos colados = defesa anti-passagem padrão;
- quadril em ângulo = "trabalhar em ângulo abre os ataques" (princípio do grafo).

### Montada
Posição de topo de máxima dominância. Pontos canônicos de ensino:
joelhos altos nas axilas (impedir recomposição), peso no peito, peitos do pé fisgados
sob as coxas (anti-arremesso), base de tripé com as mãos (anti-raspagem de ponte/upa),
isolar braço (entrada de montada técnica / armlock).

### Meia-Guarda
Trança em uma perna do oponente. O **underhook** é a chave universalmente ensinada
(dá ângulo, costas, raspagem). Joelho-escudo + antebraço no quadril = moldura anti-passagem.
Ficar de lado (não achatado de costas) é o erro nº1 que todo professor corrige.

### Cem-Quilos (side control)
A palavra "cem-quilos" no Brasil já carrega o conceito central: **peso no peito**.
Cross-face + underhook são o controle padrão (mata fuga de quadril e recomposição de guarda).
Joelhos colados ao quadril e base larga negam a ponte. Termo BR-canônico = "cem-quilos"
(side control em inglês), conforme o brief.

### Joelho na Barriga
Definida pelo joelho cravado no plexo + pé postado em base. Pegadas (gola pra cima, manga)
controlam e aumentam pressão. Postura ereta é o que diferencia da montada e habilita a
transição pro armlock/montada — ponto de ensino clássico.

### Pegada nas Costas (back)
Controle = **ganchos** (peitos dos pés dentro das coxas) + **seatbelt** (um braço por cima,
um por baixo). Termo BR: "pegada nas costas" / "costas". Peito colado segue os giros;
queixo escondido protege contra cotovelada; matar a mão de defesa abre o estrangulamento.
Esses são os pilares ensinados em qualquer aula de ataque às costas.

## Fontes

Conhecimento canônico de BJJ (currículo padrão de faixa branca→azul; terminologia de tatame
brasileiro). Sem scraping externo — o conteúdo é doutrina amplamente estabelecida e
consistente entre escolas (Gracie/IBJJF). Termos BR-canônicos validados contra `CONTEXT.md`
(Pegada vs grip, cem-quilos vs side control, armlock anglicizado). Princípios da guarda
fechada extraídos diretamente de `src/content/grafo.ts` pra manter consistência com o grafo.

## Notas de integração

- `Anotacao.tipo` é um union fechado — fácil mapear pra cor/ícone na UI.
- `junta` é o tipo que melhor casa com coordenadas do GrappleMap (juntas reais do esqueleto),
  útil se no futuro a anotação for ancorada a um ponto 3D da pose em vez de label flutuante.
- Mantido conciso (4-7 por conceito) pra não poluir a figura — o brief pede legibilidade.
