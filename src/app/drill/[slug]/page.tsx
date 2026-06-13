import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import drillsData from "@/content/drills.json";
import { getPosicao } from "@/lib/graph";
import { temPose3D } from "@/lib/figura/figura-data";
import type { Drill } from "@/lib/grapplemap/drills";
import { DrillPlayer } from "@/components/drill-player";

const DRILLS = drillsData as Drill[];

export function generateStaticParams() {
  return DRILLS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = DRILLS.find((x) => x.slug === slug);
  if (!d) return {};
  return { title: `${d.nome} — Exercício · O Mapa`, description: `${d.sequencia.length} passos.` };
}

export default async function DrillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const drill = DRILLS.find((d) => d.slug === slug);
  if (!drill) notFound();

  return (
    <main className="mx-auto max-w-3xl px-[var(--space-md)] py-[var(--space-2xl)]">
      <div className="mb-[var(--space-md)] text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[var(--clay)]">
        Exercício · {drill.sequencia.length} passos
      </div>
      <h1 className="font-display text-[2rem] font-bold leading-tight text-[var(--ink)]">{drill.nome}</h1>
      <p className="mt-[var(--space-xs)] max-w-[60ch] text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
        Sequência de posições do GrappleMap. Percorra cada passo no atlas e treine a transição entre eles.
      </p>

      <div className="mt-[var(--space-xl)]">
        <DrillPlayer sequencia={drill.sequencia} />
      </div>

      <ol className="mt-[var(--space-xl)] flex flex-col gap-[var(--space-sm)]">
        {drill.sequencia.map((slugPasso, i) => {
          const pos = getPosicao(slugPasso);
          const nome = pos?.nome ?? drill.nomesGM[i] ?? slugPasso;
          // "fora do mapa curado" = passo sem figura 3D (esteja ou não no grafo).
          // Mesmo critério do player, pra rótulo e canvas contarem a mesma história.
          const semFigura = !temPose3D(slugPasso);
          return (
            <li key={i} className="flex items-baseline gap-[var(--space-sm)] border-b border-[var(--paper-edge)] pb-[var(--space-xs)]">
              <span className="w-[2ch] font-display text-[0.8rem] font-bold text-[var(--ink-faint)] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              {pos ? (
                <Link
                  href={`/posicao/${pos.slug}`}
                  className="font-display text-[1.05rem] font-semibold text-[var(--ink)] hover:text-[var(--clay)]"
                >
                  {nome}
                  {semFigura && (
                    <span className="ml-[6px] text-[0.6rem] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                      fora do mapa
                    </span>
                  )}
                </Link>
              ) : (
                <span className="font-display text-[1.05rem] font-semibold text-[var(--ink-soft)]">
                  {nome}
                  <span className="ml-[6px] text-[0.6rem] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                    fora do mapa
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-[var(--space-2xl)] text-[0.78rem]">
        <Link href="/mapa" className="text-[var(--clay)] underline-offset-2 hover:underline">
          ← Voltar ao mapa
        </Link>
      </div>
    </main>
  );
}
