// Turbopack requires a non-empty generateStaticParams for dynamic routes in output:export.
// The placeholder slug produces one static page that shows the dev-only message.
// In pnpm dev, this file is not used for static generation — the editor loads normally.
export async function generateStaticParams() {
  return [{ slug: "dev" }];
}

export default async function StudioPosePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (process.env.NODE_ENV !== "development") {
    return (
      <div className="mx-auto max-w-2xl p-8 text-[var(--ink)]">
        <h1 className="font-display text-2xl font-bold">Studio</h1>
        <p className="mt-4 text-[var(--ink-soft)]">
          Editor de poses disponível só em desenvolvimento. Rode <code>pnpm dev</code> local pra usar.
        </p>
      </div>
    );
  }

  const { StudioClient } = await import("./studio-client");
  return <StudioClient slug={slug} />;
}
