import { StudioClient } from "./studio-client";

// Editor MVP — gated por NODE_ENV=development. Carrega pose existente, permite arrastar
// juntas via TransformControls, exporta JSON. Owner OU agente IA edita aqui.
export default async function StudioPosePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="mx-auto max-w-2xl p-8 text-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold">Studio</h1>
        <p className="mt-4 text-[var(--ink-soft)]">
          Editor de poses disponível só em desenvolvimento. Rode <code>pnpm dev</code> local pra usar.
        </p>
      </div>
    );
  }
  return <StudioClient slug={slug} />;
}
