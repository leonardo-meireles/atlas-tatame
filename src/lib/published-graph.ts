import { isPublicada } from "./figura/pose-meta";
import type { Grafo } from "./types";

/**
 * Status gate: retorna somente conteúdo curado e publicado.
 * - Transição precisa de passo a passo (passos.length > 0) + ambas as pontas publicadas.
 * - Posições visíveis = apenas as usadas em alguma transição curada.
 *
 * Reversível: curar uma transição (dar passos) ou publicar uma posição faz ela aparecer.
 */
export function getPublishedGraph(grafo: Grafo): Grafo {
  const trans = grafo.transicoes.filter(
    (t) =>
      t.passos.length > 0 &&
      isPublicada(t.slug) &&
      isPublicada(t.de) &&
      (t.para === null || isPublicada(t.para)),
  );

  const usadas = new Set<string>();
  for (const t of trans) {
    usadas.add(t.de);
    if (t.para) usadas.add(t.para);
  }

  return {
    posicoes: grafo.posicoes.filter((p) => isPublicada(p.slug) && usadas.has(p.slug)),
    transicoes: trans,
  };
}
