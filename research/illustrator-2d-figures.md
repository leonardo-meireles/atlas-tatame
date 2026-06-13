# Generating 2D Vector BJJ Figures from Joint Coordinates

**Use case:** GrappleMap 3D skeleton data (23 named joints × 2 people) → clean 2-color Olympic-pictogram-style SVG/PNG for use in a BJJ web app, replacing lumpy Blender capsule renders.

---

## 1. Driving Illustrator 2026 from the Command Line / Scripts on macOS

### Scripting landscape in 2026

| Framework | Status | Available to 3rd parties? |
|-----------|--------|--------------------------|
| **ExtendScript (.jsx)** | Supported, not deprecated | Yes — fully functional |
| **CEP** | Being phased out (long-term) | Yes — still ships |
| **UXP** | Modern successor | **No** — Illustrator UXP is internal-only to Adobe as of Feb 2026; no public API or docs for 3rd-party developers ([Adobe community confirmation](https://community.adobe.com/questions-652/clarification-needed-is-uxp-publicly-available-for-illustrator-in-2026-1548811)) |
| **NUXP** | OSS workaround | macOS-only C++ plugin that embeds an HTTP server inside Illustrator; talk to it from TypeScript over localhost |

**Bottom line:** ExtendScript is your only real option for programmatic headless automation in 2026. The **ExtendScript Toolkit (ESTK) IDE** was deprecated in 2020, but the runtime engine in Illustrator itself is intact and fully supported. Use the [VS Code ExtendScript debugger extension](https://exchange.adobe.com/apps/cc/108380/extendscript-developer-tools) for development.

### Running ExtendScript from the macOS command line

**Pattern A — inline JSX string via osascript:**

```bash
osascript -e 'tell application "Adobe Illustrator" to do javascript "app.activeDocument.artboards[0].name = \"test\";"'
```

**Pattern B — run a .jsx file (recommended for complex scripts):**

```bash
osascript <<'EOF'
tell application "Adobe Illustrator"
  activate
  do javascript file "/Users/you/scripts/draw-skeleton.jsx"
end tell
EOF
```

**Pattern C — pass arguments into the script:**

```applescript
tell application "Adobe Illustrator"
  activate
  do javascript file "/path/draw-skeleton.jsx" with arguments {"{\"joints\": [...]}"}
end tell
```

Inside the .jsx, arguments arrive as `arguments[0]` (a string you JSON.parse).

**Notes:**
- Illustrator must already be running (or AppleScript's `activate` will launch it but you may need to wait).
- On first run macOS will ask for Automation permission for Terminal/your IDE.
- `do javascript` is the correct AppleScript dictionary verb; "execute script" is InDesign-specific.
- References: [Adobe community thread](https://community.adobe.com/t5/illustrator-discussions/how-to-pass-arguments-from-applescript-to-javascript-jsx-illustrator-extendscript/m-p/14577424), [ExtendScript scripting language support docs](https://ai-scripting.docsforadobe.dev/introduction/scriptingLanguageSupport/)

---

## 2. Illustrator MCP Servers

Several MCP servers exist. None are production-grade, but the best-maintained one is useful for interactive iteration.

### a. `ie3jp/illustrator-mcp-server` — [GitHub](https://github.com/ie3jp/illustrator-mcp-server)
- **63 tools** across read/modify/export categories
- Generates temporary AppleScript wrapping ExtendScript JSX, fires it at Illustrator, returns JSON
- Tools include `create_path`, `create_line`, `modify_object`, and an `export` tool for SVG/PNG/PDF
- **Maturity:** 37 stars, 5 forks, 17 releases, 182 E2E smoke test cases, docs in 7 languages — the most mature of the bunch
- Last updated March 2026
- Node.js 20+ required

### b. `krVatsal/illustrator-mcp` — [GitHub](https://github.com/krVatsal/illustrator-mcp)
- Natural-language → ExtendScript via MCP; macOS uses osascript, Windows uses COM
- Includes screenshot capture to let the agent see the result
- Younger/lighter project

### c. `spencerhhubert/illustrator-mcp-server` — [MCP Hub listing](https://www.mcpserverfinder.com/servers/spencerhhubert/illustrator-mcp-server)
- 52 stars, 8 forks, Python, macOS-only (AppleScript), 6 commits — early stage
- Sends raw JS to Illustrator and returns output; very thin wrapper

### d. `matrayu/adobe-mcp` — [GitHub](https://github.com/matrayu/adobe-mcp)
- Unified MCP covering Photoshop, Premiere, Illustrator, InDesign
- Broader scope but likely shallower Illustrator coverage

**Assessment:** For the BJJ use case, `ie3jp/illustrator-mcp-server` is the only one mature enough to rely on. For fully automated pipeline work (no Claude in the loop), skip MCP and call ExtendScript directly via osascript.

---

## 3. Drawing from Coordinates in ExtendScript — API and Working Snippet

### Key API surface

```javascript
// PathItem
var path = doc.pathItems.add();
path.setEntirePath([[x1,y1],[x2,y2],[x3,y3]]);  // straight-line segments
path.stroked = true;
path.strokeWidth = 18;                            // points
path.strokeCap = StrokeCap.ROUND;
path.strokeJoin = StrokeJoin.ROUND;
path.filled = false;

// Color
var c = new RGBColor(); c.red = 220; c.green = 50; c.blue = 50;
path.strokeColor = c;

// Circle (EllipseItem)
var head = doc.pathItems.ellipse(top, left, width, height);
head.filled = true;  head.fillColor = c;  head.stroked = false;
```

Reference: [PathItem scripting guide](https://ai-scripting.docsforadobe.dev/jsobjref/PathItem/)

### Minimal working .jsx — thick round-capped skeleton + SVG export

```jsx
// draw-bjj-skeleton.jsx
// Usage: run via File > Scripts, or osascript "do javascript file ..."

#target illustrator

var W = 500, H = 500;
var doc = app.documents.add(DocumentColorSpace.RGB, W, H);

// -- Colors --
var red = new RGBColor();   red.red = 220;  red.green = 40;  red.blue = 40;
var blue = new RGBColor();  blue.red = 30;  blue.green = 80; blue.blue = 210;
var bg  = new RGBColor();   bg.red = 245;   bg.green = 245;  bg.blue = 245;

// -- Helpers --
function makeStroke(doc, pts, color, width) {
    var p = doc.pathItems.add();
    p.setEntirePath(pts);
    p.stroked = true;
    p.strokeWidth = width;
    p.strokeCap  = StrokeCap.ROUND;
    p.strokeJoin = StrokeJoin.ROUND;
    p.strokeColor = color;
    p.filled = false;
    return p;
}

function makeCircle(doc, cx, cy, r, color) {
    // ellipse(top, left, width, height) — top is Y from top-left origin
    var e = doc.pathItems.ellipse(cy + r, cx - r, 2*r, 2*r);
    e.filled = true;
    e.fillColor = color;
    e.stroked = false;
    return e;
}

// -- Person 1 (red) — simplified joint coords (x,y in pts) --
// Illustrator origin is bottom-left; Y increases upward.
// GrappleMap coords will need a Y-flip and scale before passing in.
var p1 = {
    head:        [180, 420],
    neck:        [180, 390],
    lShoulder:   [155, 370],
    rShoulder:   [205, 370],
    lElbow:      [130, 330],
    rElbow:      [225, 340],
    lWrist:      [115, 295],
    rWrist:      [240, 300],
    hip:         [180, 320],
    lKnee:       [160, 250],
    rKnee:       [200, 245],
    lAnkle:      [150, 180],
    rAnkle:      [210, 175]
};

var SW = 14;   // stroke width for limbs
var HR = 16;   // head radius

// Torso
makeStroke(doc, [p1.neck, p1.hip], red, SW);
// Shoulders
makeStroke(doc, [p1.lShoulder, p1.rShoulder], red, SW);
// Arms
makeStroke(doc, [p1.lShoulder, p1.lElbow, p1.lWrist], red, SW);
makeStroke(doc, [p1.rShoulder, p1.rElbow, p1.rWrist], red, SW);
// Legs
makeStroke(doc, [p1.hip, p1.lKnee, p1.lAnkle], red, SW);
makeStroke(doc, [p1.hip, p1.rKnee, p1.rAnkle], red, SW);
// Head
makeCircle(doc, p1.head[0], p1.head[1], HR, red);

// -- Person 2 (blue) — offset slightly --
// (In production, feed actual joint coords from GrappleMap data.)
var dx = 50, dy = -20;
function shift(pt) { return [pt[0]+dx, pt[1]+dy]; }
makeStroke(doc, [shift(p1.neck), shift(p1.hip)], blue, SW);
makeStroke(doc, [shift(p1.lShoulder), shift(p1.rShoulder)], blue, SW);
makeStroke(doc, [shift(p1.lShoulder), shift(p1.lElbow), shift(p1.lWrist)], blue, SW);
makeStroke(doc, [shift(p1.rShoulder), shift(p1.rElbow), shift(p1.rWrist)], blue, SW);
makeStroke(doc, [shift(p1.hip), shift(p1.lKnee), shift(p1.lAnkle)], blue, SW);
makeStroke(doc, [shift(p1.hip), shift(p1.rKnee), shift(p1.rAnkle)], blue, SW);
makeCircle(doc, shift(p1.head)[0], shift(p1.head)[1], HR, blue);

// -- SVG Export --
var svgOpts = new ExportOptionsSVG();
svgOpts.coordinatePrecision = 2;
svgOpts.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
svgOpts.documentEncoding = SVGDocumentEncoding.UTF8;
svgOpts.embedRasterImages = false;
svgOpts.embedAllFonts = false;

var outFile = new File("/tmp/bjj-skeleton");   // Illustrator appends .svg
doc.exportFile(outFile, ExportType.SVG, svgOpts);

// -- PNG Export (optional) --
var pngOpts = new ExportOptionsPNG24();
pngOpts.artBoardClipping = true;
pngOpts.resolution = 144;
pngOpts.transparency = true;
var pngFile = new File("/tmp/bjj-skeleton.png");
doc.exportFile(pngFile, ExportType.PNG24, pngOpts);
```

**GrappleMap coordinate adaptation notes:**
- GrappleMap uses a 3D coordinate system; project to 2D by discarding the depth axis (Z) or using an orthographic projection if you want slight perspective.
- Y-axis: GrappleMap Y is up, Illustrator Y is up from bottom-left origin — they match after scaling. If your source is screen-space (Y-down), flip: `illusY = docHeight - sourceY`.
- Scale: multiply normalized GrappleMap coords (~0–1 range) by artboard size.

References: [ExportOptionsSVG docs](https://ai-scripting.docsforadobe.dev/jsobjref/ExportOptionsSVG/), [export gist](https://gist.github.com/iconifyit/2cbab3f0dd421b6d4bb520bfcf445f0d), [layers/SVG export gist](https://gist.github.com/TomByrne/7816376)

---

## 4. Skeleton → Pictogram Technique: Best Practices

### The Tokyo 2020 approach (reference model)

Tokyo 2020 pictograms ([Wikipedia](https://en.wikipedia.org/wiki/2020_Summer_Olympic_pictograms), [designboom writeup](https://www.designboom.com/design/tokyo-2020-kinetic-pictograms-olympic-games-03-09-2020/)) were designed by Masaaki Hiromura over ~2 years. Key design decisions:

- **Uniform bold stroke weight** throughout — no thin lines, everything reads at a glance
- **Single solid color per figure** — instant silhouette readability
- **Circle head, stroked limbs** — the classic "transport pictogram" grammar (Paris 1964 origin)
- The kinetic/animated versions used the static pictograms as keyframes with figure appearing/disappearing as a single mass

For BJJ/grappling specifically: the [Judo pictogram SVG](https://en.m.wikipedia.org/wiki/File:Judo_pictogram.svg) on Wikipedia is a perfect reference — two interlocked figures, two colors, thick uniform strokes.

### Rendering pipeline: joint coords → pictogram

**Step 1 — Project to 2D**
For a canonical reference pose, pick the viewing angle that is most informative (usually a slight 3/4 view, or pure side/front). Drop the depth dimension or use a simple orthographic projection.

**Step 2 — Define bone segments**
Standard 17-bone body graph from ~23 joints:
```
Head — Neck — L/R Shoulder — L/R Elbow — L/R Wrist
Neck — Hip — L/R Knee — L/R Ankle
L/R Shoulder <-> shoulder bar
L/R Hip <-> hip bar
```

**Step 3 — Draw strokes with round caps and joins**
Use a uniform stroke width (SW) roughly proportional to figure height (~7-10% of figure height for a bold pictogram look). `stroke-linecap:round` + `stroke-linejoin:round` at every joint.

**Step 4 — Head circle**
Radius ≈ 1.5–2× SW, centered on the head joint, filled solid in the figure color.

**Step 5 — Two-figure legibility (the critical problem for BJJ)**
This is where GrappleMap's 2-person poses are hardest:
- **Color + Z-order**: assign red/blue to athletes. Draw the "back" athlete first, "front" athlete second. This naturally handles overlap for many poses.
- **White gap lines (knockout)**: Where a front-figure limb crosses a back-figure limb, draw a slightly wider white stroke under the front limb to create a visual gap. This is how classic railway diagrams and circuit maps separate crossing lines. In SVG: draw each bone twice — once in white at SW+4px, once in figure color at SW. Layer order determines which figure appears "on top."
- **Avoid outlining individual bones** (looks cartoonish); keep strokes as strokes rather than converting to filled outlines, unless you need the Illustrator-polish path output.

**Step 6 — Giving limbs volume (optional, for more polished output)**
To escape the pure stick-figure look without going full 3D:
- **Offset / Stroke Expansion:** In Illustrator, Object > Expand Appearance converts a thick round-capped stroke into a filled shape. You can then apply subtle gradient fills (light on top, darker below) to give limb cylindrical volume — still reads as flat pictogram but feels less "stickman."
- Keep torso as a filled polygon (convex hull of shoulder + hip joints) rather than a thin stroke.

**Prior art / references:**
- Tokyo 2020 Judo: [Wikimedia SVG](https://commons.wikimedia.org/wiki/File:Skeleton_pictogram.svg)
- [Evaluating Olympic Pictograms paper](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8997524/) — academic analysis of legibility factors
- GrappleMap itself already draws 3D stick figures using joint data; its SVG diagram output is relevant prior art: [GrappleMap README](https://github.com/Eelis/GrappleMap/blob/master/README.md)
- Pose Animator (TensorFlow): [blog post](https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html) — drives SVG characters from pose estimation keypoints; exactly this use case but for live video

---

## 5. Alternative: Skip Illustrator, Generate SVG Directly in Code

### How it works

Generate SVG strings from joint data in JavaScript/TypeScript, render inline in the web app:

```typescript
// bones: array of [jointA, jointB] index pairs
// joints: array of {x, y} after 2D projection + scaling
function renderFigureSVG(joints: {x:number,y:number}[], color: string, SW = 18): string {
  const bones = [
    [0,1],[1,2],[1,5],[2,3],[3,4],[5,6],[6,7], // arms
    [1,8],[8,9],[9,10],[8,11],[11,12]           // torso + legs (COCO-format indices)
  ];
  const head = joints[0];
  const lines = bones.map(([a,b]) => {
    const A = joints[a], B = joints[b];
    return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"
      stroke="${color}" stroke-width="${SW}"
      stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('\n');
  const headCircle = `<circle cx="${head.x}" cy="${head.y}" r="${SW * 1.4}" fill="${color}"/>`;
  return lines + '\n' + headCircle;
}

// Two-figure SVG with white knockout gaps
function renderTwoFigures(p1: ..., p2: ...) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
    <!-- Back figure white gap -->
    ${renderFigureSVG(p1.joints, 'white', 22)}
    <!-- Back figure -->
    ${renderFigureSVG(p1.joints, '#DC3028', 18)}
    <!-- Front figure white gap -->
    ${renderFigureSVG(p2.joints, 'white', 22)}
    <!-- Front figure -->
    ${renderFigureSVG(p2.joints, '#1E50D2', 18)}
  </svg>`;
  return svg;
}
```

SVG `stroke-linecap="round"` and `stroke-linejoin="round"` are universally supported in all browsers and render identically at any scale. The output is a valid SVG string that can be served as-is, embedded inline, or saved as an `.svg` file.

MDN references: [stroke-linecap](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-linecap), [fills and strokes tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Fills_and_strokes)

### Pros vs. Illustrator route

| | Direct SVG (code) | Illustrator route |
|---|---|---|
| **Speed** | Instant, fully automated | Requires Illustrator running, AppleScript roundtrip |
| **Web integration** | Native — SVG is the output | Extra export step (SVG/PNG from AI) |
| **Artist refinement** | Not possible without re-opening in editor | Ideal — designer can tweak Beziers, spacing, etc. |
| **Consistency** | Perfectly consistent across all poses | Same, if scripted; varies if hand-touched |
| **Visual quality** | High — round-cap SVG strokes look clean | Higher ceiling — can add gradients, organic shapes, custom Bezier flourishes |
| **Scalability** | Trivially scales to thousands of positions | Bottleneck at Illustrator performance |
| **Dependency** | Zero — pure JS/TS | Requires Illustrator license + running app on macOS |
| **Animation potential** | Easy — SVG is live DOM | Hard — export is static |

**When Illustrator is worth it:** You want a graphic designer to take the generated skeleton output, apply typographic-quality Bezier polish, custom rounded forms, or an identity system (specific weight/proportion ratios) — then export a final art-directed SVG master that gets used statically. One-time polish for a library of canonical BJJ positions.

**When to skip Illustrator:** You need to render hundreds or thousands of positions programmatically, want the figures to animate (transitions between positions), or want to embed live SVG in React components. The code route wins here.

---

## Recommended Approach

**For the BJJ webapp: generate SVG directly in code, skip Illustrator for the pipeline.** Write a TypeScript function that takes the two sets of 23 joint coordinates from GrappleMap, projects them to 2D (orthographic, choosing the most informative viewing angle per position class), scales to a 500×500 viewBox, and emits an inline SVG using `<line>` elements with `stroke-linecap="round"` at ~18px width plus `<circle>` heads — two colors (e.g. crimson `#DC3028` / cobalt `#1E50D2`) with white knockout strokes (22px white under each 18px colored stroke, drawn in z-order: back figure first). This produces clean, bold, Olympic-pictogram-quality figures in < 50 lines of code, renders at any resolution, integrates natively as React JSX, and scales to all GrappleMap positions without any Illustrator license or macOS dependency. Reserve Illustrator (via the `ie3jp/illustrator-mcp-server` MCP or direct ExtendScript via osascript) only if an artist wants to hand-polish a curated subset of positions — export those as SVG masters and use them statically.

---

## Key URLs

- ExtendScript status 2026: https://mapsoft.com/posts/extendscript.html
- UXP not public for Illustrator: https://community.adobe.com/questions-652/clarification-needed-is-uxp-publicly-available-for-illustrator-in-2026-1548811
- PathItem API: https://ai-scripting.docsforadobe.dev/jsobjref/PathItem/
- ExportOptionsSVG API: https://ai-scripting.docsforadobe.dev/jsobjref/ExportOptionsSVG/
- SVG export gist (all options): https://gist.github.com/iconifyit/2cbab3f0dd421b6d4bb520bfcf445f0d
- Layers→SVG export script: https://gist.github.com/TomByrne/7816376
- ie3jp/illustrator-mcp-server: https://github.com/ie3jp/illustrator-mcp-server
- krVatsal/illustrator-mcp: https://github.com/krVatsal/illustrator-mcp
- spencerhhubert/illustrator-mcp-server: https://www.mcpserverfinder.com/servers/spencerhhubert/illustrator-mcp-server
- matrayu/adobe-mcp: https://github.com/matrayu/adobe-mcp
- Tokyo 2020 pictograms Wikipedia: https://en.wikipedia.org/wiki/2020_Summer_Olympic_pictograms
- Tokyo 2020 kinetic pictograms: https://www.designboom.com/design/tokyo-2020-kinetic-pictograms-olympic-games-03-09-2020/
- Judo pictogram SVG (Wikimedia): https://en.m.wikipedia.org/wiki/File:Judo_pictogram.svg
- Olympic pictogram legibility paper: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8997524/
- GrappleMap GitHub: https://github.com/Eelis/GrappleMap
- Pose Animator (TensorFlow): https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html
- SVG stroke-linecap MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-linecap
- AppleScript+ExtendScript args thread: https://community.adobe.com/t5/illustrator-discussions/how-to-pass-arguments-from-applescript-to-javascript-jsx-illustrator-extendscript/m-p/14577424
