// Smoke test do agent pose-from-video. NÃO roda em CI: precisa das deps instaladas
// (yt-dlp + ffmpeg + whisper.cpp + modelo). Habilite com:
//   bash scripts/install-agent-deps.sh && AGENT_DEPS_INSTALLED=1 pnpm vitest run .scratch/agent-pose-from-video.smoke.test.ts
import { describe, it, expect } from "vitest";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { poseFromVideo } from "@/lib/agents/pose-from-video";

const DEPS = !!process.env.AGENT_DEPS_INSTALLED;

// Trocar por uma URL pública de aula de BJJ curta (≤30s) quando for rodar de verdade.
const TEST_VIDEO_URL = process.env.AGENT_TEST_VIDEO_URL ?? "";

describe.skipIf(!DEPS)("pose-from-video (smoke, requer deps)", () => {
  if (!TEST_VIDEO_URL) {
    it.todo("definir AGENT_TEST_VIDEO_URL com uma aula de BJJ curta pública");
    return;
  }

  it(
    "extrai transcrição não-vazia e gera o WAV",
    async () => {
      const res = await poseFromVideo({
        url: TEST_VIDEO_URL,
        whisperModel: "tiny",
        frameFps: 1,
        lang: "pt",
      });

      expect(res.transcript.length).toBeGreaterThan(0);
      expect(res.transcript[0].text.length).toBeGreaterThan(0);
      await expect(access(res.audioPath, constants.F_OK)).resolves.toBeUndefined();
      await expect(access(res.framesDir, constants.F_OK)).resolves.toBeUndefined();
      expect(res.durationSec).toBeGreaterThan(0);
    },
    120_000,
  );
});
