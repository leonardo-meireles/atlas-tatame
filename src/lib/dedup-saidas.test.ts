import { describe, it, expect } from "vitest";
import { dedupSaidas, nomeLegivel } from "./dedup-saidas";
import type { Transicao } from "./types";

const t = (over: Partial<Transicao>): Transicao => ({
  slug: "x",
  nome: "Transição sem Nome",
  tipo: "ataque",
  de: "guarda-fechada",
  para: "montada",
  passos: [],
  acesso: "free",
  ...over,
});

describe("nomeLegivel", () => {
  it("mantém nome real (não placeholder)", () => {
    expect(nomeLegivel(t({ nome: "Raspagem de Tesoura" }))).toBe("Raspagem de Tesoura");
  });

  it("deriva nome legível por tipo quando é placeholder", () => {
    expect(nomeLegivel(t({ tipo: "finalizacao" }))).toBe("Finalizar daqui");
    expect(nomeLegivel(t({ tipo: "raspagem" }), "Montada")).toBe("Raspar pra Montada");
    expect(nomeLegivel(t({ tipo: "ataque" }), "Costas")).toBe("Atacar pra Costas");
  });

  it("passagem placeholder vira 'Passar pra X'", () => {
    expect(nomeLegivel(t({ tipo: "passagem" }), "Cem-Quilos")).toBe("Passar pra Cem-Quilos");
    expect(nomeLegivel(t({ tipo: "passagem", para: null }))).toBe("Passar a guarda");
  });
});

describe("dedupSaidas", () => {
  it("esconde tap-stub quando há finalização curada do mesmo sub", () => {
    const saidas = [
      t({ slug: "triangulo", nome: "Triângulo", tipo: "finalizacao", para: null }),
      t({ slug: "gf__triangulo-tap__finalizacao", nome: "Triângulo", tipo: "finalizacao", para: null }),
    ];
    const out = dedupSaidas(saidas);
    expect(out.map((s) => s.slug)).toEqual(["triangulo"]);
  });

  it("mantém tap-stub quando não há curada equivalente", () => {
    const saidas = [t({ slug: "gf__darce-tap__finalizacao", nome: "D'Arce", tipo: "finalizacao", para: null })];
    expect(dedupSaidas(saidas)).toHaveLength(1);
  });
});
