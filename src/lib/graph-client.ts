"use client";

import { useSyncExternalStore } from "react";
import { grafo as grafoBase } from "@/content/grafo";
import { grafoGMCore } from "@/content/grafo-gm-core.generated";
import type { Grafo, Posicao, Transicao } from "./types";

// CLIENT-SAFE. Importa SÓ core estaticamente. Extras lazy-fetched via /grafo/extras.json.
// Reactive store: useGrafo() re-renderiza quando extras chega + merge.

function merge(...grafos: Grafo[]): Grafo {
  const posSlugs = new Set<string>();
  const transSlugs = new Set<string>();
  const posicoes: Posicao[] = [];
  const transicoes: Transicao[] = [];
  for (const g of grafos) {
    for (const p of g.posicoes) {
      if (!posSlugs.has(p.slug)) {
        posSlugs.add(p.slug);
        posicoes.push(p);
      }
    }
    for (const t of g.transicoes) {
      if (!transSlugs.has(t.slug)) {
        transSlugs.add(t.slug);
        transicoes.push(t);
      }
    }
  }
  return { posicoes, transicoes };
}

let estado: Grafo = merge(grafoBase, grafoGMCore);
const listeners = new Set<() => void>();
let extrasPromise: Promise<void> | null = null;

function notify() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot(): Grafo {
  return estado;
}

/** SSR: igual ao snapshot inicial (core+base). Sem React hidratação flicker. */
function getServerSnapshot(): Grafo {
  return estado;
}

/**
 * Lazy-fetch dos extras. Idempotente — múltiplas chamadas reusam a mesma Promise.
 * Após arrived, merge no estado e notifica listeners.
 */
export function loadExtras(): Promise<void> {
  if (extrasPromise) return extrasPromise;
  extrasPromise = fetch("/grafo/extras.json")
    .then((r) => {
      if (!r.ok) throw new Error(`extras fetch falhou: ${r.status}`);
      return r.json();
    })
    .then((extras: Grafo) => {
      estado = merge(estado, extras);
      notify();
    })
    .catch((e) => {
      console.error("[graph-client] loadExtras erro:", e);
      extrasPromise = null;
    });
  return extrasPromise;
}

/** Hook React — assina o store. Re-renderiza quando extras chegar. */
export function useGrafo(): Grafo {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
