import type { Metadata } from "next";
import { MapaV2Explorer } from "@/components/mapa-v2-explorer";

export const metadata: Metadata = {
  title: "O Mapa (vista 2D) — Atlas Jiu-Jitsu",
  description:
    "Explore a guarda como um mapa, com figura 2D, vídeo e passo a passo num painel ao lado — sem animação 3D.",
};

// Vista ALTERNATIVA do mapa: grafo + painel 2D (still + vídeo + passos), sem FiguraR3F.
// Client-self-sufficient (graph-client: core estático + extras lazy). Gera no SSG.
export default function MapaV2Page() {
  return (
    <div className="h-[calc(100dvh-3.45rem)] w-full">
      <link rel="preload" as="fetch" href="/grafo/extras.json" crossOrigin="anonymous" />
      <MapaV2Explorer />
    </div>
  );
}
