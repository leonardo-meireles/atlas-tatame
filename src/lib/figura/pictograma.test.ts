import { describe, it, expect } from "vitest";
import { buildPictograma, type Pose } from "./pictograma";

// pose mínima de 2 players (z-up): p0 cabeça mais alta = top.
const pose: Pose = {
  p0: {
    Head: [0, 0, 1.0], Neck: [0, 0, 0.8], Core: [0, 0, 0.5],
    LeftShoulder: [0.2, 0, 0.8], RightShoulder: [-0.2, 0, 0.8],
    LeftElbow: [0.3, 0, 0.6], LeftWrist: [0.35, 0, 0.4], LeftHand: [0.37, 0, 0.35],
    RightElbow: [-0.3, 0, 0.6], RightWrist: [-0.35, 0, 0.4], RightHand: [-0.37, 0, 0.35],
    LeftHip: [0.12, 0, 0.45], RightHip: [-0.12, 0, 0.45],
    LeftKnee: [0.14, 0, 0.2], LeftAnkle: [0.14, 0, 0.02], LeftToe: [0.18, 0, 0.0],
    RightKnee: [-0.14, 0, 0.2], RightAnkle: [-0.14, 0, 0.02], RightToe: [-0.18, 0, 0.0],
  },
  p1: {
    Head: [0.5, 0.3, 0.3], Neck: [0.4, 0.3, 0.3], Core: [0.2, 0.3, 0.25],
    LeftShoulder: [0.4, 0.4, 0.35], RightShoulder: [0.4, 0.2, 0.35],
    LeftHip: [0.1, 0.4, 0.2], RightHip: [0.1, 0.2, 0.2],
    LeftKnee: [-0.1, 0.4, 0.25], LeftAnkle: [-0.3, 0.4, 0.3], LeftToe: [-0.35, 0.4, 0.3],
    RightKnee: [-0.1, 0.2, 0.25], RightAnkle: [-0.3, 0.2, 0.3], RightToe: [-0.35, 0.2, 0.3],
  },
};

describe("buildPictograma", () => {
  const lay = buildPictograma(pose, { width: 760, height: 600 });

  it("escolhe top = cabeça mais alta", () => {
    expect(lay.top).toBe("p0");
    expect(lay.bottom).toBe("p1");
  });

  it("mantém tudo dentro do quadro", () => {
    for (const fig of Object.values(lay.figuras)) {
      for (const [[x1, y1], [x2, y2]] of fig.bones) {
        for (const v of [x1, y1, x2, y2]) expect(Number.isFinite(v)).toBe(true);
        expect(x1).toBeGreaterThanOrEqual(0); expect(x1).toBeLessThanOrEqual(760);
        expect(y1).toBeGreaterThanOrEqual(0); expect(y1).toBeLessThanOrEqual(600);
      }
      expect(fig.head.r).toBeGreaterThan(0);
    }
  });

  it("pula ossos com junta faltando (sem crashar)", () => {
    // p1 não tem Elbow/Wrist/Hand -> esses ossos saem da lista, sem erro
    const semBraco = lay.figuras.p1.bones.length;
    expect(semBraco).toBeGreaterThan(0);
    expect(lay.strokeWidth).toBeGreaterThan(0);
  });
});
