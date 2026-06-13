// Acesso aos dados 3D do port COMPLETO do GrappleMap. As poses/animações vivem como
// arquivos por-slug em public/figura/ (lazy-fetch — o bundle não engole 15MB). Só o
// manifesto (lista de slugs) e a pose hand-authored da guarda-fechada são estáticos.
import manifest from "@/content/figura-manifest.json";
import handPoses from "@/content/poses-gm.json";

export type Vec3Tuple = [number, number, number];
export type Fighter = Record<string, Vec3Tuple>;
/** Um frame: dois lutadores (z-up, altura no índice 2). */
export interface PoseFrame {
  p0: Fighter;
  p1: Fighter;
}

// Paleta dos personagens. Cor = QUEM (quente vs frio, fácil distinguir); as MÃOS são
// um tom CLARO da própria cor do personagem → pulam aos olhos E ficam amarradas ao dono
// (mesma família de cor = sabe de quem é a mão). Aqui (sem THREE) pro node-expandido usar.
export const PLAYER = {
  top: { base: "#b1502f", hand: "#ec9b6a", dark: "#7d3115" }, // clay — por cima
  bottom: { base: "#3f63a6", hand: "#8db4e6", dark: "#243b66" }, // azul — por baixo
} as const;

const POSE_SET = new Set(manifest.poses);
const TRANS_SET = new Set(manifest.trans);

// Transições CURADAS (grafoBase) → transição GM equivalente (com frames 3D reais).
// Garante que técnicas hand-authored animem a técnica de verdade, não um PNG.
export const TRANS_ALIAS: Record<string, string> = {
  triangulo: "guarda-fechada__triangulo-entrada__ameaca-de-triangulo",
  "armlock-da-guarda": "guarda-fechada__transicao-sem-nome__armlock",
  "raspagem-de-quadril": "guarda-fechada__raspagem-de-quadril__montada",
  "raspagem-de-balao": "guarda-fechada__inicio-da-raspagem-de-pendulo__raspagem-de-pendulo-pela-metade",
  // Curadas adicionais — guarda fechada (depth 1).
  "kimura-da-guarda": "guarda-fechada__kimura-entrada__guarda-fechada",
  "estrangulamento-cruzado": "guarda-fechada__de-baixo-pega-2-em-1__guarda-fechada",
  "raspagem-de-tesoura": "guarda-fechada__finalizar-a-raspagem__montada",
  // Cadeia de passagens curada (guarda-aberta → cem-quilos) + saídas de guarda-aberta.
  "passagem-empilhando": "empilhar-duplo-por-baixo-com-braco-preso__passagem__cem-quilos",
  rodado: "distant-leg-drag__passagem__cem-quilos",
  "passagem-de-toreando": "guarda-borboleta__passagem-por-cima-da-perna__cem-quilos",
  "passagem-de-joelho-cortando": "meia-guarda__passagem__cem-quilos",
  "raspagem-de-gancho": "guarda-borboleta__raspagem__montada",
  // Meia-guarda (escopo guard-only).
  "raspagem-de-meia-guarda": "meia-guarda__raspagem__montada",
  "recompor-guarda-fechada": "meia-guarda__recuperar-a-guarda-fechada__guarda-fechada",
};
const resolveTrans = (slug: string): string => TRANS_ALIAS[slug] ?? slug;
// guarda-fechada hand-authored sobrescreve a gerada (ajustada à mão, lê ótimo).
const HAND: Record<string, PoseFrame> = {
  "guarda-fechada": (handPoses as unknown as Record<string, PoseFrame>)["guarda-fechada"],
};

export function temPose3D(slug?: string): boolean {
  return !!slug && (slug in HAND || POSE_SET.has(slug));
}
export function temTransicao3D(slug?: string): boolean {
  return !!slug && TRANS_SET.has(resolveTrans(slug));
}

const poseCache = new Map<string, PoseFrame>();
const transCache = new Map<string, PoseFrame[]>();

/** Carrega a pose (hand-authored ou fetch por-slug). null se não existir. */
export async function loadPose(slug: string): Promise<PoseFrame | null> {
  if (HAND[slug]) return HAND[slug];
  if (poseCache.has(slug)) return poseCache.get(slug)!;
  if (!POSE_SET.has(slug)) return null;
  const r = await fetch(`/figura/poses/${slug}.json`);
  if (!r.ok) return null;
  const f = (await r.json()) as PoseFrame;
  poseCache.set(slug, f);
  return f;
}

/** Carrega N poses em paralelo, mantém ordem, descarta as não-resolvidas. */
export async function loadPoses(slugs: string[]): Promise<PoseFrame[]> {
  const out = await Promise.all(slugs.map((s) => loadPose(s)));
  return out.filter((f): f is PoseFrame => f != null);
}

/** Carrega a sequência de keyframes de uma transição. null se não existir. */
export async function loadTrans(slug: string): Promise<PoseFrame[] | null> {
  const real = resolveTrans(slug);
  if (transCache.has(real)) return transCache.get(real)!;
  if (!TRANS_SET.has(real)) return null;
  const r = await fetch(`/figura/trans/${real}.json`);
  if (!r.ok) return null;
  const f = (await r.json()) as PoseFrame[];
  transCache.set(real, f);
  return f;
}
