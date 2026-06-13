import metaJson from "@/content/poses-meta.json";

export type PoseSource = "gm-derived" | "hand" | "agent-video" | "agent-image" | "agent-text" | "mocap" | "blender";
export type PoseStatus = "rascunho" | "revisado" | "publicado";

export interface PoseMeta {
  schema: "pose-meta-v1";
  kind: "pos" | "trans";
  source: PoseSource;
  status: PoseStatus;
  author?: string;
  notes?: string;
  gmRef?: string;
  createdAt?: string;
  updatedAt?: string;
}

const META = metaJson as Record<string, PoseMeta>;

/**
 * DIFERIDOS — set de slugs escondidos do atlas público pelo status gate.
 * ESVAZIADO (2026-05-31): sob a diretiva "roda tudo até ficar pronto", a cadeia de
 * passagem + cem-quilos + guarda-aberta (conteúdo já autorado à mão em grafo.ts) foi
 * publicada. Figuras 3D ainda não renderizadas pra estes nós → caem no placeholder
 * honesto ("figura a caminho") / still 2D no /mapa-v2. Revisão de faixa recomendada.
 * Reversível: re-adicionar slugs aqui.
 */
const DIFERIDOS = new Set<string>([]);

export function getPoseMeta(slug: string): PoseMeta | undefined {
  return META[slug];
}

/** Status gate — rascunho/diferido NÃO aparece no atlas público. */
export function isPublicada(slug: string): boolean {
  if (DIFERIDOS.has(slug)) return false;
  const m = META[slug];
  if (!m) return true; // default permissivo p/ slugs novos sem meta ainda
  return m.status === "publicado" || m.status === "revisado";
}

/** Filtra lista de slugs por status (publicado/revisado). */
export function filtraPublicadas(slugs: string[]): string[] {
  return slugs.filter(isPublicada);
}
