import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Rotas internas/dev — fora do índice de busca.
      disallow: ["/studio", "/prototipo", "/visualizador"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
