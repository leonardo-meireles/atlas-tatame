import { ImageResponse } from "next/og";

// OG image gerada no build/edge — preview no WhatsApp/IG/Twitter. Sem asset externo.
export const dynamic = "force-static";
export const alt = "Atlas Jiu-Jitsu — o mapa do jogo, em português";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Paleta do card OG. Satori (next/og) NÃO lê CSS custom properties em runtime, então os
 * tokens OKLCH de `globals.css` não chegam aqui. Em vez de hex aleatório, estes valores
 * são o sRGB-equivalente NOMEADO de cada token de marca — mapeamento explícito, intencional,
 * e auditável. Ao mudar um token, atualizar o par correspondente abaixo (uma fonte por linha).
 *
 *   OG_MAT      ↔ --mat        oklch(0.235 0.01 78)   lona escura (fundo, topo do gradiente)
 *   OG_MAT_2    ↔ --mat-2      oklch(0.285 0.011 80)  tile/superfície (base do gradiente)
 *   OG_CLAY     ↔ --clay-on-mat oklch(0.64 0.17 32)   faixa/couro (eyebrow + barra finaliza)
 *   OG_ON_MAT   ↔ --on-mat     oklch(0.93 0.008 88)   osso (título sobre a lona)
 *   OG_ON_SOFT  ↔ --on-mat-soft oklch(0.74 0.01 82)   osso suave (lede)
 *   OG_FAINT    ↔ entre --mat-line/--on-mat-soft      metadados (assinatura)
 *   OG_RASPAGEM ↔ --raspagem-on-mat oklch(0.72 0.12 166) jade (barra raspa)
 *   OG_FINAL    ↔ --finalizacao-on-mat oklch(0.66 0.18 26) sangue (barra finaliza)
 */
const OG = {
  mat: "#1b1410",
  mat2: "#241a13",
  clay: "#c98a63",
  onMat: "#f4ece2",
  onSoft: "#c0b3a4",
  faint: "#8f8475",
  raspagem: "#3f8f6b",
  finalizacao: "#c2452f",
} as const;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(145deg, ${OG.mat} 0%, ${OG.mat2} 100%)`,
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: OG.clay, textTransform: "uppercase", fontWeight: 700 }}>
          Atlas do tatame
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, color: OG.onMat, lineHeight: 1.04, maxWidth: 980 }}>
            Embaixo não é o fim. É o começo.
          </div>
          <div style={{ display: "flex", fontSize: 34, color: OG.onSoft, maxWidth: 900, lineHeight: 1.3 }}>
            O mapa do Jiu-Jitsu pra quem ainda apanha na guarda — raspar, passar, finalizar.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 34, height: 6, borderRadius: 3, background: OG.raspagem }} />
          <div style={{ display: "flex", width: 34, height: 6, borderRadius: 3, background: OG.finalizacao }} />
          <div style={{ display: "flex", fontSize: 26, color: OG.faint, marginLeft: 8 }}>
            atlas-jiujitsu · português do tatame
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
