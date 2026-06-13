// Transcrição via whisper.cpp (cross-platform, sem Python no entry).
import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { TranscriptSegment } from "./types";

const INSTALL_HINT = "Rode: bash scripts/install-agent-deps.sh";

/** Binários candidatos do whisper.cpp — o nome mudou entre versões (main → whisper-cli). */
const WHISPER_BINS = ["whisper-cli", "whisper-cpp", "main"];

/** Diretórios candidatos pro modelo ggml. */
function modelCandidates(model: string): string[] {
  const name = `ggml-${model}.bin`;
  return [
    join(homedir(), ".cache", "whisper", name),
    join(process.cwd(), "models", name),
  ];
}

async function exists(p: string): Promise<boolean> {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** Acha o primeiro binário disponível tentando rodar `--help`. */
async function findBinary(): Promise<string> {
  for (const bin of WHISPER_BINS) {
    const ok = await new Promise<boolean>((resolve) => {
      const p = spawn(bin, ["--help"]);
      p.on("error", () => resolve(false));
      p.on("close", () => resolve(true));
    });
    if (ok) return bin;
  }
  throw new Error(
    `Binário do whisper.cpp não encontrado (tentei: ${WHISPER_BINS.join(", ")}). ${INSTALL_HINT}`,
  );
}

function run(cmd: string, args: string[]): Promise<{ code: number; stderr: string }> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args);
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", reject);
    p.on("close", (code) => resolve({ code: code ?? -1, stderr }));
  });
}

/** Shape parcial do JSON do whisper.cpp (campo --output-json). */
interface WhisperJson {
  transcription?: {
    offsets?: { from: number; to: number };
    timestamps?: { from: string; to: string };
    text?: string;
  }[];
}

/**
 * Transcreve `audioPath` (WAV 16kHz mono) e devolve segmentos com timestamps em segundos.
 * Throw com instrução de install se binário ou modelo estiverem ausentes.
 */
export async function transcribe(
  audioPath: string,
  model: string,
  lang: string,
): Promise<TranscriptSegment[]> {
  const modelPath = await firstExisting(model);
  if (!modelPath) {
    throw new Error(
      `Modelo whisper "ggml-${model}.bin" não encontrado em ${modelCandidates(model).join(" ou ")}. ${INSTALL_HINT}`,
    );
  }

  const bin = await findBinary();
  const outPrefix = audioPath.replace(/\.wav$/, "");
  const { code, stderr } = await run(bin, [
    "-m",
    modelPath,
    "-f",
    audioPath,
    "-l",
    lang,
    "--output-json",
    "--output-file",
    outPrefix,
  ]);
  if (code !== 0) throw new Error(`whisper.cpp saiu com código ${code}: ${stderr.trim()}`);

  // whisper.cpp escreve <prefix>.json.
  const jsonPath = `${outPrefix}.json`;
  if (!(await exists(jsonPath))) {
    throw new Error(`whisper.cpp não gerou ${jsonPath}`);
  }
  const raw = JSON.parse(await readFile(jsonPath, "utf8")) as WhisperJson;
  const segs = raw.transcription ?? [];
  return segs.map((s) => ({
    // offsets vêm em ms → segundos.
    start: (s.offsets?.from ?? 0) / 1000,
    end: (s.offsets?.to ?? 0) / 1000,
    text: (s.text ?? "").trim(),
  }));
}

async function firstExisting(model: string): Promise<string | undefined> {
  for (const c of modelCandidates(model)) {
    if (await exists(c)) return c;
  }
  return undefined;
}
