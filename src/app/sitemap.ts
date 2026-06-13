import type { MetadataRoute } from "next";
import { getGrafo } from "@/lib/graph";
import { isPublicada } from "@/lib/figura/pose-meta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Só páginas públicas e indexáveis. Rotas internas (/prototipo, /visualizador, /studio) ficam fora.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, "");
  const estaticas: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/mapa`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/precos`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${base}/glossario`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${base}/mapa-v2`, priority: 0.5, changeFrequency: "weekly" },
  ];

  const posicoes = getGrafo()
    .posicoes.filter((p) => isPublicada(p.slug))
    .map((p) => ({
      url: `${base}/posicao/${p.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    }));

  return [...estaticas, ...posicoes];
}
