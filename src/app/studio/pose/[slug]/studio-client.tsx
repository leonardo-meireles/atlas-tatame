"use client";

import dynamic from "next/dynamic";

// dynamic ssr:false PRECISA viver num Client Component (Next 16/Turbopack rejeita em RSC).
const PoseEditor = dynamic(() => import("@/components/pose-editor").then((m) => m.PoseEditor), {
  ssr: false,
});

export function StudioClient({ slug }: { slug: string }) {
  return <PoseEditor slug={slug} />;
}
