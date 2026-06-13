import type { Dificuldade, Transicao } from "./types";

export interface DificuldadeMeta {
  rotulo: string;
  /** Ordem de aprendizado: menor = mais fácil, vem primeiro. */
  ordem: number;
}

const META: Record<Dificuldade, DificuldadeMeta> = {
  iniciante: { rotulo: "Iniciante", ordem: 0 },
  intermediario: { rotulo: "Intermediário", ordem: 1 },
  avancado: { rotulo: "Avançado", ordem: 2 },
};

export function dificuldadeMeta(d: Dificuldade): DificuldadeMeta {
  return META[d];
}

/** Ordem de uma transição: classificadas pela dificuldade; sem classificação caem no meio. */
function ordemDe(t: Transicao): number {
  return t.dificuldade ? META[t.dificuldade].ordem : 1;
}

/**
 * Ordena transições "mais fácil primeiro" sem mutar a lista original.
 * Estável: mantém a ordem de entrada quando a dificuldade empata.
 */
export function ordenarPorDificuldade(transicoes: readonly Transicao[]): Transicao[] {
  return [...transicoes]
    .map((t, i) => ({ t, i }))
    .sort((a, b) => ordemDe(a.t) - ordemDe(b.t) || a.i - b.i)
    .map(({ t }) => t);
}
