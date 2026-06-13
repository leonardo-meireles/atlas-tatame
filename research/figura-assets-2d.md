# 2D Vector Figure Assets for BJJ Learning App — Research Report

_Compiled 2026-05-24. Goal: stop hand-rendering 3D capsule stickmen; build on real 2D vector figure assets/templates or proven techniques for ~20 BJJ positions._

---

## 1. Free / CC0 Vector Figure Assets

### SVG Repo — Grappling & Wrestling Icons
- **URL:** https://www.svgrepo.com/vectors/grappling/ · https://www.svgrepo.com/vectors/wrestling/
- **License:** MIT or CC0 (per icon; shown on each asset page). Commercial use allowed.
- **Format:** SVG
- **What's there:** ~50 wrestling icons, ~30 grappling silhouette icons. Single-action pictograms, not multi-position ground sequences.
- **How to extend:** Good starting point for a consistent stroke style. Each icon is a flat 2-color silhouette; you can redraw limb positions in Illustrator/Inkscape while matching the stroke weight. Reposability: **low** (no skeleton; paths are merged per figure).

### Pixabay — Wrestling / Martial Arts Vectors
- **URL:** https://pixabay.com/vectors/wrestling-fight-martial-arts-1293885/ · https://pixabay.com/vectors/search/martial%20arts/
- **License:** Pixabay License (free commercial use, no attribution required, cannot resell standalone).
- **Format:** SVG / PNG / EPS
- **What's there:** ~34 wrestling vectors, 16,000+ martial-arts vectors across standing, clinch, and some ground poses. Quality varies wildly.
- **How to extend:** Download the best-matching silhouette, trace key limb angles in Illustrator, replicate that style for missing positions. Reposability: **low-medium** (merged paths but usable as drawing reference).

### Vecteezy — Jiu-Jitsu / Grappling Vectors
- **URL:** https://www.vecteezy.com/free-vector/jiu-jitsu · https://www.vecteezy.com/free-vector/grappling
- **License:** Vecteezy Free License (requires attribution on free tier; upgrade to Pro at ~$14/mo for no-attribution commercial). **Important:** The free license requires a backlink, which is impractical for app use — plan for Pro.
- **Format:** SVG, EPS, AI
- **What's there:** 761 jiu-jitsu vectors; 1,737 grappling vectors. Many are silhouette-style two-figure compositions showing guard, mount, rear-naked-choke, and takedown positions.
- **How to extend:** Best free source for actual two-person ground-position art. Use as a visual library to redraw in a consistent house style, or purchase Pro access for direct commercial use.

### Openclipart
- **URL:** https://openclipart.org/
- **License:** CC0 (pure public domain). Full commercial use, no attribution.
- **Format:** SVG
- **What's there:** 185,290 cliparts. Martial arts / grappling search yields scattered results — judo throws, wrestling holds, some MMA silhouettes. Quality is inconsistent; older art, often clip-art aesthetic.
- **How to extend:** CC0 means you can modify and redistribute freely. Best used for rough geometry reference, then redrawn in your house style. Reposability: **low** (flat merged paths).

### SVGSilh (svgsilh.com) — Judo/Wrestling CC0
- **URL:** https://svgsilh.com/image/305115.html (judo/wrestling pictogram)
- **License:** CC0
- **Format:** SVG
- **What's there:** Modified derivatives of Pixabay images released CC0. Includes a classic judo pictogram style figure. Small library.
- **How to extend:** Download the SVG, open paths in Inkscape, adjust joint positions. Good starting silhouette for a ground-fighting pose set.

### Open Peeps (Pablo Stanley)
- **URL:** https://www.openpeeps.com/
- **License:** CC0 — copy, modify, distribute, commercial use, no attribution required.
- **Format:** SVG (Figma/Sketch/XD component library with nested components)
- **What's there:** ~584,688 combinations of standing/sitting humanoid figures: modular arms, legs, torsos, heads, expressions. Figures are UPRIGHT — no ground or clinch poses.
- **How to extend:** The component structure (separated limbs as nested SVG groups) is exactly what you need for a pose system. You can **detach and rearrange** limb components in Figma to construct ground positions, then export as new static SVGs. This is the most "repurposable" free humanoid kit. Reposability: **high for standing; medium for ground** (limbs must be manually repositioned; no skeleton rig).

### Humaaans (Pablo Stanley)
- **URL:** https://www.humaaans.com/
- **License:** CC BY 4.0 (attribution required). Commercial use allowed.
- **Format:** SVG (Figma/Sketch library). Also on Blush Design.
- **What's there:** Mix-and-match body parts (torso, legs, arms, head variants). More stylized/illustrated than Open Peeps. Same limitation: standing poses only in the base library.
- **How to extend:** Similar to Open Peeps — detach components, repose in Figma, construct prone/guard/mount positions manually. Reposability: **medium** (separate body parts make it viable; no automatic rig).

### The Noun Project — BJJ / Grappling Icons
- **URL:** https://thenounproject.com/browse/icons/term/jiu-jitsu/ (37 icons) · https://thenounproject.com/browse/icons/term/grappling/ (73 icons) · https://thenounproject.com/browse/icons/term/martial-arts/ (1,033 icons)
- **License:** Free tier requires CC BY attribution on every use (impractical for an app). **Icon Pro plan: $3.33/mo/year** gives unlimited royalty-free commercial downloads, no attribution. Creator Pro: $9.99/mo/year adds photos + sets.
- **Format:** SVG, PNG
- **What's there:** 37 BJJ-specific icons; 73 grappling icons; 1,033 martial arts icons. These are single-action pictogram-style icons (standing/clinch heavy, limited ground variety).
- **How to extend:** Icon Pro ($40/year) is a reasonable cost for access. Best used as style references and for UI icons (belt rank indicators, menu icons), not full position figures. Reposability: **low** (merged paths).

### Flaticon (Freepik)
- **URL:** https://www.flaticon.com/ (search: judo, grappling, wrestling)
- **License:** Free tier requires attribution; Premium at ~$10/mo removes attribution and allows unlimited commercial use. **Note:** Flaticon icons cannot be used in a product that competes with Flaticon's core business.
- **Format:** SVG, PNG, EPS
- **What's there:** Large library of martial arts pictograms. Mainly standing/action silhouettes.
- **How to extend:** Premium tier for clean commercial use. Same low reposability as other merged-path icons.

---

## 2. Sport Pictogram Systems & Kits

### Wikimedia Commons — Olympic Judo / Wrestling Pictograms
- **URL:** https://commons.wikimedia.org/wiki/File:Judo_pictogram.svg
- **License:** Public Domain (pre-1964 era pictograms) or specific Creative Commons. Check each file — Tokyo 2020 official pictograms are NOT freely licensed; the unofficial/derived ones often are CC0.
- **Format:** SVG
- **What's there:** Classic single-figure judo/wrestling pictogram in the bold round-capped-stroke Olympic style. The SVG structure uses simple geometric paths — thick strokes, circular joints, limb segments. This is the canonical "sport pictogram" construction system.
- **How to extend:** Open the SVG and study the construction: head = circle, limbs = stroke paths with round caps and joins, body = rounded rectangle. You can build a modular system from these primitives. For BJJ: two-figure ground positions require composing two such figures, adjusting limb angles. **This is the fastest path to a consistent pictogram look.**

### Icons8 Olympic Sports Icon Set (Smashing Magazine Freebie)
- **URL:** https://www.smashingmagazine.com/2016/07/freebie-olympics-sports-icon-set-45-icons-eps-pdf-png-svg/
- **Download:** https://smashingmagazine.com/provide/Freebies/freebie-olympic-sports-icons.zip (31.4 MB, EPS/SVG/PDF/PNG)
- **License:** CC BY 3.0 — attribution required; modify size, color, shape freely. Commercial use allowed with credit to Icons8.
- **Format:** SVG, EPS, PDF, PNG
- **What's there:** 45 Olympic sports icons including wrestling and judo. Consistent bold pictogram style.
- **How to extend:** Excellent starting point — wrestling/judo icons give you a proven construction grammar (stroke weight, joint radius, body proportions). Use as a template system: open SVG in Illustrator, adjust joint angles, add a second figure to construct ground positions. **One of the best free structured starting points.**

### Smashing Magazine — Responsive Sports Icons (40 icons)
- **URL:** https://www.smashingmagazine.com/2015/06/freebie-responsive-sports-icon-set-40x4-icons-ai-csh-png-psd-sketch-svg/
- **License:** Free for personal and commercial use (per article terms).
- **Format:** AI, SVG, PNG, PSD, CSH, Sketch
- **What's there:** 40 sports icons in 4 styles (flat colored, glyph, Material, outline). Wrestling/combat sports included.
- **How to extend:** Four styles in one download lets you pick a visual direction. The AI source files make editing individual stroke paths feasible.

### "Make Your Own Pictogram" Construction System
There is no single open "pictogram construction kit" published as a tool. However, the underlying system is well-documented:
- **Bold round-capped strokes** (stroke width = ~10-15% of figure height)
- **Circular head** (~20% of figure height)
- **Straight limb segments** connected at joint circles
- **Rounded stroke caps and joins** (`stroke-linecap: round; stroke-linejoin: round`)
- **2-color max** (figure color + background)

You can implement this directly in SVG with `<line>`, `<circle>`, and `<path>` elements, styled with CSS. Feeding joint (x,y) coordinates programmatically renders an instant pictogram — this is the programmable path (see Section 3).

---

## 3. 2D Figure Puppet / Rig Systems (Programmatic Posing)

### Pose Animator (TensorFlow.js / Google)
- **URL:** https://github.com/yemount/pose-animator · https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html · Live demo: https://pose-animator-demo.firebaseapp.com/camera.html
- **License:** Apache 2.0 — full commercial use.
- **Format:** Web (JS), SVG input/output
- **What it does:** Takes a 2D SVG character illustration with a predefined bone rig (drawn as SVG annotations) and animates it in real-time from PoseNet/FaceMesh joint data. The bones are defined in the SVG itself; the JS runtime deforms the SVG paths based on joint coordinates.
- **How to extend for BJJ:** This is the closest thing to "supply joint coordinates → get clean vector figure." You would:
  1. Draw a single BJJ figure in Illustrator following the Pose Animator rigging conventions.
  2. Define joint coordinates for each of your ~20 positions (either hand-authored or from a BJJ pose dataset).
  3. Use the Pose Animator engine to render the figure at each pose.
  - **Key limitation:** Designed for real-time webcam animation, not static pose authoring. Two-figure ground positions require two separate rigs and compositing. The rigging workflow requires Illustrator skill.
  - **Reposability: high** — this is the most technically capable open-source option.

### Rive (rive.app) — Bone Rig System
- **URL:** https://rive.app/ · Bones docs: https://help.rive.app/editor/manipulating-shapes/bones
- **License:** Free tier for individuals; paid plans for teams. Runtime is open source (MIT). Exported animations run via the Rive runtime (open source, royalty-free).
- **Format:** Rive editor (proprietary); exports to `.riv` format; web/iOS/Android runtimes open source.
- **What it does:** Full bone-based 2D character rigging and animation in a browser-based editor. Bones bind to vector paths; you set poses, create state machines, and drive them from code.
- **How to extend for BJJ:** Draw a BJJ figure in Rive, rig it with bones (shoulder, elbow, wrist, hip, knee, ankle), create a pose per BJJ position as Rive "poses" or states. Export and drive from your web app via the `@rive-app/canvas` npm package. Two-figure positions require two rigs composed in the same Rive file.
  - **Key limitation:** Rive file format is proprietary; the editor is cloud-based. For 20 static positions this may be overkill; better if you want interactive/animated positions.
  - **Reposability: very high** — designed exactly for this kind of multi-pose system.

### SVGator
- **URL:** https://www.svgator.com/
- **License:** Free tier (limited exports); Pro ~$19/mo.
- **Format:** SVG animation (CSS/JS output)
- **What it does:** SVG animation tool with joint-rotation and skeletal-style animation. Good for animating individual figure movements between positions.
- **How to extend:** Draw your BJJ figure, set up rotation pivots at joints, animate between pose keyframes. More suited for animated transitions than static pose authoring.

### Custom SVG Joint Renderer (DIY — Recommended Technical Approach)
Since you already have joint-coordinate data (from your GrappleMap port or manual authoring), the simplest programmatic approach is:

```javascript
// Render a figure from joint coords as an SVG pictogram
function renderFigure(joints, color = '#1a1a1a', strokeWidth = 8) {
  const connections = [
    ['head', 'neck'], ['neck', 'leftShoulder'], ['neck', 'rightShoulder'],
    ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
    ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
    ['neck', 'hip'], ['hip', 'leftHip'], ['hip', 'rightHip'],
    ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
    ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle'],
  ];
  // Render: head circle + stroke lines with round caps
  // Use SVG stroke-linecap="round" stroke-linejoin="round"
}
```

This approach gives you:
- Full control of visual style
- No license dependencies
- Programmatic generation of all 20 positions from joint data
- Easy two-color system (fighter A = blue, fighter B = red)
- Matches the Olympic pictogram aesthetic natively

### MediaPipe / PoseNet → Stylized Figure
- **MediaPipe docs:** https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker
- **Sports2D (GitHub):** https://github.com/davidpagnon/Sports2D — open source 2D joint extraction from video
- **License:** MediaPipe: Apache 2.0. Sports2D: BSD-3-Clause.
- **What it does:** Extract 33 joint landmarks from real BJJ video footage → use those coordinates as the basis for your SVG figure renderer above. This is how you could build a data pipeline: real training video → joint coordinates → stylized BJJ position SVG.
- **How to extend:** Record or source BJJ position footage → run MediaPipe → capture landmark coordinates → feed into your SVG renderer → export clean vector figures for all 20 positions.

### Cartoon Animator (Reallusion) — G3/SVG Bone Rig
- **URL:** https://www.reallusion.com/cartoon-animator/
- **License:** Paid software (~$149); G3-SVG characters can be exported as rigs.
- **What it does:** Professional 2D character rigging. Mentioned in several tutorials for creating SVG bone rigs that can be exported.
- **For BJJ app:** Overkill for static positions; consider only if you want animated transitions.

---

## 4. Tutorials

### Designing Sport Pictograms in Illustrator
- **"Olympic Pictograms: Miniature Masterpieces" (YouTube)**
  - URL: https://www.youtube.com/watch?v=z2W0s2MP9_w
  - Covers the evolution of Olympic pictograms from Tokyo 1964 to 2021, with the creator attempting a new pictogram. Shows the design principles directly applicable to BJJ figure construction.

- **"How to Design Icons in Adobe Illustrator with Hannah Bacon" (YouTube)**
  - URL: https://www.youtube.com/watch?v=zDc9aKkLdCI
  - Practical icon set construction in Illustrator. Covers consistent stroke weights, rounded caps, and cohesive icon systems — directly applicable to building a BJJ position set.

- **"Adobe Illustrator: Making A Set Of Icons With Liz Mosley" (YouTube)**
  - URL: https://www.youtube.com/watch?v=ubx-Bhw7fy8
  - Step-by-step icon set design. Demonstrates building a consistent visual system.

### Skeleton / Joint Points → Clean Vector Figure
- **"Pose Animator — open source tool to bring SVG characters to life" (TensorFlow Blog)**
  - URL: https://blog.tensorflow.org/2020/05/pose-animator-open-source-tool-to-bring-svg-characters-to-life.html
  - Technical walkthrough of skeleton-based SVG animation from joint coordinates. Covers the rigging conventions you'd need to implement a joint-to-figure renderer.

- **"Figure Drawing — The Stick Figure and Movement" (YouTube)**
  - URL: https://www.youtube.com/watch?v=0ScwNZZd24Y
  - Teaches stick figures with geometric body shapes as an intermediate step toward clean vector figures. Good foundation for understanding body proportion in a 2-person ground-fighting context.

- **"Draw action poses from simple stick figures" (YouTube — Alphonso Dunn)**
  - URL: https://www.youtube.com/watch?v=pneEoXv4RBQ
  - Shows the conceptual bridge from stick-figure skeleton to fleshed-out action figure. Useful for understanding how to "inflate" your joint coordinate renderer into a more readable silhouette.

- **"Advanced Figure Drawing — People Fighting — Two Person Gesture" (YouTube)**
  - URL: https://www.youtube.com/watch?v=PF_OXmf4VFI
  - Specifically addresses action/reaction between two figures in combat — directly applicable to BJJ ground positions.

### Reusable 2-Color Human Figure Systems
- **Rive Workshop: Intro to Rigging (YouTube)**
  - URL: https://www.youtube.com/watch?v=ZXXg-g8g8eM
  - Official Rive workshop covering bone setup, skin binding, and pose creation. Shows exactly how to build a reusable rig that can drive multiple poses.

- **"My Character Design Process for Puppet, Bone Rig 2D Animation" (animationandvideo.com)**
  - URL: https://www.animationandvideo.com/2023/02/preparing-for-rigging-my-character.html
  - Detailed walkthrough of preparing a character for SVG bone rigging. Covers layer separation and joint pivot placement.

### Illustrating BJJ Techniques as Flat Vector Art
No dedicated published tutorial was found specifically for BJJ flat vector illustration. The closest verified resources:
- The Vecteezy grappling vector library (https://www.vecteezy.com/free-vector/grappling) can serve as a reverse-engineering reference — download free SVGs, open in Inkscape/Illustrator, and study how other illustrators constructed two-person ground positions.
- The Reddit thread https://www.reddit.com/r/bjj/comments/439li7/studying_bjj_taking_notes_drawing_techniques/ shows how BJJ practitioners approach diagramming techniques (rough sketches → technique notation) which informs the information design of your figures.

---

## 5. Paid-But-Cheap Options

### GraphicRiver — Jiu-Jitsu Vectors
- **URL:** https://graphicriver.net/graphics-with-jiu-jitsu-in-vectors
- **Price:** $2–$16 per item (one-time purchase)
- **What's there:** ~12 jiu-jitsu vector items including silhouette packs (two-person ground positions, submission holds).
- **License for app use:** GraphicRiver Regular License covers a single end product; Extended License (~5× the price) covers apps/products sold to end users. Verify per item — some are Regular License only.
- **Standout:** "Jiu-jitsu and judo wrestlers vector silhouettes" — directly useful.

### Creative Market — Brazilian Jiu-Jitsu Silhouette
- **URL:** https://creativemarket.com/TheSilhouetteQueenUS/6170060-Brazilian-jiu-jitsu-silhouette
- **Price:** ~$30 for Extended Commercial license (app use)
- **What's there:** BJJ silhouette vector(s) — appears to be single-figure gi-wearing positions.
- **License for app use:** Extended Commercial License explicitly covers apps and mobile products with up to 50,000 users. Beyond that, contact vendor.

### Etsy — Jiu-Jitsu SVG Bundles
- **URL:** https://www.etsy.com/listing/1087303921/jiu-jitsu-svg-png-eps-ai-files-bjj (BJJ Grappling Fighter Bundle)
- **Price:** ~$2.65–$8 per bundle (24-file packs common)
- **License for app use:** Most Etsy SVG sellers use a "commercial license for small business" — **carefully read the listing license before using in a web app distributed to users.** Many Etsy licenses specifically exclude digital products/apps. Ask the seller for an extended license if needed.

### Noun Project — Icon Pro Plan
- **URL:** https://thenounproject.com/pricing/
- **Price:** $3.33/month (billed $40/year)
- **What's there:** Unlimited downloads of 73 grappling icons, 37 BJJ icons, 1,033 martial arts icons — royalty-free commercial use, no attribution required.
- **Best value** for accessing a large icon library as style reference and UI icons.

### Envato Elements — Grappling / Fight Graphics
- **URL:** https://elements.envato.com/graphics/fight
- **Price:** ~$16–$19/month subscription (unlimited downloads)
- **License for app use:** Envato Elements licenses are per-project; each download registers to one project. Good for sourcing reference or hero art, not for programmatic generation.

---

## Recommended Path

**Build a joint-coordinate SVG renderer first, then reference-art your style from the Icons8/Smashing Magazine Olympic sport icon set.**

Here is the recommended approach:

1. **Download the free Icons8 Olympic Sports Icon Set** from Smashing Magazine (CC BY 3.0, free). Open the wrestling/judo SVGs in Illustrator. Reverse-engineer the construction grammar: stroke width, head-to-body ratio, limb segment lengths, joint circle radius. This gives you a battle-tested, instantly readable pictogram system.

2. **Implement a thin SVG renderer in your web app** (~100 lines of JS/TS) that accepts a `joints[]` array of `{name, x, y}` objects and outputs an SVG pictogram using that grammar. This is the programmable backbone — no license dependency, infinite poses, two-color fighter system, consistent visual language.

3. **Hand-author joint coordinates** for your ~20 BJJ positions using a simple browser tool (drag circles onto a canvas, export JSON). Alternatively, run MediaPipe on short reference video clips of each position to get starting coordinates, then fine-tune. Do not attempt to capture live BJJ rolls — use static hold positions filmed from a fixed orthographic-ish angle.

4. **Do not buy a pre-made BJJ vector pack** — they cover only 3–5 common positions, are not stylistically consistent with each other, and are locked into a static art style you cannot programmatically extend. The joint-renderer approach costs a day of engineering and gives you unlimited positions.

5. **Supplement with Open Peeps (CC0)** for any standalone figure elements (a standing instructor figure, a "person sitting" state icon) where a richer illustration style is useful. The component-based structure makes limb-level editing feasible in Figma without engineering time.

The total cost: **$0** (all open/CC0 references) + one engineering sprint. If you want polished animated transitions between positions, add Rive to the stack — the free tier is sufficient for individual use, and the runtime is open source / royalty-free for production.

---

_Research methodology: Firecrawl web searches across SVG Repo, Pixabay, Vecteezy, Openclipart, Smashing Magazine, The Noun Project, Creative Market, GraphicRiver, Envato, Humaaans, Open Peeps, Pose Animator (GitHub/TensorFlow blog), Rive, MediaPipe, and YouTube tutorials. All URLs verified as live as of 2026-05-24._
