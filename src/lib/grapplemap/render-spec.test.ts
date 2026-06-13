import { describe, it, expect } from "vitest";
import type { PlayerPose, Pose, Vec3 } from "./parser";
import { JOINTS } from "./parser";
import {
  playerCentroid,
  legibilityScore,
  pickClearestVariant,
  cameraFor,
  camerasFor,
  cameraSilhouetteSeparation,
  pickBestCamera,
  cameraLegibilityScore,
} from "./render-spec";

const HEAD = JOINTS.indexOf("Head");
const CORE = JOINTS.indexOf("Core");

/** Constrói um PlayerPose com todas as juntas num ponto, e overrides opcionais. */
function player(at: Vec3, overrides: Partial<Record<number, Vec3>> = {}): PlayerPose {
  const p: PlayerPose = Array.from({ length: JOINTS.length }, () => ({ ...at }));
  for (const [i, v] of Object.entries(overrides)) if (v) p[Number(i)] = v;
  return p;
}

describe("playerCentroid", () => {
  it("é a média das juntas", () => {
    expect(playerCentroid(player({ x: 2, y: 0, z: 0 }))).toEqual({ x: 2, y: 0, z: 0 });
  });
});

describe("legibilityScore", () => {
  it("pose com lutadores separados pontua mais que sobrepostos", () => {
    const separados: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 1.2, y: 0.8, z: 0 })];
    const sobrepostos: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 0.1, y: 0.05, z: 0 })];
    expect(legibilityScore(separados)).toBeGreaterThan(legibilityScore(sobrepostos));
  });

  it("diferença de altura (deitado vs ajoelhado) aumenta a pontuação", () => {
    const base: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 1, y: 0, z: 0 })];
    const comAltura: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 1, y: 0.9, z: 0 })];
    expect(legibilityScore(comAltura)).toBeGreaterThan(legibilityScore(base));
  });
});

describe("pickClearestVariant", () => {
  it("escolhe a variante de maior legibilidade entre as do mesmo conceito", () => {
    const enroscada: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 0.1, y: 0, z: 0 })];
    const separada: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 1.5, y: 0.9, z: 0 })];
    const variantes = [
      { id: 1, pose: enroscada },
      { id: 2, pose: separada },
    ];
    expect(pickClearestVariant(variantes).id).toBe(2);
  });
});

describe("cameraFor", () => {
  // eixo entre lutadores ao longo de x → câmera deve olhar atravessando (ao longo de z).
  const pose: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 2, y: 0, z: 0 })];

  it("mira no ponto entre os dois lutadores", () => {
    const { target } = cameraFor(pose);
    expect(target.x).toBeCloseTo(1);
  });

  it("fica elevada acima do alvo (3/4)", () => {
    const { eye, target } = cameraFor(pose);
    expect(eye.y).toBeGreaterThan(target.y);
  });

  it("olha ATRAVESSANDO a linha entre os lutadores (perpendicular no chão)", () => {
    const { eye, target } = cameraFor(pose);
    const viewGround = { x: target.x - eye.x, z: target.z - eye.z };
    const linha = { x: 2 - 0, z: 0 }; // eixo entre centroides
    const dot = viewGround.x * linha.x + viewGround.z * linha.z;
    expect(Math.abs(dot)).toBeLessThan(1e-9);
  });

  it("não quebra quando os centroides coincidem", () => {
    const degenerada: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 0, y: 0, z: 0 })];
    const cam = cameraFor(degenerada);
    expect(Number.isFinite(cam.eye.x + cam.eye.y + cam.eye.z)).toBe(true);
  });
});

describe("camerasFor (multi-POV)", () => {
  const pose: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 2, y: 0.6, z: 0 })];

  it("retorna a quantidade pedida de câmeras", () => {
    expect(camerasFor(pose, 4)).toHaveLength(4);
  });

  it("a primeira é a câmera primária (cameraFor)", () => {
    const primeira = camerasFor(pose, 4)[0];
    const base = cameraFor(pose);
    expect(primeira.eye.x).toBeCloseTo(base.eye.x);
    expect(primeira.eye.z).toBeCloseTo(base.eye.z);
  });

  it("todas miram no mesmo alvo, mas de olhos diferentes (órbita)", () => {
    const cams = camerasFor(pose, 4);
    for (const c of cams) {
      expect(c.target.x).toBeCloseTo(cams[0].target.x);
      expect(c.target.z).toBeCloseTo(cams[0].target.z);
    }
    const eyes = new Set(cams.map((c) => `${c.eye.x.toFixed(3)},${c.eye.z.toFixed(3)}`));
    expect(eyes.size).toBe(4);
  });

  it("mantém o raio de órbita (mesma distância do alvo no chão)", () => {
    const cams = camerasFor(pose, 4);
    const r = (c: (typeof cams)[number]) => Math.hypot(c.eye.x - c.target.x, c.eye.z - c.target.z);
    const r0 = r(cams[0]);
    for (const c of cams) expect(r(c)).toBeCloseTo(r0);
  });
});

describe("cameraFor — elevação adaptativa para poses empilhadas", () => {
  it("pose com stacking vertical recebe câmera mais alta que pose plana", () => {
    // pose plana: os dois no mesmo nível
    const poseFlat: Pose = [
      player({ x: 0, y: 0, z: 0 }),
      player({ x: 1, y: 0, z: 0 }),
    ];
    // pose empilhada: um lutador bem mais alto (ex: montada)
    const poseMontada: Pose = [
      player({ x: 0, y: 0, z: 0 }),
      player({ x: 0.2, y: 0.7, z: 0 }), // quase no mesmo x/z mas muito mais alto
    ];
    const camFlat = cameraFor(poseFlat);
    const camMontada = cameraFor(poseMontada);
    // A câmera da montada deve estar mais alta em relação ao alvo
    const alturaFlat = camFlat.eye.y - camFlat.target.y;
    const alturaMontada = camMontada.eye.y - camMontada.target.y;
    // O ratio altura/radius deve ser maior para a pose empilhada
    expect(alturaMontada / alturaFlat).toBeGreaterThan(1.05);
  });

  it("não vira top-down mesmo em poses muito empilhadas", () => {
    // stacking extremo: um lutador diretamente acima do outro
    const poseExtrema: Pose = [
      player({ x: 0, y: 0, z: 0 }),
      player({ x: 0.05, y: 1.5, z: 0.05 }),
    ];
    const cam = cameraFor(poseExtrema);
    const target = cam.target;
    const alturaMult = (cam.eye.y - target.y) / Math.hypot(
      cam.eye.x - target.x, cam.eye.z - target.z,
    );
    // MAX_ALTURA_MULT = 2.4, BASE_DIST_MULT = 2.6 → ratio altura/dist não explode
    expect(alturaMult).toBeLessThan(3.5);
  });
});

describe("cameraSilhouetteSeparation", () => {
  it("câmera perpendicular ao eixo dos lutadores separa mais que câmera paralela", () => {
    // dois lutadores ao longo do eixo x
    const pose: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 2, y: 0, z: 0 })];
    // câmera olhando ao longo de z (perpendicular ao eixo dos lutadores — a câmera certa)
    const camPerp: import("./render-spec").Camera = {
      eye: { x: 1, y: 1, z: 3 },
      target: { x: 1, y: 0, z: 0 },
      up: { x: 0, y: 1, z: 0 },
    };
    // câmera olhando ao longo de x (paralela ao eixo — os lutadores ficam empilhados)
    const camPar: import("./render-spec").Camera = {
      eye: { x: 4, y: 1, z: 0 },
      target: { x: 1, y: 0, z: 0 },
      up: { x: 0, y: 1, z: 0 },
    };
    expect(cameraSilhouetteSeparation(pose, camPerp)).toBeGreaterThan(
      cameraSilhouetteSeparation(pose, camPar),
    );
  });
});

describe("pickBestCamera", () => {
  it("escolhe a câmera com maior separação de silhueta entre as candidatas", () => {
    const pose: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 2, y: 0, z: 0 })];
    const cams = camerasFor(pose, 4);
    const best = pickBestCamera(pose, cams);
    const bestSep = cameraSilhouetteSeparation(pose, best);
    for (const c of cams) {
      expect(bestSep).toBeGreaterThanOrEqual(cameraSilhouetteSeparation(pose, c) - 1e-9);
    }
  });

  it("lança erro com lista vazia", () => {
    const pose: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 1, y: 0, z: 0 })];
    expect(() => pickBestCamera(pose, [])).toThrow();
  });
});

describe("cameraLegibilityScore", () => {
  it("câmera com maior separação pontua mais para a mesma pose", () => {
    const pose: Pose = [player({ x: 0, y: 0, z: 0 }), player({ x: 2, y: 0, z: 0 })];
    const camPerp: import("./render-spec").Camera = {
      eye: { x: 1, y: 1, z: 3 },
      target: { x: 1, y: 0, z: 0 },
      up: { x: 0, y: 1, z: 0 },
    };
    const camPar: import("./render-spec").Camera = {
      eye: { x: 4, y: 1, z: 0 },
      target: { x: 1, y: 0, z: 0 },
      up: { x: 0, y: 1, z: 0 },
    };
    expect(cameraLegibilityScore(pose, camPerp)).toBeGreaterThan(
      cameraLegibilityScore(pose, camPar),
    );
  });
});
