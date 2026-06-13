/** Limpa artefatos de nomes vindos do GrappleMap (ex: "capoeira\npass" → "capoeira pass"). */
export function limpaNome(nome: string): string {
  return nome.replace(/\\+[nrt]/g, " ").replace(/\s+/g, " ").trim();
}
