// THROWAWAY batch extractor (run via vitest, no new deps).
// Picks ~12 well-separated, well-connected positions from the closed-guard
// neighbourhood across distinct concepts, applies pickClearestVariant per concept,
// and emits for each: id, name, slug, the 23-joint coords for BOTH players, and
// cameraFor(pose) {eye,target,up}.
//
// Coordinate mapping: GrappleMap is x/z ground plane, y up. Blender rig is x
// left-right, y north-south, z up => Blender (x, z, y). We emit Blender-ready
// pose dicts AND Blender-ready camera tuples (eye/target also remapped x,z,y),
// plus the raw GM-space camera for the record.
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { test } from "vitest";
import { parseGrappleMap, JOINTS, type Pose, type GMPosition } from "../../src/lib/grapplemap/parser";
import { closedGuardNeighbourhood } from "../../src/lib/grapplemap/bjj-filter";
import { cameraFor, legibilityScore, pickClearestVariant } from "../../src/lib/grapplemap/render-spec";

const txt = readFileSync("source_repos/GrappleMap/GrappleMap.txt", "utf8");

const OUT = ".scratch/figuras-grapplemap-pipeline/extracted_batch.txt";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\\n/g, " ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

// GM (x,y,z) -> Blender (x, z, y)
function poseToPyDict(pose: Pose): string {
  const fmt = (player: 0 | 1): string =>
    JOINTS.map((j, i) => {
      const v = pose[player][i];
      return `        '${j}': (${v.x.toFixed(3)}, ${v.z.toFixed(3)}, ${v.y.toFixed(3)}),`;
    }).join("\n");
  return (
    `{\n` +
    `    'p0': {\n${fmt(0)}\n    },\n` +
    `    'p1': {\n${fmt(1)}\n    },\n` +
    `}`
  );
}

test("extract batch", () => {
  writeFileSync(OUT, "");
  const log = (s: string) => appendFileSync(OUT, s + "\n");
  const data = parseGrappleMap(txt);
  const nbh = closedGuardNeighbourhood(data, { hops: 3 });
  log(`# neighbourhood size: ${nbh.positions.length} positions`);

  // Concept buckets: tag-or-name predicate. We pickClearestVariant within each.
  type Concept = { key: string; match: (p: GMPosition) => boolean };
  const hasTag = (p: GMPosition, t: string) => p.tags.includes(t);
  const nm = (p: GMPosition, re: RegExp) => re.test(p.name);
  const concepts: Concept[] = [
    { key: "closed_guard", match: (p) => hasTag(p, "closed_guard") && nm(p, /closed guard|full guard/i) },
    { key: "mount", match: (p) => hasTag(p, "mount") && nm(p, /mount/i) && !nm(p, /half|s-mount|technical/i) },
    { key: "side_control", match: (p) => hasTag(p, "side_control") && nm(p, /side control/i) },
    { key: "knee_on_belly", match: (p) => hasTag(p, "knee_on_belly") || nm(p, /knee on belly|knee.?on.?belly/i) },
    { key: "back_control", match: (p) => hasTag(p, "back") && nm(p, /back control|back mount|rear/i) },
    { key: "half_guard", match: (p) => hasTag(p, "half_guard") && nm(p, /half guard/i) && !nm(p, /deep|z-?guard|lockdown/i) },
    { key: "north_south", match: (p) => hasTag(p, "north_south") || nm(p, /north.?south/i) },
    { key: "butterfly_guard", match: (p) => hasTag(p, "butterfly") && nm(p, /butterfly/i) },
    { key: "open_guard", match: (p) => nm(p, /open guard/i) },
    { key: "scissor_sweep", match: (p) => nm(p, /scissor sweep/i) },
    { key: "hip_bump_sweep", match: (p) => nm(p, /hip.?bump/i) },
    { key: "pendulum_sweep", match: (p) => nm(p, /pendulum/i) && nm(p, /sweep|finish/i) },
    { key: "flower_sweep", match: (p) => nm(p, /flower sweep|pendulum.*armbar/i) },
    { key: "triangle", match: (p) => hasTag(p, "triangle") && nm(p, /triangle/i) && !nm(p, /arm.?triangle/i) },
    { key: "spider_guard", match: (p) => nm(p, /spider guard/i) },
    { key: "de_la_riva", match: (p) => nm(p, /de la riva|dlr/i) },
    { key: "x_guard", match: (p) => hasTag(p, "x_guard") && nm(p, /x.?guard/i) },
    { key: "deep_half", match: (p) => hasTag(p, "deep_half") && nm(p, /deep half/i) },
  ];

  // Pool to pick from: prefer neighbourhood, but also allow whole-db match so we
  // don't miss canonical pins (side control / north-south can sit further out).
  const pool = data.positions;
  const inNbh = new Set(nbh.positions.map((p) => p.id));

  const picked: { concept: string; pos: GMPosition; score: number; inNbh: boolean }[] = [];
  const usedIds = new Set<number>();

  for (const c of concepts) {
    const variants = pool.filter((p) => c.match(p));
    if (variants.length === 0) {
      log(`# concept ${c.key}: NO candidates`);
      continue;
    }
    // Sort whole candidate list by legibility for the record.
    const ranked = [...variants].sort((a, b) => legibilityScore(b.pose) - legibilityScore(a.pose));
    const best = pickClearestVariant(variants.map((p) => ({ id: p.id, pose: p.pose })));
    const chosen = variants.find((p) => p.id === best.id)!;
    if (usedIds.has(chosen.id)) {
      log(`# concept ${c.key}: best id=${chosen.id} already used, skipping`);
      continue;
    }
    usedIds.add(chosen.id);
    picked.push({ concept: c.key, pos: chosen, score: legibilityScore(chosen.pose), inNbh: inNbh.has(chosen.id) });
    log(`# concept ${c.key}: ${variants.length} candidates; chose id=${chosen.id} "${chosen.name}" score=${legibilityScore(chosen.pose).toFixed(3)} inNbh=${inNbh.has(chosen.id)}`);
    log(`#   top3: ${ranked.slice(0, 3).map((p) => `[${p.id}]${p.name.replace(/\\n/g, " ")}=${legibilityScore(p.pose).toFixed(2)}`).join(" | ")}`);
  }

  // Keep at most ~12, prefer higher legibility + neighbourhood membership.
  picked.sort((a, b) => Number(b.inNbh) - Number(a.inNbh) || b.score - a.score);
  const final = picked.slice(0, 12);

  log(`\n# ===== FINAL ${final.length} POSITIONS =====`);
  const index: { id: number; slug: string; name: string; concept: string }[] = [];

  for (const { concept, pos } of final) {
    const slug = slugify(pos.name) || `pos-${pos.id}`;
    const cam = cameraFor(pos.pose);
    // remap GM (x,y,z) -> Blender (x,z,y)
    const bx = (v: { x: number; y: number; z: number }) =>
      `(${v.x.toFixed(3)}, ${v.z.toFixed(3)}, ${v.y.toFixed(3)})`;
    index.push({ id: pos.id, slug, name: pos.name.replace(/\\n/g, " "), concept });

    log(`\n# ----- concept=${concept} id=${pos.id} slug=${slug} -----`);
    log(`# name: ${pos.name.replace(/\\n/g, " ")}`);
    log(`# tags: [${pos.tags.join(",")}]`);
    log(`# cameraFor (GM space y-up): eye=${JSON.stringify(cam.eye)} target=${JSON.stringify(cam.target)} up=${JSON.stringify(cam.up)}`);
    log(`POSE = ${poseToPyDict(pos.pose)}`);
    log(`# Blender-ready camera (remapped x,z,y): set_camera(eye=${bx(cam.eye)}, target=${bx(cam.target)})`);
    // also decide TOP player by head height (GM y = up): higher head = top
    const topIsP0 = pos.pose[0][JOINTS.indexOf("Head")].y > pos.pose[1][JOINTS.indexOf("Head")].y;
    log(`# top player (higher head, GM y): ${topIsP0 ? "p0" : "p1"}`);
  }

  log(`\n# ===== INDEX JSON =====`);
  log(JSON.stringify(index, null, 2));

  // Emit a single ready-to-exec Python module: BATCH = [ {id,slug,name,top,pose,eye,target}, ... ]
  const PY = ".scratch/figuras-grapplemap-pipeline/batch_data.py";
  const bx = (v: { x: number; y: number; z: number }) =>
    `(${v.x.toFixed(4)}, ${v.z.toFixed(4)}, ${v.y.toFixed(4)})`;
  let py = `# AUTO-GENERATED by extract_batch.test.ts. Blender-ready (x,z,y) coords.\n`;
  py += `# Camera eye/target come from cameraFor(pose), remapped GM y-up -> Blender z-up.\nBATCH = [\n`;
  for (const { concept, pos } of final) {
    const slug = slugify(pos.name) || `pos-${pos.id}`;
    const cam = cameraFor(pos.pose);
    const topIsP0 = pos.pose[0][JOINTS.indexOf("Head")].y > pos.pose[1][JOINTS.indexOf("Head")].y;
    py += `  {\n`;
    py += `    'id': ${pos.id}, 'slug': ${JSON.stringify(slug)},\n`;
    py += `    'name': ${JSON.stringify(pos.name.replace(/\\n/g, " "))}, 'concept': ${JSON.stringify(concept)},\n`;
    py += `    'top': ${topIsP0 ? "'p0'" : "'p1'"},\n`;
    py += `    'eye': ${bx(cam.eye)}, 'target': ${bx(cam.target)},\n`;
    py += `    'pose': ${poseToPyDict(pos.pose).replace(/\n/g, "\n    ")},\n`;
    py += `  },\n`;
  }
  py += `]\n`;
  writeFileSync(PY, py);
  log(`\n# wrote ${PY}`);
});
