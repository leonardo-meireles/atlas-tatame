"use client";

/**
 * Canvas do /mapa-v2 — o GRAFO de posições/técnicas em xyflow, SEM nó expandido na lona.
 * Clicar num card só seleciona (highlight) — o conteúdo abre no painel lateral 2D.
 * Cards leves: pictograma 2D (SVG, derivado da pose, SEM WebGL) ou still PNG; nunca Canvas.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  useReactFlow,
  useStore,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Dagre from "@dagrejs/dagre";
import type { Grafo } from "@/lib/types";
import { tipoMeta } from "@/lib/tipo";
import { nomeLegivel } from "@/lib/dedup-saidas";
import { limpaNome } from "@/lib/nome";
import { Pictograma } from "./pictograma";
import { temPose3D, temTransicao3D } from "@/lib/figura/figura-data";

interface CardData {
  nome: string;
  cor: string;
  rotulo: string;
  desc?: string;
  imagem?: string;
  slug?: string;
  kind?: "pos" | "trans";
  paraSlug?: string;
  raiz?: boolean;
  pago?: boolean;
  ativo?: boolean;
  /** Há um nó selecionado e este não é ele → recua (focus+context). */
  recuado?: boolean;
}

const CARD_W = 234;
const CARD_H = 200;
const PLACA_H = 116;

/** Mira de registro — chapa vazia parece intencional (prova de gráfica), não slop. */
function MarcaRegistro({ cor }: { cor: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="opacity-70">
      <circle cx="12" cy="12" r="6.5" stroke={cor} strokeWidth="1.4" />
      <path d="M12 1.5v6M12 16.5v6M1.5 12h6M16.5 12h6" stroke={cor} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// Miniatura 2D: pictograma (SVG da pose) se há figura; senão still PNG; senão chapa em branco.
function NodeThumb({ imagem, nome, cor, slug, kind, paraSlug }: { imagem?: string; nome: string; cor: string; slug?: string; kind?: "pos" | "trans"; paraSlug?: string }) {
  const [erro, setErro] = useState(false);
  const deSlug = slug && kind === "trans" && slug.includes("__") ? slug.split("__")[0] : undefined;
  const temFig =
    !!slug &&
    (kind === "trans"
      ? temTransicao3D(slug) || (!!paraSlug && temPose3D(paraSlug)) || (!!deSlug && temPose3D(deSlug))
      : temPose3D(slug));
  const temConteudo = temFig || (!!imagem && !erro);
  const corPlaca = kind === "pos" ? "var(--ink-faint)" : cor;
  return (
    <div className="relative" style={{ height: PLACA_H }}>
      <div
        className="absolute inset-[7px] overflow-hidden rounded-[7px]"
        style={{
          background: "var(--paper)",
          boxShadow:
            "inset 0 0 0 1px color-mix(in oklch, var(--paper-edge) 70%, transparent), inset 0 2px 8px -4px oklch(0 0 0 / 0.28)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34px]"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 130%, color-mix(in oklch, var(--paper-edge) 55%, transparent), transparent 70%)",
          }}
        />
        {temFig ? (
          <div className="relative h-full w-full p-[7px]">
            <Pictograma slug={slug!} kind={kind ?? "pos"} fallback={paraSlug} />
          </div>
        ) : imagem && !erro ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagem}
            alt={nome}
            draggable={false}
            onError={() => setErro(true)}
            className="relative h-full w-full object-contain p-[7px]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-[6px]">
            <MarcaRegistro cor={corPlaca} />
            <span className="text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              Figura em breve
            </span>
          </div>
        )}
        {temConteudo && (
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: corPlaca, opacity: 0.85 }} />
        )}
      </div>
    </div>
  );
}

function NodeCard({ data }: NodeProps) {
  const d = data as unknown as CardData;
  const rotuloAcessivel = `${d.raiz ? "Você está aqui" : d.rotulo}: ${limpaNome(d.nome)}${d.pago ? " (conteúdo completo)" : ""}`;
  return (
    <div
      role="button"
      tabIndex={d.recuado ? -1 : 0}
      aria-label={rotuloAcessivel}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
      className="node-card group cursor-pointer overflow-hidden rounded-[12px] outline-none transition-[transform,opacity,filter,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] focus-visible:shadow-[0_0_0_2px_var(--paper),0_0_0_4px_var(--clay),0_10px_28px_-12px_oklch(0_0_0/0.7)]"
      style={
        {
          width: CARD_W,
          background: "var(--mat-2)",
          border: `1.5px solid ${d.ativo ? "var(--on-mat)" : d.raiz ? "var(--clay)" : d.cor}`,
          boxShadow: d.ativo
            ? `0 0 0 3px color-mix(in oklch, ${d.raiz ? "var(--clay)" : d.cor} 40%, transparent), 0 10px 28px -12px oklch(0 0 0 / 0.7)`
            : "0 4px 14px -8px oklch(0 0 0 / 0.5)",
          opacity: d.recuado ? 0.34 : 1,
          filter: d.recuado ? "saturate(0.6) blur(0.6px)" : "none",
          transform: d.recuado ? "scale(0.92)" : "scale(1)",
          "--card-cor": d.raiz ? "var(--clay)" : d.cor,
        } as CSSProperties
      }
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <NodeThumb imagem={d.imagem} nome={d.nome} cor={d.cor} slug={d.slug} kind={d.kind} paraSlug={d.paraSlug} />
      <div className="px-3 py-[10px]">
        <span className="flex items-center gap-[5px] text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.12em]" style={{ color: d.raiz ? "var(--clay-on-mat)" : d.cor }}>
          <span className="h-[6px] w-[6px] rounded-full" style={{ background: d.raiz ? "var(--clay-on-mat)" : d.cor }} />
          {d.raiz ? "Você está aqui" : d.rotulo}
          {/* Selo de acesso — chip latão (--grau): ênfase de 2º nível, não marca, não cor funcional. */}
          {d.pago && (
            <span
              className="ml-auto inline-flex items-center gap-[3px] rounded-full px-[6px] py-[1px] text-[var(--grau-on-mat)]"
              style={{ background: "color-mix(in oklch, var(--grau-on-mat) 16%, transparent)" }}
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              completo
            </span>
          )}
        </span>
        <span className="mt-[3px] block font-display text-[length:var(--step-0r)] font-bold leading-tight text-[var(--on-mat)]">
          {limpaNome(d.nome)}
        </span>
        {d.desc && (
          <span className="mt-[3px] line-clamp-2 block text-[length:var(--step-xs)] leading-snug text-[var(--on-mat-soft)]">
            {d.desc}
          </span>
        )}
      </div>
    </div>
  );
}

const nodeTypes = { posicao: NodeCard, transicao: NodeCard };

/** Auto-layout dagre (esquerda→direita). Sem nó expandido: todos os cards têm tamanho fixo. */
function buildLayout(grafo: Grafo): { nodes: Node[]; edges: Edge[] } {
  const baseNodes = new Map<string, Node>();
  const posPorSlug = new Map(grafo.posicoes.map((p) => [p.slug, p]));

  for (const p of grafo.posicoes) {
    baseNodes.set(p.slug, {
      id: p.slug,
      type: "posicao",
      position: { x: 0, y: 0 },
      width: CARD_W,
      height: CARD_H,
      draggable: false,
      data: {
        nome: p.nome,
        raiz: p.raiz,
        cor: p.raiz ? "var(--clay-on-mat)" : "var(--on-mat-soft)",
        rotulo: "Posição",
        desc: p.resumo,
        imagem: p.imagem,
        slug: p.slug,
        kind: "pos",
      },
    });
  }

  for (const t of grafo.transicoes) {
    const m = tipoMeta(t.tipo);
    baseNodes.set(t.slug, {
      id: t.slug,
      type: "transicao",
      position: { x: 0, y: 0 },
      width: CARD_W,
      height: CARD_H,
      draggable: false,
      data: {
        nome: nomeLegivel(t, posPorSlug.get(t.para ?? "")?.nome),
        cor: m.corOnMat,
        rotulo: m.rotulo,
        desc: m.sentido,
        pago: t.acesso === "paid",
        imagem: t.imagem ?? `/stills/tecnicas/${t.slug}.png`,
        slug: t.slug,
        kind: "trans",
        paraSlug: t.para ?? t.de,
      },
    });
  }

  const edges: Edge[] = [];
  const addEdge = (id: string, source: string, target: string, cor: string, dashed: boolean, raspagem: boolean) => {
    edges.push({
      id,
      source,
      target,
      style: { stroke: cor, strokeWidth: 1.7, strokeDasharray: dashed ? "4 4" : undefined, opacity: 0.62 },
      animated: raspagem,
      zIndex: 0,
    });
  };

  for (const t of grafo.transicoes) {
    const m = tipoMeta(t.tipo);
    if (baseNodes.has(t.de)) addEdge(`${t.de}->${t.slug}`, t.de, t.slug, m.corOnMat, false, t.tipo === "raspagem");
    if (t.para && baseNodes.has(t.para)) {
      addEdge(`${t.slug}->${t.para}`, t.slug, t.para, m.corOnMat, true, false);
      if (t.bidirectional) {
        addEdge(`${t.para}<-${t.slug}`, t.para, t.slug, m.corOnMat, false, false);
        addEdge(`${t.slug}<-${t.de}`, t.slug, t.de, m.corOnMat, true, false);
      }
    }
  }

  const g = new Dagre.graphlib.Graph()
    .setGraph({ rankdir: "LR", nodesep: 52, ranksep: 140, marginx: 28, marginy: 28, ranker: "tight-tree" })
    .setDefaultEdgeLabel(() => ({}));
  for (const n of baseNodes.values()) g.setNode(n.id, { width: CARD_W, height: CARD_H });
  for (const e of edges) g.setEdge(e.source, e.target);
  Dagre.layout(g);

  const nodes: Node[] = [...baseNodes.values()].map((n) => {
    const d = g.node(n.id);
    return { ...n, position: { x: d.x - CARD_W / 2, y: d.y - CARD_H / 2 } };
  });

  return { nodes, edges };
}

/** Enquadra o grafo local e re-centra suave no nó selecionado (sem o card grande do /mapa). */
function FitterV2({ selectedId }: { selectedId?: string }) {
  const { getNode, setCenter, fitView } = useReactFlow();
  const vw = useStore((s) => s.width);
  const vh = useStore((s) => s.height);
  const ultimo = useRef<string | null>(null);
  useEffect(() => {
    if (!vw || !vh) return;
    if (!selectedId) {
      ultimo.current = null;
      const padding = vw <= 360 ? 0.1 : 0.2;
      const id = requestAnimationFrame(() => fitView({ padding, duration: 300 }));
      return () => cancelAnimationFrame(id);
    }
    if (ultimo.current === selectedId) return;
    const primeiro = ultimo.current === null;
    let raf = 0;
    let tentativas = 0;
    const tick = () => {
      const n = getNode(selectedId);
      if (!n) {
        if (tentativas++ < 40) raf = requestAnimationFrame(tick);
        else fitView({ padding: 0.2, duration: 300 });
        return;
      }
      ultimo.current = selectedId;
      const w = n.width ?? CARD_W;
      const h = n.height ?? CARD_H;
      setCenter(n.position.x + w / 2, n.position.y + h / 2, { zoom: 0.9, duration: primeiro ? 0 : 380 });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [selectedId, getNode, setCenter, fitView, vw, vh]);
  return null;
}

function MapControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const btn = "flex h-9 w-9 items-center justify-center text-[var(--on-mat)] transition-colors hover:bg-[var(--mat-line)]";
  return (
    <div className="absolute bottom-4 left-4 z-20 flex flex-col overflow-hidden rounded-[10px] border border-[var(--mat-line)] bg-[var(--mat-2)] shadow-lg">
      <button onClick={() => zoomIn({ duration: 200 })} className={`${btn} border-b border-[var(--mat-line)]`} aria-label="Aproximar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <button onClick={() => zoomOut({ duration: 200 })} className={`${btn} border-b border-[var(--mat-line)]`} aria-label="Afastar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14" /></svg>
      </button>
      <button onClick={() => fitView({ padding: 0.16, duration: 300 })} className={btn} aria-label="Centralizar o mapa">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
      </button>
    </div>
  );
}

export function MapaCanvasV2({
  grafo,
  selectedId,
  onNodeClick,
}: {
  grafo: Grafo;
  selectedId?: string;
  onNodeClick: (id: string) => void;
}) {
  const base = useMemo(() => buildLayout(grafo), [grafo]);
  const nodes = useMemo(
    () =>
      base.nodes.map((n) => ({
        ...n,
        data: { ...n.data, ativo: n.id === selectedId, recuado: !!selectedId && n.id !== selectedId },
      })),
    [base.nodes, selectedId],
  );

  return (
    <div className="tatame h-full w-full overflow-hidden border-[var(--mat-line)]">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={base.edges}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          nodesConnectable={false}
          elementsSelectable
          onNodeClick={(_, node) => onNodeClick(node.id)}
          panOnScroll={false}
          zoomOnScroll={false}
          preventScrolling={false}
          minZoom={0.3}
          maxZoom={1.4}
          style={{ background: "transparent" }}
        >
          <FitterV2 selectedId={selectedId} />
          <MapControls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
