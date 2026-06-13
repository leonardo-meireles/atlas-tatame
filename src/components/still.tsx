"use client";

/**
 * Still 2D (a "lâmina" técnica): a figura renderizada sobre uma prancha
 * cartográfica, ou um glifo de placeholder enquanto não há figura.
 */
import { useState } from "react";
import type { Seta } from "@/lib/types";
import { SetasOverlay, COR_SETA } from "./setas-overlay";

export function Still({
  nome,
  indice,
  src,
  setas,
  activeN = null,
  onHoverCallout,
  className = "",
}: {
  nome: string;
  indice?: string;
  /** Caminho do still renderizado. Se ausente, mostra o glifo de placeholder. */
  src?: string;
  /** Setas de anotação sobre a figura. */
  setas?: Seta[];
  /** Callout numerado em destaque (1-based) — pulsa o marcador e a seta. */
  activeN?: number | null;
  /** Hover num marcador numerado da figura (costura com a lista de pontos-chave). */
  onHoverCallout?: (n: number | null) => void;
  className?: string;
}) {
  const [erro, setErro] = useState(false);
  const temFigura = !!src && !erro;
  const temSetas = temFigura && !!setas && setas.length > 0;
  return (
    <figure
      className={`group/still no-copy relative aspect-[4/3] overflow-hidden rounded-[10px] border bg-[var(--paper-2)] transition-colors duration-300 hover:border-[var(--ink-faint)] ${className}`}
      aria-label={`Ilustração da posição ${nome}`}
    >
      {/* grade cartográfica */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(var(--paper-edge) 1px, transparent 1px), linear-gradient(90deg, var(--paper-edge) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      {/* cantos de registro (crosshair) */}
      {[
        "left-2 top-2",
        "right-2 top-2",
        "left-2 bottom-2",
        "right-2 bottom-2",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute ${pos} h-3 w-3 border-[var(--ink-faint)] transition-colors duration-300 group-hover/still:border-[var(--ink-soft)]`}
          style={{
            borderTopWidth: pos.includes("top") ? 1.5 : 0,
            borderBottomWidth: pos.includes("bottom") ? 1.5 : 0,
            borderLeftWidth: pos.includes("left") ? 1.5 : 0,
            borderRightWidth: pos.includes("right") ? 1.5 : 0,
          }}
        />
      ))}

      {temFigura ? (
        /* still renderizado (figuras estilo GrappleMap) */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Posição ${nome}`}
          draggable={false}
          onError={() => setErro(true)}
          className="absolute inset-0 h-full w-full object-contain p-[6%]"
        />
      ) : (
        /* glifo abstrato da guarda — duas formas entrelaçadas (placeholder) */
        <svg
          viewBox="0 0 200 150"
          className="absolute inset-0 h-full w-full"
          fill="none"
          aria-hidden
        >
          <g
            stroke="var(--ink)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.82"
          >
            {/* atacante de baixo */}
            <circle cx="62" cy="92" r="12" />
            <path d="M62 104 L64 124" />
            <path d="M64 124 L92 116 M64 124 L86 134" />
            <path d="M62 104 L96 96 M62 104 L92 110" />
            {/* oponente de cima */}
            <circle cx="128" cy="58" r="12" />
            <path d="M128 70 L122 96" />
            <path d="M122 96 L102 112 M122 96 L140 110" />
            <path d="M128 70 L100 80 M128 70 L150 78" />
          </g>
          {/* laço da guarda (pernas cruzadas) em argila */}
          <path
            d="M96 96 C 150 100 160 124 132 132"
            stroke="var(--clay)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}

      {temSetas && <SetasOverlay setas={setas!} activeN={activeN} />}

      {/* Marcadores numerados (HTML — não distorcem como o SVG 100x100). Casam com a lista. */}
      {temSetas && (
        <div className="absolute inset-0">
          {setas!.map((s, i) => {
            const n = i + 1;
            const ativo = activeN === n;
            const algumAtivo = activeN != null;
            const cor = COR_SETA[s.tipo];
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => onHoverCallout?.(n)}
                onMouseLeave={() => onHoverCallout?.(null)}
                onFocus={() => onHoverCallout?.(n)}
                onBlur={() => onHoverCallout?.(null)}
                aria-label={`Ponto ${n}${s.rotulo ? `: ${s.rotulo}` : ""}`}
                className="absolute flex items-center justify-center rounded-full font-display font-bold tabular-nums leading-none text-[var(--paper)] transition-all duration-200"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: ativo ? 26 : 20,
                  height: ativo ? 26 : 20,
                  fontSize: ativo ? "var(--step-xs)" : "var(--step-2xs)",
                  transform: "translate(-50%, -50%)",
                  background: cor,
                  boxShadow: ativo
                    ? `0 0 0 3px color-mix(in oklch, ${cor} 32%, transparent), 0 3px 8px -2px oklch(0 0 0 / 0.45)`
                    : "0 1px 4px -1px oklch(0 0 0 / 0.5)",
                  opacity: algumAtivo && !ativo ? 0.5 : 1,
                  zIndex: ativo ? 2 : 1,
                  border: "1.5px solid var(--paper)",
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
      )}

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2 text-[length:var(--step-3xs)] font-medium uppercase tracking-[0.12em] text-[var(--ink-faint)]">
        <span>{indice ?? "Lâmina"}</span>
        <span>{nome}</span>
      </figcaption>
    </figure>
  );
}
