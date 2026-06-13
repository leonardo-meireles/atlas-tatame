import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { test } from "vitest";
import { parseGrappleMap } from "../src/lib/grapplemap/parser";
import { gmKey, PT_BR_NAMES } from "../src/lib/grapplemap/pt-br-names";

// Dump every GM position/transition whose gmKey(name) is NOT in PT_BR_NAMES.
test("dump untranslated GM names", () => {
  const txt = readFileSync("source_repos/GrappleMap/GrappleMap.txt", "utf8");
  const data = parseGrappleMap(txt);

  const seenPos = new Map<string, string>(); // gmKey -> raw name
  for (const p of data.positions) {
    const k = gmKey(p.name);
    if (!PT_BR_NAMES[k] && !seenPos.has(k)) seenPos.set(k, p.name);
  }
  const seenTr = new Map<string, string>();
  for (const t of data.transitions) {
    const k = gmKey(t.name);
    if (!PT_BR_NAMES[k] && !seenTr.has(k)) seenTr.set(k, t.name);
  }

  const totalPos = new Set(data.positions.map((p) => gmKey(p.name))).size;
  const totalTr = new Set(data.transitions.map((t) => gmKey(t.name))).size;

  const posLines = [...seenPos.entries()].sort().map(([k, raw]) => `${k}\t::: ${raw}`);
  const trLines = [...seenTr.entries()].sort().map(([k, raw]) => `${k}\t::: ${raw}`);

  const out =
    `# Untranslated GM names (gmKey not in PT_BR_NAMES)\n` +
    `# positions: ${seenPos.size} untranslated / ${totalPos} distinct\n` +
    `# transitions: ${seenTr.size} untranslated / ${totalTr} distinct\n\n` +
    `## POSITIONS (${seenPos.size})\n` +
    posLines.join("\n") +
    `\n\n## TRANSITIONS (${seenTr.size})\n` +
    trLines.join("\n") +
    "\n";

  mkdirSync("research", { recursive: true });
  writeFileSync("research/untranslated-gm-names.txt", out);
  console.log(
    `positions: ${seenPos.size}/${totalPos} untranslated | transitions: ${seenTr.size}/${totalTr} untranslated`,
  );
});
