// BJJ / guard-relevant filtering of the parsed GrappleMap graph.
//
// GrappleMap mixes BJJ ground work with wrestling/judo takedowns. For "O Mapa do
// Jiu-Jitsu" we want to grow outward from closed guard, not dump all ~3600
// entries. Two strategies are offered:
//
//   1. filterByTags   — pure tag/name whitelist (broad, may include islands).
//   2. closedGuardNeighbourhood — start from closed-guard entries and BFS over
//      resolved transition connectivity N hops out (a coherent connected
//      sub-graph: the guard, its sweeps, submissions, and passes reachable from it).
//
// Pure: operates on already-parsed GrappleMapData.

import type { GMPosition, GMTransition, GrappleMapData } from "./parser";

/**
 * Tags that mark an entry as BJJ guard/control/submission relevant.
 * Ground-game positions, sweeps, and submissions. Takedown/wrestling-only tags
 * (single_leg_takedown, double_leg_takedown, sprawl, te_waza, ashi_waza, throw,
 * trip, ankle_pick, standing) are intentionally NOT here.
 */
export const BJJ_TAGS: readonly string[] = [
  // guards
  "closed_guard",
  "full_guard",
  "half_guard",
  "z_guard",
  "rubber_guard",
  "deep_half",
  "quarter_guard",
  "butterfly",
  "spiderweb",
  "lockdown",
  "octopus",
  "knee_shield",
  "x_guard",
  "single_leg_x",
  "fifty_fifty",
  // top control / pins
  "side_control",
  "mount",
  "s_mount",
  "three_quarter_mount",
  "knee_on_belly",
  "knee_pin",
  "north_south",
  "back",
  "turtle",
  "truck",
  "lower_back_control",
  "combat_base",
  // sweeps / passes (transitions)
  "sweep",
  "butterfly_sweep",
  "pass",
  "pass_around",
  "pass_split",
  "pass_through",
  "pass_under",
  "knee_slice",
  "leg_drag",
  "back_step",
  "stand_up",
  // submissions
  "triangle",
  "armbar",
  "kimura",
  "omoplata",
  "monoplata",
  "darce",
  "guillotine",
  "heel_hook",
  "toehold",
  "kneebar",
  "arm_triangle",
  "rear_naked_choke",
  "twister_side",
  "ezekiel",
  "americana",
  "bow_and_arrow",
  // grips / postures common to guard play
  "crossface",
  "underhook",
  "top_underhook",
  "bottom_underhook",
  "overhook",
  "top_overhook",
  "bottom_overhook",
  "seatbelt",
  "whizzer",
  "two_on_one",
  "arm_drag",
  "wrist_control",
  "collar_tie",
  "body_lock",
  "top_posture_broken",
  "bottom_supine",
  "bottom_seated",
  "bottom_kneeling",
  "top_kneeling",
  "top_seated",
  "bottom_double_unders",
];

/** Tags specifically denoting closed guard (the MVP root neighbourhood). */
export const CLOSED_GUARD_TAGS: readonly string[] = [
  "closed_guard",
  "full_guard",
];

const hasAny = (tags: string[], set: ReadonlySet<string>): boolean =>
  tags.some((t) => set.has(t));

const nameMatches = (name: string, needles: readonly string[]): boolean => {
  const n = name.toLowerCase();
  return needles.some((needle) => n.includes(needle));
};

export interface FilterOptions {
  /** Tag whitelist. Defaults to BJJ_TAGS. */
  tags?: readonly string[];
  /** Extra case-insensitive name substrings to match (e.g. "guard", "mount"). */
  nameNeedles?: readonly string[];
}

export interface FilteredGraph {
  positions: GMPosition[];
  transitions: GMTransition[];
}

/**
 * Select positions + transitions whose tags (or optionally name) match the
 * whitelist. Broad and order-stable; may include disconnected entries.
 */
export function filterByTags(
  data: GrappleMapData,
  options: FilterOptions = {},
): FilteredGraph {
  const tagSet = new Set(options.tags ?? BJJ_TAGS);
  const needles = options.nameNeedles ?? [];

  const matches = (tags: string[], name: string): boolean =>
    hasAny(tags, tagSet) || (needles.length > 0 && nameMatches(name, needles));

  return {
    positions: data.positions.filter((p) => matches(p.tags, p.name)),
    transitions: data.transitions.filter((t) => matches(t.tags, t.name)),
  };
}

export interface NeighbourhoodOptions {
  /** Tags marking the seed positions. Defaults to CLOSED_GUARD_TAGS. */
  seedTags?: readonly string[];
  /** Case-insensitive name substrings to also treat as seeds. */
  seedNameNeedles?: readonly string[];
  /** How many transition hops to grow outward. Default 2. */
  hops?: number;
}

/**
 * Grow a connected sub-graph outward from closed-guard positions via resolved
 * transition connectivity (BFS, like grow() in gm.js). Returns the positions
 * reached within `hops` and every transition connecting reached positions.
 *
 * Requires connectivity to have been resolved during parse (default).
 */
export function closedGuardNeighbourhood(
  data: GrappleMapData,
  options: NeighbourhoodOptions = {},
): FilteredGraph {
  const seedTags = new Set(options.seedTags ?? CLOSED_GUARD_TAGS);
  const seedNeedles = options.seedNameNeedles ?? [];
  const hops = options.hops ?? 2;

  // Adjacency over resolved connectivity (undirected for reachability;
  // transitions can be bidirectional and we want the whole neighbourhood).
  const adj = new Map<number, Set<number>>();
  for (const p of data.positions) adj.set(p.id, new Set());
  for (const t of data.transitions) {
    if (t.fromId !== null && t.toId !== null) {
      adj.get(t.fromId)?.add(t.toId);
      adj.get(t.toId)?.add(t.fromId);
    }
  }

  // Seed set.
  const reached = new Map<number, number>(); // id -> hop distance
  let frontier: number[] = [];
  for (const p of data.positions) {
    if (
      hasAny(p.tags, seedTags) ||
      (seedNeedles.length > 0 && nameMatches(p.name, seedNeedles))
    ) {
      reached.set(p.id, 0);
      frontier.push(p.id);
    }
  }

  // BFS outward.
  for (let depth = 0; depth < hops && frontier.length > 0; depth++) {
    const next: number[] = [];
    for (const id of frontier) {
      for (const nb of adj.get(id) ?? []) {
        if (!reached.has(nb)) {
          reached.set(nb, depth + 1);
          next.push(nb);
        }
      }
    }
    frontier = next;
  }

  const positions = data.positions.filter((p) => reached.has(p.id));
  const transitions = data.transitions.filter(
    (t) =>
      t.fromId !== null &&
      t.toId !== null &&
      reached.has(t.fromId) &&
      reached.has(t.toId),
  );

  return { positions, transitions };
}
