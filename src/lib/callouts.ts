import type { Seta, TipoSeta } from "./types";

/**
 * Callout numerado: liga um ponto da figura (coords da seta) ao texto explicativo.
 * É a costura figura↔texto — o nº na figura casa com o nº na lista de pontos-chave.
 */
export interface Callout {
  /** Índice 1-based (ordem do array de setas). */
  n: number;
  /** Tipo da seta — define a cor do marcador. */
  tipo: TipoSeta;
  /** Rótulo curto, ex: "gola". */
  rotulo: string;
  /** Por que esse ponto importa (texto longo do callout). */
  porque?: string;
  /** Coords na caixa da figura (0–100%). */
  x: number;
  y: number;
}

/** Monta os callouts numerados a partir das setas de uma posição (1..N, ordem do array). */
export function buildCallouts(setas?: Seta[]): Callout[] {
  if (!setas?.length) return [];
  return setas.map((s, i) => ({
    n: i + 1,
    tipo: s.tipo,
    rotulo: s.rotulo ?? "",
    porque: s.porque,
    x: s.x,
    y: s.y,
  }));
}
