import { describe, it, expect } from "vitest";
import { getPublishedGraph } from "./published-graph";
import type { Grafo } from "./types";

function pos(slug: string, raiz = false) {
  return { slug, nome: slug, raiz, familia: null, polo: null, resumo: "", principios: [], imagem: null, setas: null, video: null };
}

function trans(slug: string, de: string, para: string | null, passos: string[] = ["p1"]) {
  return { slug, nome: slug, de, para, tipo: "finalizacao" as const, passos, acesso: "free" as const, qualidade: null, bidirectional: false, video: null };
}

const grafoCompleto: Grafo = {
  posicoes: [pos("guarda-fechada", true), pos("montada"), pos("rascunho-pos")],
  transicoes: [
    trans("finaliza-ok", "guarda-fechada", "montada", ["passo 1"]),
    trans("sem-passos", "guarda-fechada", "montada", []),
    trans("trans-rascunho", "guarda-fechada", "rascunho-pos", ["passo 1"]),
  ],
};

describe("getPublishedGraph", () => {
  it("exclui transições sem passos", () => {
    const g = getPublishedGraph(grafoCompleto);
    expect(g.transicoes.every((t) => t.passos.length > 0)).toBe(true);
  });

  it("exclui posições não usadas em transição curada", () => {
    const g = getPublishedGraph(grafoCompleto);
    const slugs = g.posicoes.map((p) => p.slug);
    expect(slugs).toContain("guarda-fechada");
    expect(slugs).toContain("montada");
  });

  it("grafo vazio retorna vazio", () => {
    const g = getPublishedGraph({ posicoes: [], transicoes: [] });
    expect(g.posicoes).toHaveLength(0);
    expect(g.transicoes).toHaveLength(0);
  });

  it("posição usada só em transição sem passos não aparece", () => {
    const isolado: Grafo = {
      posicoes: [pos("a"), pos("b")],
      transicoes: [trans("ab", "a", "b", [])],
    };
    const g = getPublishedGraph(isolado);
    expect(g.posicoes).toHaveLength(0);
  });
});
