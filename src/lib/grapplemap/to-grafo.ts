import { gmKey } from "./pt-br-names";

/** slug ASCII-kebab de fallback quando não há tradução pt-BR. */
export function fallbackSlug(name: string): string {
  return gmKey(name)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Display name de fallback: usa gmKey() para remover artefatos (literal \n etc.)
 * e aplica capitalização simples. Usado quando PT_BR_NAMES não tem tradução.
 */
export function fallbackName(name: string): string {
  const cleaned = gmKey(name); // strip literal \n, collapse whitespace
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
