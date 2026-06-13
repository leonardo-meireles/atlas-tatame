// THROWAWAY extractor for the 8 hand-authored TRANSITION nodes that currently
// render "FIGURA EM BREVE". For each of OUR slugs we find a GrappleMap concept
// by NAME (transitions first — using the LAST keyframe, the finished technique —
// then positions as fallback), pickClearestVariant among matches, and emit a
// Blender-ready BATCH (pose dicts + cameraFor() camera, GM y-up -> Blender z-up).
//
// Coordinate mapping (same as extract_batch.test.ts): GrappleMap is x/z ground
// plane, y up. Blender rig is x left-right, y north-south, z up => Blender (x, z, y).
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { test } from "vitest";
import { parseGrappleMap, JOINTS, type Pose, type GMPosition, type GMTransition } from "../../src/lib/grapplemap/parser";
import { cameraFor, legibilityScore, pickClearestVariant } from "../../src/lib/grapplemap/render-spec";

const txt = readFileSync("source_repos/GrappleMap/GrappleMap.txt", "utf8");
const OUT = ".scratch/figuras-grapplemap-pipeline/extracted_tecnicas.txt";

// OUR slug -> ordered name-match regexes (most specific first). `transitionOnly`
// concepts ignore positions; otherwise positions are a fallback pool.
type Spec = {
  slug: string;
  res: RegExp[];           // try each in order; first that yields candidates wins
  // optional extra filter to reject obvious wrong matches (e.g. flying scissor)
  reject?: RegExp;
};

// GrappleMap names use literal "\n" for line breaks; we test against a spaced form.
const SPECS: Spec[] = [
  { slug: "armlock-da-guarda", res: [/arm ?bar/i, /armbar/i], reject: /wip|escape|defen|counter/i },
  { slug: "triangulo", res: [/^triangle$/i, /\btriangle\b/i], reject: /arm.?triangle|counter|broken|escape|threat|defen/i },
  { slug: "kimura-da-guarda", res: [/\bkimura\b/i], reject: /escape|defen|counter/i },
  // GrappleMap has NO "cross collar choke"/"cross choke" by name; every name with
  // "choke" is a rear-naked (back) choke. The closest finished guard cross-collar
  // choke present is the "irish collar" from closed guard (a cross-collar choke).
  // SUBSTITUTION (reported): use the irish collar from closed/full guard.
  { slug: "estrangulamento-cruzado", res: [/irish collar/i], reject: /wrist/i },
  // GrappleMap has NO "scissor sweep" (only "flying scissor" = kani basami leglock).
  // No honest representative of the guard scissor sweep exists -> report NOT FOUND.
  { slug: "raspagem-de-tesoura", res: [/scissor sweep/i], reject: /flying|kani/i },
  // Prefer the explicit "hip bump sweep" over a bare "hip bump".
  { slug: "raspagem-de-quadril", res: [/hip ?bump sweep/i, /hip ?bump/i], reject: /defen|escape|counter|octopus/i },
  // "flower sweep" absent; "pendulum sweep" present (last frame = finished sweep).
  { slug: "raspagem-de-balao", res: [/pendulum sweep/i, /\bpendulum\b/i, /flower sweep/i], reject: /defen|escape|counter|halfway|fake/i },
  // "abertura e passagem" = open the guard and pass. "break open guard" is the
  // guard-pass transition; prefer it over the static "open guard" node.
  { slug: "abertura-e-passagem", res: [/break open guard/i, /open guard/i, /guard pass|pass.*guard/i], reject: /vs|defen|escape/i },
];

const spacedName = (n: string) => n.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();

// GM (x,y,z) -> Blender (x, z, y)
function poseToPyDict(pose: Pose): string {
  const fmt = (player: 0 | 1): string =>
    JOINTS.map((j, i) => {
      const v = pose[player][i];
      return `        '${j}': (${v.x.toFixed(3)}, ${v.z.toFixed(3)}, ${v.y.toFixed(3)}),`;
    }).join("\n");
  return `{\n    'p0': {\n${fmt(0)}\n    },\n    'p1': {\n${fmt(1)}\n    },\n}`;
}

type Candidate = { kind: "transition" | "position"; id: number; name: string; pose: Pose };

test("extract tecnicas", () => {
  writeFileSync(OUT, "");
  const log = (s: string) => appendFileSync(OUT, s + "\n");
  const data = parseGrappleMap(txt, { resolveConnectivity: false });
  log(`# positions=${data.positions.length} transitions=${data.transitions.length}`);

  const picked: { slug: string; cand: Candidate; score: number }[] = [];
  const notFound: string[] = [];

  for (const spec of SPECS) {
    let chosen: Candidate | null = null;
    let usedRe = "";
    let pool: Candidate[] = [];

    for (const re of spec.res) {
      // transitions: match by name, candidate pose = LAST keyframe (finished technique)
      const tCands: Candidate[] = data.transitions
        .filter((t: GMTransition) => re.test(spacedName(t.name)) && (!spec.reject || !spec.reject.test(spacedName(t.name))))
        .map((t) => ({ kind: "transition" as const, id: t.id, name: spacedName(t.name), pose: t.frames[t.frames.length - 1] }));
      // positions fallback
      const pCands: Candidate[] = data.positions
        .filter((p: GMPosition) => re.test(spacedName(p.name)) && (!spec.reject || !spec.reject.test(spacedName(p.name))))
        .map((p) => ({ kind: "position" as const, id: p.id, name: spacedName(p.name), pose: p.pose }));

      pool = [...tCands, ...pCands];
      if (pool.length > 0) {
        usedRe = re.source;
        break;
      }
    }

    log(`\n# ===== ${spec.slug} =====`);
    if (pool.length === 0) {
      log(`# NO candidates for any regex`);
      notFound.push(spec.slug);
      continue;
    }
    // Prefer transitions (finished-technique last frame) but pick the clearest pose.
    const tx = pool.filter((c) => c.kind === "transition");
    const considered = tx.length > 0 ? tx : pool;
    chosen = pickClearestVariant(considered);
    const score = legibilityScore(chosen.pose);
    log(`# matched re=/${usedRe}/  candidates=${pool.length} (transitions=${tx.length})`);
    const ranked = [...considered].sort((a, b) => legibilityScore(b.pose) - legibilityScore(a.pose));
    log(`#   top: ${ranked.slice(0, 5).map((c) => `[${c.kind[0]}${c.id}]${c.name}=${legibilityScore(c.pose).toFixed(2)}`).join(" | ")}`);
    log(`# CHOSEN ${chosen.kind} id=${chosen.id} "${chosen.name}" score=${score.toFixed(3)}`);
    picked.push({ slug: spec.slug, cand: chosen, score });
  }

  // Emit Blender-ready BATCH keyed by OUR slug.
  const bx = (v: { x: number; y: number; z: number }) =>
    `(${v.x.toFixed(4)}, ${v.z.toFixed(4)}, ${v.y.toFixed(4)})`;
  let py = `# AUTO-GENERATED by extract_tecnicas.test.ts. Blender-ready (x,z,y) coords.\n`;
  py += `# One entry per OUR transition slug. pose = finished-technique frame.\n`;
  py += `# Camera from cameraFor(pose), remapped GM y-up -> Blender z-up.\nBATCH = [\n`;
  const index: { slug: string; file: string }[] = [];
  for (const { slug, cand } of picked) {
    const cam = cameraFor(cand.pose);
    // top player = higher head (GM y = up) gets clay; other = ink
    const topIsP0 = cand.pose[0][JOINTS.indexOf("Head")].y > cand.pose[1][JOINTS.indexOf("Head")].y;
    py += `  {\n`;
    py += `    'slug': ${JSON.stringify(slug)},\n`;
    py += `    'src': ${JSON.stringify(`${cand.kind}#${cand.id} ${cand.name}`)},\n`;
    py += `    'top': ${topIsP0 ? "'p0'" : "'p1'"},\n`;
    py += `    'eye': ${bx(cam.eye)}, 'target': ${bx(cam.target)},\n`;
    py += `    'pose': ${poseToPyDict(cand.pose).replace(/\n/g, "\n    ")},\n`;
    py += `  },\n`;
    index.push({ slug, file: `${slug}.png` });
  }
  py += `]\n`;
  const PY = ".scratch/figuras-grapplemap-pipeline/tecnicas_data.py";
  writeFileSync(PY, py);
  log(`\n# wrote ${PY}`);
  log(`# rendered slugs: ${picked.map((p) => p.slug).join(", ")}`);
  log(`# NOT FOUND: ${notFound.join(", ") || "(none)"}`);
  log(`# INDEX JSON:\n${JSON.stringify(index, null, 2)}`);
});
