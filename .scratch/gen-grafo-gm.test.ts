import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { test } from "vitest";
import { parseGrappleMap } from "../src/lib/grapplemap/parser";
import { gmFullGrafo, CONCEITO_NOME } from "../src/lib/grapplemap/concept-collapse";
import { runAllValidators } from "../src/lib/curator-validators";
import type { Grafo } from "../src/lib/types";

// One-shot generator: PORT COMPLETO do GrappleMap → SPLIT em core + extras.
// Core = hubs conceituais (CONCEITO_NOME) + vizinhos a 1 salto. Estaticamente importado.
// Extras = resto. Lazy-fetched no cliente; importado sync no servidor (SSG).
test("gera src/content/grafo-gm-{core,extras}.generated.ts + public/grafo/extras.json", () => {
  const txt = readFileSync("source_repos/GrappleMap/GrappleMap.txt", "utf8");
  const data = parseGrappleMap(txt);
  const grafo = gmFullGrafo(data.positions, data.transitions);

  // CORE = hubs canônicos (CONCEITO_NOME) + 1-hop neighbors APENAS de guarda-fechada
  // (foco padrão do /mapa). Sidebar e foco inicial funcionam sem extras; navegar pra outro
  // hub mostra o hub vazio até extras chegar (~200ms). Trade-off: bundle muito menor.
  const hubSlugs = new Set<string>(Object.keys(CONCEITO_NOME));
  const coreSlugs = new Set<string>(hubSlugs);
  const FOCO_INICIAL = "guarda-fechada";
  for (const t of grafo.transicoes) {
    if (t.de === FOCO_INICIAL && t.para) coreSlugs.add(t.para);
    if (t.para === FOCO_INICIAL) coreSlugs.add(t.de);
  }

  // Também precisa incluir SLUGS DE TRANSIÇÃO que conectam dois nós do core
  // (transições são nós no grafo — sem elas as arestas ficam pendurando).
  // Particiona posições por core/extras.
  const coreP = grafo.posicoes.filter((p) => coreSlugs.has(p.slug));
  const extrasP = grafo.posicoes.filter((p) => !coreSlugs.has(p.slug));
  // Transição entra no core se TANTO origem QUANTO destino (se houver) estão no core.
  // Senão vai pra extras. Isso garante que o grafo core seja auto-contido pro layout dagre.
  const coreT = grafo.transicoes.filter(
    (t) => coreSlugs.has(t.de) && (t.para === null || coreSlugs.has(t.para)),
  );
  const extrasT = grafo.transicoes.filter(
    (t) => !(coreSlugs.has(t.de) && (t.para === null || coreSlugs.has(t.para))),
  );

  const grafoCore: Grafo = { posicoes: coreP, transicoes: coreT };
  const grafoExtras: Grafo = { posicoes: extrasP, transicoes: extrasT };

  const coreHeader =
    "// AUTO-GERADO por .scratch/gen-grafo-gm.test.ts — não editar à mão.\n" +
    "// CORE: hubs conceituais + 1-hop neighbors. Statically importado em CLIENT + SERVER.\n" +
    'import type { Grafo } from "@/lib/types";\n\n' +
    `export const grafoGMCore: Grafo = ${JSON.stringify(grafoCore, null, 2)};\n`;
  const extrasHeader =
    "// AUTO-GERADO por .scratch/gen-grafo-gm.test.ts — não editar à mão.\n" +
    "// EXTRAS: resto do GrappleMap. Importado SÓ no server (graph.ts server-only).\n" +
    "// Cliente busca via fetch('/grafo/extras.json') lazy on mount.\n" +
    'import type { Grafo } from "@/lib/types";\n\n' +
    `export const grafoGMExtras: Grafo = ${JSON.stringify(grafoExtras, null, 2)};\n`;

  writeFileSync("src/content/grafo-gm-core.generated.ts", coreHeader);
  writeFileSync("src/content/grafo-gm-extras.generated.ts", extrasHeader);
  mkdirSync("public/grafo", { recursive: true });
  writeFileSync("public/grafo/extras.json", JSON.stringify(grafoExtras));

  console.log(
    `GM split: core ${coreP.length} pos + ${coreT.length} trans | extras ${extrasP.length} pos + ${extrasT.length} trans`,
  );

  // CI hook: roda os validadores de curadoria no grafo COMPLETO (core+extras).
  // Warnings só logam; ERRORS quebram a geração (não deveriam existir no atlas público).
  const manifest = JSON.parse(readFileSync("src/content/figura-manifest.json", "utf8")) as {
    poses: string[];
    trans: string[];
  };
  const issues = runAllValidators(grafo, manifest);
  const warns = issues.filter((i) => i.level === "warn");
  const errors = issues.filter((i) => i.level === "error");
  console.log(`Validadores: ${warns.length} warning(s), ${errors.length} error(s).`);
  if (errors.length > 0) {
    throw new Error(
      `Validadores acharam ${errors.length} ERROR(s) no grafo público:\n` +
        errors.map((e) => `  [${e.rule}] ${e.msg}`).join("\n"),
    );
  }
});
