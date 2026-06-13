import { describe, it, expect } from "vitest";
import { topFighter, bonesOf, centroid, bounds, normalize, type Pose } from "./pose";

const pose: Pose = {
  p0: { Head: [0, 0, 1.0], Neck: [0, 0, 0.8], Core: [0, 0, 0.5], LeftHip: [0.1, 0, 0.45], LeftKnee: [0.1, 0, 0.2] },
  p1: { Head: [1, 0, 0.3], Neck: [0.9, 0, 0.3], Core: [0.6, 0, 0.25] }, // sem pernas
};

describe("topFighter", () => {
  it("escolhe o lutador de cabeça mais alta", () => {
    expect(topFighter(pose)).toBe("p0");
  });
});

describe("bonesOf", () => {
  it("pula ossos com junta faltando", () => {
    // p1 não tem LeftHip/LeftKnee -> esses ossos não aparecem; sem crash
    const bones = bonesOf(pose.p1);
    for (const [a, b] of bones) {
      expect(pose.p1[a]).toBeDefined();
      expect(pose.p1[b]).toBeDefined();
    }
    expect(bones.length).toBeGreaterThan(0); // Head-Neck, Neck-Core existem
  });
});

describe("centroid", () => {
  it("média das juntas", () => {
    const c = centroid({ A: [0, 0, 0], B: [2, 4, 6] });
    expect(c).toEqual([1, 2, 3]);
  });
});

describe("bounds", () => {
  it("min/max sobre os dois lutadores", () => {
    const b = bounds(pose);
    expect(b.min[0]).toBe(0);
    expect(b.max[0]).toBe(1);
    expect(b.max[2]).toBe(1.0);
  });
});

describe("normalize", () => {
  it("centra o bbox na origem e escala pra caixa unitária", () => {
    const n = normalize(pose);
    const b = bounds(n);
    // centro ~ origem
    expect(Math.abs(b.min[0] + b.max[0])).toBeLessThan(1e-9);
    // maior dimensão ~ 1
    const span = Math.max(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]);
    expect(Math.abs(span - 1)).toBeLessThan(1e-9);
  });
});
