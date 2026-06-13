import type { Grafo } from "@/lib/types";

/**
 * Trilha curada = sequência ordenada de nós (posições/transições) recomendada como
 * caminho de aprendizado. Sobrepõe-se à exploração livre — não a substitui.
 * Slugs referenciam posições OU transições do grafo (resolvidos no consumo).
 */
export interface Trilha {
  slug: string;
  titulo: string;
  /** Frase curta do que a trilha entrega. */
  resumo: string;
  /** Slugs na ordem de aprendizado. */
  passos: string[];
}

/**
 * Faixa Branca — o caminho do iniciante a partir da guarda fechada: entender a posição,
 * aprender a raspar (sair por cima) e depois finalizar, em dificuldade crescente.
 */
export const TRILHA_FAIXA_BRANCA: Trilha = {
  slug: "faixa-branca",
  titulo: "Trilha Faixa Branca",
  resumo: "O caminho do zero na guarda fechada: entender, raspar e finalizar.",
  passos: [
    "guarda-fechada",
    "raspagem-de-quadril",
    "raspagem-de-tesoura",
    "estrangulamento-cruzado",
    "armlock-da-guarda",
    "kimura-da-guarda",
    "triangulo",
  ],
};

/** Passos da trilha que de fato existem no grafo dado, na ordem. Evita link morto na UI. */
export function passosValidos(trilha: Trilha, grafo: Grafo): string[] {
  const existe = new Set<string>([
    ...grafo.posicoes.map((p) => p.slug),
    ...grafo.transicoes.map((t) => t.slug),
  ]);
  return trilha.passos.filter((s) => existe.has(s));
}
