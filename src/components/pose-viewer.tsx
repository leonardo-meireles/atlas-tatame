"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/**
 * PoseViewer — visualizador multi-ângulo de uma posição.
 *
 * Uma posição é difícil de ler de UM ângulo só. Aqui o aluno recebe a MESMA
 * posição renderizada de vários lados e pode trocar/arrastar entre eles pra
 * entender a figura no espaço. A vista ativa vive numa "lâmina" cartográfica
 * (mesma moldura do still.tsx). Auto-contido.
 *
 * Wiring futuro: dropar num painel de detalhe de nó no lugar do <Still>,
 * passando os renders multi-ângulo da posição.
 */

export type PoseView = {
  /** Rótulo curto do ângulo, ex: "3/4", "Lado", "Cima", "Costas". */
  angulo: string;
  /** Caminho do render. Se vazio/ausente, mostra o glifo placeholder. */
  src?: string;
};

/** Glifo placeholder da guarda — reusa a ideia "figura em breve" do still.tsx. */
function GlifoPlaceholder({ nome }: { nome: string }) {
  return (
    <svg
      viewBox="0 0 200 150"
      className="absolute inset-0 h-full w-full p-[6%]"
      fill="none"
      role="img"
      aria-label={`Figura de ${nome} em breve`}
    >
      <g
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      >
        <circle cx="62" cy="92" r="12" />
        <path d="M62 104 L64 124" />
        <path d="M64 124 L92 116 M64 124 L86 134" />
        <path d="M62 104 L96 96 M62 104 L92 110" />
        <circle cx="128" cy="58" r="12" />
        <path d="M128 70 L122 96" />
        <path d="M122 96 L102 112 M122 96 L140 110" />
        <path d="M128 70 L100 80 M128 70 L150 78" />
      </g>
      <path
        d="M96 96 C 150 100 160 124 132 132"
        stroke="var(--clay)"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

/** Cantos de registro (crosshair) da moldura cartográfica. */
function CantosRegistro() {
  return (
    <>
      {["left-2 top-2", "right-2 top-2", "left-2 bottom-2", "right-2 bottom-2"].map(
        (pos) => (
          <span
            key={pos}
            aria-hidden
            className={`pointer-events-none absolute ${pos} h-3 w-3 border-[var(--ink-faint)]`}
            style={{
              borderTopWidth: pos.includes("top") ? 1.5 : 0,
              borderBottomWidth: pos.includes("bottom") ? 1.5 : 0,
              borderLeftWidth: pos.includes("left") ? 1.5 : 0,
              borderRightWidth: pos.includes("right") ? 1.5 : 0,
            }}
          />
        ),
      )}
    </>
  );
}

export function PoseViewer({
  views,
  nome,
  className = "",
}: {
  views: PoseView[];
  nome: string;
  className?: string;
}) {
  const [ativo, setAtivo] = useState(0);
  const [ampliado, setAmpliado] = useState(false);
  const baseId = useId();
  const dragRef = useRef<{ x: number; consumido: boolean } | null>(null);

  // Clamp defensivo (lista pode mudar).
  const total = views.length;
  const idx = total === 0 ? 0 : Math.min(ativo, total - 1);
  const temSwitcher = total > 1;

  const ir = useCallback(
    (alvo: number) => {
      if (total === 0) return;
      setAtivo(((alvo % total) + total) % total);
    },
    [total],
  );

  // Setas de teclado "giram" pela sequência de ângulos.
  const onKeyNav = (e: React.KeyboardEvent) => {
    if (!temSwitcher) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      ir(idx + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      ir(idx - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      ir(0);
    } else if (e.key === "End") {
      e.preventDefault();
      ir(total - 1);
    }
  };

  // Arrastar horizontal pra "girar" (pointer = mouse + touch + pen).
  const LIMIAR = 44;
  const onPointerDown = (e: React.PointerEvent) => {
    if (!temSwitcher) return;
    dragRef.current = { x: e.clientX, consumido: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.consumido) return;
    const delta = e.clientX - d.x;
    if (Math.abs(delta) >= LIMIAR) {
      ir(idx + (delta < 0 ? 1 : -1));
      d.consumido = true;
    }
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  // Esc fecha o modo ampliado.
  useEffect(() => {
    if (!ampliado) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAmpliado(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ampliado]);

  if (total === 0) {
    return (
      <PlacaLamina nome={nome} className={className}>
        <GlifoPlaceholder nome={nome} />
        <Legenda nome={nome} angulo="Lâmina" pos={null} />
      </PlacaLamina>
    );
  }

  const viewAtiva = views[idx];

  return (
    <div className={className}>
      <PlacaLamina
        nome={nome}
        ampliado={ampliado}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        // a placa é o alvo de teclado quando há vários ângulos
        tabIndex={temSwitcher ? 0 : undefined}
        role={temSwitcher ? "group" : undefined}
        ariaLabel={
          temSwitcher
            ? `Figura de ${nome}, ângulo ${viewAtiva.angulo}. Use as setas pra girar.`
            : undefined
        }
        onKeyDown={temSwitcher ? onKeyNav : undefined}
      >
        {/* Crossfade: TODAS as vistas montadas (preload), só a ativa opaca.
            Transição só de opacity — sem reflow, ease-out. */}
        {views.map((v, i) => {
          const isAtivo = i === idx;
          return (
            <div
              key={`${v.angulo}-${i}`}
              aria-hidden={!isAtivo}
              className="absolute inset-0 transition-opacity duration-300 ease-out [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]"
              style={{ opacity: isAtivo ? 1 : 0 }}
            >
              {v.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={v.src}
                  alt={isAtivo ? `${nome} — ângulo ${v.angulo}` : ""}
                  draggable={false}
                  // pré-carrega vistas vizinhas com prioridade alta
                  loading={Math.abs(i - idx) <= 1 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-contain p-[6%]"
                />
              ) : (
                <GlifoPlaceholder nome={nome} />
              )}
            </div>
          );
        })}

        <Legenda
          nome={nome}
          angulo={viewAtiva.angulo}
          pos={temSwitcher ? { idx, total } : null}
        />

        {/* Ampliar — afordância sutil, sem modal pesado (expande inline). */}
        <button
          type="button"
          onClick={() => setAmpliado((a) => !a)}
          aria-pressed={ampliado}
          aria-label={ampliado ? "Reduzir figura" : "Ampliar figura"}
          className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full border border-[var(--paper-edge)] bg-[var(--paper)]/85 text-[var(--ink-soft)] backdrop-blur-sm transition-colors hover:text-[var(--ink)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            {ampliado ? (
              <path
                d="M9 9L4 4M9 9V5M9 9H5M15 15l5 5M15 15v4M15 15h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M14 4h6m0 0v6m0-6l-7 7M10 20H4m0 0v-6m0 6l7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      </PlacaLamina>

      {/* Controle segmentado de ângulos. Some quando há só 1 vista. */}
      {temSwitcher && (
        <div
          role="tablist"
          aria-label={`Ângulos de ${nome}`}
          className="mt-[var(--space-sm)] flex gap-[var(--space-2xs)] overflow-x-auto rounded-full border bg-[var(--paper-2)] p-[3px]"
        >
          {views.map((v, i) => {
            const sel = i === idx;
            return (
              <button
                key={`tab-${v.angulo}-${i}`}
                role="tab"
                type="button"
                id={`${baseId}-tab-${i}`}
                aria-selected={sel}
                aria-label={`Ângulo ${v.angulo}`}
                onClick={() => ir(i)}
                className={`flex-1 whitespace-nowrap rounded-full px-[var(--space-sm)] py-[6px] text-[0.78rem] font-semibold tracking-[0.02em] transition-colors ${
                  sel
                    ? "bg-[var(--ink)] text-[var(--paper)]"
                    : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {v.angulo}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** A "lâmina" — moldura cartográfica em papel (mesma linguagem do still.tsx). */
function PlacaLamina({
  nome,
  children,
  className = "",
  ampliado = false,
  tabIndex,
  role,
  ariaLabel,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  nome: string;
  children: React.ReactNode;
  className?: string;
  ampliado?: boolean;
  tabIndex?: number;
  role?: string;
  ariaLabel?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
  onPointerCancel?: (e: React.PointerEvent) => void;
}) {
  return (
    <figure
      className={`no-copy relative overflow-hidden rounded-[10px] border bg-[var(--paper-2)] transition-[aspect-ratio] duration-300 ease-out ${
        tabIndex !== undefined ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""
      } ${className}`}
      style={{ aspectRatio: ampliado ? "4 / 4.4" : "4 / 3" }}
      aria-label={ariaLabel ?? `Ilustração da posição ${nome}`}
      tabIndex={tabIndex}
      role={role}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {/* grade cartográfica */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(var(--paper-edge) 1px, transparent 1px), linear-gradient(90deg, var(--paper-edge) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <CantosRegistro />
      {children}
    </figure>
  );
}

/** Legenda inferior — índice/ângulo à esquerda, nome à direita. */
function Legenda({
  nome,
  angulo,
  pos,
}: {
  nome: string;
  angulo: string;
  pos: { idx: number; total: number } | null;
}) {
  return (
    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-[var(--space-sm)] px-3 py-2 text-[0.66rem] font-medium uppercase tracking-[0.12em] text-[var(--ink-faint)]">
      <span className="flex items-center gap-[var(--space-xs)]">
        <span className="text-[var(--clay-deep)]">{angulo}</span>
        {pos && (
          <span className="tabular-nums opacity-70">
            {pos.idx + 1}/{pos.total}
          </span>
        )}
      </span>
      <span className="truncate">{nome}</span>
    </figcaption>
  );
}
