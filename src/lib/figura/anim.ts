// Interpolação de pose pura — base da animação de transições (GrappleMap tinha).
// Stack-agnóstico: o renderer R3F amostra a sequência por frame e reconstrói a geometria.
import type { Pose, Fighter, Joint } from "./pose";
import { SKELETON } from "./pose";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpJoint(a: Joint, b: Joint, t: number): Joint {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

// --- helpers vetoriais (3D) ---
function sub(a: Joint, b: Joint): [number, number, number] {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function len3(v: readonly [number, number, number]): number {
  return Math.hypot(v[0], v[1], v[2]);
}
function add3(a: Joint, v: readonly [number, number, number]): Joint {
  return [a[0] + v[0], a[1] + v[1], a[2] + v[2]];
}

/**
 * SLERP de direções unitárias (interpolação esférica). Mantém o vetor na esfera ao
 * longo do arco — é isso que faz o cotovelo VARRER um arco em vez de cortar reto pelo
 * meio (e encolher). Cai pra normalize-do-lerp em casos quase-paralelos/antiparalelos.
 */
function slerpDir(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
): [number, number, number] {
  let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  dot = Math.max(-1, Math.min(1, dot));
  // quase coincidentes → lerp linear normalizado (slerp degenera / instável)
  if (dot > 0.9995) {
    const v: [number, number, number] = [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
    const l = len3(v) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }
  // quase antiparalelos → o arco é ambíguo (sin θ → 0, slerp explode). Roda 180° por
  // um eixo perpendicular estável: o arco é bem-definido e o comprimento se mantém.
  if (dot < -0.9995) {
    // eixo perpendicular a `a` (Hughes–Möller): zera a menor componente.
    const ax = Math.abs(a[0]), ay = Math.abs(a[1]), az = Math.abs(a[2]);
    let perp: [number, number, number];
    if (ax <= ay && ax <= az) perp = [0, -a[2], a[1]];
    else if (ay <= az) perp = [-a[2], 0, a[0]];
    else perp = [-a[1], a[0], 0];
    const pl = len3(perp) || 1;
    perp = [perp[0] / pl, perp[1] / pl, perp[2] / pl];
    const ang = Math.PI * t; // 0 → a, π → -a (= b)
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const v: [number, number, number] = [a[0] * ca + perp[0] * sa, a[1] * ca + perp[1] * sa, a[2] * ca + perp[2] * sa];
    const l = len3(v) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }
  const theta = Math.acos(dot);
  const sin = Math.sin(theta);
  const w0 = Math.sin((1 - t) * theta) / sin;
  const w1 = Math.sin(t * theta) / sin;
  const v: [number, number, number] = [
    a[0] * w0 + b[0] * w1,
    a[1] * w0 + b[1] * w1,
    a[2] * w0 + b[2] * w1,
  ];
  const l = len3(v) || 1; // ~1, renormaliza por segurança numérica
  return [v[0] / l, v[1] / l, v[2] / l];
}

/**
 * Adjacência pai→filhos e filho→pai do SKELETON. Juntas raízes (sem pai presente no
 * lutador) viram âncoras lerp-adas direto; o resto da cadeia é reconstruído por
 * slerp(direção) + lerp(comprimento) propagando a partir delas.
 */
const CHILDREN: Record<string, string[]> = {};
const PARENT: Record<string, string> = {};
for (const [parent, child] of SKELETON) {
  (CHILDREN[parent] ??= []).push(child);
  PARENT[child] = parent;
}

/**
 * Interpola um lutador preservando o COMPRIMENTO de cada osso. Para cada osso pai→filho:
 * lerp do comprimento + SLERP da direção (vetor unitário) → reconstrói filho =
 * pai_interpolado + dir_slerp * comprimento_lerp. Propaga pela cadeia (ombro→cotovelo→
 * punho→mão), então o membro inteiro varre em arco sem encolher no meio.
 *
 * Âncoras (juntas que não são filhas de nenhum osso — ex: Core/Neck pela topologia, ou
 * juntas órfãs) são lerp-adas linearmente: dão a base do corpo, o resto pendura nelas.
 */
function lerpFighter(a: Fighter, b: Fighter, t: number): Fighter {
  const out: Record<string, Joint> = {};

  // 1) ÂNCORAS: juntas de `a` cujo pai NÃO está presente em `a` (raiz da cadeia, ou
  //    osso quebrado pela topologia desse lutador). Posição = lerp linear direto.
  const queue: string[] = [];
  for (const [name, ja] of Object.entries(a)) {
    const parent = PARENT[name];
    if (parent && a[parent]) continue; // tem pai presente → resolvido na fase 2
    const jb = b[name];
    out[name] = jb ? lerpJoint(ja, jb, t) : ja;
    queue.push(name);
  }

  // 2) PROPAGA pela cadeia a partir das âncoras (BFS). Cada osso pai→filho:
  //    lerp(comprimento) + slerp(direção) ancorado no PAI já interpolado → o membro
  //    inteiro varre em arco e conserva o comprimento (sem encolher pela corda).
  while (queue.length) {
    const parent = queue.shift()!;
    for (const child of CHILDREN[parent] ?? []) {
      if (out[child] || !a[child]) continue;
      const ca = a[child];
      const cb = b[child];
      const pa = a[parent];
      const pb = b[parent];
      const anchor = out[parent];
      if (cb && pb) {
        const da = sub(ca, pa);
        const db = sub(cb, pb);
        const la = len3(da) || 1e-9;
        const lb = len3(db) || 1e-9;
        const dirA: [number, number, number] = [da[0] / la, da[1] / la, da[2] / la];
        const dirB: [number, number, number] = [db[0] / lb, db[1] / lb, db[2] / lb];
        const dir = slerpDir(dirA, dirB, t);
        const L = lerp(la, lb, t);
        out[child] = add3(anchor, [dir[0] * L, dir[1] * L, dir[2] * L]);
      } else {
        // sem correspondente em b: mantém o offset de `a` relativo à âncora interpolada.
        out[child] = add3(anchor, sub(ca, pa));
      }
      queue.push(child);
    }
  }

  // 3) salvaguarda: qualquer junta que escapou (não deveria) → lerp direto.
  for (const [name, ja] of Object.entries(a)) {
    if (out[name]) continue;
    const jb = b[name];
    out[name] = jb ? lerpJoint(ja, jb, t) : ja;
  }

  // 4) ORDEM: as fases 1–2 inserem por âncora→BFS, embaralhando a ordem das chaves
  //    vs. a entrada. O renderer animado casa juntas por ÍNDICE com a topologia do
  //    frame 0 — ordem trocada = esfera no lugar errado (cabeça "descola" do corpo).
  //    Reemite na ordem original de `a` pra manter o índice estável entre frames.
  const ordered: Record<string, Joint> = {};
  for (const name of Object.keys(a)) ordered[name] = out[name] ?? a[name];
  return ordered;
}

/** Interpola duas poses osso a osso (t ∈ [0,1]), preservando comprimentos. Itera os lutadores de `a`. */
export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const out: Record<string, Fighter> = {};
  for (const [pk, fa] of Object.entries(a)) {
    const fb = b[pk];
    out[pk] = fb ? lerpFighter(fa, fb, t) : fa;
  }
  return out;
}

/** Amostra uma sequência de keyframes em t ∈ [0,1] sobre a sequência inteira. */
export function sampleSequence(frames: Pose[], t: number): Pose {
  if (frames.length === 1) return frames[0];
  const clamped = t <= 0 ? 0 : t >= 1 ? 1 : t;
  const span = (frames.length - 1) * clamped; // posição contínua no array
  const i = Math.min(Math.floor(span), frames.length - 2);
  return lerpPose(frames[i], frames[i + 1], span - i);
}
