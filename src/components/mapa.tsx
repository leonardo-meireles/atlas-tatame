"use client";

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
import { NodeExpandido, expandedSize, EXPANDED_W, EXPANDED_H, type ExpData } from "./node-expandido";
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
  /** destino da transição — pose de fallback pro pictograma quando não há frames próprios. */
  paraSlug?: string;
  raiz?: boolean;
  pago?: boolean;
  ativo?: boolean;
  /** Há um nó expandido e este não é ele → recua/desfoca (focus+context). */
  recuado?: boolean;
}

const CARD_W = 234;
const CARD_H = 200;

function dims(id: string, expandedId?: string, compact = false) {
  return id === expandedId ? expandedSize(compact) : { w: CARD_W, h: CARD_H };
}

// "Placa" do nó — figura impressa numa chapa de papel quente (osso), com filete de
// registro na cor do tipo embaixo (cor=significado lida DENTRO da figura) e moldura
// recuada pra a chapa assentar dentro do card escuro. Serigrafia, não janela flutuante.
const PLACA_H = 116;

// Marca de registro de serigrafia (mira de impressão) — usada no placeholder pra a
// chapa vazia parecer INTENCIONAL (chapa em branco da gráfica), não um buraco de slop.
function MarcaRegistro({ cor }: { cor: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="opacity-70">
      <circle cx="12" cy="12" r="6.5" stroke={cor} strokeWidth="1.4" />
      <path d="M12 1.5v6M12 16.5v6M1.5 12h6M16.5 12h6" stroke={cor} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// Miniatura: figura 3D-derivada (pictograma) se o nó tem pose; senão still PNG; senão placeholder.
function NodeThumb({ imagem, nome, cor, slug, kind, paraSlug }: { imagem?: string; nome: string; cor: string; slug?: string; kind?: "pos" | "trans"; paraSlug?: string }) {
  const [erro, setErro] = useState(false);
  const deSlug = slug && kind === "trans" && slug.includes("__") ? slug.split("__")[0] : undefined;
  const temFig =
    !!slug &&
    (kind === "trans"
      ? temTransicao3D(slug) || (!!paraSlug && temPose3D(paraSlug)) || (!!deSlug && temPose3D(deSlug))
      : temPose3D(slug));
  const temConteudo = temFig || (!!imagem && !erro);
  // Cor dos acentos da chapa (filete + mira): as variantes funcionais `-on-mat` leem bem
  // sobre o papel claro, mas o neutro de posição (--on-mat-soft) some na chapa osso —
  // troca por --ink-faint pra a posição ter um filete/mira de tinta visível.
  const corPlaca = kind === "pos" ? "var(--ink-faint)" : cor;
  return (
    // Moldura: a chapa recua dentro do card (sombra interna + filete) — profundidade de
    // impressão sem peso de SaaS. Filete inferior na cor do tipo = registro funcional.
    <div className="relative" style={{ height: PLACA_H }}>
      <div
        className="absolute inset-[7px] overflow-hidden rounded-[7px]"
        style={{
          background: "var(--paper)",
          boxShadow:
            "inset 0 0 0 1px color-mix(in oklch, var(--paper-edge) 70%, transparent), inset 0 2px 8px -4px oklch(0 0 0 / 0.28)",
        }}
      >
        {/* Chão de meio-tom: dá base pra figura "pisar" — leitura de chapa impressa, não recorte solto. */}
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
          // Chapa em branco: mira de registro + caption serigrafia. Cara de prova de
          // gráfica aguardando arte, não placeholder genérico.
          <div className="flex h-full w-full flex-col items-center justify-center gap-[6px]">
            <MarcaRegistro cor={corPlaca} />
            <span className="text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              Figura em breve
            </span>
          </div>
        )}
        {/* Filete de registro na cor do tipo — só quando há figura (na chapa vazia a mira já carrega a cor). */}
        {temConteudo && (
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: corPlaca, opacity: 0.85 }} />
        )}
      </div>
    </div>
  );
}

// Card de nó (posição ou técnica) sobre a lona escura — estilo GrappleFlows.
// role=button + tabIndex tornam o card alcançável/acionável por teclado e leitor de tela
// (React Flow não dá semântica nativa aqui). aria-label descreve tipo + nome. O recuado
// (focus+context) sai do tab order — não faz sentido focar um vizinho desfocado.
function NodeCard({ data }: NodeProps) {
  const d = data as unknown as CardData;
  const rotuloAcessivel = `${d.raiz ? "Você está aqui" : d.rotulo}: ${limpaNome(d.nome)}${d.pago ? " (conteúdo completo)" : ""}`;
  return (
    <div
      role="button"
      tabIndex={d.recuado ? -1 : 0}
      aria-label={rotuloAcessivel}
      // Enter/Espaço aciona o nó: dispara um clique sintético que o onNodeClick do
      // React Flow captura (o handler vive no canvas, não no nó). Sem isso o card é
      // focável mas inerte pra teclado.
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
          // cor da borda no hover (lida pela classe .node-card no globals.css)
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
          {/* Selo de acesso — chip latão (--grau, ênfase de 2º nível: NÃO marca, NÃO cor
              funcional). Cadeado pequeno + "completo": discreto mas legível na lona. */}
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

const nodeTypes = { posicao: NodeCard, transicao: NodeCard, expandido: NodeExpandido };

/**
 * Auto-layout com dagre (esquerda→direita). Genérico: posições E transições viram
 * nós (cards), arestas ligam de→transição→para. O nó `expandedId` entra GRANDE, então
 * os vizinhos refluem ao redor dele (focus+context). Escala pra qualquer nº de nós.
 */
function buildLayout(grafo: Grafo, expandedId?: string, compact = false): { nodes: Node[]; edges: Edge[] } {
  const baseNodes = new Map<string, Node>();
  // slug→Posicao, pra resolver nome de destino em "Transição sem Nome".
  const posPorSlug = new Map(grafo.posicoes.map((p) => [p.slug, p]));

  for (const p of grafo.posicoes) {
    const { w, h } = dims(p.slug, expandedId, compact);
    baseNodes.set(p.slug, {
      id: p.slug,
      type: p.slug === expandedId ? "expandido" : "posicao",
      position: { x: 0, y: 0 },
      width: w,
      height: h,
      draggable: false,
      zIndex: p.slug === expandedId ? 10 : 1,
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
    const { w, h } = dims(t.slug, expandedId, compact);
    baseNodes.set(t.slug, {
      id: t.slug,
      type: t.slug === expandedId ? "expandido" : "transicao",
      position: { x: 0, y: 0 },
      width: w,
      height: h,
      draggable: false,
      zIndex: t.slug === expandedId ? 10 : 1,
      data: {
        nome: nomeLegivel(t, posPorSlug.get(t.para ?? "")?.nome),
        cor: m.corOnMat,
        rotulo: m.rotulo,
        desc: m.sentido,
        pago: t.acesso === "paid",
        imagem: t.imagem ?? `/stills/tecnicas/${t.slug}.png`,
        slug: t.slug,
        kind: "trans",
        // Fallback do pictograma: destino, ou origem se for folha (finalização para:null).
        paraSlug: t.para ?? t.de,
      },
    });
  }

  const edges: Edge[] = [];
  const addEdge = (id: string, source: string, target: string, cor: string, dashed: boolean, raspagem: boolean) => {
    const foco = !!expandedId && (source === expandedId || target === expandedId);
    const dim = !!expandedId && !foco;
    edges.push({
      id,
      source,
      target,
      style: {
        stroke: cor,
        strokeWidth: foco ? 2.6 : 1.6,
        strokeDasharray: dashed ? "4 4" : undefined,
        opacity: dim ? 0.16 : foco ? 0.95 : 0.6,
      },
      animated: foco || raspagem,
      zIndex: foco ? 5 : 0,
    });
  };

  for (const t of grafo.transicoes) {
    const m = tipoMeta(t.tipo);
    if (baseNodes.has(t.de)) {
      addEdge(`${t.de}->${t.slug}`, t.de, t.slug, m.corOnMat, false, t.tipo === "raspagem");
    }
    if (t.para && baseNodes.has(t.para)) {
      addEdge(`${t.slug}->${t.para}`, t.slug, t.para, m.corOnMat, true, false);
      // Bidirecional: aresta extra no sentido reverso (mostra que a transição é reversível).
      if (t.bidirectional) {
        addEdge(`${t.para}<-${t.slug}`, t.para, t.slug, m.corOnMat, false, false);
        addEdge(`${t.slug}<-${t.de}`, t.slug, t.de, m.corOnMat, true, false);
      }
    }
  }

  // Em telas estreitas (compact) aperta o espaçamento dos ranks/nós: com o mesmo gap,
  // o fitView precisa afastar muito e os cards ficam ilegíveis a ≤360px. Menos folga =
  // grafo mais denso = cada card maior na tela.
  const g = new Dagre.graphlib.Graph()
    .setGraph({
      rankdir: "LR",
      nodesep: compact ? 36 : 56,
      ranksep: compact ? 96 : 150,
      marginx: compact ? 16 : 28,
      marginy: compact ? 16 : 28,
      ranker: "tight-tree",
    })
    .setDefaultEdgeLabel(() => ({}));
  for (const n of baseNodes.values()) {
    const { w, h } = dims(n.id, expandedId, compact);
    g.setNode(n.id, { width: w, height: h });
  }
  for (const e of edges) g.setEdge(e.source, e.target);
  Dagre.layout(g);

  const nodes: Node[] = [...baseNodes.values()].map((n) => {
    const d = g.node(n.id);
    const { w, h } = dims(n.id, expandedId, compact);
    return { ...n, position: { x: d.x - w / 2, y: d.y - h / 2 } };
  });

  return { nodes, edges };
}

/**
 * fitView só depois que os nós custom foram medidos (evita fit torto). Quando há nó
 * expandido, enquadra ELE (card grande centrado, vizinhos sangram nas bordas).
 */
/**
 * Centra o card expandido. Usa as coords determinísticas do dagre (via getNode) em
 * vez de medição assíncrona — `useNodesInitialized` não dispara neste fluxo controlado.
 */
function Focuser({ expandedId }: { expandedId?: string }) {
  const { getNode, setCenter, fitView } = useReactFlow();
  const vw = useStore((s) => s.width);
  const vh = useStore((s) => s.height);
  const ultimo = useRef<string | null>(null);
  useEffect(() => {
    if (!vw || !vh) return;
    // Sem card aberto: enquadra o grafo local — NUNCA deixa o usuário olhando o vazio.
    // A ≤360px usa folga menor pra os cards ocuparem mais tela (legibilidade).
    if (!expandedId) {
      ultimo.current = null;
      const padding = vw <= 360 ? 0.1 : 0.22;
      const id = requestAnimationFrame(() => fitView({ padding, duration: 300 }));
      return () => cancelAnimationFrame(id);
    }
    if (ultimo.current === expandedId) return;
    const primeiro = ultimo.current === null;
    // Faz POLL por rAF até o nó existir no store (o card grande mede devagar; sem retry
    // o centro nunca dispara e o mapa aparece vazio).
    let raf = 0;
    let tentativas = 0;
    const tick = () => {
      const n = getNode(expandedId);
      if (!n) {
        if (tentativas++ < 40) raf = requestAnimationFrame(tick);
        else fitView({ padding: 0.22, duration: 300 }); // desistiu: ao menos mostra algo
        return;
      }
      ultimo.current = expandedId;
      const w = n.width ?? n.measured?.width ?? EXPANDED_W;
      const h = n.height ?? n.measured?.height ?? EXPANDED_H;
      const zoom = Math.max(0.3, Math.min(0.82, (vw - 48) / w, (vh - 48) / h));
      setCenter(n.position.x + w / 2, n.position.y + h / 2, { zoom, duration: primeiro ? 0 : 420 });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [expandedId, getNode, setCenter, fitView, vw, vh]);
  return null;
}

/** Controles de zoom/centralizar — necessários pois o zoom-no-scroll é desligado. */
function MapControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const btn =
    "flex h-9 w-9 items-center justify-center text-[var(--on-mat)] transition-colors hover:bg-[var(--mat-line)]";
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

/** Dica de uso — entra suave, some sozinha em 7s (ou no ✕). */
function MapHint() {
  const [estado, setEstado] = useState<"entrando" | "saindo" | "fora">("entrando");
  useEffect(() => {
    const t = setTimeout(() => setEstado("saindo"), 7000);
    return () => clearTimeout(t);
  }, []);
  if (estado === "fora") return null;
  return (
    <div
      className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-[var(--space-sm)] rounded-full border border-[var(--mat-line)] bg-[var(--mat-2)] px-[var(--space-md)] py-[6px] text-[length:var(--step-xs)] text-[var(--on-mat-soft)] shadow-lg"
      style={{
        animation:
          estado === "saindo"
            ? "hint-fade 360ms cubic-bezier(0.4,0,1,1) both"
            : "hint-baixa 420ms cubic-bezier(0.22,1,0.36,1) both",
      }}
      onAnimationEnd={() => estado === "saindo" && setEstado("fora")}
    >
      {/* Ícone de toque (SVG, não emoji — emoji-as-ícone é tell de slop e quebra a serigrafia). */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-[var(--clay-on-mat)]">
        <path d="M9 11V6a2 2 0 0 1 4 0v5" />
        <path d="M13 9a2 2 0 0 1 4 0v3a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.5-2l-2.2-2.6a1.6 1.6 0 0 1 2.4-2.1l1.3 1.2" />
      </svg>
      <span className="whitespace-nowrap">
        Toque num card<span className="hidden sm:inline"> pra abrir aqui · arraste pra mover</span>
      </span>
      <button onClick={() => setEstado("saindo")} className="ml-[var(--space-xs)] shrink-0 text-[var(--on-mat)] hover:opacity-70" aria-label="Dispensar dica">✕</button>
    </div>
  );
}

export function Mapa({
  grafo,
  fill = false,
  selectedId,
  expandedData,
  onNodeClick,
  onIr,
  onClose,
  suppressHint = false,
}: {
  grafo: Grafo;
  /** Preenche a altura do pai (modo explorador) em vez da altura embutida. */
  fill?: boolean;
  selectedId?: string;
  /** Conteúdo rico do nó selecionado (injetado no nó expandido). */
  expandedData?: ExpData;
  onNodeClick?: (id: string) => void;
  onIr?: (id: string) => void;
  /** Fechar/colapsar o card expandido (clique fora ou no X). */
  onClose?: () => void;
  /** Suprime o MapHint (ex: enquanto o onboarding de primeiro acesso está visível). */
  suppressHint?: boolean;
}) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 680px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const base = useMemo(() => buildLayout(grafo, selectedId, compact), [grafo, selectedId, compact]);
  const nodes = useMemo(
    () =>
      base.nodes.map((n) => {
        if (n.id === selectedId && expandedData) {
          return { ...n, data: { ...expandedData, compact, onIr, onClose } as unknown as Record<string, unknown> };
        }
        return {
          ...n,
          data: { ...n.data, ativo: n.id === selectedId, recuado: !!selectedId && n.id !== selectedId },
        };
      }),
    [base.nodes, selectedId, expandedData, compact, onIr, onClose],
  );

  return (
    <div
      className={`tatame w-full overflow-hidden border-[var(--mat-line)] ${
        fill ? "h-full" : "h-[clamp(380px,54vh,540px)] rounded-[14px] border shadow-[inset_0_1px_0_oklch(1_0_0/0.04)]"
      }`}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={base.edges}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          nodesConnectable={false}
          elementsSelectable={!!onNodeClick}
          onNodeClick={(_, node) => {
            if (node.id === selectedId) return; // clique dentro do card expandido não re-seleciona
            onNodeClick?.(node.id);
          }}
          onPaneClick={() => onClose?.()}
          panOnScroll={false}
          zoomOnScroll={false}
          preventScrolling={false}
          minZoom={0.3}
          maxZoom={1.4}
          style={{ background: "transparent" }}
        >
          <Focuser expandedId={selectedId} />
          {onNodeClick && (
            <>
              <MapControls />
              {!suppressHint && <MapHint />}
            </>
          )}
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
