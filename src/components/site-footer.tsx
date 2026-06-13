import Link from "next/link";

const LINKS = [
  { href: "/mapa", rotulo: "O mapa" },
  { href: "/glossario", rotulo: "Dicionário" },
  { href: "https://github.com/lmeireles/atlas-tatame", rotulo: "GitHub" },
];

export function SiteFooter() {
  return (
    <footer className="mt-[var(--space-3xl)] border-t border-[var(--paper-edge)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-[var(--space-md)] px-[var(--space-md)] py-[var(--space-xl)] text-[length:var(--step-xs)] text-[var(--ink-faint)] sm:flex-row sm:items-center sm:justify-between sm:px-[var(--space-lg)]">
        <p className="font-display text-[var(--ink-soft)]">Atlas do Tatame</p>
        <nav className="flex flex-wrap items-center gap-[var(--space-lg)]">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-[var(--ink)]">
              {l.rotulo}
            </Link>
          ))}
        </nav>
        <p>Feito no tatame, não numa IA preguiçosa.</p>
      </div>
    </footer>
  );
}
