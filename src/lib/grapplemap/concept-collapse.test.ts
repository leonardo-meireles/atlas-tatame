import { describe, it, expect } from "vitest";
import { collapseConcept, gmFullGrafo, groupBySlug, selectBestVariant } from "./concept-collapse";
import type { GMPosition, GMTransition, Pose } from "./parser";

const dummy: Pose = [
  Array.from({ length: 23 }, () => ({ x: 0, y: 0, z: 0 })),
  Array.from({ length: 23 }, () => ({ x: 0, y: 0, z: 0 })),
];
const P = (id: number, name: string): GMPosition => ({ id, name, tags: [], pose: dummy, sourceLineNr: 0 });
const T = (id: number, name: string, fromId: number | null, toId: number | null): GMTransition => ({
  id, name, tags: [],
  properties: { top: false, bottom: false, bidirectional: false, detailed: false },
  frames: [dummy, dummy], fromId, toId, sourceLineNr: 0,
});

describe("collapseConcept", () => {
  it("colapsa variantes de guarda fechada no conceito guarda-fechada", () => {
    expect(collapseConcept("closed guard w/ 100")).toBe("guarda-fechada");
    expect(collapseConcept("full guard kimura threatened")).toBe("guarda-fechada");
  });

  it("colapsa variantes de montada em montada", () => {
    expect(collapseConcept("mount")).toBe("montada");
    expect(collapseConcept("low mount")).toBe("montada");
  });

  it("retorna null quando não há conceito conhecido (mantém como está)", () => {
    expect(collapseConcept("zombie")).toBeNull();
  });
});

describe("groupBySlug", () => {
  it("agrupa itens pelo slug; pula slug nulo", () => {
    const g = groupBySlug([{ n: "a" }, { n: "b" }, { n: "x" }], (i) => (i.n === "x" ? null : i.n));
    expect([...g.keys()].sort()).toEqual(["a", "b"]);
    expect(g.get("a")).toHaveLength(1);
  });

  it("junta variantes do mesmo slug numa lista", () => {
    const g = groupBySlug([{ s: "k", v: 1 }, { s: "k", v: 2 }], (i) => i.s);
    expect(g.get("k")).toHaveLength(2);
  });
});

describe("selectBestVariant", () => {
  it("escolhe o de maior pontuação", () => {
    const best = selectBestVariant([{ v: 1 }, { v: 9 }, { v: 4 }], (i) => i.v);
    expect(best.v).toBe(9);
  });
});

describe("gmFullGrafo", () => {
  it("conceito reconhecido vira hub; desconhecido vira nó próprio; conecta tudo", () => {
    const g = gmFullGrafo(
      [P(0, "closed guard w/ 100"), P(1, "low mount"), P(2, "zombie")],
      [T(10, "hip bump sweep", 0, 1), T(11, "weird", 1, 2)],
    );
    // guarda-fechada + montada (hubs) + zombie (nó próprio) — TODAS as posições entram.
    expect(g.posicoes.map((p) => p.slug).sort()).toEqual(["guarda-fechada", "montada", "zombie"]);
    // 0→1 e 1→2 conectam (zombie incluído agora).
    expect(g.transicoes).toHaveLength(2);
    expect(g.transicoes.find((t) => t.de === "guarda-fechada")).toMatchObject({ para: "montada" });
  });
});
