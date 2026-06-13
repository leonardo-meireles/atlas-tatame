# In-Canvas Node Expansion — UX Research for /mapa BJJ Graph

Research for the redesign of `/mapa`: moving from a disconnected right-side detail panel to
**in-canvas node expansion** — clicking a position node makes it grow in place into a large
card (figure + numbered callouts + key points + "from here you can go"), while neighbors
recede/dim. Five areas investigated; TOP 8 patterns + anti-patterns at the end.

> **Read first:** [graph-learning-platforms.md](./graph-learning-platforms.md) covers GrappleMap,
> Ciechanowski, Lichess, PoE, BioDigital, Nicky Case, Duolingo, Khan Academy. This doc goes
> BROADER and DEEPER on the five specific implementation areas below.

---

## 1. In-Canvas Node Expansion / Focus+Context / Detail-on-Node

### The core decision: grow-in-place vs overlay vs zoom-to-node

| Approach | Mechanic | Spatial context preserved? | Examples |
|---|---|---|---|
| **Grow in-place** | Node's DOM/SVG element scales up; neighbors reflow | Yes — user stays in canvas | tldraw custom shapes, React Flow `NodeResizer` + `layout` animation |
| **Lightbox overlay** | Detail card floats above frozen canvas | Partially — canvas visible but static | Miro card detail, Kumu drawer |
| **Zoom-to-node** | Camera zooms in until node fills viewport | No — context disappears | Most naive graph impls |
| **Picture-in-picture** | Canvas shrinks into a corner; detail takes main area | Partial | Some BI dashboards |

**Verdict for BJJ map:** grow-in-place wins. The user stays spatially anchored ("I'm here, in half guard").

---

### 1a. React Flow — official expand/collapse + dynamic layouting

- **URL:** https://reactflow.dev/examples/layout/expand-collapse
  and https://reactflow.dev/examples/layout/dynamic-layouting
- **Mechanic:** `expand-collapse` example uses a `useExpandCollapse` hook that toggles the
  `hidden` property on child nodes while keeping the full graph structure in memory. The
  `dynamic-layouting` example reruns dagre on every state change, animating nodes to new
  positions with CSS transitions on `transform`.
- **What's missing from these examples:** they expand *child nodes*, not the *clicked node itself*.
  For our use case (node grows to a large card), combine:
  1. `style.width` / `style.height` on the node object → React Flow propagates this as inline style
  2. `fitView` / `setCenter` on the focused node after expansion
  3. Framer Motion `layout` prop on the custom node component for smooth FLIP animation
- **Steal:** `useExpandCollapse` hook pattern for toggling hidden neighbors; dagre re-layout
  on state change with animated transitions.

### 1b. Kumu.io — focus mode with degree control

- **URL:** https://docs.kumu.io/guides/focus
- **Mechanic:** Click + hold on any element activates focus — everything else hides. `+` / `-`
  keys or buttons walk degrees outward (1-hop → 2-hop visible). A focus control widget can
  be placed on the canvas for storytelling/guided tours. Detail opens in a **left-side drawer**
  (not in-canvas).
- **Key insight:** Degree-of-separation as a user-controlled slider is more intuitive than a
  binary show/hide. Users understand "show me 1 step away" immediately.
- **Steal:** degree-of-separation slider (or `+`/`-` buttons) to expand what neighbors are
  visible while a node is focused. For BJJ: "show positions 1 transition away."

### 1c. Obsidian Advanced Canvas — Focus Mode + edge highlighting

- **URL:** https://community.obsidian.md/plugins/advanced-canvas and forum thread
  https://forum.obsidian.md/t/focus-on-a-single-node-and-its-immediate-neighborhood-in-canvas/92131
- **Mechanic:** Advanced Canvas plugin adds a Focus Mode that **blurs non-connected nodes**
  while keeping connected ones sharp. With Edge Highlight on, edges connected to the focused
  node are NOT blurred — they pull the eye toward neighbors. The local graph view (separate
  from canvas) has a depth slider.
- **Key insight:** Blur (rather than full hide or opacity) lets the user see the global topology
  while clearly emphasizing the local neighborhood. Better than opacity-only.
- **Steal:** CSS `filter: blur(2px) opacity(0.35)` on non-neighbor nodes (not just `opacity`
  alone). Keep edges from focused node at full opacity — they're the navigation affordance.

### 1d. Neo4j Bloom — expand + scene isolation

- **URL:** https://neo4j.com/docs/bloom-user-guide/current/bloom-tutorial/
- **Mechanic:** Right-click a node → "Expand" fetches connected nodes and adds them to the
  scene. Double-click → opens a right-side detail panel. Users can also "Dismiss" non-selected
  nodes to isolate a subgraph. Scene = persistent canvas; panel = detail without leaving graph.
- **Key insight:** "Dismiss" (hide the rest of the graph, keep selected subgraph) is a powerful
  focus primitive for complex graphs. Reversible with Undo.
- **Steal:** A "focus on this area" affordance that temporarily hides everything outside the
  current position + its neighbors, with a clear "show full map" restore button.

### 1e. KeyLines (Cambridge Intelligence) — layout.expand() with minimal disruption

- **URL:** https://cambridge-intelligence.com/keylines-6-0-build-the-best-user-experience/
- **Mechanic:** `layout.expand()` API: when a single component expands, only the nodes that
  **need to move** animate. The rest stay in place. Animation and viewport fitting are
  "subtler and smoother" specifically to avoid disorientation. `detail on demand` at each
  zoom level (LOD).
- **Key insight:** Most graph libs naively re-run the full layout on expand, causing everything
  to jump. Minimal-disruption expand (move only what must move) is a first-class UX goal.
- **Steal:** When expanding a node in-place, **reflow only immediate neighbors** (push them
  outward) — don't re-run dagre globally. Keep distant nodes static.

### 1f. Logseq graph view — hover highlights + selection centering

- **URL:** https://discuss.logseq.com/t/graph-view-node-selection-and-centering/7423
- **Mechanic:** Hovering a node highlights its direct connections. Clicking centers the camera
  on that node. The page graph (local view) shows depth-adjustable neighbors. Users noted
  it "moves things around but doesn't really pull them into view" — a known pain point.
- **Key insight:** Hover-highlight is a free affordance that teaches graph structure before
  the user clicks. But without a smooth "pull neighbors toward me" animation, focus feels
  disconnected.
- **Steal:** On hover (not just click): highlight edges of the hovered node. On click: animate
  neighbors inward slightly (reduce edge length to focused node) to create a visual "gathering."

---

## 2. Figure↔Text Reinforcement: Numbered Callouts

### The canonical pattern: keyed callouts

Standard technical documentation (aerospace, medical, IKEA) uses **language-independent key
numbers superimposed on the figure**, with a separate legend/list outside the image explaining
each number. The link between marker and text is bidirectional: hover the number → highlight
the text; hover the text item → highlight the number on the figure.

### 2a. Technical documentation standard (oXygen DITA styleguide)

- **URL:** https://www.oxygenxml.com/dita/styleguide/Graphics_and_Figures/c_Callouts.html
- **Pattern:** Numbered callouts inside the image (① ② ③ overlaid as SVG circles) +
  an ordered list below with matching numbers. Numbers are language-neutral — the same
  figure works in any translation.
- **Steal:** Use SVG `<circle>` + `<text>` elements for callout markers so they scale with
  the figure. Map each marker to a list item via `data-callout="1"` attributes for JS hover binding.

### 2b. Google Tech Writing guidelines — annotate images

- **URL:** https://developers.google.com/tech-writing/two/illustrations
- **Pattern:** "Use numbered callouts to call out multiple areas in your image, then use a
  corresponding numbered list to explain each one." Limit to the minimum necessary labels —
  too many callouts create their own cognitive load.
- **Steal:** Max 5–6 callout points per BJJ figure. Prioritize: grips (①②), body framing (③),
  hip/weight (④), danger zone (⑤). Everything else is commentary.

### 2c. Quanos (technical documentation SaaS) — callout labeling guide

- **URL:** https://quanos.com/en/blog/technical-documentation/detail/1-2-callout-graphic-labeling-made-easy/
- **Pattern:** Two styles: (a) direct labels with leader lines, (b) keyed numbers with external
  legend. Key numbers win for dense figures because leader lines tangle. The external list
  allows longer explanations without cluttering the figure.
- **Steal:** For our BJJ figures (two bodies, multiple contact points), use keyed numbers +
  external list — leader lines would cross constantly.

### 2d. PatternFly design system — annotated interactive view

- **URL:** https://www.patternfly.org/ux-writing/writing-patternfly-design-guidelines/
- **Pattern:** Interactive annotated views where users hover over an annotation number on the
  figure and a popup window appears with a concise summary. The figure remains visible — no
  navigation away.
- **Steal:** Hover a callout circle on the BJJ figure → the corresponding list item gets a
  highlight ring + brief tooltip; hover the list item → the callout circle pulses on the figure.
  Bidirectional = strong figure↔text coupling.

### 2e. Bartosz Ciechanowski (already in prior doc — adding new detail)

- **URL:** https://ciechanow.ski/cameras-and-lenses/
- **New detail:** Ciechanowski uses **inline colored highlights** (not numbers) — a word in
  the prose is the same color as the element in the figure it refers to. Click the word →
  the corresponding element animates. This is "color-as-link" rather than "number-as-link."
- **Steal for prose sections:** color-match key terms in the "key points" list to their
  visual element in the figure (e.g., the word "hip escape" is orange → the hip-escape
  arrow in the figure is orange).

### 2f. iMaios e-Anatomy (radiology atlas)

- **URL:** https://www.imaios.com/en/e-anatomy
- **Pattern:** Medical imaging atlas with labeled anatomical structures. Click a structure in
  the image → its label entry in the right-hand list highlights. Click a label in the list →
  the structure pulses on the image. Supports "hide all labels / show one at a time" for
  study mode.
- **Steal:** "Study mode" for BJJ nodes: hide all callout labels, then tap each one to reveal
  it — forces the learner to identify the element first, then confirm. A lightweight form of
  active recall directly in the figure.

---

## 3. Skill/Technique Learning Maps That Didn't Overwhelm Beginners

### 3a. Duolingo 2022 path redesign — the anti-graph lesson

- **URL:** https://blog.duolingo.com/new-duolingo-home-screen-design/
- **Why it matters:** Duolingo **replaced its branching skill tree with a single linear path**
  because the tree caused choice-paralysis. Users didn't know what to do next; completion
  rates dropped.
- **Lesson:** A graph is a reference tool for experts, not a navigation surface for beginners.
  Wrap the graph with a **guided recommended path** overlaid as a highlighted trail.
- **Steal:** Ship a "White Belt Trail" overlay (a colored line connecting the 8 most fundamental
  position nodes in sequence) as the default view for new users. Graph exploration is unlocked
  after completing the trail.

### 3b. Path of Exile passive skill tree — 1500 nodes, nobody quits

- **URL:** https://www.pathofexile.com/passive-skill-tree
- **Anti-overwhelm mechanics (concrete):**
  1. **Cluster geography** — nodes group into named "suburbs" (Duelist, Ranger, Witch areas).
     Users build a mental map ("I'm in the Duelist corner").
  2. **Three visual tiers** — minor nodes (small dot, single stat), notable nodes (larger,
     named), keystone nodes (large, game-changing). Visual weight = importance.
  3. **Path highlighting** — hover a distant node → the shortest path from your current node
     to that node glows, previewing the cost.
  4. **Search glow** — type a keyword, all matching nodes pulse, visible at full zoom-out.
- **Steal:** Three node tiers for BJJ (fundamental positions = large, secondary = medium,
  advanced/submissions = small but distinctly colored). Path-to-node preview on hover.

### 3c. Chessable MoveTrainer — figure + SRS embedded in exploration

- **URL:** https://www.chessable.com/movetrainer/
- **Pattern:** The board IS the figure. Each "node" (position) shows the board state. From
  there, a list of candidate moves (edges) is ranked by frequency. Spaced repetition is
  triggered after you explore a line — the next session you're quizzed on that exact position.
- **Key mechanic:** Exploration and memorization are the same surface. No separate "study mode."
- **Steal:** After a user opens a BJJ position node, mark it as "seen." After 3 seen nodes,
  surface a 30-second recall quiz inline (show the figure, hide the technique name + key
  points, ask the user to recall them). SRS without leaving the map.

### 3d. Lichess opening explorer — depth-first with statistics

- **Already in prior doc, new angle:** The move list shows **game count + win rate** per move.
  This means edges aren't equal — the most traveled path is visually dominant. Beginners
  naturally follow the dominant path; experts seek the rare lines.
- **Steal:** On BJJ edges (transitions), show a frequency or "fundamental/advanced" badge.
  The most important transitions are visually heavier (thicker edge, stronger color).

### 3e. Brilliant.org course map — one concept per node, zero detours

- **URL:** https://brilliant.org/
- **Pattern:** Each node in the course map teaches exactly one thing. The node detail has:
  interactive diagram → guided explanation → quiz. You cannot skip steps within a node.
  The map shows which nodes are locked (prerequisite not met) vs unlocked.
- **Steal:** Lock advanced position nodes behind "you must have seen the prerequisite position."
  Show a faded/locked state on those nodes with a tooltip "learn X first." Cognitive gate =
  motivation to progress linearly before exploring freely.

### 3f. Khan Academy Knowledge Map — cautionary tale (already in prior doc, concrete why)

- The map had 600+ "star" nodes color-coded by mastery state. Users couldn't parse it.
  **Root cause:** no visual hierarchy of importance, no recommended path, no spatial chunking.
  Every node looked equally important. Khan killed it in 2021.
- **Anti-pattern:** A flat, uniformly-sized, uniformly-colored node graph with no indication
  of what matters most or where to start.

---

## 4. Focus+Context Visualization Theory — Practical Takeaways Only

### Furnas DOI (Degree of Interest) — the original focus+context framework

- **Paper:** Furnas, 1986. DOI = (a priori importance of node) − (distance from focus node).
  Nodes with high DOI get more visual real estate; low DOI nodes shrink or hide.
- **Practical takeaway:** You don't need a fisheye lens. A simpler DOI approximation:
  - Focus node: full size, full opacity, expanded card
  - 1-hop neighbors: 80% size, 100% opacity
  - 2-hop neighbors: 60% size, 50% opacity, labels hidden
  - Everything else: 40% size, 20% opacity, no labels

### Semantic zoom vs geometric zoom

- **Geometric zoom:** same info, bigger pixels. Useless for dense graphs — just shows you
  bigger blobs.
- **Semantic zoom:** different information renders at different zoom levels. At far zoom:
  cluster labels only. At mid zoom: node names. At close zoom: full detail card.
- **Practical takeaway:** Implement LOD (level-of-detail) for node rendering:
  - Zoom < 0.5: show region labels + colored cluster areas only
  - Zoom 0.5–1.0: show node names + icons
  - Zoom > 1.0: show figure thumbnail in the node
  - Expanded (click): full card with figure, callouts, transitions list

### Overview + detail — two-panel vs single-canvas

- Classic pattern: overview in a minimap (top-right), detail in main panel.
- For our case: the minimap is the full graph (React Flow's built-in `<MiniMap>`), and the
  main canvas IS the detail when a node is expanded.
- **Practical takeaway:** Keep React Flow's MiniMap visible during node expansion. It becomes
  the "overview" while the expanded node fills the detail role. Users can see "I'm in the
  guard cluster" from the minimap even when the expanded card fills most of the viewport.

### Fisheye distortion — when to use and NOT use

- Geometric fisheye (nodes physically larger at focus, smaller at periphery) works for
  text-heavy graphs (hyperbolic tree, Tamara Munzner's work). For a diagram-heavy graph
  (figures in nodes), distortion makes figures unreadable.
- **Practical takeaway:** Do NOT use geometric fisheye for BJJ map. Use **opacity + scale
  reduction** on peripheral nodes (simulated DOI) without geometric distortion. The figures
  must remain readable at any size they appear.

### Stagger = perceived responsiveness

- A study (Afram et al., 2007) found that semantic fisheye zooming with smooth animated
  transitions improved recall vs static zoom, with no time penalty.
- **Practical takeaway:** Animate the DOI-state changes (300ms fade + scale). Static
  snap-to-state feels broken; smooth transition feels intentional.

---

## 5. Motion / Transition Best Practices for In-Place Node Expansion

### 5a. FLIP animation (First, Last, Invert, Play) — the correct mental model

- **URL:** https://motion.dev/docs/react-layout-animations
- **Mechanic:** Record the node's position BEFORE expansion (First), expand it (Last),
  calculate the delta (Invert), then animate from the inverted position to the final one (Play).
  Framer Motion / Motion library does this automatically with the `layout` prop.
- **In React Flow:** Add `motion.div` with `layout` prop inside the custom node component.
  When the node's width/height changes (expansion), Motion animates the size change
  automatically. Combine with `layoutId` for shared-element transitions if using a separate
  overlay layer.
- **Steal:** `<motion.div layout layoutId="node-{id}">` on the custom node wrapper.
  When expanded state changes, Motion handles the FLIP automatically.

### 5b. Stagger for neighbors — the "universe organizes itself" feel

- **URL:** https://www.framer.com/motion/stagger/ and Josh Collinsworth's CSS transitions guide
- **Pattern:** When neighbors dim/recede, stagger their fade by 20–40ms offset per node.
  Start from the focused node outward (nearest neighbors fade first, creating a ripple).
- **Code pattern:**
  ```ts
  // stagger children from inside out
  const staggerDelay = (distanceFromFocus: number) => distanceFromFocus * 0.04; // 40ms per hop
  ```
- **Steal:** Sort neighbor nodes by hop distance from the focused node. Apply increasing
  `transition-delay` (or Motion `stagger()`) — 0ms for 1-hop, 40ms for 2-hop, 80ms for 3-hop.

### 5c. Easing — spring for expansion, ease-out for recession

- **References:** motion.dev docs, joshwcomeau.com/animation/css-transitions/
- **Rules:**
  - **Expanding node:** spring physics (`stiffness: 300, damping: 30`). Spring feels "alive,"
    like something opening. Do NOT use `ease-in` (starts slow, feels sluggish).
  - **Receding neighbors:** `ease-out` (fast start, slow end). Things "settle" out of the way.
    Duration 250–350ms.
  - **Opacity fade for non-neighbors:** `ease-in-out`, 200ms. Fastest of the three — opacity
    should resolve before the expansion completes.
- **GPU only:** Animate only `transform` (scale, translate) and `opacity`. NEVER animate
  `width`, `height`, `left`, `top` directly — use `transform: scale()` + FLIP to avoid
  layout thrash.

### 5d. Shared element transition — node thumbnail → expanded card

- **URL:** https://www.smashingmagazine.com/2022/10/ui-animations-shared-element-transitions-api-part1/
  and https://motion.dev/examples/react-shared-layout-animation
- **Pattern:** The node's thumbnail figure IS the same element as the expanded card's header
  figure — connected by `layoutId`. When expanding, the figure morphs from its small in-node
  size to the large expanded size without a jump or cross-fade. The text content fades in
  after the figure settles.
- **Practical steps:**
  1. Wrap the figure `<img>` in `<motion.img layoutId="figure-{nodeId}">` in both the
     compact node and the expanded card.
  2. Use `AnimatePresence` to manage the expanded card mounting/unmounting.
  3. Fade in the callouts and transitions list AFTER the figure animation (200ms delay).
- **Steal:** The figure grows from the node — not a separate element appearing. This is the
  most spatially-coherent animation for maintaining "you clicked THAT node."

### 5e. What NOT to do — anti-patterns for transitions

- **Instant layout snap:** Everything teleporting to new positions = disorienting.
- **Full re-layout on expand:** Running dagre on every expand causes ALL nodes to move,
  even distant ones. Users lose their mental map.
- **Simultaneous animations:** Expansion + neighbor recession + opacity fade all at once
  at the same duration = visual noise. Sequence them: opacity (fastest) → expansion → reflow.
- **Bounce overshoot on receding nodes:** Only the expanding node should spring. Receding
  neighbors should settle with `ease-out`, never bounce.
- **More than 400ms total:** User perception of "slow" starts at ~400ms for triggered
  interactions. Expansion should complete in 300–350ms; opacity fade in 200ms.

---

## TOP 8 Actionable Patterns for the BJJ In-Canvas Expansion

These are prioritized: implement in order if resources are limited.

### P1. Grow-in-place with FLIP + Motion `layout` prop ★★★★★

When a position node is clicked, it expands in the canvas (not a side panel, not a modal).
Use `<motion.div layout>` on the custom React Flow node. Change `node.style.width` and
`node.style.height` in state; Motion handles the smooth FLIP. Reflow only the immediate
neighbors (push them outward); keep distant nodes static. This is the core mechanic.

**Implementation:** React Flow custom node + Framer/Motion `layout` + local reflow only.

### P2. DOI-based neighbor dimming: opacity cascade by hop distance ★★★★★

Non-selected, non-neighbor nodes: `opacity: 0.2, filter: blur(1px), pointer-events: none`.
1-hop neighbors: `opacity: 1.0` (full, they're the navigation exits).
2-hop: `opacity: 0.5`.
3+ hop: `opacity: 0.15`.
Edges FROM focused node: full opacity + slightly thicker stroke.
Animate with staggered `ease-out` starting from nearest.

**Why:** Preserves spatial context (users see the full map) while clearly spotlighting what matters.

### P3. Shared-element figure transition: thumbnail → full-size ★★★★★

The BJJ figure inside the compact node IS the same DOM element as the figure in the expanded
card, connected by `layoutId="figure-{nodeId}"`. Clicking the node: figure grows from node
position to card size. Text (callouts, key points, transitions) fades in AFTER figure settles
(200ms delay). Use `AnimatePresence` for card mount/unmount.

**Why:** Strongest spatial coherence — the user clearly sees "that small figure became this big one."

### P4. Numbered callout markers bidirectionally linked to key points list ★★★★☆

Overlay SVG `<circle>` callout markers (①②③④⑤) on the figure at specific [x,y] positions
stored in data. Below the figure, a `<ol>` list with matching numbers. On hover of either:
- Hover callout ① → list item 1 gets `.highlighted` + a brief tooltip
- Hover list item 1 → callout ① pulses (scale 1.2 → 1.0, 150ms spring)

Optional "study mode": hide all callout labels, tap to reveal one at a time.

**Why:** Closes the figure↔text gap that the prior side panel broke entirely.

### P5. "From here you can go" transitions list with visual weight ★★★★☆

Below the key points, a list of edge transitions (techniques from this position).
Each transition entry shows: edge label + target node name + a badge (Fundamental / Advanced / Trap).
Clicking a transition: the expanded card collapses, camera pans to the target node, then expands it.
Fundamental transitions: thicker badge, bolder text — visually heavier. Advanced: lighter. Trap: colored.

**Why:** The Lichess board+move-list pattern — proven for "from this state, what next?"

### P6. MiniMap as overview during expansion ★★★★☆

Keep React Flow's `<MiniMap>` visible (top-right, semi-transparent) at all times.
When a node is expanded and neighbors dim, the MiniMap continues to show the full graph
with the focused node highlighted. Users can see "I'm in the guard cluster" even when the
expanded card dominates the viewport.

**Why:** Maintains the overview+detail separation without a second panel. Free with React Flow.

### P7. Staggered recession animation: nearest neighbors first ★★★☆☆

When a node expands, compute hop distance for every visible node. Apply increasing
`transition-delay` in 40ms increments by hop distance. The dimming ripples outward from
the focus, creating a "universe organizes itself" effect. On collapse: reverse — nearest
nodes return to full opacity first.

**Why:** Staggered transitions feel intentional and smooth; simultaneous transitions feel glitchy.

### P8. Guided "White Belt Trail" overlay (expert/novice mode toggle) ★★★☆☆

A separate data layer: an ordered list of 8–10 fundamental position nodes forming the
recommended beginner path. Rendered as a highlighted colored line connecting those nodes,
with step numbers. Default-on for users with < 10 nodes visited. Toggle button to hide/show.

**Why:** Prevents the Khan Academy / Duolingo failure mode — beginners paralyzed by a raw graph.

---

## Anti-Patterns to Avoid

| Anti-pattern | Why it hurts | Fix |
|---|---|---|
| **Full dagre re-layout on every expand** | All nodes jump, user loses mental map | Reflow only immediate neighbors; keep distant nodes static |
| **Side panel that covers the graph** | User can't see their spatial position | Grow in-place or minimap-as-overview |
| **Zoom-to-node (camera fills viewport with the node)** | Context disappears; graph looks like a list | Stay at current zoom level; use opacity cascade for context |
| **Flat, uniform node appearance** | Every node looks equally important; overwhelming | Three visual tiers (fundamental / secondary / advanced) by size + color weight |
| **Leader lines on dense figures** | Lines cross, creating visual noise | Keyed numbers (①②③) + external list instead |
| **Animate width/height directly** | Triggers layout thrash, janky on mobile | Animate only `transform: scale()` via FLIP |
| **All animations at same duration** | Visual noise; nothing reads as "the important event" | Sequence: opacity (200ms) → expansion spring (300ms) → reflow (350ms ease-out) |
| **No recommended path for beginners** | Choice paralysis, users quit before they start | White Belt Trail overlay, default-on for new users |
| **Too many callout markers (>6)** | Defeats the purpose of callouts | Max 5 callout points per figure; prioritize grips, frame, weight, danger |
| **Geometric fisheye distortion** | Distorts the figure making it unreadable | DOI via opacity + scale, no geometric lens |

---

## Key URLs Referenced

- React Flow expand/collapse: https://reactflow.dev/examples/layout/expand-collapse
- React Flow dynamic layouting: https://reactflow.dev/examples/layout/dynamic-layouting
- Kumu focus mode: https://docs.kumu.io/guides/focus
- Obsidian Advanced Canvas: https://community.obsidian.md/plugins/advanced-canvas
- Neo4j Bloom tutorial: https://neo4j.com/docs/bloom-user-guide/current/bloom-tutorial/
- KeyLines UX: https://cambridge-intelligence.com/keylines-6-0-build-the-best-user-experience/
- Cambridge Intelligence graph viz UX: https://cambridge-intelligence.com/graph-visualization-ux-how-to-avoid-wrecking-your-graph-visualization/
- Motion layout animations: https://motion.dev/docs/react-layout-animations
- Motion stagger: https://www.framer.com/motion/stagger/
- Shared layout animation example: https://motion.dev/examples/react-shared-layout-animation
- Smashing Magazine shared element transitions: https://www.smashingmagazine.com/2022/10/ui-animations-shared-element-transitions-api-part1/
- Josh Collinsworth CSS transitions: https://joshcollinsworth.com/blog/great-transitions
- oXygen DITA callouts guide: https://www.oxygenxml.com/dita/styleguide/Graphics_and_Figures/c_Callouts.html
- Google Tech Writing illustrations: https://developers.google.com/tech-writing/two/illustrations
- Quanos callout labeling: https://quanos.com/en/blog/technical-documentation/detail/1-2-callout-graphic-labeling-made-easy/
- iMaios e-Anatomy: https://www.imaios.com/en/e-anatomy
- Duolingo path redesign: https://blog.duolingo.com/new-duolingo-home-screen-design/
- Chessable MoveTrainer: https://www.chessable.com/movetrainer/
- Logseq graph feature requests: https://discuss.logseq.com/t/graph-view-node-selection-and-centering/7423
- Furnas DOI paper (Semantic Scholar): https://www.semanticscholar.org/paper/A-fisheye-follow-up%3A-further-reflections-on-focus-%2B-Furnas/7dc82d7de25136e2903a57c9cd986d506b0638e2
- Afram et al. semantic fisheye study: https://journals.sagepub.com/doi/abs/10.1177/154193120705100507
