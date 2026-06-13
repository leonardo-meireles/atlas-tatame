import type { NextConfig } from "next";

// GitHub Pages: set GITHUB_PAGES=true to enable static export + basePath.
// Vercel/local: leave unset — keeps server mode with security headers.
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const isDev = process.env.NODE_ENV !== "production";
const SCRIPT_SRC = isDev ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";
const CONNECT_SRC = isDev ? "'self' ws: wss:" : "'self'";

const CSP = [
  "default-src 'self'",
  `script-src ${SCRIPT_SRC}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://i.ytimg.com",
  "frame-src https://www.youtube-nocookie.com",
  `connect-src ${CONNECT_SRC}`,
  "font-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";
const EXTRAS_CACHE = "public, max-age=3600, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: isGitHubPages ? { unoptimized: true } : undefined,
  experimental: {
    // Tree-shaking agressivo das libs pesadas de grafo e 3D.
    optimizePackageImports: [
      "three",
      "@react-three/drei",
      "@react-three/fiber",
      "@xyflow/react",
      "@dagrejs/dagre",
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        source: "/figura/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
      {
        source: "/grafo/extras.json",
        headers: [{ key: "Cache-Control", value: EXTRAS_CACHE }],
      },
    ];
  },
};

export default nextConfig;
