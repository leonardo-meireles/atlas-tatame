import { describe, it, expect } from "vitest";
import { silhouetteSep, fixedNorm, bestCamera, cameraHintForTags, facingDir } from "./framing";
import type { Vec3 } from "./geometry";
import type { Pose } from "./pose";

describe("silhouetteSep", () => {
  // Dois centroides separados no eixo X; câmera olhando a origem.
  const c0: Vec3 = [-1, 0, 0];
  const c1: Vec3 = [1, 0, 0];
  const target: Vec3 = [0, 0, 0];
  const up: Vec3 = [0, 1, 0];

  it("vista PERPENDICULAR ao eixo separa as silhuetas", () => {
    // olhando de +Z: os dois ficam lado a lado na tela → separação ~2
    const sep = silhouetteSep(c0, c1, [0, 0, 3], target, up);
    expect(sep).toBeCloseTo(2, 1);
  });

  it("vista AO LONGO do eixo colapsa as silhuetas", () => {
    // olhando de +X (ao longo da linha entre eles) → projetam quase no mesmo ponto
    const sep = silhouetteSep(c0, c1, [3, 0, 0], target, up);
    expect(sep).toBeLessThan(0.1);
  });
});

describe("fixedNorm", () => {
  // Lutadores andam em direções opostas: união (x -1..1 = 2) é MAIOR que qualquer
  // frame único (cada um span 1). Escala deve ser o frame único, senão a figura
  // renderiza pequena demais (subconjunto do envelope inteiro).
  const f0: Pose = { p0: { Head: [-1, 0, 0], Core: [-1, 0, 0] }, p1: { Head: [0, 0, 0], Core: [0, 0, 0] } };
  const f1: Pose = { p0: { Head: [0, 0, 0], Core: [0, 0, 0] }, p1: { Head: [1, 0, 0], Core: [1, 0, 0] } };

  it("escala = maior span de UM frame, não a união", () => {
    expect(fixedNorm([f0, f1]).span).toBeCloseTo(1, 6);
  });

  it("centro = centro da união (figura não deriva)", () => {
    expect(fixedNorm([f0, f1]).center[0]).toBeCloseTo(0, 6);
  });
});

describe("bestCamera", () => {
  // Lutadores separados no eixo X (plano do chão) → melhor vista é perpendicular (Z).
  const lado: Pose = {
    p0: { Head: [-0.4, 0.5, 0], Core: [-0.4, 0.2, 0] },
    p1: { Head: [0.4, 0.5, 0], Core: [0.4, 0.2, 0] },
  };

  it("escolhe ângulo perpendicular ao eixo entre os lutadores", () => {
    const { position, target } = bestCamera(lado);
    // offset em Z (perpendicular) domina o offset em X (paralelo).
    expect(Math.abs(position[2] - target[2])).toBeGreaterThan(Math.abs(position[0] - target[0]));
  });

  it("eleva a câmera mais em pose empilhada (montada) que em pose plana", () => {
    const plana: Pose = {
      p0: { Head: [-0.4, 0.1, 0], Core: [-0.4, 0, 0] },
      p1: { Head: [0.4, 0.1, 0], Core: [0.4, 0, 0] },
    };
    const empilhada: Pose = {
      p0: { Head: [0, 0.1, 0], Core: [0, 0, 0] },
      p1: { Head: [0, 0.9, 0], Core: [0, 0.7, 0] },
    };
    const elev = (p: Pose) => {
      const c = bestCamera(p);
      return c.position[1] - c.target[1];
    };
    expect(elev(empilhada)).toBeGreaterThan(elev(plana));
  });
});

describe("cameraHintForTags", () => {
  it("guarda → perfil puro (offset 0) e câmera baixa", () => {
    const h = cameraHintForTags(["guarda-fechada", "free"])!;
    expect(h.azOffset).toBeCloseTo(0, 6);
    expect(h.elevMult).toBeLessThan(1);
  });

  it("meia-guarda também lê de perfil baixo", () => {
    const h = cameraHintForTags(["meia-guarda"])!;
    expect(h.azOffset).toBeCloseTo(0, 6);
    expect(h.elevMult).toBeLessThan(1);
  });

  it("controle de topo (montada/passagem/100kg) → 3/4 alto", () => {
    for (const tag of ["montada", "passing", "cem-quilos", "stacked"]) {
      const h = cameraHintForTags([tag])!;
      expect(h.azOffset).toBeGreaterThan(0);
      expect(h.elevMult).toBeGreaterThan(1);
    }
  });

  it("em pé / clinch → 3/4 leve, elevação normal", () => {
    const h = cameraHintForTags(["standing", "clinch"])!;
    expect(h.azOffset).toBeGreaterThan(0);
    expect(h.elevMult).toBeCloseTo(1, 6);
  });

  it("sem tag conhecida → null (cai no comportamento original)", () => {
    expect(cameraHintForTags(["free", "qualidade"])).toBeNull();
  });
});

describe("facingDir", () => {
  it("infere a normal do tronco no chão (ombros × coluna), y zerado", () => {
    // ombros ao longo de X, coluna pra cima (+Y) → frente aponta +Z.
    const f = {
      LeftShoulder: [-1, 1, 0] as Vec3,
      RightShoulder: [1, 1, 0] as Vec3,
      Neck: [0, 1.2, 0] as Vec3,
      LeftHip: [-0.5, 0, 0] as Vec3,
      RightHip: [0.5, 0, 0] as Vec3,
    };
    const d = facingDir(f)!;
    expect(d[1]).toBeCloseTo(0, 6);
    expect(d[2]).toBeGreaterThan(0.9); // aponta +Z
    expect(Math.hypot(d[0], d[2])).toBeCloseTo(1, 6); // unitário no chão
  });

  it("retorna null sem juntas suficientes (cai no comportamento antigo)", () => {
    expect(facingDir({ Head: [0, 0, 0] as Vec3 })).toBeNull();
  });
});

describe("bestCamera — frente vs costas (silhouetteSep é simétrica)", () => {
  // Dois lutadores separados em X, AMBOS encarando +Z (ombros em X, coluna em Y).
  // Sem desempate de frente, +Z e −Z separam idêntico → poderia cair de costas.
  const encarandoZ: Pose = {
    p0: {
      LeftShoulder: [-0.9, 0.5, 0], RightShoulder: [-0.5, 0.5, 0],
      Neck: [-0.7, 0.6, 0], LeftHip: [-0.85, 0.1, 0], RightHip: [-0.55, 0.1, 0],
    },
    p1: {
      LeftShoulder: [0.5, 0.5, 0], RightShoulder: [0.9, 0.5, 0],
      Neck: [0.7, 0.6, 0], LeftHip: [0.55, 0.1, 0], RightHip: [0.85, 0.1, 0],
    },
  };

  it("a câmera fica do lado da FRENTE (+Z), não das costas (−Z)", () => {
    const { position, target } = bestCamera(encarandoZ);
    expect(position[2] - target[2]).toBeGreaterThan(0);
  });

  it("com hint de guarda também escolhe a frente (+Z)", () => {
    const { position, target } = bestCamera(encarandoZ, ["guarda-fechada"]);
    expect(position[2] - target[2]).toBeGreaterThan(0);
  });
});

describe("bestCamera com hints por tag", () => {
  // guarda de perfil: eixo entre lutadores em X → perpendicular = Z. Hint de guarda
  // (offset 0) deve manter o perfil mesmo recebendo tag.
  const guarda: Pose = {
    p0: { Head: [-0.4, 0.4, 0], Core: [-0.4, 0.1, 0] },
    p1: { Head: [0.4, 0.4, 0], Core: [0.4, 0.1, 0] },
  };

  it("tag de guarda mantém perfil (Z domina X) e baixa a câmera vs sem hint", () => {
    const semHint = bestCamera(guarda);
    const comHint = bestCamera(guarda, ["guarda-fechada"]);
    expect(Math.abs(comHint.position[2] - comHint.target[2])).toBeGreaterThan(
      Math.abs(comHint.position[0] - comHint.target[0]),
    );
    // elevMult 0.7 < 1 → câmera mais baixa que o default.
    expect(comHint.position[1] - comHint.target[1]).toBeLessThan(
      semHint.position[1] - semHint.target[1],
    );
  });

  it("tag de topo eleva a câmera acima do default", () => {
    const semHint = bestCamera(guarda);
    const topo = bestCamera(guarda, ["montada"]);
    expect(topo.position[1] - topo.target[1]).toBeGreaterThan(
      semHint.position[1] - semHint.target[1],
    );
  });
});
