// GrappleMap parser — a deep, pure module.
//
// Parses the public-domain `GrappleMap.txt` database (eelis/GrappleMap) into a
// typed pose/graph model. No I/O: the only entry point is `parseGrappleMap(text)`.
//
// Format spec (full provenance in research/grapplemap-fork-port-plan.md, ported
// from source_repos/GrappleMap/src/persistence.cpp, players.hpp, positions.cpp):
//
//   - The file is a flat sequence of line-oriented blocks.
//   - A block = one or more description lines (NOT indented) followed by one or
//     more encoded pose frames (each frame = exactly 4 lines indented by spaces).
//   - A line is a "position line" iff its first char is a space.
//   - Block with 1 frame  => a Position (graph node).
//   - Block with >=2 frames => a Transition (graph edge).
//   - Each frame = 276 base62 digits split over 4 indented lines. Decode by
//     concatenating the 4 lines (whitespace-stripped) into one digit stream.
//   - 23 joints x 2 players x 3 coords x 2 base62 digits = 276 digits.
//   - coord_milli = d0 * 62 + d1  (0..3999); coord_meters = coord_milli / 1000.
//   - On decode x and z are offset by -2 (stored 0..4 => world -2..+2); y is up,
//     not offset (stored 0..4 => world 0..4, floor at y=0).
//   - player0 = red, player1 = blue.

export type Vec3 = { x: number; y: number; z: number };

/** The 23 joints, in exact GrappleMap index order (players.hpp:8-23). */
export const JOINTS = [
  "LeftToe",
  "RightToe",
  "LeftHeel",
  "RightHeel",
  "LeftAnkle",
  "RightAnkle",
  "LeftKnee",
  "RightKnee",
  "LeftHip",
  "RightHip",
  "LeftShoulder",
  "RightShoulder",
  "LeftElbow",
  "RightElbow",
  "LeftWrist",
  "RightWrist",
  "LeftHand",
  "RightHand",
  "LeftFingers",
  "RightFingers",
  "Core",
  "Neck",
  "Head",
] as const;

export type Joint = (typeof JOINTS)[number];

export const JOINT_COUNT = JOINTS.length; // 23
export const PLAYER_COUNT = 2;
export const COORD_COUNT = 3;
/** Base62 digits per frame: 2 players x 23 joints x 3 coords x 2 digits = 276. */
export const FRAME_DIGITS = PLAYER_COUNT * JOINT_COUNT * COORD_COUNT * 2;

/** One player's pose: 23 joint positions, indexed by JOINTS order. */
export type PlayerPose = Vec3[]; // length 23

/** A full pose frame: [player0 (red), player1 (blue)]. */
export type Pose = [PlayerPose, PlayerPose];

/** A Position: a named, standalone configuration. A node in the graph. */
export interface GMPosition {
  /** Stable id assigned during parse (index into positions[]). */
  id: number;
  /** Human display name. May contain "\n" (literal backslash-n) = line break. */
  name: string;
  /** Space-separated tags from the `tags:` line. */
  tags: string[];
  /** The single pose frame. */
  pose: Pose;
  /** 1-based line number in GrappleMap.txt where the block's first desc line is. */
  sourceLineNr: number;
}

/** Properties from the `properties:` line of a transition's description. */
export interface GMProperties {
  top: boolean;
  bottom: boolean;
  bidirectional: boolean;
  detailed: boolean;
}

/** A Transition: a named movement with >=2 keyframes. An edge in the graph. */
export interface GMTransition {
  id: number;
  name: string;
  tags: string[];
  properties: GMProperties;
  /** Keyframes, >=2. First frame = start pose, last = end pose. */
  frames: Pose[];
  /** id of the resolved start Position, or null if unresolved. */
  fromId: number | null;
  /** id of the resolved end Position, or null if unresolved. */
  toId: number | null;
  sourceLineNr: number;
}

export interface GrappleMapData {
  positions: GMPosition[];
  transitions: GMTransition[];
  /** Sorted list of every distinct tag seen across positions + transitions. */
  tags: string[];
}

// ---------------------------------------------------------------------------
// base62 codec (persistence.cpp:13-23)
// ---------------------------------------------------------------------------

const B62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Decode a single base62 digit char to 0..61. Throws on invalid input. */
export function fromBase62(c: string): number {
  const code = c.charCodeAt(0);
  if (code >= 97 && code <= 122) return code - 97; // a..z => 0..25
  if (code >= 65 && code <= 90) return code - 65 + 26; // A..Z => 26..51
  if (code >= 48 && code <= 57) return code - 48 + 52; // 0..9 => 52..61
  throw new Error(`not a base62 digit: ${JSON.stringify(c)}`);
}

/** Encode an integer 0..3843 to two base62 digits (inverse of a g() pair). */
export function toBase62Pair(i: number): string {
  if (i < 0 || i >= 62 * 62) throw new Error(`out of base62 pair range: ${i}`);
  return B62[Math.floor(i / 62)] + B62[i % 62];
}

/**
 * Decode one pose frame from its 276-digit blob (whitespace allowed/ignored).
 * Mirrors decodePosition (persistence.cpp:33-56).
 */
export function decodeFrame(blob: string): Pose {
  const s = blob.replace(/\s+/g, "");
  if (s.length < FRAME_DIGITS) {
    throw new Error(
      `frame too short: got ${s.length} digits, need ${FRAME_DIGITS}`,
    );
  }
  let o = 0;
  const g = (): number => {
    const d0 = fromBase62(s[o++]) * 62;
    return (d0 + fromBase62(s[o++])) / 1000;
  };
  const players: Pose = [[], []];
  for (let pl = 0; pl < PLAYER_COUNT; pl++) {
    for (let j = 0; j < JOINT_COUNT; j++) {
      players[pl].push({ x: g() - 2, y: g(), z: g() - 2 });
    }
  }
  return players;
}

/**
 * Re-encode a pose frame to a single 276-char base62 string (no line splitting).
 * Inverse of decodeFrame; mirrors operator<< (persistence.cpp:118-136). Used by
 * tests to validate the codec via round-trip.
 */
export function encodeFrame(pose: Pose): string {
  let s = "";
  const g = (d: number): void => {
    const i = Math.round(d * 1000);
    if (i < 0 || i >= 4000) throw new Error(`coord out of range: ${d}`);
    s += toBase62Pair(i);
  };
  for (let pl = 0; pl < PLAYER_COUNT; pl++) {
    for (let j = 0; j < JOINT_COUNT; j++) {
      const v = pose[pl][j];
      g(v.x + 2);
      g(v.y);
      g(v.z + 2);
    }
  }
  return s;
}

// ---------------------------------------------------------------------------
// description-line parsing (metadata.cpp:37-54)
// ---------------------------------------------------------------------------

function splitWs(rest: string): string[] {
  return rest.trim().split(/\s+/).filter(Boolean);
}

function parseDescription(desc: string[]): {
  name: string;
  tags: string[];
  properties: GMProperties;
} {
  let name = "";
  let tags: string[] = [];
  const propSet = new Set<string>();
  let nameSet = false;
  for (const line of desc) {
    if (line.startsWith("tags:")) {
      tags = splitWs(line.slice("tags:".length));
    } else if (line.startsWith("properties:")) {
      for (const p of splitWs(line.slice("properties:".length))) propSet.add(p);
    } else if (!nameSet) {
      // First non-meta description line is the display name.
      name = line;
      nameSet = true;
    }
  }
  return {
    name,
    tags,
    properties: {
      top: propSet.has("top"),
      bottom: propSet.has("bottom"),
      bidirectional: propSet.has("bidirectional"),
      detailed: propSet.has("detailed"),
    },
  };
}

// ---------------------------------------------------------------------------
// block reader (state machine, persistence.cpp:58-116 + loadGraph:154-169)
// ---------------------------------------------------------------------------

interface RawBlock {
  description: string[];
  frames: Pose[];
  /** 1-based source line of the first description line. */
  sourceLineNr: number;
}

function readBlocks(text: string): RawBlock[] {
  const lines = text.split("\n");
  const blocks: RawBlock[] = [];
  let desc: string[] = [];
  let descStartLine = 0; // 1-based
  let frameBuf: string[] = [];
  let frames: Pose[] = [];
  let current: RawBlock | null = null;
  let lastWasPosition = false;

  const flushFrameBuf = (): void => {
    if (frameBuf.length === 4) {
      frames.push(decodeFrame(frameBuf.join("")));
      frameBuf = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNr = i + 1;
    // EOF sentinel: trailing empty string from split should not start a block.
    const isPosition = line.length > 0 && line[0] === " ";

    if (isPosition) {
      if (!lastWasPosition) {
        // Description -> position boundary: a new block begins.
        current = { description: desc, frames: [], sourceLineNr: descStartLine };
        blocks.push(current);
        desc = [];
        frames = current.frames;
        frameBuf = [];
      }
      frameBuf.push(line);
      flushFrameBuf();
      lastWasPosition = true;
    } else {
      // Description line. Ignore a single trailing empty line (EOF).
      if (line.length === 0 && i === lines.length - 1) break;
      if (desc.length === 0) descStartLine = lineNr;
      desc.push(line);
      lastWasPosition = false;
    }
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// reorientation-aware connectivity (positions.cpp:198-259, players.hpp:73-101)
// ---------------------------------------------------------------------------

// Joint index used for head-to-head alignment.
const HEAD = JOINTS.indexOf("Head");

// mirror joint index map (players.hpp:73-101): swap Left<->Right joints.
const MIRROR_JOINT: number[] = JOINTS.map((j) => {
  if (j.startsWith("Left")) return JOINTS.indexOf(("Right" + j.slice(4)) as Joint);
  if (j.startsWith("Right")) return JOINTS.indexOf(("Left" + j.slice(5)) as Joint);
  return JOINTS.indexOf(j);
});

function angleXZ(v: Vec3): number {
  // angle(xz(v)) — heading angle in the ground plane. atan2(x, z) matches the
  // C++ angle() convention closely enough for matching (any consistent choice
  // works since we re-derive and re-apply the same rotation).
  return Math.atan2(v.x, v.z);
}

function yrot(angle: number, v: Vec3): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  // Rotation about the y axis.
  return { x: c * v.x + s * v.z, y: v.y, z: -s * v.x + c * v.z };
}

/** mirror(V3) = {-x, y, z} (positions.hpp:36). */
function mirrorVec(v: Vec3): Vec3 {
  return { x: -v.x, y: v.y, z: v.z };
}

/** mirror(Position): point-mirror x, then swap Left/Right joints (positions.cpp:130). */
function mirrorPose(p: Pose): Pose {
  const out: Pose = [[], []];
  for (let pl = 0; pl < 2; pl++) {
    const src = p[pl];
    for (let j = 0; j < JOINT_COUNT; j++) {
      out[pl][j] = mirrorVec(src[MIRROR_JOINT[j]]);
    }
  }
  return out;
}

function distSq(a: Vec3, b: Vec3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

/** basicallySame (positions.hpp:49-54): every joint within distSq <= 0.0016. */
function basicallySame(a: Pose, b: Pose): boolean {
  for (let pl = 0; pl < 2; pl++) {
    for (let j = 0; j < JOINT_COUNT; j++) {
      if (distSq(a[pl][j], b[pl][j]) > 0.0016) return false;
    }
  }
  return true;
}

/**
 * Apply a {angle, offset} reorientation to a pose: rotate about y, then translate.
 * Mirrors apply(Reorientation, Position).
 */
function applyReo(angle: number, offset: Vec3, p: Pose): Pose {
  const out: Pose = [[], []];
  for (let pl = 0; pl < 2; pl++) {
    for (let j = 0; j < JOINT_COUNT; j++) {
      const r = yrot(angle, p[pl][j]);
      out[pl][j] = { x: r.x + offset.x, y: r.y + offset.y, z: r.z + offset.z };
    }
  }
  return out;
}

/**
 * is_reoriented_without_mirror_and_swap (positions.cpp:198-211): derive the
 * y-rotation + translation that aligns heads, apply, and test basicallySame.
 */
function reorientedNoMirrorNoSwap(a: Pose, b: Pose): boolean {
  const a0h = a[0][HEAD];
  const a1h = a[1][HEAD];
  const b0h = b[0][HEAD];
  const b1h = b[1][HEAD];
  const angleOff =
    angleXZ({ x: b1h.x - b0h.x, y: 0, z: b1h.z - b0h.z }) -
    angleXZ({ x: a1h.x - a0h.x, y: 0, z: a1h.z - a0h.z });
  const rotA0 = yrot(angleOff, a0h);
  const offset: Vec3 = {
    x: b0h.x - rotA0.x,
    y: b0h.y - rotA0.y,
    z: b0h.z - rotA0.z,
  };
  return basicallySame(applyReo(angleOff, offset, a), b);
}

function reorientedNoSwap(a: Pose, b: Pose): boolean {
  if (reorientedNoMirrorNoSwap(a, b)) return true;
  if (reorientedNoMirrorNoSwap(a, mirrorPose(b))) return true;
  return false;
}

function swapPlayers(p: Pose): Pose {
  return [p[1], p[0]];
}

/**
 * is_reoriented (positions.cpp:233-259): is pose `b` a reorientation
 * (rotation/translation, optional mirror, optional player-swap) of pose `a`?
 * Early-outs on head-to-head distance, which is reorientation-invariant.
 */
export function isReoriented(a: Pose, b: Pose): boolean {
  const h2h = (p: Pose) => distSq(p[0][HEAD], p[1][HEAD]);
  if (Math.abs(h2h(a) - h2h(b)) > 0.05) return false;
  if (reorientedNoSwap(a, b)) return true;
  if (reorientedNoSwap(a, swapPlayers(b))) return true;
  return false;
}

/**
 * Resolve each transition's fromId/toId by matching its first/last frame to a
 * Position pose under reorientation (loadGraph connectivity, graph.cpp:213-237).
 * O(transitions x positions) but pruned hard by the head-to-head early-out.
 */
function resolveConnectivity(
  positions: GMPosition[],
  transitions: GMTransition[],
): void {
  const findNode = (pose: Pose): number | null => {
    for (const pos of positions) {
      if (isReoriented(pos.pose, pose)) return pos.id;
    }
    return null;
  };
  for (const t of transitions) {
    t.fromId = findNode(t.frames[0]);
    t.toId = findNode(t.frames[t.frames.length - 1]);
  }
}

// ---------------------------------------------------------------------------
// public entry point
// ---------------------------------------------------------------------------

export interface ParseOptions {
  /**
   * Resolve transition fromId/toId via reorientation matching. Default true.
   * Set false for a fast structural-only parse (e.g. tag inspection).
   */
  resolveConnectivity?: boolean;
}

/**
 * Parse a full GrappleMap.txt into typed positions + transitions.
 * Pure: takes the file text, returns the model. No I/O.
 */
export function parseGrappleMap(
  text: string,
  options: ParseOptions = {},
): GrappleMapData {
  const blocks = readBlocks(text);
  const positions: GMPosition[] = [];
  const transitions: GMTransition[] = [];
  const tagSet = new Set<string>();

  for (const block of blocks) {
    const meta = parseDescription(block.description);
    for (const t of meta.tags) tagSet.add(t);

    if (block.frames.length === 1) {
      positions.push({
        id: positions.length,
        name: meta.name,
        tags: meta.tags,
        pose: block.frames[0],
        sourceLineNr: block.sourceLineNr,
      });
    } else if (block.frames.length >= 2) {
      transitions.push({
        id: transitions.length,
        name: meta.name,
        tags: meta.tags,
        properties: meta.properties,
        frames: block.frames,
        fromId: null,
        toId: null,
        sourceLineNr: block.sourceLineNr,
      });
    }
    // Zero-frame blocks (only possible from stray description) are ignored.
  }

  if (options.resolveConnectivity !== false) {
    resolveConnectivity(positions, transitions);
  }

  return {
    positions,
    transitions,
    tags: [...tagSet].sort(),
  };
}
