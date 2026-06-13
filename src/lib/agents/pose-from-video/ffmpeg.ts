// Extração de áudio e frames via ffmpeg.
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

function run(cmd: string, args: string[]): Promise<{ code: number; stderr: string }> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args);
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "ENOENT") {
        reject(
          new Error(`ffmpeg não encontrado no PATH. Rode: bash scripts/install-agent-deps.sh`),
        );
      } else {
        reject(err);
      }
    });
    p.on("close", (code) => resolve({ code: code ?? -1, stderr }));
  });
}

/**
 * Extrai o áudio em WAV 16kHz mono (formato que o whisper.cpp espera). Retorna o path.
 */
export async function extractAudio(videoPath: string, outDir: string): Promise<string> {
  await mkdir(outDir, { recursive: true });
  const audioPath = join(outDir, "audio.wav");
  const { code, stderr } = await run("ffmpeg", [
    "-y",
    "-i",
    videoPath,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-acodec",
    "pcm_s16le",
    audioPath,
  ]);
  if (code !== 0) throw new Error(`ffmpeg (áudio) saiu com código ${code}: ${stderr.trim()}`);
  return audioPath;
}

/**
 * Amostra frames em `fps` quadros/segundo como JPG dentro de `outDir/frames`.
 * Retorna o diretório dos frames (consumido pela pose estimation no sprint B).
 */
export async function extractFrames(
  videoPath: string,
  outDir: string,
  fps: number,
): Promise<string> {
  const framesDir = join(outDir, "frames");
  await mkdir(framesDir, { recursive: true });
  const { code, stderr } = await run("ffmpeg", [
    "-y",
    "-i",
    videoPath,
    "-vf",
    `fps=${fps}`,
    "-q:v",
    "2",
    join(framesDir, "frame_%06d.jpg"),
  ]);
  if (code !== 0) throw new Error(`ffmpeg (frames) saiu com código ${code}: ${stderr.trim()}`);
  return framesDir;
}
