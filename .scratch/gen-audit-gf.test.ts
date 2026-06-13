import { writeFileSync, readFileSync } from "node:fs";
import { test } from "vitest";
import { getGrafo } from "../src/lib/graph";

// Curadoria escopo: árvore CURADA da guarda fechada — outputs diretos +
// até 2 hops adicionais (até alcançar finalização ou posição terminal).
// Trims posições e transições não diretamente relevantes.
test("audita subárvore curada da guarda fechada", () => {
  const grafo = getGrafo();
  const ROOT = "guarda-fechada";
  const TIPOS_OFENSIVOS = new Set(["raspagem", "ataque", "finalizacao"]);
  const MAX_DEPTH = 3; // root → output → result-pos → next-output

  const figManifest = JSON.parse(readFileSync("src/content/figura-manifest.json", "utf8")) as {
    poses: string[];
    trans: string[];
  };
  const posesSet = new Set(figManifest.poses);
  const transSet = new Set(figManifest.trans);

  type NodeInfo = { slug: string; nome: string; kind: "pos" | "trans"; tipo?: string; tem3d: boolean; depth: number };
  const nodes = new Map<string, NodeInfo>();

  function bfs(start: string) {
    const queue: { slug: string; depth: number }[] = [{ slug: start, depth: 0 }];
    while (queue.length) {
      const { slug, depth } = queue.shift()!;
      if (nodes.has(slug)) continue;
      const p = grafo.posicoes.find((x) => x.slug === slug);
      if (!p) continue;
      nodes.set(slug, { slug, nome: p.nome, kind: "pos", tem3d: posesSet.has(slug), depth });
      if (depth >= MAX_DEPTH) continue;
      const saidas = grafo.transicoes.filter((t) => t.de === slug && TIPOS_OFENSIVOS.has(t.tipo));
      for (const t of saidas) {
        if (!nodes.has(t.slug)) {
          nodes.set(t.slug, { slug: t.slug, nome: t.nome, kind: "trans", tipo: t.tipo, tem3d: transSet.has(t.slug), depth: depth + 1 });
        }
        if (t.para) queue.push({ slug: t.para, depth: depth + 1 });
      }
    }
  }
  bfs(ROOT);

  // Group by depth + categorize
  const byDepth: Record<number, NodeInfo[]> = {};
  for (const n of nodes.values()) {
    (byDepth[n.depth] ??= []).push(n);
  }

  // Translation suspicion heuristic
  const TERMOS_EN = ["underhook","overhook","hook","guard","control","frame","shell","drag","shoot","trap","lock","pin","hold","back","side","top","bottom","from","to","with","into","near","vs","single","double","leg","arm","elbow","knee","foot","head","neck","outside","inside","high","low","deep","shallow","across","kimura","darce","anaconda","ezekiel","americana","kesa","shoulder","leg-lace","rear-naked","scarf","north-south","tap"];
  const sus = (nome: string): boolean => {
    if (/[a-z]_[a-z]/.test(nome)) return true;
    if (/\b(?:to|of|the|by|on|at|with|from|vs)\b/.test(nome.toLowerCase())) return true;
    const lower = nome.toLowerCase();
    for (const w of TERMOS_EN) if (new RegExp(`\\b${w}\\b`).test(lower)) return true;
    return false;
  };

  const out = {
    stats: {
      total: nodes.size,
      posicoes: [...nodes.values()].filter((n) => n.kind === "pos").length,
      transicoes: [...nodes.values()].filter((n) => n.kind === "trans").length,
      finalizacoes: [...nodes.values()].filter((n) => n.tipo === "finalizacao").length,
      raspagens: [...nodes.values()].filter((n) => n.tipo === "raspagem").length,
      ataques: [...nodes.values()].filter((n) => n.tipo === "ataque").length,
      sem3d: [...nodes.values()].filter((n) => !n.tem3d).length,
      tradSuspeita: [...nodes.values()].filter((n) => sus(n.nome)).length,
    },
    porDepth: Object.fromEntries(
      Object.entries(byDepth).map(([d, ns]) => [d, ns.length]),
    ),
    raiz: byDepth[0]?.map((n) => `${n.slug} (${n.nome})`),
    nivel1: byDepth[1]?.map((n) => `${n.kind === "trans" ? `${n.tipo}` : "pos"} | ${n.nome} | ${n.tem3d ? "✓3D" : "✗3D"}`),
    nivel2: byDepth[2]?.map((n) => `${n.kind === "trans" ? `${n.tipo}` : "pos"} | ${n.nome} | ${n.tem3d ? "✓3D" : "✗3D"}`),
    sem3d: [...nodes.values()].filter((n) => !n.tem3d).map((n) => ({ kind: n.kind, slug: n.slug, nome: n.nome, tipo: n.tipo, depth: n.depth })),
    tradSus: [...nodes.values()].filter((n) => sus(n.nome)).map((n) => ({ kind: n.kind, slug: n.slug, nome: n.nome, depth: n.depth })),
  };

  writeFileSync("/tmp/audit-gf.json", JSON.stringify(out, null, 2));
  console.log(`Total ${out.stats.total} (${out.stats.posicoes} pos + ${out.stats.transicoes} trans)`);
  console.log(`  Finais ${out.stats.finalizacoes}, Rasp ${out.stats.raspagens}, Ataques ${out.stats.ataques}`);
  console.log(`  Sem 3D ${out.stats.sem3d}, Trad suspeita ${out.stats.tradSuspeita}`);
});
