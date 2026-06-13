import { describe, it, expect } from "vitest";
import { getPosicao, getTransicoesDe, getDestino, getGrafo, localSubgraph } from "./graph";
import type { Grafo } from "./types";

const sub: Grafo = {
  posicoes: [
    { slug: "a", nome: "A", resumo: "", principios: [], acesso: "free" },
    { slug: "b", nome: "B", resumo: "", principios: [], acesso: "free" },
    { slug: "c", nome: "C", resumo: "", principios: [], acesso: "free" },
  ],
  transicoes: [
    { slug: "t1", nome: "T1", tipo: "raspagem", de: "a", para: "b", passos: [], acesso: "free" },
    { slug: "t2", nome: "T2", tipo: "raspagem", de: "b", para: "c", passos: [], acesso: "free" },
    { slug: "t3", nome: "T3", tipo: "finalizacao", de: "a", para: null, passos: [], acesso: "free" },
  ],
};

describe("localSubgraph", () => {
  it("a 1 salto: foco + vizinhos diretos (+ finalizações do foco), não o que está a 2 saltos", () => {
    const g = localSubgraph(sub, "a", 1);
    expect(g.posicoes.map((p) => p.slug).sort()).toEqual(["a", "b"]);
    expect(g.transicoes.map((t) => t.slug).sort()).toEqual(["t1", "t3"]);
  });

  it("a 2 saltos: alcança o nó distante", () => {
    const g = localSubgraph(sub, "a", 2);
    expect(g.posicoes.map((p) => p.slug).sort()).toEqual(["a", "b", "c"]);
    expect(g.transicoes.map((t) => t.slug).sort()).toEqual(["t1", "t2", "t3"]);
  });
});

describe("getPosicao", () => {
  it("retorna a raiz Guarda Fechada pelo slug", () => {
    const p = getPosicao("guarda-fechada");
    expect(p?.nome).toBe("Guarda Fechada");
    expect(p?.raiz).toBe(true);
  });
});

describe("getTransicoesDe", () => {
  it("lista as transições que saem da Guarda Fechada", () => {
    const ts = getTransicoesDe("guarda-fechada");
    const slugs = ts.map((t) => t.slug);
    expect(slugs).toContain("armlock-da-guarda");
    expect(slugs).toContain("raspagem-de-tesoura");
    expect(ts.every((t) => t.de === "guarda-fechada")).toBe(true);
  });

  it("inclui pelo menos uma raspagem e uma finalização", () => {
    const tipos = new Set(getTransicoesDe("guarda-fechada").map((t) => t.tipo));
    expect(tipos.has("raspagem")).toBe(true);
    expect(tipos.has("finalizacao")).toBe(true);
  });
});

describe("getDestino", () => {
  it("resolve o destino de uma raspagem para a Posição alvo", () => {
    const raspagem = getTransicoesDe("guarda-fechada").find(
      (t) => t.slug === "raspagem-de-tesoura",
    )!;
    expect(getDestino(raspagem)?.slug).toBe("montada");
  });

  it("retorna null para finalização (folha, para = null)", () => {
    const fin = getTransicoesDe("guarda-fechada").find(
      (t) => t.slug === "armlock-da-guarda",
    )!;
    expect(getDestino(fin)).toBeNull();
  });
});

describe("cadeia de passagens (curada)", () => {
  it("guarda-fechada é família guarda, polo baixo", () => {
    const p = getPosicao("guarda-fechada");
    expect(p?.familia).toBe("guarda");
    expect(p?.polo).toBe("baixo");
  });

  it("oponente abre a guarda → guarda-aberta (posição curada, polo baixo)", () => {
    const ga = getPosicao("guarda-aberta");
    expect(ga).toBeDefined();
    expect(ga?.familia).toBe("guarda");
    expect(ga?.polo).toBe("baixo");
    // guarda-fechada perde a guarda PRA guarda-aberta (não folha nula).
    const abre = getTransicoesDe("guarda-fechada").find((t) => t.tipo === "perda-de-guarda");
    expect(abre?.para).toBe("guarda-aberta");
  });

  it("guarda-aberta tem ≥3 passagens (tipo passagem) que chegam em controle (polo cima)", () => {
    const passagens = getTransicoesDe("guarda-aberta").filter((t) => t.tipo === "passagem");
    expect(passagens.length).toBeGreaterThanOrEqual(3);
    for (const p of passagens) {
      const destino = getPosicao(p.para!);
      expect(destino?.polo, `${p.slug} → ${p.para}`).toBe("cima");
    }
  });

  it("cem-quilos é controle de topo (polo cima) e tem saída ofensiva", () => {
    const cq = getPosicao("cem-quilos");
    expect(cq?.familia).toBe("controle");
    expect(cq?.polo).toBe("cima");
    const saidas = getTransicoesDe("cem-quilos");
    expect(saidas.some((t) => t.tipo === "finalizacao" || t.tipo === "ataque")).toBe(true);
  });
});

describe("integridade do grafo", () => {
  it("toda transição com destino aponta para uma Posição existente", () => {
    const { transicoes } = getGrafo();
    for (const t of transicoes) {
      if (t.para !== null) {
        expect(getPosicao(t.para), `destino ausente: ${t.slug} -> ${t.para}`).toBeDefined();
      }
      expect(getPosicao(t.de), `origem ausente: ${t.slug}`).toBeDefined();
    }
  });
});
