// Helpers puros pra vídeo do YouTube. Embed leve (facade): thumbnail estático,
// iframe nocookie só ao clicar — zero iframe pesado no load inicial.

/** ID do YouTube = exatamente 11 chars [A-Za-z0-9_-]. */
const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

/** Valida antes de interpolar em URL/iframe src — barra ID malformado virar src
 *  arbitrário. Conteúdo vem do curador (grafo.ts), não de input de runtime; defesa de borda. */
export function youtubeIdValido(id: string): boolean {
  return YOUTUBE_ID_RE.test(id);
}

function exigeId(id: string): string {
  if (!YOUTUBE_ID_RE.test(id)) throw new Error(`youtubeId inválido: ${id}`);
  return id;
}

/** Thumbnail estático do vídeo (hqdefault — sempre existe). */
export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${exigeId(id)}/hqdefault.jpg`;
}

/** URL de embed (privacy-enhanced nocookie). autoplay opcional após o clique. */
export function youtubeEmbed(id: string, autoplay = false): string {
  const base = `https://www.youtube-nocookie.com/embed/${exigeId(id)}`;
  return autoplay ? `${base}?autoplay=1` : base;
}

/** Link pra assistir direto no YouTube (crédito/fallback). */
export function youtubeWatch(id: string): string {
  return `https://www.youtube.com/watch?v=${exigeId(id)}`;
}
