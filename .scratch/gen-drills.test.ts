import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { test } from "vitest";
import { buildDrill, type Drill } from "../src/lib/grapplemap/drills";

// One-shot: parseia source_repos/GrappleMap/drills/*.script → src/content/drills.json.
test("gera src/content/drills.json", () => {
  const dir = "source_repos/GrappleMap/drills";
  const drills: Drill[] = [];
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith(".script")) continue;
    const base = f.replace(/\.script$/, "");
    drills.push(buildDrill(base, readFileSync(`${dir}/${f}`, "utf8")));
  }
  writeFileSync("src/content/drills.json", JSON.stringify(drills));
  // Índice slim (slug+nome+passos) — sidebar não precisa da sequência inteira.
  writeFileSync(
    "src/content/drills-index.json",
    JSON.stringify(drills.map((d) => ({ slug: d.slug, nome: d.nome, passos: d.sequencia.length }))),
  );
  console.log(`drills: ${drills.length} (${drills.reduce((n, d) => n + d.sequencia.length, 0)} passos)`);
});
