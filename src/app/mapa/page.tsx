import type { Metadata } from "next";
import { MapaExplorer } from "@/components/mapa-explorer";

export const metadata: Metadata = {
  title: "O Mapa — Atlas Jiu-Jitsu",
  description:
    "Explore a guarda fechada como um mapa: toque numa posição ou técnica e siga as conexões.",
};

export default function MapaPage() {
  // MapaExplorer é client-self-sufficient: usa graph-client (core estático + lazy extras).
  // Server não passa grafo via prop (cortaria ~170K na RSC payload).
  return (
    <div className="h-[calc(100dvh-3.45rem)] w-full">
      <link rel="preload" as="fetch" href="/grafo/extras.json" crossOrigin="anonymous" />
      <MapaExplorer />
    </div>
  );
}
