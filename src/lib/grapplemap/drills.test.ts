import { describe, it, expect } from "vitest";
import { parseDrillScript, buildDrill, resolveDrillSlug } from "./drills";

describe("parseDrillScript", () => {
  it("split em linhas não-vazias, ignora comentários e espaços", () => {
    const out = parseDrillScript("distance closed guard\n  \n// note\nclamp guard\n");
    expect(out).toEqual(["distance closed guard", "clamp guard"]);
  });
});

describe("resolveDrillSlug", () => {
  it("nomes com conceito reconhecível colapsam pro hub", () => {
    expect(resolveDrillSlug("distance closed guard")).toBe("guarda-fechada");
    expect(resolveDrillSlug("low mount")).toBe("montada");
  });
});

describe("buildDrill", () => {
  it("monta drill com sequência de slugs", () => {
    const d = buildDrill(
      "full-guard-triangles",
      "distance closed guard\ntriangle threat\ndistance closed guard\n",
    );
    expect(d.slug).toBe("full-guard-triangles");
    expect(d.nome).toBe("Full Guard Triangles");
    expect(d.sequencia[0]).toBe("guarda-fechada");
    expect(d.sequencia).toHaveLength(3);
  });
});
