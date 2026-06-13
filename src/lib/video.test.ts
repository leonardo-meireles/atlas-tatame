import { describe, it, expect } from "vitest";
import { youtubeThumb, youtubeEmbed, youtubeWatch, youtubeIdValido } from "./video";

const ID = "dQw4w9WgXcQ"; // 11 chars válidos

describe("youtube helpers", () => {
  it("thumb usa hqdefault do id", () => {
    expect(youtubeThumb(ID)).toBe(`https://i.ytimg.com/vi/${ID}/hqdefault.jpg`);
  });
  it("embed nocookie + autoplay quando pedido", () => {
    expect(youtubeEmbed(ID)).toBe(`https://www.youtube-nocookie.com/embed/${ID}`);
    expect(youtubeEmbed(ID, true)).toBe(
      `https://www.youtube-nocookie.com/embed/${ID}?autoplay=1`,
    );
  });
  it("watch link pro youtube", () => {
    expect(youtubeWatch(ID)).toBe(`https://www.youtube.com/watch?v=${ID}`);
  });

  it("valida o formato do id (11 chars [A-Za-z0-9_-])", () => {
    expect(youtubeIdValido(ID)).toBe(true);
    expect(youtubeIdValido("abc123")).toBe(false); // curto
    expect(youtubeIdValido("../../etc/passwd")).toBe(false); // path traversal
  });

  it("rejeita id malformado em vez de gerar src arbitrário", () => {
    expect(() => youtubeEmbed("'><script>")).toThrow(/inválido/);
    expect(() => youtubeThumb("abc")).toThrow(/inválido/);
  });
});
