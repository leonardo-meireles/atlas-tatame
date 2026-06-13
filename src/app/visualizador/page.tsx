"use client";

import { PoseViewer, type PoseView } from "@/components/pose-viewer";

/**
 * Rota de demonstração do PoseViewer. Os renders multi-ângulo de verdade
 * vão pousar depois em /public/stills/views/<posicao>/<angulo>.png — aqui
 * usamos os stills existentes como stand-in só pra ver o componente vivo.
 */

const ANGULOS_DEMO: PoseView[] = [
  { angulo: "3/4", src: "/stills/guarda-fechada.png" },
  { angulo: "Lado", src: "/stills/montada.png" },
  { angulo: "Cima", src: "/stills/guarda-fechada-v2.png" },
  // ângulo sem render ainda — exercita o placeholder
  { angulo: "Costas" },
];

const UMA_VISTA: PoseView[] = [
  { angulo: "3/4", src: "/stills/guarda-fechada-v2.png" },
];

export default function Visualizador() {
  return (
    <div className="mx-auto max-w-5xl px-[var(--space-lg)] py-[var(--space-2xl)]">
      <header className="mb-[var(--space-xl)]">
        <p className="mb-[var(--space-sm)] flex items-center gap-[var(--space-sm)] text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
          <span className="text-[var(--clay-deep)]">Demo</span>
          <span aria-hidden className="h-px w-8 bg-[var(--paper-edge)]" />
          Visualizador multi-ângulo
        </p>
        <h1 className="font-display text-[length:var(--step-3)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
          Ver a posição de todos os lados
        </h1>
        <p className="mt-[var(--space-sm)] max-w-[60ch] text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
          Uma posição é difícil de ler de um ângulo só. Troque pelos botões,
          arraste a figura pros lados ou use as setas do teclado pra girar.
          As imagens abaixo são <strong className="font-semibold text-[var(--ink)]">stand-ins</strong> —
          os renders reais de cada ângulo chegam depois.
        </p>
      </header>

      <div className="grid gap-[var(--space-2xl)] md:grid-cols-2">
        <section>
          <h2 className="mb-[var(--space-sm)] text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Vários ângulos
          </h2>
          <PoseViewer views={ANGULOS_DEMO} nome="Guarda fechada" />
        </section>

        <section>
          <h2 className="mb-[var(--space-sm)] text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Uma vista só (sem seletor)
          </h2>
          <PoseViewer views={UMA_VISTA} nome="Montada" />
        </section>
      </div>

      <p className="mt-[var(--space-2xl)] border-t pt-[var(--space-md)] text-[0.78rem] text-[var(--ink-faint)]">
        Vista de demonstração descartável. Imagens são placeholders dos stills
        atuais; não faz parte do produto final.
      </p>
    </div>
  );
}
