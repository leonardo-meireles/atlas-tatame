"use client";

import { useMemo, useState } from "react";
import {
  type TermoGlossario,
  type TipoTermo,
  ROTULO_TIPO,
  ORDEM_TIPOS,
} from "@/lib/glossario";

/** Normaliza pra busca: minúsculo, sem acento. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function GlossarioLista({ termos }: { termos: TermoGlossario[] }) {
  const [q, setQ] = useState("");

  const grupos = useMemo(() => {
    const alvo = norm(q.trim());
    const filtrados = alvo
      ? termos.filter(
          (t) =>
            norm(t.nomePt).includes(alvo) ||
            norm(t.nomeEn).includes(alvo) ||
            norm(t.definicaoPt).includes(alvo),
        )
      : termos;
    return ORDEM_TIPOS.map((tipo) => ({
      tipo,
      itens: filtrados.filter((t) => t.tipo === tipo),
    })).filter((g) => g.itens.length > 0);
  }, [q, termos]);

  const total = grupos.reduce((n, g) => n + g.itens.length, 0);

  return (
    <div>
      {/* Busca — sticky, recuada na superfície de well (--paper-sunk). */}
      <div className="sticky top-[64px] z-10 -mx-[var(--space-md)] mb-[var(--space-xl)] bg-[var(--paper)] px-[var(--space-md)] py-[var(--space-sm)]">
        <label className="flex items-center gap-[var(--space-sm)] rounded-[10px] border border-[var(--paper-edge)] bg-[var(--paper-sunk)] px-[var(--space-md)] py-[var(--space-sm)] focus-within:border-grau">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar termo… (raspagem, armlock, berimbolo)"
            aria-label="Buscar termo no glossário"
            className="min-w-0 flex-1 bg-transparent text-[length:var(--step-0)] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
          />
          <span className="shrink-0 text-[length:var(--step-3xs)] tabular-nums text-[var(--ink-faint)]">
            {total}
          </span>
        </label>
      </div>

      {grupos.length === 0 ? (
        <p className="py-[var(--space-2xl)] text-center text-[length:var(--step-0)] text-[var(--ink-soft)]">
          Nenhum termo pra “{q}”. Tenta o nome em português ou inglês.
        </p>
      ) : (
        <div className="flex flex-col gap-[var(--space-2xl)]">
          {grupos.map(({ tipo, itens }) => (
            <Secao key={tipo} tipo={tipo} itens={itens} />
          ))}
        </div>
      )}
    </div>
  );
}

function Secao({ tipo, itens }: { tipo: TipoTermo; itens: TermoGlossario[] }) {
  return (
    <section aria-label={ROTULO_TIPO[tipo]}>
      <div className="mb-[var(--space-md)] flex items-baseline gap-[var(--space-sm)] border-b border-[var(--paper-edge)] pb-[var(--space-xs)]">
        <h2 className="text-[length:var(--step-3xs)] font-semibold uppercase tracking-[0.16em] text-grau-deep">
          {ROTULO_TIPO[tipo]}
        </h2>
        <span className="text-[length:var(--step-3xs)] tabular-nums text-[var(--ink-faint)]">{itens.length}</span>
      </div>
      <dl className="flex flex-col">
        {itens.map((t) => (
          <div key={t.slug} className="border-b border-[var(--paper-edge)]/60 py-[var(--space-md)] last:border-b-0">
            <dt className="flex flex-wrap items-baseline gap-x-[var(--space-sm)] gap-y-[2px]">
              <span className="font-display text-[length:var(--step-0t)] font-bold text-[var(--ink)]">
                {t.nomePt}
              </span>
              {t.nomeEn && t.nomeEn !== t.nomePt && (
                <span className="text-[length:var(--step-xs)] text-[var(--ink-faint)]">{t.nomeEn}</span>
              )}
            </dt>
            <dd className="mt-[var(--space-2xs)] max-w-[68ch] text-[length:var(--step-0)] leading-relaxed text-[var(--ink-soft)]">
              {t.definicaoPt}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
