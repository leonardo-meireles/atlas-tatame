"use client";

import type { Grafo } from "@/lib/types";
import { nomeLegivel } from "@/lib/dedup-saidas";
import { TRILHA_FAIXA_BRANCA, passosValidos } from "@/content/trilhas";

/**
 * Trilha guiada do iniciante no índice do mapa. Lista numerada de fundamentos na ordem
 * de aprendizado; clicar salta pro nó. Sobrepõe-se à exploração livre — não a tranca.
 * Versão GTM-mínima: sem route-highlight no grafo, sem progresso (vem depois).
 */
export function TrilhaFaixaBranca({
  grafo,
  atual,
  onIr,
}: {
  grafo: Grafo;
  /** slug do nó em foco — destaca o passo atual da trilha. */
  atual: string;
  onIr: (slug: string) => void;
}) {
  const posPorSlug = new Map(grafo.posicoes.map((p) => [p.slug, p]));
  const transPorSlug = new Map(grafo.transicoes.map((t) => [t.slug, t]));
  const passos = passosValidos(TRILHA_FAIXA_BRANCA, grafo);
  if (passos.length === 0) return null;
  // Posição do nó em foco dentro da trilha (1-based); 0 = foco fora da trilha.
  const indiceAtual = passos.indexOf(atual) + 1;
  const rotuloProgresso =
    indiceAtual > 0 ? `passo ${indiceAtual} de ${passos.length}` : `${passos.length} passos`;

  function nomeDe(slug: string): string {
    const p = posPorSlug.get(slug);
    if (p) return p.nome;
    const t = transPorSlug.get(slug);
    if (t) return nomeLegivel(t, t.para ? posPorSlug.get(t.para)?.nome : undefined);
    return slug;
  }

  return (
    <div className="mb-[var(--space-md)]">
      <div className="flex items-baseline justify-between gap-[var(--space-xs)] px-[var(--space-xs)] pb-[2px]">
        <span className="text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.16em] text-[var(--on-mat-soft)]">
          {TRILHA_FAIXA_BRANCA.titulo}
        </span>
        <span className="shrink-0 text-[length:var(--step-4xs)] font-semibold tabular-nums tracking-[0.04em] text-[var(--clay-on-mat)]">
          {rotuloProgresso}
        </span>
      </div>
      <div className="px-[var(--space-xs)] pb-[8px] text-[length:var(--step-3xs)] leading-snug text-[var(--on-mat-soft)]">
        {TRILHA_FAIXA_BRANCA.resumo}
      </div>
      <ol className="flex flex-col gap-[1px]">
        {passos.map((slug, i) => {
          const on = slug === atual;
          return (
            <li key={slug}>
              <button
                onClick={() => onIr(slug)}
                aria-current={on ? "true" : undefined}
                className="group flex w-full items-center gap-[8px] rounded-[7px] px-[var(--space-xs)] py-[6px] text-left transition-colors"
                style={{ background: on ? "color-mix(in oklch, var(--clay) 22%, transparent)" : "transparent" }}
              >
                <span
                  className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[length:var(--step-3xs)] font-bold tabular-nums"
                  style={{
                    background: on ? "var(--clay-on-mat)" : "color-mix(in oklch, var(--on-mat) 12%, transparent)",
                    color: on ? "var(--mat)" : "var(--on-mat-soft)",
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="truncate text-[length:var(--step-xs)] font-medium transition-colors"
                  style={{ color: on ? "var(--on-mat)" : "var(--on-mat-soft)" }}
                >
                  {nomeDe(slug)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
