import { describe, it, expect } from "vitest";
import { dificuldadeMeta, ordenarPorDificuldade } from "./dificuldade";
import type { Transicao } from "./types";

function t(slug: string, dificuldade?: Transicao["dificuldade"]): Transicao {
  return { slug, nome: slug, tipo: "raspagem", de: "x", para: "y", passos: [], acesso: "free", dificuldade };
}

describe("dificuldadeMeta", () => {
  it("ordena iniciante < intermediario < avancado", () => {
    expect(dificuldadeMeta("iniciante").ordem).toBeLessThan(dificuldadeMeta("intermediario").ordem);
    expect(dificuldadeMeta("intermediario").ordem).toBeLessThan(dificuldadeMeta("avancado").ordem);
  });
});

describe("ordenarPorDificuldade", () => {
  it("põe a mais fácil primeiro", () => {
    const r = ordenarPorDificuldade([t("a", "avancado"), t("b", "iniciante"), t("c", "intermediario")]);
    expect(r.map((x) => x.slug)).toEqual(["b", "c", "a"]);
  });

  it("é estável quando a dificuldade empata", () => {
    const r = ordenarPorDificuldade([t("a", "iniciante"), t("b", "iniciante")]);
    expect(r.map((x) => x.slug)).toEqual(["a", "b"]);
  });

  it("trata sem-classificação como meio (entre iniciante e avancado)", () => {
    const r = ordenarPorDificuldade([t("avc", "avancado"), t("sem"), t("ini", "iniciante")]);
    expect(r.map((x) => x.slug)).toEqual(["ini", "sem", "avc"]);
  });

  it("não muta a lista original", () => {
    const orig = [t("a", "avancado"), t("b", "iniciante")];
    const copia = [...orig];
    ordenarPorDificuldade(orig);
    expect(orig).toEqual(copia);
  });
});
