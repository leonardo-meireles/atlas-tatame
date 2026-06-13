"use client";

/**
 * Player do drill: concatena as poses-snapshot da sequência num único stream de frames
 * e alimenta o FiguraR3F (modo animado). Reaproveita toda a engine (CenaAnimada +
 * controles de pause/play/velocidade + câmera adaptativa). Loop contínuo.
 */
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { loadPoses, temPose3D, type PoseFrame } from "@/lib/figura/figura-data";

const FiguraR3F = dynamic(() => import("./figura-r3f"), { ssr: false });

export function DrillPlayer({ sequencia }: { sequencia: string[] }) {
  // Só anima entre passos que TÊM figura 3D — passos "fora do mapa" (sem pose)
  // não entram no stream, evitando saltos entre passos não-adjacentes.
  const passosComFigura = useMemo(() => sequencia.filter((s) => temPose3D(s)), [sequencia]);
  const totalPassos = sequencia.length;

  const [frames, setFrames] = useState<PoseFrame[] | null>(null);
  useEffect(() => {
    let cancel = false;
    (async () => {
      const f = await loadPoses(passosComFigura);
      if (!cancel) setFrames(f);
    })();
    return () => {
      cancel = true;
    };
  }, [passosComFigura]);

  // Painel "lâmina" (mesmo vocabulário cartográfico do node-expandido).
  const fundo =
    "radial-gradient(120% 90% at 50% 22%, var(--paper) 0%, var(--paper-2) 60%, color-mix(in oklch, var(--clay) 9%, var(--paper-2)) 100%)";

  return (
    <figure
      className="no-copy relative aspect-[4/3] w-full overflow-hidden rounded-[12px] border border-[var(--paper-edge)]"
      style={{ background: fundo }}
      aria-label="Animação do exercício"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(var(--paper-edge) 1px, transparent 1px), linear-gradient(90deg, var(--paper-edge) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 85%)",
        }}
      />
      <div className="nopan nodrag nowheel absolute inset-0">
        {frames && frames.length >= 2 ? (
          // PoseFrame[] ≡ Pose[] estrutural (Record<player, Record<joint, tuple>>).
          <FiguraR3F frames={frames as unknown as never} />
        ) : frames === null ? (
          <div className="flex h-full w-full items-center justify-center text-[0.7rem] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            carregando…
          </div>
        ) : (
          // Placeholder honesto: nunca um void 3D mudo na lona.
          <div className="flex h-full w-full flex-col items-center justify-center gap-[var(--space-xs)] px-[var(--space-lg)] text-center">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--clay)]">
              fora do mapa curado
            </span>
            <p className="max-w-[34ch] text-[0.82rem] leading-relaxed text-[var(--ink-soft)]">
              Esse passo ainda não tem figura — fora do mapa curado. Acompanhe a sequência pela
              lista abaixo.
            </p>
          </div>
        )}
      </div>
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2 text-[0.66rem] font-medium uppercase tracking-[0.12em] text-[var(--ink-faint)]">
        <span>Sequência 3D · loop</span>
        <span>
          {passosComFigura.length} de {totalPassos} com figura · arraste pra girar
        </span>
      </figcaption>
    </figure>
  );
}
