"use client";

/**
 * Nó EXPANDIDO no canvas — o card grande que cresce no lugar quando você clica.
 * Mata a antiga sidebar: figura grande + callouts numerados + pontos-chave +
 * "daqui você pode", tudo DENTRO do nó (focus+context). Figura↔texto se reforçam
 * pelo nº do callout (passar o mouse num ponto pulsa a seta na figura).
 */
import { useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { Posicao, Transicao, Video } from "@/lib/types";
import { VideoEmbed } from "./video-embed";
import type { Anotacao, TipoAnotacao } from "@/content/anotacoes";
import { tipoMeta } from "@/lib/tipo";
import { nomeLegivel } from "@/lib/dedup-saidas";
import { limpaNome } from "@/lib/nome";
import { buildCallouts } from "@/lib/callouts";
import { Still } from "./still";
import { temPose3D, temTransicao3D, PLAYER } from "@/lib/figura/figura-data";
import { SetasLegenda, COR_SETA } from "./setas-overlay";
import { TipoBadge } from "./badges";

/** Viewer 3D só no cliente (R3F/WebGL não roda em SSR — Next 16).
 *  loading: o chunk three.js é pesado — placeholder honesto evita área em branco + CLS. */
const FiguraR3F = dynamic(() => import("./figura-r3f"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[var(--space-2xs)] px-[var(--space-md)] text-center text-[var(--ink-faint)]">
      <span className="text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.16em]">Montando a figura</span>
      <span className="text-[length:var(--step-3xs)] tracking-[0.04em]">posicionando os dois bonecos</span>
    </div>
  ),
});

/** Tamanho fixo do card expandido (em unidades do grafo). dagre recebe esta caixa. (+25% e +30%). */
export const EXPANDED_W = 1398;
export const EXPANDED_H = 910;
/** Variante mobile: empilhado (figura em cima), mais estreito e alto. */
export const EXPANDED_W_M = 388;
export const EXPANDED_H_M = 1014;

export function expandedSize(compact: boolean) {
  return compact ? { w: EXPANDED_W_M, h: EXPANDED_H_M } : { w: EXPANDED_W, h: EXPANDED_H };
}

/** Conteúdo rico injetado no `data` do nó selecionado. */
export interface ExpData {
  kind: "pos" | "trans";
  pos?: Posicao;
  saidas?: Transicao[];
  /** Transições que CHEGAM nesta posição — pra voltar/orientar ("chega aqui por"). */
  entradas?: Transicao[];
  anotacoes?: Anotacao[];
  trans?: Transicao;
  destino?: Posicao | null;
  /** Posição de origem da técnica ("vem de") — orientação/volta. */
  origem?: Posicao | null;
  /** Mapa slug→nome de display, pra resolver nome de destino em "Transição sem Nome". */
  nomePorSlug?: Record<string, string>;
  /** Layout empilhado pra telas estreitas. */
  compact?: boolean;
  onIr?: (slug: string) => void;
  /** Fecha/colapsa o card (X). */
  onClose?: () => void;
}

const COR_ANOTACAO: Record<TipoAnotacao, string> = {
  junta: "var(--raspagem)",
  pressao: "var(--finalizacao)",
  pegada: "var(--clay)",
  controle: "var(--perda)",
};

const TITULO = "font-display font-bold leading-tight text-[var(--ink)] text-[length:var(--step-2)]";
const SECAO = "text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]";

/** Regra de ouro — o 1º princípio NUNCA fica escondido. Número no acento latão (--grau):
 *  ênfase de 2º nível, distinto do clay da marca. É o "porquê" que orienta a posição inteira. */
function RegraDeOuro({ texto }: { texto: string }) {
  return (
    <aside className="mb-[var(--space-lg)] flex gap-[var(--space-sm)] rounded-[10px] border border-grau/35 bg-grau-tint p-[var(--space-md)]">
      <span
        aria-hidden
        className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-grau font-display text-[length:var(--step-xs)] font-bold leading-none text-[var(--paper)]"
      >
        01
      </span>
      <span className="min-w-0">
        <span className="block text-[length:var(--step-3xs)] font-semibold uppercase tracking-[0.16em] text-grau-deep">
          Regra de ouro
        </span>
        <span className="mt-[2px] block text-[length:var(--step-0)] font-medium leading-snug text-[var(--ink)]">
          {texto}
        </span>
      </span>
    </aside>
  );
}

function VideoSlot({ video }: { video?: Video }) {
  if (video) return <VideoEmbed video={video} compact />;
  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[10px] border bg-[var(--paper-2)]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--paper-edge) 0 1px, transparent 1px 9px)",
        }}
      />
      <div className="relative flex flex-col items-center gap-[var(--space-xs)] px-[var(--space-md)] text-center text-[var(--ink-faint)]">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--ink-faint)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.12em]">Vídeo gravado a caminho</span>
        <span className="text-[length:var(--step-3xs)] tracking-[0.04em] text-[var(--ink-faint)]">por ora, siga o passo a passo e a figura</span>
      </div>
    </div>
  );
}

/** Casca do card: handles + header + 2 colunas (figura à esquerda, conteúdo à direita). */
function Casca({
  rotulo,
  cor,
  titulo,
  compact = false,
  onClose,
  figura,
  children,
}: {
  rotulo: string;
  cor: string;
  titulo: string;
  compact?: boolean;
  onClose?: () => void;
  figura: React.ReactNode;
  children: React.ReactNode;
}) {
  const { w, h } = expandedSize(compact);
  return (
    <div
      className="lamina-enter relative flex flex-col overflow-hidden rounded-[14px] border bg-[var(--paper)] text-[var(--ink)]"
      style={{
        width: w,
        height: h,
        borderColor: "var(--paper-edge)",
        boxShadow: "0 28px 64px -28px oklch(0 0 0 / 0.78), 0 2px 0 0 oklch(1 0 0 / 0.05) inset",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />

      <Cantos />

      <header className="flex items-center gap-[var(--space-sm)] border-b px-[var(--space-lg)] py-[var(--space-md)]">
        <span className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: cor }} />
        <span className="text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.16em]" style={{ color: cor }}>
          {rotulo}
        </span>
        <h2 className={`${TITULO} ml-[var(--space-xs)] flex-1 truncate`}>{limpaNome(titulo)}</h2>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="-mr-[var(--space-xs)] ml-[var(--space-xs)] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--ink-faint)] transition-colors hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </header>

      <div className={`flex min-h-0 flex-1 ${compact ? "flex-col" : ""}`}>
        <div
          className={`lamina-figura flex shrink-0 flex-col gap-[var(--space-sm)] bg-[var(--paper-2)] p-[var(--space-lg)] ${
            compact ? "border-b" : "w-[676px] border-r"
          }`}
        >
          {figura}
        </div>
        <div className="lamina-corpo nowheel nodrag min-w-0 flex-1 overflow-y-auto p-[var(--space-lg)]">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Decodifica os dois bonecos: a cor diz quem está por cima vs por baixo. */
function QuemEhQuem() {
  return (
    <div className="flex flex-wrap items-center gap-x-[var(--space-md)] gap-y-[2px] text-[length:var(--step-3xs)] font-semibold uppercase tracking-[0.1em] text-[var(--ink-faint)]">
      <span className="flex items-center gap-[5px]">
        <span className="h-[8px] w-[8px] rounded-full" style={{ background: "var(--clay)" }} />
        por cima
      </span>
      <span className="flex items-center gap-[5px]">
        <span className="h-[8px] w-[8px] rounded-full" style={{ background: "var(--ink)" }} />
        por baixo
      </span>
    </div>
  );
}

/** Marcas de registro nos cantos — vocabulário cartográfico do atlas. */
function Cantos() {
  const base = "pointer-events-none absolute h-[10px] w-[10px] border-[var(--ink-faint)] opacity-60 z-10";
  return (
    <>
      <span aria-hidden className={`${base} left-[10px] top-[10px] border-l border-t`} />
      <span aria-hidden className={`${base} right-[10px] top-[10px] border-r border-t`} />
      <span aria-hidden className={`${base} bottom-[10px] left-[10px] border-b border-l`} />
      <span aria-hidden className={`${base} bottom-[10px] right-[10px] border-b border-r`} />
    </>
  );
}

/** Link de orientação "vem de / chega por" — devolve o contexto espacial perdido no zoom. */
function ChegaPor({ rotulo, nome, cor, onClick }: { rotulo: string; nome: string; cor: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-[var(--space-xs)] text-left text-[length:var(--step-xs)] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
    >
      <span aria-hidden style={{ color: cor }}>←</span>
      <span className="text-[length:var(--step-3xs)] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">{rotulo}</span>
      <span className="font-display font-bold text-[var(--ink)]">{nome}</span>
    </button>
  );
}

/** Lista numerada de pontos-chave, casada com os marcadores da figura. */
function PontosNumerados({
  setas,
  ativo,
  onHover,
}: {
  setas: NonNullable<Posicao["setas"]>;
  ativo: number | null;
  onHover: (n: number | null) => void;
}) {
  const callouts = buildCallouts(setas);
  return (
    <ul className="mt-[var(--space-sm)] flex flex-col gap-[var(--space-2xs)]">
      {callouts.map((c) => {
        const on = ativo === c.n;
        return (
          <li key={c.n}>
            <button
              type="button"
              onMouseEnter={() => onHover(c.n)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(c.n)}
              onBlur={() => onHover(null)}
              className="flex w-full gap-[var(--space-sm)] rounded-[8px] p-[var(--space-xs)] text-left transition-colors"
              style={{ background: on ? "var(--paper-2)" : "transparent" }}
            >
              <span
                className="mt-[1px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full font-display text-[length:var(--step-3xs)] font-bold leading-none text-[var(--paper)] transition-transform"
                style={{ background: COR_SETA[c.tipo], transform: on ? "scale(1.12)" : "scale(1)" }}
              >
                {c.n}
              </span>
              <span className="text-[length:var(--step-0s)] leading-snug">
                <span className="font-semibold text-[var(--ink)]">{c.rotulo}</span>
                {c.porque && <span className="text-[var(--ink-soft)]"> — {c.porque}</span>}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Mesma "lâmina" cartográfica do Still, mas com o viewer 3D (pose ou técnica animada). */
function Lamina3D({
  slug,
  transicao,
  nome,
  indice,
  accent,
}: {
  slug?: string;
  transicao?: string;
  nome: string;
  indice?: string;
  /** Cor do tipo da técnica — tinge sutilmente o fundo (cor = significado). */
  accent?: string;
}) {
  // Fundo: gi quente (radial claro→oat). Pra transições, leve vinheta na cor do tipo.
  const fundo = accent
    ? `radial-gradient(120% 90% at 50% 18%, var(--paper) 0%, var(--paper-2) 58%, color-mix(in oklch, ${accent} 22%, var(--paper-2)) 100%)`
    : `radial-gradient(120% 90% at 50% 22%, var(--paper) 0%, var(--paper-2) 60%, color-mix(in oklch, var(--clay) 9%, var(--paper-2)) 100%)`;
  return (
    <figure
      className="no-copy relative aspect-[4/3] overflow-hidden rounded-[10px] border"
      style={{ background: fundo }}
      aria-label={`Figura 3D da posição ${nome}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(var(--paper-edge) 1px, transparent 1px), linear-gradient(90deg, var(--paper-edge) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      {["left-2 top-2", "right-2 top-2", "left-2 bottom-2", "right-2 bottom-2"].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute ${pos} z-10 h-3 w-3 border-[var(--ink-faint)]`}
          style={{
            borderTopWidth: pos.includes("top") ? 1.5 : 0,
            borderBottomWidth: pos.includes("bottom") ? 1.5 : 0,
            borderLeftWidth: pos.includes("left") ? 1.5 : 0,
            borderRightWidth: pos.includes("right") ? 1.5 : 0,
          }}
        />
      ))}
      {/* nopan: orbit do canvas NÃO paneia o React Flow; nodrag: não arrasta o nó;
          nowheel: zoom do scroll fica no canvas (OrbitControls), não no grafo. */}
      <div className="nopan nodrag nowheel absolute inset-0">
        <FiguraR3F slug={slug} transicao={transicao} />
      </div>
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2 text-[length:var(--step-3xs)] font-medium uppercase tracking-[0.12em] text-[var(--ink-faint)]">
        <span>{indice ?? "Figura 3D"}</span>
        <span>{transicao ? "técnica em loop · arraste" : "arraste pra girar"}</span>
      </figcaption>
    </figure>
  );
}

/** Legenda: quem é quem (cor) + as mãos de cada um (tom claro da mesma cor). */
function Legenda3D() {
  const dot = (cor: string) => (
    <span className="h-[11px] w-[11px] shrink-0 rounded-full border border-[var(--paper-edge)]" style={{ background: cor }} />
  );
  const linha = (p: { base: string; hand: string }, quem: string) => (
    <span className="flex items-center gap-[5px]">
      {dot(p.base)}
      {quem}
      <span className="ml-[3px] flex items-center gap-[4px] text-[var(--ink-faint)]">
        {dot(p.hand)}
        <span className="normal-case">mãos</span>
      </span>
    </span>
  );
  return (
    <div className="flex flex-col gap-[4px] text-[length:var(--step-3xs)] font-semibold uppercase tracking-[0.1em] text-[var(--ink-faint)]">
      {linha(PLAYER.top, "por cima")}
      {linha(PLAYER.bottom, "por baixo")}
    </div>
  );
}

function CardPosicao({
  pos,
  saidas,
  entradas,
  anotacoes,
  nomePorSlug,
  compact,
  onClose,
  onIr,
}: {
  pos: Posicao;
  saidas: Transicao[];
  entradas: Transicao[];
  anotacoes: Anotacao[];
  nomePorSlug: Record<string, string>;
  compact: boolean;
  onClose?: () => void;
  onIr: (s: string) => void;
}) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const temCallouts = (pos.setas?.length ?? 0) > 0;
  const tem3D = temPose3D(pos.slug);
  return (
    <Casca
      compact={compact}
      onClose={onClose}
      rotulo={pos.raiz ? "Você está aqui" : "Posição"}
      cor={pos.raiz ? "var(--clay)" : "var(--ink-soft)"}
      titulo={pos.nome}
      figura={
        tem3D ? (
          <>
            <Lamina3D slug={pos.slug} nome={pos.nome} indice={pos.raiz ? "Figura 3D · 01" : "Figura 3D"} />
            <Legenda3D />
          </>
        ) : (
          <>
            <Still
              nome={pos.nome}
              src={pos.imagem}
              setas={pos.setas}
              activeN={ativo}
              onHoverCallout={setAtivo}
              indice={pos.raiz ? "Lâmina 01" : "Lâmina"}
            />
            {pos.imagem && <QuemEhQuem />}
            {temCallouts && <SetasLegenda setas={pos.setas!} />}
          </>
        )
      }
    >
      <p className="text-[length:var(--step-0s)] leading-relaxed text-[var(--ink-soft)]">{pos.resumo}</p>

      {pos.principios.length > 0 && <RegraDeOuro texto={pos.principios[0]} />}

      {temCallouts ? (
        <section className="mt-[var(--space-lg)]">
          <h3 className={SECAO}>Pontos-chave</h3>
          <PontosNumerados setas={pos.setas!} ativo={ativo} onHover={setAtivo} />
        </section>
      ) : anotacoes.length > 0 ? (
        <section className="mt-[var(--space-lg)]">
          <h3 className={SECAO}>Pontos-chave</h3>
          <ul className="mt-[var(--space-sm)] flex flex-col gap-[var(--space-sm)]">
            {anotacoes.map((a, i) => (
              <li key={i} className="flex gap-[var(--space-sm)]">
                <span className="mt-[5px] h-[8px] w-[8px] shrink-0 rounded-full" style={{ background: COR_ANOTACAO[a.tipo] }} />
                <span className="text-[length:var(--step-0s)] leading-snug">
                  <span className="font-semibold text-[var(--ink)]">{a.foco}</span>
                  <span className="text-[var(--ink-soft)]"> — {a.porque}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {saidas.length > 0 && (
        // Ação DOMINA: bloco recuado (paper-sunk) com eyebrow latão pra ler como o próximo passo,
        // não como mais uma lista. Linhas grandes e clicáveis — "o que eu faço daqui?".
        <section className="mt-[var(--space-lg)] rounded-[12px] border border-[var(--paper-edge)] bg-paper-sunk p-[var(--space-md)]">
          <div className="flex items-baseline justify-between gap-[var(--space-sm)]">
            <h3 className="font-display text-[length:var(--step-0t)] font-bold leading-none text-[var(--ink)]">Daqui você pode</h3>
            <span className="text-[length:var(--step-3xs)] font-semibold uppercase tracking-[0.16em] text-grau-deep">
              {saidas.length} {saidas.length === 1 ? "saída" : "saídas"}
            </span>
          </div>
          <div className="mt-[var(--space-sm)] flex flex-col">
            {saidas.map((t, i) => {
              const m = tipoMeta(t.tipo);
              return (
                <button
                  key={t.slug}
                  onClick={() => onIr(t.slug)}
                  style={{ "--i": i } as CSSProperties}
                  // outline-offset negativo: a linha rola dentro de overflow-y-auto (corta o
                  // x), então o foco fica INSET pra não ser clipado nas bordas laterais.
                  className="saida-row group flex items-center gap-[var(--space-sm)] rounded-[8px] border-b border-[var(--paper-edge)] px-[var(--space-xs)] py-[var(--space-sm)] text-left transition-colors duration-200 last:border-b-0 hover:bg-[var(--paper)] focus-visible:outline-offset-[-2px]"
                >
                  <span
                    className="h-[9px] w-[9px] shrink-0 rounded-full transition-transform duration-200 group-hover:scale-[1.4]"
                    style={{ background: m.cor }}
                  />
                  <span className="flex-1 font-display text-[length:var(--step-0h)] font-semibold leading-tight text-[var(--ink)]">{nomeLegivel(t, t.para ? nomePorSlug[t.para] : undefined)}</span>
                  <span className="text-[length:var(--step-0)] text-[var(--ink-faint)] transition-transform duration-200 group-hover:translate-x-[3px] group-hover:text-[var(--clay)]">
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {entradas.length > 0 && (
        // Referência/volta — secundária por definição. Recua em peso e cor pra NÃO competir
        // com a ação ("Daqui você pode"): orientação, não chamada.
        <section className="mt-[var(--space-md)]">
          <h3 className={SECAO}>Chega aqui por</h3>
          <div className="mt-[var(--space-2xs)] flex flex-col">
            {entradas.map((t) => {
              const m = tipoMeta(t.tipo);
              return (
                <button
                  key={t.slug}
                  onClick={() => onIr(t.slug)}
                  className="flex items-center gap-[var(--space-xs)] rounded-[6px] py-[var(--space-2xs)] text-left text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] focus-visible:outline-offset-[-2px]"
                >
                  <span aria-hidden style={{ color: m.cor }}>←</span>
                  <span className="flex-1 font-display text-[length:var(--step-0s)] font-medium">{nomeLegivel(t, t.para ? nomePorSlug[t.para] : pos.nome)}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {pos.principios.length > 1 && (
        <details className="group mt-[var(--space-lg)] border-t pt-[var(--space-md)]">
          <summary className="flex cursor-pointer list-none items-center justify-between text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.14em] text-grau-deep">
            Mais princípios ({pos.principios.length - 1})
            <svg className="text-[var(--ink-faint)] transition-transform group-open:rotate-90" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <ul className="mt-[var(--space-sm)] flex flex-col gap-[var(--space-xs)]">
            {pos.principios.slice(1).map((p, i) => (
              <li key={i} className="flex gap-[var(--space-sm)] text-[length:var(--step-0s)] leading-snug text-[var(--ink)]">
                <span className="font-display font-bold text-grau tabular-nums">{String(i + 2).padStart(2, "0")}</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </Casca>
  );
}

function CardTransicao({ t, destino, origem, compact, onClose, onIr }: { t: Transicao; destino: Posicao | null; origem: Posicao | null; compact: boolean; onClose?: () => void; onIr: (s: string) => void }) {
  const m = tipoMeta(t.tipo);
  return (
    <Casca
      compact={compact}
      onClose={onClose}
      rotulo={m.rotulo}
      cor={m.cor}
      titulo={nomeLegivel(t, destino?.nome)}
      figura={
        <>
          {/* SEMPRE 3D: anima a técnica (alias→frames GM) ou cai na pose do destino/origem.
              Nunca PNG — padrão R3F único em todos os nós. */}
          <Lamina3D
            transicao={t.slug}
            slug={t.para ?? t.de}
            nome={t.nome}
            indice="Técnica 3D"
            accent={m.cor}
          />
          <Legenda3D />
          <div className="mt-[var(--space-xs)] flex flex-wrap items-center gap-[var(--space-xs)]">
            <TipoBadge tipo={t.tipo} />
            {t.qualidade === "detalhada" && (
              <span
                className="rounded-full border border-[var(--paper-edge)] bg-[var(--paper-2)] px-[8px] py-[2px] text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.1em] text-[var(--ink-soft)]"
                title="Transição autoral do GrappleMap com mais keyframes — animação mais suave"
              >
                Demo curada
              </span>
            )}
            {t.bidirectional && (
              <span className="text-[length:var(--step-3xs)] uppercase tracking-[0.1em] text-[var(--ink-faint)]">↔ reversível</span>
            )}
            <span className="text-[length:var(--step-2xs)] text-[var(--ink-faint)]">{m.sentido}</span>
          </div>
        </>
      }
    >
      {origem && (
        <div className="mb-[var(--space-md)] border-b pb-[var(--space-sm)]">
          <ChegaPor rotulo="vem de" nome={origem.nome} cor={m.cor} onClick={() => onIr(origem.slug)} />
        </div>
      )}

      <section>
        <h3 className={SECAO}>Passo a passo</h3>
        <ol className="mt-[var(--space-sm)] flex flex-col gap-[var(--space-sm)]">
          {t.passos.map((passo, i) => (
            <li key={i} className="flex gap-[var(--space-sm)] text-[length:var(--step-0s)] leading-relaxed">
              <span className="font-display font-bold text-[var(--ink-faint)] tabular-nums">{i + 1}</span>
              <span className="text-[var(--ink)]">{passo}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-[var(--space-lg)]">
        <VideoSlot video={t.video} />
      </div>

      {destino && (
        <button
          onClick={() => onIr(destino.slug)}
          className="mt-[var(--space-lg)] flex w-full items-center justify-between rounded-[10px] bg-[var(--ink)] px-[var(--space-md)] py-[var(--space-sm)] text-left text-[var(--paper)] transition-transform hover:-translate-y-[1px] focus-visible:outline-offset-[-2px]"
        >
          <span>
            <span className="block text-[length:var(--step-3xs)] font-semibold uppercase tracking-[0.14em] opacity-70">Leva a</span>
            <span className="font-display text-[length:var(--step-0h)] font-bold">{destino.nome}</span>
          </span>
          <span>→</span>
        </button>
      )}
    </Casca>
  );
}

export function NodeExpandido({ data }: NodeProps) {
  const d = data as unknown as ExpData;
  const onIr = d.onIr ?? (() => {});
  const compact = !!d.compact;
  if (d.kind === "pos" && d.pos) {
    return (
      <CardPosicao
        pos={d.pos}
        saidas={d.saidas ?? []}
        entradas={d.entradas ?? []}
        anotacoes={d.anotacoes ?? []}
        nomePorSlug={d.nomePorSlug ?? {}}
        compact={compact}
        onClose={d.onClose}
        onIr={onIr}
      />
    );
  }
  if (d.kind === "trans" && d.trans) {
    return <CardTransicao t={d.trans} destino={d.destino ?? null} origem={d.origem ?? null} compact={compact} onClose={d.onClose} onIr={onIr} />;
  }
  return null;
}
