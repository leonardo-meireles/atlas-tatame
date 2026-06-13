# Stills Pipeline — "O Mapa do Jiu-Jitsu"

Clean 2D technical-plate illustrations of BJJ positions, rendered from 3D
capsule-humanoid figures in Blender. Style inspired by **GrappleMap** (figures =
sphere joints + capsule limbs, posed in 3D, rendered flat/toon to a transparent
PNG). The web app places the PNG on a warm paper canvas.

## Files

- `grapple_rig.py` — the whole pipeline: rig builder, scene setup, render, and pose
  data. Re-run it to regenerate or to add new positions.
- `grapple_rig.blend` — saved scene of Guarda Fechada (open to tweak interactively).
- Output PNGs go to `../public/stills/<slug>.png` (1200x900, RGBA, transparent).

## How a still is produced

1. **Rig model (GrappleMap-faithful).** Each figure is a skeleton defined by named
   joints (`Head, Neck, Core, L/R Shoulder/Elbow/Wrist/Hand, L/R Hip/Knee/Ankle/Toe`).
   - `JOINT_R` = sphere radius per joint.
   - `LIMBS` = list of `(jointA, jointB, radius)` capsules connecting joints.
   These mirror `source_repos/GrappleMap/src/players.hpp` (its `JOINTS` enum and
   `limbs()` table). We use a simplified-but-faithful subset.

2. **Geometry.** `build_figure(name, joints, color)`:
   - draws a UV sphere at every joint,
   - draws a capped cone (capsule) between every connected joint pair, oriented by
     `Z.rotation_difference(axis)`,
   - joins all parts into one mesh, shade-smooth,
   - assigns a flat material whose **`diffuse_color`** is set (Workbench MATERIAL
     mode reads `diffuse_color`, NOT the Principled base color — important).

3. **Two distinguishable figures.** Muted, distinct tones:
   - `INK  = (0.12, 0.13, 0.16)` — dark blue-grey, the BOTTOM player.
   - `CLAY = (0.78, 0.46, 0.33)` — terracotta, the TOP player.

4. **Camera.** A camera at `(3.4, -3.3, 2.3)` with a `TRACK_TO` constraint aimed at
   an empty over the action center `(0, -0.25, 0.45)`, 58mm lens. This high 3/4 angle
   is what makes depth — "lying down vs kneeling" — read clearly. A low/flat angle
   collapses the two bodies into an unreadable pile; keep the camera up and looking down.

5. **Shading — flat / toon technical plate.** Engine = **BLENDER_WORKBENCH**:
   - `color_type = 'MATERIAL'` (per-figure flat color),
   - `show_shadows = False` (no cast-shadow clutter),
   - `show_cavity = True`, cavity BOTH (subtle ridge/valley shading for form),
   - `show_object_outline = True` with a dark outline (crisp silhouette),
   - `film_transparent = True` (transparent background).
   No gradients, no neon, no specular — anatomy-atlas clarity.

6. **Export.** `render_still(path, 1200, 900)` → PNG, `color_mode='RGBA'`, 100%.

## Coordinate convention

`+Z` up. The body lies/sits in the X (left-right) / Y (north-south) plane. For
Guarda Fechada the bottom player's head is at `-Y`, both figures meet near the
origin, the top player rises in `+Z` around `Y≈0.3`.

## Posing a NEW position (montada, raspagem, etc.)

1. Copy the `POSE_GUARDA_FECHADA` dict at the bottom of `grapple_rig.py` to a new
   `POSE_<NAME>` and edit joint coordinates. You only move points; the rig rebuilds
   capsules automatically.
2. Iterate visually: in BlenderMCP run
   ```python
   exec(open('.../stills/grapple_rig.py').read())
   build_scene(POSE_MONTADA)
   render_still('/tmp/test.png')   # then read /tmp/test.png and fix
   ```
   Adjust, re-render, repeat until a non-expert reads the position.
3. When happy, render to `../public/stills/<slug>.png` at 1200x900.

### Posing tips learned on Guarda Fechada
- Keep joints physically plausible: thighs `Hip→Knee` long, shins `Knee→Ankle` long;
  don't let a limb fold back through itself.
- To show one figure *controlling/wrapping* another, route the wrapping limb's joints
  to **straddle and pass behind** the other figure's `Core` (cross the ankles at a
  `Y` value greater than the opponent's torso `Y`).
- Reaching/gripping arms reading well: elbow stays mid-height, wrist+hand climb toward
  the target joint of the other figure.
- Re-check the camera target empty if the new pose's center of mass shifts.

## Known limitations / future polish
- Figures are abstract capsule mannequins (intentionally — avoids "AI slop" realism).
  No hands/fingers detail, no gi; add capsule fingers or a torso "shell" mesh later if
  more anatomical read is wanted.
- Workbench cavity gives only light form shading. For a more illustrated look, switch
  to EEVEE + a toon/emission shader with Freestyle line art (heavier setup).
- Self-intersection of capsules is allowed (it reads fine as a diagram); not physically solved.

---

## ANATOMICAL upgrade — `grapple_rig_anat.py` (2026-05)

The capsule mannequins above read the *position* but not the **joints / pressure
points**, which is what matters in jiu-jitsu: limbs were uniform tubes and joints
were indistinct. `grapple_rig_anat.py` keeps the same named-joint skeleton and the
same locked house style, but makes the body anatomical enough to read joints.

- **Files:** `grapple_rig_anat.py` (builder + pose + render), `grapple_rig_anat.blend`
  (saved Guarda Fechada scene). Output: `../public/stills/guarda-fechada-anat.png`
  (1400x1050, RGBA, transparent). The old `guarda-fechada.png` is left untouched
  so the two can be compared.

### What MakeHuman / MPFB2 would have been (tried first, not available)
The brief preferred a real anatomical body via the MPFB2 (MakeHuman) addon (CC0
mesh, commercial-OK). MPFB2 was **not installed and not importable** in this
Blender (5.1), so we fell back to upgrading the capsule rig toward anatomy. If
MPFB2 is installed later, generate two bodies, rig them, and pose into closed
guard; the camera + line-art + halftone setup here can be reused unchanged.

### How the anatomical figure is built (`build_figure`)
1. **Distinct joint sockets.** A UV sphere at every joint (`JOINT_R`), sized
   *larger than the adjoining limb radius* so each joint **bulges** like a knuckle —
   neck, shoulders, elbows, wrists, hips, knees, ankles all read as separate forms.
2. **Tapered limbs.** Limbs are cones (`_make_tapered`, `rA`→`rB`): thick near the
   trunk, thin toward the extremity (upper arm→elbow, forearm→wrist, thigh→knee,
   shin→ankle). A pipe reads as a pipe; a taper reads as an arm.
3. **Torso shell + pelvis (`_make_torso`).** Two stacked tapered tubes — a broad
   ribcage that nips in at the waist, then flares to the hips — plus a collarbone
   yoke across the shoulders. Widths are clamped so the chest is a ribcage, not a
   flat cape. Adds a `Pelvis` joint to the skeleton.
4. **Hands & feet as blocks (`_make_box`).** Flattened oriented cubes pointing from
   wrist→hand and ankle→toe, so grips and mat-posts read without modelling fingers.

### House style — EEVEE flat emission + Grease Pencil Line Art + halftone
This is the **locked silkscreen / atlas-plate look** (target: `prototipo/C-lineart-halftone.png`).
It is the *real* render path the current scene uses — the older Workbench notes above
are superseded for the anatomical plate:
- **Engine = EEVEE** (`BLENDER_EEVEE_NEXT`/`BLENDER_EEVEE`), `film_transparent = True`.
- **Flat Emission fill** per figure (no shading realism — line art carries the form).
- **Halftone screen fill** baked into the emission (`_make_material`, `halftone=True`):
  screen-space `Window` coords → two `SINE` waves → product → `GREATER_THAN` threshold
  → dot lattice → `MixRGB` between the base tone (dots) and a darkened tone (gaps).
  Built in screen space so the dots stay a constant printed size regardless of depth.
  The two figures use different `dot_scale` (bottom 150, top 210) so the screens read
  as distinct fabrics. (We bake halftone in-shader because Blender 5.1's compositor
  has no `scene.node_tree` for a post-process dot screen.)
- **Bold black outline** via a scene-wide **Grease Pencil Line Art** modifier
  (`setup_lineart`): `source_type='SCENE'`, black GP material, `use_contour` +
  `use_crease` + `use_intersection` on so interior joint/limb boundaries draw (this
  is what makes the joints legible, not just the silhouette). This Blender's Line Art
  modifier has **no `thickness`** — line weight comes from a **Grease Pencil
  Thickness** modifier stacked *after* it (`thickness_factor = 3.0`, uniform).
- **Two tones:** `INK = (0.11,0.12,0.15)` dark ink = BOTTOM player (on his back);
  `CLAY = (0.80,0.47,0.34)` terracotta = TOP player (kneeling in the guard).

### Camera (reused from the reference that frames well)
`Cam` at `(4.6, -2.8, 1.85)`, 68mm, `TRACK_TO` an empty at `(0,-0.30,0.55)`. High
3/4 lower-lateral so the leg wrap and the depth (lying vs kneeling) read.

### Guarda Fechada pose notes (anatomical version)
- Bottom player's `Pelvis` and `Core` lie low along `-Y`; thighs rise to clamp the
  top player's sides at waist height (knees at `Y≈0.34, Z≈0.66`); shins wrap and the
  **ankles cross behind the top's back** near center-X at `Y>0.6` (the teaching point).
- Top player kneels: shins flat on the mat, hips at `Y≈0.48`, arms post forward/down
  onto the mat beside the bottom player.

### Reproduce / re-pose
```python
exec(open('.../stills/grapple_rig_anat.py').read())
build_scene(POSE_GUARDA_FECHADA)
render_still('.../public/stills/guarda-fechada-anat.png', 1400, 1050)
```
Copy `POSE_GUARDA_FECHADA` to a new `POSE_<NAME>` for other positions; you only move
joint coords (now including `Pelvis`), the rig rebuilds limbs/torso/hands automatically.

### Legibility vs the capsule version (honest assessment)
- **Much more legible.** Every major joint (shoulder, elbow, wrist+hand, hip, knee,
  ankle+foot) now reads as a distinct bulge/socket separated by line art, and the
  torso/pelvis read as a body. The closed-guard wrap and the ankle cross are clearer.
- **Pressure/contact points** (knees clamping the ribs, ankle cross on the back,
  grips on the arms) are now identifiable enough to annotate with callouts/arrows.
- **Remaining limits:** dot-scale halftone is slightly coarse at this scale (tune
  `dot_scale` if it moirés when scaled down on the web canvas); hands are blocks, no
  fingers/gi; self-intersection still allowed (reads fine as a diagram). For a fully
  realistic body, install MPFB2 and swap the mesh — the render path here is reusable.

---

## DATA-DRIVEN pipeline — `grapple_rig_gm.py` (2026-05, Phase 3)

The anat plate above (`guarda-fechada-anat.png`) was **hand-posed** and came out a
**muddy tangle**: a heavy 3.0 outline + coarse halftone + `use_intersection` interior
lines fused two interlocked fighters into one unreadable blob. This pipeline fixes
both root causes: **(a) real GrappleMap joint data** (not hand-posed) and **(b) a
legibility-first tuning** of the locked "C" style.

### Files
- `grapple_rig_gm.py` — builder/scene/render for the **full 23-joint GrappleMap
  skeleton** (adds `LeftHeel/RightHeel`, `LeftFingers/RightFingers`; uses GrappleMap's
  exact joint set, unlike the older simplified rigs).
- `grapple_poses_gm.py` — the **real pose data**: `POSE_GUARDA_FECHADA` (GrappleMap
  id 265 "distance closed guard"), `POSE_MONTADA` (id 150 "mount"), `POSE_PENDULO`
  (id 231 "halfway pendulum sweep"). Each dict is verbatim parser output.
- Outputs: `../public/stills/{guarda-fechada-v2,montada,raspagem-pendulo}.png`
  (1200x900, RGBA, transparent).

### The repeatable batch recipe (joint-data → rig → render)

**1. Extract real joint coords from GrappleMap (no Blender).** The parser at
`src/lib/grapplemap/parser.ts` decodes `source_repos/GrappleMap/GrappleMap.txt`.
Run the throwaway extractor (no new deps — uses the project's own vitest):
```bash
./node_modules/.bin/vitest run --config .scratch/figuras-grapplemap-pipeline/vitest.extract.config.ts
# writes .scratch/figuras-grapplemap-pipeline/extracted.txt
```
The extractor picks positions by name/tag/id (`closedGuardNeighbourhood`, `filterByTags`)
and prints each pose as a Blender-ready Python dict. **Coordinate remap is done in the
extractor:** GrappleMap is x/z ground-plane + y up → emitted as Blender `(x, z, y)` so
`+Z` is up here. Paste new dicts into `grapple_poses_gm.py`.

**2. Build + render in Blender (BlenderMCP).** `build_scene` takes the pose and which
player key is the TOP (clay) fighter — decide by head/core height (`z`): the player
with the higher head is the postured/top one.
```python
base = '/.../webapp-jiu/stills'
exec(open(base + '/grapple_rig_gm.py').read())
exec(open(base + '/grapple_poses_gm.py').read())
build_scene(POSE_GUARDA_FECHADA, top='p0', halftone=True)
set_camera((2.2, -3.2, 2.5), (0.0, 0.0, 0.32), lens=58)   # per-pose, see table
add_lineart(thickness=2.2)
render_still('/.../public/stills/guarda-fechada-v2.png', 1200, 900)
```
NOTE: `build_scene`, `set_camera`, `add_lineart` must all run in the **same** BlenderMCP
`execute_blender_code` call — exec'd functions do not persist between calls.

### Legibility-first style tuning (what beat the muddy anat plate)
The locked "C" look (two-tone clay/ink + line-art + halftone) is kept, but every knob
is dialled for separation, not decoration:
- **Engine = EEVEE**, `film_transparent`, `view_transform='Standard'` (no filmic
  desaturation → punchy flat tones). Fills are **flat Emission** (no shading realism).
- **Thin clean outline.** Line Art `thickness_factor = 2.2` (vs anat's 3.0) and
  **`use_intersection = False`** + `crease_threshold = 75°`. Killing intersection lines
  and most interior creases is the single biggest legibility win — the anat plate drew
  a line at every limb-on-limb overlap, which is what fused the two bodies.
- **Light halftone, not heavy.** `_make_material(halftone=True)`: screen-space dot
  lattice, threshold `0.35` and gaps only **28% darker** than the base tone (anat used
  a much darker gap). Result is a fabric/riso texture that lightens, never muddies.
  Bottom `dot_scale=150`, top `dot_scale=200` so the two screens read as distinct
  fabrics. Tested with `halftone=False` first (flat two-tone) as a legibility floor;
  the light halftone passed, so it ships ON (honours style "C").
- **High two-tone contrast.** `INK=(0.10,0.11,0.14)` near-black bottom; `CLAY=
  (0.82,0.45,0.30)` warm terracotta top.

### Per-pose camera trick (the other half of legibility)
There is **no single camera**; each pose needs an angle that *separates the two bodies*.
Pick by where the depth/contact lives:

| Pose | Camera loc | Target | Lens | Trick |
| --- | --- | --- | --- | --- |
| guarda-fechada-v2 | `(2.2, -3.2, 2.5)` | `(0,0,0.32)` | 58 | High lateral 3/4 — separates the supine bottom (low Z) from the kneeling/postured top (high Z); depth carries the read. |
| montada | `(-3.0, -2.2, 2.7)` | `(0,0,0.22)` | 55 | High 3/4 from the bottom-player's far side so the top is clearly **astride** (knees posted either side of the torso), not stacked along the view axis. |
| raspagem-pendulo | `(1.4, -3.6, 1.3)` | `(0.2,0,0.45)` | 50 | **Lower & lateral** so the kicked-over opponent's legs-in-the-air and the sweeper rising up read as up-and-over motion (a high angle flattened it into a pile). |

General rule: **never shoot a grappling pair flat/low from the front** — it collapses
both bodies into one silhouette (the original failure). Raise the camera and/or shoot
across the line that joins the two heads.

### Legibility — honest assessment (data-driven vs muddy hand-posed anat)
- **Clearly better.** All three data-driven plates read at a glance: a non-expert can
  see who is on top, who is on their back, and roughly what is happening. The anat
  hand-posed plate did not — it was a single brown/grey blob.
- **The two fixes are separable, and BOTH mattered.** The thin-outline + no-intersection
  + light-halftone re-tune alone makes a big difference (proven by re-running the *same*
  scene at `thickness=3.0, use_intersection=True` → muddy again). Real GrappleMap coords
  add **anatomical plausibility** the eye trusts (joint angles that actually occur in BJJ),
  which a hand-poser kept getting subtly wrong.
- **Did GrappleMap coords produce clearer poses? Mostly yes, with a caveat.** Cleaner
  *because* the limb lengths/angles are self-consistent. BUT GrappleMap has many variants
  per concept and some are deliberately tangled (e.g. "octopus closed guard", or
  "posture-broken" id 375, which rendered as a tangle). **Position SELECTION matters as
  much as the render:** prefer the more *separated* variant ("distance closed guard"
  read far better than the posture-broken one). The neighbourhood/tag filter gives
  several candidates per concept — pick the legible one.
- **Ranking by legibility:** mount (clearest — one clearly on top of the other) >
  closed guard (clear, though the leg-wrap is loose in the "distance" variant) >
  pendulum sweep (hardest — a mid-transition frame is inherently busy; the lower-lateral
  camera rescues it but a sweep will always read less cleanly than a static pin).
- **Recommendation on style:** **keep the light halftone** — at this tuning it does NOT
  muddy and it honours the locked "C" identity. If a specific pose ever moirés when
  downscaled on the web canvas, fall back to `halftone=False` (flat two-tone) for that
  pose only — flat two-tone is the proven legibility floor and is one boolean away.
  Do NOT restore the heavy outline or `use_intersection`; those caused the original mud.

---

## Câmera & variante DETERMINÍSTICAS (TDD) — `src/lib/grapplemap/render-spec.ts`

O batch NÃO deve mais escolher câmera/variante na mão. Use o módulo puro e testado
(`render-spec.test.ts`, 8 testes):

- `pickClearestVariant(variantes)` — entre as variantes GrappleMap do mesmo conceito,
  retorna a de maior `legibilityScore` (mais separação no chão + diferença de altura).
  Resolve o achado "algumas guardas fechadas vêm propositalmente enroscadas".
- `cameraFor(pose)` → `{ eye, target, up }` — mira no ponto entre os dois lutadores e
  olha ATRAVESSANDO a linha que os une (perpendicular no chão), elevada em 3/4. É a regra
  que destravou a legibilidade, agora computada por pose em vez de hand-tuned.

Receita do batch: parse → `pickClearestVariant` por conceito → `cameraFor(pose)` → passar
`eye/target/up` pro `set_camera` do Blender (GrappleMap: y=cima) → render no estilo "C".
Determinístico ponta a ponta = escala pras ~106 posições da vizinhança sem ajuste manual.

---

## BATCH determinístico executado — `public/stills/gm/` (2026-05, Phase 4)

Primeiro batch real rodado **inteiramente com a câmera determinística** (`cameraFor`),
sem nenhuma câmera hand-tuned. 12 posições da vizinhança da guarda fechada, uma por
conceito, escolhidas por `pickClearestVariant` (maior `legibilityScore`).

### Pipeline ponta a ponta (reproduzível)
1. **Extrator throwaway** `.scratch/figuras-grapplemap-pipeline/extract_batch.test.ts`
   (config `vitest.extractbatch.config.ts`). Importa `parser` + `bjj-filter` +
   `render-spec`. Para cada conceito: `closedGuardNeighbourhood(hops:3)` → filtra
   candidatos por tag+nome → `pickClearestVariant` → emite id, name, slug, as 23
   juntas de ambos os jogadores, e `cameraFor(pose)` (eye/target/up).
   ```bash
   ./node_modules/.bin/vitest run --config .scratch/figuras-grapplemap-pipeline/vitest.extractbatch.config.ts
   # escreve extracted_batch.txt (log) + batch_data.py (módulo Python pronto)
   ```
   O remap de coords (GM x/y/z y-up → Blender x,z,y) é feito no extrator **tanto pra
   pose quanto pra câmera** (eye/target). O `top` (jogador clay) é decidido pela altura
   da cabeça (maior `y` em GM = de cima).
2. **Render em Blender (BlenderMCP)**, tudo numa só chamada `execute_blender_code`:
   ```python
   base  = '/.../webapp-jiu/stills'
   sdir  = '/.../webapp-jiu/.scratch/figuras-grapplemap-pipeline'
   exec(open(base + '/grapple_rig_gm.py').read())
   exec(open(sdir + '/batch_data.py').read())   # define BATCH = [ {id,slug,top,eye,target,pose}, ... ]
   for b in BATCH:
       build_scene(b['pose'], top=b['top'], halftone=True)
       set_camera(b['eye'], b['target'], lens=58)     # <- câmera vem do cameraFor, NÃO hand-tuned
       add_lineart(thickness=2.2)                       # estilo "C": outline fino, sem use_intersection
       render_still('/.../public/stills/gm/%d-%s.png' % (b['id'], b['slug']), 1100, 825)
   ```
   Estilo "C" reusado sem mudança: outline 2.2, `use_intersection=False`, halftone leve
   (threshold 0.35), dois tons (ink = bottom/p?, clay = top). Lente fixa 58mm pra todas.
3. **Saídas:** `public/stills/gm/<id>-<slug>.png` (1100x825, RGBA transparente) +
   `public/stills/gm/index.json` (`{id, slug, name, concept, file}` × 12) pro app linkar.

### As 12 posições (conceito → id/slug, legibilityScore)
north/south choke (134, 1.06) · entering side control w/ kimura (496? → na verdade
side_control caiu fora do top-12 por inNbh) · mounted triangle (190, 0.59) · knee on
belly drape (192, 0.52) · rear naked choke w/ arm trapped (198, 0.50 → back control) ·
half guard shell (155, 0.38) · combat base vs butterfly (149, 0.65) · kneeling vs seated
open guard w/ 2-on-1 (324, 0.46) · halfway pendulum sweep (231, 0.43) · threatened
triangle w/ hands clasped (226, 0.60) · standing vs reverse dlr (46, 0.79) · deep half
backdoor sweep (182, 0.60) · closed guard w/ 100% (376, 0.50). (side_control id=496 e
x_guard id=478 ficaram fora do corte top-12 por estarem fora da vizinhança/inNbh=false;
o ranking priorizou inNbh + score.)

### A câmera determinística funcionou? — avaliação honesta
- **Sim, na maioria.** A regra "olhar atravessando a linha entre os centroides, elevado
  em 3/4" enquadrou **legivelmente** poses muito variadas SEM nenhum ajuste por pose. Os
  vencedores claros — **mounted triangle, knee on belly, north/south choke** — leem de
  cara: dá pra ver quem está por cima, quem está de costas, e o gesto. Isso é exatamente
  o que as câmeras hand-tuned da Phase 3 entregavam, **mas agora computado**.
- **Empata ou supera as hand-tuned em consistência.** Antes cada pose precisava de uma
  linha numa tabela (loc/target/lens ajustados no olho). Agora uma função só serve as 12
  sem regressão visível de qualidade nos casos bons. Esse é o ganho central: escala.
- **Onde falhou / framing fraco (honesto):**
  - **closed guard w/ 100% (376)** e **half guard shell (155)** — as duas de menor
    `legibilityScore` — saíram mais **enroscadas/ambíguas**: os corpos se sobrepõem e a
    câmera, por mais bem orientada que esteja, não separa o que a *pose* já mistura. Aqui
    o limite é a SELEÇÃO de variante, não a câmera (o `legibilityScore` baixo já avisava).
  - **Enquadramento "pequeno" em poses compactas.** `cameraFor` usa distância fixa
    `2.6 × boundingRadius` e **não faz fit-to-frame**: poses de raio pequeno (half guard
    shell) ficam com muita margem vazia, figuras pequenas no quadro. Legível, mas
    subaproveitado. Melhoria futura barata: derivar a distância do FOV+raio (fit real) ou
    ajustar a lente por raio em vez de fixar 58mm.
  - **back control (198)** lê como entrelaçamento genérico — o ângulo lateral não deixa
    100% claro que é *pelas costas*. Costas/north-south se beneficiariam de um leve viés
    de azimute (a perpendicular tem dois sentidos; hoje escolhe-se sempre `(-az, ax)`).
- **Veredito:** `cameraFor` é um substituto sólido das câmeras hand-tuned para o batch em
  escala — a legibilidade está **atrelada à legibilidade da própria pose** (o que é
  desejável e mensurável via `legibilityScore`), não a carinho manual. Recomendações:
  (1) adicionar fit-to-frame por FOV em `cameraFor`; (2) escolher o sentido da
  perpendicular pela altura (apontar a câmera do lado do jogador mais baixo) p/ pins de
  costas; (3) continuar filtrando por `legibilityScore` e, p/ conceitos cujo melhor
  variante ainda pontue baixo (<0.45), preferir pular ou anotar como "inerentemente
  busy". Estilo "C" reusado sem nenhuma mudança e segurou bem em todas as 12.

## Phase 5: multi-POV — `public/stills/views/` (2026-05)

**Problema que resolve:** uma posição não se entende de UM ângulo só. A Phase 4
entregava 1 still (a câmera primária `cameraFor`) por posição; aqui rendemos a MESMA
pose de VÁRIOS ângulos pra a UI poder girar/flipar e o dono entender de quem está por
cima, quem está de costas, e como os membros se entrelaçam.

### O que foi feito
- **Seleção reusa a Phase 4 sem hand-tuning.** O extrator
  `.scratch/figuras-grapplemap-pipeline/extract_multipov.test.ts` reusa os MESMOS
  conceitos + `pickClearestVariant`, restrito às **6 posições de maior legibilidade da
  vizinhança da guarda fechada**: guarda fechada, montada, joelho na barriga, norte-sul,
  triângulo, pelas costas. Emite `multipov_data.py` (Blender-ready, GM y-up → z-up).
- **Câmeras vêm da função TESTADA `camerasFor(pose, 4)`** (`src/lib/grapplemap/render-spec.ts`):
  4 câmeras determinísticas orbitando o alvo, offsets de azimute `[0°, 55°, -55°, 130°]`.
  `cams[0]` é sempre a primária (= `cameraFor`, idêntica à Phase 4). NENHUMA câmera
  ajustada na mão.
- **Render:** por posição, monta a cena UMA vez (`build_scene` ink baixo / clay cima,
  `add_lineart` Phase-style C: outline 2.2, sem `use_intersection`, halftone leve 0.35),
  e só troca a câmera entre os 4 ângulos. Transparente, 1000×750, EEVEE.
- **Saída:** `public/stills/views/<slug>/{0,1,2,3}.png` (6 × 4 = **24 frames**) +
  `views-index.json` = `[{ slug, nome, angles:[{angulo,file}] }]` com rótulos
  "3/4" · "Lado" · "Costas" · "Cima".

### Os ângulos da órbita ajudam mesmo? — avaliação honesta
- **Sim, claramente, nos vencedores de alta legibilidade.** Confirmado por screenshot:
  - **montada (mounted-triangle)**: o 3/4 (cam 0) mostra o de cima montado e o setup do
    triângulo; o flip de 180°-ish (cam 3) vira pra um quase-de-cima que revela a
    configuração das pernas do triângulo que o 3/4 escondia. Os dois ângulos somam.
  - **norte-sul**: cam 0 dá o perfil lateral limpo (cabeça-com-cabeça invertido); a
    rotação (cam 1) levanta o ponto de vista e deixa óbvia a orientação norte-sul. O
    flip resolve a ambiguidade "quem está de costas" que a câmera única deixava.
- **Diferenciação real, não 4 quadros iguais.** Os offsets `[0,55,-55,130]` produzem
  lados genuinamente distintos; ocasionalmente cam 1 e cam 3 ficam parecidos numa pose
  axissimétrica, mas o conjunto sempre acrescenta pelo menos um lado novo útil.
- **Limite herdado da pose, não da órbita.** **closed-guard-w-100 (376)** e o
  **triângulo "ameaçado" (226)** — os de menor `legibilityScore` — continuam enroscados
  de alguns ângulos: girar não desfaz o que a *pose* já mistura (cam 2 do closed guard
  fica mais confusa que cam 0). Consistente com o aviso da Phase 4: o gargalo é a
  SELEÇÃO de variante, não a câmera. Mesmo nesses, ter o 3/4 + um flip ainda ajuda o dono
  a sacar a posição melhor do que o still único.
- **Veredito:** multi-POV via `camerasFor` **agrega entendimento de forma mensurável e
  sem custo de hand-tuning** — sobretudo nas poses limpas, onde o flip revela o lado que
  o ângulo único escondia. Para as poses inerentemente busy, multi-POV mitiga mas não
  cura; a recomendação da Phase 4 (preferir variantes com `legibilityScore` mais alto)
  continua sendo a alavanca principal.

---

## Phase 6 — figuras das nossas TRANSIÇÕES ("FIGURA EM BREVE" → still real)

**Objetivo.** Os 8 nós de TRANSIÇÃO autorais do app mostravam placeholder "FIGURA EM
BREVE". Renderizamos uma figura para cada um a partir de dados REAIS do GrappleMap:
achamos o conceito por NOME (transições primeiro, usando o ÚLTIMO keyframe = técnica
finalizada; posições como fallback), `pickClearestVariant` entre os matches e
`cameraFor(pose)` para a câmera (determinística, sem hand-tuning).

**Pipeline (throwaway, sem deps novas).**
- Extrator: `.scratch/figuras-grapplemap-pipeline/extract_tecnicas.test.ts`
  (vitest importando parser + render-spec). Mapeia NOSSO slug → regexes de nome
  ordenadas (mais específica primeiro) + um `reject` para descartar matches errados.
  Emite `tecnicas_data.py` = `BATCH = [{slug, src, top, eye, target, pose}]`,
  Blender-ready (GM y-up → Blender z-up via `(x, z, y)`), `top` = cabeça mais alta.
  Rodar: `node_modules/.bin/vitest run --config
  .scratch/figuras-grapplemap-pipeline/vitest.tecnicas.config.ts`.
- Render (BlenderMCP, mesma sessão): `build_scene(pose, top, halftone=True)` (ink
  baixo / clay cima) · `set_camera(eye, target, lens=58)` (vem do `cameraFor`) ·
  `add_lineart(thickness=2.2)` (estilo "C": outline 2.2, sem `use_intersection`,
  halftone leve 0.35) · `render_still(path, 1000, 750)` transparente.
- Saída: `public/stills/tecnicas/<slug>.png` (NOSSOS slugs) +
  `public/stills/tecnicas/index.json` = `[{slug, file}]`.

**Resultado — 7 de 8 renderizados limpos.** Match e fonte GrappleMap por slug:
- `armlock-da-guarda` ← transition#1387 "arm bar" — limpo, ótima legibilidade.
- `triangulo` ← transition#100 "triangle" — limpo, triângulo legível de 3/4.
- `kimura-da-guarda` ← transition#1294 "kimura" — limpo.
- `raspagem-de-quadril` ← transition#293 "hip bump sweep" — legível (algo horizontal).
- `raspagem-de-balao` ← transition#89 "pendulum sweep start" (flower sweep não existe
  no GrappleMap; pendulum é o equivalente) — limpo.
- `abertura-e-passagem` ← transition#794 "break open guard" — limpo, postura de passagem.
- `estrangulamento-cruzado` ← **SUBSTITUIÇÃO** transition#927 "irish collar". GrappleMap
  NÃO tem "cross collar choke"/"cross choke" por nome — todo nome com "choke" é mata-leão
  (costas). O irish collar da guarda fechada é um estrangulamento de gola cruzada, o
  representante honesto mais próximo. Pose enroscada (legibilityScore 0.237 = a mais
  baixa do lote); lê como clinch de guarda, mas é o still mais fraco — candidato a
  re-seleção de variante se aparecer melhor.

**Conceito NÃO encontrado no GrappleMap (1):**
- `raspagem-de-tesoura` (scissor sweep) — o GrappleMap só tem "flying scissor"
  (kani basami, uma chave de perna em pé), que NÃO é a raspagem de tesoura da guarda.
  Nenhum representante honesto existe → **sem figura**, fica fora do `index.json` e
  segue com o placeholder.

---

## Phase 7 — nós CONCEITO restantes + tesoura ("FIGURA EM BREVE" → still real)

**Objetivo.** Fechar os "FIGURA EM BREVE" que sobraram: os 3 nós de CONCEITO
(`cem-quilos`, `norte-sul`, `tartaruga`, definidos em `grafo-gm.generated.ts`) e o nó
de técnica `raspagem-de-tesoura` (que a Phase 6 deixou sem figura). Mesmo pipeline
determinístico: achar o conceito por NOME, `pickClearestVariant`, `cameraFor(pose)`
(sem hand-tuning).

**Pipeline (throwaway, sem deps novas) — estende o padrão da Phase 6.**
- Extrator: `.scratch/figuras-grapplemap-pipeline/extract_conceitos.test.ts`
  (vitest importando parser + render-spec). Mapeia NOSSO slug → regexes de nome
  (mais específica primeiro) + `reject` para descartar variantes erradas + `dir`
  (`conceitos`/`tecnicas`). Conceitos = pins estáticos → `preferPositions` (escolhe
  Position, não keyframe de transição). Emite `conceitos_data.py` = `BATCH =
  [{slug, dir, src, top, eye, target, pose}]`, Blender-ready (GM y-up → z-up via
  `(x, z, y)`), `top` = cabeça mais alta. Rodar: `node_modules/.bin/vitest run --config
  .scratch/figuras-grapplemap-pipeline/vitest.conceitos.config.ts`.
- Render (BlenderMCP, mesmo recipe da Phase 6): `build_scene(pose, top, halftone=True)`
  (ink baixo / clay cima) · `set_camera(eye, target, lens=58)` (vem do `cameraFor`) ·
  `add_lineart(thickness=2.2)` (estilo "C": outline 2.2, sem `use_intersection`,
  halftone leve 0.35) · `render_still(path, 1000, 750)` transparente.
- Saída: `public/stills/conceitos/<slug>.png` + `public/stills/conceitos/index.json`
  = `[{slug, file}]` (3 conceitos) · `raspagem-de-tesoura` vai pra
  `public/stills/tecnicas/` e é acrescentado ao `tecnicas/index.json`.

**Resultado — 3 conceitos + 1 técnica renderizados limpos.** Match GrappleMap por slug:
- `cem-quilos` (side control) ← position#446 "side control w/ far underhook"
  (legibilityScore 0.54, o mais legível entre 8 pins de side control limpos; variantes
  vs/escape/darce/kimura/arm-triangle rejeitadas). Lê de cara: clay por cima cravando
  o crossface no ink de baixo. **Limpo.**
- `norte-sul` (north-south) ← position#2 "north south" (o pin canônico, 0.55). A
  orientação cabeça-com-cabeça invertida lê claramente. **Limpo.**
- `tartaruga` (turtle) ← position#237 "parallel turtle" (0.42). O "turtle" puro é
  sempre "vs X" ou tem seatbelt/back-take; o "parallel turtle" é o pin de tartaruga
  honesto e limpo (ink embolado embaixo, clay paralelo por cima). **Limpo.**

**SUBSTITUIÇÃO reportada (1):**
- `raspagem-de-tesoura` (scissor sweep) ← **SUBSTITUIÇÃO** position#233 "hip bump sweep
  w/ elbow post" (0.30). Procurei a fundo: o GrappleMap NÃO tem scissor sweep da guarda
  fechada. Os únicos nomes com "scissor" são "flying scissor"/"scissor" = kani basami /
  sliding heelhook (sequências de chave de perna do Reilly Bodycomb), NÃO a raspagem da
  guarda. Os ÚNICOS sweeps tagueados `full_guard` são a família hip-bump; como
  `raspagem-de-quadril` já usa transition#293 "hip bump sweep", peguei a variante
  distinta "hip bump sweep w/ elbow post" como a raspagem de guarda fechada mais próxima
  honesta. Lê como raspagem em movimento (clay de baixo subindo na ponte contra o ink de
  cima); still mais fraco do lote mas legível — candidato a re-seleção se um scissor
  sweep de verdade for adicionado ao GrappleMap upstream.

**Nada ficou sem figura nesta fase** (todos os 4 slugs renderizados; o único que não tem
representante exato — tesoura — foi substituído pela raspagem de guarda fechada mais
próxima, conforme o brief).
