# Survey: Turning Poses / 3D into Clean 2D Illustrations (the "house style")

**Project:** O Mapa do Jiu-Jitsu (Next.js, positions-as-a-graph)
**Scope of this slice:** pose/3D → clean 2D line-art pipelines, "house-style" stylization libraries, figure-drawing/poseable reference tools, and existing illustrated body/exercise/pose datasets we could reuse or restyle.
**Constraint:** adapt existing open-source tech; aim for a *crafted, technical-illustration look that does NOT read as AI-generated*; survey broadly (not only jiu-jitsu).
**Date:** 2026-05-24

---

## TL;DR — Ranked shortlist (most adaptable at top)

| Rank | Approach | Why it wins for us | License |
|---|---|---|---|
| 1 | **Blender Grease Pencil "Line Art" modifier** (3D model/pose → baked 2D vector strokes) driven by **PoseMy.Art / GrappleMap / wger exported poses** | Produces genuine, controllable anatomy-plate line work from real 3D geometry. Clean contours + crease lines = "technical illustration", never AI. Vector-bakeable, scriptable, batchable. | GPL (Blender) / data licenses vary |
| 2 | **A two-stage SVG house-style pipeline**: render flat line-art (Blender/three.js) → post-process with **a single deterministic SVG script** (Rough.js / svg2roughjs for hand-drawn jitter, or halftone/riso for screen-print texture) | The post-process is where "house style" is enforced consistently across hundreds of figures. Deterministic = reproducible, on-brand, clearly hand-crafted. | MIT (Rough.js, svg2roughjs) |
| 3 | **GrappleMap** (public-domain stick-figure two-fighter grappling graph) as both **pose data source** and reference renderer | Same exact domain (two interacting grapplers as a directed graph of poses). Public domain. Joint coordinates in plain text → we can re-render in our own house style. | Public domain |
| — | **Pose Animator** (skeleton → rigged SVG character) | Best open project that literally maps pose/skeleton data onto a 2D *vector* character — strongest path to "restyle a skeleton into our line figure." | Apache-2.0 |

**Single best "house-style" technique:** Render clean vector line-art from posed 3D (Blender Grease Pencil **Line Art modifier**, baked to SVG), then run **one deterministic post-processing pass** (svg2roughjs for a subtle hand-drawn ink wobble, or a fixed-parameter SVG halftone/riso filter for a screen-print plate look). The 3D source guarantees correct anatomy and consistent camera/lighting; the single post-pass guarantees every figure shares the same "crafted" signature. This is the most reliable recipe for a look that is clearly authored, not diffusion-generated.

---

## A. Pose/3D → 2D line-art & toon pipelines

These convert real 3D geometry (a posed figure) into 2D line work. Because they trace actual edges, contours and creases, the output reads as *technical illustration / anatomy plate* — crisp, deliberate, repeatable. This is the strongest anti-AI signal we have: vector lines that follow real geometry rather than the soft, slightly-melted detail of generative models.

### A1. Blender — Grease Pencil "Line Art" modifier  ⭐ top pick for line work
- **What:** A modifier on a Grease Pencil object that auto-draws a 3D model's edges (contour, crease, material boundary, intersection, silhouette) as camera-view 2D strokes. Strokes can be styled (thickness, noise, opacity), baked, and **exported to SVG**. Fills go on a layer below with a fill-only material so color never covers the line.
- **Link:** https://docs.blender.org/manual/en/latest/grease_pencil/modifiers/generate/line_art.html ; overview: https://www.blendernation.com/2023/08/09/add-2d-lines-to-your-3d-models-with-the-blender-grease-pencil-line-art-modifier/
- **License:** Blender is GPL (the *tool* is free for commercial output; output is yours).
- **Maintenance:** Core Blender feature, actively maintained (manual tracks current 5.x).
- **Anatomy-plate look?** Yes — this is the cleanest "technical drawing" line out of any free tool. Contour + crease line sets give the classic medical/anatomy-plate separation of silhouette vs. internal detail.
- **How we'd adapt:** Import a posed rig (from PoseMy.Art OBJ export, a MakeHuman/Mixamo figure, or GrappleMap coordinates), add a camera, attach the Line Art modifier, set line sets (one for silhouette, one for creases), bake, export SVG. Script it headlessly with `blender --background --python` to batch every graph node into a consistent SVG. This is fully automatable for hundreds of positions.

### A2. Blender — Freestyle (NPR line renderer)
- **What:** Edge/line-based NPR engine that draws lines using mesh + Z-depth on selected edge types, per-view-layer "line sets" + "line styles" with deep control over weight, shape, color, placement. Works with EEVEE and Cycles.
- **Link:** https://docs.blender.org/manual/en/latest/render/freestyle/introduction.html ; guide: https://artisticrender.com/a-guide-to-blender-freestyle-rendering-with-eevee-and-cycles/
- **License:** GPL (Blender).
- **Maintenance:** Mature, stable, but less actively developed than Grease Pencil Line Art (which is the more modern, vector-friendly path).
- **Anatomy-plate look?** Yes — explicitly used for blueprint/technical renders; very controllable hard-line output. Downside vs. Line Art: Freestyle output is raster-first (line render baked into the image), so SVG/vector export is weaker. Prefer Grease Pencil Line Art if we want vector.
- **How we'd adapt:** Same posed-figure pipeline as A1, but choose Freestyle when we want a final raster plate with painterly/ink line styles rather than editable vectors.

### A3. Blender — Shader-to-RGB toon (EEVEE) + outline
- **What:** EEVEE's `Shader to RGB` node converts a BSDF's shading into a color you can quantize with a ColorRamp → flat cel bands. Combine with an inverted-hull or Line Art outline for the "filled comic plate" look (flat color + clean outline) rather than pure line.
- **Link:** https://docs.blender.org/manual/en/latest/render/shader_nodes/color/shader_to_rgb.html ; technique: https://artisticrender.com/cel-shading-in-blender/
- **License:** GPL (Blender).
- **Maintenance:** Core EEVEE feature.
- **Anatomy-plate look?** Less "anatomy plate," more "clean comic/instructional diagram with flat fills." Good if we want fills + a couple of shading bands to read volume (useful to distinguish two grapplers).
- **How we'd adapt:** Add to the same Blender scene as a second render style; use 2 flat bands max for a restrained instructional look. Pair with Line Art (A1) for the outline.

### A4. PSOFT Pencil+ 4 Line for Blender (commercial add-on, production-grade)
- **What:** Studio-grade anime/manga line engine for Blender: highly expressive, width-modulated lines, vector export, real-time preview. Used in Japanese anime production (Studio Khara on *Evangelion: 3.0+1.0*; Toei, Shirogumi, Marza use Pencil+).
- **Link:** https://www.psoft.co.jp/en/product/pencil/blender/ ; news: https://www.cgchannel.com/2023/10/psoft-releases-pencil-4-line-for-blender/
- **License:** **Commercial / paid** (not open source). Note in scope only as the "if budget allows, this is the best linework" option.
- **Anatomy-plate look?** Excellent expressive ink lines (manga > strict anatomy plate). Overkill unless we want signature hand-inked linework. The free Grease Pencil Line Art (A1) gets us 80% there at zero cost.

### A5. three.js toon + outline (in-browser, runtime stylization)
- **What:** Browser NPR for live 3D figures: `MeshToonMaterial`, `OutlineEffect`/`OutlinePass`/`ToonOutlinePassNode`, or a custom shader using `dot(normal, viewDir)` to draw rim/silhouette lines. Renders cel-shaded outlined figures in the Next.js app itself.
- **Link:** https://threejs.org/docs/pages/OutlineEffect.html ; https://threejs.org/docs/pages/ToonOutlinePassNode.html ; custom shader: https://www.maya-ndljk.com/blog/threejs-basic-toon-shader
- **License:** MIT (three.js).
- **Maintenance:** Actively maintained; `ToonOutlinePassNode` is the modern WebGPU path, `OutlineEffect` the classic WebGL one.
- **Anatomy-plate look?** It's "cel/toon," not crisp anatomy plate — outlines are screen-space and can shimmer. Good for *interactive* posed figures rendered live in the graph UI; weaker for a static, print-clean house style.
- **How we'd adapt:** Use only if we want the figures to be live/rotatable 3D in the app. For a fixed illustrated style, pre-rendering with Blender (A1/A2) yields cleaner, more controllable plates.

**Verdict for Section A:** Pre-render in Blender with **Grease Pencil Line Art** (vector, anatomy-plate) as the primary; reach for Shader-to-RGB (A3) when we want flat fills, three.js (A5) only if figures must be interactive in the browser, Pencil+ (A4) only if we later want signature inked lines and have budget.

---

## B. Stylization libraries — building ONE consistent "house style" script

The "house style" should be a single, deterministic post-processing pass applied to clean vector line-art. Determinism (fixed seed/params) is what makes 300 figures look like one artist drew them — and what makes them read as crafted rather than AI.

### B1. svg2roughjs  ⭐ best house-style enforcer
- **What:** Converts an existing SVG into a sketchy, hand-drawn version by re-rendering its shapes through Rough.js. TypeScript/npm. This is the cleanest way to take our crisp Blender SVG line-art and give it a uniform hand-inked wobble.
- **Link:** https://github.com/fskpf/svg2roughjs ; demo: https://fskpf.github.io/
- **License:** **MIT** (commercial OK).
- **Maintenance:** Active; latest release Aug 2024; small but maintained (≈147★, deps: Rough.js, svg-pathdata, TinyColor).
- **Crafted-not-AI look?** Strong — controlled roughness, bowing, hachure fills give a consistent "drawn by hand" feel. Because params are fixed, every figure shares the same signature.
- **How we'd adapt:** One Node script: take Blender SVG → svg2roughjs with locked roughness/bowing/seed/stroke params → output our house-style SVG. This script *is* the house style.

### B2. Rough.js (primitive-level hand-drawn drawing)
- **What:** ~9kB library to draw lines/curves/arcs/polygons/paths in a sketchy hand-drawn style; svg2roughjs is built on it.
- **Link:** https://roughjs.com/ ; https://github.com/rough-stuff/rough
- **License:** **MIT**.
- **Maintenance:** Widely used, stable.
- **Crafted look?** Yes. Use directly if we ever generate figures path-by-path (e.g., driving it from skeleton/joint coordinates) rather than restyling an existing SVG. For restyling SVGs, prefer svg2roughjs (B1).

### B3. Halftone / Riso / screen-print effects (texture-based house style)
- **What:** Apply a halftone-dot / risograph / screen-print texture for a printed-plate, vintage-instructional aesthetic — a very strong "made by a person/press" signal.
  - **p5.riso** — p5.js library for risograph-style multi-color separations + halftone (dot shapes: line/square/circle/ellipse/cross). https://github.com/antiboredom/p5.riso
  - **svg-halftone** — raster → SVG halftone patterns (vector dots). https://github.com/evestera/svg-halftone
  - **Pure SVG `<filter>` halftone** — feImage/feTile/feComponentTransfer based, no raster. Demos: https://codepen.io/shshaw/pen/BNgoqg , https://dev.to/rodzyk/svg-halftone-filter-demo-live-image-preview-toggle-3pe0
- **License:** p5.riso and svg-halftone are open source (GitHub, MIT-style); SVG filters are a web standard (no license).
- **Maintenance:** p5.riso maintained by Sam Lavigne/Tega Brain; svg-halftone is a small utility; SVG filters are evergreen platform tech.
- **Crafted-not-AI look?** Very strong if we want a "vintage technique manual / silkscreen poster" identity. Halftone over a flat-shaded figure (A3) reads unmistakably as print, not diffusion.
- **How we'd adapt:** Either (a) an SVG `<filter>` we drop into every figure in the Next.js app (cheapest, runtime, zero pipeline), or (b) p5.riso/svg-halftone as a build-time pass. The SVG-filter route is the lowest-effort consistent house style.

### B4. SVG filters in general (free, native)
- **What:** Native `<filter>` primitives (turbulence, displacement, lighting, component transfer) can add paper grain, ink bleed, subtle displacement — applied uniformly across all figures via one reusable filter definition.
- **License/Maintenance:** Web standard; nothing to maintain.
- **How we'd adapt:** Define one `<defs><filter id="house-style">…</filter></defs>` and reference it on every figure SVG. Pairs well with B1/B3.

**Verdict for Section B:** The house-style script is **one deterministic pass**. Default recommendation: **svg2roughjs (B1)** for a hand-inked-line identity, OR a fixed **SVG halftone/riso filter (B3/B4)** for a screen-print identity. Pick one identity and lock its parameters.

---

## C. Figure-drawing / poseable reference tools (source of correct poses)

We need posed figures — ideally *multiple interacting* ones (grappling) — that we can export and feed into Section A. Export capability + multi-figure support are the two filters.

| Tool | Multi-figure? | Export | License / commercial | Notes |
|---|---|---|---|---|
| **PoseMy.Art** ⭐ | **Yes** (library has couples/fighting/dance multi-figure scenes) | **OBJ** (full scene), plus OpenPose/Depth/Canny/Normal maps | Free tier; **commercial use requires significant alteration of the base models** — fine for us since we re-render as line-art (significant alteration) | Best free poseable tool that exports geometry we can pipe into Blender Line Art. https://posemy.art/ , features: https://posemy.art/features/ , pricing/license: https://posemy.art/pricing/ |
| **JustSketchMe** | **Yes** (add multiple character models to a scene) | Pose download; **3D model export on Pro** | Pro from ~$12/mo (or one-off); web/desktop/mobile | Good multi-figure posing; export gated behind Pro. https://justsketch.me/ |
| **Magic Poser** | **Yes** (multi-figure scenes) | Image export; limited model export | Freemium app (iOS/Android/web) | Mobile-first; less pipeline-friendly than PoseMy.Art. |
| **Line of Action** | No (single reference photos) | n/a (it's a reference-photo timer) | Free | Practice/reference only — not a poser/exporter. https://line-of-action.com/ |
| **Quickposes** | No (reference-photo timer) | n/a | Free | Same category as Line of Action — gesture-drawing reference, not export. https://quickposes.com/en |
| **PoseManiacs** | No | n/a | Free, royalty-free reference | Anatomy/muscle reference figures; no export pipeline. https://www.posemaniacs.com/en |

**Verdict for Section C:** **PoseMy.Art** is the clear winner — it is free, supports multi-figure *fighting* scenes, and exports **OBJ** (and ControlNet-style maps). Because we re-render its figures as our own line-art, we comfortably satisfy its "commercial use requires significant alteration" clause. Line of Action / Quickposes / PoseManiacs are reference-only (no export) and not part of the production pipeline.

---

## D. Existing OPEN datasets/libraries of illustrated poses / exercises / movements

Reusable or restylable human-figure data. Two kinds: (1) **illustrated image sets** we could restyle, and (2) **pose/skeleton coordinate data** we could re-render in our house style.

### D1. GrappleMap  ⭐ same domain, public domain
- **What:** A database of interconnected grappling positions + transitions as a **directed graph**, where each vertex is a concrete pose of **two stick-figure players** and each edge is a transition. Disciplines: wrestling, BJJ, Judo, Sambo. Stores poses as **joint coordinates in a human-readable text file** (`GrappleMap.txt`); web viewers use WebGL.
- **Link:** https://github.com/Eelis/GrappleMap
- **License:** **Public domain** (code + data).
- **Maintenance:** 700+ commits; long-lived community project.
- **Why it matters:** This is *our exact data model* (two interacting grapplers as a pose graph), already populated and free of restrictions. We can parse its joint coordinates and re-render each pose in our own 2D house style (Section A/B), or use it to seed/validate our graph.
- **How we'd adapt:** Parse `GrappleMap.txt` → joint positions for both figures → either (a) build a 3D rig in Blender at those joints and run Line Art, or (b) draw figures directly from joints via Rough.js/SVG. Caveat: GrappleMap's own figures are deliberately simplistic stick figures (5 keyframe direction-changes/sec); we'd use its *data*, not its visuals.

### D2. free-exercise-db (yuhonas)  ⭐ public-domain exercise imagery
- **What:** 800+ exercises in JSON with start/finish images, fully browsable. Images hostable straight from GitHub raw URLs.
- **Link:** https://github.com/yuhonas/free-exercise-db ; demo: https://yuhonas.github.io/free-exercise-db/
- **License:** **Unlicense (public domain)** — copy/modify/sell freely.
- **Maintenance:** Active.
- **Why it matters:** Cleanest licensing of any exercise set. Useful as restyle source for body-movement plates (warmups, drills, conditioning) adjacent to jiu-jitsu, and as a structured-data model for our own movement entries.

### D3. wger exercise database
- **What:** FLOSS workout manager with a community exercise DB (descriptions, images, instructions).
- **Link:** https://github.com/wger-project/wger
- **License:** **Code AGPL-3.0; exercise images CC-BY-SA 4.0** (some from Wikipedia). The CC-BY-SA share-alike + attribution applies to images — usable commercially **but** derivatives must stay CC-BY-SA and credit. That copyleft can be awkward for a proprietary house style.
- **Maintenance:** Very active.
- **Why it matters:** Large dataset, but the **CC-BY-SA** image license is stickier than free-exercise-db's public domain. Prefer free-exercise-db (D2) where they overlap; use wger mainly for structured exercise metadata.

### D4. Open anatomy / medical illustration sets (restyle / reference)
- **Servier Medical Art** — 3,000+ vector medical/biology images, **CC-BY** (commercial OK with credit). https://blog.stephenturner.us/p/free-open-source-images-tools-scientific-illustrations
- **Gray's Anatomy (1918)** — public domain plates on Wikimedia Commons (post-1923 editions are NOT). Classic anatomy-plate look we can mimic.
- **Open Anatomy Project** — open, high-quality anatomy atlases + open-source software. https://www.openanatomy.org/
- **Health Icons** — **CC0** medical/body icons. 
- **Why it matters:** Reference and restyle sources for muscle/skeletal overlays and for *defining* the anatomy-plate aesthetic our Blender Line Art should emulate. Watch per-asset licenses (CC-BY needs attribution; CC0/PD are cleanest).

### D5. Sign-language pose sets (technique, not direct content)
- **signwriting-animation** — automatic SignWriting → **skeletal pose animation**; open source. https://github.com/sign-language-processing/signwriting-animation
- **OpenHands / WLASL** — pose-based sign datasets with permissive licenses; WLASL provides OpenPose 2D pose representations.
- **Why it matters:** Not jiu-jitsu content, but a proven pattern of **notation/symbol → skeletal pose → rendered figure**. The signwriting-animation repo is a reference implementation for "structured input → skeleton → animation," directly analogous to "graph node → pose → 2D figure."

---

## E. Open projects that already turn pose/skeleton data into stylized 2D figures

### E1. Pose Animator (Google/TensorFlow)  ⭐ skeleton → rigged SVG figure
- **What:** Takes a **2D vector illustration (SVG)** with an embedded named **skeleton group** + an **illustration group** of flattened paths, and deforms the vector curves to follow a pose from PoseNet/FaceMesh — including a **static-image demo** (single image → posed avatar), so it is not limited to live webcam.
- **Link:** https://github.com/yemount/pose-animator ; writeup: https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html
- **License:** **Apache-2.0** (commercial OK).
- **Maintenance:** Low — small repo (~16 commits), effectively in maintenance/archival; depends on older TF.js PoseNet. Treat as a **technique/reference**, not a dependency to ship as-is.
- **Why it matters:** It is the clearest existing example of mapping skeleton/pose data onto a **vector** figure (exactly our "restyle a skeleton into our line figure" goal). The skeleton-rigged-SVG concept is reusable: design ONE house-style SVG figure with a named bone skeleton, then drive it from arbitrary joint coordinates (e.g., from GrappleMap or PoseMy.Art) instead of from PoseNet.
- **How we'd adapt:** Author a single on-brand SVG figure (illustration + skeleton groups). Replace the PoseNet input with our own pose source (GrappleMap joints / PoseMy.Art pose / our graph data) feeding the same bone transforms. This gives infinitely re-posable, perfectly consistent house-style figures from one drawn asset — strongest path if we want figures generated *in-app* rather than pre-rendered.

### E2. OpenPose-rig / skeleton3d / io7m openpose_rig (supporting tech)
- **What:** Projects that render or rig OpenPose skeleton data — Blender rigs that emulate OpenPose skeletons (https://github.com/io7m/com.io7m.visual.openpose_rig), WebGL skeleton rendering (https://github.com/conix-center/skeleton3d).
- **Why it matters:** Glue if we standardize on OpenPose-format joints as our interchange between pose sources and renderers.

---

## How the pieces fit (recommended pipeline)

1. **Get correct poses** — pose two grapplers in **PoseMy.Art** (multi-figure fighting scenes) and export **OBJ**, and/or parse **GrappleMap** joint coordinates (public domain, same domain).
2. **Render clean line-art** — in Blender, attach the **Grease Pencil Line Art modifier** to the posed geometry (silhouette + crease line sets), optionally add 2-band **Shader-to-RGB** flat fills to distinguish the two athletes; **bake → export SVG**. Automate headlessly to batch every graph node.
3. **Apply the house style (the key step)** — run **one deterministic pass**: **svg2roughjs** (hand-inked line identity) or a fixed **SVG halftone/riso filter** (screen-print identity). Locked parameters = every figure looks authored by the same hand.
4. **(Alternative for in-app posing)** — author one **Pose-Animator-style rigged SVG** figure in the house style and drive it from pose data at runtime, instead of pre-rendering.
5. **Restyle/seed content** from **free-exercise-db** (public domain) and anatomy plates (Servier CC-BY / Gray's PD) for adjacent movement/anatomy diagrams.

**Licensing quick-reference for safe commercial use:** Blender GPL (output yours) · Rough.js/svg2roughjs MIT · Pose Animator Apache-2.0 · GrappleMap + free-exercise-db public domain · PoseMy.Art free (re-render = "significant alteration") · wger images CC-BY-SA (copyleft — use sparingly) · Servier CC-BY (credit) · Pencil+ commercial/paid.

---

## Sources
- https://docs.blender.org/manual/en/latest/grease_pencil/modifiers/generate/line_art.html
- https://www.blendernation.com/2023/08/09/add-2d-lines-to-your-3d-models-with-the-blender-grease-pencil-line-art-modifier/
- https://docs.blender.org/manual/en/latest/render/freestyle/introduction.html
- https://artisticrender.com/a-guide-to-blender-freestyle-rendering-with-eevee-and-cycles/
- https://docs.blender.org/manual/en/latest/render/shader_nodes/color/shader_to_rgb.html
- https://artisticrender.com/cel-shading-in-blender/
- https://www.psoft.co.jp/en/product/pencil/blender/
- https://www.cgchannel.com/2023/10/psoft-releases-pencil-4-line-for-blender/
- https://threejs.org/docs/pages/OutlineEffect.html
- https://threejs.org/docs/pages/ToonOutlinePassNode.html
- https://www.maya-ndljk.com/blog/threejs-basic-toon-shader
- https://github.com/fskpf/svg2roughjs
- https://fskpf.github.io/
- https://roughjs.com/
- https://github.com/rough-stuff/rough
- https://github.com/antiboredom/p5.riso
- https://github.com/evestera/svg-halftone
- https://dev.to/rodzyk/svg-halftone-filter-demo-live-image-preview-toggle-3pe0
- https://codepen.io/shshaw/pen/BNgoqg
- https://posemy.art/ , https://posemy.art/features/ , https://posemy.art/pricing/
- https://justsketch.me/
- https://line-of-action.com/
- https://quickposes.com/en
- https://www.posemaniacs.com/en
- https://github.com/Eelis/GrappleMap
- https://github.com/yuhonas/free-exercise-db , https://yuhonas.github.io/free-exercise-db/
- https://github.com/wger-project/wger
- https://blog.stephenturner.us/p/free-open-source-images-tools-scientific-illustrations
- https://www.openanatomy.org/
- https://github.com/sign-language-processing/signwriting-animation
- https://github.com/yemount/pose-animator , https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html
- https://github.com/io7m/com.io7m.visual.openpose_rig
- https://github.com/conix-center/skeleton3d
