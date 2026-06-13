import { describe, it, expect } from "vitest";
import { lerpPose, sampleSequence } from "./anim";
import type { Pose, Joint } from "./pose";

function bone(f: Record<string, Joint>, a: string, b: string): number {
  return Math.hypot(f[a][0] - f[b][0], f[a][1] - f[b][1], f[a][2] - f[b][2]);
}

const A: Pose = { p0: { Head: [0, 0, 0], Core: [2, 0, 0] } };
const B: Pose = { p0: { Head: [10, 0, 0], Core: [2, 4, 0] } };
const C: Pose = { p0: { Head: [20, 0, 0], Core: [2, 8, 0] } };

describe("lerpPose", () => {
  it("interpola cada junta linearmente em t", () => {
    const m = lerpPose(A, B, 0.5);
    expect(m.p0.Head).toEqual([5, 0, 0]);
    expect(m.p0.Core).toEqual([2, 2, 0]);
  });

  it("t=0 → A, t=1 → B", () => {
    expect(lerpPose(A, B, 0).p0.Head).toEqual([0, 0, 0]);
    expect(lerpPose(A, B, 1).p0.Head).toEqual([10, 0, 0]);
  });
});

describe("sampleSequence", () => {
  const seq = [A, B, C];

  it("t=0 → primeiro frame, t=1 → último", () => {
    expect(sampleSequence(seq, 0).p0.Head).toEqual([0, 0, 0]);
    expect(sampleSequence(seq, 1).p0.Head).toEqual([20, 0, 0]);
  });

  it("t=0.5 cai exatamente no frame do meio (3 frames)", () => {
    expect(sampleSequence(seq, 0.5).p0.Head).toEqual([10, 0, 0]);
  });

  it("interpola dentro de um segmento", () => {
    // t=0.25 → metade do 1º segmento (A→B): Head = 5
    expect(sampleSequence(seq, 0.25).p0.Head).toEqual([5, 0, 0]);
  });
});

describe("slerp por osso preserva comprimento (corrige encolhimento)", () => {
  // Braço (ombro→cotovelo→punho) que RODA 90° no plano: o cotovelo começa
  // apontando +X e termina apontando +Y. Com LERP LINEAR de posição o cotovelo
  // viajaria pela CORDA (reta), encurtando o osso no meio. Slerp varre o ARCO.
  const start: Pose = {
    p0: {
      Neck: [0, 2, 0],
      LeftShoulder: [0, 1, 0],
      LeftElbow: [1, 1, 0], // braço apontando +X, comprimento 1
      LeftWrist: [2, 1, 0], // antebraço +X, comprimento 1
    },
  };
  const end: Pose = {
    p0: {
      Neck: [0, 2, 0],
      LeftShoulder: [0, 1, 0],
      LeftElbow: [0, 2, 0], // braço girou pra +Y, comprimento 1
      LeftWrist: [0, 3, 0], // antebraço +Y, comprimento 1
    },
  };

  it("comprimento do osso no meio ≈ lerp dos comprimentos (não encolhe)", () => {
    const lShoulderElbowA = bone(start.p0, "LeftShoulder", "LeftElbow");
    const lShoulderElbowB = bone(end.p0, "LeftShoulder", "LeftElbow");
    const expected = lShoulderElbowA + (lShoulderElbowB - lShoulderElbowA) * 0.5;
    const mid = lerpPose(start, end, 0.5);
    const got = bone(mid.p0, "LeftShoulder", "LeftElbow");
    // slerp: ~1.0; lerp linear daria a corda ≈ 0.707 (encolhe ~30%).
    expect(got).toBeCloseTo(expected, 6);
    expect(got).toBeGreaterThan(0.9); // prova que NÃO encolheu pra corda
  });

  it("o antebraço (2º elo da cadeia) também conserva comprimento", () => {
    const mid = lerpPose(start, end, 0.5);
    expect(bone(mid.p0, "LeftElbow", "LeftWrist")).toBeCloseTo(1, 6);
  });

  it("não encurta abaixo do menor dos dois comprimentos em t intermediário", () => {
    // Ombro→cotovelo encolhe de 1.5 → 0.5; em t=0.5 deve ser ≈1.0, nunca <0.5.
    const s: Pose = { p0: { LeftShoulder: [0, 0, 0], LeftElbow: [1.5, 0, 0] } };
    const e: Pose = { p0: { LeftShoulder: [0, 0, 0], LeftElbow: [0, 0.5, 0] } };
    for (let t = 0; t <= 1; t += 0.1) {
      const L = bone(lerpPose(s, e, t).p0, "LeftShoulder", "LeftElbow");
      expect(L).toBeGreaterThanOrEqual(0.5 - 1e-9);
      expect(L).toBeLessThanOrEqual(1.5 + 1e-9);
    }
  });

  it("osso que VIRA 180° (antiparalelo) não colapsa o comprimento no meio", () => {
    // cotovelo aponta +X e termina apontando -X (flip exato). Lerp linear passaria
    // pelo ombro (comprimento 0); slerp roda pelo arco e mantém ~1.
    const s: Pose = { p0: { LeftShoulder: [0, 0, 0], LeftElbow: [1, 0, 0] } };
    const e: Pose = { p0: { LeftShoulder: [0, 0, 0], LeftElbow: [-1, 0, 0] } };
    expect(bone(lerpPose(s, e, 0.5).p0, "LeftShoulder", "LeftElbow")).toBeCloseTo(1, 6);
  });

  it("endpoints exatos: t=0 → A, t=1 → B (reconstrução fiel)", () => {
    const a = lerpPose(start, end, 0);
    const b = lerpPose(start, end, 1);
    expect(a.p0.LeftElbow).toEqual([1, 1, 0]);
    expect(b.p0.LeftElbow).toEqual([0, 2, 0]);
    expect(a.p0.LeftWrist).toEqual([2, 1, 0]);
    expect(b.p0.LeftWrist).toEqual([0, 3, 0]);
  });

  // Regressão: o renderer animado casa juntas por ÍNDICE com a topologia do frame 0.
  // lerpPose DEVE preservar a ordem das chaves da entrada, senão as esferas trocam de
  // posição (a cabeça "descola" do corpo). Cadeia Core→Neck→Head + um membro.
  it("preserva a ordem das chaves das juntas (índice estável entre frames)", () => {
    const ordem = ["Core", "Neck", "Head", "LeftShoulder", "LeftElbow", "LeftWrist"];
    const mk = (dx: number): Pose => ({
      p0: {
        Core: [0, 0, 0], Neck: [0, 0.4, 0], Head: [0, 0.7, 0],
        LeftShoulder: [0.2, 0.35, 0], LeftElbow: [0.5 + dx, 0.35, 0], LeftWrist: [0.8 + dx, 0.35, 0],
      },
    });
    for (const t of [0, 0.5, 1]) {
      expect(Object.keys(lerpPose(mk(0), mk(0.3), t).p0)).toEqual(ordem);
    }
  });
});
