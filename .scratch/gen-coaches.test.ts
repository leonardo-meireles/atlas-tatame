import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { test } from "vitest";
import { buildCoach, type Coach } from "../src/lib/grapplemap/coaches";
import { resolveDrillSlug } from "../src/lib/grapplemap/drills";
import { getPosicao } from "../src/lib/graph";

// One-shot: parseia source_repos/GrappleMap/doc/references/*.txt → src/content/coaches.json.
// Resolve `slug` por capítulo aqui (no gen-time) usando o grafo + glossário — evita que
// o render do /instrutor puxe concept-collapse + PT_BR_NAMES (1139 entradas) no bundle.
test("gera src/content/coaches.json", () => {
  const dir = "source_repos/GrappleMap/doc/references";
  const coaches: Coach[] = [];
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith(".txt")) continue;
    const base = f.replace(/\.txt$/, "");
    const c = buildCoach(base, readFileSync(`${dir}/${f}`, "utf8"));
    // Bake slug onde o título casa uma Posição existente.
    for (const s of c.series)
      for (const v of s.volumes)
        for (const cap of v.capitulos) {
          const s2 = resolveDrillSlug(cap.titulo);
          if (getPosicao(s2)) cap.slug = s2;
        }
    coaches.push(c);
  }
  writeFileSync("src/content/coaches.json", JSON.stringify(coaches));
  // Índice SLIM (slug+nome) pra sidebar/landing — evita carregar o syllabus inteiro
  // só pra renderizar a lista de coaches.
  writeFileSync(
    "src/content/coaches-index.json",
    JSON.stringify(coaches.map((c) => ({ slug: c.slug, nome: c.nome }))),
  );
  const totalCaps = coaches.reduce(
    (n, c) => n + c.series.reduce((m, s) => m + s.volumes.reduce((k, v) => k + v.capitulos.length, 0), 0),
    0,
  );
  const linked = coaches.reduce(
    (n, c) => n + c.series.reduce((m, s) => m + s.volumes.reduce((k, v) => k + v.capitulos.filter((cp) => cp.slug).length, 0), 0),
    0,
  );
  console.log(`coaches: ${coaches.length} | capítulos: ${totalCaps} | linkados: ${linked}`);
});
