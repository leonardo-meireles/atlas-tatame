import type { PlayerPose, Pose, Vec3 } from "./parser";

// Espaço do GrappleMap: y = cima. Toda a geometria aqui é pura e determinística,
// pra que a seleção de variante e a câmera escalem sem hand-tuning por pose.

/** Centroide (média das juntas) de um lutador. */
export function playerCentroid(p: PlayerPose): Vec3 {
  const s = p.reduce((a, j) => ({ x: a.x + j.x, y: a.y + j.y, z: a.z + j.z }), { x: 0, y: 0, z: 0 });
  const n = p.length;
  return { x: s.x / n, y: s.y / n, z: s.z / n };
}

/** Distância no plano do chão (x,z), ignorando altura. */
function groundDist(a: Vec3, b: Vec3): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

/**
 * Projeção 2D de um ponto 3D a partir de uma câmera (right/up vetores do frustum).
 * Devolve coordenadas no plano da câmera (sem perspectiva — suficiente pra medir
 * separação de silhueta entre centroides).
 */
function projectOntoCamera(p: Vec3, cam: Camera): { u: number; v: number } {
  const dx = p.x - cam.eye.x;
  const dy = p.y - cam.eye.y;
  const dz = p.z - cam.eye.z;
  // forward (normalizado)
  const fx = cam.target.x - cam.eye.x;
  const fy = cam.target.y - cam.eye.y;
  const fz = cam.target.z - cam.eye.z;
  const fl = Math.hypot(fx, fy, fz) || 1;
  // right = forward × up
  const rx = fy * cam.up.z - fz * cam.up.y;
  const ry = fz * cam.up.x - fx * cam.up.z;
  const rz = fx * cam.up.y - fy * cam.up.x;
  const rl = Math.hypot(rx, ry, rz) || 1;
  // up recalculado (ortogonal)
  const ux = (fy / fl) * (rz / rl) - (fz / fl) * (ry / rl);
  const uy = (fz / fl) * (rx / rl) - (fx / fl) * (rz / rl);
  const uz = (fx / fl) * (ry / rl) - (fy / fl) * (rx / rl);
  return {
    u: dx * (rx / rl) + dy * (ry / rl) + dz * (rz / rl),
    v: dx * ux + dy * uy + dz * uz,
  };
}

/**
 * Separação 2D dos centroides dos dois jogadores conforme vista de uma câmera.
 * Quanto maior, mais os dois corpos se separam visualmente — melhor legibilidade.
 */
export function cameraSilhouetteSeparation(pose: Pose, cam: Camera): number {
  const proj0 = projectOntoCamera(playerCentroid(pose[0]), cam);
  const proj1 = projectOntoCamera(playerCentroid(pose[1]), cam);
  return Math.hypot(proj0.u - proj1.u, proj0.v - proj1.v);
}

const ALTURA_PESO = 1;

/**
 * Quão legível uma pose é de uma boa câmera: lutadores mais separados no chão e
 * com mais diferença de altura (ex: deitado vs ajoelhado) leem melhor em 3/4.
 * A pontuação é independente de câmera — usada pra escolher a melhor variante
 * entre múltiplas representações da mesma posição.
 */
export function legibilityScore(pose: Pose): number {
  const c0 = playerCentroid(pose[0]);
  const c1 = playerCentroid(pose[1]);
  return groundDist(c0, c1) + ALTURA_PESO * Math.abs(c0.y - c1.y);
}

/** Entre variantes do mesmo conceito (ex: várias guardas fechadas), a mais legível. */
export function pickClearestVariant<T extends { pose: Pose }>(variantes: T[]): T {
  if (variantes.length === 0) throw new Error("pickClearestVariant: lista vazia");
  return variantes.reduce((best, v) =>
    legibilityScore(v.pose) > legibilityScore(best.pose) ? v : best,
  );
}

export interface Camera {
  eye: Vec3;
  target: Vec3;
  up: Vec3;
}

/** Maior distância de qualquer junta até um ponto (raio de enquadramento). */
function boundingRadius(pose: Pose, center: Vec3): number {
  let r = 0;
  for (const p of pose) {
    for (const j of p) {
      r = Math.max(r, Math.hypot(j.x - center.x, j.y - center.y, j.z - center.z));
    }
  }
  return r;
}

/**
 * Diferença de altura entre os dois centroides — usada pra calibrar o ângulo de
 * elevação da câmera. Poses verticalmente empilhadas (montada = um por cima do outro)
 * precisam de um ângulo de câmera mais alto pra separar as silhuetas.
 */
function heightDiff(pose: Pose): number {
  const c0 = playerCentroid(pose[0]);
  const c1 = playerCentroid(pose[1]);
  return Math.abs(c0.y - c1.y);
}

// Câmera base: afastamento e elevação adaptativos
const BASE_DIST_MULT = 2.6;
const BASE_ALTURA_MULT = 1.5;
// Bônus de elevação pra poses com muito stacking vertical (ex: montada, back mount).
// Fórmula: ALTURA_MULT += heightDiff / radius * ELEVACAO_BONUS_SCALE
const ELEVACAO_BONUS_SCALE = 0.8;
// Câmera não desce abaixo deste multiplicador mesmo pra poses muito achatadas.
const MIN_ALTURA_MULT = 1.1;
// Câmera não sobe acima deste multiplicador pra não virar top-down puro.
const MAX_ALTURA_MULT = 2.4;

/**
 * Câmera determinística que enquadra os dois lutadores olhando ATRAVESSANDO a linha
 * que os une (regra que destrava a legibilidade no chão), elevada em 3/4.
 *
 * Adaptações em relação à versão original:
 * - Elevação adaptativa: poses com muito stacking vertical (montada, back mount)
 *   recebem câmera mais alta pra separar as silhuetas horizontalmente na imagem.
 * - Distância mínima garantida: poses onde boundingRadius é muito pequeno (lutadores
 *   colados) não ficam com câmera colada no centro.
 */
export function cameraFor(pose: Pose): Camera {
  const c0 = playerCentroid(pose[0]);
  const c1 = playerCentroid(pose[1]);
  const target: Vec3 = { x: (c0.x + c1.x) / 2, y: (c0.y + c1.y) / 2, z: (c0.z + c1.z) / 2 };

  // eixo entre os lutadores, no plano do chão
  let ax = c1.x - c0.x;
  let az = c1.z - c0.z;
  const len = Math.hypot(ax, az);
  if (len < 1e-6) {
    ax = 1; // degenerado (centroides coincidem): eixo padrão
    az = 0;
  } else {
    ax /= len;
    az /= len;
  }
  // perpendicular no chão = girar 90°
  const perp = { x: -az, z: ax };

  const radius = Math.max(boundingRadius(pose, target), 0.4); // mínimo 0.4 m
  const dist = radius * BASE_DIST_MULT;

  // Elevação adaptativa: bônus se os lutadores estão empilhados verticalmente
  const hd = heightDiff(pose);
  const elevacaoBonus = (hd / radius) * ELEVACAO_BONUS_SCALE;
  const alturaMult = Math.min(
    MAX_ALTURA_MULT,
    Math.max(MIN_ALTURA_MULT, BASE_ALTURA_MULT + elevacaoBonus),
  );
  const altura = radius * alturaMult;

  return {
    target,
    up: { x: 0, y: 1, z: 0 },
    eye: {
      x: target.x + perp.x * dist,
      y: target.y + altura,
      z: target.z + perp.z * dist,
    },
  };
}

/**
 * Offsets de azimute (graus) ao redor da câmera primária, pra múltiplos POVs.
 * Os offsets intermediários (+55 / -55) mostram ângulos 3/4 (melhor p/ BJJ ground),
 * e os opostos (130 / -130 / 180) mostram o verso da pose.
 */
const POV_OFFSETS_DEG = [0, 55, -55, 130, -130, 180];

/**
 * Várias câmeras orbitando o alvo — perspectivas diferentes da MESMA pose, pra
 * entender a posição de vários lados. A primeira é sempre a primária (cameraFor).
 */
export function camerasFor(pose: Pose, count = 4): Camera[] {
  const base = cameraFor(pose);
  const { target, up } = base;
  const gx = base.eye.x - target.x;
  const gz = base.eye.z - target.z;
  const groundR = Math.hypot(gx, gz) || 1;
  const altura = base.eye.y - target.y;
  const baseAng = Math.atan2(gz, gx);

  return Array.from({ length: count }, (_, i) => {
    const ang = baseAng + (POV_OFFSETS_DEG[i % POV_OFFSETS_DEG.length] * Math.PI) / 180;
    return {
      target,
      up,
      eye: {
        x: target.x + Math.cos(ang) * groundR,
        y: target.y + altura,
        z: target.z + Math.sin(ang) * groundR,
      },
    };
  });
}

/**
 * Entre um conjunto de câmeras candidatas, retorna a que maximiza a separação de
 * silhueta dos dois jogadores no plano da câmera. Usa cameraSilhouetteSeparation.
 *
 * Útil no pipeline de batch quando as câmeras orbitantes de camerasFor já foram
 * geradas e queremos a mais legível sem hand-tuning por pose.
 */
export function pickBestCamera(pose: Pose, cameras: Camera[]): Camera {
  if (cameras.length === 0) throw new Error("pickBestCamera: lista vazia");
  return cameras.reduce((best, cam) =>
    cameraSilhouetteSeparation(pose, cam) > cameraSilhouetteSeparation(pose, best) ? cam : best,
  );
}

/**
 * Pontuação de legibilidade de uma câmera específica para uma pose.
 * Combina separação de silhueta (visual 2D) com a pontuação base de pose.
 * Normalizada para ser comparável entre poses diferentes.
 */
export function cameraLegibilityScore(pose: Pose, cam: Camera): number {
  const basePose = legibilityScore(pose);
  const separation = cameraSilhouetteSeparation(pose, cam);
  // Pesos: separação de silhueta vale 60%, score de pose vale 40%
  return separation * 0.6 + basePose * 0.4;
}
