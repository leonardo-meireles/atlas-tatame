// Validadores de curadoria do grafo — funções PURAS sobre Grafo. Rodam no gerador
// (CI hook) e em testes. Objetivo: pegar buracos no atlas (órfãos, ilhas, hubs
// desconectados, naming em inglês, posições sem 3D) ANTES de ir pro ar.
//
// Convenção de nível: ERROR = quebra o build (não deveria existir no grafo público);
// WARN = ruído conhecido/legítimo (folhas, stubs, dados ainda crus do GrappleMap).

import type { Grafo, Posicao, Transicao } from "./types";
import { FAMILIAS, POLOS } from "./types";
import { CONCEITO_NOME } from "./grapplemap/concept-collapse";
import { TRANS_ALIAS } from "./figura/figura-data";
import { isPublicada } from "./figura/pose-meta";

export interface Issue {
  rule: string;
  slug?: string;
  level: "error" | "warn";
  msg: string;
}

/** Adjacência NÃO-direcionada (de↔para) — ignora folhas (para:null). */
function adjacenciaUndirected(g: Grafo): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  const add = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, new Set());
    adj.get(a)!.add(b);
  };
  for (const p of g.posicoes) if (!adj.has(p.slug)) adj.set(p.slug, new Set());
  for (const t of g.transicoes) {
    if (t.para == null) continue;
    add(t.de, t.para);
    add(t.para, t.de);
  }
  return adj;
}

/** BFS undirected a partir de uma raiz; retorna o conjunto alcançado. */
function bfs(adj: Map<string, Set<string>>, raiz: string, maxHops = Infinity): Set<string> {
  const visto = new Set<string>([raiz]);
  let fronteira = [raiz];
  let hops = 0;
  while (fronteira.length > 0 && hops < maxHops) {
    const prox: string[] = [];
    for (const n of fronteira) {
      for (const viz of adj.get(n) ?? []) {
        if (!visto.has(viz)) {
          visto.add(viz);
          prox.push(viz);
        }
      }
    }
    fronteira = prox;
    hops++;
  }
  return visto;
}

// ── 1. Órfãos ───────────────────────────────────────────────────────────────
/**
 * Toda posição idealmente tem ≥1 entrada E ≥1 saída. Folhas (só entrada ou só
 * saída) são legítimas em massa no GrappleMap → WARN. Um HUB (CONCEITO_NOME)
 * totalmente isolado (sem entrada nem saída) é bug de pipeline → ERROR.
 */
export function semOrfaos(g: Grafo): Issue[] {
  const issues: Issue[] = [];
  const temEntrada = new Set<string>();
  const temSaida = new Set<string>();
  for (const t of g.transicoes) {
    temSaida.add(t.de);
    if (t.para != null) temEntrada.add(t.para);
  }
  for (const p of g.posicoes) {
    const e = temEntrada.has(p.slug);
    const s = temSaida.has(p.slug);
    if (!e && !s) {
      const ehHub = !!CONCEITO_NOME[p.slug];
      issues.push({
        rule: "semOrfaos",
        slug: p.slug,
        level: ehHub ? "error" : "warn",
        msg: ehHub ? `Hub "${p.slug}" isolado (sem entrada nem saída)` : `Posição "${p.slug}" sem entrada nem saída`,
      });
    } else if (!e || !s) {
      issues.push({
        rule: "semOrfaos",
        slug: p.slug,
        level: "warn",
        msg: `Posição "${p.slug}" ${!e ? "sem entrada" : "sem saída"}`,
      });
    }
  }
  return issues;
}

// ── 2. Ilhas ─────────────────────────────────────────────────────────────────
/** BFS undirected a partir de guarda-fechada. Posições não alcançadas → WARN. */
export function semIlhas(g: Grafo): Issue[] {
  const raiz = "guarda-fechada";
  if (!g.posicoes.some((p) => p.slug === raiz)) return [];
  const adj = adjacenciaUndirected(g);
  const alcancado = bfs(adj, raiz);
  const ilhados = g.posicoes.filter((p) => !alcancado.has(p.slug));
  if (ilhados.length === 0) return [];
  return [
    {
      rule: "semIlhas",
      level: "warn",
      msg: `${ilhados.length} posição(ões) não alcançam guarda-fechada: ${ilhados.slice(0, 8).map((p) => p.slug).join(", ")}${ilhados.length > 8 ? "…" : ""}`,
    },
  ];
}

// ── 3. Hubs conectados ────────────────────────────────────────────────────────
/** Cada hub (CONCEITO_NOME) alcança ≥3 OUTROS hubs em ≤4 hops undirected. */
export function hubsConectados(g: Grafo): Issue[] {
  const issues: Issue[] = [];
  const adj = adjacenciaUndirected(g);
  const hubs = Object.keys(CONCEITO_NOME).filter((h) => g.posicoes.some((p) => p.slug === h));
  for (const h of hubs) {
    const alcancado = bfs(adj, h, 4);
    const outrosHubs = hubs.filter((o) => o !== h && alcancado.has(o));
    if (outrosHubs.length < 3) {
      issues.push({
        rule: "hubsConectados",
        slug: h,
        level: "warn",
        msg: `Hub "${h}" alcança só ${outrosHubs.length} outro(s) hub(s) em ≤4 hops`,
      });
    }
  }
  return issues;
}

// ── 4. Duplicação semântica ────────────────────────────────────────────────────
/** Par (nome, tipo, de) repetido em transições → WARN (lista os slugs). */
export function semDuplicacaoSemantica(g: Grafo): Issue[] {
  const grupos = new Map<string, Transicao[]>();
  for (const t of g.transicoes) {
    const k = `${t.nome}|${t.tipo}|${t.de}`;
    const arr = grupos.get(k) ?? [];
    arr.push(t);
    grupos.set(k, arr);
  }
  const issues: Issue[] = [];
  for (const [k, arr] of grupos) {
    if (arr.length > 1) {
      issues.push({
        rule: "semDuplicacaoSemantica",
        level: "warn",
        msg: `Transições duplicadas (${k}): ${arr.map((t) => t.slug).join(", ")}`,
      });
    }
  }
  return issues;
}

// ── 5. Saídas mínimas ───────────────────────────────────────────────────────────
/**
 * Posição publicada com saídas precisa de ≥1 saída ofensiva (finalizacao OU
 * raspagem OU ataque). Se só tiver perda-de-guarda → WARN (beco defensivo).
 */
export function saidasMinimas(g: Grafo): Issue[] {
  const issues: Issue[] = [];
  const saidasPorPos = new Map<string, Transicao[]>();
  for (const t of g.transicoes) {
    const arr = saidasPorPos.get(t.de) ?? [];
    arr.push(t);
    saidasPorPos.set(t.de, arr);
  }
  for (const p of g.posicoes) {
    if (!isPublicada(p.slug)) continue;
    const saidas = saidasPorPos.get(p.slug) ?? [];
    if (saidas.length === 0) continue; // folha pura: coberto por semOrfaos (warn)
    const temOfensiva = saidas.some(
      (t) => t.tipo === "finalizacao" || t.tipo === "raspagem" || t.tipo === "ataque",
    );
    if (!temOfensiva) {
      issues.push({
        rule: "saidasMinimas",
        slug: p.slug,
        level: "warn",
        msg: `Posição "${p.slug}" só tem saída de perda-de-guarda (sem finalização/raspagem/ataque)`,
      });
    }
  }
  return issues;
}

// ── 6. Tem 3D ────────────────────────────────────────────────────────────────
const TAP_STUB_RE = /__.+-tap__finalizacao$/;
/**
 * Toda posição precisa de pose 3D (slug ∈ manifest.poses) → senão ERROR.
 * Toda transição precisa de frames (manifest.trans OU alias curado OU tap-stub
 * com fallback de origem) → senão WARN.
 */
export function tem3D(g: Grafo, manifest?: { poses: string[]; trans: string[] }): Issue[] {
  if (!manifest) return [];
  const poseSet = new Set(manifest.poses);
  const transSet = new Set(manifest.trans);
  const aliasSet = new Set(Object.keys(TRANS_ALIAS));
  const issues: Issue[] = [];
  for (const p of g.posicoes) {
    if (!poseSet.has(p.slug)) {
      issues.push({ rule: "tem3D", slug: p.slug, level: "error", msg: `Posição "${p.slug}" sem pose 3D no manifesto` });
    }
  }
  for (const t of g.transicoes) {
    const ok = transSet.has(t.slug) || aliasSet.has(t.slug) || TAP_STUB_RE.test(t.slug);
    if (!ok) {
      issues.push({ rule: "tem3D", slug: t.slug, level: "warn", msg: `Transição "${t.slug}" sem frames 3D (nem alias nem stub)` });
    }
  }
  return issues;
}

// ── 7. Naming lint ────────────────────────────────────────────────────────────
const EN_BLOCKLIST = /\b(from|to|vs|with|w\/|outside|inside|the|of|and)\b/i;
const SLUG_RE = /^[a-z0-9-]+$/;
/** Nomes não devem ter palavras EN da blocklist; slugs devem ser kebab ASCII sem "--". */
export function namingLint(g: Grafo): Issue[] {
  const issues: Issue[] = [];
  const checa = (item: Posicao | Transicao, kind: string) => {
    if (EN_BLOCKLIST.test(item.nome)) {
      issues.push({ rule: "namingLint", slug: item.slug, level: "warn", msg: `${kind} "${item.slug}" tem palavra EN no nome: "${item.nome}"` });
    }
    if (!SLUG_RE.test(item.slug) || item.slug.includes("--")) {
      issues.push({ rule: "namingLint", slug: item.slug, level: "warn", msg: `${kind} slug fora do padrão kebab-ASCII: "${item.slug}"` });
    }
  };
  for (const p of g.posicoes) checa(p, "Posição");
  for (const t of g.transicoes) checa(t, "Transição");
  return issues;
}

// ── 8. Família coerente ──────────────────────────────────────────────────────
/** Posição com `familia` setada deve usar um valor conhecido (FAMILIAS). */
export function familiaCoerente(g: Grafo): Issue[] {
  const issues: Issue[] = [];
  const validas = new Set<string>(FAMILIAS);
  for (const p of g.posicoes) {
    if (p.familia != null && !validas.has(p.familia)) {
      issues.push({
        rule: "familiaCoerente",
        slug: p.slug,
        level: "warn",
        msg: `Posição "${p.slug}" tem família desconhecida: "${p.familia}"`,
      });
    }
  }
  return issues;
}

// ── 9. Polos coerentes ───────────────────────────────────────────────────────
/**
 * Polo deve ser válido (POLOS). Semântica do jogo:
 * - raspagem SAI de polo "baixo" (guardeiro vira o jogo) — sair de "cima" é incoerente.
 * - passagem CHEGA em polo "cima"/"neutro" (topo vence a guarda) — chegar em "baixo" é incoerente.
 */
export function polosCoerentes(g: Grafo): Issue[] {
  const issues: Issue[] = [];
  const validos = new Set<string>(POLOS);
  const poloPorSlug = new Map<string, string | undefined>(g.posicoes.map((p) => [p.slug, p.polo]));
  for (const p of g.posicoes) {
    if (p.polo != null && !validos.has(p.polo)) {
      issues.push({ rule: "polosCoerentes", slug: p.slug, level: "warn", msg: `Posição "${p.slug}" tem polo inválido: "${p.polo}"` });
    }
  }
  for (const t of g.transicoes) {
    const dePolo = poloPorSlug.get(t.de);
    const paraPolo = t.para != null ? poloPorSlug.get(t.para) : undefined;
    if (t.tipo === "raspagem" && dePolo === "cima") {
      issues.push({ rule: "polosCoerentes", slug: t.slug, level: "warn", msg: `Raspagem "${t.slug}" sai de polo "cima" (raspagem vira o jogo a partir de baixo)` });
    }
    if (t.tipo === "passagem" && paraPolo === "baixo") {
      issues.push({ rule: "polosCoerentes", slug: t.slug, level: "warn", msg: `Passagem "${t.slug}" chega em polo "baixo" (passagem deveria ganhar posição)` });
    }
  }
  return issues;
}

// ── 10. Status gate ──────────────────────────────────────────────────────────
/**
 * Conteúdo rascunho/diferido (isPublicada false) NÃO deveria VAZAR pro público — mas
 * pode existir nos DADOS de propósito (ex: cadeia de passagens diferida). O gate de
 * render (isPublicada nos consumidores) é quem esconde; aqui só WARN pra rastrear.
 */
export function statusGate(g: Grafo): Issue[] {
  const issues: Issue[] = [];
  for (const p of g.posicoes) {
    if (!isPublicada(p.slug)) {
      issues.push({ rule: "statusGate", slug: p.slug, level: "warn", msg: `Posição diferida/rascunho "${p.slug}" (escondida no render)` });
    }
  }
  for (const t of g.transicoes) {
    if (!isPublicada(t.slug)) {
      issues.push({ rule: "statusGate", slug: t.slug, level: "warn", msg: `Transição diferida/rascunho "${t.slug}" (escondida no render)` });
    }
  }
  return issues;
}

// ── 11. Setas ↔ anotações em sincronia ──────────────────────────────────────
import { ANOTACOES } from "@/content/anotacoes";

/**
 * Para cada posição com setas definidas em grafo.ts, verifica que ANOTACOES tem
 * uma entrada correspondente. Drift silencioso (seta sem texto ou texto sem seta)
 * produz callouts errados na UI → WARN.
 */
export function setasAnotacoesEmSincronia(g: Grafo): Issue[] {
  const issues: Issue[] = [];
  for (const p of g.posicoes) {
    const numSetas = p.setas?.length ?? 0;
    const numAnotacoes = ANOTACOES[p.slug]?.length ?? 0;
    if (numSetas === 0 && numAnotacoes === 0) continue;
    if (numSetas !== numAnotacoes) {
      issues.push({
        rule: "setasAnotacoesEmSincronia",
        slug: p.slug,
        level: "warn",
        msg: `"${p.slug}": ${numSetas} seta(s) mas ${numAnotacoes} anotação(ões) — sincronize grafo.ts e anotacoes.ts`,
      });
    }
  }
  return issues;
}

/** Roda todos os validadores e concatena. manifest opcional (tem3D só roda com ele). */
export function runAllValidators(g: Grafo, manifest?: { poses: string[]; trans: string[] }): Issue[] {
  return [
    ...semOrfaos(g),
    ...semIlhas(g),
    ...hubsConectados(g),
    ...semDuplicacaoSemantica(g),
    ...saidasMinimas(g),
    ...tem3D(g, manifest),
    ...namingLint(g),
    ...familiaCoerente(g),
    ...polosCoerentes(g),
    ...statusGate(g),
    ...setasAnotacoesEmSincronia(g),
  ];
}
