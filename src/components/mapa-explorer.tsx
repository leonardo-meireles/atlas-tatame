"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ANOTACOES } from "@/content/anotacoes";
import { localSubgraph } from "@/lib/local-subgraph";
import { useGrafo, loadExtras } from "@/lib/graph-client";
import { dedupSaidas } from "@/lib/dedup-saidas";
import { getPublishedGraph } from "@/lib/published-graph";
import { tipoMeta } from "@/lib/tipo";
import { useIsMobile } from "@/lib/use-is-mobile";
import type { Transicao } from "@/lib/types";

// Referências estáveis — evitam quebrar a igualdade dos useMemo a cada render.
const EMPTY_SET: Set<string> = new Set();
const EMPTY_TRANS: Transicao[] = [];
import { Mapa } from "./mapa";
import { MapaSidebar } from "./mapa-sidebar";
import { OnboardingMapa } from "./onboarding-mapa";
import { type ExpData } from "./node-expandido";

export function MapaExplorer() {
  const grafoRaw = useGrafo();
  const grafo = useMemo(() => getPublishedGraph(grafoRaw), [grafoRaw]);
  // Dispara fetch dos extras assim que monta — usuário ainda lê o foco enquanto chega.
  useEffect(() => { void loadExtras(); }, []);
  const raiz = grafo.posicoes.find((p) => p.raiz) ?? grafo.posicoes[0];
  // sel = nó expandido ("" = nenhum). centro = onde a vista fica ancorada (não pula ao fechar).
  const [sel, setSel] = useState<string>(raiz?.slug ?? "");
  const [centro, setCentro] = useState<string>(raiz?.slug ?? "");
  // Drawer mobile: padrão fechado em telas estreitas, sempre aberto em desktop (CSS gate).
  const mobile = useIsMobile();
  const [sidebarAberta, setSidebarAberta] = useState(true);
  // Ao entrar na faixa mobile, o índice começa fechado (drawer) pra não cobrir o mapa.
  useEffect(() => {
    if (mobile) setSidebarAberta(false);
  }, [mobile]);
  // Onboarding visível → suprime o MapHint transitório, pra não empilhar dois coach-marks
  // (pill no topo + card embaixo) no primeiro acesso mobile.
  const [onboardingVisivel, setOnboardingVisivel] = useState(false);

  // Selecionar um nó (no mapa ou dentro do card) expande-o e ancora a vista nele.
  // No mobile, fecha a sidebar (drawer) pra não cobrir o mapa após a escolha.
  const escolher = useCallback(
    (slug: string) => {
      setSel(slug);
      const p = grafo.posicoes.find((x) => x.slug === slug);
      const t = grafo.transicoes.find((x) => x.slug === slug);
      setCentro(p?.slug ?? t?.de ?? slug);
      if (mobile) setSidebarAberta(false);
    },
    [grafo, mobile],
  );
  // Fechar: colapsa o card (clicar fora, X ou Esc). Vista permanece no mesmo lugar.
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

  // Mapa slug→nome de display — resolve "Transição sem Nome" via destino legível.
  const nomePorSlug = useMemo(
    () => Object.fromEntries(grafo.posicoes.map((p) => [p.slug, p.nome])),
    [grafo],
  );

  // Conteúdo rico do nó selecionado — memoizado: identidade estável evita rebuild do
  // React Flow (nodes useMemo do <Mapa>) a cada render do explorer (toggle sidebar etc.).
  const expandedData = useMemo<ExpData | undefined>(
    () =>
      pos
        ? { kind: "pos", pos, saidas, entradas, anotacoes: ANOTACOES[pos.slug] ?? [], nomePorSlug }
        : trans
          ? { kind: "trans", trans, destino, origem }
          : undefined,
    [pos, saidas, entradas, nomePorSlug, trans, destino, origem],
  );

  // Grafo vazio: extras ainda carregando OU nada publicado. Nunca um vazio preto sem texto.
  const vazio = grafo.posicoes.length === 0;

  // Vista local: radial, foco + ~5 vizinhos diretos, MAX 4 transições por vizinho.
  // Mata cross-edges entre neighbors (concept hubs criam 50+ arestas spaghetti) +
  // limita densidade visual. Memoizado: localSubgraph não é O(1) — sem memo recalcula
  // o subgrafo em todo render (incl. toggles de sidebar/onboarding). EMPTY_SET estável.
  const vista = useMemo(
    () => localSubgraph(grafo, centro || raiz?.slug || "", 1, 5, EMPTY_SET, true, 4),
    [grafo, centro, raiz?.slug],
  );

  // "Você está aqui": o nó em foco (posição ou transição) pro índice/sidebar.
  const foco = sel || centro || raiz?.slug || "";
  const focoPos = grafo.posicoes.find((p) => p.slug === foco);
  const focoTrans = grafo.transicoes.find((t) => t.slug === foco);
  const ondeEstou = focoPos
    ? { nome: focoPos.nome, tipo: "Posição", cor: focoPos.raiz ? "var(--clay-on-mat)" : "var(--on-mat-soft)" }
    : focoTrans
      ? { nome: focoTrans.nome, tipo: tipoMeta(focoTrans.tipo).rotulo, cor: tipoMeta(focoTrans.tipo).corOnMat }
      : undefined;
  // Marco ativo no índice = a posição em foco (ou a origem da transição em foco).
  const marcoAtivo = focoPos?.slug ?? focoTrans?.de ?? "";

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <MapaSidebar
        grafo={grafo}
        atual={marcoAtivo}
        ondeEstou={ondeEstou}
        onIr={escolher}
        mobileAberto={mobile ? sidebarAberta : true}
      />
      {/* Backdrop mobile — clica fora pra fechar o drawer. */}
      {mobile && sidebarAberta && (
        <button
          aria-label="Fechar índice"
          onClick={() => setSidebarAberta(false)}
          className="absolute inset-0 z-20 bg-[oklch(0_0_0/0.45)] md:hidden"
        />
      )}
      <div className="relative min-w-0 flex-1">
        {/* Toggle do índice — UM só botão, persistente no mobile em ambos os estados.
            Alterna sidebarAberta; aria-expanded reflete o estado real e aria-label troca
            "Abrir índice"/"Fechar índice"; ícone vira X quando aberto. Fica acima do drawer
            (z-40 > aside z-30) pra ser tocável e descoberto quando o índice está aberto —
            o backdrop deixa de ser a única forma de fechar. */}
        {mobile && (
          <button
            onClick={() => setSidebarAberta((v) => !v)}
            aria-label={sidebarAberta ? "Fechar índice" : "Abrir índice"}
            aria-expanded={sidebarAberta}
            aria-controls="mapa-indice"
            className="absolute left-3 top-3 z-40 flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--mat-line)] bg-[var(--mat-2)] text-[var(--on-mat)] shadow-lg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              {sidebarAberta ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        )}
        {vazio ? (
          // Placeholder honesto na lona — nunca um vazio preto. Cobre "carregando" e "nada publicado".
          <div className="tatame flex h-full w-full flex-col items-center justify-center gap-[var(--space-sm)] px-[var(--space-lg)] text-center text-[var(--on-mat-soft)]">
            <span
              className="h-[10px] w-[10px] animate-pulse rounded-full"
              style={{ background: "var(--clay-on-mat)" }}
              aria-hidden
            />
            <p className="font-display text-[length:var(--step-0h)] font-bold text-[var(--on-mat)]">Montando o mapa…</p>
            <p className="max-w-[34ch] text-[length:var(--step-xs)] leading-snug">
              Carregando as posições da guarda. Se nada aparecer, ainda não há conteúdo publicado por aqui.
            </p>
          </div>
        ) : (
          <Mapa
            grafo={vista}
            fill
            selectedId={sel}
            expandedData={expandedData}
            onNodeClick={escolher}
            onIr={escolher}
            onClose={fechar}
            suppressHint={onboardingVisivel}
          />
        )}
        {/* Dica de primeiro acesso — só quando nenhum nó está expandido, pra não cobrir o painel. */}
        {!sel && !vazio && <OnboardingMapa onVisivel={setOnboardingVisivel} />}
      </div>
    </div>
  );
}
