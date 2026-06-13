import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import coachesData from "@/content/coaches.json";
import type { Coach, CapituloStatus } from "@/lib/grapplemap/coaches";
// SEM imports de resolveDrillSlug/getPosicao no render — o slug do capítulo já
// veio resolvido do gerador, render só checa truthy e linka.

const COACHES = coachesData as Coach[];

const STATUS_LABEL: Record<CapituloStatus, string> = {
  done: "feito",
  wip: "em curso",
  later: "depois",
  todo: "todo",
  none: "",
};
const STATUS_COR: Record<CapituloStatus, string> = {
  done: "var(--raspagem)",
  wip: "var(--clay)",
  later: "var(--perda)",
  todo: "var(--ink-faint)",
  none: "transparent",
};

export function generateStaticParams() {
  return COACHES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = COACHES.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: `${c.nome} — Instrutor · O Mapa`, description: `Syllabus do GrappleMap.` };
}

export default async function InstrutorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const coach = COACHES.find((c) => c.slug === slug);
  if (!coach) notFound();

  const totalCaps = coach.series.reduce(
    (n, s) => n + s.volumes.reduce((m, v) => m + v.capitulos.length, 0),
    0,
  );

  return (
    <main className="mx-auto max-w-3xl px-[var(--space-md)] py-[var(--space-2xl)]">
      <div className="mb-[var(--space-md)] text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[var(--clay)]">
        Instrutor · {totalCaps} capítulos
      </div>
      <h1 className="font-display text-[2rem] font-bold leading-tight text-[var(--ink)]">{coach.nome}</h1>
      <p className="mt-[var(--space-xs)] max-w-[60ch] text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
        Syllabus do GrappleMap (domínio público). Status (feito / em curso / depois / todo) vem do
        próprio material.
      </p>

      {coach.series.map((s, si) => (
        <section key={si} className="mt-[var(--space-xl)]">
          <h2 className="font-display text-[1.2rem] font-bold text-[var(--ink)]">{s.nome}</h2>
          {s.volumes.map((v, vi) => (
            <div key={vi} className="mt-[var(--space-md)]">
              <h3 className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
                {v.ordem} · <span className="normal-case text-[0.92rem] font-bold text-[var(--ink)]">{v.tema}</span>
              </h3>
              <ol className="mt-[var(--space-xs)] flex flex-col gap-[2px]">
                {v.capitulos.map((c, ci) => (
                  <li key={ci} className="flex items-baseline gap-[var(--space-xs)] py-[2px]">
                    <span className="w-[5ch] shrink-0 font-mono text-[0.72rem] text-[var(--ink-faint)] tabular-nums">
                      {c.tempo}
                    </span>
                    <span className="w-[3ch] shrink-0 font-mono text-[0.72rem] text-[var(--ink-faint)] tabular-nums">
                      {c.numero}.
                    </span>
                    {c.status !== "none" && (
                      <span
                        className="rounded-full px-[6px] text-[0.56rem] font-semibold uppercase tracking-[0.12em] text-white"
                        style={{ background: STATUS_COR[c.status] }}
                      >
                        {STATUS_LABEL[c.status]}
                      </span>
                    )}
                    {c.slug ? (
                      <Link
                        href={`/posicao/${c.slug}`}
                        className="flex-1 text-[0.88rem] leading-snug text-[var(--ink)] underline decoration-[var(--paper-edge)] decoration-1 underline-offset-2 transition-colors hover:text-[var(--clay)] hover:decoration-[var(--clay)]"
                      >
                        {c.titulo}
                      </Link>
                    ) : (
                      <span className="flex-1 text-[0.88rem] leading-snug text-[var(--ink)]">{c.titulo}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>
      ))}

      <div className="mt-[var(--space-2xl)] text-[0.78rem]">
        <Link href="/mapa" className="text-[var(--clay)] underline-offset-2 hover:underline">
          ← Voltar ao mapa
        </Link>
      </div>
    </main>
  );
}
