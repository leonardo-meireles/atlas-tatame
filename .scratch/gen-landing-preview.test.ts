import { writeFileSync } from "node:fs";
import { test } from "vitest";
import Dagre from "@dagrejs/dagre";
import { getGrafo } from "../src/lib/graph";
import { isPublicada } from "../src/lib/figura/pose-meta";
import { tipoMeta } from "../src/lib/tipo";

// Cards menores que o /mapa real — landing é PREVIEW estático, não interativo.
// Card slim (160×56) com nome + bolinha de cor. Dagre roda menor → SVG enxuto.
const CARD_W = 168;
const CARD_H = 60;

// One-shot: pré-renderiza o layout dagre do preview da landing (recorte pequeno ao
// redor de guarda-fechada) e emite JSON estático. Mata <Mapa> client component do
// bundle da landing — SVG renderiza server-side, zero React Flow no LCP.
test("gera src/content/landing-preview.json", () => {
  const grafo = getGrafo();
  // MVP guard-only: preview = saídas CURADAS (com passos) e publicadas da guarda fechada.
  // Bate exatamente com o mapa (nada de GM cru nem passagem deferida).
  const focoSlug = "guarda-fechada";
  const reps = grafo.transicoes.filter(
    (t) =>
      t.de === focoSlug &&
      t.passos.length > 0 &&
      t.tipo !== "perda-de-guarda" &&
      isPublicada(t.slug) &&
      (t.para === null || isPublicada(t.para)),
  );
  const posSet = new Set<string>([focoSlug]);
  for (const t of reps) if (t.para) posSet.add(t.para);
  const preview = {
    posicoes: grafo.posicoes.filter((p) => posSet.has(p.slug)),
    transicoes: reps,
  };

  const posSlugs = new Set(preview.posicoes.map((p) => p.slug));
  const transSlugs = new Set(preview.transicoes.map((t) => t.slug));

  type N = {
    slug: string;
    nome: string;
    kind: "pos" | "trans";
    cor: string;
    raiz?: boolean;
    tipo?: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  type E = { id: string; source: string; target: string; cor: string; dashed: boolean };

  const nodes: N[] = [];
  const edges: E[] = [];

  const g = new Dagre.graphlib.Graph()
    .setGraph({ rankdir: "LR", nodesep: 56, ranksep: 150, marginx: 28, marginy: 28, ranker: "tight-tree" })
    .setDefaultEdgeLabel(() => ({}));

  for (const p of preview.posicoes) {
    g.setNode(p.slug, { width: CARD_W, height: CARD_H });
    nodes.push({
      slug: p.slug,
      nome: p.nome,
      kind: "pos",
      cor: p.raiz ? "var(--clay-on-mat)" : "var(--on-mat-soft)",
      raiz: !!p.raiz,
      x: 0,
      y: 0,
      w: CARD_W,
      h: CARD_H,
    });
  }
  for (const t of preview.transicoes) {
    const m = tipoMeta(t.tipo);
    g.setNode(t.slug, { width: CARD_W, height: CARD_H });
    nodes.push({
      slug: t.slug,
      nome: t.nome,
      kind: "trans",
      cor: m.corOnMat,
      tipo: t.tipo,
      x: 0,
      y: 0,
      w: CARD_W,
      h: CARD_H,
    });
  }
  for (const t of preview.transicoes) {
    const m = tipoMeta(t.tipo);
    if (posSlugs.has(t.de) || transSlugs.has(t.de)) {
      g.setEdge(t.de, t.slug);
      edges.push({ id: `${t.de}->${t.slug}`, source: t.de, target: t.slug, cor: m.corOnMat, dashed: false });
    }
    if (t.para && posSlugs.has(t.para)) {
      g.setEdge(t.slug, t.para);
      edges.push({ id: `${t.slug}->${t.para}`, source: t.slug, target: t.para, cor: m.corOnMat, dashed: true });
    }
  }
  Dagre.layout(g);

  for (const n of nodes) {
    const d = g.node(n.slug);
    n.x = d.x - n.w / 2;
    n.y = d.y - n.h / 2;
  }
  const gg = g.graph();

  writeFileSync(
    "src/content/landing-preview.json",
    JSON.stringify({ width: gg.width, height: gg.height, nodes, edges }),
  );
  console.log(`landing preview: ${nodes.length} nós, ${edges.length} arestas, ${gg.width}x${gg.height}`);
});
