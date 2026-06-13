// Enquadramento de câmera + normalização — lógica PURA (sem THREE, sem React), pra ser
// testável. O figura-r3f consome. Opera no espaço da figura (y-up, Pose normalizada).
import type { Fighter, Pose } from "./pose";
import type { Vec3 } from "./geometry";

/** Centroide (média das juntas) de um lutador. */
export function centroid(f: Fighter): Vec3 {
  const js = Object.values(f);
  const s = js.reduce((a, j) => [a[0] + j[0], a[1] + j[1], a[2] + j[2]], [0, 0, 0]);
  return [s[0] / js.length, s[1] / js.length, s[2] / js.length];
}

/**
 * Separação 2D dos dois centroides projetados na vista da câmera. Quanto maior, mais
 * os corpos se separam na imagem → melhor leitura. ~0 = câmera olhando ao longo do eixo.
 */
export function silhouetteSep(c0: Vec3, c1: Vec3, eye: Vec3, target: Vec3, up: Vec3): number {
  const f: Vec3 = [target[0] - eye[0], target[1] - eye[1], target[2] - eye[2]];
  const fl = Math.hypot(...f) || 1;
  const fn: Vec3 = [f[0] / fl, f[1] / fl, f[2] / fl];
  const r: Vec3 = [fn[1] * up[2] - fn[2] * up[1], fn[2] * up[0] - fn[0] * up[2], fn[0] * up[1] - fn[1] * up[0]];
  const rl = Math.hypot(...r) || 1;
  const rn: Vec3 = [r[0] / rl, r[1] / rl, r[2] / rl];
  const u: Vec3 = [fn[1] * rn[2] - fn[2] * rn[1], fn[2] * rn[0] - fn[0] * rn[2], fn[0] * rn[1] - fn[1] * rn[0]];
  const proj = (p: Vec3) => {
    const d: Vec3 = [p[0] - eye[0], p[1] - eye[1], p[2] - eye[2]];
    return [d[0] * rn[0] + d[1] * rn[1] + d[2] * rn[2], d[0] * u[0] + d[1] * u[1] + d[2] * u[2]];
  };
  const a = proj(c0), b = proj(c1);
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

/** Bounds (min/max por eixo) de um conjunto de frames. */
export function boundsOf(frames: Pose[]): { min: Vec3; max: Vec3 } {
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const fr of frames)
    for (const f of Object.values(fr))
      for (const j of Object.values(f))
        for (let i = 0; i < 3; i++) {
          if (j[i] < min[i]) min[i] = j[i];
          if (j[i] > max[i]) max[i] = j[i];
        }
  return { min, max };
}

/** Maior dimensão do bbox de UM frame. */
export function frameSpan(fr: Pose): number {
  const { min, max } = boundsOf([fr]);
  return Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]) || 1;
}

/**
 * Centro + escala fixos pra sequência. Centro = centro da UNIÃO (figura não deriva),
 * escala = MAIOR span de um único frame (não a união) — senão cada frame, subconjunto
 * do envelope do movimento, renderiza pequeno demais.
 */
export function fixedNorm(frames: Pose[]): { center: Vec3; span: number } {
  const { min, max } = boundsOf(frames);
  const center: Vec3 = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  let span = 0;
  for (const fr of frames) span = Math.max(span, frameSpan(fr));
  return { center, span: span || 1 };
}

const AZIMUTES = [0, 0.3, -0.3, 0.55, -0.55, 0.9, -0.9, Math.PI]; // rad ao redor do perp

/**
 * Direção "para onde o peito olha" no PLANO DO CHÃO (componente y descartada). Derivada
 * do esqueleto: a linha dos ombros × o eixo da coluna (quadril→pescoço) dá a normal do
 * tronco. Sem isto, `silhouetteSep` é SIMÉTRICA frente/costas (ver de +perp e de −perp
 * separa idêntico) → a câmera escolhe a traseira por ruído de float e a figura aparece
 * "de costas". Retorna null quando faltam juntas pra inferir (cai no comportamento antigo).
 */
export function facingDir(f: Fighter): Vec3 | null {
  const ls = f.LeftShoulder, rs = f.RightShoulder, neck = f.Neck;
  const lh = f.LeftHip, rh = f.RightHip;
  if (!ls || !rs || !neck || !lh || !rh) return null;
  // eixo dos ombros (esq→dir) e eixo da coluna (centro do quadril → pescoço).
  const shoulder: Vec3 = [rs[0] - ls[0], rs[1] - ls[1], rs[2] - ls[2]];
  const hipMid: Vec3 = [(lh[0] + rh[0]) / 2, (lh[1] + rh[1]) / 2, (lh[2] + rh[2]) / 2];
  const spine: Vec3 = [neck[0] - hipMid[0], neck[1] - hipMid[1], neck[2] - hipMid[2]];
  // normal do tronco = ombros × coluna. Projeta no chão (zera y) e normaliza.
  const n: Vec3 = [
    shoulder[1] * spine[2] - shoulder[2] * spine[1],
    shoulder[2] * spine[0] - shoulder[0] * spine[2],
    shoulder[0] * spine[1] - shoulder[1] * spine[0],
  ];
  const fl = Math.hypot(n[0], 0, n[2]);
  if (fl < 1e-6) return null;
  return [n[0] / fl, 0, n[2] / fl];
}

/**
 * Viés de enquadramento por contexto (tags). O azimute é um OFFSET (rad) somado ao
 * ângulo perpendicular ao eixo entre os lutadores; `elevMult` multiplica a elevação
 * adaptativa. `weight` ∈ [0,1] = quanto a câmera deve insistir nessa intenção antes
 * de abrir mão dela por separação de silhueta.
 *
 *  - GUARDA (fechada/meia): lê melhor de PERFIL puro (offset 0 = já perpendicular ao
 *    eixo cabeça-a-pé dos dois), elevação baixa — o jogo de pernas fica no plano.
 *  - CONTROLE DE TOPO (montada/passagem/100kg/cravado): 3/4 ALTO — desloca o azimute e
 *    sobe a câmera pra mostrar a relação por cima (quem domina).
 *  - EM PÉ (standing/clinch/queda): 3/4 LEVE de frente, elevação ~normal.
 */
export interface CameraHint {
  azOffset: number;
  elevMult: number;
  weight: number;
}

const matches = (t: string, re: RegExp) => re.test(t);

export function cameraHintForTags(tags: readonly string[]): CameraHint | null {
  const T = tags.map((s) => s.toLowerCase());
  const any = (re: RegExp) => T.some((t) => matches(t, re));

  // controle de topo (forte): vê de 3/4 alto.
  if (any(/montad|mount|passa|passing|cem-?quilos|100kg|stacked|crava|crucifi|smash|north|kesa/)) {
    return { azOffset: 0.45, elevMult: 1.6, weight: 0.7 };
  }
  // guarda: perfil puro, câmera baixa.
  if (any(/guard|guarda|meia-?guarda|half|closed|lockdown|fetal/)) {
    return { azOffset: 0, elevMult: 0.7, weight: 0.85 };
  }
  // em pé / clinch / queda: 3/4 leve.
  if (any(/standing|clinch|takedown|throw|trip|sprawl|footsies|de-?p[eé]/)) {
    return { azOffset: 0.3, elevMult: 1.0, weight: 0.5 };
  }
  return null;
}

/**
 * Melhor câmera: orbita azimutes ao redor do alvo e escolhe o que mais separa as
 * silhuetas dos dois lutadores. Elevação adaptativa — poses empilhadas (montada)
 * sobem a câmera pra separar de cima. Com `tags`, parte do azimute/elevação sugeridos
 * por `cameraHintForTags` e só desvia se a silhueta cair muito abaixo do ótimo.
 */
export function bestCamera(p: Pose, tags?: readonly string[]): { position: Vec3; target: Vec3 } {
  const keys = Object.keys(p);
  const c0 = centroid(p[keys[0]]);
  const c1 = keys[1] ? centroid(p[keys[1]]) : c0;
  // Target = CENTRO DO BBOX (não média de centroides). Centroid enviesa pelo
  // agrupamento de juntas (ex: várias juntas no pé puxam o target pra baixo →
  // figura sobe na tela e corta no topo). Bbox center mantém a figura centrada.
  let min: Vec3 = [Infinity, Infinity, Infinity];
  let max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const k of keys)
    for (const j of Object.values(p[k]))
      for (let i = 0; i < 3; i++) {
        if (j[i] < min[i]) min[i] = j[i];
        if (j[i] > max[i]) max[i] = j[i];
      }
  const target: Vec3 = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  let r = 0.4;
  for (const k of keys)
    for (const j of Object.values(p[k]))
      r = Math.max(r, Math.hypot(j[0] - target[0], j[1] - target[1], j[2] - target[2]));

  let ax = c1[0] - c0[0], az = c1[2] - c0[2];
  const len = Math.hypot(ax, az);
  if (len < 1e-6) { ax = 1; az = 0; } else { ax /= len; az /= len; }
  const baseAng = Math.atan2(ax, -az); // ângulo do perpendicular no chão

  const hint = tags ? cameraHintForTags(tags) : null;

  // Frente da figura no chão: peso MAIOR no lutador de cima (quem domina deve encarar a
  // câmera em guarda/montada). Usada como DESEMPATE entre azimutes de separação parecida,
  // pra a câmera olhar a FRENTE e não a traseira (silhouetteSep é simétrica frente/costas).
  const topKey = keys[1] && c1[1] > c0[1] ? keys[1] : keys[0];
  const fTop = facingDir(p[topKey]);
  const fOther = keys[1] ? facingDir(p[topKey === keys[0] ? keys[1] : keys[0]]) : null;
  let facing: Vec3 | null = null;
  if (fTop && fOther) {
    // mistura 70/30 a favor do de cima; renormaliza no chão.
    const m: Vec3 = [fTop[0] * 0.7 + fOther[0] * 0.3, 0, fTop[2] * 0.7 + fOther[2] * 0.3];
    const ml = Math.hypot(m[0], 0, m[2]);
    facing = ml < 1e-6 ? fTop : [m[0] / ml, 0, m[2] / ml];
  } else {
    facing = fTop ?? fOther;
  }

  const hd = Math.abs(c0[1] - c1[1]); // empilhamento vertical
  const alturaMult = Math.min(2.4, Math.max(1.1, 1.5 + (hd / r) * 0.8));
  const dist = r * 2.1; // preenche a altura do quadro 4:3
  const altura = r * alturaMult * (hint ? hint.elevMult : 1);
  const up: Vec3 = [0, 1, 0];

  const eyeAt = (off: number): Vec3 => {
    const ang = baseAng + off;
    return [target[0] + Math.cos(ang) * dist, target[1] + altura, target[2] + Math.sin(ang) * dist];
  };

  // Bônus de FRENTE: −dot(direção-de-visão-no-chão, facing) ∈ [−1,1] (1 = olhando o peito).
  // Escala em unidades de separação (× r) mas PEQUENO (× FRENTE_PESO) → só desempata
  // azimutes de separação parecida; nunca supera uma vista que separa claramente melhor.
  const FRENTE_PESO = 0.5;
  const frente = (eye: Vec3): number => {
    if (!facing) return 0;
    const d: Vec3 = [target[0] - eye[0], 0, target[2] - eye[2]];
    const dl = Math.hypot(d[0], 0, d[2]) || 1;
    const dot = (d[0] * facing[0] + d[2] * facing[2]) / dl;
    return -dot * r * FRENTE_PESO;
  };

  // Sem hint: varre azimutes, maximiza separação + desempate de frente.
  if (!hint) {
    let best: Vec3 | null = null;
    let bestScore = -Infinity;
    for (const off of AZIMUTES) {
      const eye = eyeAt(off);
      const score = silhouetteSep(c0, c1, eye, target, up) + frente(eye);
      if (score > bestScore) { bestScore = score; best = eye; }
    }
    return { position: best!, target };
  }

  // Com hint: PARTE do azimute sugerido e só desvia se a silhueta cair muito. O hint
  // recebe um bônus de separação proporcional ao `weight` — quanto mais forte a
  // intenção, mais separação um ângulo alternativo precisa ganhar pra justificar o
  // desvio. Garante que guarda fique de perfil e topo de 3/4 mesmo quando outro
  // azimute separaria marginalmente mais.
  const hintEye = eyeAt(hint.azOffset);
  const hintSep = silhouetteSep(c0, c1, hintEye, target, up);
  const bonus = hintSep * hint.weight; // margem que o desvio precisa superar
  let best: Vec3 = hintEye;
  let bestScore = hintSep + bonus + frente(hintEye);
  for (const off of [hint.azOffset, ...AZIMUTES]) {
    const eye = eyeAt(off);
    const sep = silhouetteSep(c0, c1, eye, target, up);
    const score = (off === hint.azOffset ? sep + bonus : sep) + frente(eye);
    if (score > bestScore) { bestScore = score; best = eye; }
  }
  return { position: best, target };
}
