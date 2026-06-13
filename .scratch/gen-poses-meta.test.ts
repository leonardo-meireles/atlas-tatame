import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { test } from "vitest";

// One-shot: emite src/content/poses-meta.json com envelope versionado por slug.
// Default: source="gm-derived", status="publicado" pros 285 poses + 1153 trans existentes.
// Owner OU agentes podem sobrescrever via /studio (próximo MR).
test("gera src/content/poses-meta.json", () => {
  const manifest = JSON.parse(readFileSync("src/content/figura-manifest.json", "utf8")) as {
    poses: string[];
    trans: string[];
  };

  // Preserva meta existente se já tem (idempotente — não sobrescreve curadoria manual).
  const existente: Record<string, PoseMeta> = existsSync("src/content/poses-meta.json")
    ? JSON.parse(readFileSync("src/content/poses-meta.json", "utf8"))
    : {};

  interface PoseMeta {
    schema: "pose-meta-v1";
    kind: "pos" | "trans";
    source: "gm-derived" | "hand" | "agent-video" | "agent-image" | "agent-text" | "mocap" | "blender";
    status: "rascunho" | "revisado" | "publicado";
    author?: string;
    notes?: string;
    gmRef?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  const meta: Record<string, PoseMeta> = { ...existente };

  for (const slug of manifest.poses) {
    if (meta[slug]) continue; // preserva
    meta[slug] = { schema: "pose-meta-v1", kind: "pos", source: "gm-derived", status: "publicado" };
  }
  for (const slug of manifest.trans) {
    if (meta[slug]) continue;
    meta[slug] = { schema: "pose-meta-v1", kind: "trans", source: "gm-derived", status: "publicado" };
  }

  // Override hand-authored (poses-gm.json existe + diferente do gerado).
  meta["guarda-fechada"] = { ...meta["guarda-fechada"], source: "hand", status: "publicado", author: "owner" };

  writeFileSync("src/content/poses-meta.json", JSON.stringify(meta, null, 2));
  const n = Object.keys(meta).length;
  console.log(`poses-meta: ${n} entries (${manifest.poses.length} pos + ${manifest.trans.length} trans)`);
});
