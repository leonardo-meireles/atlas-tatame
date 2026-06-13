import { describe, it, expect } from "vitest";
import { buildFigura, rotateVec } from "./geometry";
import type { Fighter } from "./pose";

// Lutador mínimo (z-up): tronco vertical + um braço.
const f: Fighter = {
  Head: [0, 0, 1.0], Neck: [0, 0, 0.8], Core: [0, 0, 0.5],
  LeftShoulder: [0.2, 0, 0.8], RightShoulder: [-0.2, 0, 0.8],
  LeftElbow: [0.4, 0, 0.8], LeftWrist: [0.6, 0, 0.8], LeftHand: [0.7, 0, 0.8],
  LeftHip: [0.12, 0, 0.45], RightHip: [-0.12, 0, 0.45],
  LeftKnee: [0.14, 0, 0.2], LeftAnkle: [0.14, 0, 0.02], LeftToe: [0.18, 0, 0.0],
};

describe("buildFigura — ossos", () => {
  const fig = buildFigura(f);

  it("posiciona osso no ponto médio e mede comprimento", () => {
    // Neck->Core: meio em z=0.65, comprimento 0.3
    const cn = fig.bones.find((b) => b.a === "Neck" && b.b === "Core")!;
    expect(cn.position).toEqual([0, 0, 0.65]);
    expect(cn.length).toBeCloseTo(0.3, 6);
  });

  it("afina o osso: raio em cada ponta = raio da junta", () => {
    const cn = fig.bones.find((b) => b.a === "Neck" && b.b === "Core")!;
    expect(cn.radius0).toBeCloseTo(0.035, 6); // Neck
    expect(cn.radius1).toBeCloseTo(0.06, 6); // Core
  });

  it("quaternion gira +Y pra direção do osso", () => {
    // Neck(z=0.8)->Core(z=0.5): direção (0,0,-1)
    const cn = fig.bones.find((b) => b.a === "Neck" && b.b === "Core")!;
    const dir = rotateVec(cn.quaternion, [0, 1, 0]);
    expect(dir[0]).toBeCloseTo(0, 6);
    expect(dir[1]).toBeCloseTo(0, 6);
    expect(dir[2]).toBeCloseTo(-1, 6);
  });

  it("pula ossos com junta faltando", () => {
    // f não tem RightElbow nem RightKnee -> nenhum osso pode referenciá-los
    for (const bone of fig.bones) {
      expect(f[bone.a]).toBeDefined();
      expect(f[bone.b]).toBeDefined();
    }
    expect(fig.bones.length).toBeGreaterThan(0);
  });
});

describe("buildFigura — juntas (cor/legenda)", () => {
  const fig = buildFigura(f);
  const role = (name: string) => fig.joints.find((j) => j.name === name)!.role;

  it("classifica papel de cada junta pra legenda", () => {
    expect(role("Head")).toBe("cabeca");
    expect(role("Core")).toBe("tronco");
    expect(role("LeftHip")).toBe("tronco");
    expect(role("LeftKnee")).toBe("articulacao");
    expect(role("LeftHand")).toBe("mao");
    expect(role("LeftToe")).toBe("pe");
  });

  it("toda junta tem raio positivo e posição da pose", () => {
    for (const j of fig.joints) {
      expect(j.radius).toBeGreaterThan(0);
      expect(j.position).toEqual(f[j.name]);
    }
  });
});

describe("buildFigura — osso antiparalelo (dir = -Y)", () => {
  // Neck acima de Core em Y -> osso aponta direto pra baixo (0,-1,0): caso degenerado.
  const down: Fighter = { Neck: [0, 1, 0], Core: [0, 0, 0] };

  it("produz quaternion finito que gira +Y pra -Y", () => {
    const cn = buildFigura(down).bones.find((b) => b.a === "Neck" && b.b === "Core")!;
    for (const q of cn.quaternion) expect(Number.isFinite(q)).toBe(true);
    const dir = rotateVec(cn.quaternion, [0, 1, 0]);
    expect(dir[0]).toBeCloseTo(0, 6);
    expect(dir[1]).toBeCloseTo(-1, 6);
    expect(dir[2]).toBeCloseTo(0, 6);
  });
});
