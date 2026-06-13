# Graph & Map-Based Learning Platforms — Research for "O Mapa do Jiu-Jitsu"

Survey of the best products that teach via node-graphs, maps, skill trees, and interactive figures.
Goal: steal concrete, actionable UX patterns for `/mapa` — a Next.js app teaching BJJ as an explorable graph
(nodes = positions/techniques, each with a 2D figure, click-to-expand to study).

Each reference below captures: **what it teaches**, **how the graph/map is laid out**, **how a node's detail is shown
on click**, **how overwhelm is avoided at scale**, **onboarding**, and **mobile**. A ranked shortlist comes first;
a concrete "Patterns to adopt for /mapa" section closes the document.

---

## RANKED SHORTLIST (most → least relevant to /mapa)

### 1. GrappleMap (Eelis) — the closest existing thing to what we're building
- URL: https://github.com/Eelis/GrappleMap — live: https://eelis.net/GrappleMap/
- **What it teaches:** Grappling/BJJ as a literal directed graph. This is the single most on-point reference: it is
  jiu-jitsu modeled exactly as we intend.
- **Graph model:** Each **vertex is a concrete pose** of the two stick-figure players; each **edge is a transition**
  from one position to another. Positions are tagged (`side_control`, `kimura`, grip details), so the graph is
  hand-curated/community-contributed, not auto-laid-out.
- **Node figure:** Each position is a **2D stick-figure render** (two players), with joint coordinates stored so the
  system can **animate the transition between two poses** (keyframed, not motion-captured — "rudimentary" per the
  author). Crucially the figure is **viewpoint-rotatable** so you can read a position from multiple angles — a 2D
  render of a 3D pose model.
- **Navigation:** Multiple surfaces — a **Search page** (by name/tag), **Position pages** (one pose + its available
  transitions as links), an **Explorer** to visually traverse the connected graph, and a **Composer** to chain a
  sequence into a flow. Editing is text-based.
- **Overwhelm handling:** You never see the whole graph at once. You stand at one position and only see the edges out
  of it (local-graph navigation). Tags act as the filtering/index layer.
- **Steal:** the "you are HERE, here are your exits" local-node model; transition animation between two stored poses;
  tag-based entry points instead of a giant master map.
- **Watch out for:** the stick figures and editor are clunky/dated. We can win purely on figure quality + node detail UX.

### 2. Bartosz Ciechanowski (ciechanow.ski) — gold standard for "understand a thing visually"
- URLs: https://ciechanow.ski/ , https://ciechanow.ski/cameras-and-lenses/
- **What it teaches:** Hard physics/engineering (lenses, gears, GPS, light, sound) via self-contained interactive articles.
- **Figure UX:** Interactive figures are **woven inline into the narrative** — text sets up the concept, then the figure
  appears. Readers manipulate via **sliders** (one variable each), **drag-to-rotate 3D scenes**, and **dual-view layouts**
  (e.g. top-down + side view simultaneously; or "the scene" beside "the resulting photo"). Adjusting a control shows the
  consequence immediately — causality is visible.
- **Progressive complexity:** Starts trivially simple (a pinhole) and escalates only after each foundation is solid.
  Demonstrate the phenomenon first, explain the mechanism after.
- **Steal:** This IS our node-detail experience. For a BJJ position: an inline 2D figure you can rotate/scrub, a slider
  or step control to advance through the technique frames, and the "show it move, then explain why" ordering.
- **Mobile:** figures are touch-draggable; layout is single-column and reflows — proves rich interactive figures work on phones.

### 3. Lichess Opening Explorer + Study Trees — branching-tree navigation done right
- URLs: https://lichess.org/opening , repertoire-tree write-up: https://natesolon.github.io/blog/tree , https://www.openingtree.com/
- **What it teaches:** Chess openings as **branching move trees** — structurally identical to "from this position, here are
  the responses and where they lead."
- **Layout:** The board (the "node figure") sits beside a **list of candidate moves ranked by frequency/win-rate**. Each
  move is an edge; click it and the board updates and a new move list appears. Tree visualizers (OpeningTree, repertoire
  explorers) draw the same data as an expandable/collapsible **branch diagram** with color-coded lines (traps, mistakes,
  lines-needing-review).
- **Overwhelm handling:** You only ever see the **next layer** of branches, ranked by relevance, with statistics telling
  you which branches actually matter. Color = semantic meaning, not decoration.
- **Steal:** the **board-beside-move-list** layout for a node (figure + ranked list of "what comes next"); statistics/badges
  on edges to rank transitions by importance; color-coding lines (e.g. fundamental vs advanced vs trap).

### 4. Path of Exile passive skill tree — navigating a genuinely massive graph
- URLs: https://www.pathofexile.com/passive-skill-tree , https://maxroll.gg/poe/getting-started/passive-skill-tree-for-beginners
- **What it teaches:** Character builds via a ~1500-node graph — the canonical "how do you not drown a user in a huge graph" case study.
- **Overwhelm handling (the whole reason it's here):**
  - **Multi-level zoom:** macro overview (constellations/clusters) → mid (suburb) → micro (single node + its exact stats).
  - **Search highlights:** type any word and every matching node pulses/glows, visible even fully zoomed out.
  - **Spatial metaphor / clustering:** clusters of related nodes are "suburbs," connector paths are "roads." Mentally
    chunked geography, not soup.
  - **Color-coding by node type** (major/notable/minor) and **progressive disclosure** — detail only appears on zoom/hover.
- **Steal:** zoom-as-information-density control; search-to-glow on a large map; cluster the BJJ map into named
  regions (guard / passing / back / submissions) that read like neighborhoods.

### 5. Brilliant.org — interactive lessons + "learn by doing" inside a node
- URLs: https://brilliant.org/ , https://ustwo.com/work/brilliant/ , https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations
- **What it teaches:** Math/science/CS/logic via short single-concept interactive lessons.
- **Node detail model:** Each lesson = **one concept**, with explanation + **hands-on manipulable diagram** + instant
  feedback + animation. When you get something wrong, the explanation itself is interactive ("explore the solution,"
  not "read the answer").
- **Motivation:** heavy use of Rive animations, streaks, per-path color theming; an AI tutor (Koji) adapts pacing to gaps.
- **Steal:** "one node teaches exactly one thing"; make the figure itself the explanation; reward + light gamification
  to keep a long map engaging.

### 6. BioDigital Human / Complete Anatomy — multi-angle 3D figure exploration
- URLs: https://www.biodigital.com/ , https://human.biodigital.com/
- **What it teaches:** Human anatomy via an interactive 3D body of 8000+ selectable structures.
- **Figure UX (this is the multi-angle gold standard):** **rotate / pan / zoom** any structure; a **body-positioning mixer**
  to rotate/scale/move the model; three modes — **hide structures, peel away layers, toggle labels**. Left-hand filters
  isolate one organ or show a whole system. Click any structure → info panel.
- **Steal:** for a BJJ position, the equivalent of "rotate + isolate + label": let the user orbit the 2D/3D figure,
  toggle annotation labels (grips, hips, frames), and isolate one element (just the leg entanglement) to study it.
- **Mobile:** cloud-based, device-agnostic, native iOS/Android apps — proves heavy 3D-ish models can be made mobile-first.

### 7. Nicky Case explorables — the design-pattern playbook for not overwhelming people
- URLs: https://ncase.me/ , https://blog.ncase.me/explorable-explanations/ , https://blog.ncase.me/explorable-explanations-4-more-design-patterns/
- **What it teaches:** Systems thinking (Evolution of Trust, Parable of the Polygons) via playable models.
- **The patterns (directly applicable to map design):**
  - **Do & Show & Tell** — mix interaction + visual + text; don't force everything to be interactive.
  - **Interest Curves** — open with a hook that needs no prior knowledge; end with application.
  - **Start Small, Build Big** — teach each mechanic in isolation, then combine.
  - **See, Model, Apply** — let the learner generate data, find the pattern, then practice it embedded inline.
  - **Cognitive Gates** — withhold content to preserve prerequisite order and motivate forward movement.
  - **Procedural Rhetoric** — guide with explicit/implicit goals and clear available actions.
- **Steal:** the entire scaffolding philosophy for how a learner moves through the BJJ graph — hook → isolated technique →
  combine into a flow.

### 8. Andy Matuschak / Quantum Country / Orbit — make it stick (spaced repetition in-line)
- URLs: https://quantum.country/ , https://andymatuschak.org/prompts/ , https://github.com/andymatuschak/orbit
- **What it teaches:** Quantum computing — but the innovation is the **mnemonic medium**: review prompts (flashcards)
  **embedded directly in the text**, with expert-authored prompts so the reader doesn't have to write their own.
- **Steal:** after a learner studies a position node, surface 1–3 inline recall prompts ("from side control, what's the
  defender's first frame?"). Turns passive map-browsing into retained knowledge — a strong retention hook for BJJ.

### 9. Duolingo learning path — when a graph should become a guided line
- URLs: https://blog.duolingo.com/new-duolingo-home-screen-design/ , https://duoplanet.com/duolingo-learning-path/
- **What it teaches:** Languages. In 2022 Duolingo **replaced its branching skill tree with a single linear path**
  (sections → units → levels → lessons) because the tree caused choice-paralysis ("what do I do next?").
- **The lesson for us:** an explorable graph is great for *reference and exploration*, but **beginners need a guided
  spine**. Don't make a novice stare at the full graph and guess.
- **Steal:** offer a **curated "recommended path" overlay** (a highlighted route through the graph) alongside free
  exploration — best of both. This is the most important counter-pattern in the survey.

### 10. Mathigon / Polypad, Khan Academy Knowledge Map, Obsidian/Roam, Learney/Learn-Anything (supporting refs)
- Mathigon: https://mathigon.org/ — single-concept interactive courses, virtual tutor with hints; proves embedded
  simulations + a guiding tutor inside lessons.
- **Khan Academy Knowledge Map (cautionary tale):** https://khanacademy.fandom.com/wiki/Knowledge_Map — a beautiful
  "starry night" dependency map with color-coded star states (proficient / recommended / review). **They KILLED it**
  in favor of linear course mastery because most learners found the map confusing for "what next." Same lesson as
  Duolingo: maps are for exploration, not for telling beginners where to go.
- **Obsidian vs Roam graph view:** https://obsidian.md/help/plugins/graph — global graph becomes a "wall of
  undifferentiated grey confusion" at scale (esp. Roam). The fix that works: **local graph view** (show only the
  current node + its neighbors), node-size/density controls, and tag/filter toggles. Direct validation of the
  local-node navigation model.
- **Learney / Learn-Anything:** https://www.producthunt.com/products/learney-2 — community-built concept-dependency
  maps where you **expand a topic layer-by-layer** and each node aggregates the best external resources
  (books/courses/videos). Steal: layer-by-layer expansion + resource aggregation per node.

---

## PATTERNS TO ADOPT FOR /mapa (specific & actionable)

### A. Node detail UX (what happens when you click a position)
Model it on Lichess (board + next-moves) fused with Ciechanowski (inline manipulable figure) and BioDigital (multi-angle):
1. **Split panel on click** — figure on one side, info + "transitions out" on the other. Do NOT navigate away from the map;
   open a side panel / sheet so context is preserved (Obsidian local-graph principle).
2. **Figure = a rotatable, scrubbable 2D render of a 3D pose** (GrappleMap's model, executed better). Provide:
   - drag-to-orbit (multi-angle, à la BioDigital),
   - a **frame slider / step control** to scrub through the technique's keyframes (Ciechanowski sliders),
   - **toggleable annotation labels** (grips, frames, hip line, pressure arrows) that can be hidden/shown,
   - an **isolate mode** to focus one limb/entanglement.
3. **Show the phenomenon, then explain** — auto-play or one-tap-play the transition animation first; text/cues after.
4. **"Transitions out" as a ranked list of edges** (Lichess move-list): each edge links to the next position node, with a
   badge/color for fundamental vs advanced vs trap, optionally a success-rate or frequency stat.
5. **Embed 1–3 recall prompts** at the bottom of the node (Quantum Country mnemonic medium) for retention.

### B. Density / zoom strategy (don't drown the user)
- **Three zoom levels** (PoE): macro = named regions (Guard, Passing, Back Control, Submissions, Takedowns) as
  labeled clusters; mid = positions within a region; micro = a single node + its immediate edges.
- **Local-graph-first navigation** (Obsidian/GrappleMap): default view shows the current node and its direct neighbors,
  not the whole graph. The full map is an opt-in "world view."
- **Search-to-glow** (PoE): a search box that highlights/pulses matching nodes at any zoom level.
- **Color + iconography as semantics** (Lichess/PoE): color encodes region and node type (position vs submission vs
  transition); never decorative-only.
- **Cluster like geography** (PoE "suburbs and roads"): hand-curate regions so the map reads like a familiar territory.

### C. Multi-angle figure presentation
- Treat each position as a **stored 3D pose, rendered to 2D**, so a single asset yields drag-to-rotate, preset angles
  (front/side/top), and keyframe interpolation for transitions (GrappleMap's data model + BioDigital's controls).
- Provide **preset camera buttons** (front / side / top / "defender POV") in addition to free orbit, so novices aren't
  lost (BioDigital body-positioning mixer).
- Keep figures **single-column and touch-first** so they reflow on mobile (Ciechanowski proves rich figures work on phones).

### D. Navigation, onboarding & avoiding the Khan/Duolingo trap
- **Curated path overlay** (the #1 takeaway): ship recommended routes through the graph ("White Belt Fundamentals,"
  "Closed Guard System") as highlighted lines, layered on top of free exploration. Beginners follow the line; explorers
  roam. This directly answers why Khan Academy and Duolingo abandoned pure graph navigation.
- **Hook-first onboarding** (Nicky Case Interest Curve): drop a new user into ONE compelling position node with a playable
  figure, not the full map. Reveal the broader map only after the first "aha."
- **Start small, build big** (Case): teach a position in isolation, then show how it chains into a flow (GrappleMap Composer).
- **Layer-by-layer expansion** (Learn-Anything): let users expand a region progressively rather than loading the whole tree.
- **Breadcrumb of the path taken** so a user can see the sequence of positions they've traversed (mini Lichess line / flow).
- **Light gamification & per-region theming** (Brilliant) to sustain motivation across a large map.

---

## TOP 3 REFERENCES + THE ONE PATTERN TO COPY

**Top 3 references:**
1. **GrappleMap** (https://github.com/Eelis/GrappleMap) — BJJ already modeled as a position/transition graph with
   rotatable 2D figures; our exact problem, beatable on execution.
2. **Lichess Opening Explorer / study trees** (https://lichess.org/opening) — the proven UX for branching "from here,
   what's next" navigation: figure beside a ranked list of edges.
3. **Bartosz Ciechanowski** (https://ciechanow.ski/) — the gold standard for the node-detail figure: inline, manipulable,
   multi-view, "show then tell."

**The single most important pattern to copy:** the **figure-beside-ranked-transitions node panel** — clicking a position
opens a side panel (never leaving the map) with a rotatable/scrubbable 2D figure on one side and a ranked, color-coded
list of "transitions out" on the other (Lichess board+move-list, fused with Ciechanowski's manipulable inline figure).
Paired non-negotiably with a **curated "recommended path" overlay** so beginners aren't dropped into a raw graph — the
hard-won lesson behind Khan Academy and Duolingo abandoning pure map navigation.
