/**
 * Ingestão do dataset Kaggle "grappling-techniques" (liiucbs).
 * PRONTO PRA RODAR — só falta a credencial Kaggle (não fica no repo).
 *
 * Setup (uma vez):
 *   1. kaggle.com → Account → "Create New API Token" → baixa kaggle.json
 *   2. mkdir -p ~/.kaggle && mv ~/Downloads/kaggle.json ~/.kaggle/ && chmod 600 ~/.kaggle/kaggle.json
 *      (ou exporte KAGGLE_USERNAME e KAGGLE_KEY no ambiente)
 *
 * Rodar:  pnpm tsx scripts/ingest/kaggle-grappling.ts
 * Saída:  docs/research/raw/kaggle/  (zip extraído) — entra na curadoria (D2+), não em src/ direto.
 *
 * Licença: registrar a licença exibida na página do dataset em docs/research/fontes-conhecimento.md
 * antes de redistribuir qualquer conteúdo derivado (norma do projeto open-source).
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const run = promisify(execFile);
const DATASET = "liiucbs/grappling-techniques";
const OUT = "docs/research/raw/kaggle";

async function credenciais(): Promise<{ user: string; key: string }> {
  if (process.env.KAGGLE_USERNAME && process.env.KAGGLE_KEY) {
    return { user: process.env.KAGGLE_USERNAME, key: process.env.KAGGLE_KEY };
  }
  const path = join(homedir(), ".kaggle", "kaggle.json");
  if (existsSync(path)) {
    const j = JSON.parse(await readFile(path, "utf8"));
    if (j.username && j.key) return { user: j.username, key: j.key };
  }
  throw new Error(
    "Credencial Kaggle ausente. Configure ~/.kaggle/kaggle.json ou KAGGLE_USERNAME/KAGGLE_KEY. Ver cabeçalho deste arquivo.",
  );
}

async function main() {
  const { user, key } = await credenciais();
  await mkdir(OUT, { recursive: true });
  const zip = join(OUT, "grappling-techniques.zip");
  const url = `https://www.kaggle.com/api/v1/datasets/download/${DATASET}`;
  // curl com auth básica (Kaggle API aceita user:key) — evita dependência do pip kaggle.
  await run("curl", ["-fsSL", "-u", `${user}:${key}`, "-o", zip, url]);
  await run("unzip", ["-o", zip, "-d", OUT]);
  await writeFile(
    join(OUT, "PROVENANCE.txt"),
    `Fonte: https://www.kaggle.com/datasets/${DATASET}\nBaixado via Kaggle API.\nRegistrar a licença do dataset em docs/research/fontes-conhecimento.md antes de redistribuir.\n`,
  );
  console.log(`OK — dataset em ${OUT}/. Próximo: normalizar (D2) + traduzir (D3) + curar (D4).`);
}

main().catch((e) => {
  console.error(String(e instanceof Error ? e.message : e));
  process.exit(1);
});
