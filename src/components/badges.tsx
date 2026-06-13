import { tipoMeta } from "@/lib/tipo";
import { dificuldadeMeta } from "@/lib/dificuldade";
import type { Dificuldade, TipoTransicao } from "@/lib/types";

export function TipoBadge({ tipo }: { tipo: TipoTransicao }) {
  const m = tipoMeta(tipo);
  return (
    <span
      className="inline-flex items-center gap-[6px] text-[0.72rem] font-semibold uppercase tracking-[0.1em]"
      style={{ color: m.cor }}
    >
      <span
        aria-hidden
        className="h-[7px] w-[7px] rounded-full"
        style={{ background: m.cor }}
      />
      {m.rotulo}
    </span>
  );
}

/** Selo de dificuldade — orienta o iniciante sobre a ordem de aprendizado. */
export function DificuldadeBadge({ dificuldade }: { dificuldade: Dificuldade }) {
  const m = dificuldadeMeta(dificuldade);
  // 3 bolinhas preenchidas conforme o nível (1 = iniciante, 3 = avançado).
  const preenchidas = m.ordem + 1;
  return (
    <span
      className="inline-flex items-center gap-[5px] text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-soft)]"
      title={`Dificuldade: ${m.rotulo}`}
    >
      <span aria-hidden className="inline-flex items-center gap-[2px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-[5px] w-[5px] rounded-full"
            style={{ background: i < preenchidas ? "var(--ink-soft)" : "var(--ink-faint)", opacity: i < preenchidas ? 1 : 0.4 }}
          />
        ))}
      </span>
      {m.rotulo}
    </span>
  );
}

/** Selo discreto pra conteúdo pago (sem gating ainda — só visual). */
export function LockBadge() {
  return (
    <span className="inline-flex items-center gap-[5px] rounded-full bg-[var(--clay-tint)] px-[var(--space-sm)] py-[2px] text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--clay-deep)]">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" />
        <path
          d="M8 11V8a4 4 0 0 1 8 0v3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
      Completo
    </span>
  );
}
