// Geometria 3D pura derivada de pose.ts. Stack-agnóstico — o renderer R3F mapeia
// cada BoneSeg/JointNode pra <mesh> (cilindro/esfera). Sem THREE aqui: é testável.
import type { Fighter, Joint } from "./pose";
import { bonesOf } from "./pose";

export type Vec3 = [number, number, number];
export type Quat = [number, number, number, number]; // x, y, z, w

export interface BoneSeg {
  a: string;
  b: string;
  position: Vec3; // ponto médio
  quaternion: Quat; // gira +Y → direção (b-a)
  length: number;
  radius0: number; // raio na ponta `a` (= raio da junta a)
  radius1: number; // raio na ponta `b` (= raio da junta b)
}

/** Papel estrutural da junta → base pra cor + legenda no site. */
export type JointRole = "cabeca" | "tronco" | "articulacao" | "mao" | "pe";

export interface JointNode {
  name: string;
  position: Vec3;
  radius: number;
  role: JointRole;
}

export interface FiguraGeometry {
  bones: BoneSeg[];
  joints: JointNode[];
}

/** Classificação junta→papel. Pensada pra legibilidade BJJ: onde estão mãos
 *  (pegada/grip), pés (base/ganchos), cabeça, articulações e massa do tronco. */
export function jointRole(name: string): JointRole {
  if (name === "Head") return "cabeca";
  if (/Hand|Wrist|Fingers/.test(name)) return "mao";
  if (/Ankle|Heel|Toe/.test(name)) return "pe";
  if (/Elbow|Knee/.test(name)) return "articulacao";
  return "tronco"; // Neck, Core, Shoulder, Hip
}

/** Raio de exibição da esfera da junta (porte do JOINT_RADIUS do spike). */
export function jointRadius(name: string): number {
  if (name === "Head") return 0.085;
  if (name === "Core") return 0.06;
  if (name === "Neck") return 0.035;
  if (name.includes("Hip")) return 0.045;
  if (name.includes("Shoulder")) return 0.04;
  if (name.includes("Knee")) return 0.038;
  if (name.includes("Elbow") || name.includes("Ankle")) return 0.028;
  if (name.includes("Wrist") || name.includes("Heel")) return 0.022;
  if (name.includes("Hand") || name.includes("Toe")) return 0.018;
  if (name.includes("Fingers")) return 0.014;
  return 0.02;
}

function mid(a: Joint, b: Joint): Vec3 {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

function dist(a: Joint, b: Joint): number {
  return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
}

const UP: Vec3 = [0, 1, 0];

/** Quaternion que leva o vetor unitário `from` em `to` (porte de THREE.setFromUnitVectors). */
export function quatFromUnitVectors(from: Vec3, to: Vec3): Quat {
  let r = from[0] * to[0] + from[1] * to[1] + from[2] * to[2] + 1;
  let x: number, y: number, z: number;
  if (r < 1e-6) {
    // antiparalelo: gira 180° num eixo perpendicular a `from`.
    r = 0;
    if (Math.abs(from[0]) > Math.abs(from[2])) {
      x = -from[1]; y = from[0]; z = 0;
    } else {
      x = 0; y = -from[2]; z = from[1];
    }
  } else {
    x = from[1] * to[2] - from[2] * to[1];
    y = from[2] * to[0] - from[0] * to[2];
    z = from[0] * to[1] - from[1] * to[0];
  }
  const n = Math.hypot(x, y, z, r) || 1;
  return [x / n, y / n, z / n, r / n];
}

/** Aplica quaternion a um vetor (v' = q * v * q⁻¹). */
export function rotateVec(q: Quat, v: Vec3): Vec3 {
  const [qx, qy, qz, qw] = q;
  const [vx, vy, vz] = v;
  // t = 2 * cross(q.xyz, v)
  const tx = 2 * (qy * vz - qz * vy);
  const ty = 2 * (qz * vx - qx * vz);
  const tz = 2 * (qx * vy - qy * vx);
  return [
    vx + qw * tx + (qy * tz - qz * ty),
    vy + qw * ty + (qz * tx - qx * tz),
    vz + qw * tz + (qx * ty - qy * tx),
  ];
}

function quatForBone(a: Joint, b: Joint): Quat {
  const d: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const len = Math.hypot(d[0], d[1], d[2]) || 1;
  return quatFromUnitVectors(UP, [d[0] / len, d[1] / len, d[2] / len]);
}

export function buildFigura(f: Fighter): FiguraGeometry {
  const bones: BoneSeg[] = bonesOf(f).map(([a, b]) => ({
    a,
    b,
    position: mid(f[a], f[b]),
    quaternion: quatForBone(f[a], f[b]),
    length: dist(f[a], f[b]),
    radius0: jointRadius(a),
    radius1: jointRadius(b),
  }));
  const joints: JointNode[] = Object.entries(f).map(([name, p]) => ({
    name,
    position: [p[0], p[1], p[2]] as Vec3,
    radius: jointRadius(name),
    role: jointRole(name),
  }));
  return { bones, joints };
}
