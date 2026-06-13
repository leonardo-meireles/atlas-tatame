import { tipoMeta, TIPOS_ORDENADOS } from "@/lib/tipo";
import { nomeLegivel } from "@/lib/dedup-saidas";
import { ordenarPorDificuldade } from "@/lib/dificuldade";
import type { Transicao } from "@/lib/types";
import { DificuldadeBadge, LockBadge } from "./badges";

/** Uma linha do índice de transições. <details> nativo = revelação sem JS. */
function TransicaoItem({ t, n, paraNome }: { t: Transicao; n: number; paraNome?: string }) {
  const m = tipoMeta(t.tipo);
  const pago = t.acesso === "paid";
  return (
    <details className="group border-b last:border-b-0 [&_.passos]:no-copy">
      <summary className="flex cursor-pointer list-none items-center gap-[var(--space-md)] py-[var(--space-md)] outline-none transition-colors hover:bg-[var(--paper-2)] focus-visible:bg-[var(--paper-2)]">
        <span
          className="w-8 shrink-0 text-right font-display text-[length:var(--step-0h)] font-bold tabular-nums"
          style={{ color: m.cor }}
        >
          {String(n).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-[var(--space-sm)] gap-y-[2px]">
            <span className="font-display text-[length:var(--step-0h)] font-semibold tracking-[-0.01em] text-[var(--ink)]">
              {nomeLegivel(t, paraNome)}
            </span>
            {t.dificuldade && <DificuldadeBadge dificuldade={t.dificuldade} />}
            {pago && <LockBadge />}
          </span>
          <span className="mt-[2px] block text-[length:var(--step-xs)] text-[var(--ink-soft)]">
            {m.sentido}
          </span>
        </span>
        <svg
          className="shrink-0 text-[var(--ink-faint)] transition-transform duration-200 group-open:rotate-90"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <ol className="passos mb-[var(--space-md)] ml-[calc(2rem+var(--space-md))] flex flex-col gap-[var(--space-xs)] pr-[var(--space-md)]">
        {t.passos.map((passo, i) => (
          <li key={i} className="flex gap-[var(--space-sm)] text-[length:var(--step-0s)] leading-relaxed text-[var(--ink-soft)]">
            <span className="select-none font-semibold text-[var(--ink-faint)]">{i + 1}.</span>
            <span>{passo}</span>
          </li>
        ))}
      </ol>
    </details>
  );
}

/** Agrupa transições por tipo, na ordem canônica, cada grupo com seu cabeçalho. */
export function TransicaoIndice({
  transicoes,
  nomePorSlug,
}: {
  transicoes: Transicao[];
  /** slug→nome de display, pra resolver "Transição sem Nome" pelo destino. */
  nomePorSlug?: Record<string, string>;
}) {
  const grupos = TIPOS_ORDENADOS.map((tipo) => ({
    tipo,
    // Dentro de cada tipo, mais fácil primeiro — orienta a ordem de aprendizado.
    itens: ordenarPorDificuldade(transicoes.filter((t) => t.tipo === tipo)),
  })).filter((g) => g.itens.length > 0);

  return (
    <div className="flex flex-col gap-[var(--space-2xl)]">
      {grupos.map(({ tipo, itens }) => {
        const m = tipoMeta(tipo);
        return (
          <section key={tipo}>
            <div className="mb-[var(--space-xs)] flex items-baseline justify-between border-b pb-[var(--space-xs)]">
              <h3
                className="font-display text-[length:var(--step-1)] font-bold leading-tight tracking-[-0.01em]"
                style={{ color: m.cor }}
              >
                {m.rotuloPlural}
              </h3>
              <span className="text-[length:var(--step-xs)] text-[var(--ink-faint)]">
                {itens.length} {itens.length === 1 ? "saída" : "saídas"}
              </span>
            </div>
            <div>
              {itens.map((t, i) => (
                <TransicaoItem key={t.slug} t={t} n={i + 1} paraNome={t.para ? nomePorSlug?.[t.para] : undefined} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
