// Orquestrador do agent `pose-from-video` (sprint A: ingestão + ASR).
// TS no topo; subprocess Python entra só na pose estimation (sprint B).
import { mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { fetchVideo } from "./yt-fetch";
import { extractAudio, extractFrames } from "./ffmpeg";
import { transcribe } from "./whisper";
import type { ExtractionResult, PoseFromVideoOptions, TranscriptSegment } from "./types";

const DEFAULTS = {
  whisperModel: "base" as const,
  frameFps: 2,
  lang: "pt",
};

/** outDir derivado de um hash curto da URL pra ser estável entre runs. */
function defaultOutDir(url: string): string {
  const id = createHash("sha1").update(url).digest("hex").slice(0, 10);
  return join(process.cwd(), ".cache", "pose-from-video", id);
}

/** Duração em segundos a partir do último segmento da transcrição (best-effort). */
function durationFrom(transcript: TranscriptSegment[]): number {
  return transcript.length ? transcript[transcript.length - 1].end : 0;
}

/**
 * Sprint A: baixa vídeo → extrai áudio + frames → transcreve. Retorna ExtractionResult.
 * Sprints B/C/D ficam comentados como hooks abaixo.
 */
export async function poseFromVideo(opts: PoseFromVideoOptions): Promise<ExtractionResult> {
  const outDir = opts.outDir ?? defaultOutDir(opts.url);
  const whisperModel = opts.whisperModel ?? DEFAULTS.whisperModel;
  const frameFps = opts.frameFps ?? DEFAULTS.frameFps;
  const lang = opts.lang ?? DEFAULTS.lang;
  await mkdir(outDir, { recursive: true });

  const { videoPath } = await fetchVideo(opts.url, outDir);

  // Áudio e frames são independentes → roda em paralelo.
  const [audioPath, framesDir] = await Promise.all([
    extractAudio(videoPath, outDir),
    extractFrames(videoPath, outDir, frameFps),
  ]);

  const transcript = await transcribe(audioPath, whisperModel, lang);

  // ── HOOK sprint B: pose estimation (MediaPipe Pose via subprocess Python) ──
  //   const candidates: PoseCandidate[] = await estimatePoses(framesDir);
  // ── HOOK sprint C: alinhar candidatos à transcrição (LLM) + emitir EmittedPose ──
  //   const emitted: EmittedPose[] = await alignAndEmit(candidates, transcript);
  // ── HOOK sprint D: gravar em public/figura/poses/<slug>.json + meta (source: agent-video) ──
  //   await writePoses(emitted);

  return {
    videoUrl: opts.url,
    audioPath,
    framesDir,
    transcript,
    durationSec: durationFrom(transcript),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI — rodado direto via `tsx src/lib/agents/pose-from-video/index.ts --url ...`
// ─────────────────────────────────────────────────────────────────────────────

const USAGE = `
pose-from-video (sprint A: ingestão + ASR)

Uso:
  tsx src/lib/agents/pose-from-video/index.ts --url <URL> [opções]

Opções:
  --url <URL>        URL do vídeo (obrigatório)
  --model <m>        whisper: tiny | base | small  (default: base)
  --fps <n>          frames por segundo amostrados  (default: 2)
  --lang <l>         idioma do áudio                 (default: pt)
  --out <dir>        diretório de saída              (default: ./.cache/...)
  --help             mostra esta ajuda

Antes de rodar instale as deps: bash scripts/install-agent-deps.sh
`.trim();

function fmtTs(s: number): string {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1).padStart(4, "0");
  return `${String(m).padStart(2, "0")}:${sec}`;
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      url: { type: "string" },
      model: { type: "string" },
      fps: { type: "string" },
      lang: { type: "string" },
      out: { type: "string" },
      help: { type: "boolean" },
    },
    allowPositionals: false,
  });

  if (values.help || !values.url) {
    console.log(USAGE);
    if (!values.url && !values.help) {
      console.error("\nErro: --url é obrigatório.");
      process.exitCode = 1;
    }
    return;
  }

  const model = (values.model ?? DEFAULTS.whisperModel) as "tiny" | "base" | "small";
  const res = await poseFromVideo({
    url: values.url,
    outDir: values.out,
    whisperModel: model,
    frameFps: values.fps ? Number(values.fps) : DEFAULTS.frameFps,
    lang: values.lang ?? DEFAULTS.lang,
  });

  console.log(`\nVídeo:   ${res.videoUrl}`);
  console.log(`Áudio:   ${res.audioPath}`);
  console.log(`Frames:  ${res.framesDir}`);
  console.log(`Duração: ${fmtTs(res.durationSec)}\n`);
  console.log(`Transcrição (${res.transcript.length} segmentos):`);
  for (const s of res.transcript) {
    console.log(`  [${fmtTs(s.start)} → ${fmtTs(s.end)}] ${s.text}`);
  }
}

// Só roda como CLI se o módulo for o entry point (não em import).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error(`\nFalhou: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  });
}
