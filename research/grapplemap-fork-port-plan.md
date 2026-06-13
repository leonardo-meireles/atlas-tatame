# GrappleMap — Fork vs Port Plan for "O Mapa do Jiu-Jitsu"

> Research + code-reading deliverable. Source repo read locally at
> `/Users/leonardomeireles/Work/claude-roupa-de-jiu/webapp-jiu/source_repos/GrappleMap`
> (eelis/GrappleMap, C++). Upstream: https://github.com/Eelis/GrappleMap , live site http://eel.is/GrappleMap/

---

## LICENSE VERDICT

**GrappleMap is released entirely into the PUBLIC DOMAIN — both the code AND the pose data (`GrappleMap.txt`). We may use, fork, port, modify, restyle, sell, and ship it in a paid product with ZERO legal restriction and ZERO attribution duty.**

Exact text of `source_repos/GrappleMap/LICENSE` (the whole file, 147 bytes):

> "All authors involved in the creation of the contents of this package have agreed to release their respective contributions into the Public Domain."

Confirmed a second time in `README.md`:

> **"What license is the code and data under?** None; the GrappleMap code and data is released into the public domain."

And again:

> **"What is the database format?** The database is a plain text file..." — same public-domain umbrella.

**What this means for a paid product:**

- **CODE** (C++, the JS, shaders): public domain. Forkable and usable commercially. No copyleft, no GPL, no MIT-attribution clause. We can relicense our derivative however we want (proprietary is fine).
- **POSE DATA** (`GrappleMap.txt`, ~3600 positions/transitions): same public-domain release. We can ingest it, transform it, curate it, and sell access to it. Not separately licensed — it falls under the same single LICENSE file.
- **Attribution duties: NONE are legally required.** Public domain imposes no obligation.
- **Caveats / things we may NOT rely on:**
  1. *Third-party deps the C++ build pulls in are NOT public domain* — Boost (BSL-1.0), GLFW (zlib), Babylon.js (Apache-2.0), Emscripten runtime, GLM (MIT). If we **fork the C++/JS as-is** we inherit those licenses. If we **port to our own TS**, we shed all of them. This is a point in favor of porting.
  2. The README cites source instructionals (Marcelo Garcia, Ryan Hall, etc., in `drills/`) as *references* (names/text), not reproduced content. We are only ingesting joint coordinates + tags + short names, not copyrighted instructional video/text, so no derivative-content risk. The `drills/*.txt` are reference name lists, also public-domain here.
  3. Public-domain status depends on the authors' assertion being valid; there is no warranty. Low risk for joint-coordinate data, but we should not represent the data as *our* original creation in marketing if challenged. Practically: zero exposure for a BJJ app.

**Recommended (optional, not required) courtesy:** a one-line "Pose data derived from the public-domain GrappleMap by Eelis (eel.is/GrappleMap)" credit in an About page. Goodwill only, not legally needed.

---

## 1. License & rights — detail

Covered above. Files inspected: `LICENSE`, `README.md` (lines 104-107, 174-187). Single repo-wide public-domain dedication; **no per-file copyright headers** exist in `src/*.cpp/*.hpp` (checked — the source files start directly with `#include`, no license banners). Nothing blocks commercial use, forking, restyling, or resale.

---

## 2. Data format — full spec (enough to write a TS parser)

Source of truth: `src/persistence.cpp`, `src/players.hpp`, `src/positions.cpp`, `src/positions.hpp`, `src/metadata.cpp`. File: `GrappleMap.txt` (2.6 MB, 39,098 lines).

### 2.1 File structure (line-oriented)

The file is a flat sequence of **blocks**. Each block = one or more **description lines** (NOT indented) followed by one or more **encoded position frames** (each frame = exactly **4 indented lines**, each line prefixed by 4 spaces `"    "`).

The parser state machine (`readSeqs`, persistence.cpp:58-116):
- A line is a **position line** iff its first char is a space (`*b == ' '`).
- A line is a **description line** otherwise (it's read until `\n`).
- When description lines transition into position lines, a new block ("Sequence") begins. The description lines accumulated so far become that block's `description`.
- Consecutive position frames append to the current block's `positions[]`.

**Block classification (persistence.cpp:160-168, loadGraph):**
- A block with **exactly 1 position frame** → a **Node** (a named standalone Position).
- A block with **≥2 position frames** → a **Transition** (edge / `Sequence`). Invariant: ≥2 frames, and first≠last under reorientation.

### 2.2 Description lines

```
<name line>              # line 0 — the human name. "\n" inside is a literal backslash-n = line break for display
tags: tag1 tag2 tag3     # optional, space-separated tags
properties: top bidirectional detailed   # optional, space-separated properties
```

- `properties_in_desc` (metadata.cpp:37-54) scans for a line starting `"properties:"`, splits on whitespace. Defined properties: **`top`/`bottom`** (used by other UIs to mark who's moving), **`bidirectional`** (transition usable both directions), **`detailed`** (10 keyframes/sec instead of 5 — purely a playback-density hint).
- `tags:` line: parsed by `tags()` — space-separated. ~hundreds of distinct tags; BJJ-relevant ones seen: `closed_guard`, `full_guard`, `half_guard`, `z_guard`, `rubber_guard`, `deep_half`, `butterfly`, `side_control`, `mount`, `s_mount`, `knee_on_belly`, `back`, `north_south`, `turtle`, `spiderweb`, `truck`, plus grip/posture tags (`crossface`, `underhook`, `seatbelt`, `kimura`, `lockdown`, `top_kneeling`, `bottom_supine`, `bottom_turned_in`, etc.).
- The first description line is the **name** (display string). `\n` (backslash-n, two chars) = forced line break in the name when rendered.

### 2.3 Position frame encoding (the critical part)

Each frame is **one base62-encoded blob split across 4 indented lines**. To decode, **strip leading whitespace and concatenate all 4 lines into one char stream** (the decoder, persistence.cpp:33-56, skips whitespace via `nextdigit`).

- **Joints per player: 23** (`joint_count`, players.hpp:29). **2 players.** So **46 joints total** per frame.
- Each joint stores **3 coordinates** (x, y, z). Each coordinate is **2 base62 digits** (a "g()" pair).
- Total encoded chars per frame = `2 players × 23 joints × 3 coords × 2 digits = 276 chars`. Split into 4 lines of 69 chars each (`encoded_pos_size = 2*joint_count*3*2 + 4*5`; note persistence.cpp:31 adds `4*5` slack for the 4 newlines+indent — the practical decode just reads 276 base62 digits skipping whitespace).

**Base62 alphabet** (persistence.cpp:13):
```
abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
```
i.e. value = `a..z`→0..25, `A..Z`→26..51, `0..9`→52..61.

**Decoding one coordinate (`g()`, persistence.cpp:43-48):**
```
d0   = digit1 * 62          // high digit
value_milli = d0 + digit2   // 0 .. ~3999 (a 2-digit base62 number, 0..3843 actually, but range asserted < 4000)
coord = value_milli / 1000  // float in meters, range ~0..4
```
**Encoding (the writer, persistence.cpp:122-129) confirms it:** `i = round(coord * 1000)`, asserted `0 <= i < 4000`, then `i/62` and `i%62` → 2 digits. So coordinates are stored as **millimeter-ish fixed point: integer 0..3999 = meters 0.000..3.999**.

**Coordinate convention / axes (persistence.cpp:50-55):**
```
p[j] = { g() - 2,  g(),  g() - 2 }
//        x          y      z
```
- **x and z are offset by -2** on decode (so stored 0..4 → world -2..+2 meters), **y is NOT offset** (stored 0..4 → world 0..4, y=up, floor at y=0).
- Axes: **y = up** (vertical), x and z are the horizontal ground plane. Units = **meters** (limb lengths in players.hpp are "in meters", e.g. femur 0.43 m). On write, the inverse adds +2 to x and z (persistence.cpp:133-135).
- Joint write/read order = `playerJoints` = player0's 23 joints in `joints[]` order, then player1's 23 (positions.cpp:65-73, `make_playerJoints`).

### 2.4 Joint order (the 23, players.hpp:8-23 — exact index order)

```
0 LeftToe   1 RightToe   2 LeftHeel   3 RightHeel
4 LeftAnkle 5 RightAnkle 6 LeftKnee   7 RightKnee
8 LeftHip   9 RightHip  10 LeftShoulder 11 RightShoulder
12 LeftElbow 13 RightElbow 14 LeftWrist 15 RightWrist
16 LeftHand 17 RightHand 18 LeftFingers 19 RightFingers
20 Core  21 Neck  22 Head
```
(JS mirror of this exact mapping exists at `src/gm.js:33-55`.)

### 2.5 Minimal TS parser sketch

```ts
const B62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const b62 = (c: string) => B62.indexOf(c);
const JOINT_COUNT = 23, PLAYERS = 2, COORDS = 3;
const FRAME_DIGITS = PLAYERS * JOINT_COUNT * COORDS * 2; // 276

function decodeFrame(blob: string): V3[][] {
  const s = blob.replace(/\s+/g, "");          // strip the 4-line split + indent
  let o = 0;
  const g = () => (b62(s[o++]) * 62 + b62(s[o++])) / 1000;
  const players: V3[][] = [[], []];
  for (let pl = 0; pl < 2; pl++)
    for (let j = 0; j < JOINT_COUNT; j++)
      players[pl].push({ x: g() - 2, y: g(), z: g() - 2 });
  return players;
}

// File parse: walk lines. Indented (startsWith "    ") => collect into a 4-line buffer;
// every 4 indented lines => one frame. Non-indented => description line; flush block on
// description-after-position boundary. Block with 1 frame = Node, >=2 frames = Transition.
// First desc line = name; "tags:" line => tags[]; "properties:" line => props[].
```

That's the entire spec. No checksums in-file (the MD5 is only for an external `.index` cache, persistence.cpp:178-233 — irrelevant to us). Graph connectivity (which transition connects which nodes) is **derived at load time** by matching transition endpoint poses to node poses via reorientation equality (`is_reoriented`), OR read from a sidecar `.index` file. For our purposes we recompute connectivity in TS (see §6).

---

## 3. Renderer — how figures are drawn

Two renderers exist. **(A)** the native/Emscripten C++ GL path (`src/playerdrawer.cpp`, `rendering.cpp`) and **(B)** a pure-JS Babylon.js path (`src/gm.js`) used for some web views. Both draw the SAME model.

### 3.1 The model (everyone shares it)

A "player" = 23 joints (spheres) connected by "limbs" (tapered tubes / pillars), plus a few filled triangles for torso/feet.

- **Joints → spheres.** Radius per joint from `jointDefs` (positions.cpp:7-31). E.g. Head 0.11, Core 0.10, Hip 0.09, Shoulder 0.08, Knee 0.05, Elbow 0.045, Ankle/Heel 0.03, Toe 0.025, Wrist/Hand/Fingers 0.02 (meters). Big joints (Head, Core, Hips, Shoulders) rendered with a finer icosphere (playerdrawer.cpp:269-272).
- **Limbs → tapered cylinders ("pillars").** Table in `players.hpp:126-167` (`limbs()`): each limb = `{ endJointA, endJointB, length, optional midpointRadius, visible }`. Radius at each end = that joint's `jointDefs` radius; some limbs have a fatter `midpointRadius` (e.g. shin 0.055, thigh 0.085, forearm 0.03, neck-to-head 0.05) so they bulge in the middle — drawn as TWO pillars meeting at the midpoint (playerdrawer.cpp:320-328). Only `visible:true` limbs draw; the invisible ones (toe-ankle, hip-core, core-shoulder, hip-hip span) are structural constraints, not drawn.
- **Filled body triangles** (`fatTriangle`, playerdrawer.cpp:111-141, called 363-375): 5 triangles per player give the torso/feet some bulk:
  `LeftHip-Core-RightHip`, `LeftShoulder-Neck-RightShoulder`, `LeftShoulder-Core-RightShoulder`, `LeftAnkle-LeftHeel-LeftToe`, `RightAnkle-RightHeel-RightToe`. A `fatTriangle` is an extruded prism (front+back+edge faces, radius-inflated at each vertex).
- **Colors** (positions.cpp:140): `playerDefs = { player0 = red, player1 = V3{0.15,0.15,1} (blue) }`. So **player 0 is red, player 1 is blue.** In the Babylon path (gm.js:263-267) diffuse is dark (0.1) with red/blue specular and `specularPower 0`. Selected/hovered joints get an override color and +0.005 radius (playerdrawer.cpp:262-265).
- **Pillar geometry** (playerdrawer.cpp:195-219 GL / gm.js:1-31 Babylon): builds a tube by taking two perpendicular basis vectors `a,b` from the segment direction (`a = normalize(cross(dir, {1,1,1}-from))`, `b = normalize(cross(dir, a))`), then sweeping a circle of `faces` segments. Babylon version uses `BABYLON.Mesh.CreateRibbon` over two rings.
- **Scene** (gm.js:276-295): a grey floor grid (lines at 0.5 m spacing), y=up. Simple diffuse+specular lighting, no shadows. The GLSL shaders (`triangle.vertexshader`/`.fragmentshader`) do basic per-vertex lighting.
- **Animation:** transitions are keyframe arrays; playback linearly interpolates between frames (`interpolate_position`, gm.js:483-492) at 5 (or 10 if `detailed`) keyframes/sec.

### 3.2 Minimal reproduction in three.js / R3F (or SVG)

This is genuinely small. To reproduce a static pose or animation:

- **Per joint:** one `<Sphere args={[radius, 12, 12]}>` at `position={[x,y,z]}`, colored by player (red/blue). 46 spheres total.
- **Per visible limb:** a tapered tube. Easiest: `THREE.CylinderGeometry(rTop, rBottom, length)` oriented from A→B (or a `TubeGeometry`/`MeshLine`). For the mid-bulge limbs, two cylinders. ~27 visible limbs/player.
- **Torso/feet:** 5 small triangle meshes per player (or skip them in an MVP — the spheres+limbs already read as a body).
- **Materials:** `MeshStandardMaterial` red/blue, one directional light + ambient, a grid helper floor (`<gridHelper>`), y-up (three.js default). Done.
- **Animation:** lerp joint positions between keyframes with a clock; rebuild/translate sphere positions and re-orient cylinders each frame. R3F `useFrame` handles this trivially.
- **SVG / 2D fallback:** project (x,y) ignoring z (or an isometric x+z, y) → draw `<circle>` joints + `<line>`/`<path>` limbs. Cheaper, good for thumbnails/search results, loses 3D rotation. Recommended for list/thumbnail views; R3F for the hero/detail view.

The renderer is the LEAST risky part to port — it's ~200 lines of pure geometry with all constants already extracted above.

---

## 4. Editor — what it does, and porting it

Two editors exist:

- **Web editor** (`src/editor.html` + `editor.js` + `editor.css`, manual at `doc/web-editor.md`): this is **NOT a JS app**. `editor.js` is an **Emscripten/WASM bootstrap** — the real editor logic is C++ (`src/editor_canvas.cpp` ~26 KB, `editor.cpp`, `editor_canvas.hpp`) compiled to WebAssembly, drawing via WebGL (GLES3). `editor_canvas.hpp:36-81` shows the editor state lives entirely in C++ (`Editor editor{loadGraph("GrappleMap.txt")}`, camera, closest_joint picking, clipboard, confine flags, dirty tracking).
- **Native editor** (`glfw_editor.cpp`) and a **VR editor** (`vr_editor.cpp`) — Linux-only, GLFW/Vrui.

**What the editor lets a user do** (`doc/web-editor.md`):
- Browse the graph; a current **path** = chain of transitions. Scroll through frames via wheel, or **drag joints with the right mouse button** to pose.
- **Local vs non-local edits:** by default only "local" edits (affecting the current transition only). Edits to the first/last frame of a transition are only allowed if they're "mere reorientations" (mirror, player-swap, rotate/translate of both players) to avoid silently breaking connected positions.
- **Inverse-kinematics-ish constraints:** `spring()` (positions.cpp) enforces limb lengths after a drag, and `apply_limits` clamps joints above the floor (y ≥ radius). So when you drag a hand, the arm stays the right length.
- Edit metadata (name/tags/properties) as text.
- Disallows "identity transitions" (end = reorientation of start).
- Save writes the DB back to `GrappleMap.txt`; contribution is via git PR (no integrated submit).

**Could we port it so non-coders pose/edit positions?** Yes, and this is the high-value, higher-effort piece. The drag-a-joint-with-length-constraints interaction is the core. Effort estimate for a TS/R3F re-implementation:

- **Joint picking + drag in R3F:** raycaster against the 46 spheres, drag in a screen-aligned plane → ~1-2 days.
- **Length-constraint solver (`spring`):** port positions.cpp `spring()` — iterative relaxation that pulls each limb back to its defined `length`. ~2-3 days incl. tuning. `apply_limits` (floor clamp) trivial.
- **Frame timeline / keyframe editing (add/copy/delete frame, scrub):** ~3-5 days.
- **Reorientation math (mirror/swap/rotate/translate, canonical orientation):** already fully specified in `gm.js:304-412` (pure JS — `apply_reo`, `yrot`, `mirror`, `swapLimbs`, `compose_reo`, `inverse_reo`). **We can lift this JS almost verbatim.** ~1-2 days to port + type.
- **Graph connectivity / "is this a valid local edit" rules:** ~3-5 days.
- **Metadata UI (name/tags/props):** ~1-2 days, standard React forms.

**Total editor port: ~3-4 focused weeks** for a solid pose-and-connect editor. The constraint solver + reorientation math are the only non-trivial algorithms, and the reorientation math is already in plain JS we can copy. We do NOT need to port the WASM editor — we reimplement the interaction in React/R3F on top of our own data model.

---

## 5. Fork vs Port — RECOMMENDATION

### Option A — Fork the C++ repo
Keep the C++/Emscripten/WASM/Babylon stack, build it, embed the existing editor/explorer/viewer.

- Pros: editor + IK solver + renderer already work; least logic to rewrite.
- Cons: **terrible fit for our Next.js 16 / React 19 / TS / R3F stack.** We'd be embedding a WASM blob + Babylon.js (a second 3D engine alongside the R3F/three.js we already use), a C++ toolchain (Emscripten, Boost, GLFW, GLM) in CI, and an opaque editor we can't restyle or extend in React. Restyling figures = editing C++ + recompiling WASM. Adding our own data model, curation UI, i18n (pt-BR), and Tailwind styling means fighting an alien architecture. Build/maintenance burden is high and forever.

### Option B — Port to a TS library WE own (RECOMMENDED)
Parse `GrappleMap.txt` into our own TS types, render in R3F (and SVG for thumbnails), reimplement editing in React.

- Pros: **native to our stack.** No WASM, no C++ toolchain, no Babylon, no Boost — we shed every third-party-license dependency from §1 caveat. Full control to restyle figures (it's just three.js materials/geometry), curate/filter to BJJ, add pt-BR names, build the editor in React with our design system, and extend the data model (add belt-level, video links, our own positions). The data format is tiny and fully specified above. The renderer is ~200 lines. The hard math (reorientation, spring) is small and partially already in plain JS we can copy.
- Cons: we rewrite the editor (~3-4 wks, see §4) and the IK/spring solver. But this is bounded and we'd want our own editor anyway.

### Verdict: **PORT (Option B).**
The data is public-domain and trivially parseable; the renderer is small; the only real work (editor + spring solver) we'd want to own regardless. Forking the C++ would saddle a modern Next.js product with a WASM/C++/Babylon millstone we can never cleanly restyle or extend. **Port it into a TS library, treat `GrappleMap.txt` as a public-domain seed dataset, and own everything downstream.**

---

## 6. Concrete translation plan (the PORT)

### 6.1 TS data model (`packages/grapplemap` or `src/lib/grapplemap`)

```ts
export type V3 = { x: number; y: number; z: number };
export type Joint =
  | "LeftToe" | "RightToe" | "LeftHeel" | "RightHeel" | "LeftAnkle" | "RightAnkle"
  | "LeftKnee" | "RightKnee" | "LeftHip" | "RightHip" | "LeftShoulder" | "RightShoulder"
  | "LeftElbow" | "RightElbow" | "LeftWrist" | "RightWrist" | "LeftHand" | "RightHand"
  | "LeftFingers" | "RightFingers" | "Core" | "Neck" | "Head";
export const JOINTS: Joint[] = [/* exact order from players.hpp, see §2.4 */];

export type PlayerPose = Record<Joint, V3>;     // or V3[23] indexed by JOINTS order
export type Pose = [PlayerPose, PlayerPose];     // [red(player0), blue(player1)]

export interface Position {        // a graph Node
  id: number;                      // our own stable id
  name: string;                    // first desc line (\n => line break)
  tags: string[];
  pose: Pose;
  sourceLineNr?: number;           // provenance into GrappleMap.txt
}

export interface Transition {      // a graph Edge
  id: number;
  name: string;
  tags: string[];
  properties: { top?: boolean; bottom?: boolean; bidirectional: boolean; detailed: boolean };
  frames: Pose[];                  // >=2
  fromId: number; toId: number;    // resolved connectivity
}

export interface GrappleGraph { positions: Position[]; transitions: Transition[]; tags: string[]; }
```

We extend this freely later (belt level, pt-BR/en names, video URLs, curated flag, our own authorship).

### 6.2 Parser approach (build-time, not runtime)

- Write `parseGrappleMap(text): {nodes, transitions}` per the §2.5 sketch (state machine + base62 frame decode). Pure function, no deps.
- **Resolve connectivity** ourselves: for each transition, find the node whose pose equals the transition's first frame (and last frame) under canonical reorientation. Port `orient_canonically_with_mirror` / `is_reoriented` (positions.cpp + the JS in gm.js) — compare poses after normalizing translation (center at origin) and heading rotation, allowing mirror + player-swap, with `basicallySame` tolerance (`distanceSquared < 0.0016`, positions.hpp:49-54). Cache the resolved graph.
- **Run the parser at build time**, emit a compact JSON (or several JSON shards) that ships to the client. ~3600 entries × ~276 floats — quantize back to the int 0..3999 form to keep it small (store as the base62 string or as `Int16Array` chunks; the client expands). This keeps the bundle lean and the runtime simple.
- Snapshot-test the parser: decode a known frame, re-encode (port persistence.cpp:118-144 writer), assert round-trip equals the original line — this validates the whole codec against the real file.

### 6.3 Render approach

- **Detail/hero view:** R3F. `<Figure pose={...} />` component: map JOINTS → 46 `<mesh><sphereGeometry/></mesh>` with red/blue `MeshStandardMaterial`; map visible limbs (port `limbs()` table, players.hpp:126-167) → tapered cylinders (two per mid-bulge limb); optional 5 torso/feet triangles. `<gridHelper/>` floor, one `<directionalLight/>` + `<ambientLight/>`, `OrbitControls`. Animate via `useFrame` lerping between keyframes (5 or 10 fps per `detailed`). All constants (radii, colors, limb table) are extracted in §3.
- **Restyle freely:** swap materials (toon/MeshToon for a cleaner look, gradient skins, belt-colored players), thicker outlines, drop-shadow ground — all trivial in three.js, impossible-without-recompile in the fork. This is a major reason to port.
- **Thumbnail/list/search view:** SVG 2D projection (drop z, or isometric) — cheap, SSR-able in Next, perfect for the search grid and position cards.

### 6.4 Filtering ~3600 poses → BJJ / closed-guard-relevant subset

The data is already heavily BJJ/no-gi (README: wrestling/BJJ/Judo/Sambo; no gi). Filter by **tags**:

- **Core BJJ guard/control tags present in the data:** `closed_guard`, `full_guard`, `half_guard`, `z_guard`, `rubber_guard`, `deep_half`, `quarter_guard`, `butterfly`, `spiderweb`, `side_control`, `mount`, `s_mount`, `three_quarter_mount`, `knee_on_belly`, `back`, `north_south`, `turtle`, `truck`, `lower_back_control`, plus submissions (`triangle`, `armbar`, `kimura`, `omoplata`, `darce`, `guillotine`, `heel_hook`, `toehold`, `kneebar`, `arm_triangle`, `rear_naked_choke`) and grips/postures (`crossface`, `underhook`, `seatbelt`, `lockdown`, `whizzer`, `knee_shield`, `combat_base`, `top_kneeling`, `bottom_supine`, ...).
- **For "closed guard" specifically:** select positions/transitions tagged `closed_guard` OR `full_guard`, then graph-walk outward (BFS over connected transitions, `grow()` in gm.js:529-553 is exactly this) N hops to pull in entries, sweeps, submissions, and passes reachable from closed guard. This gives a coherent connected sub-graph, not isolated poses.
- **Pipeline:** parse → tag-whitelist filter → connected-component prune → manual curation pass (rename to pt-BR, drop low-quality, flag favorites). Store the curated subset as our own seed; keep provenance `sourceLineNr`.
- Realistically the BJJ-ground subset is the large majority of the 3600; takedown/wrestling-only entries (`double_leg_takedown`, `single_leg_takedown`, `sprawl`, `te_waza`, `ashi_waza`) are the main exclusions for a guard-focused MVP.

### 6.5 Adding / editing positions going forward

- **MVP (no editor):** author new positions by hand-writing our TS `Position`/`Transition` objects, or by cloning + nudging existing poses in a tiny dev-only R3F drag tool. Validate with the spring solver + floor clamp.
- **Full editor (Phase 3):** the React/R3F editor from §4 — drag joints (raycast pick), spring-constrain limb lengths, scrub/add/copy/delete keyframes, edit name/tags, connect transitions between positions, mirror/swap/reorient (port the plain-JS reorientation math from gm.js). Persist to our DB (Postgres/JSON), not back to a text file. Add belt-level, pt-BR/en names, embedded video, "curated" flags — all our own schema extensions.

### 6.6 Phasing

- **Phase 0 — Parser + fixtures (3-5 days):** TS parser, base62 codec, round-trip snapshot test against `GrappleMap.txt`, connectivity resolver. Emit curated JSON.
- **Phase 1 — Read-only MVP (1-1.5 wks):** R3F `<Figure>` + animated transition player; SVG thumbnails; search/filter by tag; closed-guard sub-graph. Ship it.
- **Phase 2 — Restyle + curate (1 wk):** new figure style (toon/belt colors/outline), pt-BR names, curation of the BJJ subset, position/transition detail pages, our own data extensions.
- **Phase 3 — Editor (3-4 wks):** React/R3F pose editor with spring solver, keyframe timeline, reorientation tools, graph connect, metadata; persist to our DB. Lets non-coders add/edit positions.

---

## Key files cited (all under `source_repos/GrappleMap/`)

- `LICENSE`, `README.md` — license (public domain).
- `src/persistence.cpp` — file format, base62 codec, coordinate convention, block parsing.
- `src/players.hpp` — 23 joints, limb table, player colors def, joint radii usage, mirror map.
- `src/positions.cpp` / `positions.hpp` — `jointDefs` (radii), `playerDefs` (red/blue), spring/reorientation/canonical math, `Position`/`Sequence` types.
- `src/metadata.cpp` — tags + `properties:` parsing.
- `src/playerdrawer.cpp` — sphere/pillar/fatTriangle rendering, colors, lighting hooks.
- `src/gm.js` — Babylon.js renderer + **plain-JS reorientation math we can lift** (apply_reo/yrot/mirror/swapLimbs/compose_reo, graph grow/random_path, joint+limb tables).
- `src/dbtojs.cpp`, `js_conversions.cpp` — how C++ exports the graph to JS (`db.nodes`/`db.transitions` shape we mirror).
- `src/editor_canvas.hpp`, `editor.js`, `doc/web-editor.md` — editor is C++→WASM (Emscripten), confirming we must reimplement, not reuse, the editor.
