import type { Metadata } from "next";
import Link from "next/link";
import { getTermos } from "@/lib/glossario";
import { GlossarioLista } from "@/components/glossario-lista";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Dicionário do tatame — Atlas Jiu-Jitsu",
  description:
    "O que cada termo do jiu-jitsu quer dizer, no português do tatame: posições, raspagens, finalizações e conceitos. Mantemos o inglês onde o tatame fala inglês (armlock, berimbolo, leg drag).",
  alternates: { canonical: "/glossario" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${SITE_URL}/glossario`,
    title: "Dicionário do tatame — Atlas Jiu-Jitsu",
    description: "O que cada termo do jiu-jitsu quer dizer, no português do tatame.",
  },
};

export default function GlossarioPage() {
  const termos = getTermos();
  return (
    <div className="mx-auto max-w-3xl px-[var(--space-md)] py-[var(--space-3xl)] sm:px-[var(--space-lg)]">
      <header className="mb-[var(--space-2xl)] max-w-[52ch]">
        <p className="text-[length:var(--step-xs)] font-semibold uppercase tracking-[0.16em] text-grau-deep">
          Dicionário do tatame
        </p>
        <h1 className="mt-[var(--space-xs)] font-display text-[length:var(--step-3)] font-extrabold leading-[1.04] tracking-[-0.01em] text-[var(--ink)]">
          O que cada termo quer dizer.
        </h1>
        <p className="mt-[var(--space-md)] text-[length:var(--step-0h)] leading-relaxed text-[var(--ink-soft)]">
          {termos.length} termos do jiu-jitsu explicados como um professor explica — sem decoreba.
          Mantemos o inglês onde o tatame fala inglês ({" "}
          <span className="text-[var(--ink)]">armlock</span>,{" "}
          <span className="text-[var(--ink)]">berimbolo</span>,{" "}
          <span className="text-[var(--ink)]">leg drag</span>).
        </p>
        <p className="mt-[var(--space-sm)] text-[length:var(--step-xs)] text-[var(--ink-faint)]">
          Travou numa técnica?{" "}
          <Link href="/mapa" className="text-grau-deep underline decoration-[var(--grau-tint)] underline-offset-[3px] hover:decoration-[var(--grau)]">
            volte pro mapa
          </Link>
          .
        </p>
      </header>

      <GlossarioLista termos={termos} />
    </div>
  );
}
