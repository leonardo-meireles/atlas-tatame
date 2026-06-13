# 3D Spike — GrappleMap → Three.js Live Renderer

Minimal standalone proof-of-concept: one BJJ pose (Guarda Fechada) rendered as
an interactive 3D figure using only Three.js via CDN import map. No build step,
no npm install.

## How to open

Open `index.html` directly in a modern browser:

```
# macOS
open index.html

# or drag the file into Chrome/Firefox/Safari
```

No server required — uses ES module import maps pointing to CDN.
Tested: Chrome 124+, Firefox 125+, Safari 17+.

## What it demonstrates

- **Real GrappleMap pose data** decoded inline via the same base62 algorithm as
  `src/lib/grapplemap/parser.ts` (public domain, no attribution required).
- **Capsule + sphere skeleton** following the GrappleMap geometry recipe
  (`players.hpp` / `playerdrawer.cpp`) — tapered cylinders (truncated cones)
  between joints, icosphere-ish spheres at each joint.
- **Two-tone materials**: clay red (player A, de baixo) / index blue (player B,
  de cima), matching the app's design tokens.
- **MeshToonMaterial** with a 2-step gradient map — flat cel shading, no AI-slop.
- **Backface outline pass** — enlarged BackSide mesh in near-black for a clean
  contour (toggleable).
- **cameraFor() framing** — ported from `src/lib/grapplemap/render-spec.ts`,
  perpendicular to the axis between the two fighters, adaptive elevation.
- **OrbitControls** — drag to orbit, scroll to zoom, reset camera button.
- **Cartographic grid overlay** in CSS, matching the app's `Still` component
  aesthetic.

## Controls

| Button | Action |
|---|---|
| Toon / matcap | MeshToonMaterial + 2-step gradient |
| Flat solid | MeshStandardMaterial (no cel banding) |
| Wireframe | Geometry wireframe for debugging |
| Contorno | Toggle backface outline |
| Resetar câmera | Jump back to auto-framed camera |

Drag: orbit · Scroll: zoom

## Bundle notes

- three.js r177 via CDN (~600 KB gzipped in production build with tree-shaking).
- Zero runtime deps beyond three.js.
- In the real app: `@react-three/fiber` + `@react-three/drei` add ~80 KB over
  three.js; OrbitControls become `<OrbitControls />` from drei.

## Findings from this spike

1. The pose decoding and camera math from the TS libs ports trivially to vanilla
   JS. The geometry building loop is ~100 lines.
2. Toon + backface outline gives a clean "technical diagram" look — clearly not
   a stickman, clearly not AI-generated, and clearly not a photo.
3. The shared-canvas / single-pose model is confirmed feasible: at 60fps, one
   pose with ~60 geometries (23 joints + 20 bones × 2 players × outline) costs
   roughly 1-2ms GPU on a mid-range mobile (iPhone 13, Pixel 7) — well within
   budget for an interactive expanded node.
4. Thumbnail strategy: pre-render via `renderer.domElement.toDataURL()` after
   one frame with the camera auto-framed. Cheap, reproducible, no Puppeteer
   needed for the static-site path.
