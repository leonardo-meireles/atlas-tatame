# LLM-Driven 2D Illustration Workflows for "O Mapa do Jiu-Jitsu"

Research report — May 2026. Scope: how to produce ~dozens of clean, instructional 2D BJJ
position figures that read as **crafted, not AI-generated**, ideally via a repeatable
code/agent-driven workflow.

---

## TL;DR — The recommendation

**Split the problem in two.** They are different problems and conflating them is the trap:

1. **The graph (positions + transitions).** This is topology, not art. Render it with a
   **code-as-diagram tool** that an LLM/Claude Code writes natively. Use **D2** (or Mermaid)
   for the connected-graph view in the app. This is solved, cheap, and version-controllable.

2. **The per-position figure (two interacting human bodies).** This is the hard part and the
   thing your users will judge. **Do NOT try to one-shot these from a text-to-image model**
   (that's exactly the "AI look" you want to avoid), and **do NOT expect Claude + Blender MCP
   to sculpt convincing grapplers**. The realistic quality-per-effort winner for a solo founder is:

   > **Pose a 3D mannequin (two figures) in a browser pose tool → screenshot → trace to clean
   > vector line art → apply ONE consistent house style (flat fills + single ink outline, or a
   > Rough.js/halftone treatment) as SVG.**

   Claude Code's real role here is the *plumbing*: a styling pipeline (SVG post-processing,
   palette tokens, the graph generation, batch export, consistency checks), not the drawing of
   anatomy itself.

**Why:** grappling is *two bodies in contact*. Every generative/figure-from-scratch approach
(text-to-image, primitive-built Blender, pure-code stick figures) falls apart on contact,
occlusion, and limb intertwining — the exact thing BJJ illustration is about. A posed 3D
reference removes the anatomy/contact problem; tracing + a single deliberate style removes the
"AI sheen." That is the crafted look.

---

## 1. Using Claude Code / LLM agents to make 2D figures — what's real vs hype

**What works well today**
- **LLMs writing diagram-as-code** (Mermaid, D2, PlantUML). LLMs author this syntax natively
  with low hallucination; Mermaid's constrained grammar in particular is "learned" well. This is
  the genuinely productive lane for *graph/flow* output.
  ([dev.to token-efficiency analysis](https://dev.to/akari_iku/analyzing-the-best-diagramming-tools-for-the-llm-age-based-on-token-efficiency-5891),
  [smcleod.net](https://smcleod.net/2024/10/generating-diagrams-with-with-ai-/-llms/))
- **LLMs writing/maintaining SVG by hand** for *simple, geometric* assets: icons, UI marks,
  schematic figures, callout overlays. Claude is regarded as the strongest model for hand-authored
  SVG via Artifacts/Skills.
  ([Houtini](https://houtini.com/how-to-make-svgs-with-claude-and-gemini-mcp/),
  [SVGGenie](https://www.svggenie.com/blog/create-svg-with-claude-ai))
- **Claude Code Skills / MCP for diagrams** — there are ready-made skills (e.g.
  [technical-svg-diagrams](https://mcpmarket.com/tools/skills/technical-svg-diagrams),
  [SVG Diagram Creator](https://mcpmarket.com/tools/skills/svg-diagram-creator)) and Excalidraw
  MCP servers (below) that let the agent read/write diagram files like code. This is the new and
  genuinely useful capability MCP unlocked.

**Where it's hype / breaks down**
- **Hand-authored SVG of an organic, posed human body — let alone two intertwined bodies.**
  Even the bullish write-ups concede: "Complex scenes with many elements, precise spatial
  relationships, and detailed shapes still break down, and Claude's SVGs are geometric and
  stylized by nature." Anatomy and contact are precisely "precise spatial relationships."
- **Blender via MCP for figures.** The MCP bridge (ahujasid/blender-mcp, blender.org's official
  MCP lab) is great for *blocky geometric scenes* but explicitly bad at organic form:
  "Trying to get Claude to model a human face… is a lesson in patience. Blender's sculpt mode
  isn't accessible via MCP… Don't expect character models." It's a rapid-prototyping toy, not a
  3D artist. ([MindStudio real-world review](https://www.mindstudio.ai/blog/claude-blender-mcp-real-world-performance),
  [blender.org MCP](https://www.blender.org/lab/mcp-server/),
  [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp))
  - Note: there IS a Grease Pencil / 2D-in-3D capability in the heavier fork
    [sandraschi/blender-mcp](https://github.com/sandraschi/blender-mcp), but driving believable
    2-figure grappling poses through it by prompt is not a realistic solo workflow.
- **Text-to-image (DALL·E/Midjourney/SD) for the figures.** This is the fastest road to the
  exact "looks AI-generated" failure you want to avoid: melted hands, invented gi folds,
  inconsistent style across a set, and broken contact between the two athletes.

**Bottom line for Q1:** use the agent for *code, diagrams, SVG post-processing, batching, and
consistency*, not for inventing anatomy.

---

## 2. Code-first 2D tools — which fit clean instructional pose figures, which are wrong

| Tool | What it is | Fit for the **graph** view | Fit for **pose figures** | Status |
|---|---|---|---|---|
| **D2** ([d2lang](https://d2lang.com), [code4it](https://www.code4it.dev/architecture-notes/d2-diagrams/)) | Text→diagram, best auto-layout (TALA engine; OSS uses dagre/ELK), built-in **sketch** + theming | **Best** for the connected positions graph | No | Active, strong momentum |
| **Mermaid** ([mermaid.js.org](https://mermaid.js.org)) | Text→diagram, huge LLM familiarity, hand-drawn `look: handDrawn` | Great; easiest to render in Next.js | No | Very active (~85k★) |
| **Excalidraw** + `@excalidraw/excalidraw` `exportToSvg/exportToCanvas` ([API docs](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api)) | Hand-drawn canvas (uses Rough.js under the hood); programmatic JSON in/out; **MCP servers** ([yctimlin/mcp_excalidraw](https://github.com/yctimlin/mcp_excalidraw), [excalidraw-cli](https://github.com/swiftlysingh/excalidraw-cli)) | Good, gives the sketch aesthetic for free | Marginal — you'd be hand-placing primitives; not for anatomy | Very active |
| **tldraw** ([tldraw](https://tldraw.com)) | Infinite-canvas SDK, React. Programmatic file API still immature ([#8089](https://github.com/tldraw/tldraw/issues/8089)) | OK if you want an *interactive editable* canvas in-app | No | Very active |
| **Rough.js** ([roughjs.com](https://roughjs.com), [rough-stuff/rough](https://github.com/rough-stuff/rough)) | Tiny lib for hand-drawn/sketchy primitives & SVG paths, Canvas+SVG | Can style the graph edges/nodes sketchy | **Indirect win**: feed it traced pose paths → instant hand-drawn figures | ~21k★ but **dormant** (last release v3.x era; stable, low risk, but no active dev). svg2roughjs ([fskpf/svg2roughjs](https://github.com/fskpf/svg2roughjs)) converts any SVG to roughened SVG — useful for the trace→style step |
| **Konva** / **SVG.js** | Imperative 2D canvas/SVG drawing libs | Fine for custom interactive rendering | Only as a renderer of paths you already have | Active |
| **Manim / Motion Canvas** | Programmatic *animation* figure engines | Overkill; animation-first | No (you said ignore animation) | Active |
| **PlantUML** | Text→UML | Possible but ugliest layout | No | Active |

**Verdict:** For the **graph**, pick D2 (nicest layout) or Mermaid (easiest Next.js render +
hand-drawn theme). **None of these "draw" a grappling figure** — that always comes from a
traced/posed source. Rough.js / svg2roughjs is the one library that meaningfully helps the
*figures*, but only as a **post-processing style pass** on vector paths you already have.

---

## 3. Achieving the "crafted, not-AI" aesthetic

The 2026 design zeitgeist is explicitly a backlash against AI-perfect output toward "tactile,
imperfect" looks — risograph, halftone, hand-ink. That works in your favor: a deliberately
imperfect, consistent house style reads as authored.
([illustration.app riso 2026](https://www.illustration.app/blog/best-risograph-effect-plugins-and-tools-for-digital-design-in-2026),
[Maker Lex riso in Illustrator](https://makerlex.com/how-to-fake-a-riso-print-effect-in-illustrator/))

Techniques that read as crafted, ranked by effort-fit for SVG/web:
1. **Single confident ink outline + flat 2–3 color fills** (instructional-manual / "technical
   plate" look). Cheapest, ages best, scales to dozens of figures. This alone is enough.
2. **Rough.js / svg2roughjs roughening pass** on the outline — adds hand-drawn wobble
   programmatically and consistently across the whole set (consistency is what kills the AI feel).
3. **Halftone / risograph overlay** as an SVG filter or CSS layer (dot screen + 1–2 spot inks +
   slight misregistration/overprint). Strong "printed manual" character; do it as a *reusable
   layer*, not per-figure by hand.
4. **Two-spot-color palette + paper-grain texture** background. Locks the brand and hides the
   "vector-cleanness."

The crucial point is **consistency**: the same line weight, the same 2 inks, the same halftone
on every figure. A code/Claude-Code post-processing step (apply style tokens to every SVG) is how
a solo founder keeps 40 figures looking like one hand made them. Avoid per-image generative reroll
— that's where style drifts and the AI-tell appears.

---

## 4. Existing grappling/sports-technique mapping projects to study

- **[Eelis/GrappleMap](https://github.com/Eelis/GrappleMap)** (the repo you're in). Models
  positions/transitions as **joint coordinates in a plain-text DB** (`GrappleMap.txt`) and renders
  **two stick-figure bodies via WebGL**; has a `/blender` dir and a web + native editor.
  Key takeaways to borrow: (a) the **joint-coordinate data model** is exactly the right
  abstraction — pose = data, rendering = separate concern; (b) two simple articulated figures can
  communicate contact without photoreal anatomy. Its own admitted weakness is the "rudimentary,
  manually keyframed, simplistic" look — your opportunity is to keep its *data model* but upgrade
  the *render style*. (C++/JS/Python.)
- **[daveyarwood/bjj-graph](https://github.com/daveyarwood/bjj-graph)** — BJJ as a graph in
  Clojure (ubergraph) rendered with **Graphviz**; generates random "rolls" as walks of the graph.
  Great prior art for the **graph/topology** half and for transition-sequence generation. No
  figures.
- **[fcavani/jiu-jitsu-graph](https://github.com/fcavani/jiu-jitsu-graph)** — graph DB
  (Neo4j→Dgraph) of positions/sequences/scores/descriptions. Data-model reference.
- **[ubershmekel BJJ Data](https://ubershmekel.github.io/bjjdata/)** and the
  [Graphling "Landmarks of BJJ"](https://medium.com/@Graphling/landmarks-of-brazilian-jiu-jitsu-techniques-position-families-links-801ef9deda8a)
  writeup — position-family taxonomy you can reuse for node grouping/clustering.
- **[TensorFlow Pose Animator](https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html)**
  — rigs a 2D SVG character to a skeleton (PoseNet/FaceMesh). Interesting for a single rigged figure
  but built for live mocap of one body, not static two-body grappling plates.

**Reference / posing tools (not OSS, but the practical figure source):**
[PoseMy.Art](https://posemy.art/martial-arts-poses/) (free, browser, Mixamo animation library,
multi-model scenes), [Magic Poser](https://magicposer.com/), [SetPose](https://setpose.com/),
[PoseManiacs](https://www.posemaniacs.com/en), DesignDoll. PoseMy.Art is the standout: free, runs
in-browser, supports **multiple posable figures in one scene** — i.e. you can stage *both*
grapplers and grab a clean reference screenshot from any angle.

---

## 5. Best quality-per-effort for a solo founder (the recommended pipeline)

Goal: ~dozens of consistently-styled, crafted-looking two-person position figures, repeatably.

**Recommended pipeline ("posed-reference → traced → house-styled SVG"):**
1. **Pose two mannequins** for the position in **PoseMy.Art** (free, browser, multi-figure).
   Use the joint data model from GrappleMap conceptually — one canonical camera angle per family
   for consistency. Screenshot.
2. **Trace to vector** — Inkscape *Trace Bitmap* (free) or Illustrator *Image Trace*, saved as a
   reusable **preset** so every figure traces identically. High-contrast input traces cleanest, so
   render the mannequin as flat-shaded/silhouette.
   ([Inkscape trace](https://inkscape-manuals.readthedocs.io/en/latest/tracing-an-image.html),
   [Illustrator Image Trace](https://helpx.adobe.com/illustrator/using/image-trace.html))
3. **Apply the house style as a code pass** — this is Claude Code's real job: an SVG
   post-processor that normalizes line weight, swaps in your 2-spot palette, optionally runs
   **svg2roughjs** for the hand-drawn wobble, and stamps a halftone/grain layer. Same script over
   every file = perfect set consistency = "made by a person."
4. **Generate the connected-graph view in the app** with **D2 or Mermaid** from your position/edge
   data — fully agent-authorable, version-controlled, re-renders on data change.
5. **Store pose as data, not pixels** (mimic GrappleMap's `.txt` joint model) so figures are
   regenerable and the graph and figures share one source of truth.

This gives you: zero "AI look" (real posed anatomy, real authored style), full consistency
(one trace preset + one style script), and low marginal cost per new figure (pose → trace → run
script). Claude Code accelerates steps 3–5 (the code), which is where it's actually strong.

**Lighter-weight fallback** if even tracing is too much: lean into GrappleMap's articulated
stick/segment figures, but **re-skin them** — feed the joint coordinates into your own SVG/Canvas
renderer with Rough.js styling + halftone. Lower fidelity, but fully programmatic, infinitely
consistent, and unmistakably "crafted illustration," not AI render. Good MVP; upgrade individual
key positions to traced figures over time.

**What to AVOID**
- One-shotting figures with text-to-image models (the canonical AI-look failure; breaks on
  contact/hands/gi; style drifts across a set).
- Expecting Claude + Blender MCP to model or pose convincing grapplers — it's for blocky scenes,
  not organic two-body contact.
- Hand-authoring human pose SVG with the LLM directly — geometric-stylized only; won't read as
  instructional anatomy.
- Per-figure manual styling — inconsistency is the #1 tell of "AI/template" work; always style via
  a single reusable script/preset.
- Betting the figure pipeline on Rough.js as active software — it's effectively dormant (stable,
  fine to use, but don't expect fixes); pin the version.

---

## Sources
- https://dev.to/akari_iku/analyzing-the-best-diagramming-tools-for-the-llm-age-based-on-token-efficiency-5891
- https://smcleod.net/2024/10/generating-diagrams-with-with-ai-/-llms/
- https://houtini.com/how-to-make-svgs-with-claude-and-gemini-mcp/
- https://www.svggenie.com/blog/create-svg-with-claude-ai
- https://mcpmarket.com/tools/skills/technical-svg-diagrams
- https://mcpmarket.com/tools/skills/svg-diagram-creator
- https://www.code4it.dev/architecture-notes/d2-diagrams/
- https://mermaid.js.org
- https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api
- https://github.com/yctimlin/mcp_excalidraw
- https://github.com/swiftlysingh/excalidraw-cli
- https://github.com/tldraw/tldraw/issues/8089
- https://roughjs.com / https://github.com/rough-stuff/rough
- https://github.com/fskpf/svg2roughjs
- https://www.mindstudio.ai/blog/claude-blender-mcp-real-world-performance
- https://www.blender.org/lab/mcp-server/
- https://github.com/ahujasid/blender-mcp / https://github.com/sandraschi/blender-mcp
- https://www.illustration.app/blog/best-risograph-effect-plugins-and-tools-for-digital-design-in-2026
- https://makerlex.com/how-to-fake-a-riso-print-effect-in-illustrator/
- https://github.com/Eelis/GrappleMap
- https://github.com/daveyarwood/bjj-graph
- https://github.com/fcavani/jiu-jitsu-graph
- https://ubershmekel.github.io/bjjdata/
- https://medium.com/@Graphling/landmarks-of-brazilian-jiu-jitsu-techniques-position-families-links-801ef9deda8a
- https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html
- https://posemy.art/martial-arts-poses/ / https://magicposer.com/ / https://setpose.com/ / https://www.posemaniacs.com/en
- https://inkscape-manuals.readthedocs.io/en/latest/tracing-an-image.html
- https://helpx.adobe.com/illustrator/using/image-trace.html
