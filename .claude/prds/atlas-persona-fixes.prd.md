# PRD: Fixes do teste com 5 personas — Atlas do Tatame

**Status**: backlog priorizado · **Data**: 2026-05-29
**Origem**: workflow ECC de personas (faixa-branca total, faixa-azul, professor faixa-preta, cético anti-IA, comprador na dúvida) percorrendo o fluxo crítico (home → /mapa → 1ª técnica → /precos).
**Nota**: a fase de aplicação foi cortada por limite de sessão (reseta 18:40). Nada aplicado ainda — este PRD é o backlog pra retomar.

## Contexto
Produto coeso e com voz forte (as 5 personas elogiaram a voz de professor + a seção "O que isto não é"). Os atritos são de **confiança** (vídeos furados, sem autoridade humana, sem garantia) e **clareza no mobile** (trilha/legenda escondidas no drawer, jargão sem tradução). Resolver isto destrava conversão sem reescrever nada.

## Atritos consensuais (3+ personas) — topo da fila
1. **Vídeos de terceiros incoerentes/errados/duplicados** quebram a curadoria (5/5). → C1, C2, C3
2. **Sem prova social / sem rosto de faixa-preta / sem credencial** (4/5). → H4, PR1
3. **Checkout cai em "Abre no lançamento" — não dá pra comprar** (2+ risco). → PR2
4. **Trilha + legenda de cores escondidas no drawer fechado (mobile)** (3/5). → M1, M2
5. **Figura 3D placeholder/lenta mina a tese anti-IA** (4/5). → M5, H2

## Backlog priorizado por superfície

### CONTEÚDO — `src/content/grafo.ts`, `trilhas.ts`, `lib/types.ts`
| # | Sev | Problema | Fix |
|---|---|---|---|
| C1 | P0 | Armlock (l.169) e Triângulo (l.187) usam o MESMO vídeo (NSqMHNQkzEc) — quebra zelo | Trocar o vídeo de uma, ou ocultar player na que reusa (só passos+figura) |
| C2 | P0 | Hip bump (l.250) = vídeo EN "Kids BJJ", auto-marcado "recurar" — e é passo 2 da trilha | Remover o `youtubeId` errado → cai em "em breve", ou achar embed pt-BR adulto |
| C3 | P0 | Kimura meia-guarda (l.300) linka vídeo que não é kimura-finalização | Remover/trocar `youtubeId` |
| C4 | P1 | Toda raspagem aponta `para: "montada"` — tesoura cai muito em meia-guarda, não montada limpa | Corrigir `para` realista ou nota |
| C5 | P1 | Trilha põe finalização antes de raspagem + mistura free/paid | Reordenar `TRILHA_FAIXA_BRANCA`: posição → raspagens → finalizações crescentes |
| C6 | P0 | Jargão sem tradução inline ("quebre a postura", "manga e gola", "underhook", "figura-4") | Glossário inline leve no 1º uso, ou termo com tooltip em node-expandido |
| C7 | P1 | Falta "erro comum"/defesa por técnica (o `.impeccable.md` prometia Situação/Erro/Princípio) | Campo opcional `erroComum` em `Transicao` + render |

### MAPA — componentes mapa/node-expandido/sidebar/onboarding/trilha
| # | Sev | Problema | Fix |
|---|---|---|---|
| M1 | P0 | Trilha numerada (responde "por onde começo") enterrada no drawer fechado no mobile | Promover trilha a herói do 1º acesso mobile (abrir índice na trilha, ou CTA pós-onboarding) |
| M2 | P0 | Legenda de cores só vive no drawer fechado — toco na linha e não sei se é bom/ruim | Chip de legenda inline persistente no canvas/card (mobile) |
| M3 | P1 | Onboarding manda "tocar na linha" (alvo minúsculo) — instinto é tocar no nó | Copy: "Toque numa bolinha (posição) ou na linha colorida" |
| M4 | P1 | "raspar"/"finalizar" vagos pro zero-vocabulário | Legenda: "Raspa = virar e ficar por cima · Finaliza = acaba a luta" |
| M5 | P0 | "Carregando figura…" + chunk three pesado = vazio no mobile, abandono | Still 2D imediato (já há `/stills/views/`) → 3D quando carregar; nunca vazio |
| M6 | P1 | Legenda 3D densa (clay/ink + cor das mãos) | "Boneco claro = você (por baixo) · escuro = oponente" |
| M7 | P2 | localSubgraph 1 hop/5 vizinhos castra o azul | Toggle "ver mais conexões" sob demanda |
| M8 | P1 | Sidebar lista meia-guarda mas canvas filtra publicado → "a fundo" soa exagero | Alinhar `filtraPublicado` à promessa, ou marcar "em construção" |

### HOME — `src/app/page.tsx`
| # | Sev | Problema | Fix |
|---|---|---|---|
| H2 | P0 | Fallback da figura herói = bonequinhos de palito → desmorona tese anti-IA | Usar still 2D de qualidade como fallback, ou esconder figura até carregar |
| H4 | P0 | Site anônimo — quem ensina? sem faixa/equipe | Bloco curto de autoria/credencial; se não há pessoa real → gate de lançamento |
| H1 | P1 | "Embaixo não é o fim" sem âncora pro virgem total | 1ª linha do subtítulo define "embaixo" literalmente |
| H3 | P1 | Stats numéricos pequenos cheiram SaaS e admitem que é pouco | Reduzir peso ou trocar por afirmação de profundidade |
| H5 | P1 | Vitrine promete básico; azul não vê profundidade | Linha sinalizando profundidade ("da sobrevivência ao armlock travado") |

### PREÇOS — `src/app/precos/page.tsx`
| # | Sev | Problema | Fix |
|---|---|---|---|
| PR2 | P0 | Botão cai em "Abre no lançamento" — perde impulso pós-delight | Setar `NEXT_PUBLIC_MP_LINK_ATLAS` em prod, ou trocar por captura de e-mail (waitlist) |
| PR1 | P0 | Sem garantia/reembolso, sem prova social | Garantia "7 dias, devolvo sem perguntas" (copy/UI, sem backend) |
| PR3 | P1 | Bullets pagos com jargão ("syllabi") e sem amostra | Traduzir bullets + teaser de 1-2 nós pagos bloqueados (LockBadge) |
| PR4 | P1 | Vende "todas as posições/avançadas" mas MVP é guarda fechada+meia | Copy honesta do que existe hoje; atualizações como bônus |
| PR5 | P2 | Trilha avulsa R$12 vs Atlas R$19 = não-dilema | Repensar/remover ou ampliar gap |

## Delivery Milestones
| Milestone | Escopo | Status | Plano |
|---|---|---|---|
| M-A Confiança imediata | C1, C2, C3, PR2 | pending | — |
| M-B Conversão/clareza | H2, M5, M1, M2, H4, PR1 | pending | — |
| M-C Profundidade/voz | C4–C7, M3,M4,M6,M8, PR3,PR4, H1,H3,H5 | pending | — |
| M-D Polish | M7, PR5 | pending | — |

## Validação
`pnpm exec tsc --noEmit` · `pnpm test` (eram 156) · `rm -rf .next && pnpm build` (exit 0) · `pnpm dev` percorrer fluxo como faixa-branca.

## Fora de escopo (precisa de pessoa/recurso real)
Depoimentos reais, gravar vídeos pt-BR próprios, nova animação 3D. Mitigação: remover vídeos errados (C2/C3), still 2D no lugar do 3D vazio (M5/H2).

## Acceptance
- [ ] Vídeos furados removidos/trocados (C1-C3) — nenhum embed quebrado ou off-topic
- [ ] Figura nunca aparece vazia/rascunho (H2, M5)
- [ ] Trilha + legenda visíveis no mobile sem abrir drawer (M1, M2)
- [ ] /precos com garantia + checkout funcional ou waitlist (PR1, PR2)
- [ ] Gate verde (tsc/test/build)
