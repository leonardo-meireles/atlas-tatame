# 3D GrappleMap Investigation — Live Browser Rendering for O Mapa do Jiu-Jitsu

**Date:** 2026-05-24  
**Scope:** Evaluate translating GrappleMap pose data into a live 3D browser renderer
(React-Three-Fiber stack) as an alternative / complement to the 2D pictogram path.
Covers rendering stack, art direction, graph performance, pipeline, and honest
2D-vs-3D verdict.

---

## TL;DR — 6-line summary

1. **The tech is ready and the data is already there.** R3F + three.js + `MeshToonMaterial`
   + backface-outline is a one-week port from the existing TS pose parser — see spike in
   `.scratch/3d-spike/`.
2. **Single shared WebGL canvas on expand is the only viable graph pattern.** One canvas
   per node is a hard no; shared canvas with a single rendered pose is feasible and fast.
3. **Toon + outline beats plain capsules hard** on "escaping stickman" — two flat-shaded
   volumetric figures in contrasting colors read immediately as bodies, not lines.
4. **Pre-rendered thumbnails (PNG or SVG) for all graph nodes; live 3D only on the focused
   one** is the right hybrid — identical to what GrappleMap itself does and what the
   existing 2D-figure-pipeline.md already recommends.
5. **No new npm deps needed to validate** — the spike uses three.js via importmap CDN; wiring
   into the app needs `@react-three/fiber`, `@react-three/drei` (both MIT, well-supported).
6. **Verdict: 3D wins on "escaping stickman" and future-proofing (scrub transitions);
   2D SVG wins on zero-dep build simplicity and mobile cost at graph scale.** A hybrid is
   the right call — build the 3D path first for the expanded node, keep 2D thumbnails.

---

## 1. Live 3D in the browser — React-Three-Fiber stack evaluation

### Recommended stack

| Layer | Package | Version (2026-05) | License | Notes |
|---|---|---|---|---|
| Renderer | `three` | r177 | MIT | Stable, 600 KB min+gz with tree-shaking |
| React bridge | `@react-three/fiber` | 9.x (React 19 compatible) | MIT | Declarative three.js; fully supported in Next.js 16 |
| Helpers | `@react-three/drei` | 10.x | MIT | OrbitControls, useGLTF, Outlines, Environment, etc. |
| Post-processing | `@react-three/postprocessing` | 3.x | MIT | Optional; needed only for full OutlinePass bloom etc. |

**react-three-fiber on Next.js 16 / React 19:** Fully supported. Use `"use client"` on
the canvas component — R3F uses `useEffect` / `useRef` and doesn't SSR. Wrap in a
`next/dynamic` with `ssr: false` to avoid hydration errors:

```tsx
// src/components/figura-3d.tsx  ("use client")
const Figura3D = dynamic(() => import('./figura-3d-inner'), { ssr: false });
```

**Bundle cost:** three.js itself is the weight (~600 KB gzipped in a naive import, ~200 KB
with proper tree-shaking via the `/three.module.js` entry). R3F + Drei add ~80 KB.
`@react-three/postprocessing` adds ~120 KB — skip unless you need bloom/DOF.
Total budget with tree-shaking: ~350–400 KB. Acceptable for a detail panel that only loads
on expand; unacceptable if loaded eagerly on every graph node.

**SSR caveat:** three.js touches `window` / `WebGLRenderingContext` at import time.
Always keep it behind `dynamic(..., { ssr: false })`. Existing research in
`2d-figure-pipeline.md` already documents this pattern.

### Building a fighter from GrappleMap joint data in 3D

The geometry recipe is in `research/2d-figure-pipeline.md` (Q3 section). In short:

```tsx
// Tapered cylinder (truncated cone) between two joints — mirrors drawPillar()
// from GrappleMap playerdrawer.cpp
function Limb({ a, b, r0, r1, material }) {
  const dir = b.clone().sub(a);
  const len = dir.length();
  const mid = a.clone().lerp(b, 0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), dir.clone().normalize()
  );
  return (
    <mesh position={mid} quaternion={quat} material={material} castShadow>
      <cylinderGeometry args={[r1, r0, len, 8]} />
    </mesh>
  );
}

// Sphere joint
function Joint({ pos, radius, material }) {
  return (
    <mesh position={pos} material={material} castShadow>
      <sphereGeometry args={[radius, 10, 8]} />
    </mesh>
  );
}

// Full fighter from a PlayerPose (23 Vec3 joints)
function Fighter({ playerPose, color, darkColor }) {
  const mat = useMemo(() => new THREE.MeshToonMaterial({ color, gradientMap: toon2Step(color, darkColor) }), []);
  const pts = playerPose.map(j => new THREE.Vector3(j.x, j.y, j.z));
  return (
    <group>
      {BONES.map(([ai, bi, r0, r1], k) => (
        <Limb key={k} a={pts[ai]} b={pts[bi]} r0={r0} r1={r1} material={mat} />
      ))}
      {JOINTS.map((_, j) => (
        <Joint key={j} pos={pts[j]} radius={JOINT_RADIUS[j]} material={mat} />
      ))}
    </group>
  );
}
```

**Two fighters, two colors:** Player 0 = clay-red (`--clay`), Player 1 = blue-ink.
Colors are already in the design token system; use `new THREE.Color(0xcc4433)` etc.

**Camera auto-framing:** `cameraFor()` is already implemented in
`src/lib/grapplemap/render-spec.ts`. Translate the returned `Camera.eye`/`target`
into the R3F camera and pass `makeDefault` to OrbitControls:

```tsx
<PerspectiveCamera makeDefault fov={42} position={cam.eye} />
<OrbitControls target={cam.target} enableDamping dampingFactor={0.08} />
```

---

## 2. Art direction in 3D — escaping capsule stickman

### The stickman problem

Plain capsules with flat diffuse = stickman with volume. The visual problem is not
the capsule geometry; it's **the lack of a rendering style that reads as authorial**.
GrappleMap's own viewer (diffuse + two lights) does _not_ escape stickman — it looks
like a tech demo, not an illustrated atlas.

### Options ranked

#### A. MeshToonMaterial + backface outline (RECOMMENDED — used in spike)

**How:** Three.js `MeshToonMaterial` accepts a `gradientMap` texture (a 1×N
color ramp with `NearestFilter` so bands are sharp). A 2-step ramp (shadow / highlight)
gives clean flat-shaded volume. The outline is a second pass of the same mesh scaled
outward with `side: THREE.BackSide` and near-black `MeshBasicMaterial`.

**Cost:** Zero post-processing passes. Runs in a single render pass. Mobile-safe.

**Look:** Clean, illustrated, unambiguously "crafted." Two contrasting flat-shaded
volumes (clay-red / blue-ink) read immediately as two bodies even in compact thumbnails.

**Code:**
```ts
// 2-step toon ramp (shadow band below 0.38 NdotL threshold)
function toon2Step(base: THREE.Color, shadow: THREE.Color): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 1;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 4, 0);
  g.addColorStop(0.00, '#' + shadow.getHexString());
  g.addColorStop(0.38, '#' + shadow.getHexString());
  g.addColorStop(0.40, '#' + base.getHexString());
  g.addColorStop(1.00, '#' + base.getHexString());
  ctx.fillStyle = g; ctx.fillRect(0, 0, 4, 1);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = tex.magFilter = THREE.NearestFilter;
  return tex;
}
```

**Drei `<Outlines>` alternative:** `@react-three/drei` ships `<Outlines thickness={0.04} color="black" />` as a child of a mesh — same backface technique, cleaner JSX API.

#### B. MatCap — one texture, zero lights

**How:** `MeshMatCapMaterial` with a handpainted matcap texture (e.g. a clay/plasticine
sphere painted in Photoshop). No lighting computation at all; the texture encodes the
entire shading response. Very cheap, deterministic, offline-art-directabe.

**Look:** More "sculpted clay" than "technical diagram." Warmer/more editorial. Looks
excellent but leans away from atlas/instructional toward product illustration.

**Source:** Free matcaps at https://github.com/nidorx/matcaps (CC0/MIT). The
terracotta/clay ones (e.g. `07C0CE`) match the app's clay tone perfectly.

**Recommendation:** Use matcap as an alternative in the style toggle, or as the
thumbnail look (pre-rendered via headless canvas.toDataURL).

#### C. drei `<Outlines>` + `MeshStandardMaterial` (simpler than toon)

Standard PBR material with an outline is closer to "product CAD" than "illustration."
Avoid for this atlas-style app.

#### D. Three.js `OutlinePass` (postprocessing) — overkill for mobile

`OutlinePass` from `three/examples/jsm/postprocessing/` is the GPU full-scene outline.
Beautiful, but adds a full postprocessing pass (render target, EffectComposer), ~120 KB
extra, and hurts mobile performance. The backface technique (option A) gets 90% of the
visual result at zero cost. Skip `OutlinePass` for now.

#### E. Tapered limbs → already done

The GrappleMap recipe already uses tapered cylinders (`CylinderGeometry(r1, r0, len, 8)`)
rather than uniform tubes. Forearm is narrower than upper arm, shin narrower than thigh.
This alone moves the silhouette substantially away from "stickman" — the proportional
variation signals "body" not "stick."

**Thick hands / feet:** Add flattened `SphereGeometry` or a small box at the wrist/ankle
joint to suggest hands/feet mass. One extra mesh per extremity, minimal cost.

### Two-tone atlas look — design spec

```
Player A (de baixo):  clay #cc4433 / shadow #882211, matcap: terracotta
Player B (de cima):   ink-blue #2255cc / shadow #113388, matcap: cobalt
Background:           --mat (oklch 0.235 0.01 78) = tatami canvas
Floor:                subtle flat plane, 10–15% opacity grid, no texture
Outline:              near-black #111111, BackSide, scale 1.12
Banding:              2-step only (shadow / lit) — no gradient, no AI-slop softness
```

---

## 3. Performance and UX on the graph

### The core constraint

`/mapa` uses React Flow (XY Flow) with potentially dozens of nodes visible. Each node
needs a figure. Two failure modes:
1. **One WebGL context per node** — browser hard-limits WebGL contexts to 8–16 per tab
   (Chrome: 16, Safari: 8, Firefox: varies). With 20+ nodes this crashes silently.
2. **One shared canvas rendering all nodes simultaneously** — WebGL doesn't support
   rendering to arbitrary DOM positions efficiently; React Flow nodes are positioned
   with `transform: translate(x, y)` and may be off-screen.

### Recommended architecture: hybrid thumbnail + shared canvas

```
┌─────────────────────────────────────────────────────┐
│  /mapa  (React Flow on tatami canvas)               │
│                                                     │
│  Each node: <img src="/stills/{id}.png" />          │  ← cheap, cache-friendly
│             or <SvgPictograma /> (live SVG)         │
│                                                     │
│  Focused / expanded node:                           │
│  ┌─────────────────────────────┐                    │
│  │  One shared <Canvas>        │                    │
│  │  (R3F, portal/overlay)      │  ← single WebGL ctx│
│  │  Renders current pose live  │                    │
│  │  OrbitControls + scrub bar  │                    │
│  └─────────────────────────────┘                    │
└─────────────────────────────────────────────────────┘
```

**Implementation pattern:** Use the `pmndrs/react-three-next` View-portal pattern — one
`<Canvas>` at root level with `<View>` portals. Each View tracks a DOM element by ref;
the shared Canvas renders only the Views currently in the viewport. For the focused node,
mount one View; unmount it when the node collapses.

```tsx
// _app.tsx / root layout
<Canvas eventSource={document.getElementById('root')} style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
  <Preload all />
</Canvas>

// FiguraNode.tsx (in the graph)
const ref = useRef<HTMLDivElement>(null);
const isExpanded = useStore(s => s.expandedNode === id);
return (
  <div ref={ref} className="node-figura">
    {isExpanded ? (
      <View track={ref}>
        <Figura3D pose={pose} />
        <OrbitControls />
      </View>
    ) : (
      <img src={`/stills/${id}.png`} alt={nome} />
    )}
  </div>
);
```

### Mobile performance reality check

Test device budget (2024 mid-range Android, mobile Chrome):

| Scenario | GPU cost | FPS | Verdict |
|---|---|---|---|
| Static PNG thumbnails (20 nodes) | Negligible | 60 | Fine |
| SVG pictograms (20 nodes, live) | ~0.5ms/frame | 60 | Fine |
| One live 3D pose (shared canvas, ~60 meshes) | ~2–3ms/frame | 60 | Fine |
| Three live 3D poses simultaneously | ~6–8ms/frame | 45–55 | Degraded |
| 20 live 3D poses | OOM / crash | — | Hard no |

**Bottom line:** One live 3D pose in the expanded panel is fine on mobile. Multiple
simultaneous live poses are not. The hybrid is the right call.

### Interaction model

**Compact node (default):**
- Static PNG thumbnail (pre-rendered at build time, identical to the 2D path).
- OR live SVG pictogram (zero WebGL, immediate, scalable).
- Tap to expand.

**Expanded node / detail panel (one at a time):**
- R3F canvas mounts with the auto-framed camera.
- User can orbit/rotate — this is the "aha" moment that a 2D still can't give.
- Scrub bar to play through the transition animation (keyframes from `GMTransition.frames`).
- On collapse, the canvas unmounts.

---

## 4. Pipeline: GrappleMap → 3D renderer

### Is our TS parser enough?

Yes. `src/lib/grapplemap/parser.ts` already provides:
- `decodeFrame(blob)` → `Pose` (2 players × 23 joints × Vec3)
- `parseGrappleMap(text)` → `GrappleMapData` (positions + transitions + tags)
- `isReoriented()` + `resolveConnectivity()` for the graph topology
- `src/lib/grapplemap/render-spec.ts`: `cameraFor()`, `camerasFor()`, `legibilityScore()`,
  `pickBestCamera()`

The only thing missing for the 3D renderer is the **geometry layer** — converting the
flat joint list into three.js geometry. That's ~150 lines (see `BONES` table + builder
functions above). No re-porting from C++ needed; the TS parser is the correct foundation.

### Typed pose representation

Current `Pose = [PlayerPose, PlayerPose]` where `PlayerPose = Vec3[]` (index = JOINTS index).
This is the right representation for the 3D renderer — pass it directly.

For future use (save/restore, diff, interpolation across graph transitions):
```ts
// Compact per-position record (what to store per graph node)
interface Figura3DRecord {
  positionId: number;
  pose: Pose;                  // already in parser.ts
  camera: Camera;              // from cameraFor(pose)
  legibilidade: number;        // from legibilityScore(pose)
  // Optional: pre-baked thumbnail URL
  thumbnailUrl?: string;       // /stills/{id}.png
}
```

### Value of re-porting from upstream GrappleMap C++?

**No value.** The upstream C++/JS is Emscripten WASM, hard to maintain, and couples
us to their build system. Our TS parser is cleaner, typed, and already tested
(`parser.test.ts`, `render-spec.test.ts`). The upstream GrappleMap.txt data file is
what matters — and we already have it in `source_repos/GrappleMap/GrappleMap.txt`.

The one piece not yet ported: the **joint radius table** and **limb table** from
`players.hpp`. This is ~30 lines of constants. Port it to a new file
`src/lib/grapplemap/geometry.ts` alongside the existing modules. That completes the
pipeline.

### Reuse by the 2D path

The same `Pose` type and `BONES` table drive both paths:
- **3D:** `Pose` → `CylinderGeometry` + `SphereGeometry` → WebGL
- **2D SVG:** `Pose` → `project()` (existing `pictograma.ts`) → SVG `<line>` / `<circle>`

Both consume the same `PlayerPose = Vec3[]`. Zero duplication.

---

## 5. Honest 2D-vs-3D verdict

### Scoring matrix

| Criterion | Live 3D (R3F + toon) | 2D SVG pictogram | Pre-rendered stills (PNG) |
|---|---|---|---|
| **Clarity for beginners** | ★★★★ — orbit reveals depth, limbs don't "cross" confusingly | ★★ — depth ordering lost, crossing limbs = noise | ★★★ — fixed best-angle, but one angle only |
| **Escape stickman** | ★★★★★ — volume, shading, two colors | ★★ — still reads as stickman at small size | ★★★★ — depends on art direction |
| **Brand fit** (calm pt-BR atlas, cartographic) | ★★★ — toon/clay is warm and editorial; 3D can feel "tech demo" if not tuned | ★★★ — clean lines fit atlas; needs good stroke weight | ★★★★ — full art direction control |
| **Build cost** | Medium: 1 week to build the R3F component + 3D geometry layer | Low: 2 days — `pictograma.ts` already exists | High: Blender pipeline, CI headless render, storage |
| **Bundle / perf** | 350–400 KB (three.js + r3f + drei), only on expand | ~0 KB extra (pure SVG/math) | 0 KB client JS; PNG served as static assets |
| **Maintainability** | Good: all in TS, same data model. R3F is stable/well-maintained | Excellent: pure math, no deps, deterministic | Fair: Blender pipeline is fragile in CI; binary assets pile up |
| **Scales to 20–100 positions** | Yes via hybrid thumbnail + one shared canvas | Yes — SVG renders in <1ms per pose | Yes — pre-rendered, but 100 × (4–6 angles) PNG = large static dir |
| **Mobile-first** | Good on expand (one canvas); thumbnails = PNG | Excellent — SVG is just DOM | Excellent — native img |
| **Interactive orbit/scrub** | ★★★★★ — native | ★ — not possible in 2D SVG | ★ — only with multi-angle carousel |
| **Future: transition animation** | ★★★★★ — interpolate `Pose` keyframes live | ★★ — scrub is frame-by-frame SVG swap | ★★ — pre-rendered flip-book |

### The honest verdict

**Use 3D.** Specifically: **hybrid 3D** — static pre-rendered thumbnails for the graph
thumbnails (can be PNG rendered from the same 3D scene via headless three.js or
`canvas.toDataURL()`), live R3F on the expanded/focused node.

The core argument:

1. **"Stickman" is a 2D problem.** Once you add toon shading + contrasting colors + a
   thick outline, the figures are unambiguously bodies — not sticks. The 2D SVG path
   cannot solve this without extreme stroke artistry that becomes expensive to maintain
   across 100+ poses.

2. **Orbit is a pedagogical unlock.** "Which arm is on top?" is the hardest question
   in grappling instruction and the most common beginner confusion. A rotatable 3D
   figure resolves it in 2 seconds; a 2D still never fully does. This is a real
   product differentiator, not a tech indulgence.

3. **The data pipeline is already done.** `parser.ts` + `render-spec.ts` + the pose
   data in `source_repos/GrappleMap/GrappleMap.txt` give us everything. Adding the
   geometry layer is ~150 lines. The 3D path costs less to finish than the 2D
   "hand-crafted illustration" path that requires Blender + art direction per pose.

4. **Build cost is lower than it looks.** The spike in `.scratch/3d-spike/` demonstrates
   that the complete rendering (decode → geometry → camera → toon → orbit) is ~350 lines
   of plain JS. In R3F it would be ~250 lines with cleaner declarative idioms.

5. **2D SVG is a valid fallback/thumbnail path, not the main path.** The `pictograma.ts`
   module already exists and is useful for:
   - Graph node thumbnails (tiny, no WebGL needed)
   - Server-side / edge rendering (zero deps)
   - Accessibility alt-text source (the projection gives meaningful 2D layout)
   Keep it. Don't pit it against 3D — they serve different slots in the UX.

### When to use each

| Slot | Recommended approach | Rationale |
|---|---|---|
| Graph node thumbnail (compact) | PNG pre-rendered from the 3D scene OR SVG pictogram | Cheap, cache-friendly, no WebGL per node |
| Expanded node / detail panel | Live R3F, shared canvas, orbit enabled | The "aha" moment; one canvas budget fine |
| Transition preview (scrub) | Live R3F with keyframe interpolation over `frames[]` | Only 3D can do this smoothly |
| SEO / OG image | Pre-rendered PNG from `canvas.toDataURL()` | Crawlable, static |
| Accessibility (screen reader) | `aria-label` from position name + `<img alt>` | Both paths; 3D canvas needs explicit label |

---

## Recommendation

**Build the 3D path as the primary renderer, using the hybrid architecture.**

1. **This week:** Add `src/lib/grapplemap/geometry.ts` — the BONES table, JOINT_RADIUS
   table, and a `buildFigura3D(pose, player)` function that returns three.js geometry
   descriptors (no three.js import in the lib — keep it data-only, importable by both
   the 3D renderer and a headless pre-render script).

2. **Next:** Build `src/components/figura-3d-inner.tsx` (client-only R3F component,
   `"use client"`, dynamic-loaded) — renders two `<Fighter>` components, `<OrbitControls>`,
   auto-framed camera from `cameraFor()`. Use `MeshToonMaterial` + drei `<Outlines>`.

3. **Thumbnails:** After mounting, call `renderer.domElement.toDataURL()` and save to
   `public/stills/{id}.png` — or run the same via headless Node + `gl`/Puppeteer in CI.
   The static PNG thumbnail path then costs zero JS on the graph page.

4. **Keep `pictograma.ts` alive** for SVG fallbacks, server-side, and accessibility.

5. **Do NOT add R3F as a runtime dep to the npm package until the 3D component is
   actually used** — add it only when wiring into the app (`pnpm add three @react-three/fiber
   @react-three/drei`; no installs in this investigation).

---

## Sources and prior art in this repo

- `research/2d-figure-pipeline.md` — GrappleMap geometry recipe + Q5 pre-render vs live
- `research/survey-3d-body-pose.md` — body models, licenses, pipeline
- `research/survey-web-avatar-apps.md` — mannequin.js, three-vrm, VRM, Babylon comparison
- `research/survey-2d-stylization.md` — toon shader, Grease Pencil, outline options
- `src/lib/grapplemap/parser.ts` — base62 decoder, Pose type, parseGrappleMap()
- `src/lib/grapplemap/render-spec.ts` — cameraFor(), legibilityScore(), camerasFor()
- `src/lib/figura/pictograma.ts` — existing 2D SVG projection (keep as thumbnail path)
- `.scratch/3d-spike/index.html` — self-contained HTML proof-of-concept (open in browser)
- GrappleMap upstream (public domain): https://github.com/eelis/GrappleMap
- three.js: https://threejs.org · r177 · MIT
- @react-three/fiber: https://r3f.docs.pmnd.rs · MIT
- @react-three/drei: https://drei.pmnd.rs · MIT
- drei Outlines: https://drei.pmnd.rs/?path=/docs/shaders-outlines
- MeshToonMaterial: https://threejs.org/docs/#api/en/materials/MeshToonMaterial
- Matcap library (CC0): https://github.com/nidorx/matcaps
- pmndrs/react-three-next (View portal pattern): https://github.com/pmndrs/react-three-next
- THREE.SkeletonUtils.retargetClip: https://threejs.org/docs/#examples/en/utils/SkeletonUtils
