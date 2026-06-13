import { describe, it, expect } from "vitest";
import { buildCallouts } from "./callouts";
import type { Seta } from "./types";

describe("buildCallouts", () => {
  it("retorna vazio sem setas", () => {
    expect(buildCallouts()).toEqual([]);
    expect(buildCallouts([])).toEqual([]);
  });

  it("numera as setas 1..N na ordem do array", () => {
    const setas: Seta[] = [
      { tipo: "pressao", x: 10, y: 20, rotulo: "a", porque: "pq-a" },
      { tipo: "pegada", x: 30, y: 40, rotulo: "b" },
    ];
    const cs = buildCallouts(setas);
    expect(cs.map((c) => c.n)).toEqual([1, 2]);
    expect(cs[0]).toMatchObject({ n: 1, tipo: "pressao", rotulo: "a", porque: "pq-a", x: 10, y: 20 });
    expect(cs[1]).toMatchObject({ n: 2, tipo: "pegada", rotulo: "b", x: 30, y: 40 });
    expect(cs[1].porque).toBeUndefined();
  });

  it("usa rótulo vazio quando ausente", () => {
    expect(buildCallouts([{ tipo: "direcao", x: 0, y: 0 }])[0].rotulo).toBe("");
  });
});
