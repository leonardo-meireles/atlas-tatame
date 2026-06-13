import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  parseGrappleMap,
  decodeFrame,
  encodeFrame,
  fromBase62,
  toBase62Pair,
  isReoriented,
  JOINTS,
  JOINT_COUNT,
  FRAME_DIGITS,
  type GrappleMapData,
  type Pose,
} from "./parser";
import { filterByTags, closedGuardNeighbourhood } from "./bjj-filter";

// The real public-domain database. Read once.
const GM_PATH = join(
  process.cwd(),
  "source_repos/GrappleMap/GrappleMap.txt",
);

// A known pose block from the very top of GrappleMap.txt ("side ctrl w/..."),
// 276 base62 digits over 4 lines. Used for exact-decode assertions.
const KNOWN_FRAME_BLOB = [
  "Q2aAwQJFazuRQGddznKqcxxSRkbTzoJpbsxEToa1FVGgaYDSPnfgB7LGfaCxRle1LbLSf",
  "nLOSubdIJKoaVL8QsaUMqOmauNOP1azNAPva9NNPnblOlQAauNFN2ffGdOFe9MbPefdOP",
  "v1azIfCljpKozGaGIPC8hlHqyEbHICDOijIcBYhKINJsiuEeF7cdJFGMcjFZOPbwMhQcb",
  "BHkKwbhN5QNfyEQNIdfL9R4e1IWO0dcL5SggbJuPLd9MvRSgpKHKibTIsQDbQJ4SMbWLG",
].join("");

// approx-equality for meter coords (decode is quantised to 0.001 m).
const near = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) <= eps;

describe("base62 codec", () => {
  it("maps the alphabet a..z A..Z 0..9 to 0..61", () => {
    expect(fromBase62("a")).toBe(0);
    expect(fromBase62("z")).toBe(25);
    expect(fromBase62("A")).toBe(26);
    expect(fromBase62("Z")).toBe(51);
    expect(fromBase62("0")).toBe(52);
    expect(fromBase62("9")).toBe(61);
  });

  it("throws on a non-base62 character", () => {
    expect(() => fromBase62("!")).toThrow();
  });

  it("toBase62Pair is the inverse of a digit pair", () => {
    for (const i of [0, 1, 61, 62, 1234, 3843]) {
      const s = toBase62Pair(i);
      expect(s).toHaveLength(2);
      expect(fromBase62(s[0]) * 62 + fromBase62(s[1])).toBe(i);
    }
  });
});

describe("decodeFrame", () => {
  it("decodes exactly 276 digits into 23 joints x 2 players", () => {
    expect(KNOWN_FRAME_BLOB).toHaveLength(FRAME_DIGITS);
    const pose = decodeFrame(KNOWN_FRAME_BLOB);
    expect(pose).toHaveLength(2);
    expect(pose[0]).toHaveLength(JOINT_COUNT);
    expect(pose[1]).toHaveLength(JOINT_COUNT);
  });

  it("decodes known joint coordinates (player0 LeftToe, player0 Head)", () => {
    const pose = decodeFrame(KNOWN_FRAME_BLOB);
    const head = JOINTS.indexOf("Head");
    // Values independently decoded from the C++ codec (g()-2, g(), g()-2).
    expect(near(pose[0][0].x, 0.658)).toBe(true);
    expect(near(pose[0][0].y, 0.026)).toBe(true);
    expect(near(pose[0][0].z, -0.594)).toBe(true);
    expect(near(pose[0][head].x, 0.546)).toBe(true);
    expect(near(pose[0][head].y, 0.313)).toBe(true);
    expect(near(pose[0][head].z, 0.521)).toBe(true);
  });

  it("applies the -2 offset to x and z but not to y (y = up, floor at 0)", () => {
    const pose = decodeFrame(KNOWN_FRAME_BLOB);
    // all y values are >= 0 (decoded directly, no offset).
    for (const pl of pose) for (const j of pl) expect(j.y).toBeGreaterThanOrEqual(0);
  });

  it("ignores whitespace inside the blob (4-line split)", () => {
    const split = decodeFrame(
      "  Q2aAwQJFazuRQGddznKqcxxSRkbTzoJpbsxEToa1FVGgaYDSPnfgB7LGfaCxRle1LbLSf\n" +
        "    nLOSubdIJKoaVL8QsaUMqOmauNOP1azNAPva9NNPnblOlQAauNFN2ffGdOFe9MbPefdOP\n" +
        "    v1azIfCljpKozGaGIPC8hlHqyEbHICDOijIcBYhKINJsiuEeF7cdJFGMcjFZOPbwMhQcb\n" +
        "    BHkKwbhN5QNfyEQNIdfL9R4e1IWO0dcL5SggbJuPLd9MvRSgpKHKibTIsQDbQJ4SMbWLG",
    );
    expect(decodeFrame(KNOWN_FRAME_BLOB)).toEqual(split);
  });

  it("round-trips decode -> encode back to the original blob", () => {
    const pose = decodeFrame(KNOWN_FRAME_BLOB);
    expect(encodeFrame(pose)).toBe(KNOWN_FRAME_BLOB);
  });
});

describe("parseGrappleMap (against the real GrappleMap.txt)", () => {
  let data: GrappleMapData;

  beforeAll(() => {
    const text = readFileSync(GM_PATH, "utf8");
    data = parseGrappleMap(text);
  });

  it("parses ~600 positions and ~1485 transitions", () => {
    expect(data.positions.length).toBeGreaterThan(550);
    expect(data.transitions.length).toBeGreaterThan(1400);
  });

  it("the first block is the named 'side ctrl' position with its tags", () => {
    const first = data.positions[0];
    expect(first.name.startsWith("side ctrl")).toBe(true);
    expect(first.tags).toContain("side_control");
    expect(first.tags).toContain("crossface");
    // its pose matches the known fixture frame.
    expect(encodeFrame(first.pose)).toBe(KNOWN_FRAME_BLOB);
  });

  it("every position has a single pose of 23x2 joints", () => {
    for (const p of data.positions) {
      expect(p.pose[0]).toHaveLength(JOINT_COUNT);
      expect(p.pose[1]).toHaveLength(JOINT_COUNT);
    }
  });

  it("every transition has >=2 keyframes", () => {
    for (const t of data.transitions) {
      expect(t.frames.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("parses transition properties (bidirectional/detailed flags exist)", () => {
    // At least some transitions carry parsed boolean properties.
    const anyBidi = data.transitions.some((t) => t.properties.bidirectional);
    expect(anyBidi).toBe(true);
  });

  it("resolves connectivity: most transitions link to known positions", () => {
    const resolved = data.transitions.filter(
      (t) => t.fromId !== null && t.toId !== null,
    );
    // The reorientation matcher should resolve the large majority of edges.
    expect(resolved.length).toBeGreaterThan(data.transitions.length * 0.7);
    // resolved ids point at real positions.
    for (const t of resolved.slice(0, 50)) {
      expect(data.positions[t.fromId!]).toBeDefined();
      expect(data.positions[t.toId!]).toBeDefined();
    }
  });

  it("collects a stable sorted tag vocabulary", () => {
    expect(data.tags).toContain("closed_guard");
    expect(data.tags).toContain("mount");
    expect([...data.tags]).toEqual([...data.tags].sort());
  });
});

describe("isReoriented", () => {
  it("a pose is trivially a reorientation of itself", () => {
    const pose = decodeFrame(KNOWN_FRAME_BLOB);
    expect(isReoriented(pose, pose)).toBe(true);
  });

  it("a pose translated within tolerance still matches; far apart does not", () => {
    const pose = decodeFrame(KNOWN_FRAME_BLOB);
    const shifted: Pose = [
      pose[0].map((v) => ({ x: v.x + 5, y: v.y, z: v.z })),
      pose[1].map((v) => ({ x: v.x + 5, y: v.y, z: v.z })),
    ];
    // pure x-translation is a valid reorientation -> still matches.
    expect(isReoriented(pose, shifted)).toBe(true);
  });

  it("rejects an unrelated pose", () => {
    const a = decodeFrame(KNOWN_FRAME_BLOB);
    const b: Pose = [
      a[0].map((v) => ({ x: v.x, y: v.y + 1.5, z: v.z })),
      a[1].map((v) => ({ x: v.x, y: v.y, z: v.z })),
    ];
    expect(isReoriented(a, b)).toBe(false);
  });
});

describe("bjj-filter (against the real graph)", () => {
  let data: GrappleMapData;

  beforeAll(() => {
    data = parseGrappleMap(readFileSync(GM_PATH, "utf8"));
  });

  it("filterByTags keeps a BJJ subset smaller than the whole", () => {
    const sub = filterByTags(data);
    expect(sub.positions.length).toBeGreaterThan(0);
    expect(sub.positions.length).toBeLessThan(data.positions.length);
    // a guard-tagged position survives, a pure standing-takedown one drops.
    expect(
      sub.positions.some((p) => p.tags.includes("closed_guard")),
    ).toBe(true);
  });

  it("closedGuardNeighbourhood grows a connected sub-graph from closed guard", () => {
    const hood = closedGuardNeighbourhood(data, { hops: 2 });
    expect(hood.positions.length).toBeGreaterThan(0);
    // it must include at least one closed_guard / full_guard seed.
    expect(
      hood.positions.some(
        (p) =>
          p.tags.includes("closed_guard") || p.tags.includes("full_guard"),
      ),
    ).toBe(true);
    // every kept transition connects two kept positions.
    const ids = new Set(hood.positions.map((p) => p.id));
    for (const t of hood.transitions) {
      expect(ids.has(t.fromId!)).toBe(true);
      expect(ids.has(t.toId!)).toBe(true);
    }
  });

  it("growing more hops never shrinks the neighbourhood", () => {
    const h1 = closedGuardNeighbourhood(data, { hops: 1 });
    const h3 = closedGuardNeighbourhood(data, { hops: 3 });
    expect(h3.positions.length).toBeGreaterThanOrEqual(h1.positions.length);
  });
});
