// Domínio do grafo de Jiu-Jitsu. Termos canônicos em pt-BR (ver CONTEXT.md).

/** Tipo de uma Transição (aresta do grafo). */
export type TipoTransicao = "raspagem" | "finalizacao" | "ataque" | "passagem" | "perda-de-guarda";

/** Nível de acesso de um item de conteúdo. */
export type Acesso = "free" | "paid";

/** Nível de dificuldade didático de uma Transição — orienta a ordem de aprendizado do iniciante. */
export type Dificuldade = "iniciante" | "intermediario" | "avancado";

/** Dificuldades conhecidas, da mais fácil pra mais difícil (validação + ordenação). */
export const DIFICULDADES: readonly Dificuldade[] = ["iniciante", "intermediario", "avancado"];

/** Vídeo-aula (YouTube) ligado a uma posição ou transição. Embed leve (facade). */
export interface Video {
  /** ID do vídeo no YouTube (o que vem depois de v=). */
  youtubeId: string;
  /** Título de display em pt-BR. */
  titulo: string;
  /** Canal/autor (crédito). */
  canal?: string;
}

/** Família taxonômica de uma Posição — o agrupamento macro no atlas. */
export type Familia =
  | "guarda" // jogos por baixo (fechada, aberta, meia, borboleta…)
  | "passagem" // posições do topo passando a guarda
  | "controle" // dominância pós-passagem (montada, cem-quilos, joelho-na-barriga…)
  | "costas" // pegada/defesa das costas
  | "em-pe" // quedas, clinch
  | "finalizacao" // posições de ataque terminal
  | "neutro";

/** Polo de dominância — onde o jogador-sujeito está. */
export type Polo = "cima" | "baixo" | "neutro";

/** Famílias e polos conhecidos (validação de curadoria). */
export const FAMILIAS: readonly Familia[] = ["guarda", "passagem", "controle", "costas", "em-pe", "finalizacao", "neutro"];
export const POLOS: readonly Polo[] = ["cima", "baixo", "neutro"];

/** Tipo de seta de anotação sobre a figura. */
export type TipoSeta = "direcao" | "pressao" | "pegada" | "rotacao";

/**
 * Seta/anotação posicionada sobre a figura (coords em % da caixa, 0–100).
 * - direcao/pressao/rotacao: vetor de (x,y) por (dx,dy).
 * - pegada: marcador no ponto (x,y), sem vetor.
 */
export interface Seta {
  tipo: TipoSeta;
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  rotulo?: string;
  /** Por que esse ponto importa — vira o texto do callout numerado ligado à figura. */
  porque?: string;
}

/** Uma Posição: configuração estável e nomeada. Um nó no grafo. */
export interface Posicao {
  /** slug ASCII em português, ex: "guarda-fechada". Identidade no grafo. */
  slug: string;
  /** Nome de display em pt-BR, ex: "Guarda Fechada". */
  nome: string;
  /** Resumo curto da posição. */
  resumo: string;
  /** Princípios conceituais ligados a esta posição (o "porquê"). */
  principios: string[];
  /** Caminho do still 2D (placeholder no MVP). */
  imagem?: string;
  /** Múltiplas perspectivas 2D da posição (ângulos), pra entender de vários lados. */
  views?: { angulo: string; src: string }[];
  /** Setas de anotação (direção/pressão/pegada) sobre a figura. */
  setas?: Seta[];
  /** É o nó-raiz do MVP. */
  raiz?: boolean;
  /** Tags do GrappleMap (domínio/postura/pegada/sub) — base pra filtros na sidebar. */
  tags?: string[];
  /** Família taxonômica (guarda/passagem/controle/…) — agrupamento macro do atlas. */
  familia?: Familia;
  /** Polo de dominância do jogador-sujeito (cima/baixo/neutro). */
  polo?: Polo;
  /** Vídeo-aula da posição (YouTube). */
  video?: Video;
  acesso: Acesso;
}

/** Uma Transição: movimento direcionado de uma Posição para outra. Aresta. */
export interface Transicao {
  slug: string;
  nome: string;
  tipo: TipoTransicao;
  /** slug da Posição de origem. */
  de: string;
  /** slug da Posição de destino, ou null se termina o jogo (ex: finalização). */
  para: string | null;
  /** Passos do "como fazer". */
  passos: string[];
  /** Dificuldade didática — pra badge e ordenação "mais fácil primeiro". Sem valor = não classificada. */
  dificuldade?: Dificuldade;
  /** Figura 2D da técnica (pose final). */
  imagem?: string;
  /** Tags do GrappleMap (mesmas categorias da Posição). */
  tags?: string[];
  /** "detalhada" = transição autoral do GrappleMap (mais keyframes, demo curada). */
  qualidade?: "detalhada";
  /** Transição reversível sem modificação (renderiza como seta dupla). */
  bidirectional?: boolean;
  /** Auto-laço entre variantes do mesmo conceito (escondido por padrão na UI). */
  selfLoop?: boolean;
  /** Vídeo-aula da técnica (YouTube). */
  video?: Video;
  acesso: Acesso;
}

export interface Grafo {
  posicoes: Posicao[];
  transicoes: Transicao[];
}
