import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGrafo, getPosicao, getTransicoesDe } from "@/lib/graph";
import { isPublicada } from "@/lib/figura/pose-meta";
import { Still } from "@/components/still";
import { TransicaoIndice } from "@/components/transicao-item";
import { VideoEmbed } from "@/components/video-embed";

export function generateStaticParams() {
  // Só posições publicadas viram página (diferidas — ex: cadeia de passagens — ficam fora).
  return getGrafo()
    .posicoes.filter((p) => isPublicada(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pos = getPosicao(slug);
  if (!pos) return {};
  return { title: `${pos.nome} — Atlas Jiu-Jitsu`, description: pos.resumo };
}

export default async function PosicaoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pos = getPosicao(slug);
  if (!pos || !isPublicada(slug)) notFound();

  // Status gate: só transições publicadas, e cujo destino também é publicado.
  const saidas = getTransicoesDe(pos.slug).filter(
    (t) => isPublicada(t.slug) && (t.para === null || isPublicada(t.para)),
  );
  // slug→nome de display, pra resolver "Transição sem Nome" pelo destino.
  const nomePorSlug = Object.fromEntries(getGrafo().posicoes.map((p) => [p.slug, p.nome]));

  return (
    <div className="mx-auto max-w-5xl px-[var(--space-lg)] py-[var(--space-2xl)]">
      <Link
        href="/"
        className="inline-flex items-center gap-[6px] text-[0.84rem] font-medium text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
      >
        ← Voltar ao mapa
      </Link>

      <header className="mt-[var(--space-lg)] grid items-start gap-[var(--space-2xl)] md:grid-cols-[1.1fr_0.9fr]">
        <div>
          {pos.raiz && (
            <p className="mb-[var(--space-sm)] text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--clay-deep)]">
              Posição-raiz · Módulo 01
            </p>
          )}
          <h1 className="font-display text-[length:var(--step-3)] font-extrabold leading-tight tracking-[-0.01em] text-[var(--ink)]">
            {pos.nome}
          </h1>
          <p className="no-copy mt-[var(--space-md)] max-w-[58ch] text-[1.05rem] leading-relaxed text-[var(--ink-soft)]">
            {pos.resumo}
          </p>
        </div>
        <Still nome={pos.nome} indice={pos.raiz ? "Lâmina 01" : "Lâmina"} src={pos.imagem} />
      </header>

      {pos.video && (
        <section className="mt-[var(--space-3xl)]">
          <h2 className="mb-[var(--space-md)] font-display text-[1.6rem] font-bold">Vídeo-aula</h2>
          <div className="max-w-[640px]">
            <VideoEmbed video={pos.video} />
          </div>
        </section>
      )}

      {pos.principios.length > 0 && (
        <section className="mt-[var(--space-3xl)]">
          <h2 className="font-display text-[1.6rem] font-bold">Princípios</h2>
          <ol className="no-copy mt-[var(--space-sm)] flex flex-col">
            {pos.principios.map((p, i) => (
              <li
                key={i}
                className="flex gap-[var(--space-md)] border-b py-[var(--space-md)] last:border-b-0"
              >
                <span className="font-display text-[1.25rem] font-bold leading-none text-[var(--clay)] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[1rem] leading-relaxed text-[var(--ink)]">{p}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {saidas.length > 0 && (
        <section className="mt-[var(--space-3xl)]">
          <h2 className="mb-[var(--space-xl)] font-display text-[1.6rem] font-bold">
            Saídas desta posição
          </h2>
          <TransicaoIndice transicoes={saidas} nomePorSlug={nomePorSlug} />
        </section>
      )}
    </div>
  );
}
