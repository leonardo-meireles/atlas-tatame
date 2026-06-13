import { describe, it, expect } from "vitest";
import { tipoMeta, TIPOS_ORDENADOS } from "./tipo";

describe("tipoMeta", () => {
  it("dá rótulo plural pt-BR e cor por tipo", () => {
    expect(tipoMeta("raspagem").rotuloPlural).toBe("Raspagens");
    expect(tipoMeta("finalizacao").rotuloPlural).toBe("Finalizações");
    expect(tipoMeta("raspagem").cor).toBe("var(--raspagem)");
  });

  it("ordena finalizações antes de raspagens antes de perda", () => {
    expect(TIPOS_ORDENADOS.indexOf("finalizacao")).toBeLessThan(
      TIPOS_ORDENADOS.indexOf("raspagem"),
    );
    expect(TIPOS_ORDENADOS.indexOf("raspagem")).toBeLessThan(
      TIPOS_ORDENADOS.indexOf("perda-de-guarda"),
    );
  });

  it("passagem é tipo de 1ª classe: rótulo, cor funcional e ordem", () => {
    const m = tipoMeta("passagem");
    expect(m.rotulo).toBe("Passagem");
    expect(m.rotuloPlural).toBe("Passagens");
    expect(m.cor).toBe("var(--passagem)");
    expect(m.corOnMat).toBe("var(--passagem-on-mat)");
    // passagem é o caminho do topo: vem depois das ofensivas do guardista, antes da perda.
    expect(TIPOS_ORDENADOS.indexOf("ataque")).toBeLessThan(TIPOS_ORDENADOS.indexOf("passagem"));
    expect(TIPOS_ORDENADOS.indexOf("passagem")).toBeLessThan(
      TIPOS_ORDENADOS.indexOf("perda-de-guarda"),
    );
  });
});
