// Pictograma 2D a partir de juntas 3D (z-up, espaço Blender do GrappleMap).
// Puro/determinístico: projeta 3/4, normaliza num quadro, devolve segmentos prontos
// pra desenhar (ossos round-cap + tronco + cabeça). O componente SVG só renderiza.

export type Joint = [number, number, number];
export type PlayerPose = Record<string, Joint>;
export type Pose = Record<string, PlayerPose>;

/** Esqueleto: arestas (ossos) desenhadas como traços grossos round-cap. */
export const BONES: [string, string][] = [
  ["Head", "Neck"], ["Neck", "Core"],
  ["Neck", "LeftShoulder"], ["Neck", "RightShoulder"],
  ["LeftShoulder", "LeftElbow"], ["LeftElbow", "LeftWrist"], ["LeftWrist", "LeftHand"],
  ["RightShoulder", "RightElbow"], ["RightElbow", "RightWrist"], ["RightWrist", "RightHand"],
  ["Core", "LeftHip"], ["Core", "RightHip"],
  ["LeftHip", "LeftKnee"], ["LeftKnee", "LeftAnkle"], ["LeftAnkle", "LeftToe"],
  ["RightHip", "RightKnee"], ["RightKnee", "RightAnkle"], ["RightAnkle", "RightToe"],
];
/** Polígono do tronco (massa do corpo). */
export const TORSO = ["LeftShoulder", "RightShoulder", "RightHip", "LeftHip"];

export interface PictogramaOpts {
  width?: number;
  height?: number;
  pad?: number;
  /** azimute (rad) da projeção 3/4. */
  az?: number;
  /** inclinação (quanto a profundidade vira altura na tela). */
  tilt?: number;
}

export interface FiguraLayout {
  /** segmentos [[x1,y1],[x2,y2]] de cada osso. */
  bones: [[number, number], [number, number]][];
  /** vértices do polígono do tronco. */
  torso: [number, number][];
  head: { cx: number; cy: number; r: number };
}

export interface PictogramaLayout {
  width: number;
  height: number;
  strokeWidth: number;
  /** slug do player de cima (frente) e de baixo (atrás). */
  top: string;
  bottom: string;
  figuras: Record<string, FiguraLayout>;
}

function project([x, y, z]: Joint, az: number, tilt: number): [number, number] {
  const rx = x * Math.cos(az) - y * Math.sin(az);
  const ry = x * Math.sin(az) + y * Math.cos(az);
  return [rx, z - ry * tilt]; // 2D, y pra cima
}

/** Monta o layout 2D do pictograma a partir de uma pose de 2 players. */
export function buildPictograma(pose: Pose, opts: PictogramaOpts = {}): PictogramaLayout {
  const W = opts.width ?? 760;
  const H = opts.height ?? 600;
  const PAD = opts.pad ?? 70;
  const az = opts.az ?? 0.62;
  const tilt = opts.tilt ?? 0.5;

  const players = Object.keys(pose);
  // projeta tudo + bounds
  const proj: Record<string, Record<string, [number, number]>> = {};
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const pk of players) {
    proj[pk] = {};
    for (const [jn, co] of Object.entries(pose[pk])) {
      const q = project(co, az, tilt);
      proj[pk][jn] = q;
      minX = Math.min(minX, q[0]); maxX = Math.max(maxX, q[0]);
      minY = Math.min(minY, q[1]); maxY = Math.max(maxY, q[1]);
    }
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const s = Math.min((W - 2 * PAD) / spanX, (H - 2 * PAD) / spanY);
  const offX = (W - spanX * s) / 2;
  const offY = (H - spanY * s) / 2;
  const figH = spanY * s;
  const strokeWidth = Math.max(8, Math.round(figH / 13));

  const toScreen = ([px, py]: [number, number]): [number, number] => [
    Math.round((offX + (px - minX) * s) * 10) / 10,
    Math.round((H - (offY + (py - minY) * s)) * 10) / 10, // flip y (tela)
  ];

  const top = players.reduce((a, b) => (pose[a].Head[2] > pose[b].Head[2] ? a : b));
  const bottom = players.find((k) => k !== top) ?? top;

  const figuras: Record<string, FiguraLayout> = {};
  for (const pk of players) {
    const J: Record<string, [number, number]> = {};
    for (const jn of Object.keys(proj[pk])) J[jn] = toScreen(proj[pk][jn]);
    figuras[pk] = {
      bones: BONES.filter(([a, b]) => J[a] && J[b]).map(([a, b]) => [J[a], J[b]]),
      torso: TORSO.filter((j) => J[j]).map((j) => J[j]),
      head: { cx: J.Head?.[0] ?? 0, cy: J.Head?.[1] ?? 0, r: Math.round(figH / 12) },
    };
  }

  return { width: W, height: H, strokeWidth, top, bottom, figuras };
}
