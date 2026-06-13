"use client";

/**
 * Painel do nó no /mapa-v2 — a vista 2D pura. Abre à direita (desktop) ou como folha
 * embaixo (mobile) quando um nó é selecionado no grafo. Mostra, SEM nenhuma animação 3D:
 *   POSIÇÃO  → still 2D (com ângulos) + pontos-chave + "daqui você pode" + "chega aqui por"
 *   TÉCNICA  → still 2D do destino + passo a passo + vídeo gravado + "leva a"
 *
 * Reusa Still, SetasOverlay/Legenda, VideoEmbed, tipoMeta, callouts, badges. Nenhum
 * import de figura-r3f / Canvas / three. Acento latão (--grau) só pra ênfase de 2º nível.
 */
import { useState, type CSSProperties } from "react";
import type { Posicao, Transicao, Video } from "@/lib/types";
import type { Anotacao, TipoAnotacao } from "@/content/anotacoes";
import { tipoMeta } from "@/lib/tipo";
import { nomeLegivel } from "@/lib/dedup-saidas";
import { limpaNome } from "@/lib/nome";
import { buildCallouts } from "@/lib/callouts";
import { Still } from "./still";
import { VideoEmbed } from "./video-embed";
import { SetasLegenda, COR_SETA } from "./setas-overlay";
import { TipoBadge, LockBadge } from "./badges";

/** Dados do nó selecionado injetados no painel. */
export type NoV2Data =
  | {
      kind: "pos";
      pos: Posicao;
      saidas: Transicao[];
      entradas: Transicao[];
      anotacoes: Anotacao[];
      nomePorSlug: Record<string, string>;
    }
  | {
      kind: "trans";
      trans: Transicao;
      destino: Posicao | null;
      origem: Posicao | null;
    };

const COR_ANOTACAO: Record<TipoAnotacao, string> = {
  junta: "var(--raspagem)",
  pressao: "var(--finalizacao)",
  pegada: "var(--clay)",
  controle: "var(--perda)",
};

const SECAO = "text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]";

/** Regra de ouro — 1º princípio em destaque latão (--grau), ênfase de 2º nível (não marca). */
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

/** Still 2D com troca de ângulo — várias perspectivas da MESMA posição, sem 3D ao vivo. */
function FiguraComAngulos({
  nome,
  indice,
  imagem,
  views,
  setas,
  ativo,
  onHover,
}: {
  nome: string;
  indice?: string;
  imagem?: string;
  views?: { angulo: string; src: string }[];
  setas?: Posicao["setas"];
  ativo: number | null;
  onHover: (n: number | null) => void;
}) {
  const [angulo, setAngulo] = useState(0);
  // Reseta o ângulo ao trocar de figura (chave nome|imagem muda) — sem setState-em-efeito.
  // Padrão "previous value durante o render": ajusta no próprio render quando a chave muda.
  const chave = `${nome}|${imagem ?? ""}`;
  const [chaveAnterior, setChaveAnterior] = useState(chave);
  if (chave !== chaveAnterior) {
    setChaveAnterior(chave);
    setAngulo(0);
  }
  const temViews = !!views && views.length > 0;
  // No ângulo 0 usa a imagem principal (com setas/callouts). Outros ângulos = views cruas.
  const src = angulo === 0 ? imagem ?? views?.[0]?.src : views?.[angulo]?.src;
  const mostrarSetas = angulo === 0;
  return (
    <div className="flex flex-col gap-[var(--space-sm)]">
      <Still
        nome={nome}
        src={src}
        setas={mostrarSetas ? setas : undefined}
        activeN={mostrarSetas ? ativo : null}
        onHoverCallout={mostrarSetas ? onHover : undefined}
        indice={indice}
      />
      {temViews && (
        <div className="flex flex-wrap gap-[6px]" role="group" aria-label="Trocar o ângulo da figura">
          {views!.map((v, i) => {
            const on = i === angulo;
            return (
              <button
                key={v.angulo}
                onClick={() => setAngulo(i)}
                aria-pressed={on}
                className="rounded-full border px-[var(--space-sm)] py-[3px] text-[length:var(--step-3xs)] font-semibold uppercase tracking-[0.1em] transition-colors"
                style={{
                  borderColor: on ? "var(--grau)" : "var(--paper-edge)",
                  background: on ? "var(--grau-tint)" : "var(--paper-2)",
                  color: on ? "var(--grau-deep)" : "var(--ink-soft)",
                }}
              >
                {v.angulo}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Quem é quem na figura — a cor distingue por cima / por baixo. */
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

function VideoSlot({ video }: { video?: Video }) {
  if (video) return <VideoEmbed video={video} compact />;
  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[10px] border bg-[var(--paper-2)]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, var(--paper-edge) 0 1px, transparent 1px 9px)" }}
      />
      <div className="relative flex flex-col items-center gap-[var(--space-xs)] px-[var(--space-md)] text-center text-[var(--ink-faint)]">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--ink-faint)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.12em]">Vídeo gravado a caminho</span>
        <span className="text-[length:var(--step-3xs)] tracking-[0.04em]">por ora, siga o passo a passo e a figura</span>
      </div>
    </div>
  );
}

/** Lista numerada de pontos-chave, casada com os marcadores da figura (hover compartilhado). */
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

function CorpoPosicao({
  pos,
  saidas,
  entradas,
  anotacoes,
  nomePorSlug,
  onIr,
}: {
  pos: Posicao;
  saidas: Transicao[];
  entradas: Transicao[];
  anotacoes: Anotacao[];
  nomePorSlug: Record<string, string>;
  onIr: (s: string) => void;
}) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const temCallouts = (pos.setas?.length ?? 0) > 0;
  return (
    <>
      <FiguraComAngulos
        nome={pos.nome}
        indice={pos.raiz ? "Lâmina 01" : "Lâmina"}
        imagem={pos.imagem}
        views={pos.views}
        setas={pos.setas}
        ativo={ativo}
        onHover={setAtivo}
      />
      <div className="mt-[var(--space-sm)] flex flex-col gap-[var(--space-2xs)]">
        {pos.imagem && <QuemEhQuem />}
        {temCallouts && <SetasLegenda setas={pos.setas!} />}
      </div>

      <p className="mt-[var(--space-md)] text-[length:var(--step-0s)] leading-relaxed text-[var(--ink-soft)]">{pos.resumo}</p>

      {pos.principios.length > 0 && <div className="mt-[var(--space-md)]"><RegraDeOuro texto={pos.principios[0]} /></div>}

      {temCallouts ? (
        <section className="mt-[var(--space-md)]">
          <h3 className={SECAO}>Pontos-chave</h3>
          <PontosNumerados setas={pos.setas!} ativo={ativo} onHover={setAtivo} />
        </section>
      ) : anotacoes.length > 0 ? (
        <section className="mt-[var(--space-md)]">
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
                  className="saida-row group flex items-center gap-[var(--space-sm)] rounded-[8px] border-b border-[var(--paper-edge)] px-[var(--space-xs)] py-[var(--space-sm)] text-left transition-colors duration-200 last:border-b-0 hover:bg-[var(--paper)] focus-visible:outline-offset-[-2px]"
                >
                  <span className="h-[9px] w-[9px] shrink-0 rounded-full transition-transform duration-200 group-hover:scale-[1.4]" style={{ background: m.cor }} />
                  <span className="flex-1 font-display text-[length:var(--step-0h)] font-semibold leading-tight text-[var(--ink)]">
                    {nomeLegivel(t, t.para ? nomePorSlug[t.para] : undefined)}
                  </span>
                  {t.acesso === "paid" && <LockBadge />}
                  <span className="text-[length:var(--step-0)] text-[var(--ink-faint)] transition-transform duration-200 group-hover:translate-x-[3px] group-hover:text-[var(--clay)]">→</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {entradas.length > 0 && (
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
    </>
  );
}

function CorpoTransicao({
  t,
  destino,
  origem,
  onIr,
}: {
  t: Transicao;
  destino: Posicao | null;
  origem: Posicao | null;
  onIr: (s: string) => void;
}) {
  const m = tipoMeta(t.tipo);
  // Still 2D do DESTINO (pra onde a técnica leva) ou da origem se for folha (finalização).
  const figPos = destino ?? origem;
  return (
    <>
      <FiguraComAngulos
        nome={figPos?.nome ?? t.nome}
        indice="Posição-alvo"
        imagem={figPos?.imagem ?? t.imagem}
        views={figPos?.views}
        setas={undefined}
        ativo={null}
        onHover={() => {}}
      />
      <div className="mt-[var(--space-sm)] flex flex-wrap items-center gap-[var(--space-xs)]">
        <TipoBadge tipo={t.tipo} />
        {t.qualidade === "detalhada" && (
          <span
            className="rounded-full border border-[var(--paper-edge)] bg-[var(--paper-2)] px-[8px] py-[2px] text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.1em] text-[var(--ink-soft)]"
            title="Transição autoral do GrappleMap"
          >
            Demo curada
          </span>
        )}
        {t.bidirectional && (
          <span className="text-[length:var(--step-3xs)] uppercase tracking-[0.1em] text-[var(--ink-faint)]">↔ reversível</span>
        )}
        <span className="text-[length:var(--step-2xs)] text-[var(--ink-faint)]">{m.sentido}</span>
      </div>

      {origem && (
        <div className="mt-[var(--space-md)] border-b pb-[var(--space-sm)]">
          <ChegaPor rotulo="vem de" nome={origem.nome} cor={m.cor} onClick={() => onIr(origem.slug)} />
        </div>
      )}

      <section className="mt-[var(--space-md)]">
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
    </>
  );
}

export function PainelNoV2({
  dados,
  aberto,
  mobile,
  onIr,
  onClose,
}: {
  dados?: NoV2Data;
  aberto: boolean;
  mobile: boolean;
  onIr: (slug: string) => void;
  onClose: () => void;
}) {
  // Cabeçalho: rótulo + cor + título conforme o tipo do nó.
  const header = dados
    ? dados.kind === "pos"
      ? {
          rotulo: dados.pos.raiz ? "Você está aqui" : "Posição",
          cor: dados.pos.raiz ? "var(--clay)" : "var(--ink-soft)",
          titulo: dados.pos.nome,
          pago: false,
        }
      : {
          rotulo: tipoMeta(dados.trans.tipo).rotulo,
          cor: tipoMeta(dados.trans.tipo).cor,
          titulo: nomeLegivel(dados.trans, dados.destino?.nome),
          pago: dados.trans.acesso === "paid",
        }
    : undefined;

  return (
    <aside
      aria-label="Detalhe do nó"
      aria-hidden={!aberto}
      inert={!aberto}
      className="absolute inset-y-0 right-0 z-30 flex w-[clamp(320px,92vw,440px)] shrink-0 flex-col border-l border-[var(--paper-edge)] bg-[var(--paper)] text-[var(--ink)] shadow-[-18px_0_48px_-28px_oklch(0_0_0/0.6)] transition-transform duration-300 ease-out md:relative md:w-[clamp(360px,38vw,460px)] md:shadow-none"
      style={{ transform: aberto ? undefined : "translateX(100%)" }}
    >
      {header && dados ? (
        <>
          <header className="flex items-center gap-[var(--space-sm)] border-b border-[var(--paper-edge)] px-[var(--space-lg)] py-[var(--space-md)]">
            <span className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: header.cor }} />
            <span className="text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.16em]" style={{ color: header.cor }}>
              {header.rotulo}
            </span>
            <h2 className="ml-[var(--space-xs)] flex-1 truncate font-display text-[length:var(--step-1)] font-bold leading-tight text-[var(--ink)]">
              {limpaNome(header.titulo)}
            </h2>
            {header.pago && <LockBadge />}
            <button
              onClick={onClose}
              aria-label="Fechar painel"
              className="-mr-[var(--space-xs)] ml-[var(--space-xs)] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--ink-faint)] transition-colors hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-[var(--space-lg)]">
            {dados.kind === "pos" ? (
              <CorpoPosicao
                pos={dados.pos}
                saidas={dados.saidas}
                entradas={dados.entradas}
                anotacoes={dados.anotacoes}
                nomePorSlug={dados.nomePorSlug}
                onIr={onIr}
              />
            ) : (
              <CorpoTransicao t={dados.trans} destino={dados.destino} origem={dados.origem} onIr={onIr} />
            )}
          </div>
        </>
      ) : (
        // Estado vazio (desktop, painel sempre montado): convida a tocar num nó.
        !mobile && (
          <div className="flex h-full flex-col items-center justify-center gap-[var(--space-sm)] px-[var(--space-lg)] text-center text-[var(--ink-faint)]">
            <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--paper-edge)] text-grau">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 11V6a2 2 0 0 1 4 0v5" />
                <path d="M13 9a2 2 0 0 1 4 0v3a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.5-2l-2.2-2.6a1.6 1.6 0 0 1 2.4-2.1l1.3 1.2" />
              </svg>
            </span>
            <p className="font-display text-[length:var(--step-0h)] font-bold text-[var(--ink)]">Toque num card do mapa</p>
            <p className="max-w-[30ch] text-[length:var(--step-xs)] leading-snug">
              A posição ou técnica abre aqui — figura, passo a passo e pra onde ela leva.
            </p>
          </div>
        )
      )}
    </aside>
  );
}
