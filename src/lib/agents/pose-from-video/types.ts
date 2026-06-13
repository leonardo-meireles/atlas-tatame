// Tipos do agent `pose-from-video`. Sprint A cobre só ingestão + ASR (transcrição).
// Pose estimation (MediaPipe) e alinhamento LLM ficam pros sprints B/C — os tipos-stub
// abaixo já fixam o contrato pra não retrabalhar quando chegar a hora.

/** Um trecho de transcrição com timestamps (segundos). */
export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

/** Resultado da extração do sprint A: vídeo baixado, áudio + frames extraídos, transcrição. */
export interface ExtractionResult {
  videoUrl: string;
  audioPath: string;
  framesDir: string;
  transcript: TranscriptSegment[];
  durationSec: number;
}

/** Opções do pipeline. `outDir` default fica em ./.cache/pose-from-video/<id>. */
export interface PoseFromVideoOptions {
  url: string;
  outDir?: string;
  whisperModel?: "tiny" | "base" | "small";
  frameFps?: number;
  lang?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STUBS — sprint B/C. NÃO usados ainda. Mantidos aqui pra fixar o contrato futuro.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Candidato de pose estimado por frame (sprint B — MediaPipe Pose via subprocess Python).
 * Cada lutador é um mapa junta→[x,y,z] no formato da `figura` (z-up, 23 juntas do SKELETON).
 * `confidence` agrega a confiança do detector pra ranquear frames antes do align.
 */
export interface PoseCandidate {
  // sprint B
  frameIndex: number;
  timeSec: number;
  p0: Record<string, [number, number, number]>;
  p1: Record<string, [number, number, number]>;
  confidence: number;
}

/**
 * Pose final pronta pra emitir em public/figura/poses/<slug>.json (sprint C — align LLM
 * + curadoria). Casa com `PoseFrame` de src/lib/figura/figura-data.ts.
 */
export interface EmittedPose {
  // sprint C
  slug: string;
  p0: Record<string, [number, number, number]>;
  p1: Record<string, [number, number, number]>;
  // meta vai pro src/content/poses-meta.json com source: "agent-video".
  sourceVideoUrl: string;
  sourceTimeSec: number;
}
