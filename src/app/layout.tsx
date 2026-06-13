import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Bricolage (display) usa só 600/700/800 no app — 500 (font-medium) não aparece
// em nenhum heading. Hanken (corpo) usa 400/500/600/700.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITULO = "Atlas Jiu-Jitsu — o mapa do jogo, em português";
const DESCRICAO =
  "O atlas do Jiu-Jitsu: cada posição mostra seus caminhos — raspar, passar, finalizar. Princípio antes de técnica, no português do tatame. Pare de travar na guarda.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITULO,
  description: DESCRICAO,
  applicationName: "Atlas Jiu-Jitsu",
  keywords: ["jiu-jitsu", "bjj", "guarda fechada", "raspagem", "finalização", "iniciante", "tatame"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Atlas Jiu-Jitsu",
    url: SITE_URL,
    title: TITULO,
    description: DESCRICAO,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${bricolage.variable} ${hanken.variable} h-full`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
