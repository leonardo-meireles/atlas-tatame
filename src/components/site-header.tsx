"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Item ativo = rota atual começa com o href do item (cobre rotas aninhadas). */
function ehAtivo(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Link de seção. A seção ativa ganha o acento latão (--grau) de forma óbvia:
 * texto em grau-deep + marcador embaixo. Borda sempre presente (transparente
 * quando inativo) pra não haver salto de layout no estado ativo.
 */
function LinkSecao({
  href,
  ativo,
  children,
}: {
  href: string;
  ativo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={ativo ? "page" : undefined}
      className={`border-b-2 pb-[var(--space-2xs)] font-medium transition-colors ${
        ativo
          ? "border-grau font-semibold text-grau-deep"
          : "border-transparent text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  // Exato (ou subrota /mapa/...) — senão "/mapa-v2" casaria por prefixo e marcaria "No mapa" errado.
  const mapaAtivo = pathname === "/mapa" || pathname.startsWith("/mapa/");

  return (
    <header className="sticky top-0 z-40 border-b border-b-[color-mix(in_oklch,var(--grau)_30%,var(--paper-edge))] bg-[color-mix(in_oklch,var(--paper)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-[var(--space-md)] px-[var(--space-md)] py-[var(--space-sm)] sm:px-[var(--space-lg)]">
        <Link
          href="/"
          aria-label="Atlas do Tatame — início"
          className="group flex flex-col leading-none"
        >
          <span className="hidden font-sans text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.22em] text-grau-deep sm:block">
            Atlas do
          </span>
          <span className="font-display text-[length:var(--step-0t)] font-extrabold tracking-tight text-ink transition-colors group-hover:text-grau-deep">
            Tatame
          </span>
        </Link>

        <nav className="flex items-center gap-[var(--space-md)] text-[length:var(--step-0s)] sm:gap-[var(--space-lg)]">
          {mapaAtivo ? (
            // Já no mapa: indicador "você está aqui" em latão, não um botão que re-navega.
            <span
              aria-current="page"
              className="inline-flex items-center gap-[var(--space-2xs)] rounded-full bg-grau-tint px-[var(--space-md)] py-[var(--space-xs)] font-semibold text-grau-deep"
            >
              <span aria-hidden className="size-[6px] rounded-full bg-grau" />
              No mapa
            </span>
          ) : (
            <Link
              href="/mapa"
              className="rounded-full bg-[var(--ink)] px-[var(--space-md)] py-[var(--space-xs)] font-semibold text-[var(--paper)] transition-transform hover:-translate-y-[1px]"
            >
              Abrir o mapa
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
