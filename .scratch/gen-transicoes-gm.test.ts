import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { test } from "vitest";
import { parseGrappleMap } from "../src/lib/grapplemap/parser";
import { gmFullFrames } from "../src/lib/grapplemap/concept-collapse";

// One-shot: poses 3D + animações pra TODOS os nós, COMO ARQUIVOS POR-SLUG em public/figura/
// (lazy-load no cliente — o bundle não engole 15MB). Manifesto lista quem tem 3D.
test("gera public/figura/* (por-slug) + manifesto", () => {
  const txt = readFileSync("source_repos/GrappleMap/GrappleMap.txt", "utf8");
  const data = parseGrappleMap(txt);
  const { poses, transicoes } = gmFullFrames(data.positions, data.transitions);

  const root = "public/figura";
  for (const sub of ["poses", "trans"]) {
    rmSync(`${root}/${sub}`, { recursive: true, force: true });
    mkdirSync(`${root}/${sub}`, { recursive: true });
  }
  for (const [slug, frame] of Object.entries(poses)) {
    writeFileSync(`${root}/poses/${slug}.json`, JSON.stringify(frame));
  }
  for (const [slug, frames] of Object.entries(transicoes)) {
    writeFileSync(`${root}/trans/${slug}.json`, JSON.stringify(frames));
  }
  const manifest = { poses: Object.keys(poses), trans: Object.keys(transicoes) };
  writeFileSync("src/content/figura-manifest.json", JSON.stringify(manifest));

  const fc = Object.values(transicoes).map((f) => f.length);
  console.log(
    `poses: ${manifest.poses.length} | transições: ${manifest.trans.length} | keyframes ${Math.min(...fc)}/${Math.max(...fc)}`,
  );
});
