// Parser de coaches do GrappleMap (`source_repos/GrappleMap/doc/references/*.txt`).
// Cada arquivo = syllabus estruturado de um coach: Series → Volume → Capítulos com
// status (done/wip/later/todo), timestamp e descrição. Vira camada de "instrutores"
// cruzada com o grafo via menções aos nomes das técnicas.

export type CapituloStatus = "done" | "wip" | "later" | "todo" | "none";

export interface Capitulo {
  status: CapituloStatus;
  /** "00:42" (mm:ss) ou "1:23:45" — string preservada como veio. */
  tempo: string;
  /** Número do capítulo dentro do volume. */
  numero: number;
  /** Texto descritivo (uma linha). */
  titulo: string;
  /** slug de Posição no grafo resolvido em gen-time (se o título casa); render só checa. */
  slug?: string;
}

export interface Volume {
  /** "volume 1: arm drag" → "volume 1" ou só "1". */
  ordem: string;
  /** "arm drag" — assunto do volume. */
  tema: string;
  capitulos: Capitulo[];
}

export interface Series {
  /** "Series I", "Series II"… */
  nome: string;
  volumes: Volume[];
}

export interface Coach {
  /** slug do coach (ex: "marcelo-garcia"). */
  slug: string;
  /** Nome de display ("Marcelo Garcia"). */
  nome: string;
  series: Series[];
}

const STATUS_MAP: Record<string, CapituloStatus> = {
  done: "done",
  wip: "wip",
  later: "later",
  todo: "todo",
};

/** Match: `<status?> <HH:MM(:SS)?>  <N>. <text>`. Status entre 0-2 brancos OU palavra. */
const CAP_RX = /^\s*(done|wip|later|todo)?\s*(\d{1,2}:\d{2}(?::\d{2})?)\s+(\d+)\.\s+(.+)$/;
const VOL_RX = /^\s*(volume\s+\S+)\s*:\s*(.+)$/i;
const SER_RX = /^\s*(Series\s+\S+)\s*$/;

/**
 * Parse o conteúdo de um syllabus. Tolerante a indentação variável (\t vs espaços).
 * Linhas que não casam nenhuma regex são ignoradas.
 */
export function parseCoachSyllabus(content: string): Series[] {
  const series: Series[] = [];
  let serAtual: Series | null = null;
  let volAtual: Volume | null = null;
  for (const raw of content.split("\n")) {
    const line = raw.replace(/\t/g, "    "); // normaliza tabs
    const ser = SER_RX.exec(line);
    if (ser) {
      serAtual = { nome: ser[1], volumes: [] };
      series.push(serAtual);
      volAtual = null;
      continue;
    }
    const vol = VOL_RX.exec(line);
    if (vol) {
      if (!serAtual) {
        serAtual = { nome: "Series", volumes: [] };
        series.push(serAtual);
      }
      volAtual = { ordem: vol[1], tema: vol[2].trim(), capitulos: [] };
      serAtual.volumes.push(volAtual);
      continue;
    }
    const cap = CAP_RX.exec(line);
    if (cap && volAtual) {
      volAtual.capitulos.push({
        status: STATUS_MAP[cap[1] ?? ""] ?? "none",
        tempo: cap[2],
        numero: parseInt(cap[3], 10),
        titulo: cap[4].trim(),
      });
    }
  }
  return series;
}

/** Humaniza nome de arquivo: `marcelo_garcia.txt` → `Marcelo Garcia`. */
export function humanizeCoachName(fileBase: string): string {
  return fileBase
    .replace(/_/g, " ")
    .replace(/\b(\w)/g, (m) => m.toUpperCase());
}

export function buildCoach(fileBase: string, content: string): Coach {
  return {
    slug: fileBase.replace(/_/g, "-"),
    nome: humanizeCoachName(fileBase),
    series: parseCoachSyllabus(content),
  };
}
