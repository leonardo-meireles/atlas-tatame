import type { Seta, TipoSeta } from "@/lib/types";

// Vocabulário visual das setas (sobre a figura). Cor = significado.
// Vocabulário validado (research/figura-setas-referencias.md): cor + forma redundantes.
export const COR_SETA: Record<TipoSeta, string> = {
  direcao: "var(--raspagem)", // jade — pra onde o corpo vai
  pressao: "var(--finalizacao)", // oxblood — onde aplicar força/peso
  pegada: "var(--ink)", // tinta — onde agarrar (anel ◎)
  rotacao: "var(--clay)", // argila — girar/inverter (arco tracejado)
};

export const ROTULO_SETA: Record<TipoSeta, string> = {
  direcao: "direção",
  pressao: "pressão",
  pegada: "pegada",
  rotacao: "rotação",
};

/**
 * Camada de setas sobre a figura (SVG, coords em % da caixa). Mostra a INTENÇÃO
 * da posição: pra onde mover (direção), onde apertar (pressão), onde agarrar (pegada).
 * `activeN` (1-based) realça a seta correspondente e recua as demais — costura com
 * o callout numerado da lista de pontos-chave.
 */
export function SetasOverlay({ setas, activeN }: { setas: Seta[]; activeN?: number | null }) {
  if (!setas.length) return null;
  const algumAtivo = activeN != null;
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        {(Object.keys(COR_SETA) as TipoSeta[]).map((t) => (
          <marker
            key={t}
            id={`seta-${t}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10z" fill={COR_SETA[t]} />
          </marker>
        ))}
      </defs>
      {setas.map((s, i) => {
        const cor = COR_SETA[s.tipo];
        const ativo = activeN === i + 1;
        const opacity = algumAtivo ? (ativo ? 1 : 0.18) : 0.92;
        const mult = ativo ? 1.5 : 1;
        if (s.tipo === "pegada") {
          return (
            <g key={i} style={{ opacity, transition: "opacity 180ms" }}>
              <circle cx={s.x} cy={s.y} r={3.2 * mult} fill="none" stroke={cor} strokeWidth={1.4 * mult} />
              <circle cx={s.x} cy={s.y} r={1 * mult} fill={cor} />
            </g>
          );
        }
        const x2 = s.x + (s.dx ?? 0);
        const y2 = s.y + (s.dy ?? 0);
        const dashed = s.tipo === "rotacao";
        return (
          <g key={i} style={{ opacity, transition: "opacity 180ms" }}>
            <line
              x1={s.x}
              y1={s.y}
              x2={x2}
              y2={y2}
              stroke={cor}
              strokeWidth={1.8 * mult}
              strokeLinecap="round"
              strokeDasharray={dashed ? "3 2.5" : undefined}
              markerEnd={`url(#seta-${s.tipo})`}
            />
          </g>
        );
      })}
    </svg>
  );
}

/** Legenda das setas presentes — pra decodificar o que cada cor significa. */
export function SetasLegenda({ setas }: { setas: Seta[] }) {
  const tipos = [...new Set(setas.map((s) => s.tipo))];
  if (!tipos.length) return null;
  return (
    <ul className="mt-[var(--space-sm)] flex flex-wrap gap-x-[var(--space-md)] gap-y-[var(--space-2xs)] text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-[var(--ink-faint)]">
      {tipos.map((t) => (
        <li key={t} className="flex items-center gap-[5px]">
          <span className="h-[8px] w-[8px] rounded-full" style={{ background: COR_SETA[t] }} />
          {ROTULO_SETA[t]}
        </li>
      ))}
    </ul>
  );
}
