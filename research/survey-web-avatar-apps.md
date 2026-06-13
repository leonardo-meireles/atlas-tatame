# Survey: Web/JS Ecosystems for Posing & Rendering Human Figures, and Existing Body-Position Apps

**Project context:** "O Mapa do Jiu-Jitsu" — a Next.js 16 / React 19 app with react-three-fiber available, showing body positions as a connected graph. We need to **illustrate body positions** (single figure, or two grapplers), ideally by adapting open-source tech. This slice covers (A) web/JS poseable-figure libraries, (B) existing products that visualize body positions/movements, (C) tools to pre-render three.js to images at build time, and (D) existing grappling/BJJ graph projects.

Date of survey: 2026-05-24. All findings are cited inline.

---

## TL;DR — Ranked shortlist of most adaptable options

| Rank | Option | Why it fits | License | Render mode |
|------|--------|-------------|---------|-------------|
| **1** | **mannequin.js** (boytchev) | Pure-JS articulated figure, set pose by joint name (`man.r_elbow.bend = 90`), serialize pose to JSON string, blend between poses. Built on three.js — drops straight into r3f. | GPL-3.0 ⚠️ | Live in-browser or pre-render |
| **2** | **GrappleMap data + custom three.js stick-figure renderer** | The only existing public-domain dataset of *two-person grappling poses as joint coordinates in a graph*. Reuse the data; rewrite the renderer in r3f. | Public domain ✅ | Pre-render or live |
| **3** | **three.js + rigged glTF (Mixamo-rigged) character**, posed via bone rotations | Maximum visual quality; standard r3f workflow; full control; bones set programmatically like Babylon/three skeletons. | Asset-dependent (Mixamo = free for use) | Live or pre-render |

**Standout existing product to learn from:** **GrappleMap** (eelis.net/GrappleMap) — it already models BJJ as a directed graph of two-figure poses with named transitions, exactly our domain. Learn its data model; its WebGL renderer is dated C++/JS and not worth porting.

**Critical caveat:** **Ready Player Me is being shut down** (public services end **Jan 31, 2026** after Netflix acquisition) — do **not** build on it. See section A.

---

## A. Web/JS poseable-figure libraries

### A1. mannequin.js — TOP PICK for a programmatic figure
- **What:** A library of articulated mannequin figures; "the shape and movements are done purely in JavaScript." Designed as a teaching tool for a computer-graphics course. Body parts are posed by name with intuitive properties.
- **Link:** https://github.com/boytchev/mannequin.js/ · demos: https://boytchev.github.io/mannequin.js/ · npm: `mannequin-js`
- **License:** **GPL-3.0** (https://github.com/boytchev/mannequin.js/blob/main/LICENSE). ⚠️ Copyleft — distributing the app could obligate releasing source under GPL. This is the main commercial concern. Mitigations: (a) use it only at **build time** to pre-render PNGs (the *output images* are not a derivative work of the library in the copyleft sense — only the JS that links the library is), which keeps GPL off the shipped client bundle; or (b) contact the author for a license exception; or (c) treat it as a reference implementation and port the posing math.
- **Maintenance:** Active. Latest **v5.2.3, Oct 6 2024**.
- **Programmatic posing (verified from the user guide):**
  ```js
  man.torso.bend = 45;
  man.r_arm.raise = 30;
  man.r_elbow.bend = 90;
  man.torso.bend += 45;        // relative
  ```
  - **Pose serialization:** `man.posture` returns `{version, data:[[x,y,z],…]}`; `man.postureString` round-trips via JSON. `blend(p1, p2, k)` interpolates between two postures (k∈[0,1]) — perfect for animating graph transitions.
  - This means we can **store a pose per graph node as a small JSON array** and reconstruct it deterministically.
- **Rendering:** Uses **three.js** (requires import maps for `three`, `three/addons/`, `mannequin`). No built-in PNG export, but since it renders into a three.js scene, `renderer.domElement.toDataURL()` / `toBlob()` gives PNG trivially.
- **How we'd adapt:** Best of both worlds — define each position's pose as a `postureString`, render in r3f for the interactive graph view, and/or pre-render thumbnails at build time. The two-figure grappling case = instantiate two mannequins. Geometry is stylized/blocky (good "diagram" aesthetic, less realistic).
- Note: a separate unrelated `classdojo/mannequin.js` (a JS schema library) and a hobby `cahalanej/3d-mannequin` exist — not relevant.
- Source: https://boytchev.github.io/mannequin.js/docs/userguide.html , https://www.npmjs.com/package/mannequin-js

### A2. three.js + rigged glTF/VRM character (the standard r3f workflow) — TOP PICK for quality
- **What:** Load a rigged humanoid (glTF/GLB or VRM), then set pose by rotating named bones on the `SkinnedMesh` skeleton. Standard in both three.js and Babylon.js.
- **Posing:** In three.js you grab bones and set `bone.rotation`/`quaternion`; the three.js forum documents posing skinned/rigged characters by bone (https://discourse.threejs.org/t/solved-how-to-rotate-arm-of-skinned-and-rigged-character/5572). VRM adds a normalized **humanoid bone map** (`vrm.humanoid.getNormalizedBoneNode('leftUpperArm')`) so the same pose code works across any VRM model.
- **Assets/license:** The library (three.js) is MIT. The *model* license matters — use **Mixamo** characters (free, auto-rigged, Adobe — usable in projects) or CC0 models. Avoid models with non-commercial licenses.
- **Maintenance:** three.js is the most active 3D web library; r3f wraps it idiomatically for React 19.
- **How we'd adapt:** This is the natural fit since we already have r3f. Author poses once (in Blender or an in-browser editor), export each as a set of bone quaternions keyed by graph node, then apply at render time. Use `@react-three/drei` `<useAnimations>`/`useGLTF`. For two grapplers, instance two skinned meshes. Highest realism, but more asset/rigging work than mannequin.js.
- Refs: Wawa Sensei VRM+r3f+MediaPipe tutorial https://wawasensei.dev/tuto/vrm-avatar-with-threejs-react-three-fiber-and-mediapipe ; "display 3D humanoid avatar with React" https://dev.to/saitoeku3/how-to-display-3d-humanoid-avatar-with-react-5db2

### A3. three-vrm (pixiv) — VRM humanoid on three.js
- **What:** Official pixiv library to load and control VRM avatars on three.js. Provides a normalized humanoid interface for cross-model posing, expressions, and VRMA animation playback.
- **Link:** https://github.com/pixiv/three-vrm · examples (`bones.html`, `animations.html`): https://pixiv.github.io/three-vrm/packages/three-vrm/examples/
- **License:** MIT. **Maintenance:** active, large project.
- **Posing tools in ecosystem:**
  - `web-vrm-poser` — browser pose editor, converts `.vroidpose` → JSON (Euler angles for three.js), 100% serverless, drag-and-drop. Great for *authoring* our poses. https://github.com/k3peta/web-vrm-poser
  - `tk256ailab/vrm-viewer` (VRMA support), `Keshigom/three-vrm-viewer` (drag-drop preview) — reference viewers.
- **How we'd adapt:** Use a single VRM "diagram" character; author each position in web-vrm-poser, store the JSON, apply via the humanoid bone map. Cleaner cross-model abstraction than raw glTF bones. Caveat: VRM is tuned for single standing avatars (VTubers); ground-grappling/two-body entanglement is doable but unusual.

### A4. Ready Player Me / Visage — ⚠️ DO NOT ADOPT (being discontinued)
- **What:** `@readyplayerme/visage` is an MIT-licensed React component (built on three.js, r3f, drei, three-stdlib) to display RPM avatars; supports `modelSrc`, `animationSrc`, `poseSrc`, T-pose. https://github.com/readyplayerme/visage
- **Showstopper:** Ready Player Me's **public services, avatar creator, and developer APIs end January 31, 2026** after **Netflix acquired** the company. Integrated APIs will stop functioning. Sources: https://genies.com/blog/ready-player-me-discontinued-alternatives , https://variety.com/2025/digital/news/netflix-acquires-ready-player-me-games-avatar-creation-1236612915/ , https://en.wikipedia.org/wiki/Ready_Player_Me
- **Verdict:** Avoid the RPM cloud/API. Visage's *open-source rendering code* (MIT) could still be a reference for r3f avatar display, but the avatars themselves and creator are going away. If a "create-an-avatar" feature is ever wanted, look at **Avaturn** (photo→3D avatar SDK) instead. https://www.toolify.ai/alternative/ready-player-me

### A5. Babylon.js — viable alternative engine (but off-stack)
- **What:** Full 3D engine with built-in skeleton/bone API: `bone.rotate(...)`, `setYawPitchRoll`, `setRotation`, animation blending and a timeline. More "batteries included" than three.js (physics, GUI). https://blog.logrocket.com/three-js-vs-babylon-js/ , bone API https://doc.babylonjs.com/typedoc/classes/BABYLON.Bone , skeletons https://doc.babylonjs.com/features/featuresDeepDive/mesh/bonesSkeletons
- **License:** Apache-2.0 (commercial-OK).
- **Verdict:** Technically excellent and arguably nicer bone API, **but** our stack is React 19 + react-three-fiber (three.js). Adopting Babylon means abandoning r3f's declarative ergonomics. Only choose if we hit a three.js wall. Listed for completeness.

---

## B. Existing apps/products that visualize body positions/movements

| Product / project | Domain | How figures are rendered | Open source? | Takeaway for us |
|---|---|---|---|---|
| **GrappleMap** | No-gi grappling | **Animated stick figures in WebGL**, manually keyframed (5 dir-changes/sec cap) | ✅ Public domain | Closest analog — see section D1. Data model is the gold; renderer is dated. |
| **BJJ Flow Charts** (bjjflowcharts.com) | BJJ | Flowchart nodes + **embedded videos**, not figures | ❌ commercial | Confirms market: people want technique *maps*. Visual = video, not avatars. |
| **Grapple Flows** (grappleflows.com) | BJJ | Flowcharts from voice notes / YouTube / IG reels → structured maps; **text/photo nodes** | ❌ commercial | Same — graph UX is validated; nobody renders posed avatars per node. Opportunity for us to differentiate with figures. |
| **BJJ Flow Tracker** (bjjflowtracker.com) | BJJ | Flowchart nodes, text/links | ❌ commercial | Same pattern. |
| **3D Yoga Anatomy** (iOS) | Yoga | **Rigged 3D model**, 360° views + muscle overlays, ~40 poses | ❌ commercial | Shows value of rotatable 3D per pose; muscle overlay is a nice-to-have. |
| **Easy Pose** (mobile) | Art reference | Real-time **3D poseable mannequin** | ❌ commercial | Proof a stylized mannequin (cf. mannequin.js) reads well for pose communication. |
| **JASigning / SiGML** (UEA Virtual Humans) | Sign language | **3D real-time signing avatar** driven by SiGML/HamNoSys notation | Research/free demos | Best example of *notation → avatar animation*. HamNoSys = a formal body-pose notation; conceptually analogous to encoding a BJJ position as data and rendering it. https://vh.cmp.uea.ac.uk/index.php/JASigning_Demos |
| **OpenCap** (Stanford) | Biomechanics / physio | 3D kinematics from smartphone video → musculoskeletal sim | ✅ open source | Source of *motion data* (not a renderer) if we ever ingest real movement. https://journals.plos.org/ploscompbiol/article?id=10.1371%2Fjournal.pcbi.1011462 |
| Sign-language repos (linuxscout/algerianSignLanguage-avatar, raianrido/VSL, LykeEsselink/SignLanguageSynthesis) | Sign language | JASigning-based 3D avatars driven by SiGML | ✅ open source | Examples of community pipelines layering on a signing-avatar engine. |

**Pattern across the BJJ market:** Every commercial competitor uses **flowcharts + video/text/photo**, *not* posed figures. Rendering actual body positions (2D or 3D) per graph node would be a genuine differentiator. GrappleMap is the lone exception and it's a public-domain research toy, not a polished product.

---

## C. Pre-rendering / server-rendering three.js to images (build-time static assets in Next.js)

For a graph of many positions, **build-time pre-rendering** to PNG/SVG is attractive: zero client 3D cost, instant page loads, consistent framing, works on mobile/low-power devices. Options:

1. **Puppeteer + headless Chrome (recommended for fidelity).** Load an HTML page that bundles three.js/r3f, render the scene, wait for completion, then `page.screenshot()` (or read a `canvas.toDataURL()`). This is the most reliable path because it uses a real GPU/ANGLE WebGL stack — community consensus that it "works where other solutions failed." Run as a Next.js build step / Node script to emit `/public/positions/<id>.png`. Refs: https://rainer.im/blog/serverless-3d-rendering , https://discourse.threejs.org/t/headless-rendering/14401
2. **headless-gl (`gl` npm) — pure Node WebGL context.** Lighter than Chromium, no browser. Caveats: typically **CPU/software rendering** (slow for complex scenes), and **versions ≥ 4.0.0 have breaking issues**; commonly pinned to older versions. Good for simple stick-figure/mannequin scenes. Refs: https://github.com/mrdoob/three.js/issues/7085 , gist https://gist.github.com/bsergean/08be90a2f21205062ccc
3. **@react-three/offscreen.** r3f's offscreen/worker renderer — primarily for moving rendering off the main thread in-browser (OffscreenCanvas), not a Node SSR solution. Useful if we keep live rendering but want it non-blocking; combine with Puppeteer for build-time captures of an offscreen scene.

**Recommendation:** Use **Puppeteer at build time** to generate static PNG (and optionally a small JSON of camera/pose) per graph node, with mannequin.js or a rigged glTF as the scene. Keep an **optional live r3f view** for the "explore in 3D / rotate" interaction on a position's detail page. This sidesteps the mannequin.js GPL concern on the client and gives fast, SEO-friendly static images for the graph overview.

**Trade-offs — live render vs pre-rendered:**
- *Live (r3f in browser):* interactive (rotate/zoom, play transition animations), no asset pipeline, but heavier client bundle, slower first paint, mobile battery/perf cost, and ships the figure library to the client (GPL exposure for mannequin.js).
- *Pre-rendered (build-time PNG/SVG):* instant load, SEO-able images, no client 3D dependency, consistent art direction; but static (no rotate), needs a build pipeline, and re-render on every pose change. **Hybrid is ideal:** static thumbnails everywhere + opt-in live 3D on detail pages.

---

## D. Existing grappling / BJJ graph & technique-map projects

### D1. GrappleMap (Eelis) — the key reference dataset ✅
- **Link:** https://github.com/Eelis/GrappleMap · site: https://eelis.net/GrappleMap/ · data: https://github.com/Eelis/GrappleMap/blob/master/GrappleMap.txt
- **License:** **Public domain** ("None; the GrappleMap code and data is released into the public domain"). Fully reusable, commercial-OK.
- **Data model:** A **directed graph** where each **vertex = a concrete pose of two stick-figure players**, each **edge = a named, tagged transition** with keyframe joint coordinates. Stored in a single **plain-text, ad-hoc minimalistic format** declaring positions (name, tags, description/reference, joint coordinates) and transitions (same + per-frame coordinates). Joint count grew "only as necessary to allow execution of techniques." Animations are hand-edited, fixed-interval keyframes.
- **Renderer:** WebGL viewer; codebase is **~71% C++, ~14% JS** — the heavy lifting is C++, the web bits are thin. Not a clean JS library; **don't port the renderer**.
- **How we'd adapt:** **Parse `GrappleMap.txt` into our graph + per-node joint coordinates**, then render those joints with our own three.js/r3f stick-figure (or map them onto a mannequin.js/rigged figure). This gives us a large, ready, public-domain BJJ dataset of two-person poses + transitions — by far the hardest asset to create from scratch. Build a small parser as the first integration step.

### D2. daveyarwood/bjj-graph
- **Link:** https://github.com/daveyarwood/bjj-graph
- **What:** BJJ modeled as a graph in **Clojure**, using the `ubergraph` library + **graphviz** to render static graph diagrams (boxes/edges, **no figures**).
- **Use to us:** A second take on the *graph schema* (positions/techniques/transitions) for cross-referencing terminology. Visuals are graphviz, not body figures, so not a rendering source.

### D3. fcavani/jiu-jitsu-graph
- **Link:** https://github.com/fcavani/jiu-jitsu-graph
- **What:** A **graph database** for jiu-jitsu positions, sequences, scores, and descriptions. Data-only; no figure rendering.
- **Use to us:** Another reference data model (positions + sequences + scoring). Potential to merge/validate our node taxonomy.

### D4. ubershmekel/bjjdata
- **Link:** https://ubershmekel.github.io/bjjdata/
- **What:** ~25 annotated **YouTube clips** of submissions by world champions for detail analysis. Video-based, not poses/graph.
- **Use to us:** Reference content / annotation ideas; not a data or rendering source for figures.

### D5. bjjgraph.org (diogoseca / "BJJ Graph")
- **Link:** https://bjjgraph.org/
- **What:** Interactive BJJ knowledge base — search positions, techniques, rolls, transitions, submissions, principles, systems. Web app (graph/text UX). Not obviously a figure renderer.
- **Use to us:** Closest *product* analog to ours for the graph/knowledge-base UX and taxonomy; study its position/transition vocabulary.

---

## Recommendation for "O Mapa do Jiu-Jitsu"

1. **Ingest GrappleMap's public-domain data** (`GrappleMap.txt`) as the seed graph of two-person positions + transitions. Build a parser first. (Public domain, our exact domain, two-body poses already authored.)
2. **Render figures with three.js/react-three-fiber.** Two viable figure layers:
   - *Fast path:* **mannequin.js** for a stylized articulated figure — trivial programmatic posing + JSON pose serialization + pose blending for transitions. **Keep it build-time only** (Puppeteer → PNG) to avoid shipping GPL-3.0 to the client, or get a license exception.
   - *Quality path:* a **rigged glTF/VRM** character (three-vrm + Mixamo/CC0 model) posed via bones; author poses with `web-vrm-poser`. MIT/permissive.
3. **Hybrid rendering:** Pre-render static PNG thumbnails per graph node via **Puppeteer at build time** for fast, SEO-friendly graph pages; offer **opt-in live r3f** (rotate + animate transition) on position detail pages.
4. **Avoid Ready Player Me** (services end 2026-01-31). Babylon.js only if we abandon r3f (not recommended).

---

## Sources
- mannequin.js: https://github.com/boytchev/mannequin.js/ , https://boytchev.github.io/mannequin.js/docs/userguide.html , https://github.com/boytchev/mannequin.js/blob/main/LICENSE , https://www.npmjs.com/package/mannequin-js
- three-vrm: https://github.com/pixiv/three-vrm , https://pixiv.github.io/three-vrm/packages/three-vrm/examples/ , web-vrm-poser https://github.com/k3peta/web-vrm-poser , https://wawasensei.dev/tuto/vrm-avatar-with-threejs-react-three-fiber-and-mediapipe
- Ready Player Me / Visage + shutdown: https://github.com/readyplayerme/visage , https://genies.com/blog/ready-player-me-discontinued-alternatives , https://variety.com/2025/digital/news/netflix-acquires-ready-player-me-games-avatar-creation-1236612915/ , https://en.wikipedia.org/wiki/Ready_Player_Me
- Babylon.js: https://blog.logrocket.com/three-js-vs-babylon-js/ , https://doc.babylonjs.com/typedoc/classes/BABYLON.Bone
- three.js bone posing: https://discourse.threejs.org/t/solved-how-to-rotate-arm-of-skinned-and-rigged-character/5572
- Headless/SSR rendering: https://rainer.im/blog/serverless-3d-rendering , https://discourse.threejs.org/t/headless-rendering/14401 , https://github.com/mrdoob/three.js/issues/7085 , https://gist.github.com/bsergean/08be90a2f21205062ccc
- GrappleMap: https://github.com/Eelis/GrappleMap , https://github.com/Eelis/GrappleMap/blob/master/README.md , https://eelis.net/GrappleMap/
- Other BJJ graph projects: https://github.com/daveyarwood/bjj-graph , https://github.com/fcavani/jiu-jitsu-graph , https://ubershmekel.github.io/bjjdata/ , https://bjjgraph.org/ , https://www.bjjflowcharts.com/ , https://grappleflows.com/ , https://bjjflowtracker.com/
- Other domains: JASigning/SiGML https://vh.cmp.uea.ac.uk/index.php/JASigning_Demos , sign-language repos https://github.com/linuxscout/algerianSignLanguage-avatar https://github.com/raianrido/VSL https://github.com/LykeEsselink/SignLanguageSynthesis , OpenCap https://journals.plos.org/ploscompbiol/article?id=10.1371%2Fjournal.pcbi.1011462 , 3D Yoga Anatomy https://apps.apple.com/us/app/3d-yoga-anatomy/id558683564 , Easy Pose https://play.google.com/store/apps/details?id=com.madcat.easyposer
