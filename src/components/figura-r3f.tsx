"use client";

/**
 * Viewer 3D do "novo GrappleMap" ao vivo. Dois lutadores como cápsulas afuniladas
 * + esferas nas juntas, toon + contorno — legível "de cara". Consome a lógica pura
 * (geometry.ts / anim.ts) e os dados de pose/transição do GrappleMap.
 *
 * Cor: OSSO diz QUEM (clay = por cima / ardósia = por baixo). JUNTA diz O QUÊ
 * (osso = mão/pegada, grafite = pé/base) — cores neutras, fora do vocabulário do app.
 *
 * Dois modos:
 *  - `slug`: pose estática orbitável.
 *  - `transicao`: sequência de keyframes → ANIMA a técnica (o que o GrappleMap tinha).
 *
 * Eixos: dados são z-up; three é y-up. Remapeia [x,y,z]→[x,z,y] antes de montar.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, invalidate as canvasInvalidate } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { topFighter, type Pose, type Fighter } from "@/lib/figura/pose";
import { buildFigura, type JointRole, type Vec3 } from "@/lib/figura/geometry";
import { sampleSequence } from "@/lib/figura/anim";
import { bestCamera, fixedNorm, frameSpan } from "@/lib/figura/framing";
import { loadPose, loadTrans, temPose3D, temTransicao3D, PLAYER } from "@/lib/figura/figura-data";

/** Cores do lutador: base (corpo), dark (contorno), hand (mãos = tom claro do próprio). */
function colorsFor(top: boolean) {
  return top ? PLAYER.top : PLAYER.bottom;
}
/** Cor da junta: mão = tom claro do personagem (pop + amarrada ao dono); resto = base. */
function jointColor(role: JointRole, c: { base: string; hand: string }): string {
  return role === "mao" ? c.hand : c.base;
}

/** z-up (dados) → y-up (three): altura = z. */
function toYUp(p: Pose): Pose {
  const out: Record<string, Fighter> = {};
  for (const [pk, f] of Object.entries(p)) {
    const nf: Record<string, Vec3> = {};
    for (const [jn, [x, y, z]] of Object.entries(f)) nf[jn] = [x, z, y];
    out[pk] = nf;
  }
  return out;
}

function applyNorm(p: Pose, center: Vec3, span: number): Pose {
  const out: Record<string, Fighter> = {};
  for (const [pk, f] of Object.entries(p)) {
    const nf: Record<string, Vec3> = {};
    for (const [jn, j] of Object.entries(f))
      nf[jn] = [(j[0] - center[0]) / span, (j[1] - center[1]) / span, (j[2] - center[2]) / span];
    out[pk] = nf;
  }
  return out;
}

/** Rampa toon a partir de paradas de cor (sRGB). Banding nítido entre passos. */
function rampTexture(stops: string[]): THREE.Texture {
  const data = new Uint8Array(stops.length * 4);
  stops.forEach((h, i) => {
    const n = parseInt(h.slice(1), 16);
    data[i * 4] = (n >> 16) & 255;
    data[i * 4 + 1] = (n >> 8) & 255;
    data[i * 4 + 2] = n & 255;
    data[i * 4 + 3] = 255;
  });
  const tex = new THREE.DataTexture(data, stops.length, 1, THREE.RGBAFormat);
  tex.needsUpdate = true;
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

// Rampa toon NEUTRA-QUENTE (multiplicador): material.color = cor do corpo, a rampa só
// modela o volume em 4 passos com sombra levemente quente → esculpido, não achatado,
// sem estourar pra branco. Mesma rampa serve corpo e junta (multiplica a cor de cada).
const BODY_STOPS = ["#5b5550", "#938b82", "#c7c0b6", "#fbf6ee"]; // 4 passos, branco quente no topo

// Textura de rampa toon: singleton de módulo. É idêntica em todo Canvas/instância e
// imutável — criar uma por componente multiplicaria DataTextures na GPU sem ganho.
// Persiste intencionalmente pelo tempo de vida do app (sem dispose).
const RAMP_TEXTURE = rampTexture(BODY_STOPS);

/** Raio de exibição da junta com ênfase nas que CARREGAM significado (mão/pé). */
function jointDisplayRadius(role: JointRole, radius: number): number {
  return role === "mao" || role === "pe" ? radius * 1.5 : radius;
}

// ---------------------------------------------------------------------------
// Figura ESTÁTICA (declarativa)
// ---------------------------------------------------------------------------

function Figura({ fighter, cores }: { fighter: Fighter; cores: { base: string; dark: string; hand: string } }) {
  const { base, dark } = cores;
  const geo = useMemo(() => buildFigura(fighter), [fighter]);
  // Materiais pré-alocados (sem `new THREE.Color` inline no JSX): senão cada re-render
  // alocaria novos objetos Color por osso e por junta (12-20 juntas × 2 lutadores).
  const bodyMat = useMemo(() => new THREE.MeshToonMaterial({ color: new THREE.Color(base), gradientMap: RAMP_TEXTURE }), [base]);
  const outlineMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(dark), side: THREE.BackSide }), [dark]);
  const jointMats = useMemo(
    () => geo.joints.map((j) => new THREE.MeshToonMaterial({ color: new THREE.Color(jointColor(j.role, cores)), gradientMap: RAMP_TEXTURE })),
    [geo.joints, cores],
  );
  // Materiais criados aqui (não pelo R3F via JSX) não recebem dispose automático ao
  // desmontar → liberar explicitamente quando mudarem ou no unmount.
  useEffect(() => {
    return () => {
      bodyMat.dispose();
      outlineMat.dispose();
      for (const m of jointMats) m.dispose();
    };
  }, [bodyMat, outlineMat, jointMats]);
  return (
    <group>
      {geo.bones.map((b, i) => (
        <group key={`b${i}`} position={b.position} quaternion={b.quaternion}>
          <mesh material={bodyMat} castShadow>
            <cylinderGeometry args={[b.radius1, b.radius0, b.length, 10]} />
          </mesh>
          <mesh material={outlineMat} scale={1.14}>
            <cylinderGeometry args={[b.radius1, b.radius0, b.length, 10]} />
          </mesh>
        </group>
      ))}
      {geo.joints.map((j, i) => {
        const r = jointDisplayRadius(j.role, j.radius);
        return (
          <group key={j.name} position={j.position}>
            <mesh castShadow material={jointMats[i]}>
              <sphereGeometry args={[r, 12, 10]} />
            </mesh>
            <mesh material={outlineMat} scale={1.16}>
              <sphereGeometry args={[r, 12, 10]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Figura ANIMADA (imperativa: topologia fixa, useFrame só mexe transform)
// ---------------------------------------------------------------------------

const DUR = 2.8; // seg de play
const HOLD = 0.9; // pausa no fim antes de repetir

/** smoothstep com pausa no fim; loopa. */
function loopT(elapsed: number): number {
  const cycle = DUR + HOLD;
  const p = elapsed % cycle;
  if (p >= DUR) return 1;
  const x = p / DUR;
  return x * x * (3 - 2 * x);
}

function CenaAnimada({ frames, top, playing, speed }: { frames: Pose[]; top: string; playing: boolean; speed: number }) {
  const invalidate = useThree((s) => s.invalidate);
  const { center, span } = useMemo(() => fixedNorm(frames), [frames]);
  // Respeita prefers-reduced-motion: congela no frame final em vez de loopar.
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  // topologia (raios/cores) constante — montada a partir do 1º frame normalizado.
  // Cada osso carrega o par de juntas `a`/`b` e cada junta o `name`: o casamento por
  // frame é por NOME (não por índice), então mudança de ordem/presença de chaves entre
  // frames nunca troca a esfera de lugar (era a fonte da "cabeça descolada").
  // Os materiais de junta (jointMat) também ficam pré-alocados aqui — antes o
  // <meshToonMaterial color={new THREE.Color(...)}> no JSX alocava um Color por junta
  // a cada render da lista.
  const topo = useMemo(() => {
    const f0 = applyNorm(frames[0], center, span);
    return Object.keys(f0).map((pk) => {
      const g = buildFigura(f0[pk]);
      const c = colorsFor(pk === top);
      return {
        pk,
        bodyMat: new THREE.MeshToonMaterial({ color: new THREE.Color(c.base), gradientMap: RAMP_TEXTURE }),
        outlineMat: new THREE.MeshBasicMaterial({ color: new THREE.Color(c.dark), side: THREE.BackSide }),
        bones: g.bones.map((b) => ({ key: `${b.a}__${b.b}`, a: b.a, b: b.b, r0: b.radius0, r1: b.radius1 })),
        joints: g.joints.map((j) => ({
          name: j.name,
          radius: jointDisplayRadius(j.role, j.radius),
          jointMat: new THREE.MeshToonMaterial({ color: new THREE.Color(jointColor(j.role, c)), gradientMap: RAMP_TEXTURE }),
        })),
      };
    });
  }, [frames, center, span, top]);

  // Materiais do topo são criados manualmente → dispose explícito no unmount/recompute.
  useEffect(() => {
    return () => {
      for (const fig of topo) {
        fig.bodyMat.dispose();
        fig.outlineMat.dispose();
        for (const j of fig.joints) j.jointMat.dispose();
      }
    };
  }, [topo]);

  // Refs keyed por NOME (não por índice) → casamento estável entre frames.
  const boneRefs = useRef<Record<string, Record<string, THREE.Group>>>({});
  const jointRefs = useRef<Record<string, Record<string, THREE.Group>>>({});
  const elapsed = useRef<number>(0); // tempo acumulado (escalado por velocidade, pausável)

  useFrame((_, delta) => {
    // frameloop='demand': só avança o tempo e pede novo frame quando está tocando.
    // Pausado ou reduced-motion → não há invalidate aqui, GPU dorme (o congelamento
    // no frame final em reduced é pintado uma vez via invalidate no efeito abaixo).
    if (!reduced && playing) {
      elapsed.current += delta * speed;
      invalidate();
    }
    const t = reduced ? 1 : loopT(elapsed.current);
    const pose = applyNorm(sampleSequence(frames, t), center, span);
    topo.forEach((fig) => {
      const f = pose[fig.pk];
      if (!f) return;
      const g = buildFigura(f);
      const bs = boneRefs.current[fig.pk] ?? {};
      for (const b of g.bones) {
        const grp = bs[`${b.a}__${b.b}`];
        if (!grp) continue; // osso ausente neste frame → não força transform errado.
        grp.position.set(b.position[0], b.position[1], b.position[2]);
        grp.quaternion.set(b.quaternion[0], b.quaternion[1], b.quaternion[2], b.quaternion[3]);
        grp.scale.y = b.length;
      }
      const js = jointRefs.current[fig.pk] ?? {};
      for (const j of g.joints) {
        js[j.name]?.position.set(j.position[0], j.position[1], j.position[2]);
      }
    });
  });

  // Em frameloop='demand', uma mudança de play/speed (ou a montagem em reduced-motion)
  // precisa de ao menos um frame pintado: o useFrame só roda quando há invalidate.
  // Ao retomar o play, o loop de useFrame se auto-alimenta; aqui garantimos o kick
  // inicial e o repaint quando pausa/velocidade mudam.
  useEffect(() => {
    invalidate();
  }, [invalidate, playing, speed, reduced, topo]);

  return (
    <>
      {topo.map((fig) => {
        boneRefs.current[fig.pk] ??= {};
        jointRefs.current[fig.pk] ??= {};
        return (
          <group key={fig.pk}>
            {fig.bones.map((b) => (
              <group key={`b:${b.key}`} ref={(el) => { if (el) boneRefs.current[fig.pk][b.key] = el; }}>
                {/* cilindro altura 1 → scale.y = comprimento por frame */}
                <mesh material={fig.bodyMat} castShadow>
                  <cylinderGeometry args={[b.r1, b.r0, 1, 10]} />
                </mesh>
                <mesh material={fig.outlineMat} scale={1.14}>
                  <cylinderGeometry args={[b.r1, b.r0, 1, 10]} />
                </mesh>
              </group>
            ))}
            {fig.joints.map((j) => (
              <group key={`j:${j.name}`} ref={(el) => { if (el) jointRefs.current[fig.pk][j.name] = el; }}>
                <mesh castShadow material={j.jointMat}>
                  <sphereGeometry args={[j.radius, 12, 10]} />
                </mesh>
                <mesh material={fig.outlineMat} scale={1.16}>
                  <sphereGeometry args={[j.radius, 12, 10]} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Casca do Canvas
// ---------------------------------------------------------------------------

/** Sob frameloop='demand', meshes recém-montados NÃO repintam sozinhos — sem isto a
 *  pose estática nasce invisível até o usuário orbitar. Faz um BURST de invalidates por
 *  ~1.5s após montar/trocar `dep` (cobre o load async da pose + o assentar do damping),
 *  depois para → a GPU volta a dormir (economia do demand preservada). */
function Kick({ dep }: { dep: unknown }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let n = 0;
    let raf = 0;
    const tick = () => {
      invalidate();
      if (++n < 90) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [dep, invalidate]);
  return null;
}

function Luzes() {
  return (
    <>
      {/* Atmosfera de gi quente: céu cru claro / quique quente do tatame por baixo. */}
      <hemisphereLight args={["#fbf1de", "#c8a98a", 0.5]} />
      <ambientLight intensity={0.3} color="#fff5e6" />
      {/* Key quente (sol de dojo) + fill frio sutil pra dar volume sem esfriar a argila. */}
      <directionalLight position={[1.8, 3.2, 2]} intensity={1.35} color="#fff1dc" castShadow />
      <directionalLight position={[-2, 1, -1.2]} intensity={0.5} color="#e2ecff" />
      {/* Rim light de trás/alto: lambe o contorno superior e SEPARA os dois lutadores
          entrelaçados (borda clara entre corpos sobrepostos). Frio-neutro, baixa
          intensidade — não estoura a toon nem reescreve o volume da key. */}
      <directionalLight position={[-0.6, 2.6, -2.6]} intensity={0.55} color="#eaf1ff" />
    </>
  );
}

/** Menor altura (y) de qualquer junta — chão pra ancorar a sombra de contato. */
function floorOf(p: Pose): number {
  let m = Infinity;
  for (const f of Object.values(p)) for (const j of Object.values(f)) if (j[1] < m) m = j[1];
  return m;
}

type AnimData = { kind: "anim"; framesY: Pose[]; top: string; cam: { position: Vec3; target: Vec3 }; floor: number };
type EstatData = { kind: "estat"; pose: Pose; top: string; cam: { position: Vec3; target: Vec3 }; floor: number };

export default function FiguraR3F({
  slug,
  transicao,
  frames,
}: {
  slug?: string;
  transicao?: string;
  /** Frames já carregados (z-up) — bypassa loaders. Usado pelo DrillPlayer pra animar
   *  uma sequência arbitrária de poses (drill) sem fetch por slug aqui. */
  frames?: Pose[];
}) {
  // Lazy-load: busca a pose/sequência do nó focado (arquivo por-slug em public/figura/).
  // status: "loading" (buscando) | "ready" (active populado) | "vazio" (loader falhou/
  // retornou vazio → placeholder honesto em vez de sumir sem explicação).
  const [active, setActive] = useState<AnimData | EstatData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "vazio">("loading");
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  // Tags de contexto pro enquadramento: o próprio slug/transição já carrega a posição
  // (guarda-fechada, meia-guarda, ...__montada, ...__cem-quilos). Quebra em tokens
  // pra cameraHintForTags casar "guarda"/"montada"/"passagem"/etc.
  const camTags = useMemo(
    () => (transicao ?? slug ?? "").split(/[^a-zà-ú0-9]+/i).filter(Boolean),
    [transicao, slug],
  );

  useEffect(() => {
    let cancelled = false;
    const fromFrames = (framesZ: Pose[]) => {
      if (framesZ.length === 0) {
        setStatus("vazio");
        return;
      }
      const top = topFighter(framesZ[0]);
      const framesY = framesZ.map(toYUp);
      const { center, span } = fixedNorm(framesY);
      let camFrame = framesY[0];
      let maxS = 0;
      for (const fr of framesY) {
        const s = frameSpan(fr);
        if (s > maxS) { maxS = s; camFrame = fr; }
      }
      const camPose = applyNorm(camFrame, center, span);
      let floor = Infinity;
      for (const fr of framesY) floor = Math.min(floor, floorOf(applyNorm(fr, center, span)));
      setActive({ kind: "anim", framesY, top, cam: bestCamera(camPose, camTags), floor });
      setStatus("ready");
    };
    (async () => {
      try {
        setStatus("loading");
        if (frames && frames.length >= 2) {
          fromFrames(frames);
        } else if (transicao && temTransicao3D(transicao)) {
          const framesZ = (await loadTrans(transicao)) as unknown as Pose[] | null;
          if (cancelled) return;
          if (!framesZ || framesZ.length === 0) {
            setStatus("vazio");
            return;
          }
          fromFrames(framesZ);
        } else if (slug && temPose3D(slug)) {
          const raw = (await loadPose(slug)) as unknown as Pose | null;
          if (cancelled) return;
          if (!raw || Object.keys(raw).length === 0) {
            setStatus("vazio");
            return;
          }
          const poseY = toYUp(raw);
          const { center, span } = fixedNorm([poseY]);
          const pose = applyNorm(poseY, center, span);
          setActive({ kind: "estat", pose, top: topFighter(raw), cam: bestCamera(pose, camTags), floor: floorOf(pose) });
          setStatus("ready");
        } else if (!cancelled) {
          // Nenhuma fonte 3D disponível pra este slug/transição.
          setActive(null);
          setStatus("vazio");
        }
      } catch {
        // loadPose/loadTrans falhou (fetch, parse, módulo ausente) — não some calado.
        if (!cancelled) setStatus("vazio");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, transicao, frames, camTags]);

  if (status === "vazio") return <FiguraIndisponivel />;
  if (!active) return null;
  const anim = active.kind === "anim" ? active : null;
  const estat = active.kind === "estat" ? active : null;

  return (
    <div className="relative h-full w-full">
      {/* frameloop='demand': sem render contínuo a 60fps. A GPU só trabalha quando algo
          pede (animação tocando, nova pose, órbita do usuário) — pose estática ou card
          pausado custam ~0. dpr capado em 1.75 (em vez de 2): a figura toon não ganha
          nitidez perceptível no topo retina e o custo de fill cai ~20%. */}
      <Canvas frameloop="demand" shadows dpr={[1, 1.75]} camera={{ fov: 42, near: 0.01, far: 20, position: active.cam.position }} style={{ width: "100%", height: "100%" }}>
        <Kick dep={active} />
        <Luzes />
        {anim ? (
          <CenaAnimada frames={anim.framesY} top={anim.top} playing={playing} speed={speed} />
        ) : (
          estat &&
          Object.entries(estat.pose).map(([pk, f]) => (
            <Figura key={pk} fighter={f} cores={colorsFor(pk === estat.top)} />
          ))
        )}
        {/* ContactShadows só na pose ESTÁTICA: na animação o lutador se move e a sombra
            fixa no chão vira artefato (não acompanha). resolution=256 + blur=1.8 bastam
            pra um borrão difuso de contorno — é sombra de contato, não detalhe. */}
        {estat && (
          <ContactShadows position={[active.cam.target[0], active.floor - 0.02, active.cam.target[2]]} scale={2.4} blur={1.8} opacity={0.42} far={1} color="#3a2c1e" resolution={256} />
        )}
        {/* Câmera NÃO é re-aplicada em replay (sem key/reset) → POV do usuário persiste.
            onChange invalida sob frameloop='demand' pra a órbita (com damping) repintar. */}
        <OrbitControls
          target={active.cam.target}
          enableDamping
          dampingFactor={0.08}
          minDistance={0.4}
          maxDistance={6}
          makeDefault
          onChange={() => canvasInvalidate()}
        />
      </Canvas>
      {anim && (
        <ControlesAnim playing={playing} speed={speed} onTogglePlay={() => setPlaying((p) => !p)} onSpeed={setSpeed} />
      )}
    </div>
  );
}

/** Placeholder honesto quando não há figura 3D pra mostrar (loader falhou ou veio vazio).
 *  Leve, sem Canvas — diz o que houve em vez de sumir sem explicação. pt-BR, tokens só. */
function FiguraIndisponivel() {
  return (
    <div
      role="img"
      aria-label="Figura indisponível"
      className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center"
    >
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="6" r="2.4" />
        <path d="M12 8.4v6m0 0-3.4 4m3.4-4 3.4 4M6 11.4l6-1.4 6 1.4" />
      </svg>
      <span className="text-[length:var(--step-xs)] font-medium text-[var(--ink-soft)]">Figura indisponível</span>
    </div>
  );
}

/** Controles de playback da técnica — pause/play + velocidade. HTML sobre o canvas. */
function ControlesAnim({
  playing,
  speed,
  onTogglePlay,
  onSpeed,
}: {
  playing: boolean;
  speed: number;
  onTogglePlay: () => void;
  onSpeed: (s: number) => void;
}) {
  const VELS = [0.25, 0.5, 0.75, 1];
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-[var(--paper-edge)] bg-[color-mix(in_oklch,var(--paper)_88%,transparent)] px-1.5 py-1 backdrop-blur-sm">
        <button
          onClick={onTogglePlay}
          aria-label={playing ? "Pausar" : "Tocar"}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--paper-2)]"
        >
          {playing ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <span className="mx-0.5 h-4 w-px bg-[var(--paper-edge)]" />
        {VELS.map((v) => {
          const on = Math.abs(v - speed) < 0.01;
          return (
            <button
              key={v}
              onClick={() => onSpeed(v)}
              className="rounded-full px-2 py-[3px] text-[0.62rem] font-bold tabular-nums tracking-tight transition-colors"
              style={{
                background: on ? "var(--clay)" : "transparent",
                color: on ? "white" : "var(--ink-soft)",
              }}
            >
              {v}×
            </button>
          );
        })}
      </div>
    </div>
  );
}
