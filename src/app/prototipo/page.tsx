"use client";

import Image from "next/image";
import {
  Fraunces,
  Hedvig_Letters_Serif,
  Instrument_Serif,
} from "next/font/google";
import { useState, type CSSProperties } from "react";

/**
 * Rota descartável de comparação — Fase 1 do PRD (figuras-grapplemap-pipeline).
 * Mostra 3 variações de estilo-da-casa da MESMA pose de guarda fechada
 * (mesma câmera) pro dono escolher a identidade visual. Auto-contida.
 *
 * Também hospeda o "picker" interno de Direções de UI (cor/fonte secundária)
 * proposto no dossiê impeccable. Como é uma página de comparação interna (não
 * faz parte da marca ao vivo), os tokens OKLCH das direções ficam INLINE aqui —
 * exceção documentada: é o seletor; nada entra em globals.css até a escolha.
 */

// --- Fontes display das direções (carregadas só nesta rota interna) ---
const fraunces = Fraunces({
  variable: "--font-dir-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});
const hedvig = Hedvig_Letters_Serif({
  variable: "--font-dir-hedvig",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const instrument = Instrument_Serif({
  variable: "--font-dir-instrument",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

type Variante = {
  id: "A" | "B" | "C";
  titulo: string;
  descricao: string;
  src: string;
};

const VARIANTES: Variante[] = [
  {
    id: "A",
    titulo: "Cápsula-toon",
    descricao:
      "Cápsulas chapadas em dois tons (tinta vs. couro), juntas esféricas, contorno nítido.",
    src: "/stills/prototipo/A-capsula-toon.png",
  },
  {
    id: "B",
    titulo: "Prancha técnica",
    descricao:
      "Traço de tinta preta — silhueta e linhas de contorno. Pegada de prancha de anatomia.",
    src: "/stills/prototipo/B-lineart.png",
  },
  {
    id: "C",
    titulo: "Traço + meio-tom",
    descricao:
      "A prancha técnica com preenchimento em retícula nos dois tons. Cara de serigrafia.",
    src: "/stills/prototipo/C-lineart-halftone.png",
  },
];

// ============================================================
// Direções de UI — cor/fonte secundária (do dossiê impeccable)
// Cada direção propõe UM acento secundário (clay continua a marca)
// + UM par display alternativo. Tokens OKLCH inline = exceção do picker.
// ============================================================

type ChipAmostra = {
  rotulo: string;
  /** cor funcional já existente no sistema (não muda entre direções) */
  cor: string;
  corTint: string;
};

/** Os 3 chips funcionais-âncora que o dono precisa ver lado a lado. */
const CHIPS_FUNCIONAIS: ChipAmostra[] = [
  { rotulo: "Raspagem", cor: "var(--raspagem)", corTint: "var(--raspagem-tint)" },
  {
    rotulo: "Finalização",
    cor: "var(--finalizacao)",
    corTint: "var(--finalizacao-tint)",
  },
  { rotulo: "Perda de guarda", cor: "var(--perda)", corTint: "var(--perda-tint)" },
];

type DirecaoUI = {
  id: "A" | "B" | "C";
  nome: string;
  tese: string;
  /** nome semântico do acento secundário (ex: "grau", "norte", "musgo") */
  secundarioNome: string;
  secundarioPapel: string;
  /** tokens OKLCH inline — escopados no wrapper, não em globals.css */
  tokens: Record<string, string>;
  fonteDisplay: string;
  fonteVar: string;
  fonteNota: string;
};

const DIRECOES: DirecaoUI[] = [
  {
    id: "A",
    nome: "Faixa-Graduada",
    tese: "Couro + latão envelhecido. O secundário vira a cor de graduação/progressão (módulo, grau, selo de domínio) — sem competir com a faixa (clay) nem com as funcionais.",
    secundarioNome: "Grau (latão)",
    secundarioPapel: "Módulo · eyebrow · demo curada · grau",
    tokens: {
      "--dir-acento": "oklch(0.62 0.09 78)",
      "--dir-acento-deep": "oklch(0.50 0.085 76)",
      "--dir-acento-tint": "oklch(0.91 0.04 82)",
      "--dir-acento-on-mat": "oklch(0.74 0.10 80)",
    },
    fonteDisplay: "Fraunces",
    fonteVar: fraunces.style.fontFamily,
    fonteNota:
      "Serif com inktraps e wonk editorial — pegada de tratado técnico/almanaque impresso.",
  },
  {
    id: "B",
    nome: "Lona & Tinta",
    tese: "Mono-cromático disciplinado + um único respiro frio. O secundário é um aço dessaturado escuro (NÃO o azul-de-IA: chroma baixíssimo) reservado só p/ orientação/wayfinding — separa cor-de-ação de cor-de-onde-estou.",
    secundarioNome: "Norte (aço-frio)",
    secundarioPapel: "Orientação · 'vem de / chega por' · breadcrumb",
    tokens: {
      "--dir-acento": "oklch(0.45 0.045 245)",
      "--dir-acento-deep": "oklch(0.36 0.045 248)",
      "--dir-acento-tint": "oklch(0.90 0.02 242)",
      "--dir-acento-on-mat": "oklch(0.68 0.06 245)",
    },
    fonteDisplay: "Hedvig Letters Serif",
    fonteVar: hedvig.style.fontFamily,
    fonteNota:
      "Geométrica-humanista de terminais secos, distinta de Bricolage mas igualmente não-reflexo. Chroma 0.045 passa longe do azul saturado de IA.",
  },
  {
    id: "C",
    nome: "Serigrafia de Academia",
    tese: "Mais quente, mais artesanal — empurra o lado papel-impresso/fanzine-de-dojo. Secundário = musgo terroso p/ referência/glossário/princípio (o 'porquê' calmo, vegetal), distinto do jade-raspagem (ação).",
    secundarioNome: "Musgo (oliva)",
    secundarioPapel: "Princípio · glossário · o-porquê",
    tokens: {
      "--dir-acento": "oklch(0.50 0.06 140)",
      "--dir-acento-deep": "oklch(0.40 0.055 142)",
      "--dir-acento-tint": "oklch(0.90 0.035 138)",
      "--dir-acento-on-mat": "oklch(0.70 0.08 140)",
    },
    fonteDisplay: "Instrument Serif",
    fonteVar: instrument.style.fontFamily,
    fonteNota:
      "Display-serif de alto contraste, dramática e editorial — almanaque impresso de academia. A direção mais ousada.",
  },
];

/** Painel de uma direção: tipografia + acento secundário + chips + card-exemplo. */
function PainelDirecao({ d }: { d: DirecaoUI }) {
  return (
    <article
      className="flex flex-col gap-[var(--space-md)] rounded-[14px] border bg-[var(--paper-2)] p-[var(--space-lg)]"
      style={
        {
          ...d.tokens,
          "--dir-font": d.fonteVar,
        } as CSSProperties
      }
    >
      {/* Eyebrow + nome da direção */}
      <header>
        <p className="flex items-center gap-[var(--space-sm)] text-[length:var(--step-2xs)] font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
          <span style={{ color: "var(--dir-acento-deep)" }}>Direção {d.id}</span>
          <span aria-hidden className="h-px w-6 bg-[var(--paper-edge)]" />
          {d.fonteDisplay}
        </p>
        <h3
          className="mt-[var(--space-xs)] text-[length:var(--step-2)] font-bold leading-[1.05] tracking-[-0.01em] text-[var(--ink)]"
          style={{ fontFamily: "var(--dir-font)" }}
        >
          {d.nome}
        </h3>
      </header>

      {/* Amostra de corpo (Hanken segue como corpo em todas as direções) */}
      <p className="text-[length:var(--step-0)] leading-relaxed text-[var(--ink-soft)]">
        {d.tese}
      </p>

      {/* Acento secundário — swatch + papel semântico */}
      <div className="flex items-center gap-[var(--space-sm)] rounded-[10px] border bg-[var(--paper)] p-[var(--space-sm)]">
        <span
          aria-hidden
          className="h-9 w-9 shrink-0 rounded-[8px] border"
          style={{ background: "var(--dir-acento)" }}
        />
        <div className="min-w-0">
          <p className="text-[length:var(--step-0s)] font-semibold text-[var(--ink)]">
            {d.secundarioNome}
          </p>
          <p className="text-[length:var(--step-3xs)] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
            {d.secundarioPapel}
          </p>
        </div>
      </div>

      {/* Chips funcionais (cor=significado — NÃO mudam; só p/ ver convivência) */}
      <div>
        <p className="mb-[var(--space-xs)] text-[length:var(--step-3xs)] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
          Chips de tipo (cor funcional fixa)
        </p>
        <div className="flex flex-wrap gap-[var(--space-xs)]">
          {CHIPS_FUNCIONAIS.map((c) => (
            <span
              key={c.rotulo}
              className="inline-flex items-center gap-[6px] rounded-full px-[var(--space-sm)] py-[4px] text-[length:var(--step-2xs)] font-semibold"
              style={{ background: c.corTint, color: c.cor }}
            >
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ background: c.cor }}
              />
              {c.rotulo}
            </span>
          ))}
          {/* O acento secundário como chip de meta (módulo/grau/orientação) */}
          <span
            className="inline-flex items-center gap-[6px] rounded-full px-[var(--space-sm)] py-[4px] text-[length:var(--step-2xs)] font-semibold"
            style={{
              background: "var(--dir-acento-tint)",
              color: "var(--dir-acento-deep)",
            }}
          >
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--dir-acento)" }}
            />
            {d.secundarioNome.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* Card-exemplo: superfície REAL de conteúdo (mini node expandido) */}
      <div className="rounded-[12px] border bg-[var(--paper)] p-[var(--space-md)]">
        <p
          className="flex items-center gap-[var(--space-sm)] text-[length:var(--step-3xs)] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "var(--dir-acento-deep)" }}
        >
          <span
            aria-hidden
            className="h-px w-7"
            style={{ background: "var(--dir-acento)" }}
          />
          Posição-raiz · Módulo 01
        </p>
        <h4
          className="mt-[var(--space-xs)] text-[length:var(--step-1)] font-bold leading-tight text-[var(--ink)]"
          style={{ fontFamily: "var(--dir-font)" }}
        >
          Guarda fechada
        </h4>
        <p className="mt-[var(--space-2xs)] text-[length:var(--step-0s)] leading-snug text-[var(--ink-soft)]">
          Pernas cruzadas atrás das costas do oponente — a raiz do jogo por baixo.
        </p>

        <p className="mt-[var(--space-sm)] text-[length:var(--step-3xs)] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
          Daqui você pode
        </p>
        <ul className="mt-[var(--space-2xs)] flex flex-col gap-[var(--space-2xs)]">
          {[
            { nome: "Raspagem de tesoura", cor: "var(--raspagem)" },
            { nome: "Armlock da guarda", cor: "var(--finalizacao)" },
          ].map((s) => (
            <li
              key={s.nome}
              className="flex items-center gap-[var(--space-xs)] text-[length:var(--step-0s)] text-[var(--ink)]"
            >
              <span
                aria-hidden
                className="h-[10px] w-[10px] shrink-0 rounded-full"
                style={{ background: s.cor }}
              />
              {s.nome}
            </li>
          ))}
        </ul>

        {/* Regra de ouro (1º princípio) — usa o acento secundário p/ o número */}
        <div className="mt-[var(--space-sm)] flex gap-[var(--space-sm)] border-t pt-[var(--space-sm)]">
          <span
            className="text-[length:var(--step-1)] font-bold leading-none"
            style={{
              fontFamily: "var(--dir-font)",
              color: "var(--dir-acento)",
            }}
          >
            01
          </span>
          <p className="text-[length:var(--step-0s)] leading-snug text-[var(--ink-soft)]">
            Quebrar a postura vem primeiro: oponente ereto ataca e passa; curvado,
            só se defende.
          </p>
        </div>
      </div>

      {/* Nota da fonte */}
      <p className="text-[length:var(--step-3xs)] leading-snug text-[var(--ink-faint)]">
        {d.fonteNota}
      </p>
    </article>
  );
}

type Modo = "lado-a-lado" | "foco" | "direcoes";

export default function Prototipo() {
  const [modo, setModo] = useState<Modo>("lado-a-lado");
  const [foco, setFoco] = useState<Variante["id"]>("A");

  const ativa = VARIANTES.find((v) => v.id === foco)!;

  return (
    <div className="mx-auto max-w-6xl px-[var(--space-lg)] py-[var(--space-2xl)]">
      {/* ---------- Cabeçalho ---------- */}
      <header className="mb-[var(--space-xl)] flex flex-wrap items-end justify-between gap-[var(--space-md)]">
        <div>
          <p className="mb-[var(--space-sm)] flex items-center gap-[var(--space-sm)] text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            <span className="text-[var(--clay-deep)]">Protótipo</span>
            <span aria-hidden className="h-px w-8 bg-[var(--paper-edge)]" />
            Estilo das figuras
          </p>
          <h1 className="font-display text-[length:var(--step-3)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[var(--ink)]">
            Três jeitos de desenhar a guarda fechada
          </h1>
          <p className="mt-[var(--space-sm)] max-w-[60ch] text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
            Mesma pose, mesma câmera — só o estilo muda. Compare e escolha a
            identidade visual das posições.
          </p>
        </div>

        {/* Alternador de modo */}
        <div
          className="inline-flex rounded-full border bg-[var(--paper-2)] p-[3px]"
          role="tablist"
          aria-label="Modo de visualização"
        >
          {(
            [
              ["lado-a-lado", "Lado a lado"],
              ["foco", "Foco"],
              ["direcoes", "Direções de UI"],
            ] as const
          ).map(([valor, rotulo]) => (
            <button
              key={valor}
              onClick={() => setModo(valor)}
              className={`rounded-full px-[var(--space-md)] py-[6px] text-[0.82rem] font-semibold transition-colors ${
                modo === valor
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
              }`}
            >
              {rotulo}
            </button>
          ))}
        </div>
      </header>

      {/* ---------- Lado a lado ---------- */}
      {modo === "lado-a-lado" && (
        <div className="grid gap-[var(--space-lg)] md:grid-cols-3">
          {VARIANTES.map((v) => (
            <figure
              key={v.id}
              className="flex flex-col overflow-hidden rounded-[14px] border bg-[var(--paper-2)]"
            >
              <div className="relative aspect-[4/3] border-b bg-[var(--paper)]">
                <Image
                  src={v.src}
                  alt={`Guarda fechada — estilo ${v.titulo}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-[var(--space-md)]"
                  priority={v.id === "A"}
                />
                <span className="absolute left-[var(--space-sm)] top-[var(--space-sm)] grid h-7 w-7 place-items-center rounded-full bg-[var(--ink)] font-display text-[0.9rem] font-bold text-[var(--paper)]">
                  {v.id}
                </span>
              </div>
              <figcaption className="flex flex-col gap-[2px] p-[var(--space-md)]">
                <h2 className="font-display text-[1.15rem] font-bold leading-tight text-[var(--ink)]">
                  {v.titulo}
                </h2>
                <p className="text-[0.88rem] leading-snug text-[var(--ink-soft)]">
                  {v.descricao}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {/* ---------- Foco ---------- */}
      {modo === "foco" && (
        <div className="grid gap-[var(--space-lg)] md:grid-cols-[0.78fr_0.22fr]">
          <figure className="relative overflow-hidden rounded-[14px] border bg-[var(--paper-2)]">
            <div className="relative aspect-[4/3] bg-[var(--paper)]">
              <Image
                key={ativa.src}
                src={ativa.src}
                alt={`Guarda fechada — estilo ${ativa.titulo}`}
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                className="object-contain p-[var(--space-lg)]"
                priority
              />
              <span className="absolute left-[var(--space-md)] top-[var(--space-md)] grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] font-display text-[1.1rem] font-bold text-[var(--paper)]">
                {ativa.id}
              </span>
            </div>
            <figcaption className="border-t p-[var(--space-md)]">
              <h2 className="font-display text-[1.25rem] font-bold leading-tight text-[var(--ink)]">
                {ativa.titulo}
              </h2>
              <p className="mt-[2px] max-w-[60ch] text-[0.92rem] text-[var(--ink-soft)]">
                {ativa.descricao}
              </p>
            </figcaption>
          </figure>

          {/* Seletor vertical */}
          <ul className="flex gap-[var(--space-sm)] md:flex-col">
            {VARIANTES.map((v) => {
              const sel = v.id === foco;
              return (
                <li key={v.id} className="flex-1">
                  <button
                    onClick={() => setFoco(v.id)}
                    aria-pressed={sel}
                    className={`flex w-full items-center gap-[var(--space-sm)] rounded-[12px] border p-[var(--space-sm)] text-left transition-colors ${
                      sel
                        ? "border-[var(--clay)] bg-[var(--clay-tint)]"
                        : "bg-[var(--paper-2)] hover:bg-[var(--paper)]"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-[0.95rem] font-bold ${
                        sel
                          ? "bg-[var(--clay)] text-[var(--paper)]"
                          : "bg-[var(--ink)] text-[var(--paper)]"
                      }`}
                    >
                      {v.id}
                    </span>
                    <span
                      className={`font-display text-[0.95rem] font-semibold leading-tight ${
                        sel ? "text-[var(--clay-deep)]" : "text-[var(--ink)]"
                      }`}
                    >
                      {v.titulo}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ---------- Direções de UI (cor/fonte secundária) ---------- */}
      {modo === "direcoes" && (
        <section>
          <p className="mb-[var(--space-lg)] max-w-[72ch] text-[length:var(--step-0)] leading-relaxed text-[var(--ink-soft)]">
            Três direções de identidade comparadas em superfície REAL de conteúdo
            (não em swatches abstratos). Bricolage + Hanken seguem como baseline; o
            corpo é sempre Hanken. Cada direção propõe <strong>um acento secundário
            </strong> (o sistema hoje só tem o clay como marca) e{" "}
            <strong>um par display alternativo</strong>. As cores funcionais
            (raspagem/finalização/perda) <strong>não mudam</strong> — cor =
            significado. Nenhum token entra em <code>globals.css</code> até a
            escolha.
          </p>
          <div className="grid gap-[var(--space-lg)] lg:grid-cols-3">
            {DIRECOES.map((d) => (
              <PainelDirecao key={d.id} d={d} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-[var(--space-xl)] border-t pt-[var(--space-md)] text-[0.78rem] text-[var(--ink-faint)]">
        Vista de comparação descartável — Fase 1 do pipeline de figuras + picker
        de direções de UI. Não faz parte do produto.
      </p>
    </div>
  );
}
