# Agent `pose-from-video`

Pipeline que transforma um vídeo de aula de BJJ em poses pra `figura`. **Sprint A** entrega
só a ingestão e a transcrição (ASR); a estimação de pose e o alinhamento vêm depois.

> **Direitos:** fair use educacional. O vídeo é insumo **descartável** — não redistribuímos
> o vídeo, só a pose extraída.

## Instalar deps

```bash
bash scripts/install-agent-deps.sh
# instala yt-dlp + ffmpeg + whisper.cpp + modelo ggml-base.bin (~/.cache/whisper)
```

mac usa `brew`; Linux usa `apt`/`pip` (whisper.cpp pode exigir build manual — o script avisa).

## Rodar a CLI (sprint A)

```bash
pnpm tsx src/lib/agents/pose-from-video/index.ts --url "<URL_DO_VIDEO>" --model base --fps 2 --lang pt
```

Imprime os paths (áudio WAV 16kHz, dir de frames) e a transcrição com timestamps.
Saída default em `./.cache/pose-from-video/<hash-da-url>/`.

Opções: `--url` (obrigatório), `--model tiny|base|small`, `--fps`, `--lang`, `--out`, `--help`.

## O que o sprint A entrega

- `yt-fetch.ts` — download via yt-dlp (mp4 ≤720p, retry).
- `ffmpeg.ts` — `extractAudio` (WAV 16kHz mono) + `extractFrames` (JPG amostrado).
- `whisper.ts` — `transcribe` via whisper.cpp → `TranscriptSegment[]` com timestamps.
- `index.ts` — orquestrador `poseFromVideo()` + CLI.

## Roadmap

- **Sprint B** — pose estimation por frame (MediaPipe Pose, subprocess Python).
  Hook em `index.ts`; tipo `PoseCandidate` em `types.ts`. Saída no formato 23-joints z-up
  do `SKELETON` (ver `src/lib/figura/pose.ts`).
- **Sprint C** — alinhar candidatos à transcrição (LLM) e escolher keyframes → `EmittedPose`.
- **Sprint D** — gravar em `public/figura/poses/<slug>.json` + meta em
  `src/content/poses-meta.json` (`source: "agent-video"`, `status: "rascunho"`).

## Testes

`.scratch/agent-pose-from-video.smoke.test.ts` — só roda com `AGENT_DEPS_INSTALLED=1`
(e `AGENT_TEST_VIDEO_URL`). CI pula.
