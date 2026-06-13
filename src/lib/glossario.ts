import dadosRaw from "@/content/glossario.json";

/**
 * Glossário de BJJ — 117 termos pt-BR (mantém inglês onde o termo é canônico em inglês:
 * armlock, berimbolo, leg drag…). Ingerido de glossários públicos (BJJ Heroes pt-BR +
 * BJJ Brotherhood EN), reescrito em voz de tatame. Proveniência: docs/research/fontes-conhecimento.md.
 * Status: rascunho curado — revisão de faixa pendente nos termos flagados.
 */
export type TipoTermo =
  | "posicao"
  | "transicao"
  | "finalizacao"
  | "raspagem"
  | "passagem"
  | "conceito";

export interface TermoGlossario {
  slug: string;
  nomePt: string;
  nomeEn: string;
  tipo: TipoTermo;
  definicaoPt: string;
  fonte: string;
  sourceUrl: string;
}

/** Rótulo pt-BR de cada tipo (singular curto pra agrupar/seção). */
export const ROTULO_TIPO: Record<TipoTermo, string> = {
  posicao: "Posições",
  transicao: "Transições",
  finalizacao: "Finalizações",
  raspagem: "Raspagens",
  passagem: "Passagens",
  conceito: "Conceitos",
};

/** Ordem didática de exibição dos grupos. */
export const ORDEM_TIPOS: TipoTermo[] = [
  "posicao",
  "passagem",
  "raspagem",
  "finalizacao",
  "transicao",
  "conceito",
];

const TERMOS: TermoGlossario[] = (dadosRaw as TermoGlossario[])
  .slice()
  .sort((a, b) => a.nomePt.localeCompare(b.nomePt, "pt-BR"));

/** Todos os termos, ordenados alfabeticamente (pt-BR). */
export function getTermos(): TermoGlossario[] {
  return TERMOS;
}

/** Termos agrupados por tipo, na ordem didática. */
export function getTermosPorTipo(): { tipo: TipoTermo; termos: TermoGlossario[] }[] {
  return ORDEM_TIPOS.map((tipo) => ({
    tipo,
    termos: TERMOS.filter((t) => t.tipo === tipo),
  })).filter((g) => g.termos.length > 0);
}
