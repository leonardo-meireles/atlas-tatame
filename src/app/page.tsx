import Link from "next/link";
import { getGrafo, getPosicao, getTransicoesDe } from "@/lib/graph";
import { isPublicada } from "@/lib/figura/pose-meta";
import { LandingMapPreview } from "@/components/landing-map-preview";
import { TransicaoIndice } from "@/components/transicao-item";
import { Pictograma } from "@/components/pictograma";

// MVP guard-only: foco nas duas guardas básicas curadas.
const GUARDAS = ["guarda-fechada", "meia-guarda"];

export default function Home() {
  const grafo = getGrafo();
  const raiz = getPosicao("guarda-fechada")!;
  const saidas = getTransicoesDe(raiz.slug).filter(
    (t) => t.tipo !== "perda-de-guarda" && isPublicada(t.slug),
  );

  // Stats honestos do escopo: só conteúdo CURADO (com passo a passo) das guardas — bate
  // exatamente com o que o mapa mostra (GM cru com passos vazios fica fora).
  const saidasGuardas = grafo.transicoes.filter(
    (t) => GUARDAS.includes(t.de) && t.passos.length > 0 && isPublicada(t.slug),
  );
  const numFinais = saidasGuardas.filter((t) => t.tipo === "finalizacao").length;
  const numRaspagens = saidasGuardas.filter((t) => t.tipo === "raspagem").length;
  const numVideos =
    grafo.posicoes.filter((p) => GUARDAS.includes(p.slug) && p.video).length +
    saidasGuardas.filter((t) => t.video).length;

  return (
    <div className="mx-auto max-w-6xl px-[var(--space-lg)]">
      {/* ---------- Hero ---------- */}
      <section
        aria-labelledby="hero-titulo"
        className="grid items-center gap-[var(--space-2xl)] py-[var(--space-3xl)] md:grid-cols-[1.15fr_0.85fr]"
      >
        <div>
          <p className="mb-[var(--space-md)] flex flex-wrap items-center gap-[var(--space-sm)] text-[length:var(--step-xs)] font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            <span className="text-[var(--clay-deep)]">Atlas do tatame</span>
            <span aria-hidden className="h-px w-8 bg-[var(--paper-edge)]" />
            BJJ · pt-BR
          </p>
          <h1
            id="hero-titulo"
            className="font-display text-[length:var(--step-4)] font-extrabold leading-[0.98] tracking-[-0.02em] text-[var(--ink)]"
          >
            Embaixo não é o fim.
            <br />
            É o começo.
          </h1>
          <p className="mt-[var(--space-lg)] max-w-[52ch] text-[length:var(--step-0h)] leading-relaxed text-[var(--ink-soft)]">
            <span className="font-semibold text-[var(--ink)]">Embaixo</span> é estar de costas no
            chão, com o cara por cima — onde quase todo iniciante apanha. Da guarda fechada, a
            posição mais comum do jogo, você aprende a sair, raspar e finalizar — com o porquê,
            explicado como um bom professor explica. Sem PDF de IA, sem decoreba.
          </p>
          <div className="mt-[var(--space-xl)] flex flex-wrap items-center gap-[var(--space-md)]">
            <Link
              href="/mapa"
              className="rounded-full bg-[var(--ink)] px-[var(--space-xl)] py-[var(--space-sm)] text-[length:var(--step-0)] font-semibold text-[var(--paper)] transition-transform duration-200 hover:-translate-y-[1px]"
            >
              Começar pela guarda fechada →
            </Link>
            <span className="text-[length:var(--step-xs)] text-[var(--ink-faint)]">
              grátis pra explorar · sem cadastro
            </span>
          </div>
        </div>
        {/* Figura 3D-derivada da guarda fechada (pictograma estilo serigrafia, mesma pose
            que a /mapa renderiza). Substitui a halftone PNG antiga. */}
        <figure
          className="no-copy relative aspect-[4/3] w-full overflow-hidden rounded-[12px] border border-[var(--paper-edge)]"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 22%, var(--paper) 0%, var(--paper-2) 60%, color-mix(in oklch, var(--clay) 9%, var(--paper-2)) 100%)",
          }}
          aria-label="Figura da guarda fechada"
        >
          {/* Fallback de leitura: glyph + rótulo sempre visível atrás do pictograma. Se a
              pose não carregar (Pictograma renderiza null), a moldura nunca fica vazia. */}
          <div
            aria-hidden
            className="absolute inset-0 flex flex-col items-center justify-center gap-[var(--space-xs)] text-[var(--ink-faint)]"
          >
            <svg width="64" height="48" viewBox="0 0 200 150" fill="none" aria-hidden>
              <g stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.5">
                <circle cx="62" cy="92" r="11" />
                <path d="M62 103 L92 112 M62 103 L92 96" />
                <circle cx="128" cy="58" r="11" />
                <path d="M128 69 L104 84 M128 69 L150 80" />
              </g>
              <path d="M96 96 C 150 100 160 124 132 132" stroke="var(--clay)" strokeWidth="8" strokeLinecap="round" />
            </svg>
            <span className="text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.14em]">Guarda fechada</span>
          </div>
          <div className="absolute inset-0 p-[var(--space-md)]">
            <Pictograma slug="guarda-fechada" kind="pos" />
          </div>
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2 text-[length:var(--step-3xs)] font-medium uppercase tracking-[0.12em] text-[var(--ink-faint)]">
            <span>Lâmina 01</span>
            <span>Guarda Fechada</span>
          </figcaption>
        </figure>
      </section>

      {/* ---------- Como funciona — 3 passos pro iniciante não se perder ---------- */}
      <section aria-labelledby="como-funciona-titulo" className="border-t py-[var(--space-3xl)]">
        <p className="text-[length:var(--step-xs)] font-semibold uppercase tracking-[0.16em] text-[var(--grau-deep)]">
          Como funciona
        </p>
        <h2
          id="como-funciona-titulo"
          className="mt-[var(--space-xs)] max-w-[24ch] font-display text-[length:var(--step-3)] font-bold leading-tight"
        >
          Você nunca fica sem saber o próximo passo.
        </h2>
        <ol className="mt-[var(--space-2xl)] grid gap-[var(--space-xl)] md:grid-cols-3">
          {[
            {
              n: "01",
              titulo: "Escolha onde você está",
              texto:
                "Toda luta passa por posições. Comece pela mais comum — a guarda fechada — e ache o seu lugar no mapa.",
            },
            {
              n: "02",
              titulo: "Veja seus caminhos",
              texto:
                "Cada posição abre saídas: raspar, passar, finalizar ou perder. A cor diz o que cada caminho faz no jogo.",
            },
            {
              n: "03",
              titulo: "Siga o passo a passo",
              texto:
                "Cada caminho vem com o porquê e o como — explicado como um bom professor explica, no português do tatame: “não força, deixa ele vir e usa o peso dele”.",
            },
          ].map((p) => (
            <li key={p.n} className="flex flex-col gap-[var(--space-xs)]">
              {/* Numeral de módulo no canal latão (hierarquia/passo), não na marca clay. */}
              <span className="font-display text-[length:var(--step-2)] font-extrabold leading-none tabular-nums text-[var(--grau)]">
                {p.n}
              </span>
              <h3 className="font-display text-[length:var(--step-0t)] font-bold leading-tight text-[var(--ink)]">
                {p.titulo}
              </h3>
              <p className="max-w-[34ch] text-[length:var(--step-0)] leading-relaxed text-[var(--ink-soft)]">
                {p.texto}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Stats — volume como prova de profundidade, não cobrança ----------
          H3: os números são PROVA discreta, não um painel de métricas SaaS. Peso reduzido
          (--step-1 semibold ink-soft, não --step-2 extrabold ink) e dispostos numa fileira de
          recuo (paper-sunk) em vez de células com borda. A ênfase ("Comece com uma") fica no
          canal latão; os números só sustentam. */}
      <section aria-label="O que já está mapeado" className="border-t py-[var(--space-2xl)]">
        <p className="mb-[var(--space-lg)] max-w-[48ch] text-[length:var(--step-0h)] leading-relaxed text-[var(--ink-soft)]">
          <strong className="font-display font-bold text-[var(--grau-deep)]">Comece com uma.</strong>{" "}
          Duas guardas, mapeadas a fundo — cada saída com figura, passo a passo e vídeo-aula. Mais
          posições chegam em breve.
        </p>
        <dl className="flex flex-wrap items-baseline gap-x-[var(--space-xl)] gap-y-[var(--space-sm)] rounded-[12px] bg-[var(--paper-sunk)] px-[var(--space-lg)] py-[var(--space-md)]">
          {[
            { n: 2, label: "guardas" },
            { n: numFinais, label: "finalizações" },
            { n: numRaspagens, label: "raspagens" },
            { n: numVideos, label: "vídeo-aulas" },
          ]
            // Stat zerada não vira um "0" solto e confuso — esconde a célula.
            .filter((s) => s.n > 0)
            .map((s) => (
              <div key={s.label} className="flex items-baseline gap-[var(--space-xs)]">
                <dd className="font-display text-[length:var(--step-1)] font-semibold tabular-nums text-[var(--ink-soft)]">
                  {s.n}
                </dd>
                <dt className="text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                  {s.label}
                </dt>
              </div>
            ))}
        </dl>
        <p className="mt-[var(--space-md)] text-[length:var(--step-xs)] text-[var(--ink-faint)]">
          Tudo de graça, sem cadastro, sem cartão.
        </p>
      </section>

      {/* ---------- Mapa (preview, NÃO o grafo inteiro) ---------- */}
      <section
        id="mapa"
        aria-labelledby="mapa-titulo"
        className="scroll-mt-20 pb-[var(--space-3xl)] pt-[var(--space-2xl)]"
      >
        <header className="mb-[var(--space-lg)] flex flex-wrap items-end justify-between gap-[var(--space-md)]">
          <div>
            <h2 id="mapa-titulo" className="font-display text-[length:var(--step-3)] font-bold leading-tight">
              O mapa
            </h2>
            <p className="mt-[2px] max-w-[60ch] text-[length:var(--step-0)] text-[var(--ink-soft)]">
              Cada caminho leva a algo: acabar o jogo com uma finalização ou virar por cima com
              uma raspagem. Toque numa posição e siga as linhas.
            </p>
          </div>
          <ul
            aria-label="Legenda de cores das saídas"
            className="flex flex-wrap gap-[var(--space-md)] text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.08em]"
          >
            <li className="flex items-center gap-[6px]" style={{ color: "var(--finalizacao)" }}>
              <i aria-hidden className="h-[7px] w-[7px] rounded-full" style={{ background: "var(--finalizacao)" }} />
              Finaliza
            </li>
            <li className="flex items-center gap-[6px]" style={{ color: "var(--raspagem)" }}>
              <i aria-hidden className="h-[7px] w-[7px] rounded-full" style={{ background: "var(--raspagem)" }} />
              Raspa
            </li>
          </ul>
        </header>
        <LandingMapPreview />
      </section>

      {/* ---------- Princípios ---------- */}
      <section aria-labelledby="principios-titulo" className="border-t py-[var(--space-3xl)]">
        <div className="grid gap-[var(--space-2xl)] md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[length:var(--step-xs)] font-semibold uppercase tracking-[0.16em] text-[var(--grau-deep)]">
              O porquê
            </p>
            <h2
              id="principios-titulo"
              className="mt-[var(--space-xs)] font-display text-[length:var(--step-3)] font-bold leading-tight"
            >
              Princípios da guarda fechada
            </h2>
            <p className="mt-[var(--space-md)] max-w-[40ch] text-[length:var(--step-0)] text-[var(--ink-soft)]">
              Técnica sem princípio é decoreba. Entenda isto e o resto se encaixa.
            </p>
          </div>
          <ol className="no-copy flex flex-col">
            {raiz.principios.map((p, i) => (
              <li
                key={i}
                className="flex gap-[var(--space-md)] border-b py-[var(--space-md)] last:border-b-0"
              >
                {/* "Regra de ouro": numeral de princípio no canal latão (ênfase/hierarquia). */}
                <span className="font-display text-[length:var(--step-1)] font-bold leading-none text-[var(--grau)] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[length:var(--step-0r)] leading-relaxed text-[var(--ink)]">{p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Contraste: NÃO é PDF de IA, É mapa curado no tatame ---------- */}
      <section aria-labelledby="contraste-titulo" className="border-t py-[var(--space-3xl)]">
        <p className="text-[length:var(--step-xs)] font-semibold uppercase tracking-[0.16em] text-[var(--clay-deep)]">
          O que isto não é
        </p>
        <h2
          id="contraste-titulo"
          className="mt-[var(--space-xs)] max-w-[28ch] font-display text-[length:var(--step-3)] font-bold leading-tight"
        >
          Não é um PDF gerado por IA. É um mapa curado no tatame.
        </h2>
        {/* Hierarquia assimétrica de propósito: a afirmação LIDERA (bloco grande, regra clay
            de serigrafia, tom de tinta cheia); o concorrente é REBAIXADO a um aparte miúdo e
            quieto embaixo — não uma coluna equivalente numa tabela de comparação. A forma
            acompanha a voz: a gente afirma, o concorrente é nota de rodapé. */}
        <div className="mt-[var(--space-2xl)] max-w-[60ch]">
          <div
            className="rounded-[12px] border border-[var(--paper-edge)] bg-[var(--paper)] p-[var(--space-xl)]"
            style={{ boxShadow: "inset 3px 0 0 var(--clay)" }}
          >
            <p className="text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.14em] text-[var(--clay-deep)]">
              O Atlas
            </p>
            <p className="mt-[var(--space-sm)] text-[length:var(--step-0h)] leading-relaxed text-[var(--ink)]">
              Olha: você não precisa de mais técnica, precisa entender o jogo. Aqui cada caminho tem
              cor, princípio e passo a passo — explicado como o professor te corrige no tatame:
              &ldquo;tira o cotovelo de dentro, fecha a guarda, agora levanta o quadril&rdquo;. Você
              entende, não decora.
            </p>
          </div>
          <p className="mt-[var(--space-md)] pl-[var(--space-md)] text-[length:var(--step-xs)] leading-snug text-[var(--ink-faint)]">
            <span className="font-semibold uppercase tracking-[0.12em]">O concorrente:</span>{" "}
            <span className="line-through decoration-[var(--paper-edge)]">
              um PDF de IA com um monte de técnica solta, sem ordem e sem o porquê
            </span>{" "}
            — você decora, esquece, e continua apanhando embaixo.
          </p>
        </div>
      </section>

      {/* ---------- Da guarda fechada, você pode ---------- */}
      <section
        id="biblioteca"
        aria-labelledby="biblioteca-titulo"
        className="scroll-mt-20 border-t py-[var(--space-3xl)]"
      >
        <header className="mb-[var(--space-2xl)]">
          <h2 id="biblioteca-titulo" className="font-display text-[length:var(--step-3)] font-bold leading-tight">
            Da guarda fechada, você pode…
          </h2>
          <p className="mt-[2px] max-w-[60ch] text-[length:var(--step-0)] text-[var(--ink-soft)]">
            Toque numa saída pra ver o passo a passo.
          </p>
        </header>
        <TransicaoIndice transicoes={saidas} />
      </section>

      {/* ---------- CTA de fechamento — repete o valor e o caminho ---------- */}
      <section aria-labelledby="cta-titulo" className="border-t py-[var(--space-3xl)]">
        <div className="flex flex-col items-start gap-[var(--space-lg)]">
          <h2
            id="cta-titulo"
            className="max-w-[20ch] font-display text-[length:var(--step-3)] font-bold leading-tight text-[var(--ink)]"
          >
            Comece pela guarda fechada. De graça, agora.
          </h2>
          <p className="max-w-[48ch] text-[length:var(--step-0r)] leading-relaxed text-[var(--ink-soft)]">
            Sem cadastro, sem cartão. Explore o mapa inteiro da guarda fechada e veja se faz sentido
            pro seu jogo.
          </p>
          <div className="flex flex-wrap items-center gap-[var(--space-md)]">
            <Link
              href="/mapa"
              className="rounded-full bg-[var(--ink)] px-[var(--space-xl)] py-[var(--space-sm)] text-[length:var(--step-0)] font-semibold text-[var(--paper)] transition-transform duration-200 hover:-translate-y-[1px]"
            >
              Abrir o mapa →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Atlas / dataset note ---------- */}
      <section aria-label="Sobre as figuras e a fonte de dados" className="border-t py-[var(--space-2xl)]">
        <p className="max-w-[68ch] text-[length:var(--step-xs)] leading-relaxed text-[var(--ink-soft)]">
          <strong className="text-[var(--ink)]">As figuras:</strong> derivadas do{" "}
          <a
            href="https://eelis.net/GrappleMap/"
            className="text-[var(--clay)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GrappleMap
          </a>{" "}
          (domínio público, eelis.net), posadas em 3D e desenhadas pra leitura clara. Conteúdo e
          tradução no vocabulário do tatame brasileiro.
        </p>
      </section>
    </div>
  );
}
