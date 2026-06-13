// THROWAWAY extractor for the remaining "FIGURA EM BREVE" nodes (Phase 7):
// the 3 CONCEPT nodes (cem-quilos / norte-sul / tartaruga) plus the scissor-sweep
// TECNICA node (raspagem-de-tesoura). Same pattern as extract_tecnicas.test.ts:
// find a GrappleMap concept by NAME (positions first for concepts — they are static
// pins; transitions' last keyframe as fallback), pickClearestVariant among matches,
// and emit a Blender-ready BATCH (pose dicts + cameraFor() camera, GM y-up -> z-up).
//
// Coordinate mapping (same as extract_batch/extract_tecnicas): GrappleMap is x/z
// ground plane, y up. Blender rig is x left-right, y north-south, z up => (x, z, y).
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { test } from "vitest";
import { parseGrappleMap, JOINTS, type Pose, type GMPosition, type GMTransition } from "../../src/lib/grapplemap/parser";
import { cameraFor, legibilityScore, pickClearestVariant } from "../../src/lib/grapplemap/render-spec";

const txt = readFileSync("source_repos/GrappleMap/GrappleMap.txt", "utf8");
const OUT = ".scratch/figuras-grapplemap-pipeline/extracted_conceitos.txt";

// OUR slug -> output dir + ordered name-match regexes (most specific first) + reject.
// `preferPositions`: concepts are static pins, so prefer Position nodes (a clean
// held position) over transition keyframes.
type Spec = {
  slug: string;
  dir: "conceitos" | "tecnicas";
  res: RegExp[];
  reject?: RegExp;
  preferPositions?: boolean;
  note?: string;
};

const SPECS: Spec[] = [
  // cem-quilos = side control. GrappleMap names: "side control", "judo side",
  // "kesa gatame". Pick a clean held side-control PIN (avoid escapes/defenses and
  // very busy gi-grip variants like darce/kimura/arm-triangle off side control).
  {
    slug: "cem-quilos",
    dir: "conceitos",
    res: [/^side control$/i, /\bside control\b/i, /\bjudo side\b/i, /kesa gatame/i, /\bscarf\b/i],
    reject: /escape|defen|counter|vs |bridg|turning|handfight|darce|kimura|arm triangle|twister|behind|leg drag|switching|loose|low /i,
    preferPositions: true,
  },
  // norte-sul = north south. The static "north south" pin (id near line 13).
  {
    slug: "norte-sul",
    dir: "conceitos",
    res: [/^north ?\/?south$/i, /\bnorth ?\/?south\b/i],
    reject: /escape|defen|counter|vs |choke|kimura|darce|roll|to |end in/i,
    preferPositions: true,
  },
  // tartaruga = turtle. Pick a clean turtle PIN, avoid the seatbelt/back-take and
  // sprawl/single-leg variants which read as something else.
  {
    slug: "tartaruga",
    dir: "conceitos",
    res: [/^turtle$/i, /^parallel\s*turtle$/i, /\bturtle\b/i],
    reject: /vs |seatbelt|back|single.?leg|sprawl|chestlock|body lock|arm.?drag|mounted|lower back|stepping|posting|behind|knee under|elbow|grapevine|darce/i,
    preferPositions: true,
  },
  // raspagem-de-tesoura = scissor sweep. GrappleMap has NO closed-guard scissor
  // sweep: "scissor"/"flying scissor" are Reilly Bodycomb leglocks (kani basami /
  // sliding heelhook), NOT the guard sweep. SUBSTITUTION: render the closest
  // closed/full-guard sweep present. The only full_guard sweeps are the hip-bump
  // family; raspagem-de-quadril already uses transition#293 "hip bump sweep", so we
  // take the distinct full-guard sweep variant "hip bump sweep w/ elbow post" as
  // the honest nearest closed-guard sweep. Reported as a substitution.
  {
    slug: "raspagem-de-tesoura",
    dir: "tecnicas",
    res: [/scissor sweep/i, /hip ?bump sweep w\/? ?elbow post/i, /hip ?bump sweep w\/? ?hand post/i],
    reject: /flying|kani|defen|escape|counter/i,
    note: "SUBSTITUTION: scissor sweep absent in GrappleMap (only Reilly Bodycomb leglock 'scissor'/'flying scissor'). Closest closed/full-guard sweep used.",
  },
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

test("extract conceitos", () => {
  writeFileSync(OUT, "");
  const log = (s: string) => appendFileSync(OUT, s + "\n");
  const data = parseGrappleMap(txt, { resolveConnectivity: false });
  log(`# positions=${data.positions.length} transitions=${data.transitions.length}`);

  const picked: { spec: Spec; cand: Candidate; score: number }[] = [];
  const notFound: string[] = [];

  for (const spec of SPECS) {
    let chosen: Candidate | null = null;
    let usedRe = "";
    let pool: Candidate[] = [];

    for (const re of spec.res) {
      const tCands: Candidate[] = data.transitions
        .filter((t: GMTransition) => re.test(spacedName(t.name)) && (!spec.reject || !spec.reject.test(spacedName(t.name))))
        .map((t) => ({ kind: "transition" as const, id: t.id, name: spacedName(t.name), pose: t.frames[t.frames.length - 1] }));
      const pCands: Candidate[] = data.positions
        .filter((p: GMPosition) => re.test(spacedName(p.name)) && (!spec.reject || !spec.reject.test(spacedName(p.name))))
        .map((p) => ({ kind: "position" as const, id: p.id, name: spacedName(p.name), pose: p.pose }));

      pool = spec.preferPositions ? [...pCands, ...tCands] : [...tCands, ...pCands];
      if (pool.length > 0) {
        usedRe = re.source;
        break;
      }
    }

    log(`\n# ===== ${spec.slug} (dir=${spec.dir}) =====`);
    if (spec.note) log(`# ${spec.note}`);
    if (pool.length === 0) {
      log(`# NO candidates for any regex`);
      notFound.push(spec.slug);
      continue;
    }
    // For concepts prefer Positions (static pin); else prefer transitions.
    const preferred = spec.preferPositions
      ? pool.filter((c) => c.kind === "position")
      : pool.filter((c) => c.kind === "transition");
    const considered = preferred.length > 0 ? preferred : pool;
    chosen = pickClearestVariant(considered);
    const score = legibilityScore(chosen.pose);
    log(`# matched re=/${usedRe}/  candidates=${pool.length} (considered=${considered.length})`);
    const ranked = [...considered].sort((a, b) => legibilityScore(b.pose) - legibilityScore(a.pose));
    log(`#   top: ${ranked.slice(0, 6).map((c) => `[${c.kind[0]}${c.id}]${c.name}=${legibilityScore(c.pose).toFixed(2)}`).join(" | ")}`);
    log(`# CHOSEN ${chosen.kind} id=${chosen.id} "${chosen.name}" score=${score.toFixed(3)}`);
    picked.push({ spec, cand: chosen, score });
  }

  // Emit Blender-ready BATCH keyed by OUR slug (with output dir).
  const bx = (v: { x: number; y: number; z: number }) =>
    `(${v.x.toFixed(4)}, ${v.z.toFixed(4)}, ${v.y.toFixed(4)})`;
  let py = `# AUTO-GENERATED by extract_conceitos.test.ts. Blender-ready (x,z,y) coords.\n`;
  py += `# One entry per OUR remaining slug. Camera from cameraFor(pose), GM y-up -> z-up.\nBATCH = [\n`;
  const conceitosIndex: { slug: string; file: string }[] = [];
  for (const { spec, cand } of picked) {
    const cam = cameraFor(cand.pose);
    const topIsP0 = cand.pose[0][JOINTS.indexOf("Head")].y > cand.pose[1][JOINTS.indexOf("Head")].y;
    py += `  {\n`;
    py += `    'slug': ${JSON.stringify(spec.slug)},\n`;
    py += `    'dir': ${JSON.stringify(spec.dir)},\n`;
    py += `    'src': ${JSON.stringify(`${cand.kind}#${cand.id} ${cand.name}`)},\n`;
    py += `    'top': ${topIsP0 ? "'p0'" : "'p1'"},\n`;
    py += `    'eye': ${bx(cam.eye)}, 'target': ${bx(cam.target)},\n`;
    py += `    'pose': ${poseToPyDict(cand.pose).replace(/\n/g, "\n    ")},\n`;
    py += `  },\n`;
    if (spec.dir === "conceitos") conceitosIndex.push({ slug: spec.slug, file: `${spec.slug}.png` });
  }
  py += `]\n`;
  const PY = ".scratch/figuras-grapplemap-pipeline/conceitos_data.py";
  writeFileSync(PY, py);
  log(`\n# wrote ${PY}`);
  log(`# rendered slugs: ${picked.map((p) => p.spec.slug).join(", ")}`);
  log(`# NOT FOUND: ${notFound.join(", ") || "(none)"}`);
  log(`# CONCEITOS INDEX JSON:\n${JSON.stringify(conceitosIndex, null, 2)}`);
});
