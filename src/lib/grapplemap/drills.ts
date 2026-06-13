// Parser de drills do GrappleMap (`source_repos/GrappleMap/drills/*.script`).
// Cada arquivo = sequência de NOMES de posição GM (uma por linha) que formam
// um exercício loop-able. Resolve via gmKey pra casar com o grafo gerado.
import { gmKey, PT_BR_NAMES } from "./pt-br-names";
import { fallbackSlug } from "./to-grafo";
import { collapseConcept } from "./concept-collapse";

export interface Drill {
  /** slug do drill (do nome do arquivo, sem .script). */
  slug: string;
  /** Nome de display em pt-BR (do nome do arquivo, humanizado). */
  nome: string;
  /** Sequência de slugs de Posição no grafo. */
  sequencia: string[];
  /** Sequência de nomes GM crus — útil pra debug e pra resolver via tags depois. */
  nomesGM: string[];
}

/** Resolve um nome GM ao slug que o grafo usa (mesma cadeia: conceito → PT_BR → fallback). */
export function resolveDrillSlug(nomeGM: string): string {
  return (
    collapseConcept(nomeGM) ??
    PT_BR_NAMES[gmKey(nomeGM)]?.slug ??
    fallbackSlug(nomeGM)
  );
}

/** Parse o conteúdo de um `.script` em sequência de nomes (linhas não-vazias, trimmed). */
export function parseDrillScript(content: string): string[] {
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("//") && !l.startsWith("#"));
}

/** Humaniza um nome de arquivo `.script` → display pt-BR aproximado (com fallback ao kebab). */
export function humanizeDrillName(fileBase: string): string {
  return fileBase
    .replace(/-/g, " ")
    .replace(/\b(\w)/g, (m) => m.toUpperCase());
}

/** Constrói um Drill completo a partir do nome do arquivo + conteúdo. */
export function buildDrill(fileBase: string, content: string): Drill {
  const nomesGM = parseDrillScript(content);
  return {
    slug: fileBase,
    nome: humanizeDrillName(fileBase),
    nomesGM,
    sequencia: nomesGM.map(resolveDrillSlug),
  };
}
