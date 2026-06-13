// THROWAWAY extraction script (run via vitest, no new deps).
// Prints real GrappleMap joint coords for closed guard, mount, and one
// closed-guard-neighbourhood position, in a Blender-ready Python dict format.
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { test } from "vitest";
import { parseGrappleMap, JOINTS, type Pose } from "../../src/lib/grapplemap/parser";
import { closedGuardNeighbourhood } from "../../src/lib/grapplemap/bjj-filter";

const txt = readFileSync(
  "source_repos/GrappleMap/GrappleMap.txt",
  "utf8",
);

// GrappleMap: x/z ground plane, y up. Blender rig: x left-right, y north-south,
// z up. So map GM (x,y,z) -> Blender (x, z, y).  We'll emit Blender coords.
function poseToPyDicts(name: string, pose: Pose): string {
  const fmt = (player: 0 | 1): string => {
    const lines = JOINTS.map((j, i) => {
      const v = pose[player][i];
      // GM y-up -> Blender z-up: Blender (x, z, y)
      return `        '${j}': (${v.x.toFixed(3)}, ${v.z.toFixed(3)}, ${v.y.toFixed(3)}),`;
    });
    return lines.join("\n");
  };
  // player0 = red = TOP-ish (we'll decide per pose); player1 = blue.
  return (
    `# ===== ${name} =====\n` +
    `POSE = {\n` +
    `    'p0': {\n${fmt(0)}\n    },\n` +
    `    'p1': {\n${fmt(1)}\n    },\n` +
    `}\n`
  );
}

const OUT = ".scratch/figuras-grapplemap-pipeline/extracted.txt";

test("extract poses", () => {
  writeFileSync(OUT, "");
  const log = (s: string) => appendFileSync(OUT, s + "\n");
  const console = { log } as any;
  const data = parseGrappleMap(txt);

  const findByName = (needle: string) =>
    data.positions.filter((p) =>
      p.name.toLowerCase().includes(needle.toLowerCase()),
    );

  // 1) Closed guard — pick the cleanest-named closed-guard seed.
  const cg = data.positions.filter(
    (p) =>
      p.tags.includes("closed_guard") &&
      /closed guard|full guard/i.test(p.name),
  );
  console.log("\n### CLOSED GUARD candidates:");
  cg.forEach((p) => console.log(`  id=${p.id} "${p.name}" tags=[${p.tags.join(",")}]`));

  // 2) Mount.
  const mount = data.positions.filter(
    (p) => p.tags.includes("mount") && /mount/i.test(p.name),
  );
  console.log("\n### MOUNT candidates:");
  mount.forEach((p) => console.log(`  id=${p.id} "${p.name}" tags=[${p.tags.join(",")}]`));

  // 3) Neighbourhood — a sweep position 1-2 hops from closed guard.
  const nbh = closedGuardNeighbourhood(data, { hops: 2 });
  const sweeps = nbh.positions.filter((p) =>
    /sweep|pendulum|hip bump|scissor|flower/i.test(p.name),
  );
  console.log("\n### SWEEP-ish neighbourhood candidates:");
  sweeps.forEach((p) => console.log(`  id=${p.id} "${p.name}"`));

  // Dump the chosen poses. Pick deterministic ids.
  const dump = (label: string, list: { id: number; name: string; pose: Pose }[], preferRe: RegExp) => {
    const chosen = list.find((p) => preferRe.test(p.name)) ?? list[0];
    if (!chosen) {
      console.log(`\n!!! NONE for ${label}`);
      return;
    }
    console.log(`\n>>> CHOSEN ${label}: id=${chosen.id} "${chosen.name}"`);
    console.log(poseToPyDicts(`${label} | ${chosen.name}`, chosen.pose));
  };

  // Dump explicit ids by name so we control selection precisely.
  const byId = (id: number) => data.positions.find((p) => p.id === id)!;
  const cgPick = byId(265); // "distance closed guard" — canonical supine vs kneeling
  const mtPick = byId(150); // "mount"
  const swPick = byId(231); // "halfway pendulum sweep"
  console.log(`\n>>> CHOSEN closed_guard: id=${cgPick.id} "${cgPick.name}"`);
  console.log(poseToPyDicts(`closed_guard | ${cgPick.name}`, cgPick.pose));
  console.log(`\n>>> CHOSEN mount: id=${mtPick.id} "${mtPick.name}"`);
  console.log(poseToPyDicts(`mount | ${mtPick.name}`, mtPick.pose));
  console.log(`\n>>> CHOSEN sweep: id=${swPick.id} "${swPick.name}"`);
  console.log(poseToPyDicts(`sweep | ${swPick.name}`, swPick.pose));

  // extra closed-guard candidates to compare for tightest wrap
  for (const id of [375, 220, 71, 540]) {
    const p = byId(id);
    console.log(`\n>>> CG-ALT id=${id} "${p.name}"`);
    console.log(poseToPyDicts(`cg_alt_${id} | ${p.name}`, p.pose));
  }

  // Also a raw exact match search for clean canonical names
  console.log("\n### exact 'mount' name:", findByName("mount").slice(0, 8).map(p => `[${p.id}]${p.name}`).join(" | "));
});
