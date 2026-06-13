// Download de vídeo via yt-dlp. Direitos: fair use educacional — o vídeo NÃO é
// redistribuído, serve só como insumo pra extração de pose (descartável).
import { spawn } from "node:child_process";
import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";

/** Roda um comando e resolve com {code, stdout, stderr}. ENOENT vira erro claro de binário ausente. */
function run(
  cmd: string,
  args: string[],
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args);
    let stdout = "";
    let stderr = "";
    p.stdout.on("data", (d) => (stdout += d.toString()));
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "ENOENT") {
        reject(
          new Error(
            `yt-dlp não encontrado no PATH. Rode: bash scripts/install-agent-deps.sh`,
          ),
        );
      } else {
        reject(err);
      }
    });
    p.on("close", (code) => resolve({ code: code ?? -1, stdout, stderr }));
  });
}

/**
 * Baixa o vídeo em mp4 ≤720p pra `outDir`. Retorna o path do arquivo e o título.
 * Retry simples (2 tentativas) pra tolerar hiccup de rede.
 */
export async function fetchVideo(
  url: string,
  outDir: string,
): Promise<{ videoPath: string; title: string }> {
  await mkdir(outDir, { recursive: true });
  const outTemplate = join(outDir, "%(id)s.%(ext)s");
  // Format pinado: melhor mp4 ≤720p (vídeo+áudio), fallback pra qualquer ≤720p.
  const args = [
    "-f",
    "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best[height<=720]",
    "--merge-output-format",
    "mp4",
    "-o",
    outTemplate,
    "--no-playlist",
    url,
  ];

  let lastErr: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { code, stderr } = await run("yt-dlp", args);
      if (code !== 0) throw new Error(`yt-dlp saiu com código ${code}: ${stderr.trim()}`);
      break;
    } catch (err) {
      lastErr = err;
      // Binário ausente não adianta retentar.
      if (err instanceof Error && err.message.includes("não encontrado")) throw err;
      if (attempt === 2) throw lastErr;
    }
  }

  // Acha o mp4 recém-baixado (yt-dlp não devolve o path final de forma estável via stdout).
  const files = await readdir(outDir);
  const mp4 = files.find((f) => f.endsWith(".mp4"));
  if (!mp4) throw new Error(`yt-dlp rodou mas nenhum .mp4 apareceu em ${outDir}`);
  const videoPath = join(outDir, mp4);

  // Título best-effort (não falha o pipeline se não vier).
  let title = mp4.replace(/\.mp4$/, "");
  try {
    const { code, stdout } = await run("yt-dlp", ["--get-title", "--no-playlist", url]);
    if (code === 0 && stdout.trim()) title = stdout.trim();
  } catch {
    // ignora — título é cosmético.
  }

  return { videoPath, title };
}
