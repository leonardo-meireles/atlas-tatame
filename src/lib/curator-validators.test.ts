import { describe, it, expect } from "vitest";
import type { Grafo, Posicao, Transicao } from "./types";
import {
  semOrfaos,
  semIlhas,
  hubsConectados,
  semDuplicacaoSemantica,
  saidasMinimas,
  tem3D,
  namingLint,
  familiaCoerente,
  polosCoerentes,
  statusGate,
  runAllValidators,
} from "./curator-validators";
import { getGrafo } from "./graph";
import manifest from "@/content/figura-manifest.json";

// ── Helpers de fixture ────────────────────────────────────────────────────────
function pos(slug: string, extra: Partial<Posicao> = {}): Posicao {
  return { slug, nome: slug, resumo: "", principios: [], acesso: "free", ...extra };
}
function trans(slug: string, de: string, para: string | null, extra: Partial<Transicao> = {}): Transicao {
  return { slug, nome: slug, tipo: "ataque", de, para, passos: [], acesso: "free", ...extra };
}

describe("semOrfaos", () => {
  it("passa quando posição tem entrada E saída", () => {
    const g: Grafo = {
      posicoes: [pos("a"), pos("b"), pos("c")],
      transicoes: [trans("a__x__b", "a", "b"), trans("b__y__a", "b", "a"), trans("b__z__c", "b", "c"), trans("c__w__b", "c", "b")],
    };
    expect(semOrfaos(g)).toHaveLength(0);
  });
  it("warn pra folha (só entrada ou só saída)", () => {
    const g: Grafo = { posicoes: [pos("a"), pos("b")], transicoes: [trans("a__x__b", "a", "b")] };
    const is = semOrfaos(g);
    expect(is.every((i) => i.level === "warn")).toBe(true);
    expect(is).toHaveLength(2); // a sem entrada, b sem saída
  });
  it("error pra hub totalmente isolado", () => {
    const g: Grafo = { posicoes: [pos("montada")], transicoes: [] };
    expect(semOrfaos(g).filter((i) => i.level === "error")).toHaveLength(1);
  });
});

describe("semIlhas", () => {
  it("passa quando tudo alcança guarda-fechada", () => {
    const g: Grafo = {
      posicoes: [pos("guarda-fechada"), pos("montada")],
      transicoes: [trans("gf__x__m", "guarda-fechada", "montada")],
    };
    expect(semIlhas(g)).toHaveLength(0);
  });
  it("warn quando há posição desconectada", () => {
    const g: Grafo = {
      posicoes: [pos("guarda-fechada"), pos("ilha")],
      transicoes: [],
    };
    expect(semIlhas(g)).toHaveLength(1);
    expect(semIlhas(g)[0].level).toBe("warn");
  });
});

describe("hubsConectados", () => {
  it("passa quando hub alcança ≥3 outros hubs", () => {
    const hubs = ["montada", "guarda-fechada", "meia-guarda", "cem-quilos"];
    const g: Grafo = {
      posicoes: hubs.map((h) => pos(h)),
      transicoes: [
        trans("t1", "montada", "guarda-fechada"),
        trans("t2", "montada", "meia-guarda"),
        trans("t3", "montada", "cem-quilos"),
      ],
    };
    const is = hubsConectados(g);
    // montada alcança 3 — não reclama dele; folhas-hub que não alcançam ainda reclamam,
    // mas todos os hubs estão num componente conexo aqui, então 0 issues.
    expect(is).toHaveLength(0);
  });
  it("warn quando hub fica isolado", () => {
    const g: Grafo = {
      posicoes: [pos("montada"), pos("guarda-fechada"), pos("meia-guarda"), pos("cem-quilos")],
      transicoes: [trans("t1", "guarda-fechada", "meia-guarda")],
    };
    const is = hubsConectados(g);
    expect(is.some((i) => i.slug === "montada" && i.level === "warn")).toBe(true);
  });
});

describe("semDuplicacaoSemantica", () => {
  it("passa sem duplicatas", () => {
    const g: Grafo = { posicoes: [], transicoes: [trans("a__x__b", "a", "b"), trans("a__y__c", "a", "c")] };
    expect(semDuplicacaoSemantica(g)).toHaveLength(0);
  });
  it("warn quando (nome,tipo,de) repete", () => {
    const g: Grafo = {
      posicoes: [],
      transicoes: [
        trans("s1", "a", "b", { nome: "Raspar", tipo: "raspagem" }),
        trans("s2", "a", "c", { nome: "Raspar", tipo: "raspagem" }),
      ],
    };
    const is = semDuplicacaoSemantica(g);
    expect(is).toHaveLength(1);
    expect(is[0].level).toBe("warn");
  });
});

describe("saidasMinimas", () => {
  it("passa quando há saída ofensiva", () => {
    const g: Grafo = { posicoes: [pos("a")], transicoes: [trans("s", "a", "b", { tipo: "raspagem" })] };
    expect(saidasMinimas(g)).toHaveLength(0);
  });
  it("warn quando só tem perda-de-guarda", () => {
    const g: Grafo = { posicoes: [pos("a")], transicoes: [trans("s", "a", "b", { tipo: "perda-de-guarda" })] };
    const is = saidasMinimas(g);
    expect(is).toHaveLength(1);
    expect(is[0].level).toBe("warn");
  });
});

describe("tem3D", () => {
  const man = { poses: ["a"], trans: ["s"] };
  it("passa quando pose e trans estão no manifesto", () => {
    const g: Grafo = { posicoes: [pos("a")], transicoes: [trans("s", "a", null)] };
    expect(tem3D(g, man)).toHaveLength(0);
  });
  it("error pra posição sem pose 3D", () => {
    const g: Grafo = { posicoes: [pos("b")], transicoes: [] };
    expect(tem3D(g, man).filter((i) => i.level === "error")).toHaveLength(1);
  });
  it("warn pra transição sem frames; tap-stub passa", () => {
    const g: Grafo = {
      posicoes: [],
      transicoes: [trans("desconhecida", "a", "b"), trans("montada__armbar-tap__finalizacao", "montada", null, { tipo: "finalizacao" })],
    };
    const is = tem3D(g, man);
    expect(is).toHaveLength(1);
    expect(is[0].slug).toBe("desconhecida");
    expect(is[0].level).toBe("warn");
  });
});

describe("namingLint", () => {
  it("passa com nome pt-BR e slug kebab", () => {
    const g: Grafo = { posicoes: [pos("guarda-fechada", { nome: "Guarda Fechada" })], transicoes: [] };
    expect(namingLint(g)).toHaveLength(0);
  });
  it("warn pra palavra EN no nome", () => {
    const g: Grafo = { posicoes: [pos("x", { nome: "Closed Guard from Mount" })], transicoes: [] };
    expect(namingLint(g).some((i) => i.level === "warn")).toBe(true);
  });
  it("warn pra slug com -- ou não-ASCII", () => {
    const g: Grafo = { posicoes: [pos("guarda--dupla", { nome: "Guarda" })], transicoes: [] };
    expect(namingLint(g).some((i) => i.slug === "guarda--dupla")).toBe(true);
  });
});

describe("familiaCoerente", () => {
  it("passa quando familia é conhecida ou ausente", () => {
    const g: Grafo = {
      posicoes: [pos("a", { familia: "guarda" }), pos("b", { familia: "controle" }), pos("c")],
      transicoes: [],
    };
    expect(familiaCoerente(g)).toHaveLength(0);
  });
  it("warn pra familia desconhecida", () => {
    const g: Grafo = { posicoes: [pos("a", { familia: "inventada" as never })], transicoes: [] };
    const is = familiaCoerente(g);
    expect(is).toHaveLength(1);
    expect(is[0].level).toBe("warn");
  });
});

describe("polosCoerentes", () => {
  it("passa em raspagem baixo→cima e passagem ganhando posição", () => {
    const g: Grafo = {
      posicoes: [pos("gf", { polo: "baixo" }), pos("mon", { polo: "cima" }), pos("ga", { polo: "baixo" }), pos("cq", { polo: "cima" })],
      transicoes: [
        trans("r", "gf", "mon", { tipo: "raspagem" }),
        trans("p", "ga", "cq", { tipo: "passagem" }),
      ],
    };
    expect(polosCoerentes(g)).toHaveLength(0);
  });
  it("warn pra polo inválido", () => {
    const g: Grafo = { posicoes: [pos("a", { polo: "lado" as never })], transicoes: [] };
    expect(polosCoerentes(g).some((i) => i.level === "warn")).toBe(true);
  });
  it("warn pra raspagem que sai de polo cima", () => {
    const g: Grafo = {
      posicoes: [pos("mon", { polo: "cima" }), pos("x", { polo: "baixo" })],
      transicoes: [trans("r", "mon", "x", { tipo: "raspagem" })],
    };
    expect(polosCoerentes(g).some((i) => i.rule === "polosCoerentes" && i.slug === "r")).toBe(true);
  });
  it("warn pra passagem que chega em polo baixo", () => {
    const g: Grafo = {
      posicoes: [pos("ga", { polo: "baixo" }), pos("ruim", { polo: "baixo" })],
      transicoes: [trans("p", "ga", "ruim", { tipo: "passagem" })],
    };
    expect(polosCoerentes(g).some((i) => i.slug === "p")).toBe(true);
  });
});

describe("statusGate", () => {
  it("passa quando tudo publicado (default permissivo)", () => {
    const g: Grafo = { posicoes: [pos("slug-novo-sem-meta")], transicoes: [] };
    expect(statusGate(g)).toHaveLength(0);
  });
});

describe("smoke: grafo real", () => {
  it("runAllValidators não retorna NENHUM error no dataset atual", () => {
    const g = getGrafo();
    const issues = runAllValidators(g, manifest);
    const errors = issues.filter((i) => i.level === "error");
    if (errors.length > 0) {
      console.error("ERRORS:", errors.slice(0, 30).map((e) => `${e.rule}: ${e.msg}`).join("\n"));
    }
    expect(errors).toHaveLength(0);
  });
});
