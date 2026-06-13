import type { GMPosition, GMTransition, Pose as GMPose } from "./parser";
import { JOINTS } from "./parser";
import { gmKey, PT_BR_NAMES } from "./pt-br-names";
import { fallbackSlug, fallbackName } from "./to-grafo";
import { pickClearestVariant } from "./render-spec";
import type { Grafo, Posicao, Transicao, Seta } from "@/lib/types";

/**
 * Colapso de conceito: várias variantes finas do GrappleMap → um conceito
 * canônico nosso (slug). Regras por palavra-chave, em ordem (primeira casa vence).
 * Retorna null quando não reconhece — aí a variante fica fora do grafo curado.
 */
const CONCEITOS: { needles: string[]; slug: string }[] = [
  { needles: ["mount", "mounted"], slug: "montada" },
  { needles: ["closed guard", "full guard"], slug: "guarda-fechada" },
  { needles: ["half guard", "half-guard", "deep half", "z-guard", "z guard"], slug: "meia-guarda" },
  { needles: ["knee on belly", "knee-on-belly"], slug: "joelho-na-barriga" },
  { needles: ["north south", "north-south"], slug: "norte-sul" },
  // kesa-gatame ANTES de cem-quilos (first-match-wins) — carve out judo side control
  // que estava sendo absorvido como uma variante do cem-quilos genérico.
  { needles: ["kesa", "scarf"], slug: "kesa-gatame" },
  { needles: ["side control", "side mount", "100 kilos"], slug: "cem-quilos" },
  { needles: ["back control", "back mount", "rear", "harness"], slug: "pegada-nas-costas" },
  { needles: ["turtle"], slug: "tartaruga" },
  { needles: ["butterfly"], slug: "guarda-borboleta" },
  { needles: ["de la riva", "de-la-riva", "dlr"], slug: "guarda-de-la-riva" },
  { needles: ["open guard", "seated guard"], slug: "guarda-aberta" },
];

export function collapseConcept(gmName: string): string | null {
  const k = gmKey(gmName);
  for (const c of CONCEITOS) {
    if (c.needles.some((n) => k.includes(n))) return c.slug;
  }
  return null;
}

/**
 * Conceito por TAG do GrappleMap — mais confiável que substring no nome.
 * Inclui hubs novos com presença forte nas tags (guarda-x, guarda-z, etc.) que
 * o needle por nome estava perdendo. Aplicado ANTES do collapseConcept(name).
 */
const CONCEITO_POR_TAG: Record<string, string> = {
  closed_guard: "guarda-fechada",
  full_guard: "guarda-fechada",
  mount: "montada",
  half_guard: "meia-guarda",
  side_control: "cem-quilos",
  knee_on_belly: "joelho-na-barriga",
  north_south: "norte-sul",
  turtle: "tartaruga",
  butterfly: "guarda-borboleta",
  de_la_riva: "guarda-de-la-riva",
  back: "pegada-nas-costas",
  open_guard: "guarda-aberta",
  // Hubs NOVOS — agentes acharam presença significativa nas tags.
  x_guard: "guarda-x",
  z_guard: "guarda-z",
  rubber_guard: "guarda-borracha",
  spiderweb: "spiderweb",
  deep_half: "meia-guarda-profunda",
};

export function collapseConceptByTags(tags: readonly string[]): string | null {
  for (const t of tags) {
    const s = CONCEITO_POR_TAG[t];
    if (s) return s;
  }
  return null;
}

/** Nome de display BR por conceito. */
export const CONCEITO_NOME: Record<string, string> = {
  "guarda-fechada": "Guarda Fechada",
  montada: "Montada",
  "meia-guarda": "Meia-Guarda",
  "joelho-na-barriga": "Joelho na Barriga",
  "norte-sul": "Norte-Sul",
  "cem-quilos": "Cem-Quilos",
  "pegada-nas-costas": "Pegada nas Costas",
  tartaruga: "Tartaruga",
  "guarda-borboleta": "Guarda Borboleta",
  "guarda-de-la-riva": "Guarda De La Riva",
  "guarda-aberta": "Guarda Aberta",
  // Hubs NOVOS via tags.
  "guarda-x": "Guarda-X",
  "guarda-z": "Guarda-Z",
  "guarda-borracha": "Guarda Borracha",
  spiderweb: "Spider Web",
  "meia-guarda-profunda": "Meia-Guarda Profunda",
  // Carve out do cem-quilos (judo side control distinto).
  "kesa-gatame": "Kesa-Gatame",
};

/** Resumo curto por conceito (pros nós novos não ficarem com painel vazio). */
const CONCEITO_RESUMO: Record<string, string> = {
  "meia-guarda":
    "Uma perna do oponente presa entre as suas — meio caminho entre ter a guarda e ser passado. Daqui você recupera a guarda ou raspa.",
  "joelho-na-barriga":
    "Oponente ajoelhado com o joelho no seu abdômen — pressão alta e muita mobilidade pra ele atacar. Quadril e enquadramento pra sair.",
  "pegada-nas-costas":
    "Oponente nas suas costas com os ganchos — a pior posição defensiva. Proteger o pescoço vem antes de tudo.",
  "norte-sul":
    "Oponente por cima, cabeça com cabeça invertida — peso no peito e ameaça de estrangulamento.",
  "cem-quilos":
    "Oponente atravessado por cima, peito no peito — controle dominante logo depois da passagem.",
  "guarda-borboleta":
    "Sentado, ganchos (pés) por dentro das coxas do oponente — guarda de elevar e raspar.",
  "guarda-de-la-riva":
    "Gancho do pé por fora da coxa do oponente em pé — guarda aberta de desequilibrar e ir às costas.",
  "guarda-aberta":
    "Pernas livres controlando o oponente sem fechar — base de raspagens e triângulos.",
  tartaruga:
    "De quatro, se defendendo — recuperar a guarda antes de entregar as costas.",
  "guarda-x":
    "Sentado embaixo, uma perna do oponente entre as suas formando um X — guarda de raspagem e desequilíbrio em pé.",
  "guarda-z":
    "Meia-guarda com joelho atravessado bloqueando o quadril do oponente — frame forte que abre raspagem e recuperação.",
  "guarda-borracha":
    "Quadril alto, perna sobre o ombro do oponente (mission control) — guarda de borracha clássica do 10th Planet.",
  spiderweb:
    "Posição de armlock pela cabeça-e-braço com a perna travando — porção alta do armbar do guarda.",
  "meia-guarda-profunda":
    "Cabeça embaixo do quadril do oponente, perna entrelaçada — sai pra raspagem por baixo ou ataque de pé.",
  "kesa-gatame":
    "Controle lateral do judô — peso no peito, braço próximo travado por baixo da axila + gola, cabeça perto do quadril.",
};

/** Setas de anotação por conceito (sobre a figura). Coords em % da caixa. */
const CONCEITO_SETAS: Record<string, Seta[]> = {
  "joelho-na-barriga": [
    { tipo: "pressao", x: 42, y: 44, dx: 0, dy: 15, rotulo: "peso no joelho" },
    { tipo: "pegada", x: 50, y: 34, rotulo: "gola + manga" },
    { tipo: "direcao", x: 20, y: 60, dx: 12, dy: -2, rotulo: "enquadrar e sair" },
  ],
  "cem-quilos": [
    { tipo: "pressao", x: 46, y: 38, dx: 0, dy: 14, rotulo: "peito no peito" },
    { tipo: "pegada", x: 30, y: 50, rotulo: "underhook" },
  ],
};

/** Figura renderizada por conceito (renders gm/, ver public/stills/gm/index.json). */
const CONCEITO_FIGURA: Record<string, string> = {
  "joelho-na-barriga": "/stills/gm/192-knee-on-belly-drape.png",
  "guarda-de-la-riva": "/stills/gm/46-standing-vs-reverse-dlr.png",
  "guarda-borboleta": "/stills/gm/149-combat-base-vs-butterfly.png",
  "pegada-nas-costas": "/stills/gm/198-rear-naked-choke-w-arm-trapped.png",
  "guarda-aberta": "/stills/gm/324-kneeling-vs-seated-open-guard-w-2-on-1.png",
  "meia-guarda": "/stills/gm/155-half-guard-shell.png",
  "cem-quilos": "/stills/conceitos/cem-quilos.png",
  "norte-sul": "/stills/conceitos/norte-sul.png",
  tartaruga: "/stills/conceitos/tartaruga.png",
};

// --- Combinadores do pipeline (slug → agrupa → escolhe a melhor variante) ---

/** Agrupa itens por slug; pula itens cujo slug é null. */
export function groupBySlug<T>(items: T[], slugFn: (t: T) => string | null): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const it of items) {
    const s = slugFn(it);
    if (s == null) continue;
    const arr = m.get(s) ?? [];
    arr.push(it);
    m.set(s, arr);
  }
  return m;
}

/** Entre variantes do mesmo slug, a de maior pontuação. */
export function selectBestVariant<T>(variants: T[], score: (t: T) => number): T {
  return variants.reduce((b, v) => (score(v) > score(b) ? v : b));
}

/**
 * Tags de FINALIZAÇÃO no GrappleMap → folhas `para:null` emitidas a partir do hub
 * de origem. Resolve o maior gap de conteúdo: dos hubs montada/cem-quilos/costas
 * o usuário não alcançava mata-leão, armbar etc.
 */
const SUB_TAGS: Record<string, { slug: string; nome: string }> = {
  kimura: { slug: "kimura", nome: "Kimura" },
  rear_naked_choke: { slug: "mata-leao", nome: "Mata-Leão" },
  armbar: { slug: "armbar", nome: "Armbar" },
  triangle: { slug: "triangulo", nome: "Triângulo" },
  darce: { slug: "darce", nome: "D'Arce" },
  arm_triangle: { slug: "triangulo-de-braco", nome: "Triângulo de Braço" },
  monoplata: { slug: "monoplata", nome: "Monoplata" },
  omoplata: { slug: "omoplata", nome: "Omoplata" },
  guillotine: { slug: "guilhotina", nome: "Guilhotina" },
  heel_hook: { slug: "heel-hook", nome: "Heel Hook" },
  neck_crank: { slug: "torcao-de-pescoco", nome: "Torção de Pescoço" },
  knee_bar: { slug: "chave-de-joelho", nome: "Chave de Joelho" },
  americana: { slug: "americana", nome: "Americana" },
  calf_slicer: { slug: "trava-de-panturrilha", nome: "Trava de Panturrilha" },
  leg_lock: { slug: "chave-de-perna", nome: "Chave de Perna" },
};

/** Nomes-lixo do GrappleMap que não devem virar nós no atlas. */
const JUNK_NAMES = new Set(["?", "wip", "...a", "...b", "...c", "kick-up2", "snapdown2", "air 300", "(un)kneel"]);
function isJunk(p: GMPosition): boolean {
  const k = gmKey(p.name);
  if (JUNK_NAMES.has(k)) return true;
  if (p.tags.includes("stub")) return true;
  if (k.length <= 2) return true;
  return false;
}

/**
 * Carve-outs por nome que vencem o tag-collapse: kesa-gatame/scarf-hold são tagged
 * `side_control` no GM mas tecnicamente são judo side control distinto do cem-quilos.
 * Mantém o hub específico em vez de virar variante do cem-quilos genérico.
 */
function nameCarveOut(name: string): string | null {
  const k = gmKey(name);
  if (k.includes("kesa") || k.includes("scarf")) return "kesa-gatame";
  return null;
}

/**
 * slug do nó: carve-out por nome (kesa-gatame) → TAG de conceito → needle por nome
 * → slug pt-BR/fallback. Garante que toda posição entra e hubs conectam tudo.
 */
function nodeSlug(p: GMPosition): string {
  return (
    nameCarveOut(p.name) ??
    collapseConceptByTags(p.tags) ??
    collapseConcept(p.name) ??
    PT_BR_NAMES[gmKey(p.name)]?.slug ??
    fallbackSlug(p.name)
  );
}

/** Índice id→slug das posições (junk excluído → transições referenciando junk são dropadas). */
function slugIndex(positions: GMPosition[]): Map<number, string> {
  const m = new Map<number, string>();
  for (const p of positions) {
    if (!isJunk(p)) m.set(p.id, nodeSlug(p));
  }
  return m;
}

/** slug da transição (`de__base__para`); aceita auto-laço (mesmo conceito) marcado depois. */
function transSlug(t: GMTransition, byId: Map<number, string>): string | null {
  if (t.fromId == null || t.toId == null) return null;
  const de = byId.get(t.fromId);
  const para = byId.get(t.toId);
  if (!de || !para) return null;
  const base = PT_BR_NAMES[gmKey(t.name)]?.slug ?? fallbackSlug(t.name);
  return `${de}__${base}__${para}`;
}

function unionTags(items: { tags: string[] }[]): string[] | undefined {
  const set = new Set<string>();
  for (const it of items) for (const t of it.tags) set.add(t);
  return set.size ? [...set].sort() : undefined;
}

/** Monta a Posicao do slug — hub curado (conceito) ou nó pt-BR/fallback. Une tags. */
function buildPosicao(slug: string, vs: GMPosition[]): Posicao {
  const tags = unionTags(vs);
  if (CONCEITO_NOME[slug]) {
    return {
      slug,
      nome: CONCEITO_NOME[slug],
      resumo: CONCEITO_RESUMO[slug] ?? "",
      principios: [],
      imagem: CONCEITO_FIGURA[slug],
      setas: CONCEITO_SETAS[slug],
      tags,
      acesso: "free",
    };
  }
  const tr = PT_BR_NAMES[gmKey(vs[0].name)];
  return {
    slug,
    nome: tr?.nomeBR ?? fallbackName(vs[0].name),
    resumo: "",
    principios: [],
    tags,
    acesso: "free",
  };
}

/** Monta a Transicao a partir da MELHOR variante; une tags + flags de qualidade. */
function buildTransicao(slug: string, vs: GMTransition[], byId: Map<number, string>): Transicao {
  const repr = selectBestVariant(vs, (t) => (t.properties.detailed ? 1000 : 0) + t.frames.length);
  const tr = PT_BR_NAMES[gmKey(repr.name)];
  const de = byId.get(repr.fromId!)!;
  const para = byId.get(repr.toId!)!;
  const tags = unionTags(vs);
  const detailed = vs.some((t) => t.properties.detailed);
  const bidir = vs.some((t) => t.properties.bidirectional);
  const self = de === para;
  return {
    slug,
    nome: tr?.nomeBR ?? fallbackName(repr.name),
    tipo: tr?.tipo ?? "ataque",
    de,
    para,
    passos: [],
    tags,
    acesso: "free",
    ...(detailed ? { qualidade: "detalhada" as const } : {}),
    ...(bidir ? { bidirectional: true as const } : {}),
    ...(self ? { selfLoop: true as const } : {}),
  };
}

/** Folhas de finalização emitidas via tags-de-sub (cobre o gap dos hubs sem leaves). */
function emitSubLeaves(transitions: GMTransition[], byId: Map<number, string>): Transicao[] {
  const seen = new Set<string>();
  const out: Transicao[] = [];
  for (const t of transitions) {
    if (t.fromId == null) continue;
    const de = byId.get(t.fromId);
    if (!de) continue;
    for (const tag of t.tags) {
      const sub = SUB_TAGS[tag];
      if (!sub) continue;
      const slug = `${de}__${sub.slug}-tap__finalizacao`;
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({
        slug,
        nome: sub.nome,
        tipo: "finalizacao",
        de,
        para: null,
        passos: [],
        tags: [tag],
        acesso: "free",
      });
    }
  }
  return out;
}

/**
 * PORT COMPLETO do GrappleMap: todas as posições viram nós (conceito reconhecido →
 * hub curado; resto → nó pt-BR/fallback próprio). Todas as transições resolvidas
 * viram arestas. Folhas de finalização adicionais via sub-tags. Auto-laços marcados.
 */
export function gmFullGrafo(positions: GMPosition[], transitions: GMTransition[]): Grafo {
  const byId = slugIndex(positions);
  const posicoes: Posicao[] = [];
  for (const [slug, vs] of groupBySlug(positions, (p) => (isJunk(p) ? null : nodeSlug(p)))) {
    posicoes.push(buildPosicao(slug, vs));
  }
  const transicoes: Transicao[] = [];
  for (const [slug, vs] of groupBySlug(transitions, (t) => transSlug(t, byId))) {
    transicoes.push(buildTransicao(slug, vs, byId));
  }
  transicoes.push(...emitSubLeaves(transitions, byId));
  return { posicoes, transicoes };
}

// ---------------------------------------------------------------------------
// Frames pra render 3D / animação. Mesmos slugs do gmToConceptGrafo.
// ---------------------------------------------------------------------------

type Vec3Tuple = [number, number, number];
/** Um frame de pose: dois lutadores, junta→coord. Convenção z-up (altura no índice 2),
 *  igual ao poses-gm.json — o renderer (figura-r3f) faz o remap pra y-up. */
export interface PoseFrame {
  p0: Record<string, Vec3Tuple>;
  p1: Record<string, Vec3Tuple>;
}

/** parser.Pose (y-up {x,y,z}) → PoseFrame (z-up tuples, altura no índice 2). */
function toPoseFrame(pose: GMPose): PoseFrame {
  const conv = (pl: GMPose[0]): Record<string, Vec3Tuple> => {
    const f: Record<string, Vec3Tuple> = {};
    JOINTS.forEach((j, i) => {
      const v = pl[i];
      f[j] = [v.x, v.z, v.y]; // y-up → z-up: altura (v.y) vai pro índice 2
    });
    return f;
  };
  return { p0: conv(pose[0]), p1: conv(pose[1]) };
}

/** Riqueza de uma transição como demo: detalhada > mais keyframes (movimento mais suave). */
function transitionRichness(t: GMTransition): number {
  return (t.properties.detailed ? 1000 : 0) + t.frames.length;
}

/**
 * Frames pra TODOS os nós do port completo (mesmos slugs do gmFullGrafo).
 * Pose do nó = variante MAIS LEGÍVEL; animação = transição MAIS RICA.
 */
export function gmFullFrames(
  positions: GMPosition[],
  transitions: GMTransition[],
): { poses: Record<string, PoseFrame>; transicoes: Record<string, PoseFrame[]> } {
  const byId = slugIndex(positions);
  const poses: Record<string, PoseFrame> = {};
  for (const [slug, vs] of groupBySlug(positions, (p) => (isJunk(p) ? null : nodeSlug(p)))) {
    poses[slug] = toPoseFrame(pickClearestVariant(vs).pose);
  }
  const transicoes: Record<string, PoseFrame[]> = {};
  for (const [slug, vs] of groupBySlug(transitions, (t) => transSlug(t, byId))) {
    transicoes[slug] = selectBestVariant(vs, transitionRichness).frames.map(toPoseFrame);
  }
  return { poses, transicoes };
}
