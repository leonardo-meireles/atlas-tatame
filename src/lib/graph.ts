import "server-only";
import { grafo as grafoBase } from "@/content/grafo";
import { grafoGMCore } from "@/content/grafo-gm-core.generated";
import { grafoGMExtras } from "@/content/grafo-gm-extras.generated";
import type { Grafo, Posicao, Transicao } from "./types";

// SERVER-ONLY. Importa core + extras síncronos pra SSG. NÃO entra no bundle do cliente
// (server-only quebraria o build se algum componente client importar este arquivo).
// Cliente usa graph-client.ts (core only + lazy extras).

function merge(...grafos: Grafo[]): Grafo {
  const posSlugs = new Set<string>();
  const transSlugs = new Set<string>();
  const posicoes: Posicao[] = [];
  const transicoes: Transicao[] = [];
  for (const g of grafos) {
    for (const p of g.posicoes) {
      if (!posSlugs.has(p.slug)) {
        posSlugs.add(p.slug);
        posicoes.push(p);
      }
    }
    for (const t of g.transicoes) {
      if (!transSlugs.has(t.slug)) {
        transSlugs.add(t.slug);
        transicoes.push(t);
      }
    }
  }
  return { posicoes, transicoes };
}

const grafo: Grafo = merge(grafoBase, grafoGMCore, grafoGMExtras);

export function getGrafo(): Grafo {
  return grafo;
}

export function getPosicao(slug: string): Posicao | undefined {
  return grafo.posicoes.find((p) => p.slug === slug);
}

export function getTransicoesDe(slug: string): Transicao[] {
  return grafo.transicoes.filter((t) => t.de === slug);
}

export function getDestino(t: Transicao): Posicao | undefined | null {
  return t.para === null ? null : getPosicao(t.para);
}

// Re-export pra back-compat — todos os call-sites server usam local-subgraph daqui.
export { localSubgraph } from "./local-subgraph";
