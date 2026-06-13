import Link from "next/link";
import preview from "@/content/landing-preview.json";
import { limpaNome } from "@/lib/nome";

/**
 * Preview ESTÁTICO do mapa na landing — SVG inline, server-rendered.
 * Substitui o <Mapa> client (React Flow + dagre + lazy-fetches) por um esquemático
 * pré-renderizado. Zero JS no LCP, ainda comunica "isto é um mapa, clica pra abrir".
 * Layout dagre pré-computado em .scratch/gen-landing-preview.test.ts.
 */

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
type Preview = { width: number; height: number; nodes: N[]; edges: E[] };

const P = preview as Preview;

function NodeBlock({ n }: { n: N }) {
  const borderCor = n.raiz ? "var(--clay)" : n.cor;
  const labelCor = n.raiz ? "var(--clay-on-mat)" : n.kind === "trans" ? n.cor : "var(--on-mat)";
  return (
    <g transform={`translate(${n.x}, ${n.y})`}>
      <rect
        width={n.w}
        height={n.h}
        rx={9}
        style={{ fill: "var(--mat-2)", stroke: borderCor, strokeWidth: 1.4 }}
      />
      {/* Bolinha de cor à esquerda — sinal "tipo do nó". */}
      <circle cx={14} cy={n.h / 2} r={4} style={{ fill: borderCor }} />
      {/* Texto do nome — truncado pra caber. */}
      <text
        x={26}
        y={n.h / 2}
        dominantBaseline="middle"
        style={{ fill: labelCor, fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}
      >
        {limpaNome(n.nome).slice(0, 22)}
      </text>
    </g>
  );
}

export function LandingMapPreview() {
  const byId = new Map(P.nodes.map((n) => [n.slug, n]));

  return (
    <Link
      href="/mapa"
      className="group relative block focus-visible:outline-none"
      aria-label="Abrir o mapa interativo"
    >
      <div
        className="tatame relative w-full overflow-hidden rounded-[14px] border border-[var(--mat-line)] shadow-[inset_0_1px_0_oklch(1_0_0/0.04)]"
        style={{ aspectRatio: `${P.width} / ${P.height}` }}
      >
        <svg
          viewBox={`0 0 ${P.width} ${P.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Preview do mapa centrado na guarda fechada"
        >
          {/* Arestas — curva bezier entre centros dos nós. */}
          {P.edges.map((e) => {
            const a = byId.get(e.source);
            const b = byId.get(e.target);
            if (!a || !b) return null;
            const x1 = a.x + a.w / 2;
            const y1 = a.y + a.h / 2;
            const x2 = b.x + b.w / 2;
            const y2 = b.y + b.h / 2;
            const cx = (x1 + x2) / 2;
            return (
              <path
                key={e.id}
                d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`}
                fill="none"
                style={{
                  stroke: e.cor,
                  strokeWidth: 1.8,
                  strokeDasharray: e.dashed ? "5 4" : undefined,
                  opacity: 0.7,
                }}
              />
            );
          })}
          {P.nodes.map((n) => (
            <NodeBlock key={n.slug} n={n} />
          ))}
        </svg>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-[14px] ring-0 ring-[var(--clay)] transition-all duration-200 group-hover:ring-2 group-focus-visible:ring-2" />
      <span className="pointer-events-none absolute bottom-[var(--space-md)] left-1/2 -translate-x-1/2 rounded-full bg-[var(--ink)] px-[var(--space-lg)] py-[var(--space-xs)] text-[0.85rem] font-semibold text-[var(--paper)] opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        Abrir o mapa →
      </span>
    </Link>
  );
}
