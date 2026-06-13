import type { TipoTransicao } from "./types";

export interface TipoMeta {
  rotulo: string;
  rotuloPlural: string;
  /** CSS custom property com a cor funcional do tipo (sobre papel claro). */
  cor: string;
  corTint: string;
  /** Variante mais clara da cor, legível sobre a lona escura (tatame). */
  corOnMat: string;
  /** Frase curta do que esse tipo significa no jogo. */
  sentido: string;
}

const META: Record<TipoTransicao, TipoMeta> = {
  finalizacao: {
    rotulo: "Finalização",
    rotuloPlural: "Finalizações",
    cor: "var(--finalizacao)",
    corTint: "var(--finalizacao-tint)",
    corOnMat: "var(--finalizacao-on-mat)",
    sentido: "Acaba o jogo — o oponente bate.",
  },
  raspagem: {
    rotulo: "Raspagem",
    rotuloPlural: "Raspagens",
    cor: "var(--raspagem)",
    corTint: "var(--raspagem-tint)",
    corOnMat: "var(--raspagem-on-mat)",
    sentido: "Vira o jogo — você sai por cima.",
  },
  ataque: {
    rotulo: "Ataque",
    rotuloPlural: "Ataques",
    cor: "var(--clay)",
    corTint: "var(--clay-tint)",
    corOnMat: "var(--clay-on-mat)",
    sentido: "Ameaça que abre caminho.",
  },
  passagem: {
    rotulo: "Passagem",
    rotuloPlural: "Passagens",
    cor: "var(--passagem)",
    corTint: "var(--passagem-tint)",
    corOnMat: "var(--passagem-on-mat)",
    sentido: "Vence a guarda — o topo chega ao controle.",
  },
  "perda-de-guarda": {
    rotulo: "Perda de guarda",
    rotuloPlural: "Perda de guarda",
    cor: "var(--perda)",
    corTint: "var(--perda-tint)",
    corOnMat: "var(--perda-on-mat)",
    sentido: "Atenção — daqui o oponente passa.",
  },
};

export function tipoMeta(tipo: TipoTransicao): TipoMeta {
  return META[tipo];
}

/** Ordem de exibição: o que ganha o jogo primeiro, o risco por último. */
export const TIPOS_ORDENADOS: TipoTransicao[] = [
  "finalizacao",
  "raspagem",
  "ataque",
  "passagem",
  "perda-de-guarda",
];
