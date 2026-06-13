# Survey: 3D Parametric Body Models, Riggable Characters, Pose Data & Retargeting

**Scope:** Open-source / adaptable tech for illustrating two interacting human figures in a defined position (e.g. grappling) for **"O Mapa do Jiu-Jitsu"** — a Next.js web app rendering positions as a graph. Goal is to **adapt existing tech**, not build from scratch. This slice covers: parametric body models, rigged-character sources, pose representation & mocap, and retargeting.

**Date:** 2026-05-24. License notes reflect terms as published; **always re-verify before shipping a commercial product** — model licenses in this space change and are frequently misrepresented in secondary sources.

---

## TL;DR — Ranked shortlist: "adaptable today for a COMMERCIAL product"

The single biggest landmine in this field: **SMPL / SMPL-X / STAR / AMASS are research-only.** They dominate academic work and most tutorials/tooling assume them, but you **cannot ship them commercially without a paid Meshcapade/Max-Planck license.** Avoid building your core on them.

Ranked options that are **commercial-safe and adaptable today**:

| Rank | Stack | Why | License |
|------|-------|-----|---------|
| **1** | **MakeHuman / MPFB2** (generate two riggable meshes) + **Mixamo auto-rig & poses** OR **Auto-Rig Pro** + export **glTF** → render in **three.js / react-three-fiber** in the Next.js app | Fully commercial-clean pipeline end-to-end. CC0 meshes, royalty-free Mixamo, MIT/Apache web libs. Web-native rendering. | CC0 + Mixamo TOS + GPL tooling (output unaffected) |
| **2** | **Anny** body model (Apache-2.0, MakeHuman-derived, SMPL-compatible API, Mixamo-interoperable) as a *parametric*, programmatic body you can pose by joint rotations | The only **parametric, differentiable, commercially-licensed** SMPL alternative. Lets you drive poses by joint angles in code — ideal if you want pose-as-data. | Apache 2.0 |
| **3** | **Quaternius Universal Base Characters + Universal Animation Library** (CC0 rigged glTF) rendered in three.js; pose via bone rotations or retargeted Mixamo/CMU BVH | Zero-friction CC0 rigged characters + animations, drop-in for web. Fast to prototype two figures. | CC0 |

**Pose-from-reference (optional add-on):** **MediaPipe Pose** (Apache-2.0) or **MMPose** (Apache-2.0) to extract joint landmarks from a reference photo/video and drive the chosen rig. Both commercial-OK. **Do NOT** use the AMASS dataset or SMPL-fitting pipelines (SMPLify-X) commercially.

---

## Part 1 — Parametric human body models

A "parametric body model" = a mesh whose **shape** (body type) and **pose** (joint rotations) are both controlled by a low-dimensional vector. Pose is almost always represented as **per-joint 3D rotations relative to a rest skeleton**, applied via **linear blend skinning (LBS)** + forward kinematics. This is the cleanest "pose as data" representation — but the best-known ones are license-encumbered.

### SMPL  ⚠️ RESEARCH-ONLY (commercial = paid license)
- **What:** The de-facto standard skinned parametric body. 6890 vertices, 23 joints + root. Shape = PCA betas, pose = per-joint axis-angle rotations (theta). Underpins most of the academic 3D-human field.
- **Link:** https://smpl.is.tue.mpg.de/ · Model license: https://smpl.is.tue.mpg.de/modellicense.html
- **License:** **Non-commercial scientific research / education / non-commercial artistic only.** Commercial use requires a paid license through **Meshcapade** (`smpl@max-planck-innovation.de` / meshcapade.com). **HARD BLOCKER for a SaaS.**
- **Maintenance:** Stable, widely used; not actively "developed" (it's a fixed model). Meshcapade maintains tooling.
- **How we'd adapt:** Would be ideal technically (pose = joint-angle vector, easy to define grappling poses, two instances in one scene), but the license kills it for a commercial product unless you pay Meshcapade.

### SMPL-X  ⚠️ RESEARCH-ONLY (model); CC-BY-4.0 (body mesh subset only)
- **What:** SMPL + fully articulated hands + facial expression. 10,475 vertices. Pose includes finger joints — relevant if you ever want grip detail.
- **Link:** https://smpl-x.is.tue.mpg.de/ · Model license: https://smpl-x.is.tue.mpg.de/modellicense.html · Body (CC) license: https://smpl-x.is.tue.mpg.de/bodylicense.html
- **License nuance:** The **full model** (with learned shape blendshapes) is **research-only**. A subset called **"SMPL-X Body"** (template + skinning, *excluding* the shape blendshapes) is **CC-BY-4.0**. This distinction is subtle and easy to get wrong — the part that makes it *parametric in shape* is the research-only part. Treat the full thing as a commercial blocker.
- **How we'd adapt:** Same as SMPL. Avoid unless paying Meshcapade.

### STAR  ⚠️ RESEARCH-ONLY
- **What:** "Sparse Trained Articulated Human Body Regressor." A **drop-in SMPL replacement** with more realistic, sparser (localized) pose deformations and fewer parameters. ECCV 2020.
- **Link:** https://github.com/ahmedosman/STAR
- **License:** Non-commercial research only; commercial via `ps-license@tue.mpg.de`. **Same blocker family as SMPL.**
- **Maintenance:** Repo stable but low activity.
- **How we'd adapt:** Technically nicer deformations than SMPL, but **still commercially blocked.** Skip.

### GHUM / GHUML  ⚠️ Custom Google license — read carefully, NOT a clean commercial yes
- **What:** Google's generative body model. Non-linear (VAE) shape space, full body + detailed hands + face. GHUM = 10,168 verts, GHUML(ite) = 3,194 verts. It is the model **MediaPipe's 3D pose landmarks are aligned to**.
- **Link:** https://github.com/google-research/google-research/tree/master/ghum · https://research.google/pubs/pub50649/
- **License:** Released by Google Research under their own terms — historically **research-oriented with usage restrictions**; not a blanket Apache grant for the model weights. Must be reviewed directly; do not assume commercial-OK.
- **How we'd adapt:** Interesting because MediaPipe pose maps to it, but the model-weight licensing is murky enough to avoid for a commercial core. The *MediaPipe runtime* (Apache-2.0) is fine; the *GHUM model asset* is the gray area.

### MakeHuman  ✅ COMMERCIAL-OK (output is CC0)  — RECOMMENDED
- **What:** Mature open-source parametric human generator. Slider-driven control over age, gender, build, muscle, ethnicity, proportions. Exports rigged meshes (multiple skeleton presets incl. game/Mixamo-style rigs) to OBJ/FBX/glTF/Collada.
- **Link:** http://www.makehumancommunity.org/ · License: https://static.makehumancommunity.org/about/license.html
- **License — the good part:** **Software** code is **AGPL** (MakeHuman) / **GPL** (MPFB). **Core assets and any model/output you generate are CC0** (public domain) — explicitly "free to do as you see fit... no copyright notices, no attribution," and explicitly usable in **closed-source commercial products including games.** This is the cleanest commercial story in the parametric space.
- **Caveat:** The CC0 applies to the **bundled core assets**. If you add third-party MakeHuman community assets (clothes/hair/skins), check each asset's own license. The base body output is CC0.
- **Maintenance:** Long-lived community project; standalone app + the new MPFB2 Blender plugin (below) is the actively-developed front.
- **How we'd adapt:** Generate two distinct base figures once (or a small library of body types). Rig with the included Mixamo-compatible or default skeleton. Pose either in-app via Mixamo/BVH retarget, or by directly setting bone rotations. Export glTF → load in three.js for the web app. Body type can be parametric *offline* (you don't ship the slider UI, you ship baked meshes).

### MPFB2 (MakeHuman Plugin For Blender 2)  ✅ COMMERCIAL-OK (output CC0) — RECOMMENDED
- **What:** MakeHuman reborn as a **Blender add-on**. Full parametric body modeling *inside Blender*; all parametric settings stored as **shape keys**, so body shape stays adjustable. Integrates with Blender's Rigify/Mixamo rigs, materials, clothing. v2.08 is the first stable release and is a vetted official Blender Extension.
- **Link:** https://github.com/makehumancommunity/mpfb2/ · https://extensions.blender.org/add-ons/mpfb/ · overview: https://www.cgchannel.com/2025/03/check-out-open-source-blender-character-generation-plugin-mpfb-2/
- **License:** **GPLv3 source, CC0 bundled assets**, CC0 output — same commercial-clean story as MakeHuman. Output usable in closed commercial products.
- **Maintenance:** **Actively developed (2025 stable release).** This is the modern way to use MakeHuman.
- **How we'd adapt:** Best authoring tool for our pipeline. In Blender: generate two figures with MPFB2 → rig (Rigify / Auto-Rig Pro / Mixamo) → pose them into the grappling position (manual posing, or import a retargeted BVH/Mixamo clip and scrub to the key frame) → export glTF (.glb) of the posed scene → render in the Next.js app via three.js, or pre-render stills/turntables. CC0 means zero licensing friction.

### Anny / "Anny Body"  ✅ COMMERCIAL-OK (Apache-2.0) — RECOMMENDED parametric option
- **What:** A **fully differentiable, scan-free parametric body model grounded in MakeHuman anthropometrics** (arXiv 2511.03589, late 2025). 13,380 verts, 163-bone default skeleton. Interpretable params (age, gender, weight, muscle) spanning infant→elderly. Pose represented exactly like SMPL: **root pose + per-joint 3D rotations relative to rest, applied via forward kinematics + blend skinning.** Explicitly designed as a **practical SMPL/SMPL-X alternative** and shown to match scan-based models for human-mesh-recovery training.
- **Link:** https://arxiv.org/html/2511.03589v1
- **License:** **Apache 2.0** — free of the privacy/research constraints that bind SMPL. **Commercial use OK.** This is the headline finding: a parametric, code-drivable body model you can legally ship.
- **Interoperability:** Paper states it **interoperates with Mixamo rigs for animation retargeting** — so it slots into the same pipeline as the rest of this report.
- **Maintenance:** New (2025), so smaller ecosystem/community than SMPL; verify the code release maturity before betting on it. But license + design make it the right "parametric, programmatic, commercial" pick.
- **How we'd adapt:** If you want **pose-as-data** (store each jiu-jitsu position as a vector of joint rotations, render on demand, interpolate between positions for transitions in the graph), Anny is the commercially-clean way to do what everyone uses SMPL for. Drive two instances with two pose vectors; render via its mesh export into three.js, or rasterize server-side.

---

## Part 2 — Rigged character / avatar sources

For "two figures in a pose" you may not need a *parametric* model at all — a fixed rigged humanoid you pose by bone rotations is often enough and faster.

### Mixamo  ✅ COMMERCIAL-OK (royalty-free) — RECOMMENDED for rig + poses
- **What:** Adobe's free auto-rigger + library of ready rigged characters and ~thousands of mocap animations. Upload any humanoid mesh → auto-rigged in minutes; or download pre-rigged characters with animations. Exports FBX (and via Blender, glTF).
- **Link:** https://www.mixamo.com/ · FAQ/license: https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html
- **License:** **Royalty-free, unlimited commercial & non-commercial use** of characters and animations. **No attribution required.** Two restrictions to respect: (1) **you may not redistribute the raw character/animation files** as standalone assets (using them inside your app/product is fine; selling the .fbx is not); (2) **may not be used to train ML models.** Neither restriction affects rendering posed figures in a web app.
- **Maintenance:** Maintained by Adobe; stable. (Account login required; occasional uncertainty about long-term availability — mirror what you need.)
- **How we'd adapt:** Auto-rig MakeHuman/MPFB2/Anny meshes here, OR grab pre-rigged characters. Pull grappling-ish mocap (ground, takedown, wrestling clips) to use as **pose sources** — scrub to the right frame, or use as the base you hand-edit into a specific position. Export glTF for the web.

### Ready Player Me  ⚠️ COMMERCIAL-OK *only as registered developer* — read terms
- **What:** Hosted avatar-creation SaaS; full-body rigged glTF avatars via API/SDK, web-friendly.
- **Link:** https://readyplayer.me/ · Terms: https://docs.readyplayer.me/ready-player-me/support/terms-of-use
- **License:** End-user avatars are **CC-BY-4.0 (non-commercial)** by default; **commercial integration requires registering as a (free) Ready Player Me developer/partner.** Once registered, commercial use is free. **No minting avatars as NFTs**, even as a partner. You're tied to their platform/branding rules.
- **How we'd adapt:** Possible but adds a third-party dependency and stylized (somewhat cartoon) avatars not ideal for anatomical grappling clarity. Lower priority than CC0/Apache options.

### VRoid Studio / VRM format  ◑ MIXED — depends on author-set per-model terms
- **What:** VRoid Studio = free anime-style avatar creator exporting **VRM** (a glTF-2.0 humanoid extension with a **standardized bone mapping** — great for retargeting/posing). VRM embeds its **own license metadata per model**.
- **Link:** https://vroid.com/en/studio · VRM/license FAQ: https://vroid.pixiv.help/hc/en-us/articles/360016417013
- **License:** **The avatar's commercial terms are set per-model by its creator** and embedded in the file. Studio-made models you create yourself: you set the terms. Third-party VRMs: **must honor the embedded license.** Style is anime, not anatomical realism.
- **How we'd adapt:** The **VRM *format* + standardized humanoid bone names** is the genuinely useful part for posing/retargeting in three.js (see `three-vrm` below). The anime aesthetic is a poor fit for instructional grappling, so use it for the *tooling pattern*, not the avatars.

### Quaternius — Universal Base Characters + Universal Animation Library  ✅ CC0 — RECOMMENDED
- **What:** Free, CC0 low-poly **rigged** humanoid base characters with a **universal rig**, plus a large companion **animation library**. OBJ/FBX/glTF + source .blend with rig & animations.
- **Link:** https://quaternius.com/packs/universalbasecharacters.html · https://quaternius.com/packs/universalanimationlibrary2.html
- **License:** **CC0** — personal, educational, **commercial** use, no attribution. Cleanest possible.
- **Maintenance:** Actively published; widely used in indie/web.
- **How we'd adapt:** Fastest prototype path: drop two CC0 rigged glTF characters into a three.js scene, pose by bone rotation or retarget Mixamo/CMU clips onto the universal rig. Stylized but clean; good for a clear instructional look.

### Blender Rigify  ✅ COMMERCIAL-OK (GPL tool; output yours)
- **What:** Blender's built-in modular auto-rig system. Generates a full control rig for humanoids.
- **Link:** Ships with Blender — https://docs.blender.org/manual/en/latest/addons/rigging/rigify/index.html
- **License:** Blender + Rigify are **GPL**, but **GPL covers the tool, not the art you make with it** — your rigged/posed character output is yours to use commercially.
- **How we'd adapt:** Rig MakeHuman/MPFB2/Anny meshes for precise manual posing of grappling positions in Blender, then export glTF.

### Auto-Rig Pro  ✅ COMMERCIAL-OK (paid add-on ~$40)
- **What:** Industry-standard paid Blender add-on for rigging, **retargeting** (BVH/FBX bone remapper, works across Rigify/custom/Mixamo rigs), and clean glTF/FBX export with engine presets.
- **Link:** https://superhivemarket.com/products/auto-rig-pro/ · Remap docs: https://www.lucky3d.fr/auto-rig-pro/doc/remap_doc.html
- **License:** Commercial paid add-on; output is yours, used in film/games commercially. One-time ~$40.
- **How we'd adapt:** If retargeting mocap (Mixamo/CMU BVH) onto MakeHuman/Anny rigs gets fiddly with free tools, ARP's bone remapper is the reliable production answer. Worth the $40 if posing volume is high.

---

## Part 3 — Pose representation, mocap data & pose-from-reference

### How pose is represented (the data model you'd store per position)
Across SMPL/Anny/glTF/BVH, the common representation is: a **skeleton (named joints in a hierarchy)** + a **rest/bind pose** + **per-joint 3D rotations** (axis-angle, quaternion, or Euler) that forward-kinematics composes down the chain, then **linear blend skinning** deforms the mesh. For the jiu-jitsu graph, the natural per-position record is **{character A: joint-rotation map, character B: joint-rotation map, relative transform between them}**. glTF stores this as skinned-mesh + animation samplers; BVH stores it as hierarchy + per-frame channels.

### glTF skinned animation  ✅ open standard — RECOMMENDED transport/runtime
- **What:** Khronos open standard; **skinned meshes + skeletal animation** are first-class. Directly loadable in three.js (`GLTFLoader`). This is your web delivery format.
- **License:** Open Khronos spec; free.
- **How we'd adapt:** Author/pose in Blender → export `.glb` (mesh + skeleton + optionally posed frames) → load in the Next.js app with react-three-fiber. Two characters = two skinned meshes in one scene, or one .glb containing both.

### three.js + react-three-fiber  ✅ MIT — RECOMMENDED web renderer
- **What:** WebGL renderer; `SkinnedMesh`, `Skeleton`, `Bone`, `SkeletonHelper`. You can set `mesh.skeleton.bones[i].rotation` directly to pose a figure at runtime — i.e. drive a figure from a stored joint-rotation map without baking animations.
- **Link:** https://threejs.org/docs/ · SkeletonHelper: https://threejs.org/docs/pages/SkeletonHelper.html · bone-orientation guide: https://mattrossman.com/2024/07/10/visualizing-threejs-bone-orientations/
- **License:** **MIT** (three.js) — commercial-OK. react-three-fiber MIT.
- **How we'd adapt:** Core of the web rendering. Load CC0/Anny/MakeHuman glTF figures, position two of them, set bone rotations from your position dataset, render interactively (rotate camera around the position in the graph view).

### @pixiv/three-vrm  ✅ MIT
- **What:** Loads/poses VRM avatars in three.js with a **standardized humanoid bone API** (`VRMHumanoid`) — set poses by canonical bone names regardless of source rig. Has a `bones.html` posing example.
- **Link:** https://github.com/pixiv/three-vrm · License: https://github.com/pixiv/three-vrm/blob/dev/LICENSE
- **License:** **MIT** — commercial-OK (the *library*; individual VRM *avatars* keep their own embedded license, see VRoid above).
- **How we'd adapt:** If you adopt VRM as the avatar format, this gives a clean, rig-agnostic posing API in the browser — nice for "set pose by joint name" semantics. Aesthetic caveat applies to anime avatars.

### MediaPipe Pose  ✅ Apache-2.0 — RECOMMENDED for pose-from-reference
- **What:** Google's real-time pose tracker. **33 3D landmarks** from a single RGB image/video. Runs in Python, desktop, and **in the browser (web/JS)**. (Its 3D landmarks are aligned to the GHUM body topology.)
- **Link:** https://github.com/google-ai-edge/mediapipe · Qualcomm/AI-hub card: https://aihub.qualcomm.com/models/mediapipe_pose
- **License:** **Apache 2.0** — commercial-OK, runs client-side too.
- **How we'd adapt:** Optional authoring aid — feed a reference photo/video of a jiu-jitsu position, get 3D landmarks, then **map landmarks → rig joint rotations** to roughly pose your figure (then hand-clean). Note: MediaPipe gives **landmark positions**, not joint *rotations*, so you still need an IK / landmark-to-rotation step (and it tracks **one person**, so two interacting bodies = two passes / occlusion issues).

### MMPose (OpenMMLab)  ✅ Apache-2.0
- **What:** Comprehensive pose-estimation toolbox; more accurate/configurable than MediaPipe, supports 2D/3D and multi-person, trainable.
- **Link:** https://mmpose.com/ · https://github.com/open-mmlab/mmpose
- **License:** **Apache 2.0** — commercial-OK.
- **How we'd adapt:** If you need **multi-person** pose extraction (both grapplers at once) with better accuracy, MMPose over MediaPipe. Heavier to run (server-side).

### OpenPose  ⚠️ NON-COMMERCIAL without paid license
- **What:** CMU's pioneering bottom-up multi-person 2D pose estimator.
- **Link:** https://github.com/CMU-Perceptual-Computing-Lab/openpose
- **License:** **Free for non-commercial/academic only; commercial use requires a paid CMU license.** **BLOCKER for SaaS.** Use MediaPipe or MMPose instead — both Apache-2.0.

### CMU Graphics Lab Motion Capture Database (BVH)  ◑ mostly OK — verify, don't resell
- **What:** The largest free mocap library. 2500+ motions in C3D/ASF-AMC/**BVH**.
- **Link:** http://mocap.cs.cmu.edu/
- **License:** Effectively **public-domain / free**, **including in commercially-sold products**, BUT **you may not resell the data directly (even converted).** Using motions to pose figures inside your app is fine; shipping the BVH files as a product is not. Original terms predate modern licenses — **review on the CMU site before shipping.**
- **How we'd adapt:** Source ground/wrestling/takedown motions, retarget onto your rig (Auto-Rig Pro / Rigify / Mixamo), scrub to a key frame for each position. Good free pose source.

### AMASS  ⚠️ RESEARCH-ONLY — BLOCKER
- **What:** 42h of mocap unified onto **SMPL+H** with soft-tissue (DMPLs). The standard 3D-human motion dataset in research.
- **Link:** https://amass.is.tue.mpg.de/ · License: https://amass.is.tue.mpg.de/license.html
- **License:** **Non-commercial scientific research / education / non-commercial artistic only.** Commercial via `ps-licensing@tue.mpg.de`. **Double blocker:** the dataset itself *and* its SMPL+H parameterization are research-only. **Do not use commercially.**
- **How we'd adapt:** Don't, for a commercial product. Use CMU BVH or Mixamo instead.

---

## Part 4 — Retargeting / transfer-a-pose-onto-a-body-mesh

Retargeting = mapping joint rotations from a source skeleton (mocap or another rig) onto your target rig with different bone names/orientations/proportions.

- **Auto-Rig Pro "Remap"** (paid ~$40, commercial-OK) — universal bone remapper, BVH/FBX in, works across Rigify/Mixamo/custom rigs. Most reliable. https://www.lucky3d.fr/auto-rig-pro/doc/remap_doc.html
- **Mixamo auto-rig + Control Rig** (free, royalty-free) — retargets its own animation library onto any uploaded humanoid automatically; effectively does retargeting for you for Mixamo motions. https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html
- **Blender built-in / Rigify + free retarget add-ons** (GPL, output yours) — e.g. community retargeting tools; cheaper but fiddlier than ARP.
- **three.js runtime retargeting** — `THREE.SkeletonUtils.retargetClip` / `retarget` can remap an animation/pose between skeletons **in the browser**, and `three-vrm`'s humanoid API lets you set canonical bone poses rig-agnostically. Lets you ship one pose dataset and apply it to different body meshes client-side. (three.js MIT.) https://threejs.org/docs/
- **Anny → Mixamo interoperability** (Apache-2.0) — Anny's paper documents retargeting to/from Mixamo rigs, so Anny fits the same retarget toolchain. https://arxiv.org/html/2511.03589v1

---

## Recommended pipeline for "O Mapa do Jiu-Jitsu" (all commercial-clean)

**Authoring (offline, in Blender):**
1. Generate two base figures with **MPFB2** (CC0 output) — or use **Quaternius** CC0 characters for speed, or **Anny** (Apache-2.0) if you want a programmatic/parametric body.
2. Rig with **Rigify** (free) or **Auto-Rig Pro** ($40); or auto-rig via **Mixamo** (royalty-free).
3. Pose the two figures into each jiu-jitsu position — manually, or by retargeting **CMU BVH** / **Mixamo** motions and scrubbing to a key frame. Optionally bootstrap a rough pose from a reference photo via **MediaPipe** (Apache-2.0) / **MMPose** (Apache-2.0).
4. Export each position as `.glb` (glTF skinned), or store **per-joint rotation maps** as your position dataset.

**Runtime (Next.js web app):**
5. Render with **three.js / react-three-fiber** (MIT). Load the two figures; either play the baked `.glb` pose or set bone rotations from the stored joint-rotation dataset. Use `SkeletonUtils` retargeting if you want one pose dataset across multiple body meshes. Camera orbits each position node in the graph.

**Why this is safe:** every component is CC0, Apache-2.0, MIT, royalty-free (Mixamo), or a paid-but-output-yours tool (ARP). **No SMPL/SMPL-X/STAR/AMASS/OpenPose anywhere in the commercial path.**

---

## License landmine summary (read this twice)

| Tech | Commercial? | Verdict |
|------|-------------|---------|
| **SMPL / SMPL-X (full model) / STAR** | ❌ research-only; paid Meshcapade license | **AVOID** in commercial product |
| **SMPL-X "Body" subset** | ◑ CC-BY-4.0 but excludes the shape params | partial, easy to misuse — avoid |
| **GHUM/GHUML model weights** | ⚠️ custom Google terms, not clean Apache | avoid the model asset; MediaPipe runtime is fine |
| **AMASS dataset** | ❌ research-only | **AVOID** |
| **OpenPose** | ❌ paid CMU commercial license | **AVOID** — use MediaPipe/MMPose |
| **Ready Player Me** | ◑ free only as registered developer; no NFTs | OK with registration |
| **VRoid/VRM avatars** | ◑ per-model author terms | honor embedded license |
| **MakeHuman / MPFB2 output** | ✅ CC0 | **USE** |
| **Anny** | ✅ Apache-2.0 | **USE** |
| **Quaternius** | ✅ CC0 | **USE** |
| **Mixamo** | ✅ royalty-free (no redistribution of raw files; no ML training) | **USE** |
| **CMU BVH mocap** | ◑ free incl. commercial products; cannot resell data | **USE** (don't resell BVH) |
| **three.js / r3f / three-vrm** | ✅ MIT | **USE** |
| **MediaPipe / MMPose** | ✅ Apache-2.0 | **USE** |
| **Rigify (Blender)** | ✅ GPL tool, output yours | **USE** |
| **Auto-Rig Pro** | ✅ paid $40, output yours | **USE** if needed |

---

## Sources
- SMPL model license — https://smpl.is.tue.mpg.de/modellicense.html ; Meshcapade wiki — https://github.com/Meshcapade/wiki/blob/main/wiki/SMPL.md
- SMPL-X — https://smpl-x.is.tue.mpg.de/ ; model license https://smpl-x.is.tue.mpg.de/modellicense.html ; body (CC) license https://smpl-x.is.tue.mpg.de/bodylicense.html
- SMPL Blender addon license — https://github.com/Meshcapade/SMPL_blender_addon/blob/main/LICENSE.md
- STAR — https://github.com/ahmedosman/STAR
- GHUM — https://github.com/google-research/google-research/tree/master/ghum ; https://research.google/pubs/pub50649/
- Anny Body model — https://arxiv.org/html/2511.03589v1
- MakeHuman license — https://static.makehumancommunity.org/about/license.html
- MPFB2 — https://github.com/makehumancommunity/mpfb2/ ; https://extensions.blender.org/add-ons/mpfb/ ; https://www.cgchannel.com/2025/03/check-out-open-source-blender-character-generation-plugin-mpfb-2/
- Mixamo FAQ/license — https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html
- Ready Player Me terms — https://docs.readyplayer.me/ready-player-me/support/terms-of-use
- VRoid/VRM license — https://vroid.pixiv.help/hc/en-us/articles/360016417013 ; https://vroid.com/en/studio
- Quaternius — https://quaternius.com/packs/universalbasecharacters.html ; https://quaternius.com/packs/universalanimationlibrary2.html
- Auto-Rig Pro — https://superhivemarket.com/products/auto-rig-pro/ ; remap https://www.lucky3d.fr/auto-rig-pro/doc/remap_doc.html
- AMASS — https://amass.is.tue.mpg.de/ ; license https://amass.is.tue.mpg.de/license.html ; https://github.com/nghorbani/amass
- CMU mocap — http://mocap.cs.cmu.edu/
- MediaPipe — https://github.com/google-ai-edge/mediapipe ; https://aihub.qualcomm.com/models/mediapipe_pose
- MMPose — https://mmpose.com/ ; https://github.com/open-mmlab/mmpose
- OpenPose — https://github.com/CMU-Perceptual-Computing-Lab/openpose
- three.js SkeletonHelper — https://threejs.org/docs/pages/SkeletonHelper.html ; bone orientation guide https://mattrossman.com/2024/07/10/visualizing-threejs-bone-orientations/
- @pixiv/three-vrm — https://github.com/pixiv/three-vrm ; license https://github.com/pixiv/three-vrm/blob/dev/LICENSE
