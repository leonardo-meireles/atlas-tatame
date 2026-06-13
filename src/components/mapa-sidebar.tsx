"use client";

/**
 * Índice do atlas — rail de navegação na lona. Ancora o mar de ~400 posições aos
 * poucos LANDMARKS (conceitos), agrupados por família, e mostra "você está aqui".
 * O mapa continua sendo o herói; isto é a legenda/índice que orienta — não um menu SaaS.
 */
import type { Grafo } from "@/lib/types";
import { limpaNome } from "@/lib/nome";
import { tipoMeta, TIPOS_ORDENADOS } from "@/lib/tipo";
import { TrilhaFaixaBranca } from "./trilha-faixa-branca";

/** Famílias canônicas — os landmarks que ancoram a navegação.
 *  MVP guard-only: só as guardas básicas curadas. Resto (cima, costas) vem depois. */
const FAMILIAS: { titulo: string; slugs: string[] }[] = [
  {
    titulo: "Guardas · por baixo",
    slugs: ["guarda-fechada", "meia-guarda"],
  },
];

export function MapaSidebar({
  grafo,
  atual,
  ondeEstou,
  onIr,
  mobileAberto = true,
}: {
  grafo: Grafo;
  /** slug do nó em foco (posição ou transição). */
  atual: string;
  /** rótulo do "você está aqui" (nome do nó atual). */
  ondeEstou?: { nome: string; tipo: string; cor: string };
  onIr: (slug: string) => void;
  /** No mobile (<768px), controla se a sidebar tá aberta (drawer overlay). Desktop ignora. */
  mobileAberto?: boolean;
}) {
  const nomePorSlug = new Map(grafo.posicoes.map((p) => [p.slug, p.nome]));

  // Legenda — só os tipos de transição que aparecem no mapa atual, na ordem canônica.
  // Orienta o iniciante: o que cada cor de linha significa no jogo.
  const tiposPresentes = TIPOS_ORDENADOS.filter((tipo) =>
    grafo.transicoes.some((t) => t.tipo === tipo),
  );

  // Drawer fechado no mobile: além de sair de cena (translateX), precisa sair do fluxo
  // de foco/AT — só transladar deixa os botões off-canvas ainda tabáveis dentro de um
  // aria-hidden (violação clássica). `inert` zera foco + semântica de uma vez.
  const fechadoNoMobile = !mobileAberto;

  return (
    <aside
      id="mapa-indice"
      className="absolute inset-y-0 left-0 z-30 flex h-full w-[clamp(208px,72vw,280px)] shrink-0 flex-col border-r border-[var(--mat-line)] text-[var(--on-mat)] transition-transform duration-300 ease-out md:relative md:w-[clamp(208px,18vw,256px)] md:translate-x-0"
      style={{
        // Sólido (sem a textura .tatame que dava ilusão de transparente). Gradiente sutil
        // de profundidade do topo (mais claro) pro fundo, on-brand quente.
        background:
          "linear-gradient(180deg, color-mix(in oklch, var(--mat-2) 92%, var(--clay) 4%) 0%, var(--mat) 60%)",
        boxShadow: "inset -1px 0 0 oklch(1 0 0 / 0.03), inset 1px 0 0 oklch(0 0 0 / 0.18)",
        transform: mobileAberto ? undefined : "translateX(-100%)",
      }}
      aria-hidden={fechadoNoMobile}
      inert={fechadoNoMobile}
    >
      {/* Cabeçalho — marca de atlas, não logo de app */}
      <div className="border-b border-[var(--mat-line)] px-[var(--space-md)] py-[var(--space-md)]">
        <div className="text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.22em] text-[var(--on-mat-soft)]">Atlas do tatame</div>
        <div className="mt-[2px] font-display text-[length:var(--step-0h)] font-bold leading-tight">Mapas da Guarda</div>
      </div>

      {/* Você está aqui */}
      {ondeEstou && (
        <div className="border-b border-[var(--mat-line)] px-[var(--space-md)] py-[var(--space-sm)]">
          <div className="text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.18em] text-[var(--on-mat-soft)]">Você está aqui</div>
          <div className="mt-[3px] flex items-center gap-[6px]">
            <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: ondeEstou.cor }} />
            <span className="truncate font-display text-[length:var(--step-0s)] font-bold leading-tight">{limpaNome(ondeEstou.nome)}</span>
          </div>
        </div>
      )}

      {/* Famílias — landmarks pra saltar. Trilha guiada vem primeiro (caminho do iniciante). */}
      <nav aria-label="Índice do atlas" className="nowheel nodrag min-h-0 flex-1 overflow-y-auto px-[var(--space-sm)] py-[var(--space-sm)]">
        <TrilhaFaixaBranca grafo={grafo} atual={atual} onIr={onIr} />
        {FAMILIAS.map((fam) => {
          const itens = fam.slugs.filter((s) => nomePorSlug.has(s));
          if (itens.length === 0) return null;
          return (
            <div key={fam.titulo} className="mb-[var(--space-md)]">
              <div className="px-[var(--space-xs)] pb-[6px] text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.16em] text-[var(--on-mat-soft)]">
                {fam.titulo}
              </div>
              <ul className="flex flex-col gap-[1px]">
                {itens.map((slug) => {
                  const on = slug === atual;
                  return (
                    <li key={slug}>
                      <button
                        onClick={() => onIr(slug)}
                        aria-current={on ? "true" : undefined}
                        className="group flex w-full items-center gap-[8px] rounded-[7px] px-[var(--space-xs)] py-[7px] text-left transition-colors"
                        style={{
                          background: on ? "color-mix(in oklch, var(--clay) 22%, transparent)" : "transparent",
                        }}
                      >
                        <span
                          className="h-[6px] w-[6px] shrink-0 rounded-full transition-colors"
                          style={{ background: on ? "var(--clay-on-mat)" : "var(--mat-line)" }}
                        />
                        <span
                          className="truncate text-[length:var(--step-0s)] font-medium transition-colors"
                          style={{ color: on ? "var(--on-mat)" : "var(--on-mat-soft)" }}
                        >
                          {nomePorSlug.get(slug)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Legenda — o que cada cor de linha significa. Orienta o iniciante. */}
      {tiposPresentes.length > 0 && (
        <div className="border-t border-[var(--mat-line)] px-[var(--space-md)] py-[var(--space-sm)]">
          <div className="pb-[6px] text-[length:var(--step-4xs)] font-semibold uppercase tracking-[0.16em] text-[var(--on-mat-soft)]">
            As cores das linhas
          </div>
          <ul className="flex flex-col gap-[5px]">
            {tiposPresentes.map((tipo) => {
              const meta = tipoMeta(tipo);
              return (
                <li key={tipo} className="flex items-start gap-[7px]">
                  <span
                    className="mt-[5px] h-[3px] w-[14px] shrink-0 rounded-full"
                    style={{ background: meta.corOnMat }}
                    aria-hidden
                  />
                  <span className="min-w-0 leading-snug">
                    <span className="text-[length:var(--step-2xs)] font-semibold text-[var(--on-mat)]">{meta.rotulo}</span>
                    <span className="block text-[length:var(--step-3xs)] text-[var(--on-mat-soft)]">{meta.sentido}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Rodapé — dica de navegação */}
      <div className="border-t border-[var(--mat-line)] px-[var(--space-md)] py-[var(--space-sm)] text-[length:var(--step-3xs)] leading-snug text-[var(--on-mat-soft)]">
        Toque numa linha colorida pra ver a técnica. Siga as conexões pra explorar.
      </div>
    </aside>
  );
}
