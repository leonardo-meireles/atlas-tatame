"use client";

/**
 * Figura 2D do nó: pictograma serigrafia (line-art clay-topo / ardósia-embaixo) derivado
 * da MESMA pose 3D do GrappleMap. Sem WebGL — leve o bastante pra todos os nós visíveis
 * (um <Canvas> por nó travaria o browser). O viewer 3D ao vivo fica só no nó expandido.
 */
import { useEffect, useState } from "react";
import { buildPictograma, type PictogramaLayout, type Pose } from "@/lib/figura/pictograma";
import { loadPose, loadTrans, PLAYER } from "@/lib/figura/figura-data";

const TOP = PLAYER.top.base; // clay — por cima
const BOTTOM = PLAYER.bottom.base; // azul — por baixo

export function Pictograma({ slug, kind, fallback }: { slug: string; kind: "pos" | "trans"; fallback?: string }) {
  const [lay, setLay] = useState<PictogramaLayout | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      let frame =
        kind === "trans"
          ? await loadTrans(slug).then((f) => (f ? f[Math.floor(f.length / 2)] : null))
          : await loadPose(slug);
      // Transição curada sem frames próprios → mostra a pose do destino (pra onde leva).
      if (!frame && fallback) frame = await loadPose(fallback);
      // Tap stubs (finalização leaf, para=null) sem trans 3D — recai pra pose da ORIGEM
      // extraída do slug `de__nome__para` (convenção do gerador).
      if (!frame && kind === "trans" && slug.includes("__")) {
        const de = slug.split("__")[0];
        frame = await loadPose(de);
      }
      if (!frame || cancel) return;
      setLay(buildPictograma(frame as unknown as Pose, { width: 234, height: 132, pad: 16 }));
    })();
    return () => {
      cancel = true;
    };
  }, [slug, kind, fallback]);

  if (!lay) return null;
  // de baixo desenhado primeiro (atrás), de cima por cima — leitura de quem domina.
  const ordem = [lay.bottom, lay.top].filter((pk, i, a) => a.indexOf(pk) === i);
  return (
    <svg viewBox={`0 0 ${lay.width} ${lay.height}`} className="figura-surge h-full w-full" aria-hidden>
      {ordem.map((pk) => {
        const f = lay.figuras[pk];
        if (!f) return null;
        const cor = pk === lay.top ? TOP : BOTTOM;
        return (
          <g key={pk} stroke={cor} strokeWidth={lay.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            {f.torso.length >= 3 && (
              <polygon points={f.torso.map(([x, y]) => `${x},${y}`).join(" ")} fill={cor} fillOpacity={0.92} stroke="none" />
            )}
            {f.bones.map((b, i) => (
              <line key={i} x1={b[0][0]} y1={b[0][1]} x2={b[1][0]} y2={b[1][1]} fill="none" />
            ))}
            <circle cx={f.head.cx} cy={f.head.cy} r={f.head.r} fill={cor} stroke="none" />
          </g>
        );
      })}
    </svg>
  );
}
