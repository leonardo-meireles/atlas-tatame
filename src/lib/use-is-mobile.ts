"use client";

import { useEffect, useState } from "react";

/** Breakpoint do drawer/índice — abaixo disto a sidebar vira drawer fechado. */
export const MOBILE_QUERY = "(max-width: 767px)";

/**
 * `true` quando a viewport está na faixa mobile (drawer fechado por padrão).
 * Fonte única do breakpoint — o explorer e o onboarding consumiam o mesmo
 * `matchMedia("(max-width: 767px)")` duplicado.
 *
 * SSR-safe: começa `false` (desktop-first, sem flash de drawer) e sincroniza no mount.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isMobile;
}
