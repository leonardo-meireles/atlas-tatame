import type { Transicao } from "./types";

/**
 * Esconde tap-stubs (gerados via sub-tag em `emitSubLeaves`) quando já existe
 * finalização CURADA do mesmo tipo na origem — evita "Triângulo" aparecendo 3×.
 * Stubs continuam úteis pros hubs sem curadas (montada/cem-quilos/etc).
 */

const SUB_KEYWORDS: Record<string, string[]> = {
  armbar: ["armbar", "armlock"],
  triangulo: ["triangulo", "triângulo", "triangle"],
  kimura: ["kimura"],
  "mata-leao": ["mata-leao", "mata-leão", "rear-naked"],
  omoplata: ["omoplata"],
  guilhotina: ["guilhotina", "guillotine"],
  darce: ["darce", "d'arce"],
  americana: ["americana"],
  "triangulo-de-braco": ["triangulo-de-braco", "arm-triangle"],
  monoplata: ["monoplata"],
  "heel-hook": ["heel-hook"],
  "chave-de-joelho": ["chave-de-joelho", "knee-bar"],
  "torcao-de-pescoco": ["torcao-de-pescoco", "neck-crank"],
  "trava-de-panturrilha": ["trava-de-panturrilha", "calf-slicer"],
  "chave-de-perna": ["chave-de-perna", "leg-lock"],
};

function subKeyword(slug: string, nome: string): string | null {
  const text = `${slug} ${nome.toLowerCase()}`;
  for (const [sub, keys] of Object.entries(SUB_KEYWORDS)) {
    if (keys.some((k) => text.includes(k))) return sub;
  }
  return null;
}

function isTapStub(t: Transicao): boolean {
  return t.slug.endsWith("-tap__finalizacao");
}

export function dedupSaidas(saidas: Transicao[]): Transicao[] {
  // Coleta sub-keywords das finalizações CURADAS (não-stub) presentes.
  const curatedSubs = new Set<string>();
  for (const t of saidas) {
    if (t.tipo === "finalizacao" && !isTapStub(t)) {
      const k = subKeyword(t.slug, t.nome);
      if (k) curatedSubs.add(k);
    }
  }
  return saidas.filter((t) => {
    if (!isTapStub(t)) return true;
    const m = t.slug.match(/__(.+?)-tap__finalizacao$/);
    const stubSub = m?.[1];
    return !stubSub || !curatedSubs.has(stubSub);
  });
}

/**
 * Substitui "Transição sem Nome" por nome derivado do tipo + destino.
 * Placeholder do gerador quando GrappleMap não tinha label legível.
 */
export function nomeLegivel(t: Transicao, paraNome?: string): string {
  if (t.nome !== "Transição sem Nome" && t.nome !== "Transicao sem Nome") return t.nome;
  if (t.tipo === "finalizacao") return "Finalizar daqui";
  if (t.tipo === "raspagem") return paraNome ? `Raspar pra ${paraNome}` : "Raspar daqui";
  if (t.tipo === "ataque") return paraNome ? `Atacar pra ${paraNome}` : "Atacar daqui";
  if (t.tipo === "passagem") return paraNome ? `Passar pra ${paraNome}` : "Passar a guarda";
  return paraNome ? `Pra ${paraNome}` : t.nome;
}
