import type { Grafo, Posicao } from "./types";

/**
 * Util PURA — não importa o grafo. Cliente e servidor compartilham essa lógica
 * sem puxar o dataset enorme. graph.ts (server-only) e graph-client.ts re-exportam.
 */

/** Riqueza dum nó pra priorizar quem aparece quando há vizinhos demais. */
function nodeRichness(p: Posicao | undefined): number {
  if (!p) return 0;
  return (p.resumo ? 2 : 0) + (p.imagem ? 1 : 0);
}

/** True se a posição casa TODAS as tags ativas (AND). */
function casaTags(p: Posicao | undefined, ativas: ReadonlySet<string>): boolean {
  if (!p) return false;
  if (ativas.size === 0) return true;
  const tags = p.tags;
  if (!tags || tags.length === 0) return false;
  for (const t of ativas) if (!tags.includes(t)) return false;
  return true;
}

export function localSubgraph(
  g: Grafo,
  focoSlug: string,
  hops = 1,
  maxViz = 9,
  tagsAtivas: ReadonlySet<string> = new Set(),
  /** Radial: só transições TOCANDO o foco. Mata cross-edges entre vizinhos
   *  (hubs concept são densos demais — 9 vizinhos × 10 cross-edges cada = canvas spaghetti). */
  radial = false,
  /** Cap de transições por VIZINHO. Caso radial, limita arestas de cada neighbor pro foco. */
  maxTransPerViz = 4,
): Grafo {
  const posPorSlug = new Map(g.posicoes.map((p) => [p.slug, p]));
  const incluidas = new Set<string>([focoSlug]);
  let fronteira = [focoSlug];
  for (let h = 0; h < hops && fronteira.length > 0; h++) {
    const frontSet = new Set(fronteira);
    const candidatos = new Set<string>();
    for (const t of g.transicoes) {
      if (frontSet.has(t.de) && t.para && !incluidas.has(t.para)) candidatos.add(t.para);
      else if (t.para && frontSet.has(t.para) && !incluidas.has(t.de)) candidatos.add(t.de);
    }
    const candFiltrados = [...candidatos].filter((s) => casaTags(posPorSlug.get(s), tagsAtivas));
    const ordenados = candFiltrados.sort((a, b) => {
      const d = nodeRichness(posPorSlug.get(b)) - nodeRichness(posPorSlug.get(a));
      return d !== 0 ? d : a.localeCompare(b);
    });
    const prox = ordenados.slice(0, maxViz);
    for (const s of prox) incluidas.add(s);
    fronteira = prox;
  }
  // Filtra transições — base: ambos endpoints in incluidas. Em radial: só tocando foco.
  let trans = g.transicoes.filter(
    (t) => incluidas.has(t.de) && (t.para === null || incluidas.has(t.para)),
  );
  if (radial) {
    trans = trans.filter((t) => t.de === focoSlug || t.para === focoSlug);
    // Cap radial: top N por VIZINHO (não-foco). Prioriza raspagem > finalizacao > ataque.
    const tipoOrdem: Record<string, number> = { raspagem: 0, finalizacao: 1, ataque: 2, "perda-de-guarda": 3 };
    const byOutro = new Map<string, typeof trans>();
    for (const t of trans) {
      const outro = t.de === focoSlug ? (t.para ?? "_fim") : t.de;
      const arr = byOutro.get(outro) ?? [];
      arr.push(t);
      byOutro.set(outro, arr);
    }
    const capped: typeof trans = [];
    for (const arr of byOutro.values()) {
      arr.sort((a, b) => (tipoOrdem[a.tipo] ?? 9) - (tipoOrdem[b.tipo] ?? 9) || a.slug.localeCompare(b.slug));
      for (const t of arr.slice(0, maxTransPerViz)) capped.push(t);
    }
    trans = capped;
  }
  // Posições ativas = só as referenciadas pelas trans filtradas (+ foco).
  const slugsAtivos = new Set<string>([focoSlug]);
  for (const t of trans) {
    if (incluidas.has(t.de)) slugsAtivos.add(t.de);
    if (t.para && incluidas.has(t.para)) slugsAtivos.add(t.para);
  }
  return {
    posicoes: g.posicoes.filter((p) => slugsAtivos.has(p.slug)),
    transicoes: trans,
  };
}
