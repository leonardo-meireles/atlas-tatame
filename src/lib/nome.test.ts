import { describe, it, expect } from "vitest";
import { limpaNome } from "./nome";

describe("limpaNome", () => {
  it("troca artefatos de escape (\\n) por espaço", () => {
    expect(limpaNome("capoeira\\npass")).toBe("capoeira pass");
  });

  it("colapsa espaços e apara as pontas", () => {
    expect(limpaNome("  meia   guarda  ")).toBe("meia guarda");
  });

  it("deixa nomes limpos intactos", () => {
    expect(limpaNome("Guarda Fechada")).toBe("Guarda Fechada");
  });
});
