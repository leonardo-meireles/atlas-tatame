// Lib de pose modernizada (o "novo GrappleMap" tipado). Modelo de dados + esqueleto +
// geometria pura, stack-agnóstico: o renderer 2D (pictograma) e o futuro 3D consomem isto.

export type Joint = readonly [number, number, number];
export type Fighter = Readonly<Record<string, Joint>>;
/** Pose = dois lutadores (chaves "p0"/"p1"), cada um um mapa junta→coord 3D (z-up). */
export type Pose = Readonly<Record<string, Fighter>>;

/** Esqueleto: arestas (ossos). Canônico — consumido pelo 2D e pelo 3D. */
export const SKELETON: readonly [string, string][] = [
  ["Head", "Neck"], ["Neck", "Core"],
  ["Neck", "LeftShoulder"], ["Neck", "RightShoulder"],
  ["LeftShoulder", "LeftElbow"], ["LeftElbow", "LeftWrist"], ["LeftWrist", "LeftHand"],
  ["RightShoulder", "RightElbow"], ["RightElbow", "RightWrist"], ["RightWrist", "RightHand"],
  ["Core", "LeftHip"], ["Core", "RightHip"],
  ["LeftHip", "LeftKnee"], ["LeftKnee", "LeftAnkle"], ["LeftAnkle", "LeftToe"],
  ["RightHip", "RightKnee"], ["RightKnee", "RightAnkle"], ["RightAnkle", "RightToe"],
];

export interface Bounds {
  min: [number, number, number];
  max: [number, number, number];
}

/** Lutador de cima (frente) = cabeça mais alta no eixo z. */
export function topFighter(pose: Pose): string {
  const keys = Object.keys(pose);
  return keys.reduce((a, b) => (pose[a].Head[2] >= pose[b].Head[2] ? a : b));
}

/** Ossos presentes nesse lutador (pula arestas com junta faltando). */
export function bonesOf(f: Fighter): [string, string][] {
  return SKELETON.filter(([a, b]) => f[a] && f[b]).map(([a, b]) => [a, b]);
}

/** Centroide (média das juntas) de um lutador. */
export function centroid(f: Fighter): [number, number, number] {
  const js = Object.values(f);
  const s = js.reduce((a, j) => [a[0] + j[0], a[1] + j[1], a[2] + j[2]] as [number, number, number], [0, 0, 0]);
  const n = js.length || 1;
  return [s[0] / n, s[1] / n, s[2] / n];
}

/** Caixa envolvente de todos os lutadores. */
export function bounds(pose: Pose): Bounds {
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (const f of Object.values(pose)) {
    for (const j of Object.values(f)) {
      for (let i = 0; i < 3; i++) {
        if (j[i] < min[i]) min[i] = j[i];
        if (j[i] > max[i]) max[i] = j[i];
      }
    }
  }
  return { min, max };
}

/** Recentra o bbox na origem e escala pra maior dimensão = 1. Stack-agnóstico. */
export function normalize(pose: Pose): Pose {
  const b = bounds(pose);
  const c = [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2];
  const span = Math.max(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]) || 1;
  const out: Record<string, Fighter> = {};
  for (const [pk, f] of Object.entries(pose)) {
    const nf: Record<string, Joint> = {};
    for (const [jn, j] of Object.entries(f)) {
      nf[jn] = [(j[0] - c[0]) / span, (j[1] - c[1]) / span, (j[2] - c[2]) / span];
    }
    out[pk] = nf;
  }
  return out;
}
