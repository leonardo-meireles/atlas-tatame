"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/lib/use-is-mobile";

const CHAVE = "atlas:onboarding-mapa:v1";

/**
 * Dica de primeiro acesso ao mapa. Aparece uma vez (gate localStorage), orienta o
 * iniciante a começar pela Guarda Fechada e a tocar nas linhas. Dispensável e some
 * pra sempre. Não vira wizard — exploração livre continua intacta.
 */
export function OnboardingMapa({ onVisivel }: { onVisivel?: (visivel: boolean) => void } = {}) {
  // Começa fechado pra não piscar no SSR; abre no mount só se nunca foi visto.
  const [aberto, setAberto] = useState(false);
  // No mobile o índice é um drawer fechado — a dica "ao lado" estaria errada.
  const mobile = useIsMobile();

  useEffect(() => {
    try {
      if (localStorage.getItem(CHAVE) !== "1") setAberto(true);
    } catch {
      // localStorage indisponível (modo privado etc.) — segue sem onboarding.
    }
  }, []);

  // Reporta visibilidade pro pai — assim o MapHint pode se suprimir e não competir com
  // esta dica de primeiro acesso (um coach-mark por vez no primeiro acesso mobile).
  useEffect(() => {
    onVisivel?.(aberto);
    return () => onVisivel?.(false);
  }, [aberto, onVisivel]);

  function dispensar() {
    setAberto(false);
    try {
      localStorage.setItem(CHAVE, "1");
    } catch {
      // sem persistência — ok, só não lembra na próxima.
    }
  }

  if (!aberto) return null;

  return (
    <div
      // Dica não-modal, dispensável — não captura foco nem tem Esc próprio (o Esc global
      // fecha o nó expandido). `role="note"` descreve isso honestamente; `dialog` mentiria
      // sobre o comportamento (focus trap + Esc) que esta dica deliberadamente não tem.
      role="note"
      aria-label="Como usar o mapa"
      className="pointer-events-auto absolute bottom-4 left-1/2 z-40 w-[min(420px,calc(100%-1.5rem))] -translate-x-1/2 rounded-[14px] border border-[var(--mat-line)] bg-[var(--mat-2)] p-[var(--space-md)] text-[var(--on-mat)] shadow-2xl md:bottom-6 md:left-6 md:translate-x-0"
    >
      <div className="text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.2em] text-[var(--on-mat-soft)]">
        Comece aqui
      </div>
      <p className="mt-[6px] text-[length:var(--step-0s)] font-display font-bold leading-snug">
        A <span style={{ color: "var(--clay-on-mat)" }}>Guarda Fechada</span> é seu ponto de partida.
      </p>
      <p className="mt-[4px] text-[length:var(--step-xs)] leading-snug text-[var(--on-mat-soft)]">
        Toque numa <strong>linha colorida</strong> pra ver a técnica passo a passo. As cores estão
        explicadas no índice{" "}
        {mobile ? (
          <>
            — toque em <strong>Abrir índice</strong>{" "}
            {/* Mesmo ícone do controle real (hamburger SVG); o texto bate com o aria-label do botão. */}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden
              className="inline-block translate-y-[1px] text-[var(--on-mat)]"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>{" "}
            pra abrir
          </>
        ) : (
          "ao lado"
        )}
        .
      </p>
      <button
        onClick={dispensar}
        className="mt-[var(--space-sm)] rounded-[9px] bg-[var(--on-mat)] px-[var(--space-md)] py-[7px] text-[length:var(--step-xs)] font-semibold text-[var(--mat)] transition-opacity hover:opacity-90"
      >
        Entendi, bora
      </button>
    </div>
  );
}
