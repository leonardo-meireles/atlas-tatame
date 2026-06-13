"use client";

/**
 * /mapa-v2 — VISTA ALTERNATIVA do atlas, SEM nenhuma animação 3D.
 *
 * É o mesmo grafo de posições/técnicas (xyflow + localSubgraph + tipoMeta), mas o nó
 * expandido NÃO usa FiguraR3F/Canvas/WebGL. Em vez de crescer dentro da lona, a seleção
 * abre um PAINEL fixo à direita (desktop) / folha embaixo (mobile) com:
 *   still 2D (com ângulos) + vídeo gravado + passo a passo + saídas.
 *
 * Rota paralela — não substitui /mapa. Reusa toda a lógica pura existente
 * (filtro de publicação, subgrafo local, dedup de saídas, tipoMeta). Gera no SSG.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { ANOTACOES } from "@/content/anotacoes";
import { localSubgraph } from "@/lib/local-subgraph";
import { useGrafo, loadExtras } from "@/lib/graph-client";
import { dedupSaidas } from "@/lib/dedup-saidas";
import { isPublicada } from "@/lib/figura/pose-meta";
import { useIsMobile } from "@/lib/use-is-mobile";
import type { Grafo, Transicao } from "@/lib/types";
import { MapaCanvasV2 } from "./mapa-canvas-v2";
import { PainelNoV2, type NoV2Data } from "./painel-no-v2";

// Referências estáveis — evitam quebrar a igualdade dos useMemo a cada render.
const EMPTY_TRANS: Transicao[] = [];

/**
 * Filtro de ESCOPO no consumidor — IDÊNTICO ao /mapa. O atlas público mostra só
 * conteúdo CURADO (transição com passo a passo) das posições publicadas. Reversível.
 */
function filtraPublicado(grafo: Grafo): Grafo {
  const trans = grafo.transicoes.filter(
    (t) =>
      t.passos.length > 0 &&
      isPublicada(t.slug) &&
      isPublicada(t.de) &&
      (t.para === null || isPublicada(t.para)),
  );
  const usadas = new Set<string>();
  for (const t of trans) {
    usadas.add(t.de);
    if (t.para) usadas.add(t.para);
  }
  return {
    posicoes: grafo.posicoes.filter((p) => isPublicada(p.slug) && usadas.has(p.slug)),
    transicoes: trans,
  };
}

export function MapaV2Explorer() {
  const grafoRaw = useGrafo();
  const grafo = useMemo(() => filtraPublicado(grafoRaw), [grafoRaw]);
  useEffect(() => {
    void loadExtras();
  }, []);

  const raiz = grafo.posicoes.find((p) => p.raiz) ?? grafo.posicoes[0];
  // sel = nó aberto no painel ("" = nenhum). centro = onde a vista do grafo fica ancorada.
  const [sel, setSel] = useState<string>(raiz?.slug ?? "");
  const [centro, setCentro] = useState<string>(raiz?.slug ?? "");
  const mobile = useIsMobile();

  const escolher = useCallback(
    (slug: string) => {
      setSel(slug);
      const p = grafo.posicoes.find((x) => x.slug === slug);
      const t = grafo.transicoes.find((x) => x.slug === slug);
      setCentro(p?.slug ?? t?.de ?? slug);
    },
    [grafo],
  );
  const fechar = useCallback(() => setSel(""), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fechar]);

  const pos = grafo.posicoes.find((p) => p.slug === sel);
  const trans = grafo.transicoes.find((t) => t.slug === sel);
  const saidas = useMemo(
    () => (pos ? dedupSaidas(grafo.transicoes.filter((t) => t.de === pos.slug)) : EMPTY_TRANS),
    [grafo, pos],
  );
  const entradas = useMemo(
    () => (pos ? grafo.transicoes.filter((t) => t.para === pos.slug) : EMPTY_TRANS),
    [grafo, pos],
  );
  const destino = trans?.para
    ? (grafo.posicoes.find((p) => p.slug === trans.para) ?? null)
    : null;
  const origem = trans ? (grafo.posicoes.find((p) => p.slug === trans.de) ?? null) : null;

  const nomePorSlug = useMemo(
    () => Object.fromEntries(grafo.posicoes.map((p) => [p.slug, p.nome])),
    [grafo],
  );

  const dadosNo = useMemo<NoV2Data | undefined>(
    () =>
      pos
        ? { kind: "pos", pos, saidas, entradas, anotacoes: ANOTACOES[pos.slug] ?? [], nomePorSlug }
        : trans
          ? { kind: "trans", trans, destino, origem }
          : undefined,
    [pos, saidas, entradas, nomePorSlug, trans, destino, origem],
  );

  const vazio = grafo.posicoes.length === 0;

  // Vista local: mesma heurística do /mapa (radial, 1 hop, ~5 vizinhos, máx 4 trans/vizinho).
  const vista = useMemo(
    () => localSubgraph(grafo, centro || raiz?.slug || "", 1, 5, undefined, true, 4),
    [grafo, centro, raiz?.slug],
  );

  const painelAberto = !!dadosNo;

  return (
    <div className="relative flex h-full w-full overflow-hidden md:flex-row">
      {/* CANVAS do grafo — herói. No mobile o painel sobrepõe; no desktop divide a tela. */}
      <div className="relative min-h-0 min-w-0 flex-1">
        {vazio ? (
          <div className="tatame flex h-full w-full flex-col items-center justify-center gap-[var(--space-sm)] px-[var(--space-lg)] text-center text-[var(--on-mat-soft)]">
            <span
              className="h-[10px] w-[10px] animate-pulse rounded-full"
              style={{ background: "var(--grau-on-mat)" }}
              aria-hidden
            />
            <p className="font-display text-[length:var(--step-0h)] font-bold text-[var(--on-mat)]">
              Montando o mapa…
            </p>
            <p className="max-w-[34ch] text-[length:var(--step-xs)] leading-snug">
              Carregando as posições da guarda. Se nada aparecer, ainda não há conteúdo publicado.
            </p>
          </div>
        ) : (
          <MapaCanvasV2 grafo={vista} selectedId={sel} onNodeClick={escolher} />
        )}
      </div>

      {/* PAINEL do nó — 2D puro (still + vídeo + passos + saídas). Sem 3D. */}
      <PainelNoV2
        dados={dadosNo}
        aberto={painelAberto}
        mobile={mobile}
        onIr={escolher}
        onClose={fechar}
      />

      {/* Backdrop mobile — clica fora do painel pra fechar. */}
      {mobile && painelAberto && (
        <button
          aria-label="Fechar painel"
          onClick={fechar}
          className="absolute inset-0 z-20 bg-[oklch(0_0_0/0.45)] md:hidden"
        />
      )}
    </div>
  );
}
