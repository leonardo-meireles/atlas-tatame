"use client";

/**
 * Editor de pose MVP — drei TransformControls em cada junta. Drag = move junta XYZ.
 * Exporta JSON pra dropar em public/figura/poses/<slug>.json. Iterar com agentes IA
 * (S2): agent extrai pose de vídeo → seed aqui → owner refina → export.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PivotControls, Grid } from "@react-three/drei";
import * as THREE from "three";
import { loadPose, PLAYER, type PoseFrame } from "@/lib/figura/figura-data";
import { SKELETON } from "@/lib/figura/pose";

type Coord = [number, number, number];
type Fighter = Record<string, Coord>;

// y-up pra render (z-up no JSON). Remap: [x, z, y] (altura no y).
function zToY(c: Coord): Coord {
  return [c[0], c[2], c[1]];
}
function yToZ(c: Coord): Coord {
  return [c[0], c[2], c[1]];
}

function Bone({ from, to, cor }: { from: Coord; to: Coord; cor: string }) {
  const geom = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const g = new THREE.BufferGeometry().setFromPoints([a, b]);
    return g;
  }, [from, to]);
  return (
    <line>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color={cor} linewidth={3} />
    </line>
  );
}

function Joint({
  pos,
  cor,
  selected,
  onSelect,
  onDrag,
}: {
  pos: Coord;
  cor: string;
  selected: boolean;
  onSelect: () => void;
  onDrag: (next: Coord) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  return (
    <PivotControls
      anchor={[0, 0, 0]}
      offset={pos}
      visible={selected}
      depthTest={false}
      lineWidth={2}
      scale={0.15}
      activeAxes={[true, true, true]}
      onDrag={(m) => {
        const p = new THREE.Vector3().setFromMatrixPosition(m);
        onDrag([p.x, p.y, p.z]);
      }}
    >
      <mesh
        ref={ref}
        position={pos}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[selected ? 0.05 : 0.035, 16, 16]} />
        <meshBasicMaterial color={selected ? "#fff" : cor} />
      </mesh>
    </PivotControls>
  );
}

function FighterRig({
  fighter,
  cor,
  onMove,
  selected,
  onSelect,
}: {
  fighter: Fighter;
  cor: string;
  onMove: (joint: string, next: Coord) => void;
  selected: string | null;
  onSelect: (joint: string | null) => void;
}) {
  return (
    <>
      {SKELETON.filter(([a, b]) => fighter[a] && fighter[b]).map(([a, b]) => (
        <Bone key={`${a}-${b}`} from={zToY(fighter[a])} to={zToY(fighter[b])} cor={cor} />
      ))}
      {Object.entries(fighter).map(([j, c]) => (
        <Joint
          key={j}
          pos={zToY(c)}
          cor={cor}
          selected={selected === j}
          onSelect={() => onSelect(j)}
          onDrag={(next) => onMove(j, yToZ(next))}
        />
      ))}
    </>
  );
}

function Scene({
  pose,
  setPose,
  ativo,
  setAtivo,
}: {
  pose: PoseFrame;
  setPose: (p: PoseFrame) => void;
  ativo: { player: "p0" | "p1"; joint: string } | null;
  setAtivo: (a: { player: "p0" | "p1"; joint: string } | null) => void;
}) {
  return (
    <>
      <OrbitControls makeDefault />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={0.8} />
      <Grid args={[10, 10]} cellColor="#444" sectionColor="#666" infiniteGrid />
      <FighterRig
        fighter={pose.p0 as Fighter}
        cor={PLAYER.top.base}
        selected={ativo?.player === "p0" ? ativo.joint : null}
        onSelect={(j) => setAtivo(j ? { player: "p0", joint: j } : null)}
        onMove={(j, c) => setPose({ ...pose, p0: { ...(pose.p0 as Fighter), [j]: c } })}
      />
      <FighterRig
        fighter={pose.p1 as Fighter}
        cor={PLAYER.bottom.base}
        selected={ativo?.player === "p1" ? ativo.joint : null}
        onSelect={(j) => setAtivo(j ? { player: "p1", joint: j } : null)}
        onMove={(j, c) => setPose({ ...pose, p1: { ...(pose.p1 as Fighter), [j]: c } })}
      />
    </>
  );
}

export function PoseEditor({ slug }: { slug: string }) {
  const [pose, setPose] = useState<PoseFrame | null>(null);
  const [ativo, setAtivo] = useState<{ player: "p0" | "p1"; joint: string } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    loadPose(slug)
      .then((p) => (p ? setPose(p) : setErro(`Pose "${slug}" não encontrada.`)))
      .catch((e) => setErro(String(e)));
  }, [slug]);

  function exportar() {
    if (!pose) return;
    const blob = new Blob([JSON.stringify(pose)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (erro) {
    return <div className="p-6 text-[var(--ink)]">{erro}</div>;
  }

  return (
    <div className="flex h-[calc(100dvh-3.45rem)] w-full">
      <aside className="w-64 shrink-0 border-r border-[var(--paper-edge)] bg-[var(--paper-2)] p-4 text-[var(--ink)]">
        <h2 className="font-display text-lg font-bold">Studio · {slug}</h2>
        <p className="mt-2 text-xs text-[var(--ink-soft)]">
          Clique numa junta pra ativar gizmo. Arraste pra mover. Export salva JSON do frame.
        </p>
        {ativo && (
          <div className="mt-4 rounded border border-[var(--paper-edge)] bg-[var(--paper)] p-2 text-xs">
            <div className="font-mono">{ativo.player} · {ativo.joint}</div>
            {pose && (
              <pre className="mt-1 text-[10px]">
                {JSON.stringify((pose[ativo.player] as Fighter)[ativo.joint])}
              </pre>
            )}
          </div>
        )}
        <button
          onClick={exportar}
          disabled={!pose}
          className="mt-4 w-full rounded bg-[var(--ink)] px-3 py-2 text-sm font-semibold text-[var(--paper)] disabled:opacity-50"
        >
          Export {slug}.json
        </button>
        <p className="mt-3 text-[10px] text-[var(--ink-faint)]">
          Drop em <code>public/figura/poses/{slug}.json</code>
        </p>
      </aside>
      <div className="min-w-0 flex-1">
        {pose ? (
          <Canvas camera={{ position: [3, 2, 3], fov: 35 }}>
            <Scene pose={pose} setPose={setPose} ativo={ativo} setAtivo={setAtivo} />
          </Canvas>
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--ink-soft)]">Carregando…</div>
        )}
      </div>
    </div>
  );
}
