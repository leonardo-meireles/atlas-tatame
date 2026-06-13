# 2D Posed-Figure Pipeline for "O Mapa do Jiu-Jitsu"

Research report — how to generate clean, readable 2D illustrations of two grapplers in a pose, deterministically and from joint data, for a Next.js graph app. Date: 2026-05.

---

## TL;DR — Top recommendation

**Reproduce GrappleMap's own rendering model (capsule limbs + sphere joints from joint coordinates), in `three.js` / react-three-fiber, and PRE-RENDER each position to a transparent PNG at build time.** Drive it from GrappleMap's existing public-domain pose database (`GrappleMap.txt`, ~3,600+ positions already encoded). This is the only approach that hits every hard requirement at once: not AI-looking, not stick-men, not photoreal, deterministic, version-controllable, and data-driven — because it *is literally the reference design* and we already have the data and the geometry algorithm in this repo.

Second choice if we want zero 3D and crisper line-art: a **custom SVG skeleton renderer** that projects the same joint data to 2D capsule/circle shapes. More control over the "clean line" look, but you give up correct depth occlusion (which limbs are in front), which matters a lot for tangled grappling poses.

Avoid: `mannequin.js` (wrong aesthetic — smooth ellipsoid mannequin, GPL-3.0), Rive (hand-authored, not data-driven), and any diffusion/AI image path (violates the hard requirement and is non-deterministic).

---

## Q3 — How GrappleMap actually renders (we have the repo locally; this is the key finding)

Source: `source_repos/GrappleMap/src/` (public domain).

**Data model** (`src/players.hpp`): each player is **23 joints** (`LeftToe, RightToe, LeftHeel … Core, Neck, Head`). A *Position* = 2 players × 23 joints × 3D coords. Joints have a per-joint `radius`; limbs are pairs of joints with a `length`, optional `midpointRadius` (for tapered limbs), and a `visible` flag.

**Geometry generation** (`src/playerdrawer.cpp`) — this is the heart of the "look":
- **Limbs** are drawn as `drawPillar(...)`: a tapered cylinder (truncated cone) between two joints, radius interpolating from one joint radius to the other. Tapered limbs split at a midpoint radius (e.g. forearm `0.03`, shin `0.055`). `faces` segments around the tube.
- **Joints** are drawn as **icospheres** (`SphereDrawer`, `icosphere.cpp`, subdivision level 1 or 2 — "fine" spheres for Head/Core/Hips/Shoulders).
- A handful of **`fatTriangle`** fills bridge the torso and feet (LeftHip–Core–RightHip, shoulders–neck, ankle–heel–toe).
- Two solid player colors (red/blue) via `playerDefs[].color`. Simple two-light diffuse setup, low ambient (`src/rendering.cpp`: `light_diffuse 0.65`, `light_ambient 0.03`, two directional lights). Flat solid-color clear background. No textures, no normal maps. That's the entire "clean capsule humanoid" aesthetic — it's just shaded geometry from joint positions.

**Data format** (`GrappleMap.txt`, `src/persistence.cpp`): plain text. Each position is a name + `tags:` line + encoded coordinate lines. Coordinates are **base62-packed**: `encoded_pos_size = 2 * joint_count * 3 * 2 + …`, i.e. 2 base62 digits per coordinate, decoded as `value = (digit0*62 + digit1) / 1000` (meters). `decodePosition()` is ~15 lines. **This is trivial to re-implement in TypeScript** — we can read the existing database directly.

**Web delivery today**: the C++ renderer is compiled to WASM via Emscripten (`SConstruct`: `emcc/em++`, `USE_WEBGL2=1 FULL_ES3=1 USE_GLFW=3`) and drives a WebGL canvas (`src/gm.js`, `graphdisplay.js`). Per-position still PNGs are generated natively (`src/images.cpp` via `boost::gil::png_write_view`, with 2× supersampling downscaled — that's their anti-aliasing). `src/mkpospages.cpp` builds the static per-position HTML pages.

**Reusable for us?**
- ✅ The **pose database** (`GrappleMap.txt`) — public domain, already mapped to BJJ/wrestling, already a graph (positions = nodes, transitions = edges). Huge head start.
- ✅ The **geometry recipe** (pillars + icospheres + fat triangles + per-joint radii + limb table) — port `players.hpp` constants and `playerdrawer.cpp` logic to `three.js`. ~1 day of work.
- ✅ The **base62 decoder** — port `decodePosition` to TS.
- ⚠️ The C++/WASM renderer itself is reusable as-is but couples us to their Emscripten build; re-implementing in three.js is cleaner for a Next.js app and gives us R3F integration for free.
- ❌ Their Blender path (`blender/animate.py`) is for *video* (CMU-skeleton retarget for nicer-looking match movies), not for the clean stills.

---

## Q1 — JS/web libraries for posable figures

| Library | What it gives | Stars / status | Fit |
|---|---|---|---|
| **three.js** | The substrate. `MeshToonMaterial` (cel shading), `OutlineEffect`/post-process outlines, full geometry control. | ~100k+ stars, actively released. De-facto standard. | **Best substrate.** Build the GrappleMap capsule rig on top of it. |
| **react-three-fiber (@react-three/fiber)** | React renderer for three.js; declarative scenes, plays well with Next.js (`pmndrs/react-three-next` starter). | pmndrs, very active. | **Use it** for any in-browser rendering and for component ergonomics. |
| **mannequin.js** (boytchev) | Pure-JS articulated mannequin, programmatic poses, built-in posture editor. | 414 stars, v5.2.3 (Oct 2024), **GPL-3.0**. | ❌ Aesthetic is a smooth ellipsoid art-school mannequin, not capsule grapplers. GPL-3.0 is viral/risky for a product. Good as inspiration only. |
| **Rive** (`@rive-app/react-canvas` / webgl2) | 2.5D vector rig with bones + mesh deform, WASM runtime, tiny files (~18KB). | rive-app, very active, commercial editor. | ❌ Each rig/pose is *hand-authored in the Rive editor*, not generated from joint data. Wrong tool for 3,600 data-driven poses. Great if we ever want a few bespoke animated hero figures. |
| **SVG skeleton (custom)** | Project joints to 2D, draw `<line>`/`<circle>`/capsule paths. Crisp, infinitely scalable, diff-able. | N/A (we build it) | ✅ Strong #2. Cleanest line-art look; loses depth occlusion. |
| 3d-mannequin (cahalanej), getreference.vercel.app (ritz078/reference) | Hobby posing tools on three.js. | Low maintenance. | Reference only. |

**Verdict:** three.js + R3F is the substrate. The "figure" is not a library you import — it's the GrappleMap capsule rig you port onto three.js geometry. `MeshToonMaterial` + a thin outline gets even closer to a "clean illustration" than GrappleMap's own diffuse shading.

Sources: [mannequin.js](https://github.com/boytchev/mannequin.js/), [MeshToonMaterial docs](https://threejs.org/docs/#api/en/materials/MeshToonMaterial), [three.js cartoon-outline thread](https://discourse.threejs.org/t/how-to-create-this-smooth-cartoon-style-with-outlines-in-three-js/60862), [rive-react](https://github.com/rive-app/rive-react), [Rive bones](https://verycreatives.com/blog/rive-bones-animations).

---

## Q2 — Blender pipelines (the fallback heavyweight)

If we want richer NPR (cel shading, ink outlines) than raw three.js geometry, Blender headless is the industry path:

- **Headless render**: `blender --background --python script.py`, or the `bpy` PyPI wheel. Gotcha: `bpy` can only be imported once per process and has framebuffer issues — the **`blenderless`** package (oqton/blenderless) wraps this with a virtual framebuffer + render-in-thread, and supports **batch view generation**. ([blenderless](https://pypi.org/project/blenderless/), [GitHub](https://github.com/oqton/blenderless))
- **Flat 2D output engines**: **Workbench** (fast, flat, supports transparent PNG), **EEVEE + Shader-to-RGB** (true cel shading), and **Freestyle** for ink outlines (render lines on a separate layer + compositor for alpha). ([anime in Blender](https://yelzkizi.org/render-anime-style-art-in-blender/), [Freestyle NPR](https://renderpool.net/blog/blender-freestyle/))
- **Transparent PNG**: enable Film → Transparent; works in Cycles/EEVEE/Workbench. ([transparent bg guide](https://irendering.net/how-to-render-with-a-transparent-background-in-blender/))
- **Posing automation**: drive an armature from joint data in Python (exactly what GrappleMap's `blender/animate.py` does — it retargets GrappleMap joints onto a CMU-style rig bone-by-bone). Batch over all positions, write `position_<id>.png`.

**Trade-off:** Blender gives the most beautiful, art-directed result and best outlines, but adds a heavy non-JS build dependency (Blender binary in CI), is slower per frame, and is harder to keep "in sync" with live data than a three.js renderer that shares code with the app. **Recommend Blender only if art direction demands cel-shaded ink-outline figures that three.js toon material can't match.** Otherwise it's overkill.

---

## Q4 — Pose data sources

- **GrappleMap.txt (in this repo) is the prize.** Public-domain, grappling-specific, already a graph of positions + transitions, already 2-player. Nothing else online is grappling-specific and openly licensed. Use it as the canonical source.
- Generic mocap (if we ever need new poses): **Bandai-Namco** 3,000+ free moves incl. fighting (BVH), **CMU**, **SFU**, **HDM05**, **ACCAD** — all BVH. Retarget via **Mixamo** auto-rig or **Auto-Rig Pro**. ([Bandai-Namco](https://www.cgchannel.com/2022/05/download-3000-free-mocap-moves-from-bandai-namco-research/), [BVH guide](https://mocaponline.com/blogs/mocap-news/bvh-animation-guide))
- **Standard formats**: glTF/GLB (skinned, web-native) is the right interchange if we ever export rigs; BVH for raw mocap; FBX for DCC tools. For *this* project we don't need them — GrappleMap's flat joint list is simpler and sufficient.
- Authoring new poses: GrappleMap ships a web editor and native/VR editors; the simplest path for us is a tiny in-app pose editor writing the same base62 format.

---

## Q5 — Next.js: pre-render assets vs render live in-browser

**Recommendation: pre-render stills to transparent PNG (or SVG) at build time, served as static assets; optionally hydrate to a live R3F canvas only on the focused/expanded node.**

Rationale for a "graph of positions" UX (React Flow):
- **Performance**: A React Flow graph can show dozens–hundreds of nodes at once. Mounting one WebGL/three.js context per node is a non-starter (context limits, GPU/CPU cost). Static `<img>` thumbnails are cheap, cache well, and let React Flow stay smooth. ([R3F examples / View portaling](https://r3f.docs.pmnd.rs/getting-started/examples))
- **SEO**: Static-generated HTML with real `<img>` (alt text per position) is crawlable; client-only WebGL renders to a canvas that crawlers don't see. Next.js docs are explicit that pre-rendering beats CSR for SEO. ([Next.js rendering strategies](https://nextjs.org/learn/seo/rendering-strategies), [CSR caveats](https://nextjs.org/docs/pages/building-your-application/rendering/client-side-rendering))
- **Determinism / version control**: build-time PNG/SVG generation from `GrappleMap.txt` is reproducible and the rendered SVGs (or PNG hashes) can be committed/diffed — matches the requirement exactly. GrappleMap itself pre-renders stills (`images.cpp`).
- **When to go live**: only the single highlighted/zoomed position. There, an R3F canvas lets the user orbit the camera or scrub a transition. Use the `pmndrs/react-three-next` View-portal pattern so it's one shared canvas, not many. ([react-three-next](https://github.com/pmndrs/react-three-next))

**How to pre-render three.js geometry headlessly in CI** (no browser): `three` + **`gl` (headless-gl)** + **`pngjs`**, or **Puppeteer** loading a bundled scene and screenshotting. headless-gl with `preserveDrawingBuffer` reads pixels to a PNG. ([three.js headless thread](https://discourse.threejs.org/t/headless-rendering/14401), [headless-gl offscreen gist](https://gist.github.com/bsergean/6780d7cc0cabb1b4d6c8)) — Note: headless-gl can be finicky to build in CI on newer Node; Puppeteer-screenshot is the more robust fallback. If we choose the **SVG path**, no headless GL is needed at all — pure JS math emits SVG strings, the simplest and most CI-friendly option.

---

## Recommended concrete pipeline for this project

**Phase 0 — data**
1. Copy/parse `GrappleMap.txt`. Port `decodePosition` (base62 → joints) and the limb/joint/radius tables from `players.hpp` to a small TS module. Output a typed `Position[]` (2 players × 23 joints × xyz) + the existing tags + transition graph.

**Phase 1 — renderer (port, don't reinvent)**
2. In `three.js`: build each figure from joint data using GrappleMap's recipe — tapered cylinders for limbs (`drawPillar`), icospheres for joints, a few triangle fills for torso/feet, two player colors. Add `MeshToonMaterial` + a subtle `OutlineEffect` for a cleaner "illustration" read than the original diffuse shading.
3. Fix a deterministic camera per position (GrappleMap orbits the midpoint of the two cores; pick a canonical 3/4 angle). Solid or transparent background.

**Phase 2 — build-time stills**
4. Render every position to a **transparent PNG** (and/or SVG) in a Next.js build/prebuild step. Headless via Puppeteer (robust) or headless-gl (lighter). 2× supersample → downscale for anti-aliasing, exactly like `images.cpp`. Commit or cache by content hash for deterministic, diffable assets.
5. Name assets by position id; generate `alt` text from name + tags for SEO.

**Phase 3 — app**
6. React Flow graph: nodes show the static PNG/SVG thumbnails. Fast, SEO-friendly, scalable.
7. On node focus/expand: mount a single shared R3F `<View>` canvas to let the user orbit / scrub the transition animation (interpolate between the keyframe positions GrappleMap already stores per transition).

**Phase 4 — optional upgrade**
8. If art direction wants ink-outline cel-shaded figures beyond what toon material gives: swap the build-time renderer for **Blender headless** (`blenderless` + Workbench/EEVEE Shader-to-RGB + Freestyle), driven by the same joint data via an armature-retarget script modeled on `blender/animate.py`. Same data, same graph, prettier stills.

---

## Honest trade-offs

- **Three.js capsule port (recommended)**: fastest to ship, shares code/data with the live view, deterministic. Downside: the look is "nice clean 3D figures," not hand-drawn line art — but that *is* the admired GrappleMap reference, so it's on-target.
- **SVG skeleton**: cleanest line-art, zero GPU, trivial CI, perfectly diffable. Downside: no real depth occlusion — overlapping limbs in tangled guard positions can read ambiguously. Could add manual z-ordering per limb but it's fiddly.
- **Blender**: best-looking NPR, best outlines. Downside: heavy CI dependency, slower, more moving parts, harder to keep in lockstep with live in-browser view.
- **mannequin.js / Rive / AI**: ruled out — wrong aesthetic, wrong authoring model, or violate the no-AI-look requirement.

---

## Sources

- GrappleMap source (local): `source_repos/GrappleMap/src/players.hpp`, `playerdrawer.cpp`, `rendering.cpp`, `persistence.cpp`, `images.cpp`, `mkpospages.cpp`, `blender/animate.py`, `GrappleMap.txt`; upstream <https://github.com/Eelis/GrappleMap>, site <http://eel.is/GrappleMap/>
- mannequin.js — <https://github.com/boytchev/mannequin.js/> (414★, v5.2.3 Oct 2024, GPL-3.0)
- three.js MeshToonMaterial — <https://threejs.org/docs/#api/en/materials/MeshToonMaterial>
- three.js cartoon outlines — <https://discourse.threejs.org/t/how-to-create-this-smooth-cartoon-style-with-outlines-in-three-js/60862>
- react-three-fiber examples — <https://r3f.docs.pmnd.rs/getting-started/examples>
- react-three-next starter — <https://github.com/pmndrs/react-three-next>
- Rive React runtime — <https://github.com/rive-app/rive-react> ; Rive bones — <https://verycreatives.com/blog/rive-bones-animations>
- blenderless — <https://pypi.org/project/blenderless/> , <https://github.com/oqton/blenderless>
- Blender anime/NPR — <https://yelzkizi.org/render-anime-style-art-in-blender/>
- Blender Freestyle NPR — <https://renderpool.net/blog/blender-freestyle/>
- Blender transparent bg — <https://irendering.net/how-to-render-with-a-transparent-background-in-blender/>
- Bandai-Namco free mocap — <https://www.cgchannel.com/2022/05/download-3000-free-mocap-moves-from-bandai-namco-research/>
- BVH guide — <https://mocaponline.com/blogs/mocap-news/bvh-animation-guide>
- Next.js rendering/SEO — <https://nextjs.org/learn/seo/rendering-strategies> , <https://nextjs.org/docs/pages/building-your-application/rendering/client-side-rendering>
- Headless three.js render — <https://discourse.threejs.org/t/headless-rendering/14401> ; headless-gl gist — <https://gist.github.com/bsergean/6780d7cc0cabb1b4d6c8>
